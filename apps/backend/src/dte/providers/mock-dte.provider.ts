import { Injectable } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { DteProvider, DteResult } from './dte-provider.interface';

@Injectable()
export class MockDteProvider implements DteProvider {
    async generateDte(invoice: Invoice): Promise<DteResult> {
        console.log(`[MockDteProvider] Generating DTE for invoice ${invoice.id}...`);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a random folio
        const fakeFolio = Math.floor(Math.random() * 100000) + 1;
        const fakeTrackId = `MOCK-TRACK-${Date.now()}`;

        return {
            success: true,
            folio: fakeFolio,
            trackId: fakeTrackId,
            pdfUrl: `https://api.artifact.cl/invoices/${invoice.id}/pdf`,
            xmlContent: `<DTE version="1.0"><Document><Encabezado><IdDoc><Folio>${fakeFolio}</Folio></IdDoc></Encabezado></Document></DTE>`
        };
    }

    async checkStatus(trackId: string): Promise<string> {
        return 'ACCEPTED';
    }
}
