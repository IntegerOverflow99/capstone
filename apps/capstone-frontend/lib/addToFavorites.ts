import { AxiosInstance } from 'axios';

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
