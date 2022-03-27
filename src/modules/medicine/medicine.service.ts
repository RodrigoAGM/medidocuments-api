import AppError from '../../error/app.error';
import { Medicine, IMedicine } from '../../models/medicine.model';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleMedicineError } from './medicine.error';

export class MedicineService {
  async create(data: IMedicine, payload: Payload): Promise<Result<IMedicine>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      data.hospital = user.hospital;

      const medicine = await Medicine.create(data);

      return Promise.resolve({ success: true, data: medicine });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al crear la medicina.'));
    }
  }

  async getAllFromHospital(payload: Payload): Promise<Result<IMedicine[]>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const medicines = await Medicine.find({
        hospital: hospitalId,
      });

      return Promise.resolve({ success: true, data: medicines });
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al obtener las medicinas.'));
    }
  }

  async searchFromHospital(
    query: string, payload: Payload,
  ): Promise<Result<IMedicine[]>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const medicines = await Medicine.find({
        hospital: hospitalId,
        name: { $regex: query, $options: 'i' },
      });

      return Promise.resolve({ success: true, data: medicines });
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al obtener las medicinas.'));
    }
  }

  async getByIdFromHospital(id: string, payload: Payload): Promise<Result<IMedicine>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const medicine = await Medicine.findOne({
        _id: id,
        hospital: hospitalId,
      });

      if (medicine == null) {
        return Promise.reject(new AppError({
          message: 'La medicina no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: medicine });
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al obtener la medicina.'));
    }
  }

  async getByLotFromHospital(lotNumber: number, payload: Payload): Promise<Result<IMedicine>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const medicine = await Medicine.findOne({
        lotNumber,
        hospital: hospitalId,
      });

      if (medicine == null) {
        return Promise.reject(new AppError({
          message: 'La medicina no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: medicine });
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al obtener la medicina.'));
    }
  }

  async update(id: string, data: IMedicine, payload: Payload): Promise<Result<IMedicine>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const medicine = await Medicine.findByIdAndUpdate({
        _id: id,
        hospital: hospitalId,
      });

      if (medicine == null) {
        return Promise.reject(new AppError({
          message: 'La medicina no existe.',
          statusCode: 404,
        }));
      }

      medicine.name = data.name ?? medicine.name;
      medicine.description = data.description ?? medicine.description;

      const updated = await medicine.save();

      return Promise.resolve({ success: true, data: updated });
    } catch (error) {
      return Promise.reject(handleMedicineError(error, 'Ocurrió un error al obtener la medicina.'));
    }
  }
}
