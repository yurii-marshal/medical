import { addTagClass } from '../../../core/helpers/map-tags.helper.es6';

export default class ordersService {
    constructor($mdDialog,
                fileService,
                $filter,
                $http,
                $q,
                WEB_API_SERVICE_URI,
                infinityTableFilterService,
                corePatientService,
                coreOrderService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.fileService = fileService;
        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;

        this.getAttrClass = (name) => addTagClass(name, 'order');

        this.model = {
            shortInfo: {},
            Tags: [],
            // Admission hidden by default, not implemented on API
            showAdmission: false
        };
    }

    getModel() {
        return this.model;
    }

    clearModel() {
        this.model = {
            shortInfo: {},
            Tags: [],
            // Admission hidden by default, not implemented on API
            showAdmission: false
        };
    }

    getOrderModalDetails(orderId) {
        return this.getOrderDetails(orderId)
            .then((response) => response);
    }

    getOrders(params, sortExpression, pageIndex=0, pageSize=100) {
        params = this.infinityTableFilterService.getFilters(params);
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        if (params['filter.createdDate']) {
            params['filter.createdDate'] = moment.utc(params['filter.createdDate'], 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        if (params['filter.displayId']) {
            params['filter.displayId'] = params['filter.displayId'].Text;
        }

        if (params['filter.startDate.from']) {
            params['filter.startDate.from'] = moment.utc(params['filter.startDate.from']).format('YYYY-MM-DD');
        }

        if (params['filter.startDate.to']) {
            params['filter.startDate.to'] = moment.utc(params['filter.startDate.to']).format('YYYY-MM-DD');
        }

        params = angular.merge(params, { pageSize, pageIndex, sortExpression });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders`, { params })
            .then((response) => {

                angular.forEach(response.data.Items, (item) => {
                    if (item.Tags && item.Tags.length) {
                        item.Tags.map((i) => i.attrClass = this.getAttrClass(i.Name));
                    }
                });
                return response;
            });
    }

    getReferenceOrders(params) {
        return this.coreOrderService.getOrdersDictionary(params);
    }

    getRefPhysicians(fullName) {
        let params = { fullName };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/physicians/dictionary`, { params });
    }

    getExtReferralCards(filter) {
        let params = { filter };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/dictionary`, { params })
            .then((response) => {
                response.data.Items = response.data.Items.filter((item) => item.IsExternal);
                angular.forEach(response.data.Items, (item) => {
                    item.searchName = this.$filter('referralDisplayName')(item, true);
                    item.displayName = this.$filter('referralDisplayName')(item);
                });
                return response;
            });
    }

    getStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/statuses/dictionary`);
    }

    getTrackingStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/tracking-statuses/dictionary`);
    }

    getTrackingActions(orderId, trackingId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking/${trackingId}/actions/dictionary`);
    }

    markAsDelivered(orderId, itemId, date) {
        let model = {
            DeliveryDate: moment(date).format('YYYY-MM-DD')
        };

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking/${itemId}/mark-as-delivered`, model);
    }

    backorderItem(orderId, itemId, date) {
        let model = {
            BackorderedDate: moment(date).format('YYYY-MM-DD')
        };

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking/${itemId}/backorder`, model);
    }

    getPractices(name) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/practices/dictionary?name=${name}`);
    }

    getOrderShortInfo(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/short-info`)
            .then((response) => {
                angular.extend(this.model.shortInfo, response.data);
                return response;
            });
    }

    getOrderDetails(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}`)
            .then((response) => {
                angular.extend(this.model, response.data);
                if (this.model.Tags && this.model.Tags.length) {
                    this.model.Tags.map((i) => i.attrClass = this.getAttrClass(i.Name));
                }
                return response.data;
            });
    }

    getOrderItems(orderId, filters) {
        let params = this.infinityTableFilterService.getFilters(filters);

        if (params.from) {
            params.from = moment.utc(params.from, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (params.to) {
            params.to = moment.utc(params.to, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking`, { params });
    }

    deleteOrderItem(orderId, itemId) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking/delete/${itemId}`);
    }

    share(orderId, referralCardId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/share`, { ReferralCardId: referralCardId });
    }

    getOrderIds(params) {
        return this.coreOrderService.getOrdersDictionary(params);
    }

    showAttachPatient(orderId) {
        this.$mdDialog.show({
            controller: 'attachPatientController',
            controllerAs: 'ctrl',
            templateUrl: 'core/views/templates/attachPatientModal.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { orderId }
        });
    }

    getPatientsByName(fullName, pageIndex) {
        pageIndex = pageIndex || 0;

        let params = {
            fullName,
            pageIndex,
            sortExpression: 'Name.FullName ASC'
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    attachPatientToOrder(orderId, patientId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/assign-to-patient/${patientId}`);
    }

    updateShipmentDetails(orderId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI }v1/orders/${orderId}/deliveries/update`);
    }

    _mapLocationContacts(obj) {
        obj.Contacts = [];

        if (obj.Phone) {
            obj.Contacts.push({
                type: 'Phone',
                value: obj.Phone
            });
        }
        if (obj.Fax) {
            obj.Contacts.push({
                type: 'Fax',
                value: obj.Fax
            });
        }
        if (obj.Email) {
            obj.Contacts.push({
                type: 'Email',
                value: obj.Email
            });
        }
    }

    _mapDWO(obj) {
        if (!obj) {
            return;
        }

        obj.SignedDateTime = this._getFormattedDate(obj.SignedDateTime);
        obj.StartOrderDateTime = this._getFormattedDate(obj.StartOrderDateTime);
    }

    _getFormattedDate(date) {
        return date ? moment.utc(date, 'YYYY-MM-DD').format('MM/DD/YYYY') : '';
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

    getOrderStatuses(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/statuses/dictionary`);
    }

    saveOrder(orderId, state, tags) {
        let model = {
            Status: state.Status.Id,
            Tags: tags.map((i) => i.Id)
        };

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/state`, model);
    }

    getHcpcsCodes(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }

    getOrderMessages(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${ orderId }/order-messages`);
    }

    readOrderMessages(orderId, orderMessageId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${ orderId }/order-messages/${ orderMessageId }/read`);
    }
}
