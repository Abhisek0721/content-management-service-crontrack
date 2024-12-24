import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class SocialMediaAccount extends Document {
  @Prop({ type: String, required: true })
  workspaceId: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      email: { type: String, required: true }
    },
    required: true
  })
  createdBy: {
    userId: string;
    email: string;
  }
}

export const SocialMediaAccountSchema = SchemaFactory.createForClass(SocialMediaAccount);


