class searchItemsCatalogService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        WEB_API_CATALOG_URI,
        $q) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.WEB_API_CATALOG_URI = WEB_API_CATALOG_URI;
        this.$q = $q;
    }

    getAspects(text) {
        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/products/attributes/dictionary?filter=${ encodeURIComponent(text) }`);
    }

    getWarehouses(text) {
        let paramsObj = {
            Name: text,
            SortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/locations/dictionary`, { params: paramsObj })
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
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary?code=${code}`);
    }

    searchProducts(searchModel, isResupplyProgramItems) {
        let params = {
            pageIndex: searchModel.pageIndex - 1,
            pageSize: searchModel.pageSize,
            NameOrPartNumber: searchModel.aspect ? searchModel.aspect : searchModel.searchAspect,
            Hcpcs: searchModel.hcpcsCode ? searchModel.hcpcsCode.Text : searchModel.searchHcpcsCode,
            Manufacturers: searchModel.searchManufacturers.map((item) => item.Code),
            Groups: searchModel.searchGroups.map((item) => item.Code),
            Categories: searchModel.searchCategories.map((item) => item.Code),
            IsBundle: searchModel.IsBundle,
            Resupply: isResupplyProgramItems ? true : undefined,
            selectCount: true
        };

        const deferred = this.$q.defer(),
            bundlePromises = [];

        params = angular.forEach(params, (value, key) => {
            if (value === null || value === undefined || value.length === 0) {
                delete params[key];
            }
        });

        this.$http.get(`${this.WEB_API_CATALOG_URI}v1/products`, { params })
            .then((response) => {

                angular.forEach(response.data.Items, (item) => {

                    if (item.Type === 'Bundle') {
                        const bundlePromise = this.getItemDetails(item.Id);

                        bundlePromises.push(bundlePromise);

                        bundlePromise.then((products) => {
                            item.Components = products.data.Components;
                        });
                    }

                    this._mapComponentsHcpcs(item);
                    this._encodeProductImgUrl(item);
                });

                // Resolve deffer if all request done
                if (bundlePromises.length) {
                    this.$q.all(bundlePromises).then(() => {

                        angular.forEach(response.data.Items, (item) => {
                            this._mapComponentsHcpcs(item);
                            this._encodeProductImgUrl(item);
                        });

                        deferred.resolve(response);
                    });
                } else {
                    deferred.resolve(response);
                }

            }).catch((err) => {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    isItemAdded(item, arr) {
        if (item.isAny && item.HcpcsCode) {
            return !!_.find(arr, (model) => {
                let modelCode = model.Code || (model.HcpcsCode ? (model.HcpcsCode.Id || model.HcpcsCode.Text) : ''),
                    itemCode = item.Code || (item.HcpcsCode ? (item.HcpcsCode.Id || item.HcpcsCode.Text) : '');

                return modelCode.toString() === itemCode.toString();
            });
        }
        if (item.Id) {
            return !!_.find(arr, (model) => item.Id === (model.Id || model.ProductId));
        }
    }

    getItemDetails(id) {
        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/products/${id}`);
    }

    getEquipmentDetails(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${id}`);
    }

    getEquipmentGroups(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/groups/dictionary`, { params });
    }

    getEquipmentCategories(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/categories/dictionary`, { params });
    }

    getEquipmentManufacturers(Name) {
        const params = { PageSize: 100, Name };

        return this.$http.get(`${this.WEB_API_CATALOG_URI}v1/manufacturers/dictionary`, { params });
    }

    _mapComponentsHcpcs(item) {
        if (item.Components && item.Components.length) {
            angular.forEach(item.Components, (component) => {
                if (component.HcpcsCodes && component.HcpcsCodes.length === 1) {
                    component.HcpcsCodes = component.HcpcsCodes[0].split('|');
                }
            });
        }
    }

    _encodeProductImgUrl(item) {
        item.PictureUrl = item.PictureUrl ? encodeURI(item.PictureUrl) : null;
        return item;
    }
}

angular.module('app.core')
    .service('searchItemsCatalogService', searchItemsCatalogService);
