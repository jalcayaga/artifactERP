import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DteProvider } from './providers/dte-provider.interface';
import { MockDteProvider } from './providers/mock-dte.provider';
import { Invoice, InvoiceItem, Company, Tenant } from '@prisma/client';

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
  private provider: DteProvider;

  constructor(private prisma: PrismaService) {
    // hardcoded for now, could be dynamic based on env
    this.provider = new MockDteProvider();
  }

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
      const result = await this.provider.generateDte(invoice);

      if (result.success) {
        // Update Invoice with DTE data
        // We assume Type 33 (Factura) for simplicity if not set
        const dteType = invoice.dteType || 33;

        return await this.prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            dteStatus: 'GENERATED',
            dteFolio: result.folio,
            dteTrackId: result.trackId,
            dtePdfUrl: result.pdfUrl,
            xmlContent: result.xmlContent,
            dteType: dteType,
          }
        });
      } else {
        await this.prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            dteStatus: 'ERROR',
            notes: invoice.notes ? `${invoice.notes}\n[DTE Error]: ${result.error}` : `[DTE Error]: ${result.error}`
          }
        });
        throw new Error(`DTE Generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error("DTE Service Error:", error);
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          dteStatus: 'ERROR',
          notes: invoice.notes ? `${invoice.notes}\n[System Error]: ${error.message}` : `[System Error]: ${error.message}`
        }
      });
      throw error;
    }
  }

  async emitirFactura(tenantId: string, data: DteFacturaData) {
    // This is a bridge method for InvoicesService
    // For now we use the mock provider logic directly or wrap it
    const result = await this.provider.generateDte({
      ...data,
      // Mapping for the mock provider which expects an Invoice-like object or specific fields
    } as any);

    if (!result.success) {
      throw new Error(`DTE Emission failed: ${result.error}`);
    }

    return {
      status: 'ACCEPTED',
      folio: result.folio.toString(),
      xmlUrl: result.xmlContent, // Mocking URL with content for now
      pdfUrl: result.pdfUrl,
    };
  }
}
