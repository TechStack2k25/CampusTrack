import express from 'express';
import {
  mark_attendace,
  all_course_attendence,
} from '../controllers/attendancecontrollers.js';
const router = express.Router();

router.post('/mark', mark_attendace);
router.get('/get_student', all_course_attendence);
export default router;
