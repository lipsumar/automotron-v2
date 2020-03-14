const { Router } = require('express');
const passport = require('passport');

const router = new Router();
const User = require('../models/User');
const { hashPassword } = require('../utils');

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
  });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then(existingUser => {
    if (existingUser) {
      res.send({ error: true, message: 'username already exists' });
      return;
    }

    const user = new User({ username, password: hashPassword(password) });
    user.save().then(() => {
      req.login(user, err => {
        if (err) {
          res.status(500).send();
          console.log(err);
          return;
        }
        res.send(user);
      });
    });
  });
});

module.exports = router;
