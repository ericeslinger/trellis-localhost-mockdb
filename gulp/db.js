const gulp = require('gulp');
const shell = require('gulp-shell');
const Promise = require('bluebird');

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

const nodeConfig = require('../configuration');

gulp.task('db:reset', shell.task([
  `psql -U flo -d postgres -c 'DROP DATABASE if exists ${nodeConfig.DATABASE_NAME}'`,
  `psql -U flo -d postgres -c 'CREATE DATABASE ${nodeConfig.DATABASE_NAME}'`,
  // `psql -U flo -d ${nodeConfig.DATABASE_NAME} -c 'CREATE EXTENSION pg_stat_statements'`,
  `psql -U flo -d ${nodeConfig.DATABASE_NAME} -c '\\i src/node/db/db_schema.sql'`,
  `psql -U flo -d  ${nodeConfig.DATABASE_NAME} -c '\\i src/node/db/db_structuredata.sql'`,
]));

gulp.task('db:seed', ['build:backend', 'db:reset'], (done) => {
  const Progress = require('progress');
  const services = require('../../services');
  services.initialize();
  const knex = require('bookshelf').trellis.knex;
  const documentFactory = require('../../models/factories/document');
  const profileFactory = require('../../models/factories/profile');
  const communityFactory = require('../../models/factories/community');
  const userFactory = require('../../models/factories/user');
  console.log('creating fellows');
  profileFactory.fakeProfiles(100, 'fellow')
  .then(() => {
    console.log('creating staff');
    return profileFactory.fakeProfiles(30, 'staff');
  }).then(() => {
    console.log('updating user objects');
    return userFactory.fakeUsers();
  }).then(() => {
    console.log('creating communities');
    return Promise.all([
      communityFactory.fakeCommunities(5, {official: true}),
      communityFactory.fakeCommunities(50, {official: false}),
    ]);
  }).then(() => {
    console.log('generating homegroup');
    return communityFactory.generateHomegroup();
  }).then((homegroupId) => {
    console.log('populating and sharing communities');
    return knex('communities')
    .select(['id', 'official'])
    .then((communities) => {
      return Promise.all(communities.map((community) => {
        if (community.id === homegroupId) {
          return null;
        } else {
          return profileFactory.getRandomProfiles(40)
          .then((profiles) => {
            return Promise.all([
              communityFactory.populateCommunity(community.id, {level: 3, memberlist: profiles.slice(0, 4)}),
              communityFactory.populateCommunity(community.id, {level: 2, memberlist: profiles.slice(4)}),
            ]);
          }).then(() => {
            if ((community.official === true) || (community.id % 9)) {
              return knex('community_on_community_memberships')
              .insert({
                granter_id: community.id,
                grantee_id: homegroupId,
                perm: 1,
              });
            } else {
              return null;
            }
          });
        }
      }));
    });
  }).then(() => {
    console.log('creating and sharing conversation roots');
    const bar = new Progress(':bar', {total: 100});
    return documentFactory.generateDocuments(100, {type: 'root', progress: () => bar.tick()});
  }).then((ids) => {
    const bar = new Progress(':bar', {total: 100});
    console.log('generating replies');
    return documentFactory.generateReplies(ids, {progress: () => bar.tick()});
  }).then(() => {
    return knex('documents').count('id')
    .then((count) => {
      return parseInt(count[0].count, 10);
    });
  }).then((count) => {
    const bar = new Progress(':bar', {total: count});
    console.log('peppering in some reactions');
    return documentFactory.reactEverywhere({progress: () => bar.tick()});
  }).then(() => {
    services.teardown();
    done();
  });
});
