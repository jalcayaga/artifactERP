import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'ana@test.com'
    console.log(`Searching for user ${email}...`)

    const users = await prisma.user.findMany({
        where: { email },
        include: { roles: true }
    })

    if (users.length === 0) {
        console.error(`User ${email} not found!`)
        return
    }

    for (const user of users) {
        console.log(`User found: ${user.id} (Tenant: ${user.tenantId}), Roles: ${user.roles.map(r => r.name).join(', ')}`)

        // Update roles
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                roles: {
                    connect: [{ name: 'ADMIN' }, { name: 'SUPERADMIN' }]
                }
            },
            include: { roles: true }
        })

        console.log(`User ${user.id} promoted! New Roles: ${updatedUser.roles.map(r => r.name).join(', ')}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
