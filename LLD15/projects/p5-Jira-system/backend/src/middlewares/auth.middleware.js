import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next({ status: 401, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET");
    req.user = decoded;
    next();
  } catch (err) {
    next({ status: 401, message: "Invalid token" });
  }
};

export default authMiddleware;