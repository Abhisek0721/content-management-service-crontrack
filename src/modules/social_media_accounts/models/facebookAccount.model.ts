import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class FacebookAccount extends Document {
    @Prop({
        type: {
            userId: { type: String, required: true },
            email: { type: String, required: true }
        },
        required: true
    })
    addedBy: {
        userId: string;
        email: string;
    }

    @Prop({ type: String, ref: 'SocialMediaAccount', required: true })
    socialMediaAccount: string;

    @Prop({ type: String, required: true })
    longLivedAccessToken: string;

    @Prop({ type: String, required: true })
    facebookPageId: string;

    @Prop({ type: String, required: true })
    facebookPageName: string;

    @Prop({ type: String, required: true })
    facebookPageCategory: string;

    @Prop({ type: String, required: true })
    facebookProfilePicture: string;
}

export const FacebookAccountSchema = SchemaFactory.createForClass(FacebookAccount);


