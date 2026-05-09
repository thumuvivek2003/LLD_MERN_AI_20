const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const result = await authService.register(name, email, password, role, phone);
  res.status(201).json(new ApiResponse(201, result, 'Registration successful.'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(new ApiResponse(200, result, 'Login successful.'));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated.'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await authService.getAllUsers(Number(page), Number(limit));
  res.status(200).json(new ApiResponse(200, result));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await authService.toggleUserStatus(req.params.id);
  res.status(200).json(new ApiResponse(200, { user }, 'User status updated.'));
});

module.exports = { register, login, getProfile, updateProfile, getAllUsers, toggleUserStatus };
