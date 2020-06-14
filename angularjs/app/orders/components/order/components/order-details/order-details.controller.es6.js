export default class OrderDetailsCtrl {
    constructor(
        $q,
        $state,
        $filter,
        ordersService,
        orderDetailsService,
        mapProductsService,
        bsLoadingOverlayService,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$q = $q;
        this.$filter = $filter;
        this.ordersService = ordersService;
        this.orderDetailsService = orderDetailsService;
        this.mapProductsService = mapProductsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.orderId = $state.params.orderId;
        this.noImage = 'assets/images/colored/no-image-white.svg';
        this.referringProviderNotes = [];

        this.orderTypes = {
            'prescribed': 1,
            'resupply': 2
        };

        this._activate();
    }

    _activate() {
        const promises = [
            this.ordersService.getOrderDetails(this.orderId),
            this.orderDetailsService.getOrderedItems(this.orderId, { 'paggination.pageSize': 100 })
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'orderPage' });
        return this.$q.all(promises)
            .then((responses) => {
                this.model = angular.copy(responses[0]);
                this.model.Products = responses[1].map((item) => {
                    item = this.mapProductsService.flatProductStructure(item);
                    return item;
                });
                if (_.has(this.model, 'this.model.HospitalDischarge.DischargeFrom')) {
                    this.model.HospitalDischarge.DischargeFrom = moment.utc(this.model.HospitalDischarge.DischargeFrom, 'HH:mm:ss').format('hh:mm A');
                }
                if (_.has(this.model, 'this.model.HospitalDischarge.DischargeTo')) {
                    this.model.HospitalDischarge.DischargeTo = moment.utc(this.model.HospitalDischarge.DischargeTo, 'HH:mm:ss').format('hh:mm A');
                }
                this.setReferringProviderNotes();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));
    }

    getProductComponents(productId) {
        const indexOfProduct = _.findIndex(this.model.Products, (item) => {

            if (item.Product) {
                return item.Product.Id === productId;
            }

            return false;
        });

        if (!this.model.Products[indexOfProduct].Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${productId}` });
            return this.orderDetailsService.getProductBundles(productId)
                .then((response) => {
                    if (response.Items[0].Components && response.Items[0].Components.length) {
                        this.model.Products[indexOfProduct].Components = this._mapComponents(response.Items[0].Components);
                        angular.forEach(this.model.Products, (product) => product.componentsLoaded = true);
                    }
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${productId}` }));
        }
    }

    setReferringProviderNotes() {
        if (this.model.ReferralCard) {
            if (this.model.ReferralCard.ReferringProviderNote) {
                this.referringProviderNotes.push({
                    label: 'Ref provider', labelClass: 'dark-gray', note: this.model.ReferralCard.ReferringProviderNote
                });
            }
            if (this.model.ReferralCard.SalesAgentNote) {
                this.referringProviderNotes.push({
                    label: 'Sales', labelClass: 'blue', note: this.model.ReferralCard.SalesAgentNote
                });
            }
        }
    }

    _mapComponents(components) {
        let mappedComponents = angular.copy(components);

        angular.forEach(mappedComponents, (component) => {
            component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
        });

        return mappedComponents;
    }
}
