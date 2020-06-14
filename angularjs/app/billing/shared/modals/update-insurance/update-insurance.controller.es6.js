export default class updateInsuranceModalController {
    constructor($mdDialog, infinityTableService, bsLoadingOverlayService, invoicesService, invoiceId, patientId) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.infinityTableService = infinityTableService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.invoiceId = invoiceId;
        this.patientId = patientId;

        this.getInsurances = (pageIndex, pageSize) => invoicesService.getInsurances(patientId,  { pageIndex, pageSize, State: 'All' })
          .then((data) => {
              data.data.Items.forEach((item) => {
                  item.isSelected = !item.Archived;
                  item.statusClass = this.getStatusClass(item);
              });
              return data;
          });
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        this.infinityTableService.toggleItem(item);
    }

    getStatusClass(item) {
        if (item.Archived) {
            return 'gray';
        }
        switch (Number(item.Status.Id)) {
            case 1: // active
                return 'green';
            case 2: // Inactive
                return 'dark-blue';
            case 3: // Review
                return 'orange';
            case 4: // Failed
                return 'red';
            default:
                return 'gray';
        }
    }

    getSelectedItems() {
        return this.infinityTableService.getSelectedItems() || [];
    }

    save() {
        const items = this.getSelectedItems();
        const insuranceIds = items.map((item) => item.Id);
        this.bsLoadingOverlayService.start({ referenceId: 'updateInsurance' });
        this.invoicesService.updateInsurances(insuranceIds, this.invoiceId, this.patientId)
          .then(() => {
              this.$mdDialog.hide();
          })
          .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'updateInsurance' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
