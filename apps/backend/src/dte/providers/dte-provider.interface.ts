import { Invoice } from '@prisma/client';

export interface DteResult {
    success: boolean;
    folio?: number;
    trackId?: string;
    pdfUrl?: string; // URL or Base64
    xmlContent?: string;
    error?: string;
}

export interface DteProvider {
    generateDte(invoice: Invoice): Promise<DteResult>;
    checkStatus(trackId: string): Promise<string>;
}
