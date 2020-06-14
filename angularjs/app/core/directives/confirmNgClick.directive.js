(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('confirmNgClick', confirmNgClick);

    /* @ngInject */
    function confirmNgClick() {
        var directive = {
            restrict: 'A',
            scope: {
                confirmType: '@?',           // default - "delete", may be "confirm"
                confirmNgClick: '&',
                confirmMsg: '=?',
                confirmBtnOk: '@?',
                confirmBtnCancel: '@?',
                confirmTitle: '@?',
                confirmBodyClassName: '@?',
                confirmClassName: '@?'
            },
            link: function (scope, elem, attr) {
                var popup,
                    popupSettings = {
                        bodyClassName: scope.confirmBodyClassName,
                        className: scope.confirmClassName,
                        type: scope.confirmType,
                        msg: scope.confirmMsg,
                        title: scope.confirmTitle,
                        btnOkText: scope.confirmBtnOk,
                        btnCancelText: scope.confirmBtnCancel,
                        execFunction: function() {
                            scope.confirmNgClick();
                            scope.$apply();
                        }
                    };

                $(elem).click(function (event) {
                    if ($('.drwz-confirm-container').length > 0) {
                        return;
                    }

                    event.stopPropagation();
                    popup = new CustomPopup(popupSettings);
                    popup.show();
                });

                scope.$on('$destroy', function () {
                    if (popup) popup.close();
                });

            }
            ,
            priority: 0
        };
        return directive;
    }

    function CustomPopup(settings) {
        this.bodyClassName = settings.bodyClassName || '';
        this.className = settings.className || "";
        this.type = settings.type || "delete";
        if (settings.type === "confirm") {
            this.title = settings.title || "Confirm Action?";
            this.btnOkText = settings.btnOkText || "OK";
        } else {
            this.title = settings.title || "Confirm Delete?";
            this.btnOkText = settings.btnOkText || "Delete";
        }
        this.msg = settings.msg || "Are you sure?";
        this.btnCancelText = settings.btnCancelText || "Cancel";
        this.execFunction = settings.execFunction || function () {};
        this.instancePopup = undefined;
    }

    CustomPopup.prototype.show = showPopup;
    CustomPopup.prototype.close = closePopup;

    function showPopup() {
        var self = this;

        var hasVScroll = document.body.scrollHeight > document.body.clientHeight;
        var template =
            "<div class='drwz-confirm-container'>" +
                "<div class='drwz-confirm-overlay' data-role='cancelBtn'></div>" +
                "<div class='drowz-confirm-dialog " + self.type + ' ' + self.className + "'>" +
                    "<div class='drowz-confirm-cancel' data-role='cancelBtn'></div>" +
                    "<div class='drowz-confirm-dialog-icon'></div>" +
                    "<div class='drowz-confirm-dialog-title'>" + self.title + "</div>" +
                    "<div class='drowz-confirm-dialog-content'>" + self.msg + "</div>" +
                    "<div class='drowz-confirm-dialog-footer'>" +
                        "<button class='drowz-confirm-btn' data-role='cancelBtn'>" + self.btnCancelText + "</button>" +
                        "<button class='drowz-confirm-btn " + self.type + "-btn' data-role='okBtn'>" + self.btnOkText + "</button>" +
                    "</div>" +
                "</div>" +
            "</div>";

        var compiledTemplate = $(template);
        compiledTemplate.find('[data-role="okBtn"]').on('click', function () {
            self.execFunction();
            self.close();
        });
        compiledTemplate.find('[data-role="cancelBtn"]').on('click', function () {
            self.close();
        });

        self.instancePopup = compiledTemplate;

        if (hasVScroll) {
            document.addEventListener('mousewheel', disableBodyScroll);
            $('body').addClass('hidescrollbar');
        }

        $('body')
            .append(self.instancePopup);

        $(self.instancePopup)
            .animate({
                opacity: 1
            }, 100)
            .find('.drowz-confirm-dialog').addClass('show-it');

        if (self.bodyClassName) {
            document.body.classList.add(self.bodyClassName);
        }
    }

    function closePopup() {
        if (!this.instancePopup) return;

        var self = this;
        var popup = this.instancePopup;
        document.removeEventListener('mousewheel', disableBodyScroll);
        $('body').removeClass('hidescrollbar');

        $(popup)
            .find('.drowz-confirm-dialog').removeClass('show-it')
            .animate({
                opacity: 0
            }, 100, function () {
                popup.remove();
                if (self.bodyClassName) {
                    document.body.classList.remove(self.bodyClassName);
                }
            });
    }

    // Disable only body scrolling while confir modal is opened
    function disableBodyScroll(e) {
        e.preventDefault();
    }

})();
