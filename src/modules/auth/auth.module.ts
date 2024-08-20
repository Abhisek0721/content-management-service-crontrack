import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './services/jwt.strategy';
import { FacebookStrategy } from './services/facebook.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialMediaAccount, SocialMediaAccountSchema } from '@modules/social_media_accounts/models/socialMediaAccount.model';
import { DATABASE_NAME } from '@constants/index';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '7d' },
    }),
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
  controllers: [AuthController],
  providers: [JwtStrategy, FacebookStrategy, AuthService]
})
export class AuthModule {}
