/* eslint max-len: "off" */
// require('newrelic') (only for prod)
module.exports = {
  NODE_ENV: 'development',
  DATABASE_USER: 'flo',
  DATABASE_PASSWORD: 'fumfum',
  DATABASE_NAME: 'florence_development',
  SERVER_IDENTITY: 'localhost',
  DATABASE_DEBUG: process.env.DBDEBUG === 'true',
  GOOGLE_API_KEY: null,
  GOOGLE_API_SECRET: null,
  TWITTER_API_KEY: null,
  TWITTER_API_SECRET: null,
  MANDRILL_API_KEY: null,
  AWS_ACCESS_KEY_ID: null,
  AWS_SECRET_ACCESS_KEY: null,
  AWS_REGION: null,
  BELL_SECRET: 'snakeoil-replace-this-key',
  JWT_SECRET: 'snakeoil-replace-this-key',
  BASE_URL: null,
  DRAFT_REDIS_DB: 1,
  EVENT_WORKER_REDIS_DB: 2,
  SHOWN_REDIS_DB: 3,
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379,
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  POSTGRES_POOL_MAX: 20,
  POSTGRES_POOL_MIN: 0,
  WEBHOOK_POST_URL: null,
  MANDRILL_WEBHOOK_SIGNING_KEY: null,
  OUTBOUND_EMAIL_PREFIX: 'ALPHA',
};

process.env.AWS_SECRET_ACCESS_KEY = module.exports.AWS_SECRET_ACCESS_KEY;
process.env.AWS_ACCESS_KEY_ID = module.exports.AWS_ACCESS_KEY_ID;
process.env.AWS_REGION = module.exports.AWS_REGION;

// let postString = null;
// if (configuration.NODE_ENV === 'production') {
//   postString = 'https://trellis.kstf.org/api/mandrill';
// } else if (configuration.NODE_ENV === 'beta') {
//   postString = 'https://trellis-beta.kstf.org/api/mandrill';
// } else if (configuration.NODE_ENV === 'sandbox') {
//   postString = 'https://sandbox.kstf.org/api/mandrill';
// }
