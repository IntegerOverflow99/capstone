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
import { readFile } from 'fs/promises';
import { extname } from 'path';
import { lookup } from 'mime-types';

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

  @httpGet('/ids')
  private async getMediaByIds(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    //for a reason I cannot figure out, no matter what i do, ids gets passed as a string, so I'm handling the conversion in the service
    const ids = req.query.ids as string;
    const media = await this.mediaService.getMediaByIds(ids);
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
        //TODO: determine why sendFile does not work - this works for now
        //get a File object of the media.fileLocation
        const file = await readFile(media.fileLocation);
        //edit filename of returned file to be the media's name, and grab the file extension from the media's fileLocation
        res.setHeader('Content-Type', lookup(extname(media.fileLocation)));
        res.send(file);
      }
    }
  }
}
