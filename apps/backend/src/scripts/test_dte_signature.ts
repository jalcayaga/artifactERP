
import { DteSignerService } from '../dte/utils/dte-signer.service';
import * as fs from 'fs';
import * as path from 'path';
import { SignedXml } from 'xml-crypto';
import { DOMParser } from 'xmldom';

async function testSignature() {
    console.log("🧪 Testing DTE Signature...");

    const keyPath = path.join(__dirname, '../dte/utils/test-key.pem');
    const certPath = path.join(__dirname, '../dte/utils/test-cert.pem');

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.error("❌ Certificates not found. Run 'openssl' command first.");
        return;
    }

    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');

    // Mock XML (Simplified DTE)
    const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<DTE version="1.0">
  <Documento ID="F1234">
    <Encabezado>
      <IdDoc>
        <TipoDTE>33</TipoDTE>
        <Folio>1234</Folio>
      </IdDoc>
      <Emisor>
        <RUTEmisor>76123456-7</RUTEmisor>
      </Emisor>
      <Receptor>
        <RUTRecep>99888777-6</RUTRecep>
      </Receptor>
      <Totales>
        <MntTotal>11900</MntTotal>
      </Totales>
    </Encabezado>
  </Documento>
</DTE>`;

    console.log("📝 Signing XML...");
    try {
        const signedXml = DteSignerService.signDte(xml, privateKey, certificate);
        console.log("✅ XML Signed Successfully!");
        // console.log(signedXml);

        // Verification
        console.log("🔍 Verifying Signature...");

        // Helper to get Cert from KeyInfo
        function getCertFromKeyInfo(keyInfo: Node): string | null {
            // Simple extraction for test
            const certNode = (keyInfo as any).getElementsByTagName("X509Certificate")[0];
            if (certNode && certNode.firstChild) {
                const cert = certNode.firstChild.nodeValue;
                // Add headers for PEM if missing (xml-crypto might need it or not depending on version)
                // usually it wants the base64 string or PEM. 
                // Let's return strict PEM construction
                return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;
            }
            return null;
        }

        const verifySig = new SignedXml({
            getCertFromKeyInfo: getCertFromKeyInfo,
            publicCert: certificate // Fallback
        });

        const doc = new DOMParser().parseFromString(signedXml);
        // We need to find the signature node
        // In xml-crypto v6, we might need to load manually?
        // signed-xml.d.ts says: sig.loadSignature(signatureNode)

        const signatureNode = verifySig.findSignatures(doc)[0];
        if (signatureNode) {
            verifySig.loadSignature(signatureNode);
            const valid = verifySig.checkSignature(signedXml);
            if (valid) {
                console.log("✅ Signature is VALID.");
            } else {
                console.error("❌ Signature is INVALID.");
                // create debug output
                console.log("Errors:", (verifySig as any).validationErrors);
            }
        } else {
            console.error("❌ No Signature node found in signed XML.");
        }

    } catch (error) {
        console.error("❌ Error signing XML:", error);
    }
}

testSignature();
