import { ITaggedMediaDBModel } from '../types';
import BaseEntity from './BaseEntity';
import { TableNames } from './TableNames';
import { Media } from './Media';
import { CustomTag } from './CustomTag';

/**
 * ObjectionJS model for TaggedMedia table.
 * Models a single tagged media entry, and its relations.
 * @deprecated Out of scope for v1.
 */
export class TaggedMedia extends BaseEntity implements ITaggedMediaDBModel {
  static override get tableName() {
    return TableNames.TAGGED_MEDIA;
  }

  id!: number;
  media_id!: number;
  custom_tag_id!: number;

  static override relationMappings = () => ({
    media: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: Media,
      join: {
        from: 'tagged_media.media_id',
        to: 'media.id',
      },
    },
    custom_tag: {
      relation: BaseEntity.BelongsToOneRelation,
      modelClass: CustomTag,
      join: {
        from: 'tagged_media.custom_tag_id',
        to: 'custom_tags.id',
      },
    },
  });
}
