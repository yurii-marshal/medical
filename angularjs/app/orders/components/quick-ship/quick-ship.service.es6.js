import { normalizeOrderShortInfoData } from '../../../core/services/http/core/core-order/order-short-info.normalization.es6';
import { normalizePatientInfoData } from '../../../core/services/http/core/core-patient/patient-info.normalization.es6';
import { normalizeOrderTrackingItemsData } from '../../../core/services/http/core/core-order/order-tracking-items.normalization.es6';
import { normalizeBundleComponentsData } from '../../../core/services/http/inventory/inventory-product/product-bundle-components.normalization.es6';
import { normalizeGetProductsByIdsData } from '../../../core/services/http/inventory/inventory-equipment/get-products-byids.normalization.es6.js';
import { normalizeEquipmentLocationsData } from '../../../core/services/http/inventory/inventory-locations/get-equipment-locations.normalization.es6';

import { storeTypeIdsConstants } from '../../../core/constants/inventory.constants.es6';

export default class QuickShipService {
    constructor($filter,
                $http,
                $q,
                authService,
                corePatientService,
                coreOrderService,
                inventoryProductService,
                inventoryEquipmentHttpService,
                inventoryLocationsHttpService,
                WEB_API_SERVICE_URI,
                WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.$filter = $filter;
        this.$q = $q;
        this.authService = authService;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;
        this.inventoryProductService = inventoryProductService;
        this.inventoryEquipmentHttpService = inventoryEquipmentHttpService;
        this.inventoryLocationsHttpService = inventoryLocationsHttpService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    /**
     * @description get Order Short Info for Summary
     * @param {String} orderId
     */
    getOrderShortInfo(orderId) {
        return this.coreOrderService.getOrderShortInfo(orderId)
            .then((response) => normalizeOrderShortInfoData(response));
    }

    /**
     * @description
     * @param {String} patientId
     */
    getPatientInfoById(patientId) {
        return this.corePatientService.getPatientInfoById(patientId)
            .then((response) => normalizePatientInfoData(response.data));
    }


    /**
     * @description get order tracking items
     * @param {String} orderId
     * @param params
     */
    getOrderItems(orderId) {
        return this.coreOrderService.getOrderTrackingItems(orderId, {})
            .then((response) => normalizeOrderTrackingItemsData(response));
    }

    /**
     * @description get order tracking item
     * @param {String} orderId
     * @param {String} trackItemId
     */
    getOrderTrackingItemById(orderId, trackItemId) {
        return this.coreOrderService.getOrderTrackingItemById(orderId, trackItemId);
    }

    /**
     * @description get components for each of Bundle order tracking item
     * @param {String} productId
     * @param {String} productHash
     */
    getBundleComponents(productId, productHash) {
        return this.inventoryProductService.getBundleComponents(productId)
            .then((response) => normalizeBundleComponentsData(response.data, productHash));
    }

    /**
     * @description check if product exist in inventory
     * @param {Array} Ids
     * @returns {*}
     */
    getProductsById(Ids) {
        let params = {
            Ids,
            StoreItemStatus: 'Active',
            PageIndex: 0,
            PageSize: 100,
            StoreTypeIds: [
                storeTypeIdsConstants.WAREHOUSE_ID,
                storeTypeIdsConstants.TEAM_MEMBER_ID
            ]
        };

        return this.inventoryEquipmentHttpService.getProductsByIds(params)
            .then((response) => normalizeGetProductsByIdsData(response.data));
    }

    /**
     * @description generate Packaging Slip document
     * @param {String} orderId
     * @param {String} patientId
     * @param {Object} data { Items: [ { ProductId: {string}, Qty: {string}} ] }
     */
    generatePackagingSlip(orderId, patientId, data) {
        const defer = this.$q.defer();
        const token = this.authService.getAccessToken();
        const url = `${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/tracking/packing-slip`;

        const x = new XMLHttpRequest();

        x.open('POST', url, true);
        x.setRequestHeader('Authorization', `Bearer ${token}`);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        x.responseType = 'blob';

        x.onload = function(e) {
            defer.resolve();
            download(e.target.response, `${orderId}_PackagingSlip_.pdf`, e.target.response.type);
        };
        x.onerror = function() {
            defer.reject();
        };

        x.send(JSON.stringify(data));
        return defer.promise;
    }

    /**
     * @description search location by UniqueId filter in the list
     * @param UniqueId
     */
    getLocationById(UniqueId) {
        let params = { UniqueId };

        return this.inventoryLocationsHttpService.getEquipmentLocations(params)
            .then((response) => normalizeEquipmentLocationsData(response));
    }

    getProductByCodes(currentProduct) {
        let model = {
            LocationId: null,
            ExcludeLocationId: currentProduct.locationTo.uniqueId,
            LocationIds: currentProduct.storeIds,
            ProductId: currentProduct.productId,
            SearchKeys: [],
            Status: 'Active'
        };

        if (currentProduct.barcode && currentProduct.nextKey) {
            model.SearchKeys.push({
                Key: currentProduct.barcode,
                Type: currentProduct.nextKey.keyType.code,
                ProductId: currentProduct.nextKey.productId
            });
        }

        return this.inventoryEquipmentHttpService.searchEquipment(model);
    }

    /**
     * @description quick ship item or array ot items
     * @param options { model, orderId, patientId, itemId }
     * @returns {Promise}
     */
    shipItems(options) {
        if (options.itemId) {
            return this.coreOrderService.shipItem(options.orderId, options.patientId, options.itemId, options.model);
        }

        return this.coreOrderService.quickShip(options.orderId, options.patientId, options.model);
    }

    /**
     * @description return count of devices available for selection
     * with particular id in particular location
     * @param item
     * @param locationProductsCounter
     * @returns {number}
     */
    getAvailableLocationCount(item, locationProductsCounter) {
        const productSelected = locationProductsCounter.byId[item.id];

        if (productSelected) {
            return item.count - productSelected.selectedCount;
        }

        return item.count;
    }

}
