import express from 'express';

import {
  addcourse,
  getall,
  delcourse,
  updatecourse,
  add_course_by_student,
  remove_student,
} from '../controllers/coursecontrollers.js';
import { restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
//student request to add course
router.post('/add_course/:id', add_course_by_student);
//get all course
router.get('/all/:id', getall);
//remove student by course id
router.post('/remove_student/:id', restrict_to('faculty'), remove_student);
router.use(restrict_to('HOD'));
//create
router.post('/create/:id', addcourse);
//delete
router.delete('/del/:id', delcourse);
//update
router.patch('/update/:id', updatecourse);

export default router;
