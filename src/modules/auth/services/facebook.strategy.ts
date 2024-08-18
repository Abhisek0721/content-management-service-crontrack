import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL_CONTENT_SERVICE}/auth/facebook/callback`,
      scope: [
        'email',
        'public_profile',
        'instagram_basic',
        'pages_show_list',
        'pages_manage_posts',
      ],
      profileFields: ['id', 'displayName', 'photos', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const user = {
        accessToken,
        refreshToken,
        profile,
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
