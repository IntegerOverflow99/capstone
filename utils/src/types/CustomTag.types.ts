import * as Chance from 'chance';

export type ICustomTagDBModel = {
  id: number;
  tag: string;
  media_id: number;
};

export const CustomTagGenerator = (
  chance: Chance.Chance,
  id: number,
  media_fk: number
) => ({
  id: id,
  tag: chance.pickone(['nature', 'people', 'animals']),
  media_id: media_fk,
});
