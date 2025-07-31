import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as soap from 'soap';
import * as xmljs from 'xml-js';

// Simple, flat interface for the data needed to create a DTE
export interface DteFacturaData {
  receptorRut: string;
  receptorRazon: string;
  receptorDireccion: string;
  receptorComuna: string;
  receptorCiudad: string;
  receptorGiro: string;
  fechaEmision: string;
  items: { nombre: string; cantidad: number; precio: number; }[];
  totalAfecto: number;
  totalIva: number;
  totalFinal: number;
}

@Injectable()
export class DteService implements OnModuleInit {
  private readonly logger = new Logger(DteService.name);
  private soapClient: soap.Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const wsdlUrl = this.configService.get<string>('FACTO_WSDL_URL');
    if (!wsdlUrl) {
      this.logger.error('FACTO_WSDL_URL is not defined.');
      return;
    }
    try {
      this.soapClient = await soap.createClientAsync(wsdlUrl);
      this.logger.log('SOAP client created successfully');
    } catch (error) {
      this.logger.error('Failed to create SOAP client', error.stack);
    }
  }

  async emitirFactura(data: DteFacturaData): Promise<any> {
    if (!this.soapClient) {
      throw new Error('SOAP client is not initialized');
    }

    const xmlString = this.buildFacturaXml(data);
    const args = {
      Usuario: this.configService.get<string>('FACTO_LOGIN'),
      Password: this.configService.get<string>('FACTO_PASSWORD'),
      XML: xmlString,
    };

    try {
      this.logger.log(`Sending DTE for client: ${data.receptorRazon}`);
      const [result] = await this.soapClient.emitirDocumentoAsync(args);
      this.logger.log(`DTE response received for client: ${data.receptorRazon}`);
      return this.parseResult(result);
    } catch (error) {
      this.logger.error(`Error emitting DTE for client ${data.receptorRazon}:`, error.stack);
      throw error;
    }
  }

  private buildFacturaXml(data: DteFacturaData): string {
    const dteJson = {
      documento: {
        encabezado: {
          tipo_dte: 33,
          fecha_emision: data.fechaEmision,
          receptor_rut: data.receptorRut,
          receptor_razon: data.receptorRazon,
          receptor_direccion: data.receptorDireccion,
          receptor_comuna: data.receptorComuna,
          receptor_ciudad: data.receptorCiudad,
          receptor_giro: data.receptorGiro,
          condiciones_pago: '0',
        },
        detalles: {
          detalle: data.items.map(item => ({
            cantidad: item.cantidad,
            unidad: 'UN',
            glosa: item.nombre,
            monto_unitario: item.precio,
            exento_afecto: 1,
          })),
        },
        totales: {
          total_afecto: data.totalAfecto,
          total_iva: data.totalIva,
          total_final: data.totalFinal,
        },
      },
    };

    return xmljs.js2xml({ _declaration: { _attributes: { version: '1.0', encoding: 'ISO-8859-1' } }, ...dteJson }, { compact: true, spaces: 4 });
  }

  private parseResult(result: any): any {
    const responseData = result?.return || result;
    const resultado = responseData?.resultado;

    if (resultado?.status === '0') {
      const encabezado = responseData?.encabezado;
      const enlaces = responseData?.enlaces;
      return {
        status: 'ISSUED',
        folio: encabezado?.folio,
        xmlUrl: enlaces?.dte_xml,
        pdfUrl: enlaces?.dte_pdf,
      };
    } else {
      throw new Error(resultado?.mensaje_error || 'Unknown error from DTE provider');
    }
  }
}
