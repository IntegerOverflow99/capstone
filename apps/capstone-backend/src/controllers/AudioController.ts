import * as express from 'express';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  response,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { AudioService, MediaService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IAudioUpload } from '@capstone/utils/types';

/**
 * Audio Controller
 * Handles all requests to the /audio endpoint
 */
@controller('/audio')
export class AudioController
  extends BaseController
  implements interfaces.Controller
{
  /**
   * Audio Controller Constructor - should only ever be called by the Inversify IoC Container
   * @param audioService The injected AudioService
   * @param mediaService The injected MediaService
   * @returns A new AudioController
   */
  constructor(
    @inject('AudioService') private audioService: AudioService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  /**
   * Grab all audio on the site
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns A list of all audio on the site
   */
  @httpGet('/')
  private async getAllAudios(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const audios = await this.audioService.getAll();
    return audios;
  }

  /**
   * Grab a single audio by its ID
   * Expects the ID in its url, e.g. /audio/1
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The audio with the given ID
   */
  @httpGet('/:id')
  private async getAudio(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    if (Number.isNaN(Number(req.params.id))) {
      return this.json(
        {
          error: 'Invalid ID',
        },
        400
      );
    } else {
      const audio = await this.audioService.getById(Number(req.params.id));
      if (!audio) {
        return this.json(
          {
            error: 'Audio not found',
          },
          404
        );
      } else {
        return this.json(audio);
      }
    }
  }

  /**
   * Add a new audio to the site
   * Expects query params with the audio's data, IAudioUpload
   * Expects a File-Extension header with the audio's file extension
   * Expects a binary body matching the media file
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The newly created audio
   */
  @httpPost('/')
  private async addAudio(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const fileExtension = req.get('File-Extension');
    const media: Buffer = req.body;
    const audio = req.query as any as IAudioUpload;
    const media_out = await this.mediaService.addMedia(media, fileExtension);
    const output = await this.audioService.addAudio({
      ...audio,
      media_id: media_out.id,
    });
    return this.json(output);
  }

  /**
   * Update an audio on the site
   * Expects the ID in its url, e.g. /audio/1
   * Expects a JSON body with the audio's data, IAudioUpload
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The updated audio
   */
  @httpPut('/:id')
  private async updateAudio(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    if (Number.isNaN(Number(req.params.id))) {
      return this.json(
        {
          error: 'Invalid ID',
        },
        400
      );
    } else {
      const audio = await this.audioService.updateAudio(
        Number(req.params.id),
        req.body
      );
      if (!audio) {
        return this.json(
          {
            error: 'Audio not found',
          },
          404
        );
      } else {
        return this.json(audio);
      }
    }
  }

  /**
   * Delete an audio from the site
   * Expects the ID in its url, e.g. /audio/1
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The deleted audio
   */
  @httpDelete('/:id')
  private async deleteAudio(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    if (Number.isNaN(Number(req.params.id))) {
      return this.json(
        {
          error: 'Invalid ID',
        },
        400
      );
    } else {
      const audio = await this.audioService.deleteAudio(Number(req.params.id));
      if (!audio) {
        return this.json(
          {
            error: 'Audio not found',
          },
          404
        );
      } else {
        return this.json(audio);
      }
    }
  }
}
