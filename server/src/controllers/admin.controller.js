import { z } from "zod";
import {
  createDoctor,
  getAllUsers,
} from "../services/admin.service.js";

const doctorSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    specialization: z.string().trim().min(1).max(100),
  })
  .strict();

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const createDoctorAccount = async (req, res) => {
  try {
    const data = doctorSchema.parse(req.body);

    const result = await createDoctor(data);

    res.status(201).json({
      message: "Doctor account created successfully",
      ...result,
    });
  } catch (error) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid doctor data",
      });
    }

    if (error.status === 409) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Create doctor account error:", error);

    res.status(500).json({
      message: "Failed to create doctor account",
    });
  }
};