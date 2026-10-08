import { z } from "zod";
import pool from "../config/db.js";

import {
  createAppointment,
  getUserAppointments,
  cancelAppointment,
  completeAppointment,
} from "../services/appointment.service.js";

const appointmentSchema = z
  .object({
    doctorId: z.string().uuid(),
    appointmentTime: z.string().datetime(),
    reason: z.string().trim().min(1).max(1000),
  })
  .strict();

export const bookAppointment = async (req, res) => {
  try {
    const data = appointmentSchema.parse(req.body);

    const patientResult = await pool.query(
      "SELECT id FROM patients WHERE user_id = $1",
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    const appointment = await createAppointment({
      patientId: patientResult.rows[0].id,
      ...data,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid appointment data",
        errors: error.issues,
      });
    }

    if (error.message === "DOCTOR_NOT_FOUND") {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
    if (error.message === "APPOINTMENT_TIME_UNAVAILABLE") {
  return res.status(409).json({
    message: "Doctor is already booked at this time",
  });
}

    console.error(error);

    res.status(500).json({
      message: "Failed to book appointment",
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await getUserAppointments(
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    if (error.message === "ROLE_NOT_SUPPORTED") {
      return res.status(403).json({
        message: "Role not supported for appointments",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch appointments",
    });
  }
};

export const cancelUserAppointment = async (req, res) => {
  try {
    const appointment = await cancelAppointment(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    if (error.message === "APPOINTMENT_NOT_FOUND_OR_NOT_CANCELLABLE") {
      return res.status(404).json({
        message: "Appointment not found or cannot be cancelled",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to cancel appointment",
    });
  }
};

export const completeUserAppointment = async (req, res) => {
  try {
    const appointment = await completeAppointment(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      message: "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    if (error.message === "APPOINTMENT_NOT_FOUND_OR_NOT_COMPLETABLE") {
      return res.status(404).json({
        message: "Appointment not found or cannot be completed",
      });
    }
    if (error.message === "APPOINTMENT_TIME_UNAVAILABLE") {
  return res.status(409).json({
    message: "Doctor is already booked at this time",
  });
}
    console.error(error);

    res.status(500).json({
      message: "Failed to complete appointment",
    });
  }
};
