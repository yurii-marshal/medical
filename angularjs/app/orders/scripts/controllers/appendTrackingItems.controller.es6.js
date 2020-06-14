export default class appendTrackingItemsController {
    constructor($state, bsLoadingOverlayService, patientResupplyService, ordersService) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientResupplyService = patientResupplyService;

        this.orderId = $state.params.orderId;
        this.patientId = $state.params.patientId;
        this.Items = [];

        ordersService.getOrderShortInfo(this.orderId)
            .then((response) => this.orderDisplayId = response.data.DisplayId);
    }

    cancel() {
        this.$state.go('root.orders.order.items', { orderId: this.orderId });
    }

    save() {
        this.bsLoadingOverlayService.start({ referenceId: 'appendTrackingItems' });

        this.patientResupplyService.appendTrackingItems(this.orderId, this.patientId, this.Items)
            .then(() => this.cancel())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'appendTrackingItems' }));
    }
}
