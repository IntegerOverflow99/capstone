import { TableNames } from './TableNames';
import { IUserDBModel } from '../types/User.types';
import BaseEntity from './BaseEntity';

export class User extends BaseEntity implements IUserDBModel {
  static override get tableName() {
    return TableNames.USERS;
  }

  id!: number;
  username!: string;
  password_hash!: string;
  allowed_video_content_rating!: string;
  admin!: boolean;
}
