import { IAccessLogDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { User } from './User';

/**
 * ObjectionJS model for AccessLog table.
 * Models a single access log entry, and its relations.
 * @deprecated Out of scope for v1.
 */
export class AccessLog extends BaseEntity implements IAccessLogDBModel {
  static override get tableName() {
    return TableNames.ACCESS_LOGS;
  }

  id!: number;
  user_id!: number;
  event!: string;
  timestamp!: string;

  static override relationMappings = () => ({
    user: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.ACCESS_LOGS}.user_id`,
        to: `${TableNames.USERS}.id`,
      },
    },
  });
}
