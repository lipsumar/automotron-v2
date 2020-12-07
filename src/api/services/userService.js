import User from '../models/User';

module.exports = {
  async findAll() {
    return User.find({});
  },

  async get(userId) {
    return User.findOne({ _id: userId });
  },
};
