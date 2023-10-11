import { ICustomTagDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';

export class CustomTag extends BaseEntity implements ICustomTagDBModel {
  static override get tableName() {
    return TableNames.CUSTOM_TAGS;
  }

  id!: number;
  tag!: string;
  media_id!: number;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'custom_tags.media_id',
        to: 'media.id',
      },
    },
  });
}
