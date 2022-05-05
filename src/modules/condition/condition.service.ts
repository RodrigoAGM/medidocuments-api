import AppError from '../../error/app.error';
import { Conditions, ICondition } from '../../models/condition.model';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleConditionsError } from './condition.error';

export class ConditionService {
  async create(data: ICondition, payload: Payload): Promise<Result<ICondition>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      data.hospital = user.hospital;
      data.chemist = user._id;

      const condition = await Conditions.create(data);

      return Promise.resolve({ success: true, data: condition });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleConditionsError(error, 'Ocurrió un error al guardar las condiciones ambientales.'));
    }
  }

  async getAllFromHospital(payload: Payload): Promise<Result<ICondition[]>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const conditions = await Conditions.find({
        hospital: hospitalId,
      });

      return Promise.resolve({ success: true, data: conditions });
    } catch (error) {
      return Promise.reject(handleConditionsError(error, 'Ocurrió un error al obtener las condiciones ambientales.'));
    }
  }

  async getByIdFromHospital(id: string, payload: Payload): Promise<Result<ICondition>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const condition = await Conditions.findOne({
        _id: id,
        hospital: hospitalId,
      });

      if (condition == null) {
        return Promise.reject(new AppError({
          message: 'El registro no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: condition });
    } catch (error) {
      return Promise.reject(handleConditionsError(error, 'Ocurrió un error al obtener las condiciones ambientales.'));
    }
  }
}
