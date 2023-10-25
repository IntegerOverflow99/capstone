import { Video } from '../../entities/Video';
import { IVideoDBModel } from '../../types/Video.types';
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
      .withGraphFetched('media')) as IVideoDBModel;
    return res;
  }

  public async addVideo(video: IVideoDBModel) {
    const res = (await Video.query().insert(video)) as IVideoDBModel;
    return res;
  }

  public async deleteVideo(id: number) {
    const res = await Video.query().deleteById(id);
    return res >= 1;
  }
}
