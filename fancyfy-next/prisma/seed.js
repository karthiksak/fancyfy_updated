const { PrismaClient } = require('@prisma/client')
// const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db',
        },
    },
})

async function main() {
    // const hashedPassword = await bcrypt.hash('admin123', 10)
    console.log("Checking DB connection...")
    const users = await prisma.user.findMany()
    console.log("Users:", users)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
