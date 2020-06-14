(function () {
    angular.module('app.core')
        .config(config);

    /* @ngInject */
    // add additional functionality to md-autocomplete
    function config($provide) {
        // extend Angular Material's mdAutoCompleteDirective
        $provide.decorator('$mdUtil', decorate$mdUtil);

        /* @ngInject */
        function decorate$mdUtil($delegate, $document) {

            // need to append to base compile function
            var disableScrollAround = $delegate.disableScrollAround;

            $delegate.disableScrollAround = function(element, parent, options) {

                $delegate.disableScrollAround._count = $delegate.disableScrollAround._count || 0;
                ++$delegate.disableScrollAround._count;
                if ($delegate.disableScrollAround._enableScrolling) return $delegate.disableScrollAround._enableScrolling;
                var body = $document[0].body,
                    restoreBody = disableBodyScroll();

                //@ TODO Figure out for what we disable scroll on all page

                //restoreElement = disableElementScroll(parent);

                var enableScrolling = $delegate.enableScrolling;

                $delegate.enableScrolling = function() {

                    if ($delegate.disableScrollAround._count > 0 &&
                        !--$delegate.disableScrollAround._count) {

                        restoreBody();
                        delete $delegate.disableScrollAround._enableScrolling;

                    }

                    return enableScrolling.call($delegate);
                };

                return $delegate.disableScrollAround._enableScrolling = function() {
                    if (!--$delegate.disableScrollAround._count) {
                        restoreBody();
                        //restoreElement();
                        delete $delegate.disableScrollAround._enableScrolling;
                    }
                };

                function getScrollTopPosition(element) {
                    element = angular.element(element || document.body);

                    var body = (element[0] == document.body) ? document.body : undefined;
                    var scrollTop = body ? body.scrollTop + body.parentElement.scrollTop : 0;

                    // Calculate the positive scroll offset
                    return scrollTop || Math.abs(element[0].getBoundingClientRect().top);
                }

                // Creates a virtual scrolling mask to absorb touchmove, keyboard, scrollbar clicking, and wheel events
                function disableElementScroll(element) {
                    element = angular.element(element || body);
                    var scrollMask;
                    if (options && options.disableScrollMask) {
                        scrollMask = element;
                    } else {
                        element = element[0];
                        scrollMask = angular.element(
                            '<div class="md-scroll-mask">' +
                            '  <div class="md-scroll-mask-bar"></div>' +
                            '</div>');
                        element.appendChild(scrollMask[0]);
                    }

                    scrollMask.on('wheel', preventDefault);
                    scrollMask.on('touchmove', preventDefault);

                    return function restoreScroll() {
                        scrollMask.off('wheel');
                        scrollMask.off('touchmove');
                        scrollMask[0].parentNode.removeChild(scrollMask[0]);
                        delete $delegate.disableScrollAround._enableScrolling;
                    };

                    function preventDefault(e) {
                        e.preventDefault();
                    }
                }

                // Converts the body to a position fixed block and translate it to the proper scroll position
                function disableBodyScroll() {
                    var htmlNode = body.parentNode,
                        restoreHtmlStyle = htmlNode.style.cssText || '',
                        restoreBodyStyle = body.style.cssText || '',
                        scrollOffset = getScrollTopPosition(body),
                        horizontalScrollOffset = body.scrollLeft,
                        scrollWidth = body.scrollWidth,
                        clientWidth = body.clientWidth;

                    if (body.scrollHeight > body.clientHeight + 1) {
                        applyStyles(body, {
                            position: 'fixed',
                            width: '100%',
                            top: -scrollOffset + 'px'
                        });

                        htmlNode.style.overflowY = 'scroll';
                    }

                    if (clientWidth < scrollWidth) {
                        if ($(element).hasClass('md-dialog-container')) {
                            if (!body.scrollHeight > body.clientHeight + 1) {
                                applyStyles(body, {
                                    overflow: 'hidden'
                                });
                            }
                        } else {
                            applyStyles(body, {
                                left: -horizontalScrollOffset + 'px'
                            });
                        }
                    }

                    return function restoreScroll() {
                        body.style.cssText = restoreBodyStyle;
                        htmlNode.style.cssText = restoreHtmlStyle;
                        body.scrollTop = scrollOffset;
                        body.scrollLeft = horizontalScrollOffset;
                        htmlNode.scrollTop = scrollOffset;
                    };
                }

                function applyStyles(el, styles) {
                    for (var key in styles) {
                        el.style[key] = styles[key];
                    }
                }
            };

            return $delegate;
        }
    }
})();
