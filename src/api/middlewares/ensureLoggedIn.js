module.exports = function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(401).send('Must be logged-in');
  } else {
    next();
  }
};
