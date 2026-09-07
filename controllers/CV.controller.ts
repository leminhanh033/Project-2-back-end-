import { Request, Response } from 'express';
import province from "../models/province.model"
import employer from "../models/employer.model"
import job from "../models/job.model"
import CV from '../models/CV.model';
import { statusApply, workingMethods, levels } from '../configs/variable.config';
import { AuthenticatedRequest } from "../middlewares/auth.middleware"

interface CVDetail {
  id: String,
  jobID: String,
  jobname?: string,
  salaryMin: Number,
  salaryMax: Number,
  workingMethod: string,
  level: string,

  fullname: string,
  email: string,
  phone: string,
  view: Boolean,
  status: string,
  statusFormat: string,
}
const list = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobList = await job.find({
      companyID: req.account._id
    })
    const CVList: CVDetail[] = [];
    for (const job of jobList) {
      const CVItems = await CV.find({
        jobID: job._id.toString(),
        deleted: false,
      })
      CVItems.forEach((item: any) => {
        CVList.push({
          id: item._id.toString(),

          jobname: job?.name || "",
          jobID: job._id.toString(),
          salaryMin: job.salaryMin || 0,
          salaryMax: job.salaryMax || 0,
          workingMethod: workingMethods.find(method => method.value == job.workingMethod)?.label || "",
          level: levels.find(level => level.value == job.level)?.label || "",

          fullname: item.fullname,
          email: item.email,
          phone: item.phone,
          view: item.view,
          status: item.status,
          statusFormat: statusApply.find((status: any) => status.value == item.status)?.label || "",
        })

      })
    }
    const page = parseInt(req.query.page?.toString() || "1");
    const limit = 9;
    const skip = page > 0 ? (page - 1) * limit : 0;
    const totalPage = Math.ceil(CVList.length / limit);
    const CVListSlice = CVList.slice(skip, limit);
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
      CVList: CVListSlice,
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

const edit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    //Validate
    const id = req.params.id;
    const listJob = await job.find({
      companyID: req.account._id
    })
    const listJobID = listJob.map(item => item._id.toString());
    const CVDetail = await CV.findOne({
      _id: id,
      jobID: { $in: listJobID },
      deleted: false,
    })
    if (!CVDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy CV"
      })
    }
    //filter
    const filter: {
      status?: string,
      view?: boolean,
    } = {};
    if (req.query.status) {
      filter.status = req.query.status as string
    }
    if (req.query.view) {
      filter.view = Boolean(req.query.view) || false;
    }
    await CV.updateOne({
      _id: id,
    }, filter)
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
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

const deleteCV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    //Validate
    const id = req.params.id;
    const listJob = await job.find({
      companyID: req.account._id
    })
    const listJobID = listJob.map(item => item._id.toString());
    const CVDetail = await CV.findOne({
      _id: id,
      jobID: { $in: listJobID },
      deleted: false,
    })
    if (!CVDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy CV cần xoá"
      })
    }

    await CV.updateOne({
      _id: id,
      deleted: false,
    }, {
      status: "reject",
      deleted: true,
    })
    res.json({
      code: "success",
      message: "Xoá CV thành công",
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

const detail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filter: any = {
      _id: req.params.id,
    }
    if (req.type == "employer") {
      filter.deleted = false;
    }
    const CVItem = await CV.findOne(filter)
    if (!CVItem) {
      res.json({
        code: "error",
        message: "Không tìm thấy CV"
      })
      return;
    }
    let jobDetail: any = await job.findOne({
      _id: CVItem.jobID,
    });
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy CV"
      })
      return;
    }
    const CVDetail = ({
      id: CVItem?._id.toString(),

      jobname: jobDetail?.name || "",
      jobID: jobDetail._id.toString(),
      salaryMin: jobDetail.salaryMin || 0,
      salaryMax: jobDetail.salaryMax || 0,
      workingMethod: workingMethods.find(method => method.value == jobDetail.workingMethod)?.label || "",
      level: levels.find(level => level.value == jobDetail.level)?.label || "",
      technology: jobDetail.technology.join(", "),

      fullname: CVItem?.fullname,
      email: CVItem?.email,
      phone: CVItem?.phone,
      CV: CVItem?.CV,
    })
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
      CVDetail,
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

const sentList = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const page = parseInt(req.query.page?.toString() || "1");
    const limit = 9;
    const skip = page > 0 ? (page - 1) * limit : 0;
    //totalPage
    const totalCV = await CV.countDocuments({
      email: req.account.email,
    })
    const totalPage = Math.ceil(totalCV / limit);
    //CVList
    const CVList = await CV.find({
      email: req.account.email,
    })
      .limit(limit)
      .skip(skip);
    const CVListFormat: any[] = []
    for (const CVItem of CVList) {
      const jobDetail = await job.findOne({
        _id: CVItem.jobID?.toString() || "",
      });
      const companyDetail = await employer.findOne({
        _id: jobDetail?.companyID || "",
      })
      if (!jobDetail || !companyDetail) {
        return;
      }
      CVListFormat.push({
        id: CVItem._id,
        jobname: jobDetail?.name as string,
        companyName: companyDetail.name,
        salaryMin: jobDetail.salaryMin || 0,
        salaryMax: jobDetail.salaryMax || 0,
        workingMethod: workingMethods.find(method => method.value == jobDetail.workingMethod)?.label || "",
        level: levels.find(level => level.value == jobDetail.level)?.label || "",

        view: CVItem.view,
        status: CVItem.status,
        statusFormat: statusApply.find((status: any) => status.value == CVItem.status)?.label || "",
      })

    }
    res.json({
      code: "success",
      message: "Lấy thông tin thành công",
      CVList: CVListFormat,
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

const deleteSentCV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    //Validate
    const CVDetail = await CV.findOne({
      _id: req.params.id,
      email:req.account.email,
    })
    if (!CVDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy CV cần xoá"
      })
    }
    await CV.deleteOne({
      _id:req.params.id,
      email:req.account.email,
    })
    res.json({
      code: "success",
      message: "Xoá CV thành công",
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
  edit,
  deleteCV,
  detail,
  sentList,
  deleteSentCV
}
