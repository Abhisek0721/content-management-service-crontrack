import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SOCIAL_MEDIA_PLATFORM } from 'src/constants';
import { AdditionDetailsOfSocialMediaType } from '../types/additionSocialMediaDetails.type';

@Schema({ timestamps: true })
export class SocialMediaAccount extends Document {
  @Prop({ type: String, required: true })
  workspaceId: string;

  @Prop({ type: String, enum: SOCIAL_MEDIA_PLATFORM, required: true })
  platform: SOCIAL_MEDIA_PLATFORM;

  @Prop({ type: String, required: true })
  longLivedAccessToken: string;

  @Prop({
    type: Object,
    required: false
  })
  additionalDetails: AdditionDetailsOfSocialMediaType
}

export const SocialMediaAccountSchema = SchemaFactory.createForClass(SocialMediaAccount);

// Create a composite unique index on workspaceId and platform
SocialMediaAccountSchema.index({ workspaceId: 1, platform: 1 }, { unique: true });

