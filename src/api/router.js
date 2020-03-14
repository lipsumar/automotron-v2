const { Router } = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const generatorController = require('./controllers/generatorController');
const authenticationController = require('./controllers/authenticationController');
require('./passport');
const db = require('./mongoose');

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
});

module.exports = router;
