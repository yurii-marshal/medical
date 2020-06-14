import { purchaseOrderAuditTypeConstants } from '../../../../../../core/constants/core.constants.es6.js';

export default class PurchaseOrderAuditController {
    constructor(
        $state,
        $scope,
        $filter,
        WEB_API_INVENTORY_SERVICE_URI,
        bsLoadingOverlayService,
        inventoryProductService,
        purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$filter = $filter;

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryProductService = inventoryProductService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.noImage = 'assets/images/colored/no-image-white.svg';
        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.purchaseOrderAuditId = $state.params.purchaseOrderAuditId;
        this.items = [];

        this._activate();
    }

    _activate() {
        this.getPurchaseOrderAuditDetails();
    }

    getPurchaseOrderAuditDetails() {
        const params = { purchaseOrderAuditId: this.purchaseOrderAuditId };

        this.bsLoadingOverlayService.start('purchaseOrderAuditDetails');
        this.purchaseOrdersHttpService.getPurchaseOrderAuditDetails(this.purchaseOrderId, params)
            .then((response) => {
                this.items = response.data.Details
                    .filter((item) => item.Type.Id === purchaseOrderAuditTypeConstants.ITEM_RECEIVED_ID)
                    .map((item) => {
                        item.allHcpcsCodes = item.HcpcsCodes.split(',');
                        return item;
                    });
            })
            .finally(() => this.bsLoadingOverlayService.stop('purchaseOrderAuditDetails'));
    }

    backToAuditList() {
        this.$state.go('root.purchase-order.audit');
    }

    getProductComponents(product) {
        if (!product.Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${product.ProductId}` });
            return this.inventoryProductService.getBundleComponents(product.ProductId)
                .then((response) => {
                    product.Components = response.data.map((item) => {
                        item.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(item);
                        return item;
                    });
                    product.componentsLoaded = true;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${product.ProductId}` }));
        }
    }
}
