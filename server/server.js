import app from './app.js';
// to use the environment variable
import dotenv from 'dotenv';
dotenv.config({ path: './variable.env' });

import mongoose from 'mongoose';

//register the route
app.get('/', (req, res) => {
  res.send('WELCOME TO MY SITE');
});

//server start listening
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is created succesfully and run on the port ${port}`);
});

//connect the database
mongoose
  .connect(process.env.CONN_STR)
  .then(() => {
    console.log('Created database succesfully');
  })
  .catch((error) => {
    console.log(`DB Cconnection failed due to ${error}`);
  });
