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

const getBooking = async (currUserEmail: string, currUserRole: string) => {
  if (currUserRole === 'admin') {
    const result = await pool.query(`
      SELECT b.id,b.customer_id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status,
        json_build_object(
          'name', u.name,
          'email', u.email
        ) as customer,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) as vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);
    return result;
  } else {
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [currUserEmail]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const userId = userResult.rows[0].id;

    const result = await pool.query(`
      SELECT b.id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number,
          'type', v.type
        ) as vehicle
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id DESC
    `, [userId]);

    return result;
  }
}

const updateBooking = async (bookingId: string, status: string, userEmail: string, userRole: string) => {
  const userResult = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [userEmail]
  );
  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }
  const userId = userResult.rows[0].id;

  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingCheck.rows.length === 0) {
    throw new Error('Booking not found');
  }

  const booking = bookingCheck.rows[0];

  if (userRole === 'customer') {
    if (booking.customer_id !== userId) {
      throw new Error('You can only cancel your own bookings');
    }

    if (status !== 'cancelled') {
      throw new Error('Customers can only cancel bookings');
    }

    if (booking.status !== 'active') {
      throw new Error('Can only cancel active bookings');
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error('Cannot cancel booking after start date');
    }


    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      ['cancelled', bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return { ...result.rows[0] };

  } else if (userRole === 'admin') {
    if (booking.status !== 'active') {
      throw new Error('Only active bookings can be marked as returned. Cannot return a cancelled booking.');
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      ['returned', bookingId]
    );

    const vehicleUpdate = await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING availability_status`,
      [booking.vehicle_id]
    );

    return {
      ...result.rows[0],
      vehicle: {
        availability_status: vehicleUpdate.rows[0].availability_status
      },
    };
  }

  throw new Error('Invalid role');
}

export const autoReturnExpiredBookings = async () => {
  try {
    const today = new Date();

    const result = await pool.query(`
      UPDATE bookings 
      SET status = 'returned' 
      WHERE status = 'active' 
      AND rent_end_date < $1 
      RETURNING id, vehicle_id
    `, [today]);

    if (result.rows.length > 0) {
      const vehicleIds = result.rows.map(b => b.vehicle_id);

      await pool.query(`
        UPDATE vehicles 
        SET availability_status = 'available' 
        WHERE id = ANY($1::int[])
      `, [vehicleIds]);
    }

    return result.rows.length;
  } catch (error) {
    return 0;
  }
};


export const bookingService = {
  createBooking, getBooking, updateBooking
}
