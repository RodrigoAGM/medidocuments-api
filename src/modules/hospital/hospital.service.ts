import AppError from '../../error/app.error';
import { Hospital, IHospital } from '../../models/hospital.model';
import { Result } from '../../types/types';
import { handleHospitalError } from './hospital.error';

export class HospitalService {
  async create(data: IHospital): Promise<Result<IHospital>> {
    try {
      const hospital = await Hospital.create(data);

      return Promise.resolve({ success: true, data: hospital });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleHospitalError(error, 'Ocurrió un error al crear el hospital.'));
    }
  }

  async getAll(): Promise<Result<IHospital[]>> {
    try {
      const hospitals = await Hospital.find();

      return Promise.resolve({ success: true, data: hospitals });
    } catch (error) {
      return Promise.reject(handleHospitalError(error, 'Ocurrió un error al obtener los hospitales.'));
    }
  }

  async getById(id: string): Promise<Result<IHospital>> {
    try {
      const hospital = await Hospital.findById(id);

      if (hospital == null) {
        return Promise.reject(new AppError({
          message: 'El hospital no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: hospital });
    } catch (error) {
      return Promise.reject(handleHospitalError(error, 'Ocurrió un error al obtener el hospital.'));
    }
  }
}
