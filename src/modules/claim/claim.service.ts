import AppError from '../../error/app.error';
import { Claim, IClaim } from '../../models/claim.model';
import { ClaimStatus, Role } from '../../types/enums';
import { Payload, Result } from '../../types/types';
import { UserValidator } from '../user/user.validator';
import { handleClaimError } from './claim.error';

export class ClaimService {
  async create(data: IClaim, payload: Payload): Promise<Result<IClaim>> {
    try {
      // Add patient id
      data.patient = payload.id;

      // Set pending status
      data.status = ClaimStatus.PENDING;

      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      data.hospital = user.hospital;

      // Remove no necessary data
      data.comments = '';
      data.responsable = undefined;

      const claim = await Claim.create(data);

      return Promise.resolve({ success: true, data: claim });
    } catch (error) {
      console.log(error);
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al crear el reclamo.'));
    }
  }

  async getAll(
    userId: string, status?: string, dni?: string, dateFrom?: string, dateTo?: string
  ): Promise<Result<IClaim[]>> {
    try {
      // Check if would filter by dates
      let parsedDateFrom;
      if (dateFrom) {
        const parsed = new Date(dateFrom);
        if (Number.isNaN(parsed.getTime())) {
          return Promise.reject(new AppError({
            message: 'La fecha de inicio es inválida.', statusCode: 404,
          }));
        }
        parsedDateFrom = parsed;
      }

      let parsedDateTo;
      if (dateTo) {
        const parsed = new Date(dateTo);
        if (Number.isNaN(parsed.getTime())) {
          return Promise.reject(new AppError({
            message: 'La fecha de fin es inválida.', statusCode: 404,
          }));
        }
        parsedDateTo = parsed;
      }

      const bothDates = parsedDateFrom && parsedDateTo;

      // Check if would filter by dni
      let patientId;
      if (dni) {
        const user = await UserValidator.findByDni(dni);
        if (user == null) {
          return Promise.resolve({ success: true, data: [] });
        }
        patientId = user._id;
      }

      // Get hospital id
      // Only fetch claims from the workers hospital
      const user = await UserValidator.exists(userId);
      const hospitalId = user.hospital;

      const claims = await Claim.find({
        hospital: hospitalId,
        ...(status ? { status } : {}),
        ...(patientId ? { patient: patientId } : {}),
        ...(bothDates ? { createdAt: { $gte: parsedDateFrom, $lte: parsedDateTo } } : {}),
        ...((parsedDateFrom && !bothDates) ? { createdAt: { $gte: parsedDateFrom } } : {}),
        ...((parsedDateTo && !bothDates) ? { createdAt: { $lte: parsedDateTo } } : {}),
      }).sort({ createdAt: 'desc' });

      return Promise.resolve({ success: true, data: claims });
    } catch (error) {
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al obtener los reclamos.'));
    }
  }

  async getById(id: string, userId: string): Promise<Result<IClaim>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(userId);
      const hospitalId = user.hospital;

      const claim = await Claim.findOne({
        _id: id,
        ...(user.role === Role.PATIENT ? {
          patient: userId,
        } : {
          hospital: hospitalId,
        }),
      }).populate(['patient', 'responsable', 'hospital']);

      if (claim == null) {
        return Promise.reject(new AppError({
          message: 'El reclamo no fue encontrado.',
          statusCode: 404,
        }));
      }

      return Promise.resolve({ success: true, data: claim });
    } catch (error) {
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al obtener el reclamo.'));
    }
  }

  async getSelfClaims(payload: Payload): Promise<Result<IClaim[]>> {
    try {
      const claims = await Claim.find({ patient: payload.id }).sort({ createdAt: 'desc' });

      return Promise.resolve({ success: true, data: claims });
    } catch (error) {
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al obtener los reclamos.'));
    }
  }

  async getClaimsByLotNumber(payload: Payload, lotNumber: number): Promise<Result<IClaim[]>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      const claims = await Claim.find({
        lotNumber,
        ...(user.role === Role.PATIENT ? {
          patient: payload.id,
        } : {
          hospital: hospitalId,
        }),
      }).sort({ createdAt: 'desc' });

      return Promise.resolve({ success: true, data: claims });
    } catch (error) {
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al obtener los reclamos.'));
    }
  }

  async atendClaim(
    payload: Payload,
    claimId: string,
    comments: string,
    newStatus: ClaimStatus,
  ): Promise<Result<IClaim>> {
    try {
      // Get Hospital
      const user = await UserValidator.exists(payload.id);
      const hospitalId = user.hospital;

      // Get the claim
      const claim = await Claim.findOne({
        _id: claimId,
        hospital: hospitalId,
      });

      if (claim === null) {
        return Promise.reject(new AppError(
          { message: 'El reclamo no existe', statusCode: 404 }
        ));
      }

      // Validate data
      if (claim.status !== ClaimStatus.PENDING) {
        return Promise.reject(new AppError(
          { message: 'El reclamo ya fue atendido.', statusCode: 400 }
        ));
      }

      if (!comments || comments.length === 0) {
        return Promise.reject(new AppError(
          { message: 'Se deben incluir comentarios.', statusCode: 400 }
        ));
      }

      if (!newStatus || !Object.values(ClaimStatus).includes(newStatus)) {
        return Promise.reject(new AppError(
          { message: 'Se deben incluir el nuevo estado (ATENDIDO/RECHAZADO).', statusCode: 400 }
        ));
      }

      if (newStatus === ClaimStatus.PENDING) {
        return Promise.reject(new AppError(
          { message: 'El estado no puede ser pendiente.', statusCode: 400 }
        ));
      }

      claim.status = newStatus;
      claim.comments = comments;
      claim.responsable = payload.id;

      const res = await claim.save();

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      return Promise.reject(handleClaimError(error, 'Ocurrió un error al actualizar el reclamo.'));
    }
  }
}
