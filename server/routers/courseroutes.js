import express from 'express';

import {
  addcourse,
  getall,
  delcourse,
  updatecourse,
  add_course_by_student,
} from '../controllers/coursecontrollers.js';

const router = express.Router();
//create
router.post('/create/:id', addcourse);
//get all course
router.get('/all/:id', getall);
//delete
router.delete('/del/:id', delcourse);
//update
router.patch('/update/:id', updatecourse);
//student request to add course
router.post('/add_course/:id', add_course_by_student);

export default router;
