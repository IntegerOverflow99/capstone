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
import { inject, injectable } from 'inversify';
import { UserService } from '@capstone/utils';

@controller('/users')
export class UserController implements interfaces.Controller {
  constructor(@inject('UserService') private userService: UserService) {}

  @httpGet('/')
  private async getAllUsers(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    console.log('get @ /users');
    const users = await this.userService.getAll();
    return users;
  }
}
