import { IFavoriteDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';
import { User } from './User';

/**
 * ObjectionJS model for Favorite table.
 * Models a single favorite entry, and its relations.
 */
export class Favorite extends BaseEntity implements IFavoriteDBModel {
  static override get tableName() {
    return TableNames.FAVORITES;
  }

  id!: number;
  media_id!: number;
  user_id!: number;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: `${TableNames.FAVORITES}.media_id`,
        to: `${TableNames.MEDIA}.id`,
      },
    },
    user: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.FAVORITES}.user_id`,
        to: `${TableNames.USERS}.id`,
      },
    },
  });
}
