export default class inventoryProductsService {
    constructor($http,
                WEB_API_SERVICE_URI,
                WEB_API_INVENTORY_SERVICE_URI,
                WEB_API_CATALOG_URI,
                infinityTableFilterService,
                authService,
                Upload,
                $filter
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.WEB_API_CATALOG_URI = WEB_API_CATALOG_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.authService = authService;
        this.Upload = Upload;
        this.$filter = $filter;

        this.model = {};
    }

    getModel() {
        return this.model;
    }

    getAndSetModel(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}`)
            .then((response) => {
                this._setModel(response.data);
                return response;
            });
    }

    _setModel(data) {

        if (data.Components) {
            data.Components.forEach((component) => {
                component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
            });
        }

        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Type = data.Type;
        this.model.Status = data.Status;
        this.model.PartNumber = data.PartNumber;
        this.model.Manufacturer = data.Manufacturer;
        this.model.Group = data.Group;
        this.model.Category = data.Category;
        this.model.Description = data.Description;
        this.model.Pricing = data.Pricing;
        this.model.Picture = data.PictureUrl ? this.WEB_API_INVENTORY_SERVICE_URI + data.PictureUrl : null;
        this.model.Options = data.Options;
        this.model.HcpcsCodes = {};

        if (data.HcpcsCodes) {
            this.model.HcpcsCodes = {
                Primary: {
                    Id: data.HcpcsCodes.Primary
                },
                Additional: data.HcpcsCodes.Additional
            };
        }

        this.model.Servicing = data.Servicing;
        this.model.Components = data.Components;
        this.model.UsedByEquipment = data.UsedByEquipment;
        this.model.UsedByProduct = data.UsedByProduct;
    }

    clearModel() {
        this.model = {
            Id: '',
            Name: '',
            Type: undefined,
            Status: undefined,
            PartNumber: '',
            Manufacturer: undefined,
            Group: undefined,
            Category: undefined,
            Description: '',
            Pricing: {},
            Picture: '',
            PictureAction: 'NoAction',
            Options: {
                Lotted: undefined,
                Resupply: undefined,
                DataCollection: undefined
            },
            HcpcsCodes: {},
            Servicing: {
                Interval: undefined
            },
            Components: []
        };
    }

    getProductsList(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        if (params.HcpcsCode) {
            params.HcpcsCode = params.HcpcsCode.Id;
        }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.statusClass = item.Status.Name === 'Active' ? 'green' : 'dark-blue';
                    item.allHcpcsCodes = item.AdditionalHcpcsCodes && item.AdditionalHcpcsCodes.length ?
                        item.PrimaryHcpcsCodes.concat(item.AdditionalHcpcsCodes) :
                        item.PrimaryHcpcsCodes;
                });
                return response;
            });
    }

    getProductsListFilteredById(Id) {
        let params = { Id };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products`, { params });
    }

    getProductLabels(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/print-labels/search`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.isSelected = false;
                    item.statusClass = item.Status.Name==='Active' ? 'green' : 'dark-blue';
                });
                return response;
            });
    }

    getProductById(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}`);
    }

    deleteProductById(id) {
        return this.$http.delete(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}`);
    }

    saveProduct() {
        if (this.model.Id) {
            return this.$http.put(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${this.model.Id}`, this._getSaveModel());
        }
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products`, this._getSaveModel());
        
    }

    _getSaveModel() {
        let saveModel = {
            Name: this.model.Name,
            Type: this.model.Type.Id,
            Status: this.model.Status.Name,
            PartNumber: this.model.PartNumber,
            ManufacturerId: this.model.Manufacturer.Id,
            GroupId: this.model.Group.Id,
            CategoryId: this.model.Category.Id,
            Description: this.model.Description,
            Pricing: this.model.Pricing ?
            {
                PurchasePrice: this.model.Pricing.PurchasePrice,
                SalePrice: this.model.Pricing.SalePrice,
                RentalSalePrice: this.model.Pricing.RentalSalePrice
            } :
                undefined,
            Picture: {
                Action: this.model.PictureAction,
                Bytes: this.model.PictureAction === 'Add' ? this.model.Picture : undefined
            },
            Options: this.model.Options ?
            {
                Lotted: this.model.Options.Lotted,
                Resupply: this.model.Options.Resupply,
                DataCollection: this.model.Options.DataCollection
            } :
                undefined
        };

        if (this.model.Type.Name === 'Bundle') {
            saveModel.Components = this.model.Components
                .map((item) => {
                    return {
                        ProductId: item.Id,
                        Count: item.Count
                    };
                });
        } else {
            saveModel.HcpcsCodes = {
                Primary: this.model.HcpcsCodes.Primary.Id,
                Additional: this.model.HcpcsCodes.Additional
            };
            saveModel.Servicing = this.model.Servicing ?
            {
                StartType: this.model.Servicing.StartType.Id,
                Interval: this.model.Servicing.Interval,
                Cycle: this.model.Servicing.Cycle.Name
            } :
                undefined;
        }

        return saveModel;
    }

    generateLabels(model) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/print-labels/generate`, model);
    }

    getStatuses() {
        let params = { SortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/statuses/dictionary`, { params, cache: true });
    }

    getTypes() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/types/dictionary`, { cache: true });
    }

    getCycles() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/service/cycle-types/dictionary`, { cache: true });
    }

    getStartTypes() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/service/start-types/dictionary`, { cache: true });
    }

    getGroupsByName(Name, pageIndex) {
        let params = { Name, pageIndex, SortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/groups/dictionary`, { params });
    }

    getCategoriesByName(Name, pageIndex) {
        let params = { Name, pageIndex, SortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/categories/dictionary`, { params });
    }

    getManufacturersByName(Name, pageIndex) {
        let params = { Name, pageIndex, SortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/manufacturers/dictionary`, { params });
    }

    getHcpcsCodes(code, pageIndex) {
        const params = {
            code,
            PageIndex: pageIndex
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }

    getBundleProducts(NameOrPartNumber, pageIndex=0) {
        let params = {
            NameOrPartNumber,
            IsBundle: false,
            Status: 'Active',
            SortExpression: 'Name ASC',
            pageIndex: pageIndex
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products`, { params })
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        Id: item.Id,
                        Count: 0,
                        Name: item.Name,
                        PartNumber: item.PartNumber,
                        Manufacturer: item.Manufacturer,
                        HcpcsCodes: { Primary: item.PrimaryHcpcsCodes },
                        allHcpcsCodes: item.PrimaryHcpcsCodes.concat(item.AdditionalHcpcsCodes)
                    };
                });
                return response;
            });
    }

    getBase64FromBuffer(buffer) {
        let binary = '',
            bytes = new Uint8Array(buffer),
            len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    importProducts(file) {
        const token = this.authService.getAccessToken();

        if (!file) {
            return;
        }
        if (!token) {
            return;
        }

        return this.Upload.upload({
            url: `${this.WEB_API_SERVICE_URI}products/import`,
            data: { file: file },
            method: 'POST',
            headers: { 'Authorization': `Bearer${token}` }
        });
    }

    getImportStatus() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}products/import/status`);
    }

    getImportLog(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}products/import/${id}/logs`);
    }

    importCancel(id) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}products/import/${id}/cancel`);
    }
}
