import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret: string;

  @Prop({ type: [String], default: [] })
  backupCodes: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
