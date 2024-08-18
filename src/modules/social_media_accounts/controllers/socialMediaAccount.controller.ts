import { Controller, Get } from "@nestjs/common";

@Controller()
export class SocialMediaAccountController {
    @Get('facebook-redirect')
    facebookRedirect() {
        return {
            'success': true
        }
    }
}
