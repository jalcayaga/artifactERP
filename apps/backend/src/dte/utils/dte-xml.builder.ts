import { Invoice, InvoiceItem, Product, Company, Tenant } from '@prisma/client';
import * as xml2js from 'xml2js';

export interface DteInput {
    invoice: Invoice & {
        items: (InvoiceItem & { product: Product })[];
        company: Company;
        tenant: Tenant;
    };
}

export class DteXmlBuilder {
    static buildInvoiceXml(data: DteInput, tedXml?: string): string {
        const { invoice } = data;

        // Mapping internal data to SII XML structure
        const dteObj: any = {
            DTE: {
                $: { version: '1.0' },
                Documento: {
                    $: { ID: `F${invoice.dteFolio}` },
                    Encabezado: {
                        IdDoc: {
                            TipoDTE: invoice.dteType || 33, // 33 for Factura
                            Folio: invoice.dteFolio,
                            FchEmis: invoice.issueDate.toISOString().split('T')[0],
                        },
                        Emisor: {
                            RUTEmisor: invoice.tenant.primaryDomain || '76000000-1', // Fallback RUT for testing
                            RznSoc: invoice.tenant.name,
                            GiroEmis: 'Giro de Prueba',
                            Acteco: '123456',
                            DirOrigin: 'Direccion Prueba',
                            CmnaOrigen: 'Santiago',
                        },
                        Receptor: {
                            RUTRecep: invoice.company.rut || '66666666-6',
                            RznSocRecep: invoice.company.name,
                            GiroRecep: invoice.company.giro || 'Giro Receptor',
                            DirRecep: invoice.company.address || 'Direccion Receptor',
                            CmnaRecep: invoice.company.city || 'Santiago',
                        },
                        Totales: {
                            MntNeto: Math.round(Number(invoice.subTotalAmount)),
                            TasaIVA: 19,
                            IVA: Math.round(Number(invoice.vatAmount)),
                            MntTotal: Math.round(Number(invoice.grandTotal)),
                        }
                    },
                    Detalle: invoice.items.map((item, index) => ({
                        NroLinDet: index + 1,
                        NmbItem: item.product.name,
                        QtyItem: item.quantity,
                        PrcItem: Math.round(Number(item.unitPrice)),
                        MntItem: Math.round(Number(item.totalPrice)),
                    }))
                }
            }
        };

        const builder = new xml2js.Builder({
            headless: true,
            renderOpts: { pretty: true, indent: '  ', newline: '\n' }
        });

        let xml = builder.buildObject(dteObj);

        // Inject TED if provided
        if (tedXml) {
            // Finding the position to inject TED (before the close of Documento)
            // This is a simplified approach, a more robust XML manipulation would be better
            const closingDocumento = '</Documento>';
            xml = xml.replace(closingDocumento, `${tedXml}\n    ${closingDocumento}`);
        }

        return `<?xml version="1.0" encoding="ISO-8859-1"?>\n${xml}`;
    }
}
