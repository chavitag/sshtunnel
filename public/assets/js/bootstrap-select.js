webpackJsonp([11],{

/***/ "./node_modules/bootstrap-select/dist/js/bootstrap-select.js":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-select/dist/js/bootstrap-select.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Bootstrap-select v1.13.5 (https://developer.snapappointments.com/bootstrap-select)
 *
 * Copyright 2012-2018 SnapAppointments, LLC
 * Licensed under MIT (https://github.com/snapappointments/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (true) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (a0) {
      return (factory(a0));
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {

(function ($) {
  'use strict';

  // Polyfill for browsers with no classList support
  // Remove in v2
  if (!('classList' in document.createElement('_'))) {
    (function (view) {
      if (!('Element' in view)) return;

      var classListProp = 'classList',
          protoProp = 'prototype',
          elemCtrProto = view.Element[protoProp],
          objCtr = Object,
          classListGetter = function () {
            var $elem = $(this);

            return {
              add: function (classes) {
                return $elem.addClass(classes);
              },
              remove: function (classes) {
                return $elem.removeClass(classes);
              },
              toggle: function (classes, force) {
                return $elem.toggleClass(classes, force);
              },
              contains: function (classes) {
                return $elem.hasClass(classes);
              }
            }
          };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    }(window));
  }

  var testElement = document.createElement('_');

  testElement.classList.toggle('c3', false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains('c3')) {
    var _toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.toggle = function (token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };
  }

  testElement = null;

  // shallow array comparison
  function isEqual (array1, array2) {
    return array1.length === array2.length && array1.every(function (element, index) {
      return element === array2[index];
    });
  };

  // <editor-fold desc="Shims">
  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
    ) {
      // initialize object and result
      r = [];
      // iterate over object keys
      for (k in o) {
        // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      }
      // return result
      return r;
    };
  }

  // much faster than $.val()
  function getSelectValues (select) {
    var result = [];
    var options = select && select.options;
    var opt;

    if (select.multiple) {
      for (var i = 0, len = options.length; i < len; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
    } else {
      result = select.value;
    }

    return result;
  }

  // set data-selected on select element if the value has been programmatically selected
  // prior to initialization of bootstrap-select
  // * consider removing or replacing an alternative method *
  var valHooks = {
    useDefault: false,
    _set: $.valHooks.select.set
  };

  $.valHooks.select.set = function (elem, value) {
    if (value && !valHooks.useDefault) $(elem).data('selected', true);

    return valHooks._set.apply(this, arguments);
  };

  var changedArguments = null;

  var EventIsSupported = (function () {
    try {
      new Event('change');
      return true;
    } catch (e) {
      return false;
    }
  })();

  $.fn.triggerNative = function (eventName) {
    var el = this[0],
        event;

    if (el.dispatchEvent) { // for modern browsers & IE9+
      if (EventIsSupported) {
        // For modern browsers
        event = new Event(eventName, {
          bubbles: true
        });
      } else {
        // For IE since it doesn't support Event constructor
        event = document.createEvent('Event');
        event.initEvent(eventName, true, false);
      }

      el.dispatchEvent(event);
    } else if (el.fireEvent) { // for IE8
      event = document.createEventObject();
      event.eventType = eventName;
      el.fireEvent('on' + eventName, event);
    } else {
      // fall back to jQuery.trigger
      this.trigger(eventName);
    }
  };
  // </editor-fold>

  function stringSearch (li, searchString, method, normalize) {
    var stringTypes = [
          'content',
          'subtext',
          'tokens'
        ],
        searchSuccess = false;

    for (var i = 0; i < stringTypes.length; i++) {
      var stringType = stringTypes[i],
          string = li[stringType];

      if (string) {
        string = string.toString();

        // Strip HTML tags. This isn't perfect, but it's much faster than any other method
        if (stringType === 'content') {
          string = string.replace(/<[^>]+>/g, '');
        }

        if (normalize) string = normalizeToBase(string);
        string = string.toUpperCase();

        if (method === 'contains') {
          searchSuccess = string.indexOf(searchString) >= 0;
        } else {
          searchSuccess = string.startsWith(searchString);
        }

        if (searchSuccess) break;
      }
    }

    return searchSuccess;
  }

  function toInteger (value) {
    return parseInt(value, 10) || 0;
  }

  // Borrowed from Lodash (_.deburr)
  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to compose unicode character classes. */
  var rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboMarksExtendedRange = '\\u1ab0-\\u1aff',
      rsComboMarksSupplementRange = '\\u1dc0-\\u1dff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange + rsComboMarksExtendedRange + rsComboMarksSupplementRange;

  /** Used to compose unicode capture groups. */
  var rsCombo = '[' + rsComboRange + ']';

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  function deburrLetter (key) {
    return deburredLetters[key];
  };

  function normalizeToBase (string) {
    string = string.toString();
    return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
  }

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`'
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function (map) {
    var escaper = function (match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + Object.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function (string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  var htmlEscape = createEscaper(escapeMap);
  var htmlUnescape = createEscaper(unescapeMap);

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var keyCodeMap = {
    32: ' ',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    59: ';',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9'
  };

  var keyCodes = {
    ESCAPE: 27, // KeyboardEvent.which value for Escape (Esc) key
    ENTER: 13, // KeyboardEvent.which value for Enter key
    SPACE: 32, // KeyboardEvent.which value for space key
    TAB: 9, // KeyboardEvent.which value for tab key
    ARROW_UP: 38, // KeyboardEvent.which value for up arrow key
    ARROW_DOWN: 40 // KeyboardEvent.which value for down arrow key
  }

  var version = {
    success: false,
    major: '3'
  };

  try {
    version.full = ($.fn.dropdown.Constructor.VERSION || '').split(' ')[0].split('.');
    version.major = version.full[0];
    version.success = true;
  } catch (err) {
    console.warn(
      'There was an issue retrieving Bootstrap\'s version. ' +
      'Ensure Bootstrap is being loaded before bootstrap-select and there is no namespace collision. ' +
      'If loading Bootstrap asynchronously, the version may need to be manually specified via $.fn.selectpicker.Constructor.BootstrapVersion.',
      err
    );
  }

  var selectId = 0;

  var EVENT_KEY = '.bs.select';

  var classNames = {
    DISABLED: 'disabled',
    DIVIDER: 'divider',
    SHOW: 'open',
    DROPUP: 'dropup',
    MENU: 'dropdown-menu',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    // to-do: replace with more advanced template/customization options
    BUTTONCLASS: 'btn-default',
    POPOVERHEADER: 'popover-title'
  }

  var Selector = {
    MENU: '.' + classNames.MENU
  }

  if (version.major === '4') {
    classNames.DIVIDER = 'dropdown-divider';
    classNames.SHOW = 'show';
    classNames.BUTTONCLASS = 'btn-light';
    classNames.POPOVERHEADER = 'popover-header';
  }

  var REGEXP_ARROW = new RegExp(keyCodes.ARROW_UP + '|' + keyCodes.ARROW_DOWN);
  var REGEXP_TAB_OR_ESCAPE = new RegExp('^' + keyCodes.TAB + '$|' + keyCodes.ESCAPE);

  var Selectpicker = function (element, options) {
    var that = this;

    // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
    if (!valHooks.useDefault) {
      $.valHooks.select.set = valHooks._set;
      valHooks.useDefault = true;
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.options = options;
    this.selectpicker = {
      main: {
        // store originalIndex (key) and newIndex (value) in this.selectpicker.main.map.newIndex for fast accessibility
        // allows us to do this.main.elements[this.selectpicker.main.map.newIndex[index]] to select an element based on the originalIndex
        map: {
          newIndex: {},
          originalIndex: {}
        }
      },
      current: {
        map: {}
      }, // current changes if a search is in progress
      search: {
        map: {}
      },
      view: {},
      keydown: {
        keyHistory: '',
        resetKeyHistory: {
          start: function () {
            return setTimeout(function () {
              that.selectpicker.keydown.keyHistory = '';
            }, 800);
          }
        }
      }
    };
    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    // Format window padding
    var winPad = this.options.windowPadding;
    if (typeof winPad === 'number') {
      this.options.windowPadding = [winPad, winPad, winPad, winPad];
    }

    // Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.destroy;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.13.5';

  Selectpicker.BootstrapVersion = version.major;

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? '{0} item selected' : '{0} items selected';
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'btn',
    style: classNames.BUTTONCLASS,
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    showTick: false,
    template: {
      caret: '<span class="caret"></span>'
    },
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false,
    windowPadding: 0,
    virtualScroll: 600,
    display: false
  };

  if (version.major === '4') {
    Selectpicker.DEFAULTS.style = 'btn-light';
    Selectpicker.DEFAULTS.iconBase = '';
    Selectpicker.DEFAULTS.tickIcon = 'bs-ok-default';
  }

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.selectId = selectId++;

      this.$element.addClass('bs-select-hidden');

      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createDropdown();
      this.createLi();
      this.$element
        .after(this.$newElement)
        .prependTo(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children(Selector.MENU);
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      this.$element.removeClass('bs-select-hidden');

      if (this.options.dropdownAlignRight === true) this.$menu.addClass(classNames.MENURIGHT);

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) {
        this.selectPosition();
      } else {
        this.$element.on('hide' + EVENT_KEY, function () {
          if (that.isVirtual()) {
            // empty menu on close
            var menuInner = that.$menuInner[0],
                emptyMenu = menuInner.firstChild.cloneNode(false);

            // replace the existing UL with an empty one - this is faster than $.empty() or innerHTML = ''
            menuInner.replaceChild(emptyMenu, menuInner.firstChild);
            menuInner.scrollTop = 0;
          }
        });
      }
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on({
        'hide.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', false);
          that.$element.trigger('hide' + EVENT_KEY, e);
        },
        'hidden.bs.dropdown': function (e) {
          that.$element.trigger('hidden' + EVENT_KEY, e);
        },
        'show.bs.dropdown': function (e) {
          that.$menuInner.attr('aria-expanded', true);
          that.$element.trigger('show' + EVENT_KEY, e);
        },
        'shown.bs.dropdown': function (e) {
          that.$element.trigger('shown' + EVENT_KEY, e);
        }
      });

      if (that.$element[0].hasAttribute('required')) {
        this.$element.on('invalid', function () {
          that.$button.addClass('bs-invalid');

          that.$element
            .on('shown' + EVENT_KEY + '.invalid', function () {
              that.$element
                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                .off('shown' + EVENT_KEY + '.invalid');
            })
            .on('rendered' + EVENT_KEY, function () {
              // if select is no longer invalid, remove the bs-invalid class
              if (this.validity.valid) that.$button.removeClass('bs-invalid');
              that.$element.off('rendered' + EVENT_KEY);
            });

          that.$button.on('blur' + EVENT_KEY, function () {
            that.$element.focus().blur();
            that.$button.off('blur' + EVENT_KEY);
          });
        });
      }

      setTimeout(function () {
        that.$element.trigger('loaded' + EVENT_KEY);
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple or showTick option is set, then add the show-tick class
      var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
          autofocus = this.autofocus ? ' autofocus' : '';

      // Elements
      var drop,
          header = '',
          searchbox = '',
          actionsbox = '',
          donebutton = '';

      if (this.options.header) {
        header =
          '<div class="' + classNames.POPOVERHEADER + '">' +
            '<button type="button" class="close" aria-hidden="true">&times;</button>' +
              this.options.header +
          '</div>';
      }

      if (this.options.liveSearch) {
        searchbox =
          '<div class="bs-searchbox">' +
            '<input type="text" class="form-control" autocomplete="off"' +
              (
                this.options.liveSearchPlaceholder === null ? ''
                :
                ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"'
              ) +
              ' role="textbox" aria-label="Search">' +
          '</div>';
      }

      if (this.multiple && this.options.actionsBox) {
        actionsbox =
          '<div class="bs-actionsbox">' +
            '<div class="btn-group btn-group-sm btn-block">' +
              '<button type="button" class="actions-btn bs-select-all btn ' + classNames.BUTTONCLASS + '">' +
                this.options.selectAllText +
              '</button>' +
              '<button type="button" class="actions-btn bs-deselect-all btn ' + classNames.BUTTONCLASS + '">' +
                this.options.deselectAllText +
              '</button>' +
            '</div>' +
          '</div>';
      }

      if (this.multiple && this.options.doneButton) {
        donebutton =
          '<div class="bs-donebutton">' +
            '<div class="btn-group btn-block">' +
              '<button type="button" class="btn btn-sm ' + classNames.BUTTONCLASS + '">' +
                this.options.doneButtonText +
              '</button>' +
            '</div>' +
          '</div>';
      }

      drop =
        '<div class="dropdown bootstrap-select' + showTick + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" ' + (this.options.display === 'static' ? 'data-display="static"' : '') + 'data-toggle="dropdown"' + autofocus + ' role="button">' +
            '<div class="filter-option">' +
              '<div class="filter-option-inner">' +
                '<div class="filter-option-inner-inner"></div>' +
              '</div> ' +
            '</div>' +
            (
              version.major === '4' ? ''
              :
              '<span class="bs-caret">' +
                this.options.template.caret +
              '</span>'
            ) +
          '</button>' +
          '<div class="' + classNames.MENU + ' ' + (version.major === '4' ? '' : classNames.SHOW) + '" role="combobox">' +
            header +
            searchbox +
            actionsbox +
            '<div class="inner ' + classNames.SHOW + '" role="listbox" aria-expanded="false" tabindex="-1">' +
                '<ul class="' + classNames.MENU + ' inner ' + (version.major === '4' ? classNames.SHOW : '') + '">' +
                '</ul>' +
            '</div>' +
            donebutton +
          '</div>' +
        '</div>';

      return $(drop);
    },

    setPositionData: function () {
      this.selectpicker.view.canHighlight = [];

      for (var i = 0; i < this.selectpicker.current.data.length; i++) {
        var li = this.selectpicker.current.data[i],
            canHighlight = true;

        if (li.type === 'divider') {
          canHighlight = false;
          li.height = this.sizeInfo.dividerHeight;
        } else if (li.type === 'optgroup-label') {
          canHighlight = false;
          li.height = this.sizeInfo.dropdownHeaderHeight;
        } else {
          li.height = this.sizeInfo.liHeight;
        }

        if (li.disabled) canHighlight = false;

        this.selectpicker.view.canHighlight.push(canHighlight);

        li.position = (i === 0 ? 0 : this.selectpicker.current.data[i - 1].position) + li.height;
      }
    },

    isVirtual: function () {
      return (this.options.virtualScroll !== false) && (this.selectpicker.main.elements.length >= this.options.virtualScroll) || this.options.virtualScroll === true;
    },

    createView: function (isSearching, scrollTop) {
      scrollTop = scrollTop || 0;

      var that = this;

      this.selectpicker.current = isSearching ? this.selectpicker.search : this.selectpicker.main;

      var active = [];
      var selected;
      var prevActive;

      this.setPositionData();

      scroll(scrollTop, true);

      this.$menuInner.off('scroll.createView').on('scroll.createView', function (e, updateValue) {
        if (!that.noScroll) scroll(this.scrollTop, updateValue);
        that.noScroll = false;
      });

      function scroll (scrollTop, init) {
        var size = that.selectpicker.current.elements.length,
            chunks = [],
            chunkSize,
            chunkCount,
            firstChunk,
            lastChunk,
            currentChunk,
            prevPositions,
            positionIsDifferent,
            previousElements,
            menuIsDifferent = true,
            isVirtual = that.isVirtual();

        that.selectpicker.view.scrollTop = scrollTop;

        if (isVirtual === true) {
          // if an option that is encountered that is wider than the current menu width, update the menu width accordingly
          if (that.sizeInfo.hasScrollBar && that.$menu[0].offsetWidth > that.sizeInfo.totalMenuWidth) {
            that.sizeInfo.menuWidth = that.$menu[0].offsetWidth;
            that.sizeInfo.totalMenuWidth = that.sizeInfo.menuWidth + that.sizeInfo.scrollBarWidth;
            that.$menu.css('min-width', that.sizeInfo.menuWidth);
          }
        }

        chunkSize = Math.ceil(that.sizeInfo.menuInnerHeight / that.sizeInfo.liHeight * 1.5); // number of options in a chunk
        chunkCount = Math.round(size / chunkSize) || 1; // number of chunks

        for (var i = 0; i < chunkCount; i++) {
          var endOfChunk = (i + 1) * chunkSize;

          if (i === chunkCount - 1) {
            endOfChunk = size;
          }

          chunks[i] = [
            (i) * chunkSize + (!i ? 0 : 1),
            endOfChunk
          ];

          if (!size) break;

          if (currentChunk === undefined && scrollTop <= that.selectpicker.current.data[endOfChunk - 1].position - that.sizeInfo.menuInnerHeight) {
            currentChunk = i;
          }
        }

        if (currentChunk === undefined) currentChunk = 0;

        prevPositions = [that.selectpicker.view.position0, that.selectpicker.view.position1];

        // always display previous, current, and next chunks
        firstChunk = Math.max(0, currentChunk - 1);
        lastChunk = Math.min(chunkCount - 1, currentChunk + 1);

        that.selectpicker.view.position0 = Math.max(0, chunks[firstChunk][0]) || 0;
        that.selectpicker.view.position1 = Math.min(size, chunks[lastChunk][1]) || 0;

        positionIsDifferent = prevPositions[0] !== that.selectpicker.view.position0 || prevPositions[1] !== that.selectpicker.view.position1;

        if (that.activeIndex !== undefined) {
          prevActive = that.selectpicker.current.elements[that.selectpicker.current.map.newIndex[that.prevActiveIndex]];
          active = that.selectpicker.current.elements[that.selectpicker.current.map.newIndex[that.activeIndex]];
          selected = that.selectpicker.current.elements[that.selectpicker.current.map.newIndex[that.selectedIndex]];

          if (init) {
            if (that.activeIndex !== that.selectedIndex) {
              active.classList.remove('active');
              if (active.firstChild) active.firstChild.classList.remove('active');
            }
            that.activeIndex = undefined;
          }

          if (that.activeIndex && that.activeIndex !== that.selectedIndex && selected && selected.length) {
            selected.classList.remove('active');
            if (selected.firstChild) selected.firstChild.classList.remove('active');
          }
        }

        if (that.prevActiveIndex !== undefined && that.prevActiveIndex !== that.activeIndex && that.prevActiveIndex !== that.selectedIndex && prevActive && prevActive.length) {
          prevActive.classList.remove('active');
          if (prevActive.firstChild) prevActive.firstChild.classList.remove('active');
        }

        if (init || positionIsDifferent) {
          previousElements = that.selectpicker.view.visibleElements ? that.selectpicker.view.visibleElements.slice() : [];

          that.selectpicker.view.visibleElements = that.selectpicker.current.elements.slice(that.selectpicker.view.position0, that.selectpicker.view.position1);

          that.setOptionStatus();

          // if searching, check to make sure the list has actually been updated before updating DOM
          // this prevents unnecessary repaints
          if (isSearching || (isVirtual === false && init)) menuIsDifferent = !isEqual(previousElements, that.selectpicker.view.visibleElements);

          // if virtual scroll is disabled and not searching,
          // menu should never need to be updated more than once
          if ((init || isVirtual === true) && menuIsDifferent) {
            var menuInner = that.$menuInner[0],
                menuFragment = document.createDocumentFragment(),
                emptyMenu = menuInner.firstChild.cloneNode(false),
                marginTop,
                marginBottom,
                elements = isVirtual === true ? that.selectpicker.view.visibleElements : that.selectpicker.current.elements;

            // replace the existing UL with an empty one - this is faster than $.empty()
            menuInner.replaceChild(emptyMenu, menuInner.firstChild);

            for (var i = 0, visibleElementsLen = elements.length; i < visibleElementsLen; i++) {
              menuFragment.appendChild(elements[i]);
            }

            if (isVirtual === true) {
              marginTop = (that.selectpicker.view.position0 === 0 ? 0 : that.selectpicker.current.data[that.selectpicker.view.position0 - 1].position);
              marginBottom = (that.selectpicker.view.position1 > size - 1 ? 0 : that.selectpicker.current.data[size - 1].position - that.selectpicker.current.data[that.selectpicker.view.position1 - 1].position);

              menuInner.firstChild.style.marginTop = marginTop + 'px';
              menuInner.firstChild.style.marginBottom = marginBottom + 'px';
            }

            menuInner.firstChild.appendChild(menuFragment);
          }
        }

        that.prevActiveIndex = that.activeIndex;

        if (!that.options.liveSearch) {
          that.$menuInner.focus();
        } else if (isSearching && init) {
          var index = 0,
              newActive;

          if (!that.selectpicker.view.canHighlight[index]) {
            index = 1 + that.selectpicker.view.canHighlight.slice(1).indexOf(true);
          }

          newActive = that.selectpicker.view.visibleElements[index];

          if (that.selectpicker.view.currentActive) {
            that.selectpicker.view.currentActive.classList.remove('active');
            if (that.selectpicker.view.currentActive.firstChild) that.selectpicker.view.currentActive.firstChild.classList.remove('active');
          }

          if (newActive) {
            newActive.classList.add('active');
            if (newActive.firstChild) newActive.firstChild.classList.add('active');
          }

          that.activeIndex = that.selectpicker.current.map.originalIndex[index];
        }
      }

      $(window)
        .off('resize' + EVENT_KEY + '.' + this.selectId + '.createView')
        .on('resize' + EVENT_KEY + '.' + this.selectId + '.createView', function () {
          var isActive = that.$newElement.hasClass(classNames.SHOW);

          if (isActive) scroll(that.$menuInner[0].scrollTop);
        });
    },

    createLi: function () {
      var that = this,
          mainElements = [],
          hiddenOptions = {},
          widestOption,
          availableOptionsCount = 0,
          widestOptionLength = 0,
          mainData = [],
          optID = 0,
          headerIndex = 0,
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure newIndex is correct

      if (!this.selectpicker.view.titleOption) this.selectpicker.view.titleOption = document.createElement('option');

      var elementTemplates = {
            span: document.createElement('span'),
            subtext: document.createElement('small'),
            a: document.createElement('a'),
            li: document.createElement('li'),
            whitespace: document.createTextNode('\u00A0')
          },
          checkMark,
          fragment = document.createDocumentFragment();

      if (that.options.showTick || that.multiple) {
        checkMark = elementTemplates.span.cloneNode(false);
        checkMark.className = that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark';
        elementTemplates.a.appendChild(checkMark);
      }

      elementTemplates.a.setAttribute('role', 'option');

      elementTemplates.subtext.className = 'text-muted';

      elementTemplates.text = elementTemplates.span.cloneNode(false);
      elementTemplates.text.className = 'text';

      // Helper functions
      /**
       * @param content
       * @param [classes]
       * @param [optgroup]
       * @returns {HTMLElement}
       */
      var generateLI = function (content, classes, optgroup) {
        var li = elementTemplates.li.cloneNode(false);

        if (content) {
          if (content.nodeType === 1 || content.nodeType === 11) {
            li.appendChild(content);
          } else {
            li.innerHTML = content;
          }
        }

        if (typeof classes !== 'undefined' && classes !== '') li.className = classes;
        if (typeof optgroup !== 'undefined' && optgroup !== null) li.classList.add('optgroup-' + optgroup);

        return li;
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @returns {string}
       */
      var generateA = function (text, classes, inline) {
        var a = elementTemplates.a.cloneNode(true);

        if (text) {
          if (text.nodeType === 11) {
            a.appendChild(text);
          } else {
            a.insertAdjacentHTML('beforeend', text);
          }
        }

        if (typeof classes !== 'undefined' && classes !== '') a.className = classes;
        if (version.major === '4') a.classList.add('dropdown-item');
        if (inline) a.setAttribute('style', inline);

        return a;
      };

      var generateText = function (options) {
        var textElement = elementTemplates.text.cloneNode(false),
            optionSubtextElement,
            optionIconElement;

        if (options.optionContent) {
          textElement.innerHTML = options.optionContent;
        } else {
          textElement.textContent = options.text;

          if (options.optionIcon) {
            var whitespace = elementTemplates.whitespace.cloneNode(false);

            optionIconElement = elementTemplates.span.cloneNode(false);
            optionIconElement.className = that.options.iconBase + ' ' + options.optionIcon;

            fragment.appendChild(optionIconElement);
            fragment.appendChild(whitespace);
          }

          if (options.optionSubtext) {
            optionSubtextElement = elementTemplates.subtext.cloneNode(false);
            optionSubtextElement.innerHTML = options.optionSubtext;
            textElement.appendChild(optionSubtextElement);
          }
        }

        fragment.appendChild(textElement);

        return fragment;
      };

      var generateLabel = function (options) {
        var labelTextElement = elementTemplates.text.cloneNode(false),
            labelSubtextElement,
            labelIconElement;

        labelTextElement.innerHTML = options.labelEscaped;

        if (options.labelIcon) {
          var whitespace = elementTemplates.whitespace.cloneNode(false);

          labelIconElement = elementTemplates.span.cloneNode(false);
          labelIconElement.className = that.options.iconBase + ' ' + options.labelIcon;

          fragment.appendChild(labelIconElement);
          fragment.appendChild(whitespace);
        }

        if (options.labelSubtext) {
          labelSubtextElement = elementTemplates.subtext.cloneNode(false);
          labelSubtextElement.textContent = options.labelSubtext;
          labelTextElement.appendChild(labelSubtextElement);
        }

        fragment.appendChild(labelTextElement);

        return fragment;
      }

      if (this.options.title && !this.multiple) {
        // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // since newIndex is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
        liIndex--;

        var element = this.$element[0],
            isSelected = false,
            titleNotAppended = !this.selectpicker.view.titleOption.parentNode;

        if (titleNotAppended) {
          // Use native JS to prepend option (faster)
          this.selectpicker.view.titleOption.className = 'bs-title-option';
          this.selectpicker.view.titleOption.value = '';

          // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
          // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
          // if so, the select will have the data-selected attribute
          var $opt = $(element.options[element.selectedIndex]);
          isSelected = $opt.attr('selected') === undefined && this.$element.data('selected') === undefined;
        }

        if (titleNotAppended || this.selectpicker.view.titleOption.index !== 0) {
          element.insertBefore(this.selectpicker.view.titleOption, element.firstChild);
        }

        // Set selected *after* appending to select,
        // otherwise the option doesn't get selected in IE
        // set using selectedIndex, as setting the selected attr to true here doesn't work in IE11
        if (isSelected) element.selectedIndex = 0;
      }

      var $selectOptions = this.$element.find('option');

      $selectOptions.each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        var thisData = $this.data();

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = htmlEscape(this.style.cssText),
            optionContent = thisData.content,
            text = this.textContent,
            tokens = thisData.tokens,
            subtext = thisData.subtext,
            icon = thisData.icon,
            $parent = $this.parent(),
            parent = $parent[0],
            isOptgroup = parent.tagName === 'OPTGROUP',
            isOptgroupDisabled = isOptgroup && parent.disabled,
            isDisabled = this.disabled || isOptgroupDisabled,
            prevHiddenIndex,
            showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP',
            textElement,
            labelElement,
            prevHidden;

        var parentData = $parent.data();

        if ((thisData.hidden === true || this.hidden) || (that.options.hideDisabled && (isDisabled || isOptgroupDisabled))) {
          // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
          // used to determine whether or not a divider should be placed after an optgroup if there are
          // hidden options between the optgroup and the first visible option
          prevHiddenIndex = thisData.prevHiddenIndex;
          $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

          liIndex--;

          hiddenOptions[index] = {
            type: 'hidden',
            data: thisData
          }

          // if previous element is not an optgroup
          if (!showDivider) {
            if (prevHiddenIndex !== undefined) {
              // select the element **before** the first hidden element in the group
              prevHidden = $selectOptions[prevHiddenIndex].previousElementSibling;

              if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                showDivider = true;
              }
            }
          }

          if (showDivider && mainData[mainData.length - 1].type !== 'divider') {
            liIndex++;
            mainElements.push(
              generateLI(
                false,
                classNames.DIVIDER,
                optID + 'div'
              )
            );
            mainData.push({
              type: 'divider',
              optID: optID
            });
          }

          return;
        }

        if (isOptgroup && thisData.divider !== true) {
          if (that.options.hideDisabled && isDisabled) {
            if (parentData.allOptionsDisabled === undefined) {
              var $options = $parent.children();
              $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
            }

            if ($parent.data('allOptionsDisabled')) {
              liIndex--;
              return;
            }
          }

          var optGroupClass = ' ' + parent.className || '',
              previousOption = this.previousElementSibling;

          prevHiddenIndex = thisData.prevHiddenIndex;

          if (prevHiddenIndex !== undefined) {
            previousOption = $selectOptions[prevHiddenIndex].previousElementSibling;
          }

          if (!previousOption) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = parent.label,
                labelEscaped = htmlEscape(label),
                labelSubtext = parentData.subtext,
                labelIcon = parentData.icon;

            if (index !== 0 && mainElements.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              mainElements.push(
                generateLI(
                  false,
                  classNames.DIVIDER,
                  optID + 'div'
                )
              );
              mainData.push({
                type: 'divider',
                optID: optID
              });
            }
            liIndex++;

            labelElement = generateLabel({
              labelEscaped: labelEscaped,
              labelSubtext: labelSubtext,
              labelIcon: labelIcon
            });

            mainElements.push(generateLI(labelElement, 'dropdown-header' + optGroupClass, optID));
            mainData.push({
              content: labelEscaped,
              subtext: labelSubtext,
              type: 'optgroup-label',
              optID: optID
            });

            headerIndex = liIndex - 1;
          }

          textElement = generateText({
            text: text,
            optionContent: optionContent,
            optionSubtext: subtext,
            optionIcon: icon
          });

          mainElements.push(generateLI(generateA(textElement, 'opt ' + optionClass + optGroupClass, inline), '', optID));
          mainData.push({
            content: optionContent || text,
            subtext: subtext,
            tokens: tokens,
            type: 'option',
            optID: optID,
            headerIndex: headerIndex,
            lastIndex: headerIndex + parent.childElementCount,
            originalIndex: index,
            data: thisData
          });

          availableOptionsCount++;
        } else if (thisData.divider === true) {
          mainElements.push(generateLI(false, classNames.DIVIDER));
          mainData.push({
            type: 'divider',
            originalIndex: index,
            data: thisData
          });
        } else {
          // if previous element is not an optgroup and hideDisabled is true
          if (!showDivider && that.options.hideDisabled) {
            prevHiddenIndex = thisData.prevHiddenIndex;

            if (prevHiddenIndex !== undefined) {
              // select the element **before** the first hidden element in the group
              prevHidden = $selectOptions[prevHiddenIndex].previousElementSibling;

              if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                showDivider = true;
              }
            }
          }

          if (showDivider && mainData[mainData.length - 1].type !== 'divider') {
            liIndex++;
            mainElements.push(
              generateLI(
                false,
                classNames.DIVIDER,
                optID + 'div'
              )
            );
            mainData.push({
              type: 'divider',
              optID: optID
            });
          }

          textElement = generateText({
            text: text,
            optionContent: optionContent,
            optionSubtext: subtext,
            optionIcon: icon
          });

          mainElements.push(generateLI(generateA(textElement, optionClass, inline)));
          mainData.push({
            content: optionContent || text,
            subtext: subtext,
            tokens: tokens,
            type: 'option',
            originalIndex: index,
            data: thisData
          });

          availableOptionsCount++;
        }

        that.selectpicker.main.map.newIndex[index] = liIndex;
        that.selectpicker.main.map.originalIndex[liIndex] = index;

        // get the most recent option info added to mainData
        var _mainDataLast = mainData[mainData.length - 1];

        _mainDataLast.disabled = isDisabled;

        var combinedLength = 0;

        // count the number of characters in the option - not perfect, but should work in most cases
        if (_mainDataLast.content) combinedLength += _mainDataLast.content.length;
        if (_mainDataLast.subtext) combinedLength += _mainDataLast.subtext.length;
        // if there is an icon, ensure this option's width is checked
        if (icon) combinedLength += 1;

        if (combinedLength > widestOptionLength) {
          widestOptionLength = combinedLength;

          // guess which option is the widest
          // use this when calculating menu width
          // not perfect, but it's fast, and the width will be updating accordingly when scrolling
          widestOption = mainElements[mainElements.length - 1];
        }
      });

      this.selectpicker.main.elements = mainElements;
      this.selectpicker.main.data = mainData;
      this.selectpicker.main.hidden = hiddenOptions;

      this.selectpicker.current = this.selectpicker.main;

      this.selectpicker.view.widestOption = widestOption;
      this.selectpicker.view.availableOptionsCount = availableOptionsCount; // faster way to get # of available options without filter
    },

    findLis: function () {
      return this.$menuInner.find('.inner > li');
    },

    render: function () {
      var that = this,
          $selectOptions = this.$element.find('option'),
          selectedItems = [],
          selectedItemsInTitle = [];

      this.togglePlaceholder();

      this.tabIndex();

      for (var index = 0, len = $selectOptions.length; index < len; index++) {
        var i = that.selectpicker.main.map.newIndex[index],
            option = $selectOptions[index],
            optionData = that.selectpicker.main.data[i] || that.selectpicker.main.hidden[index];

        if (option && option.selected && optionData) {
          selectedItems.push(option);

          if ((selectedItemsInTitle.length < 100 && that.options.selectedTextFormat !== 'count') || selectedItems.length === 1) {
            var thisData = optionData.data,
                icon = thisData.icon && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + thisData.icon + '"></i> ' : '',
                subtext,
                titleItem;

            if (that.options.showSubtext && thisData.subtext && !that.multiple) {
              subtext = ' <small class="text-muted">' + thisData.subtext + '</small>';
            } else {
              subtext = '';
            }

            if (option.title) {
              titleItem = option.title;
            } else if (thisData.content && that.options.showContent) {
              titleItem = thisData.content.toString();
            } else {
              titleItem = icon + option.innerHTML.trim() + subtext;
            }

            selectedItemsInTitle.push(titleItem);
          }
        }
      }

      // Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      // Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItemsInTitle[0] : selectedItemsInTitle.join(this.options.multipleSeparator);

      // add ellipsis
      if (selectedItems.length > 50) title += '...';

      // If this is a multiselect, and selectedTextFormat is count, then show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') !== -1) {
        var max = this.options.selectedTextFormat.split('>');

        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length === 1 && selectedItems.length >= 2)) {
          var totalCount = this.selectpicker.view.availableOptionsCount,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;

          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        // use .attr to ensure undefined is returned if title attribute is not set
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      // If the select doesn't have a title, then use the default, or if nothing is set at all, use noneSelectedText
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      // strip all HTML tags and trim the result, then unescape any escaped tags
      this.$button[0].title = htmlUnescape(title.replace(/<[^>]*>?/g, '').trim());
      this.$button.find('.filter-option-inner-inner')[0].innerHTML = title;

      this.$element.trigger('rendered' + EVENT_KEY);
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style || this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      if (!this.sizeInfo) this.sizeInfo = {};

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('div'),
          menuInnerInner = document.createElement('ul'),
          divider = document.createElement('li'),
          dropdownHeader = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header && this.$menu.find('.' + classNames.POPOVERHEADER).length > 0 ? this.$menu.find('.' + classNames.POPOVERHEADER)[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null,
          firstOption = this.$element.find('option')[0];

      this.sizeInfo.selectWidth = this.$newElement[0].offsetWidth;

      text.className = 'text';
      a.className = 'dropdown-item ' + (firstOption ? firstOption.className : '');
      newElement.className = this.$menu[0].parentNode.className + ' ' + classNames.SHOW;
      newElement.style.width = this.sizeInfo.selectWidth + 'px';
      if (this.options.width === 'auto') menu.style.minWidth = 0;
      menu.className = classNames.MENU + ' ' + classNames.SHOW;
      menuInner.className = 'inner ' + classNames.SHOW;
      menuInnerInner.className = classNames.MENU + ' inner ' + (version.major === '4' ? classNames.SHOW : '');
      divider.className = classNames.DIVIDER;
      dropdownHeader.className = 'dropdown-header';

      text.appendChild(document.createTextNode('\u200b'));
      a.appendChild(text);
      li.appendChild(a);
      dropdownHeader.appendChild(text.cloneNode(true));

      if (this.selectpicker.view.widestOption) {
        menuInnerInner.appendChild(this.selectpicker.view.widestOption.cloneNode(true));
      }

      menuInnerInner.appendChild(li);
      menuInnerInner.appendChild(divider);
      menuInnerInner.appendChild(dropdownHeader);
      if (header) menu.appendChild(header);
      if (search) {
        var input = document.createElement('input');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menuInner.appendChild(menuInnerInner);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          dropdownHeaderHeight = dropdownHeader ? dropdownHeader.offsetHeight : 0,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = window.getComputedStyle ? window.getComputedStyle(menu) : false,
          menuWidth = menu.offsetWidth,
          $menu = menuStyle ? null : $(menu),
          menuPadding = {
            vert: toInteger(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                  toInteger(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                  toInteger(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                  toInteger(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
            horiz: toInteger(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft')) +
                  toInteger(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight')) +
                  toInteger(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth')) +
                  toInteger(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth'))
          },
          menuExtras = {
            vert: menuPadding.vert +
                  toInteger(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                  toInteger(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
            horiz: menuPadding.horiz +
                  toInteger(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft')) +
                  toInteger(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2
          },
          scrollBarWidth;

      menuInner.style.overflowY = 'scroll';

      scrollBarWidth = menu.offsetWidth - menuWidth;

      document.body.removeChild(newElement);

      this.sizeInfo.liHeight = liHeight;
      this.sizeInfo.dropdownHeaderHeight = dropdownHeaderHeight;
      this.sizeInfo.headerHeight = headerHeight;
      this.sizeInfo.searchHeight = searchHeight;
      this.sizeInfo.actionsHeight = actionsHeight;
      this.sizeInfo.doneButtonHeight = doneButtonHeight;
      this.sizeInfo.dividerHeight = dividerHeight;
      this.sizeInfo.menuPadding = menuPadding;
      this.sizeInfo.menuExtras = menuExtras;
      this.sizeInfo.menuWidth = menuWidth;
      this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth;
      this.sizeInfo.scrollBarWidth = scrollBarWidth;
      this.sizeInfo.selectHeight = this.$newElement[0].offsetHeight;

      this.setPositionData();
    },

    getSelectPosition: function () {
      var that = this,
          $window = $(window),
          pos = that.$newElement.offset(),
          $container = $(that.options.container),
          containerPos;

      if (that.options.container && !$container.is('body')) {
        containerPos = $container.offset();
        containerPos.top += parseInt($container.css('borderTopWidth'));
        containerPos.left += parseInt($container.css('borderLeftWidth'));
      } else {
        containerPos = { top: 0, left: 0 };
      }

      var winPad = that.options.windowPadding;

      this.sizeInfo.selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
      this.sizeInfo.selectOffsetBot = $window.height() - this.sizeInfo.selectOffsetTop - this.sizeInfo.selectHeight - containerPos.top - winPad[2];
      this.sizeInfo.selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
      this.sizeInfo.selectOffsetRight = $window.width() - this.sizeInfo.selectOffsetLeft - this.sizeInfo.selectWidth - containerPos.left - winPad[1];
      this.sizeInfo.selectOffsetTop -= winPad[0];
      this.sizeInfo.selectOffsetLeft -= winPad[3];
    },

    setMenuSize: function (isAuto) {
      this.getSelectPosition();

      var selectWidth = this.sizeInfo.selectWidth,
          liHeight = this.sizeInfo.liHeight,
          headerHeight = this.sizeInfo.headerHeight,
          searchHeight = this.sizeInfo.searchHeight,
          actionsHeight = this.sizeInfo.actionsHeight,
          doneButtonHeight = this.sizeInfo.doneButtonHeight,
          divHeight = this.sizeInfo.dividerHeight,
          menuPadding = this.sizeInfo.menuPadding,
          menuInnerHeight,
          menuHeight,
          divLength = 0,
          minHeight,
          _minHeight,
          maxHeight,
          menuInnerMinHeight,
          estimate;

      if (this.options.dropupAuto) {
        // Get the estimated height of the menu without scrollbars.
        // This is useful for smaller menus, where there might be plenty of room
        // below the button without setting dropup, but we can't know
        // the exact height of the menu until createView is called later
        estimate = liHeight * this.selectpicker.current.elements.length + menuPadding.vert;
        this.$newElement.toggleClass(classNames.DROPUP, this.sizeInfo.selectOffsetTop - this.sizeInfo.selectOffsetBot > this.sizeInfo.menuExtras.vert && estimate + this.sizeInfo.menuExtras.vert + 50 > this.sizeInfo.selectOffsetBot);
      }

      if (this.options.size === 'auto') {
        _minHeight = this.selectpicker.current.elements.length > 3 ? this.sizeInfo.liHeight * 3 + this.sizeInfo.menuExtras.vert - 2 : 0;
        menuHeight = this.sizeInfo.selectOffsetBot - this.sizeInfo.menuExtras.vert;
        minHeight = _minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight;
        menuInnerMinHeight = Math.max(_minHeight - menuPadding.vert, 0);

        if (this.$newElement.hasClass(classNames.DROPUP)) {
          menuHeight = this.sizeInfo.selectOffsetTop - this.sizeInfo.menuExtras.vert;
        }

        maxHeight = menuHeight;
        menuInnerHeight = menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert;
      } else if (this.options.size && this.options.size != 'auto' && this.selectpicker.current.elements.length > this.options.size) {
        for (var i = 0; i < this.options.size; i++) {
          if (this.selectpicker.current.data[i].type === 'divider') divLength++;
        }

        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;
        menuInnerHeight = menuHeight - menuPadding.vert;
        maxHeight = menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight;
        minHeight = menuInnerMinHeight = '';
      }

      if (this.options.dropdownAlignRight === 'auto') {
        this.$menu.toggleClass(classNames.MENURIGHT, this.sizeInfo.selectOffsetLeft > this.sizeInfo.selectOffsetRight && this.sizeInfo.selectOffsetRight < (this.sizeInfo.totalMenuWidth - selectWidth));
      }

      this.$menu.css({
        'max-height': maxHeight + 'px',
        'overflow': 'hidden',
        'min-height': minHeight + 'px'
      });

      this.$menuInner.css({
        'max-height': menuInnerHeight + 'px',
        'overflow-y': 'auto',
        'min-height': menuInnerMinHeight + 'px'
      });

      this.sizeInfo.menuInnerHeight = menuInnerHeight;

      if (this.selectpicker.current.data.length && this.selectpicker.current.data[this.selectpicker.current.data.length - 1].position > this.sizeInfo.menuInnerHeight) {
        this.sizeInfo.hasScrollBar = true;
        this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth + this.sizeInfo.scrollBarWidth;

        this.$menu.css('min-width', this.sizeInfo.totalMenuWidth);
      }

      if (this.dropdown && this.dropdown._popper) this.dropdown._popper.update();
    },

    setSize: function (refresh) {
      this.liHeight(refresh);

      if (this.options.header) this.$menu.css('padding-top', 0);
      if (this.options.size === false) return;

      var that = this,
          $window = $(window),
          selectedIndex,
          offset = 0;

      this.setMenuSize();

      if (this.options.size === 'auto') {
        this.$searchbox
          .off('input.setMenuSize propertychange.setMenuSize')
          .on('input.setMenuSize propertychange.setMenuSize', function () {
            return that.setMenuSize();
          });

        $window
          .off('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize')
          .on('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize', function () {
            return that.setMenuSize();
          });
      } else if (this.options.size && this.options.size != 'auto' && this.selectpicker.current.elements.length > this.options.size) {
        this.$searchbox.off('input.setMenuSize propertychange.setMenuSize');
        $window.off('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize');
      }

      if (refresh) {
        offset = this.$menuInner[0].scrollTop;
      } else if (!that.multiple) {
        selectedIndex = that.selectpicker.main.map.newIndex[that.$element[0].selectedIndex];

        if (typeof selectedIndex === 'number' && that.options.size !== false) {
          offset = that.sizeInfo.liHeight * selectedIndex;
          offset = offset - (that.sizeInfo.menuInnerHeight / 2) + (that.sizeInfo.liHeight / 2);
        }
      }

      that.createView(false, offset);
    },

    setWidth: function () {
      var that = this;

      if (this.options.width === 'auto') {
        requestAnimationFrame(function () {
          that.$menu.css('min-width', '0');
          that.liHeight();
          that.setMenuSize();

          // Get correct width if element is hidden
          var $selectClone = that.$newElement.clone().appendTo('body'),
              btnWidth = $selectClone.css('width', 'auto').children('button').outerWidth();

          $selectClone.remove();

          // Set width to whatever's larger, button title or longest option
          that.sizeInfo.selectWidth = Math.max(that.sizeInfo.totalMenuWidth, btnWidth);
          that.$newElement.css('width', that.sizeInfo.selectWidth + 'px');
        });
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      this.$bsContainer = $('<div class="bs-container" />');

      var that = this,
          $container = $(this.options.container),
          pos,
          containerPos,
          actualHeight,
          getPlacement = function ($element) {
            var containerPosition = {},
                // fall back to dropdown's default display setting if display is not manually set
                display = that.options.display || (
                  // Bootstrap 3 doesn't have $.fn.dropdown.Constructor.Default
                  $.fn.dropdown.Constructor.Default ? $.fn.dropdown.Constructor.Default.display
                  : false
                );

            that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass(classNames.DROPUP, $element.hasClass(classNames.DROPUP));
            pos = $element.offset();

            if (!$container.is('body')) {
              containerPos = $container.offset();
              containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
              containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
            } else {
              containerPos = { top: 0, left: 0 };
            }

            actualHeight = $element.hasClass(classNames.DROPUP) ? 0 : $element[0].offsetHeight;

            // Bootstrap 4+ uses Popper for menu positioning
            if (version.major < 4 || display === 'static') {
              containerPosition.top = pos.top - containerPos.top + actualHeight;
              containerPosition.left = pos.left - containerPos.left;
            }

            containerPosition.width = $element[0].offsetWidth;

            that.$bsContainer.css(containerPosition);
          };

      this.$button.on('click.bs.dropdown.data-api', function () {
        if (that.isDisabled()) {
          return;
        }

        getPlacement(that.$newElement);

        that.$bsContainer
          .appendTo(that.options.container)
          .toggleClass(classNames.SHOW, !that.$button.hasClass(classNames.SHOW))
          .append(that.$menu);
      });

      $(window)
        .off('resize' + EVENT_KEY + '.' + this.selectId + ' scroll' + EVENT_KEY + '.' + this.selectId)
        .on('resize' + EVENT_KEY + '.' + this.selectId + ' scroll' + EVENT_KEY + '.' + this.selectId, function () {
          var isActive = that.$newElement.hasClass(classNames.SHOW);

          if (isActive) getPlacement(that.$newElement);
        });

      this.$element.on('hide' + EVENT_KEY, function () {
        that.$menu.data('height', that.$menu.height());
        that.$bsContainer.detach();
      });
    },

    setOptionStatus: function () {
      var that = this,
          $selectOptions = this.$element.find('option');

      that.noScroll = false;

      if (that.selectpicker.view.visibleElements && that.selectpicker.view.visibleElements.length) {
        for (var i = 0; i < that.selectpicker.view.visibleElements.length; i++) {
          var index = that.selectpicker.current.map.originalIndex[i + that.selectpicker.view.position0], // faster than $(li).data('originalIndex')
              option = $selectOptions[index];

          if (option) {
            var liIndex = this.selectpicker.main.map.newIndex[index],
                li = this.selectpicker.main.elements[liIndex];

            that.setDisabled(
              index,
              option.disabled || (option.parentNode.tagName === 'OPTGROUP' && option.parentNode.disabled),
              liIndex,
              li
            );

            that.setSelected(
              index,
              option.selected,
              liIndex,
              li
            );
          }
        }
      }
    },

    /**
     * @param {number} index - the index of the option that is being changed
     * @param {boolean} selected - true if the option is being selected, false if being deselected
     */
    setSelected: function (index, selected, liIndex, li) {
      var activeIndexIsSet = this.activeIndex !== undefined,
          thisIsActive = this.activeIndex === index,
          prevActiveIndex,
          prevActive,
          a,
          // if current option is already active
          // OR
          // if the current option is being selected, it's NOT multiple, and
          // activeIndex is undefined:
          //  - when the menu is first being opened, OR
          //  - after a search has been performed, OR
          //  - when retainActive is false when selecting a new option (i.e. index of the newly selected option is not the same as the current activeIndex)
          keepActive = thisIsActive || (selected && !this.multiple && !activeIndexIsSet);

      if (!liIndex) liIndex = this.selectpicker.main.map.newIndex[index];
      if (!li) li = this.selectpicker.main.elements[liIndex];

      a = li.firstChild;

      if (selected) {
        this.selectedIndex = index;
      }

      li.classList.toggle('selected', selected);
      li.classList.toggle('active', keepActive);

      if (keepActive) {
        this.selectpicker.view.currentActive = li;
        this.activeIndex = index;
      }

      if (a) {
        a.classList.toggle('selected', selected);
        a.classList.toggle('active', keepActive);
        a.setAttribute('aria-selected', selected);
      }

      if (!keepActive) {
        if (!activeIndexIsSet && selected && this.prevActiveIndex !== undefined) {
          prevActiveIndex = this.selectpicker.main.map.newIndex[this.prevActiveIndex];
          prevActive = this.selectpicker.main.elements[prevActiveIndex];

          prevActive.classList.remove('active');
          if (prevActive.firstChild) {
            prevActive.firstChild.classList.remove('active');
          }
        }
      }
    },

    /**
     * @param {number} index - the index of the option that is being disabled
     * @param {boolean} disabled - true if the option is being disabled, false if being enabled
     */
    setDisabled: function (index, disabled, liIndex, li) {
      var a;

      if (!liIndex) liIndex = this.selectpicker.main.map.newIndex[index];
      if (!li) li = this.selectpicker.main.elements[liIndex];

      a = li.firstChild;

      li.classList.toggle(classNames.DISABLED, disabled);

      if (a) {
        if (version.major === '4') a.classList.toggle(classNames.DISABLED, disabled);

        a.setAttribute('aria-disabled', disabled);

        if (disabled) {
          a.setAttribute('tabindex', -1);
        } else {
          a.setAttribute('tabindex', 0);
        }
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass(classNames.DISABLED);
        this.$button.addClass(classNames.DISABLED).attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        if (this.$button.hasClass(classNames.DISABLED)) {
          this.$newElement.removeClass(classNames.DISABLED);
          this.$button.removeClass(classNames.DISABLED).attr('aria-disabled', false);
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    togglePlaceholder: function () {
      // much faster than calling $.val()
      var element = this.$element[0],
          selectedIndex = element.selectedIndex,
          nothingSelected = selectedIndex === -1;

      if (!nothingSelected && !element.options[selectedIndex].value) nothingSelected = true;

      this.$button.toggleClass('bs-placeholder', nothingSelected);
    },

    tabIndex: function () {
      if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
        (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }

      this.$element.attr('tabindex', -98);
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      $document.data('spaceSelect', false);

      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
          e.preventDefault();
          $document.data('spaceSelect', false);
        }
      });

      this.$newElement.on('show.bs.dropdown', function () {
        if (version.major > 3 && !that.dropdown) {
          that.dropdown = that.$button.data('bs.dropdown');
          that.dropdown._menu = that.$menu[0];
        }
      });

      this.$button.on('click.bs.dropdown.data-api', function () {
        if (!that.$newElement.hasClass(classNames.SHOW)) {
          that.setSize();
        }
      });

      function setFocus () {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$menuInner.focus();
        }
      }

      function checkPopperExists () {
        if (that.dropdown && that.dropdown._popper && that.dropdown._popper.state.isCreated) {
          setFocus();
        } else {
          requestAnimationFrame(checkPopperExists);
        }
      }

      this.$element.on('shown' + EVENT_KEY, function () {
        if (that.$menuInner[0].scrollTop !== that.selectpicker.view.scrollTop) {
          that.$menuInner[0].scrollTop = that.selectpicker.view.scrollTop;
        }

        if (version.major > 3) {
          requestAnimationFrame(checkPopperExists);
        } else {
          setFocus();
        }
      });

      this.$menuInner.on('click', 'li a', function (e, retainActive) {
        var $this = $(this),
            position0 = that.isVirtual() ? that.selectpicker.view.position0 : 0,
            clickedIndex = that.selectpicker.current.map.originalIndex[$this.parent().index() + position0],
            prevValue = getSelectValues(that.$element[0]),
            prevIndex = that.$element.prop('selectedIndex'),
            triggerChange = true;

        // Don't close on multi choice menu
        if (that.multiple && that.options.maxOptions !== 1) {
          e.stopPropagation();
        }

        e.preventDefault();

        // Don't run if the select is disabled
        if (!that.isDisabled() && !$this.parent().hasClass(classNames.DISABLED)) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              $optgroupOptions = $optgroup.find('option'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (clickedIndex === that.activeIndex) retainActive = true;

          if (!retainActive) {
            that.prevActiveIndex = that.activeIndex;
            that.activeIndex = undefined;
          }

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);

            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);

                  for (var i = 0; i < $options.length; i++) {
                    that.setSelected(i, false);
                  }

                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);

                  for (var i = 0; i < $optgroupOptions.length; i++) {
                    var option = $optgroupOptions[i];
                    that.setSelected($options.index(option), false);
                  }

                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText,
                      maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReached' + EVENT_KEY);
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    triggerChange = false;
                    that.$element.trigger('maxReachedGrp' + EVENT_KEY);
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if (triggerChange) {
            if ((prevValue != getSelectValues(that.$element[0]) && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
              // $option.prop('selected') is current option state (selected/unselected). prevValue is the value of the select prior to being changed.
              changedArguments = [clickedIndex, $option.prop('selected'), prevValue];
              that.$element
                .triggerNative('change');
            }
          }
        }
      });

      this.$menu.on('click', 'li.' + classNames.DISABLED + ' a, .' + classNames.POPOVERHEADER + ', .' + classNames.POPOVERHEADER + ' :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.' + classNames.POPOVERHEADER + ' .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
      });

      this.$element.on({
        'change': function () {
          that.render();
          that.$element.trigger('changed' + EVENT_KEY, changedArguments);
          changedArguments = null;
        },
        'focus': function () {
          if (!that.options.mobile) that.$button.focus();
        }
      });
    },

    liveSearchListener: function () {
      var that = this,
          noResults = document.createElement('li');

      this.$button.on('click.bs.dropdown.data-api', function () {
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
        }
      });

      this.$searchbox.on('click.bs.dropdown.data-api focus.bs.dropdown.data-api touchend.bs.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        var searchValue = that.$searchbox.val();

        that.selectpicker.search.map.newIndex = {};
        that.selectpicker.search.map.originalIndex = {};
        that.selectpicker.search.elements = [];
        that.selectpicker.search.data = [];

        if (searchValue) {
          var i,
              searchMatch = [],
              q = searchValue.toUpperCase(),
              cache = {},
              cacheArr = [],
              searchStyle = that._searchStyle(),
              normalizeSearch = that.options.liveSearchNormalize;

          if (normalizeSearch) q = normalizeToBase(q);

          that._$lisSelected = that.$menuInner.find('.selected');

          for (var i = 0; i < that.selectpicker.main.data.length; i++) {
            var li = that.selectpicker.main.data[i];

            if (!cache[i]) {
              cache[i] = stringSearch(li, q, searchStyle, normalizeSearch);
            }

            if (cache[i] && li.headerIndex !== undefined && cacheArr.indexOf(li.headerIndex) === -1) {
              if (li.headerIndex > 0) {
                cache[li.headerIndex - 1] = true;
                cacheArr.push(li.headerIndex - 1);
              }

              cache[li.headerIndex] = true;
              cacheArr.push(li.headerIndex);

              cache[li.lastIndex + 1] = true;
            }

            if (cache[i] && li.type !== 'optgroup-label') cacheArr.push(i);
          }

          for (var i = 0, cacheLen = cacheArr.length; i < cacheLen; i++) {
            var index = cacheArr[i],
                prevIndex = cacheArr[i - 1],
                li = that.selectpicker.main.data[index],
                liPrev = that.selectpicker.main.data[prevIndex];

            if (li.type !== 'divider' || (li.type === 'divider' && liPrev && liPrev.type !== 'divider' && cacheLen - 1 !== i)) {
              that.selectpicker.search.data.push(li);
              searchMatch.push(that.selectpicker.main.elements[index]);

              if (li.hasOwnProperty('originalIndex')) {
                that.selectpicker.search.map.newIndex[li.originalIndex] = searchMatch.length - 1;
                that.selectpicker.search.map.originalIndex[searchMatch.length - 1] = li.originalIndex;
              }
            }
          }

          that.activeIndex = undefined;
          that.noScroll = true;
          that.$menuInner.scrollTop(0);
          that.selectpicker.search.elements = searchMatch;
          that.createView(true);

          if (!searchMatch.length) {
            noResults.className = 'no-results';
            noResults.innerHTML = that.options.noneResultsText.replace('{0}', '"' + htmlEscape(searchValue) + '"');
            that.$menuInner[0].firstChild.appendChild(noResults);
          }
        } else {
          that.$menuInner.scrollTop(0);
          that.createView(false);
        }
      });
    },

    _searchStyle: function () {
      return this.options.liveSearchStyle || 'contains';
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element
          .val(value)
          .triggerNative('change');

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    changeAll: function (status) {
      if (!this.multiple) return;
      if (typeof status === 'undefined') status = true;

      var $selectOptions = this.$element.find('option'),
          previousSelected = 0,
          currentSelected = 0,
          prevValue = getSelectValues(this.$element[0]);

      this.$element.addClass('bs-select-hidden');

      for (var i = 0; i < this.selectpicker.current.elements.length; i++) {
        var liData = this.selectpicker.current.data[i],
            index = this.selectpicker.current.map.originalIndex[i], // faster than $(li).data('originalIndex')
            option = $selectOptions[index];

        if (option && !option.disabled && liData.type !== 'divider') {
          if (option.selected) previousSelected++;
          option.selected = status;
          if (option.selected) currentSelected++;
        }
      }

      this.$element.removeClass('bs-select-hidden');

      if (previousSelected === currentSelected) return;

      this.setOptionStatus();

      this.togglePlaceholder();

      changedArguments = [null, null, prevValue];

      this.$element
        .triggerNative('change');
    },

    selectAll: function () {
      return this.changeAll(true);
    },

    deselectAll: function () {
      return this.changeAll(false);
    },

    toggle: function (e) {
      e = e || window.event;

      if (e) e.stopPropagation();

      this.$button.trigger('click.bs.dropdown.data-api');
    },

    keydown: function (e) {
      var $this = $(this),
          isToggle = $this.hasClass('dropdown-toggle'),
          $parent = isToggle ? $this.closest('.dropdown') : $this.closest(Selector.MENU),
          that = $parent.data('this'),
          $items = that.findLis(),
          index,
          isActive,
          liActive,
          activeLi,
          offset,
          updateScroll = false,
          downOnTab = e.which === keyCodes.TAB && !isToggle && !that.options.selectOnTab,
          isArrowKey = REGEXP_ARROW.test(e.which) || downOnTab,
          scrollTop = that.$menuInner[0].scrollTop,
          isVirtual = that.isVirtual(),
          position0 = isVirtual === true ? that.selectpicker.view.position0 : 0;

      isActive = that.$newElement.hasClass(classNames.SHOW);

      if (
        !isActive &&
        (
          isArrowKey ||
          (e.which >= 48 && e.which <= 57) ||
          (e.which >= 96 && e.which <= 105) ||
          (e.which >= 65 && e.which <= 90)
        )
      ) {
        that.$button.trigger('click.bs.dropdown.data-api');
      }

      if (e.which === keyCodes.ESCAPE && isActive) {
        e.preventDefault();
        that.$button.trigger('click.bs.dropdown.data-api').focus();
      }

      if (isArrowKey) { // if up or down
        if (!$items.length) return;

        // $items.index/.filter is too slow with a large list and no virtual scroll
        index = isVirtual === true ? $items.index($items.filter('.active')) : that.selectpicker.current.map.newIndex[that.activeIndex];

        if (index === undefined) index = -1;

        if (index !== -1) {
          liActive = that.selectpicker.current.elements[index + position0];
          liActive.classList.remove('active');
          if (liActive.firstChild) liActive.firstChild.classList.remove('active');
        }

        if (e.which === keyCodes.ARROW_UP) { // up
          if (index !== -1) index--;
          if (index + position0 < 0) index += $items.length;

          if (!that.selectpicker.view.canHighlight[index + position0]) {
            index = that.selectpicker.view.canHighlight.slice(0, index + position0).lastIndexOf(true) - position0;
            if (index === -1) index = $items.length - 1;
          }
        } else if (e.which === keyCodes.ARROW_DOWN || downOnTab) { // down
          index++;
          if (index + position0 >= that.selectpicker.view.canHighlight.length) index = 0;

          if (!that.selectpicker.view.canHighlight[index + position0]) {
            index = index + 1 + that.selectpicker.view.canHighlight.slice(index + position0 + 1).indexOf(true);
          }
        }

        e.preventDefault();

        var liActiveIndex = position0 + index;

        if (e.which === keyCodes.ARROW_UP) { // up
          // scroll to bottom and highlight last option
          if (position0 === 0 && index === $items.length - 1) {
            that.$menuInner[0].scrollTop = that.$menuInner[0].scrollHeight;

            liActiveIndex = that.selectpicker.current.elements.length - 1;
          } else {
            activeLi = that.selectpicker.current.data[liActiveIndex];
            offset = activeLi.position - activeLi.height;

            updateScroll = offset < scrollTop;
          }
        } else if (e.which === keyCodes.ARROW_DOWN || downOnTab) { // down
          // scroll to top and highlight first option
          if (index === 0) {
            that.$menuInner[0].scrollTop = 0;

            liActiveIndex = 0;
          } else {
            activeLi = that.selectpicker.current.data[liActiveIndex];
            offset = activeLi.position - that.sizeInfo.menuInnerHeight;

            updateScroll = offset > scrollTop;
          }
        }

        liActive = that.selectpicker.current.elements[liActiveIndex];

        if (liActive) {
          liActive.classList.add('active');
          if (liActive.firstChild) liActive.firstChild.classList.add('active');
        }

        that.activeIndex = that.selectpicker.current.map.originalIndex[liActiveIndex];

        that.selectpicker.view.currentActive = liActive;

        if (updateScroll) that.$menuInner[0].scrollTop = offset;

        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          $this.focus();
        }
      } else if (
        (!$this.is('input') && !REGEXP_TAB_OR_ESCAPE.test(e.which)) ||
        (e.which === keyCodes.SPACE && that.selectpicker.keydown.keyHistory)
      ) {
        var searchMatch,
            matches = [],
            keyHistory;

        e.preventDefault();

        that.selectpicker.keydown.keyHistory += keyCodeMap[e.which];

        if (that.selectpicker.keydown.resetKeyHistory.cancel) clearTimeout(that.selectpicker.keydown.resetKeyHistory.cancel);
        that.selectpicker.keydown.resetKeyHistory.cancel = that.selectpicker.keydown.resetKeyHistory.start();

        keyHistory = that.selectpicker.keydown.keyHistory;

        // if all letters are the same, set keyHistory to just the first character when searching
        if (/^(.)\1+$/.test(keyHistory)) {
          keyHistory = keyHistory.charAt(0);
        }

        // find matches
        for (var i = 0; i < that.selectpicker.current.data.length; i++) {
          var li = that.selectpicker.current.data[i],
              hasMatch;

          hasMatch = stringSearch(li, keyHistory, 'startsWith', true);

          if (hasMatch && that.selectpicker.view.canHighlight[i]) {
            li.index = i;
            matches.push(li.originalIndex);
          }
        }

        if (matches.length) {
          var matchIndex = 0;

          $items.removeClass('active').find('a').removeClass('active');

          // either only one key has been pressed or they are all the same key
          if (keyHistory.length === 1) {
            matchIndex = matches.indexOf(that.activeIndex);

            if (matchIndex === -1 || matchIndex === matches.length - 1) {
              matchIndex = 0;
            } else {
              matchIndex++;
            }
          }

          searchMatch = that.selectpicker.current.map.newIndex[matches[matchIndex]];

          activeLi = that.selectpicker.current.data[searchMatch];

          if (scrollTop - activeLi.position > 0) {
            offset = activeLi.position - activeLi.height;
            updateScroll = true;
          } else {
            offset = activeLi.position - that.sizeInfo.menuInnerHeight;
            // if the option is already visible at the current scroll position, just keep it the same
            updateScroll = activeLi.position > scrollTop + that.sizeInfo.menuInnerHeight;
          }

          liActive = that.selectpicker.current.elements[searchMatch];
          liActive.classList.add('active');
          if (liActive.firstChild) liActive.firstChild.classList.add('active');
          that.activeIndex = matches[matchIndex];

          liActive.firstChild.focus();

          if (updateScroll) that.$menuInner[0].scrollTop = offset;

          $this.focus();
        }
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if (
        isActive &&
        (
          (e.which === keyCodes.SPACE && !that.selectpicker.keydown.keyHistory) ||
          e.which === keyCodes.ENTER ||
          (e.which === keyCodes.TAB && that.options.selectOnTab)
        )
      ) {
        if (e.which !== keyCodes.SPACE) e.preventDefault();

        if (!that.options.liveSearch || e.which !== keyCodes.SPACE) {
          that.$menuInner.find('.active a').trigger('click', true); // retain active class
          $this.focus();

          if (!that.options.liveSearch) {
            // Prevent screen from scrolling if the user hits the spacebar
            e.preventDefault();
            // Fixes spacebar selection of dropdown items in FF & IE
            $(document).data('spaceSelect', true);
          }
        }
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device');
    },

    refresh: function () {
      // update options if data attributes have been changed
      var config = $.extend({}, this.options, this.$element.data());
      this.options = config;

      this.selectpicker.main.map.newIndex = {};
      this.selectpicker.main.map.originalIndex = {};
      this.createLi();
      this.checkDisabled();
      this.render();
      this.setStyle();
      this.setWidth();

      this.setSize(true);

      this.$element.trigger('refreshed' + EVENT_KEY);
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    },

    destroy: function () {
      this.$newElement.before(this.$element).remove();

      if (this.$bsContainer) {
        this.$bsContainer.remove();
      } else {
        this.$menu.remove();
      }

      this.$element
        .off(EVENT_KEY)
        .removeData('selectpicker')
        .removeClass('bs-select-hidden selectpicker');

      $(window).off(EVENT_KEY + '.' + this.selectId);
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin (option) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option;

    [].shift.apply(args);

    // if the version was not set successfully
    if (!version.success) {
      // try to retreive it again
      try {
        version.full = ($.fn.dropdown.Constructor.VERSION || '').split(' ')[0].split('.');
      } catch (err) {
        // fall back to use BootstrapVersion
        version.full = Selectpicker.BootstrapVersion.split(' ')[0].split('.');
      }

      version.major = version.full[0];
      version.success = true;

      if (version.major === '4') {
        classNames.DIVIDER = 'dropdown-divider';
        classNames.SHOW = 'show';
        classNames.BUTTONCLASS = 'btn-light';
        Selectpicker.DEFAULTS.style = classNames.BUTTONCLASS = 'btn-light';
        classNames.POPOVERHEADER = 'popover-header';
      }
    }

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
          $this.data('selectpicker', (data = new Selectpicker(this, config)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      // noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
    .off('keydown.bs.dropdown.data-api')
    .on('keydown' + EVENT_KEY, '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bootstrap-select .bs-searchbox input', Selectpicker.prototype.keydown)
    .on('focusin.modal', '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bootstrap-select .bs-searchbox input', function (e) {
      e.stopPropagation();
    });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load' + EVENT_KEY + '.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);


}));


/***/ })

},["./node_modules/bootstrap-select/dist/js/bootstrap-select.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXNlbGVjdC9kaXN0L2pzL2Jvb3RzdHJhcC1zZWxlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQUE7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsYUFBYTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSyx5QkFBeUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLHdCQUF3QjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmLGNBQWM7QUFDZCxjQUFjO0FBQ2QsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsU0FBUztBQUNULFNBQVM7QUFDVCxXQUFXO0FBQ1gsV0FBVztBQUNYLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsRUFBRTtBQUM1QztBQUNBLG9DQUFvQyxFQUFFLG9CQUFvQixFQUFFO0FBQzVELEtBQUs7QUFDTDtBQUNBO0FBQ0EseUNBQXlDLEVBQUUsK0JBQStCLEVBQUU7QUFDNUUsaURBQWlELEVBQUUscUNBQXFDLEVBQUU7QUFDMUY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBLHFCQUFxQiwyQ0FBMkM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0RkFBNEY7QUFDNUYsdURBQXVEOztBQUV2RCx1QkFBdUIsZ0JBQWdCO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFpRSx3QkFBd0I7QUFDekY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdDQUFnQztBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyRUFBMkU7QUFDM0UsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLHNEQUFzRCxhQUFhO0FBQ25FO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFDQUFxQyxFQUFFLDhDQUE4QyxFQUFFO0FBQ3ZGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1Asd0JBQXdCO0FBQ3hCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsOEJBQThCO0FBQzlCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHVCQUF1QixtREFBbUQ7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMscUJBQXFCO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQSxpQ0FBaUMsNkJBQTZCO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsMERBQTBELEVBQUU7QUFDNUQsNkRBQTZELEVBQUU7QUFDL0Q7QUFDQSx5QkFBeUIsSUFBSTtBQUM3QjtBQUNBO0FBQ0EsOENBQThDLElBQUk7QUFDbEQsb0RBQW9ELElBQUk7QUFDeEQ7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEseUJBQXlCLHdDQUF3QztBQUNqRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlFQUF5RSxFQUFFO0FBQzNFO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUJBQXFCLCtDQUErQztBQUNwRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx5REFBeUQ7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMseURBQXlEO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsMkNBQTJDO0FBQ2xFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQyx5REFBeUQ7QUFDM0YsdUNBQXVDLHdHQUF3RztBQUMvSTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7QUFHRCxDQUFDIiwiZmlsZSI6ImpzL2Jvb3RzdHJhcC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICogQm9vdHN0cmFwLXNlbGVjdCB2MS4xMy41IChodHRwczovL2RldmVsb3Blci5zbmFwYXBwb2ludG1lbnRzLmNvbS9ib290c3RyYXAtc2VsZWN0KVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE4IFNuYXBBcHBvaW50bWVudHMsIExMQ1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9zbmFwYXBwb2ludG1lbnRzL2Jvb3RzdHJhcC1zZWxlY3QvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICBpZiAocm9vdCA9PT0gdW5kZWZpbmVkICYmIHdpbmRvdyAhPT0gdW5kZWZpbmVkKSByb290ID0gd2luZG93O1xyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSB1bmxlc3MgYW1kTW9kdWxlSWQgaXMgc2V0XHJcbiAgICBkZWZpbmUoW1wianF1ZXJ5XCJdLCBmdW5jdGlvbiAoYTApIHtcclxuICAgICAgcmV0dXJuIChmYWN0b3J5KGEwKSk7XHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxyXG4gICAgLy8gbGlrZSBOb2RlLlxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJqcXVlcnlcIikpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmYWN0b3J5KHJvb3RbXCJqUXVlcnlcIl0pO1xyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoalF1ZXJ5KSB7XHJcblxyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIFBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XHJcbiAgLy8gUmVtb3ZlIGluIHYyXHJcbiAgaWYgKCEoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnXycpKSkge1xyXG4gICAgKGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgIGlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIGNsYXNzTGlzdFByb3AgPSAnY2xhc3NMaXN0JyxcclxuICAgICAgICAgIHByb3RvUHJvcCA9ICdwcm90b3R5cGUnLFxyXG4gICAgICAgICAgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF0sXHJcbiAgICAgICAgICBvYmpDdHIgPSBPYmplY3QsXHJcbiAgICAgICAgICBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxlbSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkZWxlbS5hZGRDbGFzcyhjbGFzc2VzKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkZWxlbS5yZW1vdmVDbGFzcyhjbGFzc2VzKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvZ2dsZTogZnVuY3Rpb24gKGNsYXNzZXMsIGZvcmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW0udG9nZ2xlQ2xhc3MoY2xhc3NlcywgZm9yY2UpO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW0uaGFzQ2xhc3MoY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xyXG4gICAgICAgIHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcclxuICAgICAgICAgIGdldDogY2xhc3NMaXN0R2V0dGVyLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICB9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcclxuICAgICAgICAgIC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XHJcbiAgICAgICAgICAvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXHJcbiAgICAgICAgICBpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xyXG4gICAgICAgICAgICBjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xyXG4gICAgICAgIGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XHJcbiAgICAgIH1cclxuICAgIH0od2luZG93KSk7XHJcbiAgfVxyXG5cclxuICB2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XHJcblxyXG4gIHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2MzJywgZmFsc2UpO1xyXG5cclxuICAvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XHJcbiAgLy8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxyXG4gIGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2MzJykpIHtcclxuICAgIHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XHJcblxyXG4gICAgRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XHJcbiAgICAgIGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xyXG4gICAgICAgIHJldHVybiBmb3JjZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHRlc3RFbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgLy8gc2hhbGxvdyBhcnJheSBjb21wYXJpc29uXHJcbiAgZnVuY3Rpb24gaXNFcXVhbCAoYXJyYXkxLCBhcnJheTIpIHtcclxuICAgIHJldHVybiBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoICYmIGFycmF5MS5ldmVyeShmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQgPT09IGFycmF5MltpbmRleF07XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyA8ZWRpdG9yLWZvbGQgZGVzYz1cIlNoaW1zXCI+XHJcbiAgaWYgKCFTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpIHtcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JzsgLy8gbmVlZGVkIHRvIHN1cHBvcnQgYGFwcGx5YC9gY2FsbGAgd2l0aCBgdW5kZWZpbmVkYC9gbnVsbGBcclxuICAgICAgdmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBJRSA4IG9ubHkgc3VwcG9ydHMgYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgb24gRE9NIGVsZW1lbnRzXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHZhciBvYmplY3QgPSB7fTtcclxuICAgICAgICAgIHZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KCkpO1xyXG4gICAgICB2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcclxuICAgICAgdmFyIHN0YXJ0c1dpdGggPSBmdW5jdGlvbiAoc2VhcmNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xyXG4gICAgICAgIGlmIChzZWFyY2ggJiYgdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcclxuICAgICAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcclxuICAgICAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAvLyBgVG9JbnRlZ2VyYFxyXG4gICAgICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xyXG4gICAgICAgIGlmIChwb3MgIT0gcG9zKSB7IC8vIGJldHRlciBgaXNOYU5gXHJcbiAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xyXG4gICAgICAgIC8vIEF2b2lkIHRoZSBgaW5kZXhPZmAgY2FsbCBpZiBubyBtYXRjaCBpcyBwb3NzaWJsZVxyXG4gICAgICAgIGlmIChzZWFyY2hMZW5ndGggKyBzdGFydCA+IHN0cmluZ0xlbmd0aCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IHNlYXJjaExlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KHN0YXJ0ICsgaW5kZXgpICE9IHNlYXJjaFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShTdHJpbmcucHJvdG90eXBlLCAnc3RhcnRzV2l0aCcsIHtcclxuICAgICAgICAgICd2YWx1ZSc6IHN0YXJ0c1dpdGgsXHJcbiAgICAgICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcclxuICAgICAgICAgICd3cml0YWJsZSc6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBzdGFydHNXaXRoO1xyXG4gICAgICB9XHJcbiAgICB9KCkpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFPYmplY3Qua2V5cykge1xyXG4gICAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbiAoXHJcbiAgICAgIG8sIC8vIG9iamVjdFxyXG4gICAgICBrLCAvLyBrZXlcclxuICAgICAgciAgLy8gcmVzdWx0IGFycmF5XHJcbiAgICApIHtcclxuICAgICAgLy8gaW5pdGlhbGl6ZSBvYmplY3QgYW5kIHJlc3VsdFxyXG4gICAgICByID0gW107XHJcbiAgICAgIC8vIGl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xyXG4gICAgICBmb3IgKGsgaW4gbykge1xyXG4gICAgICAgIC8vIGZpbGwgcmVzdWx0IGFycmF5IHdpdGggbm9uLXByb3RvdHlwaWNhbCBrZXlzXHJcbiAgICAgICAgci5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspICYmIHIucHVzaChrKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gcmVzdWx0XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIG11Y2ggZmFzdGVyIHRoYW4gJC52YWwoKVxyXG4gIGZ1bmN0aW9uIGdldFNlbGVjdFZhbHVlcyAoc2VsZWN0KSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGVjdCAmJiBzZWxlY3Qub3B0aW9ucztcclxuICAgIHZhciBvcHQ7XHJcblxyXG4gICAgaWYgKHNlbGVjdC5tdWx0aXBsZSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIG9wdCA9IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgIGlmIChvcHQuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoKG9wdC52YWx1ZSB8fCBvcHQudGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSBzZWxlY3QudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8vIHNldCBkYXRhLXNlbGVjdGVkIG9uIHNlbGVjdCBlbGVtZW50IGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBwcm9ncmFtbWF0aWNhbGx5IHNlbGVjdGVkXHJcbiAgLy8gcHJpb3IgdG8gaW5pdGlhbGl6YXRpb24gb2YgYm9vdHN0cmFwLXNlbGVjdFxyXG4gIC8vICogY29uc2lkZXIgcmVtb3Zpbmcgb3IgcmVwbGFjaW5nIGFuIGFsdGVybmF0aXZlIG1ldGhvZCAqXHJcbiAgdmFyIHZhbEhvb2tzID0ge1xyXG4gICAgdXNlRGVmYXVsdDogZmFsc2UsXHJcbiAgICBfc2V0OiAkLnZhbEhvb2tzLnNlbGVjdC5zZXRcclxuICB9O1xyXG5cclxuICAkLnZhbEhvb2tzLnNlbGVjdC5zZXQgPSBmdW5jdGlvbiAoZWxlbSwgdmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSAmJiAhdmFsSG9va3MudXNlRGVmYXVsdCkgJChlbGVtKS5kYXRhKCdzZWxlY3RlZCcsIHRydWUpO1xyXG5cclxuICAgIHJldHVybiB2YWxIb29rcy5fc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGNoYW5nZWRBcmd1bWVudHMgPSBudWxsO1xyXG5cclxuICB2YXIgRXZlbnRJc1N1cHBvcnRlZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBuZXcgRXZlbnQoJ2NoYW5nZScpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gICQuZm4udHJpZ2dlck5hdGl2ZSA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcclxuICAgIHZhciBlbCA9IHRoaXNbMF0sXHJcbiAgICAgICAgZXZlbnQ7XHJcblxyXG4gICAgaWYgKGVsLmRpc3BhdGNoRXZlbnQpIHsgLy8gZm9yIG1vZGVybiBicm93c2VycyAmIElFOStcclxuICAgICAgaWYgKEV2ZW50SXNTdXBwb3J0ZWQpIHtcclxuICAgICAgICAvLyBGb3IgbW9kZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnROYW1lLCB7XHJcbiAgICAgICAgICBidWJibGVzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRm9yIElFIHNpbmNlIGl0IGRvZXNuJ3Qgc3VwcG9ydCBFdmVudCBjb25zdHJ1Y3RvclxyXG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAoZWwuZmlyZUV2ZW50KSB7IC8vIGZvciBJRThcclxuICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xyXG4gICAgICBldmVudC5ldmVudFR5cGUgPSBldmVudE5hbWU7XHJcbiAgICAgIGVsLmZpcmVFdmVudCgnb24nICsgZXZlbnROYW1lLCBldmVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBmYWxsIGJhY2sgdG8galF1ZXJ5LnRyaWdnZXJcclxuICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50TmFtZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyA8L2VkaXRvci1mb2xkPlxyXG5cclxuICBmdW5jdGlvbiBzdHJpbmdTZWFyY2ggKGxpLCBzZWFyY2hTdHJpbmcsIG1ldGhvZCwgbm9ybWFsaXplKSB7XHJcbiAgICB2YXIgc3RyaW5nVHlwZXMgPSBbXHJcbiAgICAgICAgICAnY29udGVudCcsXHJcbiAgICAgICAgICAnc3VidGV4dCcsXHJcbiAgICAgICAgICAndG9rZW5zJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgc2VhcmNoU3VjY2VzcyA9IGZhbHNlO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHN0cmluZ1R5cGUgPSBzdHJpbmdUeXBlc1tpXSxcclxuICAgICAgICAgIHN0cmluZyA9IGxpW3N0cmluZ1R5cGVdO1xyXG5cclxuICAgICAgaWYgKHN0cmluZykge1xyXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAvLyBTdHJpcCBIVE1MIHRhZ3MuIFRoaXMgaXNuJ3QgcGVyZmVjdCwgYnV0IGl0J3MgbXVjaCBmYXN0ZXIgdGhhbiBhbnkgb3RoZXIgbWV0aG9kXHJcbiAgICAgICAgaWYgKHN0cmluZ1R5cGUgPT09ICdjb250ZW50Jykge1xyXG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLzxbXj5dKz4vZywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vcm1hbGl6ZSkgc3RyaW5nID0gbm9ybWFsaXplVG9CYXNlKHN0cmluZyk7XHJcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdjb250YWlucycpIHtcclxuICAgICAgICAgIHNlYXJjaFN1Y2Nlc3MgPSBzdHJpbmcuaW5kZXhPZihzZWFyY2hTdHJpbmcpID49IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlYXJjaFN1Y2Nlc3MgPSBzdHJpbmcuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlYXJjaFN1Y2Nlc3MpIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlYXJjaFN1Y2Nlc3M7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b0ludGVnZXIgKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKSB8fCAwO1xyXG4gIH1cclxuXHJcbiAgLy8gQm9ycm93ZWQgZnJvbSBMb2Rhc2ggKF8uZGVidXJyKVxyXG4gIC8qKiBVc2VkIHRvIG1hcCBMYXRpbiBVbmljb2RlIGxldHRlcnMgdG8gYmFzaWMgTGF0aW4gbGV0dGVycy4gKi9cclxuICB2YXIgZGVidXJyZWRMZXR0ZXJzID0ge1xyXG4gICAgLy8gTGF0aW4tMSBTdXBwbGVtZW50IGJsb2NrLlxyXG4gICAgJ1xceGMwJzogJ0EnLCAgJ1xceGMxJzogJ0EnLCAnXFx4YzInOiAnQScsICdcXHhjMyc6ICdBJywgJ1xceGM0JzogJ0EnLCAnXFx4YzUnOiAnQScsXHJcbiAgICAnXFx4ZTAnOiAnYScsICAnXFx4ZTEnOiAnYScsICdcXHhlMic6ICdhJywgJ1xceGUzJzogJ2EnLCAnXFx4ZTQnOiAnYScsICdcXHhlNSc6ICdhJyxcclxuICAgICdcXHhjNyc6ICdDJywgICdcXHhlNyc6ICdjJyxcclxuICAgICdcXHhkMCc6ICdEJywgICdcXHhmMCc6ICdkJyxcclxuICAgICdcXHhjOCc6ICdFJywgICdcXHhjOSc6ICdFJywgJ1xceGNhJzogJ0UnLCAnXFx4Y2InOiAnRScsXHJcbiAgICAnXFx4ZTgnOiAnZScsICAnXFx4ZTknOiAnZScsICdcXHhlYSc6ICdlJywgJ1xceGViJzogJ2UnLFxyXG4gICAgJ1xceGNjJzogJ0knLCAgJ1xceGNkJzogJ0knLCAnXFx4Y2UnOiAnSScsICdcXHhjZic6ICdJJyxcclxuICAgICdcXHhlYyc6ICdpJywgICdcXHhlZCc6ICdpJywgJ1xceGVlJzogJ2knLCAnXFx4ZWYnOiAnaScsXHJcbiAgICAnXFx4ZDEnOiAnTicsICAnXFx4ZjEnOiAnbicsXHJcbiAgICAnXFx4ZDInOiAnTycsICAnXFx4ZDMnOiAnTycsICdcXHhkNCc6ICdPJywgJ1xceGQ1JzogJ08nLCAnXFx4ZDYnOiAnTycsICdcXHhkOCc6ICdPJyxcclxuICAgICdcXHhmMic6ICdvJywgICdcXHhmMyc6ICdvJywgJ1xceGY0JzogJ28nLCAnXFx4ZjUnOiAnbycsICdcXHhmNic6ICdvJywgJ1xceGY4JzogJ28nLFxyXG4gICAgJ1xceGQ5JzogJ1UnLCAgJ1xceGRhJzogJ1UnLCAnXFx4ZGInOiAnVScsICdcXHhkYyc6ICdVJyxcclxuICAgICdcXHhmOSc6ICd1JywgICdcXHhmYSc6ICd1JywgJ1xceGZiJzogJ3UnLCAnXFx4ZmMnOiAndScsXHJcbiAgICAnXFx4ZGQnOiAnWScsICAnXFx4ZmQnOiAneScsICdcXHhmZic6ICd5JyxcclxuICAgICdcXHhjNic6ICdBZScsICdcXHhlNic6ICdhZScsXHJcbiAgICAnXFx4ZGUnOiAnVGgnLCAnXFx4ZmUnOiAndGgnLFxyXG4gICAgJ1xceGRmJzogJ3NzJyxcclxuICAgIC8vIExhdGluIEV4dGVuZGVkLUEgYmxvY2suXHJcbiAgICAnXFx1MDEwMCc6ICdBJywgICdcXHUwMTAyJzogJ0EnLCAnXFx1MDEwNCc6ICdBJyxcclxuICAgICdcXHUwMTAxJzogJ2EnLCAgJ1xcdTAxMDMnOiAnYScsICdcXHUwMTA1JzogJ2EnLFxyXG4gICAgJ1xcdTAxMDYnOiAnQycsICAnXFx1MDEwOCc6ICdDJywgJ1xcdTAxMGEnOiAnQycsICdcXHUwMTBjJzogJ0MnLFxyXG4gICAgJ1xcdTAxMDcnOiAnYycsICAnXFx1MDEwOSc6ICdjJywgJ1xcdTAxMGInOiAnYycsICdcXHUwMTBkJzogJ2MnLFxyXG4gICAgJ1xcdTAxMGUnOiAnRCcsICAnXFx1MDExMCc6ICdEJywgJ1xcdTAxMGYnOiAnZCcsICdcXHUwMTExJzogJ2QnLFxyXG4gICAgJ1xcdTAxMTInOiAnRScsICAnXFx1MDExNCc6ICdFJywgJ1xcdTAxMTYnOiAnRScsICdcXHUwMTE4JzogJ0UnLCAnXFx1MDExYSc6ICdFJyxcclxuICAgICdcXHUwMTEzJzogJ2UnLCAgJ1xcdTAxMTUnOiAnZScsICdcXHUwMTE3JzogJ2UnLCAnXFx1MDExOSc6ICdlJywgJ1xcdTAxMWInOiAnZScsXHJcbiAgICAnXFx1MDExYyc6ICdHJywgICdcXHUwMTFlJzogJ0cnLCAnXFx1MDEyMCc6ICdHJywgJ1xcdTAxMjInOiAnRycsXHJcbiAgICAnXFx1MDExZCc6ICdnJywgICdcXHUwMTFmJzogJ2cnLCAnXFx1MDEyMSc6ICdnJywgJ1xcdTAxMjMnOiAnZycsXHJcbiAgICAnXFx1MDEyNCc6ICdIJywgICdcXHUwMTI2JzogJ0gnLCAnXFx1MDEyNSc6ICdoJywgJ1xcdTAxMjcnOiAnaCcsXHJcbiAgICAnXFx1MDEyOCc6ICdJJywgICdcXHUwMTJhJzogJ0knLCAnXFx1MDEyYyc6ICdJJywgJ1xcdTAxMmUnOiAnSScsICdcXHUwMTMwJzogJ0knLFxyXG4gICAgJ1xcdTAxMjknOiAnaScsICAnXFx1MDEyYic6ICdpJywgJ1xcdTAxMmQnOiAnaScsICdcXHUwMTJmJzogJ2knLCAnXFx1MDEzMSc6ICdpJyxcclxuICAgICdcXHUwMTM0JzogJ0onLCAgJ1xcdTAxMzUnOiAnaicsXHJcbiAgICAnXFx1MDEzNic6ICdLJywgICdcXHUwMTM3JzogJ2snLCAnXFx1MDEzOCc6ICdrJyxcclxuICAgICdcXHUwMTM5JzogJ0wnLCAgJ1xcdTAxM2InOiAnTCcsICdcXHUwMTNkJzogJ0wnLCAnXFx1MDEzZic6ICdMJywgJ1xcdTAxNDEnOiAnTCcsXHJcbiAgICAnXFx1MDEzYSc6ICdsJywgICdcXHUwMTNjJzogJ2wnLCAnXFx1MDEzZSc6ICdsJywgJ1xcdTAxNDAnOiAnbCcsICdcXHUwMTQyJzogJ2wnLFxyXG4gICAgJ1xcdTAxNDMnOiAnTicsICAnXFx1MDE0NSc6ICdOJywgJ1xcdTAxNDcnOiAnTicsICdcXHUwMTRhJzogJ04nLFxyXG4gICAgJ1xcdTAxNDQnOiAnbicsICAnXFx1MDE0Nic6ICduJywgJ1xcdTAxNDgnOiAnbicsICdcXHUwMTRiJzogJ24nLFxyXG4gICAgJ1xcdTAxNGMnOiAnTycsICAnXFx1MDE0ZSc6ICdPJywgJ1xcdTAxNTAnOiAnTycsXHJcbiAgICAnXFx1MDE0ZCc6ICdvJywgICdcXHUwMTRmJzogJ28nLCAnXFx1MDE1MSc6ICdvJyxcclxuICAgICdcXHUwMTU0JzogJ1InLCAgJ1xcdTAxNTYnOiAnUicsICdcXHUwMTU4JzogJ1InLFxyXG4gICAgJ1xcdTAxNTUnOiAncicsICAnXFx1MDE1Nyc6ICdyJywgJ1xcdTAxNTknOiAncicsXHJcbiAgICAnXFx1MDE1YSc6ICdTJywgICdcXHUwMTVjJzogJ1MnLCAnXFx1MDE1ZSc6ICdTJywgJ1xcdTAxNjAnOiAnUycsXHJcbiAgICAnXFx1MDE1Yic6ICdzJywgICdcXHUwMTVkJzogJ3MnLCAnXFx1MDE1Zic6ICdzJywgJ1xcdTAxNjEnOiAncycsXHJcbiAgICAnXFx1MDE2Mic6ICdUJywgICdcXHUwMTY0JzogJ1QnLCAnXFx1MDE2Nic6ICdUJyxcclxuICAgICdcXHUwMTYzJzogJ3QnLCAgJ1xcdTAxNjUnOiAndCcsICdcXHUwMTY3JzogJ3QnLFxyXG4gICAgJ1xcdTAxNjgnOiAnVScsICAnXFx1MDE2YSc6ICdVJywgJ1xcdTAxNmMnOiAnVScsICdcXHUwMTZlJzogJ1UnLCAnXFx1MDE3MCc6ICdVJywgJ1xcdTAxNzInOiAnVScsXHJcbiAgICAnXFx1MDE2OSc6ICd1JywgICdcXHUwMTZiJzogJ3UnLCAnXFx1MDE2ZCc6ICd1JywgJ1xcdTAxNmYnOiAndScsICdcXHUwMTcxJzogJ3UnLCAnXFx1MDE3Myc6ICd1JyxcclxuICAgICdcXHUwMTc0JzogJ1cnLCAgJ1xcdTAxNzUnOiAndycsXHJcbiAgICAnXFx1MDE3Nic6ICdZJywgICdcXHUwMTc3JzogJ3knLCAnXFx1MDE3OCc6ICdZJyxcclxuICAgICdcXHUwMTc5JzogJ1onLCAgJ1xcdTAxN2InOiAnWicsICdcXHUwMTdkJzogJ1onLFxyXG4gICAgJ1xcdTAxN2EnOiAneicsICAnXFx1MDE3Yyc6ICd6JywgJ1xcdTAxN2UnOiAneicsXHJcbiAgICAnXFx1MDEzMic6ICdJSicsICdcXHUwMTMzJzogJ2lqJyxcclxuICAgICdcXHUwMTUyJzogJ09lJywgJ1xcdTAxNTMnOiAnb2UnLFxyXG4gICAgJ1xcdTAxNDknOiBcIiduXCIsICdcXHUwMTdmJzogJ3MnXHJcbiAgfTtcclxuXHJcbiAgLyoqIFVzZWQgdG8gbWF0Y2ggTGF0aW4gVW5pY29kZSBsZXR0ZXJzIChleGNsdWRpbmcgbWF0aGVtYXRpY2FsIG9wZXJhdG9ycykuICovXHJcbiAgdmFyIHJlTGF0aW4gPSAvW1xceGMwLVxceGQ2XFx4ZDgtXFx4ZjZcXHhmOC1cXHhmZlxcdTAxMDAtXFx1MDE3Zl0vZztcclxuXHJcbiAgLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNoYXJhY3RlciBjbGFzc2VzLiAqL1xyXG4gIHZhciByc0NvbWJvTWFya3NSYW5nZSA9ICdcXFxcdTAzMDAtXFxcXHUwMzZmJyxcclxuICAgICAgcmVDb21ib0hhbGZNYXJrc1JhbmdlID0gJ1xcXFx1ZmUyMC1cXFxcdWZlMmYnLFxyXG4gICAgICByc0NvbWJvU3ltYm9sc1JhbmdlID0gJ1xcXFx1MjBkMC1cXFxcdTIwZmYnLFxyXG4gICAgICByc0NvbWJvTWFya3NFeHRlbmRlZFJhbmdlID0gJ1xcXFx1MWFiMC1cXFxcdTFhZmYnLFxyXG4gICAgICByc0NvbWJvTWFya3NTdXBwbGVtZW50UmFuZ2UgPSAnXFxcXHUxZGMwLVxcXFx1MWRmZicsXHJcbiAgICAgIHJzQ29tYm9SYW5nZSA9IHJzQ29tYm9NYXJrc1JhbmdlICsgcmVDb21ib0hhbGZNYXJrc1JhbmdlICsgcnNDb21ib1N5bWJvbHNSYW5nZSArIHJzQ29tYm9NYXJrc0V4dGVuZGVkUmFuZ2UgKyByc0NvbWJvTWFya3NTdXBwbGVtZW50UmFuZ2U7XHJcblxyXG4gIC8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cclxuICB2YXIgcnNDb21ibyA9ICdbJyArIHJzQ29tYm9SYW5nZSArICddJztcclxuXHJcbiAgLyoqXHJcbiAgICogVXNlZCB0byBtYXRjaCBbY29tYmluaW5nIGRpYWNyaXRpY2FsIG1hcmtzXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21iaW5pbmdfRGlhY3JpdGljYWxfTWFya3MpIGFuZFxyXG4gICAqIFtjb21iaW5pbmcgZGlhY3JpdGljYWwgbWFya3MgZm9yIHN5bWJvbHNdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbWJpbmluZ19EaWFjcml0aWNhbF9NYXJrc19mb3JfU3ltYm9scykuXHJcbiAgICovXHJcbiAgdmFyIHJlQ29tYm9NYXJrID0gUmVnRXhwKHJzQ29tYm8sICdnJyk7XHJcblxyXG4gIGZ1bmN0aW9uIGRlYnVyckxldHRlciAoa2V5KSB7XHJcbiAgICByZXR1cm4gZGVidXJyZWRMZXR0ZXJzW2tleV07XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXplVG9CYXNlIChzdHJpbmcpIHtcclxuICAgIHN0cmluZyA9IHN0cmluZy50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHN0cmluZyAmJiBzdHJpbmcucmVwbGFjZShyZUxhdGluLCBkZWJ1cnJMZXR0ZXIpLnJlcGxhY2UocmVDb21ib01hcmssICcnKTtcclxuICB9XHJcblxyXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXHJcbiAgdmFyIGVzY2FwZU1hcCA9IHtcclxuICAgICcmJzogJyZhbXA7JyxcclxuICAgICc8JzogJyZsdDsnLFxyXG4gICAgJz4nOiAnJmd0OycsXHJcbiAgICAnXCInOiAnJnF1b3Q7JyxcclxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcclxuICAgICdgJzogJyYjeDYwOydcclxuICB9O1xyXG5cclxuICB2YXIgdW5lc2NhcGVNYXAgPSB7XHJcbiAgICAnJmFtcDsnOiAnJicsXHJcbiAgICAnJmx0Oyc6ICc8JyxcclxuICAgICcmZ3Q7JzogJz4nLFxyXG4gICAgJyZxdW90Oyc6ICdcIicsXHJcbiAgICAnJiN4Mjc7JzogXCInXCIsXHJcbiAgICAnJiN4NjA7JzogJ2AnXHJcbiAgfTtcclxuXHJcbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxyXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XHJcbiAgICB9O1xyXG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkLlxyXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgT2JqZWN0LmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XHJcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xyXG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmcpIHtcclxuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xyXG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgdmFyIGh0bWxFc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XHJcbiAgdmFyIGh0bWxVbmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIGtleUNvZGVNYXAgPSB7XHJcbiAgICAzMjogJyAnLFxyXG4gICAgNDg6ICcwJyxcclxuICAgIDQ5OiAnMScsXHJcbiAgICA1MDogJzInLFxyXG4gICAgNTE6ICczJyxcclxuICAgIDUyOiAnNCcsXHJcbiAgICA1MzogJzUnLFxyXG4gICAgNTQ6ICc2JyxcclxuICAgIDU1OiAnNycsXHJcbiAgICA1NjogJzgnLFxyXG4gICAgNTc6ICc5JyxcclxuICAgIDU5OiAnOycsXHJcbiAgICA2NTogJ0EnLFxyXG4gICAgNjY6ICdCJyxcclxuICAgIDY3OiAnQycsXHJcbiAgICA2ODogJ0QnLFxyXG4gICAgNjk6ICdFJyxcclxuICAgIDcwOiAnRicsXHJcbiAgICA3MTogJ0cnLFxyXG4gICAgNzI6ICdIJyxcclxuICAgIDczOiAnSScsXHJcbiAgICA3NDogJ0onLFxyXG4gICAgNzU6ICdLJyxcclxuICAgIDc2OiAnTCcsXHJcbiAgICA3NzogJ00nLFxyXG4gICAgNzg6ICdOJyxcclxuICAgIDc5OiAnTycsXHJcbiAgICA4MDogJ1AnLFxyXG4gICAgODE6ICdRJyxcclxuICAgIDgyOiAnUicsXHJcbiAgICA4MzogJ1MnLFxyXG4gICAgODQ6ICdUJyxcclxuICAgIDg1OiAnVScsXHJcbiAgICA4NjogJ1YnLFxyXG4gICAgODc6ICdXJyxcclxuICAgIDg4OiAnWCcsXHJcbiAgICA4OTogJ1knLFxyXG4gICAgOTA6ICdaJyxcclxuICAgIDk2OiAnMCcsXHJcbiAgICA5NzogJzEnLFxyXG4gICAgOTg6ICcyJyxcclxuICAgIDk5OiAnMycsXHJcbiAgICAxMDA6ICc0JyxcclxuICAgIDEwMTogJzUnLFxyXG4gICAgMTAyOiAnNicsXHJcbiAgICAxMDM6ICc3JyxcclxuICAgIDEwNDogJzgnLFxyXG4gICAgMTA1OiAnOSdcclxuICB9O1xyXG5cclxuICB2YXIga2V5Q29kZXMgPSB7XHJcbiAgICBFU0NBUEU6IDI3LCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBFc2NhcGUgKEVzYykga2V5XHJcbiAgICBFTlRFUjogMTMsIC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIEVudGVyIGtleVxyXG4gICAgU1BBQ0U6IDMyLCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBzcGFjZSBrZXlcclxuICAgIFRBQjogOSwgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgdGFiIGtleVxyXG4gICAgQVJST1dfVVA6IDM4LCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciB1cCBhcnJvdyBrZXlcclxuICAgIEFSUk9XX0RPV046IDQwIC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIGRvd24gYXJyb3cga2V5XHJcbiAgfVxyXG5cclxuICB2YXIgdmVyc2lvbiA9IHtcclxuICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgbWFqb3I6ICczJ1xyXG4gIH07XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2ZXJzaW9uLmZ1bGwgPSAoJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3Rvci5WRVJTSU9OIHx8ICcnKS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJyk7XHJcbiAgICB2ZXJzaW9uLm1ham9yID0gdmVyc2lvbi5mdWxsWzBdO1xyXG4gICAgdmVyc2lvbi5zdWNjZXNzID0gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGNvbnNvbGUud2FybihcclxuICAgICAgJ1RoZXJlIHdhcyBhbiBpc3N1ZSByZXRyaWV2aW5nIEJvb3RzdHJhcFxcJ3MgdmVyc2lvbi4gJyArXHJcbiAgICAgICdFbnN1cmUgQm9vdHN0cmFwIGlzIGJlaW5nIGxvYWRlZCBiZWZvcmUgYm9vdHN0cmFwLXNlbGVjdCBhbmQgdGhlcmUgaXMgbm8gbmFtZXNwYWNlIGNvbGxpc2lvbi4gJyArXHJcbiAgICAgICdJZiBsb2FkaW5nIEJvb3RzdHJhcCBhc3luY2hyb25vdXNseSwgdGhlIHZlcnNpb24gbWF5IG5lZWQgdG8gYmUgbWFudWFsbHkgc3BlY2lmaWVkIHZpYSAkLmZuLnNlbGVjdHBpY2tlci5Db25zdHJ1Y3Rvci5Cb290c3RyYXBWZXJzaW9uLicsXHJcbiAgICAgIGVyclxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHZhciBzZWxlY3RJZCA9IDA7XHJcblxyXG4gIHZhciBFVkVOVF9LRVkgPSAnLmJzLnNlbGVjdCc7XHJcblxyXG4gIHZhciBjbGFzc05hbWVzID0ge1xyXG4gICAgRElTQUJMRUQ6ICdkaXNhYmxlZCcsXHJcbiAgICBESVZJREVSOiAnZGl2aWRlcicsXHJcbiAgICBTSE9XOiAnb3BlbicsXHJcbiAgICBEUk9QVVA6ICdkcm9wdXAnLFxyXG4gICAgTUVOVTogJ2Ryb3Bkb3duLW1lbnUnLFxyXG4gICAgTUVOVVJJR0hUOiAnZHJvcGRvd24tbWVudS1yaWdodCcsXHJcbiAgICBNRU5VTEVGVDogJ2Ryb3Bkb3duLW1lbnUtbGVmdCcsXHJcbiAgICAvLyB0by1kbzogcmVwbGFjZSB3aXRoIG1vcmUgYWR2YW5jZWQgdGVtcGxhdGUvY3VzdG9taXphdGlvbiBvcHRpb25zXHJcbiAgICBCVVRUT05DTEFTUzogJ2J0bi1kZWZhdWx0JyxcclxuICAgIFBPUE9WRVJIRUFERVI6ICdwb3BvdmVyLXRpdGxlJ1xyXG4gIH1cclxuXHJcbiAgdmFyIFNlbGVjdG9yID0ge1xyXG4gICAgTUVOVTogJy4nICsgY2xhc3NOYW1lcy5NRU5VXHJcbiAgfVxyXG5cclxuICBpZiAodmVyc2lvbi5tYWpvciA9PT0gJzQnKSB7XHJcbiAgICBjbGFzc05hbWVzLkRJVklERVIgPSAnZHJvcGRvd24tZGl2aWRlcic7XHJcbiAgICBjbGFzc05hbWVzLlNIT1cgPSAnc2hvdyc7XHJcbiAgICBjbGFzc05hbWVzLkJVVFRPTkNMQVNTID0gJ2J0bi1saWdodCc7XHJcbiAgICBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgPSAncG9wb3Zlci1oZWFkZXInO1xyXG4gIH1cclxuXHJcbiAgdmFyIFJFR0VYUF9BUlJPVyA9IG5ldyBSZWdFeHAoa2V5Q29kZXMuQVJST1dfVVAgKyAnfCcgKyBrZXlDb2Rlcy5BUlJPV19ET1dOKTtcclxuICB2YXIgUkVHRVhQX1RBQl9PUl9FU0NBUEUgPSBuZXcgUmVnRXhwKCdeJyArIGtleUNvZGVzLlRBQiArICckfCcgKyBrZXlDb2Rlcy5FU0NBUEUpO1xyXG5cclxuICB2YXIgU2VsZWN0cGlja2VyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAvLyBib290c3RyYXAtc2VsZWN0IGhhcyBiZWVuIGluaXRpYWxpemVkIC0gcmV2ZXJ0IHZhbEhvb2tzLnNlbGVjdC5zZXQgYmFjayB0byBpdHMgb3JpZ2luYWwgZnVuY3Rpb25cclxuICAgIGlmICghdmFsSG9va3MudXNlRGVmYXVsdCkge1xyXG4gICAgICAkLnZhbEhvb2tzLnNlbGVjdC5zZXQgPSB2YWxIb29rcy5fc2V0O1xyXG4gICAgICB2YWxIb29rcy51c2VEZWZhdWx0ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgIHRoaXMuJG5ld0VsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy4kYnV0dG9uID0gbnVsbDtcclxuICAgIHRoaXMuJG1lbnUgPSBudWxsO1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMuc2VsZWN0cGlja2VyID0ge1xyXG4gICAgICBtYWluOiB7XHJcbiAgICAgICAgLy8gc3RvcmUgb3JpZ2luYWxJbmRleCAoa2V5KSBhbmQgbmV3SW5kZXggKHZhbHVlKSBpbiB0aGlzLnNlbGVjdHBpY2tlci5tYWluLm1hcC5uZXdJbmRleCBmb3IgZmFzdCBhY2Nlc3NpYmlsaXR5XHJcbiAgICAgICAgLy8gYWxsb3dzIHVzIHRvIGRvIHRoaXMubWFpbi5lbGVtZW50c1t0aGlzLnNlbGVjdHBpY2tlci5tYWluLm1hcC5uZXdJbmRleFtpbmRleF1dIHRvIHNlbGVjdCBhbiBlbGVtZW50IGJhc2VkIG9uIHRoZSBvcmlnaW5hbEluZGV4XHJcbiAgICAgICAgbWFwOiB7XHJcbiAgICAgICAgICBuZXdJbmRleDoge30sXHJcbiAgICAgICAgICBvcmlnaW5hbEluZGV4OiB7fVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY3VycmVudDoge1xyXG4gICAgICAgIG1hcDoge31cclxuICAgICAgfSwgLy8gY3VycmVudCBjaGFuZ2VzIGlmIGEgc2VhcmNoIGlzIGluIHByb2dyZXNzXHJcbiAgICAgIHNlYXJjaDoge1xyXG4gICAgICAgIG1hcDoge31cclxuICAgICAgfSxcclxuICAgICAgdmlldzoge30sXHJcbiAgICAgIGtleWRvd246IHtcclxuICAgICAgICBrZXlIaXN0b3J5OiAnJyxcclxuICAgICAgICByZXNldEtleUhpc3Rvcnk6IHtcclxuICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5rZXlkb3duLmtleUhpc3RvcnkgPSAnJztcclxuICAgICAgICAgICAgfSwgODAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBJZiB3ZSBoYXZlIG5vIHRpdGxlIHlldCwgdHJ5IHRvIHB1bGwgaXQgZnJvbSB0aGUgaHRtbCB0aXRsZSBhdHRyaWJ1dGUgKGpRdWVyeSBkb2VzbnQnIHBpY2sgaXQgdXAgYXMgaXQncyBub3QgYVxyXG4gICAgLy8gZGF0YS1hdHRyaWJ1dGUpXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy50aXRsZSA9IHRoaXMuJGVsZW1lbnQuYXR0cigndGl0bGUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtYXQgd2luZG93IHBhZGRpbmdcclxuICAgIHZhciB3aW5QYWQgPSB0aGlzLm9wdGlvbnMud2luZG93UGFkZGluZztcclxuICAgIGlmICh0eXBlb2Ygd2luUGFkID09PSAnbnVtYmVyJykge1xyXG4gICAgICB0aGlzLm9wdGlvbnMud2luZG93UGFkZGluZyA9IFt3aW5QYWQsIHdpblBhZCwgd2luUGFkLCB3aW5QYWRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgbWV0aG9kc1xyXG4gICAgdGhpcy52YWwgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnZhbDtcclxuICAgIHRoaXMucmVuZGVyID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5yZW5kZXI7XHJcbiAgICB0aGlzLnJlZnJlc2ggPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnJlZnJlc2g7XHJcbiAgICB0aGlzLnNldFN0eWxlID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5zZXRTdHlsZTtcclxuICAgIHRoaXMuc2VsZWN0QWxsID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5zZWxlY3RBbGw7XHJcbiAgICB0aGlzLmRlc2VsZWN0QWxsID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5kZXNlbGVjdEFsbDtcclxuICAgIHRoaXMuZGVzdHJveSA9IFNlbGVjdHBpY2tlci5wcm90b3R5cGUuZGVzdHJveTtcclxuICAgIHRoaXMucmVtb3ZlID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5yZW1vdmU7XHJcbiAgICB0aGlzLnNob3cgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnNob3c7XHJcbiAgICB0aGlzLmhpZGUgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLmhpZGU7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0cGlja2VyLlZFUlNJT04gPSAnMS4xMy41JztcclxuXHJcbiAgU2VsZWN0cGlja2VyLkJvb3RzdHJhcFZlcnNpb24gPSB2ZXJzaW9uLm1ham9yO1xyXG5cclxuICAvLyBwYXJ0IG9mIHRoaXMgaXMgZHVwbGljYXRlZCBpbiBpMThuL2RlZmF1bHRzLWVuX1VTLmpzLiBNYWtlIHN1cmUgdG8gdXBkYXRlIGJvdGguXHJcbiAgU2VsZWN0cGlja2VyLkRFRkFVTFRTID0ge1xyXG4gICAgbm9uZVNlbGVjdGVkVGV4dDogJ05vdGhpbmcgc2VsZWN0ZWQnLFxyXG4gICAgbm9uZVJlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBtYXRjaGVkIHswfScsXHJcbiAgICBjb3VudFNlbGVjdGVkVGV4dDogZnVuY3Rpb24gKG51bVNlbGVjdGVkLCBudW1Ub3RhbCkge1xyXG4gICAgICByZXR1cm4gKG51bVNlbGVjdGVkID09IDEpID8gJ3swfSBpdGVtIHNlbGVjdGVkJyA6ICd7MH0gaXRlbXMgc2VsZWN0ZWQnO1xyXG4gICAgfSxcclxuICAgIG1heE9wdGlvbnNUZXh0OiBmdW5jdGlvbiAobnVtQWxsLCBudW1Hcm91cCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIChudW1BbGwgPT0gMSkgPyAnTGltaXQgcmVhY2hlZCAoe259IGl0ZW0gbWF4KScgOiAnTGltaXQgcmVhY2hlZCAoe259IGl0ZW1zIG1heCknLFxyXG4gICAgICAgIChudW1Hcm91cCA9PSAxKSA/ICdHcm91cCBsaW1pdCByZWFjaGVkICh7bn0gaXRlbSBtYXgpJyA6ICdHcm91cCBsaW1pdCByZWFjaGVkICh7bn0gaXRlbXMgbWF4KSdcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBzZWxlY3RBbGxUZXh0OiAnU2VsZWN0IEFsbCcsXHJcbiAgICBkZXNlbGVjdEFsbFRleHQ6ICdEZXNlbGVjdCBBbGwnLFxyXG4gICAgZG9uZUJ1dHRvbjogZmFsc2UsXHJcbiAgICBkb25lQnV0dG9uVGV4dDogJ0Nsb3NlJyxcclxuICAgIG11bHRpcGxlU2VwYXJhdG9yOiAnLCAnLFxyXG4gICAgc3R5bGVCYXNlOiAnYnRuJyxcclxuICAgIHN0eWxlOiBjbGFzc05hbWVzLkJVVFRPTkNMQVNTLFxyXG4gICAgc2l6ZTogJ2F1dG8nLFxyXG4gICAgdGl0bGU6IG51bGwsXHJcbiAgICBzZWxlY3RlZFRleHRGb3JtYXQ6ICd2YWx1ZXMnLFxyXG4gICAgd2lkdGg6IGZhbHNlLFxyXG4gICAgY29udGFpbmVyOiBmYWxzZSxcclxuICAgIGhpZGVEaXNhYmxlZDogZmFsc2UsXHJcbiAgICBzaG93U3VidGV4dDogZmFsc2UsXHJcbiAgICBzaG93SWNvbjogdHJ1ZSxcclxuICAgIHNob3dDb250ZW50OiB0cnVlLFxyXG4gICAgZHJvcHVwQXV0bzogdHJ1ZSxcclxuICAgIGhlYWRlcjogZmFsc2UsXHJcbiAgICBsaXZlU2VhcmNoOiBmYWxzZSxcclxuICAgIGxpdmVTZWFyY2hQbGFjZWhvbGRlcjogbnVsbCxcclxuICAgIGxpdmVTZWFyY2hOb3JtYWxpemU6IGZhbHNlLFxyXG4gICAgbGl2ZVNlYXJjaFN0eWxlOiAnY29udGFpbnMnLFxyXG4gICAgYWN0aW9uc0JveDogZmFsc2UsXHJcbiAgICBpY29uQmFzZTogJ2dseXBoaWNvbicsXHJcbiAgICB0aWNrSWNvbjogJ2dseXBoaWNvbi1vaycsXHJcbiAgICBzaG93VGljazogZmFsc2UsXHJcbiAgICB0ZW1wbGF0ZToge1xyXG4gICAgICBjYXJldDogJzxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+J1xyXG4gICAgfSxcclxuICAgIG1heE9wdGlvbnM6IGZhbHNlLFxyXG4gICAgbW9iaWxlOiBmYWxzZSxcclxuICAgIHNlbGVjdE9uVGFiOiBmYWxzZSxcclxuICAgIGRyb3Bkb3duQWxpZ25SaWdodDogZmFsc2UsXHJcbiAgICB3aW5kb3dQYWRkaW5nOiAwLFxyXG4gICAgdmlydHVhbFNjcm9sbDogNjAwLFxyXG4gICAgZGlzcGxheTogZmFsc2VcclxuICB9O1xyXG5cclxuICBpZiAodmVyc2lvbi5tYWpvciA9PT0gJzQnKSB7XHJcbiAgICBTZWxlY3RwaWNrZXIuREVGQVVMVFMuc3R5bGUgPSAnYnRuLWxpZ2h0JztcclxuICAgIFNlbGVjdHBpY2tlci5ERUZBVUxUUy5pY29uQmFzZSA9ICcnO1xyXG4gICAgU2VsZWN0cGlja2VyLkRFRkFVTFRTLnRpY2tJY29uID0gJ2JzLW9rLWRlZmF1bHQnO1xyXG4gIH1cclxuXHJcbiAgU2VsZWN0cGlja2VyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogU2VsZWN0cGlja2VyLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgaWQgPSB0aGlzLiRlbGVtZW50LmF0dHIoJ2lkJyk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdElkID0gc2VsZWN0SWQrKztcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2JzLXNlbGVjdC1oaWRkZW4nKTtcclxuXHJcbiAgICAgIHRoaXMubXVsdGlwbGUgPSB0aGlzLiRlbGVtZW50LnByb3AoJ211bHRpcGxlJyk7XHJcbiAgICAgIHRoaXMuYXV0b2ZvY3VzID0gdGhpcy4kZWxlbWVudC5wcm9wKCdhdXRvZm9jdXMnKTtcclxuICAgICAgdGhpcy4kbmV3RWxlbWVudCA9IHRoaXMuY3JlYXRlRHJvcGRvd24oKTtcclxuICAgICAgdGhpcy5jcmVhdGVMaSgpO1xyXG4gICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgLmFmdGVyKHRoaXMuJG5ld0VsZW1lbnQpXHJcbiAgICAgICAgLnByZXBlbmRUbyh0aGlzLiRuZXdFbGVtZW50KTtcclxuICAgICAgdGhpcy4kYnV0dG9uID0gdGhpcy4kbmV3RWxlbWVudC5jaGlsZHJlbignYnV0dG9uJyk7XHJcbiAgICAgIHRoaXMuJG1lbnUgPSB0aGlzLiRuZXdFbGVtZW50LmNoaWxkcmVuKFNlbGVjdG9yLk1FTlUpO1xyXG4gICAgICB0aGlzLiRtZW51SW5uZXIgPSB0aGlzLiRtZW51LmNoaWxkcmVuKCcuaW5uZXInKTtcclxuICAgICAgdGhpcy4kc2VhcmNoYm94ID0gdGhpcy4kbWVudS5maW5kKCdpbnB1dCcpO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnYnMtc2VsZWN0LWhpZGRlbicpO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcm9wZG93bkFsaWduUmlnaHQgPT09IHRydWUpIHRoaXMuJG1lbnUuYWRkQ2xhc3MoY2xhc3NOYW1lcy5NRU5VUklHSFQpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLiRidXR0b24uYXR0cignZGF0YS1pZCcsIGlkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jaGVja0Rpc2FibGVkKCk7XHJcbiAgICAgIHRoaXMuY2xpY2tMaXN0ZW5lcigpO1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxpdmVTZWFyY2gpIHRoaXMubGl2ZVNlYXJjaExpc3RlbmVyKCk7XHJcbiAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgIHRoaXMuc2V0U3R5bGUoKTtcclxuICAgICAgdGhpcy5zZXRXaWR0aCgpO1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0UG9zaXRpb24oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdoaWRlJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKHRoYXQuaXNWaXJ0dWFsKCkpIHtcclxuICAgICAgICAgICAgLy8gZW1wdHkgbWVudSBvbiBjbG9zZVxyXG4gICAgICAgICAgICB2YXIgbWVudUlubmVyID0gdGhhdC4kbWVudUlubmVyWzBdLFxyXG4gICAgICAgICAgICAgICAgZW1wdHlNZW51ID0gbWVudUlubmVyLmZpcnN0Q2hpbGQuY2xvbmVOb2RlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGV4aXN0aW5nIFVMIHdpdGggYW4gZW1wdHkgb25lIC0gdGhpcyBpcyBmYXN0ZXIgdGhhbiAkLmVtcHR5KCkgb3IgaW5uZXJIVE1MID0gJydcclxuICAgICAgICAgICAgbWVudUlubmVyLnJlcGxhY2VDaGlsZChlbXB0eU1lbnUsIG1lbnVJbm5lci5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgbWVudUlubmVyLnNjcm9sbFRvcCA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4kbWVudS5kYXRhKCd0aGlzJywgdGhpcyk7XHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQuZGF0YSgndGhpcycsIHRoaXMpO1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1vYmlsZSkgdGhpcy5tb2JpbGUoKTtcclxuXHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQub24oe1xyXG4gICAgICAgICdoaWRlLmJzLmRyb3Bkb3duJzogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRlJyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaGlkZGVuLmJzLmRyb3Bkb3duJzogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuJyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnc2hvdy5icy5kcm9wZG93bic6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB0aGF0LiRtZW51SW5uZXIuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93JyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnc2hvd24uYnMuZHJvcGRvd24nOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93bicgKyBFVkVOVF9LRVksIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAodGhhdC4kZWxlbWVudFswXS5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdpbnZhbGlkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdGhhdC4kYnV0dG9uLmFkZENsYXNzKCdicy1pbnZhbGlkJyk7XHJcblxyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudFxyXG4gICAgICAgICAgICAub24oJ3Nob3duJyArIEVWRU5UX0tFWSArICcuaW52YWxpZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAudmFsKHRoYXQuJGVsZW1lbnQudmFsKCkpIC8vIHNldCB0aGUgdmFsdWUgdG8gaGlkZSB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlIGluIENocm9tZSB3aGVuIG1lbnUgaXMgb3BlbmVkXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdzaG93bicgKyBFVkVOVF9LRVkgKyAnLmludmFsaWQnKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdyZW5kZXJlZCcgKyBFVkVOVF9LRVksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAvLyBpZiBzZWxlY3QgaXMgbm8gbG9uZ2VyIGludmFsaWQsIHJlbW92ZSB0aGUgYnMtaW52YWxpZCBjbGFzc1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnZhbGlkaXR5LnZhbGlkKSB0aGF0LiRidXR0b24ucmVtb3ZlQ2xhc3MoJ2JzLWludmFsaWQnKTtcclxuICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50Lm9mZigncmVuZGVyZWQnICsgRVZFTlRfS0VZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhhdC4kYnV0dG9uLm9uKCdibHVyJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LmZvY3VzKCkuYmx1cigpO1xyXG4gICAgICAgICAgICB0aGF0LiRidXR0b24ub2ZmKCdibHVyJyArIEVWRU5UX0tFWSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQnICsgRVZFTlRfS0VZKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZURyb3Bkb3duOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIE9wdGlvbnNcclxuICAgICAgLy8gSWYgd2UgYXJlIG11bHRpcGxlIG9yIHNob3dUaWNrIG9wdGlvbiBpcyBzZXQsIHRoZW4gYWRkIHRoZSBzaG93LXRpY2sgY2xhc3NcclxuICAgICAgdmFyIHNob3dUaWNrID0gKHRoaXMubXVsdGlwbGUgfHwgdGhpcy5vcHRpb25zLnNob3dUaWNrKSA/ICcgc2hvdy10aWNrJyA6ICcnLFxyXG4gICAgICAgICAgYXV0b2ZvY3VzID0gdGhpcy5hdXRvZm9jdXMgPyAnIGF1dG9mb2N1cycgOiAnJztcclxuXHJcbiAgICAgIC8vIEVsZW1lbnRzXHJcbiAgICAgIHZhciBkcm9wLFxyXG4gICAgICAgICAgaGVhZGVyID0gJycsXHJcbiAgICAgICAgICBzZWFyY2hib3ggPSAnJyxcclxuICAgICAgICAgIGFjdGlvbnNib3ggPSAnJyxcclxuICAgICAgICAgIGRvbmVidXR0b24gPSAnJztcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyID1cclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiJyArIGNsYXNzTmFtZXMuUE9QT1ZFUkhFQURFUiArICdcIj4nICtcclxuICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9idXR0b24+JyArXHJcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlciArXHJcbiAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgc2VhcmNoYm94ID1cclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnMtc2VhcmNoYm94XCI+JyArXHJcbiAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiJyArXHJcbiAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxpdmVTZWFyY2hQbGFjZWhvbGRlciA9PT0gbnVsbCA/ICcnXHJcbiAgICAgICAgICAgICAgICA6XHJcbiAgICAgICAgICAgICAgICAnIHBsYWNlaG9sZGVyPVwiJyArIGh0bWxFc2NhcGUodGhpcy5vcHRpb25zLmxpdmVTZWFyY2hQbGFjZWhvbGRlcikgKyAnXCInXHJcbiAgICAgICAgICAgICAgKSArXHJcbiAgICAgICAgICAgICAgJyByb2xlPVwidGV4dGJveFwiIGFyaWEtbGFiZWw9XCJTZWFyY2hcIj4nICtcclxuICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLm9wdGlvbnMuYWN0aW9uc0JveCkge1xyXG4gICAgICAgIGFjdGlvbnNib3ggPVxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJicy1hY3Rpb25zYm94XCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBidG4tYmxvY2tcIj4nICtcclxuICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJhY3Rpb25zLWJ0biBicy1zZWxlY3QtYWxsIGJ0biAnICsgY2xhc3NOYW1lcy5CVVRUT05DTEFTUyArICdcIj4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZWxlY3RBbGxUZXh0ICtcclxuICAgICAgICAgICAgICAnPC9idXR0b24+JyArXHJcbiAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYWN0aW9ucy1idG4gYnMtZGVzZWxlY3QtYWxsIGJ0biAnICsgY2xhc3NOYW1lcy5CVVRUT05DTEFTUyArICdcIj4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZXNlbGVjdEFsbFRleHQgK1xyXG4gICAgICAgICAgICAgICc8L2J1dHRvbj4nICtcclxuICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlICYmIHRoaXMub3B0aW9ucy5kb25lQnV0dG9uKSB7XHJcbiAgICAgICAgZG9uZWJ1dHRvbiA9XHJcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImJzLWRvbmVidXR0b25cIj4nICtcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWJsb2NrXCI+JyArXHJcbiAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zbSAnICsgY2xhc3NOYW1lcy5CVVRUT05DTEFTUyArICdcIj4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kb25lQnV0dG9uVGV4dCArXHJcbiAgICAgICAgICAgICAgJzwvYnV0dG9uPicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgfVxyXG5cclxuICAgICAgZHJvcCA9XHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJkcm9wZG93biBib290c3RyYXAtc2VsZWN0JyArIHNob3dUaWNrICsgJ1wiPicgK1xyXG4gICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJyArIHRoaXMub3B0aW9ucy5zdHlsZUJhc2UgKyAnIGRyb3Bkb3duLXRvZ2dsZVwiICcgKyAodGhpcy5vcHRpb25zLmRpc3BsYXkgPT09ICdzdGF0aWMnID8gJ2RhdGEtZGlzcGxheT1cInN0YXRpY1wiJyA6ICcnKSArICdkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCInICsgYXV0b2ZvY3VzICsgJyByb2xlPVwiYnV0dG9uXCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmlsdGVyLW9wdGlvblwiPicgK1xyXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmlsdGVyLW9wdGlvbi1pbm5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaWx0ZXItb3B0aW9uLWlubmVyLWlubmVyXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgJzwvZGl2PiAnICtcclxuICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgdmVyc2lvbi5tYWpvciA9PT0gJzQnID8gJydcclxuICAgICAgICAgICAgICA6XHJcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiYnMtY2FyZXRcIj4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50ZW1wbGF0ZS5jYXJldCArXHJcbiAgICAgICAgICAgICAgJzwvc3Bhbj4nXHJcbiAgICAgICAgICAgICkgK1xyXG4gICAgICAgICAgJzwvYnV0dG9uPicgK1xyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCInICsgY2xhc3NOYW1lcy5NRU5VICsgJyAnICsgKHZlcnNpb24ubWFqb3IgPT09ICc0JyA/ICcnIDogY2xhc3NOYW1lcy5TSE9XKSArICdcIiByb2xlPVwiY29tYm9ib3hcIj4nICtcclxuICAgICAgICAgICAgaGVhZGVyICtcclxuICAgICAgICAgICAgc2VhcmNoYm94ICtcclxuICAgICAgICAgICAgYWN0aW9uc2JveCArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5uZXIgJyArIGNsYXNzTmFtZXMuU0hPVyArICdcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIHRhYmluZGV4PVwiLTFcIj4nICtcclxuICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCInICsgY2xhc3NOYW1lcy5NRU5VICsgJyBpbm5lciAnICsgKHZlcnNpb24ubWFqb3IgPT09ICc0JyA/IGNsYXNzTmFtZXMuU0hPVyA6ICcnKSArICdcIj4nICtcclxuICAgICAgICAgICAgICAgICc8L3VsPicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgIGRvbmVidXR0b24gK1xyXG4gICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICc8L2Rpdj4nO1xyXG5cclxuICAgICAgcmV0dXJuICQoZHJvcCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFBvc2l0aW9uRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodCA9IFtdO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbGkgPSB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbaV0sXHJcbiAgICAgICAgICAgIGNhbkhpZ2hsaWdodCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChsaS50eXBlID09PSAnZGl2aWRlcicpIHtcclxuICAgICAgICAgIGNhbkhpZ2hsaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgbGkuaGVpZ2h0ID0gdGhpcy5zaXplSW5mby5kaXZpZGVySGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGkudHlwZSA9PT0gJ29wdGdyb3VwLWxhYmVsJykge1xyXG4gICAgICAgICAgY2FuSGlnaGxpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICBsaS5oZWlnaHQgPSB0aGlzLnNpemVJbmZvLmRyb3Bkb3duSGVhZGVySGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsaS5oZWlnaHQgPSB0aGlzLnNpemVJbmZvLmxpSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxpLmRpc2FibGVkKSBjYW5IaWdobGlnaHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQucHVzaChjYW5IaWdobGlnaHQpO1xyXG5cclxuICAgICAgICBsaS5wb3NpdGlvbiA9IChpID09PSAwID8gMCA6IHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpIC0gMV0ucG9zaXRpb24pICsgbGkuaGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGlzVmlydHVhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMub3B0aW9ucy52aXJ0dWFsU2Nyb2xsICE9PSBmYWxzZSkgJiYgKHRoaXMuc2VsZWN0cGlja2VyLm1haW4uZWxlbWVudHMubGVuZ3RoID49IHRoaXMub3B0aW9ucy52aXJ0dWFsU2Nyb2xsKSB8fCB0aGlzLm9wdGlvbnMudmlydHVhbFNjcm9sbCA9PT0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlVmlldzogZnVuY3Rpb24gKGlzU2VhcmNoaW5nLCBzY3JvbGxUb3ApIHtcclxuICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wIHx8IDA7XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50ID0gaXNTZWFyY2hpbmcgPyB0aGlzLnNlbGVjdHBpY2tlci5zZWFyY2ggOiB0aGlzLnNlbGVjdHBpY2tlci5tYWluO1xyXG5cclxuICAgICAgdmFyIGFjdGl2ZSA9IFtdO1xyXG4gICAgICB2YXIgc2VsZWN0ZWQ7XHJcbiAgICAgIHZhciBwcmV2QWN0aXZlO1xyXG5cclxuICAgICAgdGhpcy5zZXRQb3NpdGlvbkRhdGEoKTtcclxuXHJcbiAgICAgIHNjcm9sbChzY3JvbGxUb3AsIHRydWUpO1xyXG5cclxuICAgICAgdGhpcy4kbWVudUlubmVyLm9mZignc2Nyb2xsLmNyZWF0ZVZpZXcnKS5vbignc2Nyb2xsLmNyZWF0ZVZpZXcnLCBmdW5jdGlvbiAoZSwgdXBkYXRlVmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoYXQubm9TY3JvbGwpIHNjcm9sbCh0aGlzLnNjcm9sbFRvcCwgdXBkYXRlVmFsdWUpO1xyXG4gICAgICAgIHRoYXQubm9TY3JvbGwgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzY3JvbGwgKHNjcm9sbFRvcCwgaW5pdCkge1xyXG4gICAgICAgIHZhciBzaXplID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGNodW5rcyA9IFtdLFxyXG4gICAgICAgICAgICBjaHVua1NpemUsXHJcbiAgICAgICAgICAgIGNodW5rQ291bnQsXHJcbiAgICAgICAgICAgIGZpcnN0Q2h1bmssXHJcbiAgICAgICAgICAgIGxhc3RDaHVuayxcclxuICAgICAgICAgICAgY3VycmVudENodW5rLFxyXG4gICAgICAgICAgICBwcmV2UG9zaXRpb25zLFxyXG4gICAgICAgICAgICBwb3NpdGlvbklzRGlmZmVyZW50LFxyXG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRzLFxyXG4gICAgICAgICAgICBtZW51SXNEaWZmZXJlbnQgPSB0cnVlLFxyXG4gICAgICAgICAgICBpc1ZpcnR1YWwgPSB0aGF0LmlzVmlydHVhbCgpO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcclxuXHJcbiAgICAgICAgaWYgKGlzVmlydHVhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgLy8gaWYgYW4gb3B0aW9uIHRoYXQgaXMgZW5jb3VudGVyZWQgdGhhdCBpcyB3aWRlciB0aGFuIHRoZSBjdXJyZW50IG1lbnUgd2lkdGgsIHVwZGF0ZSB0aGUgbWVudSB3aWR0aCBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgaWYgKHRoYXQuc2l6ZUluZm8uaGFzU2Nyb2xsQmFyICYmIHRoYXQuJG1lbnVbMF0ub2Zmc2V0V2lkdGggPiB0aGF0LnNpemVJbmZvLnRvdGFsTWVudVdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoID0gdGhhdC4kbWVudVswXS5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgdGhhdC5zaXplSW5mby50b3RhbE1lbnVXaWR0aCA9IHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoICsgdGhhdC5zaXplSW5mby5zY3JvbGxCYXJXaWR0aDtcclxuICAgICAgICAgICAgdGhhdC4kbWVudS5jc3MoJ21pbi13aWR0aCcsIHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNodW5rU2l6ZSA9IE1hdGguY2VpbCh0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodCAvIHRoYXQuc2l6ZUluZm8ubGlIZWlnaHQgKiAxLjUpOyAvLyBudW1iZXIgb2Ygb3B0aW9ucyBpbiBhIGNodW5rXHJcbiAgICAgICAgY2h1bmtDb3VudCA9IE1hdGgucm91bmQoc2l6ZSAvIGNodW5rU2l6ZSkgfHwgMTsgLy8gbnVtYmVyIG9mIGNodW5rc1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgdmFyIGVuZE9mQ2h1bmsgPSAoaSArIDEpICogY2h1bmtTaXplO1xyXG5cclxuICAgICAgICAgIGlmIChpID09PSBjaHVua0NvdW50IC0gMSkge1xyXG4gICAgICAgICAgICBlbmRPZkNodW5rID0gc2l6ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjaHVua3NbaV0gPSBbXHJcbiAgICAgICAgICAgIChpKSAqIGNodW5rU2l6ZSArICghaSA/IDAgOiAxKSxcclxuICAgICAgICAgICAgZW5kT2ZDaHVua1xyXG4gICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICBpZiAoIXNpemUpIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGlmIChjdXJyZW50Q2h1bmsgPT09IHVuZGVmaW5lZCAmJiBzY3JvbGxUb3AgPD0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2VuZE9mQ2h1bmsgLSAxXS5wb3NpdGlvbiAtIHRoYXQuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDaHVuayA9IGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudENodW5rID09PSB1bmRlZmluZWQpIGN1cnJlbnRDaHVuayA9IDA7XHJcblxyXG4gICAgICAgIHByZXZQb3NpdGlvbnMgPSBbdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjAsIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24xXTtcclxuXHJcbiAgICAgICAgLy8gYWx3YXlzIGRpc3BsYXkgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGNodW5rc1xyXG4gICAgICAgIGZpcnN0Q2h1bmsgPSBNYXRoLm1heCgwLCBjdXJyZW50Q2h1bmsgLSAxKTtcclxuICAgICAgICBsYXN0Q2h1bmsgPSBNYXRoLm1pbihjaHVua0NvdW50IC0gMSwgY3VycmVudENodW5rICsgMSk7XHJcblxyXG4gICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wID0gTWF0aC5tYXgoMCwgY2h1bmtzW2ZpcnN0Q2h1bmtdWzBdKSB8fCAwO1xyXG4gICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24xID0gTWF0aC5taW4oc2l6ZSwgY2h1bmtzW2xhc3RDaHVua11bMV0pIHx8IDA7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uSXNEaWZmZXJlbnQgPSBwcmV2UG9zaXRpb25zWzBdICE9PSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCB8fCBwcmV2UG9zaXRpb25zWzFdICE9PSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMTtcclxuXHJcbiAgICAgICAgaWYgKHRoYXQuYWN0aXZlSW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcHJldkFjdGl2ZSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHNbdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5tYXAubmV3SW5kZXhbdGhhdC5wcmV2QWN0aXZlSW5kZXhdXTtcclxuICAgICAgICAgIGFjdGl2ZSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHNbdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5tYXAubmV3SW5kZXhbdGhhdC5hY3RpdmVJbmRleF1dO1xyXG4gICAgICAgICAgc2VsZWN0ZWQgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzW3RoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQubWFwLm5ld0luZGV4W3RoYXQuc2VsZWN0ZWRJbmRleF1dO1xyXG5cclxuICAgICAgICAgIGlmIChpbml0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGF0LmFjdGl2ZUluZGV4ICE9PSB0aGF0LnNlbGVjdGVkSW5kZXgpIHtcclxuICAgICAgICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgaWYgKGFjdGl2ZS5maXJzdENoaWxkKSBhY3RpdmUuZmlyc3RDaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmFjdGl2ZUluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGF0LmFjdGl2ZUluZGV4ICYmIHRoYXQuYWN0aXZlSW5kZXggIT09IHRoYXQuc2VsZWN0ZWRJbmRleCAmJiBzZWxlY3RlZCAmJiBzZWxlY3RlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZC5maXJzdENoaWxkKSBzZWxlY3RlZC5maXJzdENoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoYXQucHJldkFjdGl2ZUluZGV4ICE9PSB1bmRlZmluZWQgJiYgdGhhdC5wcmV2QWN0aXZlSW5kZXggIT09IHRoYXQuYWN0aXZlSW5kZXggJiYgdGhhdC5wcmV2QWN0aXZlSW5kZXggIT09IHRoYXQuc2VsZWN0ZWRJbmRleCAmJiBwcmV2QWN0aXZlICYmIHByZXZBY3RpdmUubGVuZ3RoKSB7XHJcbiAgICAgICAgICBwcmV2QWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgaWYgKHByZXZBY3RpdmUuZmlyc3RDaGlsZCkgcHJldkFjdGl2ZS5maXJzdENoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluaXQgfHwgcG9zaXRpb25Jc0RpZmZlcmVudCkge1xyXG4gICAgICAgICAgcHJldmlvdXNFbGVtZW50cyA9IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzID8gdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMuc2xpY2UoKSA6IFtdO1xyXG5cclxuICAgICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5zbGljZSh0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCwgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjEpO1xyXG5cclxuICAgICAgICAgIHRoYXQuc2V0T3B0aW9uU3RhdHVzKCk7XHJcblxyXG4gICAgICAgICAgLy8gaWYgc2VhcmNoaW5nLCBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGxpc3QgaGFzIGFjdHVhbGx5IGJlZW4gdXBkYXRlZCBiZWZvcmUgdXBkYXRpbmcgRE9NXHJcbiAgICAgICAgICAvLyB0aGlzIHByZXZlbnRzIHVubmVjZXNzYXJ5IHJlcGFpbnRzXHJcbiAgICAgICAgICBpZiAoaXNTZWFyY2hpbmcgfHwgKGlzVmlydHVhbCA9PT0gZmFsc2UgJiYgaW5pdCkpIG1lbnVJc0RpZmZlcmVudCA9ICFpc0VxdWFsKHByZXZpb3VzRWxlbWVudHMsIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAvLyBpZiB2aXJ0dWFsIHNjcm9sbCBpcyBkaXNhYmxlZCBhbmQgbm90IHNlYXJjaGluZyxcclxuICAgICAgICAgIC8vIG1lbnUgc2hvdWxkIG5ldmVyIG5lZWQgdG8gYmUgdXBkYXRlZCBtb3JlIHRoYW4gb25jZVxyXG4gICAgICAgICAgaWYgKChpbml0IHx8IGlzVmlydHVhbCA9PT0gdHJ1ZSkgJiYgbWVudUlzRGlmZmVyZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBtZW51SW5uZXIgPSB0aGF0LiRtZW51SW5uZXJbMF0sXHJcbiAgICAgICAgICAgICAgICBtZW51RnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgICBlbXB0eU1lbnUgPSBtZW51SW5uZXIuZmlyc3RDaGlsZC5jbG9uZU5vZGUoZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wLFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tLFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBpc1ZpcnR1YWwgPT09IHRydWUgPyB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnZpc2libGVFbGVtZW50cyA6IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHM7XHJcblxyXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBleGlzdGluZyBVTCB3aXRoIGFuIGVtcHR5IG9uZSAtIHRoaXMgaXMgZmFzdGVyIHRoYW4gJC5lbXB0eSgpXHJcbiAgICAgICAgICAgIG1lbnVJbm5lci5yZXBsYWNlQ2hpbGQoZW1wdHlNZW51LCBtZW51SW5uZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgdmlzaWJsZUVsZW1lbnRzTGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgdmlzaWJsZUVsZW1lbnRzTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICBtZW51RnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXJ0dWFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgbWFyZ2luVG9wID0gKHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wID09PSAwID8gMCA6IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVt0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCAtIDFdLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSAodGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjEgPiBzaXplIC0gMSA/IDAgOiB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbc2l6ZSAtIDFdLnBvc2l0aW9uIC0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW3RoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24xIC0gMV0ucG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICBtZW51SW5uZXIuZmlyc3RDaGlsZC5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3AgKyAncHgnO1xyXG4gICAgICAgICAgICAgIG1lbnVJbm5lci5maXJzdENoaWxkLnN0eWxlLm1hcmdpbkJvdHRvbSA9IG1hcmdpbkJvdHRvbSArICdweCc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1lbnVJbm5lci5maXJzdENoaWxkLmFwcGVuZENoaWxkKG1lbnVGcmFnbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGF0LnByZXZBY3RpdmVJbmRleCA9IHRoYXQuYWN0aXZlSW5kZXg7XHJcblxyXG4gICAgICAgIGlmICghdGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci5mb2N1cygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNTZWFyY2hpbmcgJiYgaW5pdCkge1xyXG4gICAgICAgICAgdmFyIGluZGV4ID0gMCxcclxuICAgICAgICAgICAgICBuZXdBY3RpdmU7XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0LnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodFtpbmRleF0pIHtcclxuICAgICAgICAgICAgaW5kZXggPSAxICsgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQuc2xpY2UoMSkuaW5kZXhPZih0cnVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBuZXdBY3RpdmUgPSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnZpc2libGVFbGVtZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgICAgaWYgKHRoYXQuc2VsZWN0cGlja2VyLnZpZXcuY3VycmVudEFjdGl2ZSkge1xyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGF0LnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUuZmlyc3RDaGlsZCkgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jdXJyZW50QWN0aXZlLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG5ld0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBuZXdBY3RpdmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGlmIChuZXdBY3RpdmUuZmlyc3RDaGlsZCkgbmV3QWN0aXZlLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhhdC5hY3RpdmVJbmRleCA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQubWFwLm9yaWdpbmFsSW5kZXhbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgJCh3aW5kb3cpXHJcbiAgICAgICAgLm9mZigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnLmNyZWF0ZVZpZXcnKVxyXG4gICAgICAgIC5vbigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnLmNyZWF0ZVZpZXcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGF0LiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVyk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzQWN0aXZlKSBzY3JvbGwodGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZUxpOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgIG1haW5FbGVtZW50cyA9IFtdLFxyXG4gICAgICAgICAgaGlkZGVuT3B0aW9ucyA9IHt9LFxyXG4gICAgICAgICAgd2lkZXN0T3B0aW9uLFxyXG4gICAgICAgICAgYXZhaWxhYmxlT3B0aW9uc0NvdW50ID0gMCxcclxuICAgICAgICAgIHdpZGVzdE9wdGlvbkxlbmd0aCA9IDAsXHJcbiAgICAgICAgICBtYWluRGF0YSA9IFtdLFxyXG4gICAgICAgICAgb3B0SUQgPSAwLFxyXG4gICAgICAgICAgaGVhZGVySW5kZXggPSAwLFxyXG4gICAgICAgICAgbGlJbmRleCA9IC0xOyAvLyBpbmNyZW1lbnQgbGlJbmRleCB3aGVuZXZlciBhIG5ldyA8bGk+IGVsZW1lbnQgaXMgY3JlYXRlZCB0byBlbnN1cmUgbmV3SW5kZXggaXMgY29ycmVjdFxyXG5cclxuICAgICAgaWYgKCF0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uKSB0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcblxyXG4gICAgICB2YXIgZWxlbWVudFRlbXBsYXRlcyA9IHtcclxuICAgICAgICAgICAgc3BhbjogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxyXG4gICAgICAgICAgICBzdWJ0ZXh0OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbWFsbCcpLFxyXG4gICAgICAgICAgICBhOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXHJcbiAgICAgICAgICAgIGxpOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpLFxyXG4gICAgICAgICAgICB3aGl0ZXNwYWNlOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx1MDBBMCcpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tNYXJrLFxyXG4gICAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgICBpZiAodGhhdC5vcHRpb25zLnNob3dUaWNrIHx8IHRoYXQubXVsdGlwbGUpIHtcclxuICAgICAgICBjaGVja01hcmsgPSBlbGVtZW50VGVtcGxhdGVzLnNwYW4uY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgICAgICBjaGVja01hcmsuY2xhc3NOYW1lID0gdGhhdC5vcHRpb25zLmljb25CYXNlICsgJyAnICsgdGhhdC5vcHRpb25zLnRpY2tJY29uICsgJyBjaGVjay1tYXJrJztcclxuICAgICAgICBlbGVtZW50VGVtcGxhdGVzLmEuYXBwZW5kQ2hpbGQoY2hlY2tNYXJrKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudFRlbXBsYXRlcy5hLnNldEF0dHJpYnV0ZSgncm9sZScsICdvcHRpb24nKTtcclxuXHJcbiAgICAgIGVsZW1lbnRUZW1wbGF0ZXMuc3VidGV4dC5jbGFzc05hbWUgPSAndGV4dC1tdXRlZCc7XHJcblxyXG4gICAgICBlbGVtZW50VGVtcGxhdGVzLnRleHQgPSBlbGVtZW50VGVtcGxhdGVzLnNwYW4uY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgICAgZWxlbWVudFRlbXBsYXRlcy50ZXh0LmNsYXNzTmFtZSA9ICd0ZXh0JztcclxuXHJcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbnNcclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBwYXJhbSBjb250ZW50XHJcbiAgICAgICAqIEBwYXJhbSBbY2xhc3Nlc11cclxuICAgICAgICogQHBhcmFtIFtvcHRncm91cF1cclxuICAgICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIGdlbmVyYXRlTEkgPSBmdW5jdGlvbiAoY29udGVudCwgY2xhc3Nlcywgb3B0Z3JvdXApIHtcclxuICAgICAgICB2YXIgbGkgPSBlbGVtZW50VGVtcGxhdGVzLmxpLmNsb25lTm9kZShmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgICAgICBpZiAoY29udGVudC5ub2RlVHlwZSA9PT0gMSB8fCBjb250ZW50Lm5vZGVUeXBlID09PSAxMSkge1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNsYXNzZXMgIT09ICd1bmRlZmluZWQnICYmIGNsYXNzZXMgIT09ICcnKSBsaS5jbGFzc05hbWUgPSBjbGFzc2VzO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0Z3JvdXAgIT09ICd1bmRlZmluZWQnICYmIG9wdGdyb3VwICE9PSBudWxsKSBsaS5jbGFzc0xpc3QuYWRkKCdvcHRncm91cC0nICsgb3B0Z3JvdXApO1xyXG5cclxuICAgICAgICByZXR1cm4gbGk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQHBhcmFtIHRleHRcclxuICAgICAgICogQHBhcmFtIFtjbGFzc2VzXVxyXG4gICAgICAgKiBAcGFyYW0gW2lubGluZV1cclxuICAgICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAgICovXHJcbiAgICAgIHZhciBnZW5lcmF0ZUEgPSBmdW5jdGlvbiAodGV4dCwgY2xhc3NlcywgaW5saW5lKSB7XHJcbiAgICAgICAgdmFyIGEgPSBlbGVtZW50VGVtcGxhdGVzLmEuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCkge1xyXG4gICAgICAgICAgaWYgKHRleHQubm9kZVR5cGUgPT09IDExKSB7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGV4dCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNsYXNzZXMgIT09ICd1bmRlZmluZWQnICYmIGNsYXNzZXMgIT09ICcnKSBhLmNsYXNzTmFtZSA9IGNsYXNzZXM7XHJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPT09ICc0JykgYS5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bi1pdGVtJyk7XHJcbiAgICAgICAgaWYgKGlubGluZSkgYS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgaW5saW5lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgZ2VuZXJhdGVUZXh0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdGV4dEVsZW1lbnQgPSBlbGVtZW50VGVtcGxhdGVzLnRleHQuY2xvbmVOb2RlKGZhbHNlKSxcclxuICAgICAgICAgICAgb3B0aW9uU3VidGV4dEVsZW1lbnQsXHJcbiAgICAgICAgICAgIG9wdGlvbkljb25FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5vcHRpb25Db250ZW50KSB7XHJcbiAgICAgICAgICB0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBvcHRpb25zLm9wdGlvbkNvbnRlbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRleHRFbGVtZW50LnRleHRDb250ZW50ID0gb3B0aW9ucy50ZXh0O1xyXG5cclxuICAgICAgICAgIGlmIChvcHRpb25zLm9wdGlvbkljb24pIHtcclxuICAgICAgICAgICAgdmFyIHdoaXRlc3BhY2UgPSBlbGVtZW50VGVtcGxhdGVzLndoaXRlc3BhY2UuY2xvbmVOb2RlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbkljb25FbGVtZW50ID0gZWxlbWVudFRlbXBsYXRlcy5zcGFuLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgICAgIG9wdGlvbkljb25FbGVtZW50LmNsYXNzTmFtZSA9IHRoYXQub3B0aW9ucy5pY29uQmFzZSArICcgJyArIG9wdGlvbnMub3B0aW9uSWNvbjtcclxuXHJcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKG9wdGlvbkljb25FbGVtZW50KTtcclxuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQod2hpdGVzcGFjZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMub3B0aW9uU3VidGV4dCkge1xyXG4gICAgICAgICAgICBvcHRpb25TdWJ0ZXh0RWxlbWVudCA9IGVsZW1lbnRUZW1wbGF0ZXMuc3VidGV4dC5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgICAgICAgICBvcHRpb25TdWJ0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBvcHRpb25zLm9wdGlvblN1YnRleHQ7XHJcbiAgICAgICAgICAgIHRleHRFbGVtZW50LmFwcGVuZENoaWxkKG9wdGlvblN1YnRleHRFbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHRleHRFbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGdlbmVyYXRlTGFiZWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBsYWJlbFRleHRFbGVtZW50ID0gZWxlbWVudFRlbXBsYXRlcy50ZXh0LmNsb25lTm9kZShmYWxzZSksXHJcbiAgICAgICAgICAgIGxhYmVsU3VidGV4dEVsZW1lbnQsXHJcbiAgICAgICAgICAgIGxhYmVsSWNvbkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGxhYmVsVGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gb3B0aW9ucy5sYWJlbEVzY2FwZWQ7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLmxhYmVsSWNvbikge1xyXG4gICAgICAgICAgdmFyIHdoaXRlc3BhY2UgPSBlbGVtZW50VGVtcGxhdGVzLndoaXRlc3BhY2UuY2xvbmVOb2RlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICBsYWJlbEljb25FbGVtZW50ID0gZWxlbWVudFRlbXBsYXRlcy5zcGFuLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgICBsYWJlbEljb25FbGVtZW50LmNsYXNzTmFtZSA9IHRoYXQub3B0aW9ucy5pY29uQmFzZSArICcgJyArIG9wdGlvbnMubGFiZWxJY29uO1xyXG5cclxuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGxhYmVsSWNvbkVsZW1lbnQpO1xyXG4gICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQod2hpdGVzcGFjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5sYWJlbFN1YnRleHQpIHtcclxuICAgICAgICAgIGxhYmVsU3VidGV4dEVsZW1lbnQgPSBlbGVtZW50VGVtcGxhdGVzLnN1YnRleHQuY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgICAgICAgIGxhYmVsU3VidGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSBvcHRpb25zLmxhYmVsU3VidGV4dDtcclxuICAgICAgICAgIGxhYmVsVGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxTdWJ0ZXh0RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChsYWJlbFRleHRFbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlICYmICF0aGlzLm11bHRpcGxlKSB7XHJcbiAgICAgICAgLy8gdGhpcyBvcHRpb24gZG9lc24ndCBjcmVhdGUgYSBuZXcgPGxpPiBlbGVtZW50LCBidXQgZG9lcyBhZGQgYSBuZXcgb3B0aW9uLCBzbyBsaUluZGV4IGlzIGRlY3JlYXNlZFxyXG4gICAgICAgIC8vIHNpbmNlIG5ld0luZGV4IGlzIHJlY2FsY3VsYXRlZCBvbiBldmVyeSByZWZyZXNoLCBsaUluZGV4IG5lZWRzIHRvIGJlIGRlY3JlYXNlZCBldmVuIGlmIHRoZSB0aXRsZU9wdGlvbiBpcyBhbHJlYWR5IGFwcGVuZGVkXHJcbiAgICAgICAgbGlJbmRleC0tO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuJGVsZW1lbnRbMF0sXHJcbiAgICAgICAgICAgIGlzU2VsZWN0ZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgdGl0bGVOb3RBcHBlbmRlZCA9ICF0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uLnBhcmVudE5vZGU7XHJcblxyXG4gICAgICAgIGlmICh0aXRsZU5vdEFwcGVuZGVkKSB7XHJcbiAgICAgICAgICAvLyBVc2UgbmF0aXZlIEpTIHRvIHByZXBlbmQgb3B0aW9uIChmYXN0ZXIpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uLmNsYXNzTmFtZSA9ICdicy10aXRsZS1vcHRpb24nO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIudmlldy50aXRsZU9wdGlvbi52YWx1ZSA9ICcnO1xyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGlmIHNlbGVjdGVkIG9yIGRhdGEtc2VsZWN0ZWQgYXR0cmlidXRlIGlzIGFscmVhZHkgc2V0IG9uIGFuIG9wdGlvbi4gSWYgbm90LCBzZWxlY3QgdGhlIHRpdGxlT3B0aW9uIG9wdGlvbi5cclxuICAgICAgICAgIC8vIHRoZSBzZWxlY3RlZCBpdGVtIG1heSBoYXZlIGJlZW4gY2hhbmdlZCBieSB1c2VyIG9yIHByb2dyYW1tYXRpY2FsbHkgYmVmb3JlIHRoZSBib290c3RyYXAgc2VsZWN0IHBsdWdpbiBydW5zLFxyXG4gICAgICAgICAgLy8gaWYgc28sIHRoZSBzZWxlY3Qgd2lsbCBoYXZlIHRoZSBkYXRhLXNlbGVjdGVkIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgdmFyICRvcHQgPSAkKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKTtcclxuICAgICAgICAgIGlzU2VsZWN0ZWQgPSAkb3B0LmF0dHIoJ3NlbGVjdGVkJykgPT09IHVuZGVmaW5lZCAmJiB0aGlzLiRlbGVtZW50LmRhdGEoJ3NlbGVjdGVkJykgPT09IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aXRsZU5vdEFwcGVuZGVkIHx8IHRoaXMuc2VsZWN0cGlja2VyLnZpZXcudGl0bGVPcHRpb24uaW5kZXggIT09IDApIHtcclxuICAgICAgICAgIGVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMuc2VsZWN0cGlja2VyLnZpZXcudGl0bGVPcHRpb24sIGVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgc2VsZWN0ZWQgKmFmdGVyKiBhcHBlbmRpbmcgdG8gc2VsZWN0LFxyXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGUgb3B0aW9uIGRvZXNuJ3QgZ2V0IHNlbGVjdGVkIGluIElFXHJcbiAgICAgICAgLy8gc2V0IHVzaW5nIHNlbGVjdGVkSW5kZXgsIGFzIHNldHRpbmcgdGhlIHNlbGVjdGVkIGF0dHIgdG8gdHJ1ZSBoZXJlIGRvZXNuJ3Qgd29yayBpbiBJRTExXHJcbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciAkc2VsZWN0T3B0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJyk7XHJcblxyXG4gICAgICAkc2VsZWN0T3B0aW9ucy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIGxpSW5kZXgrKztcclxuXHJcbiAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKCdicy10aXRsZS1vcHRpb24nKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGhpc0RhdGEgPSAkdGhpcy5kYXRhKCk7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgY2xhc3MgYW5kIHRleHQgZm9yIHRoZSBvcHRpb25cclxuICAgICAgICB2YXIgb3B0aW9uQ2xhc3MgPSB0aGlzLmNsYXNzTmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgaW5saW5lID0gaHRtbEVzY2FwZSh0aGlzLnN0eWxlLmNzc1RleHQpLFxyXG4gICAgICAgICAgICBvcHRpb25Db250ZW50ID0gdGhpc0RhdGEuY29udGVudCxcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgIHRva2VucyA9IHRoaXNEYXRhLnRva2VucyxcclxuICAgICAgICAgICAgc3VidGV4dCA9IHRoaXNEYXRhLnN1YnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzRGF0YS5pY29uLFxyXG4gICAgICAgICAgICAkcGFyZW50ID0gJHRoaXMucGFyZW50KCksXHJcbiAgICAgICAgICAgIHBhcmVudCA9ICRwYXJlbnRbMF0sXHJcbiAgICAgICAgICAgIGlzT3B0Z3JvdXAgPSBwYXJlbnQudGFnTmFtZSA9PT0gJ09QVEdST1VQJyxcclxuICAgICAgICAgICAgaXNPcHRncm91cERpc2FibGVkID0gaXNPcHRncm91cCAmJiBwYXJlbnQuZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGlzRGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkIHx8IGlzT3B0Z3JvdXBEaXNhYmxlZCxcclxuICAgICAgICAgICAgcHJldkhpZGRlbkluZGV4LFxyXG4gICAgICAgICAgICBzaG93RGl2aWRlciA9IHRoaXMucHJldmlvdXNFbGVtZW50U2libGluZyAmJiB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcudGFnTmFtZSA9PT0gJ09QVEdST1VQJyxcclxuICAgICAgICAgICAgdGV4dEVsZW1lbnQsXHJcbiAgICAgICAgICAgIGxhYmVsRWxlbWVudCxcclxuICAgICAgICAgICAgcHJldkhpZGRlbjtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudERhdGEgPSAkcGFyZW50LmRhdGEoKTtcclxuXHJcbiAgICAgICAgaWYgKCh0aGlzRGF0YS5oaWRkZW4gPT09IHRydWUgfHwgdGhpcy5oaWRkZW4pIHx8ICh0aGF0Lm9wdGlvbnMuaGlkZURpc2FibGVkICYmIChpc0Rpc2FibGVkIHx8IGlzT3B0Z3JvdXBEaXNhYmxlZCkpKSB7XHJcbiAgICAgICAgICAvLyBzZXQgcHJldkhpZGRlbkluZGV4IC0gdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBoaWRkZW4gb3B0aW9uIGluIGEgZ3JvdXAgb2YgaGlkZGVuIG9wdGlvbnNcclxuICAgICAgICAgIC8vIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IGEgZGl2aWRlciBzaG91bGQgYmUgcGxhY2VkIGFmdGVyIGFuIG9wdGdyb3VwIGlmIHRoZXJlIGFyZVxyXG4gICAgICAgICAgLy8gaGlkZGVuIG9wdGlvbnMgYmV0d2VlbiB0aGUgb3B0Z3JvdXAgYW5kIHRoZSBmaXJzdCB2aXNpYmxlIG9wdGlvblxyXG4gICAgICAgICAgcHJldkhpZGRlbkluZGV4ID0gdGhpc0RhdGEucHJldkhpZGRlbkluZGV4O1xyXG4gICAgICAgICAgJHRoaXMubmV4dCgpLmRhdGEoJ3ByZXZIaWRkZW5JbmRleCcsIChwcmV2SGlkZGVuSW5kZXggIT09IHVuZGVmaW5lZCA/IHByZXZIaWRkZW5JbmRleCA6IGluZGV4KSk7XHJcblxyXG4gICAgICAgICAgbGlJbmRleC0tO1xyXG5cclxuICAgICAgICAgIGhpZGRlbk9wdGlvbnNbaW5kZXhdID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgZGF0YTogdGhpc0RhdGFcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBpZiBwcmV2aW91cyBlbGVtZW50IGlzIG5vdCBhbiBvcHRncm91cFxyXG4gICAgICAgICAgaWYgKCFzaG93RGl2aWRlcikge1xyXG4gICAgICAgICAgICBpZiAocHJldkhpZGRlbkluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAvLyBzZWxlY3QgdGhlIGVsZW1lbnQgKipiZWZvcmUqKiB0aGUgZmlyc3QgaGlkZGVuIGVsZW1lbnQgaW4gdGhlIGdyb3VwXHJcbiAgICAgICAgICAgICAgcHJldkhpZGRlbiA9ICRzZWxlY3RPcHRpb25zW3ByZXZIaWRkZW5JbmRleF0ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHByZXZIaWRkZW4gJiYgcHJldkhpZGRlbi50YWdOYW1lID09PSAnT1BUR1JPVVAnICYmICFwcmV2SGlkZGVuLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBzaG93RGl2aWRlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHNob3dEaXZpZGVyICYmIG1haW5EYXRhW21haW5EYXRhLmxlbmd0aCAtIDFdLnR5cGUgIT09ICdkaXZpZGVyJykge1xyXG4gICAgICAgICAgICBsaUluZGV4Kys7XHJcbiAgICAgICAgICAgIG1haW5FbGVtZW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgIGdlbmVyYXRlTEkoXHJcbiAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZXMuRElWSURFUixcclxuICAgICAgICAgICAgICAgIG9wdElEICsgJ2RpdidcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG1haW5EYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdkaXZpZGVyJyxcclxuICAgICAgICAgICAgICBvcHRJRDogb3B0SURcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzT3B0Z3JvdXAgJiYgdGhpc0RhdGEuZGl2aWRlciAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5oaWRlRGlzYWJsZWQgJiYgaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50RGF0YS5hbGxPcHRpb25zRGlzYWJsZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIHZhciAkb3B0aW9ucyA9ICRwYXJlbnQuY2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAkcGFyZW50LmRhdGEoJ2FsbE9wdGlvbnNEaXNhYmxlZCcsICRvcHRpb25zLmZpbHRlcignOmRpc2FibGVkJykubGVuZ3RoID09PSAkb3B0aW9ucy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJHBhcmVudC5kYXRhKCdhbGxPcHRpb25zRGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICAgIGxpSW5kZXgtLTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgb3B0R3JvdXBDbGFzcyA9ICcgJyArIHBhcmVudC5jbGFzc05hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgcHJldmlvdXNPcHRpb24gPSB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgcHJldkhpZGRlbkluZGV4ID0gdGhpc0RhdGEucHJldkhpZGRlbkluZGV4O1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2SGlkZGVuSW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwcmV2aW91c09wdGlvbiA9ICRzZWxlY3RPcHRpb25zW3ByZXZIaWRkZW5JbmRleF0ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIXByZXZpb3VzT3B0aW9uKSB7IC8vIElzIGl0IHRoZSBmaXJzdCBvcHRpb24gb2YgdGhlIG9wdGdyb3VwP1xyXG4gICAgICAgICAgICBvcHRJRCArPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBvcHQgZ3JvdXAgbGFiZWxcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gcGFyZW50LmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxFc2NhcGVkID0gaHRtbEVzY2FwZShsYWJlbCksXHJcbiAgICAgICAgICAgICAgICBsYWJlbFN1YnRleHQgPSBwYXJlbnREYXRhLnN1YnRleHQsXHJcbiAgICAgICAgICAgICAgICBsYWJlbEljb24gPSBwYXJlbnREYXRhLmljb247XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IDAgJiYgbWFpbkVsZW1lbnRzLmxlbmd0aCA+IDApIHsgLy8gSXMgaXQgTk9UIHRoZSBmaXJzdCBvcHRpb24gb2YgdGhlIHNlbGVjdCAmJiBhcmUgdGhlcmUgZWxlbWVudHMgaW4gdGhlIGRyb3Bkb3duP1xyXG4gICAgICAgICAgICAgIGxpSW5kZXgrKztcclxuICAgICAgICAgICAgICBtYWluRWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRlTEkoXHJcbiAgICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWVzLkRJVklERVIsXHJcbiAgICAgICAgICAgICAgICAgIG9wdElEICsgJ2RpdidcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIG1haW5EYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RpdmlkZXInLFxyXG4gICAgICAgICAgICAgICAgb3B0SUQ6IG9wdElEXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGlJbmRleCsrO1xyXG5cclxuICAgICAgICAgICAgbGFiZWxFbGVtZW50ID0gZ2VuZXJhdGVMYWJlbCh7XHJcbiAgICAgICAgICAgICAgbGFiZWxFc2NhcGVkOiBsYWJlbEVzY2FwZWQsXHJcbiAgICAgICAgICAgICAgbGFiZWxTdWJ0ZXh0OiBsYWJlbFN1YnRleHQsXHJcbiAgICAgICAgICAgICAgbGFiZWxJY29uOiBsYWJlbEljb25cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBtYWluRWxlbWVudHMucHVzaChnZW5lcmF0ZUxJKGxhYmVsRWxlbWVudCwgJ2Ryb3Bkb3duLWhlYWRlcicgKyBvcHRHcm91cENsYXNzLCBvcHRJRCkpO1xyXG4gICAgICAgICAgICBtYWluRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICBjb250ZW50OiBsYWJlbEVzY2FwZWQsXHJcbiAgICAgICAgICAgICAgc3VidGV4dDogbGFiZWxTdWJ0ZXh0LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdvcHRncm91cC1sYWJlbCcsXHJcbiAgICAgICAgICAgICAgb3B0SUQ6IG9wdElEXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaGVhZGVySW5kZXggPSBsaUluZGV4IC0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0ZXh0RWxlbWVudCA9IGdlbmVyYXRlVGV4dCh7XHJcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIG9wdGlvbkNvbnRlbnQ6IG9wdGlvbkNvbnRlbnQsXHJcbiAgICAgICAgICAgIG9wdGlvblN1YnRleHQ6IHN1YnRleHQsXHJcbiAgICAgICAgICAgIG9wdGlvbkljb246IGljb25cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIG1haW5FbGVtZW50cy5wdXNoKGdlbmVyYXRlTEkoZ2VuZXJhdGVBKHRleHRFbGVtZW50LCAnb3B0ICcgKyBvcHRpb25DbGFzcyArIG9wdEdyb3VwQ2xhc3MsIGlubGluZSksICcnLCBvcHRJRCkpO1xyXG4gICAgICAgICAgbWFpbkRhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IG9wdGlvbkNvbnRlbnQgfHwgdGV4dCxcclxuICAgICAgICAgICAgc3VidGV4dDogc3VidGV4dCxcclxuICAgICAgICAgICAgdG9rZW5zOiB0b2tlbnMsXHJcbiAgICAgICAgICAgIHR5cGU6ICdvcHRpb24nLFxyXG4gICAgICAgICAgICBvcHRJRDogb3B0SUQsXHJcbiAgICAgICAgICAgIGhlYWRlckluZGV4OiBoZWFkZXJJbmRleCxcclxuICAgICAgICAgICAgbGFzdEluZGV4OiBoZWFkZXJJbmRleCArIHBhcmVudC5jaGlsZEVsZW1lbnRDb3VudCxcclxuICAgICAgICAgICAgb3JpZ2luYWxJbmRleDogaW5kZXgsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXNEYXRhXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBhdmFpbGFibGVPcHRpb25zQ291bnQrKztcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXNEYXRhLmRpdmlkZXIgPT09IHRydWUpIHtcclxuICAgICAgICAgIG1haW5FbGVtZW50cy5wdXNoKGdlbmVyYXRlTEkoZmFsc2UsIGNsYXNzTmFtZXMuRElWSURFUikpO1xyXG4gICAgICAgICAgbWFpbkRhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdkaXZpZGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luYWxJbmRleDogaW5kZXgsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXNEYXRhXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gaWYgcHJldmlvdXMgZWxlbWVudCBpcyBub3QgYW4gb3B0Z3JvdXAgYW5kIGhpZGVEaXNhYmxlZCBpcyB0cnVlXHJcbiAgICAgICAgICBpZiAoIXNob3dEaXZpZGVyICYmIHRoYXQub3B0aW9ucy5oaWRlRGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcHJldkhpZGRlbkluZGV4ID0gdGhpc0RhdGEucHJldkhpZGRlbkluZGV4O1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXZIaWRkZW5JbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSBlbGVtZW50ICoqYmVmb3JlKiogdGhlIGZpcnN0IGhpZGRlbiBlbGVtZW50IGluIHRoZSBncm91cFxyXG4gICAgICAgICAgICAgIHByZXZIaWRkZW4gPSAkc2VsZWN0T3B0aW9uc1twcmV2SGlkZGVuSW5kZXhdLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcmV2SGlkZGVuICYmIHByZXZIaWRkZW4udGFnTmFtZSA9PT0gJ09QVEdST1VQJyAmJiAhcHJldkhpZGRlbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgc2hvd0RpdmlkZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzaG93RGl2aWRlciAmJiBtYWluRGF0YVttYWluRGF0YS5sZW5ndGggLSAxXS50eXBlICE9PSAnZGl2aWRlcicpIHtcclxuICAgICAgICAgICAgbGlJbmRleCsrO1xyXG4gICAgICAgICAgICBtYWluRWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICBnZW5lcmF0ZUxJKFxyXG4gICAgICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWVzLkRJVklERVIsXHJcbiAgICAgICAgICAgICAgICBvcHRJRCArICdkaXYnXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBtYWluRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICB0eXBlOiAnZGl2aWRlcicsXHJcbiAgICAgICAgICAgICAgb3B0SUQ6IG9wdElEXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRleHRFbGVtZW50ID0gZ2VuZXJhdGVUZXh0KHtcclxuICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgb3B0aW9uQ29udGVudDogb3B0aW9uQ29udGVudCxcclxuICAgICAgICAgICAgb3B0aW9uU3VidGV4dDogc3VidGV4dCxcclxuICAgICAgICAgICAgb3B0aW9uSWNvbjogaWNvblxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgbWFpbkVsZW1lbnRzLnB1c2goZ2VuZXJhdGVMSShnZW5lcmF0ZUEodGV4dEVsZW1lbnQsIG9wdGlvbkNsYXNzLCBpbmxpbmUpKSk7XHJcbiAgICAgICAgICBtYWluRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgY29udGVudDogb3B0aW9uQ29udGVudCB8fCB0ZXh0LFxyXG4gICAgICAgICAgICBzdWJ0ZXh0OiBzdWJ0ZXh0LFxyXG4gICAgICAgICAgICB0b2tlbnM6IHRva2VucyxcclxuICAgICAgICAgICAgdHlwZTogJ29wdGlvbicsXHJcbiAgICAgICAgICAgIG9yaWdpbmFsSW5kZXg6IGluZGV4LFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzRGF0YVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgYXZhaWxhYmxlT3B0aW9uc0NvdW50Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5tYWluLm1hcC5uZXdJbmRleFtpbmRleF0gPSBsaUluZGV4O1xyXG4gICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLm1haW4ubWFwLm9yaWdpbmFsSW5kZXhbbGlJbmRleF0gPSBpbmRleDtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBtb3N0IHJlY2VudCBvcHRpb24gaW5mbyBhZGRlZCB0byBtYWluRGF0YVxyXG4gICAgICAgIHZhciBfbWFpbkRhdGFMYXN0ID0gbWFpbkRhdGFbbWFpbkRhdGEubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIF9tYWluRGF0YUxhc3QuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG5cclxuICAgICAgICB2YXIgY29tYmluZWRMZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAvLyBjb3VudCB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gdGhlIG9wdGlvbiAtIG5vdCBwZXJmZWN0LCBidXQgc2hvdWxkIHdvcmsgaW4gbW9zdCBjYXNlc1xyXG4gICAgICAgIGlmIChfbWFpbkRhdGFMYXN0LmNvbnRlbnQpIGNvbWJpbmVkTGVuZ3RoICs9IF9tYWluRGF0YUxhc3QuY29udGVudC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKF9tYWluRGF0YUxhc3Quc3VidGV4dCkgY29tYmluZWRMZW5ndGggKz0gX21haW5EYXRhTGFzdC5zdWJ0ZXh0Lmxlbmd0aDtcclxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbiBpY29uLCBlbnN1cmUgdGhpcyBvcHRpb24ncyB3aWR0aCBpcyBjaGVja2VkXHJcbiAgICAgICAgaWYgKGljb24pIGNvbWJpbmVkTGVuZ3RoICs9IDE7XHJcblxyXG4gICAgICAgIGlmIChjb21iaW5lZExlbmd0aCA+IHdpZGVzdE9wdGlvbkxlbmd0aCkge1xyXG4gICAgICAgICAgd2lkZXN0T3B0aW9uTGVuZ3RoID0gY29tYmluZWRMZW5ndGg7XHJcblxyXG4gICAgICAgICAgLy8gZ3Vlc3Mgd2hpY2ggb3B0aW9uIGlzIHRoZSB3aWRlc3RcclxuICAgICAgICAgIC8vIHVzZSB0aGlzIHdoZW4gY2FsY3VsYXRpbmcgbWVudSB3aWR0aFxyXG4gICAgICAgICAgLy8gbm90IHBlcmZlY3QsIGJ1dCBpdCdzIGZhc3QsIGFuZCB0aGUgd2lkdGggd2lsbCBiZSB1cGRhdGluZyBhY2NvcmRpbmdseSB3aGVuIHNjcm9sbGluZ1xyXG4gICAgICAgICAgd2lkZXN0T3B0aW9uID0gbWFpbkVsZW1lbnRzW21haW5FbGVtZW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50cyA9IG1haW5FbGVtZW50cztcclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5kYXRhID0gbWFpbkRhdGE7XHJcbiAgICAgIHRoaXMuc2VsZWN0cGlja2VyLm1haW4uaGlkZGVuID0gaGlkZGVuT3B0aW9ucztcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQgPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIudmlldy53aWRlc3RPcHRpb24gPSB3aWRlc3RPcHRpb247XHJcbiAgICAgIHRoaXMuc2VsZWN0cGlja2VyLnZpZXcuYXZhaWxhYmxlT3B0aW9uc0NvdW50ID0gYXZhaWxhYmxlT3B0aW9uc0NvdW50OyAvLyBmYXN0ZXIgd2F5IHRvIGdldCAjIG9mIGF2YWlsYWJsZSBvcHRpb25zIHdpdGhvdXQgZmlsdGVyXHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRMaXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJG1lbnVJbm5lci5maW5kKCcuaW5uZXIgPiBsaScpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgJHNlbGVjdE9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IFtdLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtc0luVGl0bGUgPSBbXTtcclxuXHJcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoKTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXgoKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuID0gJHNlbGVjdE9wdGlvbnMubGVuZ3RoOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgIHZhciBpID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5tYXAubmV3SW5kZXhbaW5kZXhdLFxyXG4gICAgICAgICAgICBvcHRpb24gPSAkc2VsZWN0T3B0aW9uc1tpbmRleF0sXHJcbiAgICAgICAgICAgIG9wdGlvbkRhdGEgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmRhdGFbaV0gfHwgdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5oaWRkZW5baW5kZXhdO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9uICYmIG9wdGlvbi5zZWxlY3RlZCAmJiBvcHRpb25EYXRhKSB7XHJcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zLnB1c2gob3B0aW9uKTtcclxuXHJcbiAgICAgICAgICBpZiAoKHNlbGVjdGVkSXRlbXNJblRpdGxlLmxlbmd0aCA8IDEwMCAmJiB0aGF0Lm9wdGlvbnMuc2VsZWN0ZWRUZXh0Rm9ybWF0ICE9PSAnY291bnQnKSB8fCBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0RhdGEgPSBvcHRpb25EYXRhLmRhdGEsXHJcbiAgICAgICAgICAgICAgICBpY29uID0gdGhpc0RhdGEuaWNvbiAmJiB0aGF0Lm9wdGlvbnMuc2hvd0ljb24gPyAnPGkgY2xhc3M9XCInICsgdGhhdC5vcHRpb25zLmljb25CYXNlICsgJyAnICsgdGhpc0RhdGEuaWNvbiArICdcIj48L2k+ICcgOiAnJyxcclxuICAgICAgICAgICAgICAgIHN1YnRleHQsXHJcbiAgICAgICAgICAgICAgICB0aXRsZUl0ZW07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNob3dTdWJ0ZXh0ICYmIHRoaXNEYXRhLnN1YnRleHQgJiYgIXRoYXQubXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgICBzdWJ0ZXh0ID0gJyA8c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+JyArIHRoaXNEYXRhLnN1YnRleHQgKyAnPC9zbWFsbD4nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHN1YnRleHQgPSAnJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbi50aXRsZSkge1xyXG4gICAgICAgICAgICAgIHRpdGxlSXRlbSA9IG9wdGlvbi50aXRsZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzRGF0YS5jb250ZW50ICYmIHRoYXQub3B0aW9ucy5zaG93Q29udGVudCkge1xyXG4gICAgICAgICAgICAgIHRpdGxlSXRlbSA9IHRoaXNEYXRhLmNvbnRlbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aXRsZUl0ZW0gPSBpY29uICsgb3B0aW9uLmlubmVySFRNTC50cmltKCkgKyBzdWJ0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zSW5UaXRsZS5wdXNoKHRpdGxlSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGaXhlcyBpc3N1ZSBpbiBJRTEwIG9jY3VycmluZyB3aGVuIG5vIGRlZmF1bHQgb3B0aW9uIGlzIHNlbGVjdGVkIGFuZCBhdCBsZWFzdCBvbmUgb3B0aW9uIGlzIGRpc2FibGVkXHJcbiAgICAgIC8vIENvbnZlcnQgYWxsIHRoZSB2YWx1ZXMgaW50byBhIGNvbW1hIGRlbGltaXRlZCBzdHJpbmdcclxuICAgICAgdmFyIHRpdGxlID0gIXRoaXMubXVsdGlwbGUgPyBzZWxlY3RlZEl0ZW1zSW5UaXRsZVswXSA6IHNlbGVjdGVkSXRlbXNJblRpdGxlLmpvaW4odGhpcy5vcHRpb25zLm11bHRpcGxlU2VwYXJhdG9yKTtcclxuXHJcbiAgICAgIC8vIGFkZCBlbGxpcHNpc1xyXG4gICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiA1MCkgdGl0bGUgKz0gJy4uLic7XHJcblxyXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgbXVsdGlzZWxlY3QsIGFuZCBzZWxlY3RlZFRleHRGb3JtYXQgaXMgY291bnQsIHRoZW4gc2hvdyAxIG9mIDIgc2VsZWN0ZWQgZXRjLi5cclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dEZvcm1hdC5pbmRleE9mKCdjb3VudCcpICE9PSAtMSkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRUZXh0Rm9ybWF0LnNwbGl0KCc+Jyk7XHJcblxyXG4gICAgICAgIGlmICgobWF4Lmxlbmd0aCA+IDEgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiBtYXhbMV0pIHx8IChtYXgubGVuZ3RoID09PSAxICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoID49IDIpKSB7XHJcbiAgICAgICAgICB2YXIgdG90YWxDb3VudCA9IHRoaXMuc2VsZWN0cGlja2VyLnZpZXcuYXZhaWxhYmxlT3B0aW9uc0NvdW50LFxyXG4gICAgICAgICAgICAgIHRyOG5UZXh0ID0gKHR5cGVvZiB0aGlzLm9wdGlvbnMuY291bnRTZWxlY3RlZFRleHQgPT09ICdmdW5jdGlvbicpID8gdGhpcy5vcHRpb25zLmNvdW50U2VsZWN0ZWRUZXh0KHNlbGVjdGVkSXRlbXMubGVuZ3RoLCB0b3RhbENvdW50KSA6IHRoaXMub3B0aW9ucy5jb3VudFNlbGVjdGVkVGV4dDtcclxuXHJcbiAgICAgICAgICB0aXRsZSA9IHRyOG5UZXh0LnJlcGxhY2UoJ3swfScsIHNlbGVjdGVkSXRlbXMubGVuZ3RoLnRvU3RyaW5nKCkpLnJlcGxhY2UoJ3sxfScsIHRvdGFsQ291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIC8vIHVzZSAuYXR0ciB0byBlbnN1cmUgdW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIHRpdGxlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnRpdGxlID0gdGhpcy4kZWxlbWVudC5hdHRyKCd0aXRsZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dEZvcm1hdCA9PSAnc3RhdGljJykge1xyXG4gICAgICAgIHRpdGxlID0gdGhpcy5vcHRpb25zLnRpdGxlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB0aGUgc2VsZWN0IGRvZXNuJ3QgaGF2ZSBhIHRpdGxlLCB0aGVuIHVzZSB0aGUgZGVmYXVsdCwgb3IgaWYgbm90aGluZyBpcyBzZXQgYXQgYWxsLCB1c2Ugbm9uZVNlbGVjdGVkVGV4dFxyXG4gICAgICBpZiAoIXRpdGxlKSB7XHJcbiAgICAgICAgdGl0bGUgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnRpdGxlICE9PSAndW5kZWZpbmVkJyA/IHRoaXMub3B0aW9ucy50aXRsZSA6IHRoaXMub3B0aW9ucy5ub25lU2VsZWN0ZWRUZXh0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzdHJpcCBhbGwgSFRNTCB0YWdzIGFuZCB0cmltIHRoZSByZXN1bHQsIHRoZW4gdW5lc2NhcGUgYW55IGVzY2FwZWQgdGFnc1xyXG4gICAgICB0aGlzLiRidXR0b25bMF0udGl0bGUgPSBodG1sVW5lc2NhcGUodGl0bGUucmVwbGFjZSgvPFtePl0qPj8vZywgJycpLnRyaW0oKSk7XHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5maW5kKCcuZmlsdGVyLW9wdGlvbi1pbm5lci1pbm5lcicpWzBdLmlubmVySFRNTCA9IHRpdGxlO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdyZW5kZXJlZCcgKyBFVkVOVF9LRVkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBbc3R5bGVdXHJcbiAgICAgKiBAcGFyYW0gW3N0YXR1c11cclxuICAgICAqL1xyXG4gICAgc2V0U3R5bGU6IGZ1bmN0aW9uIChzdHlsZSwgc3RhdHVzKSB7XHJcbiAgICAgIGlmICh0aGlzLiRlbGVtZW50LmF0dHIoJ2NsYXNzJykpIHtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmFkZENsYXNzKHRoaXMuJGVsZW1lbnQuYXR0cignY2xhc3MnKS5yZXBsYWNlKC9zZWxlY3RwaWNrZXJ8bW9iaWxlLWRldmljZXxicy1zZWxlY3QtaGlkZGVufHZhbGlkYXRlXFxbLipcXF0vZ2ksICcnKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBidXR0b25DbGFzcyA9IHN0eWxlIHx8IHRoaXMub3B0aW9ucy5zdHlsZTtcclxuXHJcbiAgICAgIGlmIChzdGF0dXMgPT0gJ2FkZCcpIHtcclxuICAgICAgICB0aGlzLiRidXR0b24uYWRkQ2xhc3MoYnV0dG9uQ2xhc3MpO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAncmVtb3ZlJykge1xyXG4gICAgICAgIHRoaXMuJGJ1dHRvbi5yZW1vdmVDbGFzcyhidXR0b25DbGFzcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kYnV0dG9uLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5zdHlsZSk7XHJcbiAgICAgICAgdGhpcy4kYnV0dG9uLmFkZENsYXNzKGJ1dHRvbkNsYXNzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBsaUhlaWdodDogZnVuY3Rpb24gKHJlZnJlc2gpIHtcclxuICAgICAgaWYgKCFyZWZyZXNoICYmICh0aGlzLm9wdGlvbnMuc2l6ZSA9PT0gZmFsc2UgfHwgdGhpcy5zaXplSW5mbykpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5zaXplSW5mbykgdGhpcy5zaXplSW5mbyA9IHt9O1xyXG5cclxuICAgICAgdmFyIG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgIG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgIG1lbnVJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgICAgbWVudUlubmVySW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxyXG4gICAgICAgICAgZGl2aWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBkcm9wZG93bkhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxyXG4gICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcclxuICAgICAgICAgIGhlYWRlciA9IHRoaXMub3B0aW9ucy5oZWFkZXIgJiYgdGhpcy4kbWVudS5maW5kKCcuJyArIGNsYXNzTmFtZXMuUE9QT1ZFUkhFQURFUikubGVuZ3RoID4gMCA/IHRoaXMuJG1lbnUuZmluZCgnLicgKyBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIpWzBdLmNsb25lTm9kZSh0cnVlKSA6IG51bGwsXHJcbiAgICAgICAgICBzZWFyY2ggPSB0aGlzLm9wdGlvbnMubGl2ZVNlYXJjaCA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIDogbnVsbCxcclxuICAgICAgICAgIGFjdGlvbnMgPSB0aGlzLm9wdGlvbnMuYWN0aW9uc0JveCAmJiB0aGlzLm11bHRpcGxlICYmIHRoaXMuJG1lbnUuZmluZCgnLmJzLWFjdGlvbnNib3gnKS5sZW5ndGggPiAwID8gdGhpcy4kbWVudS5maW5kKCcuYnMtYWN0aW9uc2JveCcpWzBdLmNsb25lTm9kZSh0cnVlKSA6IG51bGwsXHJcbiAgICAgICAgICBkb25lQnV0dG9uID0gdGhpcy5vcHRpb25zLmRvbmVCdXR0b24gJiYgdGhpcy5tdWx0aXBsZSAmJiB0aGlzLiRtZW51LmZpbmQoJy5icy1kb25lYnV0dG9uJykubGVuZ3RoID4gMCA/IHRoaXMuJG1lbnUuZmluZCgnLmJzLWRvbmVidXR0b24nKVswXS5jbG9uZU5vZGUodHJ1ZSkgOiBudWxsLFxyXG4gICAgICAgICAgZmlyc3RPcHRpb24gPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpWzBdO1xyXG5cclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RXaWR0aCA9IHRoaXMuJG5ld0VsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICB0ZXh0LmNsYXNzTmFtZSA9ICd0ZXh0JztcclxuICAgICAgYS5jbGFzc05hbWUgPSAnZHJvcGRvd24taXRlbSAnICsgKGZpcnN0T3B0aW9uID8gZmlyc3RPcHRpb24uY2xhc3NOYW1lIDogJycpO1xyXG4gICAgICBuZXdFbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuJG1lbnVbMF0ucGFyZW50Tm9kZS5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWVzLlNIT1c7XHJcbiAgICAgIG5ld0VsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLnNpemVJbmZvLnNlbGVjdFdpZHRoICsgJ3B4JztcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy53aWR0aCA9PT0gJ2F1dG8nKSBtZW51LnN0eWxlLm1pbldpZHRoID0gMDtcclxuICAgICAgbWVudS5jbGFzc05hbWUgPSBjbGFzc05hbWVzLk1FTlUgKyAnICcgKyBjbGFzc05hbWVzLlNIT1c7XHJcbiAgICAgIG1lbnVJbm5lci5jbGFzc05hbWUgPSAnaW5uZXIgJyArIGNsYXNzTmFtZXMuU0hPVztcclxuICAgICAgbWVudUlubmVySW5uZXIuY2xhc3NOYW1lID0gY2xhc3NOYW1lcy5NRU5VICsgJyBpbm5lciAnICsgKHZlcnNpb24ubWFqb3IgPT09ICc0JyA/IGNsYXNzTmFtZXMuU0hPVyA6ICcnKTtcclxuICAgICAgZGl2aWRlci5jbGFzc05hbWUgPSBjbGFzc05hbWVzLkRJVklERVI7XHJcbiAgICAgIGRyb3Bkb3duSGVhZGVyLmNsYXNzTmFtZSA9ICdkcm9wZG93bi1oZWFkZXInO1xyXG5cclxuICAgICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx1MjAwYicpKTtcclxuICAgICAgYS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgbGkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgIGRyb3Bkb3duSGVhZGVyLmFwcGVuZENoaWxkKHRleHQuY2xvbmVOb2RlKHRydWUpKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdHBpY2tlci52aWV3LndpZGVzdE9wdGlvbikge1xyXG4gICAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0cGlja2VyLnZpZXcud2lkZXN0T3B0aW9uLmNsb25lTm9kZSh0cnVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgbWVudUlubmVySW5uZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XHJcbiAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKGRyb3Bkb3duSGVhZGVyKTtcclxuICAgICAgaWYgKGhlYWRlcikgbWVudS5hcHBlbmRDaGlsZChoZWFkZXIpO1xyXG4gICAgICBpZiAoc2VhcmNoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBzZWFyY2guY2xhc3NOYW1lID0gJ2JzLXNlYXJjaGJveCc7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gJ2Zvcm0tY29udHJvbCc7XHJcbiAgICAgICAgc2VhcmNoLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBtZW51LmFwcGVuZENoaWxkKHNlYXJjaCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGFjdGlvbnMpIG1lbnUuYXBwZW5kQ2hpbGQoYWN0aW9ucyk7XHJcbiAgICAgIG1lbnVJbm5lci5hcHBlbmRDaGlsZChtZW51SW5uZXJJbm5lcik7XHJcbiAgICAgIG1lbnUuYXBwZW5kQ2hpbGQobWVudUlubmVyKTtcclxuICAgICAgaWYgKGRvbmVCdXR0b24pIG1lbnUuYXBwZW5kQ2hpbGQoZG9uZUJ1dHRvbik7XHJcbiAgICAgIG5ld0VsZW1lbnQuYXBwZW5kQ2hpbGQobWVudSk7XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpO1xyXG5cclxuICAgICAgdmFyIGxpSGVpZ2h0ID0gYS5vZmZzZXRIZWlnaHQsXHJcbiAgICAgICAgICBkcm9wZG93bkhlYWRlckhlaWdodCA9IGRyb3Bkb3duSGVhZGVyID8gZHJvcGRvd25IZWFkZXIub2Zmc2V0SGVpZ2h0IDogMCxcclxuICAgICAgICAgIGhlYWRlckhlaWdodCA9IGhlYWRlciA/IGhlYWRlci5vZmZzZXRIZWlnaHQgOiAwLFxyXG4gICAgICAgICAgc2VhcmNoSGVpZ2h0ID0gc2VhcmNoID8gc2VhcmNoLm9mZnNldEhlaWdodCA6IDAsXHJcbiAgICAgICAgICBhY3Rpb25zSGVpZ2h0ID0gYWN0aW9ucyA/IGFjdGlvbnMub2Zmc2V0SGVpZ2h0IDogMCxcclxuICAgICAgICAgIGRvbmVCdXR0b25IZWlnaHQgPSBkb25lQnV0dG9uID8gZG9uZUJ1dHRvbi5vZmZzZXRIZWlnaHQgOiAwLFxyXG4gICAgICAgICAgZGl2aWRlckhlaWdodCA9ICQoZGl2aWRlcikub3V0ZXJIZWlnaHQodHJ1ZSksXHJcbiAgICAgICAgICAvLyBmYWxsIGJhY2sgdG8galF1ZXJ5IGlmIGdldENvbXB1dGVkU3R5bGUgaXMgbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAgbWVudVN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShtZW51KSA6IGZhbHNlLFxyXG4gICAgICAgICAgbWVudVdpZHRoID0gbWVudS5vZmZzZXRXaWR0aCxcclxuICAgICAgICAgICRtZW51ID0gbWVudVN0eWxlID8gbnVsbCA6ICQobWVudSksXHJcbiAgICAgICAgICBtZW51UGFkZGluZyA9IHtcclxuICAgICAgICAgICAgdmVydDogdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5wYWRkaW5nVG9wIDogJG1lbnUuY3NzKCdwYWRkaW5nVG9wJykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5wYWRkaW5nQm90dG9tIDogJG1lbnUuY3NzKCdwYWRkaW5nQm90dG9tJykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5ib3JkZXJUb3BXaWR0aCA6ICRtZW51LmNzcygnYm9yZGVyVG9wV2lkdGgnKSkgK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLmJvcmRlckJvdHRvbVdpZHRoIDogJG1lbnUuY3NzKCdib3JkZXJCb3R0b21XaWR0aCcpKSxcclxuICAgICAgICAgICAgaG9yaXo6IHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUucGFkZGluZ0xlZnQgOiAkbWVudS5jc3MoJ3BhZGRpbmdMZWZ0JykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5wYWRkaW5nUmlnaHQgOiAkbWVudS5jc3MoJ3BhZGRpbmdSaWdodCcpKSArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUuYm9yZGVyTGVmdFdpZHRoIDogJG1lbnUuY3NzKCdib3JkZXJMZWZ0V2lkdGgnKSkgK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLmJvcmRlclJpZ2h0V2lkdGggOiAkbWVudS5jc3MoJ2JvcmRlclJpZ2h0V2lkdGgnKSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtZW51RXh0cmFzID0ge1xyXG4gICAgICAgICAgICB2ZXJ0OiBtZW51UGFkZGluZy52ZXJ0ICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5tYXJnaW5Ub3AgOiAkbWVudS5jc3MoJ21hcmdpblRvcCcpKSArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUubWFyZ2luQm90dG9tIDogJG1lbnUuY3NzKCdtYXJnaW5Cb3R0b20nKSkgKyAyLFxyXG4gICAgICAgICAgICBob3JpejogbWVudVBhZGRpbmcuaG9yaXogK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLm1hcmdpbkxlZnQgOiAkbWVudS5jc3MoJ21hcmdpbkxlZnQnKSkgK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLm1hcmdpblJpZ2h0IDogJG1lbnUuY3NzKCdtYXJnaW5SaWdodCcpKSArIDJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzY3JvbGxCYXJXaWR0aDtcclxuXHJcbiAgICAgIG1lbnVJbm5lci5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcclxuXHJcbiAgICAgIHNjcm9sbEJhcldpZHRoID0gbWVudS5vZmZzZXRXaWR0aCAtIG1lbnVXaWR0aDtcclxuXHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblxyXG4gICAgICB0aGlzLnNpemVJbmZvLmxpSGVpZ2h0ID0gbGlIZWlnaHQ7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uZHJvcGRvd25IZWFkZXJIZWlnaHQgPSBkcm9wZG93bkhlYWRlckhlaWdodDtcclxuICAgICAgdGhpcy5zaXplSW5mby5oZWFkZXJIZWlnaHQgPSBoZWFkZXJIZWlnaHQ7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2VhcmNoSGVpZ2h0ID0gc2VhcmNoSGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLmFjdGlvbnNIZWlnaHQgPSBhY3Rpb25zSGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLmRvbmVCdXR0b25IZWlnaHQgPSBkb25lQnV0dG9uSGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLmRpdmlkZXJIZWlnaHQgPSBkaXZpZGVySGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLm1lbnVQYWRkaW5nID0gbWVudVBhZGRpbmc7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8ubWVudUV4dHJhcyA9IG1lbnVFeHRyYXM7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8ubWVudVdpZHRoID0gbWVudVdpZHRoO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnRvdGFsTWVudVdpZHRoID0gdGhpcy5zaXplSW5mby5tZW51V2lkdGg7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2Nyb2xsQmFyV2lkdGggPSBzY3JvbGxCYXJXaWR0aDtcclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RIZWlnaHQgPSB0aGlzLiRuZXdFbGVtZW50WzBdLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgIHRoaXMuc2V0UG9zaXRpb25EYXRhKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFNlbGVjdFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXHJcbiAgICAgICAgICBwb3MgPSB0aGF0LiRuZXdFbGVtZW50Lm9mZnNldCgpLFxyXG4gICAgICAgICAgJGNvbnRhaW5lciA9ICQodGhhdC5vcHRpb25zLmNvbnRhaW5lciksXHJcbiAgICAgICAgICBjb250YWluZXJQb3M7XHJcblxyXG4gICAgICBpZiAodGhhdC5vcHRpb25zLmNvbnRhaW5lciAmJiAhJGNvbnRhaW5lci5pcygnYm9keScpKSB7XHJcbiAgICAgICAgY29udGFpbmVyUG9zID0gJGNvbnRhaW5lci5vZmZzZXQoKTtcclxuICAgICAgICBjb250YWluZXJQb3MudG9wICs9IHBhcnNlSW50KCRjb250YWluZXIuY3NzKCdib3JkZXJUb3BXaWR0aCcpKTtcclxuICAgICAgICBjb250YWluZXJQb3MubGVmdCArPSBwYXJzZUludCgkY29udGFpbmVyLmNzcygnYm9yZGVyTGVmdFdpZHRoJykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRhaW5lclBvcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB3aW5QYWQgPSB0aGF0Lm9wdGlvbnMud2luZG93UGFkZGluZztcclxuXHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0VG9wID0gcG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AgLSAkd2luZG93LnNjcm9sbFRvcCgpO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldEJvdCA9ICR3aW5kb3cuaGVpZ2h0KCkgLSB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFRvcCAtIHRoaXMuc2l6ZUluZm8uc2VsZWN0SGVpZ2h0IC0gY29udGFpbmVyUG9zLnRvcCAtIHdpblBhZFsyXTtcclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRMZWZ0ID0gcG9zLmxlZnQgLSBjb250YWluZXJQb3MubGVmdCAtICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFJpZ2h0ID0gJHdpbmRvdy53aWR0aCgpIC0gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRMZWZ0IC0gdGhpcy5zaXplSW5mby5zZWxlY3RXaWR0aCAtIGNvbnRhaW5lclBvcy5sZWZ0IC0gd2luUGFkWzFdO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFRvcCAtPSB3aW5QYWRbMF07XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0TGVmdCAtPSB3aW5QYWRbM107XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1lbnVTaXplOiBmdW5jdGlvbiAoaXNBdXRvKSB7XHJcbiAgICAgIHRoaXMuZ2V0U2VsZWN0UG9zaXRpb24oKTtcclxuXHJcbiAgICAgIHZhciBzZWxlY3RXaWR0aCA9IHRoaXMuc2l6ZUluZm8uc2VsZWN0V2lkdGgsXHJcbiAgICAgICAgICBsaUhlaWdodCA9IHRoaXMuc2l6ZUluZm8ubGlIZWlnaHQsXHJcbiAgICAgICAgICBoZWFkZXJIZWlnaHQgPSB0aGlzLnNpemVJbmZvLmhlYWRlckhlaWdodCxcclxuICAgICAgICAgIHNlYXJjaEhlaWdodCA9IHRoaXMuc2l6ZUluZm8uc2VhcmNoSGVpZ2h0LFxyXG4gICAgICAgICAgYWN0aW9uc0hlaWdodCA9IHRoaXMuc2l6ZUluZm8uYWN0aW9uc0hlaWdodCxcclxuICAgICAgICAgIGRvbmVCdXR0b25IZWlnaHQgPSB0aGlzLnNpemVJbmZvLmRvbmVCdXR0b25IZWlnaHQsXHJcbiAgICAgICAgICBkaXZIZWlnaHQgPSB0aGlzLnNpemVJbmZvLmRpdmlkZXJIZWlnaHQsXHJcbiAgICAgICAgICBtZW51UGFkZGluZyA9IHRoaXMuc2l6ZUluZm8ubWVudVBhZGRpbmcsXHJcbiAgICAgICAgICBtZW51SW5uZXJIZWlnaHQsXHJcbiAgICAgICAgICBtZW51SGVpZ2h0LFxyXG4gICAgICAgICAgZGl2TGVuZ3RoID0gMCxcclxuICAgICAgICAgIG1pbkhlaWdodCxcclxuICAgICAgICAgIF9taW5IZWlnaHQsXHJcbiAgICAgICAgICBtYXhIZWlnaHQsXHJcbiAgICAgICAgICBtZW51SW5uZXJNaW5IZWlnaHQsXHJcbiAgICAgICAgICBlc3RpbWF0ZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJvcHVwQXV0bykge1xyXG4gICAgICAgIC8vIEdldCB0aGUgZXN0aW1hdGVkIGhlaWdodCBvZiB0aGUgbWVudSB3aXRob3V0IHNjcm9sbGJhcnMuXHJcbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIHNtYWxsZXIgbWVudXMsIHdoZXJlIHRoZXJlIG1pZ2h0IGJlIHBsZW50eSBvZiByb29tXHJcbiAgICAgICAgLy8gYmVsb3cgdGhlIGJ1dHRvbiB3aXRob3V0IHNldHRpbmcgZHJvcHVwLCBidXQgd2UgY2FuJ3Qga25vd1xyXG4gICAgICAgIC8vIHRoZSBleGFjdCBoZWlnaHQgb2YgdGhlIG1lbnUgdW50aWwgY3JlYXRlVmlldyBpcyBjYWxsZWQgbGF0ZXJcclxuICAgICAgICBlc3RpbWF0ZSA9IGxpSGVpZ2h0ICogdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGggKyBtZW51UGFkZGluZy52ZXJ0O1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnQudG9nZ2xlQ2xhc3MoY2xhc3NOYW1lcy5EUk9QVVAsIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0VG9wIC0gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRCb3QgPiB0aGlzLnNpemVJbmZvLm1lbnVFeHRyYXMudmVydCAmJiBlc3RpbWF0ZSArIHRoaXMuc2l6ZUluZm8ubWVudUV4dHJhcy52ZXJ0ICsgNTAgPiB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldEJvdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2l6ZSA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgX21pbkhlaWdodCA9IHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHMubGVuZ3RoID4gMyA/IHRoaXMuc2l6ZUluZm8ubGlIZWlnaHQgKiAzICsgdGhpcy5zaXplSW5mby5tZW51RXh0cmFzLnZlcnQgLSAyIDogMDtcclxuICAgICAgICBtZW51SGVpZ2h0ID0gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRCb3QgLSB0aGlzLnNpemVJbmZvLm1lbnVFeHRyYXMudmVydDtcclxuICAgICAgICBtaW5IZWlnaHQgPSBfbWluSGVpZ2h0ICsgaGVhZGVySGVpZ2h0ICsgc2VhcmNoSGVpZ2h0ICsgYWN0aW9uc0hlaWdodCArIGRvbmVCdXR0b25IZWlnaHQ7XHJcbiAgICAgICAgbWVudUlubmVyTWluSGVpZ2h0ID0gTWF0aC5tYXgoX21pbkhlaWdodCAtIG1lbnVQYWRkaW5nLnZlcnQsIDApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kbmV3RWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWVzLkRST1BVUCkpIHtcclxuICAgICAgICAgIG1lbnVIZWlnaHQgPSB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFRvcCAtIHRoaXMuc2l6ZUluZm8ubWVudUV4dHJhcy52ZXJ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF4SGVpZ2h0ID0gbWVudUhlaWdodDtcclxuICAgICAgICBtZW51SW5uZXJIZWlnaHQgPSBtZW51SGVpZ2h0IC0gaGVhZGVySGVpZ2h0IC0gc2VhcmNoSGVpZ2h0IC0gYWN0aW9uc0hlaWdodCAtIGRvbmVCdXR0b25IZWlnaHQgLSBtZW51UGFkZGluZy52ZXJ0O1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zaXplICYmIHRoaXMub3B0aW9ucy5zaXplICE9ICdhdXRvJyAmJiB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzLmxlbmd0aCA+IHRoaXMub3B0aW9ucy5zaXplKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2ldLnR5cGUgPT09ICdkaXZpZGVyJykgZGl2TGVuZ3RoKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtZW51SGVpZ2h0ID0gbGlIZWlnaHQgKiB0aGlzLm9wdGlvbnMuc2l6ZSArIGRpdkxlbmd0aCAqIGRpdkhlaWdodCArIG1lbnVQYWRkaW5nLnZlcnQ7XHJcbiAgICAgICAgbWVudUlubmVySGVpZ2h0ID0gbWVudUhlaWdodCAtIG1lbnVQYWRkaW5nLnZlcnQ7XHJcbiAgICAgICAgbWF4SGVpZ2h0ID0gbWVudUhlaWdodCArIGhlYWRlckhlaWdodCArIHNlYXJjaEhlaWdodCArIGFjdGlvbnNIZWlnaHQgKyBkb25lQnV0dG9uSGVpZ2h0O1xyXG4gICAgICAgIG1pbkhlaWdodCA9IG1lbnVJbm5lck1pbkhlaWdodCA9ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRyb3Bkb3duQWxpZ25SaWdodCA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgdGhpcy4kbWVudS50b2dnbGVDbGFzcyhjbGFzc05hbWVzLk1FTlVSSUdIVCwgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRMZWZ0ID4gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRSaWdodCAmJiB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFJpZ2h0IDwgKHRoaXMuc2l6ZUluZm8udG90YWxNZW51V2lkdGggLSBzZWxlY3RXaWR0aCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRtZW51LmNzcyh7XHJcbiAgICAgICAgJ21heC1oZWlnaHQnOiBtYXhIZWlnaHQgKyAncHgnLFxyXG4gICAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nLFxyXG4gICAgICAgICdtaW4taGVpZ2h0JzogbWluSGVpZ2h0ICsgJ3B4J1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJG1lbnVJbm5lci5jc3Moe1xyXG4gICAgICAgICdtYXgtaGVpZ2h0JzogbWVudUlubmVySGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgICAnb3ZlcmZsb3cteSc6ICdhdXRvJyxcclxuICAgICAgICAnbWluLWhlaWdodCc6IG1lbnVJbm5lck1pbkhlaWdodCArICdweCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNpemVJbmZvLm1lbnVJbm5lckhlaWdodCA9IG1lbnVJbm5lckhlaWdodDtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoICYmIHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVt0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoIC0gMV0ucG9zaXRpb24gPiB0aGlzLnNpemVJbmZvLm1lbnVJbm5lckhlaWdodCkge1xyXG4gICAgICAgIHRoaXMuc2l6ZUluZm8uaGFzU2Nyb2xsQmFyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNpemVJbmZvLnRvdGFsTWVudVdpZHRoID0gdGhpcy5zaXplSW5mby5tZW51V2lkdGggKyB0aGlzLnNpemVJbmZvLnNjcm9sbEJhcldpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLiRtZW51LmNzcygnbWluLXdpZHRoJywgdGhpcy5zaXplSW5mby50b3RhbE1lbnVXaWR0aCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmRyb3Bkb3duICYmIHRoaXMuZHJvcGRvd24uX3BvcHBlcikgdGhpcy5kcm9wZG93bi5fcG9wcGVyLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRTaXplOiBmdW5jdGlvbiAocmVmcmVzaCkge1xyXG4gICAgICB0aGlzLmxpSGVpZ2h0KHJlZnJlc2gpO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXIpIHRoaXMuJG1lbnUuY3NzKCdwYWRkaW5nLXRvcCcsIDApO1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNpemUgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJbmRleCxcclxuICAgICAgICAgIG9mZnNldCA9IDA7XHJcblxyXG4gICAgICB0aGlzLnNldE1lbnVTaXplKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNpemUgPT09ICdhdXRvJykge1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaGJveFxyXG4gICAgICAgICAgLm9mZignaW5wdXQuc2V0TWVudVNpemUgcHJvcGVydHljaGFuZ2Uuc2V0TWVudVNpemUnKVxyXG4gICAgICAgICAgLm9uKCdpbnB1dC5zZXRNZW51U2l6ZSBwcm9wZXJ0eWNoYW5nZS5zZXRNZW51U2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoYXQuc2V0TWVudVNpemUoKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkd2luZG93XHJcbiAgICAgICAgICAub2ZmKCdyZXNpemUnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnICsgJyBzY3JvbGwnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnKVxyXG4gICAgICAgICAgLm9uKCdyZXNpemUnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnICsgJyBzY3JvbGwnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNldE1lbnVTaXplKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2l6ZSAmJiB0aGlzLm9wdGlvbnMuc2l6ZSAhPSAnYXV0bycgJiYgdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGggPiB0aGlzLm9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaGJveC5vZmYoJ2lucHV0LnNldE1lbnVTaXplIHByb3BlcnR5Y2hhbmdlLnNldE1lbnVTaXplJyk7XHJcbiAgICAgICAgJHdpbmRvdy5vZmYoJ3Jlc2l6ZScgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkICsgJy5zZXRNZW51U2l6ZScgKyAnIHNjcm9sbCcgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkICsgJy5zZXRNZW51U2l6ZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICAgIG9mZnNldCA9IHRoaXMuJG1lbnVJbm5lclswXS5zY3JvbGxUb3A7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoYXQubXVsdGlwbGUpIHtcclxuICAgICAgICBzZWxlY3RlZEluZGV4ID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5tYXAubmV3SW5kZXhbdGhhdC4kZWxlbWVudFswXS5zZWxlY3RlZEluZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RlZEluZGV4ID09PSAnbnVtYmVyJyAmJiB0aGF0Lm9wdGlvbnMuc2l6ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIG9mZnNldCA9IHRoYXQuc2l6ZUluZm8ubGlIZWlnaHQgKiBzZWxlY3RlZEluZGV4O1xyXG4gICAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IC0gKHRoYXQuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0IC8gMikgKyAodGhhdC5zaXplSW5mby5saUhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5jcmVhdGVWaWV3KGZhbHNlLCBvZmZzZXQpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRXaWR0aDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLndpZHRoID09PSAnYXV0bycpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdGhhdC4kbWVudS5jc3MoJ21pbi13aWR0aCcsICcwJyk7XHJcbiAgICAgICAgICB0aGF0LmxpSGVpZ2h0KCk7XHJcbiAgICAgICAgICB0aGF0LnNldE1lbnVTaXplKCk7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IGNvcnJlY3Qgd2lkdGggaWYgZWxlbWVudCBpcyBoaWRkZW5cclxuICAgICAgICAgIHZhciAkc2VsZWN0Q2xvbmUgPSB0aGF0LiRuZXdFbGVtZW50LmNsb25lKCkuYXBwZW5kVG8oJ2JvZHknKSxcclxuICAgICAgICAgICAgICBidG5XaWR0aCA9ICRzZWxlY3RDbG9uZS5jc3MoJ3dpZHRoJywgJ2F1dG8nKS5jaGlsZHJlbignYnV0dG9uJykub3V0ZXJXaWR0aCgpO1xyXG5cclxuICAgICAgICAgICRzZWxlY3RDbG9uZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAvLyBTZXQgd2lkdGggdG8gd2hhdGV2ZXIncyBsYXJnZXIsIGJ1dHRvbiB0aXRsZSBvciBsb25nZXN0IG9wdGlvblxyXG4gICAgICAgICAgdGhhdC5zaXplSW5mby5zZWxlY3RXaWR0aCA9IE1hdGgubWF4KHRoYXQuc2l6ZUluZm8udG90YWxNZW51V2lkdGgsIGJ0bldpZHRoKTtcclxuICAgICAgICAgIHRoYXQuJG5ld0VsZW1lbnQuY3NzKCd3aWR0aCcsIHRoYXQuc2l6ZUluZm8uc2VsZWN0V2lkdGggKyAncHgnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMud2lkdGggPT09ICdmaXQnKSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGlubGluZSBtaW4td2lkdGggc28gd2lkdGggY2FuIGJlIGNoYW5nZWQgZnJvbSAnYXV0bydcclxuICAgICAgICB0aGlzLiRtZW51LmNzcygnbWluLXdpZHRoJywgJycpO1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnQuY3NzKCd3aWR0aCcsICcnKS5hZGRDbGFzcygnZml0LXdpZHRoJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLndpZHRoKSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGlubGluZSBtaW4td2lkdGggc28gd2lkdGggY2FuIGJlIGNoYW5nZWQgZnJvbSAnYXV0bydcclxuICAgICAgICB0aGlzLiRtZW51LmNzcygnbWluLXdpZHRoJywgJycpO1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnQuY3NzKCd3aWR0aCcsIHRoaXMub3B0aW9ucy53aWR0aCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGlubGluZSBtaW4td2lkdGgvd2lkdGggc28gd2lkdGggY2FuIGJlIGNoYW5nZWRcclxuICAgICAgICB0aGlzLiRtZW51LmNzcygnbWluLXdpZHRoJywgJycpO1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnQuY3NzKCd3aWR0aCcsICcnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBSZW1vdmUgZml0LXdpZHRoIGNsYXNzIGlmIHdpZHRoIGlzIGNoYW5nZWQgcHJvZ3JhbW1hdGljYWxseVxyXG4gICAgICBpZiAodGhpcy4kbmV3RWxlbWVudC5oYXNDbGFzcygnZml0LXdpZHRoJykgJiYgdGhpcy5vcHRpb25zLndpZHRoICE9PSAnZml0Jykge1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZpdC13aWR0aCcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbGVjdFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJGJzQ29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cImJzLWNvbnRhaW5lclwiIC8+Jyk7XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAkY29udGFpbmVyID0gJCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSxcclxuICAgICAgICAgIHBvcyxcclxuICAgICAgICAgIGNvbnRhaW5lclBvcyxcclxuICAgICAgICAgIGFjdHVhbEhlaWdodCxcclxuICAgICAgICAgIGdldFBsYWNlbWVudCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyUG9zaXRpb24gPSB7fSxcclxuICAgICAgICAgICAgICAgIC8vIGZhbGwgYmFjayB0byBkcm9wZG93bidzIGRlZmF1bHQgZGlzcGxheSBzZXR0aW5nIGlmIGRpc3BsYXkgaXMgbm90IG1hbnVhbGx5IHNldFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSA9IHRoYXQub3B0aW9ucy5kaXNwbGF5IHx8IChcclxuICAgICAgICAgICAgICAgICAgLy8gQm9vdHN0cmFwIDMgZG9lc24ndCBoYXZlICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IuRGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLkRlZmF1bHQgPyAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLkRlZmF1bHQuZGlzcGxheVxyXG4gICAgICAgICAgICAgICAgICA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhhdC4kYnNDb250YWluZXIuYWRkQ2xhc3MoJGVsZW1lbnQuYXR0cignY2xhc3MnKS5yZXBsYWNlKC9mb3JtLWNvbnRyb2x8Zml0LXdpZHRoL2dpLCAnJykpLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZXMuRFJPUFVQLCAkZWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWVzLkRST1BVUCkpO1xyXG4gICAgICAgICAgICBwb3MgPSAkZWxlbWVudC5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJGNvbnRhaW5lci5pcygnYm9keScpKSB7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zID0gJGNvbnRhaW5lci5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICBjb250YWluZXJQb3MudG9wICs9IHBhcnNlSW50KCRjb250YWluZXIuY3NzKCdib3JkZXJUb3BXaWR0aCcpKSAtICRjb250YWluZXIuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zLmxlZnQgKz0gcGFyc2VJbnQoJGNvbnRhaW5lci5jc3MoJ2JvcmRlckxlZnRXaWR0aCcpKSAtICRjb250YWluZXIuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnRhaW5lclBvcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdHVhbEhlaWdodCA9ICRlbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuRFJPUFVQKSA/IDAgOiAkZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAvLyBCb290c3RyYXAgNCsgdXNlcyBQb3BwZXIgZm9yIG1lbnUgcG9zaXRpb25pbmdcclxuICAgICAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPCA0IHx8IGRpc3BsYXkgPT09ICdzdGF0aWMnKSB7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zaXRpb24udG9wID0gcG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AgKyBhY3R1YWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zaXRpb24ubGVmdCA9IHBvcy5sZWZ0IC0gY29udGFpbmVyUG9zLmxlZnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lclBvc2l0aW9uLndpZHRoID0gJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICAgICAgICB0aGF0LiRic0NvbnRhaW5lci5jc3MoY29udGFpbmVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoYXQuaXNEaXNhYmxlZCgpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRQbGFjZW1lbnQodGhhdC4kbmV3RWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoYXQuJGJzQ29udGFpbmVyXHJcbiAgICAgICAgICAuYXBwZW5kVG8odGhhdC5vcHRpb25zLmNvbnRhaW5lcilcclxuICAgICAgICAgIC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLlNIT1csICF0aGF0LiRidXR0b24uaGFzQ2xhc3MoY2xhc3NOYW1lcy5TSE9XKSlcclxuICAgICAgICAgIC5hcHBlbmQodGhhdC4kbWVudSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCh3aW5kb3cpXHJcbiAgICAgICAgLm9mZigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnIHNjcm9sbCcgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkKVxyXG4gICAgICAgIC5vbigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnIHNjcm9sbCcgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGF0LiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVyk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzQWN0aXZlKSBnZXRQbGFjZW1lbnQodGhhdC4kbmV3RWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdoaWRlJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoYXQuJG1lbnUuZGF0YSgnaGVpZ2h0JywgdGhhdC4kbWVudS5oZWlnaHQoKSk7XHJcbiAgICAgICAgdGhhdC4kYnNDb250YWluZXIuZGV0YWNoKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRPcHRpb25TdGF0dXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgJHNlbGVjdE9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpO1xyXG5cclxuICAgICAgdGhhdC5ub1Njcm9sbCA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzICYmIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBpbmRleCA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQubWFwLm9yaWdpbmFsSW5kZXhbaSArIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wXSwgLy8gZmFzdGVyIHRoYW4gJChsaSkuZGF0YSgnb3JpZ2luYWxJbmRleCcpXHJcbiAgICAgICAgICAgICAgb3B0aW9uID0gJHNlbGVjdE9wdGlvbnNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgIGlmIChvcHRpb24pIHtcclxuICAgICAgICAgICAgdmFyIGxpSW5kZXggPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluLm1hcC5uZXdJbmRleFtpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBsaSA9IHRoaXMuc2VsZWN0cGlja2VyLm1haW4uZWxlbWVudHNbbGlJbmRleF07XHJcblxyXG4gICAgICAgICAgICB0aGF0LnNldERpc2FibGVkKFxyXG4gICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgIG9wdGlvbi5kaXNhYmxlZCB8fCAob3B0aW9uLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ09QVEdST1VQJyAmJiBvcHRpb24ucGFyZW50Tm9kZS5kaXNhYmxlZCksXHJcbiAgICAgICAgICAgICAgbGlJbmRleCxcclxuICAgICAgICAgICAgICBsaVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChcclxuICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQsXHJcbiAgICAgICAgICAgICAgbGlJbmRleCxcclxuICAgICAgICAgICAgICBsaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIHRoZSBpbmRleCBvZiB0aGUgb3B0aW9uIHRoYXQgaXMgYmVpbmcgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZCAtIHRydWUgaWYgdGhlIG9wdGlvbiBpcyBiZWluZyBzZWxlY3RlZCwgZmFsc2UgaWYgYmVpbmcgZGVzZWxlY3RlZFxyXG4gICAgICovXHJcbiAgICBzZXRTZWxlY3RlZDogZnVuY3Rpb24gKGluZGV4LCBzZWxlY3RlZCwgbGlJbmRleCwgbGkpIHtcclxuICAgICAgdmFyIGFjdGl2ZUluZGV4SXNTZXQgPSB0aGlzLmFjdGl2ZUluZGV4ICE9PSB1bmRlZmluZWQsXHJcbiAgICAgICAgICB0aGlzSXNBY3RpdmUgPSB0aGlzLmFjdGl2ZUluZGV4ID09PSBpbmRleCxcclxuICAgICAgICAgIHByZXZBY3RpdmVJbmRleCxcclxuICAgICAgICAgIHByZXZBY3RpdmUsXHJcbiAgICAgICAgICBhLFxyXG4gICAgICAgICAgLy8gaWYgY3VycmVudCBvcHRpb24gaXMgYWxyZWFkeSBhY3RpdmVcclxuICAgICAgICAgIC8vIE9SXHJcbiAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBvcHRpb24gaXMgYmVpbmcgc2VsZWN0ZWQsIGl0J3MgTk9UIG11bHRpcGxlLCBhbmRcclxuICAgICAgICAgIC8vIGFjdGl2ZUluZGV4IGlzIHVuZGVmaW5lZDpcclxuICAgICAgICAgIC8vICAtIHdoZW4gdGhlIG1lbnUgaXMgZmlyc3QgYmVpbmcgb3BlbmVkLCBPUlxyXG4gICAgICAgICAgLy8gIC0gYWZ0ZXIgYSBzZWFyY2ggaGFzIGJlZW4gcGVyZm9ybWVkLCBPUlxyXG4gICAgICAgICAgLy8gIC0gd2hlbiByZXRhaW5BY3RpdmUgaXMgZmFsc2Ugd2hlbiBzZWxlY3RpbmcgYSBuZXcgb3B0aW9uIChpLmUuIGluZGV4IG9mIHRoZSBuZXdseSBzZWxlY3RlZCBvcHRpb24gaXMgbm90IHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IGFjdGl2ZUluZGV4KVxyXG4gICAgICAgICAga2VlcEFjdGl2ZSA9IHRoaXNJc0FjdGl2ZSB8fCAoc2VsZWN0ZWQgJiYgIXRoaXMubXVsdGlwbGUgJiYgIWFjdGl2ZUluZGV4SXNTZXQpO1xyXG5cclxuICAgICAgaWYgKCFsaUluZGV4KSBsaUluZGV4ID0gdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5tYXAubmV3SW5kZXhbaW5kZXhdO1xyXG4gICAgICBpZiAoIWxpKSBsaSA9IHRoaXMuc2VsZWN0cGlja2VyLm1haW4uZWxlbWVudHNbbGlJbmRleF07XHJcblxyXG4gICAgICBhID0gbGkuZmlyc3RDaGlsZDtcclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsaS5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsIHNlbGVjdGVkKTtcclxuICAgICAgbGkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywga2VlcEFjdGl2ZSk7XHJcblxyXG4gICAgICBpZiAoa2VlcEFjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0cGlja2VyLnZpZXcuY3VycmVudEFjdGl2ZSA9IGxpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBpbmRleDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGEpIHtcclxuICAgICAgICBhLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xyXG4gICAgICAgIGEuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywga2VlcEFjdGl2ZSk7XHJcbiAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgha2VlcEFjdGl2ZSkge1xyXG4gICAgICAgIGlmICghYWN0aXZlSW5kZXhJc1NldCAmJiBzZWxlY3RlZCAmJiB0aGlzLnByZXZBY3RpdmVJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBwcmV2QWN0aXZlSW5kZXggPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluLm1hcC5uZXdJbmRleFt0aGlzLnByZXZBY3RpdmVJbmRleF07XHJcbiAgICAgICAgICBwcmV2QWN0aXZlID0gdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50c1twcmV2QWN0aXZlSW5kZXhdO1xyXG5cclxuICAgICAgICAgIHByZXZBY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICBpZiAocHJldkFjdGl2ZS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHByZXZBY3RpdmUuZmlyc3RDaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSB0aGUgaW5kZXggb2YgdGhlIG9wdGlvbiB0aGF0IGlzIGJlaW5nIGRpc2FibGVkXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRpc2FibGVkIC0gdHJ1ZSBpZiB0aGUgb3B0aW9uIGlzIGJlaW5nIGRpc2FibGVkLCBmYWxzZSBpZiBiZWluZyBlbmFibGVkXHJcbiAgICAgKi9cclxuICAgIHNldERpc2FibGVkOiBmdW5jdGlvbiAoaW5kZXgsIGRpc2FibGVkLCBsaUluZGV4LCBsaSkge1xyXG4gICAgICB2YXIgYTtcclxuXHJcbiAgICAgIGlmICghbGlJbmRleCkgbGlJbmRleCA9IHRoaXMuc2VsZWN0cGlja2VyLm1haW4ubWFwLm5ld0luZGV4W2luZGV4XTtcclxuICAgICAgaWYgKCFsaSkgbGkgPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW2xpSW5kZXhdO1xyXG5cclxuICAgICAgYSA9IGxpLmZpcnN0Q2hpbGQ7XHJcblxyXG4gICAgICBsaS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZXMuRElTQUJMRUQsIGRpc2FibGVkKTtcclxuXHJcbiAgICAgIGlmIChhKSB7XHJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPT09ICc0JykgYS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZXMuRElTQUJMRUQsIGRpc2FibGVkKTtcclxuXHJcbiAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCBkaXNhYmxlZCk7XHJcblxyXG4gICAgICAgIGlmIChkaXNhYmxlZCkge1xyXG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaXNEaXNhYmxlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kZWxlbWVudFswXS5kaXNhYmxlZDtcclxuICAgIH0sXHJcblxyXG4gICAgY2hlY2tEaXNhYmxlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKCkpIHtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmFkZENsYXNzKGNsYXNzTmFtZXMuRElTQUJMRUQpO1xyXG4gICAgICAgIHRoaXMuJGJ1dHRvbi5hZGRDbGFzcyhjbGFzc05hbWVzLkRJU0FCTEVEKS5hdHRyKCd0YWJpbmRleCcsIC0xKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJGJ1dHRvbi5oYXNDbGFzcyhjbGFzc05hbWVzLkRJU0FCTEVEKSkge1xyXG4gICAgICAgICAgdGhpcy4kbmV3RWxlbWVudC5yZW1vdmVDbGFzcyhjbGFzc05hbWVzLkRJU0FCTEVEKTtcclxuICAgICAgICAgIHRoaXMuJGJ1dHRvbi5yZW1vdmVDbGFzcyhjbGFzc05hbWVzLkRJU0FCTEVEKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGJ1dHRvbi5hdHRyKCd0YWJpbmRleCcpID09IC0xICYmICF0aGlzLiRlbGVtZW50LmRhdGEoJ3RhYmluZGV4JykpIHtcclxuICAgICAgICAgIHRoaXMuJGJ1dHRvbi5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kYnV0dG9uLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoYXQuaXNEaXNhYmxlZCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlUGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gbXVjaCBmYXN0ZXIgdGhhbiBjYWxsaW5nICQudmFsKClcclxuICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50WzBdLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGVsZW1lbnQuc2VsZWN0ZWRJbmRleCxcclxuICAgICAgICAgIG5vdGhpbmdTZWxlY3RlZCA9IHNlbGVjdGVkSW5kZXggPT09IC0xO1xyXG5cclxuICAgICAgaWYgKCFub3RoaW5nU2VsZWN0ZWQgJiYgIWVsZW1lbnQub3B0aW9uc1tzZWxlY3RlZEluZGV4XS52YWx1ZSkgbm90aGluZ1NlbGVjdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi50b2dnbGVDbGFzcygnYnMtcGxhY2Vob2xkZXInLCBub3RoaW5nU2VsZWN0ZWQpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0YWJJbmRleDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy4kZWxlbWVudC5kYXRhKCd0YWJpbmRleCcpICE9PSB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgJiZcclxuICAgICAgICAodGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpICE9PSAtOTggJiYgdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpICE9PSAnLTk4JykpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3RhYmluZGV4JywgdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpKTtcclxuICAgICAgICB0aGlzLiRidXR0b24uYXR0cigndGFiaW5kZXgnLCB0aGlzLiRlbGVtZW50LmRhdGEoJ3RhYmluZGV4JykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgLTk4KTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tMaXN0ZW5lcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcclxuXHJcbiAgICAgICRkb2N1bWVudC5kYXRhKCdzcGFjZVNlbGVjdCcsIGZhbHNlKTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICgvKDMyKS8udGVzdChlLmtleUNvZGUudG9TdHJpbmcoMTApKSAmJiAkZG9jdW1lbnQuZGF0YSgnc3BhY2VTZWxlY3QnKSkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgJGRvY3VtZW50LmRhdGEoJ3NwYWNlU2VsZWN0JywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRuZXdFbGVtZW50Lm9uKCdzaG93LmJzLmRyb3Bkb3duJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh2ZXJzaW9uLm1ham9yID4gMyAmJiAhdGhhdC5kcm9wZG93bikge1xyXG4gICAgICAgICAgdGhhdC5kcm9wZG93biA9IHRoYXQuJGJ1dHRvbi5kYXRhKCdicy5kcm9wZG93bicpO1xyXG4gICAgICAgICAgdGhhdC5kcm9wZG93bi5fbWVudSA9IHRoYXQuJG1lbnVbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGF0LiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVykpIHtcclxuICAgICAgICAgIHRoYXQuc2V0U2l6ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRGb2N1cyAoKSB7XHJcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgICB0aGF0LiRzZWFyY2hib3guZm9jdXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhhdC4kbWVudUlubmVyLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjaGVja1BvcHBlckV4aXN0cyAoKSB7XHJcbiAgICAgICAgaWYgKHRoYXQuZHJvcGRvd24gJiYgdGhhdC5kcm9wZG93bi5fcG9wcGVyICYmIHRoYXQuZHJvcGRvd24uX3BvcHBlci5zdGF0ZS5pc0NyZWF0ZWQpIHtcclxuICAgICAgICAgIHNldEZvY3VzKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1BvcHBlckV4aXN0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdzaG93bicgKyBFVkVOVF9LRVksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCAhPT0gdGhhdC5zZWxlY3RwaWNrZXIudmlldy5zY3JvbGxUb3ApIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3AgPSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnNjcm9sbFRvcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2ZXJzaW9uLm1ham9yID4gMykge1xyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrUG9wcGVyRXhpc3RzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2V0Rm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kbWVudUlubmVyLm9uKCdjbGljaycsICdsaSBhJywgZnVuY3Rpb24gKGUsIHJldGFpbkFjdGl2ZSkge1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uMCA9IHRoYXQuaXNWaXJ0dWFsKCkgPyB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCA6IDAsXHJcbiAgICAgICAgICAgIGNsaWNrZWRJbmRleCA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQubWFwLm9yaWdpbmFsSW5kZXhbJHRoaXMucGFyZW50KCkuaW5kZXgoKSArIHBvc2l0aW9uMF0sXHJcbiAgICAgICAgICAgIHByZXZWYWx1ZSA9IGdldFNlbGVjdFZhbHVlcyh0aGF0LiRlbGVtZW50WzBdKSxcclxuICAgICAgICAgICAgcHJldkluZGV4ID0gdGhhdC4kZWxlbWVudC5wcm9wKCdzZWxlY3RlZEluZGV4JyksXHJcbiAgICAgICAgICAgIHRyaWdnZXJDaGFuZ2UgPSB0cnVlO1xyXG5cclxuICAgICAgICAvLyBEb24ndCBjbG9zZSBvbiBtdWx0aSBjaG9pY2UgbWVudVxyXG4gICAgICAgIGlmICh0aGF0Lm11bHRpcGxlICYmIHRoYXQub3B0aW9ucy5tYXhPcHRpb25zICE9PSAxKSB7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvLyBEb24ndCBydW4gaWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZFxyXG4gICAgICAgIGlmICghdGhhdC5pc0Rpc2FibGVkKCkgJiYgISR0aGlzLnBhcmVudCgpLmhhc0NsYXNzKGNsYXNzTmFtZXMuRElTQUJMRUQpKSB7XHJcbiAgICAgICAgICB2YXIgJG9wdGlvbnMgPSB0aGF0LiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLFxyXG4gICAgICAgICAgICAgICRvcHRpb24gPSAkb3B0aW9ucy5lcShjbGlja2VkSW5kZXgpLFxyXG4gICAgICAgICAgICAgIHN0YXRlID0gJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpLFxyXG4gICAgICAgICAgICAgICRvcHRncm91cCA9ICRvcHRpb24ucGFyZW50KCdvcHRncm91cCcpLFxyXG4gICAgICAgICAgICAgICRvcHRncm91cE9wdGlvbnMgPSAkb3B0Z3JvdXAuZmluZCgnb3B0aW9uJyksXHJcbiAgICAgICAgICAgICAgbWF4T3B0aW9ucyA9IHRoYXQub3B0aW9ucy5tYXhPcHRpb25zLFxyXG4gICAgICAgICAgICAgIG1heE9wdGlvbnNHcnAgPSAkb3B0Z3JvdXAuZGF0YSgnbWF4T3B0aW9ucycpIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICAgIGlmIChjbGlja2VkSW5kZXggPT09IHRoYXQuYWN0aXZlSW5kZXgpIHJldGFpbkFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgaWYgKCFyZXRhaW5BY3RpdmUpIHtcclxuICAgICAgICAgICAgdGhhdC5wcmV2QWN0aXZlSW5kZXggPSB0aGF0LmFjdGl2ZUluZGV4O1xyXG4gICAgICAgICAgICB0aGF0LmFjdGl2ZUluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghdGhhdC5tdWx0aXBsZSkgeyAvLyBEZXNlbGVjdCBhbGwgb3RoZXJzIGlmIG5vdCBtdWx0aSBzZWxlY3QgYm94XHJcbiAgICAgICAgICAgICRvcHRpb25zLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkb3B0aW9uLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0U2VsZWN0ZWQoY2xpY2tlZEluZGV4LCB0cnVlKTtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIFRvZ2dsZSB0aGUgb25lIHdlIGhhdmUgY2hvc2VuIGlmIHdlIGFyZSBtdWx0aSBzZWxlY3QuXHJcbiAgICAgICAgICAgICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnLCAhc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChjbGlja2VkSW5kZXgsICFzdGF0ZSk7XHJcbiAgICAgICAgICAgICR0aGlzLmJsdXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtYXhPcHRpb25zICE9PSBmYWxzZSB8fCBtYXhPcHRpb25zR3JwICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgIHZhciBtYXhSZWFjaGVkID0gbWF4T3B0aW9ucyA8ICRvcHRpb25zLmZpbHRlcignOnNlbGVjdGVkJykubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICBtYXhSZWFjaGVkR3JwID0gbWF4T3B0aW9uc0dycCA8ICRvcHRncm91cC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgIGlmICgobWF4T3B0aW9ucyAmJiBtYXhSZWFjaGVkKSB8fCAobWF4T3B0aW9uc0dycCAmJiBtYXhSZWFjaGVkR3JwKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heE9wdGlvbnMgJiYgbWF4T3B0aW9ucyA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICRvcHRpb25zLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAkb3B0aW9uLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuc2V0U2VsZWN0ZWQoY2xpY2tlZEluZGV4LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF4T3B0aW9uc0dycCAmJiBtYXhPcHRpb25zR3JwID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgJG9wdGdyb3VwLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAkb3B0aW9uLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRvcHRncm91cE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uID0gJG9wdGdyb3VwT3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKCRvcHRpb25zLmluZGV4KG9wdGlvbiksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChjbGlja2VkSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIG1heE9wdGlvbnNUZXh0ID0gdHlwZW9mIHRoYXQub3B0aW9ucy5tYXhPcHRpb25zVGV4dCA9PT0gJ3N0cmluZycgPyBbdGhhdC5vcHRpb25zLm1heE9wdGlvbnNUZXh0LCB0aGF0Lm9wdGlvbnMubWF4T3B0aW9uc1RleHRdIDogdGhhdC5vcHRpb25zLm1heE9wdGlvbnNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4T3B0aW9uc0FyciA9IHR5cGVvZiBtYXhPcHRpb25zVGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IG1heE9wdGlvbnNUZXh0KG1heE9wdGlvbnMsIG1heE9wdGlvbnNHcnApIDogbWF4T3B0aW9uc1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXhUeHQgPSBtYXhPcHRpb25zQXJyWzBdLnJlcGxhY2UoJ3tufScsIG1heE9wdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4VHh0R3JwID0gbWF4T3B0aW9uc0FyclsxXS5yZXBsYWNlKCd7bn0nLCBtYXhPcHRpb25zR3JwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICRub3RpZnkgPSAkKCc8ZGl2IGNsYXNzPVwibm90aWZ5XCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgIC8vIElmIHt2YXJ9IGlzIHNldCBpbiBhcnJheSwgcmVwbGFjZSBpdFxyXG4gICAgICAgICAgICAgICAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgICAgICAgICAgICAgICAgaWYgKG1heE9wdGlvbnNBcnJbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXhUeHQgPSBtYXhUeHQucmVwbGFjZSgne3Zhcn0nLCBtYXhPcHRpb25zQXJyWzJdW21heE9wdGlvbnMgPiAxID8gMCA6IDFdKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXhUeHRHcnAgPSBtYXhUeHRHcnAucmVwbGFjZSgne3Zhcn0nLCBtYXhPcHRpb25zQXJyWzJdW21heE9wdGlvbnNHcnAgPiAxID8gMCA6IDFdKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuJG1lbnUuYXBwZW5kKCRub3RpZnkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG1heE9wdGlvbnMgJiYgbWF4UmVhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRub3RpZnkuYXBwZW5kKCQoJzxkaXY+JyArIG1heFR4dCArICc8L2Rpdj4nKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignbWF4UmVhY2hlZCcgKyBFVkVOVF9LRVkpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAobWF4T3B0aW9uc0dycCAmJiBtYXhSZWFjaGVkR3JwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG5vdGlmeS5hcHBlbmQoJCgnPGRpdj4nICsgbWF4VHh0R3JwICsgJzwvZGl2PicpKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQ2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdtYXhSZWFjaGVkR3JwJyArIEVWRU5UX0tFWSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0U2VsZWN0ZWQoY2xpY2tlZEluZGV4LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgIH0sIDEwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICRub3RpZnkuZGVsYXkoNzUwKS5mYWRlT3V0KDMwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghdGhhdC5tdWx0aXBsZSB8fCAodGhhdC5tdWx0aXBsZSAmJiB0aGF0Lm9wdGlvbnMubWF4T3B0aW9ucyA9PT0gMSkpIHtcclxuICAgICAgICAgICAgdGhhdC4kYnV0dG9uLmZvY3VzKCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgIHRoYXQuJHNlYXJjaGJveC5mb2N1cygpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRyaWdnZXIgc2VsZWN0ICdjaGFuZ2UnXHJcbiAgICAgICAgICBpZiAodHJpZ2dlckNoYW5nZSkge1xyXG4gICAgICAgICAgICBpZiAoKHByZXZWYWx1ZSAhPSBnZXRTZWxlY3RWYWx1ZXModGhhdC4kZWxlbWVudFswXSkgJiYgdGhhdC5tdWx0aXBsZSkgfHwgKHByZXZJbmRleCAhPSB0aGF0LiRlbGVtZW50LnByb3AoJ3NlbGVjdGVkSW5kZXgnKSAmJiAhdGhhdC5tdWx0aXBsZSkpIHtcclxuICAgICAgICAgICAgICAvLyAkb3B0aW9uLnByb3AoJ3NlbGVjdGVkJykgaXMgY3VycmVudCBvcHRpb24gc3RhdGUgKHNlbGVjdGVkL3Vuc2VsZWN0ZWQpLiBwcmV2VmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcHJpb3IgdG8gYmVpbmcgY2hhbmdlZC5cclxuICAgICAgICAgICAgICBjaGFuZ2VkQXJndW1lbnRzID0gW2NsaWNrZWRJbmRleCwgJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpLCBwcmV2VmFsdWVdO1xyXG4gICAgICAgICAgICAgIHRoYXQuJGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIC50cmlnZ2VyTmF0aXZlKCdjaGFuZ2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRtZW51Lm9uKCdjbGljaycsICdsaS4nICsgY2xhc3NOYW1lcy5ESVNBQkxFRCArICcgYSwgLicgKyBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgKyAnLCAuJyArIGNsYXNzTmFtZXMuUE9QT1ZFUkhFQURFUiArICcgOm5vdCguY2xvc2UpJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5jdXJyZW50VGFyZ2V0ID09IHRoaXMpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmxpdmVTZWFyY2ggJiYgISQoZS50YXJnZXQpLmhhc0NsYXNzKCdjbG9zZScpKSB7XHJcbiAgICAgICAgICAgIHRoYXQuJHNlYXJjaGJveC5mb2N1cygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhhdC4kYnV0dG9uLmZvY3VzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJG1lbnVJbm5lci5vbignY2xpY2snLCAnLmRpdmlkZXIsIC5kcm9wZG93bi1oZWFkZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMubGl2ZVNlYXJjaCkge1xyXG4gICAgICAgICAgdGhhdC4kc2VhcmNoYm94LmZvY3VzKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoYXQuJGJ1dHRvbi5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRtZW51Lm9uKCdjbGljaycsICcuJyArIGNsYXNzTmFtZXMuUE9QT1ZFUkhFQURFUiArICcgLmNsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoYXQuJGJ1dHRvbi5jbGljaygpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJHNlYXJjaGJveC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kbWVudS5vbignY2xpY2snLCAnLmFjdGlvbnMtYnRuJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAodGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgIHRoYXQuJHNlYXJjaGJveC5mb2N1cygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGF0LiRidXR0b24uZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnYnMtc2VsZWN0LWFsbCcpKSB7XHJcbiAgICAgICAgICB0aGF0LnNlbGVjdEFsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGF0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oe1xyXG4gICAgICAgICdjaGFuZ2UnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LnJlbmRlcigpO1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2VkJyArIEVWRU5UX0tFWSwgY2hhbmdlZEFyZ3VtZW50cyk7XHJcbiAgICAgICAgICBjaGFuZ2VkQXJndW1lbnRzID0gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdmb2N1cyc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICghdGhhdC5vcHRpb25zLm1vYmlsZSkgdGhhdC4kYnV0dG9uLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgbGl2ZVNlYXJjaExpc3RlbmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgIG5vUmVzdWx0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcblxyXG4gICAgICB0aGlzLiRidXR0b24ub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghIXRoYXQuJHNlYXJjaGJveC52YWwoKSkge1xyXG4gICAgICAgICAgdGhhdC4kc2VhcmNoYm94LnZhbCgnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJHNlYXJjaGJveC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGkgZm9jdXMuYnMuZHJvcGRvd24uZGF0YS1hcGkgdG91Y2hlbmQuYnMuZHJvcGRvd24uZGF0YS1hcGknLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kc2VhcmNoYm94Lm9uKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VhcmNoVmFsdWUgPSB0aGF0LiRzZWFyY2hib3gudmFsKCk7XHJcblxyXG4gICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnNlYXJjaC5tYXAubmV3SW5kZXggPSB7fTtcclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5zZWFyY2gubWFwLm9yaWdpbmFsSW5kZXggPSB7fTtcclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5zZWFyY2guZWxlbWVudHMgPSBbXTtcclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5zZWFyY2guZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoc2VhcmNoVmFsdWUpIHtcclxuICAgICAgICAgIHZhciBpLFxyXG4gICAgICAgICAgICAgIHNlYXJjaE1hdGNoID0gW10sXHJcbiAgICAgICAgICAgICAgcSA9IHNlYXJjaFZhbHVlLnRvVXBwZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgY2FjaGUgPSB7fSxcclxuICAgICAgICAgICAgICBjYWNoZUFyciA9IFtdLFxyXG4gICAgICAgICAgICAgIHNlYXJjaFN0eWxlID0gdGhhdC5fc2VhcmNoU3R5bGUoKSxcclxuICAgICAgICAgICAgICBub3JtYWxpemVTZWFyY2ggPSB0aGF0Lm9wdGlvbnMubGl2ZVNlYXJjaE5vcm1hbGl6ZTtcclxuXHJcbiAgICAgICAgICBpZiAobm9ybWFsaXplU2VhcmNoKSBxID0gbm9ybWFsaXplVG9CYXNlKHEpO1xyXG5cclxuICAgICAgICAgIHRoYXQuXyRsaXNTZWxlY3RlZCA9IHRoYXQuJG1lbnVJbm5lci5maW5kKCcuc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbGkgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNhY2hlW2ldKSB7XHJcbiAgICAgICAgICAgICAgY2FjaGVbaV0gPSBzdHJpbmdTZWFyY2gobGksIHEsIHNlYXJjaFN0eWxlLCBub3JtYWxpemVTZWFyY2gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGVbaV0gJiYgbGkuaGVhZGVySW5kZXggIT09IHVuZGVmaW5lZCAmJiBjYWNoZUFyci5pbmRleE9mKGxpLmhlYWRlckluZGV4KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBpZiAobGkuaGVhZGVySW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjYWNoZVtsaS5oZWFkZXJJbmRleCAtIDFdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNhY2hlQXJyLnB1c2gobGkuaGVhZGVySW5kZXggLSAxKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNhY2hlW2xpLmhlYWRlckluZGV4XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgY2FjaGVBcnIucHVzaChsaS5oZWFkZXJJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgIGNhY2hlW2xpLmxhc3RJbmRleCArIDFdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlW2ldICYmIGxpLnR5cGUgIT09ICdvcHRncm91cC1sYWJlbCcpIGNhY2hlQXJyLnB1c2goaSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNhY2hlTGVuID0gY2FjaGVBcnIubGVuZ3RoOyBpIDwgY2FjaGVMZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBjYWNoZUFycltpXSxcclxuICAgICAgICAgICAgICAgIHByZXZJbmRleCA9IGNhY2hlQXJyW2kgLSAxXSxcclxuICAgICAgICAgICAgICAgIGxpID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5kYXRhW2luZGV4XSxcclxuICAgICAgICAgICAgICAgIGxpUHJldiA9IHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZGF0YVtwcmV2SW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxpLnR5cGUgIT09ICdkaXZpZGVyJyB8fCAobGkudHlwZSA9PT0gJ2RpdmlkZXInICYmIGxpUHJldiAmJiBsaVByZXYudHlwZSAhPT0gJ2RpdmlkZXInICYmIGNhY2hlTGVuIC0gMSAhPT0gaSkpIHtcclxuICAgICAgICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5zZWFyY2guZGF0YS5wdXNoKGxpKTtcclxuICAgICAgICAgICAgICBzZWFyY2hNYXRjaC5wdXNoKHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZWxlbWVudHNbaW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGxpLmhhc093blByb3BlcnR5KCdvcmlnaW5hbEluZGV4JykpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnNlYXJjaC5tYXAubmV3SW5kZXhbbGkub3JpZ2luYWxJbmRleF0gPSBzZWFyY2hNYXRjaC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLm1hcC5vcmlnaW5hbEluZGV4W3NlYXJjaE1hdGNoLmxlbmd0aCAtIDFdID0gbGkub3JpZ2luYWxJbmRleDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGF0LmFjdGl2ZUluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgdGhhdC5ub1Njcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICB0aGF0LiRtZW51SW5uZXIuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLmVsZW1lbnRzID0gc2VhcmNoTWF0Y2g7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVZpZXcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgaWYgKCFzZWFyY2hNYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbm9SZXN1bHRzLmNsYXNzTmFtZSA9ICduby1yZXN1bHRzJztcclxuICAgICAgICAgICAgbm9SZXN1bHRzLmlubmVySFRNTCA9IHRoYXQub3B0aW9ucy5ub25lUmVzdWx0c1RleHQucmVwbGFjZSgnezB9JywgJ1wiJyArIGh0bWxFc2NhcGUoc2VhcmNoVmFsdWUpICsgJ1wiJyk7XHJcbiAgICAgICAgICAgIHRoYXQuJG1lbnVJbm5lclswXS5maXJzdENoaWxkLmFwcGVuZENoaWxkKG5vUmVzdWx0cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVZpZXcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZWFyY2hTdHlsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxpdmVTZWFyY2hTdHlsZSB8fCAnY29udGFpbnMnO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAgIC52YWwodmFsdWUpXHJcbiAgICAgICAgICAudHJpZ2dlck5hdGl2ZSgnY2hhbmdlJyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50LnZhbCgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNoYW5nZUFsbDogZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHJldHVybjtcclxuICAgICAgaWYgKHR5cGVvZiBzdGF0dXMgPT09ICd1bmRlZmluZWQnKSBzdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgdmFyICRzZWxlY3RPcHRpb25zID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb24nKSxcclxuICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWQgPSAwLFxyXG4gICAgICAgICAgY3VycmVudFNlbGVjdGVkID0gMCxcclxuICAgICAgICAgIHByZXZWYWx1ZSA9IGdldFNlbGVjdFZhbHVlcyh0aGlzLiRlbGVtZW50WzBdKTtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2JzLXNlbGVjdC1oaWRkZW4nKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBsaURhdGEgPSB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbaV0sXHJcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5tYXAub3JpZ2luYWxJbmRleFtpXSwgLy8gZmFzdGVyIHRoYW4gJChsaSkuZGF0YSgnb3JpZ2luYWxJbmRleCcpXHJcbiAgICAgICAgICAgIG9wdGlvbiA9ICRzZWxlY3RPcHRpb25zW2luZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbiAmJiAhb3B0aW9uLmRpc2FibGVkICYmIGxpRGF0YS50eXBlICE9PSAnZGl2aWRlcicpIHtcclxuICAgICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHByZXZpb3VzU2VsZWN0ZWQrKztcclxuICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHN0YXR1cztcclxuICAgICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIGN1cnJlbnRTZWxlY3RlZCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnYnMtc2VsZWN0LWhpZGRlbicpO1xyXG5cclxuICAgICAgaWYgKHByZXZpb3VzU2VsZWN0ZWQgPT09IGN1cnJlbnRTZWxlY3RlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5zZXRPcHRpb25TdGF0dXMoKTtcclxuXHJcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoKTtcclxuXHJcbiAgICAgIGNoYW5nZWRBcmd1bWVudHMgPSBbbnVsbCwgbnVsbCwgcHJldlZhbHVlXTtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAudHJpZ2dlck5hdGl2ZSgnY2hhbmdlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbGVjdEFsbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VBbGwodHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRlc2VsZWN0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUFsbChmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRvZ2dsZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG5cclxuICAgICAgaWYgKGUpIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLiRidXR0b24udHJpZ2dlcignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknKTtcclxuICAgIH0sXHJcblxyXG4gICAga2V5ZG93bjogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgIGlzVG9nZ2xlID0gJHRoaXMuaGFzQ2xhc3MoJ2Ryb3Bkb3duLXRvZ2dsZScpLFxyXG4gICAgICAgICAgJHBhcmVudCA9IGlzVG9nZ2xlID8gJHRoaXMuY2xvc2VzdCgnLmRyb3Bkb3duJykgOiAkdGhpcy5jbG9zZXN0KFNlbGVjdG9yLk1FTlUpLFxyXG4gICAgICAgICAgdGhhdCA9ICRwYXJlbnQuZGF0YSgndGhpcycpLFxyXG4gICAgICAgICAgJGl0ZW1zID0gdGhhdC5maW5kTGlzKCksXHJcbiAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgIGlzQWN0aXZlLFxyXG4gICAgICAgICAgbGlBY3RpdmUsXHJcbiAgICAgICAgICBhY3RpdmVMaSxcclxuICAgICAgICAgIG9mZnNldCxcclxuICAgICAgICAgIHVwZGF0ZVNjcm9sbCA9IGZhbHNlLFxyXG4gICAgICAgICAgZG93bk9uVGFiID0gZS53aGljaCA9PT0ga2V5Q29kZXMuVEFCICYmICFpc1RvZ2dsZSAmJiAhdGhhdC5vcHRpb25zLnNlbGVjdE9uVGFiLFxyXG4gICAgICAgICAgaXNBcnJvd0tleSA9IFJFR0VYUF9BUlJPVy50ZXN0KGUud2hpY2gpIHx8IGRvd25PblRhYixcclxuICAgICAgICAgIHNjcm9sbFRvcCA9IHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3AsXHJcbiAgICAgICAgICBpc1ZpcnR1YWwgPSB0aGF0LmlzVmlydHVhbCgpLFxyXG4gICAgICAgICAgcG9zaXRpb24wID0gaXNWaXJ0dWFsID09PSB0cnVlID8gdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjAgOiAwO1xyXG5cclxuICAgICAgaXNBY3RpdmUgPSB0aGF0LiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVyk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgIWlzQWN0aXZlICYmXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgaXNBcnJvd0tleSB8fFxyXG4gICAgICAgICAgKGUud2hpY2ggPj0gNDggJiYgZS53aGljaCA8PSA1NykgfHxcclxuICAgICAgICAgIChlLndoaWNoID49IDk2ICYmIGUud2hpY2ggPD0gMTA1KSB8fFxyXG4gICAgICAgICAgKGUud2hpY2ggPj0gNjUgJiYgZS53aGljaCA8PSA5MClcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoYXQuJGJ1dHRvbi50cmlnZ2VyKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuRVNDQVBFICYmIGlzQWN0aXZlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoYXQuJGJ1dHRvbi50cmlnZ2VyKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc0Fycm93S2V5KSB7IC8vIGlmIHVwIG9yIGRvd25cclxuICAgICAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gJGl0ZW1zLmluZGV4Ly5maWx0ZXIgaXMgdG9vIHNsb3cgd2l0aCBhIGxhcmdlIGxpc3QgYW5kIG5vIHZpcnR1YWwgc2Nyb2xsXHJcbiAgICAgICAgaW5kZXggPSBpc1ZpcnR1YWwgPT09IHRydWUgPyAkaXRlbXMuaW5kZXgoJGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpKSA6IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQubWFwLm5ld0luZGV4W3RoYXQuYWN0aXZlSW5kZXhdO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkgaW5kZXggPSAtMTtcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgbGlBY3RpdmUgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzW2luZGV4ICsgcG9zaXRpb24wXTtcclxuICAgICAgICAgIGxpQWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgaWYgKGxpQWN0aXZlLmZpcnN0Q2hpbGQpIGxpQWN0aXZlLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuQVJST1dfVVApIHsgLy8gdXBcclxuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIGluZGV4LS07XHJcbiAgICAgICAgICBpZiAoaW5kZXggKyBwb3NpdGlvbjAgPCAwKSBpbmRleCArPSAkaXRlbXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgIGlmICghdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHRbaW5kZXggKyBwb3NpdGlvbjBdKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQuc2xpY2UoMCwgaW5kZXggKyBwb3NpdGlvbjApLmxhc3RJbmRleE9mKHRydWUpIC0gcG9zaXRpb24wO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSBpbmRleCA9ICRpdGVtcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuQVJST1dfRE9XTiB8fCBkb3duT25UYWIpIHsgLy8gZG93blxyXG4gICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgIGlmIChpbmRleCArIHBvc2l0aW9uMCA+PSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodC5sZW5ndGgpIGluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAoIXRoYXQuc2VsZWN0cGlja2VyLnZpZXcuY2FuSGlnaGxpZ2h0W2luZGV4ICsgcG9zaXRpb24wXSkge1xyXG4gICAgICAgICAgICBpbmRleCA9IGluZGV4ICsgMSArIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcuY2FuSGlnaGxpZ2h0LnNsaWNlKGluZGV4ICsgcG9zaXRpb24wICsgMSkuaW5kZXhPZih0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGxpQWN0aXZlSW5kZXggPSBwb3NpdGlvbjAgKyBpbmRleDtcclxuXHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IGtleUNvZGVzLkFSUk9XX1VQKSB7IC8vIHVwXHJcbiAgICAgICAgICAvLyBzY3JvbGwgdG8gYm90dG9tIGFuZCBoaWdobGlnaHQgbGFzdCBvcHRpb25cclxuICAgICAgICAgIGlmIChwb3NpdGlvbjAgPT09IDAgJiYgaW5kZXggPT09ICRpdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3AgPSB0aGF0LiRtZW51SW5uZXJbMF0uc2Nyb2xsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGlBY3RpdmVJbmRleCA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUxpID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2xpQWN0aXZlSW5kZXhdO1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBhY3RpdmVMaS5wb3NpdGlvbiAtIGFjdGl2ZUxpLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVNjcm9sbCA9IG9mZnNldCA8IHNjcm9sbFRvcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT09IGtleUNvZGVzLkFSUk9XX0RPV04gfHwgZG93bk9uVGFiKSB7IC8vIGRvd25cclxuICAgICAgICAgIC8vIHNjcm9sbCB0byB0b3AgYW5kIGhpZ2hsaWdodCBmaXJzdCBvcHRpb25cclxuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGF0LiRtZW51SW5uZXJbMF0uc2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxpQWN0aXZlSW5kZXggPSAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWN0aXZlTGkgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbbGlBY3RpdmVJbmRleF07XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGFjdGl2ZUxpLnBvc2l0aW9uIC0gdGhhdC5zaXplSW5mby5tZW51SW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB1cGRhdGVTY3JvbGwgPSBvZmZzZXQgPiBzY3JvbGxUb3A7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaUFjdGl2ZSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHNbbGlBY3RpdmVJbmRleF07XHJcblxyXG4gICAgICAgIGlmIChsaUFjdGl2ZSkge1xyXG4gICAgICAgICAgbGlBY3RpdmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICBpZiAobGlBY3RpdmUuZmlyc3RDaGlsZCkgbGlBY3RpdmUuZmlyc3RDaGlsZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoYXQuYWN0aXZlSW5kZXggPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50Lm1hcC5vcmlnaW5hbEluZGV4W2xpQWN0aXZlSW5kZXhdO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUgPSBsaUFjdGl2ZTtcclxuXHJcbiAgICAgICAgaWYgKHVwZGF0ZVNjcm9sbCkgdGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCA9IG9mZnNldDtcclxuXHJcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgICB0aGF0LiRzZWFyY2hib3guZm9jdXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHRoaXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgKCEkdGhpcy5pcygnaW5wdXQnKSAmJiAhUkVHRVhQX1RBQl9PUl9FU0NBUEUudGVzdChlLndoaWNoKSkgfHxcclxuICAgICAgICAoZS53aGljaCA9PT0ga2V5Q29kZXMuU1BBQ0UgJiYgdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5rZXlIaXN0b3J5KVxyXG4gICAgICApIHtcclxuICAgICAgICB2YXIgc2VhcmNoTWF0Y2gsXHJcbiAgICAgICAgICAgIG1hdGNoZXMgPSBbXSxcclxuICAgICAgICAgICAga2V5SGlzdG9yeTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5rZXlkb3duLmtleUhpc3RvcnkgKz0ga2V5Q29kZU1hcFtlLndoaWNoXTtcclxuXHJcbiAgICAgICAgaWYgKHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ucmVzZXRLZXlIaXN0b3J5LmNhbmNlbCkgY2xlYXJUaW1lb3V0KHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ucmVzZXRLZXlIaXN0b3J5LmNhbmNlbCk7XHJcbiAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5yZXNldEtleUhpc3RvcnkuY2FuY2VsID0gdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5yZXNldEtleUhpc3Rvcnkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAga2V5SGlzdG9yeSA9IHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ua2V5SGlzdG9yeTtcclxuXHJcbiAgICAgICAgLy8gaWYgYWxsIGxldHRlcnMgYXJlIHRoZSBzYW1lLCBzZXQga2V5SGlzdG9yeSB0byBqdXN0IHRoZSBmaXJzdCBjaGFyYWN0ZXIgd2hlbiBzZWFyY2hpbmdcclxuICAgICAgICBpZiAoL14oLilcXDErJC8udGVzdChrZXlIaXN0b3J5KSkge1xyXG4gICAgICAgICAga2V5SGlzdG9yeSA9IGtleUhpc3RvcnkuY2hhckF0KDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluZCBtYXRjaGVzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBsaSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpXSxcclxuICAgICAgICAgICAgICBoYXNNYXRjaDtcclxuXHJcbiAgICAgICAgICBoYXNNYXRjaCA9IHN0cmluZ1NlYXJjaChsaSwga2V5SGlzdG9yeSwgJ3N0YXJ0c1dpdGgnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICBpZiAoaGFzTWF0Y2ggJiYgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHRbaV0pIHtcclxuICAgICAgICAgICAgbGkuaW5kZXggPSBpO1xyXG4gICAgICAgICAgICBtYXRjaGVzLnB1c2gobGkub3JpZ2luYWxJbmRleCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGgpIHtcclxuICAgICAgICAgIHZhciBtYXRjaEluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICAkaXRlbXMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgLy8gZWl0aGVyIG9ubHkgb25lIGtleSBoYXMgYmVlbiBwcmVzc2VkIG9yIHRoZXkgYXJlIGFsbCB0aGUgc2FtZSBrZXlcclxuICAgICAgICAgIGlmIChrZXlIaXN0b3J5Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBtYXRjaEluZGV4ID0gbWF0Y2hlcy5pbmRleE9mKHRoYXQuYWN0aXZlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1hdGNoSW5kZXggPT09IC0xIHx8IG1hdGNoSW5kZXggPT09IG1hdGNoZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgIG1hdGNoSW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG1hdGNoSW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNlYXJjaE1hdGNoID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5tYXAubmV3SW5kZXhbbWF0Y2hlc1ttYXRjaEluZGV4XV07XHJcblxyXG4gICAgICAgICAgYWN0aXZlTGkgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbc2VhcmNoTWF0Y2hdO1xyXG5cclxuICAgICAgICAgIGlmIChzY3JvbGxUb3AgLSBhY3RpdmVMaS5wb3NpdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gYWN0aXZlTGkucG9zaXRpb24gLSBhY3RpdmVMaS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNjcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBhY3RpdmVMaS5wb3NpdGlvbiAtIHRoYXQuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgb3B0aW9uIGlzIGFscmVhZHkgdmlzaWJsZSBhdCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24sIGp1c3Qga2VlcCBpdCB0aGUgc2FtZVxyXG4gICAgICAgICAgICB1cGRhdGVTY3JvbGwgPSBhY3RpdmVMaS5wb3NpdGlvbiA+IHNjcm9sbFRvcCArIHRoYXQuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxpQWN0aXZlID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50c1tzZWFyY2hNYXRjaF07XHJcbiAgICAgICAgICBsaUFjdGl2ZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgIGlmIChsaUFjdGl2ZS5maXJzdENoaWxkKSBsaUFjdGl2ZS5maXJzdENoaWxkLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgdGhhdC5hY3RpdmVJbmRleCA9IG1hdGNoZXNbbWF0Y2hJbmRleF07XHJcblxyXG4gICAgICAgICAgbGlBY3RpdmUuZmlyc3RDaGlsZC5mb2N1cygpO1xyXG5cclxuICAgICAgICAgIGlmICh1cGRhdGVTY3JvbGwpIHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3AgPSBvZmZzZXQ7XHJcblxyXG4gICAgICAgICAgJHRoaXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNlbGVjdCBmb2N1c2VkIG9wdGlvbiBpZiBcIkVudGVyXCIsIFwiU3BhY2ViYXJcIiBvciBcIlRhYlwiICh3aGVuIHNlbGVjdE9uVGFiIGlzIHRydWUpIGFyZSBwcmVzc2VkIGluc2lkZSB0aGUgbWVudS5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGlzQWN0aXZlICYmXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgKGUud2hpY2ggPT09IGtleUNvZGVzLlNQQUNFICYmICF0aGF0LnNlbGVjdHBpY2tlci5rZXlkb3duLmtleUhpc3RvcnkpIHx8XHJcbiAgICAgICAgICBlLndoaWNoID09PSBrZXlDb2Rlcy5FTlRFUiB8fFxyXG4gICAgICAgICAgKGUud2hpY2ggPT09IGtleUNvZGVzLlRBQiAmJiB0aGF0Lm9wdGlvbnMuc2VsZWN0T25UYWIpXHJcbiAgICAgICAgKVxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAoZS53aGljaCAhPT0ga2V5Q29kZXMuU1BBQ0UpIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGF0Lm9wdGlvbnMubGl2ZVNlYXJjaCB8fCBlLndoaWNoICE9PSBrZXlDb2Rlcy5TUEFDRSkge1xyXG4gICAgICAgICAgdGhhdC4kbWVudUlubmVyLmZpbmQoJy5hY3RpdmUgYScpLnRyaWdnZXIoJ2NsaWNrJywgdHJ1ZSk7IC8vIHJldGFpbiBhY3RpdmUgY2xhc3NcclxuICAgICAgICAgICR0aGlzLmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0Lm9wdGlvbnMubGl2ZVNlYXJjaCkge1xyXG4gICAgICAgICAgICAvLyBQcmV2ZW50IHNjcmVlbiBmcm9tIHNjcm9sbGluZyBpZiB0aGUgdXNlciBoaXRzIHRoZSBzcGFjZWJhclxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vIEZpeGVzIHNwYWNlYmFyIHNlbGVjdGlvbiBvZiBkcm9wZG93biBpdGVtcyBpbiBGRiAmIElFXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmRhdGEoJ3NwYWNlU2VsZWN0JywgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vYmlsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdtb2JpbGUtZGV2aWNlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gdXBkYXRlIG9wdGlvbnMgaWYgZGF0YSBhdHRyaWJ1dGVzIGhhdmUgYmVlbiBjaGFuZ2VkXHJcbiAgICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB0aGlzLiRlbGVtZW50LmRhdGEoKSk7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IGNvbmZpZztcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0cGlja2VyLm1haW4ubWFwLm5ld0luZGV4ID0ge307XHJcbiAgICAgIHRoaXMuc2VsZWN0cGlja2VyLm1haW4ubWFwLm9yaWdpbmFsSW5kZXggPSB7fTtcclxuICAgICAgdGhpcy5jcmVhdGVMaSgpO1xyXG4gICAgICB0aGlzLmNoZWNrRGlzYWJsZWQoKTtcclxuICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgdGhpcy5zZXRTdHlsZSgpO1xyXG4gICAgICB0aGlzLnNldFdpZHRoKCk7XHJcblxyXG4gICAgICB0aGlzLnNldFNpemUodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3JlZnJlc2hlZCcgKyBFVkVOVF9LRVkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQuaGlkZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQuc2hvdygpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy4kbmV3RWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLiRuZXdFbGVtZW50LmJlZm9yZSh0aGlzLiRlbGVtZW50KS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLiRic0NvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuJGJzQ29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAub2ZmKEVWRU5UX0tFWSlcclxuICAgICAgICAucmVtb3ZlRGF0YSgnc2VsZWN0cGlja2VyJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2JzLXNlbGVjdC1oaWRkZW4gc2VsZWN0cGlja2VyJyk7XHJcblxyXG4gICAgICAkKHdpbmRvdykub2ZmKEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIFNFTEVDVFBJQ0tFUiBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gIGZ1bmN0aW9uIFBsdWdpbiAob3B0aW9uKSB7XHJcbiAgICAvLyBnZXQgdGhlIGFyZ3Mgb2YgdGhlIG91dGVyIGZ1bmN0aW9uLi5cclxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgLy8gVGhlIGFyZ3VtZW50cyBvZiB0aGUgZnVuY3Rpb24gYXJlIGV4cGxpY2l0bHkgcmUtZGVmaW5lZCBmcm9tIHRoZSBhcmd1bWVudCBsaXN0LCBiZWNhdXNlIHRoZSBzaGlmdCBjYXVzZXMgdGhlbVxyXG4gICAgLy8gdG8gZ2V0IGxvc3QvY29ycnVwdGVkIGluIGFuZHJvaWQgMi4zIGFuZCBJRTkgIzcxNSAjNzc1XHJcbiAgICB2YXIgX29wdGlvbiA9IG9wdGlvbjtcclxuXHJcbiAgICBbXS5zaGlmdC5hcHBseShhcmdzKTtcclxuXHJcbiAgICAvLyBpZiB0aGUgdmVyc2lvbiB3YXMgbm90IHNldCBzdWNjZXNzZnVsbHlcclxuICAgIGlmICghdmVyc2lvbi5zdWNjZXNzKSB7XHJcbiAgICAgIC8vIHRyeSB0byByZXRyZWl2ZSBpdCBhZ2FpblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHZlcnNpb24uZnVsbCA9ICgkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLlZFUlNJT04gfHwgJycpLnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgLy8gZmFsbCBiYWNrIHRvIHVzZSBCb290c3RyYXBWZXJzaW9uXHJcbiAgICAgICAgdmVyc2lvbi5mdWxsID0gU2VsZWN0cGlja2VyLkJvb3RzdHJhcFZlcnNpb24uc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2ZXJzaW9uLm1ham9yID0gdmVyc2lvbi5mdWxsWzBdO1xyXG4gICAgICB2ZXJzaW9uLnN1Y2Nlc3MgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPT09ICc0Jykge1xyXG4gICAgICAgIGNsYXNzTmFtZXMuRElWSURFUiA9ICdkcm9wZG93bi1kaXZpZGVyJztcclxuICAgICAgICBjbGFzc05hbWVzLlNIT1cgPSAnc2hvdyc7XHJcbiAgICAgICAgY2xhc3NOYW1lcy5CVVRUT05DTEFTUyA9ICdidG4tbGlnaHQnO1xyXG4gICAgICAgIFNlbGVjdHBpY2tlci5ERUZBVUxUUy5zdHlsZSA9IGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MgPSAnYnRuLWxpZ2h0JztcclxuICAgICAgICBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgPSAncG9wb3Zlci1oZWFkZXInO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHZhbHVlO1xyXG4gICAgdmFyIGNoYWluID0gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgaWYgKCR0aGlzLmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnc2VsZWN0cGlja2VyJyksXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0eXBlb2YgX29wdGlvbiA9PSAnb2JqZWN0JyAmJiBfb3B0aW9uO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgU2VsZWN0cGlja2VyLkRFRkFVTFRTLCAkLmZuLnNlbGVjdHBpY2tlci5kZWZhdWx0cyB8fCB7fSwgJHRoaXMuZGF0YSgpLCBvcHRpb25zKTtcclxuICAgICAgICAgIGNvbmZpZy50ZW1wbGF0ZSA9ICQuZXh0ZW5kKHt9LCBTZWxlY3RwaWNrZXIuREVGQVVMVFMudGVtcGxhdGUsICgkLmZuLnNlbGVjdHBpY2tlci5kZWZhdWx0cyA/ICQuZm4uc2VsZWN0cGlja2VyLmRlZmF1bHRzLnRlbXBsYXRlIDoge30pLCAkdGhpcy5kYXRhKCkudGVtcGxhdGUsIG9wdGlvbnMudGVtcGxhdGUpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YSgnc2VsZWN0cGlja2VyJywgKGRhdGEgPSBuZXcgU2VsZWN0cGlja2VyKHRoaXMsIGNvbmZpZykpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgIGRhdGEub3B0aW9uc1tpXSA9IG9wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgX29wdGlvbiA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKGRhdGFbX29wdGlvbl0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGFbX29wdGlvbl0uYXBwbHkoZGF0YSwgYXJncyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEub3B0aW9uc1tfb3B0aW9uXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEFzc2lnbm1lbnRcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGNoYWluO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIG9sZCA9ICQuZm4uc2VsZWN0cGlja2VyO1xyXG4gICQuZm4uc2VsZWN0cGlja2VyID0gUGx1Z2luO1xyXG4gICQuZm4uc2VsZWN0cGlja2VyLkNvbnN0cnVjdG9yID0gU2VsZWN0cGlja2VyO1xyXG5cclxuICAvLyBTRUxFQ1RQSUNLRVIgTk8gQ09ORkxJQ1RcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAkLmZuLnNlbGVjdHBpY2tlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5zZWxlY3RwaWNrZXIgPSBvbGQ7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9mZigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScpXHJcbiAgICAub24oJ2tleWRvd24nICsgRVZFTlRfS0VZLCAnLmJvb3RzdHJhcC1zZWxlY3QgW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0sIC5ib290c3RyYXAtc2VsZWN0IFtyb2xlPVwibGlzdGJveFwiXSwgLmJvb3RzdHJhcC1zZWxlY3QgLmJzLXNlYXJjaGJveCBpbnB1dCcsIFNlbGVjdHBpY2tlci5wcm90b3R5cGUua2V5ZG93bilcclxuICAgIC5vbignZm9jdXNpbi5tb2RhbCcsICcuYm9vdHN0cmFwLXNlbGVjdCBbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSwgLmJvb3RzdHJhcC1zZWxlY3QgW3JvbGU9XCJsaXN0Ym94XCJdLCAuYm9vdHN0cmFwLXNlbGVjdCAuYnMtc2VhcmNoYm94IGlucHV0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0pO1xyXG5cclxuICAvLyBTRUxFQ1RQSUNLRVIgREFUQS1BUElcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cclxuICAkKHdpbmRvdykub24oJ2xvYWQnICsgRVZFTlRfS0VZICsgJy5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5zZWxlY3RwaWNrZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICRzZWxlY3RwaWNrZXIgPSAkKHRoaXMpO1xyXG4gICAgICBQbHVnaW4uY2FsbCgkc2VsZWN0cGlja2VyLCAkc2VsZWN0cGlja2VyLmRhdGEoKSk7XHJcbiAgICB9KVxyXG4gIH0pO1xyXG59KShqUXVlcnkpO1xyXG5cclxuXHJcbn0pKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXNlbGVjdC9kaXN0L2pzL2Jvb3RzdHJhcC1zZWxlY3QuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC1zZWxlY3QvZGlzdC9qcy9ib290c3RyYXAtc2VsZWN0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTEiXSwic291cmNlUm9vdCI6IiJ9