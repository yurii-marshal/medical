import { renderingProviderTypeConstants } from '../../../../core/constants/core.constants.es6';

export default class organizationLocationViewController {
    constructor(
        $state,
        $filter,
        ngToast,
        bsLoadingOverlayService,
        organizationLocationsService,
        npiLookupService,
        billingDictionariesService,
        coreDictionariesService
    ) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.organizationLocationsService = organizationLocationsService;
        this.npiLookupService = npiLookupService;
        this.billingDictionariesService = billingDictionariesService;
        this.coreDictionariesService = coreDictionariesService;

        this.allContactTypes = [];

        organizationLocationsService.clearModel();
        this.model = organizationLocationsService.getModel();
        this.locationId = $state.params.locationId;

        this._activate();

    }

    _activate() {
        if (this.locationId) {
            this.bsLoadingOverlayService.start({ referenceId: 'locationPage' });
            this.organizationLocationsService.getAndSetModel(this.locationId)
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'locationPage' }));
        }

        this.getContactTypes();
    }

    getContactTypes() {
        this.coreDictionariesService.getContactTypes()
            .then((response) => this.allContactTypes = response.data);
    }

    getProviders(name, pageIndex) {
        return this.organizationLocationsService.getBillingProviders(name, pageIndex)
            .then((response) => response.data);
    }

    getRenderingProviders(name, pageIndex) {
        let params = {
            Name: name,
            PageIndex: pageIndex,
            SortExpression: 'Name ASC'
        };

        return this.billingDictionariesService.getRenderingProviders(params)
            .then((response) => {
                response.data.Items.forEach((item) => {
                    if (item.Type.Id === renderingProviderTypeConstants.ORGANIZATION_TYPE_ID) {
                        item.Name = `${item.OrganizationName} (NPI: ${item.Npi})`;
                    }
                    if (item.Type.Id === renderingProviderTypeConstants.PERSON_TYPE_ID) {
                        item.Name = `${this.$filter('fullname')(item.PersonName)} (NPI: ${item.Npi})`;
                    }
                });
                return response.data;
            });
    }

    save() {
        if (this.locationForm.$invalid) {
            touchedErrorFields(this.locationForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'locationPage' });

        let savePromise = this.locationId
            ? this.organizationLocationsService.updateLocation()
            : this.organizationLocationsService.createLocation();

         savePromise
            .then(() => {
                this.ngToast.success(`Location is ${this.locationId ? 'updated' : 'created'}`);
                this.$state.go('root.management.organization.locations');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'locationPage' }));
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
        if ((this.locationForm.npi.$valid && !npi) || (!this.locationForm.npi.$touched && !this.locationForm.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.locationForm.npi.$valid) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'locationPage' });
        this.npiLookupService.getNpiRegistryDetails(this.model.Npi)
            .then((response) => {
                if (response.data.results && response.data.results.length) {
                    const locationModel = response.data.results[0];
                    const address = _.find(locationModel.addresses, (address) => {
                        return address.address_purpose === 'LOCATION';
                    });

                    if (locationModel.enumeration_type === 'NPI-2') {
                        this.model.Name = locationModel.basic.organization_name;
                    }

                    this._mapAddress(address);
                } else {
                    this.ngToast.danger('NPI doesn\'t exist.');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'locationPage' }));
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
                if (this.model[item.Text]) {
                    contacts.push({
                        type: item.Id,
                        name: item.Text,
                        value: this.model[item.Text]
                    });
                }
            });

            this.model.Contacts = contacts;
        }
    }

}
