import type { Employee } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: partial<Employee>;
    }
  }
}

export {}; // to convert into module
