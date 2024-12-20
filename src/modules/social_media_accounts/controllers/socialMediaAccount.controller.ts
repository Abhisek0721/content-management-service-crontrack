import { JwtAuthGuard } from '@common/guards/index';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { AddFacebookPageDto } from '../dto/addFacebook.dto';
import { User } from '@common/decorators/user.decorator';
import { JwtDto } from '@modules/auth/dto/jwt.dto';
import { SocialMediaAccountService } from '../services/socialMediaAccount.service';
import { WorkspaceInterceptor } from '@common/interceptors/workspace.interceptor';
import { GetWorkspaceId } from '@common/decorators/workspace.decorator';

@Controller('social-media-account')
@UseGuards(JwtAuthGuard)
export class SocialMediaAccountController {
  constructor(
    private readonly apiUtilsService: ApiUtilsService,
    private readonly socialMediaAccountService: SocialMediaAccountService,
  ) {}

  @Post('add-facebook-page')
  async addFacebookPage(@Body() dto: AddFacebookPageDto, @User() user: JwtDto) {
    const data = await this.socialMediaAccountService.addFacebookPage(
      dto,
      user,
    );
    return this.apiUtilsService.make_response(data);
  }

  @Get()
  @UseInterceptors(WorkspaceInterceptor)
  async getAllSocialAccounts(@GetWorkspaceId() workspaceId: string) {
    const data =
      await this.socialMediaAccountService.getAllSocialAccounts(workspaceId);
    return this.apiUtilsService.make_response(data);
  }
}
