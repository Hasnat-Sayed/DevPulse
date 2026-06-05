import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import config from "../../config";
import type { IRegisterPayload, ILoginPayload, IUser } from "./auth.interface";

const registerUserIntoDB = async (payload: IRegisterPayload): Promise<IUser> => {
  const { name, email, password, role } = payload;

  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING * `,
    [name, email, hashedPassword, role]
  );

  delete result.rows[0].password;
  return result.rows[0];
};



export const authService = {
  registerUserIntoDB,
};