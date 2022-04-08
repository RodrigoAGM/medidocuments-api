import mongoose, { Schema } from 'mongoose';
import { ClaimStatus } from '../types/enums';
import { IHospital } from './hospital.model';
import { IUser } from './user.model';

const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IClaim {
  _id: string,
  code?: number,
  ticketSerial: string,
  ticketCorrelative: string,
  prescriptionCode: string,
  detail: string,
  lotNumber: number,
  patient: string | IUser,
  responsable?: string | IUser,
  hospital: string | IHospital,
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
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
}, { timestamps: true });

claimSchema.plugin(AutoIncrement, { inc_field: 'code' });

export const Claim = mongoose.model<IClaim>('Claim', claimSchema);
