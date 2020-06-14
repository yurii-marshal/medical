export default class inventoryLocationsService {
    constructor($http, WEB_API_INVENTORY_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.model = {};
    }

    getModel() {
        return this.model;
    }

    getList(filterObj, sortExpressions, pageIndex, pageSize) {
        var _sortExpressions = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        var paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': _sortExpressions,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations", { params: paramsObj })
            .then((response) => {
                response.data.Items = this._remapItems(response.data.Items, false);
                return response;
            });
    }

    _remapItems(items, isLabelLocatin){
        return items.map((item) => {
            if (item.Contacts) {
                let contacts = [];
                if (item.Contacts.Phone) { contacts.push({ type: 'phone', value: item.Contacts.Phone }); }
                if (item.Contacts.Fax) { contacts.push({ type: 'fax', value: item.Contacts.Fax }); }
                if (item.Contacts.Email) { contacts.push({ type: 'email', value: item.Contacts.Email }); }
                item.Contacts = contacts;
            } else {
                item.Contacts = [];
            }

            if(isLabelLocatin) { item.isSelected = false; }

            item.statusText = item.Default ? "Yes" : "No";
            item.statusClass = item.Default ? "green" : "dark-blue";

            return item;
        });
    }

    getDefaultLocation() {

        const paramsObj = {
            'Default': true,
            'pageIndex': 0,
            'pageSize': 1
        };

        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations", { params: paramsObj })
            .then((response) => {
                return response && response.data.Items.length > 0 ? response.data.Items[0] : undefined;
            }, (err) => {});
    }

    getLabelsLocations(filterObj, sortExpressions, pageIndex, pageSize) {
        let _sortExpressions = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': _sortExpressions,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/print-labels/search", { params: paramsObj })
            .then((response) => {
                response.data.Items = this._remapItems(response.data.Items, true);
                return response;
            }, (err) => {});
    }

    getLocation(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/{0}".format(id));
    }

    deleteLocation(id) {
        return this.$http.delete(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/{0}".format(id));
    }

    saveLocation() {
        if (this.model.Id) {
            return this.$http.put(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/{0}".format(this.model.Id), this.getSaveModel());
        } else {
            return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations", this.getSaveModel());
        }
    }

    generateLabels(model) {
        return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/print-labels/generate", model);
    }

    getSaveModel  () {
        return {
            Name: this.model.Name,
            Address: this.model.Address,
            Phone: this.model.Phone,
            Fax: this.model.Fax,
            Email: (this.model.Email && this.model.Email !== "") ? this.model.Email : undefined,
            Default: this.model.Default
        };
    }

    getAndSetModel(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/locations/{0}".format(id))
            .then(data => this.setModel(data.data), (err) => {});
    }

    setModel(data) {
        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Address = data.Address;
        this.model.Phone = data.Phone;
        this.model.Fax = data.Fax;
        this.model.Email = data.Email;
        this.model.Default = data.Default || false;
    }

    clearModel() {
        this.model = {
            Id: "",
            Name: "",
            Address: {},
            Phone: "",
            Fax: "",
            Email: "",
            Default: false
        };
    };

}
