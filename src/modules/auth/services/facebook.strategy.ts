import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL_CONTENT_SERVICE}/api/v1/social-auth/facebook/callback`,
      scope: [
        'email',
        'public_profile',
        'pages_show_list',
        'pages_manage_posts',
      ],
      profileFields: ['id', 'displayName', 'photos', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req:any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const workspaceId = req.query.state;
      const user = {
        workspaceId,
        accessToken,
        refreshToken,
        profile,
      };
      console.log(user, 'fb-user')
      done(null, user);
    } catch (err) {
      Logger.error(err?.stack);
      done(err, false);
    }
  }
}
