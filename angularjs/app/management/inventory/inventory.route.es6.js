import {
    managementPermissionsConstants,
    permissionsCategoriesConstants
} from '../../core/constants/permissions.constants.es6';

export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state("root.management.inventory", {
            url: "/inventory",
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function ($state, $scope) {

                function checkState() {
                    if ($state.is("root.management.inventory")) {
                        $state.go("root.management.inventory.manufacturers");
                    }
                }

                $scope.$on('$stateChangeSuccess', function() {
                    checkState();
                });

                checkState();
            },
            params: {
                pageTitle: "Inventory"
            }
        })
        .state("root.management.inventory.manufacturers", {
            url: "/manufacturers",
            templateUrl: "management/inventory/views/manufacturers.html",
            controller: 'manufacturersController',
            controllerAs: 'manufacturers',
            params: {
                topMenu: "Management",
                pageTitle: "Manufacturers"
            }
        })
        .state("root.management.inventory.categories", {
            url: "/categories",
            templateUrl: "management/inventory/views/categories.html",
            controller: 'categoriesController',
            controllerAs: 'categories',
            params: {
                topMenu: "Management",
                pageTitle: "Categories"
            }
        })
        .state("root.management.inventory.groups", {
            url: "/groups",
            templateUrl: "management/inventory/views/groups.html",
            controller: 'groupsController',
            controllerAs: 'groups',
            params: {
                topMenu: "Management",
                pageTitle: "Groups"
            }
        })
        .state("root.management.inventory.locations", {
            url: "/locations",
            templateUrl: "management/inventory/views/locations.html",
            controller: 'inventoryLocationsController',
            controllerAs: 'locations',
            params: {
                topMenu: "Management",
                pageTitle: "Locations"
            }
        })
        // VENDORS
        .state('root.management.inventory.vendors', {
            url: '/vendors',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.inventory.vendors')) {
                        $state.go('root.management.inventory.vendors.list', null, { location: 'replace' });
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.inventory.vendors.list', {
            url: '/list',
            templateUrl: 'management/inventory/components/vendors/components/vendors-list/vendors-list.html',
            controller: 'vendorsListController',
            controllerAs: '$ctrl',
            params: {
                topMenu: 'Management',
                leftMenu: 'Vendors',
                pageTitle: 'Vendors'
            }
        })
        .state('root.management.inventory.vendors.add', {
            url: '/add',
            templateUrl: 'management/inventory/components/vendors/components/edit-vendor/edit-vendor.html',
            controller: 'editVendorController',
            controllerAs: '$ctrl',
            params: {
                topMenu: 'Management',
                leftMenu: 'Vendors',
                pageTitle: 'Add Vendor'
            }
        })
        .state('root.management.inventory.vendors.edit', {
            url: '/edit/:vendorId',
            templateUrl: 'management/inventory/components/vendors/components/edit-vendor/edit-vendor.html',
            controller: 'editVendorController',
            controllerAs: '$ctrl',
            params: {
                topMenu: 'Management',
                leftMenu: 'Vendors',
                pageTitle: 'Edit Vendor'
            }
        })
        .state("root.management.inventory.products", {
            url: "/products",
            templateUrl: "management/inventory/views/products.html",
            controller: 'inventoryProductsController',
            controllerAs: 'products',
            params: {
                topMenu: "Management",
                leftMenu: "Catalog",
                pageTitle: "Catalog"
            }
        })
        .state("root.management.inventory.products.list", {
            url: "/list",
            templateUrl: "management/inventory/views/products-list.html",
            controller: 'inventoryProductsListController',
            controllerAs: 'productsList',
            params: {
                topMenu: "Management",
                leftMenu: "Catalog",
                pageTitle: "Catalog"
            }
        })
        .state("root.management.inventory.products.lookups", {
            url: "/lookups",
            templateUrl: "management/inventory/views/products-lookups.html",
            controller: 'inventoryProductLookupsController',
            controllerAs: 'lookups',
            params: {
                topMenu: "Management",
                leftMenu: "Catalog",
                pageTitle: "Products Lookups"
            }
        })
        .state("root.management.inventory.product_new", {
            url: "/products/new",
            templateUrl: "management/inventory/views/product-page.html",
            controller: 'productPageController',
            controllerAs: 'product',
            params: {
                topMenu: "Management",
                leftMenu: "Catalog",
                pageTitle: "Add Product"
            }
        })
        .state("root.management.inventory.product_edit", {
            url: "/products/:productId",
            templateUrl: "management/inventory/views/product-page.html",
            controller: 'productPageController',
            controllerAs: 'product',
            params: {
                productId: undefined,
                topMenu: "Management",
                leftMenu: "Catalog",
                pageTitle: "Edit Product"
            }
        })
        .state("root.location-labels", {
            url: "/management/inventory/location-labels",
            templateUrl: "management/inventory/views/location-labels.html",
            controller: 'locationLabelsController as locationLabels',
            params: {
                topMenu: "Management",
                pageTitle: "Print Labels"
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.MANAGEMENT, managementPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state("root.location-labels-print", {
            url: "/management/inventory/location-labels-print/:model",
            templateUrl: "management/inventory/views/location-labels-print.html",
            controller: 'printLocationLabelsController as printLabels',
            params: {
                topMenu: "Management",
                pageTitle: "Print Labels"
            }
        })
        .state("root.product-labels", {
            url: "/management/inventory/print-product-labels",
            templateUrl: "management/inventory/views/product-labels.html",
            controller: 'productLabelsController',
            controllerAs: 'productLabels',
            params: {
                topMenu: "Management",
                pageTitle: "Print Labels"
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.MANAGEMENT, managementPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state("root.product-labels-print", {
            url: "/management/inventory/product-labels-print/:model",
            templateUrl: "management/inventory/views/product-labels-print.html",
            controller: 'printProductLabelsController',
            controllerAs: 'printLabels',
            params: {
                topMenu: "Management",
                pageTitle: "Print Labels"
            }
        })
        .state("root.learn_barcodes", {
            url: "/management/inventory/learn-barcodes",
            templateUrl: "management/inventory/views/learn-barcodes.html",
            controller: 'inventoryLearnBarcodesController',
            controllerAs: 'bar',
            params: {
                topMenu: "Management",
                pageTitle: "Learn Barcodes"
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.MANAGEMENT, managementPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state("root.learn_barcodes.add", {
            url: "/add",
            templateUrl: "management/inventory/views/barcodes-wizard/barcodes-wizard.html",
            controller: 'addBarcodesController',
            controllerAs: 'addBar',
            params: {
                topMenu: "Management",
                pageTitle: "Learn Barcodes"
            }
        })
        .state("root.learn_barcodes.add.step1", {
            url: "/step1",
            templateUrl: "management/inventory/views/barcodes-wizard/step1.html",
            params: {
                topMenu: "Management",
                prevItem: undefined,
                pageTitle: "Learn Barcodes"
            }
        })
        .state("root.learn_barcodes.add.step2", {
            url: "/step2",
            templateUrl: "management/inventory/views/barcodes-wizard/step2.html",
            params: {
                topMenu: "Management",
                prevItem: undefined,
                pageTitle: "Learn Barcodes"
            }
        })
        .state("root.add_manufacture_product", {
            url: "/add-product-manufacturer",
            templateUrl: "management/inventory/views/add-manufacture-product.html",
            controller: 'addManufactureProductController',
            controllerAs: 'addManafacturePrd',
            params: {
                topMenu: "Management",
                pageTitle: "Add Manufacturer Product"
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.MANAGEMENT, managementPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        });

}

