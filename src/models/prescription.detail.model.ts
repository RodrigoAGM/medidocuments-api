import mongoose, { Schema } from 'mongoose';
import { IMedicine } from './medicine.model';

export interface IPrescriptionDetail {
  _id: string,
  name: string,
  instructions: string,
  dose: string,
  frequency: string,
  time: string,
  application: string,
  requestedAmount: number,
  givenAmount?: number,
  givenMedicine?: string | IMedicine
}

export const prescriptionDetailSchema = new Schema<IPrescriptionDetail>({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
  time: { type: String, required: true },
  application: { type: String, required: true },
  requestedAmount: { type: Number, required: true },
  givenAmount: { type: Number, required: false },
  givenMedicine: { type: Schema.Types.ObjectId, ref: 'Medicine', required: false },
});

export const PrescriptionDetail = mongoose.model<IPrescriptionDetail>('PrescriptionDetail', prescriptionDetailSchema);
