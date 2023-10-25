import { Audio } from '../../entities/Audio';
import { IAudioDBModel } from '../../types/Audio.types';
import DataService from './data-service-decorator';

@DataService()
export class AudioService {
  public async getAll() {
    const res = (await Audio.query().withGraphFetched(
      'media'
    )) as Array<IAudioDBModel>;
    return res;
  }

  public async getById(id: number) {
    const res = (await Audio.query()
      .findById(id)
      .withGraphFetched('media')) as IAudioDBModel;
    return res;
  }

  public async addAudio(audio: IAudioDBModel) {
    const res = await Audio.query().insert(audio);
    return res;
  }

  public async deleteAudio(id: number) {
    const res = await Audio.query().deleteById(id);
    return res >= 1;
  }
}
