export default class orderWizardStep7Controller {
    constructor($state, $filter, orderWizardService) {
        'ngInject';

        this.$state = $state;
        this.model = orderWizardService.getModel();
        this.orderId = $state.params.orderId;
        this.setReferringProviderNotes();
    }

    goToStep(stepNumber) {
        if (this.orderId) {
            this.$state.go(`root.orders.edit.step${stepNumber}`, { orderId: this.orderId });
        } else {
            this.$state.go(`root.orders.add.step${stepNumber}`);
        }
    }

    getExpirationDate(item) {
        let minLengthOfNeed = item.LengthOfNeed || 99;

        if (item.Bundle) {
            item.Components.forEach((component) => {
                if (component.LengthOfNeed < minLengthOfNeed) {
                    minLengthOfNeed = component.LengthOfNeed;
                }
            });
        }

        if (+minLengthOfNeed === 99) {
            return 'lifetime';
        }

        if (this.model.effectiveDate) {
            return moment(this.model.effectiveDate).add(minLengthOfNeed, 'months').format('MM/DD/YYYY');
        }

        return moment().add(minLengthOfNeed, 'months').format('MM/DD/YYYY');
    }

    isItemExpired(item) {
        return moment(this.getExpirationDate(item)).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
    }

    setReferringProviderNotes() {
        this.referringProviderNotes = [];
        if (this.model.referral) {
            if (this.model.referral.ReferringProviderNote) {
                this.referringProviderNotes.push({
                    label: 'Ref provider', labelClass: 'dark-gray', note: this.model.referral.ReferringProviderNote
                });
            }
            if (this.model.referral.SalesAgentNote) {
                this.referringProviderNotes.push({
                    label: 'Sales', labelClass: 'blue', note: this.model.referral.SalesAgentNote
                });
            }
        }
    }
}
