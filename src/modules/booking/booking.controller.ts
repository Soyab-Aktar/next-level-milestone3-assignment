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
  const currUserRole = req.user!.role;
  const currUserEmail = req.user!.email;

  try {
    const result = await bookingService.getBooking(currUserEmail, currUserRole);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: currUserRole === 'admin'
          ? "No bookings found in the system"
          : "You have no bookings yet",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: currUserRole === 'admin'
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully",
      data: result.rows,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateBooking = async (req: Request, res: Response) => {
  const { status } = req.body;
  const bookingId = req.params.bookingId as string;
  const userEmail = req.user!.email;
  const userRole = req.user!.role;

  try {
    const result = await bookingService.updateBooking(bookingId, status, userEmail, userRole);

    const message = userRole === 'customer'
      ? "Booking cancelled successfully"
      : "Booking marked as returned. Vehicle is now available";

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });

  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes('can only') ||
      error.message.includes('Cannot cancel') ||
      error.message.includes('Invalid role')
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


export const bookingController = {
  createBooking, getBooking, updateBooking
}