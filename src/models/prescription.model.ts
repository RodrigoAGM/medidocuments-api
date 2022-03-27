import mongoose, { Schema } from 'mongoose';
import { PrescriptionStatus } from '../types/enums';
import { IHospital } from './hospital.model';
import { IPrescriptionDetail, prescriptionDetailSchema } from './prescription.detail.model';
import { IUser } from './user.model';

export interface IPrescription {
  _id: string,
  diagnosis: string,
  sis: boolean,
  status: PrescriptionStatus,
  detail: IPrescriptionDetail[]
  patient: string | IUser,
  doctor: string | IUser,
  hospital: string | IHospital,
  ticketSerial?: string,
  ticketCorrelative?: string,
}

const prescriptionSchema = new Schema<IPrescription>({
  diagnosis: { type: String, required: true },
  sis: { type: Boolean, required: true, default: false },
  status: { type: String, enum: PrescriptionStatus, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  detail: [{ type: prescriptionDetailSchema, required: true }],
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  ticketSerial: { type: String, required: false },
  ticketCorrelative: { type: String, required: false },
});

export const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);
