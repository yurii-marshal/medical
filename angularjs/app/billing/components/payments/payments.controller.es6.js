import { paymentTypeConstants } from '../../../core/constants/billing.constants.es6.js';
export default class paymentsController {
    constructor(
        $rootScope,
        $state,
        ngToast,
        infinityTableService,
        paymentsService,
        billingPaymentService,
        billingDictionariesService
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.paymentsService = paymentsService;
        this.billingPaymentService = billingPaymentService;
        this.billingDictionariesService = billingDictionariesService;

        this.paymentTypeConstants = paymentTypeConstants;

        this.sortExpr = {};
        this.filter = {};
        this.cacheFiltersKey = 'payments';
        this.methodsDictionary = [];
        this.statuses = [];

        billingDictionariesService.getMethodsDictionary()
            .then((response) => this.methodsDictionary = response.data);

        billingDictionariesService.getPaymentsStatuses()
            .then((response) => this.statuses = response.data);

        this.getPayments = (pageIndex, pageSize) => {
            return paymentsService.getPayments(this.filter, this.sortExpr, pageIndex, pageSize);
        };


    }

    paymentDetails(paymentId) {
        if (paymentId) {
            this.$state.go('root.paymentDetails', { paymentId });
        }
    }

    deletePayment(payment) {
        if (!payment || !payment.Id) {
            return;
        }

        this.billingPaymentService.deletePayment(payment.Id)
            .then(() => {
                this.ngToast.success('Payment deleted');
                this.infinityTableService.deleteRowById(payment.guid);
                this.$rootScope.$broadcast('reloadPaymentsCount');
            });
    }
}

