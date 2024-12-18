import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ApiUtilsService } from '@utils/utils.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('social-auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtilsService: ApiUtilsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('facebook')
  // @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Query('workspaceId') workspaceId: string) {
    await this.authService.validateWorkspace(workspaceId);
    const token = await this.authService.setTokenToVerifyWorkspace(workspaceId);
    const redirectAuthUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.BASE_URL_CONTENT_SERVICE}/api/v1/social-auth/facebook/callback&state=${token}&scope=email,public_profile,instagram_basic,instagram_content_publish,pages_show_list,pages_manage_posts`;
    // Redirect to Facebook for authentication
    return this.apiUtilsService.make_response({ redirectAuthUrl });
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const shortLivedAccessToken = user.accessToken;
    const token = user.token;
    const data = await this.authService.saveFacebookAccessToken(
      token,
      shortLivedAccessToken,
    );
    return res.redirect(
      `${this.configService.get<string>('FRONTEND_BASE_URL')}/social-auth?data=${JSON.stringify(data)}`,
    );
  }

  @Get('instagram')
  @UseGuards(AuthGuard('instagram'))
  async instagramLogin() {
    // This route will redirect to Instagram for authentication
  }

  @Get('instagram/callback')
  @UseGuards(AuthGuard('instagram'))
  async instagramLoginCallback(@Req() req) {
    const user = req.user;
    // Save the user or access token to the database
    // Return a response or redirect the user
    return user;
  }
}
