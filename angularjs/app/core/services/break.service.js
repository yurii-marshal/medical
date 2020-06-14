(function () {
    "use strict";

    angular
        .module("app")
        .service("breakService", breakService);

    function breakService($mdDialog) {
        this.showModal = showModal;

        function showModal(event, date, appointment, save, remove, isShortController, reopenModalData) {
            $mdDialog.show({
                controller: isShortController ? "breakShortController" : "breakController",
                    controllerAs: "breakCtrl",
                    templateUrl: "core/views/templates/breakModal.html",
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    bindToController: true,
                    locals: {
                        appointment: appointment,
                        date: date,
                        save: save,
                        remove: remove,
                        reopenModalFn: function(modalData) {
                            showModal(event, date, appointment, save, remove, isShortController, modalData);
                        },
                        reopenModalData: reopenModalData
                    }
                })
                .then(function() {
                }, function() {
                });
        }
    }
})();
