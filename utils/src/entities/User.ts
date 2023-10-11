import { TableNames } from './TableNames';
import { IUserDBModel } from '../types/User.types';
import BaseEntity from './BaseEntity';
import { AccessLog } from './AccessLog';
import { Favorite } from './Favorite';
import { CustomTag } from './CustomTag';

export class User extends BaseEntity implements IUserDBModel {
  static override get tableName() {
    return TableNames.USERS;
  }

  id!: number;
  username!: string;
  password_hash!: string;
  allowed_video_content_rating!: string;
  admin!: boolean;

  static override relationMappings = () => ({
    access_logs: {
      relation: BaseEntity.HasManyRelation,
      modelClass: AccessLog,
      join: {
        from: `${TableNames.USERS}.id`,
        to: `${TableNames.ACCESS_LOGS}.user_id`,
      },
    },
    favorites: {
      relation: BaseEntity.HasManyRelation,
      modelClass: Favorite,
      join: {
        from: `${TableNames.USERS}.id`,
        to: `${TableNames.FAVORITES}.user_id`,
      },
    },
    custom_tags: {
      relation: BaseEntity.HasManyRelation,
      modelClass: CustomTag,
      join: {
        from: `${TableNames.USERS}.id`,
        to: `${TableNames.CUSTOM_TAGS}.user_id`,
      },
    },
  });
}
