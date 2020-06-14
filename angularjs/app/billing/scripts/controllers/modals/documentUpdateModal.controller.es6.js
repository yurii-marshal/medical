export default class documentUpdateModalController {
    constructor($mdDialog, ngToast, bsLoadingOverlayService, documentUpdateService, infinityTableService, options) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.documentUpdateService = documentUpdateService;
        this.infinityTableService = infinityTableService;

        this.options = options;
        this.currentAction = this.options.actionId || null;
        this.Fax = this.options.faxNumber || '';
        this.commonActions = this.options.stateName === 'cmns'
            ? this.options.actions[0]
            : this._getCommonActions(this.options.actions);
    }

    _getCommonActions(arrays) {
        let commonArr = arrays[0];

        if (arrays.length > 1) {
            for (let i = 1; i < arrays.length; i++) {
                commonArr = this._compareProp(commonArr, arrays[i]);
            }
        } else {
            commonArr = Array.isArray(arrays) ? arrays[0] : arrays;
        }
        return commonArr;
    }

    _compareProp(arr1, arr2) {
        let temp = [];

        for ( let i = 0; i < arr1.length; i++ ) {
            let element = arr1[i];

            if (this._getPropsArr(arr2, 'Id').indexOf(element.Id) > -1) {
                temp.push(element);
            }
        }
        return temp;
    }

    _getPropsArr(arr, prop) {
        return arr.map((item) => item[prop]);
    }

    isSelectVisible() {
        return !this.options.actionId || this.currentAction === null;
    }

    _downloadDocuments() {
        this.bsLoadingOverlayService.start({ referenceId: 'documentUpdateModalOverlay' });
        this.documentUpdateService.downloadFiles(this.options.stateName, this.options.ids)
            .then(() => {
                this.ngToast.success('File was successfully downloaded');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'documentUpdateModalOverlay' }));
    }

    _updateDocByFax() {
        this.bsLoadingOverlayService.start({ referenceId: 'documentUpdateModalOverlay' });
        this.documentUpdateService.documentUpdateByFax(this.options.stateName, this.options.ids, this.Fax)
            .then(() => {
                this.ngToast.success('Request update was sent successfully');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'documentUpdateModalOverlay' }));
    }

    send(action) {
        if (this.actionsForm.$invalid) {
            touchedErrorFields(this.actionsForm);
            return;
        }

        switch (action.toString()) {
            case '1': // electronically - not implemented on back
                break;
            case '2': // fax
                this._updateDocByFax();
                break;
            case '3': // print
                this._downloadDocuments();
                break;
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
