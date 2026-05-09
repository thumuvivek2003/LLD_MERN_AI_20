const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or account deactivated.');
  }

  req.user = user;
  next();
});

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin role required.');
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
