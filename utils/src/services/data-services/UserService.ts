import { User } from '../../entities/User';
import { IUserDBModel, IUserJSONModel } from '../../types/User.types';
import DataService from './data-service-decorator';

/**
 * User service for querying the user table.
 */
@DataService()
export class UserService {
  /**
   * @returns All user entries in the user table.
   */
  public async getAll() {
    const res = (await User.query().select(
      'id',
      'username',
      'allowed_video_content_rating',
      'admin'
    )) as Array<IUserDBModel>;
    return res;
  }

  /**
   * @param username Username of the user to get
   * @returns A single user entry with the given username
   */
  public async getByUsername(username: string) {
    const res = (await User.query()
      .select('*')
      .where('username', username)) as any as Array<IUserJSONModel>;
    return res[0];
  }

  /**
   * @param id ID of the user to get
   * @returns A single user entry with the given ID
   */
  public async getById(id: number) {
    const res = (await User.query().findById(id)) as IUserDBModel;
    return res;
  }

  /**
   * @param user User to add to the database
   * @returns The added user entry
   */
  public async addUser(user: IUserDBModel) {
    const res = (await User.query().insert(user)) as IUserDBModel;
    return res;
  }

  /**
   * @param id ID of the user to delete
   * @returns Boolean indicating whether the user was deleted
   */
  public async deleteUser(id: number) {
    //TODO: need to set foreign key constraints to cascade on delete
    await User.knex().raw('SET FOREIGN_KEY_CHECKS = 0');
    const res = await User.query().deleteById(id);
    await User.knex().raw('SET FOREIGN_KEY_CHECKS = 1');

    // const res = await User.query().deleteById(id);
    return res >= 1;
  }

  /**
   * @param id ID of the user to update
   * @param user User object with updated values
   * @returns Updated user object
   */
  public async updateUser(id: number, user: IUserDBModel) {
    const res = (await User.query().patchAndFetchById(
      id,
      user
    )) as IUserDBModel;
    return res;
  }
}
