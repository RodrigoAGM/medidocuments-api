import mongoose, { Schema } from 'mongoose';
import { ClaimStatus } from '../types/enums';
import { IUser } from './user.model';

export interface IClaim {
  _id: string,
  ticketSerial: string,
  ticketCorrelative: string,
  prescriptionCode: string,
  detail: string,
  lotNumber: number,
  patient: string | IUser,
  responsable?: string | IUser,
  status: ClaimStatus,
  comments: string,
  createdAt?: string,
  updatedAt?: string,
}

const claimSchema = new Schema<IClaim>({
  ticketSerial: { type: String, required: true },
  ticketCorrelative: { type: String, required: true },
  prescriptionCode: { type: String, required: true },
  lotNumber: { type: Number, required: true },
  detail: { type: String, required: true },
  status: { type: String, enum: ClaimStatus, required: true },
  comments: { type: String, required: false, default: '' },
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  responsable: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export const Claim = mongoose.model<IClaim>('Claim', claimSchema);
