import pool from "../config/db.js";

export const getAllDoctors = async () => {
  const result = await pool.query(`
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.specialization
    FROM doctors d
    ORDER BY d.last_name, d.first_name
  `);

  return result.rows;
};

export const getDoctorPatients = async (doctorUserId) => {
  const result = await pool.query(
    `
    SELECT DISTINCT
      p.id,
      p.first_name,
      p.last_name,
      p.date_of_birth
    FROM patients p
    JOIN appointments a
      ON a.patient_id = p.id
    JOIN doctors d
      ON a.doctor_id = d.id
    WHERE d.user_id = $1
    ORDER BY p.last_name, p.first_name
    `,
    [doctorUserId]
  );

  return result.rows;
};