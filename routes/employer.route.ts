import { Router } from 'express';
import  employerController  from "../controllers/employer.controller";
import employerValidate from '../validates/employer.validate';
import checkPermission from '../middlewares/auth.middleware';
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';
const parser = multer({ storage: storage });


router.post("/register",employerValidate.register,employerController.register)
router.post("/login",employerValidate.login,employerController.login)
router.post("/logout",employerController.logout);

router.post("/province",employerController.provinceGet);
router.patch(
  "/infor",
  parser.single('logo'),
  checkPermission("employer"),
  employerValidate.infor,
  employerController.infor
)

export default router