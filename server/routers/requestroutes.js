import express from 'express';
import {
  getall_request,
  updaterequest,
} from '../controllers/requestcontrollers.js';

const router = express.Router();
router.post('/getall', getall_request);
router.patch('/update', updaterequest);

export default router;
