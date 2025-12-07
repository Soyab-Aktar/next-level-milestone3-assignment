import { Request, Response } from "express";
import { authService } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json({
      succcess: true,
      message: "User registered successfully",
      data: result.rows[0],
    })

  } catch (err: any) {
    if (err.message === "Password is less than 6") {
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    })
  } catch (err: any) {
    if (err.message === "User Not Exist") {
      return res.status(404).json({
        success: false,
        message: err.message,
      })
    }
    if (err.message === "Password Incorect") {
      return res.status(404).json({
        success: false,
        message: err.message,
      })
    }
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}


export const authController = {
  createUser, loginUser
}