import {Request,Response} from 'express';
import employer from '../models/employer.model'
import province from '../models/province.model'
import { AuthenticatedRequest } from "../middlewares/auth.middleware"

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const image=async (req:Request,res:Response)=>{
  try{
    console.log(req.file?.path);
    res.json({
      "location": req.file?.path,
    })
  }
  catch(error){
    console.log(error);
    res.json({
      code:'error',
      message:"Đã xảy ra lỗi"
    })
  }
}

export default {
  image
}
