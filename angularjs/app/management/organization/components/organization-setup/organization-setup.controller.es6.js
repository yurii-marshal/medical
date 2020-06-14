export default class organizationSetupController {
    constructor(ngToast,
                $scope,
                bsLoadingOverlayService,
                organizationSetupService,
                geoAddressesService) {
        'ngInject';

        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.organizationSetupService = organizationSetupService;
        this.geoAddressesService = geoAddressesService;

        this.uploadExtensions = ['jpg', 'png', 'jpeg'];
        this.noImageSrc = 'assets/images/no-image-available.png';
        this.orgLogoSrc = this.noImageSrc;
        this.uploadedFile = [];
        // Flag to control if image was uploaded from backend on init of controller
        this.imageInitDone = false;
        this.isModelLoaded = false;

        organizationSetupService.clearModel();
        this.model = organizationSetupService.getModel();
        this.initModel = {};
        angular.copy(this.model, this.initModel);

        $scope.$watch(() => this.uploadedFile, (newValue) => {

            if (this.imageInitDone && newValue && newValue.length) {
                let imageDataBase64 = this.organizationSetupService.getBase64FromBuffer(newValue[0].Bytes);

                this.orgLogoSrc = `data:image/JPEG;base64,${imageDataBase64}`;
                this.model.Image = {
                    Name: newValue[0].Name,
                    Bytes: imageDataBase64
                };

            }
        }, true);

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'organizationSetup' });
        this.organizationSetupService.getAndSetOrganization()
            .then(() => {
                angular.copy(this.model, this.initModel);
                this.isModelLoaded = true;

                if (this.model.ImageHash) {
                    this._getLogo(this.model.ImageHash, this.initModel);
                } else {
                    this.orgLogoSrc = this.noImageSrc;
                    this.imageInitDone = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'organizationSetup' }));
    }

    _getLogo(hash, initModel) {
        this.bsLoadingOverlayService.start({ referenceId: 'organizationLogo' });
        this.organizationSetupService.getOrganizationLogoUrl(hash)
            .then((res) => {
                const modelImage = {
                    Name: res.Name,
                    Bytes: res.Bytes
                };

                this.orgLogoSrc = res.url;
                this.model.Image = angular.copy(modelImage);

                if (initModel) {
                    initModel.Image = angular.copy(modelImage);
                }
            })
            .finally(() => {
                this.imageInitDone = true;
                this.bsLoadingOverlayService.stop({ referenceId: 'organizationLogo' });
            });
    }

    cancel() {
        this._activate();
    }

    save() {
        if (this.Form.$invalid) {
            touchedErrorFields(this.Form);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'organizationSetup' });

        let addressesArr = [{
            addressObj: this.model.Address,
            modalTitle: ''
        }];

        this.geoAddressesService.checkOrModifyAddresses(addressesArr)
            .then(() => {
                return this.organizationSetupService.updateOrganization()
                    .then(() => {
                        angular.copy(this.model, this.initModel);
                        this.ngToast.success('Organization is updated');
                    });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'organizationSetup' }));
    }

    modelNotChanged() {
        // use complicated _.isEqualWith(), because of _.isEqual() doesn't work correctly
        return _.isEqualWith(this.initModel, this.model, (objValue, othValue) => {

            let isEqualContacts = objValue.Contacts.length === othValue.Contacts.length
                &&_.isEqualWith(objValue.Contacts, othValue.Contacts, (objContactsValue, othContactsValue) => {

                    let isEq = true;

                    angular.forEach(objContactsValue, (i, ikey) => {
                        angular.forEach(othContactsValue, (v, vkey) => {
                            if (ikey === vkey && !(i.type === v.type && i.newType === v.newType && i.value === v.value)) {
                                isEq = false;
                                return;
                            }
                        });
                    });
                    return isEq;
                });

            return isEqualContacts
                && _.isEqual(objValue.Address, othValue.Address)
                && objValue.Name === othValue.Name
                && _.isEqual(objValue.OrganizationSettings, othValue.OrganizationSettings)
                && _.isEqual(objValue.Image, othValue.Image);
        });
    }

    isDisabledChanged() {
        if (!this.model.OrganizationSettings.GroupItemsForDelivery) {
            this.model.OrganizationSettings.ResupplyReplaceBundleItems = false;
            this.model.OrganizationSettings.ShippingDateWithin = undefined;
        }
    }

    removePicture() {
        this.model.Image = {
            Name: null,
            Bytes: null
        };
        this.orgLogoSrc = this.noImageSrc;
        this.uploadedFile = [];
    }

}
