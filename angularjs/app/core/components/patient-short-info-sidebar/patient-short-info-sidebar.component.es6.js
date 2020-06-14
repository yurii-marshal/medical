import {
    orderStatusConstants,
    patientStatusConstants
} from '../../constants/core.constants.es6.js';
import { addTagClass } from '../../helpers/map-tags.helper.es6';
import { mapPatientStatusClass } from '../../helpers/map-patient-css-classes.helper.es6';

// EditPatientAttrs Modal
import EditPatientAttrsTemplate from './modals/edit-patient-attrs/edit-patient-attrs.html';
import EditPatientAttrsCtrl from './modals/edit-patient-attrs/edit-patient-attrs.controller.es6';

class patientShortInfoSidebarCtrl {
    constructor(
        $scope,
        $state,
        $q,
        $mdDialog,
        bsLoadingOverlayService,
        patientShortInfoService,
        patientsService,
        corePatientService
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.$q = $q;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientShortInfoService = patientShortInfoService;
        this.patientsService = patientsService;
        this.corePatientService = corePatientService;
        this.haveToggleBtn = this.haveToggleBtn === undefined || this.haveToggleBtn;

        this.patient = {};

        $scope.$on('patientUpdated', () => this._activate());

        let patientActivateUnwatch = $scope.$watch(() => this.patientId, () => {
            if (this.patientId) {
                this._activate();
                patientActivateUnwatch();
            }
        });
    }

    _activate() {
        const pageIndex = 0,
            pageSize = 100,
            params = {
                status: [
                    orderStatusConstants.NEW_ORDER_ID,
                    orderStatusConstants.IN_PROGRESS_ORDER_ID
                ]
            };

        let promises = [
            this.patientShortInfoService.getShortInfo(this.patientId),
            this.patientsService.getOrdersDictionary(this.patientId, pageIndex, pageSize, params),
            this.corePatientService.getPatientTags(this.patientId),
            this.corePatientService.getPatientInfoById(this.patientId)
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'patientSidebar' });
        return this.$q.all(promises)
            .then((responses) => {
                this.patient = responses[0].data;

                this.patient.RecentAppointments.map((item) => {
                    item.statusClass = `${item.AppointmentStatus.Text.toLowerCase()}-appointment`;
                    return item;
                });
                this.patient.Status.statusClass = mapPatientStatusClass(this.patient.Status.Id);
                this.patient.ActiveOrders = responses[1].data.Items;

                this.patient.Tags = responses[2].data;
                if (this.patient.Tags.length) {
                    this.patient.Tags.map((tag) => {
                        tag.attrClass = addTagClass(tag.Name);
                        return tag;
                    });
                }

                if (+this.patient.Status.Id === patientStatusConstants.INACTIVE_STATUS_ID) {
                    this.patient.InactiveStatus = responses[3].data.InactiveStatus;
                    this.patient.DcDate = responses[3].data.DcDate ?
                        moment(responses[3].data.DcDate).format('YYYY-MM-DD') :
                        null;
                }
                this.patient.MedSageEnrolled = responses[3].data.MedSageEnrolled;
                this.patient.CanBeEnrolledToMedSage = responses[3].data.CanBeEnrolledToMedSage;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientSidebar' }));
    }

    formatAppointment(dateRange) {
        let from = dateRange.From;
        let to = dateRange.To;

        if (moment(from).format('MM/DD/YYYY') === moment(to).format('MM/DD/YYYY')) {
            return moment(from).format('MM/DD/YYYY');
        }
        return `${moment(from).format('MM/DD/YYYY')} - ${ moment(to).format('MM/DD/YYYY')}`;
    }

    editPatientStatus() {
        this.$mdDialog.show({
            controller: EditPatientAttrsCtrl,
            controllerAs: '$ctrl',
            template: EditPatientAttrsTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                patient: angular.copy(this.patient), // prevent changes on current view
                patientTags: angular.copy(this.patient.Tags),
                patientId: this.patientId
            }
        })
        .then(() => {
            this._activate();
        });
    }
}


const patientShortInfoSidebar = {
    bindings: {
        patientId: '<',
        patient: '=?',
        haveViewPatientBtn: '<?',
        haveToggleBtn: '<?'
    },
    templateUrl: 'core/components/patient-short-info-sidebar/patient-short-info-sidebar.html',
    controller: patientShortInfoSidebarCtrl
};

export default patientShortInfoSidebar;
