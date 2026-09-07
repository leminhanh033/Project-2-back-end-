import { Router } from 'express';
import  authController  from "../controllers/auth.controller";
const router=Router();

router.use("/checkLogin",authController.checkLogin);

export default router;