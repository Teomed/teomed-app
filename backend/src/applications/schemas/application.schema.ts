import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Application extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  version: string;

  @Prop()
  downloadUrl: string;

  @Prop()
  category: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
