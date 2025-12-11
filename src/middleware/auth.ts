import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "You are not allowed, please login",
        })
      }

      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format. Use: Bearer <token>",
        })
      }

      const token = authHeader.substring(7);

      const decode = jwt.verify(token, config.secret as string) as JwtPayload;
      req.user = decode;

      if (roles.length && !roles.includes(decode.role)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized!!!",
        })
      }

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message
      })
    }
  }
}

export default auth;
