import { User } from '../../entities/User';
import { IUserDBModel } from '../../types/User.types';
import DataService from './data-service-decorator';

@DataService()
export class UserService {
  public async getAll() {
    const res = (await User.query()) as Array<IUserDBModel>;
    return res;
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
    const res = await User.query().deleteById(id);
    return res >= 1;
  }
}
