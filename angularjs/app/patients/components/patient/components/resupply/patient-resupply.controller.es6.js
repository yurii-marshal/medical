export default class patientResupplyController {
    constructor(
        bsLoadingOverlayService,
        ordersService,
        patientResupplyService,
        patientShortInfoService,
        $state,
        $q,
        $filter
    ) {
        'ngInject';

        this.patientShortInfoService = patientShortInfoService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientResupplyService = patientResupplyService;
        this.$state = $state;
        this.$filter = $filter;
        this.$q = $q;

        this.model = ordersService.getModel();
        this.patientId = $state.params.patientId;

        this.resupplyOrders = [];
        this.statuses = [];
        this.resupplyOrdersCount = undefined;

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };

        this._activate(this.patientId);

    }

    _activate(patientId) {
        let promises = [
            this.patientResupplyService.getPatientResupplyProgram(patientId),
            this.patientResupplyService.getResupplyPeriodsDictionary(),
            this.patientResupplyService.getOrdersStatuses()
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'resupplyProgram' });
        this.$q.all(promises)
            .then((responses) => {
                this.resupplyProgram = responses[0].data;
                this.statuses = responses[2].data;

                angular.forEach(this.resupplyProgram.Items, (item) => {
                    item.allHcpcsCodes = item.Product.HcpcsCodes;
                    item.ResupplyPeriod = this.patientResupplyService.getPeriodFullValue(item.Frequency.PeriodType.Id, item.Frequency.PeriodValue, responses[1].data);
                });

                this.getResupplyProgramOrders(this.patientId, this.paginationParams.pageIndex - 1);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'resupplyProgram' }));
    }

    getResupplyProgramOrders(patientId, pageIndex = 0, pageSize = 10) {

        let filters = {
            isNextPlanned: true,
            pageIndex,
            pageSize,
            'filter.status': this.excludeStatuses(),
            'filter.patientId': patientId,
            'selectCount': true,
            'sorting.sortExpression': 'StartDate DESC',
            'filter.orderTypes': [2] // Resupply
        };

        this.bsLoadingOverlayService.start({ referenceId: 'orderPage' });
        return this.patientResupplyService.getResupplyOrdersHistory(filters)
            .then((response) => {
                this.resupplyOrders = response.data.Items;
                this.resupplyOrdersCount = response.data.Count;
                return response;
            })
            .catch(() => {
                this.resupplyOrders = [];
                this.resupplyOrdersCount = undefined;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));
    }

    editResupplyProgram() {
        this.$state.go('root.manage-resupply.view', { patientId: this.patientId });
    }

    toOrdersHistory() {
        const patientInfo = this.patientShortInfoService.getPatientShortInfo();

        this.$state.go('root.orders.list', {
            filterByPatientName: patientInfo.Name.FullName,
            orderTypes: 2
        });
    }

    // Return Array Id for Ready and Hold statuses. Exclude Completed, Canceled
    excludeStatuses() {

        const CANCELED = 'Cancelled';
        const COMPLETED = 'Completed';

        const statusIds = [];

        this.statuses.filter((item) => {

            if (item.Text !== CANCELED && item.Text !== COMPLETED) {
                statusIds.push(+item.Id);
            }

        });
        return statusIds;
    }
}

