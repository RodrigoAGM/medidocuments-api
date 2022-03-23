import AppError from '../../error/app.error';

export function handleAuthError(error: any, defValue: string): AppError {
  const message = defValue;
  const statusCode = 500;

  return new AppError({ message, statusCode });
}
