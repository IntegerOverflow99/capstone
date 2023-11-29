import { User } from '../../entities/User';
import { IUserDBModel, IUserJSONModel } from '../../types/User.types';
import DataService from './data-service-decorator';

@DataService()
export class UserService {
  public async getAll() {
    const res = (await User.query().select(
      'id',
      'username',
      'allowed_video_content_rating',
      'admin'
    )) as Array<IUserDBModel>;
    return res;
  }

  public async getByUsername(username: string) {
    const res = (await User.query()
      .select('*')
      .where('username', username)) as any as Array<IUserJSONModel>;
    return res[0];
  }

  public async getById(id: number) {
    const res = (await User.query().findById(id)) as IUserDBModel;
    return res;
  }

  public async addUser(user: IUserDBModel) {
    const res = (await User.query().insert(user)) as IUserDBModel;
    return res;
  }

  public async deleteUser(id: number) {
    //need to set foreign key constraints to cascade on delete
    await User.knex().raw('SET FOREIGN_KEY_CHECKS = 0');
    const res = await User.query().deleteById(id);
    await User.knex().raw('SET FOREIGN_KEY_CHECKS = 1');

    // const res = await User.query().deleteById(id);
    return res >= 1;
  }

  public async updateUser(id: number, user: IUserDBModel) {
    const res = (await User.query().patchAndFetchById(
      id,
      user
    )) as IUserDBModel;
    return res;
  }
}
