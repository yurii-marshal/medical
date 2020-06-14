import template from './prescription-items.html';

class prescriptionItemsCtrl {
    constructor($scope) {
        'ngInject';

        const LENGTH_OF_NEED_LIMIT = 99;

        this.modelLengthOfNeed = '';

        this.modelDiagnosis = [];

        let watchItemsUnsubscribe = $scope.$watch(() => this.items, (newVal) => {
            if (!newVal) {
                return;
            }

            newVal.forEach((item) => {
                if (!item.Bundle && !item.LengthOfNeed) {
                    item.LengthOfNeed = LENGTH_OF_NEED_LIMIT;
                } else if (item.Bundle) {
                    item.Components.map((component) => {
                        if (!component.LengthOfNeed) {
                            return this._mapComponentsLengthOfNeed(component, item.ComponentsLengthOfNeed, LENGTH_OF_NEED_LIMIT);
                        }
                        return component;
                    });
                }
            });

            watchItemsUnsubscribe();

        }, true);
    }

    getPatientDiagnosis(selectedDiagnosis) {
        return this.patientDiagnosis.filter((patientDiagnose) => {
            return !selectedDiagnosis.find((selectedDiagnose) => patientDiagnose.Code === (selectedDiagnose && selectedDiagnose.Code));
        });
    }

    isItemExpired(item) {
        return moment(this.getExpirationDate(item)).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
    }

    getExpirationDate(item) {
        let minLengthOfNeed = item.LengthOfNeed || 99;

        if (item.Bundle) {
            item.Components.forEach((component) => {
                if (component.LengthOfNeed < minLengthOfNeed) {
                    minLengthOfNeed = component.LengthOfNeed;
                }
            });
        }

        if (+minLengthOfNeed === 99) {
            return 'lifetime';
        }

        if (this.effectiveDate) {
            return moment(this.effectiveDate).add(minLengthOfNeed, 'months').format('MM/DD/YYYY');
        }

        return moment().add(minLengthOfNeed, 'months').format('MM/DD/YYYY');
    }

    applyModelLengthOfNeed() {
        angular.forEach(this.items, (item) => {
            if (!item.Bundle) {
                item.LengthOfNeed = this.modelLengthOfNeed;
            } else {
                item.Components.map((component) => {
                    component.LengthOfNeed = this.modelLengthOfNeed;
                    return component;
                });
            }
        });
    }

    _mapComponentsLengthOfNeed(component, componentsLengthOfNeed, limitVal) {
        const componentLengthOfNeed = _.find(componentsLengthOfNeed, { ProductId: component.Id });

        component.LengthOfNeed = componentLengthOfNeed ? componentLengthOfNeed.LengthOfNeed : limitVal;

        return component;
    }

    isApplyDiagnosisToAllDisabled() {
        return !this.modelDiagnosis.filter((diagnose) => !!diagnose).length;
    }

    applyDiagnosisToAll() {
        angular.forEach(this.items, (item) => {
            if (item.Bundle) {
                item.Components.forEach((component) => {
                    component.Diagnosis = angular.copy(this.modelDiagnosis);
                });
            } else {
                item.Diagnosis = angular.copy(this.modelDiagnosis);
            }
        });
    }

}

const prescriptionItems = {
    transclude: true,
    bindings: {
        items: '=',
        deleteItem: '=',
        addBtn: '=?',
        effectiveDate: '=',
        prescriptionItemsTitle: '@',
        patientDiagnosis: '=?',
        disableDiagnosis: '=?',
        disableLengthOfNeed: '=?'
    },
    template,
    controller: prescriptionItemsCtrl
};

export default prescriptionItems;
