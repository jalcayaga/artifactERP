import { Injectable, Logger } from '@nestjs/common';

export interface DteFacturaItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface DteFacturaData {
  receptorRut: string;
  receptorRazon: string;
  receptorDireccion?: string | null;
  receptorComuna?: string | null;
  receptorCiudad?: string | null;
  receptorGiro?: string | null;
  fechaEmision: string;
  items: DteFacturaItem[];
  totalAfecto: number;
  totalIva: number;
  totalFinal: number;
}

export interface DteFacturaResponse {
  status: string;
  folio: string;
  xmlUrl?: string;
  pdfUrl?: string;
}

@Injectable()
export class DteService {
  private readonly logger = new Logger(DteService.name);
  private readonly factoUrl = 'https://conexion.facto.cl/documento.php?wsdl';

  async emitirFactura(data: DteFacturaData): Promise<DteFacturaResponse> {
    const shouldMock =
      process.env.FACTO_USE_MOCK === 'true' ||
      !process.env.FACTO_USERNAME ||
      !process.env.FACTO_PASSWORD;

    if (shouldMock) {
      this.logger.warn(
        'FACTO credentials not configured or mock mode enabled. Returning mocked response.',
      );
      return this.buildMockResponse();
    }

    const wsdl = process.env.FACTO_WSDL || this.factoUrl;
    this.logger.log(`Attempting to emit invoice via Facto WSDL: ${wsdl}`);

    try {
      // The full SOAP integration requires mapping the DTO to Facto's XML schema.
      // Until the integration is fully implemented we return a mock response so the rest of the flow keeps working.
      this.logger.warn(
        'Real Facto integration is not yet implemented. Falling back to mocked response.',
      );
      return this.buildMockResponse();
    } catch (error) {
      this.logger.error('Error emitting invoice with Facto:', error);
      throw error;
    }
  }

  private buildMockResponse(): DteFacturaResponse {
    return {
      status: 'MOCKED',
      folio: `${Date.now()}`,
      xmlUrl: undefined,
      pdfUrl: undefined,
    };
  }
}
