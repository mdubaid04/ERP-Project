import "dotenv/config";
import { app } from "./app";
import { prisma } from "./db/prisma";
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, async () => {
  try {
    await prisma.$connect(); // not necessary if you use prisma client but good practice it is
    console.log("DB Connection Successful");
  } catch (error) {
    console.log("DB connection failed due to some issues", error);

    process.exit(1);
  }
});
