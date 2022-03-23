import mongoose, { Schema } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { Role } from '../types/enums';

export interface IUser {
  _id: string,
  username: string,
  password: string,
  dni: string,
  name: string,
  firstSurname: string,
  secondSurname: string,
  phone: string,
  email: string,
  secondEmail?: string,
  speciality?: string,
  birthDate: Date,
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
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: Number, enum: Role, required: true },
  secondEmail: { type: String, required: false },
  speciality: { type: String, required: false },
  birthDate: { type: Date, required: true },
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
