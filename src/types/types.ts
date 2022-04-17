import { Role } from './enums';

export type Result<T> = {
  error?: Error;
  success: boolean;
  data?: T;
  params?: any;
}

export type ContractResult = {
  success: boolean,
  data?: {} | string,
  error?: {} | string
}

// Interface used to parse payload from token
export type Payload = {
  id: string,
  dni: string,
  role: Role,
  iat?: number,
  exp?: number
}

export type UserTokens = {
  token: string;
  refreshToken: string;
}

export type MongoServerError = {
  index: number,
  code: number,
  keyPattern: {
    [key: string]: number
  },
  keyValue: {
    [key: string]: string
  }
}
