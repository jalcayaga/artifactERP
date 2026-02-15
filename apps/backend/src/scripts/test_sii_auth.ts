
import { SiiService } from '../dte/sii/sii.service';
import * as path from 'path';

async function testAuth() {
    console.log("🔒 TEST: SII Authentication (Seed -> Token)");

    const service = new SiiService();
    const certPath = path.join(__dirname, '../dte/utils/test-cert.pem');
    const keyPath = path.join(__dirname, '../dte/utils/test-key.pem');

    try {
        const token = await service.getAuthToken(certPath, keyPath);
        console.log("✅ SUCCESS: SII Token obtained:", token);
    } catch (error) {
        console.error("❌ FAILURE:", error.message);
        console.log("\nNOTE: Failure is expected if using a Self-Signed Cert against SII.");
        console.log("However, if the error is 'Certificado Digital no valido', it means the connection and XML structure were correct!");
    }
}

testAuth();
