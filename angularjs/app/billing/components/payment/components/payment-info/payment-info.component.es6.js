import template from './payment-info.component.html';
import {
    paymentStatusConstants,
    paymentTypeConstants
} from '../../../../../core/constants/billing.constants.es6';

import providerAdjustModalController from '../../modals/provider-adjust-modal/provider-adjust-modal.controller.es6';
import providerAdjustModalTemplate from '../../modals/provider-adjust-modal/provider-adjust-modal.html';

import confirmModalController from '../../modals/confirm-modal/confirm.controller.es6';
import confirmModalTemplate from '../../modals/confirm-modal/confirm.html';

import { calcFloatSum } from '../../../../../core/helpers/math-operations.helper.es6';

class PaymentInfoCtrl {
    constructor(
        $mdDialog,
        billingsCommonService,
        paymentService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.paymentService = paymentService;
        this.billingsCommonService = billingsCommonService;
        this.paymentTypeConstants = paymentTypeConstants;
        this.paymentStatusConstants = paymentStatusConstants;

        this.paymentService.getMethodsDictionary()
            .then((response) => {
                this.methodsDictionary = response.data;
            });

        this.methodsDictionary = [];

        this.sourceDictionary = this.paymentService.getSourceDictionary();

        this.savePrevPatientState = { Id: null };
        this.savePrevPayerState = { Id: null };

        this.legacyPaymentHint = 'By marking a legacy payment, the payment details will not reflect in the A/R report unapplied calculation. (i.e. The payment received in NikoHealth has been accounted for in another system and you do not wish this payment to reflect in an unapplied status for reporting purposes.)';

        this.providerLevelHint = 'Provider-Level Adjustment (PLB) reason codes describe adjustments the payer makes at the provider level, instead of a specific claim or service line. Some examples of a provider-level adjustments include:' +
            '<ul>' +
            '<li>An increase in payment for interest due as a result of late payment of a claim</li>' +
            '<li>A deduction from payment as a result of prior overpayment</li>' +
            '</ul>' +
            'Provider level adjustments can increase or decrease the transaction payment amount and is not always associated with a specific claim but must be used to balance the transaction.';
    }

    searchPayerSource(name) {
        return this.billingsCommonService.searchBillingPayers(name)
            .then((response) => response.data.Items);
    }

    searchPatient(name) {
        return this.paymentService.searchPatient(name)
            .then((response) => response.data.Items);
    }

    showAdjustModal(index) {
        const isEdit = index !== undefined;
        const adjustment = isEdit ? this.paymentModel.ProviderLevelAdjustments[index] : null;

        this.$mdDialog.show({
            template: providerAdjustModalTemplate,
            controller: providerAdjustModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                isEdit,
                adjustment
            }
        })
        .then((response) => {

            if (isEdit) {
                this.paymentModel.ProviderLevelAdjustments[index] = response[0];
            } else {
                this.paymentModel.ProviderLevelAdjustments = _.concat(this.paymentModel.ProviderLevelAdjustments, response);
            }

            this.calcAdjustAmount();
        });
    }

    deleteAdjustment(index) {
        this.paymentModel.ProviderLevelAdjustments.splice(index, 1);
        this.calcAdjustAmount();
    }

    calcAdjustAmount() {
        this.paymentModel.AdjustmentAmount.Amount = this.paymentModel.ProviderLevelAdjustments.reduce((acc, adjustment) => {
            return calcFloatSum(acc, adjustment.Amount.Amount);
        }, 0);
    }

    getTotalAmount() {
        return this.paymentService.getTotalAmount(this.paymentModel); // this.paymentModel.Total.Amount;
    }

    getUnappliedAmount() {
        return this.paymentService.calculateUnappliedAmount(this.paymentModel);
    }

    onChangePayer(newPayer) {
        if (newPayer instanceof Object &&
            this.savePrevPayerState instanceof Object &&
            this.savePrevPayerState.Id !== newPayer.Id) {

            let itHasNewInvoices = !!this.paymentModel.Invoices.length;

            if (this.savePrevPayerState.Id !== null && itHasNewInvoices) {
                this.$mdDialog.show({
                    template: confirmModalTemplate,
                    controller: confirmModalController,
                    controllerAs: '$ctrl',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    locals: {
                        text: 'By changing the selected payer any payment information entered at this time will not be saved.'
                    }
                })
                    .then((response) => {
                        if (response.confirm) {
                            this.paymentModel.Invoices = [];
                            this.savePrevPayerState = newPayer;
                        } else {
                            this.paymentModel.Source.Insurance = this.savePrevPayerState;
                        }
                    });
            } else {
                this.savePrevPayerState = newPayer;
            }
        }
    }

    onChangePatient(newPatient) {
        if (newPatient instanceof Object &&
            this.savePrevPatientState instanceof Object &&
            this.savePrevPatientState.Id !== newPatient.Id) {

            let itHasNewInvoices = !!this.paymentModel.Invoices.length;

            if (this.savePrevPatientState.Id !== null && itHasNewInvoices) {
                this.$mdDialog.show({
                    template: confirmModalTemplate,
                    controller: confirmModalController,
                    controllerAs: '$ctrl',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    locals: {
                        text: 'By changing the selected payer any payment information entered at this time will not be saved.'
                    }
                })
                    .then((response) => {
                        if (response.confirm) {
                            this.paymentModel.Invoices = [];
                            this.savePrevPatientState = newPatient;
                        } else {
                            this.paymentModel.Source.Patient = this.savePrevPatientState;
                        }
                    });
            } else {
                this.savePrevPatientState = newPatient;
            }
        }

    }

    changeSource(currentSourceId, prevSourceId) {
        let itHasChangedData = false;

        Object.keys(this.parentForm).forEach((keyName) => {

            if (!keyName.match(/^\$/) &&
                keyName !== 'source' &&
                (
                    this.parentForm[keyName].$dirty ||
                    !this.parentForm[keyName].$isEmpty(this.parentForm[keyName].$viewValue)
                )
            ) {
                itHasChangedData = true;
            }

        });

        if (!prevSourceId ||
            currentSourceId === prevSourceId ||
            !itHasChangedData
        ) {
            return ;
        }

        this.$mdDialog.show({
            template: confirmModalTemplate,
            controller: confirmModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                text: 'By changing the selected payer any payment information entered at this time will not be saved.'
            }
        })
        .then((response) => {
            if (response.confirm) {
                const newSource = {
                    Source: {
                        SourceType: angular.copy(this.paymentModel.Source.SourceType)
                    }
                };

                this.onResetPayment({
                    assignObj: newSource
                });

            } else {
                this.paymentModel.Source.SourceType = this.sourceDictionary.find((source) => {
                    return source.Id === prevSourceId;
                });
            }
        });
    }
}

const paymentInfo = {
    bindings: {
        parentForm: '=',
        paymentModel: '=',
        disableEditSource: '=',
        readOnly: '=',
        onResetPayment: '&'
    },
    template,
    controller: PaymentInfoCtrl
};

export default paymentInfo;
