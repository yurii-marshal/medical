const SEARCH_PRODUCTS = 'products_catalog';

import searchItemsDetailsModalController from './search-items-show-details/searchItemsDetailsModal.controller.es6';
import searchItemsDetailsModalTemplate from './search-items-show-details/search-items-show-details.html';

import template from './search-items-catalog.html';

class searchItemsCatalogCtrl {
    constructor(
        $timeout,
        $state,
        $filter,
        $window,
        $mdDialog,
        bsLoadingOverlayService,
        searchItemsCatalogService,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.$window = $window;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.searchItemsCatalogService = searchItemsCatalogService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.searchModel = {
            pageSize: 8,
            pageIndex: 1,
            Warehouse: undefined,
            searchWarehouse: '',
            Personnel: undefined,
            searchPersonnel: '',
            aspect: undefined,
            searchAspect: '',
            HcpcsCode: undefined,
            searchHcpcsCode: '',
            searchManufacturers: [],
            searchGroups: [],
            searchCategories: [],
            serialNumber: undefined,
            modelName: undefined,
            partNumber: undefined,
            manufacturer: undefined,
            group: undefined,
            category: undefined
        };

        this.isSearchDataLoaded = false;

        this.isItemAdded = searchItemsCatalogService.isItemAdded;

        // wrap activate in $timeout for exchanging data with main controller
        $timeout(() => {
            this.type = this.type ? this.type : 'products_catalog';
            this.searchModel.Status = this.isCompleteWizard ? 'Active' : undefined;
            this._activate();
        });
    }

    _activate() {
        this.getData();
    }

    clear() {
        this.isSearchDataLoaded = false;
        this.searchModel = {
            pageSize: 8,
            pageIndex: 1,
            Warehouse: undefined,
            searchWarehouse: '',
            Personnel: undefined,
            searchPersonnel: '',
            aspect: undefined,
            searchAspect: '',
            HcpcsCode: undefined,
            searchHcpcsCode: '',
            searchManufacturers: [],
            searchGroups: [],
            searchCategories: [],
            serialNumber: undefined,
            modelName: undefined,
            partNumber: undefined,
            manufacturer: undefined,
            group: undefined,
            category: undefined,
            Status: this.isCompleteWizard ? 'Active' : undefined
        };
        this.getData();
    }

    showSelectedItems($event) {
        this.$mdDialog.show({
            controller: 'searchItemsCartModalController as $ctrl',
            templateUrl: 'core/components/search-items-catalog/search-items-cart-modal/search-items-cart-modal.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                items: this.items
            }
        });
    }

    showItemDetails($event, item) {
        this.$mdDialog.show({
            controller: searchItemsDetailsModalController,
            controllerAs: '$ctrl',
            template: searchItemsDetailsModalTemplate,
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                item,
                type: this.type
            }
        });
    }

    getAspects(text) {
        return this.searchItemsCatalogService.getAspects(text)
            .then((response) => response.data.Items);
    }

    getWarehouses(text) {
        return this.searchItemsCatalogService.getWarehouses(text);
    }

    getPersonnels(text) {
        return this.searchItemsCatalogService.getPersonnels(text);
    }

    getHcpcsCodes(code) {
        return this.searchItemsCatalogService.getHcpcsCodes(code)
            .then((response) => response.data.Items);
    }

    getEquipmentManufacturers(searchText) {
        return this.searchItemsCatalogService.getEquipmentManufacturers(searchText)
            .then((response) => response.data.Items);
    }

    getEquipmentGroups(searchText) {
        return this.searchItemsCatalogService.getEquipmentGroups(searchText)
            .then((response) => response.data.Items);
    }

    getEquipmentCategories(searchText) {
        return this.searchItemsCatalogService.getEquipmentCategories(searchText)
            .then((response) => response.data.Items);
    }

    search() {
        this.isSearchDataLoaded = false;
        this.searchModel.pageIndex = 1;
        this.getData();

        if (this.type === SEARCH_PRODUCTS) {
            this.isPrescribeAnyShow = (function getHcpsObj(hcpcsCodeObj, hcpcsCodeText) {
                if (hcpcsCodeObj && hcpcsCodeObj.Text) {
                    return hcpcsCodeObj;
                }
                if (hcpcsCodeText) {
                    return { Text: hcpcsCodeText, Id: hcpcsCodeText };
                }
                return false;
            })(this.searchModel.HcpcsCode, this.searchModel.searchHcpcsCode);
        }
    }

    prescribeAnyEquipment() {
        this.addItem({
            isAny: true,
            HcpcsCode: this.isPrescribeAnyShow,
            Count: 1
        });
    }

    addItem(item) {
        item.isPrescribed = true;
        item.maxCount = item.Count ? item.Count : '';
        item.Count = 1;
        item.isAny = item.isAny || false;
        item.Id = item.Id || undefined;

        if (!this.isItemAdded(item, this.items)) {
            this.items.push(item);
        }
    }

    removeItem(item) {
        const Id = item.Id || item.ProductId;

        _.remove(this.items, (selectedItem) => {
            let selectedItemId = selectedItem.Id || selectedItem.ProductId;

            return Id === selectedItemId;
        });
    }

    getData() {
        if (this.searchForm.$invalid) {
            touchedErrorFields(this.searchForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'searchResult' });

        // show 10 items on wide screens
        if (this.$window.outerWidth > 1902) {
            this.searchModel.pageSize = 10;
        }

        if (this.isResupplyProgramItems === 'true') {
            this.searchModel.IsResupply = true;
            this.searchModel.IsBundle = false;
        }

        this.equipmentList = [];

        if (this.type === SEARCH_PRODUCTS) {
            this.searchItemsCatalogService.searchProducts(this.searchModel, this.isResupplyProgramItems)
                .then((response) => {

                    this._mapItemsResponse(response.data);
                })
                .finally(() => finallyPromiseFn.apply(this));
        }

        function finallyPromiseFn() {
            this.bsLoadingOverlayService.stop({ referenceId: 'searchResult' });
            this.isSearchDataLoaded = true;
        }
    }

    _mapItemsResponse(data) {
        this.totalCount = data.Count;
        this.equipmentList = (this.isResupplyProgramItems === 'true')
            ? this._filterByResupplyCode(this.selectedItemsForResupplyProgram, data.Items)
            : data.Items;

        angular.forEach(this.equipmentList, (item) => {
            this._checkHcpcsCodes(item);
            if (item.PictureUrl) {
                // Problem with Cache
                item.PictureUrl = `${item.PictureUrl}?${Date.now()}`;
            } else {
                item.PictureUrl = `assets/images/no-image-equipment.svg?${Date.now()}`;
            }
            item.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(item);
            if (item.Components && item.Components.length) {
                angular.forEach(item.Components, (component) => {
                    component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
                });
            }
        });
    }

    _checkHcpcsCodes(item) {

        if (item.Type === 'Bundle') {
            item.Hcpcs = [];
            item.Components.forEach((component) => {
                if (item.Hcpcs.indexOf(component.Hcpcs[0]) === -1) {
                    item.Hcpcs.push(component.Hcpcs[0]);
                }
            });
        }
    }

    _filterByResupplyCode(selectedItems, searchResultArr) {
        let filteredArr = [],
            uniqueResupplyCodes = [];

        angular.forEach(selectedItems, (item) => {
            if (uniqueResupplyCodes.indexOf(item.HcpcsCodes.Primary) === -1) {
                uniqueResupplyCodes.push(item.HcpcsCodes.Primary);
            }
        });
        filteredArr = _.filter(searchResultArr, (i) => uniqueResupplyCodes.indexOf(i.HcpcsCodes.Primary) === -1);

        return filteredArr;
    }

    isSameResupplyCodeSelected(item, selectedItemsArr) {
        if (this.isResupplyProgramItems === 'true') {
            let unusedResupplyCodes = _.filter(selectedItemsArr, (i) => i.HcpcsCodes.Primary === item.HcpcsCodes.Primary);

            return !!unusedResupplyCodes.length;
        }
    }
    selectAll() {
        this.equipmentList.filter((item) => {
            this.addItem(item);
        });
    }
    selectNone() {
        this.items = [];
    }

    changeSelectedHcpcsCode(code) {
        if (!code) {
            this.searchForm.hcpcsCode.$setValidity('md-require-match', true);
        }
    }
}

const searchItemsCatalog = {
    bindings: {
        items: '=',
        type: '@',       // 'products' or 'equipment'. Default is 'products'
        excludePatientDevices: '<?',
        patientId: '<?', /* used as filter for search to exclude devices located on current patient */
        isResupplyProgramItems: '@?',
        selectedItemsForResupplyProgram: '<?',
        isHideSelectAnyDeviceBtn: '@?',
        searchByAllLocations: '<?',
        isCompleteWizard: '<?'
    },
    template,
    controller: searchItemsCatalogCtrl
};

export default searchItemsCatalog;
