import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if ((password as string).length < 6) {
    return false;
  }
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(`INSERT INTO users(name, email,password, phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]);
  return result;

}



export const authService = {
  createUser,
}