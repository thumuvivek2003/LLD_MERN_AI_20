const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const { getUserFines, payFine, getAllFines } = require('./fine.controller');

router.get('/my', authenticate, getUserFines);
router.patch('/:id/pay', authenticate, payFine);
router.get('/', authenticate, authorizeAdmin, getAllFines);

module.exports = router;
