export default class orderDetailsModalController {
    constructor(
        $timeout,
        $mdDialog,
        $q,
        $filter,
        bsLoadingOverlayService,
        ordersService,
        coreOrderService,
        inventoryProductService,
        mapProductsService,
        order,
        orderId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;
        this.coreOrderService = coreOrderService;
        this.inventoryProductService = inventoryProductService;
        this.mapProductsService = mapProductsService;
        this.order = order;
        this.orderId = orderId;

        this._activate();

        $timeout(() => $('.modal-window').animate({ scrollTop: 0 }, 300), 200);
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.ordersService.clearModel();

        const promises = [
            this.ordersService.getOrderModalDetails(this.orderId),
            this.coreOrderService.getOrderedItems(this.orderId, { 'paggination.pageSize': 100 })
        ];

        this.$q.all(promises)
            .then((responses) => {
                this.model = this.ordersService.getModel();
                this.model.TypeName = this._getOrderTypeName(this.model.Type);
                angular.extend(this.model, this.model.shortInfo);

                this.model.Products = responses[1];
                this.model.Products.forEach((item, index) => {
                    this.model.Products[index] = this.mapProductsService.flatProductStructure(item);
                });

                this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
            });
    }

    getProductComponents(orederedItem) {
        if (!orederedItem.Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${orederedItem.Id}` });
            return this.inventoryProductService.getBundleComponents(orederedItem.Id)
                .then((response) => {
                    if (response.data && response.data.length) {
                        response.data.forEach((component) => {
                            component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
                        });

                        orederedItem.Components = response.data;
                    }
                    orederedItem.componentsLoaded = true;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${orederedItem.Id}` }));
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    _getOrderTypeName(id) {
        switch (+id) {
            case 1:
                return 'Sale';
            case 2:
                return 'Resupply';
            case 3:
                return 'Prescribed';
            default:
                break;
        }
    }
}
