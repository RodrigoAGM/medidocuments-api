import { Error } from 'mongoose';
import AppError from '../../error/app.error';

export function handleHospitalError(error: any, defValue: string): AppError {
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

  return new AppError({ message, statusCode });
}
