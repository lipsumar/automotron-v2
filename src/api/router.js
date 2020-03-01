const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  res.send({ 'Automotron API': true });
});

module.exports = router;
