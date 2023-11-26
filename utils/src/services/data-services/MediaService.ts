import { writeFile, writeFileSync } from 'fs';
import { Media } from '../../entities/Media';
import {
  IMediaDBModel,
  IMediaJSONModel,
  IMediaUpload,
} from '../../types/Media.types';
import DataService from './data-service-decorator';
import crypto from 'crypto';

@DataService()
export class MediaService {
  public async getAll() {
    //res should join with audio and video and photo
    const res = (await Media.query().withGraphFetched(
      '[audio, video, photo]'
    )) as Array<IMediaJSONModel>;
    return res;
  }

  public async getById(id: number) {
    const res = (await Media.query()
      .findById(id)
      .withGraphFetched('[audio, video, photo]')) as IMediaJSONModel;
    return res;
  }

  public async addMedia(media: Buffer, fileExtension: string) {
    console.log('ADDING MEDIA');
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

  public async deleteMedia(id: number) {
    const res = await Media.query().deleteById(id);
    return res >= 1;
  }

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
