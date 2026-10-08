export const createAuditLog = async (
  client,
  {
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress,
  }
) => {
  await client.query(
    `INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      ip_address
    )
    VALUES ($1, $2, $3, $4, $5)`,
    [
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress ?? null,
    ]
  );
};