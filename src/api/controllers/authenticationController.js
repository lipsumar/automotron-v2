import { Router } from 'express';
import passport from 'passport';
import emailValidator from 'email-validator';
import User from '../models/User';
import { hashPassword } from '../utils';
import emailService from '../services/emailService';
import userService from '../services/userService';

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
          res.status(500).end();
          console.log(err);
          return;
        }
        res.send({ ...user, password: undefined });
      });
    });
  });
});

const resetPasswordSubject = {
  fr: 'Réinitialisation du mot de passe',
  en: 'Reset password',
};
router.post('/request-reset-password', async (req, res) => {
  const { email, language } = req.body;

  if (!resetPasswordSubject[language]) {
    res.status(400).end();
    return;
  }

  if (emailValidator.validate(email)) {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .send({ error: true, message: 'resetPassword.error.noAccount' });
      return;
    }
    const token = await userService.renewResetPasswordToken(user._id);
    await emailService.sendTemplate(
      email,
      resetPasswordSubject[language],
      `reset-password-${language}`,
      { link: `https://automotron.io/reset-password/?token=${token}` },
    );
    res.end();
  } else {
    res
      .status(400)
      .send({ error: true, message: 'resetPassword.error.invalidEmail' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetPasswordToken: token });
  if (!user) {
    res
      .status(400)
      .send({ error: true, message: 'resetPassword.error.invalidToken' });
    return;
  }
  user.password = hashPassword(newPassword);
  user.resetPasswordToken = '';
  user.save().then(() => {
    req.login(user, err => {
      if (err) {
        res.status(500).end();
        console.log(err);
        return;
      }
      res.send({ ...user, password: undefined });
    });
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  res.send('ok');
});

module.exports = router;
