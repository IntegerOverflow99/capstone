import * as Chance from 'chance';
import dayjs from 'dayjs';

/**
 * Enum for video ratings
 */
export enum IVideoRatings {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
}

/**
 * Database Model of Video Table
 */
export type IVideoDBModel = {
  id: number;
  title: string;
  description: string;
  release_year: number;
  runtime: number;
  width: number;
  height: number;
  genres: string;
  media_id: number;
  uploaded: string;
  rating: IVideoRatings;
};

/**
 * Video object for uploading to the database
 */
export type IVideoUpload = Omit<IVideoDBModel, 'id' | 'media_id'>;

/**
 * Video object for editing in the database
 */
export type IVideoEditValues = Omit<
  IVideoDBModel,
  'media_id' | 'release_year'
> & { releaseYear: number };

/**
 * JSON Model of Video Table for API responses
 */
export type IVideoJSONModel = {
  media: { id?: number; fileLocation?: string };
  releaseYear?: number;
} & Omit<IVideoDBModel, 'media_id' | 'release_year'>;

/**
 * Generates a fake video object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the video
 * @param media_fk the media foreign key
 * @returns A fake video object
 */
export const VideoGenerator = (
  chance: Chance.Chance,
  id: number,
  media_fk: number
) => ({
  id: id,
  title: chance.sentence(),
  description: chance.sentence(),
  release_year: chance.integer({ min: 1900, max: 2020 }),
  runtime: chance.integer({ min: 100, max: 1000 }),
  width: chance.integer({ min: 100, max: 1000 }),
  height: chance.integer({ min: 100, max: 1000 }),
  genres: chance.pickone([
    'action',
    'adventure',
    'comedy',
    'drama',
    'fantasy',
    'horror',
    'mystery',
    'romance',
    'thriller',
    'western',
    'animation',
    'crime',
    'documentary',
    'family',
    'history',
    'music',
    'science fiction',
    'war',
    'tv movie',
  ]),
  media_id: media_fk,
  uploaded: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  rating: chance.pickone([
    IVideoRatings.G,
    IVideoRatings.PG,
    IVideoRatings.PG13,
    IVideoRatings.R,
    IVideoRatings.NC17,
  ]),
});

export type VideoContentTypes = 'video/mp4' | 'video/mov';
