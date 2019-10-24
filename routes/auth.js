const express = require('express');
const router = express.Router();
const socket = require('../server');

// User Model
const User = require('../models/User');

// Log In
router.post('/', (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password }).then(
    user => {
      if (user) {
        res.status(200).json({ authorized: true });
        socket.emit('logged-in', { msg: 'You logged in', erroeMsg: false });
      } else {
        res.status(400).json({ authorized: false });
        socket.emit('logged-in', { msg: 'Wrong password', errorMsg: true });
      }
    }
  );
});

module.exports = router;
