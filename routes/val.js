const express = require('express');
const router = express.Router();
const socket = require('../server');

// User Model
const User = require('../models/User');

// User Validation
router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Please enter email' });
  }

  User.findOne({ email }).then(user => {
    if (user) {
      res.json({ msg: 'User allready exists' });
      socket.emit('email-validation', { available: false });
    } else {
      res.json({ msg: 'This email is available' });
      socket.emit('email-validation', { available: true });
    }
  });
});

module.exports = router;
