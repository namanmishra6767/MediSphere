import { z } from "zod";
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";
import pool from "../config/db.js";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["patient"]),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    dateOfBirth: z.string().optional(),
    specialization: z.string().trim().max(100).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
  if (!data.dateOfBirth) {
    ctx.addIssue({
      code: "custom",
      path: ["dateOfBirth"],
      message: "Date of birth is required",
    });
  }

    if (data.role === "doctor" && !data.specialization) {
      ctx.addIssue({
        code: "custom",
        path: ["specialization"],
        message: "Specialization is required for doctors",
      });
    }
  });

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid registration data",
        errors: error.issues,
      });
    }

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict()
  .parse(req.body);

    const { token, user } = await loginUser(data);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user,
      });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid login data",
        errors: error.issues,
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};