import pool from "../config/db.js";

export const getAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         al.id,
         al.user_id,
         al.action,
         al.resource_type,
         al.resource_id,
         al.ip_address,
         al.created_at,
         u.email AS user_email,
         u.role AS user_role
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 100`
    );

    res.status(200).json({
      logs: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};