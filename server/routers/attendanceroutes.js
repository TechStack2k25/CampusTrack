import express from 'express';
import { mark_attendace } from '../controllers/attendancecontrollers.js';
const router = express.Router();

router.post('/mark', mark_attendace);

export default router;
