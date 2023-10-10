import { User } from '../../entities/User';
import { IUserDBModel } from '../../types/User.types';
import DataService from './data-service-decorator';

@DataService()
export class UserService {
  public async getAll() {
    const res = (await User.query()) as Array<IUserDBModel>;
    return res;
  }
}
