import { Controller, Get } from "@nestjs/common";

@Controller('social-media-account')
export class SocialMediaAccountController {
    @Get('facebook-redirect')
    facebookRedirect() {
        return {
            'success': true
        }
    }
}
