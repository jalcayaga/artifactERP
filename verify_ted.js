
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Mock Data for TED
const dteData = {
    rutEmisor: '76000000-1',
    tipoDte: 33,
    folio: 1234,
    fechaEmision: '2026-02-15',
    rutReceptor: '66666666-6',
    razonSocialReceptor: 'Empresa de Prueba S.A.',
    montoTotal: 1190,
    item1Nombre: 'Producto de Prueba ABC',
    cafXmlFragment: '<AUTORIZACION><CAF version="1.0">...</CAF></AUTORIZACION>'
};

// Use the existing test-key.pem which is a valid RSA private key
const keyPath = path.join(__dirname, 'apps/backend/src/dte/utils/test-key.pem');
const privateKey = fs.readFileSync(keyPath, 'utf8');

function signTed(dteData, privateKey) {
    try {
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

        const sign = crypto.createSign('RSA-SHA1');
        sign.update(dd);
        const signature = sign.sign(privateKey, 'base64');

        return `<TED version="1.0">${dd}<FRMT algoritmo="SHA1withRSA">${signature}</FRMT></TED>`;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

const ted = signTed(dteData, privateKey);
console.log("Generated TED XML:");
console.log(ted);

if (ted.includes('<FRMT') && !ted.includes('Error')) {
    console.log("\n✅ SUCCESS: TED generated with valid-looking signature.");
} else {
    console.log("\n❌ FAILED: TED generation failed.");
    process.exit(1);
}
