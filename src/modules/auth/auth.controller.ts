import { Request, Response } from "express";
import { authService } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Password should be min 6 charectors!",
      })
    }
    else {
      res.status(201).json({
        succcess: true,
        message: "Data inserted Successfully",
        data: result.rows[0],
      })
    }

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}


export const authController = {
  createUser,
}