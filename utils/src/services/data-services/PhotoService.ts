import { Photo } from '../../entities/Photo';
import { IPhotoDBModel } from '../../types/Photo.types';
import DataService from './data-service-decorator';

@DataService()
export class PhotoService {
  public async getAll() {
    const res = (await Photo.query().withGraphFetched(
      'media'
    )) as Array<IPhotoDBModel>;
    return res;
  }

  public async getById(id: number) {
    const res = (await Photo.query()
      .findById(id)
      .withGraphFetched('media')) as IPhotoDBModel;
    return res;
  }

  public async addPhoto(photo: Omit<IPhotoDBModel, 'id'>) {
    const res = (await Photo.query().insert(photo)) as IPhotoDBModel;
    return res;
  }

  public async deletePhoto(id: number) {
    const res = await Photo.query().deleteById(id);
    return res >= 1;
  }
}
