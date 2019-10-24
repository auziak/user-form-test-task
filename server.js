const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = (module.exports = require('socket.io')(http));
const mongoose = require('mongoose');

const db = require('./config/keys').mongoURI;

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch(err => console.log(err));

app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/val', require('./routes/val'));

const PORT = process.env.port || 5000;
http.listen(PORT, () => console.log('Server started at port: ' + PORT));
