// Config
import config from './inventory.route.es6';

// Controllers
import productPageController from './scripts/controllers/productPage.controller.es6';
import locationLabelsController from './scripts/controllers/locationLabels.controller.es6';
import printLocationLabelsController from './scripts/controllers/printLocationLabels.controller.es6';
import addBarcodesController from './scripts/controllers/addBarcodes.controller.es6';
import inventoryLocationsController from './scripts/controllers/inventoryLocations.controller.es6';
import inventoryProductsController from './scripts/controllers/inventoryProducts.controller.es6';
import addManufactureProductController from './scripts/controllers/addManufuctureProduct.controller.es6';
import inventoryProductsListController from './scripts/controllers/inventoryProductsList.controller.es6';
import categoriesController from './scripts/controllers/categories.controller.es6';
import groupsController from './scripts/controllers/groups.controller.es6';
import inventoryLearnBarcodesController from './scripts/controllers/inventoryLearnBarcodes.controller.es6';
import manufacturersController from './scripts/controllers/manufacturers.controller.es6';
import printProductLabelsController from './scripts/controllers/printProductLabels.controller.es6';
import productLabelsController from './scripts/controllers/productLabels.controller.es6';
import inventoryProductLookupsController from './scripts/controllers/inventoryProductLookups.controller.es6';
import vendorsListController from './components/vendors/components/vendors-list/vendors-list.controller.es6';
import editVendorController from './components/vendors/components/edit-vendor/edit-vendor.controller.es6';
// Services
import inventoryProductsService from './scripts/services/inventoryProducts.service.es6';
import inventoryBarcodeService from './scripts/services/inventoryBarcodes.service.es6';
import inventoryCategoriesService from './scripts/services/inventoryCategories.service.es6';
import inventoryGroupsService from './scripts/services/inventoryGroups.service.es6';
import inventoryManufacturersService from './scripts/services/inventoryManufacturers.service.es6';
import inventoryLocationsService from './scripts/services/inventoryLocations.service.es6';

export default angular
    .module('app.management.inventory', [])
    .config(config)

    // Controllers
    .controller('productPageController', productPageController)
    .controller('locationLabelsController', locationLabelsController)
    .controller('printLocationLabelsController', printLocationLabelsController)
    .controller('addBarcodesController', addBarcodesController)
    .controller('inventoryLocationsController', inventoryLocationsController)
    .controller('inventoryProductsController', inventoryProductsController)
    .controller('addManufactureProductController', addManufactureProductController)
    .controller('inventoryProductsListController', inventoryProductsListController)
    .controller('categoriesController', categoriesController)
    .controller('groupsController', groupsController)
    .controller('inventoryLearnBarcodesController', inventoryLearnBarcodesController)
    .controller('manufacturersController', manufacturersController)
    .controller('printProductLabelsController', printProductLabelsController)
    .controller('productLabelsController', productLabelsController)
    .controller('inventoryProductLookupsController', inventoryProductLookupsController)
    .controller('vendorsListController', vendorsListController)
    .controller('editVendorController', editVendorController)
    // Services
    .service('inventoryProductsService', inventoryProductsService)
    .service('inventoryBarcodeService', inventoryBarcodeService)
    .service('inventoryCategoriesService', inventoryCategoriesService)
    .service('inventoryGroupsService', inventoryGroupsService)
    .service('inventoryManufacturersService', inventoryManufacturersService)
    .service('inventoryLocationsService', inventoryLocationsService)
    .name;
