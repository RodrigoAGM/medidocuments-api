import AppError from '../../error/app.error';
import { IUser, User } from '../../models/user.model';
import { Result } from '../../types/types';
import { handleUserError } from './user.error';

export class UserService {
  async create(data: IUser): Promise<Result<IUser>> {
    try {
      const user = new User(data);

      const res = await user.save();

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleUserError(error, 'Ocurrió un error al crear el usuario.'));
    }
  }

  async getById(id: string): Promise<Result<IUser>> {
    try {
      const user = await User.findById(id);

      if (user == null) {
        return Promise.reject(new AppError({
          message: 'El usuario no fue encontrado.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleUserError(error, 'Ocurrió un error al obtener el usuario.'));
    }
  }
}
