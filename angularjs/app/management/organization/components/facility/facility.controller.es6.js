export default class FacilityCtrl {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        organizationsFacilityService,
        facilityService,
        npiLookupService,
        coreDictionariesService
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.organizationsFacilityService = organizationsFacilityService;
        this.facilityService = facilityService;
        this.npiLookupService = npiLookupService;
        this.coreDictionariesService = coreDictionariesService;

        this.allContactTypes = [];
        this.model = null;
        this.facilityId = $state.params.facilityId;
        this.locationRequiredValid = true;

        this._activate();

    }

    _activate() {
        if (this.facilityId) {
            this.bsLoadingOverlayService.start({ referenceId: 'facilityPage' });
            this.organizationsFacilityService.getFacilityById(this.facilityId)
                .then((res) => {
                    this.model = this.facilityService.mapFacilityModel(res);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'facilityPage' }));
        } else {
            this.model = angular.copy(this.facilityService.getDefaultModel());
        }

        this.getContactTypes();
    }

    getContactTypes() {
        this.organizationsFacilityService.getContactTypes()
            .then((response) => this.allContactTypes = response.data);
    }

    addNewLocation() {
        this.model.Locations.push({
            Id: null,
            TmpId: guid(),
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

    deleteLocation(loc) {
        const locId = loc.TmpId || loc.Id;

        this.model.Locations = this.model.Locations.reduce((acc, loc) => {
            if (loc.TmpId !== locId && loc.Id !== locId) {
                acc.push(loc);
            }

            return acc;
        }, []);
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
        if ((this.facilityForm.npi.$valid && !npi) || (!this.facilityForm.npi.$touched && !this.facilityForm.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.facilityForm.npi.$valid) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'facilityPage' });
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
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'facilityPage' }));
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
            this.model.Phone = address.telephone_number ? address.telephone_number.split('-').join('') : null;
            this.model.Fax = address.fax_number ? address.fax_number.split('-').join('') : null;

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

    save() {

        if (!this.model.Locations.length) {
            this.locationRequiredValid = null;
            this.facilityForm['locationRequired'].$setValidity('required', false);
        } else {
            this.locationRequiredValid = true;
            this.facilityForm['locationRequired'].$setValidity('required', true);
        }

        if (this.facilityForm.$invalid) {
            touchedErrorFields(this.facilityForm);
            return;
        }

        let model = this.facilityService.mapPostModel(this.model);

        this.bsLoadingOverlayService.start({ referenceId: 'facilityPage' });
        const savePromise = this.facilityId ?
            this.organizationsFacilityService.updateFacility(this.facilityId, model) :
            this.organizationsFacilityService.createFacility(model);

        savePromise
            .then(() => {
                this.ngToast.success(`Facility is ${this.facilityId ? 'updated' : 'created'}`);
                this.$state.go('root.management.organization.facilities');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'facilityPage' }));
    }
}
