import { Injectable } from '@angular/core';
import { WEB_API_URLS } from '@shared/consts/web-api-urls.const';
import { AuthService } from '@app/auth/shared/services/auth.service';

@Injectable()
export class UserPictureService {

    constructor(
        private  authService: AuthService,
    ) {
    }

    public getUserAvatarImgUrl(userId) {
        return `${ WEB_API_URLS.WEB_API_IDENTITY_URI }users/${ userId }` +
        `/picture?access_token=${ this.authService.getAccessToken() }&tmp=${ +new Date() }`;
    }
}
