import addAuthorizationTemplate from '../../../../shared/modals/add-authorization/add-authorization.html';
import AddAuthorizationCtrl from '../../../../shared/modals/add-authorization/add-authorization.controller.es6';

export default class AuthorizationsListCtrl {
    constructor($state, $rootScope, $mdDialog, bsLoadingOverlayService, patientAuthorizationService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientAuthorizationService = patientAuthorizationService;

        this.patientId = $state.params.patientId;

        this.authorizationItems = [];

        this.isActiveItems = true;

        this.loadingItems = false;

        $rootScope.$on('authorizationListUpdate', this.getAuthorizations.bind(this));

        this.getAuthorizations();
    }

    getAuthorizations() {
        if (this.isActiveItems) {
            return this.getAuthorizationsActive();
        }
        return this.getAuthorizationsHistory();
    }

    getAuthorizationsHistory() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        return this.patientAuthorizationService.getHistoryList(this.patientId)
            .then((response) => {
                this.authorizationItems = response.data.Items;
            })
            .finally( () => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    getAuthorizationsActive() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        return this.patientAuthorizationService.getList(this.patientId)
            .then((response) => {
                this.authorizationItems = response.data.Items;
            })
            .finally( () => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    changeStatus() {
        this.isActiveItems = !this.isActiveItems;

        this.loadingItems = true;

        this.getAuthorizations().then(() => {
            this.loadingItems = false;
        });
    }

    edit($event, item) {
        this.$mdDialog.show({
            template: addAuthorizationTemplate,
            targetEvent: $event,
            controller: AddAuthorizationCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                authorizationId: item.Id
            }
        });
    }

    deleteAuthorization(Id) {
        _.remove(this.authorizationItems, (item) => item.Id === Id);
        this.patientAuthorizationService.deleteById(this.patientId, Id);
    }
}
