import mongoose, { Schema } from 'mongoose';

export interface IHospital {
  _id: string,
  name: string,
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
});

export const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);
