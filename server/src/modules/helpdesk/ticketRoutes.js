import express from 'express';
import { createTicket, getTickets, replyTicket } from './ticketController.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.route('/')
  .post(createTicket)
  .get(getTickets);

router.post('/:id/reply', replyTicket);

export default router;
