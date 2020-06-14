export default class RegisterDeviceModalCtrl {
    constructor($mdDialog,
                $q,
                bsLoadingOverlayService,
                ngToast,
                patientsService,
                patientId) {
        'ngInject';

        this.$q = $q;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientsService = patientsService;
        this.patientId = patientId;

        this.deviceList = [];
        this.regModel = {
            device: null,
            monitoringStartDate: null
        };

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'registerDevice' });
        this._getPatientDevices()
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'registerDevice' }));
    }

    _getPatientDevices() {
        return this.patientsService.getDevicesForRegistration(this.patientId)
            .then((response) => this.deviceList = response);
    }

    close() {
        this.$mdDialog.cancel();
    }

    save() {
        this.bsLoadingOverlayService.start({ referenceId: 'registerDevice' });
        this.patientsService.registerDevice(this.regModel, this.patientId)
            .then(() => {
                this.ngToast.success('The device has been registered.');
                this.close();
            })
            .catch(() => this.ngToast.danger('The device has not been registered.'))
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'registerDevice' }));
    }
}
