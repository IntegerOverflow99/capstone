/**
 * Model for the TaggedMedia table
 */
export type ITaggedMediaDBModel = {
  id: number;
  media_id: number;
  custom_tag_id: number;
};

/**
 * Generates a fake tagged media object for database seeding while testing.
 * @param id ID of the tagged media
 * @param media_fk the media foreign key
 * @param custom_tag_fk the custom tag foreign key
 * @returns A fake tagged media object
 */
export const TaggedMediaGenerator = (
  id: number,
  media_fk: number,
  custom_tag_fk: number
) => ({
  id: id,
  media_id: media_fk,
  custom_tag_id: custom_tag_fk,
});
