import { pool } from "../../config/db"


const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
}

const deleteUser = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT COUNT(*) FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (parseInt(bookingCheck.rows[0].count) > 0) {
    return false;
  }
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
}

const updateUser = async (name: string, email: string, phone: string, role: string, id: string) => {
  const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]);
  return result;
}

export const userService = {
  getUsers, deleteUser, updateUser
}