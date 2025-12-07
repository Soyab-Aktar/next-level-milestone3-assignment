import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if ((password as string).length < 6) {
    throw new Error("Password is less than 6");
  }
  const hashedPassword = await bcrypt.hash(password as string, 10);
  await pool.query(`INSERT INTO users(name, email,password, phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]);
  const newUser = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE email=$1`, [email]);
  return newUser;

}

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (result.rows.length === 0) {
    throw new Error("User Not Exist");
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Password Incorect");
  }
  const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.secret as string, { expiresIn: "7d" });
  return { token, user };
}



export const authService = {
  createUser, loginUser,
}