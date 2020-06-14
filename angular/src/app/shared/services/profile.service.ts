import { Injectable } from '@angular/core';
import {
    Profile,
    ProfileMock,
} from '../interfaces/models/profile.model';
import {
    Observable,
    BehaviorSubject,
} from 'rxjs';
import { PersonnelItems } from '../interfaces/profile-service.interface';
import { EditProfileRequest } from '@app/edit-profile/edit-profile.interface';
import { IdentityEndpointsService } from '../endpoints/identity/identity.edpoints';
import { tap } from 'rxjs/operators';

@Injectable()
export class ProfileService {

    public profile$: BehaviorSubject<Profile> = new BehaviorSubject(new ProfileMock());

    constructor(
        private identityEndpointsService: IdentityEndpointsService,
    ) {}

    public clearProfile(): void {
        this.profile$.next(new ProfileMock());
    }

    public getProfile(): Observable<Profile> {
        return this.identityEndpointsService.getProfile()
            .pipe(
                tap((response: Profile) => {
                    this.profile$.next(response);
                }),
            );
    }

    public getPersonnelDictionary(fullName: string): Observable<PersonnelItems> {
        return this.identityEndpointsService.getPersonnelDictionary(fullName);
    }

    public updateProfile(profileModel: EditProfileRequest): Observable<object> {
        return this.identityEndpointsService.putProfile(profileModel)
            .pipe(
                tap((response: Profile) => {
                    this.profile$.next(response);
                }),
            );
    }

    public getProfileImage(pictureToken: string): Observable<any> {
        return this.identityEndpointsService.getProfileImage(pictureToken);
    }

}
