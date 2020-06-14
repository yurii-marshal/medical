export default class copyController {
    constructor($scope,
                $rootScope,
                $state,
                $mdDialog,
                copyClearService,
                idForAction,
                calendarActionType,
                splitInnerEvents) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.copyClearService = copyClearService;
        this.idForAction = idForAction;
        this.calendarActionType = calendarActionType;
        this.splitInnerEvents = splitInnerEvents;

        this.typeOfAction = 0;
        this.skip = '';
        this.take = '';
        this.repeat = '';
        this.copyDaysList = [''];
        this.includeInnerEvents = false;
        this.includeInnerBreaks = false;
        this.includeExtraTimes = false;
        this.actionDisabled = false;

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('has_modal');

        $scope.$watch(() => this.typeOfAction, (newValue) => {
            if (!newValue) { return; }

            if (newValue !== 4) { this.skip = this.take = this.repeat = ''; }
            if (newValue !== 3) { this.copyDaysList = ['']; }
        }, true);

        $scope.$watch(() => this.copyDaysList, (newVal, oldVal) => {
            if (!_.isEqual(newVal, oldVal)) { this._markAllDuplicates() };
        }, true);
    }

    addDayItem() {
        for (let i = this.copyDaysList.length; i--; ){
            if (this.copyDaysList[i] === '') { return false; }
        }

        this.copyDaysList.push('');
    }

    removeDayItem(index) {
        this.copyDaysList.splice(index, 1);
    }

    copySchedule(agendaType) {
        if (this.copyForm.$invalid) {
            touchedErrorFields(this.copyForm);
            return;
        }

        let model = {};

        if (this.splitInnerEvents) {
            model.IncludeInnerBreaks = this.includeInnerBreaks;
            model.IncludeExtraTimes = this.includeExtraTimes;
        } else {
            model.IncludeInnerBreaks = this.includeInnerEvents;
        }

        if (agendaType === 'day') {
            model.Type = 1;

            model.DaySettings = {
                Type: this.typeOfAction,
                Date: this.$state.params.date
                    ? moment(this.$state.params.date).format('YYYY-MM-DDTHH:mm:ss')
                    : moment().format('YYYY-MM-DDTHH:mm:ss')
            };

            if (this.typeOfAction === 4) {
                model.DaySettings.Custom = {
                    Skip: this.skip,
                    Take: this.take,
                    Repeat: this.repeat
                }
            }
            if (this.typeOfAction === 3) {
                for (let i = this.copyDaysList.length; i--; ){
                    if (this.copyDaysList[i] === '') { this.copyDaysList.splice(i, 1); }
                }
                model.DaySettings.SelectedDays = this.copyDaysList;
            }
        } else {
            model.Type = 2;

            model.WeekSettings = {
                Type: this.typeOfAction,
                FromDate: this.$state.params.date
                    ? moment(this.$state.params.date).format('YYYY-MM-DDTHH:mm:ss')
                    : moment().format('YYYY-MM-DDTHH:mm:ss')
            };

            if (this.typeOfAction === 3) {
                model.WeekSettings.Custom = {
                    Skip: this.skip,
                    Take: this.take,
                    Repeat: this.repeat
                }
            }
        }

        this.copyClearService.copySchedule(model, this.calendarActionType, this.idForAction)
            .then(() => {
                this.$rootScope.$broadcast('fullCalendar.reload', 'true');
                this.$mdDialog.hide();
            });
    }

    _markAllDuplicates() {
        let arrCopy = [];
        let arrDuplicates = [];

        angular.copy(this.copyDaysList, arrCopy);

        this.copyDaysList.forEach((item, key) => {
            arrCopy.forEach((copyItem, copyKey) => {
                if (key !== copyKey && item === copyItem) { arrDuplicates.push(item); }
            });
        });

        this.copyDaysList.forEach((item, key) => {
            let formField = this.copyForm['specialDate_' + key];
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

    closeDialog() {
        this.$mdDialog.hide();
    }
}
