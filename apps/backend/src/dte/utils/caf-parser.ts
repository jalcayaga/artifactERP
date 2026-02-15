
import { DOMParser } from 'xmldom';

export interface ParsedCaf {
    rutEmisor: string;
    dteType: number;
    folioStart: number;
    folioEnd: number;
    fechaAutorizacion: string;
    publicKey: string;
    privateKey: string;
}

export class CafParser {
    /**
     * Parses the SII CAF XML and extracts critical information.
     * @param cafXml The full XML content of the CAF file.
     */
    static parse(cafXml: string): ParsedCaf {
        const doc = new DOMParser().parseFromString(cafXml, 'text/xml');

        // 1. Extract DD (Datos DTE) - Range and Auth Info
        const re = doc.getElementsByTagName('RE')[0]?.textContent;
        const td = doc.getElementsByTagName('TD')[0]?.textContent;
        const d = doc.getElementsByTagName('D')[0]?.textContent; // Folio start
        const h = doc.getElementsByTagName('H')[0]?.textContent; // Folio end
        const fa = doc.getElementsByTagName('FA')[0]?.textContent; // Fecha Autorizacion

        if (!re || !td || !d || !h) {
            throw new Error("Invalid CAF XML: Missing essential DD fields (RE, TD, D, H)");
        }

        // 2. Extract RSA Keys (RSAPK and RSASK)
        // NOTE: The RSASK (Private Key) is what we use to sign the TED.
        // The RSAPK is usually ignored by us but required for verification.
        const rsapkNode = doc.getElementsByTagName('RSAPK')[0];
        const rsaskNode = doc.getElementsByTagName('RSASK')[0];

        if (!rsaskNode) {
            throw new Error("Invalid CAF XML: Missing private key (RSASK)");
        }

        // Format the keys a bit if needed, or keep them as found.
        // Usually they are in a structure like <M>...</M><E>...</E>
        // For RSA operations in Node.js, we might need to convert these to PEM 
        // OR extract the modules/exponents.
        // For now, let's extract the full XML fragments.

        return {
            rutEmisor: re,
            dteType: parseInt(td),
            folioStart: parseInt(d),
            folioEnd: parseInt(h),
            fechaAutorizacion: fa || '',
            publicKey: rsapkNode ? rsapkNode.toString() : '',
            privateKey: rsaskNode.toString(),
        };
    }
}
