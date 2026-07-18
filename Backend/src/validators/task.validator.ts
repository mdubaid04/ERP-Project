import * as z from "zod";

const updateTaskStatusSchema = z.object({
  status: z
    .enum(["PENDING", "COMPLETED"], "status can't be empty")
    .default("PENDING"),
});

export { updateTaskStatusSchema };
