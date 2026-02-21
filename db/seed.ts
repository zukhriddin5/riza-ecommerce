import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {Pool,neonConfig} from '@neondatabase/serverless';
import {PrismaNeon} from '@prisma/adapter-neon';
import ws from 'ws';
import sampleData from "./sample_data";

neonConfig.webSocketConstructor=ws;
const connectionString= process.env.DATABASE_URL!;

const pool = new Pool({connectionString});

// //@ts-expect-error - Type incompatibility between @neondatabase/serverless Pool and @prisma/adapter-neon in Prisma 7
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting seed...");
    console.log("Sample data:", sampleData.products.length, "products");

    console.log("Deleting existing products...");
    const deleted = await prisma.product.deleteMany();
    console.log(`Deleted ${deleted.count} products`);

    console.log("Creating new products...");
    const created = await prisma.product.createMany({ data: sampleData.products });
    console.log(`Created ${created.count} products`);

    console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });