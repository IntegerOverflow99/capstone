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
      .withGraphFetched('[audio, video, photo]')) as IMediaDBModel;
    return res;
  }

  public async addMedia(media: Buffer, fileExtension: string) {
    const rootFileLocation =
      process.env['NODE_ENV'] === 'production' ? '/media' : '/tmp/media';
    const fileLocation = `${rootFileLocation}/${crypto.randomUUID()}.${fileExtension}`;
    const insertMedia = {
      file_location: fileLocation,
    } as IMediaUpload;

    //write the file to the file system
    writeFileSync(fileLocation, media);

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
      )) as //   .orWhere('photo.global_tags', 'like', `%${search}%`) //   .orWhere('video.release_year', 'like', `%${search}%`) //   .orWhere('video.genres', 'like', `%${search}%`) //   .orWhere('video.description', 'like', `%${search}%`) //   .orWhere('video.title', 'like', `%${search}%`) //   .orWhere('audio.release_year', 'like', `%${search}%`) //   .orWhere('audio.genres', 'like', `%${search}%`) //   .orWhere('audio.album', 'like', `%${search}%`) //   .orWhere('audio.artist', 'like', `%${search}%`)
    //   .orWhere(
    //     'photo.description',
    //     'like',
    //     `%${search}%`
    // )
    Array<IMediaDBModel>;
    return res;
  }
}
