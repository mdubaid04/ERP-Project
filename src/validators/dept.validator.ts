import * as zod from "zod";

const createDeptSchema = zod.object({
  name: zod
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
  managerId: zod.number().optional(),
});

export { createDeptSchema };
