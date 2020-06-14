export default class productPageController {
    constructor(
        $scope,
        $state,
        ngToast,
        bsLoadingOverlayService,
        $q,
        inventoryProductsService,
        inventoryProductService
        ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.inventoryProductsService = inventoryProductsService;
        this.inventoryProductService = inventoryProductService;

        this.model = {};
        this.productId = $state.params.productId;
        this.uploadExtensions = ['jpg', 'png', 'jpeg'];
        this.noImage = 'assets/images/inventory-img.png';
        this.productSrc = this.noImage;
        this.isBundle = false;
        this.isServiceRequired = false;
        this.uploadedFile = [];
        this.statuses = [];
        this.types = [];
        this.cycles = [];
        this.startTypes = [];
        this.UsedByEquipment = false;
        this.disableEdit = false;

        $scope.$watch(() => this.uploadedFile, (newValue) => {
            if (!newValue || newValue.length === 0) {
                this.productSrc = this.model.Picture || this.noImage;
                this.model.PictureAction = 'NoAction';
            } else {
                let imageDataBase64 = this.inventoryProductsService.getBase64FromBuffer(newValue[0].Bytes);
                this.productSrc = `data:image/JPEG;base64,${imageDataBase64}`;
                this.model.Picture = imageDataBase64;
                this.model.PictureAction = 'Add';
            }
        }, true);

        this._activate();
    }

    _activate() {
        this.inventoryProductsService.clearModel();
        this.model = this.inventoryProductsService.getModel();

        let promises = [];

        promises.push(this.inventoryProductsService.getStatuses());
        promises.push(this.inventoryProductsService.getTypes());
        promises.push(this.inventoryProductsService.getCycles());
        promises.push(this.inventoryProductsService.getStartTypes());

        if (this.productId) {
            let modelPromise = this.inventoryProductsService.getAndSetModel(this.productId)
                .then(() => {
                    if (this.model.Picture) {
                        this.productSrc = this.model.Picture;
                    }
                    this.isBundle = this.model.Type.Name === 'Bundle';
                    this.isServiceRequired = this.model.Servicing !== undefined && this.model.Servicing !== null;
                    this.UsedByEquipment = this.model.UsedByEquipment;
                });

            promises.push(modelPromise);

            const isUseProductPromise = this.inventoryProductService.isUseProduct(this.productId).then((response) => {
                this.disableEdit = response.data.InUse;
            });

            promises.push(isUseProductPromise);
        } else {
            this.model.Status = {
                Id: '1',
                Name: 'Active'
            };
        }

        this.bsLoadingOverlayService.start({ referenceId: 'productPage' });
        this.$q.all(promises)
            .then((datas) => {
                this.statuses = datas[0].data;
                this.types = datas[1].data;
                this.cycles = datas[2].data;
                this.startTypes = datas[3].data;
                if (this.model.UsedByProduct) {
                    _.remove(this.types, (o) => o.Name === 'Bundle');
                }
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'productPage' });
            });
    }

    getGroupsByName(name, pageIndex) {
        return this.inventoryProductsService.getGroupsByName(name, pageIndex)
            .then((response) => response.data);
    }

    getCategoriesByName(name, pageIndex) {
        return this.inventoryProductsService.getCategoriesByName(name, pageIndex)
            .then((response) => response.data);
    }

    getManufacturersByName(name, pageIndex) {
        return this.inventoryProductsService.getManufacturersByName(name, pageIndex)
            .then((response) => response.data);
    }

    getHcpcsCodes(code, type) {

        return this.inventoryProductsService.getHcpcsCodes(code)
            .then((response) => {
                return this.exсludeCodes(response.data.Items, type);
            });
    }

    exсludeCodes(items,type) {

        if(type === 'primary') {
            if(this.model.HcpcsCodes.Additional && this.model.HcpcsCodes.Additional.length) {
                return items.filter((item) => {
                    if(this.model.HcpcsCodes.Additional.indexOf(item.Id) === -1) {
                        return item;
                    }
                });
            } else {
                return items;
            }
        }

        if(type === 'additional') {
            if(this.model.HcpcsCodes.Primary) {
                return items.filter((item) => {
                    if (item.Id !== this.model.HcpcsCodes.Primary.Id) {
                        return item;
                    }
                });
            } else {
                return items;
            }

        }

    }

    getBundleProducts(name, pageIndex) {
        return this.inventoryProductsService.getBundleProducts(name, pageIndex)
            .then((response) => ({
                Count: response.data.Count,
                Items: this.model.Components ?
                  response.data.Items.filter((item) => !this.model.Components.find((cmp) => cmp.Id === item.Id)) :
                  response.data.Items
            }));
    }

    addHcpcs(item) {
        if (!item) { return; };

        let haveItem = _.some(this.model.HcpcsCodes.Additional, (code) => code === item.Id);

        if (!haveItem) {
            if (!this.model.HcpcsCodes.Additional) {
                this.model.HcpcsCodes.Additional = [];
            }
            this.model.HcpcsCodes.Additional.push(item.Id);
            this.searchHcpcs = "";
        }
    }

    deleteHcpcsByIndex(index) {
        if (this.UsedByEquipment) { return; }

        this.model.HcpcsCodes.Additional.splice(index, 1);

        if (this.model.HcpcsCodes.Additional.length === 0) {
            this.model.HcpcsCodes.Additional = undefined;
        }
    }

    addSelectedItem(item) {
        if (!item) { return; }

        // if adding current item after changing its type
        // issue: #133
        if (item.Id === this.productId) {
            this.selectedItem = undefined;
            this.searchItemText = undefined;
            return;
        }

        if (!this.model.Components) {
            this.model.Components = [];
        }

        let haveItem = _.some(this.model.Components, (component) => component.Id === item.Id);

        if (!haveItem) {
            item.Count = 1;
            this.model.Components.push(item);
            this.searchItemText = '';
        } else {
            this.ngToast.danger('The Item has already been added.');
        }
    }

    deleteItemByIndex(index) {
        this.model.Components.splice(index, 1);
        if (this.model.Components.length === 0) {
            this.model.Components = undefined;
        }
    }

    removePicture() {
        this.productSrc = this.noImage;
        this.model.Picture = '';
        this.model.PictureAction = 'Clear';
    }

    typeChanged() {
        this.isBundle = this.model.Type && this.model.Type.Name === 'Bundle';
        if (!this.isBundle) {
            this.model.Options.Lotted = false;
        }
    }

    cancel() {
        this.$state.go('root.management.inventory.products.list');
    }

    save() {
        if (this.form.$valid) {
            // removing object if checkbox not checked
            if (!this.isServiceRequired) {
                this.model.Servicing = undefined;
            }

            this.bsLoadingOverlayService.start({ referenceId: 'productPage' });
            this.inventoryProductsService.saveProduct()
                .then((data) => {
                    this.ngToast.success(`Product is ${this.productId ? 'updated' : 'created'}`);
                    this.$state.go('root.management.inventory.products.list');
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'productPage' });
                });
        } else {
            touchedErrorFields(this.form);
        }
    }

    _setDefaultInterval() {
        if(!this.productId && this.model.Servicing.Interval === undefined) {
            this.model.Servicing.Interval = 1;
        }

    }
}
