import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocialMediaAccount } from '../models/socialMediaAccount.model';
import { DATABASE_NAME, SOCIAL_MEDIA_PLATFORM } from '@constants/index';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AddFacebookPageDto } from '../dto/addFacebook.dto';
import { JwtDto } from '@modules/auth/dto/jwt.dto';

@Injectable()
export class SocialMediaAccountService {
  constructor(
    @InjectModel(SocialMediaAccount.name, DATABASE_NAME)
    private socialMediaAccountModel: Model<SocialMediaAccount>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getWorkspaceIdFromToken(token: string) {
    const workspaceId = await this.cacheManager.get(token);
    return workspaceId;
  }

  async addFacebookPage(addFacebookPageDto: AddFacebookPageDto, user: JwtDto) {
    try {
      const workspaceId = await this.getWorkspaceIdFromToken(
        addFacebookPageDto.token,
      );
      if (!workspaceId) {
        throw new BadRequestException('Token is invalid or expired!');
      }
      await this.cacheManager.del(addFacebookPageDto.token);
      const facebookData = await this.socialMediaAccountModel.findOneAndUpdate(
        {
          workspaceId,
        },
        {
          $set: {
            platform: SOCIAL_MEDIA_PLATFORM.FACEBOOK,
            additionalDetails: {
              userId: user.user_id,
              facebookPageId: addFacebookPageDto.pageId,
              facebookPageName: addFacebookPageDto.pageName,
              facebookPageCategory: addFacebookPageDto.pageCategory,
              facebookProfilePicture: addFacebookPageDto.profilePicture,
            },
          },
        },
      );

      return facebookData;
    } catch (error) {
      if (error?.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}
