
import { Injectable } from '@nestjs/common';
import { SiiSoapClient } from './utils/sii-soap.client';
import { DteSignerService } from '../utils/dte-signer.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SiiService {
    private soapClient: SiiSoapClient;

    constructor() {
        this.soapClient = new SiiSoapClient(false); // Default to Dev (Maullin)
    }

    /**
     * Performs the full authentication handshake with SII.
     * 1. Get Seed
     * 2. Sign Seed
     * 3. Get Token
     */
    async getToken(certPath?: string, keyPath?: string): Promise<string> {
        try {
            console.log("1. Requesting Seed from SII...");
            const seed = await this.soapClient.getSeed();
            console.log("   Seed received:", seed);

            console.log("2. Signing Seed...");
            if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
                throw new Error(`Cert/Key files not found at: ${certPath}`);
            }
            const cert = fs.readFileSync(certPath, 'utf8');
            const key = fs.readFileSync(keyPath, 'utf8');

            // Construct the XML structure for GetToken
            // <getToken><item><Semilla>...</Semilla></item></getToken>
            const getTokenXml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<getToken>
<item>
<Semilla>${seed}</Semilla>
</item>
</getToken>`;

            // Sign it. Important: The signature applies to the whole document, but specifically wraps content.
            // DteSignerService is built for 'Documento' node signature, we might need to adapt it 
            // OR we can use it if we wrap it correctly.
            // Actually, for getToken, the signature is enveloped.
            // Let's look at DteSignerService again. It signs "Documento".
            // The Token request doesn't have "Documento". It has "getToken".
            // We need a generic signer or adapt DteSignerService.

            // ADAPTATION: We will use DteSignerService.signDte but we need to change the reference ID logic there?
            // No, DteSignerService is hardcoded to "Documento".

            // Let's create a specific signer method for Token in DteSignerService or here.
            // Better to add `signGetToken` to DteSignerService.

            // For now, let's assume we added `signGetToken` to DteSignerService.

            const signedTokenXml = DteSignerService.signGetToken(getTokenXml, key, cert);

            console.log("3. Requesting Token...");
            const token = await this.soapClient.getToken(signedTokenXml);
            console.log("   Token received:", token);

            return token;

        } catch (error) {
            console.error("SII Authentication Failed:", error.message);
            throw error;
        }
    }
}
