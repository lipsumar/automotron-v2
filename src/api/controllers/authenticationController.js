import { Router } from 'express';
import passport from 'passport';
import User from '../models/User';
import { hashPassword } from '../utils';

const router = new Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
  });
});

router.post('/logged-in', (req, res) => {
  if (req.user) {
    res.send({
      _id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    });
    return;
  }
  res.send(false);
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

router.post('/logout', (req, res) => {
  req.logout();
  res.send('ok');
});

module.exports = router;
