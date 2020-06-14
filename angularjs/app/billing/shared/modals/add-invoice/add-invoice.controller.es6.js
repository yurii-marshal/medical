import { orderStatusConstants } from '../../../../core/constants/core.constants.es6';

export default class addInvoiceModalController {
    constructor(
        $state,
        $mdDialog,
        ngToast,
        bsLoadingOverlayService,
        invoicesService,
        invoiceModifyService,
        patient,
        order
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.invoiceModifyService = invoiceModifyService;

        this.patient = patient;
        this.order = undefined;
        this.event = undefined;

        this.dictionaryOrders = [];
        this.dictionaryEvents = [];

        this.noBillingProviderId = false;

        invoiceModifyService.clearModel();

        if (patient && patient.Id) {
            this.patient.DateOfBirthday = this.patient.DateOfBirthday || this.patient.DateOfBirth;
            this.patientChanged(patient.Id);
        }

        if (order && order.Id && _.has(order, 'State.Status.Id') &&
            (+order.State.Status.Id !== orderStatusConstants.CANCELLED_ORDER_ID)) {

            this.order = order.Id;
        }
    }

    getPatients(fullName) {
        return this.invoicesService.getActivePatients(fullName)
            .then((response) => response.data.Items);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    next() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.invoiceModifyService.getPredefinedModel(this.patient.Id, this.order, this.event)
            .then((response) => {
                if (_.has(response.data, 'Options.BillingProvider.Id')) {
                    this.invoiceModifyService.setPredefinedModel(response.data);
                    this.$state.go('root.newInvoice');
                    this.$mdDialog.hide();
                } else {
                    this.ngToast.danger(`The patient doesn't have BillingProviderId.`);
                    this.noBillingProviderId = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    patientChanged(patientId) {
        if (patientId) {
            this.dictionaryOrders = [];
            this.dictionaryEvents = [];

            this.invoicesService.getReadyOrdersByPatient(patientId)
                .then((response) => {
                    if (!response.data.Items.length) {
                        this.ngToast.info(`The patient doesn't have any related orders.`);
                    }
                    this.dictionaryOrders = response.data.Items;
                });
        } else {
            this.order = undefined;
            this.dictionaryOrders = [];
            this.event = undefined;
            this.dictionaryEvents = [];
        }

        this.noBillingProviderId = false;
    }

    orderChanged(orderId) {
        if (orderId) {

            this.dictionaryEvents = [];
            this.invoicesService.getEventsByOrder(orderId)
                .then((response) => {
                    if (!response.data.length) {
                        this.ngToast.info(`The order doesn't have any related appointments.`);
                        return;
                    }
                    this.dictionaryEvents = response.data.map((item) => {
                        item.formattedDate = formatAppointmentDate(item.Date);
                        return item;
                    });
                });
        } else {
            this.event = undefined;
            this.dictionaryEvents = [];
        }

        function formatAppointmentDate(date) {
            if (!date) {
                return;
            }

            let dateFrom = moment.utc(date.From).format('MM/DD/YYYY');
            let dateTo = moment.utc(date.To).format('MM/DD/YYYY');

            return (dateFrom === dateTo) ? dateFrom : `${dateFrom} - ${dateTo}`;
        }
    }
}
