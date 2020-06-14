(function () {
    "use strict";

    angular
        .module("app.calendar")
        .directive("easyScroll", easyScroll);

    /* @ngInject */
    function easyScroll($timeout) {

        var directive = {
            restrict: 'A',
            scope: {
                easyScrollWatchElements: "=?",
                easyScrollSpeed: "@?",
                easyScrollDisatance: "@?",
                easyScrollToElement: "=?"     // If we need to scroll without cutting elements
            },
            link: function (scope, element) {

                var jqEl = $(element);
                var btnLeft = $('<a href="javascript:void(0);" class="scroll-btn scroll-left"></a>');
                var btnRight = $('<a href="javascript:void(0);" class="scroll-btn scroll-right"></a>');
                var scrollContainer = $("<div class='scroll-appointments'></div>");
                var scrollContent = $('.long-appointment-days');
                var scrolledLeft = 0;
                var btnPos = [];
                var btnPosReverse = [];

                var defaults = {
                    scrollDisatance: jqEl.width() - 60,
                    scrollSpeed: 300
                };

                if (scope.easyScrollSpeed) {
                    defaults.scrollSpeed = scope.easyScrollSpeed;
                }

                if (scope.easyScrollDisatance) {
                    defaults.scrollDisatance = scope.easyScrollDisatance;
                }

                function doScrollButtons() {

                    if (jqEl.width() <= scrollContent.width()) {

                        if (!jqEl.find('.scroll-appointments').length) {
                            scrollContent.wrap(scrollContainer);
                        }

                        if (!jqEl.find('.scroll-btn').length) {
                            jqEl.append(btnLeft);
                            jqEl.append(btnRight);
                        }

                        jqEl.addClass('hasScrollBtns');

                    } else {
                        jqEl.removeClass('hasScrollBtns');
                    }
                }

                function makePositionsArray() {
                    // Store all left position for buttons
                    $('.appointment-btn').each(function () {
                        btnPos.push({
                            'item': $(this),
                            'leftPos': $(this).position().left,
                            'width': $(this).width(),
                            'leftScroll': $(this).position().left - 30
                        });
                    });

                    angular.copy(btnPos, btnPosReverse);
                    btnPosReverse.reverse();
                }


                btnRight.click(function () {

                    if (scrolledLeft < (scrollContent.width() - $('.scroll-appointments').width() - defaults.scrollDisatance) ) {

                        if (scope.easyScrollToElement) {

                            var scrollToElement = undefined;
                            var keepGoing = true;

                            angular.forEach(btnPos, function (elPos) {
                                if(keepGoing) {
                                    if (elPos.leftPos + elPos.width >= defaults.scrollDisatance + scrolledLeft) {
                                        scrollToElement = elPos;
                                        keepGoing = false;
                                    }
                                }
                            });

                            $('.scroll-appointments').animate({
                                scrollLeft: scrollToElement.leftScroll
                            }, defaults.scrollSpeed, function() {
                                scrolledLeft = scrollToElement.leftScroll;
                            });

                        } else {
                            $('.scroll-appointments').animate({
                                scrollLeft: scrolledLeft + defaults.scrollDisatance
                            }, defaults.scrollSpeed, function() {
                                scrolledLeft += defaults.scrollDisatance;
                            });
                        }

                    } else {
                        $('.scroll-appointments').animate({
                            scrollLeft: scrollContent.width() - $('.scroll-appointments').width()
                        }, defaults.scrollSpeed, function() {
                            scrolledLeft = scrollContent.width() - $('.scroll-appointments').width();
                        });
                    }
                });

                btnLeft.click(function () {
                    if (scrolledLeft !== 0) {

                        if (scope.easyScrollToElement) {

                            var scrollToElement = undefined;
                            var keepGoing = true;

                            angular.forEach(btnPosReverse, function (elPos) {
                                if(keepGoing) {
                                    if (elPos.leftPos - elPos.width <= scrolledLeft - defaults.scrollDisatance) {
                                        scrollToElement = elPos;
                                        keepGoing = false;
                                    } else if (scrolledLeft - defaults.scrollDisatance <= 0) {
                                        scrollToElement = btnPosReverse[btnPosReverse.length - 1];
                                    }
                                }
                            });


                            $('.scroll-appointments').animate({
                                scrollLeft: scrollToElement.leftScroll
                            }, defaults.scrollSpeed, function() {
                                if (scrolledLeft < defaults.scrollDisatance) {
                                    scrolledLeft = 0;
                                } else {
                                    scrolledLeft = scrollToElement.leftScroll;
                                }
                            });

                        } else {
                            $('.scroll-appointments').animate({
                                scrollLeft: scrolledLeft - defaults.scrollDisatance
                            }, defaults.scrollSpeed, function() {
                                if (scrolledLeft < defaults.scrollDisatance) {
                                    scrolledLeft = 0;
                                } else {
                                    scrolledLeft -= defaults.scrollDisatance;
                                }
                            });
                        }
                    }
                });

                scope.$watch('easyScrollWatchElements', function () {
                    $timeout(function () {
                        doScrollButtons();
                        makePositionsArray();
                    },100);
                });
            }
        };
        return directive;
    }
})();
