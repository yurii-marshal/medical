import { limitConstants } from '../../../../../../core/constants/core.constants.es6.js';
import { transformAddress } from '../../../../../../core/helpers/transform-address.helper.es6';

export default class PurchaseOrderManageController {
    constructor($state,
                $scope,
                $q,
                $mdDialog,
                $filter,
                ngToast,
                WEB_API_INVENTORY_SERVICE_URI,
                bsLoadingOverlayService,
                purchaseOrderManageService,
                inventoryVendorsHttpService,
                inventoryProductService,
                purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$q = $q;
        this.$mdDialog = $mdDialog;
        this.$filter = $filter;
        this.ngToast = ngToast;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrderManageService = purchaseOrderManageService;
        this.inventoryVendorsHttpService = inventoryVendorsHttpService;
        this.inventoryProductService = inventoryProductService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.isFromItemsPage = $state.params.isFromItemsPage;
        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;
        this.noImage = 'assets/images/colored/no-image-white.svg';

        this._activate();
    }

    _activate() {
        if (this.isFromItemsPage) {
            this.model = this.purchaseOrderManageService.getModel();
        } else {
            this.purchaseOrderManageService.clearModel();
            this.model = this.purchaseOrderManageService.getModel();
            if (this.purchaseOrderId) {
                this.getPurchaseOrder();
            }
        }
    }

    getPurchaseOrder() {
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderManagePage' });
        return this.purchaseOrdersHttpService.getPurchaseOrder(this.purchaseOrderId)
            .then((response) => {
                this.model = {
                    Vendor: {
                        Id: response.data.Vendor.Id,
                        Name: response.data.Vendor.Name,
                        Contacts: response.data.Vendor.Contacts.map((c) => ({ type: c.Type.Name, value: c.Value })),
                        FullAddress: transformAddress(response.data.Vendor.Address)
                    },
                    vendorContactObj: {},
                    Notes: response.data.Notes,
                    Products: response.data.Items.map((item) => {
                        item.allHcpcsCodes = item.HcpcsCodes.split(',');
                        item.Count = item.Qty;
                        item.Bundle = item.IsBundle;
                        return item;
                    })
                };
                this.purchaseOrderManageService.setModel(this.model);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderManagePage' }));
    }

    getVendors(Name, PageIndex) {
        const params = { Name, PageIndex };

        return this.inventoryVendorsHttpService.getVendors(params)
            .then((response) => {
                response.data.Items.forEach((item) => {
                    if (item.Contacts) {
                        item.Contacts = item.Contacts.map((c) => ({ type: c.Type.Name, value: c.Value }));
                    }
                });
                return response;
            });
    }

    onVendorChange() {
        if (this.model.Vendor) {
            this.model.vendorContactObj.FullAddress = this.model.Vendor.FullAddress;
            if (this.model.Vendor.Contacts) {
                this.model.Vendor.Contacts.forEach((contact) => {
                    this.model.vendorContactObj[contact.type] = contact.value;
                });
            }
        } else {
            this.model.vendorContactObj = {};
        }
    }

    calculateTotalPrice(item) {
        let totalPrice = 0;

        if (item.Price && item.Count) {
            totalPrice = item.Price * item.Count;
            if (item.Discount) {
                totalPrice = totalPrice - ((totalPrice / 100) * item.Discount);
            }
        }
        return totalPrice.toFixed(2);
    }

    addItems() {
        this.$state.go('root.purchase-order-add-items', { purchaseOrderId: this.purchaseOrderId, isFromManagePage: true });
    }

    deleteItem(index) {
        this.model.Products.splice(index, 1);
    }

    getProductComponents(product) {
        if (!product.Components) {
            const productId = product.ProductId || product.Id;

            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${product.Id}` });
            return this.inventoryProductService.getBundleComponents(productId)
                .then((response) => {
                    product.Components = response.data.map((item) => {
                        item.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(item);
                        return item;
                    });
                    product.componentsLoaded = true;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${product.Id}` }));
        }
    }

    cancel() {
        this._goToList();
    }

    save() {
        if (this.purchaseOrderForm.$invalid) {
            touchedErrorFields(this.purchaseOrderForm);
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderManagePage' });
        const model = this._getSaveModel();
        const promise = this.purchaseOrderId ?
            this.purchaseOrdersHttpService.updatePurchaseOrder(model) :
            this.purchaseOrdersHttpService.createPurchaseOrder(model);

        promise
            .then(() => {
                this.ngToast.success(`Purchase Order is ${this.purchaseOrderId ? 'updated' : 'created'}`);
                this._goToList();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderManagePage' }));
    }

    _goToList() {
        this.$state.go('root.inventory.purchase-orders');
    }

    _getSaveModel() {
        const model = {
            VendorId: this.model.Vendor.Id,
            Notes: this.model.Notes,
            Items: this.model.Products.map((item) => ({
                Id: item.Id && item.ProductId ? item.Id : null,
                ProductId: item.Id && item.ProductId ? item.ProductId : item.Id,
                Price: item.Price,
                Qty: item.Count,
                Discount: item.Discount
            }))
        };

        if (this.purchaseOrderId) {
            model.Id = this.purchaseOrderId;
        }

        return model;
    }
}
