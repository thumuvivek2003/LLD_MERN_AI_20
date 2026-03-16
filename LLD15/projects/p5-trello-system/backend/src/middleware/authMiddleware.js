import jwt from "jsonwebtoken";

const DEBUG = true;

export default function auth(req, res, next) {

  // 🔹 DEBUG MODE
  if (DEBUG) {
    req.user = { id: "691b643255eebd8ca0eff21c" };
    return next();
  }

  // 🔹 NORMAL MODE
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }

}