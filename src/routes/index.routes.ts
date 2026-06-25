import { Router } from "express";
import employeeRoute from "./employee.routes";

const router = Router();

router.use("/employee", employeeRoute);

export default router;
