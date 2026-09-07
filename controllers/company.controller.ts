import { Request, Response } from 'express';
import province from "../models/province.model"
import employer from "../models/employer.model"
import job from "../models/job.model"
import { workingMethods } from '../configs/variable.config';

interface Company {
  id: string,
  name: string | null | undefined,
  logo: string | null | undefined,
  province: string,
  numberJob: number,
}


const list = async (req: Request, res: Response) => {
  try {
    const totalCompany=await employer.countDocuments({});
    const limit=9;
    const page=parseInt(req.query?.page as string)||1;
    const skip=page>0?(page-1)*limit:0;
    const totalPage=Math.ceil(totalCompany/limit);
    
    const employerList = await employer.find({}).limit(limit).skip(skip);
    const companyList: Company[] = [];
    for (const item of employerList) {
      const provinceDetail = await province.findOne({ _id: item.province });
      const numberJob = await job.countDocuments({
        companyID: item._id.toString(),
      })
      companyList.push({
        id: item._id.toString(),
        name: item.name,
        logo: item.logo,
        province: provinceDetail?.name || "",
        numberJob,
      })
    }
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
      companyList,
      totalPage,
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

const detail = async (req: Request, res: Response) => {
  try {
    //companyDetail
    const companyDetail = await employer.findOne({
      _id: req.params.id,
    })
    if (!companyDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy thông tin công ty",
      })
      return;
    }
    console.log(companyDetail);
    //jobList
    const jobList = await job.find({
      companyID: req.params.id,
    })
    const jobListFormat=[];
    for (const job of jobList) {
      //province
      const provinceItem = await province.findOne({
        _id: job.province,
      })
      job.province = provinceItem?.name || "";

      //workingMethod
      job.workingMethod = workingMethods.find(method => method.value == job.workingMethod)?.label || "";
      jobListFormat.push({
        id: job._id,
        name: job.name,
        companyID: job.companyID,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        level: job.level,
        workingMethod: job.workingMethod,
        technology: job.technology,
        province: job.province,
        slug: job.slug,
      })
    }
    console.log(jobList);
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
      companyDetail,
      jobList:jobListFormat,
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
  list,
  detail,
}
