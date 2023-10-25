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
import { PhotoService } from '@capstone/utils/services';
import BaseController from './BaseController';

@controller('/photo')
export class PhotoController
  extends BaseController
  implements interfaces.Controller
{
  constructor(@inject('PhotoService') private photoService: PhotoService) {
    super();
  }

  @httpGet('/')
  private async getAllPhotos(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const photos = await this.photoService.getAll();
    return photos;
  }

  @httpGet('/:id')
  private async getPhoto(
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
      const photo = await this.photoService.getById(Number(req.params.id));
      if (!photo) {
        return this.json(
          {
            error: 'Photo not found',
          },
          404
        );
      } else {
        return this.json(photo);
      }
    }
  }

  @httpPost('/')
  private async addPhoto(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const photo = await this.photoService.addPhoto(req.body);
    return this.json(photo);
  }

  @httpDelete('/:id')
  private async deletePhoto(
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
      const photo = await this.photoService.deletePhoto(Number(req.params.id));
      if (!photo) {
        return this.json(
          {
            error: 'Photo not found',
          },
          404
        );
      } else {
        return this.json(photo);
      }
    }
  }
}
