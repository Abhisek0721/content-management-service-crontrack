import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaAccountModule } from '@modules/social_media_accounts/socialMediaAccount.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UtilsModule } from '@utils/utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI, {
      connectionName: process.env.DB_NAME,
      authSource: 'admin',
    }),
    CacheModule.register({
      store: redisStore as unknown as string,
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      ttl: 3 * 60 * 1000, // Cache TTL (time to live) in seconds
      isGlobal: true,
    }),
    SocialMediaAccountModule, 
    AuthModule,
    UtilsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
