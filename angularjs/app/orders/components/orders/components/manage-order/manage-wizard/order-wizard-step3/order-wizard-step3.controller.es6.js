export default class orderWizardStep3Controller {
    constructor(orderWizardService) {
        'ngInject';

        this.model = orderWizardService.getModel();
        this.newDiagnosis = this.model.diagnosis.filter((diagnose) => diagnose.IsNew);

        const diagnosisFilter = (itemDiagnose) => {

            if (!itemDiagnose) {
                return false;
            }

            return this.model.diagnosis.find((diagnose) => diagnose.Code === itemDiagnose.Code);
        };

        this.model.newItems.forEach((item) => {
            if (!item.Bundle) {
                item.Diagnosis = item.Diagnosis.filter(diagnosisFilter);
            } else {
                item.Components.forEach((component) => {
                    component.Diagnosis = component.Diagnosis.filter(diagnosisFilter);
                });
            }
        });
    }
}

