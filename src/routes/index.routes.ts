import { Router } from "express";
import adminRoute from "./admin.routes";
import authRoute from "./auth.routes";

const router = Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);

export default router;
