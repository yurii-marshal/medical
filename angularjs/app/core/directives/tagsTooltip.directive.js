(function () {
    "use strict";

    angular
        .module("app")
        .directive("tagsTooltip", tagsTooltip);

    /* @ngInject */
    function tagsTooltip() {
        return {
            restrict: 'AE',
            scope: {
                data: "="
            },
            link: function(scope, element) {

                element.addClass('hide-in-tooltip-block');
                var tooltipTemplate = $('<div class="hide-in-tooltip clearfix"></div>');

                tooltipTemplate.on('click', function (event) {
                    event.stopPropagation();
                });

                function init() {

                    element.html(
                        '<div class="hidden-line"></div>' +
                        '<div class="ellipsis-line"></div>'
                    );

                    tooltipTemplate.addClass('tags-tooltip');

                    angular.forEach(scope.data, function (tag) {
                        element.find('.hidden-line').append('<div class="tag-rectangle">' + tag + '</div>');
                        element.find('.ellipsis-line').append('<div class="tag-rectangle">' + tag + '</div>');
                    });

                    hideTags();
                }

                $(window).on('resize', hideTags);

                function hideTags() {

                    var totalWidth = 0;

                    element.find('.ellipsis-line .tag-rectangle').each(function (index) {
                        totalWidth += $(this).outerWidth(true);

                        if (totalWidth > element.find('.ellipsis-line').width() && index !== 0) {
                            $(this).addClass('hidden-tag');
                            return false;
                        } else {
                            $(this).removeClass('hidden-tag');
                        }
                    });

                    if (isEllipsisActive(element.find('.hidden-line'))) {

                        tooltipTemplate.html('');
                        angular.forEach(scope.data, function (tag) {
                            tooltipTemplate.append('<div class="tag-rectangle" title="' + tag +'">' + tag + '</div>');
                        });

                        element
                            .append(tooltipTemplate)
                            .addClass('has-arrow');

                        tooltipDimensions();

                    } else {
                        tooltipTemplate.remove();
                        element.removeClass('has-arrow');
                    }
                }

                function isEllipsisActive(e) {
                    return (e.width() > element.width());
                }

                function tooltipDimensions() {
                    tooltipTemplate.removeAttr('style');

                    if (tooltipTemplate.outerHeight() % 2 !== 0) {
                        tooltipTemplate.outerHeight(Math.round(tooltipTemplate.outerHeight()) + 1);
                    } else {
                        tooltipTemplate.outerHeight(Math.round(tooltipTemplate.outerHeight()));
                    }

                    if (tooltipTemplate.outerWidth() % 2 !== 0) {
                        tooltipTemplate.outerWidth(Math.round(tooltipTemplate.outerWidth()) + 1);
                    } else {
                        tooltipTemplate.outerWidth(Math.round(tooltipTemplate.outerWidth()));
                    }
                }

                scope.$watch(function () {
                    return scope.data;
                }, function () {
                    init();
                }, true);

                scope.$on('$destroy', function () {
                    tooltipTemplate.off('click');
                    $(window).off('resize', hideTags);
                });

            }
        };
    }
})();
