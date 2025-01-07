import app from './app.js';

//register the route
app.get('/', (req, res) => {
  res.send('WELCOME TO MY SITE');
});

//server start listening
const port = 3000;
app.listen(port, () => {
  console.log(`Server is created succesfully and run on the port ${port}`);
});
