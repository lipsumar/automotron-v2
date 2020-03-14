const { Router } = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');

const router = new Router();
const Generator = require('../models/Generator');

router.get('/', ensureLoggedIn, (req, res) => {
  Generator.find({ userId: req.user._id }).then(generators => {
    res.send(
      generators.map(generator => {
        console.log(generator);
        return { _id: generator._id.toString(), title: generator.title };
      }),
    );
  });
});

router.post('/', ensureLoggedIn, async (req, res) => {
  const { generator } = req.body;

  let generatorModel = await Generator.findById(generator._id);

  if (generatorModel && generatorModel.userId !== req.user._id.toString()) {
    res.status(403).send({ error: true, message: 'Forbidden' });
  } else if (!generatorModel) {
    generatorModel = new Generator({ userId: req.user._id.toString() });
  }

  generatorModel.graphData = JSON.stringify(generator.graph);
  generatorModel.title = generator.title;

  await generatorModel.save();

  res.send({ _id: generatorModel._id.toString() });
});

module.exports = router;
