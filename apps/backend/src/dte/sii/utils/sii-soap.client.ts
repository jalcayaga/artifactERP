
import axios, { AxiosInstance } from 'axios';
import { DOMParser } from 'xmldom';
import * as https from 'https';

export class SiiSoapClient {
    private axiosInstance: AxiosInstance;
    private maullinUrl = 'https://maullin.sii.cl/DTEWS/GetTokenFromSeed.jws'; // Test environment
    private palenaUrl = 'https://palena.sii.cl/DTEWS/GetTokenFromSeed.jws';   // Prod environment (not used for now)
    private maullinSeedUrl = 'https://maullin.sii.cl/DTEWS/CrSeed.jws';

    constructor(private isProduction: boolean = false) {
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/xml',
                'User-Agent': 'Mozilla/4.0 (compatible; PROG 1.0; Windows NT)', // SII sometimes blocks unknown agents
                'SOAPAction': '', // Required by some SII endpoints even if empty
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Often needed for Maullin/Palena if their cert chain is incomplete or for debugging
            }),
            timeout: 10000,
        });
    }

    /**
     * Fetches the random Seed from SII.
     * SOAP Action: getSeed
     */
    async getSeed(): Promise<string> {
        const envelope = `
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
   <soapenv:Header/>
   <soapenv:Body>
      <def:getSeed soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
   </soapenv:Body>
</soapenv:Envelope>`;

        try {
            const response = await this.axiosInstance.post(
                this.isProduction ? 'https://palena.sii.cl/DTEWS/CrSeed.jws' : this.maullinSeedUrl,
                envelope
            );

            const xml = response.data;
            // Parse XML to find <getSeedReturn>
            // Typical response: ... &lt;SEMILLA&gt;000000001234&lt;/SEMILLA&gt; ... inside getSeedReturn
            // Or sometimes just the simplified XML. We need to be robust.

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const returnNode = doc.getElementsByTagName('getSeedReturn')[0];

            if (!returnNode || !returnNode.firstChild) {
                throw new Error('Could not parse getSeedReturn from SII response');
            }

            // The content of getSeedReturn is often an XML string itself
            const innerXml = returnNode.firstChild.nodeValue;

            // We look for <SEMILLA>...</SEMILLA> regex style to be safe against XML namespaces
            const match = innerXml.match(/<SEMILLA>(.*?)<\/SEMILLA>/);
            if (match && match[1]) {
                return match[1];
            }

            throw new Error('SEMILLA tag not found in SII response');

        } catch (error) {
            console.error('[SiiSoapClient] Error getting Seed:', error.message);
            throw error;
        }
    }

    /**
     * Exchanges a Signed Token for a valid Session Token.
     * SOAP Action: getToken
     * @param signedTokenXml The XML containing <gettoken><item><Semilla>...</Semilla></item><Signature>...</Signature></gettoken>
     */
    async getToken(signedTokenXml: string): Promise<string> {
        // The signedTokenXml is already defined by us, we just wrap it in the SOAP Envelope
        const envelope = `
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
   <soapenv:Header/>
   <soapenv:Body>
      <def:getToken soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
         <pszXml xsi:type="xsd:string"><![CDATA[${signedTokenXml}]]></pszXml>
      </def:getToken>
   </soapenv:Body>
</soapenv:Envelope>`;

        try {
            const url = this.isProduction ? this.palenaUrl : this.maullinUrl;
            const response = await this.axiosInstance.post(url, envelope);

            const xml = response.data;
            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const returnNode = doc.getElementsByTagName('getTokenReturn')[0];

            if (!returnNode || !returnNode.firstChild) {
                throw new Error('Could not parse getTokenReturn from SII response');
            }

            const innerXml = returnNode.firstChild.nodeValue;

            // Response format: <RESPUESTA><ESTADO>00</ESTADO><TOKEN>...</TOKEN></RESPUESTA>
            const matchToken = innerXml.match(/<TOKEN>(.*?)<\/TOKEN>/);
            if (matchToken && matchToken[1]) {
                return matchToken[1];
            }

            const matchError = innerXml.match(/<ESTADO>(.*?)<\/ESTADO>/);
            if (matchError) {
                console.error('[SiiSoapClient] Token Error State:', matchError[1]);
                // If state is not 00, it's an error. 
                // Common: -01 (Error de Schema), -03 (Error de Firma), 11 (Certificado revocado/inválido)
                throw new Error(`SII Token Error. State: ${matchError[1]}`);
            }

            throw new Error('TOKEN tag not found in SII response');
        } catch (error) {
            console.error('[SiiSoapClient] Error getting Token:', error.message);
            throw error;
        }
    }
}
