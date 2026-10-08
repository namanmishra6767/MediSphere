import pool from "../config/db.js";

export const getAllAppointmentsForAdmin = async () => {
  const result = await pool.query(`
    SELECT
      a.id,
      a.appointment_time,
      a.status,
      a.reason,
      a.created_at,

      p.id AS patient_id,
      p.first_name AS patient_first_name,
      p.last_name AS patient_last_name,

      d.id AS doctor_id,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      d.specialization

    FROM appointments a

    JOIN patients p
      ON a.patient_id = p.id

    JOIN doctors d
      ON a.doctor_id = d.id

    ORDER BY a.appointment_time DESC
  `);

  return result.rows;
};