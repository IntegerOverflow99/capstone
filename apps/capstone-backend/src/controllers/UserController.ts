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

@controller('/user')
export class UserController
  extends BaseController
  implements interfaces.Controller
{
  constructor(@inject('UserService') private userService: UserService) {
    super();
  }

  @httpGet('/')
  private async getAllUsers(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const users = await this.userService.getAll();
    return users;
  }

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

  @httpPost('/')
  private async addUser(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const user = await this.userService.addUser(req.body);
    return this.json(user);
  }
}
