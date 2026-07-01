import { Router } from "express";
import adminRoute from "./admin.routes";
import authRoute from "./auth.routes";
import employeeRoute from "./employee.routes";

const router = Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/employee", employeeRoute);

export default router;
