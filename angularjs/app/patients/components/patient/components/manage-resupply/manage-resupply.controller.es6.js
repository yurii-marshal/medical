import saveConfirmTemplate from './modals/save-confirm/save-confirm.html';
import saveConfirmController from './modals/save-confirm/save-confirm.controller.es6';

export default class ManageResupplyController {
    constructor(
        $scope,
        $state,
        bsLoadingOverlayService,
        patientResupplyService,
        $q,
        $mdDialog) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientResupplyService = patientResupplyService;
        this.$q = $q;
        this.patientId = $state.params.patientId;
        this.hasResupplyProgram = undefined;
        this.searchItemsRoot = 'root.manage-resupply.add';
        this.currentSelectedItems = [];
        this.$mdDialog = $mdDialog;

        this.model = {
            DeliveryGroupingDays: undefined,
            Items: [],
            groupItemsForDelivery: false,
            ConfirmationRequired: false,
            Hold: false
        };
        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this._checkState();
        this._activate();
    }

    _checkState() {
        if (this.$state.is('root.manage-resupply')) {
            this.$state.go('root.manage-resupply.view');
        }
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'resupplyProgram' });

        this.patientResupplyService.getResupplyProgramByPatientId(this.patientId).then((response) => {

            if (response) {
                this.hasResupplyProgram = !!response.data.Items;
                // If we add new resupply program we load ConfirmationRequired from url getRestriction
                if (!this.hasResupplyProgram) {

                    this.patientResupplyService.getRestriction(this.patientId).then((res) => {
                        if (res.data.ResupplyModel) {
                            this.model.ConfirmationRequired = res.data.ResupplyModel.ResuplyRequiredForDelivery || false;
                        }
                    });
                }

                if (response.data.Items) {
                    this.model = response.data;
                    this.model.groupItemsForDelivery = this.model.DeliveryGroupingDays > 0;
                    response.data.Items.map((item) => {
                        item.NextScheduledDate = moment(item.NextScheduledDate).format('MM/DD/YYYY');
                        item.NextEligibleDate = moment(item.NextEligibleDate).format('MM/DD/YYYY');
                        item.HcpcsCodes = item.Product.HcpcsCodes;
                        item.ProductId = item.Product.Id;
                    });
                }
            }


        }).finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'resupplyProgram' }));

    }

    goToPatient() {
        this.$state.go('root.patient.resupply', { patientId: this.patientId });
    }

    cancel() {
        this.$state.go('root.patient.resupply', { patientId: this.patientId });
    }

    cancelItems() {
        angular.copy(this.currentSelectedItems, this.model.Items);
        this.$state.go('root.manage-resupply.view');
    }

    saveItems() {
        const promises = [];

        this.$state.go('root.manage-resupply.view');
        if (this.model.Hold) {
            this.model.Items.map((item) => item.Hold = this.model.Hold);
        }

        this.model.Items.map((item) => {
            const primaryHcpcsCode = angular.isArray(item.HcpcsCodes) ? item.Product.HcpcsCodes[0] : item.HcpcsCodes.Primary,
                promise = this.patientResupplyService.getResupplyFrequency(this.patientId, primaryHcpcsCode);

            if (!item.Frequency) {
                item.Frequency = {};
            }

            if (!item.Frequency.Frequency) {
                promises.push(promise);

                promise.then((response) => {
                    if (response.data) {
                        const rule = {
                            'HcpcsCodes': [primaryHcpcsCode],
                            'Frequency': response.data.Frequency,
                            'PeriodType': { Id: response.data.PeriodType },
                            'PeriodValue': response.data.Period,
                            'Quantity': response.data.Quantity
                        };

                        item.Frequency.Frequency = response.data.Frequency;
                        item.Frequency.PeriodValue = response.data.Period;
                        item.Frequency.PeriodType = { Id: response.data.PeriodType };
                        item.Frequency.Quantity = response.data.Quantity;

                        this.patientResupplyService.calcNextSchedule(item, true);

                        if (this.model.ResupplyRules) {
                            this.model.ResupplyRules.push(rule);
                        } else {
                            this.model.ResupplyRules = [rule];
                        }

                    }
                });
            }
        });

        this.$q.all(promises).then(() => {
            this.patientResupplyService.setUpProgramDates(this.model.Items.filter((item) => item.IsNew && !item.RecentDeliveryDate), this.patientId);
        });
    }

    checkItemsByRules() {
        let isValidAllItems = true;

        if (this.model.ResupplyRules) {

            this.model.Items.forEach((item) => {
                this.model.ResupplyRules.forEach((ruleItem) => {
                    let result = _.intersection(item.Product.HcpcsCodes, ruleItem.HcpcsCodes);

                    if ((result.length || ruleItem.All) && isValidAllItems) {
                        isValidAllItems = this.patientResupplyService.calcItemPerDay(item) <= this.patientResupplyService.calcItemPerDay({ 'Frequency': ruleItem });
                    }

                });

            });
        }

        return isValidAllItems;
    }

    beforeSave() {

        if (this.Form.$invalid) {
            touchedErrorFields(this.Form);
            return false;
        }

        if (this.patientResupplyService.checkItemsByRules(this.model.Items, this.model.ResupplyRules)) {
            this.save();
        } else {
            this.$mdDialog.show({
                template: saveConfirmTemplate,
                controller: saveConfirmController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { }
            })
                .then(() => {
                    this.save();
                });
        }

    }
    save() {
        this.bsLoadingOverlayService.start({ referenceId: 'resupplyProgram' });

        this.patientResupplyService.updateResupplyProgram(this.patientId, this.model)
                .then(() => this.cancel())
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'resupplyProgram' }));
    }

}

