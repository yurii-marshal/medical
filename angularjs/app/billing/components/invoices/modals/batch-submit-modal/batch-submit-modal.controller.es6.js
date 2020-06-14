export default class batchSubmitModalController {
    constructor(
        $mdDialog,
        billingClaimsService,
        totalCount,
        jobId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.billingClaimsService = billingClaimsService;
        this.jobId = jobId;
        this.statusCounter = {
            processedCount: 0,
            totalCount
        };
        this.isLoading = true;
        this.isCloseMode = false;

        let requestsLimit = 200;
        let requestsCounter = 0;

        const checkJobStatus = () => {
            requestsCounter++;

            setTimeout(() => {
                this.billingClaimsService.checkJobStatus(jobId).then((response) => {
                    const status = response.data.State.Status.Id;

                    if (status === 'Success' || status === 'Failed') {
                        this.billingClaimsService.checkModelJobStatus(jobId).then((response) => {
                            this.$mdDialog.hide(response);
                            this.isLoading = false;
                        });
                    } else if ((status === 'InProgress' || status === 'New') &&
                        requestsLimit >= requestsCounter) {

                        if (response.data.State.Progress) {
                            this.statusCounter.processedCount = response.data.State.Progress.ProcessedCount;
                        }
                        checkJobStatus();
                    }

                });
            }, 5000);
        };

        checkJobStatus();
    }

    changeModalCloseMode(isCloseMode) {
        this.isCloseMode = isCloseMode;
    }

    close() {
        this.billingClaimsService.cancelJob(this.jobId)
            .then(() => {
                this.$mdDialog.cancel();
            });
    }
}
