import {
    inventoryStatusConstants,
    importItemsTypeConstants,
    importStatusConstants
} from '../../../../core/constants/core.constants.es6';

import importItemsModalController from '../../../../core/modals/import-items/import-items.controller.es6';

import importItemsModalTemplate from '../../../../core/modals/import-items/import-items.html';


export default class inventoryListController {
    constructor($state,
                $scope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                $q,
                infinityTableService,
                advancedFiltersService,
                inventoryImportService,
                inventoryNotesImportHttpService,
                inventoryEquipmentService) {
        'ngInject';

        this.$q = $q;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.isLoading = false;
        this.importedItemsType = null;

        this.$state = $state;
        this.infinityTableService = infinityTableService;
        this.advancedFiltersService = advancedFiltersService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryImportService = inventoryImportService;
        this.inventoryNotesImportHttpService = inventoryNotesImportHttpService;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.importItemsTypeConstants = importItemsTypeConstants;
        this.importStatusConstants = importStatusConstants;

        this.toolbarItems = [
            {
                text: 'Receive Items',
                icon: {
                    url: 'assets/images/default/inventory.svg',
                    w: 20,
                    h: 22
                },
                clickFunction: this._goReceiveEquipment.bind(this)
            },
            {
                text: 'Transfer Items',
                icon: {
                    url: 'assets/images/default/arrow-back.svg',
                    w: 18,
                    h: 15
                },
                clickFunction: this._goTransferEquipment.bind(this)
            },
            {
                text: 'Import',
                icon: {
                    url: 'assets/images/default/upload-v2.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: this.importProducts.bind(this)
            },
            {
                text: 'Import Notes',
                icon: {
                    url: 'assets/images/default/upload-v2.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: this.importNotes.bind(this)
            }
        ];

        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this._checkState();

        this.isFiltersLoaded = false;
        this.filters = {};
        this.cacheFiltersKey = 'inventory';

        this.initFilters = {
            InventoryTypeFilters: {
                label: 'Show',
                type: 'checkbox-filter',
                buttonTypeCheckbox: true,
                items: [
                    {
                        id: guid(true),
                        displayName: 'Refurbished',
                        filterName: 'Refurbished',
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Service Required',
                        filterName: 'ServiceRequired',
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Bundle',
                        filterName: 'Bundle',
                        isSelected: false
                    }
                ]
            },
            InventoryGroupsFilters: {
                label: 'Group',
                placeholder: '+ group',
                type: 'autocomplete-chips-filter',
                filterName: 'GroupIds',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'Name'
                },
                filterValue: [],
                getDictionary: (params) => this.inventoryEquipmentService.getGroupsDictionary(params),
                isStaticDictionary: false,
                isSelected: false
            },
            InventoryCategoriesFilters: {
                label: 'Category',
                placeholder: '+ category',
                type: 'autocomplete-chips-filter',
                filterName: 'CategoryIds',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'Name'
                },
                filterValue: [],
                getDictionary: (params) => this.inventoryEquipmentService.getCategoriesDictionary(params),
                isStaticDictionary: false,
                isSelected: false
            }
        };

        this.filtersObj = {};
        this.sortExpr = {};
        this.locationsDic = [];
        this.statusesDic = [];

        this.updateFilters = (response) => {
            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response, {});
                this.advancedFiltersService.mapFilterObject(response);
                this.filters = this.advancedFiltersService.getSearchFilters();
                this.infinityTableService.reload();
            }
        };

        this.getInventoryList = (page, pageSize) =>
            inventoryEquipmentService.getList(angular.merge({}, this.filtersObj, this.filters), this.sortExpr, page, pageSize);

        this._activate();
    }

    _activate() {
        // loading dictionaries
        this.bsLoadingOverlayService.start({ referenceId: 'inventoryList' });
        this.$q.all([
            this.inventoryEquipmentService.getLocationsDictionary(),
            this.inventoryEquipmentService.getStatusesDictionary()
        ])
            .then((dics) => {
                this.isFiltersLoaded = true;

                this.locationsDic = dics[0];
                this.statusesDic = dics[1];
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inventoryList' }));

        this._getImportedItemsType();
    }

    _getImportedItemsType() {
        this.$q.all([
            this.inventoryImportService.getImportStatus(),
            this.inventoryNotesImportHttpService.getImportStatus()
        ])
        .then((responses) => {
            const productsData = responses[0].data || null;
            const notesData = responses[1].data || null;

            if (productsData && (+productsData.Status.Id === this.importStatusConstants.PROCESSING_STATUS_ID || !notesData)) {
                this.importedItemsType = this.importItemsTypeConstants.PRODUCTS_TYPE;
            } else if (notesData && (+notesData.Status.Id === this.importStatusConstants.PROCESSING_STATUS_ID || !productsData)) {
                this.importedItemsType = this.importItemsTypeConstants.NOTES_TYPE;
            } else if (productsData && notesData) {
                this.importedItemsType = new Date(productsData.Date) > new Date(notesData.Date) ?
                    this.importItemsTypeConstants.PRODUCTS_TYPE :
                    this.importItemsTypeConstants.NOTES_TYPE;
            }
        });
    }

    _checkState() {
        if (this.$state.is('root.inventory')) {
            this.$state.go('root.inventory.list');
        }
    }

    _goReceiveEquipment() {
        this.$state.go('root.receive_equipment.add.step1');
    }

    _goTransferEquipment() {
        this.$state.go('root.transfer_equipment.add.step1');
    }

    importProducts() {
        if (this.isLoading) {
            this.ngToast.warning('Sorry, loading was already started');
            return false;
        }

        this.$mdDialog.show({
            controller: importItemsModalController,
            controllerAs: '$ctrl',
            template: importItemsModalTemplate,
            locals: {
                itemsType: this.importItemsTypeConstants.PRODUCTS_TYPE,
                isManagement: false
            }

        }).then((isSuccess) => {
            if (isSuccess) {
                this.ngToast.success('Import product(s) was processed.');
                this.importedItemsType = this.importItemsTypeConstants.PRODUCTS_TYPE;
                this.isLoading = true;
                this.$state.reload();
            }
        });
    }

    importNotes() {
        if (this.isLoading) {
            this.ngToast.warning('Sorry, loading was already started');
            return false;
        }

        this.$mdDialog.show({
            controller: importItemsModalController,
            controllerAs: '$ctrl',
            template: importItemsModalTemplate,
            locals: {
                itemsType: this.importItemsTypeConstants.NOTES_TYPE,
                isManagement: false
            }

        }).then((isSuccess) => {
            if (isSuccess) {
                this.ngToast.success('Import note(s) was processed.');
                this.importedItemsType = this.importItemsTypeConstants.NOTES_TYPE;
                this.isLoading = true;
                this.$state.reload();
            }
        });
    }

    goToInventoryItem(equipmentId) {
        this.$state.go('root.inventory_item.details', { equipmentId });
    }

    deleteEquipment(id) {
        this.inventoryEquipmentService.deleteEquipmentById(id)
            .then(() => this.infinityTableService.reload());
    }

    getHcpcsCodes(code, pageIndex) {
        return this.inventoryEquipmentService.getHcpcsCodes(code, pageIndex)
            .then((response) => response.data);
    }

    getStatusLabelClass(status) {
        switch (status.Id) {
            case inventoryStatusConstants.ACTIVE_STATUS_ID:
                return 'green';
            case inventoryStatusConstants.INACTIVE_STATUS_ID:
                return 'gray';
            default:
                return 'dark-blue';
        }
    }
}
