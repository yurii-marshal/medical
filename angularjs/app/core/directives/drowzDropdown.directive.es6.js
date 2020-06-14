export default function drowzDropdown () {
    'ngInject';

    return {
        restrict: 'A',
        link: (scope, elem) => {
            let element = angular.element(elem);
            let drpDwnBlock = element.find('.drowz-dropdown-block');

            if (drpDwnBlock.length) {

                element
                    .css('overflow', 'visible')
                    .addClass('has-dropdown');
                drpDwnBlock.css('top', element.height());

                element.on('click', function () {
                    if (element.hasClass('opened')) {
                        element.removeClass('opened');
                        drpDwnBlock.hide();
                    } else {
                        element.addClass('opened');
                        drpDwnBlock.show();
                    }
                });

                $('body').on('click', closeDropdown);

                drpDwnBlock.on('click', function (event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                });

                scope.$on("$destroy", function () {
                    $('body').off('click', closeDropdown);
                    element.off('click');
                    drpDwnBlock.off('click');
                });
            }

            function closeDropdown(event) {
                if (!$(event.target).closest(element).length && element.hasClass('opened')) {
                    // hide
                    element.removeClass('opened');
                    drpDwnBlock.hide();
                }
            }
        }
    }
}
