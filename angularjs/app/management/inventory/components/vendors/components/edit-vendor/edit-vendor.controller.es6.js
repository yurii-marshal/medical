import { contactTypeConstants } from '../../../../../../core/constants/core.constants.es6';

export default class editVendorController {
    constructor(
        $state,
        $q,
        ngToast,
        bsLoadingOverlayService,
        inventoryVendorsHttpService,
        billingProviderService
    ) {
        'ngInject';

        this.$state = $state;
        this.$q = $q;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryVendorsHttpService = inventoryVendorsHttpService;
        this.billingProviderService = billingProviderService;

        this.vendorId = $state.params.vendorId;
        this.allContactTypes = [];
        this.model = {
            Name: null,
            Address: null,
            Contacts: []
        };

        this._activate();
    }

    _activate() {
        if (this.vendorId) {
            this.bsLoadingOverlayService.start({ referenceId: 'vendorPage' });
            this.inventoryVendorsHttpService.getVendor(this.vendorId)
            .then((response) => {
                this.model = response.data;

                if (this.model.Contacts && this.model.Contacts.length) {
                    this.model.Contacts = this.model.Contacts
                       .map((item) => {
                           return {
                               type: item.Type.Name === 'WebSite' ? 'Website' : item.Type.Name,
                               value: item.Value
                           };
                       });
                }

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'vendorPage' }));
        }

        this.getContactTypes();
    }

    getContactTypes() {
        return this.inventoryVendorsHttpService.getContactTypes()
            .then((response) => {
                /**
                 * this mapping is workaround mapping for special dictionary with different
                 * id integers. should be fixed at backend eventually
                 * recomendation: to push backend team about this
                 */
                this.allContactTypes = response.data.map((contact) => {
                    switch (contact.Name) {
                        case 'Phone':
                            contact.Id = contactTypeConstants.PHONE_ID;
                            break;
                        case 'Fax':
                            contact.Id = contactTypeConstants.FAX_ID;
                            break;
                        case 'Email':
                            contact.Id = contactTypeConstants.EMAIL_ID;
                            break;
                        case 'WebSite':
                            contact.Id = contactTypeConstants.WEBSITE_ID;
                            contact.Name = 'Website';
                            break;
                        default:
                            break;
                    }

                    return contact;
                });
            });
    }

    save() {
        if (this.vendorForm.$invalid) {
            touchedErrorFields(this.vendorForm);
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'vendorPage' });
        const saveFn = this.vendorId ?
            this.inventoryVendorsHttpService.updateVendor.bind(this.inventoryVendorsHttpService) :
            this.inventoryVendorsHttpService.createVendor.bind(this.inventoryVendorsHttpService);

        saveFn(this._getSaveModel())
            .then(() => {
                this.ngToast.success(`Vendor is ${this.vendorId ? 'updated' : 'created'}`);
                this.$state.go('root.management.inventory.vendors');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'vendorPage' }));
    }

    cancel() {
        this.$state.go('root.management.inventory.vendors');
    }

    _getSaveModel() {
        const model = {
            Name: this.model.Name,
            Address: this.model.Address,
            Contacts: this.model.Contacts.map((c) => ({ Type: c.type, Value: c.value }))
        };

        if (this.vendorId) {
            model.Id = { Id: this.vendorId };
        }
        return model;
    }
}
