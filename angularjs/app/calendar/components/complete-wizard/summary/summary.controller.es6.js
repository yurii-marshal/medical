export default class CompleteWizardSummaryController {
    constructor($scope, $state, bsLoadingOverlayService, completeWizardService, $filter) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.completeWizardService = completeWizardService;
        this.$filter = $filter;
        this.isEventComplete = !!$state.params.appointmentId;

        this.model = completeWizardService.getModel();
        this.relationships = [];
        this.newItems = [];

        this._activate();
    }

    _activate() {
        this.newItems = this.completeWizardService.getNewItems();
        this.updatedItems = this.completeWizardService.getUpdatedItems();
        this.removedItems = this.completeWizardService.getRemovedItems();

        this.completeWizardService.getRelationships()
            .then((response) => this.relationships = response.data);
    }

    goStep(step) {
        this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.${step}`);
    }

    toggleDevice(indexDevice) {
        this.model.equipment.devices[indexDevice].isExpanded = !this.model.equipment.devices[indexDevice].isExpanded;
    }

    setSignatureBytes(bytes) {
        if (this.model) {
            this.model.signature = bytes;
        }
    }

    setSignedDateBytes(bytes) {
        if (this.model) {
            this.model.signedDate = bytes;
        }
    }

    signedByChanged(signPerson) {
        if (signPerson === 1) {
            this.model.relationship = undefined;
            this.model.relationshipOther = undefined;
            this.Form.$setUntouched();
        }

    }
}
