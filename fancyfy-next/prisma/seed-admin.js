// Run once: node prisma/seed-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const email = "admin@fancyfy.com";
    const password = "admin123"; // Change this after first login!

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("✅  Admin user already exists:", email);
        return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, password: hashed, name: "Fancyfy Admin", role: "ADMIN" },
    });
    console.log("🎉  Admin user created!");
    console.log("    Email:   ", user.email);
    console.log("    Password: admin123");
    console.log("\n⚠️   Change your password after first login!");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
