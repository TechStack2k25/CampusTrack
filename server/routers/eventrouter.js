import express from 'express';
import { addevent, getall } from '../controllers/eventcontrollers.js';
import { get_schedule } from '../controllers/schedulecontrollers.js';

const router = express.Router();
router.post('/create', addevent);
router.get('/all', getall);
router.post('/schedule', get_schedule);
export default router;
