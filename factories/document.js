import * as faker from 'faker';
import dimsum from 'dimsum';
import * as common from './common';
import { Document } from '../../models/index';
import Bluebird from 'bluebird';

export function fake(plump, options = {}) {
  const newDocument = Object.assign(
    {},
    {
      short_text: faker.company.catchPhrase(),
      rich_text: common.toRichText(dimsum(3)),
      tags: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
      published: true,
      type: 'root',
    },
    {
      options,
    }
  );
  const rV = new Document(newDocument, plump);
  return rV.$save()
  .then(() => rV);
}

export function build(plump, options = {}) {
  return fake(plump)
  .then((doc) => {
    return Bluebird.all(common.randomSet(options.profileCount, common.getRandomInt(1, 3)).map((pId) => {
      return doc.$add('participants', pId, { perm: 3 });
    }))
    .then(() => {
      return Bluebird.all(common.randomSet(options.communityCount, common.getRandomInt(1, 3)).map((pId) => {
        return doc.$add('communities', pId, { perm: 2 });
      }));
    }).then(() => {
      const replyCount = Math.min(common.getRandomPareto(2), 15);
      return Bluebird.all(new Array(replyCount).fill(0).map(() => {
        return fake(plump, { type: 'comment', reply_parents: [doc.$id] });
      }));
    }).then((replies) => {
      replies.push(doc);
      return Bluebird.all(replies.map((d) => {
        return Bluebird.all(['likes', 'agrees', 'disagrees', 'sympathizes', 'explains'].map((reactionType) => {
          const reactCount = Math.min(common.getRandomPareto(2.3), 3);
          return Bluebird.all(common.randomSet(options.profileCount, reactCount).map((pId) => {
            return d.$add(reactionType, pId);
          }));
        }));
      }));
    }).then(() => doc);
  });
}
