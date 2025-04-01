import express from 'express';
import {
  dashboardmessages,
  getmessages,
  sendmessage,
} from '../controllers/messagecontrollers.js';

const router = express.Router();

router.get('/getmessage/:id', getmessages);
router.post('/send/:id', sendmessage);
router.get('/dashboard_message', dashboardmessages);
export default router;
