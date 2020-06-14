export default class inboxController {
    constructor($scope,
                $state,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                infinityTableService,
                inboxService) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.infinityTableService = infinityTableService;
        this.inboxService = inboxService;

        this.toolbarItems = [
            {
                text: 'New Patient(s)',
                icon: {
                    url: 'assets/images/default/plus.svg',
                    w: 14,
                    h: 14
                },
                clickFunction: this._goNewInboxPatient.bind(this)
            },
            {
                text: 'Attach Patient(s)',
                icon: {
                    url: 'assets/images/default/upload.svg',
                    w: 10,
                    h: 20,
                    className: 'upload-rotate-icon'
                },
                clickFunction: this._goAttachInboxPatient.bind(this)
            },
            {
                text: 'Mark as unread',
                icon: {
                    url: 'assets/images/default/email.svg',
                    w: 18,
                    h: 20,
                    className: 'upload-rotate-icon'
                },
                clickFunction: this._markAsUnRead.bind(this)
            },
            {
                text: 'Download',
                icon: {
                    url: 'assets/images/default/download.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: this._downloadSelected.bind(this)
            },
            {
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this._deleteItems.bind(this)
            }
        ];

        $scope.$on('$stateChangeSuccess', this._checkState());
    }

    _checkState() {
        if (this.$state.is('root.inbox')) {
            this.$state.go('root.inbox.list');
        }
    }

    _goNewInboxPatient() {
        this.bsLoadingOverlayService.start({ referenceId: 'inboxPage' });
        this.inboxService.changeReadStatus(this.infinityTableService.getSelectedItems(), true)
                .then(() =>
                    this.$state.go('root.new_inbox_patient', { docsArr: this.infinityTableService.getSelectedItems() })
                )
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inboxPage' }));
    }

    _goAttachInboxPatient() {
        this.bsLoadingOverlayService.start({ referenceId: 'inboxPage' });
        this.inboxService.changeReadStatus(this.infinityTableService.getSelectedItems(), true)
            .then(() =>
                this.$state.go('root.attach_inbox_patient', { docsArr: this.infinityTableService.getSelectedItems() })
            )
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inboxPage' }));
    }

    _downloadSelected() {
        this.bsLoadingOverlayService.start({ referenceId: 'inboxPage' });
        this.inboxService.changeReadStatus(this.infinityTableService.getSelectedItems(), true)
            .then(() => {
                if (this.inboxService.downloadDocuments(
                        this.infinityTableService.getSelectedItems().map((item) => item.Id)
                    ).isAdBlockOn === true) {

                    this.ngToast.danger(`The pop-up windows are blocked by one of your browser extensions.<br/>
                                         Please disable it and reload page for further proceeding`);
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inboxPage' }));
    }

    _markAsUnRead() {
        this.bsLoadingOverlayService.start({ referenceId: 'inboxPage' });
        return this.inboxService.changeReadStatus(this.infinityTableService.getSelectedItems(), false)
            .then(() => this.infinityTableService.reload())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inboxPage' }));
    }

    _deleteItems() {
        let arr = this.infinityTableService.getSelectedItems().map((item) => item.Id);
        let that = this;

        this.$mdDialog.show({
            controller: class confirmCtrl {
                constructor($mdDialog, inboxService, infinityTableService) {
                    'ngInject';
                    this.count = arr.length;

                    this.confirm = () => {
                        inboxService.deleteItems(arr)
                            .then(() => {
                                infinityTableService.reload();
                                that.$scope.$broadcast('event:inbox-item-deleted', arr);
                            });
                        $mdDialog.cancel();
                    };
                    this.cancel = () => {
                        $mdDialog.cancel();
                    };
                }
            },
            controllerAs: 'modal',
            templateUrl: 'inbox/views/modal/confirm-modal.html',
            clickOutsideToClose: false
        });
    }

    selectedItemsArrCount() {
        let arr = this.infinityTableService.getSelectedItems();
        /**
         * @description - Hide in toolbar item "Mark as unread" if
         * there are only new (unread) items among selected
         */
        let areOnlyNewItems = !_.find(arr, (item) => item.Read === true);
        let markAsUnreadBtnIndex = _.findIndex(this.toolbarItems, { text: 'Mark as unread' });

        this.toolbarItems[markAsUnreadBtnIndex].isHidden = areOnlyNewItems;

        return arr && arr.length;
    }

}

