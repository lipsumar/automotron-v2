const mongoose = require('mongoose');
const shortid = require('shortid');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: String,
  password: String,
  role: {
    type: String,
    default: 'user',
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
