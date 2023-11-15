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
import { MediaService, VideoService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IVideoUpload, VideoContentTypes } from '@capstone/utils/types';

@controller('/video')
export class VideoController
  extends BaseController
  implements interfaces.Controller
{
  constructor(
    @inject('VideoService') private videoService: VideoService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  @httpGet('/')
  private async getAllVideos(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const videos = await this.videoService.getAll();
    return videos;
  }

  @httpGet('/:id')
  private async getVideo(
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
      const video = await this.videoService.getById(Number(req.params.id));
      if (!video) {
        return this.json(
          {
            error: 'Video not found',
          },
          404
        );
      } else {
        return this.json(video);
      }
    }
  }

  @httpPost('/')
  private async addVideo(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const fileExtension = req.get('File-Extension');
    const media: Buffer = req.body;
    const video = req.query as any as IVideoUpload;
    delete video.tags; //TODO: implement tags

    const media_out = await this.mediaService.addMedia(media, fileExtension);

    const output = await this.videoService.addVideo({
      ...video,
      media_id: media_out.id,
    });
    return this.json(output);
  }

  @httpDelete('/:id')
  private async deleteVideo(
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
      const video = await this.videoService.deleteVideo(Number(req.params.id));
      if (!video) {
        return this.json(
          {
            error: 'Video not found',
          },
          404
        );
      } else {
        return this.json(video);
      }
    }
  }
}
