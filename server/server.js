import app from './app.js';
// to use the environment variable
import dotenv from 'dotenv';
dotenv.config({ path: './variable.env' });
import { server } from './utils/socket.js';
import mongoose from 'mongoose';

//register the route
app.get('/', (req, res) => {
  res.send('WELCOME TO MY SITE');
});

//server start listening
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is created succesfully and run on the port ${port}`);
});

//connect the database
mongoose
  .connect(process.env.CONN_STR)
  .then(() => {
    console.log('Created database succesfully');
  })
  .catch((error) => {
    console.log(`DB Connection failed due to ${error}`);
  });
