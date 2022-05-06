import AppError from '../../error/app.error';
import { Signature, ISignature } from '../../models/signature.model';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleSignatureError } from './signature.error';

export class SignatureService {
  async create(payload: Payload, data: ISignature): Promise<Result<string>> {
    try {
      const user = await UserValidator.exists(payload.id);
      await Signature.updateOne({
        user: payload.id,
      }, {
        signature: data.signature,
        user: payload.id,
        name: `${user.name} ${user.firstSurname}`,
      }, { upsert: true });

      return Promise.resolve({ success: true, data: 'Guardado' });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleSignatureError(error, 'Ocurrió un error al crear la firma.'));
    }
  }

  async getSelf(payload: Payload): Promise<Result<ISignature>> {
    try {
      const signature = await Signature.findOne({ user: payload.id }).populate('user', ['name', 'firstSurname', 'secondSurname', 'role']);

      if (signature == null) {
        return Promise.reject(new AppError({
          message: 'La firma no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: signature });
    } catch (error) {
      return Promise.reject(handleSignatureError(error, 'Ocurrió un error al obtener la firma.'));
    }
  }
}
