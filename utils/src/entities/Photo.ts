import { IPhotoDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';

/**
 * ObjectionJS model for Photo table.
 * Models a single photo entry, and its relations.
 */
export class Photo extends BaseEntity implements IPhotoDBModel {
  static override get tableName() {
    return TableNames.PHOTOS;
  }

  id!: number;
  description!: string;
  uploaded!: string;
  taken!: string;
  height!: number;
  width!: number;
  global_tags!: string;
  media_id!: number;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'photos.media_id',
        to: 'media.id',
      },
    },
  });
}
