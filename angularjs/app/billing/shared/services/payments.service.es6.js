import {
    paymentStatusConstants,
    paymentTypeConstants
} from '../../../core/constants/billing.constants.es6.js';

export default class paymentsService {
    constructor($q,
                $http,
                $filter,
                fileService,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI,
                infinityTableFilterService,
                authService,
                corePatientService,
                billingPaymentService
    ) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.$filter = $filter;
        this.fileService = fileService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.authService = authService;
        this.corePatientService = corePatientService;
        this.billingPaymentService = billingPaymentService;

        this.model = {};
        this.setDefaultModel();
    }

    setDefaultModel() {
        this.model = {
            Type: undefined,
            PayerSource: undefined,
            PatientSource: undefined,
            Method: undefined,
            Amount: {
                Amount: 0,
                Currency: '$'
            },
            Remains: {
                Amount: 0,
                Currency: '$'
            },
            Date: null,
            Reference: '',
            Note: ''
        };
    }

    getModel(paymentId) {
        if (paymentId) {
            return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`)
                .then((response) => {
                    this.model = {
                        Type: response.data.Type.Id,
                        PayerSource: response.data.PayerSource,
                        PatientSource: response.data.PatientSource,
                        Method: response.data.Method.Id,
                        Amount: response.data.Amount,
                        _startedAmount: angular.copy(response.data.Amount),
                        Remains: response.data.Remains,
                        Date: this.$filter('amDateFormat')(this.$filter('amUtc')(response.data.Date), 'MM/DD/YYYY'),
                        Reference: response.data.Reference,
                        Status: response.data.Status,
                        Completed: response.data.Status.Id === paymentStatusConstants.COMPLETED_STATUS_ID,
                        Note: response.data.Notes
                    };
                    return this.model;
                });
        }
        return this.model;

    }

    // TODO remove and use one from billingDictionariesService
    getMethodsDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/methods/dictionary`);
    }

    getPaymentMethodsDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/import-payments/payment-methods/dictionary`);
    }

    getSourceDictionary() {
        return [
            {
                Id: 'Patient',
                Text: 'Patient'
            },
            {
                Id: 'Payer',
                Text: 'Payer'
            }
        ];
    }

    getPayersDictionary(invoiceId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/insurances/dictionary`)
            .then((response) => {
                response.data.map((item) => {
                    return {
                        Id: item.Id,
                        Name: item.Name
                    };
                });
                return response;
            });
    }

    searchPayer(NameOrClaimCode) {
        let params = { NameOrClaimCode };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payers/dictionary`, { params })
            .then((response) => {
                return response.data.Items.map((o) => {
                    return {
                        Id: o.Id,
                        Name: `${o.Name} - ${o.ClaimCode}`
                    };
                });
            });
    }

    searchPatient(fullName) {
        const params = {
            fullName,
            sortExpression: 'Name ASC'
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getPatientShortInfo(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${id}/short-info`);
    }

    // TODO to find out what this dictionary is
    getPaymentsTotalCount() {
        let params = { PageIndex: 0, PageSize: 1 };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/dictionary`, { params });
    }

    getPayments(filter, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filter);

        if (params.Date) {
            params.Date = moment.utc(params.Date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        params = angular.merge(params, { pageSize, pageIndex, sortExpression });

        return this.billingPaymentService.getPayments(params)
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = this.getStatusClass(item.Status.Id));
                return response;
            });
    }

    getStatusClass(paymentStatusId) {
        switch (paymentStatusId) {
            case paymentStatusConstants.NEW_STATUS_ID: // 1
                return 'green';
            case paymentStatusConstants.APPLIED_STATUS_ID: // 2
                return 'blue';
            case paymentStatusConstants.UNAPPLIED_STATUS_ID: // 3
                return 'dark-blue';
            case paymentStatusConstants.FAILED_STATUS_ID: // 4
                return 'red';
            case paymentStatusConstants.COMPLETED_STATUS_ID: // 5
                return 'gray';
            default:
                break;
        }
    }

    savePayment(paymentId, invoiceId) {
        let model = angular.copy(this.model, {});

        model.Amount = this.model.Amount.Amount;
        delete model.Remains;

        if (invoiceId) {
            if (this.model.Type === paymentTypeConstants.PAYER_TYPE_ID) {
                model.ClaimInsuranceId = this.model.PayerSource.Id;
            }
            delete model.PatientSource;
            delete model.PayerSource;

            return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/payments`, model);
        }

        if (paymentId) {
            return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`, model);
        }

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments`, model);
    }

    applyPayment(model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${model.PaymentId}/apply`, model);
    }

    searchPayments(name, hasUnappliedAmount) {
        let params = {
            PageIndex: 0,
            PageSize: 100,
            SourceOrReference: name || '',
            Remains: hasUnappliedAmount ? 0.01 : undefined
        };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/dictionary?sortExpression=Text+ASC`, { params })
            .then((response) => {
                response.data.Items.map((item) => {
                    let date = this.$filter('amDateFormat')(this.$filter('amUtc')(item.Date), 'MM/DD/YYYY hh:mm A');
                    let shortRef = item.Reference ? `| ${item.Reference} ` : '';
                    let longRef = item.Reference ? `| Ref. Number: ${item.Reference} ` : '';
                    let amount = `${item.Amount.Currency} ${item.Amount.Amount}`;

                    if (item.PatientSource) {
                        let name = this.$filter('fullname')(item.PatientSource.Name);
                        let birth = this.$filter('amDateFormat')(this.$filter('amUtc')(item.PatientSource.DateOfBirth), 'MM/DD/YYYY');

                        item.shortName = `${name} (${birth}) | ${date} ${shortRef} | ${amount}`;
                        item.longName = `Name: ${name} (${birth}) | Date: ${date} ${longRef} | Payment Amount: ${amount}`;
                    } else {
                        item.shortName = `${item.PayerSource.Name} | ${date} ${shortRef} | ${amount}`;
                        item.longName = `Payer: ${item.PayerSource.Name} | Date: ${date} ${longRef} | Payment Amount: ${amount}`;
                    }

                    return item;
                });
                return response;
            });
    }

    getPaymentDetails(paymentId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`)
            .then((response) => {
                let info = response.data;

                if (info.PatientSource) {
                    info.Source = `${info.PatientSource.Name.FirstName} ${info.PatientSource.Name.LastName}`;
                } else if (info.PayerSource) {
                    info.Source = info.PayerSource.Name;
                }
                if (info.ServiceLines && info.ServiceLines.length) {
                    info.ServiceLines.forEach((line) => mapPaymentServiceLines(line));
                }
                response.data.StatusClass = this.getStatusClass(response.data.Status.Id);
                return response;
            });

        function mapPaymentServiceLines(line) {
            line.isPaymentLine = true;
            line.Amount = {
                Currency: line.TransactionAmount.Currency,
                Amount: line.TransactionAmount.Amount
            };
            line.Adjustments = [];
            line.TotalAmounts = {
                Charged: {
                    Currency: line.ChargeAmount ? line.ChargeAmount.Currency.Symbol : '',
                    Amount: line.ChargeAmount ? line.ChargeAmount.Amount : 0
                },
                Balance: {
                    Currency: line.BalanceAmount ? line.BalanceAmount.Currency.Symbol : '',
                    Amount: line.BalanceAmount ? line.BalanceAmount.Amount : 0
                },
                Payments: {
                    Currency: line.PaymentAmount ? line.PaymentAmount.Currency.Symbol : '',
                    Amount: line.PaymentAmount ? line.PaymentAmount.Amount : 0
                },
                Adjustments: {
                    Currency: line.PaymentAmount ? line.PaymentAmount.Currency.Symbol : '',
                    Amount: 0
                }
            };
        }
    }

    getTransactionRawX12(transactionId, payerName) {
        return this.$http({
            url: `${this.WEB_API_BILLING_SERVICE_URI}v1/transactions/${transactionId}/raw-x12`,
            method: 'GET',
            responseType: 'blob'
        })
        .then((response) => {
            download(
                response.data,
                `${payerName}_${moment().format('MM-DD-YYYY hh-mm-ss A')}_.ARA`,
                'application/octet-stream'
            );
        });
    }

    openEobDocument(documentId) {
        const url = `${this.WEB_API_BILLING_SERVICE_URI}v1/documents/${documentId}`;

        return this.fileService.openFileOnTab({ url });
    }

    getEobEraByInvoice(PageIndex, PageSize, claimId) {
        let params = { PageIndex, PageSize };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/eob`, { params });
    }

    connectPaymentToServiceLine(paymentId, connectedServiceLineId, ClaimId, ServiceLineId) {
        let data = { ClaimId, ServiceLineId };

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}/v1/payments/${paymentId}/failed-lines/${connectedServiceLineId}/connect`, data);
    }

    getPatientCreditCards(patientId, billingProviderId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${billingProviderId}/patients/${patientId}/credit-cards`);
    }

    // TODO - move to Patient (used only in patientCollectPaymentController in Patients module)
    getCollectMethodsDictionary() {
        return [
            {
                Id: 4,
                Name: 'Use Saved Credit Card'
            },
            {
                Id: 3,
                Name: 'Use New Credit Card'
            },
            {
                Id: 1,
                Name: 'Cash'
            },
            {
                Id: 2,
                Name: 'Check'
            }
        ];
    }

    collectPayment(model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/collect`, model);
    }

    printPayment(paymentId, pagetitle) {
        let token = this.authService.getAccessToken();
        let defer = this.$q.defer();
        let xhr = new XMLHttpRequest();

        xhr.open('GET', `${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}/print`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-type', 'application/pdf; charset=utf-8');
        xhr.responseType = 'blob';

        xhr.onload = () => {
            let file = new Blob([xhr.response], { type: 'application/pdf' });
            let fileURL = URL.createObjectURL(file);

            if (xhr.statusText.toLowerCase() === 'ok' || xhr.status === 200) {
                this.fileService.open(fileURL, pagetitle);
            }

            defer.resolve();
        };
        xhr.onerror = function() {
            defer.reject();
        };

        xhr.send();
        return defer.promise;
    }

    emailPayment(paymentId, Address) {
        let model = { Address };

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}/email`, model);
    }
}
