import { renderingProviderTypeConstants } from '../../../../core/constants/core.constants.es6';

export default class renderingProviderController {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        renderingProvidersService,
        billingDictionariesService,
        npiLookupService,
        referralsService
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.renderingProvidersService = renderingProvidersService;
        this.billingDictionariesService = billingDictionariesService;
        this.npiLookupService = npiLookupService;
        this.providerId = $state.params.providerId;

        this.referralsService = referralsService;

        this.types = renderingProviderTypeConstants;
        this.taxonomyDescriptionMaxLength = 1024;
        this.typesDictionary = [];
        this.model = {};

        this._activate();
    }

    _activate() {
        this.renderingProvidersService.getRenderingTypeDictionary()
            .then(response => this.typesDictionary = response.data);

        if (this.providerId) {
            this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
            this.renderingProvidersService.getRenderingProvider(this.providerId)
                .then((response) => {
                    this.model = response.data;
                    this.model.Type = this.model.Type.Id;

                    let parsingContactsDic = {
                        '1': 'Phone',
                        '2': 'Fax'
                    };

                    angular.forEach(this.model.Contacts, (item) => {
                        if (parsingContactsDic.hasOwnProperty(item.Type)) {
                            this.model[parsingContactsDic[item.Type]] = item.Value;
                        }
                    });
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
        }
    }

    getTaxonomyCodes(Id, PageIndex) {
        const params = { Id, PageIndex, selectCount: true };

        return this.billingDictionariesService.getTaxonomyCodes(params)
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => ({
                    Code: item.Id,
                    Description: item.Description,
                }));
                return response.data;
            });
    }

    cancel() {
        this.$state.go('root.management.billing.rendering.list');
    }

    save() {
        if (this.Form.$invalid) {
            touchedErrorFields(this.Form);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'providerPage' });
        this.renderingProvidersService.saveRenderingProvider(this.providerId, this.model)
            .then(() => {
                this.ngToast.success(this.providerId ? 'Rendering provider is updated' : 'Rendering provider is created');
                this.$state.go('root.management.billing.rendering.list');
            })
            .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
    }

    // TODO need to be refactored to make similar logic as we have at Referral provider
    npiLookup(referralModel) {
        let type;
        let model = {
            number: referralModel.Npi
        };

        if (referralModel.Type === this.types.PERSON_TYPE_ID) {
            type = 1;     // npi registry has different ids
            if (_.isObject(referralModel.PersonName)) {
                model.first_name = referralModel.PersonName.FirstName;
                model.last_name = referralModel.PersonName.LastName;
            }
        } else if (referralModel.Type === this.types.ORGANIZATION_TYPE_ID) {
            type = 2;     // npi registry has different ids
            model.organization_name = referralModel.OrganizationName;
        }

        if (_.isObject(referralModel.Address) && type === 2) {
            model.city = referralModel.Address.City;
            model.state = referralModel.Address.State;
            model.postal_code = referralModel.Address.Zip;
        }

        this.npiLookupService.npiLookup(model, type);
    }

    populateNPI(npi) {
        if ((this.Form.npi.$valid && !npi) || (!this.Form.npi.$touched && !this.Form.npi.$viewValue)) {
            this.ngToast.danger('Provide NPI number to populate data, please.');
            return;
        }
        if (!this.Form.npi.$valid) {
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

                    if (providerModel.enumeration_type === 'NPI-1') {
                        this.model.PersonName = {
                            FirstName: providerModel.basic.first_name,
                            LastName: providerModel.basic.last_name
                        };
                    }

                    if (providerModel.enumeration_type === 'NPI-2') {
                        this.model.OrganizationName = providerModel.basic.organization_name;
                    }

                    if (providerModel.taxonomies && providerModel.taxonomies.length) {
                        const primary = providerModel.taxonomies.find((v) => !!v.primary);

                        if (primary) {
                            this.checkTaxonomyCodeAndSet(primary);
                        }
                    }

                    this._mapAddress(address);
                } else {
                    this.ngToast.danger('NPI doesn\'t exist.');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'providerPage' }));
    }

    checkTaxonomyCodeAndSet(primary) {

        this.referralsService.checkTaxonomyCode(primary.code).then((response) => {
            if (response.length) {
                this.model.Taxonomy = {
                    Code: primary.code,
                    Description: primary.desc
                };
            } else {
                this.model.Taxonomy = {};
            }
        });
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
        }
    }
}
