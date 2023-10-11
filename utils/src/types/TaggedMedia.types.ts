export type ITaggedMediaDBModel = {
  id: number;
  media_id: number;
  custom_tag_id: number;
};

export const TaggedMediaGenerator = (
  id: number,
  media_fk: number,
  custom_tag_fk: number
) => ({
  id: id,
  media_id: media_fk,
  custom_tag_id: custom_tag_fk,
});
