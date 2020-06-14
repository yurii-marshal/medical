// Modal Controllers
import AdjustModalController from '../../modals/adjust-modal/adjust-modal.controller.es6';
import SelectInvoiceModalCtrl from '../../modals/select-invoice/select-invoice.controller.es6';

// Modal Templates
import template from './invoice-item.component.html';
import adjustModalTemplate from '../../modals/adjust-modal/adjust-modal.html';
import selectInvoiceModalTemplate from '../../modals/select-invoice/select-invoice.html';

import SelectServiceLineCtrl from '../../modals/select-service-line/select-service-line.controller.es6';
import selectServiceLineTemplate from '../../modals/select-service-line/select-service-line.html';

import {
    mapModalInvoiceToClientInvoice,
    mapServiceModalDataToClientService
} from '../../payment-map-utils.es6';

import {
    selectInvoiceModalType
} from '../../modals/select-invoice/select-invoice.constants.es6';
import { paymentTypeConstants } from '../../../../../core/constants/billing.constants.es6';

import { selectServiceLineModalType } from '../../modals/select-service-line/select-service-line.constants.es6';
import {
    calcFloatSum
} from '../../../../../core/helpers/math-operations.helper.es6';

class InvoiceItemCtrl {
    constructor(
        paymentService,
        $mdDialog,
        $state
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.paymentService = paymentService;
        this.paymentTypeConstants = paymentTypeConstants;

        this.scrollToInvoiceId = this.$state.params.scrollToInvoiceId;
    }

    getRemarkCodes(name) {
        return this.paymentService.getRemarksCodes(name)
            .then((response) => {
                return response.data.Items;
            });
    }

    showAdjustModal(index) {
        const isEdit = index !== undefined;
        const adjustment = isEdit ? this.invoiceModel.Adjustments[index] : null;

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
        })
          .then((response) => {
              if (isEdit) {
                  this.invoiceModel.Adjustments[index] = response[0];
              } else {
                  this.invoiceModel.Adjustments = _.concat(this.invoiceModel.Adjustments, response);
              }
          });
    }

    deleteAdjustment(index) {
        this.invoiceModel.Adjustments.splice(index, 1);
    }

    onPayOff() {
        let unapplied = parseFloat(this.paymentModel.Unapplied.Amount);

        if (this.invoiceModel.Paid.Amount) {
            unapplied = calcFloatSum(unapplied, this.invoiceModel.Paid.Amount);
        }

        this.paymentService.payOffForInvoice(this.invoiceModel, unapplied);
    }

    onRecalculateInvoicePayment() {
        const serviceLineSum = this.invoiceModel.Services.reduce((acc, service) => {
            return service.Paid.Amount ? calcFloatSum(acc, service.Paid.Amount): acc;
        }, 0);

        this.invoiceModel.Paid.Amount = serviceLineSum;

        this.paymentService.calculateUnappliedAmount(this.paymentModel);
    }

    onRemoveInvoice(index) {
        this.onRemove({ itemIndex: index });
    }

    onRemoveServiceLine(itemIndex) {
        this.invoiceModel.Services.splice(itemIndex, 1);
    }

    onAddServiceLine() {
        this.$mdDialog.show({
            controller: SelectServiceLineCtrl,
            controllerAs: '$ctrl',
            template: selectServiceLineTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                controlType: selectServiceLineModalType.CHECKBOX,
                invoiceId: this.invoiceModel.InvoiceId,
                disableIds: []
            }
        })
        .then((response) => {
            response.forEach((service) => {
                this.invoiceModel.Services.push(mapServiceModalDataToClientService(service));
            });
        });
    }

    isNeedConnect() {
        return !this.invoiceModel.InvoiceId;
    }

    onConnectInvoice() {
        this.$mdDialog.show({
            controller: SelectInvoiceModalCtrl,
            controllerAs: '$ctrl',
            template: selectInvoiceModalTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                controlType: selectInvoiceModalType.RADIO,
                selectedIds: [],
                filters: {
                    Patient: this.source.Patient,
                    Payer: this.source.Insurance,
                    SourceType: this.source.SourceType
                }
            }
        })
        .then((selectedInvoices) => {
            const normalizedSelectedInvoice = mapModalInvoiceToClientInvoice(selectedInvoices[0]),
                selectedInvoice = selectedInvoices[0];

            this.invoiceModel.InvoiceId = normalizedSelectedInvoice.InvoiceId;
            this.invoiceModel.Customer = normalizedSelectedInvoice.Customer;

            if (this.source.Insurance &&
                selectedInvoice.BillTo &&
                this.source.Insurance.Id === selectedInvoice.BillTo.Id) {

                this.invoiceModel.Coverage = normalizedSelectedInvoice.Coverage;
            }
            this.invoiceModel.Balance = normalizedSelectedInvoice.Balance;
            this.invoiceModel.DisplayId = normalizedSelectedInvoice.DisplayId;


            // Auto connect service line
            selectedInvoice.ServiceLines.forEach((connectServiceLine) => {
                for (const modelServiceLine of this.invoiceModel.Services) {

                    if (!modelServiceLine.ServiceId &&
                        modelServiceLine.Charge.Amount === connectServiceLine.Charge.Amount &&
                        modelServiceLine.HcpcsCode === connectServiceLine.HcpcsCode.Id &&
                        moment(modelServiceLine.ServicePeriod.From).format('MM/DD/YYYY') === moment(connectServiceLine.ServicePeriod.From).format('MM/DD/YYYY') &&
                        moment(modelServiceLine.ServicePeriod.To).format('MM/DD/YYYY') === moment(connectServiceLine.ServicePeriod.To).format('MM/DD/YYYY')
                    ) {
                        modelServiceLine.ServiceId = connectServiceLine.Id;
                        modelServiceLine.Balance = connectServiceLine.Balance;
                        break;
                    }

                }
            });

            this.onConnected();
        });
    }

    onConnectedServiceLine() {
        this.onConnected();
    }

}

const invoiceItem = {
    bindings: {
        invoiceModel: '=',
        paymentModel: '=',
        parentForm: '=',
        itemIndex: '=',
        readOnly: '=',
        coveragesDictionary: '=',
        source: '=',
        onRemove: '&',
        onConnected: '&'
    },
    template,
    controller: InvoiceItemCtrl
};

export default invoiceItem;
