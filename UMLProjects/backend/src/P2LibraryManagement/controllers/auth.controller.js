import * as authService from '../services/auth.service.js';
import * as userRepo from '../repositories/user.repo.js';
import { success, error } from '../utils/responses.js';

export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    success(res, result, 'User registered successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    success(res, result, 'Login successful');
  } catch (err) {
    error(res, err.message, 401);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await userRepo.findUserById(req.user.id);
    success(res, user, 'Profile fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};