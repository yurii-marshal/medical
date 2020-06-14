export default class transferEquipmentService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_INVENTORY_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    finishTransfer(pairList) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/equipment/move`,
            this.generateTransferModel(pairList));
    }

    generateTransferModel(pairList) {
        let postModel = { Items: [] };

        angular.forEach(pairList, (item) => {

            let itemToPush = {
                "Id": item.product.Id,
                "Count": item.product.Count || 1,
                "FromLocationId": item.locationFrom.Id,
                "Destination": {},
                "Notes": item.product.notes
            };
            switch (item.locationTo.Type.Name) {
                case "Patient":
                    itemToPush.Destination = {
                        "Patient": {
                            "Id": item.locationTo.Id,
                            "Name": {
                                "FirstName": item.locationTo.Name.FirstName,
                                "LastName": item.locationTo.Name.LastName
                            },
                            "DateOfBirth": item.locationTo.DateOfBirthday
                        }
                    }
                    break;
                case "Personnel":
                    itemToPush.Destination = {
                        "Personnel": {
                            "Id": item.locationTo.Id,
                            "Name": {
                                "FirstName": item.locationTo.Name.FirstName,
                                "LastName": item.locationTo.Name.LastName
                            }
                        }
                    }
                    break;
                case "Warehouse":
                    itemToPush.Destination = {
                        "LocationId": item.locationTo.Id
                    }
                    break;
            }

            postModel.Items.push(itemToPush);
        });

        return postModel;
    }

    /**
     * @description - setting properties for inner controller logic
     * @param pair - current editing product
     * @returns {*} of pair with new properties
     */
    calculateProductProperties(pair) {

        pair.product.isBundle = pair.product.Components !== null
            && pair.product.Components !== undefined
            && pair.product.Components.length > 0;

        if (pair.product.isBundle) {
            pair.product.isSerialized = _.find(pair.product.Components,
                    c => typeof (c.SerialNumber) === "string" && c.SerialNumber.length > 0) !== undefined;
        } else {
            let serialNumber = pair.product.SerialNumber;
            pair.product.isSerialized = (!!serialNumber && serialNumber.length > 0);
        }

        pair.product.maxCount = pair.product.Count;
        pair.product.Count = 1;

        switch (pair.product.Status.Code) {
            case "Active":
                pair.product.statusClass = "active";
                break;
            case "Inactive":
                pair.product.statusClass = "gray";
                break;
            case "Retired":
                pair.product.statusClass = "dark-blue";
                break;
        }

        return pair;
    }

    /**
     * @description - calculate additional params for further specification and search product
     * @param pair - current editing product
     * @returns {*} of pair with new properties for further search activation
     */
    calculateProductNextKey(pair) {
        if (pair.product.Type.Code === 'Bundle') {
            angular.forEach(pair.product.Components, component => {
                if (component.Id === pair.NextKey.ProductId) {
                    switch (pair.NextKey.KeyType.Code) {
                        case 'SerialNumber':
                            component.isSerialNumberActive = true;
                            break;
                        case 'LotNumber':
                            component.isLotNumberActive = true;
                            break;
                    }
                }
            })
        } else {
            switch (pair.NextKey.KeyType.Code) {
                case 'SerialNumber':
                    pair.product.isSerialNumberActive = true;
                    break;
                case 'LotNumber':
                    pair.product.isLotNumberActive = true;
                    break;
            }
        }

        return pair;
    }

    // find not bundle products
    findExistingNotBundle(itemList, newItem) {
        return _.find(itemList, o => {
            return o.product.isSerialized === newItem.product.isSerialized
                && o.product.LotNumber === newItem.product.LotNumber
                && o.product.Status.Code === newItem.product.Status.Code
                && o.product.Id === newItem.product.Id
                && o.product.Refurbished === newItem.product.Refurbished
                && o.product.LocationId === newItem.product.LocationId
                && o.locationTo.Id === newItem.locationTo.Id;
        });
    }

    // find not bundle product Index
    findExistingNotBundleIndex(itemList, newItem) {
        return _.findIndex(itemList, o => {
            return o.product.isSerialized === newItem.product.isSerialized
                && o.product.LotNumber === newItem.product.LotNumber
                && o.product.Status.Code === newItem.product.Status.Code
                && o.product.Id === newItem.product.Id
                && o.product.Refurbished === newItem.product.Refurbished
                && o.product.LocationId === newItem.product.LocationId
                && o.locationTo.Id === newItem.locationTo.Id;
        });
    }

    // find bundle products
    findExistingBundle(itemList, newItem) {
        return _.find(itemList, o => {
            return o.product.isSerialized === newItem.product.isSerialized
                && o.product.Status.Code === newItem.product.Status.Code
                && o.product.Id === newItem.product.Id
                && o.product.Refurbished === newItem.product.Refurbished
                && o.locationTo.Id === newItem.locationTo.Id
                && this.isBundleComponentsEqual(o.product.Components, newItem.product.Components);
        });
    }

    // find bundle product Index
    findExistingBundleIndex(itemList, newItem) {
        return _.findIndex(itemList, o => {
            return o.product.isSerialized === newItem.product.isSerialized
                && o.product.Status.Code === newItem.product.Status.Code
                && o.product.Id === newItem.product.Id
                && o.product.Refurbished === newItem.product.Refurbished
                && o.locationTo.Id === newItem.locationTo.Id
                && this.isBundleComponentsEqual(o.product.Components, newItem.product.Components);
        });
    }

    // compare components of two bundle products
    isBundleComponentsEqual(components1, components2) {
        if (components1.length !== components2.length) {
            return false;
        }

        let hasNotEqual = false;
        angular.forEach(components1, c1 => {
            //TODO find out why don't we check other properties like serial number
            if (!_.find(components2, c2 => {
                    return c1.Name === c2.Name && c1.LotNumber === c2.LotNumber;
                })) {
                hasNotEqual = true;
            }
        });

        return hasNotEqual === false;
    }

    // clear current pair
    clearPair(pair) {
        pair.product = {
            Id: '',
            Name: ''
        };
        pair.SearchKeys = [];
        pair.Status = undefined;
        pair.NextKey = undefined;

        return pair;
    }

    /**
     * @description - check if product can be added
     * @param pairCurrent
     * @param pairList
     * @returns {string}
     */
    pushPairToList(pairCurrent, pairList) {
        let returnValue = '';

        pairCurrent.product.canChangeQty = !pairCurrent.product.isSerialized;

        if (!pairCurrent.product.isBundle) {   //  Not Bundle
            if (pairCurrent.product.isSerialized) {    // Serialized

                let existingItem = this.findExistingNotBundle(pairList, pairCurrent);
                returnValue = existingItem ? 'cantPush' : 'push';

            } else {                                        // Not Serialized
                let existingItem = this.findExistingNotBundle(pairList, pairCurrent);
                if (existingItem) {
                    if (existingItem.product.maxCount > existingItem.product.Count) {
                        existingItem.product.Count++;
                        returnValue = 'pushed';
                        return returnValue;
                    } else {
                        returnValue = 'countReached';
                    }
                } else {
                    returnValue = 'push';
                }
            }
        } else {                                    // Bundle
            if (pairCurrent.product.isSerialized) {    // Serialized

                let existingItem = this.findExistingBundle(pairList, pairCurrent);
                returnValue = existingItem ? 'cantPush' : 'push';

            } else {                                        // Not Serialized
                let existingItem = this.findExistingBundle(pairList, pairCurrent);
                if (existingItem) {
                    if (existingItem.product.maxCount > existingItem.product.Count) {
                        existingItem.product.Count++;
                        returnValue = 'pushed';
                        return returnValue;
                    } else {
                        returnValue = 'countReached';
                    }
                } else {
                    returnValue = 'push';
                }
            }
        }

        return returnValue;
    }

    getLocations(params, sortExpression, pageIndex, pageSize) {
        params = this.infinityTableFilterService.getFilters(params);
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        params = angular.merge(params, {sortExpression, pageIndex, pageSize});

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations`, { params });
    }

    getLocationById(UniqueId) {
        let params = { UniqueId };
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations`, { params });
    }

    getLocationTypes(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations/types/dictionary`, {
            cache: true,
            params
        });
    }

    getProducts(filterObj, sortExpressions, pageIndex, pageSize){

        let sortExpr = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, {
            'sortExpression': sortExpr,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'Status': 'Active' // issue: #245, only active products allowed
        });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products`, {params});
    }

    getProductByCodes(pairCurrent, ExcludeLocationId) {
        let postModel = {};

        postModel.LocationId = pairCurrent.locationFrom.Id !== ''
            ? pairCurrent.locationFrom.Id
            : undefined;

        postModel.ProductId = pairCurrent.product.Id || pairCurrent.product.barcode;

        if (pairCurrent.product.barcode && pairCurrent.NextKey) {
            pairCurrent.SearchKeys.push(
                {
                    'Key': pairCurrent.product.barcode,
                    'Type': pairCurrent.NextKey.KeyType.Code,
                    'ProductId': pairCurrent.NextKey.ProductId
                });

            postModel.SearchKeys = pairCurrent.SearchKeys;
        }

        if (ExcludeLocationId) {
            postModel.ExcludeLocationId = pairCurrent.locationTo.Id;
        }

        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/search`, postModel)
            .then(response => response);
    }

}
