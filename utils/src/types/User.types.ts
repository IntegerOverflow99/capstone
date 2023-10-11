import * as Chance from 'chance';

export type IUserDBModel = {
  id: number;
  username: string;
  password_hash: string;
  allowed_video_content_rating: string;
  admin: boolean;
};

export const UserGenerator = (chance: Chance.Chance, id: number) => ({
  id: id,
  username: chance.email(),
  password_hash: chance.hash(),
  allowed_video_content_rating: chance.pickone([
    'G',
    'PG',
    'PG-13',
    'R',
    'NC-17',
  ]),
  admin: chance.bool(),
});
