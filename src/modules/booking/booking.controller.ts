import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });

  } catch (err: any) {
    if (err.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    if (err.message === 'Vehicle is already booked') {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

const getBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBooking();
    console.table(result.rows);
    res.status(201).json({
      success: true,
      message: "Booking data Retrived Successfully, Admin..",
      data: result.rows,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const bookingController = {
  createBooking, getBooking
}