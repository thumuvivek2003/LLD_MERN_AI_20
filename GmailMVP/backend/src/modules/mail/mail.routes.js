import { Router } from 'express';
import * as mailController from './mail.controller.js';

const router = Router();

// POST /api/mails/send
router.post('/send', mailController.sendMail);
// GET /api/mails/inbox?userId=
router.get('/inbox', mailController.getInbox);
// GET /api/mails/sent?userId=
router.get('/sent', mailController.getSent);
// POST /api/mails/:id/reply
router.post('/:id/reply', mailController.replyMail);
// GET /api/mails/:id?userId=  (marks read)
router.get('/:id', mailController.getMail);

export default router;
