import * as Chance from 'chance';
import dayjs, { Dayjs } from 'dayjs';

/**
 * Database Model of Photo Table
 */
export type IPhotoDBModel = {
  id: number;
  description: string;
  uploaded: string;
  taken: string;
  height: number;
  width: number;
  global_tags: string;
  media_id: number;
};

/**
 * JSON Model of Photo Table for API responses
 */
export type IPhotoJSONModel = {
  id?: number;
  media?: {
    id: number;
    fileLocation: string;
  };
} & IPhotoDBModel;

/**
 * Photo object for uploading to the database
 */
export type IPhotoUpload = Omit<IPhotoDBModel, 'id' | 'media_id'>;

/**
 * Generates a fake photo object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the photo
 * @param media_fk the media foreign key
 * @returns A fake photo object
 */
export const PhotoGenerator = (
  chance: Chance.Chance,
  id: number,
  media_fk: number
) => ({
  id: id,
  description: chance.sentence(),
  uploaded: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  taken: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  height: chance.integer({ min: 100, max: 1000 }),
  width: chance.integer({ min: 100, max: 1000 }),
  global_tags: chance.pickone([
    'nature',
    'people',
    'animals',
    'food',
    'technology',
  ]),
  media_id: media_fk,
});

export type PhotoContentTypes = 'image/jpeg' | 'image/png' | 'image/gif';
