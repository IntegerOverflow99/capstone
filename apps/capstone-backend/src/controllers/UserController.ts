import * as express from 'express';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  request,
  response,
  httpPut,
  httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserService } from '@capstone/utils/services';
import BaseController from './BaseController';

/**
 * User Controller
 * Handles all requests to the /user endpoint
 */
@controller('/user')
export class UserController
  extends BaseController
  implements interfaces.Controller
{
  /**
   * User Controller Constructor - should only ever be called by the Inversify IoC Container
   * @param userService The injected UserService
   * @returns A new UserController
   */
  constructor(@inject('UserService') private userService: UserService) {
    super();
  }

  /**
   * Gets all users on the site
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns A list of all users on the site
   */
  @httpGet('/')
  private async getAllUsers(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const users = await this.userService.getAll();
    return users;
  }

  /**
   * Gets a single user by their username
   * Expects the ID in its url, e.g. /user/username
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns A single user with the given name
   */
  @httpGet('/:username')
  private async getUser(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const user = await this.userService.getByUsername(req.params.username);
    if (!user) {
      return this.json(
        {
          error: 'User not found',
        },
        404
      );
    } else {
      return this.json(user);
    }
  }

  /**
   * Deletes a single user by their ID
   * Expects the ID in its url, e.g. /user/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the deleted user, or an error if the user doesn't exist
   */
  @httpDelete('/:id')
  private async deleteUser(
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
      const user = await this.userService.getById(Number(req.params.id));
      if (!user) {
        return this.json(
          {
            error: 'User not found',
          },
          404
        );
      } else {
        const deleted = await this.userService.deleteUser(
          Number(req.params.id)
        );
        return this.json(deleted);
      }
    }
  }

  /**
   * Updates a single user by their ID
   * Expects the ID in its url, e.g. /user/1
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the newly updated user, or an error if the user doesn't exist
   */
  @httpPut('/:id')
  private async updateUser(
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
      const user = await this.userService.getById(Number(req.params.id));
      if (!user) {
        return this.json(
          {
            error: 'User not found',
          },
          404
        );
      } else {
        const updated = await this.userService.updateUser(
          Number(req.params.id),
          req.body
        );
        return this.json(updated);
      }
    }
  }

  /**
   * Creates a new user
   * Expects a JSON body with the user's information
   * @param req the incoming HTTP request
   * @param res the outgoing HTTP response
   * @returns the newly created user
   */
  @httpPost('/')
  private async addUser(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const user = await this.userService.addUser(req.body);
    return this.json(user);
  }
}
