import mongoose, { Schema } from 'mongoose';
import { IHospital } from './hospital.model';

export interface IMedicine {
  _id: string,
  name: string,
  description: string,
  lotNumber: number,
  hospital: string | IHospital,
}

const medicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  lotNumber: { type: Number, required: true, unique: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
}, { timestamps: true });

export const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);
