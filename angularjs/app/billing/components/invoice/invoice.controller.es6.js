import {
    invoiceStatusConstants
} from '../../../core/constants/billing.constants.es6';

import {
    permissionsCategoriesConstants,
    billingPermissionsConstants
} from '../../../core/constants/permissions.constants.es6';

// Modal Controllers
import writeOffModalController from './modals/write-off-modal/write-off-modal.controller.es6';
import payOffModalController from './modals/pay-off-modal/payOffModalModal.controller.es6.js';
import resubmitInvoiceModalController from './modals/resubmit-invoice/resubmitInvoiceModal.controller.es6';
import submitInvoiceModalController from '../../shared/modals/submit-invoice/submitInvoiceModal.controller.es6';
import Cms1500TypeModalCtrl from '../../shared/modals/cms1500-type/cms1500-type.es6';
import EditInvoiceTagsCtrl from './modals/edit-invoice-tags/edit-invoice-tags.controller.es6';

// Modal Templates
import writeOffModalTemplate from './modals/write-off-modal/write-off-modal.html';
import payOffModalTemplate from './modals/pay-off-modal/pay-off-modal.html';
import submitInvoiceModalTemplate from '../../shared/modals/submit-invoice/submit-invoice.html';
import resubmitInvoiceModalTemplate from './modals/resubmit-invoice/resubmit-invoice-modal.html';
import cms1500TypeModalTemplate from '../../shared/modals/cms1500-type/cms1500-type.html';
import editInvoiceTagsTemplate from './modals/edit-invoice-tags/edit-invoice-tags.html';

export default class invoiceController {
    constructor($scope,
                $rootScope,
                $state,
                $mdDialog,
                ngToast,
                $filter,
                bsLoadingOverlayService,
                invoicesService,
                billingClaimsService,
                documentUpdateService,
                userPermissions,
                billingPaymentService
                ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.billingClaimsService = billingClaimsService;
        this.documentUpdateService = documentUpdateService;
        this.billingPaymentService = billingPaymentService;
        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;

        this.invoiceId = $state.params.invoiceId;
        this.Balance = {
            Amount: 0,
            Currency: '$'
        };

        this.invoiceStatusConstants = invoiceStatusConstants;

        this.model = invoicesService.getModel();

        this.toolbarItems = [
            {
                name: 'submit',
                text: 'Submit',
                icon: {
                    url: 'assets/images/default/check-circle-2.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.submitInvoiceModal.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'resubmit',
                text: 'Resubmit',
                icon: {
                    url: 'assets/images/default/check-circle-2.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.resubmitInvoiceModal.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'new-payment',
                text: 'Add Payment',
                icon: {
                    url: 'assets/images/default/card.svg',
                    w: 20,
                    h: 16
                },
                clickFunction: this.goAddNewPayment.bind(this),
                byDefault: true
            },
            {
                name: 'write-off',
                text: 'Write Off',
                icon: {
                    url: 'assets/images/default/list.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.writeOffModal.bind(this),
                byDefault: true
            },
            {
                name: 'modify',
                text: 'Modify',
                icon: {
                    url: 'assets/images/default/edit-underline.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.goModify.bind(this),
                byDefault: true
            },
            {
                name: 'print',
                text: 'Print',
                icon: {
                    url: 'assets/images/default/printer.svg',
                    w: 20,
                    h: 18
                },
                clickFunction: this.printInvoice.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'cms1500',
                text: 'CMS 1500',
                icon: {
                    url: 'assets/images/default/printer.svg',
                    w: 20,
                    h: 18
                },
                clickFunction: this.generateCMS1500.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'export',
                text: 'Export',
                icon: {
                    url: 'assets/images/default/replace.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this.exportInvoice.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'delete',
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.deleteInvoice.bind(this),
                hasConfirmation: true,
                confirmTitle: 'Delete invoice',
                confirmMsg: 'Are you sure you want to delete this invoice?',
                confirmBtnOk: 'Yes',
                confirmBtnCancel: 'No',
                byDefault: true
            }
        ];

        this.tabs = [
            {
                'title': 'Details',
                'view': 'root.invoice.details'
            },
            {
                'title': 'EOB/ERA',
                'view': 'root.invoice.eob_era'
            },
            {
                'title': 'Insurance',
                'view': 'root.invoice.insurance'
            },
            {
                'title': 'Audit',
                'view': 'root.invoice.audit',
                'linkView': 'root.invoice.audit.list'
            },
            {
                'title': 'Notes',
                'view': 'root.invoice.notes'
            },
            {
                'title': 'Related Invoices',
                'view': 'root.invoice.related'
            },
            {
                'title': 'Tasks',
                'view': 'root.invoice.tasks'
            },
        ];

        this.unappliedPayments = [];

        this._activate();

        $scope.$on('reloadInvoiceInfo', (event, args) => {
            let lineId = args && args.lineId || undefined;
            let NEED_CHECK_BALANCE = args && args.NEED_CHECK_BALANCE;

            this._activate(lineId, NEED_CHECK_BALANCE);
        });
    }

    _activate(activeLineId, NEED_CHECK_BALANCE) {
        this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
        this.invoicesService.getAndSetModel(this.invoiceId, activeLineId)
            .then(() => {
                this.Balance = this.model.TotalAmounts.Balance;
                let isNegativeBalance = this.Balance.Amount <= 0;

                if (isNegativeBalance && NEED_CHECK_BALANCE) {
                    this.invoicesService.closeInvoiceModal(this.invoiceId);
                }

                this.getUnappliedPayments(this.model.Patient.Id);
                this._setAllowedAction();
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' });
                if (!activeLineId) {
                    $('body').scrollTop(0);
                }
                this.$rootScope.$broadcast('invoiceDetailsLoaded', { activeLineId });
            });
    }

    getUnappliedPayments(patientId) {
        this.billingPaymentService.getPayments({
            SourceId: patientId,
            Unapplied: 0.01 // 0.01 use for get all payments with unapplied balance more then 0
        }).then((response) => {
            this.unappliedPayments = response.data;
        });
    }

    editInvoiceStatus() {
        this.$mdDialog.show({
            controller: EditInvoiceTagsCtrl,
            controllerAs: '$ctrl',
            template: editInvoiceTagsTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                invoice: angular.copy(this.model), // prevent changes on current view
                invoiceId: this.invoiceId
            }
        })
        .then(() => {
            this._activate();
        });
    }

    submitInvoiceModal() {
        this.$mdDialog.show({
            template: submitInvoiceModalTemplate,
            controller: submitInvoiceModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { isMultiple: false }
        })
        .then(() => {
            this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
            this.invoicesService.submitInvoice(this.invoiceId)
                .then((response) => {

                    if (response.data.IsElectronicallySubmitted) {
                        this.$state.go('root.billing.invoices');
                    } else {
                        this._activate();
                        this.generateCMS1500();
                    }

                    this.ngToast.success('Invoice was submited.');

                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' });
                });
        });
    }

    resubmitInvoiceModal() {
        const resubmitCode = this.model.Statuses.ResubmissionCode && this.model.Statuses.ResubmissionCode.Code || null;
        const payerOriginalClaimNumber = this.model.Statuses.PayerOriginalClaimNumber || null;

        this.$mdDialog.show({
            template: resubmitInvoiceModalTemplate,
            controller: resubmitInvoiceModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { resubmitCode, payerOriginalClaimNumber }
        })
        .then((response) => {
            if (response) {
                this.ngToast.success('Invoice was resubmitted.');

                if (response.data.IsElectronicallySubmitted) {
                    this.$state.go('root.billing.invoices');
                } else {
                    this._activate();
                    this.generateCMS1500();
                }
            }
        });
    }

    goAddNewPayment() {
        this._collapseServiceLines();
        this.$state.go('root.newInvoicePayment', { invoiceId: this.invoiceId });
    }

    writeOffModal() {
        this.$mdDialog.show({
            template: writeOffModalTemplate,
            controller: writeOffModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                invoiceId: this.invoiceId,
                invoiceBalance: this.Balance
            }
        });
    }

    // TODO remove after clarifying if we need it in new payment
    payOffModal() {
        this.$mdDialog.show({
            template: payOffModalTemplate,
            controller: payOffModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                invoiceId: this.invoiceId,
                invoiceBalance: this.Balance
            }
        });
    }

    goModify() {
        this.$state.go('root.modify', { invoiceId: this.invoiceId });
    }

    printInvoice() {
        this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
        this.documentUpdateService.printInvoice(this.invoiceId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' }));
    }

    deleteInvoice() {
        this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
        this.billingClaimsService.deleteInvoice(this.invoiceId)
            .then(() => {
                this.ngToast.success('Invoice was successfully deleted');
                this.$state.go('root.billing.invoices');
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' });
            });
    }

    generateCMS1500() {
        this.$mdDialog.show({
            template: cms1500TypeModalTemplate,
            controller: Cms1500TypeModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
        .then((response) => {
            const isBlank = !!response;

            this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
            this.documentUpdateService.openCMS1500(this.invoiceId, isBlank)
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' }));
        });
    }

    exportInvoice() {
        this.bsLoadingOverlayService.start({ referenceId: 'invoicePage' });
        this.invoicesService.exportInvoice(this.invoiceId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicePage' }));
    }

    _collapseServiceLines() {
        angular.forEach(this.model.ServiceLines, (line) => line.transactionsExpanded = false);
    }

    _setAllowedAction() {

        // Default invoice actions visibility from API
        this.toolbarItems = this.toolbarItems.map((toolbarItem) => {

            if (!toolbarItem.byDefault) {
                let tmpItem = _.find(this.model.AllowedActions, (action) => action.Name.toLowerCase() === toolbarItem.name);

                toolbarItem.isHidden = !tmpItem;
            }

            return toolbarItem;
        });

        // Custom invoice actions visibility from API
        let isNegativeBalance = this.Balance.Amount <= 0;

        let payOffItem = _.find(this.toolbarItems, (item) => item.name === 'pay-off');
        let writeOfItem = _.find(this.toolbarItems, (item) => item.name === 'write-off');

        if (payOffItem) {
            payOffItem.isHidden = isNegativeBalance;
        }
        if (writeOfItem) {
            writeOfItem.isHidden = isNegativeBalance;
        }
    }
}
