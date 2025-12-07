import { Pool } from "pg"
import config from "."

export const pool = new Pool({
  connectionString: `${config.connection_str}`
})

const initdb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL CHECK (email = LOWER(email)),
      password TEXT NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(20) CHECK (role IN ('admin', 'customer')) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) NOT NULL DEFAULT 'available'
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date >= rent_start_date),
      total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) NOT NULL DEFAULT 'active'
    )
  `);

}

export default initdb;
