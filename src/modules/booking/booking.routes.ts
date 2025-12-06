import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/bookings', auth("admin", "customer"), bookingController.createBooking);
router.get('/bookings', bookingController.getBooking);

export const bookingRoutes = router;