import express from 'express';
import { getMyNotifications, markAsRead } from './notificationController.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);

export default router;
