export default class inboxListController {
    constructor($scope, inboxService, infinityTableService) {
        'ngInject';

        this.inboxService = inboxService;
        this.infinityTableService = infinityTableService;

        this.isOpenedPreview = false;
        this.openedPreviewId = undefined;

        this.filterObj = {};
        this.sortExpr = {};

        this.getInboxList = (pageIndex, pageSize) => {
            return this.inboxService.getList(this.filterObj, this.sortExpr, pageIndex, pageSize);
        };

        $scope.$on('event:inbox-item-deleted', (event, data) => {
            if (this.isOpenedPreview && this.openedPreviewId) {
                let isOpenedItemDeleted = data.indexOf(this.openedPreviewId) !== -1;
                if (isOpenedItemDeleted) {
                    this.hideViewFileContainer();
                }
            }
        });
    }

    toggleItem(item) {
        this.infinityTableService.toggleItem(item);
    }

    viewFile($event, item) {
        $event.stopPropagation();
        this.inboxService.showDocumentInPreview(item.Id);
        this.inboxService.changeReadStatus([ item ], true);
        item.Read = true;
        this.isOpenedPreview = true;
        this.openedPreviewId = item.Id;
    }

    hideViewFileContainer() {
        this.isOpenedPreview = false;
        this.openedPreviewId = undefined;
    }

    highlightViewButton(item) {
        return item.Id === this.openedPreviewId;
    }
}
