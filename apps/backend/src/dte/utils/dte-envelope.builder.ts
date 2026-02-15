
import * as xml2js from 'xml2js';

export interface EnvelopeMetadata {
    rutEmisor: string;
    rutEnvia: string;
    rutReceptor: string;
    fchResol: string;
    nroResol: number;
}

export class DteEnvelopeBuilder {
    /**
     * Builds the EnvioDTE (SetDTE) XML structure.
     * @param metadata Informacion de la caratula (header).
     * @param signedDtes Array of already signed DTE XML strings.
     */
    static build(metadata: EnvelopeMetadata, signedDtes: string[]): string {
        const tstp = new Date().toISOString().replace(/\.[0-9]{3}Z$/, '');

        // We use a string-based approach for the envelope to avoid xml2js 
        // escaping the already signed DTE XML strings.
        const caratula = `
      <Caratula version="1.0">
        <RutEmisor>${metadata.rutEmisor}</RutEmisor>
        <RutEnvia>${metadata.rutEnvia}</RutEnvia>
        <RutReceptor>${metadata.rutReceptor}</RutReceptor>
        <FchResol>${metadata.fchResol}</FchResol>
        <NroResol>${metadata.nroResol}</NroResol>
        <TmstFirmaEnv>${tstp}</TmstFirmaEnv>
        ${signedDtes.map((_, i) => `<SubTotDTE><TpoDTE>33</TpoDTE><NroDTE>1</NroDTE></SubTotDTE>`).join('\n        ')}
      </Caratula>`;

        const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<EnvioDTE xmlns="http://www.sii.cl/SiiDte" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sii.cl/SiiDte EnvioDTE_v10.xsd" version="1.0">
  <SetDTE ID="SetDoc">
    ${caratula}
    ${signedDtes.join('\n    ')}
  </SetDTE>
</EnvioDTE>`;

        return xml;
    }
}
