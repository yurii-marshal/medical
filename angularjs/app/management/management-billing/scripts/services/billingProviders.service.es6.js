import {
    providerSignatureOnFileConstants,
    acceptAssignmentConstants
} from '../../../../core/constants/billing.constants.es6';

export default class billingProvidersService {
    constructor($q, $http, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;

        this.model = {};
        this.contactTypes = [];
    }

    getModel() {
        return this.model;
    }

    getAndSetModel(id) {
        return this.$q.all([
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/contact-types/dictionary`, { cache: true }),
            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${id}`)
        ])
            .then((responses) => {
                this._setContactTypes(responses[0].data);
                this.setModel(responses[1].data);
            });
    }

    setModel(data) {
        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Address = data.Address;
        this.model.Npi = data.Npi;
        this.model.BillingSetting = data.BillingSetting;

        this.model.BillingSetting.SignatureOnFile.IsSigned = {
            Id: data.BillingSetting.SignatureOnFile.Type.Id
        }

        this.model.BillingSetting.SignatureOnFile.SignedDate = data.BillingSetting.SignatureOnFile.SignedDate
            ? moment(data.BillingSetting.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
            : '';
        this.model.StripeAccount = data.StripeAccount;
        this.model.BillingSetting.AcceptAssignment = data.BillingSetting.AcceptAssignment;

        if (data.Contacts && data.Contacts.length) {
            this.model.Contacts = data.Contacts.map((item) => {
                return {
                    type: item.Type ? item.Type.Id : item.type,
                    value: item.Value || item.value
                };
            });
        } else {
            this.model.Contacts = [];
        }
    }

    setDefaultModelParams() {
        this.model['BillingSetting']['SignatureOnFile'] = {
            IsSigned: {
                Id: providerSignatureOnFileConstants.NO_ID,
                Name: providerSignatureOnFileConstants.NO_ID
            }
        };
        this.model['BillingSetting']['AcceptAssignment'] = {
            Id: acceptAssignmentConstants.NO_ID
        };
    }

    clearModel() {
        this.contactTypes = [];
        this.model = {
            Id: '',
            Name: '',
            Address: {},
            Npi: '',
            BillingSetting: {},
            Contacts: []
        };
    }

    getContactTypes() {
        return this.contactTypes;
    }

    _setContactTypes(data) {
        angular.forEach(data, (item) => this.contactTypes.push(item));
    }

    getList(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers`, { params })
            .then((response) => {
                response.data.Items.forEach((item) => {
                    if (item.Contacts) {
                        item.Contacts = item.Contacts.map((c) => {
                            return { type: c.Type.Name, value: c.Value };
                        });
                    }
                });
                return response;
            });
    }

    saveProvider() {
        if (!this.model.Id) {
            return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers`, this._getSaveModel());
        }
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${this.model.Id}`, this._getSaveModel());

    }

    isProviderAssigned(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/billing-providers/${id}/is-assigned`);
    }

    reAssignBillingProvider(model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/organization/billing-providers/reassign`, model);
    }

    getBillingProvidersDictionary(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/dictionary`, { params })
            .then((response) => {
                response.data.Items.forEach((item) => {
                    item.FullName = `${item.Name} (NPI: ${item.Npi})`;
                });
                return response;
            });
    }

    deleteProvider(id) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${id}`);
    }

    _getSaveModel() {
        return {
            Name: this.model.Name,
            Address: this.model.Address,
            Npi: this.model.Npi,
            BillingSetting: {
                TaxId: this.model.BillingSetting.TaxId,
                TaxType: this.model.BillingSetting.TaxType.Id,
                SignatureOnFile: {
                    IsSigned: this.model.BillingSetting.SignatureOnFile.IsSigned.Id,
                    SignedDate: this.model.BillingSetting.SignatureOnFile.IsSigned.Id === providerSignatureOnFileConstants.YES_ID
                        ? moment(this.model.BillingSetting.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
                        : ''
                },
                AcceptAssignment: this.model.BillingSetting.AcceptAssignment.Id
            },
            Contacts: this.model.Contacts.map((o) => {
                return {
                    Type: o.type,
                    Value: o.value
                };
            })
        };
    }

    getStripeOptions() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/credit-card/options`);
    }

    connectStripe(providerId, code) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/stripe/connect/${providerId}?code=${code}`);
    }

    disconnectStripe(providerId) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/stripe/disconnect/${providerId}`);
    }

    getSignatureOnFile() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patient-signature-on-file/dictionary`, { cache: true });
    }

    getAcceptAssignmentTypes() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/accept-assignment-type/dictionary`, { cache: true });
    }
}
