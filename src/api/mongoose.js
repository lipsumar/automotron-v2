import mongoose from 'mongoose';

console.log('Connectin to mongo', process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
