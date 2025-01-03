import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaAccountModule } from '@modules/social_media_accounts/socialMediaAccount.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UtilsModule } from '@utils/utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CacheModule} from '@nestjs/cache-manager';
import { RedisOptions } from '@utils/functions';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI, {
      connectionName: process.env.DB_NAME,
      authSource: 'admin',
    }),
    CacheModule.registerAsync(RedisOptions),
    SocialMediaAccountModule, 
    AuthModule,
    UtilsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
