import template from './modifiers.html';

class modifiersCtrl {
    constructor(
        $scope,
        billingDictionariesService,
        coreDictionariesService
    ) {
        'ngInject';

        this.billingDictionariesService = billingDictionariesService;
        this.coreDictionariesService = coreDictionariesService;

        $scope.$watch(() => this.data, (newVal) => {

            if (!this.data || (this.data && _.isEmpty(this.data))) {
                this.data = {
                    Level1: null,
                    Level2: null,
                    Level3: null,
                    Level4: null
                };
            }
            angular.forEach(newVal, (value, key) => {
                if (value) {
                    return;
                }
                if (key === 'Level1') {
                    this.searchModifier1 = undefined;
                }
                if (key === 'Level2') {
                    this.searchModifier2 = undefined;
                }
                if (key === 'Level3') {
                    this.searchModifier3 = undefined;
                }
                if (key === 'Level4') {
                    this.searchModifier4 = undefined;
                }
            });
        }, true);
    }

    getModifiers(Code, PageIndex) {
        // to prevent "Not found" message for md-min-length="0" and errors in console
        if (Code === undefined || Code === null) {
            Code = '';
        }

        let params = { Code };

        if (this.isServiceLineModifiers) {
            params = {
                Id: Code,
                PageIndex: PageIndex || 0,
                PageSize: 24,
                selectCount: true
            };
        }

        const promise = this.isServiceLineModifiers ?
            this.billingDictionariesService.getModifiers.bind(this.billingDictionariesService) :
            this.coreDictionariesService.getModifiers.bind(this.coreDictionariesService);

        return promise(params).then((response) => response.data);
    }

    isModifierRequired(keyName) {
        let isRequired = false, keyReached = false;

        _.forEachRight(this.data, (item, key) => {
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

    isModifierDisabled(keyName, value) {
        let isDisabled = false, keyReached = false;

        if (value) {
            return false;
        }

        angular.forEach(this.data, (item, key) => {
            if (key !== keyName && !keyReached) {
                if (!item && !isDisabled) {
                    isDisabled = true;
                }
            } else {
                keyReached = true;
            }
        });

        // if field have to be disabled - check if next fields have values
        if (isDisabled) {
            keyReached = false;
            _.forEachRight(this.data, (item, key) => {
                if (key !== keyName && !keyReached) {
                    if (item && isDisabled) {
                        isDisabled = false;
                    }
                } else {
                    keyReached = true;
                }
            });
        }
        return isDisabled;
    }

}

const modifiers = {
    bindings: {
        data: '=',
        isAllDisabled: '<?',
        isServiceLineModifiers: '<?'        // boolean (for service lines we have different endpoint
    },
    template,
    controller: modifiersCtrl
};

export default modifiers;
