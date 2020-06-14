export default class settingsOrderController {
    constructor(
        $state,
        $q,
        ngToast,
        bsLoadingOverlayService,
        settingsService
    ) {
        'ngInject';

        this.$state = $state;
        this.$q = $q;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.settingsService = settingsService;

        this.model = {
            order: {},
            packingSlip: {},
            deliveryTicket: {}
        };
        this.initModel = {};
        this.deliveryTicketCustomTextMaxLength = 700;

        this._activate();
    }

    _activate() {
        const promises = [
            this.settingsService.getOrderSettings()
                .then((response) => this.model.order = response.data),
            this.settingsService.getPackingSlipSettings()
                .then((response) => this.model.packingSlip = response.data),
            this.settingsService.getDeliveryTicketSettings()
                .then((response) => this.model.deliveryTicket = response.data)
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'settingsOrder' });
        this.$q.all(promises)
            .finally(() => {
                angular.copy(this.model, this.initModel);
                this.bsLoadingOverlayService.stop({ referenceId: 'settingsOrder' });
            });
    }

    cancel() {
        angular.copy(this.initModel, this.model);
    }

    save() {
        if (this.orderForm.$invalid) {
            touchedErrorFields(this.orderForm);
            return;
        }
        const orderSettings = {
            TurnOn: !!this.model.order.TurnedOn,
            ConfirmationText: this.model.order.ConfirmationText
        };

        let packingSlipSettings = {};

        if (this.model.packingSlip) {
            packingSlipSettings = this.model.packingSlip;
        }

        const deliveryTicketSettings = {
            Acknowledgement: this.model.deliveryTicket.Acknowledgement
        };
        const promises = [
            this.settingsService.updateOrderSettings(orderSettings),
            this.settingsService.updatePackingSlipSettings(packingSlipSettings),
            this.settingsService.updateDeliveryTicketSettings(deliveryTicketSettings)
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'settingsOrder' });
        this.$q.all(promises)
            .finally(() => {
                angular.copy(this.model, this.initModel);
                this.ngToast.success('Orders settings are updated');
                this.bsLoadingOverlayService.stop({ referenceId: 'settingsOrder' });
            });
    }
}
