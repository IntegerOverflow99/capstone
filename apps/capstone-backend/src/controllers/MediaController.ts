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

/**
 * Media Controller
 * Handles all requests to the /media endpoint
 */
@controller('/media')
export class MediaController
  extends BaseController
  implements interfaces.Controller
{
  /**
   * Media Controller Constructor - should only ever be called by the Inversify IoC Container
   * @param mediaService The injected MediaService
   * @returns A new MediaController
   */
  constructor(@inject('MediaService') private mediaService: MediaService) {
    super();
  }

  /**
   * Grab all media on the site
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns A list of all media on the site
   */
  @httpGet('/')
  private async getAllMedia(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const media = await this.mediaService.getAll();
    return media;
  }

  /**
   * Get a handful of media by their IDs
   * Expects a query parameter with a comma-separated list of IDs
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns A list of media with the given IDs, or an emtpy list if no media with the given IDs exist
   */
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

  /**
   * Get all media that a user has favorited.
   * Expects a URL parameter with the user's ID
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns An object with three keys, video, audio, and photo, each containing a list of the user's favorited media of that type
   */
  @httpGet('/favorites/:userID')
  private async getFavorites(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const rawFavorites = (
      await this.mediaService.getFavorites(Number(req.params.userID))
    ).map((favorite: any) => ({
      video: favorite.media.video,
      audio: favorite.media.audio,
      photo: favorite.media.photo,
    }));
    const favorites = {
      video: rawFavorites
        .filter((favorite) => favorite.video !== null)
        .map((favorite) => favorite.video),
      audio: rawFavorites
        .filter((favorite) => favorite.audio !== null)
        .map((favorite) => favorite.audio),
      photo: rawFavorites
        .filter((favorite) => favorite.photo !== null)
        .map((favorite) => favorite.photo),
    };
    return favorites;
  }

  /**
   * Add a media to a user's favorites
   * Expects a JSON body with a userID, and a URL parameter with the media's ID
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns The media that was favorited
   */
  @httpPost('/favorite/:id')
  private async favoriteMedia(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const media = await this.mediaService.favoriteMedia(
      Number(req.params.id),
      req.body.userID
    );
    return media;
  }

  /**
   * Search for media by name
   * Expects a query parameter with the search query
   * @param req The incoming HTTP request
   * @param res The outgoing HTTP response
   * @returns A list of all media that match the given search query
   */
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

  /**
   * Get a single media by its ID
   * Expects a URL portion with the media's ID, eg. /media/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns A single media object with the given ID
   */
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
        // res.sendFile(media.fileLocation);

        //get a File object of the media.fileLocation
        const file = await readFile(media.fileLocation);
        //edit filename of returned file to be the media's name, and grab the file extension from the media's fileLocation
        res.setHeader('Content-Type', lookup(extname(media.fileLocation)));
        //need to set content-length header, otherwise the file will not be sent
        res.setHeader('Content-Length', file.length);
        //send the file
        res.status(200).send(file);
      }
    }
  }
}
