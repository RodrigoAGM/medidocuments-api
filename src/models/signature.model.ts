import mongoose, { Schema } from 'mongoose';
import { Role } from '../types/enums';

export interface ISignatureUser {
  name: string, firstSurname: string, secondSurname: string, role: Role
}

export interface ISignature {
  _id: string,
  user: string | ISignatureUser,
  signature: string,
}

const signatureSchema = new Schema<ISignature>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  signature: { type: String, required: true },
});

export const Signature = mongoose.model<ISignature>('Signature', signatureSchema);
