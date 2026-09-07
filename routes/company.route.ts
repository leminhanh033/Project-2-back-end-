import { Router } from 'express';
import  companyController  from "../controllers/company.controller";
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';

const parser = multer({ storage: storage });

router.post("/list",companyController.list)
router.post("/detail/:id",companyController.detail)

export default router