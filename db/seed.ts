import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {Pool} from 'pg'
//import {PrismaNeon} from '@prisma/adapter-neon';
//import ws from 'ws';
import sampleData from "./sample_data";

//neonConfig.webSocketConstructor=ws;
const connectionString= process.env.DATABASE_URL!;

const pool = new Pool({connectionString});

// //@ts-expect-error - Type incompatibility between @neondatabase/serverless Pool and @prisma/adapter-neon in Prisma 7
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();


   
    await prisma.product.createMany({ data: sampleData.products });
    await prisma.user.createMany({ data: sampleData.users });
    

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