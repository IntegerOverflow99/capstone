import { IVideoDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';
import { IVideoRatings } from '../types';

export class Video extends BaseEntity implements IVideoDBModel {
  static override get tableName() {
    return TableNames.VIDEOS;
  }

  id!: number;
  title!: string;
  description!: string;
  release_year!: number;
  runtime!: number;
  width!: number;
  height!: number;
  genres!: string;
  media_id!: number;
  uploaded!: string;
  rating!: IVideoRatings;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'videos.media_id',
        to: 'media.id',
      },
    },
  });
}
