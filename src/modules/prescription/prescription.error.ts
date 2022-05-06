import { Error } from 'mongoose';
import AppError from '../../error/app.error';

export function handlePrescriptionError(error: any, defValue: string): AppError {
  let message = defValue;
  let statusCode = 500;
  console.log(error);
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error.ValidationError) {
    console.log(Object.values(error.errors)[0].path);
    message = 'Debes completar todos los campos obligatorios.';
    statusCode = 400;
  }

  if (error instanceof Error.CastError) {
    message = 'El id ingresado es inválido.';
    statusCode = 400;
  }

  return new AppError({ message, statusCode });
}
