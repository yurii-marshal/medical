import template from './customer-specific-text.html';

class customerSpecificTextCtrl {
    constructor(customerSpecificService, bsLoadingOverlayService) {
        'ngInject';

        //Init Services
        this.customerSpecificService = customerSpecificService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        //Init variables
        this.specificTextList = [];

        //Init activates
        this._activate()

    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'customerSpecificText' });
        this.customerSpecificService.getSpecificList().then((res) => {
            this.specificTextList = res.data;
        }).finally(() => this.bsLoadingOverlayService.stop({ referenceId: "customerSpecificText"}));
    }

}

const customerSpecificText = {
  controller: customerSpecificTextCtrl,
  template
};

export default  customerSpecificText;
