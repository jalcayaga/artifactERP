import { PrismaClient, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding POS data...');

    const tenantSlug = 'artifact';
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });

    if (!tenant) {
        console.error(`Tenant ${tenantSlug} not found. Run main seed first.`);
        return;
    }

    // Find Superadmin User
    const user = await prisma.user.findFirst({
        where: { tenantId: tenant.id, email: 'superadmin@artifact.cl' }
    });

    if (!user) {
        console.error('Superadmin user not found. Run main seed first.');
        return;
    }

    // 1. Create Generic Client
    const clientData = {
        tenantId: tenant.id,
        userId: user.id,
        name: 'Cliente General',
        fantasyName: 'Venta Directa',
        rut: '1-9',
        email: 'contacto@cliente.general',
        isClient: true,
        isSupplier: false,
        address: 'Dirección General',
        city: 'Santiago',
    };

    const client = await prisma.company.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email: clientData.email } },
        update: {},
        create: clientData,
    });
    console.log(`✅ Client: ${client.name}`);

    // 2. Create Categories if not exist
    const categories = ['Bebidas', 'Snacks', 'Electrónica', 'Servicios'];
    const categoryMap: Record<string, string> = {};

    for (const catName of categories) {
        const slug = catName.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
        const cat = await prisma.category.upsert({
            where: { tenantId_slug: { tenantId: tenant.id, slug } },
            update: {},
            create: {
                tenantId: tenant.id,
                name: catName,
                slug,
                description: `Categoría de ${catName}`
            }
        });
        categoryMap[catName] = cat.id;
    }
    console.log('✅ Categories created.');

    // 3. Create Products
    const products = [
        {
            name: 'Coca Cola 350ml',
            sku: 'BEB-001',
            price: 1500,
            category: 'Bebidas',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Papas Fritas Lays',
            sku: 'SNK-001',
            price: 2000,
            category: 'Snacks',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1566478988035-181559869502?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Servicio de Instalación',
            sku: 'SRV-001',
            price: 15000,
            category: 'Servicios',
            type: ProductType.SERVICE,
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Mouse Wireless',
            sku: 'TEC-001',
            price: 12990,
            category: 'Electrónica',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Teclado Mecánico',
            sku: 'TEC-002',
            price: 45000,
            category: 'Electrónica',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1587829741301-38933b9e4a31?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Agua Mineral 500ml',
            sku: 'BEB-002',
            price: 1000,
            category: 'Bebidas',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Galletas Oreo',
            sku: 'SNK-002',
            price: 1200,
            category: 'Snacks',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1558961363-2ab4805e2671?w=500&auto=format&fit=crop&q=60'
        },
        {
            name: 'Monitor 24"',
            sku: 'TEC-003',
            price: 120000,
            category: 'Electrónica',
            type: ProductType.PRODUCT,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60'
        }

    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { tenantId_sku: { tenantId: tenant.id, sku: p.sku } },
            update: {
                price: p.price,
                isPublished: true,
                categoryId: categoryMap[p.category],
                category: p.category
            },
            create: {
                tenantId: tenant.id,
                name: p.name,
                sku: p.sku,
                productType: p.type,
                price: p.price,
                description: `Descripción de ${p.name}`,
                images: [p.image],
                category: p.category,
                categoryId: categoryMap[p.category],
                isPublished: true,
            }
        });
    }
    console.log(`✅ ${products.length} Products seeded/updated.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
