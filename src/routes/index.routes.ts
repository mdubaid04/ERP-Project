import { Router } from "express";
import adminRoute from "./admin.routes";
import authRoute from "./auth.routes";
import employeeRoute from "./employee.routes";
import managerRoute from "./manager.routes";

const router = Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/employee", employeeRoute);
router.use("/manager", managerRoute);

export default router;
