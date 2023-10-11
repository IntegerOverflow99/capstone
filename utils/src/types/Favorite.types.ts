export type IFavoriteDBModel = {
  id: number;
  user_id: number;
  media_id: number;
};

export const FavoriteGenerator = (
  id: number,
  user_fk: number,
  media_fk: number
) => ({
  id: id,
  user_id: user_fk,
  media_id: media_fk,
});
