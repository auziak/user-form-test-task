const express = require('express');
const router = express.Router();
const socket = require('../server');

// User Model
const User = require('../models/User');

// Add User
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'User allready exists' });
    }
  });

  const newUser = new User({
    email: email,
    password: password
  });

  newUser.save().then(user => {
    res.status(200).json(user);
    socket.emit('user-added', { msg: `User: ${user.email} added` });
  });
});

// Delete User
router.delete('/', (req, res) => {
  User.deleteOne({ email: req.body.email, password: req.body.password }).then(
    user => {
      // console.log(user);
      if (user.deletedCount !== 0) {
        res.status(200).json({ email: req.body.email });
        socket.emit('user-removed', { msg: `User: ${req.body.email} deleted` });
      } else {
        res.status(400).json({ msg: req.body.email });
        socket.emit('user-removed', { msg: 'Wrong Password' });
      }
    }
  );
});

module.exports = router;
