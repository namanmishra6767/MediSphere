import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      email,
      role,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `);

  return result.rows;
};

export const createDoctor = async ({
  email,
  password,
  firstName,
  lastName,
  specialization,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      const error = new Error("Email already registered");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await client.query(
      `INSERT INTO users (
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, 'doctor')
      RETURNING id, email, role, created_at, updated_at`,
      [email, passwordHash]
    );

    const user = userResult.rows[0];

    const doctorResult = await client.query(
      `INSERT INTO doctors (
        user_id,
        first_name,
        last_name,
        specialization
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, first_name, last_name, specialization`,
      [user.id, firstName, lastName, specialization]
    );

    await client.query("COMMIT");

    return {
      user,
      doctor: doctorResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};