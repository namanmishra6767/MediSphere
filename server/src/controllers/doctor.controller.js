import {
  getAllDoctors,
  getDoctorPatients,
} from "../services/doctor.service.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors();

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
};

export const getPatientsForDoctor = async (req, res) => {
  try {
    const patients = await getDoctorPatients(req.user.id);

    return res.status(200).json({
      patients,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    return res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
};