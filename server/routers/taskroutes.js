import express from 'express';
import { restrict_to } from '../controllers/authcontrollers.js';
import {
  addtask,
  getall,
  deltask,
  updatetask,
  submittask,
} from '../controllers/taskcontrollers.js';

const router = express.Router();
//submit the assignment
router.post('/submit/:id', submittask);
//allow facilty to change in task
router.use(restrict_to('facilty'));
//create
router.post('/create/:id', addtask);
//get all task
router.get('/all/:id', getall);
//delete
router.delete('/del/:id', deltask);
//update
router.patch('/update/:id', updatetask);
export default router;
