import mongoose, { Schema } from 'mongoose';
import { ConditionsBase } from '../types/enums';
import { IHospital } from './hospital.model';
import { IUser } from './user.model';

export interface ICondition {
  _id: string,
  chemist: string | IUser,
  hospital: string | IHospital,
  warehouseCode: number,
  standCode: number,
  dayTemperature: number,
  afternoonTemperature: number,
  nightTemperature: number,
  base: ConditionsBase
}

const conditionsSchema = new Schema<ICondition>({
  chemist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  warehouseCode: { type: Number, required: true },
  standCode: { type: Number, required: true },
  dayTemperature: { type: Number, required: true },
  afternoonTemperature: { type: Number, required: true },
  nightTemperature: { type: Number, required: true },
  base: { type: String, enum: ConditionsBase, required: true },
}, { timestamps: true });

export const Conditions = mongoose.model<ICondition>('Conditions', conditionsSchema);
