import AppError from '../../error/app.error';
import { IUser, User } from '../../models/user.model';
import { Role } from '../../types/enums';
import { Result } from '../../types/types';
import { handleUserError } from './user.error';
import { UserValidator } from './user.validator';

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
      const user = await User.findById(id).populate('hospital');

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

  async getByDni(id: string, dni: string): Promise<Result<IUser>> {
    try {
      // Get Hospital first
      const user = await UserValidator.exists(id);
      const hospitalId = user.hospital;

      const patient = await User.findOne({
        dni, hospital: hospitalId, role: Role.PATIENT,
      }).populate('hospital');

      if (patient == null) {
        return Promise.reject(new AppError({
          message: 'El usuario no fue encontrado.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: patient });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleUserError(error, 'Ocurrió un error al obtener el usuario.'));
    }
  }
}
