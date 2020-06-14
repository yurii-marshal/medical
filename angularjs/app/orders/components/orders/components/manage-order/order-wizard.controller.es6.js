import templateUrl from './modals/order-confirmation-contacts/orderConfirmationContacts.html';

export default class orderWizardController {
    constructor(
        $state,
        $mdDialog,
        bsLoadingOverlayService,
        orderWizardService,
        settingsService
    ) {
        'ngInject';

        this.settingsService = settingsService;

        this.orderSetting = {};

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.orderWizardService = orderWizardService;

        this.orderId = $state.params.orderId;
        this.patient = $state.params.patient;

        this.breadcrumbName = this.orderId ? 'Edit Order' : 'Add New Order';

        this.model = {};
        this.tabs = orderWizardService.getTabs(this.orderId);

        this._activate();
    }

    _activate() {
        this.orderWizardService.setDefaultModel(this.orderId, this.patient);
        this.model = this.orderWizardService.getModel();

        if (this.$state.params.isFromPhys) {
            this.$state.go(this.tabs[1].state);
        } else {
            this.$state.go(this.tabs[0].state);
        }

        this.settingsService.getOrderSettings().then((response) => {
            this.orderSetting = response.data;
        });
    }

    isActive(state) {
        return this.$state.is(state);
    }

    next() {
        let index = _.findIndex(this.tabs, (step) => this.$state.is(step.state));

        if (this.mainForm[`step${(index + 1)}Form`].$valid) {
            let stepName = this.tabs[index + 1].name;

            if (stepName === 'Medical' && !this.model.hasReferringProvider) {
                this._goToNextStep(1);
            } else {
                if (stepName === 'Tags') {
                    this.model.showRemovedPrescriptionAlert = false;
                }
                this._goToNextStep(index);
            }

        } else {
            touchedErrorFields(this.mainForm[`step${(index + 1)}Form`]);
        }
    }

    _goToNextStep(index) {
        this.$state.go(this.tabs[index + 1].state);
        this._setTabsFinished(this.tabs, index, true);
    }

    previous() {
        let index = _.findIndex(this.tabs, (step) => this.$state.is(step.state));

        let stepName = this.tabs[index].name;

        this._setTabsFinished(this.tabs, index, false);

        if (stepName === 'Items' && !this.model.hasReferringProvider) {
            this.$state.go(this.tabs[0].state);
            return ;
        }

        this.$state.go(this.tabs[index - 1].state);
    }

    _setTabsFinished(tabs, currentIndex, isNext) {
        angular.forEach(tabs, (tab, index) => {
            if (isNext) {
                tab.isFinished = index < currentIndex + 1;
            } else {
                tab.isFinished = index < currentIndex - 1;
            }

            if (index === 1 && !this.model.hasReferringProvider) {
                tab.isFinished = false;
            }
        });
    }

    save() {
        // @TODO It will be need when we start implementing DWO
        const fax = (this.model.referral && this.model.referral.Location.Fax) ? this.model.referral.Location.Fax : '';
        const referral = this.model.referral;

        if (this.orderSetting.TurnedOn &&
            !this.model.wizardIsEdit) {

            this.$mdDialog.show({
                controller: 'orderConfirmationModalController',
                controllerAs: 'modal',
                template: templateUrl,
                clickOutsideToClose: false,
                locals: {
                    referral,
                    fax
                }
            }).then((data) => {
                this.orderWizardService.setNotificationData(data);
                this._saveOrder();
            });
        } else {
            this._saveOrder();
        }
    }

    _saveOrder() {
        this.bsLoadingOverlayService.start({ referenceId: 'order-wizard' });

        this.orderWizardService.saveOrder(this.orderId)
            .then((response) => {
                let _orderId = this.orderId || response.data.Id;

                this.$state.go('root.orders.list', { orderId: _orderId });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'order-wizard' }));
    }

    cancel() {
        this.$state.go('root.orders.list');
    }

    isPreviousDisabled() {
        return this.$state.is(this.tabs[0].state);
    }

    isNextDisabled() {
        if (this.$state.is(this.tabs[2].state) && this.model.newItems.length === 0) {
            return true;
        } else if (this.$state.is(this.tabs[3].state)) {
            if (
                (this.model.hasReferringProvider && this.model.isPrescriptionActive && !this.model.prescription.Id) ||
                  this.model.newItems.length === 0
            ) {
                return true;
            }
        }

        return false;
    }

    isSaveShown() {
        return this.$state.is(this.tabs[this.tabs.length - 1].state);
    }
}

