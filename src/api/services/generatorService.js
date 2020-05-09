import Generator from '../models/Generator';
import GraphEvaluator from '../../core/GraphEvaluator';
import Graph from '../../core/Graph';

module.exports = {
  async save(generator, userId) {
    let generatorModel = await Generator.findById(generator._id);

    if (generatorModel && generatorModel.userId !== userId) {
      throw new Error('user is not owner');
    } else if (!generatorModel) {
      generatorModel = new Generator({ userId });
    }

    generatorModel.graphData = JSON.stringify(generator.graph);
    generatorModel.title = generator.title;

    await generatorModel.save();

    return generatorModel;
  },

  async findForUser(userId) {
    return Generator.find({ userId });
  },

  async get(generatorId) {
    const generator = await Generator.findOne({ _id: generatorId });

    return {
      _id: generator._id.toString(),
      title: generator.title,
      userId: generator.userId,
      graph: JSON.parse(generator.graphData),
    };
  },

  async getMany(generatorIds) {
    const generators = await Generator.find({ _id: { $in: generatorIds } });
    return generators;
  },

  async userOwnsGenerator(generatorId, userId) {
    const generator = await Generator.findOne({ _id: generatorId });
    return generator.userId === userId;
  },

  async delete(generatorId) {
    await Generator.deleteOne({ _id: generatorId });
  },

  async run(generator) {
    const graph = Graph.fromJSON(generator.graph);
    const evaluator = new GraphEvaluator(graph);
    const result = await evaluator.play();
    return result;
  },
};
