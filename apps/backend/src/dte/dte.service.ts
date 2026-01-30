import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface DteFacturaItem {
  nombre: string
  cantidad: number
  precio: number
}

export interface DteFacturaData {
  receptorRut: string
  receptorRazon: string
  receptorDireccion?: string | null
  receptorComuna?: string | null
  receptorCiudad?: string | null
  receptorGiro?: string | null
  fechaEmision: string
  items: DteFacturaItem[]
  totalAfecto: number
  totalIva: number
  totalFinal: number
}

export interface DteFacturaResponse {
  status: string
  folio: string
  xmlUrl?: string
  pdfUrl?: string
}

@Injectable()
export class DteService {
  private readonly logger = new Logger(DteService.name)
  private readonly factoUrl = 'https://conexion.facto.cl/documento.php?wsdl'

  constructor(private prisma: PrismaService) { }

  async emitirFactura(tenantId: string, data: DteFacturaData): Promise<DteFacturaResponse> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    const settings = (tenant?.settings as any)?.facto || {}

    // Validation: Check if we have credentials
    if (!settings.username || !settings.password) {
      if (process.env.FACTO_USE_MOCK === 'true') {
        this.logger.warn(`FACTO credentials missing for tenant ${tenantId}, using MOCK.`)
        return this.buildMockResponse()
      }
      throw new Error(`Facto credentials not configured for tenant ${tenantId}`)
    }

    const wsdl = settings.wsdl || process.env.FACTO_WSDL || this.factoUrl
    const username = settings.username
    const password = settings.password
    const rutEmisor = settings.rutEmisor // We need this from settings

    this.logger.log(`Initializing Facto SOAP client for ${username} at ${wsdl}`)

    try {
      // 1. Create SOAP Client
      const client = await this.createSoapClient(wsdl)

      // 2. Prepare Payload (Standard Facto/DTE structure)
      // Note: This matches the standard "emitir_dtd" or "emitir" operation for Facto.
      // We wrap the data in a structure compatible with their WSDL.
      const payload = {
        encabezado: {
          tipo_dte: 33, // 33 = Factura Electrónica
          fecha_emision: data.fechaEmision,
          receptor_rut: data.receptorRut,
          receptor_razon: data.receptorRazon,
          receptor_direccion: data.receptorDireccion || '',
          receptor_comuna: data.receptorComuna || '',
          receptor_ciudad: data.receptorCiudad || '',
          receptor_giro: data.receptorGiro || '',
          monto_neto: data.totalAfecto,
          monto_iva: data.totalIva,
          monto_total: data.totalFinal,
          condiciones_pago: 'Contado', // Default
          rut_emisor: rutEmisor
        },
        detalles: {
          detalle: data.items.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            exento: false // Assuming VAT applicable
          }))
        },
        // Authentication for the specific request
        auth: {
          usuario: username,
          password: password
        }
      }

      // 3. Execute SOAP Call
      // 'emitir_documento' is a common operation name. Dynamic access to avoid TS errors on client.
      const response: any = await new Promise((resolve, reject) => {
        (client as any).emitir_documento(payload, (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        });
      })

      this.logger.log('Facto response:', response)

      // 4. Parse Response
      // Assuming response structure { return: { status: 'OK', folio: '123', links: { xml: '...', pdf: '...' } } }
      if (response && response.return && response.return.status === 'OK') {
        return {
          status: 'ACCEPTED',
          folio: response.return.folio,
          xmlUrl: response.return.links?.xml,
          pdfUrl: response.return.links?.pdf
        }
      }

      if (response?.return?.status === 'ERROR') {
        throw new Error(response.return.mensaje || 'Facto API returned error status')
      }

      // Fallback for unexpected success structure
      return {
        status: 'SENT',
        folio: response?.return?.folio || '0',
        pdfUrl: response?.return?.url_pdf,
        xmlUrl: response?.return?.url_xml
      }

    } catch (error) {
      this.logger.error('Error interacting with Facto SOAP API:', error)
      // Check for strictly development environments where we might want to still proceed
      if (process.env.NODE_ENV === 'development' || process.env.FACTO_USE_MOCK === 'true') {
        this.logger.warn('Falling back to MOCK due to proper API failure in DEV')
        return this.buildMockResponse()
      }
      throw error
    }
  }

  private async createSoapClient(wsdl: string): Promise<any> {
    // Dynamic import to avoid build issues if 'soap' isn't perfectly typed in environment
    // const soap = require('soap'); 
    // Better to use import * as soap from 'soap' at top, but for safety in this specific block:
    const soap = await import('soap');
    return soap.createClientAsync(wsdl);
  }

  private buildMockResponse(): DteFacturaResponse {
    return {
      status: 'MOCKED',
      folio: `${Math.floor(Math.random() * 10000)}`,
      xmlUrl: 'https://example.com/dte/mock.xml',
      pdfUrl: 'https://example.com/dte/mock.pdf',
    }
  }
}
