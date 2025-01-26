import express from 'express';
import {
  getall_request,
  updaterequest,
} from '../controllers/requestcontrollers.js';

const router = express.Router();
router.post('/getall', getall_request);
router.post('/update', updaterequest);

export default router;
