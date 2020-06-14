import { importItemsTypeConstants } from '../../constants/core.constants.es6';

export default class importItemsModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        inventoryProductsService,
        inventoryImportService,
        inventoryNotesImportHttpService,
        isManagement,
        itemsType
    ) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.inventoryProductsService = inventoryProductsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryImportService = inventoryImportService;
        this.inventoryNotesImportHttpService = inventoryNotesImportHttpService;

        this.isManagement = isManagement;
        this.itemsType = itemsType;
        this.uploadExtensionsStr = '.csv,.CSV';
        this.uploadFile = null;
    }

    save() {
        if (!this.modalForm.$valid) {
            touchedErrorFields(this.modalForm);
            return;
        }
        let promise;

        switch (true) {
            case (this.itemsType === importItemsTypeConstants.NOTES_TYPE):
                promise = this.inventoryNotesImportHttpService.importNotes(this.uploadFile);
                break;
            case (this.isManagement):
                promise = this.inventoryProductsService.importProducts(this.uploadFile);
                break;
            default:
                promise = this.inventoryImportService.importProducts(this.uploadFile);
                break;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'importModal' });
        promise
            .then(() => this.$mdDialog.hide(true))
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'importModal' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
