import {
    providerSignatureOnFileConstants,
    billingProviderTaxTypeConstants
} from '../../../../core/constants/billing.constants.es6.js';

export default class billingProviderController {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        $window,
        $q,
        WEB_API_BILLING_SERVICE_URI,
        billingProvidersService,
        billingProviderService,
        npiLookupService,
        iframeUtils
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$window = $window;
        this.$q = $q;
        this.billingProvidersService = billingProvidersService;
        this.billingProviderService = billingProviderService;
        this.npiLookupService = npiLookupService;
        this.iframeUtils = iframeUtils;

        this.providerSignatureOnFileConstants = providerSignatureOnFileConstants;

        billingProvidersService.clearModel();

        this.providerId = $state.params.providerId;
        this.taxMask = '999999999';
        this.taxTypes = [];
        this.signStatuses = [];
        this.acceptAssignmentTypes = [];
        this.allContactTypes = [];
        this.StripeClientId = undefined;
        this.contactTypes = billingProvidersService.getContactTypes();

        this._activate();
    }

    _activate() {

        if (this.providerId) {
            this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
            this.$q.all([
                this.billingProvidersService.getStripeOptions(),
                this.billingProvidersService.getAndSetModel(this.providerId),
                this.getAcceptAssignmentTypes(),
                this.billingProviderService.getContactTypes()
            ])
            .then((response) => {
                if (response[0].data.ClientId) {
                    this.StripeClientId = response[0].data.ClientId;
                } else {
                    this.ngToast.danger(`Can't find ClientId for "Stripe" account.`);
                }

                this.model = this.billingProvidersService.getModel();

                if (this._ifRedirectFromStripe()) {
                    this._updateModelFromLocalStorage(this.model);
                } else {
                    this._removeTmpModelFromLocalStorage();
                }

                this.allContactTypes = response[3].data;
            })
            .finally(() => {
                this._changeMask();
                this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' });
            });
        } else {
            this.billingProvidersService.setDefaultModelParams();
            this.model = this.billingProvidersService.getModel();
            this.getAcceptAssignmentTypes();

            this.billingProviderService.getContactTypes()
                .then((response) => {
                    this.allContactTypes = response.data;
                });
        }

        this.getBillingProviderTaxTypes();
        this.getSignatureOnFile();
    }

    getSignatureOnFile() {
        this.billingProvidersService.getSignatureOnFile()
            .then((response) => this.signStatuses = response.data);
    }

    getAcceptAssignmentTypes() {
        return this.billingProvidersService.getAcceptAssignmentTypes()
            .then((response) => this.acceptAssignmentTypes = response.data);
    }

    getBillingProviderTaxTypes() {
        return this.billingProviderService.getBillingProviderTaxTypes()
            .then((response) => this.taxTypes = response.data);
    }

    _changeMask() {
        if (this.model.BillingSetting.TaxType) {
            this.taxMask = this.model.BillingSetting.TaxType.Id === billingProviderTaxTypeConstants.SOCIAL_SECURITY_NUMBER_ID
                ? '999-99-9999'
                : '99-9999999';
        } else {
            this.taxMask = '999999999';
        }
    }

    taxTypeChanged() {
        this._changeMask();
    }

    signatureOnFileChanged(id) {
        if (id === providerSignatureOnFileConstants.NO_ID) {
            this.model.BillingSetting.SignatureOnFile.SignedDate = '';
        }
    }

    _ifRedirectFromStripe() {
        return this.$state.params.redirectFromStripe;
    }

    _saveTmpModelToLocalStorage(model) {
        localStorage['billingProviderModel'] = angular.toJson(model);
    }

    _removeTmpModelFromLocalStorage() {
        if (localStorage.billingProviderModel) {
            localStorage.removeItem('billingProviderModel');
        }
    }

    _updateModelFromLocalStorage(model) {
        let StripeAccount = angular.copy(model.StripeAccount);

        if (localStorage.billingProviderModel) {
            let tmpModel = angular.fromJson(localStorage['billingProviderModel']);

            if ( tmpModel && (tmpModel.Id.toString() === this.model.Id.toString()) ) {
                this.model = angular.copy(tmpModel);

                this.model['StripeAccount'] = StripeAccount;

                this.billingProvidersService.setModel(angular.copy(this.model));
            }
        }
        this._removeTmpModelFromLocalStorage();
    }


    connectToStripe() {
        this._saveTmpModelToLocalStorage(this.model);

        const redirectUri = window.encodeURIComponent(`${window.location.origin}/#/management/billing/stripe/`);

        this.iframeUtils.sendRedirectToParentIframe(`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${this.StripeClientId}&scope=read_write&state=${this.providerId}&redirect_uri=${redirectUri}`);
    }

    disconnectToStripe() {
        this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
        this.billingProvidersService.disconnectStripe(this.providerId)
            .then(() => this.model.StripeAccount = undefined)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
    }

    save() {
        if (this.providerForm.$invalid) {
            touchedErrorFields(this.providerForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
        this.billingProvidersService.saveProvider()
            .then(() => {
                this.ngToast.success(`Billing Provider is ${this.model.Id ? 'updated' : 'created'}`);
                this.$state.go('root.management.billing.providers.list');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
    }

    cancel() {
        this.$state.go('root.management.billing.providers.list');
    }

    npiLookup() {
        const TYPE = 2;
        let model = {
            number: this.model.Npi,
            organization_name: this.model.Name
        };

        if (_.isObject(this.model.Address)) {
            model.city = this.model.Address.City;
            model.state = this.model.Address.State;
            model.postal_code = this.model.Address.Zip;
        }

        this.npiLookupService.npiLookup(model, TYPE);
    }

    populateNPI(npi) {
        if ((this.providerForm.npi.$valid && !npi) || (!this.providerForm.npi.$touched && !this.providerForm.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.providerForm.npi.$valid) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
        this.npiLookupService.getNpiRegistryDetails(this.model.Npi)
            .then((response) => {

                if (response.data.results && response.data.results.length) {
                    const providerModel = response.data.results[0];
                    const address = _.find(providerModel.addresses, (address) => {
                        return address.address_purpose === 'LOCATION';
                    });

                    if (providerModel.enumeration_type === 'NPI-2') {
                        this.model.Name = providerModel.basic.organization_name;
                    }

                    this._mapAddress(address);
                } else {
                    this.ngToast.danger('NPI doesn\'t exist.');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
    }

    _mapAddress(address) {
        if (address) {
            this.model.Address = {
                AddressLine: address.address_1,
                City: address.city,
                State: address.state,
                Zip: address.postal_code.substr(0, 5),
                AddressLine2: address.address_2
            };
            this.model.Phone = address.telephone_number
                ? address.telephone_number.split('-').join('')
                : null;
            this.model.Fax = address.fax_number
                ? address.fax_number.split('-').join('')
                : null;

            let contacts = [];

            angular.forEach(this.allContactTypes, (item) => {
                if (this.model[item.Name]) {
                    contacts.push({
                        type: item.Id,
                        name: item.Text,
                        value: this.model[item.Name]
                    });
                }
            });

            this.model.Contacts = contacts;
        }
    }
}
