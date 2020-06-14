export default class inventoryManufacturersService {
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
        let _sortExpressions = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': _sortExpressions,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers", { params: paramsObj })
            .then((response) => {
                angular.forEach(response.data.Items,  (item)=> {
                    if (item.Contacts) {
                        let contacts = [];
                        if (item.Contacts.Phone) { contacts.push({ type: 'phone', value: item.Contacts.Phone }); }
                        if (item.Contacts.Fax) { contacts.push({ type: 'fax', value: item.Contacts.Fax }); }
                        if (item.Contacts.Email) { contacts.push({ type: 'email', value: item.Contacts.Email }); }
                        item.Contacts = contacts;
                    } else {
                        item.Contacts = [];
                    }
                });
                return response;
            }, (err) => {});
    }

    getManufacturer(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers/{0}".format(id));
    }

    deleteManufacturer(id) {
        return this.$http.delete(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers/{0}".format(id));
    }

    saveManufacturer(isAddressRequired) {
        if (this.model.Id) {
            return this.$http.put(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers/{0}".format(this.model.Id), this.getSaveModel(isAddressRequired));
        } else {
            return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers", this.getSaveModel(isAddressRequired));
        }
    }

    getSaveModel(isAddressRequired) {
        return {
            Name: this.model.Name,
            Address: isAddressRequired ? this.model.Address : undefined,
            Website: this.model.Website,
            Phone: this.model.Phone,
            Fax: this.model.Fax,
            Email: (this.model.Email && this.model.Email !== "") ? this.model.Email : undefined
        };
    }

    getAndSetModel(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/manufacturers/{0}".format(id))
            .then(data => this.setModel(data.data), (err) => {});
    }

    setModel(data) {
        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Address = data.Address;
        this.model.Website = data.Website;
        this.model.Phone = data.Phone;
        this.model.Fax = data.Fax;
        this.model.Email = data.Email;
    }

    clearModel() {
        this.model = {
            Id: "",
            Name: "",
            Address: {},
            Website: "",
            Phone: "",
            Fax: "",
            Email: ""
        };
    }
}
