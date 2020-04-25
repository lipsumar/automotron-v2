const { Router } = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');

const router = new Router();
const generatorService = require('../services/generatorService');
const previewService = require('../services/previewService');

router.get('/', async (req, res) => {
  if (!req.query.userId) {
    throw new Error('userId must be given');
  }
  const generators = await generatorService.findForUser(req.query.userId);
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
      res.status(403).send({ error: true, message: 'Forbidden' });
      return;
    }
    throw err;
  }
});

router.delete('/:generatorId', async (req, res) => {
  const canDelete = await generatorService.userOwnsGenerator(
    req.params.generatorId,
    req.user._id.toString(),
  );
  if (!canDelete) {
    res.status(403).send({ error: true, message: 'Forbidden' });
    return;
  }
  await generatorService.delete(req.params.generatorId);
  res.send({ ok: true });
});

module.exports = router;
