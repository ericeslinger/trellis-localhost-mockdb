const setToken = require('../controllers/authenticationPlugins/common').setToken;
const User = require('../models/user');

function mockHandler(req, reply) {
  return User.forge({id: 1})
  .fetch()
  .then((u) => {
    return setToken(u);
  }).then((t) => {
    return reply.view('token', {token: t});
  });
}


function plugin(server, options, next) {
  server.route([{
    method: 'GET',
    path: '/auth/mock/login',
    config: {
      handler: mockHandler,
    },
  }]);
  next();
}

plugin.attributes = {
  name: 'mockDB routing',
  version: '1.0.0',
};

module.exports = {
  authentication: [
    {
      type: 'mock',
      support: ['login'],
      flags: ['noroutes'],
    },
  ],
  mailPass: [{
    deny: 'all',
  }],
  plugins: [plugin],
};
