export default class hospitalAdmissionModalController {
    constructor($mdDialog,
                medicalRecordsService,
                addHospitalAdmission,
                admission) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.admission = admission;
        this.medicalRecordsService = medicalRecordsService;
        this.addHospitalAdmission = addHospitalAdmission;

        this.hospitalAdmission = admission
            ? {
                Id: admission.Id,
                AdmissionDate: admission.AdmissionDate,
                DischargeDate: admission.DischargeDate,
                Hospital: {
                    Id: admission.HospitalId,
                    Name: admission.Hospital,
                    Address: {
                        FullAddress: admission.HospitalAddress
                    }
                },
                Diagnoses: _.map(admission.Diagnoses, (diagnosis) => {
                    return {
                        id: diagnosis.DiagnosisCodeId,
                        text: diagnosis.Code,
                        description: diagnosis.CodeWithDescription
                    }
                })
            }
            : {
                AdmissionDate: '',
                DischargeDate: '',
                Hospital: undefined,
                Diagnoses: []
            };

    }

    getAllHospitals(name) {
        return this.medicalRecordsService.getAllHospitals(name)
            .then((response) => response.data.Items);
    }

    getAllDiagnoses(description) {
        return this.medicalRecordsService.getAllDiagnoses(description)
            .then((response) => response.data.Items);
    }

    addAdmissionsReason(selectedAdmissionReason) {
        if (!selectedAdmissionReason) { return }

        const haveAdmissionReason = _.some(this.hospitalAdmission.Diagnoses,
            (diagnosis) => diagnosis.id === selectedAdmissionReason.id);

        if (!haveAdmissionReason) {
            this.hospitalAdmission.Diagnoses.push(selectedAdmissionReason);
            this.searchAdmissionReason = '';
        }
    }

    save() {
        if (this.hospitalForm.$valid) {
            if (this.admission) {
                this.admission.AdmissionDate = this.hospitalAdmission.AdmissionDate;
                this.admission.DischargeDate = this.hospitalAdmission.DischargeDate;
                this.admission.HospitalId = this.hospitalAdmission.Hospital.Id;
                this.admission.Hospital = this.hospitalAdmission.Hospital.Name;
                this.admission.HospitalAddress = this.hospitalAdmission.Hospital.Address.FullAddress;
                this.admission.Diagnoses = _.map(this.hospitalAdmission.Diagnoses, (diagnosis) => {
                    return {
                        DiagnosisCodeId: diagnosis.id,
                        Code: diagnosis.text,
                        CodeWithDescription: diagnosis.description
                    };
                });
            } else {
                this.admission = {
                    AdmissionDate: this.hospitalAdmission.AdmissionDate,
                    DischargeDate: this.hospitalAdmission.DischargeDate,
                    HospitalId: this.hospitalAdmission.Hospital.Id,
                    Hospital: this.hospitalAdmission.Hospital.Name,
                    HospitalAddress: this.hospitalAdmission.Hospital.Address.FullAddress,
                    Diagnoses: _.map(this.hospitalAdmission.Diagnoses, (diagnosis) => {
                        return {
                            DiagnosisCodeId: diagnosis.id,
                            Code: diagnosis.text,
                            CodeWithDescription: diagnosis.description
                        };
                    })
                };
                this.addHospitalAdmission(this.admission);
            }
            this.$mdDialog.hide();
        } else {
            touchedErrorFields(this.hospitalForm);
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
