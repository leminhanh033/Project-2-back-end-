import { Router } from 'express';
import  uploadController  from "../controllers/upload.controller";
const router=Router();

import multer  from 'multer';
import storage from '../helpers/storage.helper';

const parser = multer({ storage: storage });

router.post("/image",parser.single('file'),uploadController.image)



export default router