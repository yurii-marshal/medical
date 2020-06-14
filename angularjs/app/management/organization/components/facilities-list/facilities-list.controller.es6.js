export default class FacilitiesListCtrl {
    constructor(
        $state,
        bsLoadingOverlayService,
        infinityTableFilterService,
        infinityTableService,
        organizationsFacilityService,
        facilityService
    ) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.infinityTableFilterService = infinityTableFilterService;
        this.organizationsFacilityService = organizationsFacilityService;
        this.infinityTableService = infinityTableService;
        this.facilityService = facilityService;

        this.filters = {};
        this.sortExpr = {};
        this.locationsLoaded = false;

        this.getFacilities = this._getFacilities.bind(this);
    }

    _getFacilities(pageIndex, pageSize) {
        const filters = this.infinityTableFilterService.getFilters(this.filters);
        const params = Object.assign(filters, {
            sortExpression: this.infinityTableFilterService.getSortExpressions(this.sortExpr),
            pageIndex,
            pageSize,
            selectCount: true
        });

        return this.organizationsFacilityService.getFacilities(params)
            .then((res) => this.facilityService.mapFacilities(res));
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        item.visible = !item.visible;

        if (item.visible) {
            if (!item.Locations || !item.Locations.length) {
                this.bsLoadingOverlayService.start({ referenceId: `facilityLocations${item.Id}` });
                this.organizationsFacilityService.getFacilityLocations(item.Id)
                    .then((res) => {
                        item.Locations = this.facilityService.mapLocations(res.data, true);
                    })
                    .finally(() => {
                        this.bsLoadingOverlayService.stop({ referenceId: `facilityLocations${item.Id}` });
                        item.locationsLoaded = true;
                    });
            } else {
                item.locationsLoaded = true;
            }
        }
    }

    editFacility($event, facilityId) {
        $event.stopPropagation();
        this.$state.go('root.management.organization.facilities.edit', { facilityId });
    }

    deleteFacility(itemId) {
        this.bsLoadingOverlayService.start({ referenceId: 'facilitiesList' });
        this.organizationsFacilityService.deleteFacility(itemId)
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'facilitiesList' });
                this.infinityTableService.reload();
            });
    }
}
