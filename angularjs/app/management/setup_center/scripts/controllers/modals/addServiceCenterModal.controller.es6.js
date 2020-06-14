export default class addServiceCenterModalController {
    constructor(
        $mdDialog,
        ngToast,
        bsLoadingOverlayService,
        setupCenterListService,
        infinityTableService,
        geoAddressesService,
        setupCenter,
        reopenModal
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.setupCenterListService = setupCenterListService;
        this.infinityTableService = infinityTableService;
        this.geoAddressesService = geoAddressesService;
        this.setupCenter = angular.copy(setupCenter, {});
        this.reopenModal = reopenModal;
    }

    save() {
        if (this.serviceCenterForm.$invalid) {
            touchedErrorFields(this.serviceCenterForm);
            return;
        }

        let addressesArr = [{
            addressObj: this.setupCenter.Address,
            modalTitle: ''
        }];

        let promise = this.setupCenter.Id
            ? this.setupCenterListService.updateSetupCenter
            : this.setupCenterListService.createSetupCenter;

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.geoAddressesService.checkOrModifyAddresses(addressesArr)
            .then(() => {
                return promise(this.setupCenter)
                    .then(() => {
                        this.ngToast.success(`Patient Service Center was ${this.setupCenter.Id ? 'updated' : 'created'}`);
                        this.infinityTableService.reload();
                        this.$mdDialog.hide();
                    });
            }, (err) => this.reopenModal(this.setupCenter))
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
