import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

declare global {
  var db: PrismaClient | undefined;
}

export const db = globalThis.db ?? new PrismaClient({ adapter });


if (process.env.NODE_ENV !== "production") globalThis.db = db;
