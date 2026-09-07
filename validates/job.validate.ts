import { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const Joi = require('joi');

  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên công việc",
      "any.required": "Vui lòng nhập tên công việc",
    }),
    level: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn cấp bậc",
      "any.required": "Vui lòng chọn cấp bậc",
    }),
    workingMethod: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn phương thức làm việc",
      "any.required": "Vui lòng chọn phương thức làm việc",
    }),
    salaryMin: Joi.string().allow(""),
    salaryMax: Joi.string().allow(""),
    technology: Joi.string().allow(""),
    description: Joi.string().allow(""),
    images: Joi.string(),
    province: Joi.string().allow(""),
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err: any) {
    console.error(err.details[0].message);
    res.json({
      code: 'error',
      message: err.details[0].message
    })
    return;
  }
  next();
}


const apply = async (req: Request, res: Response, next: NextFunction) => {
  const Joi = require('joi');

  const schema = Joi.object({
    fullname: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập họ tên ",
      "any.required": "Vui lòng nhập họ tên",
    }),
    email: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập email",
      "any.required": "Vui lòng nhập email",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập số điện thoại",
      "any.required": "Vui lòng nhập số điện thoại",
    }),
    CV: Joi.string().allow(""),
    jobID: Joi.string().allow(""),
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err: any) {
    console.error(err.details[0].message);
    res.json({
      code: 'error',
      message: err.details[0].message
    })
    return;
  }
  next();
}


export default {
  create,
  apply,
}