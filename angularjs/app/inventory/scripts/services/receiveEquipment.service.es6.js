export default class receiveEquipmentService {

    constructor($http, WEB_API_SERVICE_URI, WEB_API_INVENTORY_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    finishReceive(pairList) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/receive`,
            this.generateReceiveModel(pairList));
    }

    generateReceiveModel(pairList) {
        let postModel = { Items: [] };

        angular.forEach(pairList, (item) => {

            let itemToPush = {
                'LocationId': item.location.Id,
                'ProductId': item.product.Id,
                'Barcode': item.product.barcode ? item.product.barcode : item.product.Id,
                'SerialNumber': item.product.serialNumber,
                'LotNumber': item.product.lotNumber,
                'DeviceNumber': item.product.deviceNumber,
                'Count': item.product.Count || 1,
                'Notes': item.product.notes,
                'PurchasePrice': item.product.PurchasePrice ? item.product.PurchasePrice : null,
                'PurchaseOrderId': item.purchaseOrder && item.purchaseOrder.Id ? item.purchaseOrder.Id : null
            };

            if (item.product.Components && item.product.Components.length > 0) {
                itemToPush.Components = item.product.Components.map((prod) => {
                    return {
                        'ProductId': prod.Id,
                        'SerialNumber': prod.serialNumber,
                        'LotNumber': prod.lotNumber,
                        'DeviceNumber': prod.NeedDeviceNumber ? prod.deviceNumber : undefined,
                        'Notes': prod.notes
                    };
                });
            }
            postModel.Items.push(itemToPush);
        });

        postModel.Items = this.mergeProduct(postModel.Items);

        return postModel;
    }

    // comparing two non-bundle serialised pairs
    compareBySerialNonBundle(pair1, pair2) {
        let areEqual = pair1.location.Id === pair2.location.Id &&
                     pair1.product.Id === pair2.product.Id &&
                     pair1.product.serialNumber === pair2.product.serialNumber;

        return areEqual;
    }

    // comparing bundle with serialised components and serialised non-bundle pair
    compareBySerialBundle(pair1, pair2) {
        return this.isBundleBySerialsEqual(pair1.product.Components, [pair2.product]);
    }

    // check if there's another products with such serial number bundle or not
    isUniqueBySerial(pair, pairList) {
        let isUnique = true;

        if (pairList.length === 0) {
            return isUnique;
        }

        isUnique = !_.some(pairList, (o) => {
            return o.product.isBundle ?
                this.compareBySerialBundle(o, pair) :
                this.compareBySerialNonBundle(o, pair);
        });

        return isUnique;
    }

    // check if there's another NOT serialized products with such lot number
    isUniqueByLot(pair, pairList) {
        let isUnique = true;

        if (pairList.length > 0) {
            isUnique = !_.some(pairList, (o) => {
                return o.location.Id === pair.location.Id &&
                    o.product.Id === pair.product.Id &&
                    !o.isSerialized &&
                    o.product.lotNumber === pair.product.lotNumber;
            });
        }

        return isUnique;
    }

    isBundleWithoutSerials(pair) {
        return !_.some(pair.product.Components, (c) => c.serialNumber && c.serialNumber !== '');
    }

    isUniqueBundleByLot(pair, pairList) {
        let isUnique = true;

        if (pairList.length > 0) {
            let matchItem = _.find(pairList, (o) =>
                    o.location.Id === pair.location.Id &&
                 o.product.Id === pair.product.Id &&
                 this.isBundleByLotsEqual(o.product.Components, pair.product.Components)
            );

            if (matchItem) {
                // increasing number of products at selected list
                matchItem.product.Count++;
                isUnique = false;
            }
        }

        return isUnique;
    }

    // check if there's another bundle or non-bundle products with such serials
    isUniqueBundleBySerials(pair, pairList) {
        let isUnique = true;

        if (pairList.length > 0) {
            isUnique = !_.some(pairList, (o) =>
                this.isBundleBySerialsEqual(o.product.isBundle ? o.product.Components : [o.product], pair.product.Components)
            );
        }

        return isUnique;
    }

    isBundleBySerialsEqual(set1, set2) {
        let isEqual = false;

        angular.forEach(set1, (s1) => {
            if (_.some(set2, (s2) => s1.serialNumber && s2.serialNumber && s1.serialNumber === s2.serialNumber)) {
                isEqual = true;
            }
        });

        return isEqual;
    }

    isBundleByLotsEqual(set1, set2) {
        let isEqual = true;

        if (set1.length !== set2.length) {
            isEqual = false;
        }

        angular.forEach(set1, (s1) => {
            if (!_.find(set2, (s2) => s1.lotNumber && s2.lotNumber && s1.lotNumber === s2.lotNumber)) {
                isEqual = false;
            }
        });

        return isEqual;
    }

    getLocations(filterObj, sortExpressions, pageIndex, pageSize) {

        let sortExpr = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': sortExpr,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI }v1/locations/dictionary`, { params: paramsObj });
    }

    getLocationById(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + 'v1/locations/dictionary?Id={0}'.format(id));
    }

    getProducts(filterObj, sortExpressions, pageIndex, pageSize, productType) {

        const sortExpr = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);
        const url = productType === 'any' ? 'v1/products' : 'v1/equipment/products';

        if (paramsObj.HcpcsCode) {
            const hcpcsCodeId = paramsObj.HcpcsCode.Id;

            delete paramsObj.HcpcsCode;

            paramsObj[`${productType === 'any' ? 'HcpcsCode' : 'PrimaryHcpcsCode'}`] = hcpcsCodeId;

        }

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': sortExpr,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'Status': 'Active' // issue: #245, only active products allowed
        });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}${url}`, { params: paramsObj })
            .then((response) => {
                response.data.Items.map((item) =>
                    item.allHcpcsCodes = item.AdditionalHcpcsCodes && item.AdditionalHcpcsCodes.length ?
                        item.PrimaryHcpcsCodes.concat(item.AdditionalHcpcsCodes) :
                        item.PrimaryHcpcsCodes);
                return response;
            });
    }

    // count of serialized components in bundle product can't be greater than 1
    // TODO why it can happen that serialized components in bundle product greater than 1?
    fixSerializedCount(product) {
        for (let j = 0; j < product.Components.length; j++) {
            if (product.Components[j].Type.Code === 'Serialized' && product.Components[j].Count > 1) {
                for (let i = 1; i < product.Components[j].Count; i++) {
                    let itemsToInsert = angular.copy(product.Components[j]);

                    itemsToInsert.Count = 1;
                    product.Components.splice(j + 1, 0, itemsToInsert);
                }
                product.Components[j].Count = 1;
            }
        }
    }

    getProductById(id) {
        let params = { barcode: id };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/lookup/find`, { params } )
            .then((response) => {
                if (response.data) {
                    response.data.barcode = id;

                    // setting default QTY and ability to edit it
                    response.data.maxCount = response.data.Count;
                    response.data.Count = response.data.Count || 1;

                    if (response.data.Type.Code === 'NonSerialized') {
                        response.data.qtyEditable = true;
                        response.data.isSerialized = false;
                        response.data.isBundle = false;
                    }
                    if (response.data.Type.Code === 'Serialized') {
                        response.data.qtyEditable = false;
                        response.data.isSerialized = true;
                        response.data.isBundle = false;
                    }
                    if (response.data.Type.Code === 'Bundle') {
                        response.data.isBundle = true;

                        if (_.find(response.data.Components, (o) => o.Type.Code === 'Serialized')) {
                            response.data.qtyEditable = true;
                            response.data.isSerialized = true;
                            this.fixSerializedCount(response.data);
                        } else {
                            response.data.qtyEditable = false;
                            response.data.isSerialized = false;
                        }

                        response.data.NeedDeviceNumber = !!_.find(response.data.Components, (o) => o.NeedDeviceNumber);
                    }

                    // setting ability to input serial and lot numbers for components
                    if (response.data.Type.Code === 'Bundle') {
                        angular.forEach(response.data.Components, (item) => {
                            item.lotNumberEnabled = !!item.Lotted;
                            item.serialNumberEnabled = item.Type.Code === 'Serialized';
                        });
                    }

                }

                return response;
            }, (err) => { });
    }

    mergeProduct(products) {
        let bundleProducts = this.bundleProducts(products);
        let notBundleProducts = this.notBundles(products);

        return [...this.strategyForBundle(bundleProducts), ...this.strategyForNotBundle(notBundleProducts)];
    }

    bundleProducts(products) {
        return products.filter((item) => {
            if (item && item.Components) {
                return item;
            }
        });
    }

    notBundles(products) {
        return products.filter((item) => {
            if (!item.Components) {
                return item;
            }
        });
    }

    strategyForNotBundle(products) {
        let _notBundleProducts = [];
        let productsCopy = angular.copy(products);

        productsCopy.forEach((product) => {

            let index = _.findIndex(_notBundleProducts, (currentProduct) => {
                return currentProduct.LocationId === product.LocationId &&
                    currentProduct.ProductId === product.ProductId &&
                    currentProduct.PurchasePrice === product.PurchasePrice &&
                    currentProduct.LotNumber === product.LotNumber;
            });

            if (index === -1 || product.SerialNumber) {
                _notBundleProducts.push(product);
            } else {
                _notBundleProducts[index].Count += product.Count;
            }
        });
        return _notBundleProducts;
    }

    strategyForBundle(products) {
        let _bundleProducts = [];
        let productsCopy = angular.copy(products);

        productsCopy.forEach((item) => {
            let index = _.findIndex(_bundleProducts, (innerItem) => {
                return innerItem.LocationId === item.LocationId &&
                       innerItem.ProductId === item.ProductId &&
                       innerItem.PurchasePrice === item.PurchasePrice &&
                       innerItem.Components.every((component) => !component.SerialNumber);
            });

            if (index === -1) {
                _bundleProducts.push(item);
            } else {

                let isEqual = _.isEqualWith(_bundleProducts[index].Components,
                    item.Components, (prev, next) => {
                        return prev.LotNumber === next.LotNumber &&
                            prev.Count === next.Count;
                    });

                if (isEqual) {
                    _bundleProducts[index].Count = parseInt(_bundleProducts[index].Count) + parseInt(item.Count);
                } else {
                    _bundleProducts.push(item);
                }

            }
        });

        return _bundleProducts;
    }

    // find not bundle product Index
    findExistingNotBundleIndex(itemList, newItem) {
        return _.findLastIndex(itemList, (o) => {
            return o.product.isSerialized === newItem.product.isSerialized &&
                o.product.LotNumber === newItem.product.LotNumber &&
                o.product.Status.Code === newItem.product.Status.Code &&
                o.product.Id === newItem.product.Id &&
                o.product.Refurbished === newItem.product.Refurbished &&
                o.product.LocationId === newItem.product.LocationId &&
                o.product.Count === newItem.product.Count;
        });
    }

    // find bundle product Index
    findExistingBundleIndex(itemList, newItem) {
        return _.findLastIndex(itemList, (o) => {
            return o.product.isSerialized === newItem.product.isSerialized &&
                o.product.Status.Code === newItem.product.Status.Code &&
                o.product.Id === newItem.product.Id &&
                o.product.Refurbished === newItem.product.Refurbished &&
                this.isBundleComponentsEqual(o.product.Components, newItem.product.Components);
        });
    }

    // compare components of two bundle products
    isBundleComponentsEqual(components1, components2) {
        if (components1.length !== components2.length) {
            return false;
        }

        let hasNotEqual = false;

        angular.forEach(components1, (c1) => {
            // TODO find out why don't we check other properties like serial number
            if (!_.find(components2,
                        (c2) => {
                            return c1.Name === c2.Name && c1.LotNumber === c2.LotNumber;
                        })) {
                hasNotEqual = true;
            }
        });

        return hasNotEqual === false;
    }

}
