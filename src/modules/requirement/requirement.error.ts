import AppError from '../../error/app.error';

export function handleRequirementError(error: any, defValue: string): AppError {
  const message = defValue;
  const statusCode = 500;

  if (error instanceof AppError) {
    return error;
  }

  return new AppError({ message, statusCode });
}
