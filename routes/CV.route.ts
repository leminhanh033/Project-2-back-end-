import { Router } from 'express';
import  CVController  from "../controllers/CV.controller";
import checkPermission from '../middlewares/auth.middleware';
const router=Router();

router.post(
  "/list",
  checkPermission("employer"),
  CVController.list
)

router.patch(
  "/review/:id",
  checkPermission("employer"),
  CVController.edit
)

router.patch(
  "/delete/:id",
  checkPermission("employer"),
  CVController.deleteCV
)

router.delete(
  "/sent/delete/:id",
  checkPermission("employee"),
  CVController.deleteSentCV
)

router.post(
  "/detail/:id",
  checkPermission("employer","employee"),
  CVController.detail,
)

router.post(
  "/sent/list",
  checkPermission("employee"),
  CVController.sentList,
)


export default router