import { limitConstants } from '../../../../core/constants/core.constants.es6.js';

export default class referralController {
    constructor($scope,
                $state,
                ngToast,
                bsLoadingOverlayService,
                referralsService,
                npiLookupService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.referralsService = referralsService;
        this.npiLookupService = npiLookupService;

        referralsService.setDefaultModel();
        this.model = referralsService.getModel();
        this.Id = $state.params.id;
        this.notAllowedTypes = ['website'];
        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;

        if (this.Id) {
            this._setReferralDataById(this.Id);
        }
    }

    onSalesAgentChange() {
        if (!this.model.SalesAgent) {
            this.model.SalesAgentNote = null;
        }
    }

    _setReferralDataById(id) {
        this.bsLoadingOverlayService.start({ referenceId: 'referralPage' });
        this.referralsService.getReferral(id)
            .then((response) => {
                this.referralsService.setModel(response.data);
                if (response.data.ReferralCardSource.Npi) {
                    return this.referralsService.checkReferralPecosEnrollment(response.data);
                }
            })
            .then((res) => {
                if (res) {
                    let newPecosEnrollment = res && (res.length > 0);

                    if (this.model.PecosEnrollment !== newPecosEnrollment) {
                        this.model.PecosEnrollment = res && (res.length > 0);
                        this.referralsService.saveReferral();
                    }
                }

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'referralPage' }));
    }

    getUsers(name, pageIndex) {
        return this.referralsService.getUsers(name, pageIndex)
            .then((response) => response.data);
    }

    setProviderFieldsRequired() {
        let source = this.model.ReferralCardSource;
        let isNotEmpty = source && (source.Name && (source.Name.First || source.Name.Last) || source.Practice);

        return !isNotEmpty;
    }

    npiLookup(referralModel) {
        const npiModel = Object.assign({}, referralModel);

        npiModel.Location = referralModel.PrimaryLocation;
        const model = this.npiLookupService.getNpiLookupModel(npiModel);

        this.npiLookupService.npiLookup(model);
    }

    populateNPI(npi) {
        if ((this.referralForm.npi.$valid && !npi) || (!this.referralForm.npi.$touched && !this.referralForm.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.referralForm.npi.$valid) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'referralPage' });
        this.npiLookupService.getNpiRegistryDetails(this.model.ReferralCardSource.Npi)
            .then((response) => {

                if (response.data.results && response.data.results.length) {
                    const referralModel = response.data.results[0];
                    const address = _.find(referralModel.addresses, (address) => {
                        return address.address_purpose === 'LOCATION';
                    });

                    if (referralModel.enumeration_type === 'NPI-1') {
                        this.model.ReferralCardSource.Name = {
                            First: referralModel.basic.first_name,
                            Last: referralModel.basic.last_name
                        };
                    }

                    if (referralModel.enumeration_type === 'NPI-2') {
                        this.model.ReferralCardSource.Practice = referralModel.basic.organization_name;
                    }

                    this._mapReferralAddress(address, this.model);
                } else {
                    this.ngToast.danger('NPI doesn\'t exist.');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'referralPage' }));
    }

    _mapReferralAddress(address, model) {
        if (address) {
            this.model.PrimaryLocation.Address = {
                AddressLine: address.address_1,
                City: address.city,
                State: address.state,
                Zip: address.postal_code.substr(0, 5),
                AddressLine2: address.address_2
            };
            this.model.PrimaryLocation.Phone = address.telephone_number
                ? address.telephone_number.split('-').join('')
                : null;
            this.model.PrimaryLocation.Fax = address.fax_number
                ? address.fax_number.split('-').join('')
                : null;

            this.model.PrimaryLocation.Contacts = this.referralsService.mapLocationContacts(model.PrimaryLocation);
        }
    }

    addNewLocation() {
        this.model.Locations.push({
            Id: null,
            Address: {
                AddressLine: null,
                AddressLine2: null,
                City: null,
                State: null,
                Zip: null,
                Country: null
            },
            Contacts: []
        });
    }

    deleteLocation(index) {
        this.model.Locations.splice(index, 1);
    }

    save() {
        if (!this.referralForm.$valid) {
            touchedErrorFields(this.referralForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'referralPage' });
        this.referralsService.saveReferral()
            .then(() => {
                this.ngToast.success(`Referral is ${this.Id ? 'updated' : 'created'}`);
                this.$state.go('root.management.organization.referral.list');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'referralPage' }));
    }

    cancel() {
        this.referralsService.setDefaultModel();
        this.$state.go('root.management.organization.referral.list');
    }
}
