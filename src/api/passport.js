import passport from 'passport';
import { Strategy } from 'passport-local';

import User from './models/User';

import { hashPassword } from './utils';

passport.use(
  new Strategy((username, password, cb) => {
    User.findOne({ username }).then(user => {
      if (user && user.password === hashPassword(password)) {
        cb(null, user);
      } else {
        cb(null, false);
      }
    });
  }),
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      cb(err);
    } else {
      cb(null, user);
    }
  });
});
