import { unlinkSync, writeFile, writeFileSync } from 'fs';
import { Media, Favorite } from '../../entities';
import {
  IMediaDBModel,
  IMediaJSONModel,
  IMediaUpload,
} from '../../types/Media.types';
import DataService from './data-service-decorator';
import crypto from 'crypto';

/**
 * Media service for querying the media table and handling favorites.
 */
@DataService()
export class MediaService {
  /**
   * @returns All media entries in the media table.
   */
  public async getAll() {
    //res should join with audio and video and photo
    const res = (await Media.query().withGraphFetched(
      '[audio, video, photo]'
    )) as Array<IMediaJSONModel>;
    return res;
  }

  /**
   * @param userID ID of the user to get favorites for
   * @returns The favorites for the given user
   */
  public async getFavorites(userID: number) {
    const res = (await Favorite.query()
      .withGraphFetched('media.[video, audio, photo]')
      .where('user_id', userID)) as Array<IMediaJSONModel>;
    return res;
  }

  /**
   * @param mediaID ID of the media to favorite
   * @param userID User ID of the user favoriting the media
   * @returns The favorite entry, or null if the favorite already exists
   */
  public async favoriteMedia(mediaID: number, userID: number) {
    // const res = await Favorite.query().insert({
    //   user_id: userID,
    //   media_id: mediaID,
    // });
    // only insert if there is no favorite with user_id and media_id already in the table
    const check = await Favorite.query().where({
      user_id: userID,
      media_id: mediaID,
    });
    if (check.length === 0) {
      const res = await Favorite.query().insert({
        user_id: userID,
        media_id: mediaID,
      });
      return res;
    } else {
      return null;
    }
  }

  /**
   * @param id ID of the media entry to get.
   * @returns The media entry with the given ID, or undefined if not found.
   */
  public async getById(id: number) {
    const res = (await Media.query()
      .findById(id)
      .withGraphFetched('[audio, video, photo]')) as IMediaJSONModel;
    return res;
  }

  /**
   * Writes a new piece of media to the file system and adds it to the media table.
   * @param media Buffer containing the media to add
   * @param fileExtension File extension of the media
   * @returns The newly added media entry
   */
  public async addMedia(media: Buffer, fileExtension: string) {
    const rootFileLocation =
      process.env['NODE_ENV'] === 'production' ? '/media' : '/tmp/media';
    const fileLocation = `${rootFileLocation}/${crypto.randomUUID()}.${fileExtension}`;
    const insertMedia = {
      file_location: fileLocation,
    } as IMediaUpload;

    try {
      //write the file to the file system
      writeFileSync(fileLocation, media);
    } catch (err) {
      console.log(err);
      return null;
    }

    const res = (await Media.query().insert(insertMedia)) as IMediaDBModel;
    return res;
  }

  /**
   * Deletes a piece of media from the file system and the media table.
   * @param id ID of the media entry to delete.
   * @returns Boolean indicating whether the media entry was deleted.
   */
  public async deleteMedia(id: number) {
    const media = (await Media.query().findById(id)) as IMediaJSONModel;
    if (!media) {
      return false;
    }
    try {
      unlinkSync(media.fileLocation || '');
    } catch (err) {
      console.log(err);
      return false;
    }
    const res = await Media.query().deleteById(id);
    return res >= 1;
  }

  /**
   * @param search Search string to search for
   * @returns All media entries that match the search string
   * @deprecated Handling search on the frontend, querying the database directly is too slow with this much orWhere
   */
  public async searchMedia(search: string) {
    const res = (await Media.query()
      .withGraphJoined('[audio, video, photo]')
      .where('audio.title', 'like', `%${search}%`)
      .orWhere(
        'audio:description',
        'like',
        `%${search}%`
      )) as Array<IMediaDBModel>; // ) //     `%${search}%` //     'like', //     'photo.description', //   .orWhere( //   .orWhere('photo.global_tags', 'like', `%${search}%`) //   .orWhere('video.release_year', 'like', `%${search}%`) //   .orWhere('video.genres', 'like', `%${search}%`) //   .orWhere('video.description', 'like', `%${search}%`) //   .orWhere('video.title', 'like', `%${search}%`) //   .orWhere('audio.release_year', 'like', `%${search}%`) //   .orWhere('audio.genres', 'like', `%${search}%`) //   .orWhere('audio.album', 'like', `%${search}%`) //   .orWhere('audio.artist', 'like', `%${search}%`)
    return res;
  }

  /**
   * @param ids CSV string of media IDs to get
   * @returns A list of media entries with the given IDs
   */
  public async getMediaByIds(ids: string) {
    //cryptically, nothing I can do to ids will convert it into an array of numbers, even if done in the controller
    //so the conversion HAS to be handled via string manipulation, as JSON parsing for some reason STILL passes it as a string
    const idsArray = ids.replace('[', '').replace(']', '').split(',');
    const res = (await Media.query()
      .withGraphJoined('[audio, video, photo]')
      .whereIn('media.id', idsArray)) as Array<IMediaDBModel>;
    return res;
  }
}
