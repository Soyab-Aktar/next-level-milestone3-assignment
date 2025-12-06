import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({
          success: false,
          message: "You are not allowed, please login",
        })
      }
      const decode = jwt.verify(token, config.secret as string) as JwtPayload;
      req.user = decode;
      if (roles.length && !roles.includes(decode.role)) {
        return res.status(500).json({
          error: "Unauthorized!!!",
        })
      }
      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }
}

export default auth;