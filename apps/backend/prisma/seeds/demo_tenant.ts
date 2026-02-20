import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { subDays, addDays } from 'date-fns';

/**
 * Seeds a fully functional demo tenant with 1 month of realistic data
 * Tenant: demo
 * User: demo@artifact.cl / Demo!2025
 */
export async function seedDemoTenant(prisma: PrismaClient) {
    console.log('🎭 Creating Demo Tenant...');

    // 1. Create Demo Tenant
    const demoTenant = await prisma.tenant.upsert({
        where: { slug: 'demo' },
        update: {},
        create: {
            slug: 'demo',
            name: 'Demo Company',
            displayName: 'Tienda Demo',
            primaryDomain: 'demo.artifact.cl',
            domains: ['demo.artifact.cl'],
            settings: { isDemoMode: true },
            branding: {
                create: {
                    logoUrl: 'https://ui-avatars.com/api/?name=Demo&background=10b981&color=fff&size=256',
                    primaryColor: '#10b981',
                    secondaryColor: '#0ea5e9',
                },
            },
        },
    });

    console.log(`✅ Demo Tenant created: ${demoTenant.id}`);

    // 2. Create Demo User
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash('Demo!2025', salt);
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });

    const demoUser = await prisma.user.upsert({
        where: { tenantId_email: { tenantId: demoTenant.id, email: 'demo@artifact.cl' } },
        update: {},
        create: {
            tenantId: demoTenant.id,
            email: 'demo@artifact.cl',
            password,
            firstName: 'Usuario',
            lastName: 'Demo',
            role: 'ADMIN',
            roles: { connect: { id: adminRole.id } },
            isActive: true,
        },
    });

    console.log(`✅ Demo User created: ${demoUser.email}`);

    // 3. Create Demo Company
    const demoCompany = await prisma.company.upsert({
        where: {
            tenantId_rut: {
                tenantId: demoTenant.id,
                rut: '77.777.777-7',
            },
        },
        update: {},
        create: {
            tenantId: demoTenant.id,
            userId: demoUser.id,
            name: 'Tienda Demo SpA',
            fantasyName: 'Demo Store',
            rut: '77.777.777-7',
            giro: 'Comercio al por menor',
            address: 'Av. Demo 123',
            city: 'Santiago',
            state: 'Región Metropolitana',
            phone: '+56912345678',
            email: 'ventas@demo.artifact.cl',
            isClient: false,
            isSupplier: false,
        },
    });

    console.log(`✅ Demo Company created: ${demoCompany.name}`);

    // 4. Create Warehouse
    const warehouse = await prisma.warehouse.upsert({
        where: {
            id: `demo-warehouse-${demoTenant.id}`,
        },
        update: {},
        create: {
            id: `demo-warehouse-${demoTenant.id}`,
            tenantId: demoTenant.id,
            name: 'Bodega Principal',
            address: 'Av. Demo 123',
            isDefault: true,
        },
    });

    // 5. Create Categories
    const categories = [
        { name: 'Electrónica', slug: 'electronica' },
        { name: 'Ropa', slug: 'ropa' },
        { name: 'Alimentos', slug: 'alimentos' },
        { name: 'Hogar', slug: 'hogar' },
    ];

    const createdCategories = [];
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { tenantId_slug: { tenantId: demoTenant.id, slug: cat.slug } },
            update: {},
            create: {
                tenantId: demoTenant.id,
                name: cat.name,
                slug: cat.slug,
            },
        });
        createdCategories.push(category);
    }

    // 6. Create Products with Inventory
    const products = [
        { name: 'Laptop HP 15"', sku: 'LAPTOP-HP-15', price: 599990, category: 'electronica', stock: 15 },
        { name: 'Mouse Logitech', sku: 'MOUSE-LOG', price: 19990, category: 'electronica', stock: 50 },
        { name: 'Teclado Mecánico', sku: 'TECLADO-MEC', price: 79990, category: 'electronica', stock: 30 },
        { name: 'Polera Básica', sku: 'POLERA-BAS', price: 9990, category: 'ropa', stock: 100 },
        { name: 'Jeans Clásico', sku: 'JEANS-CLA', price: 29990, category: 'ropa', stock: 60 },
        { name: 'Café Premium 500g', sku: 'CAFE-PREM', price: 8990, category: 'alimentos', stock: 200 },
        { name: 'Té Verde Orgánico', sku: 'TE-VERDE', price: 5990, category: 'alimentos', stock: 150 },
        { name: 'Lámpara LED', sku: 'LAMP-LED', price: 24990, category: 'hogar', stock: 40 },
        { name: 'Cojín Decorativo', sku: 'COJIN-DEC', price: 12990, category: 'hogar', stock: 80 },
        { name: 'Monitor 24"', sku: 'MONITOR-24', price: 189990, category: 'electronica', stock: 20 },
    ];

    const createdProducts = [];
    for (const prod of products) {
        const category = createdCategories.find(c => c.slug === prod.category);
        const product = await prisma.product.upsert({
            where: { tenantId_sku: { tenantId: demoTenant.id, sku: prod.sku } },
            update: {},
            create: {
                tenantId: demoTenant.id,
                name: prod.name,
                sku: prod.sku,
                price: prod.price,
                categoryId: category?.id,
                isPublished: true,
                productType: 'PRODUCT',
            },
        });

        // Create initial lot for inventory
        await prisma.lot.create({
            data: {
                tenantId: demoTenant.id,
                productId: product.id,
                lotNumber: `LOT-${prod.sku}-001`,
                initialQuantity: prod.stock,
                currentQuantity: prod.stock,
                purchasePrice: prod.price * 0.6, // 40% margin
                warehouseId: warehouse.id,
            },
        });

        createdProducts.push(product);
    }

    console.log(`✅ Created ${createdProducts.length} products with inventory`);

    // 7. Create Supplier Companies
    const suppliers = [
        { name: 'Proveedor Tech SpA', rut: '88.888.888-8', email: 'tech@proveedor.cl' },
        { name: 'Distribuidora Textil', rut: '99.999.999-9', email: 'textil@proveedor.cl' },
    ];

    const createdSuppliers = [];
    for (const sup of suppliers) {
        const supplier = await prisma.company.upsert({
            where: { tenantId_rut: { tenantId: demoTenant.id, rut: sup.rut } },
            update: {},
            create: {
                tenantId: demoTenant.id,
                userId: demoUser.id,
                name: sup.name,
                rut: sup.rut,
                email: sup.email,
                isClient: false,
                isSupplier: true,
            },
        });
        createdSuppliers.push(supplier);
    }

    // 8. Create Customer Companies
    const customers = [
        { name: 'Cliente Corporativo A', rut: '11.111.111-1', email: 'clientea@empresa.cl' },
        { name: 'Cliente Retail B', rut: '22.222.222-2', email: 'clienteb@empresa.cl' },
        { name: 'Cliente Mayorista C', rut: '33.333.333-3', email: 'clientec@empresa.cl' },
    ];

    const createdCustomers = [];
    for (const cust of customers) {
        const customer = await prisma.company.upsert({
            where: { tenantId_rut: { tenantId: demoTenant.id, rut: cust.rut } },
            update: {},
            create: {
                tenantId: demoTenant.id,
                userId: demoUser.id,
                name: cust.name,
                rut: cust.rut,
                email: cust.email,
                isClient: true,
                isSupplier: false,
            },
        });
        createdCustomers.push(customer);
    }

    // 9. Generate Sales Orders (Last 30 days)
    console.log('📦 Generating sales orders...');
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const orderDate = subDays(today, i);
        const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per day

        for (let j = 0; j < numOrders; j++) {
            const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
            const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order

            let subTotal = 0;
            const orderItems = [];

            for (let k = 0; k < numItems; k++) {
                const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
                const quantity = Math.floor(Math.random() * 5) + 1;
                const unitPrice = Number(product.price);
                const totalPrice = unitPrice * quantity;
                const itemVat = totalPrice * 0.19;

                subTotal += totalPrice;
                orderItems.push({
                    productId: product.id,
                    quantity,
                    unitPrice,
                    totalPrice,
                    itemVatAmount: itemVat,
                    totalPriceWithVat: totalPrice + itemVat,
                });
            }

            const vatAmount = subTotal * 0.19;
            const grandTotal = subTotal + vatAmount;

            await prisma.order.create({
                data: {
                    tenantId: demoTenant.id,
                    userId: demoUser.id,
                    companyId: customer.id,
                    source: 'ADMIN',
                    status: 'COMPLETED',
                    paymentStatus: 'PAID',
                    subTotalAmount: subTotal,
                    vatAmount,
                    grandTotalAmount: grandTotal,
                    createdAt: orderDate,
                    orderItems: {
                        create: orderItems,
                    },
                },
            });
        }
    }

    console.log('✅ Sales orders generated');

    // 10. Generate Purchases (Last 30 days)
    console.log('📥 Generating purchases...');

    for (let i = 0; i < 10; i++) {
        const purchaseDate = subDays(today, i * 3);
        const supplier = createdSuppliers[Math.floor(Math.random() * createdSuppliers.length)];
        const numItems = Math.floor(Math.random() * 4) + 2;

        let subTotal = 0;
        const purchaseItems = [];

        for (let k = 0; k < numItems; k++) {
            const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
            const quantity = Math.floor(Math.random() * 20) + 10;
            const unitPrice = Number(product.price) * 0.6; // Cost price
            const totalPrice = unitPrice * quantity;
            const itemVat = totalPrice * 0.19;

            subTotal += totalPrice;
            purchaseItems.push({
                productId: product.id,
                quantity,
                unitPrice,
                totalPrice,
                itemVatAmount: itemVat,
                totalPriceWithVat: totalPrice + itemVat,
            });
        }

        const vatAmount = subTotal * 0.19;
        const grandTotal = subTotal + vatAmount;

        await prisma.purchase.create({
            data: {
                tenantId: demoTenant.id,
                companyId: supplier.id,
                purchaseDate,
                status: 'COMPLETED',
                subTotalAmount: subTotal,
                totalVatAmount: vatAmount,
                grandTotal,
                items: {
                    create: purchaseItems,
                },
            },
        });
    }

    console.log('✅ Purchases generated');
    console.log('🎭 Demo Tenant fully seeded with 30 days of data!');
}
