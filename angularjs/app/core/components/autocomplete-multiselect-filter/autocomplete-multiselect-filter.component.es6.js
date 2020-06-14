import template from './autocomplete-multiselect-filter.html';

class autocompleteMultiselectFilterCtrl {
    constructor(
        $scope,
        $timeout,
        autocompleteMultiselectFilterService
    ) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.autocompleteMultiselectFilterService = autocompleteMultiselectFilterService;

        this.workWithStaticItems = this.staticItems;
    }

    getItems() {
        if (this.staticItems) {
            return this.staticItems.filter((item) => {
                return item.Name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
            });
        }

        const params = {
            [this.filterField]: this.searchText,
            PageIndex: 0,
            PageSize: 100
        };

        return this.autocompleteMultiselectFilterService.getData(this.filterUrl, params)
            .then((response) => response.data.Items);
    }

    getInputText() {
        let text = 'All';

        if (this.getSelectedItemsCount() > 0) {
            text = Object.values(this.selectedItems).map((item) => item.label).join(', ');
        }
        return text;
    }

    getItemText(item) {
        return _.get(item, this.displayField, item.Text);
    }

    getSelectedItemsCount() {
        return this.selectedItems ? Object.keys(this.selectedItems).length : 0;
    }

    onItemSelect(item) {
        const id = item[this.idField];

        if (this.selectedItems[id]) {
            delete this.selectedItems[id];
        } else {
            this.selectedItems[id] = { value: id, label: this.getItemText(item) };
        }
        this.onItemsChange();
    }

    resetFilter() {
        this.selectedItems = {};
        this.selectedItem = undefined;
        this.searchText = '';
        this.onItemsChange();
    }

    onItemsChange() {
        this.onSelectedItemsChange();
    }
}

const autocompleteMultiselectFilter = {
    bindings: {
        selectedItems: '=',
        searchText: '=',
        filterField: '=',
        filterUrl: '=',
        staticItems: '=',
        inputName: '=',
        displayField: '=',
        idField: '=',
        onSelectedItemsChange: '&'
    },
    scope: {},
    template,
    controller: autocompleteMultiselectFilterCtrl
};

export default autocompleteMultiselectFilter;
