import template from '../../views/components/communication.html';

class dashboardCommunicationCtrl {
    constructor(ngToast,
                $timeout,
                currentUser,
                dashboardService,
                profileService,
                bsLoadingOverlayService,
                $window,
                WEB_API_SERVICE_URI,
                authService,
                userPicture
    ) {
        'ngInject';

        this.ngToast = ngToast;
        this.$timeout = $timeout;
        this.$window = $window;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.dashboardService = dashboardService;
        this.profileService = profileService;
        this.userPicture = userPicture;

        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.authService = authService;

        this.onMessageScrollTopPoint = () => this._onMessageScrollTopPoint();

        this.messages = new this._Message();
        this.users = [];
        this.selectedUser = undefined;
        this.filterStr = '';
        this.currentUser = currentUser;
        this.messageCurrentPage = 0;
        this.sendMsgTooltip = 'Ctrl+Enter';
        this.isShowNoRecords = false;

        const macRegExp = /mac/i;
        if ($window.navigator
            && $window.navigator.platform
            && $window.navigator.platform.match(macRegExp)) {
            this.sendMsgTooltip = 'Cmd+Enter';
        }

        this.keyPress = (e) => this._keyPress(e);
        this.onfocusOnMsgField = () => this._onfocusOnMsgField();

        this.$onInit = () => {
            $window.addEventListener('keydown', this.keyPress);
            $window.document.getElementById('communicationSendMsg')
                .addEventListener('focus', this.onfocusOnMsgField);
        };

        this.$onDestroy = () => {
            $window.removeEventListener('keydown', this.keyPress);
            if ($window.document.getElementById('communicationSendMsg')) {
                $window.document.getElementById('communicationSendMsg')
                    .removeEventListener('focus', this.onfocusOnMsgField);
            }
        };

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'msgContacts' });
        this.bsLoadingOverlayService.start({ referenceId: 'msgList' });

        this.dashboardService.getUserContacts()
            .then((res) => {
                this.filterStr = '';
                this.selectedUser = undefined;
                this.users = _.sortBy(res.data.Items, [(o) => !o.UnreadMessages]);
                this.users.forEach((user) => this._getUserPicture(user.User));

                $('.dashboard-communication').removeClass('no-users');

                if (!this.users || this.users.length < 1) {
                    this.selectUser(undefined);
                    $('.dashboard-communication').addClass('no-users');
                    this.isShowNoRecords = true;
                    return;
                }

                let selectUser = this.users[0];

                //User is currently selected - need only update info for this user
                if (this.selectedUser && this.selectedUser.User && this.selectedUser.User.Id) {
                    const currentUser = this.users.filter((item) => {
                        return item.User.Id === this.selectedUser.User.Id;
                    })[0];
                    //selectedUser can be deleted in that case we should use first user from list
                    selectUser = (currentUser) ?  currentUser : selectUser;
                }

                this.selectUser(selectUser);

            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'msgContacts'}));
    }

    reload() {
        this._activate();
    }

    _keyPress(e) {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
            this.sendMsg();
        }
    }

    selectUser(selectedItem) {
        this.selectedUser = selectedItem;

        //load new messages
        this.messageCurrentPage = 0;
        this.loadAllMessages();
    }

    getUserName(msgItem) {
        return msgItem.Sender.Name.FullName;
    }

    getMsgType(msgItem) {
        return msgItem.IsOwn;
    }

    sendMsg() {
        if (this.msg) {
            this.dashboardService.postUserMessage(this.selectedUser.User.Id, this.msg)
                .then((res) => {
                    this.messages.push(res.data);
                    this._msgScrollDown();
                    const index = _.findIndex(this.users, (item) => {
                        return item.User.Id === this.selectedUser.User.Id;
                    });
                    // if user isn't first - make him first in list and scroll to top
                    if (index !== 0) {
                        this.users.unshift(this.users[index]);
                        this.users.splice(index + 1, 1);
                        $('.communication-sidebar-users').mCustomScrollbar("scrollTo", 'top');
                    }
                });

            this.ngToast.success('Message sent');
            this.msg = undefined;
            this._msgScrollDown();
        }
    }

    loadAllMessages() {
        //if problem with user clear messages array;
        if (!(this.selectedUser && this.selectedUser.User && this.selectedUser.User.Id)) {
            this.messages.clear();
            return;
        }

        this.bsLoadingOverlayService.start({referenceId: 'msgList'});
        this.dashboardService.getAllUnreadMessages(this.selectedUser.User.Id, this.selectedUser.UnreadMessages)
            .then((result) => {
                this.messages.setMessages(result.messages);
                this.messageCurrentPage = result.currentPage;
                this._scrollToFirstUnreadMessage();
            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'msgList'}));
    }

    getAvatar(msgItem) {
        if (msgItem.IsOwn) {
            return (this.currentUser.profile && this.currentUser.profile.ProfilePicture && this.currentUser.profile.ProfilePicture.Data)
                ? 'data:image/png;base64,' + this.currentUser.profile.ProfilePicture.Data
                : '';
        } else {
            // if this isn't selected user;
            if (this.selectedUser && this.selectedUser.User && (msgItem.Sender.Id !== this.selectedUser.User.Id) ) { return '' };
            return this.selectedUser.User.ProfilePicture;
        }
    }

    _onMessageScrollTopPoint() {
        this.bsLoadingOverlayService.start({referenceId: 'msgLoading'});

        const _firstId = this.messages.getFirstMsgId();

        this.messageCurrentPage++;
        this.dashboardService
            .getUserMessages(this.selectedUser.User.Id, { pageIndex: this.messageCurrentPage })
            .then((res) => {
                for (var i = 0; i < res.data.Items.length; i++) {
                    let item = res.data.Items[i];
                    this.messages.unshift(item);
                }
                this.$timeout(() => {
                    let el = this.$window.document.getElementById(_firstId);
                    if (el && el.offsetTop)
                        $('.communication-messages').mCustomScrollbar('scrollTo', el.offsetTop);
                }, 0);
            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'msgLoading'}));
    }

    _msgScrollDown() {
        this.$timeout(() => {
            $('.communication-messages').mCustomScrollbar('scrollTo', 'bottom');
        }, 50);
    }

    _scrollToFirstUnreadMessage() {
        if (this.messages.getAll().length < 1) { return };

        this.$timeout(() => {
            const firstNewMsgElement = $('.communication-messages').find('.new-message')[0];
            if (firstNewMsgElement && firstNewMsgElement.offsetTop) {
                $('.communication-messages').mCustomScrollbar('scrollTo', firstNewMsgElement.offsetTop);
            } else {
                this._msgScrollDown();
            }
        }, 50);
    }

    _onfocusOnMsgField() {
        if (this.selectedUser.UnreadMessages <= 0) { return };

        const unreadMessagesArr = this.messages.getAll()
                .filter((item) => !item.Read)
                .map((item) => item.Id);

        this.dashboardService.setMessagesRead(unreadMessagesArr)
            .then(() => this.selectedUser.UnreadMessages = 0);
    }

    _getUserPicture(user) {
        const noImage = 'assets/images/avatar.png';

        user.ProfilePicture = noImage;

        if (user.PictureUrl) {
            user.ProfilePicture = this.userPicture.getUserAvatarImgUrl(user.Id);
        }

    }

    _Message() {
        let _messages = [], _messagesIds = [];

        return {
            getAll: getAll,
            unshift: unshift,
            push: push,
            length: length,
            clear: clear,
            setMessages: setMessages,
            getFirstMsgId: getFirstMsgId
        }

        function getAll() {
            return _messages;
        }

        function unshift(el) {
            //only uniq Ids
            if (_messagesIds.indexOf(el.Id) > -1) return;
            _messages.unshift(el);
            _messagesIds.push(el.Id);
        }

        function push(el) {
            //only uniq Ids
            if (_messagesIds.indexOf(el.Id) > -1) return;
            _messages.push(el);
            _messagesIds.push(el.Id);
        }

        function length() {
            _messages.length;
        }

        function clear() {
            _messages = [];
        }

        function setMessages(arr) {
            _messages = arr;
            _messagesIds = arr.map((item) => item.Id)
        }

        function getFirstMsgId() {
            return _messages[0] && _messages[0].Id;
        }
    }

}

const dashboardCommunication = {
    bindings: {
        messages: '<?'
    },
    template,
    controller: dashboardCommunicationCtrl
};

export default dashboardCommunication;
