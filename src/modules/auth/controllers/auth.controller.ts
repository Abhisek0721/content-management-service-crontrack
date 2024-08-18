import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Redirects to Facebook for authentication
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    const user = req.user;
    const accessToken = user.accessToken;
    const refreshToken = user.refreshToken;
    // You can save accessToken securely in your database or in-memory store.
    return { accessToken, refreshToken, profile: user.profile };
  }
}
