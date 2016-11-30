import setToken from '../controllers/authenticationPlugins/common';
import { services } from '../services';

function mockHandler(req, reply) {
  return services.guild.find('users', 1)
  .$get()
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

export const modules = {
  mailPass: [
    {deny: 'all'},
  ],
  authentication: [
    {
      type: 'mock',
      support: ['login'],
      flags: ['noroutes'],
    },
  ],
  plugins: [
    plugin,
  ],
};
