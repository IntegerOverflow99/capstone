import * as Chance from 'chance';
import dayjs from 'dayjs';

/**
 * Database Model of AccessLog Table
 */
export type IAccessLogDBModel = {
  id: number;
  user_id: number;
  event: string;
  timestamp: string;
};

/**
 * Generates a fake access log object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the access log
 * @param user_fk the user foreign key
 * @returns A fake access log object
 */
export const AccessLogGenerator = (
  chance: Chance.Chance,
  id: number,
  user_fk: number
) => ({
  id: id,
  user_id: user_fk,
  event: chance.sentence(),
  timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
});
