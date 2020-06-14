import template from './chat-helper.html';

class chatHelperCtrl {
    constructor($timeout,
                $rootScope,
                $scope,
                chatHelperService,
                profileService,
                customSearchAutocompleteService) {
        'ngInject';

        this.$timeout = $timeout;
        this.chatHelperService = chatHelperService;
        this.profileService = profileService;
        this.customSearchAutocompleteService = customSearchAutocompleteService;
        this.profile = profileService.getProfile();

        this.chatOpened = false;
        this.greetingMsg = {
            Text: `Hi, NikoBot here!
                   I hope that you are having a great day.
                   To learn more about what I can help you with type /`,
            CreatedBy: 'NikoBot',
            CreatedOn: moment().format()
        };

        this.autocompleteOptions = { patient: true, user: true, action: true };

        this.chatMessages = [
            this.greetingMsg
        ];

        $rootScope.$on('event:openPatientById', () => this.chatOpened = false);

        $rootScope.$on('logout', () => this.clearChat());

        $scope.$watch(() => profileService.getProfile(), (newValue) => {
            if (this.UserName) {
                return;
            }
            if (newValue && newValue.Name) {
                this.UserName = `${newValue.Name.FirstName} ${newValue.Name.LastName}`;
            }
        }, true);
    }

    submitAction(message) {
        if (message) {
            this.addUserMessage(message);
            this.currentMessage = '';

            let messageConvertedForBack = this.customSearchAutocompleteService.getAllIncomes(message);

            this.chatHelperService.submitAction(messageConvertedForBack)
                .then((response) => {
                    response.data.forEach((item) => {
                        if (item.TitleLink) {
                            item.goToRef = this.chatHelperService.goToRef(item.TitleLink);
                        }

                        item.Text = this.customSearchAutocompleteService.convertIdStrToName(item.Text);

                        item.Attachments.forEach((i) => {
                            if (i.TitleLink) {
                                i.goToRef = this.chatHelperService.goToRef(i.TitleLink);
                            }

                            i.Text = this.chatHelperService.addPhoneFilter(i.Text);
                            i.Text = this.customSearchAutocompleteService.convertIdStrToName(i.Text);

                        });

                        this.chatMessages.push(item);
                    });
                    if (!response.data.length) {
                        this.chatMessages.push({
                            Text: `I’m sorry, I don’t understand!
                               Type / to learn more about what I can help you with.`,
                            CreatedBy: 'NikoBot',
                            CreatedOn: moment().format()
                        });
                    }
                })
                .finally(() => this.msgScrollDown());
        }
    }

    addUserMessage(str) {
        let userMessage = {
            Text: str.replace('#', '&#35;'), // parsed
            CreatedBy: this.UserName,
            MsgTypeUser: true,
            CreatedOn: moment().format()
        };

        this.chatMessages.push(userMessage);
    }

    toggleChat() {
        if (!this.chatOpened && this.chatMessages.length < 1) {
            this._setStartMessage();
        }
        this.chatOpened = !this.chatOpened;

        if (this.chatOpened) {
            $('#chat-helper-textarea').addClass('md-input-focused');
            $('#chat-helper-textarea textarea').focus();
        }
    }

    clearChat() {
        this.chatOpened = false;
        this.chatMessages = [];
        this.currentMessage = '';
    }

    _setStartMessage() {
        this.chatMessages.push({
            Text: `Hi, NikoBot here!
                   I hope that you are having a great day.
                   To learn more about what I can help you with type /`,
            CreatedBy: 'NikoBot',
            CreatedOn: moment().format()
        });
    }

    msgScrollDown() {
        this.$timeout(() => {
            $('.chat-helper-body').mCustomScrollbar('scrollTo', 'bottom');
        }, 50);
    }

}

const chatHelper = {
    bindings: {

    },
    template,
    controller: chatHelperCtrl
};

export default chatHelper;
