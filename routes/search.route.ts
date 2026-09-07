import { Router } from 'express';
import  searchController  from "../controllers/search.controller";
const router=Router();

router.post("/result",searchController.result)


export default router