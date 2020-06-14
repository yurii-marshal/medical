import reAssignLocationModalController from './modals/reAssignLocationModal.controller.es6.js';
import template from '../../views/modals/reAssignLocationModal.html';

export default class organizationLocationsController {
    constructor($state, ngToast, $mdDialog, bsLoadingOverlayService, infinityTableService, organizationLocationsService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.infinityTableService = infinityTableService;
        this.organizationLocationsService = organizationLocationsService;

        this.cacheFiltersKey = 'management-organization-locations';

        this.TotalCount = undefined;
        this.filter = {};
        this.sortExpr = {};

        this.getLocations = this._getLocations.bind(this);
    }

    _getLocations(pageIndex, pageSize) {
        return this.organizationLocationsService.getList(this.filter, this.sortExpr, pageIndex, pageSize)
            .then((response) => {
                if (_.isEmpty(this.filter)) { this.TotalCount = response.data.Count; }
                return response;
            })
            .catch((err) => this.TotalCount = undefined);
    }

    goToLocation(locationId) {
        this.$state.go('root.management.organization.locations.view', { locationId });
    }

    deleteLocation(location) {
        let locationId = location.Id;
        let locationName = location.Name;

        this.bsLoadingOverlayService.start({ referenceId: 'locationsList' });
        this.organizationLocationsService.isLocationAssigned(locationId)
            .then((response) => {
                if (response.data) {
                    reAssignLocation.call(this);
                } else {
                    deleteLocationPromise.call(this);
                }
            });

        function reAssignLocation() {
            this.bsLoadingOverlayService.stop({ referenceId: 'locationsList' });

            this.$mdDialog.show({
                template,
                controller: reAssignLocationModalController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { locationId, locationName }
            }).then((response) => {
                deleteLocationPromise.call(this);
            })
        }

        function deleteLocationPromise() {
            this.bsLoadingOverlayService.start({ referenceId: 'locationsList' });

            this.organizationLocationsService.deleteLocation(locationId)
                .then(() => this.ngToast.success('Location is deleted'))
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'locationsList' });
                    this.infinityTableService.reload();
                });
        }
    }
}
