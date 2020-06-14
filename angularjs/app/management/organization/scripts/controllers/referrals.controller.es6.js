export default class referralsController {
    constructor($state, ngToast, infinityTableService, referralsService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.referralsService = referralsService;

        this.cacheFiltersKey = 'management-referrals-list';

        this.filter = {};
        this.sortExpr = {};

        this.getReferrals = (pageIndex, pageSize) => {
            return referralsService.getReferralList(this.filter, this.sortExpr, pageIndex, pageSize);
        }
    }

    addReferral() {
        this.$state.go('root.management.organization.referral.add');
    }

    deleteReferral(Id) {
        return this.referralsService.deleteReferral(Id)
            .then(response => {
                this.infinityTableService.reload();
                this.ngToast.success('Referral is deleted');
            });
    }

    goToReferral(id) {
        this.$state.go('root.management.organization.referral.view', { id });
    }
}
