import template from './item-diagnosis.html';

class ItemDiagnosisCtrl {
    constructor() {
        'ngInject';
    }

    getPatientDiagnosis(selectedDiagnosis) {
        return this.allDiagnosis.filter((diagnose) => {
            return !selectedDiagnosis.find((selectedDiagnose) => diagnose.Code === (selectedDiagnose && selectedDiagnose.Code));
        });
    }

    isDiagnoseRequire(diagnoseNumber) {
        let status = false;

        if (this.disabledValidation) {
            return false;
        }

        for (let i = diagnoseNumber; i <= 4; i++) {

            if (this.patientDiagnosis[i]) {
                status = true;
                break;
            }
        }

        return status;
    }
}

const itemDiagnosis = {
    bindings: {
        patientDiagnosis: '=',
        allDiagnosis: '=',
        disabledValidation: '=?'
    },
    template,
    controller: ItemDiagnosisCtrl
};

export default itemDiagnosis;
