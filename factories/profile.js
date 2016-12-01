import * as faker from 'faker';
import dimsum from 'dimsum';
import * as common from './common';
import { Profile, User } from '../../models/index';

export function fake(guild, type = 'fellow') {
  const newProfile = {
    image_url: faker.image.avatar(),
    short_text: `${faker.name.firstName()} ${faker.name.lastName()}`,
    type: type,
    email: faker.internet.email().toLowerCase(),
    tags: [faker.company.bsNoun(), faker.company.bsNoun(), faker.company.bsNoun()],
    rich_text: common.toRichText(dimsum(common.getRandomInt(1, 3))),
  };
  if (type === 'fellow') {
    newProfile.cohort = faker.random.arrayElement(['2011', '2012', '2013', '2014', '2015']);
  } else if (type === 'staff') {
    newProfile.title = faker.name.title();
  }
  const rV = new Profile(newProfile, guild);
  return rV.$save()
  .then(() => rV.$get())
  .then((profileData) => {
    return new User({
      name: profileData.short_text,
      profile_id: profileData.id,
      email: profileData.email,
    }, guild).$save();
  })
  .then(() => rV);
}
