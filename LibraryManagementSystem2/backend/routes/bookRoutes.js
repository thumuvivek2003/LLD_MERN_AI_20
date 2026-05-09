import { Router } from 'express';
import { BookController } from '../controllers/BookController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { UserRole } from '../enums/UserRole.js';

const router = Router();
const bookController = new BookController();

router.get('/', authMiddleware, (req, res, next) => bookController.searchBooks(req, res, next));
router.post('/', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => bookController.addBook(req, res, next));
router.put('/:id', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => bookController.editBook(req, res, next));
router.delete('/:id', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => bookController.deleteBook(req, res, next));

export default router;
