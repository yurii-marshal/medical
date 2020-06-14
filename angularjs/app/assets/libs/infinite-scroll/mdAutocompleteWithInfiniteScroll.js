//mdAutocompleteWithInfiniteScroll
/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.0.0-rc4-master-9d52697
 */
//goog.provide('ng.material.components.autocomplete_infinite_scroll');
//goog.require('ng.material.components.icon');
//goog.require('ng.material.components.virtualRepeat');
//goog.require('ng.material.core');
/**
 * @ngdoc module
 * @name material.components.autocomplete_infinite_scroll
 */
/*
 * @see js folder for autocomplete implementation
 */
angular.module('material.components.autocomplete_infinite_scroll', [
  'material.core',
  'material.components.icon',
  'material.components.virtualRepeat'
]);

angular
  .module('material.components.autocomplete_infinite_scroll')
  .controller('MdAutocompleteWithInfiniteScrollCtrl', mdAutocompleteWithInfiniteScrollCtrl);

var ITEM_HEIGHT   = 41,
  MAX_HEIGHT    = 5.5 * ITEM_HEIGHT,
  MENU_PADDING  = 8,
  INPUT_PADDING = 2; // Padding provided by `md-input-container`

function mdAutocompleteWithInfiniteScrollCtrl ($scope, $element, $mdUtil, $mdConstant, $mdTheming, $window,
                             $animate, $rootElement, $attrs, $q) {
  //-- private variables
  var ctrl                 = this,
    elements             = null,
    itemParts            = $scope.itemsExpr.split(/ in /i),
    itemExpr             = itemParts[ 1 ],
    noBlur               = false,
    selectedItemWatchers = [],
    hasFocus             = false,
    lastCount            = 0;

  //-- public variables with handlers
  defineProperty('hidden', handleHiddenChange, true);

  //-- public variables
  ctrl.scope      = $scope;
  ctrl.parent     = $scope.$parent;
  ctrl.itemName   = itemParts[ 0 ];
  ctrl.loading    = false;
  ctrl.hidden     = true;
  ctrl.index      = null;
  ctrl.messages   = [];
  ctrl.id         = $mdUtil.nextUid();
  ctrl.isDisabled = null;
  ctrl.isRequired = null;
  ctrl.hasNotFound = false;
  ctrl.defInfineteRepeater = {
    getItemAtIndex: function () { return null;},
    getLength: function () { return 0;},
    items:[],
    totalCount: -1
  };
  ctrl.objInfiniteRepeater = ctrl.defInfineteRepeater;

  //-- public methods
  ctrl.keyup                         = keyup;
  ctrl.blur                          = blur;
  ctrl.focus                         = focus;
  ctrl.clear                         = clearValue;
  ctrl.select                        = select;
  ctrl.listEnter                     = onListEnter;
  ctrl.listLeave                     = onListLeave;
  ctrl.mouseUp                       = onMouseup;
  //ctrl.getCurrentDisplayValue        = getCurrentDisplayValue;
  ctrl.registerSelectedItemWatcher   = registerSelectedItemWatcher;
  ctrl.unregisterSelectedItemWatcher = unregisterSelectedItemWatcher;
  ctrl.notFoundVisible               = notFoundVisible;
  ctrl.loadingIsVisible              = loadingIsVisible;

  return init();

  //-- initialization methods

  /**
   * Initialize the controller, setup watchers, gather elements
   */
  function init () {
    $mdUtil.initOptionalProperties($scope, $attrs, { searchText: null, selectedItem: null });
    $mdTheming($element);
    configureWatchers();
    $mdUtil.nextTick(function () {
      gatherElements();
      moveDropdown();
      focusElement();
      $element.on('focus', focusElement);
    });
  }

  /**
   * Calculates the dropdown's position and applies the new styles to the menu element
   * @returns {*}
   */
  function positionDropdown () {
    if (!elements) return $mdUtil.nextTick(positionDropdown, false, $scope);
    var hrect  = elements.wrap.getBoundingClientRect(),
      vrect  = elements.snap.getBoundingClientRect(),
      root   = elements.root.getBoundingClientRect(),
      top    = vrect.bottom - root.top,
      bot    = root.bottom - vrect.top,
      left   = hrect.left - root.left,
      width  = hrect.width,
      offset = getVerticalOffset(),
      styles;
    // Adjust the width to account for the padding provided by `md-input-container`
    if ($attrs.mdFloatingLabel) {
      left += INPUT_PADDING;
      width -= INPUT_PADDING * 2;
    }
    styles = {
      left:     left + 'px',
      minWidth: width + 'px',
      maxWidth: Math.max(hrect.right - root.left, root.right - hrect.left) - MENU_PADDING + 'px'
    };
    if (top > bot && root.height - hrect.bottom - MENU_PADDING < MAX_HEIGHT) {
      styles.top       = 'auto';
      styles.bottom    = bot + 'px';
      styles.maxHeight = Math.min(MAX_HEIGHT, hrect.top - root.top - MENU_PADDING) + 'px';
    } else {
      styles.top       = (top - offset) + 'px';
      styles.bottom    = 'auto';
      styles.maxHeight = Math.min(MAX_HEIGHT, root.bottom - hrect.bottom - MENU_PADDING) + 'px';
    }

    elements.$.scrollContainer.css(styles);
    $mdUtil.nextTick(correctHorizontalAlignment, false);

    /**
     * Calculates the vertical offset for floating label examples to account for ngMessages
     * @returns {number}
     */
    function getVerticalOffset () {
      var offset = 0;
      var inputContainer = $element.find('md-input-container');
      if (inputContainer.length) {
        var input = inputContainer.find('input');
        offset = inputContainer.prop('offsetHeight');
        offset -= input.prop('offsetTop');
        offset -= input.prop('offsetHeight');
        // add in the height left up top for the floating label text
        offset += inputContainer.prop('offsetTop');
      }
      return offset;
    }

    /**
     * Makes sure that the menu doesn't go off of the screen on either side.
     */
    function correctHorizontalAlignment () {
      var dropdown = elements.scrollContainer.getBoundingClientRect(),
        styles   = {};
      if (dropdown.right > root.right - MENU_PADDING) {
        styles.left = (hrect.right - dropdown.width) + 'px';
      }
      elements.$.scrollContainer.css(styles);
    }
  }

  /**
   * Moves the dropdown menu to the body tag in order to avoid z-index and overflow issues.
   */
  function moveDropdown () {
    if (!elements.$.root.length) return;
    $mdTheming(elements.$.scrollContainer);
    elements.$.scrollContainer.detach();
    elements.$.root.append(elements.$.scrollContainer);
    if ($animate.pin) $animate.pin(elements.$.scrollContainer, $rootElement);
  }

  /**
   * Sends focus to the input element.
   */
  function focusElement () {
    if ($scope.autofocus) elements.input.focus();
  }

  /**
   * Sets up any watchers used by autocomplete
   */
  function configureWatchers () {
    var wait = parseInt($scope.delay, 10) || 0;
    $attrs.$observe('disabled', function (value) { ctrl.isDisabled = value; });
    $attrs.$observe('required', function (value) { ctrl.isRequired = value; });
    $scope.$watch('searchText', wait ? $mdUtil.debounce(handleSearchText, wait) : handleSearchText);
    $scope.$watch('selectedItem', selectedItemChange);
    angular.element($window).on('resize', positionDropdown);
    $scope.$on('$destroy', cleanup);
  }

  /**
   * Removes any events or leftover elements created by this controller
   */
  function cleanup () {
    angular.element($window).off('resize', positionDropdown);
    if ( elements ){
      var items = 'ul scroller scrollContainer input'.split(' ');
      angular.forEach(items, function(key){
        elements.$[key].remove();
      });
    }
  }

  /**
   * Gathers all of the elements needed for this controller
   */
  function gatherElements () {
    elements = {
      main:  $element[0],
      scrollContainer: $element[0].getElementsByClassName('md-virtual-repeat-container')[0],
      scroller: $element[0].getElementsByClassName('md-virtual-repeat-scroller')[0],
      ul:    $element.find('ul')[0],
      input: $element.find('input')[0],
      wrap:  $element.find('md-autocomplete-wrap')[0],
      root:  document.body
    };
    elements.ngMessages = $element.find('div[ng-messages]')[0];
    elements.li   = elements.ul.getElementsByTagName('li');
    elements.snap = getSnapTarget();
    elements.$    = getAngularElements(elements);
  }

  /**
   * Finds the element that the menu will base its position on
   * @returns {*}
   */
  function getSnapTarget () {
    for (var element = $element; element.length; element = element.parent()) {
      if (angular.isDefined(element.attr('md-autocomplete-snap'))) return element[ 0 ];
    }
    return elements.wrap;
  }

  /**
   * Gathers angular-wrapped versions of each element
   * @param elements
   * @returns {{}}
   */
  function getAngularElements (elements) {
    var obj = {};
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) obj[ key ] = angular.element(elements[ key ]);
    }
    return obj;
  }

  //-- event/change handlers

  /**
   * Handles changes to the `hidden` property.
   * @param hidden
   * @param oldHidden
   */
  function handleHiddenChange (hidden, oldHidden) {
    if (!hidden && oldHidden) {
      positionDropdown();

      if (elements) {
        $mdUtil.nextTick(function () {
          $mdUtil.disableScrollAround(elements.ul);
        }, false, $scope);
      }
    } else if (hidden && !oldHidden) {
      $mdUtil.nextTick(function () {
        $mdUtil.enableScrolling();
      }, false, $scope);
    }
  }

  /**
   * When the user mouses over the dropdown menu, ignore blur events.
   */
  function onListEnter () {
    noBlur = true;
  }

  /**
   * When the user's mouse leaves the menu, blur events may hide the menu again.
   */
  function onListLeave () {
    if (!hasFocus) elements.input.focus();
    noBlur = false;
    ctrl.hidden = shouldHide();
  }

  /**
   * When the mouse button is released, send focus back to the input field.
   */
  function onMouseup () {
    elements.input.focus();
  }

  /**
   * Handles changes to the selected item.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function selectedItemChange (selectedItem, previousSelectedItem) {

    if (!selectedItem && !previousSelectedItem) {
        return ;
    }

    if (selectedItem) {
      getDisplayValue(selectedItem).then(function (val) {
        $scope.searchText = val;
        handleSelectedItemChange(selectedItem, previousSelectedItem);
      });
    } else if (selectedItem === null) {
        $scope.searchText = '';
    }

    if (selectedItem !== previousSelectedItem) announceItemChange();
  }

  /**
   * Use the user-defined expression to announce changes each time a new item is selected
   */
  function announceItemChange () {
    angular.isFunction($scope.itemChange) && $scope.itemChange(getItemAsNameVal($scope.selectedItem));
  }

  /**
   * Use the user-defined expression to announce changes each time the search text is changed
   */
  function announceTextChange () {
    angular.isFunction($scope.textChange) && $scope.textChange();
  }

  /**
   * Calls any external watchers listening for the selected item.  Used in conjunction with
   * `registerSelectedItemWatcher`.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function handleSelectedItemChange (selectedItem, previousSelectedItem) {
    selectedItemWatchers.forEach(function (watcher) { watcher(selectedItem, previousSelectedItem); });
  }

  /**
   * Register a function to be called when the selected item changes.
   * @param cb
   */
  function registerSelectedItemWatcher (cb) {
    if (selectedItemWatchers.indexOf(cb) == -1) {
      selectedItemWatchers.push(cb);
    }
  }

  /**
   * Unregister a function previously registered for selected item changes.
   * @param cb
   */
  function unregisterSelectedItemWatcher (cb) {
    var i = selectedItemWatchers.indexOf(cb);
    if (i != -1) {
      selectedItemWatchers.splice(i, 1);
    }
  }

  /**
   * Handles changes to the searchText property.
   * @param searchText
   * @param previousSearchText
   */
  function handleSearchText (searchText, previousSearchText) {
    ctrl.index = getDefaultIndex();
    // do nothing on init
    if (searchText === previousSearchText) return;

    getDisplayValue($scope.selectedItem).then(function (val) {
      // clear selected item if search text no longer matches it
      if (searchText !== val) {
        if ($scope.selectedItem) {
          $scope.selectedItem = undefined;
        }

        // trigger change event if available
        if (searchText !== previousSearchText) announceTextChange();

        // cancel results if search text is not long enough
        if (!isMinLengthMet()) {
          ctrl.objInfiniteRepeater = ctrl.defInfineteRepeater;
          setLoading(false);
          updateMessages();
        } else {
          handleQuery();
        }
      }
    });

  }

  /**
   * Handles input blur event, determines if the dropdown should hide.
   */
  function blur () {
    hasFocus = false;
    if (!noBlur) {
      ctrl.hidden = shouldHide();
    }
  }

  /**
   * Force blur on input element
   * @param forceBlur
   */
  function doBlur(forceBlur) {
    if (forceBlur) {
      noBlur = false;
      hasFocus = false;
    }
    elements.input.blur();
  }

  /**
   * Handles input focus event, determines if the dropdown should show.
   */
  function focus () {
    hasFocus = true;
    //-- if searchText is null, let's force it to be a string
    if (!angular.isString($scope.searchText)) $scope.searchText = '';
    ctrl.hidden = shouldHide();
    //if (!ctrl.hidden) handleQuery();
  }

  /**
   * Handles keyboard input.
   * @param event
   */
  function keyup(event) {
    switch (event.keyCode) {
    //  case $mdConstant.KEY_CODE.DOWN_ARROW:
    //    if (ctrl.loading) return;
    //    event.stopPropagation();
    //    event.preventDefault();
    //    ctrl.index   = Math.min(ctrl.index + 1, ctrl.matches.length - 1);
    //    updateScroll();
    //    updateMessages();
    //    break;
    //  case $mdConstant.KEY_CODE.UP_ARROW:
    //    if (ctrl.loading) return;
    //    event.stopPropagation();
    //    event.preventDefault();
    //    ctrl.index   = ctrl.index < 0 ? ctrl.matches.length - 1 : Math.max(0, ctrl.index - 1);
    //    updateScroll();
    //    updateMessages();
    //    break;
    //  case $mdConstant.KEY_CODE.TAB:
    //    // If we hit tab, assume that we've left the list so it will close
    //    onListLeave();
    //
    //    if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
    //    select(ctrl.index);
    //    break;
    //  case $mdConstant.KEY_CODE.ENTER:
    //    if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
    //    if (hasSelection()) return;
    //    event.stopPropagation();
    //    event.preventDefault();
    //    select(ctrl.index);
    //    break;
     case $mdConstant.KEY_CODE.BACKSPACE:
     case $mdConstant.KEY_CODE.DELETE:
       if (!$scope.searchText) {
           $scope.searchText = '';
       }
       break;

     case $mdConstant.KEY_CODE.ESCAPE:
       event.stopPropagation();
       event.preventDefault();
       clearValue();

       // Force the component to blur if they hit escape
       doBlur(true);

       break;
       default:
    }
  }

  //-- getters

  /**
   * Returns the minimum length needed to display the dropdown.
   * @returns {*}
   */
  function getMinLength () {
    return angular.isNumber($scope.minLength) ? $scope.minLength : 1;
  }

  /**
   * Returns the display value for an item.
   * @param item
   * @returns {*}
   */
  function getDisplayValue (item) {
    return $q.when(getItemText(item) || item);

    /**
     * Getter function to invoke user-defined expression (in the directive)
     * to convert your object to a single string.
     */
    function getItemText (item) {

      return (item && $scope.itemText) ? $scope.itemText(getItemAsNameVal(item)) : null;
    }
  }

  /**
   * Returns the locals object for compiling item templates.
   * @param item
   * @returns {{}}
   */
  function getItemAsNameVal (item) {
    if (!item) return undefined;

    var locals = {};
    if (ctrl.itemName) locals[ ctrl.itemName ] = item;

    return locals;
  }

  /**
   * Returns the default index based on whether or not autoselect is enabled.
   * @returns {number}
   */
  function getDefaultIndex () {
    return $scope.autoselect ? 0 : -1;
  }

  /**
   * Sets the loading parameter and updates the hidden state.
   * @param value {boolean} Whether or not the component is currently loading.
   */
  function setLoading(value) {
    if (ctrl.loading != value) {
      ctrl.loading = value;
    }

    // Always refresh the hidden variable as something else might have changed
    ctrl.hidden = shouldHide();
  }

  /**
   * Determines if the menu should be hidden.
   * @returns {boolean}
   */
  function shouldHide () {
    if (ctrl.loading && !hasMatches()) return true; // Hide while loading initial matches
    else if (hasSelection()) return true;           // Hide if there is already a selection
    else if (!hasFocus) return true;                // Hide if the input does not have focus
    else return !shouldShow();                      // Defer to standard show logic
  }

  /**
   * Determines if the menu should be shown.
   * @returns {boolean}
   */
  function shouldShow() {
      // hasMatches was changed
      //return (isMinLengthMet() && hasMatches()) || notFoundVisible();
      return (isMinLengthMet()) || notFoundVisible();
  }

  /**
   * Returns true if the search text has matches.
   * @returns {boolean}
   */
  function hasMatches() {
    return true;
    //return ctrl.matches.length ? true : false;
  }

  /**
   * Returns true if the autocomplete has a valid selection.
   * @returns {boolean}
   */
  function hasSelection() {
    return ctrl.scope.selectedItem ? true : false;
  }

  /**
   * Returns true if the loading indicator is, or should be, visible.
   * @returns {boolean}
   */
  function loadingIsVisible() {
    return ctrl.loading && !hasSelection();
  }

  ///**
  // * Returns the display value of the current item.
  // * @returns {*}
  // */
  //function getCurrentDisplayValue () {
  //  return getDisplayValue(ctrl.matches.getItems()[ ctrl.index ]);
  //}

  /**
   * Determines if the minimum length is met by the search text.
   * @returns {*}
   */
  function isMinLengthMet () {
    return ($scope.searchText || '').length >= getMinLength();
  }

  //-- actions

  /**
   * Defines a public property with a handler and a default value.
   * @param key
   * @param handler
   * @param value
   */
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler(newValue, oldValue);
      }
    });
  }

  /**
   * Selects the item at the given index.
   * @param index
   */
  function select (index, item) {
    $mdUtil.nextTick(function () {
      getDisplayValue(item).then(function (val) {
        var ngModel = elements.$.input.controller('ngModel');
        ngModel.$setViewValue(val);
        ngModel.$render();
      }).finally(function () {
        $scope.selectedItem = item;
        setLoading(false);
      });
    }, false);
  }

  /**
   * Clears the searchText value and selected item.
   */
  function clearValue () {
    // Set the loading to true so we don't see flashes of content
    setLoading(true);

    // Reset our variables
    ctrl.index = 0;
    ctrl.objInfiniteRepeater = ctrl.defInfineteRepeater;
    $scope.searchText = '';

    // Tell the select to fire and select nothing
    select(-1);

    // Per http://www.w3schools.com/jsref/event_oninput.asp
    var eventObj = document.createEvent('CustomEvent');
    eventObj.initCustomEvent('input', true, true, { value: $scope.searchText });
    elements.input.dispatchEvent(eventObj);

    elements.input.focus();
  }

  /**
   * Fetches the results for the provided search text.
   * @param searchText
   */
  function fetchResults (searchText) {
      if ((searchText || '') !== ($scope.searchText || '')) return; //-- just cache the results if old request

      // it was setting loader to be displayed by default
      //setLoading(true);

    var items = [];
      ctrl.objInfiniteRepeater = {
        numLoaded_: 0,

        perPage: -1,
        totalCount: -1,
        currentPage: -1,

        requestIsSent: false,

        additionalShow: 5,

        getItemAtIndex: getItemAtIndex,
        getLength: getLength,

        fetchMoreItems_: fetchMoreItems_,
        stopLoadingMore: false

      };

      function getItemAtIndex(index) {
        if (index > this.numLoaded_) {
          if(!this.requestIsSent && this.totalCount !== 0 && !this.stopLoadingMore) {
            this.requestIsSent = true;
            this.fetchMoreItems_(this.currentPage+1);
          }
          return null;
        }

        return items[index] || null;
      };

      function getLength() {
        var res = 0;

        if(this.totalCount > 0) {
          if(this.numLoaded_ >= this.totalCount) {
            res = this.totalCount;
          }
          //issue if function that return data from server doesn't return values
          if(this.additionalShow === 0) {
            res = this.totalCount;
          }
        }
        res = this.numLoaded_ + this.additionalShow;

        return res;
      };

      function fetchMoreItems_(page) {
        var self = this;
        setLoading(true);

        $scope.$parent.$eval(itemExpr, {pageIndex:page})
          .then(function (responce) {
            self.totalCount = responce.Count || responce.data && responce.data.Count || 0;
            if(self.totalCount === 0) {
              self.additionalShow = 0;
            }
            var newItems = responce.Items ? responce.Items : responce.data.Items ? responce.data.Items : [];
            items = items.concat(newItems);
            self.numLoaded_ = items.length || 0;
            self.requestIsSent = false;

            //issue with additional empty items in virtual repiter if server return wrong count and empty Items
            if(!responce.Items || responce.Items.length < 1) {
              self.additionalShow = 0;
            }

            //issue with recursive request if item is empty
            if(angular.isArray(responce.Items) && responce.Items.length > 0) {
              self.currentPage = page;
            } else {
              self.stopLoadingMore = true;
            }
            setLoading(false);
          });
      };

      //ctrl.hidden  = shouldHide();
      //if ($scope.selectOnMatch) selectItemOnMatch();
      updateMessages();
      positionDropdown();
  }

  ///**
  // * Updates the ARIA messages
  // */
  function updateMessages () {
  //  getCurrentDisplayValue().then(function (msg) {
  //    ctrl.messages = [ getCountMessage(), msg ];
  //  });
  }

  /**
   * Returns the ARIA message for how many results match the current query.
   * @returns {*}
   */
  function getCountMessage () {
    //if (lastCount === ctrl.matches.length) return '';
    //lastCount = ctrl.matches.length;
    //switch (ctrl.matches.length) {
    //  case 0:
    //    return 'There are no matches available.';
    //  case 1:
    //    return 'There is 1 match available.';
    //  default:
    //    return 'There are ' + ctrl.matches.length + ' matches available.';
    //}
  }

  /**
   * Makes sure that the focused element is within view.
   */
  function updateScroll () {
    if (!elements.li[0]) return;
    var height = elements.li[0].offsetHeight,
      top = height * ctrl.index,
      bot = top + height,
      hgt = elements.scroller.clientHeight,
      scrollTop = elements.scroller.scrollTop;
    if (top < scrollTop) {
      scrollTo(top);
    } else if (bot > scrollTop + hgt) {
      scrollTo(bot - hgt);
    }
  }

  function scrollTo (offset) {
    elements.$.scrollContainer.controller('mdVirtualRepeatContainer').scrollTo(offset);
  }

  function notFoundVisible () {
    var textLength = (ctrl.scope.searchText || '').length;
    // hasMatches was changed
    //return ctrl.hasNotFound && !hasMatches() && !ctrl.loading && textLength >= getMinLength() && hasFocus && !hasSelection();
      return ctrl.hasNotFound && !ctrl.loading && textLength >= getMinLength() && hasFocus && !hasSelection()
          && (ctrl.objInfiniteRepeater && ctrl.objInfiniteRepeater.totalCount === 0);
  }

  /**
   * Starts the query to gather the results for the current searchText.  Attempts to return cached
   * results first, then forwards the process to `fetchResults` if necessary.
   */
  function handleQuery () {
    var searchText = $scope.searchText || '';

    fetchResults(searchText);

    ctrl.hidden = shouldHide();
  }

  /**
   * If there is only one matching item and the search text matches its display value exactly,
   * automatically select that item.  Note: This function is only called if the user uses the
   * `md-select-on-match` flag.
   */
  function selectItemOnMatch () {
    //var searchText = $scope.searchText,
    //  matches    = ctrl.matches,
    //  item       = matches.getItems()[ 0 ];
    //if (matches.length === 1) getDisplayValue(item).then(function (displayValue) {
    //  if (searchText == displayValue) select(0);
    //});
  }

}
mdAutocompleteWithInfiniteScrollCtrl.$inject = ["$scope", "$element", "$mdUtil", "$mdConstant", "$mdTheming", "$window", "$animate", "$rootElement", "$attrs", "$q"];

angular
  .module('material.components.autocomplete_infinite_scroll')
  .directive('mdAutocompleteWithInfiniteScroll', MdAutocompleteWithInfiniteScroll);

/**
 * @ngdoc directive
 * @name mdAutocomplete
 * @module material.components.autocomplete_infinite_scroll
 *
 * @description
 * `<md-autocomplete>` is a special input component with a drop-down of all possible matches to a
 *     custom query. This component allows you to provide real-time suggestions as the user types
 *     in the input area.
 *
 * To start, you will need to specify the required parameters and provide a template for your
 *     results. The content inside `md-autocomplete` will be treated as a template.
 *
 * In more complex cases, you may want to include other content such as a message to display when
 *     no matches were found.  You can do this by wrapping your template in `md-item-template` and
 *     adding a tag for `md-not-found`.  An example of this is shown below.
 *
 * ### Validation
 *
 * You can use `ng-messages` to include validation the same way that you would normally validate;
 *     however, if you want to replicate a standard input with a floating label, you will have to
 *     do the following:
 *
 * - Make sure that your template is wrapped in `md-item-template`
 * - Add your `ng-messages` code inside of `md-autocomplete`
 * - Add your validation properties to `md-autocomplete` (ie. `required`)
 * - Add a `name` to `md-autocomplete` (to be used on the generated `input`)
 *
 * There is an example below of how this should look.
 *
 *
 * @param {expression} md-items An expression in the format of `item in items` to iterate over
 *     matches for your search.
 * @param {expression=} md-selected-item-change An expression to be run each time a new item is
 *     selected
 * @param {expression=} md-search-text-change An expression to be run each time the search text
 *     updates
 * @param {expression=} md-search-text A model to bind the search query text to
 * @param {object=} md-selected-item A model to bind the selected item to
 * @param {expression=} md-item-text An expression that will convert your object to a single string.
 * @param {string=} placeholder Placeholder text that will be forwarded to the input.
 * @param {boolean=} md-no-cache Disables the internal caching that happens in autocomplete
 * @param {boolean=} ng-disabled Determines whether or not to disable the input field
 * @param {number=} md-min-length Specifies the minimum length of text before autocomplete will
 *     make suggestions
 * @param {number=} md-delay Specifies the amount of time (in milliseconds) to wait before looking
 *     for results
 * @param {boolean=} md-autofocus If true, will immediately focus the input element
 * @param {boolean=} md-autoselect If true, the first item will be selected by default
 * @param {string=} md-menu-class This will be applied to the dropdown menu for styling
 * @param {string=} md-floating-label This will add a floating label to autocomplete and wrap it in
 *     `md-input-container`
 * @param {string=} md-input-name The name attribute given to the input element to be used with
 *     FormController
 * @param {string=} md-input-id An ID to be added to the input element
 * @param {number=} md-input-minlength The minimum length for the input's value for validation
 * @param {number=} md-input-maxlength The maximum length for the input's value for validation
 * @param {boolean=} md-select-on-match When set, autocomplete will automatically select exact
 *     the item if the search text is an exact match
 *
 * @usage
 * ### Basic Example
 * <hljs lang="html">
 *   <md-autocomplete
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-autocomplete>
 * </hljs>
 *
 * ### Example with "not found" message
 * <hljs lang="html">
 * <md-autocomplete
 *     md-selected-item="selectedItem"
 *     md-search-text="searchText"
 *     md-items="item in getMatches(searchText)"
 *     md-item-text="item.display">
 *   <md-item-template>
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-item-template>
 *   <md-not-found>
 *     No matches found.
 *   </md-not-found>
 * </md-autocomplete>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `md-not-found` to specify the
 *     different parts that make up our component.
 *
 * ### Example with validation
 * <hljs lang="html">
 * <form name="autocompleteForm">
 *   <md-autocomplete
 *       required
 *       md-input-name="autocomplete"
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <md-item-template>
 *       <span md-highlight-text="searchText">{{item.display}}</span>
 *     </md-item-template>
 *     <div ng-messages="autocompleteForm.autocomplete_infinite_scroll.$error">
 *       <div ng-message="required">This field is required</div>
 *     </div>
 *   </md-autocomplete>
 * </form>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `md-not-found` to specify the
 *     different parts that make up our component.
 */

function MdAutocompleteWithInfiniteScroll () {
  var hasNotFoundTemplate = false;
  return {
    controller:   'MdAutocompleteWithInfiniteScrollCtrl',
    controllerAs: '$mdAutocompleteScrollCtrl',
    scope:        {
      inputName:      '@mdInputName',
      inputMinlength: '@mdInputMinlength',
      inputMaxlength: '@mdInputMaxlength',
      searchText:     '=?mdSearchText',
      selectedItem:   '=?mdSelectedItem',
      itemsExpr:      '@mdItems',
      itemText:       '&mdItemText',
      placeholder:    '@placeholder',
      selectOnMatch:  '=?mdSelectOnMatch',
      itemChange:     '&?mdSelectedItemChange',
      textChange:     '&?mdSearchTextChange',
      minLength:      '=?mdMinLength',
      delay:          '=?mdDelay',
      autofocus:      '=?mdAutofocus',
      floatingLabel:  '@?mdFloatingLabel',
      autoselect:     '=?mdAutoselect',
      menuClass: '@?mdMenuClass',
      menuContainerClass: "@?mdMenuContainerClass",
      inputId:        '@?mdInputId'
    },
    link: function(scope, element, attrs, controller) {
        // Retrieve the state of using a md-not-found template by using our attribute, which will
        // be added to the element in the template function.
        controller.hasNotFound = !!element.attr('md-has-not-found');
    },
    template:     function (element, attr) {
      var formName = "infiniteAutoCompleteForm" + guid(true);
      var inputName = attr["mdInputName"];
      var noItemsTemplate = getNoItemsTemplate(),
        itemTemplate    = getItemTemplate(),
        leftover        = element.html(),
        tabindex        = attr.tabindex;

        // Set our attribute for the link function above which runs later.
        // We will set an attribute, because otherwise the stored variables will be trashed when
        // removing the element is hidden while retrieving the template. For example when using ngIf.
        if (noItemsTemplate) element.attr('md-has-not-found', true);

      if (attr.hasOwnProperty('tabindex')) {
        element.attr('tabindex', '-1');
      }
      return '\
        <md-autocomplete-wrap\
            ng-form="'+formName+'"\
            layout="row"\
            ng-class="{ \'md-menu-showing\': !$mdAutocompleteScrollCtrl.hidden }"\
            role="listbox">\
          ' + getInputElement() + '\
          <md-progress-linear\
              class="' + (attr.mdFloatingLabel ? 'md-inline' : '') + '"\
              ng-if="$mdAutocompleteScrollCtrl.loadingIsVisible()"\
              md-mode="indeterminate"></md-progress-linear>\
          <md-virtual-repeat-container\
              md-auto-shrink\
              md-auto-shrink-min="1"\
              ng-mouseenter="$mdAutocompleteScrollCtrl.listEnter()"\
              ng-mouseleave="$mdAutocompleteScrollCtrl.listLeave()"\
              ng-mouseup="$mdAutocompleteScrollCtrl.mouseUp()"\
              ng-hide="$mdAutocompleteScrollCtrl.hidden"\
              class="md-autocomplete-suggestions-container md-whiteframe-z1 ' + attr.mdMenuContainerClass + '"\
              ng-class="{ \'md-not-found\': $mdAutocompleteCtrl.notFoundVisible(), \'visible-hidden\': ($mdAutocompleteScrollCtrl.objInfiniteRepeater.totalCount === -1) }"\
              role="presentation">\
            <ul class="md-autocomplete-suggestions"\
                ng-class="::menuClass"\
                id="ul-{{$mdAutocompleteScrollCtrl.id}}">\
              <li md-virtual-repeat="item in $mdAutocompleteScrollCtrl.objInfiniteRepeater"\
                  md-on-demand=""\
                  ng-class="{ selected: $index === $mdAutocompleteScrollCtrl.index }"\
                  ng-click="$mdAutocompleteScrollCtrl.select($index, item)">\
                  ' + itemTemplate + '\
              </li>'
                + noItemsTemplate + '\
            </ul>\
          </md-virtual-repeat-container>\
        </md-autocomplete-wrap>';

      function getNgMessagesTemplate() {
          var templateTag = element.find('div[ng-messages]').detach();
          var html = templateTag.length ? templateTag.html() : element.html();
          var classToAttach = templateTag.attr("class");

          var msgTemplate =
              '<div ng-messages="'+formName+'.'+inputName+'.$error" class="'+classToAttach+'">' + html + '</div>';

          return msgTemplate;
      }

      function getItemTemplate() {
        var templateTag = element.find('md-item-template').detach(),
          html = templateTag.length ? templateTag.html() : element.html();
        if (!templateTag.length) element.empty();
        return '<md-autocomplete-scroll-parent-scope md-autocomplete-replace>' + html + '</md-autocomplete-scroll-parent-scope>';
      }

      function getNoItemsTemplate() {
        var templateTag = element.find('md-not-found').detach(),
          template = templateTag.length ? templateTag.html() : '';
        return template
         ? '<li ng-if="$mdAutocompleteScrollCtrl.notFoundVisible()"\>' + template + '</li>'
         : '';

      }

      function getInputElement () {
        var ngMessagesTemplate = getNgMessagesTemplate();
        if (attr.mdFloatingLabel) {
          return '\
            <md-input-container flex ng-if="floatingLabel">\
              <label>{{floatingLabel}}</label>\
              <input type="search"\
                  ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                  id="{{ inputId || \'fl-input-\' + $mdAutocompleteScrollCtrl.id }}"\
                  name="{{inputName}}"\
                  autocomplete="off"\
                  ng-required="$mdAutocompleteScrollCtrl.isRequired"\
                  ng-disabled="$mdAutocompleteScrollCtrl.isDisabled"\
                  ng-model="$mdAutocompleteScrollCtrl.scope.searchText"\
                  ng-keyup="$mdAutocompleteScrollCtrl.keyup($event)"\
                  ng-blur="$mdAutocompleteScrollCtrl.blur()"\
                  ng-focus="$mdAutocompleteScrollCtrl.focus()"\
                  ng-minlength="inputMinlength"\
                  ng-maxlength="inputMaxlength"\
                  aria-owns="ul-{{$mdAutocompleteScrollCtrl.id}}"\
                  aria-label="{{floatingLabel}}"\
                  aria-autocomplete="list"\
                  aria-haspopup="true"\
                  aria-activedescendant=""\
                  ' + (attr.clearOnClick ? 'clear-on-click' : '') + '\
                  ' + (attr.requireSearchTextOnly ? 'require-search-text-only' : '') + '\
                  ' + (attr.mdAutocompleteRequired ? 'md-autocomplete-required' : '') + '\
                  aria-expanded="{{!$mdAutocompleteScrollCtrl.hidden}}"/>\
                  ' + ngMessagesTemplate + '\
            </md-input-container>';
        } else {
          return '\
            <input flex type="search"\
                ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                id="{{ inputId || \'input-\' + $mdAutocompleteScrollCtrl.id }}"\
                name="{{inputName}}"\
                ng-if="!floatingLabel"\
                autocomplete="off"\
                ng-required="$mdAutocompleteScrollCtrl.isRequired"\
                ng-disabled="$mdAutocompleteScrollCtrl.isDisabled"\
                ng-model="$mdAutocompleteScrollCtrl.scope.searchText"\
                ng-keyup="$mdAutocompleteScrollCtrl.keyup($event)"\
                ng-blur="$mdAutocompleteScrollCtrl.blur()"\
                ng-focus="$mdAutocompleteScrollCtrl.focus()"\
                placeholder="{{placeholder}}"\
                aria-owns="ul-{{$mdAutocompleteScrollCtrl.id}}"\
                aria-label="{{placeholder}}"\
                aria-autocomplete="list"\
                aria-haspopup="true"\
                aria-activedescendant=""\
                ' + (attr.clearOnClick ? 'clear-on-click' : '') + '\
                ' + (attr.requireSearchTextOnly ? 'require-search-text-only' : '') + '\
                ' + (attr.mdAutocompleteRequired ? 'md-autocomplete-required' : '') + '\
                aria-expanded="{{!$mdAutocompleteScrollCtrl.hidden}}"/>\
                ' + ngMessagesTemplate + '\
            <button\
                type="button"\
                tabindex="-1"\
                ng-if="$mdAutocompleteScrollCtrl.scope.searchText && !$mdAutocompleteScrollCtrl.isDisabled"\
                ng-click="$mdAutocompleteScrollCtrl.clear()">\
              <md-icon md-svg-icon="md-close"></md-icon>\
              <span class="md-visually-hidden">Clear</span>\
            </button>\
                ';
        }
      }
    }
  };
}

angular
  .module('material.components.autocomplete_infinite_scroll')
  .directive('mdAutocompleteScrollParentScope', MdAutocompleteScrollItemScopeDirective);

function MdAutocompleteScrollItemScopeDirective($compile, $mdUtil) {
  return {
    restrict: 'AE',
    link: postLink,
    terminal: true
  };

  function postLink(scope, element, attr) {
    var ctrl = scope.$mdAutocompleteScrollCtrl;
    var newScope = ctrl.parent.$new();
    var itemName = ctrl.itemName;

    // Watch for changes to our scope's variables and copy them to the new scope
    watchVariable('$index', '$index');
    watchVariable('item', itemName);

    // Recompile the contents with the new/modified scope
    $compile(element.contents())(newScope);

    // Replace it if required
    if (attr.hasOwnProperty('mdAutocompleteReplace')) {
      element.after(element.contents());
      element.remove();
    }

    /**
     * Creates a watcher for variables that are copied from the parent scope
     * @param variable
     * @param alias
     */
    function watchVariable(variable, alias) {
      newScope[alias] = scope[variable];

      scope.$watch(variable, function(value) {
        $mdUtil.nextTick(function() {
          newScope[alias] = value;
        });
      });
    }
  }
}
MdAutocompleteScrollItemScopeDirective.$inject = ["$compile", "$mdUtil"];
