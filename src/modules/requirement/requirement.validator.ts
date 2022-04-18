import AppError from '../../error/app.error';
import { handleRequirementError } from './requirement.error';
import { IRequirementCreate, IRequirementCreateDetail } from './requirement.interface';

class RequirementValidatorClass {
  private static _instance: RequirementValidatorClass

  async validateCreateInput(data: IRequirementCreate): Promise<IRequirementCreate> {
    try {
      if (!data.detail || data.detail.length === 0) {
        return Promise.reject(new AppError({
          message: 'No se envio un detalle de requerimiento',
          statusCode: 400,
        }));
      }

      const verifiedDetail: IRequirementCreateDetail[] = [];
      let error;
      for (let idx = 0; idx < data.detail.length; idx += 1) {
        const item = data.detail[idx];
        if (!item.amount || !item.detail || !item.meassurement) {
          error = new AppError({
            message: 'El detalle enviado es incorrecto.',
            statusCode: 400,
          });
          break;
        }

        verifiedDetail.push({
          amount: item.amount,
          detail: item.detail,
          meassurement: item.meassurement,
        });
      }

      if (error) {
        return Promise.reject(error);
      }

      const verified: IRequirementCreate = {
        chemistId: data.chemistId,
        hospitalId: data.hospitalId,
        detail: verifiedDetail,
      };

      return Promise.resolve(verified);
    } catch (error) {
      return Promise.reject(handleRequirementError(error, 'Ocurrió un error al validar el requerimiento.'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const RequirementValidator = RequirementValidatorClass.Instance;
