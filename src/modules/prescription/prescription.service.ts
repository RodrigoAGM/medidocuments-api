import AppError from '../../error/app.error';
import { IPrescriptionDetail } from '../../models/prescription.detail.model';
import { Prescription, IPrescription } from '../../models/prescription.model';
import { PrescriptionStatus, Role } from '../../types/enums';
import { Payload, Result } from '../../types/types';
import { MedicineValidator } from '../medicine/medicine.validator';
import { UserValidator } from '../user/user.validator';
import { handlePrescriptionError } from './prescription.error';

export class PrescriptionService {
  async create(data: IPrescription, payload: Payload): Promise<Result<IPrescription>> {
    try {
      data.doctor = payload.id;
      data.status = PrescriptionStatus.NONE;

      // Validate detail
      if (!data.detail || !(data.detail instanceof Array) || data.detail.length === 0) {
        return Promise.reject(new AppError({
          message: 'Debes incluir el detalle de la receta.',
          statusCode: 400,
        }));
      }

      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      data.hospital = user.hospital;

      // Remove no necessary data
      for (let i = 0; i < data.detail.length; i += 1) {
        delete data.detail[i].givenAmount;
        delete data.detail[i].givenMedicine;
      }

      const prescription = await Prescription.create(data);

      return Promise.resolve({ success: true, data: prescription });
    } catch (error) {
      // console.log(error);
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al crear la receta.'));
    }
  }

  async getAllFromHospital(userId: string): Promise<Result<IPrescription[]>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(userId);

      const prescriptions = await Prescription.find({
        hospital: user.hospital,
      }).select('-detail');

      return Promise.resolve({ success: true, data: prescriptions });
    } catch (error) {
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al obtener las recetas.'));
    }
  }

  async getAllSelf(payload: Payload): Promise<Result<IPrescription[]>> {
    try {
      const prescriptions = await Prescription.find({
        ...(payload.role === Role.DOCTOR ? { doctor: payload.id } : {}),
        ...(payload.role === Role.PATIENT ? { patient: payload.id } : {}),
      }).select('-detail');

      return Promise.resolve({ success: true, data: prescriptions });
    } catch (error) {
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al obtener las recetas.'));
    }
  }

  async getById(id: string, payload: Payload): Promise<Result<IPrescription>> {
    try {
      // Get Hospital
      let hospitalId;
      if (payload.role !== Role.DOCTOR && payload.role !== Role.PATIENT) {
        const user = await UserValidator.exists(payload.id);
        hospitalId = user.hospital;
      }

      const prescription = await Prescription.findOne({
        _id: id,
        ...(payload.role === Role.DOCTOR ? { doctor: payload.id } : {}),
        ...(payload.role === Role.PATIENT ? { patient: payload.id } : {}),
        ...(hospitalId ? { hospital: hospitalId } : {}),
      });

      if (prescription == null) {
        return Promise.reject(new AppError({
          message: 'La receta no existe.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: prescription });
    } catch (error) {
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al obtener la receta.'));
    }
  }

  async getFromPatient(
    dni: string, payload: Payload, status?: PrescriptionStatus
  ): Promise<Result<IPrescription[]>> {
    try {
      // Check patient
      const patient = await UserValidator.findByDni(dni);

      if (patient === null) {
        return Promise.reject(new AppError({
          message: 'El paciente no existe o no se encuentra registrado',
          statusCode: 400,
        }));
      }

      // Get Hospital
      let hospitalId;
      if (payload.role !== Role.DOCTOR) {
        const user = await UserValidator.exists(payload.id);
        hospitalId = user.hospital;
      }

      const prescriptions = await Prescription.find({
        patient: patient._id,
        ...(payload.role === Role.DOCTOR ? { doctor: payload.id } : {}),
        ...(hospitalId ? { hospital: hospitalId } : {}),
        ...(status ? { status } : {}),
      }).select('-detail');

      return Promise.resolve({ success: true, data: prescriptions });
    } catch (error) {
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al obtener las recetas.'));
    }
  }

  async attendPrescription(
    payload: Payload,
    prescriptionId: string,
    detail: IPrescriptionDetail[]
  ): Promise<Result<IPrescription>> {
    try {
      if (!detail) {
        return Promise.reject(new AppError({
          message: 'El detalle enviado es incorrecto.',
          statusCode: 400,
        }));
      }

      // Get user
      const user = await UserValidator.exists(payload.id);

      // Get prescription
      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        hospital: user.hospital,
      });

      if (prescription == null) {
        return Promise.reject(new AppError({
          message: 'La receta no existe.',
          statusCode: 404,
        }));
      }

      let newStatus = PrescriptionStatus.TOTAL;
      let error;

      // Validate provided detail
      for (let index = 0; index < prescription.detail.length; index += 1) {
        // Check if item was provided on new detail
        const item = prescription.detail[index];
        const newItem = detail.find((value) => (value._id === item._id.toString()));

        if (newItem === undefined) {
          error = new AppError({
            message: `El detalle para ${item.name} no fue enviado.`,
            statusCode: 400,
          });
          break;
        } else {
          // Check provided data
          if (!newItem.givenAmount || !newItem.givenMedicine
            || newItem.givenAmount < 0 || newItem.givenAmount > item.requestedAmount) {
            error = new AppError({
              message: `El detalle para ${item.name} es incorrecto.`,
              statusCode: 400,
            });
            break;
          }
          // Check if medicine exist
          // eslint-disable-next-line no-await-in-loop
          await MedicineValidator.exists(newItem.givenMedicine as string, user.hospital as string);

          if (newItem.givenAmount < item.requestedAmount) {
            newStatus = PrescriptionStatus.PARTIAL;
          }
          item.givenAmount = newItem.givenAmount;
          item.givenMedicine = newItem.givenMedicine;
        }
      }

      if (error) {
        return Promise.reject(error);
      }

      // Update prescription
      prescription.status = newStatus;

      const res = await prescription.save();

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      return Promise.reject(handlePrescriptionError(error, 'Ocurrió un error al obtener las recetas.'));
    }
  }
}
