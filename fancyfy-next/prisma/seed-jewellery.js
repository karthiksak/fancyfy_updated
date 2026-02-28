const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
    // ─── BRACELETS ───────────────────────────────────────────────
    {
        name: "Gold-Plated Charm Bracelet",
        description: "Elegant gold-plated charm bracelet with delicate floral charms. Adjustable clasp for a perfect fit. Perfect for gifting or everyday wear.",
        price: 599,
        category: "Bracelets",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
            "https://images.unsplash.com/photo-1618946027894-be82c6fe3a02?w=800&q=80",
        ]),
    },
    {
        name: "Silver Bangle Set (Set of 3)",
        description: "A classic set of three sterling silver-finished bangles with a smooth polished finish. Lightweight and comfortable for all-day wear.",
        price: 799,
        category: "Bracelets",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
            "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
        ]),
    },
    {
        name: "Crystal Tennis Bracelet",
        description: "Stunning crystal-studded tennis bracelet with sparkling cubic zirconia stones set in a silver-tone base. Great for parties and occasions.",
        price: 1199,
        category: "Bracelets",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80",
            "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
        ]),
    },

    // ─── CHAINS ──────────────────────────────────────────────────
    {
        name: "Delicate Gold Layered Chain Necklace",
        description: "Minimalist double-layered gold-tone chain necklace. Timeless design that pairs beautifully with any outfit, casual or formal.",
        price: 849,
        category: "Chains",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80",
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
        ]),
    },
    {
        name: "Bold Silver Link Chain",
        description: "Chunky silver-tone link chain necklace with a sturdy lobster clasp. Makes a bold fashion statement. Unisex design.",
        price: 999,
        category: "Chains",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80",
        ]),
    },
    {
        name: "Pearl Strand Choker Necklace",
        description: "Elegant faux-pearl strand choker necklace with a gold-tone clasp. Classic and sophisticated, ideal for weddings and formal events.",
        price: 749,
        category: "Chains",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80",
        ]),
    },

    // ─── STUDS ───────────────────────────────────────────────────
    {
        name: "Crystal Solitaire Stud Earrings",
        description: "Classic round crystal stud earrings in a silver-tone setting. Hypoallergenic posts. A must-have everyday accessory for every jewellery collection.",
        price: 349,
        category: "Studs",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80",
            "https://images.unsplash.com/photo-1573408301185-9519f94e0bfe?w=800&q=80",
        ]),
    },
    {
        name: "Gold Pearl Stud Earrings",
        description: "Timeless faux pearl studs set in a gold-plated base. Simple, elegant, and versatile — perfect for office, college, or a night out.",
        price: 299,
        category: "Studs",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1573408301185-9519f94e0bfe?w=800&q=80",
            "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80",
        ]),
    },
    {
        name: "Floral Enamel Stud Earrings",
        description: "Cute floral-patterned enamel stud earrings in vibrant colours. Lightweight and fun — a great everyday casual accessory.",
        price: 249,
        category: "Studs",
        inStock: true,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1588881250718-c9982c6bb02d?w=800&q=80",
            "https://images.unsplash.com/photo-1573408301185-9519f94e0bfe?w=800&q=80",
        ]),
    },
];

async function main() {
    console.log("Seeding products...\n");

    for (const p of products) {
        const created = await prisma.product.create({ data: p });
        console.log(`✅  Created: [${created.category}] ${created.name}  — ₹${created.price}`);
    }

    const total = await prisma.product.count();
    console.log(`\n🎉  Done! Total products in DB: ${total}`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
