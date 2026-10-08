import { z } from "zod";
import {
  createMedicalRecord,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
  updateMedicalRecord,
} from "../services/medicalRecord.service.js";

const medicalRecordSchema = z
  .object({
    patientId: z.string().uuid(),
    diagnosis: z.string().trim().min(1).max(500),
    notes: z.string().trim().max(5000).optional(),
  })
  .strict();

export const createRecord = async (req, res) => {
  try {
    const data = medicalRecordSchema.parse(req.body);

    const record = await createMedicalRecord({
      doctorUserId: req.user.id,
      ...data,
    });

    res.status(201).json({
      message: "Medical record created successfully",
      record,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid medical record data",
        errors: error.issues,
      });
    }

    if (error.message === "DOCTOR_PATIENT_RELATIONSHIP_NOT_FOUND") {
      return res.status(403).json({
        message: "Doctor is not authorized for this patient",
      });
    }

    if (error.message === "DOCTOR_PROFILE_NOT_FOUND") {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to create medical record",
    });
  }
};

export const getMyMedicalRecords = async (req, res) => {
  try {
    const records = await getPatientMedicalRecords(req.user.id);

    res.status(200).json({
      records,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch medical records",
    });
  }
};

export const getDoctorRecords = async (req, res) => {
  try {
    const records = await getDoctorMedicalRecords(req.user.id);

    res.status(200).json({
      records,
    });
  } catch (error) {
    console.error("Get doctor medical records error:", error);

    res.status(500).json({
      message: "Failed to fetch medical records",
    });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const data = medicalRecordSchema.parse(req.body);

    const record = await updateMedicalRecord({
      doctorUserId: req.user.id,
      recordId: req.params.id,
      ...data,
    });

    res.status(200).json({
      message: "Medical record updated successfully",
      record,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid medical record data",
        errors: error.issues,
      });
    }

    if (error.message === "MEDICAL_RECORD_NOT_FOUND") {
      return res.status(404).json({
        message: "Medical record not found or access denied",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to update medical record",
    });
  }
};