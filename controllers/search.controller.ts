import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { workingMethods } from '../configs/variable.config';
import province from "../models/province.model"
import employer from "../models/employer.model"
import job from "../models/job.model"

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import slugify from 'slugify'


const result = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filter:{
      technology?:string,
      slug?:string|RegExp,
      province?:string,
      level?:string|undefined,
      workingMethod?:string|undefined,
    }={};
    let title=""
    if(req.body.key){
      filter.slug=new RegExp(slugify(req.body.key),'i');
    }
    if(req.body.province){
      filter.province=req.body.province;
      const provinceItem=await province.findOne({
        _id:req.body.province,
      })
      title+=`tại ${provinceItem?.name} `;
    }
    if(req.body.language){
      filter.technology=req.body.language;
      title+=`${req.body.language}`;
    }
    if(req.query.level){
      filter.level=String(req.query.level);
    }
    if(req.query.workingMethod){
      filter.workingMethod=String(req.query.workingMethod);
    }
    //page
    const page=req.query.page?parseInt(req.query.page as string):0;
    const limit=9;
    let skip=page>0?(page-1)*limit:0;
    const totalJob=await job.countDocuments(filter);
    const pagination={
      totalJob,
      totalPage:Math.ceil(totalJob/limit),
    }

    let jobList=await job.find(filter)
      .limit(limit)
      .skip(skip);
    let jobListFormat=[];

    for(const job of jobList){
      //province
      const provinceItem=await province.findOne({
        _id:job.province,
      })
      job.province=provinceItem?.name||"";
     
      //workingMethod
      job.workingMethod=workingMethods.find(method=>method.value==job.workingMethod)?.label||"";
       //company
      const company=await employer.findOne({
        _id:job.companyID,
      })
      jobListFormat.push({
        id:job._id,
        name:job.name,
        companyID:job.companyID,
        salaryMin:job.salaryMin,
        salaryMax:job.salaryMax,
        level:job.level,
        workingMethod:job.workingMethod,
        technology:job.technology,
        province:job.province,
        slug:job.slug,
        companyLogo:company?.logo,
        companyName:company?.name
      })
    }

    res.json({
      code: "success",
      message: "Lấy thông tin thàng công",
      jobList:jobListFormat,
      title,
      pagination
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
  result,
}
