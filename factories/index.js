import * as DocumentFactory from './document';
import * as CommunityFactory from './community';
import * as ProfileFactory from './profile';
import { services } from '../../services';
import Bluebird from 'bluebird';
import Progress from 'progress';

function buildMock() {
  console.log('creating users');
  let bar = new Progress(':bar', { total: 300 });
  return Bluebird.all(new Array(300).fill(0).map(() => ProfileFactory.fake(services.guild).then(() => bar.tick())))
  .then(() => {
    console.log('building communities');
    bar = new Progress(':bar', { total: 100 });
    return CommunityFactory.build(services.guild, {
      official: true,
      homegroup: true,
      profileCount: 300,
    });
  })
  .then((home) => {
    bar.tick();
    return Bluebird.all(new Array(99).fill(0).map((v, idx) => {
      return CommunityFactory.build(services.guild, {
        official: idx % 10 === 0,
        homegroup: false,
        homegroupId: home.$id,
        profileCount: 300,
        public: idx % 7 !== 0,
      }).then(() => bar.tick());
    }));
  })
  .then(() => {
    console.log('building conversations');
    bar = new Progress(':bar', { total: 100 });
    return Bluebird.all(new Array(100).fill(0).map(() => {
      return DocumentFactory.build(services.guild, {
        profileCount: 300,
        communityCount: 100,
      }).then(() => bar.tick());
    }));
  });
}

export {
  DocumentFactory,
  CommunityFactory,
  ProfileFactory,
  buildMock,
};
