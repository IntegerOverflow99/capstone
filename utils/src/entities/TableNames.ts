/**
 * Enum of table names.
 */
export enum TableNames {
  USERS = 'users',
  MEDIA = 'media',
  TAGGED_MEDIA = 'tagged_media',
  CUSTOM_TAGS = 'custom_tags',
  FAVORITES = 'favorites',
  ACCESS_LOGS = 'access_logs',
  VIDEOS = 'videos',
  AUDIO = 'audio',
  PHOTOS = 'photos',
}

/**
 * Array of table names.
 */
export const TableNamesArray = Object.values(TableNames);
