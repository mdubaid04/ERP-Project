import { prisma } from "../src/db/prisma";
import bcrypt from "bcrypt";

async function main() {
  await prisma.employee.upsert({
    where: { email: "d0473211@gmail.com" },
    update: { isActive: true },
    create: {
      firstName: "Mohammad",
      lastName: "Ubaid",
      email: "d0473211@gmail.com",
      password: await bcrypt.hash("Admin@123", 10), //"Admin@123",
      role: "ADMIN",
      isActive: true,
      phoneNo: "+917985389670",
    },
  });
  console.log("Admin created");
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
