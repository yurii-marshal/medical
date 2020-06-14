import {
    paymentStatusConstants,
    paymentTypeConstants
} from '../../../core/constants/billing.constants.es6';
import { mapPaymentInvoiceForServer } from './payment-map-utils.es6';
import { mapPaymentAdjustmentForServer } from './payment-map-utils.es6';
import {
    calcFloatDiff,
    calcFloatSum
} from '../../../core/helpers/math-operations.helper.es6';

export default class PaymentService {
    constructor(
        $http,
        billingPaymentService,
        billingDictionariesService,
        corePatientService,
        paymentsService
    ) {
        'ngInject';

        this.$http = $http;

        this.billingDictionariesService = billingDictionariesService;
        this.billingPaymentService = billingPaymentService;
        this.paymentTypeConstants = paymentTypeConstants;
        this.paymentStatusConstants = paymentStatusConstants;
        this.corePatientService = corePatientService;
        this.paymentsService = paymentsService;

        this.model = this.initNewModel();
    }

    getModel() {
        return this.model;
    }

    getPayment(paymentId) {
        return this.billingPaymentService.getPayment(paymentId).then((response) => {
            this.model = response.data;

            if (!this.model.AdjustmentAmount) {
                this.model.AdjustmentAmount = {
                    Currency: '$',
                    Amount: 0
                };
            }

            if (!this.model.Unapplied) {
                this.model.Unapplied = {
                    Currency: '$',
                    Amount: 0
                };
            }

            if (!this.model.ProviderLevelAdjustments) {
                this.model.ProviderLevelAdjustments = [];
            }

            this.model.Invoices.forEach((invoice) => {
                invoice.PR = invoice.PR || { Currency: '$', Amount: null };
                invoice.Balance = invoice.Balance || { Currency: '$', Amount: null };
                invoice.Charge = invoice.Charge || { Currency: '$', Amount: null };

                invoice.ValidationKey = guid();

                if (!invoice.Adjustments) {
                    invoice.Adjustments = [];
                }

                invoice.Services.forEach((service) => {
                    service.Allowed = service.Allowance || { Currency: '$', Amount: null };
                    service.Balance = service.Balance || { Currency: '$', Amount: null };
                    service.Charge = service.Charge || { Currency: '$', Amount: null };

                    service.ValidationKey = guid();
                });
            });

            this.model.Date = moment(this.model.Date).format('MM/DD/YYYY');
            this.model.Status.statusClass = this.paymentsService.getStatusClass(this.model.Status.Id);

            this.model.Completed = this.model.Status.Id === this.paymentStatusConstants.COMPLETED_STATUS_ID;

            this.model.ProviderLevelAdjustments.forEach((adjustment) => {
                adjustment.Date = moment(adjustment.Date).format('MM/DD/YYYY');
            });

            return response;
        });
    }

    initNewModel() {
        return {
            Source: {
                SourceType: {
                    Id: null,
                    Name: null,
                    Code: null
                },
                Insurance: null,
                Patient: null
            },
            Date: null,
            PaymentAmount: {
                Amount: null,
                Currency: '$'
            },
            AdjustmentAmount: {
                Amount: 0,
                Currency: '$'
            },
            Total: {
                Amount: 0,
                Currency: '$'
            },
            Unapplied: {
                Amount: 0,
                Currency: '$'
            },
            Method: null,
            Reference: null,
            Notes: null,
            Status: null,
            Completed: false,
            Legacy: false,
            ProviderLevelAdjustments: [
                // {
                //     Amount: {
                //         Amount: 0,
                //         Currency: '$'
                //     },
                //     ProviderRefId: '-',
                //     Date: '2018-10-08T10:57:30.750Z',
                //     PLBCode: {
                //         Id: null,
                //         Name: '-',
                //         Description: null
                //     },
                //     Description: 'description'
                // }
            ],
            Invoices: [
                // {
                //     DisplayId: 'IN-009E56FE',
                //     InvoiceId: 'INe62d1f847d2a4732848da96e009e56fe',
                //     Coverage: null,
                //     Status: {
                //         Id: 'Hold',
                //         Name: 'Hold',
                //         Code: null
                //     },
                //     Customer: {
                //         DisplayId: 'PT-10000055',
                //         DateOfBirthday: '1957-12-20T00:00:00',
                //         Name: {
                //             FullName: 'Alice Burton',
                //             First: 'Alice',
                //             Last: 'Burton'
                //         },
                //         Id: 10000055
                //     },
                //     Charge: {
                //         Amount: 80.00000,
                //         Currency: '$'
                //     },
                //     Balance: {
                //          Amount: 80,
                //          Currency: '$'
                //     },
                //     Paid: {
                //         Amount: 0,
                //         Currency: '$'
                //     },
                //     PR: {
                //         Amount: 0,
                //         Currency: '$'
                //     },
                //     RemarkCodes: [],
                //     Adjustments: [
                //         {
                //             Amount: {
                //                 Amount: 1,
                //                 Currency: '$'
                //             },
                //             Group: {
                //                 Id: null,
                //                 Name: 'CR Correction and Reversals',
                //                 Code: '12'
                //             },
                //             Reason: {
                //                 Id: null,
                //                 Name: '12 - Authorization Number',
                //                 Description: ''
                //             }
                //         }
                //     ],
                //     Services: [
                //         {
                //             ServiceId: 'IS6f51e50cc41d4825af52a96e009e570b',
                //             ServicePeriod: {
                //                 From: '2018-10-03T00:00:00',
                //                 To: '2018-10-03T00:00:00'
                //             },
                //             HcpcsCode: 'A0021',
                //             Name: 'Durable medical equipment mi',
                //             Modifiers: {
                //                 Level1: null,
                //                 Level2: null,
                //                 Level3: null,
                //                 Level4: null
                //             },
                //             Quantity: 1,
                //             Charge: {
                //                 Amount: 80.00000,
                //                 Currency: '$'
                //             },
                //             Balance: {
                //                 Amount: 80,
                //                 Currency: '$'
                //             },
                //             Paid: {
                //                 Amount: 50.0,
                //                 Currency: '$'
                //             },
                //             Notes: null,
                //             Adjustments: [
                //                 {
                //                     Amount: {
                //                         Amount: 0,
                //                         Currency: '$'
                //                     },
                //                     Group: {
                //                         Id: null,
                //                         Name: 'CR Correction and Reversals',
                //                         Code: '12'
                //                     },
                //                     Reason: {
                //                         Id: null,
                //                         Name: '12 - Authorization Number',
                //                         Description: ''
                //                     }
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
        };
    }

    mapToCreateModel(model) {
        const outModel = {};

        outModel.Source = {
            SourceType: model.Source.SourceType.Id
        };

        if (model.Source.SourceType.Id === this.paymentTypeConstants.PATIENT_TYPE_ID) {
            outModel.Source.PatientId = model.Source.Patient.Id;
        } else {
            outModel.Source.InsuranceId = model.Source.Insurance.Id;
        }

        outModel.Details = {
            Date: model.Date,
            Amount: model.PaymentAmount.Amount,
            Method: model.Method.Id,
            Reference: model.Reference,
            Notes: model.Notes,
            Legacy: model.Legacy
        };

        outModel.MarkAsCompleted = model.Completed;

        if (model.ProviderLevelAdjustments) {
            outModel.ProviderLevelAdjustments = model.ProviderLevelAdjustments.map((adjustment) => {
                return mapPaymentAdjustmentForServer(adjustment);
            });
        }

        if (model.Invoices) {
            outModel.Invoices = model.Invoices.map((invoice) => {
                return mapPaymentInvoiceForServer(invoice, model.Source.SourceType.Id, false);
            });
        }

        return outModel;
    }

    mapToUpdateModel(model) {
        const outModel = {
            Details: {
                Date: model.Date,
                Amount: model.PaymentAmount.Amount,
                Method: model.Method.Id,
                Reference: model.Reference,
                Notes: model.Notes,
                Legacy: model.Legacy
            },
            MarkAsCompleted: model.Completed
        };

        outModel.SourceType = model.Source.SourceType.Id;

        if (model.ProviderLevelAdjustments) {
            outModel.ProviderLevelAdjustments = model.ProviderLevelAdjustments.map((adjustment) => {
                return mapPaymentAdjustmentForServer(adjustment);
            });
        }

        outModel.AddedInvoices = [];
        outModel.UpdatedInvoices = [];

        model.Invoices.forEach((invoice) => {
            if (invoice.Id) {
                outModel.UpdatedInvoices.push(mapPaymentInvoiceForServer(invoice, outModel.SourceType, true));
            } else {
                outModel.AddedInvoices.push(mapPaymentInvoiceForServer(invoice, outModel.SourceType, false));
            }
        });

        return outModel;
    }

    getMethodsDictionary() {
        return this.billingDictionariesService.getMethodsDictionary();
    }

    getSourceDictionary() {
        return [
            {
                Id: 'Patient',
                Text: 'Patient'
            },
            {
                Id: 'Insurance',
                Text: 'Payer'
            }
        ];
    }

    searchPatient(fullName) {
        let params = {
            fullName,
            sortExpression: 'Name ASC'
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getRemarksCodes(name) {
        const params = {
            Text: name
        };

        return this.billingDictionariesService.getRemarksCodes(params);
    }

    getCoveragesDictionary() {
        return this.billingDictionariesService.getCoveragesDictionary();
    }

    createPayment(model) {
        this.determineAdd_OA_23_Adjustment(model);

        return this.billingPaymentService.createPayment(this.mapToCreateModel(model));
    }

    updatePayment(model, paymentId) {
        this.determineAdd_OA_23_Adjustment(model);

        return this.billingPaymentService.updatePayment(this.mapToUpdateModel(model), paymentId);
    }

    determineAdd_OA_23_Adjustment(model) {

        model.Invoices.forEach((invoice) => {

            if (invoice.Coverage && invoice.Coverage.Id !== 'Primary') {
                invoice.Services.forEach((service) => {
                    let hasOA23 = false;

                    let sumOfAjustment = service.Adjustments.reduce((acc, adjustment) => {

                        if (adjustment.Reason.Id === '23' && adjustment.Group.Id === 'OA') {
                            hasOA23 = true;
                        }

                        return calcFloatSum(acc, adjustment.Amount.Amount);
                    }, 0);

                    if (calcFloatSum(sumOfAjustment, service.Paid.Amount) === service.Balance.Amount &&
                        !hasOA23 &&
                        calcFloatDiff(service.Charge.Amount, service.Balance.Amount) > 0
                    ) {
                        service.Adjustments.push({
                            Amount: {
                                Amount: calcFloatDiff(service.Charge.Amount, service.Balance.Amount),
                                Currency: '$'
                            },
                            Group: {
                                Id: 'OA',
                                Code: 'OA',
                                Name: 'Other Adjustments'
                            },
                            Reason: {
                                Id: '23',
                                Name: '23',
                                Description: 'The impact of prior payer(s) adjudication including payments and/or adjustments. (Use only with Group Code OA)'
                            }
                        });
                    }
                });
            }
        });
    }

    payOffForServiceLine(serviceLine, unappliedAmount) {

        if (!serviceLine.ServiceId) {
            return unappliedAmount;
        }

        if (unappliedAmount > serviceLine.Balance.Amount &&
            serviceLine.Balance.Amount > 0) {

            serviceLine.Paid.Amount = serviceLine.Balance.Amount;
            unappliedAmount = calcFloatDiff(unappliedAmount, serviceLine.Balance.Amount);
        } else if (unappliedAmount <= serviceLine.Balance.Amount && unappliedAmount > 0) {

            serviceLine.Paid.Amount = unappliedAmount;
            unappliedAmount = 0;
        } else {
            serviceLine.Paid.Amount = 0;
        }

        return unappliedAmount;
    }

    payOffForInvoice(invoice, unappliedAmount) {

        if (!invoice.InvoiceId) {
            return unappliedAmount;
        }

        invoice.Services.forEach((service) => {
            unappliedAmount = this.payOffForServiceLine(service, unappliedAmount);
        });

        invoice.Paid.Amount = invoice.Services.reduce((acc, service) => {
            return service.Paid.Amount ? calcFloatSum(service.Paid.Amount, acc) : acc;
        }, 0);

        return unappliedAmount;
    }

    calculateUnappliedAmount(paymentModel) {
        const appliedAmount = paymentModel.Invoices.reduce((acc, invoice) => {

            if (invoice.InvoiceId &&
                typeof invoice.Paid.Amount === 'number'
            ) {
                return calcFloatSum(acc, invoice.Paid.Amount);
            }

            return acc;
        }, 0);

        const totalAmount = this.getTotalAmount(paymentModel);

        const unappliedSum = (totalAmount - appliedAmount).toFixed(2);

        paymentModel.Unapplied.Amount = isNaN(unappliedSum) ? totalAmount : unappliedSum;

        return paymentModel.Unapplied.Amount || 0;
    }

    getTotalAmount(paymentModel) {
        if (this.paymentTypeConstants.PAYER_TYPE_ID === paymentModel.Source.SourceType.Id) {
            paymentModel.Total.Amount = this.getFloatSum(paymentModel.PaymentAmount.Amount, paymentModel.AdjustmentAmount.Amount);
        } else {
            paymentModel.Total.Amount = paymentModel.PaymentAmount.Amount || 0;

            return paymentModel.Total.Amount;
        }

        return paymentModel.Total.Amount;
    }

    getFloatSum(a, b) {
        const sum = calcFloatSum(a, b);

        return isNaN(sum) ? 0 : sum;
    }
}
