import { SignedXml } from 'xml-crypto';
import { DOMParser, XMLSerializer } from 'xmldom';
import * as fs from 'fs';

export class DteSignerService {
    /**
     * Signs a DTE XML string using a private key and certificate.
     * @param xmlString The raw XML string to sign.
     * @param privateKey The private key in PEM format.
     * @param certificate The public certificate in PEM format.
     * @returns The signed XML string.
     */
    static signDte(xmlString: string, privateKey: string, certificate: string): string {
        // SII uses a specific signature structure:
        // The signature should be applied to the 'Documento' node.

        // xml-crypto v6+ usage: pass options to constructor
        const sig = new SignedXml({
            privateKey: privateKey,
            getKeyInfoContent: (args) => {
                return `<X509Data><X509Certificate>${this.cleanCertificate(certificate)}</X509Certificate></X509Data>`;
            },
            canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
            signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
        });

        // Standard algorithms for SII (Chile)
        sig.addReference({
            xpath: "//*[local-name(.)='Documento']",
            transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
            digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1"
        });

        sig.computeSignature(xmlString, {
            prefix: '',
            location: { reference: "//*[local-name(.)='Documento']", action: 'after' }
        });

        return sig.getSignedXml();
    }

    /**
     * Removes PEM headers and newlines from a certificate.
     */
    private static cleanCertificate(cert: string): string {
        return cert
            .replace(/-----BEGIN CERTIFICATE-----/g, '')
            .replace(/-----END CERTIFICATE-----/g, '')
            .replace(/\r?\n|\r/g, '');
    }

    /**
     * Generates the TED (Timbre Electrónico DTE) fragment.
     * This follows the SII standard for RSA signing of the DD (Datos DTE) block.
     * @param dteData The object containing required fields (RE, TD, F, FE, RR, RSR, MNT, etc)
     * @param privateKey The company's private key from the CAF.
     */
    static generateTed(dteData: any, privateKey: string): string {
        try {
            const crypto = require('crypto');

            // 1. Construct the DD (Datos DTE) block
            // Order is mandatory per SII documentation
            const dd = `<DD>` +
                `<RE>${dteData.rutEmisor}</RE>` +
                `<TD>${dteData.tipoDte}</TD>` +
                `<F>${dteData.folio}</F>` +
                `<FE>${dteData.fechaEmision}</FE>` +
                `<RR>${dteData.rutReceptor}</RR>` +
                `<RSR>${dteData.razonSocialReceptor.substring(0, 40)}</RSR>` +
                `<MNT>${dteData.montoTotal}</MNT>` +
                `<IT1>${dteData.item1Nombre.substring(0, 40)}</IT1>` +
                `<CAF version="1.0">${dteData.cafXmlFragment}</CAF>` +
                `<TSTP>${new Date().toISOString().replace(/\.[0-9]{3}Z$/, 'Z')}</TSTP>` +
                `</DD>`;

            // 2. Sign the DD block using SHA1withRSA
            const sign = crypto.createSign('RSA-SHA1');
            sign.update(dd);
            const signature = sign.sign(privateKey, 'base64');

            // 3. Return the full TED node
            return `<TED version="1.0">` +
                `${dd}` +
                `<FRMT algoritmo="SHA1withRSA">${signature}</FRMT>` +
                `</TED>`;

        } catch (error) {
            console.error("[DteSignerService] TED Generation failed:", error.message);
            return `<TED version="1.0"><!-- Error: ${error.message} --></TED>`;
        }
    }

    /**
     * Signs the getToken XML for SII Authentication.
     */
    static signGetToken(xmlString: string, privateKey: string, certificate: string): string {
        const sig = new SignedXml({
            privateKey: privateKey,
            getKeyInfoContent: (args) => {
                return `<X509Data><X509Certificate>${this.cleanCertificate(certificate)}</X509Certificate></X509Data>`;
            },
            canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
            signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
        });

        sig.addReference({
            xpath: "//*[local-name(.)='getToken']",
            transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
            digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1"
        });

        sig.computeSignature(xmlString, {
            prefix: '',
            location: { reference: "//*[local-name(.)='getToken']", action: 'after' }
        });

        return sig.getSignedXml();
    }

    /**
     * Signs the full EnvioDTE (Envelope) XML.
     * The signature is usually applied to the SetDTE node.
     */
    static signEnvelope(xml: string, privateKey: string, certificate: string): string {
        const sig = new SignedXml({
            privateKey: privateKey,
            getKeyInfoContent: (args) => {
                return `<X509Data><X509Certificate>${this.cleanCertificate(certificate)}</X509Certificate></X509Data>`;
            },
            signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
        });

        sig.addReference({
            xpath: "//*[local-name(.)='SetDTE']",
            transforms: ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'],
            digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
        });

        sig.computeSignature(xml, {
            prefix: '',
            location: {
                reference: "//*[local-name(.)='Caratula']",
                action: 'after',
            },
        });

        return sig.getSignedXml();
    }

    /**
     * Utility to extract key and certificate from a PFX/P12 file.
     * Compatible with Node.js 15+ using the native crypto module.
     */
    static extractPfx(pfxBuffer: Buffer, password: string) {
        const crypto = require('crypto');
        const p12 = crypto.pkcs12.extract(pfxBuffer, password);

        return {
            privateKey: p12.key,
            certificate: p12.cert,
        };
    }
}
