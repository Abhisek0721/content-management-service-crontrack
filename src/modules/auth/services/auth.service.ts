import {
  DATABASE_NAME,
  SOCIAL_MEDIA_PLATFORM,
  socialBaseUrl,
} from '@constants/index';
import { SocialMediaAccount } from '@modules/social_media_accounts/models/socialMediaAccount.model';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SocialMediaAccount.name, DATABASE_NAME)
    private socialMediaAccountModel: Model<SocialMediaAccount>,
    private readonly configService: ConfigService,
  ) {}

  // Function to exchange short-lived facebook token for a long-lived token
  async exchangeForLongLivedFacebookToken(shortLivedToken: string) {
    try {
      const longLivedTokenResponse = await axios.get(
        `${socialBaseUrl.FACEBOOK}/v17.0/oauth/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: shortLivedToken,
          },
        },
      );

      const longLivedToken = longLivedTokenResponse.data.access_token;
      return longLivedToken;
    } catch (error) {
      console.error(error?.stack);
      throw error;
    }
  }

  async getFacebookPageAccessToken(pageId, userAccessToken) {
    const url = `https://graph.facebook.com/v17.0/${pageId}?fields=access_token&access_token=${userAccessToken}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data.access_token;
    } catch (error) {
      console.error('Fetch Error:', error?.stack);
      throw error;
    }
  }

  async validateWorkspace(workspaceId: string) {
    try {
      if (!workspaceId) {
        throw new BadRequestException(
          'workspaceId is misssion in query params',
        );
      }
      const response = await axios.get(
        `${this.configService.get<string>('BASE_URL_CONTENT_SERVICE')}/api/v1/workspace/validate/${workspaceId}`,
      );
      const check_workspace = response.data?.data?.check_workspace;
      if (!check_workspace) {
        throw new NotFoundException('Invalid workspaceId');
      }
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async saveFacebookAccessToken(workspaceId: string, accessToken: string) {
    try {
      const longLivedAccessToken =
        await this.exchangeForLongLivedFacebookToken(accessToken);
      const pagesUrl = `${socialBaseUrl.FACEBOOK}/me/accounts?access_token=${accessToken}`;
      const pagesResponse = await axios.get(pagesUrl);
      const pages = pagesResponse.data.data?.map((page) => {
        return {
          pageId: page.id,
          pageName: page.name,
          pageCategory: page.category,
        };
      });
      // await Promise.all(pages);
      await this.socialMediaAccountModel.updateOne(
        {
          workspaceId,
          platform: SOCIAL_MEDIA_PLATFORM.FACEBOOK,
        },
        {
          longLivedAccessToken,
        },
        {
          upsert: true,
        },
      );
      return { workspaceId, platform: SOCIAL_MEDIA_PLATFORM.FACEBOOK, pages };
    } catch (error) {
      console.log(error?.stack);
      throw error;
    }
  }
}
