import Generator from '../models/Generator';

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

  async userOwnsGenerator(generatorId, userId) {
    const generator = await Generator.findOne({ _id: generatorId });
    return generator.userId === userId;
  },

  async delete(generatorId) {
    await Generator.deleteOne({ _id: generatorId });
  },
};
