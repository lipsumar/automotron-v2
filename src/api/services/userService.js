import md5 from 'md5';
import User from '../models/User';

module.exports = {
  async findAll() {
    return User.find({});
  },

  async get(userId) {
    return User.findOne({ _id: userId });
  },

  async renewResetPasswordToken(userId) {
    const user = await this.get(userId);
    user.resetPasswordToken = md5(`${Math.random()}mlfxh_5jk2i;uy`);
    await user.save();
    return user.resetPasswordToken;
  },
};
