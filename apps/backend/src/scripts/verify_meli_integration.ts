import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IntegrationsService } from '../integrations/integrations.service';
import { OrderSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Script para verificar la integración de Mercado Libre.
 * Simula la recepción de un webhook de Meli y verifica la creación de la orden.
 */
async function main() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const integrationsService = app.get(IntegrationsService);
    const prisma = app.get(PrismaService);

    console.log('🧪 Iniciando Verificación de Integración Meli...');

    // 1. Identificar Tenant y configurar usuario administrador
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        include: { tenant: true }
    });

    if (!admin || !admin.tenant) {
        console.error('❌ No se encontró un usuario ADMIN con tenant asociado.');
        await app.close();
        return;
    }

    const tenant = admin.tenant;
    console.log(`📍 Usando Tenant: ${tenant.name} (${tenant.id})`);
    console.log(`👤 Usando Admin: ${admin.email}`);

    // Asegurar que exista una configuración de integración para este tenant
    await prisma.integrationConfig.upsert({
        where: { tenantId_provider: { tenantId: tenant.id, provider: OrderSource.MERCADO_LIBRE } },
        update: { isActive: true, config: { defaultUserId: admin.id } },
        create: {
            tenantId: tenant.id,
            provider: OrderSource.MERCADO_LIBRE,
            isActive: true,
            config: { defaultUserId: admin.id }
        }
    });

    // 2. Asegurar producto con SKU para el mapeo
    const sku = 'PROD-TEST-01';
    let product = await prisma.product.findFirst({ where: { tenantId: tenant.id, sku } });
    if (!product) {
        console.log(`🏗️ Creando producto de prueba con SKU: ${sku}...`);
        product = await prisma.product.create({
            data: {
                tenantId: tenant.id,
                name: 'Producto de Prueba Meli',
                sku: sku,
                price: 15000,
                unitPrice: 15000,
            }
        });
    }

    // Asegurar Stock (Lote)
    const lot = await prisma.lot.findFirst({ where: { productId: product.id } });
    if (!lot) {
        console.log('📦 Provisionando stock inicial para el producto de prueba...');
        await prisma.lot.create({
            data: {
                tenantId: tenant.id,
                productId: product.id,
                lotNumber: 'LOTE-TEST-01',
                initialQuantity: 100,
                currentQuantity: 100,
                purchasePrice: 10000,
            }
        });
    }

    // 3. Simular Webhook
    const externalOrderId = 'MELI-' + Date.now();
    const payload = {
        resource: `/orders/${externalOrderId}`,
        topic: 'orders'
    };

    console.log(`📡 Enviando Mock Webhook (Orden: ${externalOrderId})...`);
    await integrationsService.handleIncomingWebhook(tenant.id, OrderSource.MERCADO_LIBRE, payload);

    // 4. Verificar Creación de Orden
    const order = await prisma.order.findFirst({
        where: {
            tenantId: tenant.id,
            externalOrderId: externalOrderId
        },
        include: { orderItems: true }
    });

    if (order) {
        console.log('✅ Orden creada exitosamente desde el webhook de Meli!');
        console.log(`🔗 Order ID Interno: ${order.id}`);
        console.log(`💰 Total: ${order.grandTotalAmount}`);
        console.log(`📦 Fuente: ${order.source}`);
    } else {
        console.error('❌ Falló la creación de la orden desde el webhook');
    }

    // 5. Verificar Idempotencia (Enviar mismo webhook de nuevo)
    console.log('🔄 Re-enviando mismo webhook (Verificando Idempotencia)...');
    await integrationsService.handleIncomingWebhook(tenant.id, OrderSource.MERCADO_LIBRE, payload);

    const orderCount = await prisma.order.count({
        where: { tenantId: tenant.id, externalOrderId: externalOrderId }
    });

    if (orderCount === 1) {
        console.log('✅ Check de Idempotencia pasado (sin duplicados)');
    } else {
        console.error(`❌ Falló Idempotencia: se encontraron ${orderCount} órdenes`);
    }

    await app.close();
}

main().catch(err => {
    console.error('💥 Error durante la verificación:');
    const fs = require('fs');
    fs.writeFileSync('error.log', JSON.stringify(err, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2));

    if (err.meta) {
        console.error('Meta:', JSON.stringify(err.meta, null, 2));
    }
    if (err.code) {
        console.error('Code:', err.code);
    }
    console.error('Full error written to error.log');
    process.exit(1);
});
