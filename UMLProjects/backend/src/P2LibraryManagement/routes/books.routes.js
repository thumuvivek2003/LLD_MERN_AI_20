import express from 'express';
import * as bookController from '../controllers/book.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'librarian']), bookController.addBook);
router.get('/', bookController.listBooks);
router.get('/:id', bookController.getBook);
router.put('/:id', authenticate, authorize(['admin', 'librarian']), bookController.updateBook);
router.delete('/:id', authenticate, authorize(['admin']), bookController.deleteBook);
router.post('/:id/reserve', authenticate, authorize(['member']), bookController.reserveBook);
router.delete('/:id/reservation/:resId', authenticate, bookController.cancelReservation);
router.post('/:id/issue', authenticate, authorize(['librarian', 'admin']), bookController.issueBook);
router.post('/:id/return', authenticate, authorize(['librarian', 'admin']), bookController.returnBook);

export default router;