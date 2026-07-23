import * as zod from "zod";

const createDeptSchema = zod.object({
  name: zod
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters long"),
  managerId: zod.number().optional(),
});
const updateDepartmentIdOfEmployeeSchema = zod.object({
  departmentId: zod.number().min(1, "departmentId is required"),
});
const updateDepartmentSchema = zod.object({
  name: zod
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters long")
    .optional(),
  managerId: zod.number().optional(),
});
export {
  createDeptSchema,
  updateDepartmentSchema,
  updateDepartmentIdOfEmployeeSchema,
};
