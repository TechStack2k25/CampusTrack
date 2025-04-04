import express from 'express';
import {
  mark_attendace,
  all_course_attendence,
} from '../controllers/attendancecontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';
const router = express.Router();

router.post('/mark', restrict_to(['faculty']), mark_attendace);
router.get('/get_student', all_course_attendence);
export default router;
