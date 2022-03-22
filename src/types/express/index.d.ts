import { Payload } from '../types';

/* eslint-disable no-unused-vars */
declare global {
  namespace Express {
    interface Request {
      payload: Payload
    }
  }
}
