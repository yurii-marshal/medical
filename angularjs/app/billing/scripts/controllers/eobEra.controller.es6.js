import { importPaymentStatusConstants } from '../../../core/constants/billing.constants.es6';

export default class eobEraController {
    constructor($q, ngToast, paymentsService, eobEraService) {
        'ngInject';

        this.ngToast = ngToast;
        this.paymentsService = paymentsService;
        this.eobEraService = eobEraService;

        this.importPaymentStatusConstants = importPaymentStatusConstants;

        this.sortExpr = {};
        this.statuses = [
            importPaymentStatusConstants.FAILED_STATUS_ID,
            importPaymentStatusConstants.PROCESSED_STATUS_ID
        ];
        this.filter = {};
        this.cacheFiltersKey = 'eob-era';
        this.methodsDictionary = [];

        let promises = [];

        promises.push(paymentsService.getPaymentMethodsDictionary());

        $q.all(promises)
            .then((data) => {
                this.methodsDictionary = data[0] ? data[0].data : [];
            });

        this.getTransactions = (pageIndex, pageSize) => {
            return eobEraService.getTransactionPayments(this.filter, this.sortExpr, pageIndex, pageSize);
        };
    }

    openEob(item) {
        if (!item.DocumentId) {
            this._documentGenerationErrorMsg();
        } else {

            item.isEobLoading = true;

            this.paymentsService.openEobDocument(item.DocumentId).then(() => {
                item.isEobLoading = false;
            });
        }
    }

    openEra(item) {
        if (!item.TransactionId) {
            this._documentGenerationErrorMsg();
        } else {
            item.isEraLoading = true;
            return this.paymentsService.getTransactionRawX12(item.TransactionId, item.PayerName)
                .finally(() => item.isEraLoading = false);
        }
    }

    _documentGenerationErrorMsg() {
        this.ngToast.danger('Failed to generate a document!');
    }

    openSelectPayerModal(importPaymentId) {
        this.eobEraService.openSelectPayerModal(importPaymentId);
    }


}
