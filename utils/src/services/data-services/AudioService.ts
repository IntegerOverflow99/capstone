import { Audio } from '../../entities/Audio';
import { IAudioDBModel, IAudioUpload } from '../../types/Audio.types';
import DataService from './data-service-decorator';

/**
 * Audio service for querying the audio table.
 */
@DataService()
export class AudioService {
  /**
   * @returns All audio entries in the audio table.
   */
  public async getAll() {
    const res = (await Audio.query().withGraphFetched(
      'media'
    )) as Array<IAudioDBModel>;
    return res;
  }

  /**
   * @param id ID of the audio entry to get.
   * @returns Audio entry with the given ID, or undefined if not found.
   */
  public async getById(id: number) {
    const res = (await Audio.query()
      .findById(id)
      .withGraphFetched('media')) as IAudioDBModel;
    return res;
  }

  /**
   * @param audio The audio entry to add.
   * @returns The added audio entry.
   */
  public async addAudio(audio: IAudioUpload & { media_id: number }) {
    const res = await Audio.query().insert(audio);
    return res;
  }

  /**
   * @param id ID of the audio entry to delete.
   * @returns Boolean indicating whether the audio entry was deleted.
   */
  public async deleteAudio(id: number) {
    const res = await Audio.query().deleteById(id);
    return res >= 1;
  }

  /**
   * @param id ID of the audio entry to update.
   * @param audio JSON object containing the fields to update.
   * @returns Updated audio entry.
   */
  public async updateAudio(id: number, audio: IAudioUpload) {
    const res = await Audio.query().patchAndFetchById(id, audio);
    return res;
  }
}
