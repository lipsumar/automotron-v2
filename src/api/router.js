import { Router } from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import ConnectMongo from 'connect-mongo';
import generatorController from './controllers/generatorController';
import userController from './controllers/userController';
import authenticationController from './controllers/authenticationController';
import './passport';
import db from './mongoose';
import isAdminMiddleware from './middlewares/isAdminMiddleware';

const MongoStore = ConnectMongo(expressSession);

const router = new Router();

router.get('/', (req, res) => {
  res.send({ 'Automotron API': true });
});

db.once('open', () => {
  router.use(bodyParser.json());
  router.use(
    expressSession({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: db }),
    }),
  );
  router.use(passport.initialize());
  router.use(passport.session());
  router.use(authenticationController);

  router.use('/generators', generatorController);
  router.use('/users', isAdminMiddleware, userController);
  router.get('*', (req, res) => {
    res.status(404).send({ error: 'no resource match this url' });
  });
});

module.exports = router;
