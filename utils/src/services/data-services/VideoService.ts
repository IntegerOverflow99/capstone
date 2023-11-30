import { Video } from '../../entities/Video';
import {
  IVideoDBModel,
  IVideoJSONModel,
  IVideoUpload,
} from '../../types/Video.types';
import DataService from './data-service-decorator';

/**
 * Video service for querying the video table.
 */
@DataService()
export class VideoService {
  /**
   * @returns All video entries in the video table.
   */
  public async getAll() {
    const res = (await Video.query().withGraphFetched(
      'media'
    )) as Array<IVideoDBModel>;
    return res;
  }

  /**
   * @param id ID of the video to get
   * @returns A single video entry with the given ID
   */
  public async getById(id: number) {
    const res = (await Video.query()
      .findById(id)
      .withGraphFetched('media')) as any as IVideoJSONModel;
    return res;
  }

  /**
   * @param video The video to add to the database
   * @returns The newly added video entry
   */
  public async addVideo(video: IVideoUpload & { media_id: number }) {
    const res = (await Video.query().insert(video)) as IVideoDBModel;
    return res;
  }

  /**
   * @param id ID of the video to delete
   * @returns Boolean indicating whether the video was deleted
   */
  public async deleteVideo(id: number) {
    const res = await Video.query().deleteById(id);
    return res >= 1;
  }

  /**
   * @param id The id of the video to update
   * @param video The video object with updated values
   * @returns The newly updated video object
   */
  public async updateVideo(id: number, video: IVideoUpload) {
    const res = await Video.query().patchAndFetchById(id, video);
    return res;
  }
}
