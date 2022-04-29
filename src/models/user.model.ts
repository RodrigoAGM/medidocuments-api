import mongoose, { Schema } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { Role } from '../types/enums';
import { IHospital } from './hospital.model';

export interface IUser {
  _id: string,
  username: string,
  password: string,
  dni: string,
  name: string,
  firstSurname: string,
  secondSurname: string,
  phone?: string,
  email: string,
  hospital: string | IHospital,
  secondEmail?: string,
  speciality?: string,
  birthDate?: Date,
  role: Role
}

const userSchema = new Schema<IUser>({
  username: {
    type: String, required: true, unique: true,
  },
  password: { type: String, required: true },
  dni: {
    type: String,
    required: true,
    unique: true,
    minlength: [8, 'El dni debe tener 8 dígitos'],
    maxlength: [8, 'El dni debe tener 8 dígitos'],
  },
  name: { type: String, required: true },
  firstSurname: { type: String, required: true },
  secondSurname: { type: String, required: true },
  phone: { type: String, required: false },
  email: { type: String, required: true },
  role: { type: Number, enum: Role, required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  secondEmail: { type: String, required: false },
  speciality: { type: String, required: false },
  birthDate: { type: Date, required: false },
});

// eslint-disable-next-line func-names
userSchema.pre('save', async function (this: IUser, next) {
  // Hash password before saving
  const salt = await genSalt();
  const hashedPass = await hash(this.password, salt);
  this.password = hashedPass;

  // Remove specialty if not doctor
  if (this.role !== Role.DOCTOR) {
    this.speciality = undefined;
  }

  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
