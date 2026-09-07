import { Router } from 'express';
import  jobController  from "../controllers/job.controller";
import jobValidate from '../validates/job.validate';
import checkPermission from '../middlewares/auth.middleware';
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';
const parser = multer({ storage: storage });

router.post(
  "/create",
  parser.array('images',10),
  checkPermission("employer"),
  jobValidate.create,
  jobController.create
)

router.post(
  "/list",
  checkPermission("employer"),
  jobController.list,
)

router.post(
  "/edit/:id",
  checkPermission("employer"),
  jobController.getEdit,
)

router.patch(
  "/edit/:id",
  parser.array('images',10),
  checkPermission("employer"),
  jobValidate.create,
  jobController.edit,
)

router.post(
  "/delete",
  checkPermission("employer"),
  jobController.deleteJob,
)

router.post(
  "/detail/:id",
  jobController.detail,
)

router.post(
  "/apply",
  parser.single('CV'),
  jobValidate.apply,
  jobController.apply,
)

export default router