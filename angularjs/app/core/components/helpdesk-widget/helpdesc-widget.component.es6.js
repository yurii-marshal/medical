import helpdescModalCtrl from './modals/helpdesc-modal.controller.es6';
import helpdescModalTemplate from './modals/helpdesc-modal.html';

import template from './helpdesc-widget.html';

class HelpdescWidget {
    constructor(
        $mdDialog,
        ngToast
    ) {
        'ngInject';

        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
    }

    togglePopup() {
        this.$mdDialog.show({
            template: helpdescModalTemplate,
            controller: helpdescModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {}
        }).then((status) => {
            if (status) {
                this.ngToast.success('Your message was sent successfully!');
            }
        });
    }
}

export default {
    bindings: {},
    template,
    controller: HelpdescWidget
};
