import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-instagram';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    super({
        clientID: process.env.INSTAGRAM_APP_ID,
        clientSecret: process.env.INSTAGRAM_APP_SECRET,
        callbackURL: `${process.env.BASE_URL_CONTENT_SERVICE}/api/v1/auth/instagram/callback`,
        scope: [
          "instagram_business_manage_messages",
          "instagram_business_content_publish",
          "instagram_business_manage_comments",
          "instagram_basic",
          "Human Agent"
        ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const user = {
        instagramId: profile?.id,
        username: profile?.username,
        displayName: profile?.displayName,
        profilePicture: profile?._json?.profile_picture,
        accessToken,
        refreshToken,
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
