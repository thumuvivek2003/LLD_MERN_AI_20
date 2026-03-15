export const authMiddleware = (req, res, next) => {

  // normally decode JWT

  req.user = {
    id: "user123"
  };

  next();
};