import express from 'express';
import morgan from 'morgan';

const app = express();

// extract json payload from request body and make available in req.body;
app.use(express.json());

export default app;
