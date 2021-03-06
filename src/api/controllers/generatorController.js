import { Router } from 'express';
import cors from 'cors';
import ensureLoggedIn from '../middlewares/ensureLoggedIn';
import generatorService from '../services/generatorService';
import previewService from '../services/previewService';
import stringifyGraphResult from '../../core/stringifyGraphResult';

const router = new Router();

async function getGeneratorsForUser(userId) {
  const generators = await generatorService.findForUser(userId);
  return generators.map(generator => {
    return {
      _id: generator._id.toString(),
      title: generator.title,
      preview: `${process.env.REACT_APP_API_BASE_URL}/previews/${generator._id}.png`,
    };
  });
}

router.get('/', async (req, res, next) => {
  if (!req.query.userId) {
    next(new Error('userId must be given'));
  }
  res.send(await getGeneratorsForUser(req.query.userId));
});

router.get('/my', async (req, res) => {
  const userId = req.user._id.toString();
  if (!userId) {
    res.status(401).end();
  }
  res.send(await getGeneratorsForUser(userId));
});

router.get('/:generatorIds', async (req, res) => {
  const ids = req.params.generatorIds.split(',');
  if (ids.length === 1) {
    const generator = await generatorService.get(ids[0]);
    res.send(generator);
    return;
  }

  const generators = await generatorService.getMany(ids);
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

router.get('/:generatorId/run', cors(), async (req, res) => {
  const generatorModel = await generatorService.get(req.params.generatorId);
  const result = await generatorService.run(generatorModel);
  const format = req.query.format;
  if (format === 'text') {
    res.set('content-type', 'text/plain').send(stringifyGraphResult(result));
  } else if (format === 'html') {
    res.set('content-type', 'text/html').send(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${generatorModel.title}</title>
      </head>
      <body>
        <div>
        ${stringifyGraphResult(result)}
        </div>
      </body>
      </html>`);
  } else {
    // json (default)
    res.send({
      text: stringifyGraphResult(result),
      result,
    });
  }
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
