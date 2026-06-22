import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
export const basePrisma = new PrismaClient({ adapter });
const prisma = basePrisma.$extends({
  query: {
    employee: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
    },
  },
});

export { prisma };
