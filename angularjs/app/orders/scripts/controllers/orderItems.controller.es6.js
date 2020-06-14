import { orderStatusConstants } from '../../../core/constants/core.constants.es6';
import { orderTrackingStatusesConstants } from '../../../core/constants/order.constants.es6';
import { mapTrackingItemStatusClass } from '../../../core/helpers/map-tracking-items-css-statuses.helper.es6';
import {
    ordersPermissionsConstants,
    permissionsCategoriesConstants
} from '../../../core/constants/permissions.constants.es6';

export default class orderItemsController {
    constructor(
        $scope,
        $state,
        $timeout,
        bsLoadingOverlayService,
        ordersService,
        orderWizardService,
        WEB_API_INVENTORY_SERVICE_URI,
        userPermissions,
        $rootScope
        ) {
        'ngInject';

        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.ordersPermissionsConstants = ordersPermissionsConstants;

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;
        this.orderWizardService = orderWizardService;

        this.orderStatusConstants = orderStatusConstants;

        this.orderId = $state.params.orderId;
        this.lastSearchText = '';
        this.filterText = {
            name: ''
        };
        this.filters = {
            status: undefined,
            from: '',
            to: ''
        };

        this.isAnyDevice = false;

        this.totalCount = undefined;
        this.progressItems = [];
        this.deliveredItems = [];
        this.itemStatuses = [];
        this.orderItemsMessages = [];

        this.model = ordersService.getModel();

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        ordersService.getTrackingStatuses()
            .then((response) => {
                this.itemStatuses = response.data;
            });

        this._getOrderItems();

        $scope.$watch(() => this.progressItems, (newVal, prevVal) => {
            if (newVal.length === 0 && prevVal.length) {
                this.$rootScope.$broadcast('removeAllPendingItems', true);
            }
        }, true);

        $scope.$watch(() => this.model, (newVal) => {
            if (newVal.shortInfo.Patient) {
                this.PatientId = newVal.shortInfo.Patient.Id;
            }
        }, true);

        $scope.$watch(() => this.filters, (newVal, oldVal) => {
            this.$timeout(() => {
                // $timeout for start/end time validation directive. When directive apply changes, then we check our form validation
                if (this.filtersForm.$valid && !_.isEqual(newVal, oldVal)) {
                    this._getOrderItems();
                }
            });
        }, true);

        $scope.$on('reloadOrderItems', () => this._getOrderItems());

        this.ordersService.getOrderMessages(this.orderId).then((response) => {
            this.orderItemsMessages = response.data.Items;
        });
    }

    onCloseOrderItemsMessage(index) {
        this.ordersService.readOrderMessages(this.orderItemsMessages[index].OrderId, this.orderItemsMessages[index].Id);
        this.orderItemsMessages.splice(index, 1);
    }

    _getOrderItems() {
        this.totalCount = undefined;
        this.lastSearchText = this.filterText.name;
        this.checkAnyDevice();
        this.bsLoadingOverlayService.start({ referenceId: 'orderItems' });
        this.ordersService.getOrderItems(this.orderId, angular.merge(this.filterText, this.filters))
            .then((response) => {
                this.progressItems = [];
                this.deliveredItems = [];

                this.totalCount = response.data.Items.length;
                angular.forEach(response.data.Items, (item) => this._mapResponseItems(item));

                this.progressItems = _.sortBy(this.progressItems, (item) => {
                    return item.Date ? [+item.Status.Id, -moment(item.Date).format('X')] : [+item.Status.Id, 0];
                });

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderItems' }));
    }

    _mapResponseItems(item) {
        let noImage = 'assets/images/colored/no-image-white.svg';

        item.image = noImage;

        if (item.PictureUrl) {
            item.image = this.WEB_API_INVENTORY_SERVICE_URI + item.PictureUrl;
        }

        if (item.Components && item.Components.length) {
            angular.forEach(item.Components, (component) => {
                component.image = noImage;

                if (component.PictureUrl) {
                    component.image = this.WEB_API_INVENTORY_SERVICE_URI + component.PictureUrl;
                }

                if (component.HcpcsCodes && component.HcpcsCodes.length === 1) {
                    component.HcpcsCodes = component.HcpcsCodes[0].split('|');
                }
            });
        }

        item.statusClass = mapTrackingItemStatusClass(item.Status.Id);

        if (item.Status.Id === orderTrackingStatusesConstants.DELIVERED_ID) {
            this.deliveredItems.push(item);
        } else {
            this.progressItems.push(item);
        }

        this.ordersService.getTrackingActions(this.orderId, item.Id)
            .then((response) => item.actions = response.data);
    }

    checkAnyDevice() {
        // this.ordersService.getSalesOrderPrescriptionListForCheckAnyDevice(this.orderId).then((res)=>{
        //     res.data.Items.some((item) => {
        //         if(item && item.HasAnyHcpcsCodeItem){
        //             this.isAnyDevice =  true;
        //         }
        //     });
        // })
    }

    searchByText($event) {
        if (!this.filterText.name) {
            return;
        }
        if (($event.type === 'keydown' && $event.keyCode === 13) || $event.type === 'click') {
            this._getOrderItems();
        }
    }

    clearSearchByText() {
        if (!this.filterText.name || this.lastSearchText !== this.filterText.name) {
            this._getOrderItems();
        }
    }

    clearFilters() {
        this.filterText.name = '';
        this.clearSearchByText();
        this.filters = {
            status: undefined,
            from: '',
            to: ''
        };
    }

    isActionButtonVisible(id) {
        const isVisible = (+id === orderStatusConstants.NEW_ORDER_ID) ||
                          (+id === orderStatusConstants.IN_PROGRESS_ORDER_ID);

        return isVisible;
    }
}
