import * as Chance from 'chance';

/**
 * Database Model of CustomTag Table
 */
export type ICustomTagDBModel = {
  id: number;
  tag: string;
  media_id: number;
};

/**
 * Generates a fake custom tag object for database seeding while testing.
 * @param chance Chance instance
 * @param id ID of the custom tag
 * @param media_fk the media foreign key
 * @returns A fake custom tag object
 */
export const CustomTagGenerator = (
  chance: Chance.Chance,
  id: number,
  media_fk: number
) => ({
  id: id,
  tag: chance.pickone(['nature', 'people', 'animals']),
  media_id: media_fk,
});
