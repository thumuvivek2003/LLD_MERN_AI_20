const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const { getSummary } = require('./dashboard.controller');

router.get('/summary', authenticate, authorizeAdmin, getSummary);

module.exports = router;
