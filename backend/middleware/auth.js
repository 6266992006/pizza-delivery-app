import jwt from "jsonwebtoken";

// Verifies a JWT for a logged-in user and attaches the decoded payload to req.user
export const protectUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Not authorized as user" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid token, please log in again" });
  }
};

// Verifies a JWT issued to the admin account (separate role, separate login flow)
export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid token, please log in again" });
  }
};
