//TODO rewrite to ES6 and import when portal will be used
//(function () {
//    "use strict";

//    angular
//        .module("app.patients")
//        .controller("shareModalController", shareModalController);

//    /* @ngInject */
//    function shareModalController($state, $mdDialog, bsLoadingOverlayService, documentsService, save, orders) {
//        var share = this;
//        share.orders = [];

//        share.close = function () {
//            $mdDialog.cancel();
//        };

//        share.save = function () {
//            save(share.orders);
//        };

//        function activate() {
//            bsLoadingOverlayService.start({ referenceId: "loading-orders" });
//            documentsService.getOrders($state.params.patientId).then(function (response) {
//                share.orders = response.data;

//                if (orders) {
//                    angular.forEach(orders, function(order) {
//                        var existingOrder = _.find(share.orders, function(item) {
//                            return item.Id === order.Id;
//                        });

//                        if (existingOrder) {
//                            existingOrder.checked = true;
//                        }
//                    });
//                }
//            }, function(){}).then(function() {
//                bsLoadingOverlayService.stop({ referenceId: "loading-orders" });
//            });
//        }

//        activate();
//    }
//})();
