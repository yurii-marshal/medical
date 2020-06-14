export default class referralsService {
    constructor($q,
                $http,
                infinityTableFilterService,
                WEB_API_SERVICE_URI,
                WEB_API_IDENTITY_URI
    ) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.infinityTableFilterService = infinityTableFilterService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;

        this.model = {};
        this.contactTypes = [];
    }

    getModel() {
        return this.model;
    }

    setModel(data) {
        this.model.Id = data.Id;
        this.model.PrimaryLocation = {
            Address: data.PrimaryLocation.Address,
            Contacts: this.mapLocationContacts(data.PrimaryLocation)
        };
        this.model.Locations = data.Locations.map((item) => {
            return {
                Address: item.Address,
                Contacts: this.mapLocationContacts(item)
            };
        });
        this.model.ReferralCardSource = data.ReferralCardSource;
        this.model.PecosEnrollment = data.PecosEnrollment;
        this.model.ContactPerson = data.ContactPerson;
        this.model.ReferringProviderNote = data.Note;
        this.model.SalesAgentNote = data.SalesAgent && data.SalesAgent.Note;
        this.model.SalesAgent = data.SalesAgent && {
            Id: data.SalesAgent.Id,
            FullName: data.SalesAgent.Name.FullName,
        };
    }

    setDefaultModel() {
        this.model = {
            Id: undefined,
            PrimaryLocation: undefined,
            Locations: [],
            ReferralCardSource: undefined,
            ContactPerson: '',
            ReferringProviderNote: null,
            SalesAgentNote: null,
            SalesAgent: undefined
        };
        this._getOrganizationContactTypes()
            .then((response) => this._setContactTypes(response.data));
    }

    _getOrganizationContactTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/contact-types/dictionary`, { cache: true });
    }

    _setContactTypes(data) {
        if (!this.contactTypes.length) {
            angular.forEach(data, (item) => {
                /* item.id === 16 supposes to have item.Text === 'Website' */
                if (item.id !== 16) {
                    this.contactTypes.push(item);
                }
            });
        }
    }

    mapLocationContacts(location) {
        let contacts = [];

        angular.forEach(this.contactTypes, (item) => {
            addContact(item.Id, location[item.Text], item.Text);
        });

        function addContact(type, value, name) {
            if (value) {
                contacts.push({ type, name, value });
            }
        }

        return contacts;
    }

    getReferralList(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        if (params.payerId) {
            params.payerId = params.payerId ? params.payerId.Text : undefined;
        }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.Contacts = [];
                    if (item.PrimaryLocation.Phone) {
                        item.Contacts.push({ type: 'Phone', value: item.PrimaryLocation.Phone });
                    }
                    if (item.PrimaryLocation.Fax) {
                        item.Contacts.push({ type: 'Fax', value: item.PrimaryLocation.Fax });
                    }
                    if (item.PrimaryLocation.Email) {
                        item.Contacts.push({ type: 'Email', value: item.PrimaryLocation.Email });
                    }
                });
                return response;
            });
    }

    deleteReferral(Id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/referral/cards/${Id}/delete`);
    }

    getReferral(Id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/${Id}`);
    }

    _encodeQueryData(data) {
        let result = [];

        for (let prop in data) {
            if (data[prop]) {
                result.push(`${encodeURIComponent(prop)}=${encodeURIComponent(data[prop])}`);
            }
        }
        return result.join('&');
    }

    checkTaxonomyCode(taxonomy_code) {
        const params = {
            provider_taxonomy_code: taxonomy_code
        };

        const defer = this.$q.defer();
        const url = `https://data.cms.gov/resource/j75i-rw8y.json?${this._encodeQueryData(params)}`;

        const x = new XMLHttpRequest();

        x.open('GET', url, true);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        x.onload = (e) => {
            let res = JSON.parse(e.target.responseText);

            defer.resolve(res);
        };
        x.onerror = () => {
            defer.reject();
        };
        x.send();

        return defer.promise;
    }

    checkReferralPecosEnrollment(referral) {
        let params = {
            npi: referral.ReferralCardSource.Npi
        };

        const defer = this.$q.defer();
        const url = `https://data.cms.gov/resource/iadr-zq3i.json?${this._encodeQueryData(params)}`;

        const x = new XMLHttpRequest();

        x.open('GET', url, true);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        x.onload = (e) => {
            let res = JSON.parse(e.target.responseText);

            defer.resolve(res);
        };
        x.onerror = () => {
            defer.reject();
        };
        x.send();

        return defer.promise;
    }

    saveReferral() {
        if (!this.model.Id) {
            return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/referral/cards`, this._getSaveModel());
        }
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/referral/cards/${this.model.Id}/update`, this._getSaveModel());

    }

    _getSaveModel() {
        let source = this.model.ReferralCardSource;
        let model = {
            Id: this.model.Id || undefined,
            PecosEnrollment: this.model.PecosEnrollment,
            PrimaryLocation: {
                Address: this.model.PrimaryLocation.Address
            },
            Locations: this.model.Locations.map((item) => {
                const location = { Address: item.Address };

                this._mapLocationContactsToSaveModel(item.Contacts, location);

                return location;
            }),
            Physician: source.Name && source.Name.First && source.Name.Last
                ? {
                    First: source.Name.First,
                    Last: source.Name.Last
                }
                : undefined,
            Title: source.Title,
            Practice: source.Practice || undefined,
            Npi: source.Npi || undefined,
            ContactPerson: this.model.ContactPerson,
            ReferringProviderNote: this.model.ReferringProviderNote,
            SalesAgentNote: this.model.SalesAgentNote,
            SalesAgentId: this.model.SalesAgent ? this.model.SalesAgent.Id : undefined
        };

        this._mapLocationContactsToSaveModel(this.model.PrimaryLocation.Contacts, model.PrimaryLocation);

        return model;
    }

    _mapLocationContactsToSaveModel(contacts, location) {
        contacts.forEach((c) => {
            const contactName = _.find(this.contactTypes, (i) => i.Id === c.type).Text;

            location[contactName] = c.value;
        });
    }

    getUsers(fullName, pageIndex) {
        let params = {
            fullName,
            pageIndex,
            sortExpression: 'Name.FullName ASC'
        };

        return this.$http.get(`${ this.WEB_API_IDENTITY_URI }users/list`, { params });
    }
}
