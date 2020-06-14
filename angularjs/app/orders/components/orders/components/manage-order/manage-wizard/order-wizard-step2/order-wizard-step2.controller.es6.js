export default class orderWizardStep2Controller {
    constructor($mdDialog, orderWizardService, ngToast) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.orderWizardService = orderWizardService;
        this.model = orderWizardService.getModel();

        this._activate();
    }

    _activate() {
        if (this.model.patient && this.model.patient.Id) {
            this._getHospitalAdmissions();
        }
    }

    _getHospitalAdmissions() {
        if (this.model.admissions.length === 0) {
            this.orderWizardService.getHospitalAdmissions(this.model.patient.Id)
                .then((response) => {
                    this.model.admissions = response.data.Items;
                });
        }
    }

    addHospitalAdmission(admission) {
        this.model.admissions.push(admission);
    }

    getHospitals(name) {
        return this.orderWizardService.getHospitals(name)
            .then((response) => response.data.Items);
    }

    getDiagnosis(name) {
        return this.orderWizardService.getAllDiagnosis(name)
            .then((response) => response.data.Items);
    }

    getMedications(name) {
        return this.orderWizardService.getMedications(name)
            .then((response) => response.data.Items);
    }

    addAdmission($event, admission) {
        this.$mdDialog.show({
            controller: 'hospitalAdmissionModalController',
            controllerAs: 'modal',
            templateUrl: 'core/views/templates/addHospitalAdmission.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            locals: {
                addHospitalAdmission: this.addHospitalAdmission.bind(this),
                admission: admission || undefined
            }
        });
    }

    deleteAdmission(index) {
        this.model.admissions.splice(index, 1);
    }

    hospitalDischargeChanged() {
        if (this.model.hospitalDischarge.hospital && this.model.hospitalDischarge.hospital.Id) {
            this.model.hospitalDischarge.hospitalAddress = this.model.hospitalDischarge.hospital.Address.FullAddress;
            this.model.hospitalDischarge.hospitalContact = this.model.hospitalDischarge.hospital.Contact.Phone;
        } else {
            this.model.hospitalDischarge.hospitalAddress = '';
            this.model.hospitalDischarge.hospitalContact = '';
        }
    }

    addDiagnose(diagnose) {
        let haveDiagnose = this.model.diagnosis.some((o) => o.Id === diagnose.Id);

        if (!haveDiagnose) {
            this.model.diagnosis.unshift({
                Text: diagnose.Text,
                Description: diagnose.Description.replace(`${diagnose.Text} - `, ''),
                Id: diagnose.Id,
                Code: diagnose.Code,
                IsNew: true
            });

            this.diagnose = '';
        } else {
            this.ngToast.danger('Selected diagnosis has already been added.');
        }
    }

    addMedication(medication) {
        let haveMedication = this.model.medications.some((o) => o.id === medication.id);

        if (!haveMedication) {
            medication.AdditionDate = moment().format('MM/DD/YYYY');
            this.model.medications.unshift(medication);
            this.medication = '';
        } else {
            this.ngToast.danger('Selected medication has already been added.');
        }
    }

    _checkDuplicates(item, list) {
        let existItems = _.filter(list, (i) => i.id === item.id);

        if (existItems.length > 1) {
            let index = _.findIndex(list, { id: item.id });

            list.splice(index, 1);
        }
    }

}
