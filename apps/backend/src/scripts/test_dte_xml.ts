import { DteXmlBuilder } from '../dte/utils/dte-xml.builder';

async function main() {
    console.log('🧪 Testing DteXmlBuilder with Mock Data...');

    const mockData: any = {
        invoice: {
            dteFolio: 1234,
            dteType: 33,
            issueDate: new Date(),
            subTotalAmount: 10000,
            vatAmount: 1900,
            grandTotal: 11900,
            tenant: {
                name: 'Empresa Demo SpA',
                primaryDomain: '76123456-7',
            },
            company: {
                name: 'Cliente Prueba S.A.',
                rut: '99888777-6',
                giro: 'Servicios Profesionales',
                address: 'Av. Providencia 1234',
                city: 'Santiago',
            },
            items: [
                {
                    product: { name: 'Servicio de Consultoría' },
                    quantity: 1,
                    unitPrice: 10000,
                    totalPrice: 10000,
                }
            ]
        }
    };

    try {
        const xml = DteXmlBuilder.buildInvoiceXml(mockData);
        console.log('✅ XML Generated Successfully:');
        console.log('--------------------------------------------------');
        console.log(xml);
        console.log('--------------------------------------------------');

        if (xml.includes('<TipoDTE>33</TipoDTE>') && xml.includes('<Folio>1234</Folio>')) {
            console.log('✨ Verification Passed: Key tags found.');
        } else {
            console.log('❌ Verification Failed: Missing key tags.');
        }
    } catch (error) {
        console.error('❌ Error during XML generation:', error);
    }
}

main();
