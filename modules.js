const setToken = require('../controllers/authenticationPlugins/common').setToken;

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
    path: `/auth/mock/login`,
    config: {
      handler: loginHandler,
    },
  }]);
  next();
}

plugin.attributes = {
  name: 'mockDB routing',
  version: '1.0.0',
}

module.exports = {
  authentication: [
    {
      type: 'mock',
      support: ['login'],
    },
  ],
  mailPass: [{
    deny: 'all',
  }],
  plugins: [plugin],
};
