import template from './resupply-history-orders.html';

class resupplyHistoryOrdersCtrl {
    constructor() {
        'ngInject';
    }

}

const resupplyHistoryOrders = {
    bindings: {
        orderId: '<',
        items: '<'
    },
    template,
    controller: resupplyHistoryOrdersCtrl
};

export default resupplyHistoryOrders;
