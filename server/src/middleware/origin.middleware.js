const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const verifyRequestOrigin = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const allowedOrigin =
    process.env.CLIENT_URL || "http://localhost:5173";

  const origin = req.get("origin");
  const fetchSite = req.get("sec-fetch-site");

  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({
      message: "Request origin not allowed",
    });
  }

  if (!origin && fetchSite === "cross-site") {
    return res.status(403).json({
      message: "Cross-site request not allowed",
    });
  }

  return next();
};
