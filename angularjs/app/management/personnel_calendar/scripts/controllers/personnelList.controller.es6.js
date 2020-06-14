export default class personnelListController {
    constructor(
        $state,
        $mdDialog,
        ngToast,
        infinityTableService,
        infinityTableFilterService,
        personnelListService,
        profileService,
        corePersonnelService
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.infinityTableFilterService = infinityTableFilterService;
        this.personnelListService = personnelListService;
        this.corePersonnelService = corePersonnelService;
        this.profileService = profileService;
        this.role = {};
        this.profile = {};

        this.cacheFiltersKey = 'management-personnel';

        this.sortExpr = {};
        this.filter = {};

        this.getServiceCentersPromise = (pageIndex, pageSize) => {
            const sortExpression = this.infinityTableFilterService.getSortExpressions(this.sortExpr);
            let params = this.infinityTableFilterService.getFilters(this.filter);

            params = angular.merge(params, { sortExpression, pageIndex, pageSize });

            return this.corePersonnelService.getList(params);
        };

        this.activate();
    }
    activate() {
        this.profileService.getProfilePromise()
            .then((res) => {
                this.profile = res.data;
            });
    }

    delete(item) {
        if (this.profile.Email === item.Email) {
            this.ngToast.danger(`You cannot delete your own account`);
            return;
        }

        this.corePersonnelService.deleteById(item.Id)
            .then(() => {
                this.ngToast.success('Team member is deleted');
                this.infinityTableService.deleteRowById(item.guid);
            });
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        item.show = !item.show;
        this.personnelListService.getRolesByUserId(item.UserId)
            .then((response) => item.Roles = response.data);
    }

    editPersonnel(personnelId) {
        this.$state.go('root.management.personnel_edit', { personnelId });
    }

}
