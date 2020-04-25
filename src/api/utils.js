import md5 from 'md5';

function hashPassword(password) {
  return md5(password + process.env.PASSWORD_SALT);
}

module.exports = { hashPassword };
