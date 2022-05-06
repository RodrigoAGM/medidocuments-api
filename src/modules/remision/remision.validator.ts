import AppError from '../../error/app.error';
import { handleRemisionError } from './remision.error';
import { IRemisionCreate, IRemisionCreateDetail } from './remision.interface';

class RemisionValidatorClass {
  private static _instance: RemisionValidatorClass

  async validateCreateInput(data: IRemisionCreate): Promise<IRemisionCreate> {
    try {
      if (!data.hospitalId || !data.requirementId) {
        return Promise.reject(new AppError({
          message: 'No se envió información del requerimiento.',
          statusCode: 400,
        }));
      }

      if (!data.detail || data.detail.length === 0) {
        return Promise.reject(new AppError({
          message: 'No se envio un detalle de remision',
          statusCode: 400,
        }));
      }

      const verifiedDetail: IRemisionCreateDetail[] = [];
      let error;
      for (let idx = 0; idx < data.detail.length; idx += 1) {
        const item = data.detail[idx];
        if (!item.amount || !item.medicineName || !item.meassurement || !item.medicineLotNumber) {
          error = new AppError({
            message: 'El detalle enviado es incorrecto.',
            statusCode: 400,
          });
          break;
        }

        verifiedDetail.push({
          amount: item.amount,
          medicineName: item.medicineName,
          medicineLotNumber: item.medicineLotNumber,
          meassurement: item.meassurement,
        });
      }

      if (error) {
        return Promise.reject(error);
      }

      const verified: IRemisionCreate = {
        digemidChemistId: data.digemidChemistId,
        hospitalId: data.hospitalId,
        requirementId: data.requirementId,
        detail: verifiedDetail,
        digemidSignature: data.digemidSignature,
      };

      return Promise.resolve(verified);
    } catch (error) {
      return Promise.reject(handleRemisionError(error, 'Ocurrió un error al validar la guía de remisión.'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const RemisionValidator = RemisionValidatorClass.Instance;
