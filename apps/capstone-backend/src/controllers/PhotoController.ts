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
import { PhotoService, MediaService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IPhotoUpload } from '@capstone/utils/types';

/**
 * Audio Controller
 * Handles all requests to the /audio endpoint
 */
@controller('/photo')
export class PhotoController
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
    @inject('PhotoService') private photoService: PhotoService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  /**
   * Get all photos on the site
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns A list of all photos on the site
   */
  @httpGet('/')
  private async getAllPhotos(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const photos = await this.photoService.getAll();
    return photos;
  }

  /**
   * Get a single photo by its ID
   * Expects the ID in its url, e.g. /photo/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns A single photo with the given ID
   */
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

  /**
   * Add a new photo to the site
   * Expects query params matching IPhotoUpload
   * Expects a binary body matching the media file
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The newly created photo
   */
  @httpPost('/')
  private async addPhoto(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const fileExtension = req.get('File-Extension');
    const media: Buffer = req.body;
    const photo = req.query as any as IPhotoUpload;
    const media_out = await this.mediaService.addMedia(media, fileExtension);
    const output = await this.photoService.addPhoto({
      ...photo,
      media_id: media_out.id,
    });
    return this.json(output);
  }

  /**
   * Update a photo's data
   * Expects a JSON body matching IPhotoUpload
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The newly updated photo
   */
  @httpPut('/:id')
  private async updatePhoto(
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
      const photo = await this.photoService.updatePhoto(
        Number(req.params.id),
        req.body
      );
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

  /**
   * Delete a photo from the site
   * Expects the ID in its url, e.g. /photo/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns The deleted photo
   */
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
