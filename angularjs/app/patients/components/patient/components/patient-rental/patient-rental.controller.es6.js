// Rental Options Modal
import rentalOptionsModalTemplate from '../../../../../core/modals/rental-options/rental-options.html';
import rentalOptionsModalController from '../../../../../core/modals/rental-options/rental-options.controller.es6.js';

// Rental Audit Modal
import rentalAuditModalTemplate from './modals/rental-audit/rental-audit.html';
import rentalAuditModalController from './modals/rental-audit/rental-audit.controller.es6';

import { rentalHoldReasonConstants } from '../../../../../core/constants/rental.constants.es6';

export default class patientRentalController {
    constructor($state,
                $timeout,
                $mdDialog,
                bsLoadingOverlayService,
                rentalOptionsService
                ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.rentalOptionsService = rentalOptionsService;
        this.rentalHoldReasonConstants = rentalHoldReasonConstants;

        this.patientId = $state.params.patientId;
        this.anchorRentalId = $state.params.rentProgramId;
        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };
        this.totalCount = undefined;
        this.items = [];

        this.lastSearchText = '';
        this.filters = {
            nameOrHcpcsCode: '',
            dateFrom: '',
            dateTo: ''
        };
        this.isShowingHistory = false;

        this.getRentalItems();
    }

    changeItemsType() {
        this.isShowingHistory = !this.isShowingHistory;
        this._reloadRental();
    }

    _reloadRental() {
        this.paginationParams.pageIndex = 1;
        this.totalCount = undefined;
        this.items = [];

        this.lastSearchText = '';
        this.filters = {
            nameOrHcpcsCode: '',
            dateFrom: '',
            dateTo: ''
        };

        this.getRentalItems();
    }

    getRentalItems(pageIndex = 0) {
        this.lastSearchText = this.filters.nameOrHcpcsCode;

        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        const promise = this.isShowingHistory ?
            this.rentalOptionsService.getPatientRentalHistory(this.patientId, this.filters, pageIndex, this.paginationParams.pageSize) :
            this.rentalOptionsService.getPatientRentalItems(this.patientId, this.filters, pageIndex, this.paginationParams.pageSize);

        promise
            .then((response) => {
                this.totalCount = response.data.Count;
                this.items = response.data.Items;
            })
            .catch(() => this.totalCount = undefined)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    rentalAction(item) {
        this.$mdDialog.show({
            template: rentalOptionsModalTemplate,
            controller: rentalOptionsModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                item,
                actionType: item.IsActive ? 'stop' : 'start',
                patientId: this.patientId,
                billToList: null
            }
        })
        .then(() => this._reloadRental());
    }

    openRentAudit(rentId) {
        this.$mdDialog.show({
            template: rentalAuditModalTemplate,
            controller: rentalAuditModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { rentId }
        });
    }

    editRent(item) {
        this.$mdDialog.show({
            template: rentalOptionsModalTemplate,
            controller: rentalOptionsModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                item,
                actionType: 'edit',
                patientId: this.patientId,
                billToList: null
            }
        })
        .then(() => this._reloadRental());
    }

    searchByText($event) {
        if (!this.filters.nameOrHcpcsCode) {
            return;
        }
        if (($event.type === 'keydown' && $event.keyCode === 13) || $event.type === 'click') {
            this.paginationParams.pageIndex = 1;
            this.totalCount = undefined;
            this.items = [];
            this.getRentalItems();
        }
    }

    searchByFilter() {
        if (this.filtersForm.$valid) {
            this.paginationParams.pageIndex = 1;
            this.totalCount = undefined;
            this.items = [];
            this.getRentalItems();
        }
    }

    clearSearchByText() {
        if (!this.filters.nameOrHcpcsCode || this.lastSearchText !== this.filters.nameOrHcpcsCode) {
            this.paginationParams.pageIndex = 1;
            this.totalCount = undefined;
            this.items = [];
            this.getRentalItems();
        }
    }

    clearFilters() {
        this.filters = {
            nameOrHcpcsCode: '',
            dateFrom: '',
            dateTo: ''
        };

        this.clearSearchByText();

        this.paginationParams.pageIndex = 1;
        this.totalCount = undefined;
        this.items = [];
    }

    goToOrder(orderId) {
        this.$state.go(`root.orders.order.details`, { orderId });
    }
}
