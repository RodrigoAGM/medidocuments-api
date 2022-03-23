import mongoose, { Schema } from 'mongoose';

export interface ITokens {
  accessToken: string,
  refreshToken: string,
}

const tokenSchema = new Schema<ITokens>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export const Tokens = mongoose.model<ITokens>('Tokens', tokenSchema);
