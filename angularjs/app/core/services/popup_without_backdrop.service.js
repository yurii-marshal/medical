(function () {
    "use strict";

    angular
        .module('app')
        .service("drowzPopupWithoutBackdrop", drowzPopupWithoutBackdrop);


    /* @ngInject */
    function drowzPopupWithoutBackdrop($mdDialog, $timeout) {
        this.show = show;

        function show($event, templateModal, ctrl, idForAction, calendarActionType, splitInnerEvents, constraint, save, deleteAction) {
            var body = document.getElementsByTagName('body')[0];
            
            $mdDialog.show({
                controller: ctrl,
                controllerAs: '$ctrl',
                templateUrl: templateModal,
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                // hasBackdrop: false,
                onShowing: showModal,
                onRemoving: removeModal,
                locals: {
                    idForAction: idForAction,
                    calendarActionType: calendarActionType,
                    splitInnerEvents: splitInnerEvents,
                    constraint: constraint,
                    save: save,
                    deleteAction: deleteAction
                }
            }).then(function () {
                body.classList.remove("has_modal");
            }, function () {
                body.classList.remove("has_modal");
            });

            function showModal() {
                $timeout(function () {
                    var modal = document.getElementsByTagName('md-dialog')[0];
                    var modalStyle = modal.style;

                    modalStyle.position = 'absolute';

                    modalStyle.left = getLeftPosition($event);
                    modalStyle.top = getTopPosition($event);

                    modalStyle.heigth = '0px';
                    modalStyle.opacity = '1';
                    modalStyle.transitionDuration = '0s';

                }, 10);
            };

            function removeModal() {
                var modal = document.getElementsByTagName('md-dialog')[0];
                var modalStyle = modal.style;

                modalStyle.opacity = '0';
            }
        };
    };


    function getLeftPosition($event) {
        var viewWidth = $event.view.innerWidth;
        var left = viewWidth / 2 - 185; //width break window


        if (clickOnRegistredElement($event.target)) {
            var left = $event.target.parentNode.getBoundingClientRect().left + 350 > viewWidth
                ? $event.target.parentNode.getBoundingClientRect().left - 350
                : $event.target.parentNode.getBoundingClientRect().left;
        }

        left = left < 0 ? 0 : left;
        return left + 'px';
    }

    function getTopPosition($event) {
        var viewHeight = $event.view.innerHeight;
        var top = viewHeight / 2 - 200; //height break window


        if (clickOnRegistredElement($event.target)) {
            top = $event.target.parentNode.getBoundingClientRect().top;
        }

        top = top < 0 ? 0 : top;
        return top + 'px';
    }

    //indicate that user click on special element
    function clickOnRegistredElement(targetElem) {
        var registredElements = [
            'md-button',
            'fc-dn-btn'
        ];

        var searchTree = [
            targetElem,
            targetElem.parentNode,
            targetElem.parentNode.parentNode
        ];

        for(var i = 0; i < searchTree.length; i++){
            var elem = searchTree[i];
            for(var j=0; j<registredElements.length; j++){
                var className = registredElements[j];
                if (elem.className.indexOf(className) !== -1)
                    return true;
            }
        }
        return false;
    }

})();
