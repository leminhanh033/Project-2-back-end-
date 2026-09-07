import { Router } from 'express';
import  homeController  from "../controllers/home.controller";
import checkPermission from '../middlewares/auth.middleware';
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';
const parser = multer({ storage: storage });


router.post("/province",homeController.getProvinces)
router.post("/company",homeController.getCompany)


export default router