(function() {
    "use strict";

    angular
        .module("app")
        .directive("scrollBar", scrollBar);

    /* @ngInject */
    function scrollBar($timeout) {
        var directive = {
            restrict: "A",
            scope:{
                onTotalScrollBack: '=?',
                onTotalScroll: '=?'
            },
            link: function(scope, elem, attr) {

                var defaults = {
                    setWidth: false,    // Set the width of your content (overwrites CSS width), value in pixels (integer) or percentage (string).
                    setHeight: false,   // Set the height of your content (overwrites CSS height), value in pixels (integer) or percentage (string).
                    setTop: 0,          // Set the initial css top property of content, accepts string values (css top position). Example: setTop: "-100px".
                    setLeft: 0,         // Set the initial css left property of content, accepts string values (css left position). Example: setLeft: "-100px".
                    axis: "y",          // Define content’s scrolling axis (the type of scrollbars added to the element: vertical and/of horizontal). Available values: "y", "x", "yx".
                    scrollbarPosition: "inside",    // Set the position of scrollbar in relation to content. Available values: "inside", "outside".
                    scrollInertia: 200,             // Set the amount of scrolling momentum as animation duration in milliseconds. Set to 0 to disable.
                    autoDraggerLength: true,        // Enable or disable auto-adjusting scrollbar dragger length in relation to scrolling amount (same bahavior with browser’s native scrollbar).
                    autoHideScrollbar: false,        // Enable or disable auto-hiding the scrollbar when inactive.
                    autoExpandScrollbar: false,     // Enable or disable auto-expanding the scrollbar when cursor is over or dragging the scrollbar.
                    alwaysShowScrollbar: 0,         // Always keep scrollbar(s) visible, even when there’s nothing to scroll. 0 – disable (default), 1 – keep dragger rail visible, 2 – keep all scrollbar components (dragger, rail, buttons etc.) visible
                    // snapAmount: integer,         // Make scrolling snap to a multiple of a fixed number of pixels. Useful in cases like scrolling tabular data, image thumbnails or slides and you need to prevent scrolling from stopping half-way your elements. Note that your elements must be of equal width or height in order for this to work properly. To set different values for vertical and horizontal scrolling, use an array: [y,x]
                    // snapOffset: integer,         // Set an offset (in pixels) for the snapAmount option. Useful when for example you need to offset the snap amount of table rows by the table header.
                    mouseWheel: {
                        enable: true,               // Enable or disable content scrolling via mouse-wheel.
                        scrollAmount: 200,          // Int Set the mouse-wheel scrolling amount (in pixels). The default value "auto" adjusts scrolling amount according to scrollable content length.
                        axis: "y",                  // Define the mouse-wheel scrolling axis when both vertical and horizontal scrollbars are present. Set axis: "y" (default) for vertical or axis: "x" for horizontal scrolling.
                        preventDefault: true,       // Prevent the default behaviour which automatically scrolls the parent element when end or beginning of scrolling is reached (same bahavior with browser’s native scrollbar).
                        deltaFactor: "auto",        // integer. Set the number of pixels one wheel notch scrolls. The default value “auto” uses the OS/browser value.
                        // normalizeDelta: boolean, // Enable or disable mouse-wheel (delta) acceleration. Setting normalizeDelta: true translates mouse-wheel delta value to -1 or 1.
                        invert: false               // Invert mouse-wheel scrolling direction. Set to true to scroll down or right when mouse-wheel is turned upwards.
                    },
                    scrollButtons: {
                        enable: false,              // Enable or disable scrollbar buttons.
                        scrollAmount: "auto",       // integer. Set the buttons scrolling amount (in pixels). The default value "auto" adjusts scrolling amount according to scrollable content length.
                        //scrollType: "string",     // Define the buttons scrolling type/behavior: scrollType: "stepless" – continuously scroll content while pressing the button (default), scrollType: "stepped" – each button click scrolls content by a certain amount (defined in scrollAmount option above)
                        //tabindex: integer         // Set a tabindex value for the buttons.
                    },
                    keyboard: {
                        enable: false,              // Enable or disable content scrolling via the keyboard. The plugin supports the directional arrows (top, left, right and down), page-up (PgUp), page-down (PgDn), Home and End keys
                        scrollAmount: "auto",       // integer. Set the keyboard arrows scrolling amount (in pixels). The default value "auto" adjusts scrolling amount according to scrollable content length.
                        // scrollType: "string"     // Define the keyboard arrows scrolling type/behavior.
                    },
                    contentTouchScroll: 25,         // Enable or disable content touch-swipe scrolling for touch-enabled devices. To completely disable, set contentTouchScroll: false. Integer values define the axis-specific minimum amount required for scrolling momentum (default: 25).
                    //documentTouchScroll: boolean, // Enable or disable document touch-swipe scrolling for touch-enabled devices.
                    advanced: {
                        updateOnContentResize: true,// Update scrollbar(s) automatically on content, element or viewport resize.
                        theme: "minimal"            // Set the scrollbar theme
                    },
                    callbacks: {
                        // onCreate: function(){},              // A function to call when plugin markup is created.
                        // onInit: function(){},                // A function to call when scrollbars have initialized
                        // onScrollStart: function(){},         // A function to call when scrolling starts
                        // onScroll: function(){},              // A function to call when scrolling is completed
                        // whileScrolling: function(){},        // A function to call while scrolling is active
                        onTotalScroll: function(){},         // A function to call when scrolling is completed and content is scrolled all the way to the end (bottom/right)
                        // onTotalScrollBack: function(){},     // A function to call when scrolling is completed and content is scrolled back to the beginning (top/left)
                        // onTotalScrollOffset: integer,        // Set an offset for the onTotalScroll option. For example, setting onTotalScrollOffset: 100 will trigger the onTotalScroll callback 100 pixels before the end of scrolling is reached.
                        // onTotalScrollBackOffset: integer,    // Set an offset for the onTotalScrollBack option. For example, setting onTotalScrollBackOffset: 100 will trigger the onTotalScrollBack callback 100 pixels before the beginning of scrolling is reached.
                        // alwaysTriggerOffsets: boolean,       // Set the behavior of calling onTotalScroll and onTotalScrollBack offsets.
                        // onOverflowY: function(){},           // A function to call when content becomes long enough and vertical scrollbar is added.
                        // onOverflowX: function(){},           // A function to call when content becomes wide enough and horizontal scrollbar is added.
                        // onOverflowYNone: function(){},       // A function to call when content becomes short enough and vertical scrollbar is removed.
                        // onOverflowXNone: function(){},       // A function to call when content becomes narrow enough and horizontal scrollbar is removed.
                        // onBeforeUpdate: function(){},        // A function to call right before scrollbar(s) are updated.
                        onUpdate: function() {
                            checkScrollBar();
                        }
                        // onImageLoad: function(){},           // A function to call each time an image inside the element is fully loaded and scrollbar(s) are updated.
                        // onSelectorChange: function(){}       // A function to call each time a type of element is added, removed or changes its size and scrollbar(s) are updated.
                    },
                    live: true                      // Enable or disable applying scrollbar(s) on all elements matching the current selector, now and in the future. Set live: true when you need to add scrollbar(s) on elements that do not yet exist in the page.
                    // liveSelector: "string"       // Set the matching set of elements (instead of the current selector) to add scrollbar(s), now and in the future.
                };

                if (window.innerWidth <= 1400) {
                    defaults.mouseWheel.preventDefault = false;
                }

                if(scope.onTotalScrollBack)
                    defaults.callbacks.onTotalScrollBack = scope.onTotalScrollBack;

                if(scope.onTotalScroll)
                    defaults.callbacks.onTotalScroll = scope.onTotalScroll;

                if(scope.onTotalScrollBackOffset)
                    defaults.callbacks.onTotalScrollBackOffset = scope.onTotalScrollBackOffset;

                var isAboveElement = attr.scrollBarAboveElement ? attr.scrollBarAboveElement : false;   // If we need to set scrollbar above element children with no margin
                var isScrollBarLeft = attr.scrollBarLeft ? attr.scrollBarLeft : false;                  // If we need to set scrollbar on the left

                // All code in timeout for waiting render elements for use this script
                $timeout(function() {
                    elem.mCustomScrollbar(defaults);

                    if ( isAboveElement ) {
                        elem.addClass('above-element');
                    }

                    if ( isScrollBarLeft ) {
                        elem.addClass('scrollbar-left');
                    }

                }, 20);

                function checkScrollBar() {
                    if (elem.find('.mCustomScrollBox').height() == elem.find('.mCSB_dragger').height()) {
                        elem.find('.mCSB_dragger').hide();
                        elem.find('.mCSB_draggerRail').hide();
                    } else {
                        elem.find('.mCSB_dragger').show();
                        elem.find('.mCSB_draggerRail').show();
                    }
                }
            }
        };
        return directive;
    }
})();
