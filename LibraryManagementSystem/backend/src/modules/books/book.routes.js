const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const { createBook, updateBook, deleteBook, getBook, getBooks } = require('./book.controller');

router.get('/', authenticate, getBooks);
router.get('/:id', authenticate, getBook);
router.post('/', authenticate, authorizeAdmin, createBook);
router.put('/:id', authenticate, authorizeAdmin, updateBook);
router.delete('/:id', authenticate, authorizeAdmin, deleteBook);

module.exports = router;
