import * as express from 'express';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { AudioService, MediaService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IAudioUpload } from '@capstone/utils/types';

@controller('/audio')
export class AudioController
  extends BaseController
  implements interfaces.Controller
{
  constructor(
    @inject('AudioService') private audioService: AudioService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  @httpGet('/')
  private async getAllAudios(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const audios = await this.audioService.getAll();
    return audios;
  }

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
