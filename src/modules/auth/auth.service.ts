import { compare } from 'bcrypt';
import AppError from '../../error/app.error';
import { IUser, User } from '../../models/user.model';
import { tokenManager } from '../../token/token.manager';
import { Result } from '../../types/types';

export class AuthService {
  async signIn(username: string, password: string): Promise<Result<IUser>> {
    try {
      const user = await User.findOne({ username }).exec();

      // Check user
      if (user === null) {
        return Promise.reject(new AppError({
          message: 'El usuario no existe.',
          statusCode: 400,
        }));
      }

      // Check password
      const isValid = await compare(password, user.password);
      if (!isValid) {
        return Promise.reject(new AppError({
          message: 'La contraseña es incorrecta.',
          statusCode: 400,
        }));
      }

      // Create tokens
      const tokens = await tokenManager.createTokens(user);

      const res = {
        ...user.toObject(),
        ...tokens,
      };

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
