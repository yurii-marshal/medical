import {
    permissionsCategoriesConstants,
    ordersPermissionsConstants
} from '../../../../../core/constants/permissions.constants.es6';

import {
    orderTypeConstants,
    orderStatusConstants
} from '../../../../../core/constants/core.constants.es6.js';

export default class OrderStatusEditModalCtrl {
    constructor($rootScope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                ordersService,
                orderStateObj,
                orderTags,
                orderType,
                orderId,
                dictionaries,
                userPermissions
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.initialStateObj = angular.copy(orderStateObj);
        this.orderType = orderType;
        this.orderStateObj = orderStateObj;
        this.orderTags = orderTags;
        this.ordersService = ordersService;
        this.dictionaries = dictionaries;
        this.orderId = orderId;
        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.ordersPermissionsConstants = ordersPermissionsConstants;
        this.orderTypeConstants = orderTypeConstants;
        this.orderStatusConstants = orderStatusConstants;
    }

    isResupplyOrderCanceled() {
        return this.orderType === this.orderTypeConstants.RESUPPLY_ORDER_ID &&
            +this.orderStateObj.Status.Id === this.orderStatusConstants.CANCELLED_ORDER_ID &&
            +this.initialStateObj.Status.Id !== this.orderStatusConstants.CANCELLED_ORDER_ID;
    }

    save() {
        if (!this.Form.$valid) {
            touchedErrorFields(this.Form);
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'statusEditModal' });
        this.ordersService.saveOrder(this.orderId, this.orderStateObj, this.orderTags)
            .then(() => {
                this.$rootScope.$broadcast('orderUpdated');

                this.$mdDialog.hide({
                    orderState: this.orderStateObj,
                    orderTags: this.orderTags
                });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'statusEditModal' }));
    }

    close() {
        this.$mdDialog.cancel();
    }
}
