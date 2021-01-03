import mongoose from 'mongoose';
import shortid from 'shortid';

const GeneratorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    graphData: String,
    userId: String,
    title: String,
  },
  { timestamps: true },
);

const Generator = mongoose.model('Generator', GeneratorSchema);

module.exports = Generator;
