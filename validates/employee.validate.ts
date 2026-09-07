import { NextFunction,Request,Response } from "express";

const register = async (req:Request, res:Response, next:NextFunction) => {
  const Joi = require('joi');

  const schema = Joi.object({
    fullname: Joi.string().required().messages({
      "string.empty":"Vui lòng nhập họ và tên",
      "any.required":"Vui lòng nhập họ và tên",
    }),
    email: Joi.string().email().required().messages({
      "string.empty":"Vui lòng nhập email",
      "any.required":"Vui lòng nhập email",
      "string.email": "Email không đúng định dạng",
    }),
    password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/))
    .messages({
      "string.empty":"Vui lòng nhập mật khẩu",
      "any.required":"Vui lòng nhập mật khẩu",
       "string.pattern.base": "Mật khẩu phải có chữ thường, chữ hoa, số và ký tự đặc biệt",
    }),
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err:any) { 
    console.error(err.details[0].message);
    res.json({
      code:'error',
      message:err.details[0].message
    })
    return;
  }
  next();
}

const login = async (req:Request, res:Response, next:NextFunction) => {
  const Joi = require('joi');

  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty":"Vui lòng nhập email",
      "any.required":"Vui lòng nhập email",
      "string.email": "Email không đúng định dạng",
    }),
    password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/))
    .messages({
      "string.empty":"Vui lòng nhập mật khẩu",
      "any.required":"Vui lòng nhập mật khẩu",
       "string.pattern.base": "Mật khẩu phải có chữ thường, chữ hoa, số và ký tự đặc biệt",
    }),
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err:any) { 
    res.json({
      code:'error',
      message:err.details[0].message
    })
    return;
  }
  next();
}

const infor = async (req:Request, res:Response, next:NextFunction) => {
  const Joi = require('joi');

  const schema = Joi.object({
    fullname: Joi.string().required().messages({
      "string.empty":"Vui lòng nhập họ và tên",
      "any.required":"Vui lòng nhập họ và tên",
    }),
    email: Joi.string().email().required().messages({
      "string.empty":"Vui lòng nhập email",
      "any.required":"Vui lòng nhập email",
      "string.email": "Email không đúng định dạng",
    }),
    phone: Joi.string().allow("")
    .pattern(new RegExp(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/))
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
    }),
    avatar:Joi.string().allow(""),
  })

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err:any) { 
    console.error(err.details[0].message);
    res.json({
      code:'error',
      message:err.details[0].message
    })
    return;
  }
  next();
}

export default{
  register,
  login,
  infor,
}