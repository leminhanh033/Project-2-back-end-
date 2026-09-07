import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import accountUser from '../models/accountUser.model';
import employer from '../models/employer.model';

const checkLogin=async(req: Request, res: Response)=>{
  try {
    const loginInfor = req.cookies.login ?
      jwt.verify(req.cookies.login, process.env.JSONWEBTOKEN!) as jwt.JwtPayload : null;
    if (loginInfor) {
      let account=null;
      if (loginInfor.type == "employee") {
        account = await accountUser.findOne({
          email: loginInfor.email,
          _id: loginInfor.id,
        })
      }
      if (loginInfor.type == "employer") {
        account = await employer.findOne({
          email: loginInfor.email,
          _id: loginInfor.id,
        })

      }
      if (!account) {
        res.clearCookie("login");
        res.json({
          code: "error",
          message: "Không tồn tại tài khoản"
        })
        return;
      }
      const { password, ...inforUser } = account.toObject();
      res.json({
        code: "success",
        message: "Tồn tại tài khoản",
        inforUser: inforUser,
        type:loginInfor.type
      })

    }
    res.json({
      code: "error",
      message: "Bạn đã đăng xuất",
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

export default {
 checkLogin,
}