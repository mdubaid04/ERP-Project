import * as zod from "zod";

const createDeptSchema = zod.object({
  name: zod
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters long"),
  managerId: zod.number().optional(),
});

export { createDeptSchema };
