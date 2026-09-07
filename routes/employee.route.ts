import { Router } from 'express';
import  employeeController  from "../controllers/employee.controller";
import employeeValidate from '../validates/employee.validate';
import checkPermission from '../middlewares/auth.middleware';
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';

const parser = multer({ storage: storage });

router.post("/register",employeeValidate.register,employeeController.register)
router.post("/login",employeeValidate.login,employeeController.login)
router.post("/logout",employeeController.logout);

router.patch(
  "/infor",
  parser.single('avatar'),
  checkPermission("employee"),
  employeeValidate.infor,
  employeeController.infor
)


export default router