import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invoice, InvoiceItem, Company, Tenant } from '@prisma/client';
import { DteXmlBuilder } from './utils/dte-xml.builder';
import { DteSignerService } from './utils/dte-signer.service';
import { CafParser } from './utils/caf-parser';
import { DteEnvelopeBuilder } from './utils/dte-envelope.builder';
import { DteSubmissionClient } from './utils/dte-submission.client';
import { SiiService } from './sii/sii.service';
import * as fs from 'fs';
import * as path from 'path';

export interface DteFacturaData {
  receptorRut: string;
  receptorRazon: string;
  receptorDireccion: string;
  receptorComuna: string;
  receptorCiudad: string;
  receptorGiro: string;
  fechaEmision: string;
  items: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  totalAfecto: number;
  totalIva: number;
  totalFinal: number;
}

@Injectable()
export class DteService {
  constructor(
    private prisma: PrismaService,
    private siiService: SiiService,
  ) { }

  async generateDte(tenantId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        items: { include: { product: true } },
        company: true,
        tenant: true,
      }
    });

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    try {
      // 1. Determine DTE Type (default 33: Factura)
      const dteType = invoice.dteType || 33;

      // 2. Folio Assignment Logic
      let folioToUse = invoice.dteFolio;
      if (!folioToUse) {
        const caf = await this.prisma.dteCaf.findFirst({
          where: {
            tenantId,
            dteType,
            isActive: true,
          }
        });

        if (caf && caf.lastFolioUsed < caf.folioEnd) {
          folioToUse = caf.lastFolioUsed + 1;
          await this.prisma.dteCaf.update({
            where: { id: caf.id },
            data: { lastFolioUsed: folioToUse }
          });
        } else {
          // Fallback folio for dev/staging if no CAF loaded
          folioToUse = Math.floor(Math.random() * 10000) + 900000;
        }
      }

      // 3. Build XML using the assigned folio
      const dteData = {
        ...invoice,
        dteFolio: folioToUse,
        dteType
      };

      // 3.1 Generate TED (Electronic Stamp) if CAF is available
      let tedXml = '';
      const caf = await this.prisma.dteCaf.findFirst({
        where: { tenantId, dteType, isActive: true }
      });

      if (caf) {
        tedXml = DteSignerService.generateTed({
          rutEmisor: invoice.tenant.primaryDomain || '76000000-1',
          tipoDte: dteType,
          folio: folioToUse,
          fechaEmision: invoice.issueDate.toISOString().split('T')[0],
          rutReceptor: invoice.company.rut || '66666666-6',
          razonSocialReceptor: invoice.company.name,
          montoTotal: Math.round(Number(invoice.grandTotal)),
          item1Nombre: invoice.items[0]?.product.name || 'Varios',
          cafXmlFragment: caf.cafXml
        }, caf.privateKey);
      }

      let xml = DteXmlBuilder.buildInvoiceXml({ invoice: dteData as any }, tedXml);

      // 4. Sign XML if possible
      try {
        const certPath = path.join(__dirname, 'utils', 'test-cert.pem');
        const keyPath = path.join(__dirname, 'utils', 'test-key.pem');

        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
          const cert = fs.readFileSync(certPath, 'utf8');
          const key = fs.readFileSync(keyPath, 'utf8');
          xml = DteSignerService.signDte(xml, key, cert);
        }
      } catch (signError) {
        console.warn("[DteService] XML Signing failed (using unsigned XML):", signError.message);
      }

      // 5. Update Invoice with generated DTE
      return await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          dteStatus: 'GENERATED',
          dteFolio: folioToUse,
          dteType,
          xmlContent: xml,
          dteTrackId: `ARTIFACT-${Date.now()}`,
          dtePdfUrl: `/api/dte/pdf/${invoiceId}`,
        }
      });

    } catch (error) {
      console.error("DTE Service Error:", error);
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          dteStatus: 'ERROR',
          notes: invoice.notes ? `${invoice.notes}\n[DTE Error]: ${error.message}` : `[DTE Error]: ${error.message}`
        }
      });
      throw error;
    }
  }

  async emitirFactura(tenantId: string, data: DteFacturaData) {
    // For direct emission without prior Invoice (e.g. fast POS)
    // We should ideally create a dummy invoice or use a dedicated method
    console.log("[DteService] emitirFactura called with", data);
    return {
      status: 'ACCEPTED',
      folio: "MOCK-" + Math.floor(Math.random() * 1000),
      xmlUrl: "",
      pdfUrl: "",
    };
  }

  async registerCaf(tenantId: string, companyId: string, cafXml: string) {
    const parsed = CafParser.parse(cafXml);

    // Deactivate previous CAFs of the same type to avoid confusion
    await this.prisma.dteCaf.updateMany({
      where: { tenantId, companyId, dteType: parsed.dteType, isActive: true },
      data: { isActive: false }
    });

    return await this.prisma.dteCaf.create({
      data: {
        tenantId,
        companyId,
        dteType: parsed.dteType,
        folioStart: parsed.folioStart,
        folioEnd: parsed.folioEnd,
        lastFolioUsed: parsed.folioStart - 1,
        cafXml: cafXml,
        privateKey: parsed.privateKey,
        publicKey: parsed.publicKey,
        isActive: true,
      }
    });
  }

  /**
   * Complex flow: obtain token, wrap DTE, sign envelope, and submit.
   */
  async submitInvoiceToSii(tenantId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: { tenant: true }
    });

    if (!invoice || !invoice.xmlContent) {
      throw new Error(`Invoice ${invoiceId} not found or XML not generated.`);
    }

    // 1. Get Authentication Token
    // NOTE: This requires the digital certificate to be configured.
    // We expect the user to provide the .pfx tomorrow.
    try {
      const token = await this.siiService.getToken();

      // 2. Build Envelope
      const envelopeXml = DteEnvelopeBuilder.build({
        rutEmisor: invoice.tenant.primaryDomain || '76000000-1',
        rutEnvia: '12345678-5', // Will come from Certificate holder
        rutReceptor: '66666666-6',
        fchResol: '2024-01-01',
        nroResol: 0,
      }, [invoice.xmlContent]);

      // 3. Sign Envelope
      // PLACEHOLDER: certificate and key extraction logic
      const signedEnvelope = envelopeXml; // TODO: Sign with real PFX tomorrow

      // 4. Submit
      const responseXml = await DteSubmissionClient.submit(signedEnvelope, token, `invoice_${invoice.dteFolio}.xml`);

      // 5. Extract TrackID (Simple regex for now)
      const trackIdMatch = responseXml.match(/<TRACKID>(.*)<\/TRACKID>/);
      const trackId = trackIdMatch ? trackIdMatch[1] : null;

      if (!trackId) {
        throw new Error(`SII did not return a TrackID. Response: ${responseXml}`);
      }

      // 6. Update Invoice
      return await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          dteTrackId: trackId,
          dteStatus: 'SENT',
        }
      });

    } catch (error) {
      console.error("[DteService] Submission failed:", error);
      throw error;
    }
  }
}
