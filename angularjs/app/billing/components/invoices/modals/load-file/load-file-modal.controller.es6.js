export default class loadFileModalController {
    constructor(
        $mdDialog,
        documentUpdateService,
        billingClaimsService,
        buttonText,
        totalCount,
        jobId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.documentUpdateService = documentUpdateService;
        this.billingClaimsService = billingClaimsService;
        this.buttonText = buttonText;
        this.jobId = jobId;
        this.statusCounter = {
            processedCount: 0,
            totalCount
        };
        this.isLoading = true;
        this.isFailed = false;
        this.modalClosed = false;
        this.downloadingFile = false;
        this.errors = [];

        let requestsLimit = 200;
        let requestsCounter = 0;

        const checkJobAndGetFile = () => {
            requestsCounter++;

            setTimeout(() => {
                this.billingClaimsService.checkJobStatus(jobId).then((response) => {
                    this.result = response.data;
                    const status = this.result.State.Status.Id;

                    if (status === 'Success') {

                        this.isLoading = false;
                    } else if ((status === 'InProgress' || status === 'New') &&
                        requestsLimit >= requestsCounter &&
                        !this.modalClosed) {

                        if (this.result.State.Progress) {
                            this.statusCounter.processedCount = this.result.State.Progress.ProcessedCount;
                        }
                        checkJobAndGetFile();
                    } else if (status === 'Failed') {

                        this.isFailed = true;
                        this.isLoading = false;
                        this.errors = this.result.State.Errors;
                    }

                });
            }, 5000);
        };

        checkJobAndGetFile();
    }

    close() {
        this.billingClaimsService.cancelJob(this.jobId)
            .then(() => {
                this.modalClosed = true;
                this.$mdDialog.cancel();
            });
    }

    downloadFile() {
        if (this.isLoading) {
            return;
        }
        this.downloadingFile = true;

        this.documentUpdateService.openFileByJobId(this.jobId).finally(() => {
            this.downloadingFile = false;
        });
    }
}
