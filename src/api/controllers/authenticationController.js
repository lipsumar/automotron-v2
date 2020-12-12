import { Router } from 'express';
import passport from 'passport';
import User from '../models/User';
import { hashPassword } from '../utils';

const router = new Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
});

router.post('/logged-in', (req, res) => {
  if (req.user) {
    res.send({
      _id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });
    return;
  }
  res.send(false);
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(existingUser => {
    if (existingUser) {
      res
        .status(500)
        .send({ error: true, message: 'register.error.emailAlreadyExist' });
      return;
    }

    const user = new User({ email, password: hashPassword(password) });
    user.save().then(() => {
      req.login(user, err => {
        if (err) {
          res.status(500).send();
          console.log(err);
          return;
        }
        res.send({ ...user, password: undefined });
      });
    });
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  res.send('ok');
});

module.exports = router;
