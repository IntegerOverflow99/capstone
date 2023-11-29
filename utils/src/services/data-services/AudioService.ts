import { Audio } from '../../entities/Audio';
import { IAudioDBModel, IAudioUpload } from '../../types/Audio.types';
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

  public async addAudio(audio: IAudioUpload & { media_id: number }) {
    const res = await Audio.query().insert(audio);
    return res;
  }

  public async deleteAudio(id: number) {
    const res = await Audio.query().deleteById(id);
    return res >= 1;
  }

  public async updateAudio(id: number, audio: IAudioUpload) {
    const res = await Audio.query().patchAndFetchById(id, audio);
    return res;
  }
}
