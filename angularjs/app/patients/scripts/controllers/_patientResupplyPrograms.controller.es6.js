export default class patientResupplyProgramsController {
    constructor($state, patientResupplyProgramsService, bsLoadingOverlayService) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientResupplyProgramsService = patientResupplyProgramsService;

        this.patientId = $state.params.patientId;
        this.programs = [];
        this.resupplyProgramsLoaded = false;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientResupplyPrograms' });
        this.patientResupplyProgramsService.getPatientResupplyPrograms(this.patientId)
            .then((response) => {
                if (response && response.data) {
                    this.programs = response.data;
                }
                this.resupplyProgramsLoaded = true;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientResupplyPrograms' }))
    }

    expandRelatedOrders(program) {
        if (!program.orders) {
            this.bsLoadingOverlayService.start({ referenceId: `orders-${program.ResupplyProgramId}` });
            this.patientResupplyProgramsService.getResupplyProgramRelatedOrders(this.patientId, program.ResupplyProgramId)
                .then((response) => {
                    program.orders = response.data;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `orders-${program.ResupplyProgramId}` }))
        }
    }

    toOrdersHistory(resupplyProgramId, orderName) {
        this.$state.go('root.orders.list', { resupplyProgramId, orderName });
    }
}
