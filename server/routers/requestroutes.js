import express from 'express';
import {
  getall_request,
  updaterequest,
} from '../controllers/requestcontrollers.js';

const router = express.Router();
router.get('/getall', getall_request);
router.patch('/update/:id', updaterequest);

export default router;
