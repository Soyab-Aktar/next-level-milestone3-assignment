import { Request } from "express";
import { pool } from "../../config/db"


const getUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
}

const deleteUser = async (userId: string) => {
  const bookingCheck = await pool.query(
    `SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (parseInt(bookingCheck.rows[0].count) > 0) {
    throw new Error("User have Active Booking!!");
  }
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return result;
}

const updateUser = async (name: string, email: string, phone: string, role: string, password: string, userId: string, currUserEmail: string, currUserRole: string) => {

  if (currUserRole === 'admin') {
    await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, userId]);
    const updatedResult = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id=$1`, [userId]);
    return updatedResult;
  }
  else if (currUserEmail === email && currUserRole === 'customer') {
    await pool.query(`UPDATE users SET name=$1, email=$2,password=$3, phone=$4 WHERE id=$5 RETURNING *`, [name, email, password, phone, userId]);
    const updatedResult = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id=$1`, [userId]);
    return updatedResult;
  }
  else {
    throw new Error("Access Denied!!");
  }
}

export const userService = {
  getUsers, deleteUser, updateUser
}