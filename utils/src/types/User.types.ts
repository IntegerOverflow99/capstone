import * as Chance from 'chance';

/**
 * Database Model of User Table
 */
export type IUserDBModel = {
  id: number;
  username: string;
  password_hash: string;
  allowed_video_content_rating: string;
  admin: boolean;
};

/**
 * JSON Model of User Table for API responses
 */
export type IUserJSONModel = {
  id: number;
  username: string;
  allowedVideoContentRating: string;
  admin: boolean;
};

/**
 * Session data for the user
 */
export type IUserSessionData = {
  user: Omit<IUserJSONModel, 'passwordHash'> | null;
};

/**
 * Generates a fake user object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the user
 * @returns A fake user object
 */
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
