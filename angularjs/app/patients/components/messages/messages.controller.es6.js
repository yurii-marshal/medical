export default class messagesController {
    constructor(bsLoadingOverlayService,
                messagesService,
                $state,
                ngToast) {
        'ngInject';

        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.messagesService = messagesService;

        //var messages = this;
        this.messages = [];
        this.practices = [];
        this.activePractice = undefined;
        this.patientId = $state.params.patientId;
        this.messagesView = 'all';
        this.subjectType = undefined;
        this.searchText = '';

        //select items
        this.checkAll = false;
        this.selectedItems = [];

        this.sendMessage = this.sendMessage.bind(this);
        this.toggleMsg = this.toggleMsg.bind(this);
        this.setInactive = this.reloadPageAfterFn(messagesService.setAlertsInActive);
        this.setRead = this.reloadPageAfterFn(messagesService.setMessagesRead);
        this.setUnread = this.reloadPageAfterFn(messagesService.setMessagesUnRead);

        /* start send messages */
        this.newMsg = this._getNewMsgModel();

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({referenceId: 'patient-messages'});
        this._loadPractices();
    }

    selectPractice(practice) {
        if (!practice) { return; }

        this.activePractice = practice;
        this.checkAll = false;
        this.selectedItems = [];

        this.bsLoadingOverlayService.start({referenceId: 'messages'});
        this.messagesService.getMessages(this.patientId, practice.PracticeId, this._getFilters())
            .then((res) => this.messages = _.map(res.data.Items, this._mapMessage))
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'messages'}));
    }

    toggleAll() {
        this.selectedItems = [];
        _.map(this.messages, (i) => {
            i.selected = !this.checkAll;
            if (!this.checkAll) {
                this.selectedItems.push({Id: i.Id, Type: i.Type});
            }
            return i;
        });
    }

    toggleMsg(msg) {
        //Information about msg
        const newItem = { Id: msg.Id, Type: msg.Type };

        //Reset selection if selected other type
        if (this.selectedItems
            && this.selectedItems[0]
            && this.selectedItems[0].Type !== msg.Type) {
            _.map(this.selectedItems, (item) => {
                const pos = _.findLastIndex(this.messages, {Id: item.Id});
                this.messages[pos].selected = false;
            });
            this.selectedItems = [];
        }

        //Toggle selected item and add/remove to Selected Items Array
        const pos = _.findLastIndex(this.selectedItems, (i) => i.Id === newItem.Id);
        if (pos === -1) {
            this.selectedItems.push(newItem);
        } else {
            this.selectedItems.splice(pos, 1);
        }
    }

    sendMessage(msg) {
        this.bsLoadingOverlayService.start({referenceId: 'patient-message-block'});

        //different function for save Messages and Alerts
        const saveFunc = (msg.Type === 1)
            ? this.messagesService.sendMessage.bind(this.messagesService)
            : this.messagesService.sendAlert.bind(this.messagesService);

        const practiceId = this.activePractice.PracticeId;
        saveFunc(practiceId, msg)
            .then(() => {
                this.ngToast.success('Saved');
                this.newMsg = this._getNewMsgModel();
                this.reloadMessages();
                this._loadPractices();
            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'patient-message-block'}));
    }

    _getNewMsgModel() {
        return {
            orderId: undefined,
            Type: undefined,
            Text: '',
            SubjectType: undefined
        };
    }

    setMessageView(value) {
        this.messagesView = value;
        this.reloadMessages();
    }

    reloadMessages() {
        this.selectPractice(this.activePractice);
    }

    _loadPractices() {
        this.messagesService.getPractices(this.patientId)
            .then((res) => {
                this.practices = res.data;
                this.bsLoadingOverlayService.stop({referenceId: 'patient-messages'});
                if (!this.activePractice && this.practices.length > 0) {
                    this.selectPractice(this.practices[0]);
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'patient-messages'}));
    }

    _getFilters() {
        let filters = {};
        //Filters by the type. (1 - Message, 2 - Alert)
        switch (this.messagesView) {
            case 'messages':
                filters.type = 1;
                break;
            case 'alerts':
                filters.type = 2;
                break;
        }

        if (this.subjectType) {
            filters.subjectType = this.subjectType;
        }

        if (this.searchText) {
            filters.text = this.searchText;
        }

        return filters;
    }

    _mapMessage(msg) {
        //get type
        msg.Type = msg.Type.Text === ('Message' ? 'message' : 'alert');

        //get param New
        msg.isNew = false;
        if (msg.Type === 'message' && !msg.MessageIsRead) { msg.isNew = true; }
        if (msg.Type === 'alert' && msg.AlertIsActive) { msg.isNew = true; }

        return msg;
    }

    //after some action we should reload messages
    reloadPageAfterFn(execFn) {
        return function () {
            execFn.apply(null, arguments)
                .then(() => {
                    this.reloadMessages();
                    this._loadPractices();
                }, (err) => {});
        };
    }
}


