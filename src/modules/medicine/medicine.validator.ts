import AppError from '../../error/app.error';
import { IMedicine, Medicine } from '../../models/medicine.model';
import { handleMedicineError } from './medicine.error';

class MedicineValidatorClass {
  private static _instance: MedicineValidatorClass

  async exists(id: string, hospital: string): Promise<IMedicine> {
    try {
      const medicine = await Medicine.findOne({
        _id: id,
        hospital,
      });

      if (medicine == null) {
        return Promise.reject(new AppError({
          message: 'No se encontó una medicina con el id ingresado',
          statusCode: 404,
        }));
      }

      return Promise.resolve(medicine);
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al validar la medicina.'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const MedicineValidator = MedicineValidatorClass.Instance;
