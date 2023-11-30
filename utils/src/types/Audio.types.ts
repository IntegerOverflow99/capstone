import * as Chance from 'chance';
import dayjs from 'dayjs';

/**
 * Database Model of Audio Table
 */
export type IAudioDBModel = {
  id: number;
  title: string;
  artist: string;
  album: string;
  length: number;
  release_year: number;
  genres: string;
  media_id: number;
  uploaded: string;
};

/**
 * JSON Model of Audio Table for API responses
 */
export type IAudioJSONModel = {
  id?: number;
  releaseYear: number;
  media?: {
    id: number;
    fileLocation: string;
  };
} & IAudioDBModel;

/**
 * Audio object for uploading to the database
 */
export type IAudioUpload = Omit<IAudioDBModel, 'id' | 'media_id'>;

/**
 * Generates a fake audio object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the audio
 * @param media_fk the media foreign key
 * @returns A fake audio object
 */
export const AudioGenerator = (
  chance: Chance.Chance,
  id: number,
  media_fk: number
) => ({
  id: id,
  title: chance.sentence(),
  artist: chance.name(),
  album: chance.sentence(),
  length: chance.integer({ min: 100, max: 1000 }),
  release_year: chance.integer({ min: 1900, max: 2020 }),
  genres: chance.pickone([
    'rock',
    'pop',
    'country',
    'rap',
    'hip-hop',
    'jazz',
    'classical',
    'metal',
    'alternative',
    'indie',
    'folk',
    'punk',
    'blues',
    'reggae',
    'r&b',
    'soul',
    'funk',
    'disco',
    'techno',
    'house',
    'dance',
    'electronic',
    'ambient',
    'dubstep',
    'trance',
    'drum & bass',
    'dub',
    'latin',
    'ska',
    'grunge',
    'emo',
    'gospel',
    'christian',
    'instrumental',
    'new age',
    'opera',
    'singer-songwriter',
    'world',
    'other',
  ]),
  media_id: media_fk,
  uploaded: dayjs().format('YYYY-MM-DD HH:mm:ss'),
});

export type AudioContentTypes = 'audio/mpeg' | 'audio/wav';
