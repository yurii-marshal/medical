export default class profileEditController {
    constructor($scope,
                $state,
                $rootScope,
                $window,
                ngToast,
                $mdDialog,
                bsLoadingOverlayService,
                profileService,
                FileUploader,
                userPicture
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$window = $window;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.profileService = profileService;
        this.userPicture = userPicture;

        this.profileModel = null;
        this.newPassword = '';
        this.repeatNewPassword = '';
        this.loadComplete = false;

        this.avatarSrc = null;
        this.uploadAvatarSrc = null;

        this.uploader = new FileUploader();

        this.uploadOptions = {
            removeAfterUpload: true,
            queueLimit: 1,
            method: 'POST'
        };

        this._activate();

        this.removeSelectedFile = () => {
            this.avatarSrc = null;
            this.uploadAvatarSrc = null;
            this.uploader.clearQueue();
            this.uploader.destroy();
            this._getUploader();

            document.getElementById('fileUploader').value = null;
        };

        this.runFileUpload = () => {
            angular.element(document.getElementById('fileUploader')).trigger('click');
        };
    }

    _activate() {
        this._getUploader();

        this.bsLoadingOverlayService.start({ referenceId: 'avatarPhotoContainer' });
        this.profileService.getProfilePromise()
            .then((response) => {
                this.profileModel = response.data;

                if (this.profileModel.PictureUrl) {
                    this.avatarSrc = this.userPicture.getUserAvatarImgUrl(this.profileModel.Id);
                    this.loadComplete = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'avatarPhotoContainer' }));
    }

    _getUploader() {
        this.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item) {
                const validFilenameExtensions = ['jpg', 'png', 'jpeg'];
                const currentExtention = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();

                return validFilenameExtensions.indexOf(currentExtention) !== -1;
            }
        });
        this.uploader.options = this.uploadOptions;

        this.uploader.onAfterAddingAll = this._onAfterAddingAll.bind(this);
        this.uploader.onWhenAddingFileFailed = this._onWhenAddingFileFailed.bind(this);
        this.uploader.onErrorItem = this._onErrorItem.bind(this);
    }

    _onAfterAddingAll (val) {
        const fileReader = new FileReader();

        let $this = this;

        fileReader.onloadend = function() {

            $this.uploadAvatarSrc = $this.profileService.getBase64FromBuffer(this.result);

            $this.$scope.$digest();
        };
        fileReader.readAsArrayBuffer(val[0]._file);
    }

    _onWhenAddingFileFailed(item, filter, options) {
        this.ngToast.error(`Invalid file type. Selected file ${item.name} has invalid type, must be: '.jpeg;.jpg;.png'`);
    }

    _onErrorItem(fileItem, response, status, headers) {
        this.ngToast.error("Unexpected error happened while uploading files.");
    }

    save() {
        if (this.$scope.editProfileForm.$invalid) { return; }

        this.$mdDialog.show({
            templateUrl: 'profile/views/modals/currentPassword.html',
            controller: 'currentPasswordModalController',
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
        .then((response) => {
            if (response) {
                let action = 2;
                if (this.avatarSrc) { action = 1; }

                let updateProfileModel = {
                    Name: this.profileModel.Name,
                    Email: this.profileModel.Email,
                    Password: response,
                    ProfilePicture: {
                        Action: action,
                        Crop: '',
                        Data: ''
                    }
                };
                if (this.newPassword) {
                    updateProfileModel.NewPassword = this.newPassword;
                }
                if (this.uploadAvatarSrc) {
                    updateProfileModel.ProfilePicture.Data = this.uploadAvatarSrc;
                }
                this.bsLoadingOverlayService.stop({ referenceId: 'avatarPhotoContainer' });
                this.profileService.putProfilePromise(updateProfileModel)
                    .then((response) => {
                        this.bsLoadingOverlayService.stop({ referenceId: 'avatarPhotoContainer' });
                        this.newPassword = '';
                        this.repeatNewPassword = '';
                        this.Password = '';
                        this.$scope.editProfileForm.newPassword.$setUntouched();
                        this.$scope.editProfileForm.repeatPassword.$setUntouched();
                        //needs only if work in iftame
                        // if (this.$window.parent && this.$window.parent.updateAvatar) {
                        //     this.$window.parent.updateAvatar(this.avatarSrc);
                        // }

                        this.$rootScope.$broadcast('updateProfile', {
                            // avatarSrc: this.avatarSrc,
                            name: updateProfileModel.Name
                        });
                        this.ngToast.success("Profile was successfully updated.");
                        this.$state.go('root.dashboard.index');
                    })
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'avatarPhotoContainer' }));
            }
        });
    }

}
