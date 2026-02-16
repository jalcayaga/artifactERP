import { PrismaClient } from '@prisma/client';
import { DteService } from '../dte/dte.service';
import { DteXmlBuilder } from '../dte/utils/dte-xml.builder';

const prisma = new PrismaClient() as any;
const siiService = { getToken: async () => 'mock-token' } as any;
const dteService = new DteService(prisma as any, siiService);

async function main() {
    console.log('🧪 Starting DTE Flow Verification...');

    // 1. Get base data or create mock
    let tenant = await prisma.tenant.findFirst({ include: { companies: true } });
    if (!tenant) {
        console.log('🏗️ Creating dummy tenant for testing...');
        tenant = await prisma.tenant.create({
            data: {
                slug: 'test-tenant-' + Date.now(),
                name: 'Test Tenant',
                displayName: 'Test Tenant',
                isActive: true,
            },
            include: { companies: true }
        }) as any;
    }

    let company = (tenant as any).companies?.[0];
    if (!company) {
        console.log('🏗️ Creating dummy company for testing...');
        const user = await prisma.user.findFirst({ where: { tenantId: (tenant as any).id } }) ||
            await prisma.user.create({ data: { tenantId: (tenant as any).id, email: 'admin@test.com', password: 'hash', firstName: 'Admin' } });

        company = await prisma.company.create({
            data: {
                tenantId: (tenant as any).id,
                userId: user.id,
                name: 'Test Company',
                rut: '76000000-1',
                giro: 'Informatica',
                address: 'Alameda 123',
            }
        });
    }

    const user = await prisma.user.findFirst({ where: { tenantId: (tenant as any).id } });
    let product = await prisma.product.findFirst({ where: { tenantId: (tenant as any).id } });

    if (!product) {
        console.log('🏗️ Creating dummy product...');
        product = await prisma.product.create({
            data: {
                tenantId: (tenant as any).id,
                name: 'Test Product',
                sku: 'TP-001',
            }
        });
    }

    // 2. Create a Mock CAF
    console.log('📦 Creating Mock CAF...');
    const caf = await prisma.dteCaf.upsert({
        where: { id: 'test-caf-33' },
        update: {},
        create: {
            id: 'test-caf-33',
            tenantId: tenant.id,
            companyId: company.id,
            dteType: 33,
            folioStart: 1,
            folioEnd: 100,
            lastFolioUsed: 0,
            cafXml: '<CAF>Mock CAF Content</CAF>',
            privateKey: 'TEST-PRIVATE-KEY',
            publicKey: 'TEST-PUBLIC-KEY',
        }
    });

    // 3. Create an Order
    console.log('🛒 Creating Order...');
    const order = await prisma.order.create({
        data: {
            tenantId: tenant.id,
            companyId: company.id,
            userId: user.id,
            subTotalAmount: 1000,
            vatAmount: 190,
            grandTotalAmount: 1190,
            status: 'COMPLETED',
            orderItems: {
                create: {
                    productId: product.id,
                    quantity: 1,
                    unitPrice: 1000,
                    totalPrice: 1000,
                    itemVatAmount: 190,
                    totalPriceWithVat: 1190
                }
            }
        }
    });

    // 4. Create an Invoice
    console.log('📄 Creating Invoice...');
    const invoice = await prisma.invoice.create({
        data: {
            tenantId: tenant.id,
            orderId: order.id,
            companyId: company.id,
            invoiceNumber: `INV-${Date.now()}`,
            subTotalAmount: 1000,
            vatAmount: 190,
            grandTotal: 1190,
            dteType: 33,
        }
    });

    // 5. Generate DTE
    console.log('⚡ Generating DTE XML...');
    const result = await dteService.generateDte(tenant.id, invoice.id);

    console.log('✅ DTE Generated Successfully!');
    console.log('Folio Assigned:', result.dteFolio);
    console.log('Status:', result.dteStatus);
    console.log('XML Snippet:', result.xmlContent?.substring(0, 200) + '...');

    // 6. Check CAF update
    const updatedCaf = await prisma.dteCaf.findUnique({ where: { id: caf.id } });
    console.log('Last Folio in CAF:', updatedCaf?.lastFolioUsed);

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
