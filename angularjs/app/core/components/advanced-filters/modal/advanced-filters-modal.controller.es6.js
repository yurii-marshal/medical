export default class advancedFiltersModalCtrl {
    constructor($mdDialog,
                ngToast,
                bsLoadingOverlayService,
                advancedFiltersService,
                calendarEventsService,
                options,
                resetAllInModal,
                revertAllInModal,
                isSaveFilter) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.advancedFiltersService = advancedFiltersService;
        this.calendarEventsService = calendarEventsService;
        this.options = options;
        this.resetAllInModal = resetAllInModal;
        this.revertAllInModal = revertAllInModal;
        this.isSaveFilter = isSaveFilter;
    }

    applyFilters() {
        if (this.advancedFiltersForm.$invalid) {
            touchedErrorFields(this.advancedFiltersForm);
            return;
        }

        if (this.needToSave) {
            this.advancedFiltersService.mapFilterObject(this.options);
            this.filters = this.advancedFiltersService.getSearchFilters();

            if (_.isEmpty(this.filters)) {
                this.ngToast.warning('Please select at least one filter.');
                return;
            } else {
                this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
                this.calendarEventsService.getSavedFilters({ name: this.newFilterName })
                    .then((response) => {
                        let filterId;
                        response.data.Items.forEach((item) => {
                            if (item.Name === this.newFilterName) { filterId = item.Id; }
                        });

                        return this.calendarEventsService.saveFilter(this.options, this.filters, this.newFilterName, filterId)
                            .then((response) => this.$mdDialog.hide(this.newFilterName));
                    })
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }))
            }
        } else {
            this.$mdDialog.hide(this.options);
        }
    }

    resetAll(filters) {
        this.resetAllInModal(filters);
        if (this.advancedFiltersForm.$invalid) {
            touchedErrorFields(this.advancedFiltersForm);
        }
    }

    cancel() {
        this.revertAllInModal();
        this.$mdDialog.cancel();
    }
}

