(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("popoverDirective", popoverDirective);

    /* @ngInject */
    function popoverDirective($filter, $timeout){
        'use strict';

        return {
            restrict: "A",
            scope: {
                popoverDirective: "=",
                hideFirstItem: "=",
                parent: "=?",
                isArrayWithType: "=?",
                isParagraphsText: "=?",
                minWidth: "@?",             // Integer in pixels. Default is 135
                isOnlyIcon: "@?"            // if we need only icon, without visible data
            },
            link: function(scope, element, attrs) {

                var data = scope.popoverDirective,
                    tooltipTemplate = '',
                    IS_TYPE_HIDDEN = true,
                    list = [],
                    elemWidth = element.outerWidth(true) + 120,   // to prevent too wide tooltips
                    tooltipsterDefaults = {
                        position: 'right',
                        trackOrigin: true,
                        minWidth: scope.minWidth ? scope.minWidth : 135,
                        maxWidth: scope.isArrayWithType ? null : elemWidth,
                        animation: 'fade',
                        animationDuration: 0,
                        content: tooltipTemplate,
                        contentAsHTML: true,
                        theme: ['tooltipster-shadow', 'tooltipster-niko'],
                        interactive: true,
                        IEmin: 11,
                        arrow: false,
                        distance: 20,
                        debug: false
                    };

                function activate() {

                    tooltipTemplate = '';

                    data = scope.popoverDirective;

                    if (!data) {
                        element.html('-');
                        return;
                    }

                    if (scope.isParagraphsText) {
                        list = data.split("\n");
                    }

                    element
                        .tooltipster(tooltipsterDefaults)
                        .addClass('info-tooltip');

                    // if we have array of data
                    if (_.isArray(data)) {

                        // if we have empty array - append "-"
                        if (!data.length) {
                            element.html('-');
                            disableTooltip();
                        }

                        // if we have 1 length array - append it without popover but with title
                        if (data.length === 1) {
                            if (scope.isArrayWithType) {
                                var singleItem = getFormatedType(data[0], IS_TYPE_HIDDEN);

                                element.html('<div class="ellipsis-line" title="' + singleItem + '">' + singleItem + '</div>');
                            } else {
                                element.html('<div class="ellipsis-line" title="' + data[0] + '">' + data[0] + '</div>');
                            }
                            disableTooltip();
                        }

                        // if we have 2 or more elements in array - append it with tooltip
                        if (data.length > 1) {
                            element.addClass('has-tooltip');

                            if (scope.isArrayWithType) {
                                var singleItem = getFormatedType(data[0], IS_TYPE_HIDDEN);
                                tooltipTemplate = $('<table class="formatted-tooltip"></table>');

                                element.html('<div class="ellipsis-line">' + singleItem + '</div>');
                                angular.forEach(getData(), function(item) {
                                    tooltipTemplate.append(getFormatedType(item));
                                });
                            } else {
                                element.html('<div class="ellipsis-line">' + data[0] + '</div>');
                                angular.forEach(getData(), function(item) {
                                    tooltipTemplate += '<div>' + item + '</div>';
                                });
                            }

                            element.tooltipster('enable');
                            element.tooltipster('content', tooltipTemplate);
                        }
                    } else if (_.isString(data)) {

                        if (scope.isOnlyIcon) {
                            element
                                .addClass('has-tooltip')
                                .tooltipster('content', data)
                                .tooltipster('enable');
                        } else {
                            element.html(
                                '<div class="hidden-line">' + data + '</div>' +
                                '<div class="ellipsis-line">' + data + '</div>'
                            );

                            hideText();
                        }
                    }
                }

                function hideText() {
                    if (isEllipsisActive(element.find('.hidden-line'))) {
                        element
                            .addClass('has-tooltip')
                            .tooltipster('enable');

                        if (list.length) {
                            var tmpl = '';
                            for (var i = 0; i < list.length; i++) {
                                tmpl += '<div>' + list[i] + '</div>';
                            }
                            element.tooltipster('content', tmpl);
                        } else {
                            element.tooltipster('content', data);
                        }
                    } else {
                        disableTooltip();
                    }
                }

                function isEllipsisActive(e) {
                    return e.width() > element.width();
                }

                function disableTooltip() {
                    element
                        .tooltipster('disable')
                        .removeClass('has-tooltip');
                }

                function getFormatedType(item, isTypeHidden) {
                    var val = item.value;
                    if (_.indexOf(['phone', 'fax'], item.type.toLowerCase()) > -1) {
                        val = $filter('tel')(item.value);
                    }
                    if (isTypeHidden) {
                        return val;
                    } else {
                        return '<tr><td><span class="font-semibold capitalize">' + item.type + ':</span></td><td>' + val + '</td></tr>';
                    }
                }

                // if resize or scroll window we hide popover to prevent recalculate position
                $(window).on('resize', hideTooltip);
                $(window).on('scroll', hideTooltip);

                // clear listeners
                scope.$on('$destroy', function () {
                    $(window).off('resize', hideTooltip);
                    $(window).off('scroll', hideTooltip);
                });

                function hideTooltip() {
                    if(!$(element).hasClass('tooltipstered')) return;

                    try {

                        if (_.isString(scope.popoverDirective) && !scope.isOnlyIcon) {
                            hideText();
                        }

                        if (element.tooltipster('status') === 'open') {
                            element.tooltipster('close');
                        }

                    } catch (e) {
                        if (e.message !== "You called Tooltipster's \"status\" method on an uninitialized element") {
                            console.log('error', e);
                        }
                    }
                }

                function getData() {
                    var initData = angular.copy(scope.popoverDirective);
                    if ( scope.hideFirstItem && _.isArray(initData) && initData.length > 1 ) {
                        initData.shift();
                    }
                    return initData;
                }

                scope.$watch(function () {
                    return scope.popoverDirective;
                }, function (newVal) {
                    if (newVal) activate();
                });
            }
        };
    }

})();
