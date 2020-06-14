import { orderTypeConstants } from '../../../../../core/constants/core.constants.es6.js';

export default class PatientOrdersCtrl {
    constructor($state,
                $filter,
                bsLoadingOverlayService,
                patientsService,
                ordersService,
                demographicsService,
                mapProductsService,
                WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientsService = patientsService;
        this.ordersService = ordersService;
        this.demographicsService = demographicsService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.mapProductsService = mapProductsService;
        this.patientId = $state.params.patientId;
        this.orders = [];
        this.totalCount = undefined;
        this.patientData = null;
        // Show only orders with statuses Hold, Ready
        this.availableOrderStatuses = [1, 2, 3];
        this.noImage = 'assets/images/colored/no-image-white.svg';

        this.orderTypes = [
            {
                Text: 'Sales Order',
                Id: [orderTypeConstants.SALES_ORDER_ID, orderTypeConstants.SIMPLE_ORDER_ID]
            },
            {
                Text: 'Resupply Order',
                Id: [orderTypeConstants.RESUPPLY_ORDER_ID]
            }
        ];

        this.filters = {
            selectCount: true,
            status: undefined,
            type: undefined,
            createdDateFrom: '',
            createdDateTo: ''
        };

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };

        this._activate();

    }

    _activate() {
        this.getPatient();
        this.loadOrders();

        this.ordersService.getStatuses()
            .then((response) => {
                this.orderStatuses = response.data.filter((item) => {
                    return this.availableOrderStatuses.indexOf(Number(item.Id)) !== -1;
                });
            });
    }

    clearFilters() {
        this.filters = {
            selectCount: true,
            status: undefined,
            type: undefined,
            createdDateFrom: '',
            createdDateTo: ''
        };
        this.paginationParams.pageIndex = 0;
        this.loadOrders();
    }

    searchByFilter() {
        if (this.filtersForm.$valid) {
            this.loadOrders();
        }
    }

    getPatient() {
        this.demographicsService.getPatientInfoById(this.$state.params.patientId)
            .then((res) => {
                this.patientData = res.data;
            });
    }

    loadOrderedItems(order) {
        if (!order.orderedItems) {
            this.bsLoadingOverlayService.start({ referenceId: `orderedItems${ order.Id }` });
            this.patientsService.getOrderedItemsByOrderId(order.Id)
                .then((response) => {
                    order.orderedItems = response.data.Items.map((item) => this.mapProductsService.flatProductStructure(item));
                    this.bsLoadingOverlayService.stop({ referenceId: `orderedItems${ order.Id }` });
                });
        }
    }

    getProductComponents(orederedItem) {
        if (!orederedItem.Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${orederedItem.ProductId}` });
            return this.patientsService.getProductBundles(orederedItem.ProductId)
                .then((response) => {
                    if (response.Items[0].Components && response.Items[0].Components.length) {
                        orederedItem.Components = this._mapComponents(response.Items[0].Components);
                    }
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${orederedItem.ProductId}` }));
        }
    }

    _mapComponents(components) {
        let mappedComponents = angular.copy(components);

        angular.forEach(mappedComponents, (component) => {
            component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
        });

        return mappedComponents;
    }

    loadOrders(pageIndex = 0) {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        window.scrollTo(0, 0);

        let filters = this._getFilters(this.filters);

        this.patientsService.getOrders(this.patientId, pageIndex, this.paginationParams.pageSize, filters)
            .then((response) => {
                this.orders = response.data.Items;
                this.totalCount = response.data.Count;

                angular.forEach(this.orders, (order) => {
                    this.loadOrderedItems(order);
                });

            })
            .catch(() => this.totalCount = undefined)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    _getFilters(viewFilters) {
        let filters = {
            selectCount: true
        };

        filters.status = viewFilters.status ? [ viewFilters.status ] : this.availableOrderStatuses;

        if (viewFilters.createdDateFrom) {
            filters['created.from'] = moment(viewFilters.createdDateFrom, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        if (viewFilters.createdDateTo) {
            filters['created.to'] = moment(viewFilters.createdDateTo, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        if (viewFilters.type) {
            filters.orderTypes = viewFilters.type;
        }

        return filters;
    }

    goToOrders() {
        this.$state.go('root.orders.list', {
            filterByPatientName: this.patientData.Name.FullName,
            filterByStatus: [ 4, 5 ] // Completed & Cancelled
        });
    }
}

