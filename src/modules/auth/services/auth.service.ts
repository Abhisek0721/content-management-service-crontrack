import {
  DATABASE_NAME,
  SOCIAL_MEDIA_PLATFORM,
  socialBaseUrl,
} from '@constants/index';
import { SocialMediaAccount } from '@modules/social_media_accounts/models/socialMediaAccount.model';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { generateCryptoToken } from '../utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SocialMediaAccount.name, DATABASE_NAME)
    private socialMediaAccountModel: Model<SocialMediaAccount>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async setTokenToVerifyWorkspace(workspaceId: string) {
    // Generate a 16-byte (32-character) token
    const token = generateCryptoToken(16);
    await this.cacheManager.set(token, workspaceId);
    return token;
  }

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
        throw new BadRequestException('workspaceId is missing in query params');
      }
      const response = await axios.get(
        `${this.configService.get<string>('BASE_URL_IDENTITY_SERVICE')}/api/v1/workspace/validate/${workspaceId}`,
      );
      const check_workspace = response.data?.data?.check_workspace;
      if (!check_workspace) {
        throw new NotFoundException('Invalid workspaceId');
      }
      return;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async saveFacebookAccessToken(token: string, accessToken: string) {
    try {
      const workspaceId = this.cacheManager.get(token);
      if (!workspaceId) {
        throw new BadRequestException('Invalid Token');
      }
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
      return { token, platform: SOCIAL_MEDIA_PLATFORM.FACEBOOK, pages };
    } catch (error) {
      console.log(error?.stack);
      throw error;
    }
  }
}
