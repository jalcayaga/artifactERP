import { PrismaClient, UserRole, ProductType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create Admin User
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('admin123', salt)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@subred.cl' },
    update: {},
    create: {
      email: 'admin@subred.cl',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Subred',
      role: UserRole.ADMIN,
    },
  })

  console.log(`Created admin user: ${adminUser.email}`)

  // 2. Create a sample company for the admin user
  const sampleCompany = await prisma.company.upsert({
    where: { rut: '76.123.456-7' },
    update: {},
    create: {
      name: 'Empresa de Ejemplo',
      fantasyName: 'Ejemplo Fantasía',
      rut: '76.123.456-7',
      giro: 'Servicios de prueba',
      address: 'Calle Falsa 123',
      city: 'Santiago',
      state: 'Metropolitana',
      phone: '123456789',
      email: 'contacto@empresa-ejemplo.cl',
      isClient: true,
      isSupplier: false,
      userId: adminUser.id,
    },
  })

  console.log(`Created sample company: ${sampleCompany.name}`)

  // Create a sample supplier
  const sampleSupplier = await prisma.company.upsert({
    where: { rut: '77.888.999-K' },
    update: {},
    create: {
      name: 'Proveedor de Tecnología Rápida',
      fantasyName: 'TecnoRápido',
      rut: '77.888.999-K',
      giro: 'Importación y Distribución de Electrónica',
      address: 'Avenida Providencia 2025',
      city: 'Santiago',
      state: 'Metropolitana',
      phone: '987654321',
      email: 'ventas@tecnorapido.cl',
      isClient: false,
      isSupplier: true,
      userId: adminUser.id,
    },
  });

  console.log(`Created sample supplier: ${sampleSupplier.name}`);

  // 3. Create Sample Products
  const productsToCreate = [
    {
      name: 'Laptop Pro 15"',
      productType: ProductType.PRODUCT,
      sku: 'LP15-2025',
      description: 'Potente laptop para profesionales.',
      price: 1200000,
      unitPrice: 950000,
      category: 'Electrónica',
      isPublished: true,
    },
    {
      name: 'Servicio de Consultoría Técnica',
      productType: ProductType.SERVICE,
      sku: 'CONSULT-TECH-01',
      description: '1 hora de consultoría técnica especializada.',
      price: 80000,
      unitPrice: 0, // No tiene costo de compra
      category: 'Servicios',
      isPublished: true,
    },
    {
      name: 'Mouse Inalámbrico Ergonómico',
      productType: ProductType.PRODUCT,
      sku: 'MOUSE-ERG-22',
      description: 'Mouse diseñado para largas horas de uso.',
      price: 45000,
      unitPrice: 30000,
      category: 'Accesorios',
      isPublished: false, // No publicado aún
    },
  ]

  for (const p of productsToCreate) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        ...p,
        price: p.price,
        unitPrice: p.unitPrice,
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  // 4. Create a Sample Quote
  const laptopProduct = await prisma.product.findUnique({ where: { sku: 'LP15-2025' } });

  if (laptopProduct) {
    const quote = await prisma.quote.create({
      data: {
        companyId: sampleCompany.id,
        userId: adminUser.id,
        status: 'DRAFT',
        subTotalAmount: 1200000,
        vatAmount: 228000,
        grandTotal: 1428000,
        quoteItems: {
          create: [
            {
              productId: laptopProduct.id,
              quantity: 1,
              unitPrice: 1200000,
              totalPrice: 1200000,
              itemVatAmount: 228000,
              totalPriceWithVat: 1428000,
            },
          ],
        },
      },
    });
    console.log(`Created sample quote: ${quote.id}`);
  }

  // 5. Create a Sample Purchase to stock products
  if (laptopProduct && sampleSupplier) {
    const purchase = await prisma.purchase.create({
      data: {
        companyId: sampleSupplier.id,
        purchaseDate: new Date(),
        status: 'RECEIVED',
        subTotalAmount: 9500000,
        totalVatAmount: 1805000,
        grandTotal: 11305000,
        items: {
          create: [
            {
              productId: laptopProduct.id,
              quantity: 10,
              unitPrice: 950000,
              totalPrice: 9500000,
              itemVatAmount: 1805000,
              totalPriceWithVat: 11305000,
              lots: {
                create: [
                  {
                    productId: laptopProduct.id,
                    lotNumber: `LOTE-${Date.now()}`,
                    initialQuantity: 10,
                    currentQuantity: 10,
                    purchasePrice: 950000,
                    entryDate: new Date(),
                  }
                ]
              }
            },
          ],
        },
      },
    });
    console.log(`Created sample purchase: ${purchase.id}`);
  }

  // 6. Create a Sample Order from the stocked product
  const stockedLaptopLot = await prisma.lot.findFirst({
    where: {
      productId: laptopProduct.id,
      currentQuantity: { gt: 0 }
    }
  });

  if (stockedLaptopLot) {
    const order = await prisma.order.create({
      data: {
        userId: adminUser.id,
        companyId: sampleCompany.id,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        subTotalAmount: 1200000,
        vatAmount: 228000,
        grandTotalAmount: 1428000,
        orderItems: {
          create: {
            productId: laptopProduct.id,
            quantity: 1,
            unitPrice: 1200000,
            totalPrice: 1200000,
            itemVatAmount: 228000,
            totalPriceWithVat: 1428000,
            orderItemLots: {
              create: {
                lotId: stockedLaptopLot.id,
                quantityTaken: 1,
              }
            }
          }
        }
      }
    });

    // Update lot quantity
    await prisma.lot.update({
      where: { id: stockedLaptopLot.id },
      data: { currentQuantity: { decrement: 1 } },
    });

    console.log(`Created sample order: ${order.id}`);
  }

  // 7. Create a Sample Invoice for the order
  const orderForInvoice = await prisma.order.findFirst({
    where: {
      companyId: sampleCompany.id,
    }
  });

  if (orderForInvoice) {
    const invoice = await prisma.invoice.create({
      data: {
        orderId: orderForInvoice.id,
        companyId: orderForInvoice.companyId,
        invoiceNumber: `F-${Date.now()}`,
        status: 'PAID',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subTotalAmount: orderForInvoice.subTotalAmount,
        vatAmount: orderForInvoice.vatAmount,
        grandTotal: orderForInvoice.grandTotalAmount,
        items: {
          create: {
            productId: laptopProduct.id,
            quantity: 1,
            unitPrice: 1200000,
            totalPrice: 1200000,
            itemVatAmount: 228000,
            totalPriceWithVat: 1428000,
          }
        }
      }
    });
    console.log(`Created sample invoice: ${invoice.id}`);
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
