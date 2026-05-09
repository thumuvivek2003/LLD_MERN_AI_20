const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const { borrowBook, returnBook, getBorrowHistory, getAllActiveBorrows } = require('./borrow.controller');

router.post('/', authenticate, borrowBook);
router.patch('/:id/return', authenticate, returnBook);
router.get('/history', authenticate, getBorrowHistory);
router.get('/active', authenticate, authorizeAdmin, getAllActiveBorrows);

module.exports = router;
