import template from './sendMessage.template.html';

class sendMessageCtrl {
    constructor(messagesService, $scope) {
        'ngInject';

        this.messagesService = messagesService;

        this.sendAsAlert = false;
        this._subjTypes = [];
        this._orders = [];

        $scope.$watch(() => this.practiceId, (practiceId) => {
            if (practiceId) {
                this._loadOrders();
                this.newMsg.SubjectType = undefined;
                this.newMsg.orderId = undefined;
                this.newMsg.Text = undefined;
            }
        });

        this._loadTypes();
    }

    sendMsg() {
        if (this.sengMsgForm.$invalid) {
            touchedErrorFields(this.sengMsgForm);
            return;
        }
        this.newMsg.Type = this._getType(this.messageType, this.sendAsAlert);

        this.onSubmit(this.newMsg);
        this.sengMsgForm.$setUntouched();
    };

    //1-message 2-alert
    _getType(type, sendAsAlert) {
        switch (type) {
            case 'message':
                return 1;
                break;
            case 'alerts':
                return 2;
                break;
            default:
                return (sendAsAlert ? 2 : 1);
                break;
        }
    }

    _loadOrders() {
        this._orders = [];
        this.messagesService.getOrders(this.patientId, this.practiceId)
            .then((res) => this._orders = res.data);
    }

    _loadTypes() {
        this._subjTypes = [];
        this.messagesService.getSubjectTypes()
            .then((res) => this._subjTypes = res.data);
    }

}

const sendMessage = {
    bindings: {
        onSubmit: '=',
        newMsg: '=',
        patientId: '=',
        practiceId: '=',
        messageType: '='
    },
    template,
    controller: sendMessageCtrl
};

export default sendMessage;
