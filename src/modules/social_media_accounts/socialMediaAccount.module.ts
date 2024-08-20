import { Module } from '@nestjs/common';
import { SocialMediaAccountController } from './controllers/socialMediaAccount.controller';
import { SocialMediaAccountService } from './services/socialMediaAccount.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SocialMediaAccount,
  SocialMediaAccountSchema,
} from './models/socialMediaAccount.model';
import { DATABASE_NAME } from '@constants/index';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SocialMediaAccount.name,
          schema: SocialMediaAccountSchema,
        },
      ],
      DATABASE_NAME,
    ),
  ],
  controllers: [SocialMediaAccountController],
  providers: [SocialMediaAccountService],
})
export class SocialMediaAccountModule {}
