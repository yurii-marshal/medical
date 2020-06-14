import {
    invoiceTaskStatusConstants,
    invoiceTaskPriorityConstants,
} from '../../../../../core/constants/billing.constants.es6.js';

export default class InvoiceTasksController {
    constructor(
        $state,
        $scope,
        bsLoadingOverlayService,
        coreUsersService,
        billingClaimsService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.invoiceId = $state.params.invoiceId;
        this.coreUsersService = coreUsersService;
        this.billingClaimsService = billingClaimsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoiceTaskStatusConstants = invoiceTaskStatusConstants;
        this.invoiceTaskPriorityConstants = invoiceTaskPriorityConstants;

        this.filters = this._getEmptyFiltersObj();
        this.tasksData = {};
        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };
        this.getItems();
    }

    _getEmptyFiltersObj() {
        return {
            Title: null,
            CreatedByName: null,
            CreatedFrom: null,
            CreatedTo: null,
            Assignee: null,
            Status: null,
            Priority: null,
        };
    }

    changedFilters() {
        this.paginationParams.pageIndex = 1;
        this.getItems();
    }

    getItems() {
        const params = {};

        if (this.filters.Title) {
            params.Title = this.filters.Title;
        }

        if (this.filters.CreatedByName) {
            params.CreatedByName = this.filters.CreatedByName;
        }

        if (this.filters.CreatedFrom) {
            params.CreatedFrom = this.filters.CreatedFrom;
        }

        if (this.filters.CreatedTo) {
            params.CreatedTo = this.filters.CreatedTo;
        }

        if (this.filters.Assignee) {
            params.AssigneeId = this.filters.Assignee.Id;
        }

        if (this.filters.Status) {
            params.Statuses = [ this.filters.Status ];
        }

        if (this.filters.Priority) {
            params.Priority = this.filters.Priority;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'invoiceTasksList' });
        this.billingClaimsService.getClaimsTasks(this.invoiceId, params)
            .then((response) => {
                this.tasksData = response.data.map((item) => {
                    item.priorityClass = this.getPriorityClass(item.Priority);
                    return item;
                });
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'invoiceTasksList' });
            });
    }

    getUsersDictionary(name) {
        const params = {
            'filter.fullName': name,
            pageIndex: 0,
            pageSize: 24
        };

        return this.coreUsersService.getUsersDictionary(params)
            .then((response) => response.data);
    }

    getPriorityClass(priority) {
        switch (priority) {
            case this.invoiceTaskPriorityConstants.Low:
                return 'dark-gray';
            case this.invoiceTaskPriorityConstants.Normal:
                return 'blue';
            case this.invoiceTaskPriorityConstants.High:
                return 'orange';
            default:
                return 'green';
        }
    }

    onClearFilter() {
        this.filters = this._getEmptyFiltersObj();
        this.selectedItemName = null;
        this.changedFilters();
    }
}

