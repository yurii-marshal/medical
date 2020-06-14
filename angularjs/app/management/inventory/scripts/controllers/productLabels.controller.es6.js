import openUrlInNewTab from '../../../../core/helpers/open-url-in-new-tab.helper.es6';

export default class productLabelsController {
    constructor($state, inventoryProductsService, infinityTableService, $window) {
        'ngInject';

        this.$state = $state;
        this.inventoryProductsService = inventoryProductsService;
        this.infinityTableService = infinityTableService;
        this.$window = $window;

        this.filterObj = {};
        this.sortExpr = {};
        this.statuses = [
            { value: "Active", text: "Active" },
            { value: "Discontinued", text: "Discontinued" }
        ];

        this.getTotalCount =  () =>  infinityTableService.getTotalCount();
        this.getSelectedItemsCount =  () => infinityTableService.getSelectedItemsCount();
        this.getSelectedAllValue =  () => infinityTableService.getSelectedAllValue();
        this.getSelectedItems =  () =>   infinityTableService.getSelectedItems();
        this.toggleItem = (item) =>  infinityTableService.toggleItem(item);
        this.selectAllFn = () => infinityTableService.selectAllFn();

        this.getProductLabels = this._getProductLabels.bind(this);
    }

    done () {
        let postModel = {};
        if (this.getSelectedAllValue()) {
            postModel.SelectAll = true;
            postModel.Name = this.filterObj.Name || undefined;
            postModel.PartNumber = this.filterObj.PartNumber || undefined;
            postModel.Manufacturer = this.filterObj.Manufacturer || undefined;
            postModel.Group = this.filterObj.Group || undefined;
            postModel.Category = this.filterObj.Category || undefined;
            postModel.HcpcsCode = this.filterObj.HcpcsCode || undefined;
        }
        else {
            postModel.Ids = this.getSelectedItems().map(item => item.Id);
        }

        const url = this.$state.href('root.product-labels-print', { model: JSON.stringify(postModel) });

        openUrlInNewTab(url);
    }

    _getProductLabels(pageIndex, pageSize) {
        return this.inventoryProductsService.getProductLabels(this.filterObj, this.sortExpr, pageIndex, pageSize);
    }

    cancel () {
        this.$state.go('root.management.inventory.products.list');
    }
}
