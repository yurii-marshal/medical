import template from './service-line-item.component.html';

import {
    paymentStatusConstants,
    paymentTypeConstants
} from '../../../../../core/constants/billing.constants.es6';

// Modal Controllers
import AdjustModalController from '../../modals/adjust-modal/adjust-modal.controller.es6';
import SelectServiceLineCtrl from '../../modals/select-service-line/select-service-line.controller.es6';

// Modal Templates
import adjustModalTemplate from '../../modals/adjust-modal/adjust-modal.html';
import selectServiceLineTemplate from '../../modals/select-service-line/select-service-line.html';

import { selectServiceLineModalType } from '../../modals/select-service-line/select-service-line.constants.es6';

import {
    calcFloatDiff
} from '../../../../../core/helpers/math-operations.helper.es6';

class ServiceLineItemCtrl {
    constructor(
        $mdDialog,
        billingsCommonService,
        paymentService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.paymentStatusConstants = paymentStatusConstants;
        this.paymentService = paymentService;

        this.billingsCommonService = billingsCommonService;
        this.paymentTypeConstants = paymentTypeConstants;
    }

    onPayOff() {
        this.serviceModel.Paid.Amount = 0;

        this.onRecalculateInvoicePayment();

        let unapplied = parseFloat(this.paymentModel.Unapplied.Amount);

        this.paymentService.payOffForServiceLine(this.serviceModel, unapplied);

        this.onRecalculateInvoicePayment();
    }

    onRemoveServiceLine(itemIndex) {
        this.onRemove({ itemIndex: itemIndex });
    }

    showAdjustModal(index) {
        const isEdit = index !== undefined;
        const adjustment = isEdit ? this.serviceModel.Adjustments[index] : null;

        this.$mdDialog.show({
            template: adjustModalTemplate,
            controller: AdjustModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                isEdit,
                adjustment
            }
        }).then((response) => {
            const adjustmentsPrevState = angular.copy(this.serviceModel.Adjustments);

            if (isEdit) {
                this.serviceModel.Adjustments[index] = response[0];
            } else {
                this.serviceModel.Adjustments = _.concat(this.serviceModel.Adjustments, response);
            }

            this.setPayerAllowableFromAdjustment(adjustmentsPrevState);
        });
    }

    deleteAdjustment(index) {
        const adjustmentsPrevState = angular.copy(this.serviceModel.Adjustments);

        this.serviceModel.Adjustments.splice(index, 1);

        this.setPayerAllowableFromAdjustment(adjustmentsPrevState);
    }

    setPayerAllowableFromAdjustment(prevAdjustments) {

        function getAllowedAmount(adjustments) {
            let totalAmount = 0;

            adjustments.forEach((adjustment) => {
                if (adjustment.Reason.Id === '45' &&
                    (adjustment.Group.Id === 'CO' || adjustment.Group.Id === 'OA')) {

                    totalAmount += adjustment.Amount.Amount;
                }
            });

            return totalAmount;
        }

        const totalAmount = getAllowedAmount(this.serviceModel.Adjustments);
        const prevAllowedAmount = this.serviceModel.Charge.Amount - getAllowedAmount(prevAdjustments);

        if (totalAmount > 0 &&
            (!this.serviceModel.Allowed.Amount || prevAllowedAmount === this.serviceModel.Allowed.Amount)
        ) {
            this.serviceModel.Allowed.Amount = calcFloatDiff(this.serviceModel.Charge.Amount, totalAmount);
        }
    }

    isNeedConnect() {
        return !this.serviceModel.ServiceId;
    }

    onConnectServiceLine() {
        this.$mdDialog.show({
            controller: SelectServiceLineCtrl,
            controllerAs: '$ctrl',
            template: selectServiceLineTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                controlType: selectServiceLineModalType.RADIO,
                invoiceId: this.invoiceId,
                disableIds: []
            }
        })
        .then((response) => {
            this.serviceModel.ServiceId = response[0].Id;
            this.serviceModel.Balance = response[0].Balance;
            this.onConnected();
        });
    }

    onShowPricingDetails($event) {
        this.billingsCommonService.showPricingDetails($event, this.serviceModel, this.invoiceId);
    }
}

const serviceLineItem = {
    bindings: {
        serviceModel: '=',
        invoiceId: '=',
        readOnly: '=',
        itemIndex: '=',
        parentItemIndex: '=',
        paymentModel: '=',
        parentForm: '=',
        sourceType: '=',
        onRemove: '&',
        onConnected: '&',
        onRecalculateInvoicePayment: '&'
    },
    template,
    controller: ServiceLineItemCtrl
};

export default serviceLineItem;
