import * as faker from 'faker';
import * as dimsum from 'dimsum';
import * as common from './common';
import { Community } from '../../models/index';


export function fake(guild, options) {
  const newCommunity = {
    short_text: faker.company.catchPhrase(),
    rich_text: common.toRichText(dimsum(3)),
    official: options.official || false,
    tags: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
  };
  const rV = new Community(newCommunity, guild);
  return rV.$save()
  .then(() => rV);
}
