import * as userService from '../services/user.service.js';
import { success, error } from '../utils/responses.js';

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    success(res, user, 'User created successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    success(res, users, 'Users fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    success(res, user, 'User fetched successfully');
  } catch (err) {
    error(res, err.message, 404);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    success(res, user, 'User updated successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    success(res, null, 'User deleted successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};