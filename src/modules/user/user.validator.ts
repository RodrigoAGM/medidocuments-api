import AppError from '../../error/app.error';
import { IUser, User } from '../../models/user.model';
import { handleUserError } from './user.error';

class UserValidatorClass {
  private static _instance: UserValidatorClass

  async exists(id: string): Promise<IUser> {
    try {
      const user = await User.findById(id);

      if (user == null) {
        return Promise.reject(new AppError({
          message: 'No se encontó un usuario con el id ingresado',
          statusCode: 404,
        }));
      }

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(handleUserError(error, 'Ocurrió un error al validar el usuario.'));
    }
  }

  async findByDni(dni: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ dni });

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(handleUserError(error, 'Ocurrió un error al buscar el usuario.'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const UserValidator = UserValidatorClass.Instance;
