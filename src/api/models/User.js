import mongoose from 'mongoose';
import shortid from 'shortid';

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: String,
  email: String,
  password: String,
  resetPasswordToken: String,
  role: {
    type: String,
    default: 'user',
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
