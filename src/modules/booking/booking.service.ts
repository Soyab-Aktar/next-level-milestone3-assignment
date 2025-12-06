import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleCheck = await pool.query(
    `SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleCheck.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  if (vehicleCheck.rows[0].availability_status === 'booked') {
    throw new Error('Vehicle is already booked');
  }

  const dailyRate = parseFloat(vehicleCheck.rows[0].daily_rent_price);
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = dailyRate * days;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
     VALUES($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );
  const vehicleDetails = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: vehicleDetails.rows[0]
  };
}

const getBooking = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result;
}

export const bookingService = {
  createBooking, getBooking
}
