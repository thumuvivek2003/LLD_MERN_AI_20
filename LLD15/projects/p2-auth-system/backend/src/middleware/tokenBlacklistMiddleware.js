import BlacklistedToken from "../models/BlacklistedToken.js";

const tokenBlacklistMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  const blocked = await BlacklistedToken.findOne({
    token
  });

  if (blocked) {

    return res.status(401).json({
      message: "Token revoked"
    });

  }

  next();
};

export default tokenBlacklistMiddleware;