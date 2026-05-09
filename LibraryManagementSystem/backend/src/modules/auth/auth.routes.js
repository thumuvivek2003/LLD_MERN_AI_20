const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const {
  register, login, getProfile, updateProfile, getAllUsers, toggleUserStatus,
} = require('./auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.patch('/users/:id/toggle-status', authenticate, authorizeAdmin, toggleUserStatus);

module.exports = router;
