import express from 'express';
import {} from '../controllers/eventcontrollers.js';

const router = express.Router();
router.post('/create', addevent);
router.get('/all', getall);
export default router;
