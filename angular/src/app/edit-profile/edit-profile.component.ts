import {
    Component,
    ViewChild,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidatorFn,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';

import { ProfileService } from '@shared/services/profile.service';
import { ToasterService } from '@shared/services/toaster.service';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';
import { Profile, ProfileMock } from '@shared/interfaces/models/profile.model';
import { MatchValuesValidator } from '@shared/helpers/match-values-validator';
import { getBase64FromBuffer } from '@shared/helpers/base-64';
import { ConfirmProfileChangesComponent } from './modals/confirm-profile-changes/confirm-profile-changes.component';
import { EditProfileRequest } from './edit-profile.interface';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { PubSubService } from '@shared/services/pub-sub.service';
import { UserPictureService } from '@shared/services/user-picture.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
})

export class EditProfileComponent implements OnInit, OnDestroy {
    @ViewChild('fileUploaderInput') fileUploaderInput;
    public confirmProfileChangesDialogRef: MatDialogRef<ConfirmProfileChangesComponent>;
    public editProfileForm: FormGroup;
    public profileSubscription: Subscription;
    public profileInfo: Profile;
    public uploader: FileUploader;
    public getBase64FromBuffer: any;

    public passwordRegExp = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
    public allowedMimeType: string[] = ['image/jpg', 'image/png', 'image/jpeg'];
    public picturePlaceholder = '@@assets/images/no-image-available.png';
    readonly nameRegExp = RegExp(/[^\s]/);

    public pictureLoaderStatus = false;
    public saveProfileLoaderStatus = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private profileService: ProfileService,
        private toasterService: ToasterService,
        private routerNavigatorService: RouterNavigatorService,
        private pubsub: PubSubService,
        private userPictureService: UserPictureService,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'trash',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/trash.svg'));

        /**
         * @description - form validations rules
         * @type {FormGroup}
         */
        this.editProfileForm = fb.group(
            {
                firstName: ['', [Validators.required, Validators.pattern(this.nameRegExp)]],
                lastName: ['', [Validators.required, Validators.pattern(this.nameRegExp)]],
                email: ['', [Validators.required]],
                newPassword: ['',
                    {
                        validators: [
                            this.conditionalPassValidator(
                                this.newPassFieldValidator.bind(this),
                                Validators.required,
                            ),
                            Validators.pattern(this.passwordRegExp),
                        ],
                        updateOn: 'blur',
                    },
                ],
                confirmPassword: ['', [
                    this.conditionalPassValidator(
                        (() => {
                            return this.editProfileForm &&
                                !this.editProfileForm.get('confirmPassword').value &&
                                this.editProfileForm.get('newPassword').value &&
                                this.editProfileForm.controls.newPassword.valid;
                        }),
                        Validators.required,
                    ),
                ],
                ],
            },
            {
                // validator: MatchValuesValidator.Match('newPassword', 'confirmPassword')
                validator: this.conditionalPassValidator(
                    (() => {
                        return this.editProfileForm &&
                            this.editProfileForm.get('confirmPassword').dirty &&
                            (
                                (!this.editProfileForm.get('newPassword').value && this.editProfileForm.get('confirmPassword').value)
                                || (this.editProfileForm.get('newPassword').value && this.editProfileForm.get('confirmPassword').value)
                            );
                    }),
                    MatchValuesValidator.Match('newPassword', 'confirmPassword'),
                ),
            },
        );

        /**
         * @description Initialization of File Uploader
         * @type {FileUploader}
         */
        this.uploader = new FileUploader({
            disableMultipart: true,
            allowedMimeType: this.allowedMimeType,
        });

        this.initUploaderCallBacks();
    }

    ngOnInit() {
        /**
         * @description subscription on profile$ BehaviorSubject to watch User Info
         * @type {Subscription}
         */
        this.profileSubscription = this.profileService.profile$
            .subscribe({
                next: (profile: Profile) => {
                    if (!(profile instanceof ProfileMock)) {
                        this.profileInfo = Object.assign({}, profile);

                        this.profileInfo.PicturePlaceholder = this.picturePlaceholder;
                        this.fillFormWithDataModel(profile);

                        if (!this.profileInfo.Picture && this.profileInfo.PictureUrl) {
                            this.getUserPicture(this.profileInfo);
                        }
                    }
                },
            });
    }

    ngOnDestroy() {
        this.profileSubscription.unsubscribe();
    }

    public runFileUpload(): void {
        this.fileUploaderInput.nativeElement.click();
    }

    public onAfterAddingAll(val: any): void {
        const fileReader = new FileReader();
        this.getBase64FromBuffer = getBase64FromBuffer;
        const $this = this;

        this.pictureLoaderStatus = true;

        fileReader.onloadend = function() {
            if (this.result) {
                $this.profileInfo.Picture = `data:image/JPEG;base64,${ $this.getBase64FromBuffer(this.result) }`;

                $this.profileInfo.PictureData = $this.getBase64FromBuffer(this.result);

                $this.pictureLoaderStatus = false;
            }
        };
        fileReader.readAsArrayBuffer(val[0]._file);
    }

    public onWhenAddingFileFailed(item): void {
        this.toasterService.showToaster(
            `Invalid file type. Selected file ${item.name} has invalid type, must be: '${this.allowedMimeType.join('; ')}'`,
            ['danger', 'nikoToast'],
        );
    }

    public onErrorItem(): void {
        this.toasterService.showToaster(
            `Unexpected error happened while uploading files.`,
            ['danger', 'nikoToast'],
        );
    }

    public goToDashboard() {
        this.routerNavigatorService.navigate(['/dashboard']);
    }

    public removeSelectedFile(): void {
        this.profileInfo.Picture = '';
        this.profileInfo.PictureData = null;
        this.uploader.clearQueue();
        this.initUploaderCallBacks();
    }

    public save(): void {
        if (this.editProfileForm.invalid) {
            markFormGroupTouched(this.editProfileForm);
            return;
        }

        this.confirmProfileChangesDialogRef = this.dialog.open(ConfirmProfileChangesComponent, {
            panelClass: ['modal-window'],
        });

        this.confirmProfileChangesDialogRef
            .afterClosed()
            .subscribe((response) => {
                if (response) {

                    const updateProfileModel: EditProfileRequest = {
                        Name: {
                            FirstName: this.editProfileForm.get('firstName').value,
                            LastName: this.editProfileForm.get('lastName').value,
                            MiddleName: this.profileInfo.Name.MiddleName,
                        },
                        Email: this.editProfileForm.get('email').value,
                        Password: response,
                        ProfilePicture: {
                            Action: this.profileInfo.PictureData ? 1 : 2, // TODO constants
                            Crop: '',
                            Data: this.profileInfo.PictureData || '',
                        },
                    };

                    const newPasswordVal = this.editProfileForm.get('newPassword').value;
                    if (newPasswordVal) {
                        updateProfileModel.NewPassword = newPasswordVal;
                    }

                    this.saveProfileLoaderStatus = true;

                    this.profileService.updateProfile(updateProfileModel)
                        .subscribe(
                            () => {

                                this.toasterService.showToaster(
                                    `Profile was successfully updated.`,
                                    ['success', 'nikoToast'],
                                );

                                this.router.navigate(['/dashboard']);
                                this.saveProfileLoaderStatus = false;
                            },
                            () => {
                                this.saveProfileLoaderStatus = false;
                            },
                            () => {
                            },
                        );
                }
            });
    }

    public setNewPassErrorClass(): boolean {
        return this.editProfileForm.controls.newPassword.errors &&
            this.editProfileForm.controls.newPassword.errors.pattern &&
            this.editProfileForm.controls.newPassword.touched;
    }

    /**
     * @method - Conditionally setting up password validators
     * @param {() => FormGroup} condition
     * @param {ValidatorFn} validator
     * @returns {ValidatorFn}
     */
    private conditionalPassValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!condition()) {
                return null;
            }
            return validator(control);
        };
    }

    /**
     * @method - New password field validator function. Bound confirmPassword field
     * @returns { Boolean } Valid field status
     */
    private newPassFieldValidator(): boolean {
        let isFieldValid;

        if (this.editProfileForm) {
            const newPassword = this.editProfileForm.get('newPassword').value;

            isFieldValid = newPassword.length;

            this.editProfileForm.controls.confirmPassword.updateValueAndValidity();

            if (this.editProfileForm.get('confirmPassword').value.length >= 0
                && isFieldValid) {
                this.editProfileForm.controls.confirmPassword.markAsTouched();
            }
        }

        return false;
    }

    /**
     * @method for filling formControls with data model
     * @param {Profile} profile
     */
    private fillFormWithDataModel(profile: Profile): void {
        this.editProfileForm.patchValue({
            firstName: profile.Name.FirstName,
            lastName: profile.Name.LastName,
            email: profile.Email,
        });
    }

    private getUserPicture(profile: Profile): void {
        this.profileInfo.Picture = this.userPictureService.getUserAvatarImgUrl(profile.Id);
        this.profileInfo.PictureData = null;
    }

    private initUploaderCallBacks(): void {
        this.uploader.onAfterAddingAll = this.onAfterAddingAll.bind(this);
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed.bind(this);
        this.uploader.onErrorItem = this.onErrorItem.bind(this);
    }
}
