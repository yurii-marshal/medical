import selectInvoiceModalTemplate from './modals/select-invoice/select-invoice.html';
import validationErrorsTemplate from './modals/validation-errors-modal/validation-errors-modal.html';

import SelectInvoiceModalCtrl from './modals/select-invoice/select-invoice.controller.es6';
import ValidationErrorsModalController from './modals/validation-errors-modal/validation-errors-modal.controller.es6';

import { mapModalInvoiceToClientInvoice } from './payment-map-utils.es6';

import { selectInvoiceModalType } from './modals/select-invoice/select-invoice.constants.es6';
import {
    billToTypes,
    paymentTypeConstants
} from '../../../core/constants/billing.constants.es6';

export default class PaymentCtrl {
    constructor(
        paymentService,
        $mdDialog,
        $state,
        bsLoadingOverlayService,
        billingInvoiceService,
        iframeUtils,
        scrollToService
    ) {
        'ngInject';

        this._savePrevState = {};
        this.scrollToService = scrollToService;

        this.iframeUtils = iframeUtils;
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.paymentService = paymentService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingInvoiceService = billingInvoiceService;
        this.scrollToInvoiceId = this.$state.params.scrollToInvoiceId;

        this.formIsDirty = false;

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 5,
            pagesWithErrors: []
        };

        this.billToTypes = billToTypes;
        this.paymentTypeConstants = paymentTypeConstants;

        this.coveragesDictionary = [];
        this.paymentService.getCoveragesDictionary()
            .then((response) => {
                this.coveragesDictionary = response.data;
            });

        if ($state.params.invoiceId) {
            this.billingInvoiceService.searchInvoices({ InvoiceIds: [$state.params.invoiceId] })
                .then((response) => {
                    const foundInvoice = response.data.Items[0];

                    // Preselect payment source
                    if (foundInvoice.BillTo.Type.Id === this.paymentTypeConstants.PATIENT_TYPE_ID) {
                        this.model.Source.Patient = foundInvoice.Customer;
                        this.model.Source.SourceType.Id = this.paymentTypeConstants.PATIENT_TYPE_ID;
                    } else {
                        this.model.Source.Insurance = {
                            Id: foundInvoice.BillTo.Id,
                            Name: foundInvoice.BillTo.Name
                        };
                        this.model.Source.SourceType.Id = this.paymentTypeConstants.PAYER_TYPE_ID;
                    }

                    this.model.Invoices.unshift(mapModalInvoiceToClientInvoice(foundInvoice));
                });
        }

        this.isNewPayment = !$state.params.paymentId;

        this.paymentId = $state.params.paymentId;

        this.isEditPage = false;

        if ($state.params.paymentId) {
            this.bsLoadingOverlayService.start({ referenceId: 'paymentOverlay' });

            this.paymentService.getPayment($state.params.paymentId).then(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'paymentOverlay' });
                this.model = this.paymentService.getModel();

                this._savePrevState = angular.copy(this.model);
                this.isEditPage = $state.is('root.paymentEdit');

                this.setPageForAutoScroll();
            });
        } else {
            this.model = this.paymentService.initNewModel();
            this.isEditPage = true;
        }
    }

    setPageForAutoScroll() {
        if (this.scrollToInvoiceId) {
            this.model.Invoices.some((invoice, index) => {
                if (invoice.Id === this.scrollToInvoiceId) {
                    this.paginationParams.pageIndex = Math.floor(index / this.paginationParams.pageSize) + 1;
                    return true;
                }
                return false;
            });
        }
    }

    checkRequiredFieldsAndErrors(skipErrorMessages) {
        let validationStatusObj = {
            status: true,
            index: null,
            invalidPages: []
        };

        let invalidIndexItems = [];

        this.model.Invoices.forEach((item, invoiceIndex) => {

            if (!_.has(item, 'Paid.Amount') ||
                !(typeof item.Paid.Amount === 'number') ||
                (item.errorMessagas && item.errorMessagas.length && !skipErrorMessages)
            ) {
                invalidIndexItems.push(invoiceIndex);
            }

            if (this.model.Source.SourceType.Id === this.paymentTypeConstants.PAYER_TYPE_ID &&
                item.Services &&
                item.Services.length
            ) {

                item.Services.forEach((service) => {
                    if (!_.has(service, 'Paid.Amount') ||
                        !(typeof service.Paid.Amount === 'number') ||
                        (service.errorMessagas && service.errorMessagas.length && !skipErrorMessages)
                    ) {
                        invalidIndexItems.push(invoiceIndex);
                    }
                });
            }
        });

        if (invalidIndexItems.length) {
            validationStatusObj = {
                status: false,
                index: invalidIndexItems[0],
                invalidPages: invalidIndexItems.map((invoiceIndex) => {
                    return Math.floor(invoiceIndex / this.paginationParams.pageSize) + 1;
                })
            };
        }

        return validationStatusObj;
    }

    onPageChanged() {
        if (this.formIsDirty) {
            this.touchedErrorFields();
        }
    }

    touchedErrorFields() {
        setTimeout(() => {
            touchedErrorFields(this.form);
        });
    }

    save() {

        this.paginationParams.pagesWithErrors = [];
        const validationObj = this.checkRequiredFieldsAndErrors(true);

        if (!validationObj.status || this.form.$invalid) {

            this.formIsDirty = true;
            this.paginationParams.pageIndex = validationObj.invalidPages[0];
            this.paginationParams.pagesWithErrors = validationObj.invalidPages;

            this.touchedErrorFields();
            this.form.$setSubmitted();

            this.scrollToService.goTopClass(['.ng-invalid:not(ng-form):not(form):not([ng-form])']);
        } else if (this.isNewPayment) {

            this.bsLoadingOverlayService.start({ referenceId: 'paymentOverlay' });

            this.removeValidationErrorsFromModel();

            this.paymentService.createPayment(this.model)
                .then(
                    (response) => {
                        this.$state.go('root.paymentDetails', { paymentId: response.data.Id });
                    },
                    (response) => {
                        if (response.data.IsValid === false) {
                            this.setErrorsToModel(response.data);
                            this.showValidationsErrorModal();
                        }
                    }
                )
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'paymentOverlay' });
                });
        } else {

            this.bsLoadingOverlayService.start({ referenceId: 'paymentOverlay' });

            this.removeValidationErrorsFromModel();

            this.paymentService.updatePayment(this.model, this.paymentId)
                .then(() => {
                    this.paymentService.getPayment(this.$state.params.paymentId).then(() => {

                        this.model = this.paymentService.getModel();
                        this.removeValidationErrorsFromModel();
                        this.exitEditMode();

                        this.bsLoadingOverlayService.stop({ referenceId: 'paymentOverlay' });
                    });
                },
                (response) => {
                    if (response.data.IsValid === false) {
                        this.setErrorsToModel(response.data);
                        this.showValidationsErrorModal();
                    }

                    this.bsLoadingOverlayService.stop({ referenceId: 'paymentOverlay' });
                });
        }

    }

    removeValidationErrorsFromModel() {
        this.model.invalid = false;
        this.model.errorMessagas = null;

        this.model.Invoices.forEach((item) => {
            item.invalid = false;
            item.errorMessagas = null;

            if (item.Services) {
                item.Services.forEach((sl) => {
                    sl.invalid = false;
                    sl.errorMessagas = null;
                });
            }
        });
    }

    setErrorsToModel(dataModel) {

        if (!dataModel) {
            this.removeValidationErrorsFromModel();

            return;
        }

        if (dataModel.Messages && dataModel.Messages.length) {
            this.model.invalid = true;
            this.model.errorMessagas = dataModel.Messages;
        }

        if (dataModel.Items) {
            dataModel.Items.forEach((invoiceItem) => {

                this.model.Invoices.forEach((modelInvoice, invoiceIndex) => {
                    if (modelInvoice.ValidationKey === invoiceItem.ValidationKey) {

                        this.model.Invoices[invoiceIndex].invalid = !invoiceItem.IsValid;
                        this.model.Invoices[invoiceIndex].errorMessagas = invoiceItem.Messages;

                        if (invoiceItem.Items) {
                            invoiceItem.Items.forEach((serviceItem) => {

                                this.model.Invoices[invoiceIndex].Services.forEach((modelService, serviceIndex) => {

                                    if (modelService.ValidationKey === serviceItem.ValidationKey) {

                                        this.model.Invoices[invoiceIndex].Services[serviceIndex].invalid = !serviceItem.IsValid;
                                        this.model.Invoices[invoiceIndex].Services[serviceIndex].errorMessagas = serviceItem.Messages;
                                    }
                                });
                            });
                        }
                    }
                });

            });
        }
    }

    openSelectInvoiceModal() {
        this.$mdDialog.show({
            controller: SelectInvoiceModalCtrl,
            controllerAs: '$ctrl',
            template: selectInvoiceModalTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                controlType: selectInvoiceModalType.CHECKBOX,
                selectedIds: this.model.Invoices.reduce((acc, i) => {
                    acc.push(i.InvoiceId);
                    return acc;
                }, []),
                filters: {
                    Patient: this.model.Source.Patient,
                    Payer: this.model.Source.Insurance,
                    SourceType: this.model.Source.SourceType
                }
            }
        })
        .then((selectedInvoices) => {
            selectedInvoices.forEach((selectedInvoice) => {
                const invoice = mapModalInvoiceToClientInvoice(selectedInvoice);

                if ((selectedInvoice.BillTo &&
                    this.model.Source.Insurance &&
                    selectedInvoice.BillTo.Type.Id === this.billToTypes.PAYER_TYPE_ID &&
                    selectedInvoice.BillTo.Id !== this.model.Source.Insurance.Id)
                ) {

                    invoice.Coverage = null;
                }

                this.model.Invoices.unshift(invoice);
            });
        });
    }

    exitEditMode() {
        this.$state.go('root.paymentDetails', { paymentId: this.paymentId }, { notify: false })
            .then(({ params }) => this.onStateChange(params));

        this.iframeUtils.sendDataToParentIframe(this.$state, true);

        this.isEditPage = false;
    }

    enableEditMode() {
        this._savePrevState = angular.copy(this.model);
        this.$state.go('root.paymentEdit', { paymentId: this.paymentId }, { notify: false })
            .then(({ params }) => this.onStateChange(params));

        this.iframeUtils.sendDataToParentIframe(this.$state, true);
        this.isEditPage = true;
    }

    cancelEditMode() {
        this.paginationParams.pagesWithErrors = [];

        this.model = this._savePrevState;
        this.exitEditMode();
    }

    onStateChange(params) {
        document.title = params.pageTitle;
    }

    onEditPayment() {
        this.enableEditMode();
    }

    onCancel() {
        if (this.isNewPayment) {
            this.$state.go('root.billing.payments');
        } else {
            this.cancelEditMode();
        }
    }

    onRemoveInvoice(index) {
        const removeIndex = ((this.paginationParams.pageIndex - 1) * this.paginationParams.pageSize) + index;

        this.model.Invoices.splice(removeIndex, 1);
        this.removeValidationErrorsFromModel();
    }

    onConnected() {

        if (this.isEditPage) {
            return ;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'paymentOverlay' });

        this.paymentService.updatePayment(this.model, this.paymentId)
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'paymentOverlay' });
            });
    }

    getPageOffset() {
        return (this.paginationParams.pageIndex - 1) * this.paginationParams.pageSize;
    }

    onAutoApply() {
        const adjustmentAmount = this.model.AdjustmentAmount.Amount || 0;

        let unappliedAmount = parseFloat(this.model.PaymentAmount.Amount) || 0;

        unappliedAmount += adjustmentAmount;

        this.model.Invoices.forEach((invoice) => {
            unappliedAmount = this.paymentService.payOffForInvoice(invoice, unappliedAmount);
        });
    }

    showValidationsErrorModal() {

        setTimeout(() => {
            this.$mdDialog.show({
                controller: ValidationErrorsModalController,
                controllerAs: '$ctrl',
                template: validationErrorsTemplate,
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {}
            }).then(() => {
                this.scrollToService.goTopClass(['.block-warning-msg']);
            });
        }, 10);
        const validationObj = this.checkRequiredFieldsAndErrors();

        if (!validationObj.status) {
            this.paginationParams.pageIndex = validationObj.invalidPages[0];
            this.paginationParams.pagesWithErrors = validationObj.invalidPages;
        }
    }

    isDisableAddInvoice() {
        return !(this.model.Source.SourceType.Id && (this.model.Source.Patient || this.model.Source.Insurance));
    }

    onResetPaymentModel(assignObj) {
        this.model = Object.assign(this.paymentService.initNewModel(), assignObj) ;
    }
}

