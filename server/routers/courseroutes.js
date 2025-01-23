import express from 'express';

import {
  addcourse,
  getall,
  delcourse,
  updatecourse,
} from '../controllers/coursecontrollers.js';

const router = express.Router();
//create
router.post('/create/:id', addcourse);
//get all course
router.get('/all', getall);
//delete
router.delete('/del', delcourse);
//update
router.patch('/update/:id', updatecourse);

export default router;
