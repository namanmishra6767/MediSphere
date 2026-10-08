import {
  getAllAppointmentsForAdmin,
} from "../services/adminAppointment.service.js";

export const getAdminAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsForAdmin();

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Get admin appointments error:", error);

    res.status(500).json({
      message: "Failed to fetch appointments",
    });
  }
};