import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import accountUser from '../models/accountUser.model';
import employer from '../models/employer.model';

export interface AuthenticatedRequest extends Request {
  account?: any;
  files?: any,
  type?:any,
}

export default (...role: String[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const loginInfor = req.cookies.login ?
        jwt.verify(req.cookies.login, process.env.JSONWEBTOKEN!) as jwt.JwtPayload : null;
      if (loginInfor) {
        if (!(role.includes(loginInfor.type))) {
          res.json({
            code: "error",
            message: "Yêu cầu không hợp lệ"
          })
          return;
        }
        let account:any = {};
        if (loginInfor.type == "employer") {
          account = await employer.findOne({
            email: loginInfor.email,
            _id: loginInfor.id,
          })
        }
        if (loginInfor.type == "employee") {
          account = await accountUser.findOne({
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
        req.account = account;
        req.type=loginInfor.type;
        next();
      }
      else {
        res.json({
          code: "error",
          message: "Không tìm thấy thông tin đăng nhập",
        })
      }
    }
    catch (error) {
      console.log(error);
      res.json({
        code: "error",
        message: "Đã xảy ra lỗi khi đọc cookie",
      })
    }
  }
}


