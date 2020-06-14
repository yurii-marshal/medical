export default class organizationLocationsService {
    constructor(
        $http,
        $q,
        $filter,
        WEB_API_SERVICE_URI,
        WEB_API_BILLING_SERVICE_URI,
        WEB_API_ORGANIZATIONS_URI,
        infinityTableFilterService
    ) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.$filter = $filter;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_ORGANIZATIONS_URI = WEB_API_ORGANIZATIONS_URI;
        this.infinityTableFilterService = infinityTableFilterService;

        this.model = {};
    }

    getModel() {
        return this.model;
    }

    getAndSetModel(id) {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/organization/locations/${id}`)
            .then((response) => this._setModel(response.data));
    }

    _setModel(data) {
        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Address = data.Address;
        this.model.Npi = data.Npi;
        this.model.BillingProvider = data.BillingProvider;
        if (this.model.BillingProvider.Text) { // field with 'Text' changed to 'Name' on billing service
            this.model.BillingProvider.Name = this.model.BillingProvider.Text;
        }
        this.model.RenderingProvider = data.RenderingProvider;

        if (data.Contacts && data.Contacts.length) {
            this.model.Contacts = data.Contacts.map(item => {
                return {
                    type: item.Type.Id,
                    value: item.Value
                };
            });
        } else {
            this.model.Contacts = [];
        }
    }

    clearModel() {
        this.model = {
            Id: "",
            Name: "",
            Address: {},
            Npi: "",
            BillingProvider: null,
            RenderingProvider: null,
            Contacts: []
        };
    }

    getList(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/locations`, { params })
            .then(response => {
                response.data.Items.forEach((item) => {
                    item.Contacts = item.Contacts.map((c) => {
                        return { type: c.Type.Text, value: c.Value };
                    });
                });
                return response;
            });
    }

    getBillingProviders(name, pageIndex) {
        let params = {
            Name: name,
            PageIndex: pageIndex,
            SortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers`, { params })
            .then((response) => {
                response.data.Items.map((item) => {
                    return {
                        Id: item.Id,
                        Name: item.Name
                    }
                });
                return response;
            });
    }

    isLocationAssigned(locationId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/locations/${locationId}/is-assigned`);
    }

    reAssignLocation(model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/organization/locations/reassign`, model);
    }

    getLocations(Name, PageIndex = 0, PageSize = 100) {
        let params = { Name, PageIndex, PageSize, sortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/organization/locations`, { params });
    }

    getLocationsDictionary(Name, PageIndex = 0, PageSize = 100) {
        let params = { Name, PageIndex, PageSize, sortExpression: 'Text ASC' };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/locations/dictionary`, { params });
    }

    deleteLocation(id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/organization/locations/${id}`);
    }

    createLocation() {
        return this.$http.post(`${this.WEB_API_ORGANIZATIONS_URI}v1/organization/locations`, this._getEditModel());
    }

    updateLocation() {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/organization/locations/${this.model.Id}`, this._getEditModel(this.model.Id));
    }

    _getEditModel(LocationId) {
        return {
            LocationId,
            Body: {
                Name: this.model.Name,
                Address: {
                    AddressLine: this.model.Address.AddressLine,
                    AddressLine2: this.model.Address.AddressLine2,
                    FullAddress: this.$filter('addressToString')(this.model.Address),
                    City: this.model.Address.City,
                    State: this.model.Address.State,
                    Zip: this.model.Address.Zip
                },
                Npi: this.model.Npi,
                BillingProvider: {
                    Id: this.model.BillingProvider.Id,
                    Name: this.model.BillingProvider.Name,
                },
                RenderingProvider: this.model.RenderingProvider && {
                    Id: this.model.RenderingProvider.Id,
                    Name: this.model.RenderingProvider.Name,
                },
                Contacts: this.model.Contacts.map(o => {
                    return {
                        Type: o.type,
                        Value: o.value
                    };
                })
            }
        };
    }
}
