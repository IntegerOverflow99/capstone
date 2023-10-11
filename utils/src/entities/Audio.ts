import { IAudioDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';

export class Audio extends BaseEntity implements IAudioDBModel {
  static override get tableName() {
    return TableNames.AUDIO;
  }

  id!: number;
  title!: string;
  artist!: string;
  album!: string;
  length!: number;
  release_year!: number;
  genres!: string;
  media_id!: number;
  uploaded!: string;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'audio.media_id',
        to: 'media.id',
      },
    },
  });
}
