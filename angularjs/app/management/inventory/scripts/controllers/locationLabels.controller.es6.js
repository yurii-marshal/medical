import openUrlInNewTab from '../../../../core/helpers/open-url-in-new-tab.helper.es6';

export default class locationLabelsController {
    constructor($state, $window, infinityTableService, inventoryLocationsService) {
        'ngInject';

        this.$state = $state;
        this.$window = $window;
        this.inventoryLocationsService = inventoryLocationsService;

        this.filterObj = {};
        this.sortExpr = {};
        this.statuses = [
            { value: 'false', text: 'No' },
            { value: 'true', text: 'Yes' }
        ];

        this.getTotalCount = () => infinityTableService.getTotalCount();
        this.getSelectedItemsCount = () => infinityTableService.getSelectedItemsCount();
        this.getSelectedAllValue = () => infinityTableService.getSelectedAllValue();
        this.getSelectedItems = () => infinityTableService.getSelectedItems();
        this.toggleItem = (item) => infinityTableService.toggleItem(item);
        this.selectAllFn = () => infinityTableService.selectAllFn();

        this.searchLocations = this._searchLocations.bind(this);
    }

    _searchLocations(pageIndex, pageSize) {
        return this.inventoryLocationsService.getLabelsLocations(this.filterObj, this.sortExpr, pageIndex, pageSize);
    }

    done() {
        const postModel = {};

        if (this.getSelectedAllValue()) {
            postModel.SelectAll = true;
            postModel.Name = this.filterObj.Name || undefined;
            postModel.Address = this.filterObj.Address || undefined;
            postModel.Contact = this.filterObj.Contact || undefined;
            postModel.Default = this.filterObj.Default || undefined;
        } else {
            postModel.Ids = this.getSelectedItems().map((item) => item.Id);
        }

        const url = this.$state.href('root.location-labels-print', { model: JSON.stringify(postModel) });

        openUrlInNewTab(url);
    }

    cancel() {
        this.$state.go('root.management.inventory.locations');
    }
}
