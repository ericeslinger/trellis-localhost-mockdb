const User = require('../../models/user');
const redis = require('redis').redis;
const crypto = require('crypto');

function setToken(user) {
  return crypto.randomBytesAsync(24).then((buf) => {
    const tokenKey = `TOKEN: ${buf.toString('hex')}`;
    return redis.setexAsync(tokenKey, 24 * 60 * 60 * 7, JSON.stringify(user))
    .then(() => {
      return buf.toString('hex');
    });
  });
}

function mockHandler(req, reply) {
  return User.forge({id: 0})
  .fetch()
  .then((u) => {
    return setToken(u);
  }).then((t) => {
    return reply.view('token', {token: t});
  });
}
