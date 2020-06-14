export default class printLocationLabelsController {
    constructor($state, $timeout, inventoryLocationsService, bsLoadingOverlayService) {
        'ngInject';

        this.labelArray = [];

        this.$timeout = $timeout;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        if ($state.params.model) {
            bsLoadingOverlayService.start({ referenceId: 'printLabels' });
            inventoryLocationsService.generateLabels(JSON.parse($state.params.model))
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
