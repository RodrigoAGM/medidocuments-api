import { compare } from 'bcrypt';
import AppError from '../../error/app.error';
import { ITokens, Tokens } from '../../models/token.model';
import { IUser, User } from '../../models/user.model';
import { tokenManager } from '../../token/token.manager';
import { Result } from '../../types/types';
import { handleAuthError } from './auth.error';

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

      await Tokens.create({
        accessToken: tokens.token,
        refreshToken: tokens.refreshToken,
      });

      const res = {
        ...user.toObject(),
        ...tokens,
      };

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      return Promise.reject(handleAuthError(error, 'Ocurrió un error al iniciar sesión'));
    }
  }

  async signOut(refreshToken: string): Promise<Result<String>> {
    try {
      await Tokens.deleteOne({
        refreshToken,
      });

      return Promise.resolve({ success: true, data: 'Sesión cerrada correctamente!' });
    } catch (error) {
      return Promise.reject(handleAuthError(error, 'Ocurrió un error al cerrar sesión'));
    }
  }

  async refreshToken(tokens: ITokens): Promise<Result<ITokens>> {
    try {
      const data = await Tokens.findOne({
        refreshToken: tokens.refreshToken,
      });

      if (data == null) {
        return Promise.reject(new AppError({
          message: 'Los tokens enviados no son válidos.',
          statusCode: 400,
        }));
      }

      if (data.accessToken !== tokens.accessToken) {
        // Delete refresh token for security
        await data.delete();
        return Promise.reject(new AppError({
          message: 'Los tokens enviados no son válidos.',
          statusCode: 400,
        }));
      }

      // Refresh token
      const refreshed = await tokenManager.refreshToken(tokens.refreshToken);
      data.accessToken = refreshed;
      await data.save();

      return Promise.resolve({ success: true, data });
    } catch (error) {
      return Promise.reject(handleAuthError(error, 'Ocurrió un error al refrescar el token.'));
    }
  }
}
