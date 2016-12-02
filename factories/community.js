import * as faker from 'faker';
import dimsum from 'dimsum';
import * as common from './common';
import { Community } from '../../models/index';
import Bluebird from 'bluebird';


export function fake(plump, options) {
  const newCommunity = {
    short_text: faker.company.catchPhrase(),
    rich_text: common.toRichText(dimsum(3)),
    official: options.official || false,
    tags: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
  };
  const rV = new Community(newCommunity, plump);
  return rV.$save()
  .then(() => rV);
}

export function build(plump, options = {}) {
  return fake(plump, options)
  .then((community) => {
    const mods = [];
    return Bluebird.all(common.randomSet(options.profileCount, common.getRandomInt(1, 3)).map((pId) => {
      mods.push(pId);
      return community.$add('members', pId, { perm: 3 });
    }))
    .then(() => {
      if (options.homegroup) {
        return Bluebird.all(new Array(options.profileCount).fill(0).map((v, idx) => {
          if (mods.indexOf(idx + 1) < 0) {
            return community.$add('members', idx + 1, { perm: 2 });
          } else {
            return null;
          }
        }));
      } else {
        const memberCount = Math.min(common.getRandomPareto(0.8), 30);
        const memberList = common.randomSet(options.profileCount, memberCount);
        return Bluebird.all(memberList.map((m) => {
          if (mods.indexOf(m) < 0) {
            return community.$add('members', m, { perm: 2 });
          } else {
            return null;
          }
        }));
      }
    }).then(() => {
      if (options.public) {
        return community.$add('subCommunities', options.homegroupId, { perm: 1 });
      } else {
        return null;
      }
    }).then(() => community);
  });
}
