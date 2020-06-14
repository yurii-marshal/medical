export default class ScrollToService {
    constructor() {
        'ngInject';

        // There are a lot of fixed elements on patient's pages, we need to scroll higher to show them
        this.scrollPlusHeight = 150;
    }

    goToContainer(scrollTo) {
        const scrollContainer = scrollTo ? $(scrollTo) : $('.main-app-container');

        $('html, body').animate({
            scrollTop: scrollContainer.offset().top - this.scrollPlusHeight
        }, 500);
    }

    goTopClass(classes) {
        setTimeout(() => {
            let classesStr = classes.join(','),
                invalidItems = $(`${classesStr}`),
                upperElem = 10000000;
            
            angular.forEach(invalidItems, (item) => {
                if (upperElem > this._getOffset(item).top) {
                    upperElem = this._getOffset(item).top;
                }
            });

            $('html, body').animate({
                scrollTop: upperElem - this.scrollPlusHeight
            }, 500);
        });
    }

    _getOffset(el) {
        el = el.getBoundingClientRect();

        return {
            left: el.left + window.pageXOffset,
            top: el.top + window.pageYOffset
        };
    }

}
