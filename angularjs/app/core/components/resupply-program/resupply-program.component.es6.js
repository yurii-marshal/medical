import template from './resupply-program.html';

class resupplyProgramCtrl {
    constructor(
        $state,
        patientResupplyService,
        organizationSetupService,
        $filter,
        $scope
    ) {
        'ngInject';

        this.$filter = $filter;
        this.$state = $state;
        this.patientResupplyService = patientResupplyService;
        this.organizationSetupService = organizationSetupService;
        this.periodsDictionary = [];
        this.DefDeliveryGroupingDays = null;
        this._defaultData = null;
        this.patientResupplyService.getResupplyPeriodsDictionary()
            .then((response) => this.periodsDictionary = response.data);

        this.organizationSetupService.getOrganizationResupplyInfo().then((response) => {
            this.DefDeliveryGroupingDays = response.ResupplyOrganizationSettings.ShippingDateWithin;
        });

        $scope.$watch(() => this.model.Items, () => {
            if (this.model.Items) {
                this.model.Items.forEach((item) => {
                    item.allHcpcsCodes = $filter('hcpcsCodesToArr')(item);
                });
            }
        });
    }

    setCustomNextScheduled(index) {
        this.model.Items[index].IsNew = false;
    }

    setByDefaultWithinDate() {
        if (this.model.groupItemsForDelivery && !this.model.DeliveryGroupingDays) {
            this.model.DeliveryGroupingDays = this.DefDeliveryGroupingDays;
        } else {
            this.model.DeliveryGroupingDays = null;
        }
    }

    getToday() {
        return moment().format('MM/DD/YYYY');
    }

    getRecentDateText(item) {
        return item.RecentDeliveryDate ? moment.utc(item.RecentDeliveryDate).format('MM/DD/YYYY') : '-';
    }

    toggleHoldResupplyProgram() {
        this.model.Items.map((item) => item.Hold = this.model.Hold);
    }

    onCalcNextScheduleFromInputs(item) {
        this.patientResupplyService.calcNextSchedule(item, false);
    }

    getMaxFrequency(item) {
        return this.patientResupplyService.getMaxFrequency(item);
    }

    addItem() {
        this.items = angular.copy(this.model.Items, this.currentSelectedItems);
        this.$state.go(this.addItemsRoot);
    }

    deleteItem(item) {

        let index = _.findIndex(this.model.Items, (o) => o.Id ? (o.Id === item.Id) : (o.Product.Id === item.Product.Id));

        if (index !== -1) {
            this.model.Items.splice(index, 1);
        }
    }
}

const resupplyProgram = {
    bindings: {
        model: '=',
        addItemsRoot: '<',
        currentSelectedItems: '=',
        isFiltersBottomPosition: '<?',
        isDeliveryDateByDefault: '<?'
    },
    template,
    controller: resupplyProgramCtrl
};

export default resupplyProgram;
