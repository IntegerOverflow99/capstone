import * as Chance from 'chance';

export type IMediaDBModel = {
  id: number;
  file_location: string;
};

export const MediaGenerator = (chance: Chance.Chance, id: number) => ({
  id: id,
  file_location: chance.url(),
});
