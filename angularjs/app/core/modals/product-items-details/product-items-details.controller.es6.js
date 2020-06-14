export default class productItemsDetailsController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        searchItemsService,
        inventoryProductService,
        coreOrderService,
        inventoryEquipmentHttpService,
        patientId,
        item,
        $filter,
        modalType,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$filter = $filter;
        this.item = item;
        this.patientId = patientId;
        this.modalType = modalType;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.searchItemsService = searchItemsService;
        this.inventoryProductService = inventoryProductService;
        this.coreOrderService = coreOrderService;

        this.inventoryEquipmentHttpService = inventoryEquipmentHttpService;

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.noImage = 'assets/images/colored/no-image-white.svg';

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });

        if (modalType === 'product') {
            this.inventoryProductService.getProductById(item.ProductId)
                .then((response) => {
                    let searchItem = response.data;

                    searchItem.Count = item.Count;

                    searchItem.Components.forEach((searchItemComponent) => {
                        if (item.Components) {
                            item.Components.forEach((itemComponent) => {
                                if (searchItemComponent.Id === itemComponent.ProductId) {
                                    searchItemComponent.SerialNumber = itemComponent.SerialNumber;
                                    searchItemComponent.LotNumber = itemComponent.LotNumber;
                                }
                            });
                        }
                    });

                    this.model = this.mapBundleComponents(searchItem);
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
                });
        } else {
            const trackingId = this.modalType === 'order' ? item.Id : item.TrackingId;

            const promise = item.OrderId && trackingId ? this.coreOrderService.getOrderTrackingComponents(this.patientId, item.OrderId, trackingId) : this.inventoryEquipmentHttpService.getEquipmentComponentsById(item.ComponentId);

            promise.then((response) => {
                this.model = {
                    Components: this.mapBundleComponents(response.data.Items ? response.data.Items : response.data)
                };
            })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
                });
        }
    }

    mapBundleComponents(data) {
        let components = data.Components || data;

        components.forEach((item) => {
            item.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(item);
            item.Count = item.Count || item.Qty;
        });

        return data;
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

