import AppError from '../../error/app.error';

export function handleRemisionError(error: any, defValue: string): AppError {
  const message = defValue;
  const statusCode = 500;

  if ((error as AppError).statusCode) {
    return error;
  }

  return new AppError({ message, statusCode });
}
