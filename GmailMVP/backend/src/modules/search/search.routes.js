import { Router } from 'express';
import * as searchController from './search.controller.js';

const router = Router();

// GET /api/search?userId=&q=&type=
router.get('/', searchController.searchMails);

export default router;
