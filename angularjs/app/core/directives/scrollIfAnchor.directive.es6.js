class scrollIfAnchorDirective {
    constructor() {
        this.restrict = 'A';
    }

    link(scope, element, attrs) {
        scope.$watch(attrs['scrollIfAnchor'], (value) => {
            if (value) {
                let stickyHeaderHeight = 110;

                setTimeout(() => {
                    $('html, body').animate({
                        scrollTop: $(element).offset().top - stickyHeaderHeight
                    }, 1000);
                }, 10);

            }
        });
    }
}

angular.module('app.core')
    .directive('scrollIfAnchor', () => new scrollIfAnchorDirective());
