import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class DtePdfService {
    async generatePdf(invoiceData: any): Promise<Readable> {
        const doc = new PDFDocument({ margin: 50 });
        const stream = new Readable({
            read() {
                // Validation/Setup logic here
            },
        });

        // Pipe the PDF document to the readable stream 
        // (Note: pdfkit pipes TO a writable stream. We need to buffer or use a PassThrough)
        // For simplicity in NestJS streaming, we can return the pdfkit object itself if handled correctly, 
        // or push chunks to a PassThrough stream.
        // However, clean implementation:

        // We will use a buffer-based approach for simplicity in this first iteration or a PassThrough
        return new Promise((resolve) => {
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                const readable = new Readable();
                readable.push(pdfData);
                readable.push(null);
                resolve(readable);
            });

            this.buildPdfContent(doc, invoiceData);
            doc.end();
        });
    }

    private buildPdfContent(doc: PDFKit.PDFDocument, data: any) {
        // 1. Header (Logo + Company Info)
        doc.fontSize(18).text(data.company.name, { align: 'left' });
        doc.fontSize(10).text(data.company.rut, { align: 'left' });
        doc.moveDown();

        // 2. DTE Box (RUT, Folio, Tipo) - The famous Red Box
        const boxTop = 50;
        const boxRight = 550;
        const boxWidth = 200;
        const boxHeight = 100;

        const isCertification = data.isCertification || data.number?.includes('CERT');

        doc.rect(boxRight - boxWidth, boxTop, boxWidth, boxHeight).lineWidth(2).stroke('red');
        doc.fillColor('red').fontSize(12).font('Helvetica-Bold')
            .text(`R.U.T.: ${data.company?.rut || '76.000.000-1'}`, boxRight - boxWidth, boxTop + 15, { width: boxWidth, align: 'center' });

        const typeName = this.getDteTypeName(data.dteType);
        doc.fontSize(10).text(typeName.toUpperCase(), boxRight - boxWidth, boxTop + 40, { width: boxWidth, align: 'center' });
        doc.fontSize(14).text(`Nº ${data.dteFolio || '0000'}`, boxRight - boxWidth, boxTop + 65, { width: boxWidth, align: 'center' });

        doc.fillColor('black').font('Helvetica'); // Reset

        // 2.5 Watermark if Certification
        if (isCertification) {
            doc.save();
            doc.fillColor('grey', 0.2);
            doc.fontSize(60).rotate(-45, { origin: [300, 400] });
            doc.text('CERTIFICACION SII', 100, 400);
            doc.restore();
        }

        // 3. Client Info
        doc.moveDown(4);
        doc.fontSize(10).font('Helvetica-Bold').text('RECEPTOR:');
        doc.font('Helvetica').text(`RUT: ${data.company?.rut || 'N/A'}`);
        doc.text(`Razón Social: ${data.company?.name || 'Cliente de Prueba'}`);
        doc.text(`Dirección: ${data.company?.address || 'Santiago, Chile'}`);
        doc.text(`Giro: ${data.company?.giro || 'Giro Comercial'}`);
        doc.moveDown();

        // 4. Details Table
        const tableTop = 250;
        let y = tableTop;

        doc.font('Helvetica-Bold');
        doc.text('Descripción', 50, y);
        doc.text('Cant', 300, y, { width: 50, align: 'right' });
        doc.text('Precio', 360, y, { width: 80, align: 'right' });
        doc.text('Total', 450, y, { width: 100, align: 'right' });
        y += 20;
        doc.moveTo(50, y).lineTo(550, y).lineWidth(1).stroke();
        y += 10;

        doc.font('Helvetica');
        if (data.items) {
            data.items.forEach((item: any) => {
                const desc = item.product?.name || item.description || 'Varios';
                doc.text(desc, 50, y, { width: 240 });
                doc.text(item.quantity?.toString() || '1', 300, y, { width: 50, align: 'right' });
                doc.text(item.unitPrice?.toLocaleString('es-CL') || '0', 360, y, { width: 80, align: 'right' });
                doc.text(item.totalPrice?.toLocaleString('es-CL') || '0', 450, y, { width: 100, align: 'right' });
                y += 20;
            });
        }

        // 5. Totals
        y = Math.max(y, 500);
        const totalX = 350;
        const totalW = 200;

        doc.text(`Subtotal:`, totalX, y);
        doc.text(`$${data.subTotalAmount?.toLocaleString('es-CL') || 0}`, totalX, y, { width: totalW, align: 'right' });

        if (data.discountAmount > 0) {
            y += 15;
            doc.text(`Descuento:`, totalX, y);
            doc.text(`-$${data.discountAmount?.toLocaleString('es-CL')}`, totalX, y, { width: totalW, align: 'right' });
        }

        y += 15;
        doc.text(`IVA (19%):`, totalX, y);
        doc.text(`$${data.vatAmount?.toLocaleString('es-CL') || 0}`, totalX, y, { width: totalW, align: 'right' });

        y += 20;
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text(`TOTAL:`, totalX, y);
        doc.text(`$${data.grandTotal?.toLocaleString('es-CL') || 0}`, totalX, y, { width: totalW, align: 'right' });

        // 6. Timbre (Better Placeholder)
        doc.rect(50, 650, 250, 100).lineWidth(1).stroke();
        doc.fontSize(8).font('Helvetica')
            .text('Timbre Electrónico SII', 55, 655)
            .text('Res. 80 de 2014-08-22', 55, 665)
            .text('Verifique documento en www.sii.cl', 55, 735, { align: 'center' });

        // Simulating the Stamp with some lines to represent PDF417
        for (let i = 0; i < 15; i++) {
            doc.moveTo(70, 680 + (i * 3)).lineTo(280, 680 + (i * 3)).dash(2, { space: 2 }).lineWidth(0.5).stroke();
        }
    }

    private getDteTypeName(type: number): string {
        const types: Record<number, string> = {
            33: 'Factura Electrónica',
            34: 'Factura Exenta Electrónica',
            39: 'Boleta Electrónica',
            41: 'Boleta Exenta Electrónica',
            56: 'Nota de Débito Electrónica',
            61: 'Nota de Crédito Electrónica'
        };
        return types[type] || 'Documento Electrónico';
    }
}
