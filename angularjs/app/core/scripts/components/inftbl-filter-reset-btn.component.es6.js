class inftblFilterResetBtnCtrl {
    constructor(infinityTableService, $scope) {
        'ngInject';

        this.$scope = $scope;
        this.infinityTableService = infinityTableService;
    }

    clearFilters() {
        //clear all filters
        const filters = this.$scope.$parent.filtersObj || {};
        this._filtersSetDefaults(filters);

        //clear all sorting
        const sortExprObj = this.$scope.$parent.sortObj || {};
        this._sortSetDefaults(sortExprObj);

        //reload table
        this.infinityTableService.reload();
    }

    _filtersSetDefaults(filtersObj){
        for (let prop in filtersObj) {
            if (!this.permanentFilters || (this.permanentFilters.indexOf(prop) === -1)) {
                filtersObj[prop] = null;
            }
        }
    }

    _sortSetDefaults(sortExprObj) {
        for (let prop in sortExprObj) {
            sortExprObj[prop] = undefined;
        }
    }
}

const inftblFilterResetBtn = {
    bindings: {
        permanentFilters: '<?'
    },
    template: `<md-button class="clear-filters" ng-click="$ctrl.clearFilters()" aria-label="...">
                    <md-icon md-svg-src="assets/images/default/clear-filters.svg"></md-icon>
               </md-button>`,
    controller: inftblFilterResetBtnCtrl
};

export default inftblFilterResetBtn;



