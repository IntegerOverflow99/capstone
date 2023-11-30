import { AxiosInstance } from 'axios';

/**
 * Add a given media to a user's favorites, if it isn't already there
 * @param userID ID of the user
 * @param mediaID ID of the media
 * @param axios Axios instance from the page
 * @returns boolean pass/fail of the request
 */
export const addToFavorites = async (
  userID: number,
  mediaID: number,
  axios: AxiosInstance
) => {
  try {
    const result = await axios.post(`/media/favorite/${mediaID}`, { userID });
    if (result.data) {
      return true;
    }
  } catch (err) {
    return false;
  }
};
