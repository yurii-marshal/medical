export default class inventoryLearnBarcodesController {
    constructor($state, ngToast, bsLoadingOverlayService, inventoryBarcodeService) {
        'ngInject';
        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryBarcodeService = inventoryBarcodeService;

        inventoryBarcodeService.clearModel();

        this.barcodes = inventoryBarcodeService.getModel();
    }

    removeBarecode(index) {
        this.barcodes.splice(index, 1);
    }

    doLearnBarcodes() {
        this.bsLoadingOverlayService.start({ referenceId: 'barcode-learn' });
        this.inventoryBarcodeService.learnBarcodes()
            .then(() => {
                this.ngToast.success('Barcodes were learned.');
                this.$state.go('root.management.inventory.products.list');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'barcode-learn' }));
    }

}
