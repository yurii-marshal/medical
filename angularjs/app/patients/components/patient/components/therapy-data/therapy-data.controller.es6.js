import changeComplianceDateTpl from './modals/change-compliance-date/change-compliance-date.html';
import changeComplianceDateCtrl from './modals/change-compliance-date/change-compliance-date.controller';

export default class TherapyDataCtrl {
    constructor(
        $state,
        $filter,
        bsLoadingOverlayService,
        therapyDataService,
        $mdDialog
    ) {
        'ngInject';

        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.therapyDataService = therapyDataService;

        this.patientId = $state.params.patientId;
        this.chosenDeviceId = $state.params.deviceId;
        this.$mdDialog = $mdDialog;

        this.devices = [];
        this.therapy = {};
        this.isTherapyLoaded = false;

        this.therapiesTypes = {
            'Respironics': '1',
            'Resmed': '2'
        };

        this.getDevices();
    }

    getDevices() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientTherapy' });
        this.therapyDataService.getDevices(this.patientId)
            .then((response) => {
                const devicesListLength = response.data && response.data.length;

                this.devices = response.data;

                if (!this.isTherapyLoaded) {
                    if (this.chosenDeviceId) {
                        this.getTherapy(this.chosenDeviceId);
                    } else if (devicesListLength === 1) {
                        this.device = response.data[0];
                        this.getTherapy(this.device.Id);
                    }
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientTherapy' }));
    }

    hasMetData() {

        if (_.has(this.therapy, 'Met')) {
            return this.therapy.Met.IsMet || !this.therapy.Met.InProgress;
        }

        return false;
    }

    getTherapy(deviceId) {
        if (!deviceId) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'patientTherapy' });
        this.therapyDataService.getTherapy(deviceId)
            .then((response) => {
                this.therapy = response.data;
                this.therapy = this._mapTherapyData(this.therapy);

                this.isTherapyLoaded = true;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientTherapy' }));
    }

    getReport() {
        const params = {
            From: this.therapy.DataUsage.Period.From,
            To: this.therapy.DataUsage.Period.To
        };

        this.therapyDataService.getReport(
            this.patientId,
            this.device.Id,
            params
        );
    }

    changeComplianceDate() {
        this.$mdDialog.show({
            template: changeComplianceDateTpl,
            controller: changeComplianceDateCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                date: moment(this.device.StartDate).format('MM/DD/YYYY'),
                registeredDate: this.therapy.RegisteredDate
            }
        })
        .then((response) => {
            this.therapyDataService.updateTherapy(this.patientId, this.device.Id, response).then(() => {
                this.getTherapy(this.device.Id);
            });
        });
    }

    _mapTherapyData(data) {
        let dataCopy = angular.copy(data);
        const keyArr = [
            'UsageHoursTotalInSeconds',
            'AverageUsageTotalDaysInSeconds',
            'AverageUsageDaysUsedInSeconds',
            'MedianUsageDaysUsedInSeconds'
        ];

        keyArr.forEach((key) => {
            dataCopy.DataUsage[key] = this.$filter('fullTimeFormat')(dataCopy.DataUsage[key]);
        });

        dataCopy.Therapy.LargeLeakInSeconds = this.$filter('fullTimeFormat')(dataCopy.Therapy.LargeLeakInSeconds);
        dataCopy.Therapy.PeriodicBreathingInSeconds = this.$filter('fullTimeFormat')(dataCopy.Therapy.PeriodicBreathingInSeconds);

        return dataCopy;
    }
}

