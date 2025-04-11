import express from 'express';
import {
  dashboardmessages,
  getmessages,
  sendmessage,
} from '../controllers/messagecontrollers.js';
import { cachecontrol, restrict_to } from '../controllers/authcontrollers.js';

const router = express.Router();
router.use(cachecontrol);

router.get('/dashboard_message', dashboardmessages);
router.get('/getmessage/:id', getmessages);
router.use(restrict_to(['Admin', 'HOD', 'faculty']));
router.post('/send/:id', sendmessage);
export default router;
