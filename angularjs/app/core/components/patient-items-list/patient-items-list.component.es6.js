import template from './patient-items-list.html';

// productItemsDetailsModal
import productItemsDetailsController from '../../modals/product-items-details/product-items-details.controller.es6.js';
import productItemsDetailsTemplate from '../../modals/product-items-details/product-items-details.html';

class patientItemsListCtrl {
    constructor(
        $mdDialog,
        $scope,
        $filter,
        $state,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.noImage = 'assets/images/colored/no-image-white.svg';

        $scope.$watch(() => this.items, (newVal) => {
            if (newVal) {
                angular.forEach(this.items, (i) => {
                    i.allHcpcsCodes = $filter('hcpcsCodesToArr')(i);

                    if (i.Components && i.Components.length) {
                        angular.forEach(i.Components, (item) => {
                            item.allHcpcsCodes = $filter('hcpcsCodesToArr')(item);
                        });
                    }
                });
            }
        });
    }

    showItemDetails($event, item) {
        this.$mdDialog.show({
            controller: productItemsDetailsController,
            controllerAs: '$ctrl',
            template: productItemsDetailsTemplate,
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            locals: {
                item,
                patientId: this.patientId,
                modalType: 'patient'
            }
        });
    }

    goToTherapyData(deviceId) {
        this.$state.go('root.patient.therapy', { deviceId });
    }
}

export const patientItemsList = {
    bindings: {
        patientId: '<?',
        items: '<'
    },
    template,
    controller: patientItemsListCtrl
};
