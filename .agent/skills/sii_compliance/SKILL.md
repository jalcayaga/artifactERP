---
name: sii_compliance
description: Technical standards and security guidelines for SII (Chilean Tax Authority) integration, XML signing, DTE generation, and web service communication.
---

# SII Compliance Skill

This skill provides the technical foundations and security standards required to interact with the Chilean SII (Servicio de Impuestos Internos) for Electronic Invoicing (DTE).

## 1. Security Standards

### Digital Signature (XMLDSig)
- **Standard**: Follow the SII technical manual for XML digital signatures (RSA-SHA1).
- **Canonicalization**: Always use `http://www.w3.org/TR/2001/REC-xml-c14n-20010315` for the `SignedInfo` and `SetDTE` nodes.
- **Digest Algorithm**: Use SHA1.
- **Key Handling**: 
    - Private keys must be handled securely in PEM/PFX formats.
    - Never store private keys in plain text; use environment variables or secure vaults.
    - In development, use `test-cert.pem` and `test-key.pem` provided by SII.

### Certificate Management
- **Format**: SII expects signatures from a valid "Certificado Digital" for the legal representative or authorized person.
- **Validation**: Check certificate expiration and RUT ownership before attempting any submission.

## 2. Technical XML Standards

### Encoding
- **Format**: All XMLs must be encoded in **ISO-8859-1**. UTF-8 is NOT supported by SII.
- **Headers**: Include `<?xml version="1.0" encoding="ISO-8859-1"?>`.

### Character Escaping
- Use standard XML escaping for characters like `&` (`&amp;`), `<` (`&lt;`), etc.
- **Note**: SII is strict about whitespace in signed blocks. Preserve the exact structure after signing.

## 3. Web Service Integration

### Endpoints
- **Maullin (Certification)**: Use for testing and the "Set de Pruebas" process.
- **Palena (Production)**: Use only for live, legal documents.

### Authentication Sequence
1. **Get Seed**: Call `getSeed` to obtain a challenge.
2. **Sign Seed**: Sign the seed using the Digital Certificate.
3. **Get Token**: Call `getToken` with the signed seed to get an `ACCESS_TOKEN` valid for 10 minutes.

### Submission (EnvioDTE)
- Documents must be wrapped in an `EnvioDTE` envelope.
- The envelope itself must be signed (Envelope Signature) in addition to the individual DTE signatures.

## 4. Folio Management (CAF)

- **CAF (Código de Autorización de Folios)**: XML file provided by SII containing private keys for stamping DTEs.
- **TED (Timbre Electrónico DTE)**: The visual/XML stamp at the bottom of a DTE.
- **Sequence**:
    1. Extract CAF private key.
    2. Generate TED fragment for the specific folio.
    3. Sign TED with the CAF private key.
    4. Embed TED into the DTE XML.

## 5. PDF (RIDE) Standards

- **RIDE (Representación Impresa de un Documento Electrónico)**:
    - Must include the TED (QR Code).
    - Specific font sizes and layout as per SII "Manual de RIDE".
    - Copy "Cedible" must be clearly marked for specific invoices.

## 6. Implementation Checklist

- [ ] Is the XML encoding set to ISO-8859-1?
- [ ] Is the Digital Signature using the correct Canonicalization Algorithm?
- [ ] Are we using the correct SII environment (Maullin vs Palena)?
- [ ] Has the EnvioDTE envelope been signed with the sender's certificate?
- [ ] Is the TED (Electronic Stamp) correctly generated and signed with the CAF?
- [ ] Are we validating the RUT formats and mandatory fields before signing?
