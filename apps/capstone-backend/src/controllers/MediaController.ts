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
import { MediaService } from '@capstone/utils/services';
import BaseController from './BaseController';

@controller('/media')
export class MediaController
  extends BaseController
  implements interfaces.Controller
{
  constructor(@inject('MediaService') private mediaService: MediaService) {
    super();
  }

  @httpGet('/')
  private async getAllMedia(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const media = await this.mediaService.getAll();
    return media;
  }

  @httpGet('/search')
  private async searchMedia(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const media = await this.mediaService.searchMedia(
      req.query.search as string
    );
    return media;
  }

  @httpGet('/:id')
  private async getMedia(
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
      const media = await this.mediaService.getById(Number(req.params.id));
      if (!media) {
        return this.json(
          {
            error: 'Media not found',
          },
          404
        );
      } else {
        return this.json(media);
      }
    }
  }

  @httpDelete('/:id')
  private async deleteMedia(
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
      const media = await this.mediaService.deleteMedia(Number(req.params.id));
      if (!media) {
        return this.json(
          {
            error: 'Media not found',
          },
          404
        );
      } else {
        return this.json(media);
      }
    }
  }

  @httpPost('/')
  private async addMedia(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const media = await this.mediaService.addMedia(req.body);
    return this.json(media);
  }
}
