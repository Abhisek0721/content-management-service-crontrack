import { Module } from '@nestjs/common';
import { SocialMediaAccountController } from './controllers/socialMediaAccount.controller';
import { SocialMediaAccountService } from './services/socialMediaAccount.service';

@Module({
    imports: [],
    controllers: [SocialMediaAccountController],
    providers: [SocialMediaAccountService]
})
export class SocialMediaAccountModule {}
