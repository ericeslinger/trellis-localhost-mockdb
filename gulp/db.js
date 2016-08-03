const gulp = require('gulp');
const Knex = require('knex');
const shell = require('gulp-shell');
const Promise = require('bluebird');
const config = require('../../../../gulp/config');

gulp.task('redis:clearcache', () => {
  Promise.promisifyAll(require('redis'));
  const redis = require('redis').createClient();
  return redis.keysAsync('cache:*')
    .then((keys) => {
      return Promise.all(keys.map((key) => {
        return redis.delAsync(key);
      }));
    }).then(() => {
      process.exit();
    });
});

gulp.task('db:reset', shell.task([
  'psql -U flo -d postgres -c \'DROP DATABASE florence_development\'',
  'psql -U flo -d postgres -c \'CREATE DATABASE florence_development\'',
]));
