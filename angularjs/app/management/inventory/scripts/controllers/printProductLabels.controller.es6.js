export default class printProductLabelsController {
    constructor($state, $timeout, inventoryProductsService, bsLoadingOverlayService) {
        'ngInject';

        this.$state = $state;
        this.$timeout = $timeout;
        this.inventoryProductsService = inventoryProductsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.labelArray = [];

        if ($state.params.model) {
            bsLoadingOverlayService.start({ referenceId: 'printLabels' });
            inventoryProductsService.generateLabels(JSON.parse($state.params.model))
                .then((response) => {
                    this.labelArray = response.data;
                });
        } else {
            $state.go('root.location-labels');
        }
    }

    onFinishRepeatElements() {
        this.$timeout(() => {
            window.print();
            this.bsLoadingOverlayService.stop({ referenceId: 'printLabels' });
        }, this.labelArray.length);

    }
}
