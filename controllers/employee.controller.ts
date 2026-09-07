import { Request, Response } from 'express';
import accountUser from '../models/accountUser.model'
import { AuthenticatedRequest } from "../middlewares/auth.middleware"

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
  try {
    const account = await accountUser.findOne({
      email: req.body.email,
    })
    if (account) {
      res.json({
        code: "error",
        message: "Email đã tồn tại",
      })
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    const newAccount = new accountUser({
      fullname: req.body.fullname,
      email: req.body.email,
      password: password,
    })
    await newAccount.save();

    res.json({
      code: "success",
      message: "Đăng ký tài khoản thàng công",
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

const login = async (req: Request, res: Response) => {
  try {
    const account = await accountUser.findOne({
      email: req.body.email,
    })
    if (!account) {
      res.json({
        code: "error",
        message: "Email không tồn tại",
      })
      return;
    }
    if (!bcrypt.compareSync(req.body.password, account.password!)) {
      res.json({
        code: "error",
        message: "Mật khẩu không chính xác",
      })
      return;
    }
    const token = jwt.sign({
      email: req.body.email,
      id: account._id,
      type: "employee",
    }, process.env.JSONWEBTOKEN!, {
      expiresIn: 24 * 60 * 60,
    });
    res.cookie("login", token, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
    })
    res.json({
      code: "success",
      message: "Đăng nhập thàng công",
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

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("login");
    res.json({
      code: "success",
      message: "Đăng xuất thành công",
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi",
    })
  }
}

const infor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const account = await accountUser.findOne({
      _id: { $ne: req.account._id },
      email: req.body.email,
    })
    if (account) {
      res.json({
        code: 'error',
        message: "Email đã tồn tại",
      })
      return;
    }
    await accountUser.updateOne({
      _id: req.account._id,
      email: req.account.email,
    }, {
      fullname: req.body.fullname,
      email: req.body.email,
      avatar: req.file ? req.file.path : "",
      phone: req.body.phone,
    })
    res.json({
      code: "success",
      message: "Cập nhật thông tin tài khoản thàng công",
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
  register,
  login,
  logout,
  infor,
}
