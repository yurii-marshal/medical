export default function datetimepicker ($timeout, $window) {
    'ngInject';

    return {
        require: '?ngModel',
        restrict: 'AE',
        link: (scope, elem, attrs, ngModelCtrl) => {

            let firstInit = true, options = {};

            if (!ngModelCtrl.$options || _.isEmpty(ngModelCtrl.$options)) {
                ngModelCtrl.$options = {
                    updateOn: 'blur', debounce: 1
                };
            }

            options = {
                format: attrs.format || 'MM/DD/YYYY',
                stepping: attrs.stepping || 1,
                ignoreReadonly: true,
                minDate: moment(moment().subtract(100, 'years')).format('MM/DD/YYYY'),
                maxDate: moment(moment().add(100, 'years')).format('MM/DD/YYYY'),
                widgetParent: $('body')
            };

            setDatetimepickerOptions();

            scope.$watch(() => attrs.maxDate, (newVal, oldVal) => {
                if (attrs.maxDate && attrs.maxDate !== "today") {
                    elem.data("DateTimePicker").maxDate(moment(newVal));
                }
            });

            scope.$watch(attrs.ngModel, (newValue) => {
                if ((!newValue || newValue === '') && elem.data('DateTimePicker')) {
                    elem.data('DateTimePicker').clear();

                    if (attrs.defaultDate && firstInit) {

                        if (attrs.defaultDate === 'today') {
                            elem.data('DateTimePicker').date(moment().format('L'));
                        } else {
                            elem.data('DateTimePicker').date(moment(attrs.defaultDate));
                        }

                        firstInit = false;
                    }
                }
                elem.data('date', newValue);
            });

            angular.element(() => {
                elem.attr('autocomplete', 'off');

                elem.datetimepicker(options);

                elem.on('dp.change', onChangeHandler);

                function onChangeHandler(e) {
                    if (ngModelCtrl) {
                        $timeout(() => {
                            if (!e.target.value && attrs.useDefaultTime == 'true' && attrs.stepping !== undefined) {
                                const steppingNumber = parseInt(attrs.stepping);
                                const defDate = moment();
                                const roundedMinutes = getRoundedMinutes(defDate, steppingNumber, steppingNumber);
                                const viewValue = moment(defDate.minutes(roundedMinutes)).format("hh:mm A");

                                e.target.value = viewValue;
                                ngModelCtrl.$setViewValue(viewValue);
                            } else {
                                ngModelCtrl.$setViewValue(e.target.value);
                            }
                        });
                    }
                }

                elem.on('dp.show', onShowHandler);
                elem.on('dp.hide', onHideHandler);

                function onShowHandler() {
                    if (attrs.isAgePicker === 'true') {
                        elem.data("DateTimePicker").viewMode('decades');
                    }

                    if (attrs.format == 'LT'
                        || attrs.format == "MM/DD/YYYY hh:mm A"
                        || attrs.format == "hh:mm A") {

                        $('.bootstrap-datetimepicker-widget:visible [data-action="togglePicker"]')
                            .append('<div class="datepicker-text select-time">Select Time</div>')
                            .append('<div class="datepicker-text select-date">Select Date</div>');

                        $('.bootstrap-datetimepicker-widget:visible [data-action="togglePicker"]')
                            .on('click', function () {
                                $(this).toggleClass('timepicker-open');
                            });
                    }

                    if (options.showTodayButton) {
                        $('.bootstrap-datetimepicker-widget:visible [data-action="today"] .glyphicon')
                            .addClass('custom-today-btn');
                        $('.bootstrap-datetimepicker-widget:visible [data-action="today"] .glyphicon')
                            .text('Today');
                        $('.bootstrap-datetimepicker-widget:visible')
                            .on('click', '[data-action="today"]', () => {
                                elem.data("DateTimePicker").hide();
                                elem.data("DateTimePicker").date(moment());
                            });
                    }

                    const datepicker = $("body").find('.bootstrap-datetimepicker-widget:last');
                    const datepickerHeight = (436 + 20), datepickerWidth = 340;
                    const elemPosRect = elem[0].getBoundingClientRect();
                    const top = elem.offset().top + elem.outerHeight();
                    const left = elem.offset().left;

                    horizontalPosNormalize(datepicker, left, elemPosRect, datepickerWidth);
                    verticalPosNormalize(datepicker, top, elemPosRect, datepickerHeight);

                    $window.addEventListener('resize', () => {
                        horizontalPosNormalize(datepicker, left, elemPosRect, datepickerWidth);
                        verticalPosNormalize(datepicker, top, elemPosRect, datepickerHeight);
                    }, true);

                    if (attrs.valueOnShow) {
                        elem.data('DateTimePicker').date(attrs.valueOnShow);
                        elem.val(attrs.valueOnShow);
                    } else {
                        elem.val(elem.data('date'));
                    }
                    elem.trigger('dp.change');
                }

                function onHideHandler() {
                    if (attrs.clearOnHide) {
                        $timeout(() => {
                            elem.val('');
                            elem.trigger('dp.change');
                        }, 200);
                    }
                }

                elem.next('.remove_input')
                    .on('click', updateOnClickHandler);

                function updateOnClickHandler() {
                    $timeout(() => {
                        $('.updateThisDatepicker').each(function() {
                            if ($(this).attr('default-date')) {
                                $(this).data("DateTimePicker").date(moment($(this).attr('default-date')));
                            } else {
                                $(this).data("DateTimePicker").date(null);
                            }
                        });
                    }, 10);
                }


                if ( $(elem).parents('md-dialog') ) {
                    $('md-dialog').on('scroll', () => {
                        elem.blur();
                    })
                }

                scope.$on('$destroy', () => {
                    elem.off('dp.change', onChangeHandler);
                    elem.off('dp.show', onShowHandler);
                    elem.next('.remove_input').off('click', updateOnClickHandler);
                    angular.element($window).off('resize');
                });

            });

            function setDatetimepickerOptions() {

                validateDateFormat();

                if (attrs.isAgePicker === 'true') { options.viewMode = 'decades'; }

                isTodayButtonShown();

                setMinDate();
                setMaxDate();
                setDefaultDate();

                roundingCurrentMinutes();

                if (attrs.useCurrent === 'false') { options.useCurrent = false; }
            }

            function validateDateFormat() {
                // ngModel apply only 'DD/MM/YYYY*' or 'D/MM/YYYY*'

                if (ngModelCtrl && attrs.format !== 'hh:mm A' && attrs.format !== 'LT') {
                    let regexp = /^\b(\d\d|\d)\b\/\d\d\/\d\d\d\d.*?$/;
                    ngModelCtrl.$validators.pattern = function(modelValue, viewValue) {
                        return ngModelCtrl.$isEmpty(viewValue) || regexp.test(viewValue);
                    };
                }
            }

            function isTodayButtonShown() {
                if (attrs.format !== 'LT'
                    && attrs.format !== 'MM/DD/YYYY hh:mm A'
                    && attrs.format !== 'hh:mm A') {
                    if (attrs.showTodayButton) {
                        options.showTodayButton = attrs.showTodayButton === 'true';
                    } else {
                        options.showTodayButton = true;
                    }
                }

                if (!attrs.format) { options.showTodayButton = false; }
            }

            function setMinDate() {
                if (attrs.minDate) {
                    if (attrs.minDate === "today") {
                        // add 1 day and subtruct 1 second
                        // in other case today's date cannot be selected because of current time
                        options.minDate = moment(moment().format("L")).format('YYYY-MM-DD 00:00:00');
                    } else {
                        options.minDate = attrs.minDate === 'false' ? false : attrs.minDate;
                    }
                }
            }

            function setMaxDate() {
                if (attrs.maxDate) {
                    if (attrs.maxDate === "today") {
                        // add 1 day and subtruct 1 second
                        // in other case today's date cannot be selected because of current time
                        options.maxDate = moment(moment().add(1, 'days').format("L"))
                            .subtract(1, 's')
                            .format('YYYY-MM-DD HH:mm:ss');
                    } else {
                        options.maxDate = attrs.maxDate;
                    }
                }
            }

            function setDefaultDate() {
                if(attrs.defaultDate) {
                    if (attrs.defaultDate === 'today') {
                        options.defaultDate = moment().format('L');
                    } else {
                        options.defaultDate = moment(attrs.defaultDate);
                    }
                }
            }

            function roundingCurrentMinutes() {
                // rounding current minutes
                if (attrs.stepping) {
                    const steppingNumber = parseInt(attrs.stepping);
                    const defDate = options.defaultDate || undefined;
                    if (defDate) {
                        let roundedMinutes = getRoundedMinutes(defDate, steppingNumber, steppingNumber);
                        options.defaultDate = moment(defDate.minutes(roundedMinutes));
                    }
                }
            }

            function getRoundedMinutes(date, increment, offset) {
                const minutes = date.minutes();
                return Math.ceil((minutes - offset) / increment) * increment + offset;
            }

            function horizontalPosNormalize(datepicker, left, elemPosRect, datepickerWidth) {
                /* Check if datepicker positioned in left corner of input fit window at all*/
                const isFitWindowWidth = (elem.offset().left + datepickerWidth) < window.innerWidth;

                if (isFitWindowWidth) {
                    applyHorizontalPositionStyles(datepicker, left);
                } else {
                    left = elem.offset().left - (datepickerWidth - elemPosRect.width);

                    datepicker.css({
                        opacity: 0,
                        display: 'none'
                    });
                    $timeout(() => {
                        applyHorizontalPositionStyles(datepicker, left);
                        datepicker.css({
                            opacity: 1,
                            display: 'block'
                        });
                    }, 0);
                }
            }

            function verticalPosNormalize(datepicker, top, elemPosRect, datepickerHeight) {
                /*Check if datepicker positioned in left bottom corner of input fit window at all*/
                const isFitWindowHeight = (elemPosRect.top + datepickerHeight) < window.innerHeight;
                const inputMargin = 20;

                if ( isFitWindowHeight ) {
                    //Datetimepicker appears at the bottom of input
                    applyVerticalPositionStyles(datepicker, top);

                } else if (!isFitWindowHeight && ( elemPosRect.top - datepickerHeight ) > 0) {
                    // Datetimepicker appears at the top of input,
                    // because of dynamically changing height of datetimepicker, so
                    // we need to set up bottom position instead of top (elem.offset().top - datepickerHeight)

                    let bottom = document.body.clientHeight - elem.offset().top;
                    applyVerticalPositionStyles(datepicker, 'auto', bottom);

                } else {
                    //Increasing body height to put datetimepicker at the bottom of input
                    const documentHeight = document.body.clientHeight;
                    if ( (elem.offset().top + datepickerHeight) > documentHeight ) {
                        const bodyTmpHeight = elem.offset().top + elemPosRect.height + datepickerHeight + inputMargin;
                        positionTagStyle(bodyTmpHeight);
                    }

                    applyVerticalPositionStyles(datepicker, top);
                }
            }

            /**
             * @description - vertical positioning of datetimepicker
             * @param el - input with datetimepicker
             * @param top {Number}- top position value of datetimepicker
             * @param bottom {Number} - optional, if passed, top position will be set to 'auto'
             */
            function applyVerticalPositionStyles(el, top, bottom) {
                let bodyOffsetTop = parseInt($('body').css('top'));

                if (bottom && el.closest('.md-dialog-container') && bodyOffsetTop < 0) {
                    bodyOffsetTop = parseInt($('.md-dialog-container').css('top'));
                }

                if (isNaN(bodyOffsetTop)) {
                    bodyOffsetTop = 0;
                }

                el.css({
                    'top': bottom ? 'auto' : (top - bodyOffsetTop + 'px'),
                    'bottom': bottom ? (bottom - bodyOffsetTop + 'px') : 'auto'
                });
            }

            /**
             * @description - horizontal positioning of datetimepicker
             * @param el - input with datetimepicker
             * @param left {Number}- left position value of datetimepicker
             */
            function applyHorizontalPositionStyles(el, left) {
                el.css({ 'left': left + 'px' });
            }

            /**
             * @description - Increasing body height to show datetimepicker
             * @param height {Number}
             */
            function positionTagStyle(height) {
                if (height) {
                    let bodyStyles = `body { position:relative; height: ${height} }`;
                    $('head').append(`<style id="datetimepicker-body-increase" 
                                             type="text/css">${bodyStyles}</style>`);
                } else {
                    $('#datetimepicker-body-increase').remove();
                }
            }
        }
    }
}
