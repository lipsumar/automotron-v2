const { Router } = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');

const router = new Router();
const generatorService = require('../services/generatorService');
const previewService = require('../services/previewService');

router.get('/', ensureLoggedIn, async (req, res) => {
  const generators = await generatorService.findForUser(req.user._id);
  res.send(
    generators.map(generator => {
      return {
        _id: generator._id.toString(),
        title: generator.title,
        preview: `${process.env.REACT_APP_API_BASE_URL}/previews/${generator._id}.png`,
      };
    }),
  );
});

router.get('/:generatorId', async (req, res) => {
  const generator = await generatorService.get(req.params.generatorId);
  res.send(generator);
});

router.post('/', ensureLoggedIn, async (req, res) => {
  const { generator } = req.body;

  try {
    const savedGenerator = await generatorService.save(
      generator,
      req.user._id.toString(),
    );
    previewService.updatePreview(generator, savedGenerator._id);
    res.send({ _id: savedGenerator._id.toString() });
  } catch (err) {
    if (err.message === 'user is not owner') {
      res.status(401).send({ error: true, message: 'Forbidden' });
      return;
    }
    throw err;
  }
});

module.exports = router;
