import * as Chance from 'chance';
import dayjs from 'dayjs';

export type IAccessLogDBModel = {
  id: number;
  user_id: number;
  event: string;
  timestamp: string;
};

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
