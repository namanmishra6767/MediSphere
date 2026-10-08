import pool from "../config/db.js";

export const createAppointment = async ({
  patientId,
  doctorId,
  appointmentTime,
  reason,
}) => {
  const doctorResult = await pool.query(
    "SELECT id FROM doctors WHERE id = $1",
    [doctorId]
  );

  if (doctorResult.rows.length === 0) {
    throw new Error("DOCTOR_NOT_FOUND");
  }
  const conflictResult = await pool.query(
  `SELECT id
   FROM appointments
   WHERE doctor_id = $1
     AND appointment_time = $2
     AND status = 'scheduled'`,
  [doctorId, appointmentTime]
);

if (conflictResult.rows.length > 0) {
  throw new Error("APPOINTMENT_TIME_UNAVAILABLE");
}
  const result = await pool.query(
    `INSERT INTO appointments
      (patient_id, doctor_id, appointment_time, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING id, patient_id, doctor_id, appointment_time, status, reason, created_at`,
    [patientId, doctorId, appointmentTime, reason]
  );

  return result.rows[0];
};

export const getUserAppointments = async (userId, role) => {
  if (role === "patient") {
    const result = await pool.query(
      `SELECT
         a.id,
         a.appointment_time,
         a.status,
         a.reason,
         d.id AS doctor_id,
         d.first_name AS doctor_first_name,
         d.last_name AS doctor_last_name,
         d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE p.user_id = $1
       ORDER BY a.appointment_time ASC`,
      [userId]
    );

    return result.rows;
  }

  if (role === "doctor") {
    const result = await pool.query(
      `SELECT
         a.id,
         a.appointment_time,
         a.status,
         a.reason,
         p.id AS patient_id,
         p.first_name AS patient_first_name,
         p.last_name AS patient_last_name
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN patients p ON a.patient_id = p.id
       WHERE d.user_id = $1
       ORDER BY a.appointment_time ASC`,
      [userId]
    );

    return result.rows;
  }

  throw new Error("ROLE_NOT_SUPPORTED");
};

export const cancelAppointment = async (appointmentId, userId) => {
  const result = await pool.query(
    `UPDATE appointments a
     SET status = 'cancelled',
         updated_at = NOW()
     FROM patients p
     WHERE a.id = $1
       AND a.patient_id = p.id
       AND p.user_id = $2
       AND a.status = 'scheduled'
     RETURNING
       a.id,
       a.patient_id,
       a.doctor_id,
       a.appointment_time,
       a.status,
       a.reason,
       a.updated_at`,
    [appointmentId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("APPOINTMENT_NOT_FOUND_OR_NOT_CANCELLABLE");
  }

  return result.rows[0];
};

export const completeAppointment = async (appointmentId, userId) => {
  const result = await pool.query(
    `UPDATE appointments a
     SET status = 'completed',
         updated_at = NOW()
     FROM doctors d
     WHERE a.id = $1
       AND a.doctor_id = d.id
       AND d.user_id = $2
       AND a.status = 'scheduled'
     RETURNING
       a.id,
       a.patient_id,
       a.doctor_id,
       a.appointment_time,
       a.status,
       a.reason,
       a.updated_at`,
    [appointmentId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("APPOINTMENT_NOT_FOUND_OR_NOT_COMPLETABLE");
  }

  return result.rows[0];
};
