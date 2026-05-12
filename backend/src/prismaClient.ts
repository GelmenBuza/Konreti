import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from "../prisma/generated/client.ts";
import {env} from "@/config/env.js"

const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter});

export {prisma};