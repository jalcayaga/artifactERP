
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const pfxFile = process.argv[2];
const password = process.argv[3];

if (!pfxFile || !password) {
    console.error("Usage: npx ts-node src/scripts/import_pfx.ts <path-to-pfx> <password>");
    process.exit(1);
}

const certsDir = path.join(__dirname, '../../certs');
const baseName = path.basename(pfxFile, path.extname(pfxFile));
const outputCert = path.join(certsDir, `${baseName}.crt.pem`);
const outputKey = path.join(certsDir, `${baseName}.key.pem`);

// Ensure certs dir exists
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

console.log(`Processing ${pfxFile}...`);

// 1. Extract Certificate
const cmdCert = `openssl pkcs12 -in "${pfxFile}" -legacy -clcerts -nokeys -out "${outputCert}" -passin pass:"${password}"`;

// 2. Extract Private Key (Unencrypted for Node usage)
const cmdKey = `openssl pkcs12 -in "${pfxFile}" -legacy -nocerts -nodes -out "${outputKey}" -passin pass:"${password}"`;

exec(cmdCert, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error extracting certificate: ${error.message}`);
        console.error(stderr);
        return;
    }
    console.log(`✅ Certificate saved to: ${outputCert}`);

    exec(cmdKey, (errorKey, stdoutKey, stderrKey) => {
        if (errorKey) {
            console.error(`Error extracting key: ${errorKey.message}`);
            console.error(stderrKey);
            return;
        }
        console.log(`✅ Private Key saved to: ${outputKey}`);
        console.log("\nReady! You can now use these paths in SiiService or DteSignerService.");
    });
});
