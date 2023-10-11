import * as Chance from 'chance';
import dayjs from 'dayjs';

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
};

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
});
