export default class popupMenuService {
    constructor($timeout) {
        'ngInject';

        this.$timeout = $timeout;
    }

    /**
     * @param [{title, class, exec}] items items for build menu - Title, Class, Exec - function that should execute on click
     * @param jsEvent
     */
    showPopupMenu(items, jsEvent) {
        let $timeoutService = this.$timeout;
        let mask = $('<div class="custom-mask"></div>');
        let dropdown = $('<div class="custom-dropdown-menu"></div>');

        $('body').find('.bootstrap-datetimepicker-widget:last').hide(); // hide datetime picker if exist

        if (!items || !items.length) { return; }
        angular.forEach(items, (item) => {
            if (!item.title) { item.title = 'No title'; }
            let menuItem = $(`<a class="custom-dropdown-link ${item.class}" href="javascript:void(0);">
                                 <span class="custom-dropdown-title">${item.title}</span>
                              </a>`);
            menuItem.on('click', () => { item.exec(); });
            dropdown.append(menuItem);
        });

        function addDropDown(posX, posY) {
            $('html').append(mask).addClass('no-document-scroll');

            mask.animate({
                opacity: 1
            }, 200);
            mask.append(dropdown);

            let screenWidth = $('.custom-mask').width(),
                menuWidth = dropdown.width();
            posX = (screenWidth - menuWidth) < posX ? (screenWidth - menuWidth - 10) : posX;

            let screenHeight = $('.custom-mask').height(),
                menuHeight = dropdown.height();
            posY = (screenHeight - menuHeight) < posY ? (screenHeight - menuHeight - 10) : posY;

            dropdown.css({
                'top': posY + 'px',
                'left': posX + 'px',
                'transition': '0s'
            });

            $timeoutService(() => { dropdown.css({'opacity': 1}); }, 100);

            mask.on('click', () => { removeDropDown(); });
        }

        function removeDropDown() {
            $('html').removeClass('no-document-scroll');
            mask.remove();
        }

        addDropDown(jsEvent.clientX, jsEvent.clientY);
    }
}