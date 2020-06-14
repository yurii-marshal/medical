import { invoiceStatusConstants } from '../../../../../core/constants/billing.constants.es6';
import {
  permissionsCategoriesConstants,
  billingPermissionsConstants
} from '../../../../../core/constants/permissions.constants.es6';

export default class EditInvoiceTagsCtrl {
    constructor($rootScope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                invoicesService,
                billingClaimsService,
                invoice,
                invoiceId,
                userPermissions
    ) {
        'ngInject';

        this.userPermissions = userPermissions;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.model = invoice;
        this.model.Tags = invoice.Tags || [];
        this.model.Statuses.HoldReasons = invoice.Statuses.HoldReasons || [];
        this.invoiceId = invoiceId;
        this.invoicesService = invoicesService;
        this.billingClaimsService = billingClaimsService;
        this.invoiceStatusConstants = invoiceStatusConstants;
        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;
        this.statuses = [];
        this.holdReasons = [];

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'statusEditModal' });
        this.invoicesService.getInvoicesStatuses()
            .then((responses) => {
                this.statuses = responses.data.map((status) => {
                    status.statusClass = this.invoicesService.getStatusClass(status.Id);
                    return status;
                });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'statusEditModal' }));

        this.invoicesService.getInvoicesHoldReasons()
            .then((response) => this.holdReasons = response);
    }

    save() {
        if (!this.form.$valid) {
            touchedErrorFields(this.form);
            return;
        }
        const data = {
            Status: this.model.Statuses.Status.Id,
            HoldReasons: this.model.Statuses.HoldReasons.map((item) => item.Id),
            Tags: this.model.Tags.map((item) => item.Id)
        };

        this.bsLoadingOverlayService.start({ referenceId: 'statusEditModal' });
        this.billingClaimsService.updateClaimsState(this.invoiceId, data)
            .then(() => {
                this.$rootScope.$broadcast('invoiceUpdated');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'statusEditModal' }));
    }

    close() {
        this.$mdDialog.cancel();
    }

    statusChanged() {
        if (this.model.Statuses.Status.Id !== this.invoiceStatusConstants.HOLD_STATUS_ID) {
            this.model.Statuses.HoldReasons = [];
        }
    }

    holdReasonsQuerySearch(query) {
        let results = query ? this.holdReasons.filter(this._filterSearchQuery(query)) : this.holdReasons;

        if (results.length) {
            results = this._filterResults(results);
        }
        return results;
    }

    _filterSearchQuery(query) {
        let lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return item.Name.toLowerCase().indexOf(lowercaseQuery) !== -1;
        };
    }

    _filterResults(results) {
        let filteredArr = [];

        angular.forEach(results, (item) => {
            let itemIndex = _.findIndex(this.model.Statuses.HoldReasons, { Id: item.Id });

            if (itemIndex === -1) {
                filteredArr.push(item);
            }
        });
        return filteredArr;
    }


}
