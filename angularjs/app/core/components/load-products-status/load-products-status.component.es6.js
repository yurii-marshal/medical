import { importStatusConstants, importItemsTypeConstants } from '../../constants/core.constants.es6.js';

import template from './load-products-status.html';

class LoadProductsStatusCtrl {
    constructor(
        ngToast,
        $interval,
        bsLoadingOverlayService,
        inventoryImportService,
        inventoryProductsService,
        inventoryNotesImportHttpService
    ) {
        'ngInject';
        this.ngToast = ngToast;
        this.$interval = $interval;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryImportService = inventoryImportService;
        this.inventoryProductsService = inventoryProductsService;
        this.inventoryNotesImportHttpService = inventoryNotesImportHttpService;
        this.setHttpService();

        this._linkPromise = undefined;

        this.importStatusConstants = importStatusConstants;

        //Variables
        this.result = undefined;
        this.showComponent = false;

        //Call methods
        this._checkChangeStatus();

        this._linkPromise = this.$interval(this._checkChangeStatus.bind(this), 60000);
    }

    setHttpService() {
        switch (true) {
            case (this.itemsType === importItemsTypeConstants.NOTES_TYPE):
                this.httpService = this.inventoryNotesImportHttpService;
                break;
            case (this.isManagement):
                this.httpService = this.inventoryProductsService;
                break;
            default:
                this.httpService = this.inventoryImportService;
                break;
        }
    }

    _checkChangeStatus() {
        this.getStatusLoading();
    }

    $onDestroy() {
        //Clear interval when component is destroy
        this.$interval.cancel(this._linkPromise);
    }

    // Cancel import
    cancel() {
        //We recheck status. Because ui send request with interval 1 minute
        this.getStatusLoading((data) => {
            if (parseInt(data.Status.Id) === this.importStatusConstants.PROCESSING_STATUS_ID) {
                this.bsLoadingOverlayService.start({ referenceId: 'loadProductsStatus' });
                return this.httpService.importCancel(this.result.Id).then((res) => {
                    this.showComponent = false;
                    this.getStatusLoading();
                    this.ngToast.danger('Importing was cancelled');
                    return false;
                })
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loadProductsStatus' }));

            }
            return this.ngToast.danger('Importing cannot canceled');

        });


    }

    //Get status loading process
    getStatusLoading(callback) {
        this.httpService.getImportStatus().then((res) => {
            if (res.status === 204) {
                this.showComponent = false;
                this.result = undefined;
            } else {
                if (res.data) {
                    this.result = res.data;
                    this.showComponent = true;
                    this.isLoading = parseInt(this.result.Status.Id) !== this.importStatusConstants.PROCESSED_STATUS_ID &&
                        parseInt(this.result.Status.Id) !== this.importStatusConstants.CANCELED_STATUS_ID &&
                        parseInt(this.result.Status.Id) !== this.importStatusConstants.FAILED_STATUS_ID;
                    if (callback !== undefined) {
                        callback(res.data);
                    }
                }
            }
        });

    }

    //Download details
    details() {
        this.bsLoadingOverlayService.start({ referenceId: 'loadProductsStatus' });
        this.httpService.getImportLog(this.result.Id)
            .then((response) => {
                download(response.data, `Import details ${moment().format('MM/DD/YYYY')}`, 'text/plain');
            })
            .finally(()=> this.bsLoadingOverlayService.stop({ referenceId: 'loadProductsStatus' }));
    }

}

const loadProductsStatus = {
    bindings: {
        isLoading: "=", //This need for disabled button import,
        itemsType: '<',
        isManagement: '<' // In current moment is two importing. If you set true. Component send request to catalog service. If you set false. Component send request to core/inventory
    },
    template,
    controller: LoadProductsStatusCtrl
};

export default loadProductsStatus;
