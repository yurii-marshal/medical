import saveConfirmController from '../../../patients/components/patient/components/manage-resupply/modals/save-confirm/save-confirm.controller.es6';
import saveConfirmTemplate from '../../../patients/components/patient/components/manage-resupply/modals/save-confirm/save-confirm.html';

export default class CompleteWizardController {
    constructor(
        $scope,
        $state,
        $mdDialog,
        bsLoadingOverlayService,
        completeWizardService,
        patientResupplyService
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.completeWizardService = completeWizardService;
        this.patientResupplyService = patientResupplyService;

        this.isEventComplete = !!$state.params.appointmentId;

        this.orderId = $state.params.orderId;

        this.isModelLoaded = false;

        completeWizardService.setDefaultModel();
        completeWizardService.setDefaultSteps(this.isEventComplete);

        this.steps = completeWizardService.getSteps();
        this.model = {};
        this.orderType = undefined;

        if (this.isEventComplete &&
            !$state.is('root.completeEvent.step1.equipments', {
                appointmentId: $state.params.appointmentId,
                patientId: $state.params.patientId,
                personnelId: $state.params.personnelId
            })) {

            $state.go('root.completeEvent.step1.equipments');
        }

        if (!this.isEventComplete &&
            !$state.is('root.completeOrder.step1.equipments')) {

            $state.go('root.completeOrder.step1.equipments', {
                orderId: $state.params.orderId,
                patientId: $state.params.patientId
            });
        }

        bsLoadingOverlayService.start({ referenceId: 'completeWizard' });

        if (this.isEventComplete) {
            completeWizardService.setModelForEventComplete($state.params.patientId, $state.params.appointmentId)
                .then((response) => {

                    // Block complete for completed events
                    if (response.appointmentStatus.Text.toLowerCase() === 'completed' ) {
                        $state.go('root.dashboard.index', {});
                    }

                    this.model = response;
                    this.model.eventId = $state.params.appointmentId;
                    completeWizardService.setDefaultSteps(this.isEventComplete, this.model.orderType);
                    this.steps = completeWizardService.getSteps();
                    this.isModelLoaded = true;
                })
                .finally(() => {
                    bsLoadingOverlayService.stop({ referenceId: 'completeWizard' });
                });
        } else {
            completeWizardService.setModelForOrderComplete($state.params.orderId, $state.params.patientId)
                .then((response) => {
                    this.model = response;

                    if (_.has(this.model, 'orderShortInfo.State.Status.Text') &&
                        this.model.orderShortInfo.State.Status.Text.toLowerCase() === 'completed') {

                        $state.go('root.dashboard.index', {});
                    }

                    this.model.OrderId = $state.params.orderId;
                    completeWizardService.setDefaultSteps(this.isEventComplete, this.model.orderType);
                    this.steps = completeWizardService.getSteps();
                    this.isModelLoaded = true;
                })
                .finally(() => {
                    bsLoadingOverlayService.stop({ referenceId: 'completeWizard' });
                });
        }
    }

    _checkState() {
        if (this.$state.is(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}`) ||
            !this.$state.is(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step1`)) {
            this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step1.equipments`,
                { orderId: this.model.orderId });
        }

        let index = _.findIndex(this.steps, (step) => this.$state.is(step.view));

        this._checkFinishedStep(this.steps, index);
    }

    beforeNext() {
        let index = _.findIndex(this.steps, (step) => this.$state.is(step.view)),
            nextStep = _.find(this.steps, (step, key) => (key > index) && !step.isHidden);

        if (!this.Form.$valid) {
            touchedErrorFields(this.Form);
            return false;
        }

        if (nextStep.title === 'Notes' &&
            this.model.ResupplyProgramAvailable &&
            !this.patientResupplyService.checkItemsByRules(this.model.ResupplyProgram.Items, this.model.ResupplyProgram.ResupplyRules)) {

            this.$mdDialog.show({
                template: saveConfirmTemplate,
                controller: saveConfirmController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { }
            })
            .then(() => {
                this.next(nextStep);
            });

            return ;
        }

        this.next(nextStep);
    }

    next(nextStep) {
        if (this.Form.$valid) {
            this._checkState();
            this.$state.go(nextStep.view);
        } else {
            touchedErrorFields(this.Form);
        }
    }

    previous() {
        let reverseSteps = angular.copy(this.steps);

        _.reverse(reverseSteps);

        let currentIndex = _.findIndex(this.steps, (step) => this.$state.is(step.view)),
            index = _.findIndex(reverseSteps, (step) => this.$state.is(step.view)),
            previousStep = _.find(reverseSteps, (step, key) => (key > index) && !step.isHidden);

        this.$state.go(previousStep.view);
    }

    _checkFinishedStep(arr, currentIndex) {
        arr.forEach((step, index) => step.isFinished = index <= currentIndex);
    }

    complete() {
        if (this.Form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'completeWizard' });

            let canceledPromise = false;

            // This hard fix necessary for handle complete timeout error.
            const saveTimeout = setTimeout(() => {
                this.cancel();
                canceledPromise = true;
            }, 30 * 1000 ); // Waiting 30 seconds, after that will redirect to details

            if (this.isEventComplete) {

                this.completeWizardService.completeEvent(this.$state.params.appointmentId, this.$state.params.patientId)
                    .then(() => {
                        if (canceledPromise) {
                            return ;
                        }

                        this.$state.current.data.showPopupBeforeLeave = false;
                        this.cancel();
                    })
                    .finally(() => {
                        clearTimeout(saveTimeout);
                        this.bsLoadingOverlayService.stop({ referenceId: 'completeWizard' });
                    });
            } else {
                this.completeWizardService.completeOrder(this.$state.params.orderId, this.$state.params.patientId)
                    .then(() => {
                        if (canceledPromise) {
                            return ;
                        }

                        this.$state.current.data.showPopupBeforeLeave = false;
                        this.cancel();
                    })
                    .finally(() => {
                        clearTimeout(saveTimeout);
                        this.bsLoadingOverlayService.stop({ referenceId: 'completeWizard' });
                    });
            }
        } else {
            touchedErrorFields(this.Form);
        }
    }

    cancel() {
        if (this.isEventComplete) {
            this.$state.go('root.calendar-appointment', { appointmentId: this.$state.params.appointmentId });
        } else {
            this.$state.go('root.orders.order.details', { orderId: this.$state.params.orderId });
        }
    }

    isNavigationShown() {
        if (this.$state.is(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step1.add`) ||
            this.$state.is(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.add`)) {
            return false;
        }
        return true;

    }

    isLastStep() {
        return this.$state.is(this.steps[this.steps.length - 1].view);
    }

    isFirstStep() {
        return this.$state.is(this.steps[0].view);
    }

    isActive(state) {
        return this.$state.is(state);
    }

    saveEquipment() {
        this.completeWizardService.saveEquipmentToOrder();
        this.goToCompletePage();
    }

    cancelEquipment() {
        this.completeWizardService.revertSelectedItems();
        this.goToCompletePage();
    }

    goToCompletePage() {
        this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step1.equipments`);
    }

    isNextBtnActive() {
        return this.isResupplyProgramEmpty() || (!this.isHaveNewDevices() && !this.isEventComplete );
    }

    isHaveNewDevices() {
        return !!this.completeWizardService.getNewItems().length;
    }

    isResupplyProgramEmpty() {
        if (this.$state.is('root.completeOrder.step2.resupply') ||
            this.$state.is('root.completeEvent.step2.resupply')) {
            return this.model.ResupplyProgramAvailable && this.model.ResupplyProgram ?
                !this.model.ResupplyProgram.Items.length :
                false;
        }

        return false;
    }
}
