import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import province from "../models/province.model"
import employer from "../models/employer.model"
import job from "../models/job.model"

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const getProvinces = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const provinces=await province.find({});
    res.json({
      code: "success",
      message: "Lấy thông tin thàng công",
      provinces,
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: 'error',
      message: "Đã xảy ra lỗi"
    })
  }
}

interface Company{
  id:string,
  name:string | null | undefined,
  logo:string | null | undefined,
  province:string,
  numberJob:number,
}

const getCompany = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employerList=await employer.find({}).limit(9);
    const companyList:Company[]=[];
    for(const item of employerList){
      const provinceDetail=await province.findOne({_id:item.province});
      const numberJob=await job.countDocuments({
        companyID:item._id.toString(),
      })
      companyList.push({
        id:item._id.toString(),
        name:item.name,
        logo:item.logo,
        province:provinceDetail?.name || "",
        numberJob,
      })
    }
    res.json({
      code: "success",
      message: "Lấy thông tin thàng công",
      companyList,
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: 'error',
      message: "Đã xảy ra lỗi"
    })
  }
}

export default {
  getProvinces,
  getCompany
}
