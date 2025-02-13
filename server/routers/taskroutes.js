import express from 'express';
import { restrict_to } from '../controllers/authcontrollers.js';
import {
  addtask,
  getall,
  deltask,
  updatetask,
  submittask,
  getall_submission,
} from '../controllers/taskcontrollers.js';
import { upload } from '../controllers/filescontrollers.js';

const router = express.Router();
//submit the assignment
router.post('/submit/:id', upload.single('file'), submittask);
//get all task
router.get('/all/:id', getall);
//allow faculty to change in task
router.use(restrict_to('faculty'));
router.use('/get_submission', getall_submission);
//create
router.post('/create/:id', addtask);
//delete
router.delete('/del/:id', deltask);
//update
router.patch('/update/:id', updatetask);
export default router;
