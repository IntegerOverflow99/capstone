import { Knex } from 'knex';
import { TableNamesArray, TableNames } from '../../entities/TableNames';
import {
  AccessLogGenerator,
  AudioGenerator,
  CustomTagGenerator,
  FavoriteGenerator,
  MediaGenerator,
  PhotoGenerator,
  TaggedMediaGenerator,
  VideoGenerator,
  UserGenerator,
} from '../../types';
import { Chance } from 'chance';

export async function seed(knex: Knex): Promise<void> {
  const chance = new Chance();

  //Deletes ALL existing entries
  await Promise.all(
    TableNamesArray.map(async (tableName) => {
      await knex(tableName).del();
    })
  );

  const fakeIDs = [1, 2, 3];
  await Promise.all(
    fakeIDs.map(async (id) => {
      const user = UserGenerator(chance, id);
      await knex(TableNames.USERS).insert(user);
    })
  );

  await Promise.all(
    fakeIDs.map(async (id) => {
      const media = MediaGenerator(chance, id);
      await knex(TableNames.MEDIA).insert(media);
    })
  );

  await knex(TableNames.PHOTOS).insert(PhotoGenerator(chance, 1, 1));
  await knex(TableNames.VIDEOS).insert(VideoGenerator(chance, 1, 2));
  await knex(TableNames.AUDIO).insert(AudioGenerator(chance, 1, 3));

  await Promise.all(
    fakeIDs.map(async (id) => {
      const customTag = CustomTagGenerator(chance, id, id);
      await knex(TableNames.CUSTOM_TAGS).insert(customTag);
    })
  );

  await Promise.all(
    fakeIDs.map(async (id) => {
      const taggedMedia = TaggedMediaGenerator(id, id, id);
      await knex(TableNames.TAGGED_MEDIA).insert(taggedMedia);
    })
  );

  await Promise.all(
    fakeIDs.map(async (id) => {
      const favorite = FavoriteGenerator(id, id, id);
      await knex(TableNames.FAVORITES).insert(favorite);
    })
  );

  await Promise.all(
    fakeIDs.map(async (id) => {
      const accessLog = AccessLogGenerator(chance, id, id);
      await knex(TableNames.ACCESS_LOGS).insert(accessLog);
    })
  );
}
