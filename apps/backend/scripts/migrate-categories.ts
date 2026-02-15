import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '')       // Trim - from end of text
}

async function main() {
    console.log('Starting category migration...')

    // 1. Get all products with a category string but no categoryId
    const products = await prisma.product.findMany({
        where: {
            category: { not: null },
            categoryId: null,
        },
    })

    console.log(`Found ${products.length} products to migrate.`)

    const categoriesMap = new Map<string, string>() // key: tenantId-slug, value: categoryId

    for (const product of products) {
        if (!product.category) continue

        const slug = slugify(product.category)
        const key = `${product.tenantId}-${slug}`

        let categoryId = categoriesMap.get(key)

        if (!categoryId) {
            // Check if category exists in DB (in case we ran script partially or created manually)
            let category = await prisma.category.findUnique({
                where: {
                    tenantId_slug: {
                        tenantId: product.tenantId,
                        slug,
                    },
                },
            })

            if (!category) {
                console.log(`Creating category: ${product.category} (slug: ${slug}) for tenant ${product.tenantId}`)
                category = await prisma.category.create({
                    data: {
                        tenantId: product.tenantId,
                        name: product.category,
                        slug,
                    },
                })
            }

            categoryId = category.id
            categoriesMap.set(key, categoryId)
        }

        // Update product
        await prisma.product.update({
            where: { id: product.id },
            data: { categoryId },
        })
    }

    console.log('Migration finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
