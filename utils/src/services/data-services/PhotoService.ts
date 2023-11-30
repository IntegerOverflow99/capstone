import { Photo } from '../../entities/Photo';
import { IPhotoDBModel } from '../../types/Photo.types';
import DataService from './data-service-decorator';

/**
 * Photo service for querying the photo table.
 */
@DataService()
export class PhotoService {
  /**
   * @returns All photo entries in the photo table.
   */
  public async getAll() {
    const res = (await Photo.query().withGraphFetched(
      'media'
    )) as Array<IPhotoDBModel>;
    return res;
  }

  /**
   * @param id ID of the photo to get
   * @returns A single photo entry with the given ID
   */
  public async getById(id: number) {
    const res = (await Photo.query()
      .findById(id)
      .withGraphFetched('media')) as IPhotoDBModel;
    return res;
  }

  /**
   * @param photo Photo to add to the database
   * @returns The added photo entry
   */
  public async addPhoto(photo: Omit<IPhotoDBModel, 'id' | 'fileExtension'>) {
    const res = (await Photo.query().insert(photo)) as IPhotoDBModel;
    return res;
  }

  /**
   * @param id ID of the photo to delete
   * @returns Boolean indicating whether the photo was deleted
   */
  public async deletePhoto(id: number) {
    const res = await Photo.query().deleteById(id);
    return res >= 1;
  }

  /**
   * @param id database id of the photo to update
   * @param photo photo object with updated values
   * @returns newly updated photo object
   */
  public async updatePhoto(id: number, photo: IPhotoDBModel) {
    const res = await Photo.query().patchAndFetchById(id, photo);
    return res;
  }
}
