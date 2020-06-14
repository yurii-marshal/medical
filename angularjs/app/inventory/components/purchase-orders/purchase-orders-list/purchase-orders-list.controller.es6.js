import { purchaseOrderStatusConstants } from '../../../../core/constants/core.constants.es6.js';


export default class PurchaseOrdersListController {
    constructor($state,
                $scope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                infinityTableService,
                infinityTableFilterService,
                purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.infinityTableService = infinityTableService;
        this.infinityTableFilterService = infinityTableFilterService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;
        this.purchaseOrderStatusConstants = purchaseOrderStatusConstants;

        this.isLoading = false;

        this.cacheFiltersKey = 'inventory-purchase-orders';
        this.filtersObj = {};
        this.sortExpr = {};

        this.statusesDic = [];
        this.toolbarItems = [
            {
                text: 'Receive Items',
                icon: {
                    url: 'assets/images/default/inventory.svg',
                    w: 20,
                    h: 22
                },
                clickFunction: this._goReceiveEquipment.bind(this)
            },
            {
                text: 'New Purchase Order',
                icon: {
                    url: 'assets/images/default/ic-fab-purchase-order.svg',
                    w: 20,
                    h: 22
                },
                clickFunction: this._createNewPurchaseOrder.bind(this)
            }
        ];

        this.getPurchaseOrders = this._getPurchaseOrders.bind(this);
        this._activate();
    }

    _activate() {
        this.purchaseOrdersHttpService.getStatusesDictionary()
            .then((response) => {
                this.statusesDic = response.data;
            });
    }

    _getPurchaseOrders(pageIndex, pageSize) {
        const sortExpression = this.infinityTableFilterService.getSortExpressions(this.sortExpr);
        const filters = this.infinityTableFilterService.getFilters(this.filtersObj);

        if (filters.CreatedOn) {
            filters.CreatedOn = moment.utc(filters.CreatedOn, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        const params = Object.assign({}, filters, {
            SortExpression: sortExpression,
            PageIndex: pageIndex,
            PageSize: pageSize
        });

        return this.purchaseOrdersHttpService.getPurchaseOrders(params)
            .then((response) => {
                response.data.Items.forEach((item) => {
                    this._mapStatusClass(item.Status);
                });
                return response;
            });
    }

    _goReceiveEquipment() {
        this.$state.go('root.receive_equipment.add.step1');
    }

    _createNewPurchaseOrder() {
        this.$state.go('root.purchase-order-add-items');
    }

    goToPurchaseOrderDetails(purchaseOrderId) {
        this.$state.go('root.purchase-order.details', { purchaseOrderId });
    }

    printPurchaseOrder($event, purchaseOrderId) {
        $event.stopPropagation();
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseList' });
        this.purchaseOrdersHttpService.printPurchaseOrder(purchaseOrderId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseList' }));
    }

    _mapStatusClass(status) {
        switch (status.Id) {
            case this.purchaseOrderStatusConstants.NEW_STATUS_ID:
                status.statusClass = 'green';
                break;
            case this.purchaseOrderStatusConstants.SUBMITTED_STATUS_ID:
                status.statusClass = 'blue';
                break;
            case this.purchaseOrderStatusConstants.IN_PROGRESS_STATUS_ID:
                status.statusClass = 'orange';
                break;
            case this.purchaseOrderStatusConstants.FULFILLED_STATUS_ID:
                status.statusClass = 'dark-blue';
                break;
            default :
                break;
        }
    }
}
