import AppError from '../../error/app.error';
import { handleTechnicalDocumentError } from './document.error';
import { ITechnicalDocumentCreate, ITechnicalDocumentCreateDetail } from './document.interface';

class TechnicalDocumentValidatorClass {
  private static _instance: TechnicalDocumentValidatorClass

  async validateCreateInput(data: ITechnicalDocumentCreate): Promise<ITechnicalDocumentCreate> {
    try {
      if (!data.hospitalId || !data.requirementId) {
        return Promise.reject(new AppError({
          message: 'No se envió información del requerimiento.',
          statusCode: 400,
        }));
      }

      if (!data.remisionId) {
        return Promise.reject(new AppError({
          message: 'No se envió información de la guía de remisión.',
          statusCode: 400,
        }));
      }

      if (!data.detail || data.detail.length === 0) {
        return Promise.reject(new AppError({
          message: 'No se envio un detalle de documento técnico',
          statusCode: 400,
        }));
      }

      const verifiedDetail: ITechnicalDocumentCreateDetail[] = [];
      let error;
      for (let idx = 0; idx < data.detail.length; idx += 1) {
        const item = data.detail[idx];
        if (!item.packageDescription || !item.medicineName
          || !item.temperatureDescription || !item.transportConditions) {
          error = new AppError({
            message: 'El detalle enviado es incorrecto.',
            statusCode: 400,
          });
          break;
        }

        verifiedDetail.push({
          packageDescription: item.packageDescription,
          medicineName: item.medicineName,
          temperatureDescription: item.temperatureDescription,
          transportConditions: item.transportConditions,
        });
      }

      if (error) {
        return Promise.reject(error);
      }

      const verified: ITechnicalDocumentCreate = {
        digemidChemistId: data.digemidChemistId,
        hospitalId: data.hospitalId,
        requirementId: data.requirementId,
        remisionId: data.remisionId,
        detail: verifiedDetail,
      };

      return Promise.resolve(verified);
    } catch (error) {
      return Promise.reject(handleTechnicalDocumentError(error, 'Ocurrió un error al validar el documento técnico.'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const TechnicalDocumentValidator = TechnicalDocumentValidatorClass.Instance;
