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
import { PhotoService, MediaService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IPhotoUpload } from '@capstone/utils/types';

@controller('/photo')
export class PhotoController
  extends BaseController
  implements interfaces.Controller
{
  constructor(
    @inject('PhotoService') private photoService: PhotoService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  @httpGet('/')
  private async getAllPhotos(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    console.log('GET ALL PHOTOS');
    const photos = await this.photoService.getAll();
    return photos;
  }

  @httpGet('/:id')
  private async getPhoto(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    console.log('GET PHOTO');
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
    console.log('PHOTO UPLOAD');
    const fileExtension = req.get('File-Extension');
    const media: Buffer = req.body;
    //TODO: current problem working on - req.body is empty!
    const photo = req.query as any as IPhotoUpload;
    const media_out = await this.mediaService.addMedia(media, fileExtension);
    const output = await this.photoService.addPhoto({
      ...photo,
      media_id: media_out.id,
    });
    return this.json(output);
  }

  @httpDelete('/:id')
  private async deletePhoto(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    console.log('DELETE PHOTO');
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
