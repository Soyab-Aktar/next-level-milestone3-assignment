import { Request, Response } from "express";
import { userService } from "./user.service";



const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    console.table(result.rows);
    res.status(201).json({
      success: true,
      message: "Users data Retrived Successfully",
      data: result.rows,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.userId as string);

    if (!result) {
      res.status(409).json({
        success: false,
        message: "User have Active bookings, so we cant delete the user",
      })
    }
    else {
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Data not found",
        })
      }
      else {
        console.table(result.rows);
        res.status(201).json({
          success: true,
          message: "User data Deleted Successfully",
          data: null,
        });
      }
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role, password } = req.body;
  const currUserRole = req.user!.role;
  const currUserEmail = req.user!.email;
  try {
    const result = await userService.updateUser(name, email, phone, role, password, req.params.userId as string, currUserEmail, currUserRole);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      })
    }
    else {
      console.table(result.rows);
      res.status(201).json({
        success: true,
        message: "User data Updated Successfully",
        data: result.rows[0],
      });
    }

  } catch (error: any) {
    if (error.message === "Access Denied!!") {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const userController = {
  getUsers, deleteUser, updateUser
}