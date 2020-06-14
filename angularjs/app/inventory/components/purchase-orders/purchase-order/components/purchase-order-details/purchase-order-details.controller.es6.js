import { transformAddress } from '../../../../../../core/helpers/transform-address.helper.es6';
import { minusPercentage } from '../../../../../../core/helpers/math-operations.helper.es6';
// productItemsDetailsModal
import productItemsDetailsController
    from '../../../../../../core/modals/product-items-details/product-items-details.controller.es6.js';
import productItemsDetailsTemplate
    from '../../../../../../core/modals/product-items-details/product-items-details.html';

export default class PurchaseOrderDetailsController {
    constructor($state,
                $scope,
                $mdDialog,
                $filter,
                WEB_API_INVENTORY_SERVICE_URI,
                bsLoadingOverlayService,
                purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$filter = $filter;

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.noImage = 'assets/images/colored/no-image-white.svg';
        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.model = {};

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderPage' });
        this.purchaseOrdersHttpService.getPurchaseOrder(this.purchaseOrderId)
            .then((response) => {
                this.model = {
                    Vendor: {
                        Name: response.data.Vendor.Name
                    },
                    vendorContactObj: {
                        FullAddress: transformAddress(response.data.Vendor.Address)
                    },
                    Products: response.data.Items.map((item) => {
                        item.allHcpcsCodes = item.HcpcsCodes.split(',');
                        if (item.Discount) {
                            item.Price = minusPercentage(item.Price, item.Discount);
                        }
                        return item;
                    })
                };
                if (response.data.Vendor.Contacts) {
                    response.data.Vendor.Contacts.forEach((c) => {
                        if ([ 'Phone', 'Fax' ].indexOf(c.Type.Name) !== -1 && c.Value) {
                            this.model.vendorContactObj[c.Type.Name] = this.$filter('tel')(c.Value);
                        } else {
                            this.model.vendorContactObj[c.Type.Name] = c.Value;
                        }
                    });
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderPage' }));
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
                patientId: null,
                modalType: 'product'
            }
        });
    }
}
