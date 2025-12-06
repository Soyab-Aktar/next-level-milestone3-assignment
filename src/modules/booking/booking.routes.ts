import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBooking);

export const bookingRoutes = router;