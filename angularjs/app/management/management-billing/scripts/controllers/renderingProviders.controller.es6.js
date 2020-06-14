export default class renderingProvidersController {
    constructor(
        $state,
        $mdDialog,
        ngToast,
        infinityTableService,
        renderingProvidersService
      ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.renderingProvidersService = renderingProvidersService;

        this.cacheFiltersKey = 'management-rendering-providers';

        this.filter = {};
        this.sortExpr = {};
        this.typesDictionary = [];

        this.getRenderingProviders = (pageIndex, pageSize) => {
            return renderingProvidersService.getRenderingList(this.filter, this.sortExpr, pageIndex, pageSize);
        };

        renderingProvidersService.getRenderingTypeDictionary()
            .then(response => this.typesDictionary = response.data);
    }

    editRenderingProvider(providerId) {
        this.$state.go('root.management.billing.rendering.edit', { providerId });
    }

    deleteRenderingProvider(Id) {
        return this.renderingProvidersService.deleteRenderingProvider(Id)
            .then(response => {
                this.infinityTableService.reload();
                this.ngToast.success('Rendering is deleted');
            });
    }
}
