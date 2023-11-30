import * as Chance from 'chance';
import { IVideoDBModel, IVideoJSONModel } from './Video.types';
import { IPhotoDBModel, IPhotoJSONModel } from './Photo.types';
import { IAudioDBModel, IAudioJSONModel } from './Audio.types';

/**
 * Database Model of Media Table
 */
export type IMediaDBModel = {
  id: number;
  file_location: string;
};

/**
 * Upload Model for adding media to the database
 */
export type IMediaUpload = Omit<IMediaDBModel, 'id'>;

/**
 * JSON Model of Media Table for API responses
 */
export type IMediaJSONModel = {
  video?: IVideoJSONModel;
  audio?: IAudioJSONModel;
  photo?: IPhotoJSONModel;
  id?: number;
  fileLocation?: string;
};

/**
 * Generates a fake media object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the media
 * @returns A fake media object
 */
export const MediaGenerator = (chance: Chance.Chance, id: number) => ({
  id: id,
  file_location: chance.url(),
});
