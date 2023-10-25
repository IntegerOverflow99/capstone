import * as Chance from 'chance';
import dayjs from 'dayjs';

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

export type IAudioJSONModel = {
  id?: number;
  media_id?: number;
} & IAudioDBModel;

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
