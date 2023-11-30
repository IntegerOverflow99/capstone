/**
 * Export the types for the Favorite model.
 */
export type IFavoriteDBModel = {
  id: number;
  user_id: number;
  media_id: number;
};

/**
 * Generates a fake favorite object for database seeding while testing.
 * @param id ID of the favorite
 * @param user_fk the user foreign key
 * @param media_fk the media foreign key
 * @returns A fake favorite object
 */
export const FavoriteGenerator = (
  id: number,
  user_fk: number,
  media_fk: number
) => ({
  id: id,
  user_id: user_fk,
  media_id: media_fk,
});
