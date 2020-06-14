export default class hcpcsModalController {
    constructor($scope, $mdDialog, bsLoadingOverlayService, ngToast,  hcpcsService, hcpcsObj, isNew) {
        'ngInject';

        this.$scope = $scope;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.hcpcsService = hcpcsService;
        this.hcpcsObj = hcpcsObj;
        this.isNew = isNew;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (!this.modifyHcpcsForm.$valid) {
            touchedErrorFields(this.modifyHcpcsForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modifyHcpcs' });

        let promise = this.isNew
                        ? this.hcpcsService.createHcpcs(this.hcpcsObj)
                        : this.hcpcsService.updateHcpcs(this.hcpcsObj);

        promise
            .then(_=> {
                this.ngToast.success(this.isNew ? 'Hcpcs Code was created.' : 'Hcpcs Code was updated.');
                this.$mdDialog.hide();
            })
            .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: 'modifyHcpcs' }));
    }
}
