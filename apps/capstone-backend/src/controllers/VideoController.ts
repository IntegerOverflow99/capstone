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
import { MediaService, VideoService } from '@capstone/utils/services';
import BaseController from './BaseController';
import { IVideoUpload, VideoContentTypes } from '@capstone/utils/types';

/**
 * Video Controller
 * Handles all requests to the /video endpoint
 */
@controller('/video')
export class VideoController
  extends BaseController
  implements interfaces.Controller
{
  /**
   * Video Controller Constructor - should only ever be called by the Inversify IoC Container
   * @param videoService The injected VideoService
   * @param mediaService The injected MediaService
   * @returns A new VideoController
   */
  constructor(
    @inject('VideoService') private videoService: VideoService,
    @inject('MediaService') private mediaService: MediaService
  ) {
    super();
  }

  /**
   * Grab all videos on the site
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns A list of all videos on the site
   */
  @httpGet('/')
  private async getAllVideos(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const videos = await this.videoService.getAll();
    return videos;
  }

  /**
   * Grab a single video by its ID
   * Expects the ID in its url, e.g. /video/1
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The video with the given ID, or an error if the ID is invalid or the video doesn't exist
   */
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

  /**
   * Adds a new video to the site
   * Expects the query pararmeters to match the IVideoUpload interface
   * Expects the media to be in the body of the request
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the newly created video, or an error if the video could not be created
   */
  @httpPost('/')
  private async addVideo(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const fileExtension = req.get('File-Extension');
    const media: Buffer = req.body;
    const video = req.query as any as IVideoUpload;

    const media_out = await this.mediaService.addMedia(media, fileExtension);

    const output = await this.videoService.addVideo({
      ...video,
      media_id: media_out.id,
    });
    return this.json(output);
  }

  /**
   * Updates a single video by its ID
   * Expects the ID in its url, e.g. /video/1
   * Expects the body of the request to match the IVideoUpload interface
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the newly updated video, or an error if the video doesn't exist
   */
  @httpPut('/:id')
  private async updateVideo(
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
      const video = await this.videoService.updateVideo(
        Number(req.params.id),
        req.body
      );
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

  /**
   * Deletes a single video by its ID
   * Expects the ID in its url, e.g. /video/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the deleted video, or an error if the video doesn't exist
   */
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
