export default class addReferralModalController {
    constructor(
        $mdDialog,
        ngToast,
        bsLoadingOverlayService,
        referral,
        orderWizardService,
        npiLookupService,
        reopenModal,
        updateReferral) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.referral = referral || {};
        this.orderWizardService = orderWizardService;
        this.npiLookupService = npiLookupService;
        this.reopenModal = reopenModal;
        this.updateReferral = updateReferral;
    }

    getUsers(name, pageIndex) {
        return this.orderWizardService.getUsers(name, pageIndex)
            .then((response) => response.data);
    }

    isRequiredContacts(type) {
        let isRequired = true;

        if (_.has(this.referral, 'Location')) {
            isRequired = this.referral.Location.Phone || this.referral.Location.Fax || this.referral.Location.Email;
        }

        return !isRequired;
    }

    npiLookup(referralModel) {
        let model = this.npiLookupService.getNpiLookupModel(referralModel);
        this.npiLookupService.npiLookup(model);
    }

    populateNPI(npi) {
        if ((this.addReferralForm.npi.$valid && !npi) || (!this.addReferralForm.npi.$touched && !this.addReferralForm.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.addReferralForm.npi.$valid) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'addReferral' });
        this.npiLookupService.getNpiRegistryDetails(this.referral.Physician.Npi)
            .then((response) => {

                if (response.data.results && response.data.results.length) {
                    const referralModel = response.data.results[0];
                    const address = _.find(referralModel.addresses, (address) => {
                        return address.address_purpose === 'LOCATION';
                    });

                    if (referralModel.enumeration_type === 'NPI-1') {
                        this.referral.Physician.Name = {
                            First: referralModel.basic.first_name,
                            Last: referralModel.basic.last_name
                        };
                    }

                    if (referralModel.enumeration_type === 'NPI-2') {
                        this.referral.Practice = referralModel.basic.organization_name;
                    }

                    this._mapReferralAddress(address);
                } else {
                    this.ngToast.danger('NPI doesn\'t exist.');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addReferral' }));
    }

    _mapReferralAddress(address) {
        if (address) {
            this.referral.Location.Address = {
                AddressLine: address.address_1,
                City: address.city,
                State: address.state,
                Zip: address.postal_code.substr(0, 5),
                AddressLine2: address.address_2
            };
            this.referral.Location.Phone = address.telephone_number
                ? address.telephone_number.split('-').join('')
                : null;
            this.referral.Location.Fax = address.fax_number
                ? address.fax_number.split('-').join('')
                : null;
        }
    }

    setProviderFieldsRequired() {
        if (!this.referral.Physician) { this.referral.Physician = {}; }

        let physician = this.referral.Physician;
        let isNotEmpty = physician && (physician.Name && (physician.Name.First || physician.Name.Last) || this.referral.Practice);

        return !isNotEmpty;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.addReferralForm.$invalid) {
            touchedErrorFields(this.addReferralForm);
            return;
        }

        this.checkAddressAndSave();
    }

    checkAddressAndSave() {
        let addressesArr = [{
            addressObj: this.referral.Location.Address,
            modalTitle: ""
        }];

        this.bsLoadingOverlayService.start({ referenceId: 'addReferral' });
        this.orderWizardService.saveReferral(this.referral)
            .then((response) => {
                this.$mdDialog.hide();
                this.updateReferral(response.data);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addReferral' }));
    }
}
