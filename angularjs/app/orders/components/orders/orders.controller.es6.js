import { orderTypeConstants } from '../../../core/constants/core.constants.es6.js';
import { mapOrderStatusClass } from '../../../core/helpers/map-order-css-statuses.helper.es6';

export default class ordersController {
    constructor($state,
                popupMenuCalendar,
                coreOrderService,
                ordersService,
                advancedFiltersService,
                infinityTableService) {

        'ngInject';

        this.$state = $state;
        this.coreOrderService = coreOrderService;
        this.ordersService = ordersService;
        this.popupMenuCalendar = popupMenuCalendar;
        this.advancedFiltersService = advancedFiltersService;
        this.infinityTableService = infinityTableService;

        this.SALES_ORDER_ID = Number(orderTypeConstants.SALES_ORDER_ID);

        this.statuses = [];

        this.filters = {};
        this.cacheFiltersKey = 'orders';
        // if initial filters exist
        this.rewriteCacheFilters = !!(
          $state.params.filterByStatus || $state.params.filterByPatientName || $state.params.orderTypes || $state.params.resupplyProgramId || $state.params.filterByTagName
        );

        this.initFilters = {
            OrderTypeFilters: {
                label: 'Type',
                type: 'radio-button-filter',
                items: [
                    {
                        id: guid(true),
                        displayName: 'All',
                        filterName: '',
                        isSelected: $state.params.orderTypes === 0,
                        isDefault: true
                    },
                    {
                        id: guid(true),
                        displayName: 'Sales',
                        filterName: 'filter.orderTypes',
                        filterValue: 1,
                        isSelected: $state.params.orderTypes === 1
                    },
                    {
                        id: guid(true),
                        displayName: 'Resupply',
                        filterName: 'filter.orderTypes',
                        filterValue: 2,
                        isSelected: $state.params.orderTypes === 2
                    }
                ]
            },
            OrderHoldReasonsFilters: {
                // TODO change after discussion with BA
                // label: 'Order Tags',
                // chipsLabel: 'Order Tag',
                label: 'Actions',
                chipsLabel: 'Action',
                placeholder: '+ action',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.tags',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {
                        sortExpression: 'Name ASC',
                        pageSize: 100
                    }
                },
                filterValue: $state.params.filterByTagName
                    ? [{
                        Id: $state.params.filterByTagName.id,
                        Name: $state.params.filterByTagName.name
                    }]
                    : [],
                getDictionary: (params) => this.coreOrderService.getOrderTags(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                isSelected: !!$state.params.filterByTagName
            },
            OrderOrderedHcpcsCodesFilters: {
                label: 'Ordered items',
                chipsLabel: 'Ordered item',
                placeholder: '+ HCPCS code',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.orderedHcpcsCodes',
                filterValue: [],
                dictionaryKeyName: 'Text',
                dictionarySearchParams: {
                    searchQueryKey: 'code'
                },
                getDictionary: (params) => this.ordersService.getHcpcsCodes(params).then((res) => res.data.Items),
                isSelected: false,
                smAutocompleteClass: 'sm-autocomplete'
            },
            OrderPendingHcpcsCodesFilters: {
                label: 'Pending items',
                chipsLabel: 'Pending item',
                placeholder: '+ HCPCS code',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.pendingHcpcsCodes',
                filterValue: [],
                dictionaryKeyName: 'Text',
                dictionarySearchParams: {
                    searchQueryKey: 'code'
                },
                getDictionary: (params) => this.ordersService.getHcpcsCodes(params).then((res) => res.data.Items),
                isSelected: false,
                smAutocompleteClass: 'sm-autocomplete'
            }
        };

        this.filtersObj = {
            'filter.displayId': null,
            'filter.physician': undefined,
            'filter.createdDate': '',
            'filter.location': '',
            'filter.tags': $state.params.filterByTagName ? [$state.params.filterByTagName.id] : undefined,
            'filter.status': $state.params.filterByStatus || [],
            'filter.resupplyProgramId': $state.params.resupplyProgramId || undefined,
            'filter.patientName': $state.params.filterByPatientName || undefined,
            'filter.orderTypes': $state.params.orderTypes || undefined
        };

        this.updateFilters = (response) => {
            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response, {});

                this.advancedFiltersService.mapFilterObject(response);

                this.filters = this.advancedFiltersService.getSearchFilters();

                this.infinityTableService.reload();
            }
        };

        this.sortExpr = {};

        this.getOrders = (pageIndex, pageSize) =>
            ordersService.getOrders(angular.merge({}, this.filtersObj, this.filters), this.sortExpr, pageIndex, pageSize)
                .then((response) => {
                    response.data.Items = response.data.Items.map(this._mapOrderItems);
                    return response;
                });

        ordersService.getStatuses()
            .then((response) => this.statuses = response.data);
    }

    goToOrder(orderId) {
        this.$state.go('root.orders.order.details', { orderId: orderId });
    }

    getRefPhysicians(fullName, pageIndex) {
        return this.ordersService.getRefPhysicians(fullName, pageIndex)
            .then((response) => response.data);
    }

    getPractices(name, pageIndex) {
        return this.ordersService.getPractices(name, pageIndex)
            .then((response) => response.data);
    }

    getOrderIds(displayId, pageIndex) {
        return this.ordersService.getOrderIds({
            DisplayId: displayId,
            PageIndex: pageIndex,
            selectCount: true
        }).then((response) => response.data);
    }

    asignPatientClick(event, orderId) {
        event.stopPropagation();
        let menuItems = this._getMenuItems(event, orderId);

        this.popupMenuCalendar.showPopupMenu(menuItems, event);
    }

    _mapOrderItems(order) {
        order.Status = order.State.Status;
        order.statusClass = mapOrderStatusClass(order.Status.Id);

        if (order.Location && order.Location.Address) {
            order.FormattedAddress = order.Location.Address + (order.Location.Practice ? (` ${ order.Location.Practice}`) : '');
        } else {
            order.FormattedAddress = '-';
        }

        return order;
    }

    _getMenuItems(event, orderId) {
        let menuItems = [
            {
                'title': 'Link to existing patient',
                'class': 'no-left-icon',
                'exec': () => {
                    this.ordersService.showAttachPatient(orderId);
                }
            },
            {
                'title': 'Create a new patient and link',
                'class': 'no-left-icon',
                'exec': () => {
                    // TODO: new route with only first step
                    this.$state.go('root.patients.addToOrder', { orderId: orderId });
                }
            }
        ];

        return menuItems;
    }
}

