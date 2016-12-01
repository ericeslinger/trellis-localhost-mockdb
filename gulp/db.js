import gulp from 'gulp';
import shell from 'gulp-shell';
// import Bluebird from 'bluebird';
import { environment } from '../configuration';
import { services } from '../../services';
import { buildMock } from '../factories/index';

gulp.task('db:reset', shell.task([
  `psql -U flo -d postgres -c 'DROP DATABASE if exists ${environment.DATABASE_NAME}' --quiet`,
  `psql -U flo -d postgres -c 'CREATE DATABASE ${environment.DATABASE_NAME}' --quiet`,
  // `psql -U flo -d ${environment.DATABASE_NAME} -c 'CREATE EXTENSION pg_stat_statements' --quiet`,
  `psql -U flo -d ${environment.DATABASE_NAME} -c '\\i src/node/db/db_schema.sql' --quiet`,
  `psql -U flo -d  ${environment.DATABASE_NAME} -c '\\i src/node/db/db_structuredata.sql' --quiet`,
]));

gulp.task('db:seed', ['build:backend', 'db:reset'], () => {
  services.initialize();
  return buildMock()
  .then(() => {
    services.teardown();
  });
});
