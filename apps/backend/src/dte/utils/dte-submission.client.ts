
import axios from 'axios';
const FormData = require('form-data');
import { DteSignerService } from './dte-signer.service';

export class DteSubmissionClient {
    private static readonly SII_UPLOAD_URL_TEST = 'https://beta.sii.cl/cgi_rtc/RTC/RTESubirDoc.cgi';
    private static readonly SII_UPLOAD_URL_PROD = 'https://maullin.sii.cl/cgi_rtc/RTC/RTESubirDoc.cgi';

    /**
     * Submits a signed EnvioDTE to the SII.
     * @param signedEnvelope The full EnvioDTE XML, already signed.
     * @param token The session token obtained from SII.
     * @param filename The name for the XML file.
     * @param isProd Whether to use production or test environment.
     */
    static async submit(
        signedEnvelope: string,
        token: string,
        filename: string = 'envio.xml',
        isProd: boolean = false
    ): Promise<string> {
        const url = isProd ? this.SII_UPLOAD_URL_PROD : this.SII_UPLOAD_URL_TEST;

        // The SII submission requires a very specific multipart format
        const form = new FormData();
        form.append('rutSender', '76000000'); // Example RUT
        form.append('dvSender', '1');
        form.append('rutCompany', '76000000');
        form.append('dvCompany', '1');
        form.append('archivo', Buffer.from(signedEnvelope, 'latin1'), {
            filename,
            contentType: 'text/xml',
        });

        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                'Cookie': `TOKEN=${token}`,
                'User-Agent': 'Mozilla/4.0 (compatible; PROG 1.0; Windows NT)',
            },
        });

        // The response is usually an XML with the TrackID
        // <STATUS>0</STATUS><TRACKID>123456789</TRACKID>
        const data = response.data;
        console.log("[DteSubmissionClient] SII Response:", data);

        return data;
    }
}
