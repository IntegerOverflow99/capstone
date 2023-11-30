import { IMediaDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { TaggedMedia } from './TaggedMedia';
import { Favorite } from './Favorite';
import { CustomTag } from './CustomTag';
import { Audio } from './Audio';
import { Video } from './Video';
import { Photo } from './Photo';

/**
 * ObjectionJS model for Media table.
 * Models a single media entry, and its relations.
 */
export class Media extends BaseEntity implements IMediaDBModel {
  static override get tableName() {
    return TableNames.MEDIA;
  }

  id!: number;
  file_location!: string;

  static override relationMappings = () => ({
    tagged_media: {
      relation: BaseEntity.HasManyRelation,
      modelClass: TaggedMedia,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.TAGGED_MEDIA}.media_id`,
      },
    },
    favorites: {
      relation: BaseEntity.HasManyRelation,
      modelClass: Favorite,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.FAVORITES}.media_id`,
      },
    },
    custom_tags: {
      relation: BaseEntity.HasManyRelation,
      modelClass: CustomTag,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.CUSTOM_TAGS}.media_id`,
      },
    },
    audio: {
      relation: BaseEntity.HasOneRelation,
      modelClass: Audio,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.AUDIO}.media_id`,
      },
    },
    video: {
      relation: BaseEntity.HasOneRelation,
      modelClass: Video,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.VIDEOS}.media_id`,
      },
    },
    photo: {
      relation: BaseEntity.HasOneRelation,
      modelClass: Photo,
      join: {
        from: `${TableNames.MEDIA}.id`,
        to: `${TableNames.PHOTOS}.media_id`,
      },
    },
  });
}
