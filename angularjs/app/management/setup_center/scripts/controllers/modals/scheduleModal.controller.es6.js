export default class scheduleModalController {
    constructor($scope, $mdDialog, constraint, save, deleteAction) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.constraint = constraint;
        this.save = save;
        this.deleteAction = deleteAction;

        // todo - we need to refactor this modal service, to move this code to service
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('has_modal');

        this.isEditMode = !!constraint.id;

        this.vm = {
            date: constraint.date ? '' : moment().format('MM/DD/YYYY'),
            start: constraint.start === '' ? '' : moment(constraint.start, 'YYYY-MM-DDTHH:mm').format('hh:mm A'),
            end: constraint.end === '' ? '' : moment(constraint.end, 'YYYY-MM-DDTHH:mm').format('hh:mm A'),
            id: constraint.id
        };

        if (!this.isEditMode) {
            this.vm.repeatTypeValue = '';
            this.vm.specificDates = [''];
        }else {
            this.vm.specificDates = [''];
        }

        this.vm.showDate = !!this.vm.date;

        $scope.$watch(() => this.vm.specificDates, (newVal, oldVal) => {
            if (!_.isEqual(newVal, oldVal)) { this._markAllDuplicates() };
        }, true);
    }

    addSpecificDate() {
        this.vm.specificDates.push('');
    }

    removeSpecificDate(index) {
        this.vm.specificDates.splice(index, 1);
    }

    delete() {
        this.deleteAction(this.constraint.id);
        this.$mdDialog.hide();
    }

    cancelDialog() {
        this.$mdDialog.hide();
    }

    closeDialog() {
        if (this.newScheduleForm.$invalid) {
            touchedErrorFields(this.newScheduleForm);
            return;
        }

        this.constraint.date = (this.vm.date)
            ? moment(this.vm.date, 'MM/DD/YYYY').format('YYYY-MM-DD')
            : this.constraint.date;

        this.constraint.start = this.constraint.date + 'T' + moment(this.vm.start, 'hh:mm A').format('HH:mm:ss');
        this.constraint.end = this.constraint.date + 'T' + moment(this.vm.end, 'hh:mm A').format('HH:mm:ss');
        this.constraint.repeatTypeValue = this.vm.repeatTypeValue;
        this.constraint.specificDates = this.vm.specificDates;
        this.save(this.constraint);
        this.$mdDialog.hide();
    }

    changedRepeatType(repeatType) {
        if (repeatType === 3) {
            this._markAllDuplicates();
        } else {
            this.vm.specificDates.forEach((item, key) => {
                let formField = this.newScheduleForm['specialDate_' + key];
                if (formField) { formField.$setValidity('notUnique', true); }
            });
        }
    }

    _markAllDuplicates() {
        let arrCopy = [];
        let arrDuplicates = [];

        angular.copy(this.vm.specificDates, arrCopy);

        this.vm.specificDates.forEach((item, key) => {
            arrCopy.forEach((copyItem, copyKey) => {
                if (key !== copyKey && item === copyItem) {
                    arrDuplicates.push(item);
                }
            });
        });

        this.vm.specificDates.forEach((item, key) => {
            let formField = this.newScheduleForm['specialDate_' + key];
            if (formField) {
                formField.$setValidity('notUnique', true);

                arrDuplicates.forEach((duplicate) => {
                    if (item === duplicate) {
                        formField.$setValidity('notUnique', false);
                        formField.$setTouched();
                    }
                })
            }
        });
    }
}
