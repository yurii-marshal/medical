class searchItemsService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_INVENTORY_SERVICE_URI, inventoryEquipmentService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.inventoryEquipmentService = inventoryEquipmentService;
    }

    getAspects(text) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI }v1/products/search/attributes/dictionary?filter=${ encodeURIComponent(text) }`);
    }

    getProductsById(Ids) {
        let params = {
            Ids,
            PageIndex: 0,
            PageSize: 100,
            StoreTypeIds: ['4431a39527655d7683172f00f10aec9b6afdf5da']
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params });
    }

    getWarehouses(text) {
        let paramsObj = {
            Name: text,
            SortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/locations/dictionary`, { params: paramsObj })
            .then((response) => response.data.Items);
    }

    getPersonnels(text) {
        let paramsObj = {
            fullName: text,
            SortExpression: 'Name.FullName ASC'
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel`, { params: paramsObj })
            .then((response) => response.data.Items);
    }

    getHcpcsCodes(code) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI }v1/hcpcs/dictionary?code=${code}`);
    }

    searchProducts(searchModel, isResupplyProgramItems) {
        let params = {
            pageIndex: searchModel.pageIndex - 1,
            pageSize: searchModel.pageSize,
            Text: searchModel.aspect ? searchModel.aspect : searchModel.searchAspect,
            HcpcsCode: searchModel.hcpcsCode ? searchModel.hcpcsCode.Text : searchModel.searchHcpcsCode,
            ManufacturerIds: searchModel.searchManufacturers.map((item) => item.Id),
            GroupIds: searchModel.searchGroups.map((item) => item.Id),
            CategoryIds: searchModel.searchCategories.map((item) => item.Id),
            IsBundle: searchModel.IsBundle,
            Resupply: isResupplyProgramItems ? true : undefined
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params: params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => this._mapComponentsHcpcs(item));
                return response;
            });
    }

    searchEquipments(personnelId, searchModel, patientId) {
        let params = {
            pageIndex: searchModel.pageIndex - 1,
            pageSize: searchModel.pageSize,
            Barcode: searchModel.serialNumber ? searchModel.serialNumber : undefined,
            Name: searchModel.modelName ? searchModel.modelName : undefined,
            PartNumbers: searchModel.searchPartNumbers,
            HcpcsCodes: searchModel.searchHcpcsCodes.map((item) => item.Id),
            ManufacturerIds: searchModel.searchManufacturers.map((item) => item.Id),
            GroupIds: searchModel.searchGroups.map((item) => item.Id),
            CategoryIds: searchModel.searchCategories.map((item) => item.Id),
            WarehouseIds: searchModel.Warehouse ? searchModel.Warehouse.Id : undefined,
            Status: searchModel.Status ? searchModel.Status : undefined
        };

        if (personnelId) {
            params.PersonnelIds = personnelId;

            return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/details`, { params })
                .then((response) => {
                    angular.forEach(response.data.Items, (device) => this._mapEquipments(device));
                    return response;
                });
        }
        const { LOCATION, PERSONNEL } = this.inventoryEquipmentService.LOCATION_TYPE();

        params.StoreTypes = [LOCATION, PERSONNEL];
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/details`, { params })
                .then((response) => {
                    angular.forEach(response.data.Items, (device) => this._mapEquipments(device));
                    return response;
                });

    }

    getLocationsDictionary() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations/types/dictionary`, { cache: true });
    }

    _mapEquipments(device) {
        switch (device.Status.Code) {
            case 'Active':
                device.statusClass = 'active';
                break;
            case 'Inactive':
                device.statusClass = 'gray';
                break;
            default:
                device.statusClass = 'dark-blue';
        }

        if (device.Bundle) {
            device.nonSerialised = !_.find(device.Components, (c) => typeof (c.SerialNumber) === 'string' && c.SerialNumber.length);
        } else {
            device.nonSerialised = !(typeof (device.SerialNumber) === 'string' && device.SerialNumber.length);
        }
    }

    isItemAdded(item, arr) {
        if (item.isAny && item.HcpcsCode) {
            return !!_.find(arr, (model) => {

                let modelCode = model.Code || (
                    model.HcpcsCode ? (model.HcpcsCode.Id || model.HcpcsCode.Text || model.HcpcsCode) : ''
                );

                let itemCode = item.Code || (
                    item.HcpcsCode ? (item.HcpcsCode.Id || item.HcpcsCode.Text || item.HcpcsCode) : ''
                );

                return modelCode.toString() === itemCode.toString();
            });
        }

        if (item.Id) {
            return !!_.find(arr, (model) => {
                if (model.Product) {
                    return item.Id === model.Product.Id;
                }

                return (item.Id === model.Id) || (item.Id === model.ProductId);
            });
        }
    }

    getItemDetails(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}`);
    }

    getEquipmentDetails(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${id}`);
    }

    getEquipmentGroups(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/groups/dictionary`, { params });
    }

    getEquipmentCategories(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/categories/dictionary`, { params });
    }

    getEquipmentManufacturers(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/manufacturers/dictionary`, { params });
    }

    _mapComponentsHcpcs(item) {
        if (item.Components && item.Components.length) {
            angular.forEach(item.Components, (component) => {
                if (component.HcpcsCodes.length === 1) {
                    component.HcpcsCodes = component.HcpcsCodes[0].split('|');
                }
            });
        }
    }
}

angular.module('app.core')
    .service('searchItemsService', searchItemsService);
