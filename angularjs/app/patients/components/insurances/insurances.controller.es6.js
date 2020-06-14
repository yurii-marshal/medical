// Modal Controllers
import changePriorityModalController from '../../../core/modals/insurance-change-priority/insurance-change-priority.controller.es6.js';

// Modal Templates
import changePriorityModalTemplate from '../../../core/modals/insurance-change-priority/insurance-change-priority.html';

export default class insurancesController {
    constructor($scope, $rootScope, $state, $mdDialog, patientInsurancesService) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$mdDialog = $mdDialog;

        this.patientId = $state.params.patientId;

        patientInsurancesService.clearModel();
        this.model = patientInsurancesService.getModel();

        $scope.$on('$stateChangeSuccess', () => {
            if ($state.current.name === ('root.patient.insurances')) {
                $state.go('root.patient.insurances.insurances-list',
                    { view: 'insurances-list' }
                );
            }
        });
    }

    isChangePriorityVisible() {
        return this.$state.is('root.patient.insurances.insurances-list');
    }

    isActive(view) {
        return this.$state.current.name.indexOf(view) !== -1;
    }

    // TODO move to repository
    changePriority() {
        this.$mdDialog.show({
            template: changePriorityModalTemplate,
            controller: changePriorityModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                insurances: this.model.activeInsurances,
                invoiceId: undefined
            }
        }).then(() => this.$rootScope.$broadcast('insurancesUpdated'));
    }

}
