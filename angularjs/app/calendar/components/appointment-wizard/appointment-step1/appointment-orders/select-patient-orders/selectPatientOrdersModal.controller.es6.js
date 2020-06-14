import { mapOrderStatusClass } from '../../../../../../core/helpers/map-order-css-statuses.helper.es6';

export default class selectPatientOrdersModalController {
    constructor(
        $mdDialog,
        $filter,
        bsLoadingOverlayService,
        appointmentOrdersService,
        patientId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.appointmentOrdersService = appointmentOrdersService;

        this.patientId = patientId;

        this.dictionaries = {
            orderTypes: [
                {
                    displayText: 'All',
                    filterValue: 'all'
                },
                {
                    displayText: 'Sales',
                    filterValue: 1
                },
                {
                    displayText: 'Resupply',
                    filterValue: 2
                }
            ]
        };

        this.filters = {
            orderTypes: 'all',
            status: [],
            createdFrom: '',
            createdTo: '',
            pageIndex: 0,
            pageSize: 10,
            referralCard: null
        };

        this.patientOrders = [];
        this.patientOrdersTotalCount = undefined;
        this.selectedPatientOrder = undefined;

        this.searchOrders();
    }

    onChangeOrderType() {
        this.filters.pageIndex = 0;
        this.searchOrders();
    }

    searchOrders(showMore) {
        let filters = angular.copy(this.filters);

        filters.orderTypes = filters.orderTypes === 'all' ? undefined : filters.orderTypes;

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });

        this.appointmentOrdersService.getPatientActiveOrders(this.patientId, filters)
            .then((response) => {
                this.patientOrdersTotalCount = response.data.Count;
                this.patientOrders = showMore
                    ? this.patientOrders.concat(response.data.Items)
                    : this._mapReferral(response.data.Items);

                this.patientOrders = this.patientOrders.map((order) => {
                    order.statusClass = mapOrderStatusClass(order.State.Status.Id);
                    return order;
                });

                this.showMoreButton = this.patientOrders.length < response.data.Count;
            })
            .catch(() => this.patientOrdersTotalCount = undefined)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    searchReferral(filter) {
        let params = { filter };

        return this.appointmentOrdersService.getReferralCards(params)
            .then((response) => response.data.Items);
    }

    showMore() {
        this.filters.pageIndex++;
        this.searchOrders(true);
    }

    clearFilters() {
        this.filters = {
            status: [],
            orderTypes: 'all',
            pageIndex: 0,
            pageSize: 10
        };
        this.selectedPatientOrder = undefined;
        this.patientOrders = [];
        this.searchOrders();
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.selectedPatientOrder);
    }

    // Data model mapping
    _mapReferral(arr) {
        return arr.map((item) => {
            item.referralDisplayName = !_.isEmpty(item.Physician)
                    ? this.$filter('referralDisplayName')(item)
                    : '-';
            return item;
        });
    }
}
