import { JwtAuthGuard } from '@modules/auth/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { AddFacebookPageDto } from '../dto/addFacebook.dto';
import { User } from '@modules/auth/decorators/user.decorator';
import { JwtDto } from '@modules/auth/dto/jwt.dto';
import { SocialMediaAccountService } from '../services/socialMediaAccount.service';

@Controller('social-media-account')
@UseGuards(JwtAuthGuard)
export class SocialMediaAccountController {
  constructor(
    private readonly apiUtilsService: ApiUtilsService,
    private readonly socialMediaAccountService: SocialMediaAccountService
  ) {}

  @Post('add-facebook-page')
  async addFacebookPage(@Body() dto: AddFacebookPageDto, @User() user: JwtDto) {
    const data = await this.socialMediaAccountService.addFacebookPage(dto, user);
    return this.apiUtilsService.make_response(data);
  }
}
