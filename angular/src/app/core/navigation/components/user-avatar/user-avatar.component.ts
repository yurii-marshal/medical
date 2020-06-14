import {
    Component,
    Input,
} from '@angular/core';
import { ProfileService } from '@shared/services/profile.service';
import { Profile } from '@shared/interfaces/models/profile.model';
import { UserPictureService } from '@shared/services/user-picture.service';

@Component({
    selector: 'app-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
})

export class UserAvatarComponent {
    private _profileInfo: Profile;

    public userPictureStyle: any = {};

    @Input()
    set profileInfo(profileData: Profile) {

        if (!profileData) {
            return ;
        }

        profileData.FullName = this.concatUserFullName(profileData.Name);

        this.userPictureStyle = {};

        if (!profileData.Picture && profileData.PictureUrl) {
            this.getUserPicture(profileData);
        } else {
            this.userPictureStyle = {
                'background-image': 'url(assets/images/avatar.jpg)',
            };
        }

        this._profileInfo = profileData;
    }

    get profileInfo(): Profile {
        return this._profileInfo;
    }

    constructor(
        private profileService: ProfileService,
        private userPictureService: UserPictureService,
    ) {}

    /**
     * @description get User Picture by Token from Profile Info
     */
    private getUserPicture(profileInfo: Profile): void {

        profileInfo.Picture = this.userPictureService.getUserAvatarImgUrl(profileInfo.Id);

        this.userPictureStyle = {
            'background-image': `url(${profileInfo.Picture})`,
        };
    }

    private concatUserFullName(userName): string {
        return `${userName.FirstName} ${userName.LastName}`;
    }
}
