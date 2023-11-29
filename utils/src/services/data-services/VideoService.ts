import { Video } from '../../entities/Video';
import {
  IVideoDBModel,
  IVideoJSONModel,
  IVideoUpload,
} from '../../types/Video.types';
import DataService from './data-service-decorator';

@DataService()
export class VideoService {
  public async getAll() {
    const res = (await Video.query().withGraphFetched(
      'media'
    )) as Array<IVideoDBModel>;
    return res;
  }

  public async getById(id: number) {
    const res = (await Video.query()
      .findById(id)
      .withGraphFetched('media')) as any as IVideoJSONModel;
    return res;
  }

  public async addVideo(video: IVideoUpload & { media_id: number }) {
    const res = (await Video.query().insert(video)) as IVideoDBModel;
    return res;
  }

  public async deleteVideo(id: number) {
    const res = await Video.query().deleteById(id);
    return res >= 1;
  }

  public async updateVideo(id: number, video: IVideoUpload) {
    const res = await Video.query().patchAndFetchById(id, video);
    return res;
  }
}
