import * as Chance from 'chance';

export type IUserDBModel = {
  id: number;
  username: string;
  password_hash: string;
  allowed_video_content_rating: string;
  admin: boolean;
};

export type IUserJSONModel = {
  id: number;
  username: string;
  allowedVideoContentRating: string;
  admin: boolean;
};

export type IUserSessionData = {
  user: Omit<IUserJSONModel, 'passwordHash'> | null;
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
