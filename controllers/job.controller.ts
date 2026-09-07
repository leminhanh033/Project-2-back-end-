import { Request, Response } from 'express';
import job from '../models/job.model'
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { string } from 'joi';
import province from '../models/province.model';
import employer from '../models/employer.model';
import CV from '../models/CV.model';
import { workingMethods, levels } from '../configs/variable.config';

const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.files?.length == 0) {
      res.json({
        code: "error",
        message: "Thêm ít nhất một ảnh",
      })
      return;
    }
    if (req.body.salaryMin) {
      req.body.salaryMin = parseInt(req.body.salaryMin.replace(',', ""));
    }
    if (req.body.salaryMax) {
      req.body.salaryMax = parseInt(req.body.salaryMax.replace(',', ""));
    }
    //companyID
    req.body.companyID = req.account._id;
    //images
    const files = req.files as any[];
    req.body.images = files.map(item => item.path);
    //technology
    const technology = req.body.technology.split(",");
    req.body.technology = technology.map((item: string) => item.trim());

    const newJob = new job(req.body);
    await newJob.save();
    res.json({
      code: "success",
      message: "Tạo công việc mới thành công",
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

const list = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = 9;
    let skip = 0;
    if (req.query.page) {
      const page = req.query.page as string;
      skip = (parseInt(page) - 1) * limit;
    }
    const jobList = await job.find({
      companyID: req.account._id,
    })
      .sort({
        createdAt: "desc",
      })
      .limit(limit)
      .skip(skip)
    const numberJob = await job.find({
      companyID: req.account._id,
    }).countDocuments();
    const pagination = {
      totalPage: Math.ceil(numberJob / limit),
    }
    for (const item of jobList) {
      item.workingMethod = workingMethods.find(method => method.value == item.workingMethod)?.label || "";
      const provinceItem = await province.findOne({
        _id: item.province,
      })
      item.province = provinceItem?.name || "";
    }


    res.json({
      code: "success",
      message: "Truy xuất dữ liệu thành công",
      jobList,
      pagination,
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
    if (req.files?.length == 0) {
      res.json({
        code: "error",
        message: "Thêm ít nhất một ảnh",
      })
      return;
    }
    const jobDetail = await job.findOne({
      _id: req.params.id,
      companyID: req.account._id,
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy công việc",
      })
      return;
    }
    if (req.body.salaryMin) {
      req.body.salaryMin = parseInt(req.body.salaryMin.replace(',', ""));
    }
    if (req.body.salaryMax) {
      req.body.salaryMax = parseInt(req.body.salaryMax.replace(',', ""));
    }
    //companyID
    req.body.companyID = req.account._id;
    //images
    const files = req.files as any[];
    req.body.images = files.map(item => item.path);
    //technology
    const technology = req.body.technology.split(",");
    req.body.technology = technology.map((item: string) => item.trim());

    await job.updateOne({
      _id: req.params.id,
      companyID: req.account._id,
    }, req.body);

    res.json({
      code: "success",
      message: "Chỉnh sửa công việc thành công",
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

const getEdit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobDetail = await job.findOne({
      _id: req.params.id,
      companyID: req.account._id,
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy công việc",
      })
      return;
    }
    res.json({
      code: "success",
      message: "Lấy thông tin công việc thành công",
      jobDetail,
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

const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log(req.query.id);
    await job.deleteOne({
      _id: req.query.id,
      companyID: req.account._id,
    });
    res.json({
      code: "success",
      message: "Xoá công việc thành công",
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
    //job
    const jobDetail = await job.findOne({
      _id: req.params.id,
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy công việc",
      })
      return;
    }
    else {
      jobDetail.level = levels.find(level => (level.value == jobDetail.level))?.label;
      jobDetail.workingMethod = workingMethods.find(item => item.value == jobDetail.workingMethod)?.label;
    }
    //company
    const companyDetail = await employer.findOne({
      _id: jobDetail.companyID,
    })
    if (!companyDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy công ty",
      })
      return;
    }
    res.json({
      code: "success",
      message: "Lấy công việc thành công",
      jobDetail,
      companyDetail
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

const apply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobDetail = await job.findOne({
      _id: req.body.jobID,
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy công việc",
      })
      return;
    }
    const applied = await CV.findOne({
      jobID: req.body.jobID,
      email:req.body.email,
    })
    if (applied) {
      res.json({
        code: "error",
        message: "Bạn đã gửi CV cho công việc này",
      })
      return;
    }
    if (!req.file) {
      res.json({
        code: "error",
        message: "Vui lòng đăng tải CV",
      })
      return;
    }
    const newApply = new CV({
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      jobID: req.body.jobID,
      CV: req.file!.path,
      status:"pending",
      view:false,
    })
    await newApply.save();
    res.json({
      code: "success",
      message: "Ứng tuyển công việc thành công",
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
  create,
  list,
  edit,
  getEdit,
  deleteJob,
  detail,
  apply,
}
