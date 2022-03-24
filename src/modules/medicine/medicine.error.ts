import { Error } from 'mongoose';
import AppError from '../../error/app.error';
import { MongoServerError } from '../../types/types';

export function handleMedicineError(error: any, defValue: string): AppError {
  let message = defValue;
  let statusCode = 500;

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error.ValidationError) {
    message = 'Debes completar todos los campos obligatorios.';
    statusCode = 400;
  }

  if (error instanceof Error.CastError) {
    message = 'El id ingresado es inválido.';
    statusCode = 400;
  }

  const mongoError = error as MongoServerError;
  if (mongoError.code === 11000) {
    if (mongoError.keyPattern.lotNumber) {
      message = 'El número de lote ingresado ya se enuentra registrado.';
      statusCode = 400;
    }
  }

  return new AppError({ message, statusCode });
}
