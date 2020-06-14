const SEARCH_PRODUCTS = 'products';
const SEARCH_EQUIPMENT = 'equipment';

import searchItemsDetailsModalController from './search-items-show-details/searchItemsDetailsModal.controller.es6';
import searchItemsDetailsModalTemplate from './search-items-show-details/search-items-show-details.html';

import template from './search-items.html';

class searchItemsCtrl {
    constructor($timeout,
                $state,
                $q,
                $filter,
                $window,
                $mdDialog,
                bsLoadingOverlayService,
                WEB_API_INVENTORY_SERVICE_URI,
                searchItemsService) {
        'ngInject';

        this.$state = $state;
        this.$q = $q;
        this.$filter = $filter;
        this.$window = $window;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.searchItemsService = searchItemsService;

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
            searchHcpcsCodes: [],
            searchManufacturers: this.filterManufacturers || [],
            searchGroups: [],
            searchCategories: [],
            searchPartNumbers: this.filterPartNumbers || [],
            serialNumber: undefined,
            modelName: undefined,
            partNumber: undefined,
            group: undefined,
            category: undefined
        };

        this.isSearchDataLoaded = false;

        this.isItemAdded = searchItemsService.isItemAdded;

        // wrap activate in $timeout for exchanging data with main controller
        $timeout(() => {
            this.type = this.type ? this.type : 'products';
            this.searchModel.Status = this.isCompleteWizard ? 'Active' : undefined;
            this._activate();
        });
    }

    _activate() {

        let promises = [];

        if (this.excludePatientDevices && this.searchByAllLocations) {
            promises.push(
                this.searchItemsService.getLocationsDictionary()
                    .then((response) => {
                        this.searchModel.StoreTypes = [];
                        response.data.Items.forEach((item) => {
                            if (item.Name.toLowerCase() !== 'patient') {
                                this.searchModel.StoreTypes.push(item.Id);
                            }
                        });
                    })
            );
        }

        this.bsLoadingOverlayService.start({ referenceId: 'searchResult' });
        this.$q.all(promises)
            .finally(() => this.getData());
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
            searchHcpcsCodes: [],
            searchManufacturers: [],
            searchGroups: [],
            searchCategories: [],
            searchPartNumbers: [],
            serialNumber: undefined,
            modelName: undefined,
            partNumber: undefined,
            manufacturer: undefined,
            group: undefined,
            category: undefined,
            Status: this.isCompleteWizard ? 'Active' : undefined
        };
        this.getData();
        this.isPrescribeAnyShow = false;
    }

    showSelectedItems($event) {
        this.$mdDialog.show({
            controller: 'searchItemsCartModalController as $ctrl',
            templateUrl: 'core/components/search-items/search-items-cart-modal/search-items-cart-modal.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                items: this.items
            }
        })
        .then((res) => {
            this.items = angular.copy(res);
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
        return this.searchItemsService.getAspects(text)
            .then((response) => response.data.Items);
    }

    getWarehouses(text) {
        return this.searchItemsService.getWarehouses(text);
    }

    getPersonnels(text) {
        return this.searchItemsService.getPersonnels(text);
    }

    getHcpcsCodes(code) {
        return this.searchItemsService.getHcpcsCodes(code)
            .then((response) => response.data.Items);
    }

    getEquipmentManufacturers(searchText) {
        return this.searchItemsService.getEquipmentManufacturers(searchText)
            .then((response) => response.data.Items);
    }

    getEquipmentGroups(searchText) {
        return this.searchItemsService.getEquipmentGroups(searchText)
            .then((response) => response.data.Items);
    }

    getEquipmentCategories(searchText) {
        return this.searchItemsService.getEquipmentCategories(searchText)
            .then((response) => response.data.Items);
    }

    search() {
        this.isSearchDataLoaded = false;
        this.searchModel.pageIndex = 1;
        this.getData();

        if (this.type === SEARCH_PRODUCTS && !this.searchForm.$invalid) {
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
        let newItem;

        if (this.isResupplyProgramItems === 'true') {
            newItem = {
                'Product': {
                    'Id': item.Id,
                    'Name': item.Name,
                    'PartNumber': item.PartNumber,
                    'Manufacturer': item.Manufacturer,
                    'Description': item.Description,
                    'HcpcsCodes': item.allHcpcsCodes
                },
                'Count': null,
                'IsNew': true,
                'RecentDeliveryDate': null,
                'NextEligibleDate': null,
                'NextScheduledDate': null,
                'HcpcsCodes': item.allHcpcsCodes,
                'Hold': false,
                'Frequency': null,
                'PeriodValue': null,
                'PeriodType': {
                    'Id': '3',
                    'Text': 'Month'
                }
            };
        } else {

            if (!item.Diagnosis) {
                if (item.Bundle) {
                    item.Components.forEach((component) => {
                        component.Diagnosis = this.isAddDiagnosis && this.newDiagnosis ? this.newDiagnosis.slice(0, 4) : [];
                    });
                } else {
                    item.Diagnosis = this.isAddDiagnosis && this.newDiagnosis ? this.newDiagnosis.slice(0, 4) : [];
                }
            }

            item.isPrescribed = true;
            item.maxCount = item.Count ? item.Count : '';
            item.Count = 1;
            item.isAny = item.isAny || false;
            item.Id = item.Id || undefined;

            newItem = item;
        }

        if (!this.isItemAdded(item, this.items)) {
            this.items.push(newItem);
        }
    }

    removeItem(item) {
        const Id = item.Id || item.ProductId;

        if (angular.isArray(this.resupplyDevices)) {
            _.remove(this.resupplyDevices, (resupplyDevice) => resupplyDevice.Product.Id === item.ProductId && resupplyDevice.IsNew);
        }

        _.remove(this.items, (selectedItem) => {
            let selectedItemId;

            if (this.isResupplyProgramItems === 'true') {
                selectedItemId = selectedItem.Product.Id;
            } else {
                selectedItemId = selectedItem.Id || selectedItem.ProductId;
            }

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

            this.searchItemsService.searchProducts(this.searchModel, this.isResupplyProgramItems)
                .then((response) => this._mapItemsResponse(response.data))
                .finally(() => finallyPromiseFn.apply(this));
        }

        if (this.type === SEARCH_EQUIPMENT) {

            this.searchItemsService.searchEquipments(this.$state.params.personnelId, this.searchModel, this.patientId)
                .then((response) => this._mapItemsResponse(response.data))
                .finally(() => finallyPromiseFn.apply(this));
        }

        function finallyPromiseFn() {
            this.bsLoadingOverlayService.stop({ referenceId: 'searchResult' });
            this.isSearchDataLoaded = true;
        }
    }

    _mapItemsResponse(data) {
        this.totalCount = data.Count;
        this.equipmentList = _.uniqBy(data.Items, 'Id');

        angular.forEach(this.equipmentList, (item) => {

            const noImage = 'assets/images/no-image-equipment.svg';

            if (item.PictureUrl) {
                item.image = this.WEB_API_INVENTORY_SERVICE_URI + item.PictureUrl;
            } else {
                item.image = noImage;
            }

            const allHcpcsCodes = this.$filter('hcpcsCodesToArr')(item);

            item.allHcpcsCodes = allHcpcsCodes;
            item.HcpcsCodes = allHcpcsCodes;
            item.Hcpcs = allHcpcsCodes;

            if (item.Components && item.Components.length) {
                angular.forEach(item.Components, (component) => {
                    component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
                });
            }
        });

        if (this.relatedOrderItems) {
            this.equipmentList = this.equipmentList.filter((item) => {
                return !this.relatedOrderItems.find((relatedItem) => {
                    return item.ProductId === relatedItem.ProductId;
                });
            });
        }
    }

    isSameResupplyCodeSelected(item, selectedItemsArr) {
        if (this.isResupplyProgramItems === 'true') {
            let unusedResupplyCodes = _.filter(selectedItemsArr, (i) => {
                const itemHcpcsCode = i.HcpcsCodes[0],
                    filterHcpcsCode = item.HcpcsCodes[0];

                return itemHcpcsCode === filterHcpcsCode;
            });

            return !!unusedResupplyCodes.length;
        }
    }

    changeSelectedHcpcsCode(code) {
        if (!code) {
            this.searchForm.hcpcsCode.$setValidity('md-require-match', true);
        }
    }
}

const searchItems = {
    bindings: {
        items: '=',
        type: '@',       // 'products' or 'equipment'. Default is 'products'
        excludePatientDevices: '<?',
        patientId: '<?', /* used as filter for search to exclude devices located on current patient */
        isResupplyProgramItems: '@?',
        selectedItemsForResupplyProgram: '<?',
        isHideSelectAnyDeviceBtn: '@?',
        searchByAllLocations: '<?',
        isCompleteWizard: '<?',
        resupplyDevices: '<?',
        isAddDiagnosis: '=?',
        newDiagnosis: '=?',
        relatedOrderItems: '<?',
        filterPartNumbers: '<?',
        filterManufacturers: '<?'
    },
    template,
    controller: searchItemsCtrl
};

export default searchItems;
