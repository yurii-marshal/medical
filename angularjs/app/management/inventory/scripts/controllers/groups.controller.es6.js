import template from '../../views/modals/group-modal.html';
import groupModalController from './modals/groupModal.controller.es6';

export default class groupsController {
    constructor($mdDialog, ngToast, inventoryGroupsService, infinityTableService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.inventoryGroupsService = inventoryGroupsService;
        this.infinityTableService = infinityTableService;

        this.cacheFiltersKey = 'management-inventory-groups';

        this.sortExpr = {
            'Name': true
        };

        this.filter = {};

        this.getGroups = this._getGroups.bind(this);

    }

    _getGroups (pageIndex, pageSize) {
        if (this.sortExpr.Name === undefined && this.sortExpr.Description === undefined) {
            this.sortExpr.Name = true;
        }
        return this.inventoryGroupsService.getList(this.filter, this.sortExpr, pageIndex, pageSize);
    }

    showModal ($event, groupId) {
        if (this.infinityTableService.hasConfirmDialogOpened()) {
            return;
        }

        this.$mdDialog.show({
            template,
            targetEvent: $event,
            controller: groupModalController,
            controllerAs: "modal",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { groupId }
        }).then((isChanged) => {
            if(isChanged) {
                this.infinityTableService.reload();
            }

        });
    }

    deleteGroup (groupId) {
        this.inventoryGroupsService.deleteGroup(groupId)
            .then( () => this.ngToast.success("Group is deleted"))
            .finally(() => this.infinityTableService.reload());
    }

}
