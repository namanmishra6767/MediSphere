import { withUserContext } from "../config/db.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { createAuditLog } from "./audit.service.js";

export const createMedicalRecord = async ({
  doctorUserId,
  patientId,
  diagnosis,
  notes,
}) => {
  return withUserContext(doctorUserId, async (client) => {
    const relationshipResult = await client.query(
      `SELECT 1
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE d.user_id = $1
         AND a.patient_id = $2
         AND a.status = 'completed'
       LIMIT 1`,
      [doctorUserId, patientId]
    );

    if (relationshipResult.rows.length === 0) {
      throw new Error("DOCTOR_PATIENT_RELATIONSHIP_NOT_FOUND");
    }

    const doctorResult = await client.query(
      `SELECT id
       FROM doctors
       WHERE user_id = $1`,
      [doctorUserId]
    );

    if (doctorResult.rows.length === 0) {
      throw new Error("DOCTOR_PROFILE_NOT_FOUND");
    }

    const doctorId = doctorResult.rows[0].id;

    const encryptedDiagnosis = encrypt(diagnosis);
    const encryptedNotes = notes ? encrypt(notes) : null;

    const result = await client.query(
      `INSERT INTO medical_records (
        patient_id,
        doctor_id,
        diagnosis_ciphertext,
        diagnosis_iv,
        diagnosis_auth_tag,
        notes_ciphertext,
        notes_iv,
        notes_auth_tag
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        patient_id,
        doctor_id,
        created_at,
        updated_at`,
      [
        patientId,
        doctorId,
        encryptedDiagnosis.ciphertext,
        encryptedDiagnosis.iv,
        encryptedDiagnosis.authTag,
        encryptedNotes?.ciphertext ?? null,
        encryptedNotes?.iv ?? null,
        encryptedNotes?.authTag ?? null,
      ]
    );

    await createAuditLog(client, {
      userId: doctorUserId,
      action: "CREATE",
      resourceType: "medical_record",
      resourceId: result.rows[0].id,
      ipAddress: null,
    });

    return {
      ...result.rows[0],
      diagnosis,
      notes: notes ?? null,
    };
  });
};

export const getPatientMedicalRecords = async (userId) => {
  return withUserContext(userId, async (client) => {
    const result = await client.query(
      `SELECT
         mr.id,
         mr.diagnosis_ciphertext,
         mr.diagnosis_iv,
         mr.diagnosis_auth_tag,
         mr.notes_ciphertext,
         mr.notes_iv,
         mr.notes_auth_tag,
         mr.created_at,
         mr.updated_at,
         d.id AS doctor_id,
         d.first_name AS doctor_first_name,
         d.last_name AS doctor_last_name,
         d.specialization
       FROM medical_records mr
       JOIN patients p ON mr.patient_id = p.id
       JOIN doctors d ON mr.doctor_id = d.id
       WHERE p.user_id = $1
       ORDER BY mr.created_at DESC`,
      [userId]
    );

    for (const record of result.rows) {
      await createAuditLog(client, {
        userId,
        action: "READ",
        resourceType: "medical_record",
        resourceId: record.id,
        ipAddress: null,
      });
    }

    return result.rows.map((record) => ({
      id: record.id,
      diagnosis: decrypt({
        ciphertext: record.diagnosis_ciphertext,
        iv: record.diagnosis_iv,
        authTag: record.diagnosis_auth_tag,
      }),
      notes: record.notes_ciphertext
        ? decrypt({
            ciphertext: record.notes_ciphertext,
            iv: record.notes_iv,
            authTag: record.notes_auth_tag,
          })
        : null,
      created_at: record.created_at,
      updated_at: record.updated_at,
      doctor_id: record.doctor_id,
      doctor_first_name: record.doctor_first_name,
      doctor_last_name: record.doctor_last_name,
      specialization: record.specialization,
    }));
  });
};

export const getDoctorMedicalRecords = async (doctorUserId) => {
  return withUserContext(doctorUserId, async (client) => {
    const result = await client.query(
      `SELECT
         mr.id,
         mr.patient_id,
         mr.diagnosis_ciphertext,
         mr.diagnosis_iv,
         mr.diagnosis_auth_tag,
         mr.notes_ciphertext,
         mr.notes_iv,
         mr.notes_auth_tag,
         mr.created_at,
         mr.updated_at,
         p.first_name AS patient_first_name,
         p.last_name AS patient_last_name
       FROM medical_records mr
       JOIN doctors d ON mr.doctor_id = d.id
       JOIN patients p ON mr.patient_id = p.id
       WHERE d.user_id = $1
       ORDER BY mr.created_at DESC`,
      [doctorUserId]
    );

    for (const record of result.rows) {
      await createAuditLog(client, {
        userId: doctorUserId,
        action: "READ",
        resourceType: "medical_record",
        resourceId: record.id,
        ipAddress: null,
      });
    }

    return result.rows.map((record) => ({
      id: record.id,
      patient_id: record.patient_id,
      patient_first_name: record.patient_first_name,
      patient_last_name: record.patient_last_name,
      diagnosis: decrypt({
        ciphertext: record.diagnosis_ciphertext,
        iv: record.diagnosis_iv,
        authTag: record.diagnosis_auth_tag,
      }),
      notes: record.notes_ciphertext
        ? decrypt({
            ciphertext: record.notes_ciphertext,
            iv: record.notes_iv,
            authTag: record.notes_auth_tag,
          })
        : null,
      created_at: record.created_at,
      updated_at: record.updated_at,
    }));
  });
};

export const updateMedicalRecord = async ({
  doctorUserId,
  recordId,
  diagnosis,
  notes,
}) => {
  return withUserContext(doctorUserId, async (client) => {
    const encryptedDiagnosis = encrypt(diagnosis);
    const encryptedNotes = notes ? encrypt(notes) : null;

    const result = await client.query(
      `UPDATE medical_records
       SET
         diagnosis_ciphertext = $1,
         diagnosis_iv = $2,
         diagnosis_auth_tag = $3,
         notes_ciphertext = $4,
         notes_iv = $5,
         notes_auth_tag = $6,
         updated_at = NOW()
       WHERE id = $7
       RETURNING
         id,
         patient_id,
         doctor_id,
         created_at,
         updated_at`,
      [
        encryptedDiagnosis.ciphertext,
        encryptedDiagnosis.iv,
        encryptedDiagnosis.authTag,
        encryptedNotes?.ciphertext ?? null,
        encryptedNotes?.iv ?? null,
        encryptedNotes?.authTag ?? null,
        recordId,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("MEDICAL_RECORD_NOT_FOUND");
    }

    await createAuditLog(client, {
      userId: doctorUserId,
      action: "UPDATE",
      resourceType: "medical_record",
      resourceId: result.rows[0].id,
      ipAddress: null,
    });

    return {
      ...result.rows[0],
      diagnosis,
      notes: notes ?? null,
    };
  });
};