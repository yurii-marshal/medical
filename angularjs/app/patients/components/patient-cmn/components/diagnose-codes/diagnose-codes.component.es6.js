import template from './diagnose-codes.html';

class diagnoseCodesCtrl {
    constructor(medicalRecordsService) {
        'ngInject';

        this.medicalRecordsService = medicalRecordsService;
        this.searchDiagnosis1 = undefined; // assigned to undefined for activating autocomplete
    }

    getDiagnosis(codeWithDescription, pageIndex) {
        return this.medicalRecordsService.getAllDiagnoses(codeWithDescription, 100, pageIndex)
            .then((res) => {
                res.data.Items = _.filter(res.data.Items, (item) => {
                    return !this.hasValueInObj(this.codes, item.id);
                });
                return res;
            });
    }

    hasValueInObj(obj, val) {
        for (let key in obj) {
            if (obj[key] && (obj[key].id.toString() === val.toString())) {
                return true;
            }
        }
    }

    isDiagnoseRequired(keyName) {
        let isRequired = false, keyReached = false;

        if (keyName.indexOf('1') !== -1) {
            return true;
        }

        _.forEachRight(this.codes, (item, key) => {
            if (key !== keyName && !keyReached) {
                if (item && !isRequired) {
                    isRequired = true;
                }
            } else {
                keyReached = true;
            }
        });

        return isRequired;
    }

}

const diagnoseCodes = {
    bindings: {
        codes: '='
    },
    template,
    controller: diagnoseCodesCtrl
};

export default diagnoseCodes;

