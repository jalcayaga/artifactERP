
import axios from 'axios';
import { DOMParser } from 'xmldom';

export class SiiStatusService {
    private static readonly STATUS_URL_TEST = 'https://beta.sii.cl/cgi_rtc/RTC/RTETraerEstado.cgi';
    private static readonly STATUS_URL_PROD = 'https://maullin.sii.cl/cgi_rtc/RTC/RTETraerEstado.cgi';

    /**
     * Checks the status of a DTE submission.
     * @param rutEmisor Company RUT.
     * @param dvEmisor Company RUT DV.
     * @param trackId The ID returned by SII during submission.
     * @param token Session token.
     * @param isProd Environment.
     */
    static async getStatus(
        rutEmisor: string,
        dvEmisor: string,
        trackId: string,
        token: string,
        isProd: boolean = false
    ): Promise<any> {
        const url = isProd ? this.STATUS_URL_PROD : this.STATUS_URL_TEST;

        const response = await axios.get(url, {
            params: {
                rut: rutEmisor,
                dv: dvEmisor,
                trackid: trackId,
            },
            headers: {
                'Cookie': `TOKEN=${token}`,
                'User-Agent': 'Mozilla/4.0 (compatible; PROG 1.0; Windows NT)',
            },
        });

        // The response is an XML
        // <ESTADO_ENVIO><CODIGO>0</CODIGO><ESTADO>EPR</ESTADO><GLOSA>Envio Procesado</GLOSA>...</ESTADO_ENVIO>
        const xml = response.data;
        const doc = new DOMParser().parseFromString(xml, 'text/xml');

        const codigo = doc.getElementsByTagName('CODIGO')[0]?.textContent;
        const estado = doc.getElementsByTagName('ESTADO')[0]?.textContent;
        const glosa = doc.getElementsByTagName('GLOSA')[0]?.textContent;

        return {
            codigo,
            estado,
            glosa,
        };
    }
}
