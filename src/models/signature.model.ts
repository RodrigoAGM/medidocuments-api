import mongoose, { Schema } from 'mongoose';

export interface ISignature {
  _id: string,
  user: string,
  name: string,
  signature: string,
}

const signatureSchema = new Schema<ISignature>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  signature: { type: String, required: true },
  name: { type: String, required: true },
});

export const Signature = mongoose.model<ISignature>('Signature', signatureSchema);
