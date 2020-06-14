import { transformAddress } from '../../../core/helpers/transform-address.helper.es6';

export default class demographicsController {
    constructor(
        $state,
        $scope,
        bsLoadingOverlayService,
        corePatientService
    ) {
        'ngInject';

        this.$state = $state;
        this.patientId = $state.params.patientId;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.corePatientService = corePatientService;

        this.patientInfo = {};

        $scope.$on('patientUpdated', () => this._activate());

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        this.corePatientService.getPatientInfoById(this.patientId)
            .then((response) => this.patientInfo = response.data)
            .then(() => {
                this.patientInfo.DcDate = this.patientInfo.DcDate ?
                    moment(this.patientInfo.DcDate).format('MM/DD/YYYY') :
                    '';
                this.patientInfo.LocationFullName = `${this.patientInfo.Location.Text} (${this.patientInfo.Location.Npi})`;

                if (this.patientInfo.Facility) {
                    this.patientInfo.FacilityLocation.FullAddress = transformAddress(this.patientInfo.FacilityLocation.Address);
                }

                this.setPatientAge();
                this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' });
            });
    }

    setPatientAge() {
        this.patientAge = moment().diff(moment(this.patientInfo.DateOfBirthday, 'YYYY-MM-DD'), 'years');
    }

    editPatient() {
        this.$state.go('root.patients.edit.step1', { patientId: this.patientId });
    }
}
