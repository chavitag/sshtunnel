(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/bootstrap-select"],{

/***/ "./node_modules/bootstrap-select/dist/js/bootstrap-select.js":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-select/dist/js/bootstrap-select.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Bootstrap-select v1.13.10 (https://developer.snapappointments.com/bootstrap-select)
 *
 * Copyright 2012-2019 SnapAppointments, LLC
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
  } else {}
}(this, function (jQuery) {

(function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  var uriAttrs = [
    'background',
    'cite',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href'
  ];

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', 'tabindex', 'style', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  }

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute (attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase()

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN))
      }

      return true
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp
    })

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true
      }
    }

    return false
  }

  function sanitizeHtml (unsafeElements, whiteList, sanitizeFn) {
    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeElements);
    }

    var whitelistKeys = Object.keys(whiteList);

    for (var i = 0, len = unsafeElements.length; i < len; i++) {
      var elements = unsafeElements[i].querySelectorAll('*');

      for (var j = 0, len2 = elements.length; j < len2; j++) {
        var el = elements[j];
        var elName = el.nodeName.toLowerCase();

        if (whitelistKeys.indexOf(elName) === -1) {
          el.parentNode.removeChild(el);

          continue;
        }

        var attributeList = [].slice.call(el.attributes);
        var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

        for (var k = 0, len3 = attributeList.length; k < len3; k++) {
          var attr = attributeList[k];

          if (!allowedAttribute(attr, whitelistedAttributes)) {
            el.removeAttribute(attr.nodeName);
          }
        }
      }
    }
  }

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
                classes = Array.prototype.slice.call(arguments).join(' ');
                return $elem.addClass(classes);
              },
              remove: function (classes) {
                classes = Array.prototype.slice.call(arguments).join(' ');
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

  testElement.classList.add('c1', 'c2');

  if (!testElement.classList.contains('c2')) {
    var _add = DOMTokenList.prototype.add,
        _remove = DOMTokenList.prototype.remove;

    DOMTokenList.prototype.add = function () {
      Array.prototype.forEach.call(arguments, _add.bind(this));
    }

    DOMTokenList.prototype.remove = function () {
      Array.prototype.forEach.call(arguments, _remove.bind(this));
    }
  }

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

  if (HTMLSelectElement && !HTMLSelectElement.prototype.hasOwnProperty('selectedOptions')) {
    Object.defineProperty(HTMLSelectElement.prototype, 'selectedOptions', {
      get: function () {
        return this.querySelectorAll(':checked');
      }
    });
  }

  function getSelectedOptions (select, ignoreDisabled) {
    var selectedOptions = select.selectedOptions,
        options = [],
        opt;

    if (ignoreDisabled) {
      for (var i = 0, len = selectedOptions.length; i < len; i++) {
        opt = selectedOptions[i];

        if (!(opt.disabled || opt.parentNode.tagName === 'OPTGROUP' && opt.parentNode.disabled)) {
          options.push(opt);
        }
      }

      return options;
    }

    return selectedOptions;
  }

  // much faster than $.val()
  function getSelectValues (select, selectedOptions) {
    var value = [],
        options = selectedOptions || select.selectedOptions,
        opt;

    for (var i = 0, len = options.length; i < len; i++) {
      opt = options[i];

      if (!(opt.disabled || opt.parentNode.tagName === 'OPTGROUP' && opt.parentNode.disabled)) {
        value.push(opt.value || opt.text);
      }
    }

    if (!select.multiple) {
      return !value.length ? null : value[0];
    }

    return value;
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
          'display',
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
        if (stringType === 'display') {
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
    // do nothing
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
    POPOVERHEADER: 'popover-title',
    ICONBASE: 'glyphicon',
    TICKICON: 'glyphicon-ok'
  }

  var Selector = {
    MENU: '.' + classNames.MENU
  }

  var elementTemplates = {
    span: document.createElement('span'),
    i: document.createElement('i'),
    subtext: document.createElement('small'),
    a: document.createElement('a'),
    li: document.createElement('li'),
    whitespace: document.createTextNode('\u00A0'),
    fragment: document.createDocumentFragment()
  }

  elementTemplates.a.setAttribute('role', 'option');
  elementTemplates.subtext.className = 'text-muted';

  elementTemplates.text = elementTemplates.span.cloneNode(false);
  elementTemplates.text.className = 'text';

  elementTemplates.checkMark = elementTemplates.span.cloneNode(false);

  var REGEXP_ARROW = new RegExp(keyCodes.ARROW_UP + '|' + keyCodes.ARROW_DOWN);
  var REGEXP_TAB_OR_ESCAPE = new RegExp('^' + keyCodes.TAB + '$|' + keyCodes.ESCAPE);

  var generateOption = {
    li: function (content, classes, optgroup) {
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
    },

    a: function (text, classes, inline) {
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
    },

    text: function (options, useFragment) {
      var textElement = elementTemplates.text.cloneNode(false),
          subtextElement,
          iconElement;

      if (options.content) {
        textElement.innerHTML = options.content;
      } else {
        textElement.textContent = options.text;

        if (options.icon) {
          var whitespace = elementTemplates.whitespace.cloneNode(false);

          // need to use <i> for icons in the button to prevent a breaking change
          // note: switch to span in next major release
          iconElement = (useFragment === true ? elementTemplates.i : elementTemplates.span).cloneNode(false);
          iconElement.className = options.iconBase + ' ' + options.icon;

          elementTemplates.fragment.appendChild(iconElement);
          elementTemplates.fragment.appendChild(whitespace);
        }

        if (options.subtext) {
          subtextElement = elementTemplates.subtext.cloneNode(false);
          subtextElement.textContent = options.subtext;
          textElement.appendChild(subtextElement);
        }
      }

      if (useFragment === true) {
        while (textElement.childNodes.length > 0) {
          elementTemplates.fragment.appendChild(textElement.childNodes[0]);
        }
      } else {
        elementTemplates.fragment.appendChild(textElement);
      }

      return elementTemplates.fragment;
    },

    label: function (options) {
      var textElement = elementTemplates.text.cloneNode(false),
          subtextElement,
          iconElement;

      textElement.innerHTML = options.label;

      if (options.icon) {
        var whitespace = elementTemplates.whitespace.cloneNode(false);

        iconElement = elementTemplates.span.cloneNode(false);
        iconElement.className = options.iconBase + ' ' + options.icon;

        elementTemplates.fragment.appendChild(iconElement);
        elementTemplates.fragment.appendChild(whitespace);
      }

      if (options.subtext) {
        subtextElement = elementTemplates.subtext.cloneNode(false);
        subtextElement.textContent = options.subtext;
        textElement.appendChild(subtextElement);
      }

      elementTemplates.fragment.appendChild(textElement);

      return elementTemplates.fragment;
    }
  }

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
      main: {},
      search: {},
      current: {}, // current changes if a search is in progress
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

  Selectpicker.VERSION = '1.13.10';

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
    iconBase: classNames.ICONBASE,
    tickIcon: classNames.TICKICON,
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
    display: false,
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      selectId++;
      this.selectId = 'bs-select-' + selectId;

      this.$element[0].classList.add('bs-select-hidden');

      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');

      if (this.$element[0].classList.contains('show-tick')) {
        this.options.showTick = true;
      }

      this.$newElement = this.createDropdown();
      this.$element
        .after(this.$newElement)
        .prependTo(this.$newElement);

      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children(Selector.MENU);
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      this.$element[0].classList.remove('bs-select-hidden');

      if (this.options.dropdownAlignRight === true) this.$menu[0].classList.add(classNames.MENURIGHT);

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
      }

      this.checkDisabled();
      this.clickListener();

      if (this.options.liveSearch) {
        this.liveSearchListener();
        this.focusedParent = this.$searchbox[0];
      } else {
        this.focusedParent = this.$menuInner[0];
      }

      this.setStyle();
      this.render();
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
          that.$element.trigger('hide' + EVENT_KEY, e);
        },
        'hidden.bs.dropdown': function (e) {
          that.$element.trigger('hidden' + EVENT_KEY, e);
        },
        'show.bs.dropdown': function (e) {
          that.$element.trigger('show' + EVENT_KEY, e);
        },
        'shown.bs.dropdown': function (e) {
          that.$element.trigger('shown' + EVENT_KEY, e);
        }
      });

      if (that.$element[0].hasAttribute('required')) {
        this.$element.on('invalid' + EVENT_KEY, function () {
          that.$button[0].classList.add('bs-invalid');

          that.$element
            .on('shown' + EVENT_KEY + '.invalid', function () {
              that.$element
                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                .off('shown' + EVENT_KEY + '.invalid');
            })
            .on('rendered' + EVENT_KEY, function () {
              // if select is no longer invalid, remove the bs-invalid class
              if (this.validity.valid) that.$button[0].classList.remove('bs-invalid');
              that.$element.off('rendered' + EVENT_KEY);
            });

          that.$button.on('blur' + EVENT_KEY, function () {
            that.$element.trigger('focus').trigger('blur');
            that.$button.off('blur' + EVENT_KEY);
          });
        });
      }

      setTimeout(function () {
        that.createLi();
        that.$element.trigger('loaded' + EVENT_KEY);
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple or showTick option is set, then add the show-tick class
      var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
          multiselectable = this.multiple ? ' aria-multiselectable="true"' : '',
          inputGroup = '',
          autofocus = this.autofocus ? ' autofocus' : '';

      if (version.major < 4 && this.$element.parent().hasClass('input-group')) {
        inputGroup = ' input-group-btn';
      }

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
              ' role="combobox" aria-label="Search" aria-controls="' + this.selectId + '" aria-autocomplete="list">' +
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
        '<div class="dropdown bootstrap-select' + showTick + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" ' + (this.options.display === 'static' ? 'data-display="static"' : '') + 'data-toggle="dropdown"' + autofocus + ' role="combobox" aria-owns="' + this.selectId + '" aria-haspopup="listbox" aria-expanded="false">' +
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
          '<div class="' + classNames.MENU + ' ' + (version.major === '4' ? '' : classNames.SHOW) + '">' +
            header +
            searchbox +
            actionsbox +
            '<div class="inner ' + classNames.SHOW + '" role="listbox" id="' + this.selectId + '" tabindex="-1" ' + multiselectable + '>' +
                '<ul class="' + classNames.MENU + ' inner ' + (version.major === '4' ? classNames.SHOW : '') + '" role="presentation">' +
                '</ul>' +
            '</div>' +
            donebutton +
          '</div>' +
        '</div>';

      return $(drop);
    },

    setPositionData: function () {
      this.selectpicker.view.canHighlight = [];
      this.selectpicker.view.size = 0;

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

        if (canHighlight) {
          this.selectpicker.view.size++;
          li.posinset = this.selectpicker.view.size;
        }

        li.position = (i === 0 ? 0 : this.selectpicker.current.data[i - 1].position) + li.height;
      }
    },

    isVirtual: function () {
      return (this.options.virtualScroll !== false) && (this.selectpicker.main.elements.length >= this.options.virtualScroll) || this.options.virtualScroll === true;
    },

    createView: function (isSearching, setSize, refresh) {
      var that = this,
          scrollTop = 0,
          active = [],
          selected,
          prevActive;

      this.selectpicker.current = isSearching ? this.selectpicker.search : this.selectpicker.main;

      this.setPositionData();

      if (setSize) {
        if (refresh) {
          scrollTop = this.$menuInner[0].scrollTop;
        } else if (!that.multiple) {
          var element = that.$element[0],
              selectedIndex = (element.options[element.selectedIndex] || {}).liIndex;

          if (typeof selectedIndex === 'number' && that.options.size !== false) {
            var selectedData = that.selectpicker.main.data[selectedIndex],
                position = selectedData && selectedData.position;

            if (position) {
              scrollTop = position - ((that.sizeInfo.menuInnerHeight + that.sizeInfo.liHeight) / 2);
            }
          }
        }
      }

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

        that.selectpicker.view.position0 = isVirtual === false ? 0 : (Math.max(0, chunks[firstChunk][0]) || 0);
        that.selectpicker.view.position1 = isVirtual === false ? size : (Math.min(size, chunks[lastChunk][1]) || 0);

        positionIsDifferent = prevPositions[0] !== that.selectpicker.view.position0 || prevPositions[1] !== that.selectpicker.view.position1;

        if (that.activeIndex !== undefined) {
          prevActive = that.selectpicker.main.elements[that.prevActiveIndex];
          active = that.selectpicker.main.elements[that.activeIndex];
          selected = that.selectpicker.main.elements[that.selectedIndex];

          if (init) {
            if (that.activeIndex !== that.selectedIndex) {
              that.defocusItem(active);
            }
            that.activeIndex = undefined;
          }

          if (that.activeIndex && that.activeIndex !== that.selectedIndex) {
            that.defocusItem(selected);
          }
        }

        if (that.prevActiveIndex !== undefined && that.prevActiveIndex !== that.activeIndex && that.prevActiveIndex !== that.selectedIndex) {
          that.defocusItem(prevActive);
        }

        if (init || positionIsDifferent) {
          previousElements = that.selectpicker.view.visibleElements ? that.selectpicker.view.visibleElements.slice() : [];

          if (isVirtual === false) {
            that.selectpicker.view.visibleElements = that.selectpicker.current.elements;
          } else {
            that.selectpicker.view.visibleElements = that.selectpicker.current.elements.slice(that.selectpicker.view.position0, that.selectpicker.view.position1);
          }

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
                elements = that.selectpicker.view.visibleElements,
                toSanitize = [];

            // replace the existing UL with an empty one - this is faster than $.empty()
            menuInner.replaceChild(emptyMenu, menuInner.firstChild);

            for (var i = 0, visibleElementsLen = elements.length; i < visibleElementsLen; i++) {
              var element = elements[i],
                  elText,
                  elementData;

              if (that.options.sanitize) {
                elText = element.lastChild;

                if (elText) {
                  elementData = that.selectpicker.current.data[i + that.selectpicker.view.position0];

                  if (elementData && elementData.content && !elementData.sanitized) {
                    toSanitize.push(elText);
                    elementData.sanitized = true;
                  }
                }
              }

              menuFragment.appendChild(element);
            }

            if (that.options.sanitize && toSanitize.length) {
              sanitizeHtml(toSanitize, that.options.whiteList, that.options.sanitizeFn);
            }

            if (isVirtual === true) {
              marginTop = (that.selectpicker.view.position0 === 0 ? 0 : that.selectpicker.current.data[that.selectpicker.view.position0 - 1].position);
              marginBottom = (that.selectpicker.view.position1 > size - 1 ? 0 : that.selectpicker.current.data[size - 1].position - that.selectpicker.current.data[that.selectpicker.view.position1 - 1].position);

              menuInner.firstChild.style.marginTop = marginTop + 'px';
              menuInner.firstChild.style.marginBottom = marginBottom + 'px';
            } else {
              menuInner.firstChild.style.marginTop = 0;
              menuInner.firstChild.style.marginBottom = 0;
            }

            menuInner.firstChild.appendChild(menuFragment);
          }
        }

        that.prevActiveIndex = that.activeIndex;

        if (!that.options.liveSearch) {
          that.$menuInner.trigger('focus');
        } else if (isSearching && init) {
          var index = 0,
              newActive;

          if (!that.selectpicker.view.canHighlight[index]) {
            index = 1 + that.selectpicker.view.canHighlight.slice(1).indexOf(true);
          }

          newActive = that.selectpicker.view.visibleElements[index];

          that.defocusItem(that.selectpicker.view.currentActive);

          that.activeIndex = (that.selectpicker.current.data[index] || {}).index;

          that.focusItem(newActive);
        }
      }

      $(window)
        .off('resize' + EVENT_KEY + '.' + this.selectId + '.createView')
        .on('resize' + EVENT_KEY + '.' + this.selectId + '.createView', function () {
          var isActive = that.$newElement.hasClass(classNames.SHOW);

          if (isActive) scroll(that.$menuInner[0].scrollTop);
        });
    },

    focusItem: function (li, liData, noStyle) {
      if (li) {
        liData = liData || this.selectpicker.main.data[this.activeIndex];
        var a = li.firstChild;

        if (a) {
          a.setAttribute('aria-setsize', this.selectpicker.view.size);
          a.setAttribute('aria-posinset', liData.posinset);

          if (noStyle !== true) {
            this.focusedParent.setAttribute('aria-activedescendant', a.id);
            li.classList.add('active');
            a.classList.add('active');
          }
        }
      }
    },

    defocusItem: function (li) {
      if (li) {
        li.classList.remove('active');
        if (li.firstChild) li.firstChild.classList.remove('active');
      }
    },

    setPlaceholder: function () {
      var updateIndex = false;

      if (this.options.title && !this.multiple) {
        if (!this.selectpicker.view.titleOption) this.selectpicker.view.titleOption = document.createElement('option');

        // this option doesn't create a new <li> element, but does add a new option at the start,
        // so startIndex should increase to prevent having to check every option for the bs-title-option class
        updateIndex = true;

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

      return updateIndex;
    },

    createLi: function () {
      var that = this,
          iconBase = this.options.iconBase,
          optionSelector = ':not([hidden]):not([data-hidden="true"])',
          mainElements = [],
          mainData = [],
          widestOptionLength = 0,
          optID = 0,
          startIndex = this.setPlaceholder() ? 1 : 0; // append the titleOption if necessary and skip the first option in the loop

      if (this.options.hideDisabled) optionSelector += ':not(:disabled)';

      if ((that.options.showTick || that.multiple) && !elementTemplates.checkMark.parentNode) {
        elementTemplates.checkMark.className = iconBase + ' ' + that.options.tickIcon + ' check-mark';
        elementTemplates.a.appendChild(elementTemplates.checkMark);
      }

      var selectOptions = this.$element[0].querySelectorAll('select > *' + optionSelector);

      function addDivider (config) {
        var previousData = mainData[mainData.length - 1];

        // ensure optgroup doesn't create back-to-back dividers
        if (
          previousData &&
          previousData.type === 'divider' &&
          (previousData.optID || config.optID)
        ) {
          return;
        }

        config = config || {};
        config.type = 'divider';

        mainElements.push(
          generateOption.li(
            false,
            classNames.DIVIDER,
            (config.optID ? config.optID + 'div' : undefined)
          )
        );

        mainData.push(config);
      }

      function addOption (option, config) {
        config = config || {};

        config.divider = option.getAttribute('data-divider') === 'true';

        if (config.divider) {
          addDivider({
            optID: config.optID
          });
        } else {
          var liIndex = mainData.length,
              cssText = option.style.cssText,
              inlineStyle = cssText ? htmlEscape(cssText) : '',
              optionClass = (option.className || '') + (config.optgroupClass || '');

          if (config.optID) optionClass = 'opt ' + optionClass;

          config.text = option.textContent;

          config.content = option.getAttribute('data-content');
          config.tokens = option.getAttribute('data-tokens');
          config.subtext = option.getAttribute('data-subtext');
          config.icon = option.getAttribute('data-icon');
          config.iconBase = iconBase;

          var textElement = generateOption.text(config);
          var liElement = generateOption.li(
            generateOption.a(
              textElement,
              optionClass,
              inlineStyle
            ),
            '',
            config.optID
          );

          if (liElement.firstChild) {
            liElement.firstChild.id = that.selectId + '-' + liIndex;
          }

          mainElements.push(liElement);

          option.liIndex = liIndex;

          config.display = config.content || config.text;
          config.type = 'option';
          config.index = liIndex;
          config.option = option;
          config.disabled = config.disabled || option.disabled;

          mainData.push(config);

          var combinedLength = 0;

          // count the number of characters in the option - not perfect, but should work in most cases
          if (config.display) combinedLength += config.display.length;
          if (config.subtext) combinedLength += config.subtext.length;
          // if there is an icon, ensure this option's width is checked
          if (config.icon) combinedLength += 1;

          if (combinedLength > widestOptionLength) {
            widestOptionLength = combinedLength;

            // guess which option is the widest
            // use this when calculating menu width
            // not perfect, but it's fast, and the width will be updating accordingly when scrolling
            that.selectpicker.view.widestOption = mainElements[mainElements.length - 1];
          }
        }
      }

      function addOptgroup (index, selectOptions) {
        var optgroup = selectOptions[index],
            previous = selectOptions[index - 1],
            next = selectOptions[index + 1],
            options = optgroup.querySelectorAll('option' + optionSelector);

        if (!options.length) return;

        var config = {
              label: htmlEscape(optgroup.label),
              subtext: optgroup.getAttribute('data-subtext'),
              icon: optgroup.getAttribute('data-icon'),
              iconBase: iconBase
            },
            optgroupClass = ' ' + (optgroup.className || ''),
            headerIndex,
            lastIndex;

        optID++;

        if (previous) {
          addDivider({ optID: optID });
        }

        var labelElement = generateOption.label(config);

        mainElements.push(
          generateOption.li(labelElement, 'dropdown-header' + optgroupClass, optID)
        );

        mainData.push({
          display: config.label,
          subtext: config.subtext,
          type: 'optgroup-label',
          optID: optID
        });

        for (var j = 0, len = options.length; j < len; j++) {
          var option = options[j];

          if (j === 0) {
            headerIndex = mainData.length - 1;
            lastIndex = headerIndex + len;
          }

          addOption(option, {
            headerIndex: headerIndex,
            lastIndex: lastIndex,
            optID: optID,
            optgroupClass: optgroupClass,
            disabled: optgroup.disabled
          });
        }

        if (next) {
          addDivider({ optID: optID });
        }
      }

      for (var len = selectOptions.length; startIndex < len; startIndex++) {
        var item = selectOptions[startIndex];

        if (item.tagName !== 'OPTGROUP') {
          addOption(item, {});
        } else {
          addOptgroup(startIndex, selectOptions);
        }
      }

      this.selectpicker.main.elements = mainElements;
      this.selectpicker.main.data = mainData;

      this.selectpicker.current = this.selectpicker.main;
    },

    findLis: function () {
      return this.$menuInner.find('.inner > li');
    },

    render: function () {
      // ensure titleOption is appended and selected (if necessary) before getting selectedOptions
      this.setPlaceholder();

      var that = this,
          element = this.$element[0],
          selectedOptions = getSelectedOptions(element, this.options.hideDisabled),
          selectedCount = selectedOptions.length,
          button = this.$button[0],
          buttonInner = button.querySelector('.filter-option-inner-inner'),
          multipleSeparator = document.createTextNode(this.options.multipleSeparator),
          titleFragment = elementTemplates.fragment.cloneNode(false),
          showCount,
          countMax,
          hasContent = false;

      button.classList.toggle('bs-placeholder', that.multiple ? !selectedCount : !getSelectValues(element, selectedOptions));

      this.tabIndex();

      if (this.options.selectedTextFormat === 'static') {
        titleFragment = generateOption.text({ text: this.options.title }, true);
      } else {
        showCount = this.multiple && this.options.selectedTextFormat.indexOf('count') !== -1 && selectedCount > 1;

        // determine if the number of selected options will be shown (showCount === true)
        if (showCount) {
          countMax = this.options.selectedTextFormat.split('>');
          showCount = (countMax.length > 1 && selectedCount > countMax[1]) || (countMax.length === 1 && selectedCount >= 2);
        }

        // only loop through all selected options if the count won't be shown
        if (showCount === false) {
          for (var selectedIndex = 0; selectedIndex < selectedCount; selectedIndex++) {
            if (selectedIndex < 50) {
              var option = selectedOptions[selectedIndex],
                  titleOptions = {},
                  thisData = {
                    content: option.getAttribute('data-content'),
                    subtext: option.getAttribute('data-subtext'),
                    icon: option.getAttribute('data-icon')
                  };

              if (this.multiple && selectedIndex > 0) {
                titleFragment.appendChild(multipleSeparator.cloneNode(false));
              }

              if (option.title) {
                titleOptions.text = option.title;
              } else if (thisData.content && that.options.showContent) {
                titleOptions.content = thisData.content.toString();
                hasContent = true;
              } else {
                if (that.options.showIcon) {
                  titleOptions.icon = thisData.icon;
                  titleOptions.iconBase = this.options.iconBase;
                }
                if (that.options.showSubtext && !that.multiple && thisData.subtext) titleOptions.subtext = ' ' + thisData.subtext;
                titleOptions.text = option.textContent.trim();
              }

              titleFragment.appendChild(generateOption.text(titleOptions, true));
            } else {
              break;
            }
          }

          // add ellipsis
          if (selectedCount > 49) {
            titleFragment.appendChild(document.createTextNode('...'));
          }
        } else {
          var optionSelector = ':not([hidden]):not([data-hidden="true"]):not([data-divider="true"])';
          if (this.options.hideDisabled) optionSelector += ':not(:disabled)';

          // If this is a multiselect, and selectedTextFormat is count, then show 1 of 2 selected, etc.
          var totalCount = this.$element[0].querySelectorAll('select > option' + optionSelector + ', optgroup' + optionSelector + ' option' + optionSelector).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedCount, totalCount) : this.options.countSelectedText;

          titleFragment = generateOption.text({
            text: tr8nText.replace('{0}', selectedCount.toString()).replace('{1}', totalCount.toString())
          }, true);
        }
      }

      if (this.options.title == undefined) {
        // use .attr to ensure undefined is returned if title attribute is not set
        this.options.title = this.$element.attr('title');
      }

      // If the select doesn't have a title, then use the default, or if nothing is set at all, use noneSelectedText
      if (!titleFragment.childNodes.length) {
        titleFragment = generateOption.text({
          text: typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText
        }, true);
      }

      // strip all HTML tags and trim the result, then unescape any escaped tags
      button.title = titleFragment.textContent.replace(/<[^>]*>?/g, '').trim();

      if (this.options.sanitize && hasContent) {
        sanitizeHtml([titleFragment], that.options.whiteList, that.options.sanitizeFn);
      }

      buttonInner.innerHTML = '';
      buttonInner.appendChild(titleFragment);

      if (version.major < 4 && this.$newElement[0].classList.contains('bs3-has-addon')) {
        var filterExpand = button.querySelector('.filter-expand'),
            clone = buttonInner.cloneNode(true);

        clone.className = 'filter-expand';

        if (filterExpand) {
          button.replaceChild(clone, filterExpand);
        } else {
          button.appendChild(clone);
        }
      }

      this.$element.trigger('rendered' + EVENT_KEY);
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (newStyle, status) {
      var button = this.$button[0],
          newElement = this.$newElement[0],
          style = this.options.style.trim(),
          buttonClass;

      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      if (version.major < 4) {
        newElement.classList.add('bs3');

        if (newElement.parentNode.classList.contains('input-group') &&
            (newElement.previousElementSibling || newElement.nextElementSibling) &&
            (newElement.previousElementSibling || newElement.nextElementSibling).classList.contains('input-group-addon')
        ) {
          newElement.classList.add('bs3-has-addon');
        }
      }

      if (newStyle) {
        buttonClass = newStyle.trim();
      } else {
        buttonClass = style;
      }

      if (status == 'add') {
        if (buttonClass) button.classList.add.apply(button.classList, buttonClass.split(' '));
      } else if (status == 'remove') {
        if (buttonClass) button.classList.remove.apply(button.classList, buttonClass.split(' '));
      } else {
        if (style) button.classList.remove.apply(button.classList, style.split(' '));
        if (buttonClass) button.classList.add.apply(button.classList, buttonClass.split(' '));
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

      var liHeight = li.offsetHeight,
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

      if (that.options.container && $container.length && !$container.is('body')) {
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

      // ensure menuInnerHeight is always a positive number to prevent issues calculating chunkSize in createView
      this.sizeInfo.menuInnerHeight = Math.max(menuInnerHeight, 1);

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
          $window = $(window);

      this.setMenuSize();

      if (this.options.liveSearch) {
        this.$searchbox
          .off('input.setMenuSize propertychange.setMenuSize')
          .on('input.setMenuSize propertychange.setMenuSize', function () {
            return that.setMenuSize();
          });
      }

      if (this.options.size === 'auto') {
        $window
          .off('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize')
          .on('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize', function () {
            return that.setMenuSize();
          });
      } else if (this.options.size && this.options.size != 'auto' && this.selectpicker.current.elements.length > this.options.size) {
        $window.off('resize' + EVENT_KEY + '.' + this.selectId + '.setMenuSize' + ' scroll' + EVENT_KEY + '.' + this.selectId + '.setMenuSize');
      }

      that.createView(false, true, refresh);
    },

    setWidth: function () {
      var that = this;

      if (this.options.width === 'auto') {
        requestAnimationFrame(function () {
          that.$menu.css('min-width', '0');

          that.$element.on('loaded' + EVENT_KEY, function () {
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
        this.$newElement[0].classList.remove('fit-width');
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

    setOptionStatus: function (selectedOnly) {
      var that = this;

      that.noScroll = false;

      if (that.selectpicker.view.visibleElements && that.selectpicker.view.visibleElements.length) {
        for (var i = 0; i < that.selectpicker.view.visibleElements.length; i++) {
          var liData = that.selectpicker.current.data[i + that.selectpicker.view.position0],
              option = liData.option;

          if (option) {
            if (selectedOnly !== true) {
              that.setDisabled(
                liData.index,
                liData.disabled
              );
            }

            that.setSelected(
              liData.index,
              option.selected
            );
          }
        }
      }
    },

    /**
     * @param {number} index - the index of the option that is being changed
     * @param {boolean} selected - true if the option is being selected, false if being deselected
     */
    setSelected: function (index, selected) {
      var li = this.selectpicker.main.elements[index],
          liData = this.selectpicker.main.data[index],
          activeIndexIsSet = this.activeIndex !== undefined,
          thisIsActive = this.activeIndex === index,
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

      liData.selected = selected;

      a = li.firstChild;

      if (selected) {
        this.selectedIndex = index;
      }

      li.classList.toggle('selected', selected);

      if (keepActive) {
        this.focusItem(li, liData);
        this.selectpicker.view.currentActive = li;
        this.activeIndex = index;
      } else {
        this.defocusItem(li);
      }

      if (a) {
        a.classList.toggle('selected', selected);

        if (selected) {
          a.setAttribute('aria-selected', true);
        } else {
          if (this.multiple) {
            a.setAttribute('aria-selected', false);
          } else {
            a.removeAttribute('aria-selected');
          }
        }
      }

      if (!keepActive && !activeIndexIsSet && selected && this.prevActiveIndex !== undefined) {
        prevActive = this.selectpicker.main.elements[this.prevActiveIndex];

        this.defocusItem(prevActive);
      }
    },

    /**
     * @param {number} index - the index of the option that is being disabled
     * @param {boolean} disabled - true if the option is being disabled, false if being enabled
     */
    setDisabled: function (index, disabled) {
      var li = this.selectpicker.main.elements[index],
          a;

      this.selectpicker.main.data[index].disabled = disabled;

      a = li.firstChild;

      li.classList.toggle(classNames.DISABLED, disabled);

      if (a) {
        if (version.major === '4') a.classList.toggle(classNames.DISABLED, disabled);

        if (disabled) {
          a.setAttribute('aria-disabled', disabled);
          a.setAttribute('tabindex', -1);
        } else {
          a.removeAttribute('aria-disabled');
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
        this.$newElement[0].classList.add(classNames.DISABLED);
        this.$button.addClass(classNames.DISABLED).attr('tabindex', -1).attr('aria-disabled', true);
      } else {
        if (this.$button[0].classList.contains(classNames.DISABLED)) {
          this.$newElement[0].classList.remove(classNames.DISABLED);
          this.$button.removeClass(classNames.DISABLED).attr('aria-disabled', false);
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.on('click', function () {
        return !that.isDisabled();
      });
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
          that.$searchbox.trigger('focus');
        } else {
          that.$menuInner.trigger('focus');
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

      // ensure posinset and setsize are correct before selecting an option via a click
      this.$menuInner.on('mouseenter', 'li a', function (e) {
        var hoverLi = this.parentElement,
            position0 = that.isVirtual() ? that.selectpicker.view.position0 : 0,
            index = Array.prototype.indexOf.call(hoverLi.parentElement.children, hoverLi),
            hoverData = that.selectpicker.current.data[index + position0];

        that.focusItem(hoverLi, hoverData, true);
      });

      this.$menuInner.on('click', 'li a', function (e, retainActive) {
        var $this = $(this),
            element = that.$element[0],
            position0 = that.isVirtual() ? that.selectpicker.view.position0 : 0,
            clickedData = that.selectpicker.current.data[$this.parent().index() + position0],
            clickedIndex = clickedData.index,
            prevValue = getSelectValues(element),
            prevIndex = element.selectedIndex,
            prevOption = element.options[prevIndex],
            triggerChange = true;

        // Don't close on multi choice menu
        if (that.multiple && that.options.maxOptions !== 1) {
          e.stopPropagation();
        }

        e.preventDefault();

        // Don't run if the select is disabled
        if (!that.isDisabled() && !$this.parent().hasClass(classNames.DISABLED)) {
          var $options = that.$element.find('option'),
              option = clickedData.option,
              $option = $(option),
              state = option.selected,
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
            prevOption.selected = false;
            option.selected = true;
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            option.selected = !state;

            that.setSelected(clickedIndex, !state);
            $this.trigger('blur');

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
            that.$button.trigger('focus');
          } else if (that.options.liveSearch) {
            that.$searchbox.trigger('focus');
          }

          // Trigger select 'change'
          if (triggerChange) {
            if (that.multiple || prevIndex !== element.selectedIndex) {
              // $option.prop('selected') is current option state (selected/unselected). prevValue is the value of the select prior to being changed.
              changedArguments = [option.index, $option.prop('selected'), prevValue];
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
            that.$searchbox.trigger('focus');
          } else {
            that.$button.trigger('focus');
          }
        }
      });

      this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.trigger('focus');
        } else {
          that.$button.trigger('focus');
        }
      });

      this.$menu.on('click', '.' + classNames.POPOVERHEADER + ' .close', function () {
        that.$button.trigger('click');
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.trigger('focus');
        } else {
          that.$button.trigger('focus');
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
      });

      this.$element
        .on('change' + EVENT_KEY, function () {
          that.render();
          that.$element.trigger('changed' + EVENT_KEY, changedArguments);
          changedArguments = null;
        })
        .on('focus' + EVENT_KEY, function () {
          if (!that.options.mobile) that.$button.trigger('focus');
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
      var element = this.$element[0];

      if (typeof value !== 'undefined') {
        var prevValue = getSelectValues(element);

        changedArguments = [null, null, prevValue];

        this.$element
          .val(value)
          .trigger('changed' + EVENT_KEY, changedArguments);

        if (this.$newElement.hasClass(classNames.SHOW)) {
          if (this.multiple) {
            this.setOptionStatus(true);
          } else {
            var liSelectedIndex = (element.options[element.selectedIndex] || {}).liIndex;

            if (typeof liSelectedIndex === 'number') {
              this.setSelected(this.selectedIndex, false);
              this.setSelected(liSelectedIndex, true);
            }
          }
        }

        this.render();

        changedArguments = null;

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    changeAll: function (status) {
      if (!this.multiple) return;
      if (typeof status === 'undefined') status = true;

      var element = this.$element[0],
          previousSelected = 0,
          currentSelected = 0,
          prevValue = getSelectValues(element);

      element.classList.add('bs-select-hidden');

      for (var i = 0, len = this.selectpicker.current.elements.length; i < len; i++) {
        var liData = this.selectpicker.current.data[i],
            option = liData.option;

        if (option && !liData.disabled && liData.type !== 'divider') {
          if (liData.selected) previousSelected++;
          option.selected = status;
          if (status) currentSelected++;
        }
      }

      element.classList.remove('bs-select-hidden');

      if (previousSelected === currentSelected) return;

      this.setOptionStatus();

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

        if (that.options.liveSearch) {
          that.$searchbox.trigger('focus');
          return;
        }
      }

      if (e.which === keyCodes.ESCAPE && isActive) {
        e.preventDefault();
        that.$button.trigger('click.bs.dropdown.data-api').trigger('focus');
      }

      if (isArrowKey) { // if up or down
        if (!$items.length) return;

        liActive = that.selectpicker.main.elements[that.activeIndex];
        index = liActive ? Array.prototype.indexOf.call(liActive.parentElement.children, liActive) : -1;

        if (index !== -1) {
          that.defocusItem(liActive);
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

        that.activeIndex = that.selectpicker.current.data[liActiveIndex].index;

        that.focusItem(liActive);

        that.selectpicker.view.currentActive = liActive;

        if (updateScroll) that.$menuInner[0].scrollTop = offset;

        if (that.options.liveSearch) {
          that.$searchbox.trigger('focus');
        } else {
          $this.trigger('focus');
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
            matches.push(li.index);
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

          searchMatch = matches[matchIndex];

          activeLi = that.selectpicker.main.data[searchMatch];

          if (scrollTop - activeLi.position > 0) {
            offset = activeLi.position - activeLi.height;
            updateScroll = true;
          } else {
            offset = activeLi.position - that.sizeInfo.menuInnerHeight;
            // if the option is already visible at the current scroll position, just keep it the same
            updateScroll = activeLi.position > scrollTop + that.sizeInfo.menuInnerHeight;
          }

          liActive = that.selectpicker.main.elements[searchMatch];

          that.activeIndex = matches[matchIndex];

          that.focusItem(liActive);

          if (liActive) liActive.firstChild.focus();

          if (updateScroll) that.$menuInner[0].scrollTop = offset;

          $this.trigger('focus');
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
          $this.trigger('focus');

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
      this.$element[0].classList.add('mobile-device');
    },

    refresh: function () {
      // update options if data attributes have been changed
      var config = $.extend({}, this.options, this.$element.data());
      this.options = config;

      this.checkDisabled();
      this.setStyle();
      this.render();
      this.createLi();
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
        // fall back to use BootstrapVersion if set
        if (Selectpicker.BootstrapVersion) {
          version.full = Selectpicker.BootstrapVersion.split(' ')[0].split('.');
        } else {
          version.full = [version.major, '0', '0'];

          console.warn(
            'There was an issue retrieving Bootstrap\'s version. ' +
            'Ensure Bootstrap is being loaded before bootstrap-select and there is no namespace collision. ' +
            'If loading Bootstrap asynchronously, the version may need to be manually specified via $.fn.selectpicker.Constructor.BootstrapVersion.',
            err
          );
        }
      }

      version.major = version.full[0];
      version.success = true;
    }

    if (version.major === '4') {
      // some defaults need to be changed if using Bootstrap 4
      // check to see if they have already been manually changed before forcing them to update
      var toUpdate = [];

      if (Selectpicker.DEFAULTS.style === classNames.BUTTONCLASS) toUpdate.push({ name: 'style', className: 'BUTTONCLASS' });
      if (Selectpicker.DEFAULTS.iconBase === classNames.ICONBASE) toUpdate.push({ name: 'iconBase', className: 'ICONBASE' });
      if (Selectpicker.DEFAULTS.tickIcon === classNames.TICKICON) toUpdate.push({ name: 'tickIcon', className: 'TICKICON' });

      classNames.DIVIDER = 'dropdown-divider';
      classNames.SHOW = 'show';
      classNames.BUTTONCLASS = 'btn-light';
      classNames.POPOVERHEADER = 'popover-header';
      classNames.ICONBASE = '';
      classNames.TICKICON = 'bs-ok-default';

      for (var i = 0; i < toUpdate.length; i++) {
        var option = toUpdate[i];
        Selectpicker.DEFAULTS[option.name] = classNames[option.className];
      }
    }

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var dataAttributes = $this.data();

          for (var dataAttr in dataAttributes) {
            if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
              delete dataAttributes[dataAttr];
            }
          }

          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, dataAttributes, options);
          config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), dataAttributes.template, options.template);
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
//# sourceMappingURL=bootstrap-select.js.map

/***/ })

},[["./node_modules/bootstrap-select/dist/js/bootstrap-select.js","runtime","vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXNlbGVjdC9kaXN0L2pzL2Jvb3RzdHJhcC1zZWxlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLElBQTBDO0FBQ2hEO0FBQ0EsSUFBSSxpQ0FBTyxDQUFDLHlFQUFRLENBQUMsbUNBQUU7QUFDdkI7QUFDQSxLQUFLO0FBQUEsb0dBQUM7QUFDTixHQUFHLE1BQU0sRUFPTjtBQUNILENBQUM7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1SUFBdUk7O0FBRXZJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLHNDQUFzQyxPQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZ0RBQWdELFNBQVM7QUFDekQ7O0FBRUEsNkNBQTZDLFVBQVU7QUFDdkQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvREFBb0QsVUFBVTtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGFBQWE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBbUQsU0FBUztBQUM1RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Q0FBeUMsU0FBUztBQUNsRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLLHlCQUF5QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsd0JBQXdCO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsY0FBYztBQUNkLGNBQWM7QUFDZCxnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGdCQUFnQjtBQUNoQixpQkFBaUI7QUFDakIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLEVBQUU7QUFDNUM7QUFDQSxvQ0FBb0MsRUFBRSxvQkFBb0IsRUFBRTtBQUM1RCxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlDQUF5QyxFQUFFLCtCQUErQixFQUFFO0FBQzVFLGlEQUFpRCxFQUFFLHFDQUFxQyxFQUFFO0FBQzFGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiwyQ0FBMkM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwyRUFBMkU7O0FBRTNFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRGQUE0RjtBQUM1Rix1REFBdUQ7O0FBRXZELHVCQUF1QixnQkFBZ0I7QUFDdkM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWlFLHdCQUF3QjtBQUN6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEseUVBQXlFOztBQUV6RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCw2Q0FBNkMsU0FBUztBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQSxzQkFBc0IsZUFBZTtBQUNyQztBQUNBOztBQUVBLDBDQUEwQyxrQkFBa0I7QUFDNUQ7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUIsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLDZDQUE2QywyQkFBMkI7QUFDeEUsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFxQywrQkFBK0I7QUFDcEU7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLEVBQUUsdUNBQXVDLEVBQUU7QUFDaEYsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLHdCQUF3QjtBQUN4Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhCQUE4QjtBQUM5Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBO0FBQ0EsdUJBQXVCLG1EQUFtRDtBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxxQkFBcUI7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBLGlDQUFpQyw2QkFBNkI7QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSwwREFBMEQsRUFBRTtBQUM1RCw2REFBNkQsRUFBRTtBQUMvRDtBQUNBLHlCQUF5QixJQUFJO0FBQzdCO0FBQ0E7QUFDQSw4Q0FBOEMsSUFBSTtBQUNsRCxvREFBb0QsSUFBSTtBQUN4RDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSx5QkFBeUIsd0NBQXdDO0FBQ2pFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFEQUFxRCxjQUFjO0FBQ25FO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUVBQXlFLEVBQUU7QUFDM0U7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCwrRUFBK0U7O0FBRS9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0VBQXNFLFNBQVM7QUFDL0U7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMseURBQXlEO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLHlEQUF5RDtBQUNsRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLDJDQUEyQztBQUNsRTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLDhCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlGQUFpRiwwQ0FBMEM7QUFDM0gsaUZBQWlGLDBDQUEwQztBQUMzSCxpRkFBaUYsMENBQTBDOztBQUUzSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyx5REFBeUQ7QUFDM0YsdUNBQXVDLHdHQUF3RztBQUMvSTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7QUFHRCxDQUFDO0FBQ0QsNEMiLCJmaWxlIjoianMvYm9vdHN0cmFwLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBCb290c3RyYXAtc2VsZWN0IHYxLjEzLjEwIChodHRwczovL2RldmVsb3Blci5zbmFwYXBwb2ludG1lbnRzLmNvbS9ib290c3RyYXAtc2VsZWN0KVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE5IFNuYXBBcHBvaW50bWVudHMsIExMQ1xyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9zbmFwYXBwb2ludG1lbnRzL2Jvb3RzdHJhcC1zZWxlY3QvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICBpZiAocm9vdCA9PT0gdW5kZWZpbmVkICYmIHdpbmRvdyAhPT0gdW5kZWZpbmVkKSByb290ID0gd2luZG93O1xyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSB1bmxlc3MgYW1kTW9kdWxlSWQgaXMgc2V0XHJcbiAgICBkZWZpbmUoW1wianF1ZXJ5XCJdLCBmdW5jdGlvbiAoYTApIHtcclxuICAgICAgcmV0dXJuIChmYWN0b3J5KGEwKSk7XHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxyXG4gICAgLy8gbGlrZSBOb2RlLlxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJqcXVlcnlcIikpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmYWN0b3J5KHJvb3RbXCJqUXVlcnlcIl0pO1xyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoalF1ZXJ5KSB7XHJcblxyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIHZhciBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBbJ3Nhbml0aXplJywgJ3doaXRlTGlzdCcsICdzYW5pdGl6ZUZuJ107XHJcblxyXG4gIHZhciB1cmlBdHRycyA9IFtcclxuICAgICdiYWNrZ3JvdW5kJyxcclxuICAgICdjaXRlJyxcclxuICAgICdocmVmJyxcclxuICAgICdpdGVtdHlwZScsXHJcbiAgICAnbG9uZ2Rlc2MnLFxyXG4gICAgJ3Bvc3RlcicsXHJcbiAgICAnc3JjJyxcclxuICAgICd4bGluazpocmVmJ1xyXG4gIF07XHJcblxyXG4gIHZhciBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2k7XHJcblxyXG4gIHZhciBEZWZhdWx0V2hpdGVsaXN0ID0ge1xyXG4gICAgLy8gR2xvYmFsIGF0dHJpYnV0ZXMgYWxsb3dlZCBvbiBhbnkgc3VwcGxpZWQgZWxlbWVudCBiZWxvdy5cclxuICAgICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgJ3RhYmluZGV4JywgJ3N0eWxlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXHJcbiAgICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxyXG4gICAgYXJlYTogW10sXHJcbiAgICBiOiBbXSxcclxuICAgIGJyOiBbXSxcclxuICAgIGNvbDogW10sXHJcbiAgICBjb2RlOiBbXSxcclxuICAgIGRpdjogW10sXHJcbiAgICBlbTogW10sXHJcbiAgICBocjogW10sXHJcbiAgICBoMTogW10sXHJcbiAgICBoMjogW10sXHJcbiAgICBoMzogW10sXHJcbiAgICBoNDogW10sXHJcbiAgICBoNTogW10sXHJcbiAgICBoNjogW10sXHJcbiAgICBpOiBbXSxcclxuICAgIGltZzogWydzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxyXG4gICAgbGk6IFtdLFxyXG4gICAgb2w6IFtdLFxyXG4gICAgcDogW10sXHJcbiAgICBwcmU6IFtdLFxyXG4gICAgczogW10sXHJcbiAgICBzbWFsbDogW10sXHJcbiAgICBzcGFuOiBbXSxcclxuICAgIHN1YjogW10sXHJcbiAgICBzdXA6IFtdLFxyXG4gICAgc3Ryb25nOiBbXSxcclxuICAgIHU6IFtdLFxyXG4gICAgdWw6IFtdXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIGEgY29tbW9ubHkgdXNlZnVsIHN1YnNldCBvZiBVUkxzIHRoYXQgYXJlIHNhZmUuXHJcbiAgICpcclxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXHJcbiAgICovXHJcbiAgdmFyIFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpO1xyXG5cclxuICAvKipcclxuICAgKiBBIHBhdHRlcm4gdGhhdCBtYXRjaGVzIHNhZmUgZGF0YSBVUkxzLiBPbmx5IG1hdGNoZXMgaW1hZ2UsIHZpZGVvIGFuZCBhdWRpbyB0eXBlcy5cclxuICAgKlxyXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcclxuICAgKi9cclxuICB2YXIgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2k7XHJcblxyXG4gIGZ1bmN0aW9uIGFsbG93ZWRBdHRyaWJ1dGUgKGF0dHIsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSB7XHJcbiAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgIT09IC0xKSB7XHJcbiAgICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIHVyaUF0dHJzKSAhPT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbihhdHRyLm5vZGVWYWx1ZS5tYXRjaChTQUZFX1VSTF9QQVRURVJOKSB8fCBhdHRyLm5vZGVWYWx1ZS5tYXRjaChEQVRBX1VSTF9QQVRURVJOKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVnRXhwID0gJChhbGxvd2VkQXR0cmlidXRlTGlzdCkuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWdFeHAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIGlmIChhdHRyTmFtZS5tYXRjaChyZWdFeHBbaV0pKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2FuaXRpemVIdG1sICh1bnNhZmVFbGVtZW50cywgd2hpdGVMaXN0LCBzYW5pdGl6ZUZuKSB7XHJcbiAgICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gc2FuaXRpemVGbih1bnNhZmVFbGVtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHdoaXRlbGlzdEtleXMgPSBPYmplY3Qua2V5cyh3aGl0ZUxpc3QpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB1bnNhZmVFbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICB2YXIgZWxlbWVudHMgPSB1bnNhZmVFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XHJcblxyXG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuMiA9IGVsZW1lbnRzLmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xyXG4gICAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2pdO1xyXG4gICAgICAgIHZhciBlbE5hbWUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICBpZiAod2hpdGVsaXN0S2V5cy5pbmRleE9mKGVsTmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVMaXN0ID0gW10uc2xpY2UuY2FsbChlbC5hdHRyaWJ1dGVzKTtcclxuICAgICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGsgPSAwLCBsZW4zID0gYXR0cmlidXRlTGlzdC5sZW5ndGg7IGsgPCBsZW4zOyBrKyspIHtcclxuICAgICAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlTGlzdFtrXTtcclxuXHJcbiAgICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0ciwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5ub2RlTmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBQb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxyXG4gIC8vIFJlbW92ZSBpbiB2MlxyXG4gIGlmICghKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ18nKSkpIHtcclxuICAgIChmdW5jdGlvbiAodmlldykge1xyXG4gICAgICBpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBjbGFzc0xpc3RQcm9wID0gJ2NsYXNzTGlzdCcsXHJcbiAgICAgICAgICBwcm90b1Byb3AgPSAncHJvdG90eXBlJyxcclxuICAgICAgICAgIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdLFxyXG4gICAgICAgICAgb2JqQ3RyID0gT2JqZWN0LFxyXG4gICAgICAgICAgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGVsZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uIChjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW0uYWRkQ2xhc3MoY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW0ucmVtb3ZlQ2xhc3MoY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChjbGFzc2VzLCBmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtLnRvZ2dsZUNsYXNzKGNsYXNzZXMsIGZvcmNlKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAoY2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRlbGVtLmhhc0NsYXNzKGNsYXNzZXMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XHJcbiAgICAgICAgICBnZXQ6IGNsYXNzTGlzdEdldHRlcixcclxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXHJcbiAgICAgICAgICAvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxyXG4gICAgICAgICAgLy8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxyXG4gICAgICAgICAgaWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcclxuICAgICAgICAgICAgY2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcclxuICAgICAgICBlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xyXG4gICAgICB9XHJcbiAgICB9KHdpbmRvdykpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnXycpO1xyXG5cclxuICB0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjMScsICdjMicpO1xyXG5cclxuICBpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYzInKSkge1xyXG4gICAgdmFyIF9hZGQgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLmFkZCxcclxuICAgICAgICBfcmVtb3ZlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS5yZW1vdmU7XHJcblxyXG4gICAgRE9NVG9rZW5MaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXJndW1lbnRzLCBfYWRkLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIERPTVRva2VuTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFyZ3VtZW50cywgX3JlbW92ZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2MzJywgZmFsc2UpO1xyXG5cclxuICAvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XHJcbiAgLy8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxyXG4gIGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2MzJykpIHtcclxuICAgIHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XHJcblxyXG4gICAgRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XHJcbiAgICAgIGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xyXG4gICAgICAgIHJldHVybiBmb3JjZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHRlc3RFbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgLy8gc2hhbGxvdyBhcnJheSBjb21wYXJpc29uXHJcbiAgZnVuY3Rpb24gaXNFcXVhbCAoYXJyYXkxLCBhcnJheTIpIHtcclxuICAgIHJldHVybiBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoICYmIGFycmF5MS5ldmVyeShmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQgPT09IGFycmF5MltpbmRleF07XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyA8ZWRpdG9yLWZvbGQgZGVzYz1cIlNoaW1zXCI+XHJcbiAgaWYgKCFTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpIHtcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JzsgLy8gbmVlZGVkIHRvIHN1cHBvcnQgYGFwcGx5YC9gY2FsbGAgd2l0aCBgdW5kZWZpbmVkYC9gbnVsbGBcclxuICAgICAgdmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBJRSA4IG9ubHkgc3VwcG9ydHMgYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgb24gRE9NIGVsZW1lbnRzXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHZhciBvYmplY3QgPSB7fTtcclxuICAgICAgICAgIHZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KCkpO1xyXG4gICAgICB2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcclxuICAgICAgdmFyIHN0YXJ0c1dpdGggPSBmdW5jdGlvbiAoc2VhcmNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xyXG4gICAgICAgIGlmIChzZWFyY2ggJiYgdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcclxuICAgICAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcclxuICAgICAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAvLyBgVG9JbnRlZ2VyYFxyXG4gICAgICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xyXG4gICAgICAgIGlmIChwb3MgIT0gcG9zKSB7IC8vIGJldHRlciBgaXNOYU5gXHJcbiAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xyXG4gICAgICAgIC8vIEF2b2lkIHRoZSBgaW5kZXhPZmAgY2FsbCBpZiBubyBtYXRjaCBpcyBwb3NzaWJsZVxyXG4gICAgICAgIGlmIChzZWFyY2hMZW5ndGggKyBzdGFydCA+IHN0cmluZ0xlbmd0aCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IHNlYXJjaExlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KHN0YXJ0ICsgaW5kZXgpICE9IHNlYXJjaFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShTdHJpbmcucHJvdG90eXBlLCAnc3RhcnRzV2l0aCcsIHtcclxuICAgICAgICAgICd2YWx1ZSc6IHN0YXJ0c1dpdGgsXHJcbiAgICAgICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcclxuICAgICAgICAgICd3cml0YWJsZSc6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBzdGFydHNXaXRoO1xyXG4gICAgICB9XHJcbiAgICB9KCkpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFPYmplY3Qua2V5cykge1xyXG4gICAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbiAoXHJcbiAgICAgIG8sIC8vIG9iamVjdFxyXG4gICAgICBrLCAvLyBrZXlcclxuICAgICAgciAgLy8gcmVzdWx0IGFycmF5XHJcbiAgICApIHtcclxuICAgICAgLy8gaW5pdGlhbGl6ZSBvYmplY3QgYW5kIHJlc3VsdFxyXG4gICAgICByID0gW107XHJcbiAgICAgIC8vIGl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xyXG4gICAgICBmb3IgKGsgaW4gbykge1xyXG4gICAgICAgIC8vIGZpbGwgcmVzdWx0IGFycmF5IHdpdGggbm9uLXByb3RvdHlwaWNhbCBrZXlzXHJcbiAgICAgICAgci5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspICYmIHIucHVzaChrKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gcmVzdWx0XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmIChIVE1MU2VsZWN0RWxlbWVudCAmJiAhSFRNTFNlbGVjdEVsZW1lbnQucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdzZWxlY3RlZE9wdGlvbnMnKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEhUTUxTZWxlY3RFbGVtZW50LnByb3RvdHlwZSwgJ3NlbGVjdGVkT3B0aW9ucycsIHtcclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRTZWxlY3RlZE9wdGlvbnMgKHNlbGVjdCwgaWdub3JlRGlzYWJsZWQpIHtcclxuICAgIHZhciBzZWxlY3RlZE9wdGlvbnMgPSBzZWxlY3Quc2VsZWN0ZWRPcHRpb25zLFxyXG4gICAgICAgIG9wdGlvbnMgPSBbXSxcclxuICAgICAgICBvcHQ7XHJcblxyXG4gICAgaWYgKGlnbm9yZURpc2FibGVkKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxlY3RlZE9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBvcHQgPSBzZWxlY3RlZE9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgIGlmICghKG9wdC5kaXNhYmxlZCB8fCBvcHQucGFyZW50Tm9kZS50YWdOYW1lID09PSAnT1BUR1JPVVAnICYmIG9wdC5wYXJlbnROb2RlLmRpc2FibGVkKSkge1xyXG4gICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgLy8gbXVjaCBmYXN0ZXIgdGhhbiAkLnZhbCgpXHJcbiAgZnVuY3Rpb24gZ2V0U2VsZWN0VmFsdWVzIChzZWxlY3QsIHNlbGVjdGVkT3B0aW9ucykge1xyXG4gICAgdmFyIHZhbHVlID0gW10sXHJcbiAgICAgICAgb3B0aW9ucyA9IHNlbGVjdGVkT3B0aW9ucyB8fCBzZWxlY3Quc2VsZWN0ZWRPcHRpb25zLFxyXG4gICAgICAgIG9wdDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBvcHQgPSBvcHRpb25zW2ldO1xyXG5cclxuICAgICAgaWYgKCEob3B0LmRpc2FibGVkIHx8IG9wdC5wYXJlbnROb2RlLnRhZ05hbWUgPT09ICdPUFRHUk9VUCcgJiYgb3B0LnBhcmVudE5vZGUuZGlzYWJsZWQpKSB7XHJcbiAgICAgICAgdmFsdWUucHVzaChvcHQudmFsdWUgfHwgb3B0LnRleHQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFzZWxlY3QubXVsdGlwbGUpIHtcclxuICAgICAgcmV0dXJuICF2YWx1ZS5sZW5ndGggPyBudWxsIDogdmFsdWVbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gc2V0IGRhdGEtc2VsZWN0ZWQgb24gc2VsZWN0IGVsZW1lbnQgaWYgdGhlIHZhbHVlIGhhcyBiZWVuIHByb2dyYW1tYXRpY2FsbHkgc2VsZWN0ZWRcclxuICAvLyBwcmlvciB0byBpbml0aWFsaXphdGlvbiBvZiBib290c3RyYXAtc2VsZWN0XHJcbiAgLy8gKiBjb25zaWRlciByZW1vdmluZyBvciByZXBsYWNpbmcgYW4gYWx0ZXJuYXRpdmUgbWV0aG9kICpcclxuICB2YXIgdmFsSG9va3MgPSB7XHJcbiAgICB1c2VEZWZhdWx0OiBmYWxzZSxcclxuICAgIF9zZXQ6ICQudmFsSG9va3Muc2VsZWN0LnNldFxyXG4gIH07XHJcblxyXG4gICQudmFsSG9va3Muc2VsZWN0LnNldCA9IGZ1bmN0aW9uIChlbGVtLCB2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICYmICF2YWxIb29rcy51c2VEZWZhdWx0KSAkKGVsZW0pLmRhdGEoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgcmV0dXJuIHZhbEhvb2tzLl9zZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9O1xyXG5cclxuICB2YXIgY2hhbmdlZEFyZ3VtZW50cyA9IG51bGw7XHJcblxyXG4gIHZhciBFdmVudElzU3VwcG9ydGVkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIG5ldyBFdmVudCgnY2hhbmdlJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgJC5mbi50cmlnZ2VyTmF0aXZlID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xyXG4gICAgdmFyIGVsID0gdGhpc1swXSxcclxuICAgICAgICBldmVudDtcclxuXHJcbiAgICBpZiAoZWwuZGlzcGF0Y2hFdmVudCkgeyAvLyBmb3IgbW9kZXJuIGJyb3dzZXJzICYgSUU5K1xyXG4gICAgICBpZiAoRXZlbnRJc1N1cHBvcnRlZCkge1xyXG4gICAgICAgIC8vIEZvciBtb2Rlcm4gYnJvd3NlcnNcclxuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudE5hbWUsIHtcclxuICAgICAgICAgIGJ1YmJsZXM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGb3IgSUUgc2luY2UgaXQgZG9lc24ndCBzdXBwb3J0IEV2ZW50IGNvbnN0cnVjdG9yXHJcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICBldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChlbC5maXJlRXZlbnQpIHsgLy8gZm9yIElFOFxyXG4gICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XHJcbiAgICAgIGV2ZW50LmV2ZW50VHlwZSA9IGV2ZW50TmFtZTtcclxuICAgICAgZWwuZmlyZUV2ZW50KCdvbicgKyBldmVudE5hbWUsIGV2ZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGZhbGwgYmFjayB0byBqUXVlcnkudHJpZ2dlclxyXG4gICAgICB0aGlzLnRyaWdnZXIoZXZlbnROYW1lKTtcclxuICAgIH1cclxuICB9O1xyXG4gIC8vIDwvZWRpdG9yLWZvbGQ+XHJcblxyXG4gIGZ1bmN0aW9uIHN0cmluZ1NlYXJjaCAobGksIHNlYXJjaFN0cmluZywgbWV0aG9kLCBub3JtYWxpemUpIHtcclxuICAgIHZhciBzdHJpbmdUeXBlcyA9IFtcclxuICAgICAgICAgICdkaXNwbGF5JyxcclxuICAgICAgICAgICdzdWJ0ZXh0JyxcclxuICAgICAgICAgICd0b2tlbnMnXHJcbiAgICAgICAgXSxcclxuICAgICAgICBzZWFyY2hTdWNjZXNzID0gZmFsc2U7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdUeXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc3RyaW5nVHlwZSA9IHN0cmluZ1R5cGVzW2ldLFxyXG4gICAgICAgICAgc3RyaW5nID0gbGlbc3RyaW5nVHlwZV07XHJcblxyXG4gICAgICBpZiAoc3RyaW5nKSB7XHJcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIC8vIFN0cmlwIEhUTUwgdGFncy4gVGhpcyBpc24ndCBwZXJmZWN0LCBidXQgaXQncyBtdWNoIGZhc3RlciB0aGFuIGFueSBvdGhlciBtZXRob2RcclxuICAgICAgICBpZiAoc3RyaW5nVHlwZSA9PT0gJ2Rpc3BsYXknKSB7XHJcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvPFtePl0rPi9nLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobm9ybWFsaXplKSBzdHJpbmcgPSBub3JtYWxpemVUb0Jhc2Uoc3RyaW5nKTtcclxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcudG9VcHBlckNhc2UoKTtcclxuXHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ2NvbnRhaW5zJykge1xyXG4gICAgICAgICAgc2VhcmNoU3VjY2VzcyA9IHN0cmluZy5pbmRleE9mKHNlYXJjaFN0cmluZykgPj0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VhcmNoU3VjY2VzcyA9IHN0cmluZy5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2VhcmNoU3VjY2VzcykgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VhcmNoU3VjY2VzcztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvSW50ZWdlciAodmFsdWUpIHtcclxuICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApIHx8IDA7XHJcbiAgfVxyXG5cclxuICAvLyBCb3Jyb3dlZCBmcm9tIExvZGFzaCAoXy5kZWJ1cnIpXHJcbiAgLyoqIFVzZWQgdG8gbWFwIExhdGluIFVuaWNvZGUgbGV0dGVycyB0byBiYXNpYyBMYXRpbiBsZXR0ZXJzLiAqL1xyXG4gIHZhciBkZWJ1cnJlZExldHRlcnMgPSB7XHJcbiAgICAvLyBMYXRpbi0xIFN1cHBsZW1lbnQgYmxvY2suXHJcbiAgICAnXFx4YzAnOiAnQScsICAnXFx4YzEnOiAnQScsICdcXHhjMic6ICdBJywgJ1xceGMzJzogJ0EnLCAnXFx4YzQnOiAnQScsICdcXHhjNSc6ICdBJyxcclxuICAgICdcXHhlMCc6ICdhJywgICdcXHhlMSc6ICdhJywgJ1xceGUyJzogJ2EnLCAnXFx4ZTMnOiAnYScsICdcXHhlNCc6ICdhJywgJ1xceGU1JzogJ2EnLFxyXG4gICAgJ1xceGM3JzogJ0MnLCAgJ1xceGU3JzogJ2MnLFxyXG4gICAgJ1xceGQwJzogJ0QnLCAgJ1xceGYwJzogJ2QnLFxyXG4gICAgJ1xceGM4JzogJ0UnLCAgJ1xceGM5JzogJ0UnLCAnXFx4Y2EnOiAnRScsICdcXHhjYic6ICdFJyxcclxuICAgICdcXHhlOCc6ICdlJywgICdcXHhlOSc6ICdlJywgJ1xceGVhJzogJ2UnLCAnXFx4ZWInOiAnZScsXHJcbiAgICAnXFx4Y2MnOiAnSScsICAnXFx4Y2QnOiAnSScsICdcXHhjZSc6ICdJJywgJ1xceGNmJzogJ0knLFxyXG4gICAgJ1xceGVjJzogJ2knLCAgJ1xceGVkJzogJ2knLCAnXFx4ZWUnOiAnaScsICdcXHhlZic6ICdpJyxcclxuICAgICdcXHhkMSc6ICdOJywgICdcXHhmMSc6ICduJyxcclxuICAgICdcXHhkMic6ICdPJywgICdcXHhkMyc6ICdPJywgJ1xceGQ0JzogJ08nLCAnXFx4ZDUnOiAnTycsICdcXHhkNic6ICdPJywgJ1xceGQ4JzogJ08nLFxyXG4gICAgJ1xceGYyJzogJ28nLCAgJ1xceGYzJzogJ28nLCAnXFx4ZjQnOiAnbycsICdcXHhmNSc6ICdvJywgJ1xceGY2JzogJ28nLCAnXFx4ZjgnOiAnbycsXHJcbiAgICAnXFx4ZDknOiAnVScsICAnXFx4ZGEnOiAnVScsICdcXHhkYic6ICdVJywgJ1xceGRjJzogJ1UnLFxyXG4gICAgJ1xceGY5JzogJ3UnLCAgJ1xceGZhJzogJ3UnLCAnXFx4ZmInOiAndScsICdcXHhmYyc6ICd1JyxcclxuICAgICdcXHhkZCc6ICdZJywgICdcXHhmZCc6ICd5JywgJ1xceGZmJzogJ3knLFxyXG4gICAgJ1xceGM2JzogJ0FlJywgJ1xceGU2JzogJ2FlJyxcclxuICAgICdcXHhkZSc6ICdUaCcsICdcXHhmZSc6ICd0aCcsXHJcbiAgICAnXFx4ZGYnOiAnc3MnLFxyXG4gICAgLy8gTGF0aW4gRXh0ZW5kZWQtQSBibG9jay5cclxuICAgICdcXHUwMTAwJzogJ0EnLCAgJ1xcdTAxMDInOiAnQScsICdcXHUwMTA0JzogJ0EnLFxyXG4gICAgJ1xcdTAxMDEnOiAnYScsICAnXFx1MDEwMyc6ICdhJywgJ1xcdTAxMDUnOiAnYScsXHJcbiAgICAnXFx1MDEwNic6ICdDJywgICdcXHUwMTA4JzogJ0MnLCAnXFx1MDEwYSc6ICdDJywgJ1xcdTAxMGMnOiAnQycsXHJcbiAgICAnXFx1MDEwNyc6ICdjJywgICdcXHUwMTA5JzogJ2MnLCAnXFx1MDEwYic6ICdjJywgJ1xcdTAxMGQnOiAnYycsXHJcbiAgICAnXFx1MDEwZSc6ICdEJywgICdcXHUwMTEwJzogJ0QnLCAnXFx1MDEwZic6ICdkJywgJ1xcdTAxMTEnOiAnZCcsXHJcbiAgICAnXFx1MDExMic6ICdFJywgICdcXHUwMTE0JzogJ0UnLCAnXFx1MDExNic6ICdFJywgJ1xcdTAxMTgnOiAnRScsICdcXHUwMTFhJzogJ0UnLFxyXG4gICAgJ1xcdTAxMTMnOiAnZScsICAnXFx1MDExNSc6ICdlJywgJ1xcdTAxMTcnOiAnZScsICdcXHUwMTE5JzogJ2UnLCAnXFx1MDExYic6ICdlJyxcclxuICAgICdcXHUwMTFjJzogJ0cnLCAgJ1xcdTAxMWUnOiAnRycsICdcXHUwMTIwJzogJ0cnLCAnXFx1MDEyMic6ICdHJyxcclxuICAgICdcXHUwMTFkJzogJ2cnLCAgJ1xcdTAxMWYnOiAnZycsICdcXHUwMTIxJzogJ2cnLCAnXFx1MDEyMyc6ICdnJyxcclxuICAgICdcXHUwMTI0JzogJ0gnLCAgJ1xcdTAxMjYnOiAnSCcsICdcXHUwMTI1JzogJ2gnLCAnXFx1MDEyNyc6ICdoJyxcclxuICAgICdcXHUwMTI4JzogJ0knLCAgJ1xcdTAxMmEnOiAnSScsICdcXHUwMTJjJzogJ0knLCAnXFx1MDEyZSc6ICdJJywgJ1xcdTAxMzAnOiAnSScsXHJcbiAgICAnXFx1MDEyOSc6ICdpJywgICdcXHUwMTJiJzogJ2knLCAnXFx1MDEyZCc6ICdpJywgJ1xcdTAxMmYnOiAnaScsICdcXHUwMTMxJzogJ2knLFxyXG4gICAgJ1xcdTAxMzQnOiAnSicsICAnXFx1MDEzNSc6ICdqJyxcclxuICAgICdcXHUwMTM2JzogJ0snLCAgJ1xcdTAxMzcnOiAnaycsICdcXHUwMTM4JzogJ2snLFxyXG4gICAgJ1xcdTAxMzknOiAnTCcsICAnXFx1MDEzYic6ICdMJywgJ1xcdTAxM2QnOiAnTCcsICdcXHUwMTNmJzogJ0wnLCAnXFx1MDE0MSc6ICdMJyxcclxuICAgICdcXHUwMTNhJzogJ2wnLCAgJ1xcdTAxM2MnOiAnbCcsICdcXHUwMTNlJzogJ2wnLCAnXFx1MDE0MCc6ICdsJywgJ1xcdTAxNDInOiAnbCcsXHJcbiAgICAnXFx1MDE0Myc6ICdOJywgICdcXHUwMTQ1JzogJ04nLCAnXFx1MDE0Nyc6ICdOJywgJ1xcdTAxNGEnOiAnTicsXHJcbiAgICAnXFx1MDE0NCc6ICduJywgICdcXHUwMTQ2JzogJ24nLCAnXFx1MDE0OCc6ICduJywgJ1xcdTAxNGInOiAnbicsXHJcbiAgICAnXFx1MDE0Yyc6ICdPJywgICdcXHUwMTRlJzogJ08nLCAnXFx1MDE1MCc6ICdPJyxcclxuICAgICdcXHUwMTRkJzogJ28nLCAgJ1xcdTAxNGYnOiAnbycsICdcXHUwMTUxJzogJ28nLFxyXG4gICAgJ1xcdTAxNTQnOiAnUicsICAnXFx1MDE1Nic6ICdSJywgJ1xcdTAxNTgnOiAnUicsXHJcbiAgICAnXFx1MDE1NSc6ICdyJywgICdcXHUwMTU3JzogJ3InLCAnXFx1MDE1OSc6ICdyJyxcclxuICAgICdcXHUwMTVhJzogJ1MnLCAgJ1xcdTAxNWMnOiAnUycsICdcXHUwMTVlJzogJ1MnLCAnXFx1MDE2MCc6ICdTJyxcclxuICAgICdcXHUwMTViJzogJ3MnLCAgJ1xcdTAxNWQnOiAncycsICdcXHUwMTVmJzogJ3MnLCAnXFx1MDE2MSc6ICdzJyxcclxuICAgICdcXHUwMTYyJzogJ1QnLCAgJ1xcdTAxNjQnOiAnVCcsICdcXHUwMTY2JzogJ1QnLFxyXG4gICAgJ1xcdTAxNjMnOiAndCcsICAnXFx1MDE2NSc6ICd0JywgJ1xcdTAxNjcnOiAndCcsXHJcbiAgICAnXFx1MDE2OCc6ICdVJywgICdcXHUwMTZhJzogJ1UnLCAnXFx1MDE2Yyc6ICdVJywgJ1xcdTAxNmUnOiAnVScsICdcXHUwMTcwJzogJ1UnLCAnXFx1MDE3Mic6ICdVJyxcclxuICAgICdcXHUwMTY5JzogJ3UnLCAgJ1xcdTAxNmInOiAndScsICdcXHUwMTZkJzogJ3UnLCAnXFx1MDE2Zic6ICd1JywgJ1xcdTAxNzEnOiAndScsICdcXHUwMTczJzogJ3UnLFxyXG4gICAgJ1xcdTAxNzQnOiAnVycsICAnXFx1MDE3NSc6ICd3JyxcclxuICAgICdcXHUwMTc2JzogJ1knLCAgJ1xcdTAxNzcnOiAneScsICdcXHUwMTc4JzogJ1knLFxyXG4gICAgJ1xcdTAxNzknOiAnWicsICAnXFx1MDE3Yic6ICdaJywgJ1xcdTAxN2QnOiAnWicsXHJcbiAgICAnXFx1MDE3YSc6ICd6JywgICdcXHUwMTdjJzogJ3onLCAnXFx1MDE3ZSc6ICd6JyxcclxuICAgICdcXHUwMTMyJzogJ0lKJywgJ1xcdTAxMzMnOiAnaWonLFxyXG4gICAgJ1xcdTAxNTInOiAnT2UnLCAnXFx1MDE1Myc6ICdvZScsXHJcbiAgICAnXFx1MDE0OSc6IFwiJ25cIiwgJ1xcdTAxN2YnOiAncydcclxuICB9O1xyXG5cclxuICAvKiogVXNlZCB0byBtYXRjaCBMYXRpbiBVbmljb2RlIGxldHRlcnMgKGV4Y2x1ZGluZyBtYXRoZW1hdGljYWwgb3BlcmF0b3JzKS4gKi9cclxuICB2YXIgcmVMYXRpbiA9IC9bXFx4YzAtXFx4ZDZcXHhkOC1cXHhmNlxceGY4LVxceGZmXFx1MDEwMC1cXHUwMTdmXS9nO1xyXG5cclxuICAvKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXHJcbiAgdmFyIHJzQ29tYm9NYXJrc1JhbmdlID0gJ1xcXFx1MDMwMC1cXFxcdTAzNmYnLFxyXG4gICAgICByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgPSAnXFxcXHVmZTIwLVxcXFx1ZmUyZicsXHJcbiAgICAgIHJzQ29tYm9TeW1ib2xzUmFuZ2UgPSAnXFxcXHUyMGQwLVxcXFx1MjBmZicsXHJcbiAgICAgIHJzQ29tYm9NYXJrc0V4dGVuZGVkUmFuZ2UgPSAnXFxcXHUxYWIwLVxcXFx1MWFmZicsXHJcbiAgICAgIHJzQ29tYm9NYXJrc1N1cHBsZW1lbnRSYW5nZSA9ICdcXFxcdTFkYzAtXFxcXHUxZGZmJyxcclxuICAgICAgcnNDb21ib1JhbmdlID0gcnNDb21ib01hcmtzUmFuZ2UgKyByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgKyByc0NvbWJvU3ltYm9sc1JhbmdlICsgcnNDb21ib01hcmtzRXh0ZW5kZWRSYW5nZSArIHJzQ29tYm9NYXJrc1N1cHBsZW1lbnRSYW5nZTtcclxuXHJcbiAgLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNhcHR1cmUgZ3JvdXBzLiAqL1xyXG4gIHZhciByc0NvbWJvID0gJ1snICsgcnNDb21ib1JhbmdlICsgJ10nO1xyXG5cclxuICAvKipcclxuICAgKiBVc2VkIHRvIG1hdGNoIFtjb21iaW5pbmcgZGlhY3JpdGljYWwgbWFya3NdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbWJpbmluZ19EaWFjcml0aWNhbF9NYXJrcykgYW5kXHJcbiAgICogW2NvbWJpbmluZyBkaWFjcml0aWNhbCBtYXJrcyBmb3Igc3ltYm9sc10oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29tYmluaW5nX0RpYWNyaXRpY2FsX01hcmtzX2Zvcl9TeW1ib2xzKS5cclxuICAgKi9cclxuICB2YXIgcmVDb21ib01hcmsgPSBSZWdFeHAocnNDb21ibywgJ2cnKTtcclxuXHJcbiAgZnVuY3Rpb24gZGVidXJyTGV0dGVyIChrZXkpIHtcclxuICAgIHJldHVybiBkZWJ1cnJlZExldHRlcnNba2V5XTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemVUb0Jhc2UgKHN0cmluZykge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nLnRvU3RyaW5nKCk7XHJcbiAgICByZXR1cm4gc3RyaW5nICYmIHN0cmluZy5yZXBsYWNlKHJlTGF0aW4sIGRlYnVyckxldHRlcikucmVwbGFjZShyZUNvbWJvTWFyaywgJycpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cclxuICB2YXIgZXNjYXBlTWFwID0ge1xyXG4gICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgJzwnOiAnJmx0OycsXHJcbiAgICAnPic6ICcmZ3Q7JyxcclxuICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgXCInXCI6ICcmI3gyNzsnLFxyXG4gICAgJ2AnOiAnJiN4NjA7J1xyXG4gIH07XHJcblxyXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cclxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uIChtYXApIHtcclxuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xyXG4gICAgfTtcclxuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZC5cclxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIE9iamVjdC5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xyXG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcclxuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcclxuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHZhciBodG1sRXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIGtleUNvZGVNYXAgPSB7XHJcbiAgICAzMjogJyAnLFxyXG4gICAgNDg6ICcwJyxcclxuICAgIDQ5OiAnMScsXHJcbiAgICA1MDogJzInLFxyXG4gICAgNTE6ICczJyxcclxuICAgIDUyOiAnNCcsXHJcbiAgICA1MzogJzUnLFxyXG4gICAgNTQ6ICc2JyxcclxuICAgIDU1OiAnNycsXHJcbiAgICA1NjogJzgnLFxyXG4gICAgNTc6ICc5JyxcclxuICAgIDU5OiAnOycsXHJcbiAgICA2NTogJ0EnLFxyXG4gICAgNjY6ICdCJyxcclxuICAgIDY3OiAnQycsXHJcbiAgICA2ODogJ0QnLFxyXG4gICAgNjk6ICdFJyxcclxuICAgIDcwOiAnRicsXHJcbiAgICA3MTogJ0cnLFxyXG4gICAgNzI6ICdIJyxcclxuICAgIDczOiAnSScsXHJcbiAgICA3NDogJ0onLFxyXG4gICAgNzU6ICdLJyxcclxuICAgIDc2OiAnTCcsXHJcbiAgICA3NzogJ00nLFxyXG4gICAgNzg6ICdOJyxcclxuICAgIDc5OiAnTycsXHJcbiAgICA4MDogJ1AnLFxyXG4gICAgODE6ICdRJyxcclxuICAgIDgyOiAnUicsXHJcbiAgICA4MzogJ1MnLFxyXG4gICAgODQ6ICdUJyxcclxuICAgIDg1OiAnVScsXHJcbiAgICA4NjogJ1YnLFxyXG4gICAgODc6ICdXJyxcclxuICAgIDg4OiAnWCcsXHJcbiAgICA4OTogJ1knLFxyXG4gICAgOTA6ICdaJyxcclxuICAgIDk2OiAnMCcsXHJcbiAgICA5NzogJzEnLFxyXG4gICAgOTg6ICcyJyxcclxuICAgIDk5OiAnMycsXHJcbiAgICAxMDA6ICc0JyxcclxuICAgIDEwMTogJzUnLFxyXG4gICAgMTAyOiAnNicsXHJcbiAgICAxMDM6ICc3JyxcclxuICAgIDEwNDogJzgnLFxyXG4gICAgMTA1OiAnOSdcclxuICB9O1xyXG5cclxuICB2YXIga2V5Q29kZXMgPSB7XHJcbiAgICBFU0NBUEU6IDI3LCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBFc2NhcGUgKEVzYykga2V5XHJcbiAgICBFTlRFUjogMTMsIC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIEVudGVyIGtleVxyXG4gICAgU1BBQ0U6IDMyLCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBzcGFjZSBrZXlcclxuICAgIFRBQjogOSwgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgdGFiIGtleVxyXG4gICAgQVJST1dfVVA6IDM4LCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciB1cCBhcnJvdyBrZXlcclxuICAgIEFSUk9XX0RPV046IDQwIC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIGRvd24gYXJyb3cga2V5XHJcbiAgfVxyXG5cclxuICB2YXIgdmVyc2lvbiA9IHtcclxuICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgbWFqb3I6ICczJ1xyXG4gIH07XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2ZXJzaW9uLmZ1bGwgPSAoJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3Rvci5WRVJTSU9OIHx8ICcnKS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJyk7XHJcbiAgICB2ZXJzaW9uLm1ham9yID0gdmVyc2lvbi5mdWxsWzBdO1xyXG4gICAgdmVyc2lvbi5zdWNjZXNzID0gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxuICB9XHJcblxyXG4gIHZhciBzZWxlY3RJZCA9IDA7XHJcblxyXG4gIHZhciBFVkVOVF9LRVkgPSAnLmJzLnNlbGVjdCc7XHJcblxyXG4gIHZhciBjbGFzc05hbWVzID0ge1xyXG4gICAgRElTQUJMRUQ6ICdkaXNhYmxlZCcsXHJcbiAgICBESVZJREVSOiAnZGl2aWRlcicsXHJcbiAgICBTSE9XOiAnb3BlbicsXHJcbiAgICBEUk9QVVA6ICdkcm9wdXAnLFxyXG4gICAgTUVOVTogJ2Ryb3Bkb3duLW1lbnUnLFxyXG4gICAgTUVOVVJJR0hUOiAnZHJvcGRvd24tbWVudS1yaWdodCcsXHJcbiAgICBNRU5VTEVGVDogJ2Ryb3Bkb3duLW1lbnUtbGVmdCcsXHJcbiAgICAvLyB0by1kbzogcmVwbGFjZSB3aXRoIG1vcmUgYWR2YW5jZWQgdGVtcGxhdGUvY3VzdG9taXphdGlvbiBvcHRpb25zXHJcbiAgICBCVVRUT05DTEFTUzogJ2J0bi1kZWZhdWx0JyxcclxuICAgIFBPUE9WRVJIRUFERVI6ICdwb3BvdmVyLXRpdGxlJyxcclxuICAgIElDT05CQVNFOiAnZ2x5cGhpY29uJyxcclxuICAgIFRJQ0tJQ09OOiAnZ2x5cGhpY29uLW9rJ1xyXG4gIH1cclxuXHJcbiAgdmFyIFNlbGVjdG9yID0ge1xyXG4gICAgTUVOVTogJy4nICsgY2xhc3NOYW1lcy5NRU5VXHJcbiAgfVxyXG5cclxuICB2YXIgZWxlbWVudFRlbXBsYXRlcyA9IHtcclxuICAgIHNwYW46IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcclxuICAgIGk6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKSxcclxuICAgIHN1YnRleHQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NtYWxsJyksXHJcbiAgICBhOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXHJcbiAgICBsaTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSxcclxuICAgIHdoaXRlc3BhY2U6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdcXHUwMEEwJyksXHJcbiAgICBmcmFnbWVudDogZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXHJcbiAgfVxyXG5cclxuICBlbGVtZW50VGVtcGxhdGVzLmEuc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpO1xyXG4gIGVsZW1lbnRUZW1wbGF0ZXMuc3VidGV4dC5jbGFzc05hbWUgPSAndGV4dC1tdXRlZCc7XHJcblxyXG4gIGVsZW1lbnRUZW1wbGF0ZXMudGV4dCA9IGVsZW1lbnRUZW1wbGF0ZXMuc3Bhbi5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gIGVsZW1lbnRUZW1wbGF0ZXMudGV4dC5jbGFzc05hbWUgPSAndGV4dCc7XHJcblxyXG4gIGVsZW1lbnRUZW1wbGF0ZXMuY2hlY2tNYXJrID0gZWxlbWVudFRlbXBsYXRlcy5zcGFuLmNsb25lTm9kZShmYWxzZSk7XHJcblxyXG4gIHZhciBSRUdFWFBfQVJST1cgPSBuZXcgUmVnRXhwKGtleUNvZGVzLkFSUk9XX1VQICsgJ3wnICsga2V5Q29kZXMuQVJST1dfRE9XTik7XHJcbiAgdmFyIFJFR0VYUF9UQUJfT1JfRVNDQVBFID0gbmV3IFJlZ0V4cCgnXicgKyBrZXlDb2Rlcy5UQUIgKyAnJHwnICsga2V5Q29kZXMuRVNDQVBFKTtcclxuXHJcbiAgdmFyIGdlbmVyYXRlT3B0aW9uID0ge1xyXG4gICAgbGk6IGZ1bmN0aW9uIChjb250ZW50LCBjbGFzc2VzLCBvcHRncm91cCkge1xyXG4gICAgICB2YXIgbGkgPSBlbGVtZW50VGVtcGxhdGVzLmxpLmNsb25lTm9kZShmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoY29udGVudCkge1xyXG4gICAgICAgIGlmIChjb250ZW50Lm5vZGVUeXBlID09PSAxIHx8IGNvbnRlbnQubm9kZVR5cGUgPT09IDExKSB7XHJcbiAgICAgICAgICBsaS5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGkuaW5uZXJIVE1MID0gY29udGVudDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgY2xhc3NlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xhc3NlcyAhPT0gJycpIGxpLmNsYXNzTmFtZSA9IGNsYXNzZXM7XHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0Z3JvdXAgIT09ICd1bmRlZmluZWQnICYmIG9wdGdyb3VwICE9PSBudWxsKSBsaS5jbGFzc0xpc3QuYWRkKCdvcHRncm91cC0nICsgb3B0Z3JvdXApO1xyXG5cclxuICAgICAgcmV0dXJuIGxpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhOiBmdW5jdGlvbiAodGV4dCwgY2xhc3NlcywgaW5saW5lKSB7XHJcbiAgICAgIHZhciBhID0gZWxlbWVudFRlbXBsYXRlcy5hLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgaWYgKHRleHQubm9kZVR5cGUgPT09IDExKSB7XHJcbiAgICAgICAgICBhLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGNsYXNzZXMgIT09ICd1bmRlZmluZWQnICYmIGNsYXNzZXMgIT09ICcnKSBhLmNsYXNzTmFtZSA9IGNsYXNzZXM7XHJcbiAgICAgIGlmICh2ZXJzaW9uLm1ham9yID09PSAnNCcpIGEuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24taXRlbScpO1xyXG4gICAgICBpZiAoaW5saW5lKSBhLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBpbmxpbmUpO1xyXG5cclxuICAgICAgcmV0dXJuIGE7XHJcbiAgICB9LFxyXG5cclxuICAgIHRleHQ6IGZ1bmN0aW9uIChvcHRpb25zLCB1c2VGcmFnbWVudCkge1xyXG4gICAgICB2YXIgdGV4dEVsZW1lbnQgPSBlbGVtZW50VGVtcGxhdGVzLnRleHQuY2xvbmVOb2RlKGZhbHNlKSxcclxuICAgICAgICAgIHN1YnRleHRFbGVtZW50LFxyXG4gICAgICAgICAgaWNvbkVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5jb250ZW50KSB7XHJcbiAgICAgICAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gb3B0aW9ucy5jb250ZW50O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRleHRFbGVtZW50LnRleHRDb250ZW50ID0gb3B0aW9ucy50ZXh0O1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29uKSB7XHJcbiAgICAgICAgICB2YXIgd2hpdGVzcGFjZSA9IGVsZW1lbnRUZW1wbGF0ZXMud2hpdGVzcGFjZS5jbG9uZU5vZGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAgIC8vIG5lZWQgdG8gdXNlIDxpPiBmb3IgaWNvbnMgaW4gdGhlIGJ1dHRvbiB0byBwcmV2ZW50IGEgYnJlYWtpbmcgY2hhbmdlXHJcbiAgICAgICAgICAvLyBub3RlOiBzd2l0Y2ggdG8gc3BhbiBpbiBuZXh0IG1ham9yIHJlbGVhc2VcclxuICAgICAgICAgIGljb25FbGVtZW50ID0gKHVzZUZyYWdtZW50ID09PSB0cnVlID8gZWxlbWVudFRlbXBsYXRlcy5pIDogZWxlbWVudFRlbXBsYXRlcy5zcGFuKS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgICAgICAgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gb3B0aW9ucy5pY29uQmFzZSArICcgJyArIG9wdGlvbnMuaWNvbjtcclxuXHJcbiAgICAgICAgICBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50LmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcclxuICAgICAgICAgIGVsZW1lbnRUZW1wbGF0ZXMuZnJhZ21lbnQuYXBwZW5kQ2hpbGQod2hpdGVzcGFjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5zdWJ0ZXh0KSB7XHJcbiAgICAgICAgICBzdWJ0ZXh0RWxlbWVudCA9IGVsZW1lbnRUZW1wbGF0ZXMuc3VidGV4dC5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgICAgICAgc3VidGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSBvcHRpb25zLnN1YnRleHQ7XHJcbiAgICAgICAgICB0ZXh0RWxlbWVudC5hcHBlbmRDaGlsZChzdWJ0ZXh0RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodXNlRnJhZ21lbnQgPT09IHRydWUpIHtcclxuICAgICAgICB3aGlsZSAodGV4dEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50LmFwcGVuZENoaWxkKHRleHRFbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50LmFwcGVuZENoaWxkKHRleHRFbGVtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnRUZW1wbGF0ZXMuZnJhZ21lbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIGxhYmVsOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICB2YXIgdGV4dEVsZW1lbnQgPSBlbGVtZW50VGVtcGxhdGVzLnRleHQuY2xvbmVOb2RlKGZhbHNlKSxcclxuICAgICAgICAgIHN1YnRleHRFbGVtZW50LFxyXG4gICAgICAgICAgaWNvbkVsZW1lbnQ7XHJcblxyXG4gICAgICB0ZXh0RWxlbWVudC5pbm5lckhUTUwgPSBvcHRpb25zLmxhYmVsO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaWNvbikge1xyXG4gICAgICAgIHZhciB3aGl0ZXNwYWNlID0gZWxlbWVudFRlbXBsYXRlcy53aGl0ZXNwYWNlLmNsb25lTm9kZShmYWxzZSk7XHJcblxyXG4gICAgICAgIGljb25FbGVtZW50ID0gZWxlbWVudFRlbXBsYXRlcy5zcGFuLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gb3B0aW9ucy5pY29uQmFzZSArICcgJyArIG9wdGlvbnMuaWNvbjtcclxuXHJcbiAgICAgICAgZWxlbWVudFRlbXBsYXRlcy5mcmFnbWVudC5hcHBlbmRDaGlsZChpY29uRWxlbWVudCk7XHJcbiAgICAgICAgZWxlbWVudFRlbXBsYXRlcy5mcmFnbWVudC5hcHBlbmRDaGlsZCh3aGl0ZXNwYWNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuc3VidGV4dCkge1xyXG4gICAgICAgIHN1YnRleHRFbGVtZW50ID0gZWxlbWVudFRlbXBsYXRlcy5zdWJ0ZXh0LmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgc3VidGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSBvcHRpb25zLnN1YnRleHQ7XHJcbiAgICAgICAgdGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQoc3VidGV4dEVsZW1lbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50LmFwcGVuZENoaWxkKHRleHRFbGVtZW50KTtcclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIFNlbGVjdHBpY2tlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgLy8gYm9vdHN0cmFwLXNlbGVjdCBoYXMgYmVlbiBpbml0aWFsaXplZCAtIHJldmVydCB2YWxIb29rcy5zZWxlY3Quc2V0IGJhY2sgdG8gaXRzIG9yaWdpbmFsIGZ1bmN0aW9uXHJcbiAgICBpZiAoIXZhbEhvb2tzLnVzZURlZmF1bHQpIHtcclxuICAgICAgJC52YWxIb29rcy5zZWxlY3Quc2V0ID0gdmFsSG9va3MuX3NldDtcclxuICAgICAgdmFsSG9va3MudXNlRGVmYXVsdCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcbiAgICB0aGlzLiRuZXdFbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuJGJ1dHRvbiA9IG51bGw7XHJcbiAgICB0aGlzLiRtZW51ID0gbnVsbDtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLnNlbGVjdHBpY2tlciA9IHtcclxuICAgICAgbWFpbjoge30sXHJcbiAgICAgIHNlYXJjaDoge30sXHJcbiAgICAgIGN1cnJlbnQ6IHt9LCAvLyBjdXJyZW50IGNoYW5nZXMgaWYgYSBzZWFyY2ggaXMgaW4gcHJvZ3Jlc3NcclxuICAgICAgdmlldzoge30sXHJcbiAgICAgIGtleWRvd246IHtcclxuICAgICAgICBrZXlIaXN0b3J5OiAnJyxcclxuICAgICAgICByZXNldEtleUhpc3Rvcnk6IHtcclxuICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5rZXlkb3duLmtleUhpc3RvcnkgPSAnJztcclxuICAgICAgICAgICAgfSwgODAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBJZiB3ZSBoYXZlIG5vIHRpdGxlIHlldCwgdHJ5IHRvIHB1bGwgaXQgZnJvbSB0aGUgaHRtbCB0aXRsZSBhdHRyaWJ1dGUgKGpRdWVyeSBkb2VzbnQnIHBpY2sgaXQgdXAgYXMgaXQncyBub3QgYVxyXG4gICAgLy8gZGF0YS1hdHRyaWJ1dGUpXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy50aXRsZSA9IHRoaXMuJGVsZW1lbnQuYXR0cigndGl0bGUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtYXQgd2luZG93IHBhZGRpbmdcclxuICAgIHZhciB3aW5QYWQgPSB0aGlzLm9wdGlvbnMud2luZG93UGFkZGluZztcclxuICAgIGlmICh0eXBlb2Ygd2luUGFkID09PSAnbnVtYmVyJykge1xyXG4gICAgICB0aGlzLm9wdGlvbnMud2luZG93UGFkZGluZyA9IFt3aW5QYWQsIHdpblBhZCwgd2luUGFkLCB3aW5QYWRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4cG9zZSBwdWJsaWMgbWV0aG9kc1xyXG4gICAgdGhpcy52YWwgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnZhbDtcclxuICAgIHRoaXMucmVuZGVyID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5yZW5kZXI7XHJcbiAgICB0aGlzLnJlZnJlc2ggPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnJlZnJlc2g7XHJcbiAgICB0aGlzLnNldFN0eWxlID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5zZXRTdHlsZTtcclxuICAgIHRoaXMuc2VsZWN0QWxsID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5zZWxlY3RBbGw7XHJcbiAgICB0aGlzLmRlc2VsZWN0QWxsID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5kZXNlbGVjdEFsbDtcclxuICAgIHRoaXMuZGVzdHJveSA9IFNlbGVjdHBpY2tlci5wcm90b3R5cGUuZGVzdHJveTtcclxuICAgIHRoaXMucmVtb3ZlID0gU2VsZWN0cGlja2VyLnByb3RvdHlwZS5yZW1vdmU7XHJcbiAgICB0aGlzLnNob3cgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLnNob3c7XHJcbiAgICB0aGlzLmhpZGUgPSBTZWxlY3RwaWNrZXIucHJvdG90eXBlLmhpZGU7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0cGlja2VyLlZFUlNJT04gPSAnMS4xMy4xMCc7XHJcblxyXG4gIC8vIHBhcnQgb2YgdGhpcyBpcyBkdXBsaWNhdGVkIGluIGkxOG4vZGVmYXVsdHMtZW5fVVMuanMuIE1ha2Ugc3VyZSB0byB1cGRhdGUgYm90aC5cclxuICBTZWxlY3RwaWNrZXIuREVGQVVMVFMgPSB7XHJcbiAgICBub25lU2VsZWN0ZWRUZXh0OiAnTm90aGluZyBzZWxlY3RlZCcsXHJcbiAgICBub25lUmVzdWx0c1RleHQ6ICdObyByZXN1bHRzIG1hdGNoZWQgezB9JyxcclxuICAgIGNvdW50U2VsZWN0ZWRUZXh0OiBmdW5jdGlvbiAobnVtU2VsZWN0ZWQsIG51bVRvdGFsKSB7XHJcbiAgICAgIHJldHVybiAobnVtU2VsZWN0ZWQgPT0gMSkgPyAnezB9IGl0ZW0gc2VsZWN0ZWQnIDogJ3swfSBpdGVtcyBzZWxlY3RlZCc7XHJcbiAgICB9LFxyXG4gICAgbWF4T3B0aW9uc1RleHQ6IGZ1bmN0aW9uIChudW1BbGwsIG51bUdyb3VwKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgKG51bUFsbCA9PSAxKSA/ICdMaW1pdCByZWFjaGVkICh7bn0gaXRlbSBtYXgpJyA6ICdMaW1pdCByZWFjaGVkICh7bn0gaXRlbXMgbWF4KScsXHJcbiAgICAgICAgKG51bUdyb3VwID09IDEpID8gJ0dyb3VwIGxpbWl0IHJlYWNoZWQgKHtufSBpdGVtIG1heCknIDogJ0dyb3VwIGxpbWl0IHJlYWNoZWQgKHtufSBpdGVtcyBtYXgpJ1xyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICAgIHNlbGVjdEFsbFRleHQ6ICdTZWxlY3QgQWxsJyxcclxuICAgIGRlc2VsZWN0QWxsVGV4dDogJ0Rlc2VsZWN0IEFsbCcsXHJcbiAgICBkb25lQnV0dG9uOiBmYWxzZSxcclxuICAgIGRvbmVCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgbXVsdGlwbGVTZXBhcmF0b3I6ICcsICcsXHJcbiAgICBzdHlsZUJhc2U6ICdidG4nLFxyXG4gICAgc3R5bGU6IGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MsXHJcbiAgICBzaXplOiAnYXV0bycsXHJcbiAgICB0aXRsZTogbnVsbCxcclxuICAgIHNlbGVjdGVkVGV4dEZvcm1hdDogJ3ZhbHVlcycsXHJcbiAgICB3aWR0aDogZmFsc2UsXHJcbiAgICBjb250YWluZXI6IGZhbHNlLFxyXG4gICAgaGlkZURpc2FibGVkOiBmYWxzZSxcclxuICAgIHNob3dTdWJ0ZXh0OiBmYWxzZSxcclxuICAgIHNob3dJY29uOiB0cnVlLFxyXG4gICAgc2hvd0NvbnRlbnQ6IHRydWUsXHJcbiAgICBkcm9wdXBBdXRvOiB0cnVlLFxyXG4gICAgaGVhZGVyOiBmYWxzZSxcclxuICAgIGxpdmVTZWFyY2g6IGZhbHNlLFxyXG4gICAgbGl2ZVNlYXJjaFBsYWNlaG9sZGVyOiBudWxsLFxyXG4gICAgbGl2ZVNlYXJjaE5vcm1hbGl6ZTogZmFsc2UsXHJcbiAgICBsaXZlU2VhcmNoU3R5bGU6ICdjb250YWlucycsXHJcbiAgICBhY3Rpb25zQm94OiBmYWxzZSxcclxuICAgIGljb25CYXNlOiBjbGFzc05hbWVzLklDT05CQVNFLFxyXG4gICAgdGlja0ljb246IGNsYXNzTmFtZXMuVElDS0lDT04sXHJcbiAgICBzaG93VGljazogZmFsc2UsXHJcbiAgICB0ZW1wbGF0ZToge1xyXG4gICAgICBjYXJldDogJzxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+J1xyXG4gICAgfSxcclxuICAgIG1heE9wdGlvbnM6IGZhbHNlLFxyXG4gICAgbW9iaWxlOiBmYWxzZSxcclxuICAgIHNlbGVjdE9uVGFiOiBmYWxzZSxcclxuICAgIGRyb3Bkb3duQWxpZ25SaWdodDogZmFsc2UsXHJcbiAgICB3aW5kb3dQYWRkaW5nOiAwLFxyXG4gICAgdmlydHVhbFNjcm9sbDogNjAwLFxyXG4gICAgZGlzcGxheTogZmFsc2UsXHJcbiAgICBzYW5pdGl6ZTogdHJ1ZSxcclxuICAgIHNhbml0aXplRm46IG51bGwsXHJcbiAgICB3aGl0ZUxpc3Q6IERlZmF1bHRXaGl0ZWxpc3RcclxuICB9O1xyXG5cclxuICBTZWxlY3RwaWNrZXIucHJvdG90eXBlID0ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yOiBTZWxlY3RwaWNrZXIsXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICBpZCA9IHRoaXMuJGVsZW1lbnQuYXR0cignaWQnKTtcclxuXHJcbiAgICAgIHNlbGVjdElkKys7XHJcbiAgICAgIHRoaXMuc2VsZWN0SWQgPSAnYnMtc2VsZWN0LScgKyBzZWxlY3RJZDtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uY2xhc3NMaXN0LmFkZCgnYnMtc2VsZWN0LWhpZGRlbicpO1xyXG5cclxuICAgICAgdGhpcy5tdWx0aXBsZSA9IHRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKTtcclxuICAgICAgdGhpcy5hdXRvZm9jdXMgPSB0aGlzLiRlbGVtZW50LnByb3AoJ2F1dG9mb2N1cycpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93LXRpY2snKSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zaG93VGljayA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQgPSB0aGlzLmNyZWF0ZURyb3Bkb3duKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAuYWZ0ZXIodGhpcy4kbmV3RWxlbWVudClcclxuICAgICAgICAucHJlcGVuZFRvKHRoaXMuJG5ld0VsZW1lbnQpO1xyXG5cclxuICAgICAgdGhpcy4kYnV0dG9uID0gdGhpcy4kbmV3RWxlbWVudC5jaGlsZHJlbignYnV0dG9uJyk7XHJcbiAgICAgIHRoaXMuJG1lbnUgPSB0aGlzLiRuZXdFbGVtZW50LmNoaWxkcmVuKFNlbGVjdG9yLk1FTlUpO1xyXG4gICAgICB0aGlzLiRtZW51SW5uZXIgPSB0aGlzLiRtZW51LmNoaWxkcmVuKCcuaW5uZXInKTtcclxuICAgICAgdGhpcy4kc2VhcmNoYm94ID0gdGhpcy4kbWVudS5maW5kKCdpbnB1dCcpO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudFswXS5jbGFzc0xpc3QucmVtb3ZlKCdicy1zZWxlY3QtaGlkZGVuJyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRyb3Bkb3duQWxpZ25SaWdodCA9PT0gdHJ1ZSkgdGhpcy4kbWVudVswXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXMuTUVOVVJJR0hUKTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy4kYnV0dG9uLmF0dHIoJ2RhdGEtaWQnLCBpZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2hlY2tEaXNhYmxlZCgpO1xyXG4gICAgICB0aGlzLmNsaWNrTGlzdGVuZXIoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGl2ZVNlYXJjaCkge1xyXG4gICAgICAgIHRoaXMubGl2ZVNlYXJjaExpc3RlbmVyKCk7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkUGFyZW50ID0gdGhpcy4kc2VhcmNoYm94WzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZFBhcmVudCA9IHRoaXMuJG1lbnVJbm5lclswXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdHlsZSgpO1xyXG4gICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICB0aGlzLnNldFdpZHRoKCk7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RQb3NpdGlvbigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2hpZGUnICsgRVZFTlRfS0VZLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAodGhhdC5pc1ZpcnR1YWwoKSkge1xyXG4gICAgICAgICAgICAvLyBlbXB0eSBtZW51IG9uIGNsb3NlXHJcbiAgICAgICAgICAgIHZhciBtZW51SW5uZXIgPSB0aGF0LiRtZW51SW5uZXJbMF0sXHJcbiAgICAgICAgICAgICAgICBlbXB0eU1lbnUgPSBtZW51SW5uZXIuZmlyc3RDaGlsZC5jbG9uZU5vZGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgVUwgd2l0aCBhbiBlbXB0eSBvbmUgLSB0aGlzIGlzIGZhc3RlciB0aGFuICQuZW1wdHkoKSBvciBpbm5lckhUTUwgPSAnJ1xyXG4gICAgICAgICAgICBtZW51SW5uZXIucmVwbGFjZUNoaWxkKGVtcHR5TWVudSwgbWVudUlubmVyLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICBtZW51SW5uZXIuc2Nyb2xsVG9wID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRtZW51LmRhdGEoJ3RoaXMnLCB0aGlzKTtcclxuICAgICAgdGhpcy4kbmV3RWxlbWVudC5kYXRhKCd0aGlzJywgdGhpcyk7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubW9iaWxlKSB0aGlzLm1vYmlsZSgpO1xyXG5cclxuICAgICAgdGhpcy4kbmV3RWxlbWVudC5vbih7XHJcbiAgICAgICAgJ2hpZGUuYnMuZHJvcGRvd24nOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRlJyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaGlkZGVuLmJzLmRyb3Bkb3duJzogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuJyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnc2hvdy5icy5kcm9wZG93bic6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3cnICsgRVZFTlRfS0VZLCBlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdzaG93bi5icy5kcm9wZG93bic6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3duJyArIEVWRU5UX0tFWSwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50WzBdLmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSkge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2ludmFsaWQnICsgRVZFTlRfS0VZLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LiRidXR0b25bMF0uY2xhc3NMaXN0LmFkZCgnYnMtaW52YWxpZCcpO1xyXG5cclxuICAgICAgICAgIHRoYXQuJGVsZW1lbnRcclxuICAgICAgICAgICAgLm9uKCdzaG93bicgKyBFVkVOVF9LRVkgKyAnLmludmFsaWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC4kZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgLnZhbCh0aGF0LiRlbGVtZW50LnZhbCgpKSAvLyBzZXQgdGhlIHZhbHVlIHRvIGhpZGUgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBpbiBDaHJvbWUgd2hlbiBtZW51IGlzIG9wZW5lZFxyXG4gICAgICAgICAgICAgICAgLm9mZignc2hvd24nICsgRVZFTlRfS0VZICsgJy5pbnZhbGlkJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbigncmVuZGVyZWQnICsgRVZFTlRfS0VZLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgLy8gaWYgc2VsZWN0IGlzIG5vIGxvbmdlciBpbnZhbGlkLCByZW1vdmUgdGhlIGJzLWludmFsaWQgY2xhc3NcclxuICAgICAgICAgICAgICBpZiAodGhpcy52YWxpZGl0eS52YWxpZCkgdGhhdC4kYnV0dG9uWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2JzLWludmFsaWQnKTtcclxuICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50Lm9mZigncmVuZGVyZWQnICsgRVZFTlRfS0VZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhhdC4kYnV0dG9uLm9uKCdibHVyJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcignYmx1cicpO1xyXG4gICAgICAgICAgICB0aGF0LiRidXR0b24ub2ZmKCdibHVyJyArIEVWRU5UX0tFWSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhhdC5jcmVhdGVMaSgpO1xyXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignbG9hZGVkJyArIEVWRU5UX0tFWSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVEcm9wZG93bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBPcHRpb25zXHJcbiAgICAgIC8vIElmIHdlIGFyZSBtdWx0aXBsZSBvciBzaG93VGljayBvcHRpb24gaXMgc2V0LCB0aGVuIGFkZCB0aGUgc2hvdy10aWNrIGNsYXNzXHJcbiAgICAgIHZhciBzaG93VGljayA9ICh0aGlzLm11bHRpcGxlIHx8IHRoaXMub3B0aW9ucy5zaG93VGljaykgPyAnIHNob3ctdGljaycgOiAnJyxcclxuICAgICAgICAgIG11bHRpc2VsZWN0YWJsZSA9IHRoaXMubXVsdGlwbGUgPyAnIGFyaWEtbXVsdGlzZWxlY3RhYmxlPVwidHJ1ZVwiJyA6ICcnLFxyXG4gICAgICAgICAgaW5wdXRHcm91cCA9ICcnLFxyXG4gICAgICAgICAgYXV0b2ZvY3VzID0gdGhpcy5hdXRvZm9jdXMgPyAnIGF1dG9mb2N1cycgOiAnJztcclxuXHJcbiAgICAgIGlmICh2ZXJzaW9uLm1ham9yIDwgNCAmJiB0aGlzLiRlbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCdpbnB1dC1ncm91cCcpKSB7XHJcbiAgICAgICAgaW5wdXRHcm91cCA9ICcgaW5wdXQtZ3JvdXAtYnRuJztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRWxlbWVudHNcclxuICAgICAgdmFyIGRyb3AsXHJcbiAgICAgICAgICBoZWFkZXIgPSAnJyxcclxuICAgICAgICAgIHNlYXJjaGJveCA9ICcnLFxyXG4gICAgICAgICAgYWN0aW9uc2JveCA9ICcnLFxyXG4gICAgICAgICAgZG9uZWJ1dHRvbiA9ICcnO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXIpIHtcclxuICAgICAgICBoZWFkZXIgPVxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCInICsgY2xhc3NOYW1lcy5QT1BPVkVSSEVBREVSICsgJ1wiPicgK1xyXG4gICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L2J1dHRvbj4nICtcclxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuaGVhZGVyICtcclxuICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICBzZWFyY2hib3ggPVxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJicy1zZWFyY2hib3hcIj4nICtcclxuICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCInICtcclxuICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGl2ZVNlYXJjaFBsYWNlaG9sZGVyID09PSBudWxsID8gJydcclxuICAgICAgICAgICAgICAgIDpcclxuICAgICAgICAgICAgICAgICcgcGxhY2Vob2xkZXI9XCInICsgaHRtbEVzY2FwZSh0aGlzLm9wdGlvbnMubGl2ZVNlYXJjaFBsYWNlaG9sZGVyKSArICdcIidcclxuICAgICAgICAgICAgICApICtcclxuICAgICAgICAgICAgICAnIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtbGFiZWw9XCJTZWFyY2hcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHRoaXMuc2VsZWN0SWQgKyAnXCIgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCI+JyArXHJcbiAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdGhpcy5vcHRpb25zLmFjdGlvbnNCb3gpIHtcclxuICAgICAgICBhY3Rpb25zYm94ID1cclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnMtYWN0aW9uc2JveFwiPicgK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gYnRuLWJsb2NrXCI+JyArXHJcbiAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYWN0aW9ucy1idG4gYnMtc2VsZWN0LWFsbCBidG4gJyArIGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MgKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VsZWN0QWxsVGV4dCArXHJcbiAgICAgICAgICAgICAgJzwvYnV0dG9uPicgK1xyXG4gICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImFjdGlvbnMtYnRuIGJzLWRlc2VsZWN0LWFsbCBidG4gJyArIGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MgKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVzZWxlY3RBbGxUZXh0ICtcclxuICAgICAgICAgICAgICAnPC9idXR0b24+JyArXHJcbiAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLm9wdGlvbnMuZG9uZUJ1dHRvbikge1xyXG4gICAgICAgIGRvbmVidXR0b24gPVxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJicy1kb25lYnV0dG9uXCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGJ0bi1ibG9ja1wiPicgK1xyXG4gICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc20gJyArIGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MgKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZG9uZUJ1dHRvblRleHQgK1xyXG4gICAgICAgICAgICAgICc8L2J1dHRvbj4nICtcclxuICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRyb3AgPVxyXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZHJvcGRvd24gYm9vdHN0cmFwLXNlbGVjdCcgKyBzaG93VGljayArIGlucHV0R3JvdXAgKyAnXCI+JyArXHJcbiAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCInICsgdGhpcy5vcHRpb25zLnN0eWxlQmFzZSArICcgZHJvcGRvd24tdG9nZ2xlXCIgJyArICh0aGlzLm9wdGlvbnMuZGlzcGxheSA9PT0gJ3N0YXRpYycgPyAnZGF0YS1kaXNwbGF5PVwic3RhdGljXCInIDogJycpICsgJ2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIicgKyBhdXRvZm9jdXMgKyAnIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtb3ducz1cIicgKyB0aGlzLnNlbGVjdElkICsgJ1wiIGFyaWEtaGFzcG9wdXA9XCJsaXN0Ym94XCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmlsdGVyLW9wdGlvblwiPicgK1xyXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmlsdGVyLW9wdGlvbi1pbm5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaWx0ZXItb3B0aW9uLWlubmVyLWlubmVyXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgJzwvZGl2PiAnICtcclxuICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgdmVyc2lvbi5tYWpvciA9PT0gJzQnID8gJydcclxuICAgICAgICAgICAgICA6XHJcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiYnMtY2FyZXRcIj4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50ZW1wbGF0ZS5jYXJldCArXHJcbiAgICAgICAgICAgICAgJzwvc3Bhbj4nXHJcbiAgICAgICAgICAgICkgK1xyXG4gICAgICAgICAgJzwvYnV0dG9uPicgK1xyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCInICsgY2xhc3NOYW1lcy5NRU5VICsgJyAnICsgKHZlcnNpb24ubWFqb3IgPT09ICc0JyA/ICcnIDogY2xhc3NOYW1lcy5TSE9XKSArICdcIj4nICtcclxuICAgICAgICAgICAgaGVhZGVyICtcclxuICAgICAgICAgICAgc2VhcmNoYm94ICtcclxuICAgICAgICAgICAgYWN0aW9uc2JveCArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5uZXIgJyArIGNsYXNzTmFtZXMuU0hPVyArICdcIiByb2xlPVwibGlzdGJveFwiIGlkPVwiJyArIHRoaXMuc2VsZWN0SWQgKyAnXCIgdGFiaW5kZXg9XCItMVwiICcgKyBtdWx0aXNlbGVjdGFibGUgKyAnPicgK1xyXG4gICAgICAgICAgICAgICAgJzx1bCBjbGFzcz1cIicgKyBjbGFzc05hbWVzLk1FTlUgKyAnIGlubmVyICcgKyAodmVyc2lvbi5tYWpvciA9PT0gJzQnID8gY2xhc3NOYW1lcy5TSE9XIDogJycpICsgJ1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj4nICtcclxuICAgICAgICAgICAgICAgICc8L3VsPicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgIGRvbmVidXR0b24gK1xyXG4gICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICc8L2Rpdj4nO1xyXG5cclxuICAgICAgcmV0dXJuICQoZHJvcCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFBvc2l0aW9uRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodCA9IFtdO1xyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LnNpemUgPSAwO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbGkgPSB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbaV0sXHJcbiAgICAgICAgICAgIGNhbkhpZ2hsaWdodCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChsaS50eXBlID09PSAnZGl2aWRlcicpIHtcclxuICAgICAgICAgIGNhbkhpZ2hsaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgbGkuaGVpZ2h0ID0gdGhpcy5zaXplSW5mby5kaXZpZGVySGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGkudHlwZSA9PT0gJ29wdGdyb3VwLWxhYmVsJykge1xyXG4gICAgICAgICAgY2FuSGlnaGxpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICBsaS5oZWlnaHQgPSB0aGlzLnNpemVJbmZvLmRyb3Bkb3duSGVhZGVySGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsaS5oZWlnaHQgPSB0aGlzLnNpemVJbmZvLmxpSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxpLmRpc2FibGVkKSBjYW5IaWdobGlnaHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQucHVzaChjYW5IaWdobGlnaHQpO1xyXG5cclxuICAgICAgICBpZiAoY2FuSGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LnNpemUrKztcclxuICAgICAgICAgIGxpLnBvc2luc2V0ID0gdGhpcy5zZWxlY3RwaWNrZXIudmlldy5zaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGkucG9zaXRpb24gPSAoaSA9PT0gMCA/IDAgOiB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbaSAtIDFdLnBvc2l0aW9uKSArIGxpLmhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpc1ZpcnR1YWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLm9wdGlvbnMudmlydHVhbFNjcm9sbCAhPT0gZmFsc2UpICYmICh0aGlzLnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzLmxlbmd0aCA+PSB0aGlzLm9wdGlvbnMudmlydHVhbFNjcm9sbCkgfHwgdGhpcy5vcHRpb25zLnZpcnR1YWxTY3JvbGwgPT09IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZVZpZXc6IGZ1bmN0aW9uIChpc1NlYXJjaGluZywgc2V0U2l6ZSwgcmVmcmVzaCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICBzY3JvbGxUb3AgPSAwLFxyXG4gICAgICAgICAgYWN0aXZlID0gW10sXHJcbiAgICAgICAgICBzZWxlY3RlZCxcclxuICAgICAgICAgIHByZXZBY3RpdmU7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50ID0gaXNTZWFyY2hpbmcgPyB0aGlzLnNlbGVjdHBpY2tlci5zZWFyY2ggOiB0aGlzLnNlbGVjdHBpY2tlci5tYWluO1xyXG5cclxuICAgICAgdGhpcy5zZXRQb3NpdGlvbkRhdGEoKTtcclxuXHJcbiAgICAgIGlmIChzZXRTaXplKSB7XHJcbiAgICAgICAgaWYgKHJlZnJlc2gpIHtcclxuICAgICAgICAgIHNjcm9sbFRvcCA9IHRoaXMuJG1lbnVJbm5lclswXS5zY3JvbGxUb3A7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhhdC5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGF0LiRlbGVtZW50WzBdLFxyXG4gICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSAoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0gfHwge30pLmxpSW5kZXg7XHJcblxyXG4gICAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RlZEluZGV4ID09PSAnbnVtYmVyJyAmJiB0aGF0Lm9wdGlvbnMuc2l6ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkRGF0YSA9IHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZGF0YVtzZWxlY3RlZEluZGV4XSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gc2VsZWN0ZWREYXRhICYmIHNlbGVjdGVkRGF0YS5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcCA9IHBvc2l0aW9uIC0gKCh0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodCArIHRoYXQuc2l6ZUluZm8ubGlIZWlnaHQpIC8gMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNjcm9sbChzY3JvbGxUb3AsIHRydWUpO1xyXG5cclxuICAgICAgdGhpcy4kbWVudUlubmVyLm9mZignc2Nyb2xsLmNyZWF0ZVZpZXcnKS5vbignc2Nyb2xsLmNyZWF0ZVZpZXcnLCBmdW5jdGlvbiAoZSwgdXBkYXRlVmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoYXQubm9TY3JvbGwpIHNjcm9sbCh0aGlzLnNjcm9sbFRvcCwgdXBkYXRlVmFsdWUpO1xyXG4gICAgICAgIHRoYXQubm9TY3JvbGwgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzY3JvbGwgKHNjcm9sbFRvcCwgaW5pdCkge1xyXG4gICAgICAgIHZhciBzaXplID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGNodW5rcyA9IFtdLFxyXG4gICAgICAgICAgICBjaHVua1NpemUsXHJcbiAgICAgICAgICAgIGNodW5rQ291bnQsXHJcbiAgICAgICAgICAgIGZpcnN0Q2h1bmssXHJcbiAgICAgICAgICAgIGxhc3RDaHVuayxcclxuICAgICAgICAgICAgY3VycmVudENodW5rLFxyXG4gICAgICAgICAgICBwcmV2UG9zaXRpb25zLFxyXG4gICAgICAgICAgICBwb3NpdGlvbklzRGlmZmVyZW50LFxyXG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRzLFxyXG4gICAgICAgICAgICBtZW51SXNEaWZmZXJlbnQgPSB0cnVlLFxyXG4gICAgICAgICAgICBpc1ZpcnR1YWwgPSB0aGF0LmlzVmlydHVhbCgpO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcclxuXHJcbiAgICAgICAgaWYgKGlzVmlydHVhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgLy8gaWYgYW4gb3B0aW9uIHRoYXQgaXMgZW5jb3VudGVyZWQgdGhhdCBpcyB3aWRlciB0aGFuIHRoZSBjdXJyZW50IG1lbnUgd2lkdGgsIHVwZGF0ZSB0aGUgbWVudSB3aWR0aCBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgaWYgKHRoYXQuc2l6ZUluZm8uaGFzU2Nyb2xsQmFyICYmIHRoYXQuJG1lbnVbMF0ub2Zmc2V0V2lkdGggPiB0aGF0LnNpemVJbmZvLnRvdGFsTWVudVdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoID0gdGhhdC4kbWVudVswXS5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgdGhhdC5zaXplSW5mby50b3RhbE1lbnVXaWR0aCA9IHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoICsgdGhhdC5zaXplSW5mby5zY3JvbGxCYXJXaWR0aDtcclxuICAgICAgICAgICAgdGhhdC4kbWVudS5jc3MoJ21pbi13aWR0aCcsIHRoYXQuc2l6ZUluZm8ubWVudVdpZHRoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNodW5rU2l6ZSA9IE1hdGguY2VpbCh0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodCAvIHRoYXQuc2l6ZUluZm8ubGlIZWlnaHQgKiAxLjUpOyAvLyBudW1iZXIgb2Ygb3B0aW9ucyBpbiBhIGNodW5rXHJcbiAgICAgICAgY2h1bmtDb3VudCA9IE1hdGgucm91bmQoc2l6ZSAvIGNodW5rU2l6ZSkgfHwgMTsgLy8gbnVtYmVyIG9mIGNodW5rc1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgdmFyIGVuZE9mQ2h1bmsgPSAoaSArIDEpICogY2h1bmtTaXplO1xyXG5cclxuICAgICAgICAgIGlmIChpID09PSBjaHVua0NvdW50IC0gMSkge1xyXG4gICAgICAgICAgICBlbmRPZkNodW5rID0gc2l6ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjaHVua3NbaV0gPSBbXHJcbiAgICAgICAgICAgIChpKSAqIGNodW5rU2l6ZSArICghaSA/IDAgOiAxKSxcclxuICAgICAgICAgICAgZW5kT2ZDaHVua1xyXG4gICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICBpZiAoIXNpemUpIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGlmIChjdXJyZW50Q2h1bmsgPT09IHVuZGVmaW5lZCAmJiBzY3JvbGxUb3AgPD0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2VuZE9mQ2h1bmsgLSAxXS5wb3NpdGlvbiAtIHRoYXQuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDaHVuayA9IGk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudENodW5rID09PSB1bmRlZmluZWQpIGN1cnJlbnRDaHVuayA9IDA7XHJcblxyXG4gICAgICAgIHByZXZQb3NpdGlvbnMgPSBbdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjAsIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24xXTtcclxuXHJcbiAgICAgICAgLy8gYWx3YXlzIGRpc3BsYXkgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGNodW5rc1xyXG4gICAgICAgIGZpcnN0Q2h1bmsgPSBNYXRoLm1heCgwLCBjdXJyZW50Q2h1bmsgLSAxKTtcclxuICAgICAgICBsYXN0Q2h1bmsgPSBNYXRoLm1pbihjaHVua0NvdW50IC0gMSwgY3VycmVudENodW5rICsgMSk7XHJcblxyXG4gICAgICAgIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wID0gaXNWaXJ0dWFsID09PSBmYWxzZSA/IDAgOiAoTWF0aC5tYXgoMCwgY2h1bmtzW2ZpcnN0Q2h1bmtdWzBdKSB8fCAwKTtcclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMSA9IGlzVmlydHVhbCA9PT0gZmFsc2UgPyBzaXplIDogKE1hdGgubWluKHNpemUsIGNodW5rc1tsYXN0Q2h1bmtdWzFdKSB8fCAwKTtcclxuXHJcbiAgICAgICAgcG9zaXRpb25Jc0RpZmZlcmVudCA9IHByZXZQb3NpdGlvbnNbMF0gIT09IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wIHx8IHByZXZQb3NpdGlvbnNbMV0gIT09IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24xO1xyXG5cclxuICAgICAgICBpZiAodGhhdC5hY3RpdmVJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBwcmV2QWN0aXZlID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50c1t0aGF0LnByZXZBY3RpdmVJbmRleF07XHJcbiAgICAgICAgICBhY3RpdmUgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW3RoYXQuYWN0aXZlSW5kZXhdO1xyXG4gICAgICAgICAgc2VsZWN0ZWQgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW3RoYXQuc2VsZWN0ZWRJbmRleF07XHJcblxyXG4gICAgICAgICAgaWYgKGluaXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoYXQuYWN0aXZlSW5kZXggIT09IHRoYXQuc2VsZWN0ZWRJbmRleCkge1xyXG4gICAgICAgICAgICAgIHRoYXQuZGVmb2N1c0l0ZW0oYWN0aXZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmFjdGl2ZUluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGF0LmFjdGl2ZUluZGV4ICYmIHRoYXQuYWN0aXZlSW5kZXggIT09IHRoYXQuc2VsZWN0ZWRJbmRleCkge1xyXG4gICAgICAgICAgICB0aGF0LmRlZm9jdXNJdGVtKHNlbGVjdGVkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGF0LnByZXZBY3RpdmVJbmRleCAhPT0gdW5kZWZpbmVkICYmIHRoYXQucHJldkFjdGl2ZUluZGV4ICE9PSB0aGF0LmFjdGl2ZUluZGV4ICYmIHRoYXQucHJldkFjdGl2ZUluZGV4ICE9PSB0aGF0LnNlbGVjdGVkSW5kZXgpIHtcclxuICAgICAgICAgIHRoYXQuZGVmb2N1c0l0ZW0ocHJldkFjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5pdCB8fCBwb3NpdGlvbklzRGlmZmVyZW50KSB7XHJcbiAgICAgICAgICBwcmV2aW91c0VsZW1lbnRzID0gdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMgPyB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnZpc2libGVFbGVtZW50cy5zbGljZSgpIDogW107XHJcblxyXG4gICAgICAgICAgaWYgKGlzVmlydHVhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzLnNsaWNlKHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wLCB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhhdC5zZXRPcHRpb25TdGF0dXMoKTtcclxuXHJcbiAgICAgICAgICAvLyBpZiBzZWFyY2hpbmcsIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgbGlzdCBoYXMgYWN0dWFsbHkgYmVlbiB1cGRhdGVkIGJlZm9yZSB1cGRhdGluZyBET01cclxuICAgICAgICAgIC8vIHRoaXMgcHJldmVudHMgdW5uZWNlc3NhcnkgcmVwYWludHNcclxuICAgICAgICAgIGlmIChpc1NlYXJjaGluZyB8fCAoaXNWaXJ0dWFsID09PSBmYWxzZSAmJiBpbml0KSkgbWVudUlzRGlmZmVyZW50ID0gIWlzRXF1YWwocHJldmlvdXNFbGVtZW50cywgdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgIC8vIGlmIHZpcnR1YWwgc2Nyb2xsIGlzIGRpc2FibGVkIGFuZCBub3Qgc2VhcmNoaW5nLFxyXG4gICAgICAgICAgLy8gbWVudSBzaG91bGQgbmV2ZXIgbmVlZCB0byBiZSB1cGRhdGVkIG1vcmUgdGhhbiBvbmNlXHJcbiAgICAgICAgICBpZiAoKGluaXQgfHwgaXNWaXJ0dWFsID09PSB0cnVlKSAmJiBtZW51SXNEaWZmZXJlbnQpIHtcclxuICAgICAgICAgICAgdmFyIG1lbnVJbm5lciA9IHRoYXQuJG1lbnVJbm5lclswXSxcclxuICAgICAgICAgICAgICAgIG1lbnVGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcclxuICAgICAgICAgICAgICAgIGVtcHR5TWVudSA9IG1lbnVJbm5lci5maXJzdENoaWxkLmNsb25lTm9kZShmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3AsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzLFxyXG4gICAgICAgICAgICAgICAgdG9TYW5pdGl6ZSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgVUwgd2l0aCBhbiBlbXB0eSBvbmUgLSB0aGlzIGlzIGZhc3RlciB0aGFuICQuZW1wdHkoKVxyXG4gICAgICAgICAgICBtZW51SW5uZXIucmVwbGFjZUNoaWxkKGVtcHR5TWVudSwgbWVudUlubmVyLmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZpc2libGVFbGVtZW50c0xlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IHZpc2libGVFbGVtZW50c0xlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlbGVtZW50c1tpXSxcclxuICAgICAgICAgICAgICAgICAgZWxUZXh0LFxyXG4gICAgICAgICAgICAgICAgICBlbGVtZW50RGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zYW5pdGl6ZSkge1xyXG4gICAgICAgICAgICAgICAgZWxUZXh0ID0gZWxlbWVudC5sYXN0Q2hpbGQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICBlbGVtZW50RGF0YSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpICsgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnREYXRhICYmIGVsZW1lbnREYXRhLmNvbnRlbnQgJiYgIWVsZW1lbnREYXRhLnNhbml0aXplZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvU2FuaXRpemUucHVzaChlbFRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnNhbml0aXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIG1lbnVGcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zYW5pdGl6ZSAmJiB0b1Nhbml0aXplLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHNhbml0aXplSHRtbCh0b1Nhbml0aXplLCB0aGF0Lm9wdGlvbnMud2hpdGVMaXN0LCB0aGF0Lm9wdGlvbnMuc2FuaXRpemVGbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpc1ZpcnR1YWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICBtYXJnaW5Ub3AgPSAodGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjAgPT09IDAgPyAwIDogdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW3RoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wIC0gMV0ucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbSA9ICh0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMSA+IHNpemUgLSAxID8gMCA6IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtzaXplIC0gMV0ucG9zaXRpb24gLSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjEgLSAxXS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgIG1lbnVJbm5lci5maXJzdENoaWxkLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblRvcCArICdweCc7XHJcbiAgICAgICAgICAgICAgbWVudUlubmVyLmZpcnN0Q2hpbGQuc3R5bGUubWFyZ2luQm90dG9tID0gbWFyZ2luQm90dG9tICsgJ3B4JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBtZW51SW5uZXIuZmlyc3RDaGlsZC5zdHlsZS5tYXJnaW5Ub3AgPSAwO1xyXG4gICAgICAgICAgICAgIG1lbnVJbm5lci5maXJzdENoaWxkLnN0eWxlLm1hcmdpbkJvdHRvbSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1lbnVJbm5lci5maXJzdENoaWxkLmFwcGVuZENoaWxkKG1lbnVGcmFnbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGF0LnByZXZBY3RpdmVJbmRleCA9IHRoYXQuYWN0aXZlSW5kZXg7XHJcblxyXG4gICAgICAgIGlmICghdGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNTZWFyY2hpbmcgJiYgaW5pdCkge1xyXG4gICAgICAgICAgdmFyIGluZGV4ID0gMCxcclxuICAgICAgICAgICAgICBuZXdBY3RpdmU7XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0LnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodFtpbmRleF0pIHtcclxuICAgICAgICAgICAgaW5kZXggPSAxICsgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQuc2xpY2UoMSkuaW5kZXhPZih0cnVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBuZXdBY3RpdmUgPSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnZpc2libGVFbGVtZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgICAgdGhhdC5kZWZvY3VzSXRlbSh0aGF0LnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUpO1xyXG5cclxuICAgICAgICAgIHRoYXQuYWN0aXZlSW5kZXggPSAodGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2luZGV4XSB8fCB7fSkuaW5kZXg7XHJcblxyXG4gICAgICAgICAgdGhhdC5mb2N1c0l0ZW0obmV3QWN0aXZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQod2luZG93KVxyXG4gICAgICAgIC5vZmYoJ3Jlc2l6ZScgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkICsgJy5jcmVhdGVWaWV3JylcclxuICAgICAgICAub24oJ3Jlc2l6ZScgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkICsgJy5jcmVhdGVWaWV3JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhhdC4kbmV3RWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWVzLlNIT1cpO1xyXG5cclxuICAgICAgICAgIGlmIChpc0FjdGl2ZSkgc2Nyb2xsKHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3ApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBmb2N1c0l0ZW06IGZ1bmN0aW9uIChsaSwgbGlEYXRhLCBub1N0eWxlKSB7XHJcbiAgICAgIGlmIChsaSkge1xyXG4gICAgICAgIGxpRGF0YSA9IGxpRGF0YSB8fCB0aGlzLnNlbGVjdHBpY2tlci5tYWluLmRhdGFbdGhpcy5hY3RpdmVJbmRleF07XHJcbiAgICAgICAgdmFyIGEgPSBsaS5maXJzdENoaWxkO1xyXG5cclxuICAgICAgICBpZiAoYSkge1xyXG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2V0c2l6ZScsIHRoaXMuc2VsZWN0cGlja2VyLnZpZXcuc2l6ZSk7XHJcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnYXJpYS1wb3NpbnNldCcsIGxpRGF0YS5wb3NpbnNldCk7XHJcblxyXG4gICAgICAgICAgaWYgKG5vU3R5bGUgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1c2VkUGFyZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgYS5pZCk7XHJcbiAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBkZWZvY3VzSXRlbTogZnVuY3Rpb24gKGxpKSB7XHJcbiAgICAgIGlmIChsaSkge1xyXG4gICAgICAgIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGlmIChsaS5maXJzdENoaWxkKSBsaS5maXJzdENoaWxkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB1cGRhdGVJbmRleCA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZSAmJiAhdGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RwaWNrZXIudmlldy50aXRsZU9wdGlvbikgdGhpcy5zZWxlY3RwaWNrZXIudmlldy50aXRsZU9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG5cclxuICAgICAgICAvLyB0aGlzIG9wdGlvbiBkb2Vzbid0IGNyZWF0ZSBhIG5ldyA8bGk+IGVsZW1lbnQsIGJ1dCBkb2VzIGFkZCBhIG5ldyBvcHRpb24gYXQgdGhlIHN0YXJ0LFxyXG4gICAgICAgIC8vIHNvIHN0YXJ0SW5kZXggc2hvdWxkIGluY3JlYXNlIHRvIHByZXZlbnQgaGF2aW5nIHRvIGNoZWNrIGV2ZXJ5IG9wdGlvbiBmb3IgdGhlIGJzLXRpdGxlLW9wdGlvbiBjbGFzc1xyXG4gICAgICAgIHVwZGF0ZUluZGV4ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50WzBdLFxyXG4gICAgICAgICAgICBpc1NlbGVjdGVkID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHRpdGxlTm90QXBwZW5kZWQgPSAhdGhpcy5zZWxlY3RwaWNrZXIudmlldy50aXRsZU9wdGlvbi5wYXJlbnROb2RlO1xyXG5cclxuICAgICAgICBpZiAodGl0bGVOb3RBcHBlbmRlZCkge1xyXG4gICAgICAgICAgLy8gVXNlIG5hdGl2ZSBKUyB0byBwcmVwZW5kIG9wdGlvbiAoZmFzdGVyKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIudmlldy50aXRsZU9wdGlvbi5jbGFzc05hbWUgPSAnYnMtdGl0bGUtb3B0aW9uJztcclxuICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyLnZpZXcudGl0bGVPcHRpb24udmFsdWUgPSAnJztcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBpZiBzZWxlY3RlZCBvciBkYXRhLXNlbGVjdGVkIGF0dHJpYnV0ZSBpcyBhbHJlYWR5IHNldCBvbiBhbiBvcHRpb24uIElmIG5vdCwgc2VsZWN0IHRoZSB0aXRsZU9wdGlvbiBvcHRpb24uXHJcbiAgICAgICAgICAvLyB0aGUgc2VsZWN0ZWQgaXRlbSBtYXkgaGF2ZSBiZWVuIGNoYW5nZWQgYnkgdXNlciBvciBwcm9ncmFtbWF0aWNhbGx5IGJlZm9yZSB0aGUgYm9vdHN0cmFwIHNlbGVjdCBwbHVnaW4gcnVucyxcclxuICAgICAgICAgIC8vIGlmIHNvLCB0aGUgc2VsZWN0IHdpbGwgaGF2ZSB0aGUgZGF0YS1zZWxlY3RlZCBhdHRyaWJ1dGVcclxuICAgICAgICAgIHZhciAkb3B0ID0gJChlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSk7XHJcbiAgICAgICAgICBpc1NlbGVjdGVkID0gJG9wdC5hdHRyKCdzZWxlY3RlZCcpID09PSB1bmRlZmluZWQgJiYgdGhpcy4kZWxlbWVudC5kYXRhKCdzZWxlY3RlZCcpID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGl0bGVOb3RBcHBlbmRlZCB8fCB0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uLmluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICBlbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLnNlbGVjdHBpY2tlci52aWV3LnRpdGxlT3B0aW9uLCBlbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkICphZnRlciogYXBwZW5kaW5nIHRvIHNlbGVjdCxcclxuICAgICAgICAvLyBvdGhlcndpc2UgdGhlIG9wdGlvbiBkb2Vzbid0IGdldCBzZWxlY3RlZCBpbiBJRVxyXG4gICAgICAgIC8vIHNldCB1c2luZyBzZWxlY3RlZEluZGV4LCBhcyBzZXR0aW5nIHRoZSBzZWxlY3RlZCBhdHRyIHRvIHRydWUgaGVyZSBkb2Vzbid0IHdvcmsgaW4gSUUxMVxyXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSBlbGVtZW50LnNlbGVjdGVkSW5kZXggPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdXBkYXRlSW5kZXg7XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZUxpOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgIGljb25CYXNlID0gdGhpcy5vcHRpb25zLmljb25CYXNlLFxyXG4gICAgICAgICAgb3B0aW9uU2VsZWN0b3IgPSAnOm5vdChbaGlkZGVuXSk6bm90KFtkYXRhLWhpZGRlbj1cInRydWVcIl0pJyxcclxuICAgICAgICAgIG1haW5FbGVtZW50cyA9IFtdLFxyXG4gICAgICAgICAgbWFpbkRhdGEgPSBbXSxcclxuICAgICAgICAgIHdpZGVzdE9wdGlvbkxlbmd0aCA9IDAsXHJcbiAgICAgICAgICBvcHRJRCA9IDAsXHJcbiAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5zZXRQbGFjZWhvbGRlcigpID8gMSA6IDA7IC8vIGFwcGVuZCB0aGUgdGl0bGVPcHRpb24gaWYgbmVjZXNzYXJ5IGFuZCBza2lwIHRoZSBmaXJzdCBvcHRpb24gaW4gdGhlIGxvb3BcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlkZURpc2FibGVkKSBvcHRpb25TZWxlY3RvciArPSAnOm5vdCg6ZGlzYWJsZWQpJztcclxuXHJcbiAgICAgIGlmICgodGhhdC5vcHRpb25zLnNob3dUaWNrIHx8IHRoYXQubXVsdGlwbGUpICYmICFlbGVtZW50VGVtcGxhdGVzLmNoZWNrTWFyay5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgZWxlbWVudFRlbXBsYXRlcy5jaGVja01hcmsuY2xhc3NOYW1lID0gaWNvbkJhc2UgKyAnICcgKyB0aGF0Lm9wdGlvbnMudGlja0ljb24gKyAnIGNoZWNrLW1hcmsnO1xyXG4gICAgICAgIGVsZW1lbnRUZW1wbGF0ZXMuYS5hcHBlbmRDaGlsZChlbGVtZW50VGVtcGxhdGVzLmNoZWNrTWFyayk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzZWxlY3RPcHRpb25zID0gdGhpcy4kZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCdzZWxlY3QgPiAqJyArIG9wdGlvblNlbGVjdG9yKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFkZERpdmlkZXIgKGNvbmZpZykge1xyXG4gICAgICAgIHZhciBwcmV2aW91c0RhdGEgPSBtYWluRGF0YVttYWluRGF0YS5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgLy8gZW5zdXJlIG9wdGdyb3VwIGRvZXNuJ3QgY3JlYXRlIGJhY2stdG8tYmFjayBkaXZpZGVyc1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIHByZXZpb3VzRGF0YSAmJlxyXG4gICAgICAgICAgcHJldmlvdXNEYXRhLnR5cGUgPT09ICdkaXZpZGVyJyAmJlxyXG4gICAgICAgICAgKHByZXZpb3VzRGF0YS5vcHRJRCB8fCBjb25maWcub3B0SUQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcbiAgICAgICAgY29uZmlnLnR5cGUgPSAnZGl2aWRlcic7XHJcblxyXG4gICAgICAgIG1haW5FbGVtZW50cy5wdXNoKFxyXG4gICAgICAgICAgZ2VuZXJhdGVPcHRpb24ubGkoXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWVzLkRJVklERVIsXHJcbiAgICAgICAgICAgIChjb25maWcub3B0SUQgPyBjb25maWcub3B0SUQgKyAnZGl2JyA6IHVuZGVmaW5lZClcclxuICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBtYWluRGF0YS5wdXNoKGNvbmZpZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFkZE9wdGlvbiAob3B0aW9uLCBjb25maWcpIHtcclxuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XHJcblxyXG4gICAgICAgIGNvbmZpZy5kaXZpZGVyID0gb3B0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1kaXZpZGVyJykgPT09ICd0cnVlJztcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5kaXZpZGVyKSB7XHJcbiAgICAgICAgICBhZGREaXZpZGVyKHtcclxuICAgICAgICAgICAgb3B0SUQ6IGNvbmZpZy5vcHRJRFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBsaUluZGV4ID0gbWFpbkRhdGEubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIGNzc1RleHQgPSBvcHRpb24uc3R5bGUuY3NzVGV4dCxcclxuICAgICAgICAgICAgICBpbmxpbmVTdHlsZSA9IGNzc1RleHQgPyBodG1sRXNjYXBlKGNzc1RleHQpIDogJycsXHJcbiAgICAgICAgICAgICAgb3B0aW9uQ2xhc3MgPSAob3B0aW9uLmNsYXNzTmFtZSB8fCAnJykgKyAoY29uZmlnLm9wdGdyb3VwQ2xhc3MgfHwgJycpO1xyXG5cclxuICAgICAgICAgIGlmIChjb25maWcub3B0SUQpIG9wdGlvbkNsYXNzID0gJ29wdCAnICsgb3B0aW9uQ2xhc3M7XHJcblxyXG4gICAgICAgICAgY29uZmlnLnRleHQgPSBvcHRpb24udGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgY29uZmlnLmNvbnRlbnQgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKTtcclxuICAgICAgICAgIGNvbmZpZy50b2tlbnMgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXRva2VucycpO1xyXG4gICAgICAgICAgY29uZmlnLnN1YnRleHQgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1YnRleHQnKTtcclxuICAgICAgICAgIGNvbmZpZy5pY29uID0gb3B0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29uJyk7XHJcbiAgICAgICAgICBjb25maWcuaWNvbkJhc2UgPSBpY29uQmFzZTtcclxuXHJcbiAgICAgICAgICB2YXIgdGV4dEVsZW1lbnQgPSBnZW5lcmF0ZU9wdGlvbi50ZXh0KGNvbmZpZyk7XHJcbiAgICAgICAgICB2YXIgbGlFbGVtZW50ID0gZ2VuZXJhdGVPcHRpb24ubGkoXHJcbiAgICAgICAgICAgIGdlbmVyYXRlT3B0aW9uLmEoXHJcbiAgICAgICAgICAgICAgdGV4dEVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgb3B0aW9uQ2xhc3MsXHJcbiAgICAgICAgICAgICAgaW5saW5lU3R5bGVcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgIGNvbmZpZy5vcHRJRFxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAobGlFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgbGlFbGVtZW50LmZpcnN0Q2hpbGQuaWQgPSB0aGF0LnNlbGVjdElkICsgJy0nICsgbGlJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBtYWluRWxlbWVudHMucHVzaChsaUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgIG9wdGlvbi5saUluZGV4ID0gbGlJbmRleDtcclxuXHJcbiAgICAgICAgICBjb25maWcuZGlzcGxheSA9IGNvbmZpZy5jb250ZW50IHx8IGNvbmZpZy50ZXh0O1xyXG4gICAgICAgICAgY29uZmlnLnR5cGUgPSAnb3B0aW9uJztcclxuICAgICAgICAgIGNvbmZpZy5pbmRleCA9IGxpSW5kZXg7XHJcbiAgICAgICAgICBjb25maWcub3B0aW9uID0gb3B0aW9uO1xyXG4gICAgICAgICAgY29uZmlnLmRpc2FibGVkID0gY29uZmlnLmRpc2FibGVkIHx8IG9wdGlvbi5kaXNhYmxlZDtcclxuXHJcbiAgICAgICAgICBtYWluRGF0YS5wdXNoKGNvbmZpZyk7XHJcblxyXG4gICAgICAgICAgdmFyIGNvbWJpbmVkTGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgICAvLyBjb3VudCB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gdGhlIG9wdGlvbiAtIG5vdCBwZXJmZWN0LCBidXQgc2hvdWxkIHdvcmsgaW4gbW9zdCBjYXNlc1xyXG4gICAgICAgICAgaWYgKGNvbmZpZy5kaXNwbGF5KSBjb21iaW5lZExlbmd0aCArPSBjb25maWcuZGlzcGxheS5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAoY29uZmlnLnN1YnRleHQpIGNvbWJpbmVkTGVuZ3RoICs9IGNvbmZpZy5zdWJ0ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGljb24sIGVuc3VyZSB0aGlzIG9wdGlvbidzIHdpZHRoIGlzIGNoZWNrZWRcclxuICAgICAgICAgIGlmIChjb25maWcuaWNvbikgY29tYmluZWRMZW5ndGggKz0gMTtcclxuXHJcbiAgICAgICAgICBpZiAoY29tYmluZWRMZW5ndGggPiB3aWRlc3RPcHRpb25MZW5ndGgpIHtcclxuICAgICAgICAgICAgd2lkZXN0T3B0aW9uTGVuZ3RoID0gY29tYmluZWRMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvLyBndWVzcyB3aGljaCBvcHRpb24gaXMgdGhlIHdpZGVzdFxyXG4gICAgICAgICAgICAvLyB1c2UgdGhpcyB3aGVuIGNhbGN1bGF0aW5nIG1lbnUgd2lkdGhcclxuICAgICAgICAgICAgLy8gbm90IHBlcmZlY3QsIGJ1dCBpdCdzIGZhc3QsIGFuZCB0aGUgd2lkdGggd2lsbCBiZSB1cGRhdGluZyBhY2NvcmRpbmdseSB3aGVuIHNjcm9sbGluZ1xyXG4gICAgICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LndpZGVzdE9wdGlvbiA9IG1haW5FbGVtZW50c1ttYWluRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhZGRPcHRncm91cCAoaW5kZXgsIHNlbGVjdE9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0Z3JvdXAgPSBzZWxlY3RPcHRpb25zW2luZGV4XSxcclxuICAgICAgICAgICAgcHJldmlvdXMgPSBzZWxlY3RPcHRpb25zW2luZGV4IC0gMV0sXHJcbiAgICAgICAgICAgIG5leHQgPSBzZWxlY3RPcHRpb25zW2luZGV4ICsgMV0sXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRncm91cC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nICsgb3B0aW9uU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbnMubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgbGFiZWw6IGh0bWxFc2NhcGUob3B0Z3JvdXAubGFiZWwpLFxyXG4gICAgICAgICAgICAgIHN1YnRleHQ6IG9wdGdyb3VwLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJ0ZXh0JyksXHJcbiAgICAgICAgICAgICAgaWNvbjogb3B0Z3JvdXAuZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKSxcclxuICAgICAgICAgICAgICBpY29uQmFzZTogaWNvbkJhc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb3B0Z3JvdXBDbGFzcyA9ICcgJyArIChvcHRncm91cC5jbGFzc05hbWUgfHwgJycpLFxyXG4gICAgICAgICAgICBoZWFkZXJJbmRleCxcclxuICAgICAgICAgICAgbGFzdEluZGV4O1xyXG5cclxuICAgICAgICBvcHRJRCsrO1xyXG5cclxuICAgICAgICBpZiAocHJldmlvdXMpIHtcclxuICAgICAgICAgIGFkZERpdmlkZXIoeyBvcHRJRDogb3B0SUQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGFiZWxFbGVtZW50ID0gZ2VuZXJhdGVPcHRpb24ubGFiZWwoY29uZmlnKTtcclxuXHJcbiAgICAgICAgbWFpbkVsZW1lbnRzLnB1c2goXHJcbiAgICAgICAgICBnZW5lcmF0ZU9wdGlvbi5saShsYWJlbEVsZW1lbnQsICdkcm9wZG93bi1oZWFkZXInICsgb3B0Z3JvdXBDbGFzcywgb3B0SUQpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbWFpbkRhdGEucHVzaCh7XHJcbiAgICAgICAgICBkaXNwbGF5OiBjb25maWcubGFiZWwsXHJcbiAgICAgICAgICBzdWJ0ZXh0OiBjb25maWcuc3VidGV4dCxcclxuICAgICAgICAgIHR5cGU6ICdvcHRncm91cC1sYWJlbCcsXHJcbiAgICAgICAgICBvcHRJRDogb3B0SURcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IG9wdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW2pdO1xyXG5cclxuICAgICAgICAgIGlmIChqID09PSAwKSB7XHJcbiAgICAgICAgICAgIGhlYWRlckluZGV4ID0gbWFpbkRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgbGFzdEluZGV4ID0gaGVhZGVySW5kZXggKyBsZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYWRkT3B0aW9uKG9wdGlvbiwge1xyXG4gICAgICAgICAgICBoZWFkZXJJbmRleDogaGVhZGVySW5kZXgsXHJcbiAgICAgICAgICAgIGxhc3RJbmRleDogbGFzdEluZGV4LFxyXG4gICAgICAgICAgICBvcHRJRDogb3B0SUQsXHJcbiAgICAgICAgICAgIG9wdGdyb3VwQ2xhc3M6IG9wdGdyb3VwQ2xhc3MsXHJcbiAgICAgICAgICAgIGRpc2FibGVkOiBvcHRncm91cC5kaXNhYmxlZFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgYWRkRGl2aWRlcih7IG9wdElEOiBvcHRJRCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIGxlbiA9IHNlbGVjdE9wdGlvbnMubGVuZ3RoOyBzdGFydEluZGV4IDwgbGVuOyBzdGFydEluZGV4KyspIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHNlbGVjdE9wdGlvbnNbc3RhcnRJbmRleF07XHJcblxyXG4gICAgICAgIGlmIChpdGVtLnRhZ05hbWUgIT09ICdPUFRHUk9VUCcpIHtcclxuICAgICAgICAgIGFkZE9wdGlvbihpdGVtLCB7fSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFkZE9wdGdyb3VwKHN0YXJ0SW5kZXgsIHNlbGVjdE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50cyA9IG1haW5FbGVtZW50cztcclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5kYXRhID0gbWFpbkRhdGE7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50ID0gdGhpcy5zZWxlY3RwaWNrZXIubWFpbjtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZExpczogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kbWVudUlubmVyLmZpbmQoJy5pbm5lciA+IGxpJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBlbnN1cmUgdGl0bGVPcHRpb24gaXMgYXBwZW5kZWQgYW5kIHNlbGVjdGVkIChpZiBuZWNlc3NhcnkpIGJlZm9yZSBnZXR0aW5nIHNlbGVjdGVkT3B0aW9uc1xyXG4gICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy4kZWxlbWVudFswXSxcclxuICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucyA9IGdldFNlbGVjdGVkT3B0aW9ucyhlbGVtZW50LCB0aGlzLm9wdGlvbnMuaGlkZURpc2FibGVkKSxcclxuICAgICAgICAgIHNlbGVjdGVkQ291bnQgPSBzZWxlY3RlZE9wdGlvbnMubGVuZ3RoLFxyXG4gICAgICAgICAgYnV0dG9uID0gdGhpcy4kYnV0dG9uWzBdLFxyXG4gICAgICAgICAgYnV0dG9uSW5uZXIgPSBidXR0b24ucXVlcnlTZWxlY3RvcignLmZpbHRlci1vcHRpb24taW5uZXItaW5uZXInKSxcclxuICAgICAgICAgIG11bHRpcGxlU2VwYXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5vcHRpb25zLm11bHRpcGxlU2VwYXJhdG9yKSxcclxuICAgICAgICAgIHRpdGxlRnJhZ21lbnQgPSBlbGVtZW50VGVtcGxhdGVzLmZyYWdtZW50LmNsb25lTm9kZShmYWxzZSksXHJcbiAgICAgICAgICBzaG93Q291bnQsXHJcbiAgICAgICAgICBjb3VudE1heCxcclxuICAgICAgICAgIGhhc0NvbnRlbnQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdicy1wbGFjZWhvbGRlcicsIHRoYXQubXVsdGlwbGUgPyAhc2VsZWN0ZWRDb3VudCA6ICFnZXRTZWxlY3RWYWx1ZXMoZWxlbWVudCwgc2VsZWN0ZWRPcHRpb25zKSk7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4KCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dEZvcm1hdCA9PT0gJ3N0YXRpYycpIHtcclxuICAgICAgICB0aXRsZUZyYWdtZW50ID0gZ2VuZXJhdGVPcHRpb24udGV4dCh7IHRleHQ6IHRoaXMub3B0aW9ucy50aXRsZSB9LCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaG93Q291bnQgPSB0aGlzLm11bHRpcGxlICYmIHRoaXMub3B0aW9ucy5zZWxlY3RlZFRleHRGb3JtYXQuaW5kZXhPZignY291bnQnKSAhPT0gLTEgJiYgc2VsZWN0ZWRDb3VudCA+IDE7XHJcblxyXG4gICAgICAgIC8vIGRldGVybWluZSBpZiB0aGUgbnVtYmVyIG9mIHNlbGVjdGVkIG9wdGlvbnMgd2lsbCBiZSBzaG93biAoc2hvd0NvdW50ID09PSB0cnVlKVxyXG4gICAgICAgIGlmIChzaG93Q291bnQpIHtcclxuICAgICAgICAgIGNvdW50TWF4ID0gdGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dEZvcm1hdC5zcGxpdCgnPicpO1xyXG4gICAgICAgICAgc2hvd0NvdW50ID0gKGNvdW50TWF4Lmxlbmd0aCA+IDEgJiYgc2VsZWN0ZWRDb3VudCA+IGNvdW50TWF4WzFdKSB8fCAoY291bnRNYXgubGVuZ3RoID09PSAxICYmIHNlbGVjdGVkQ291bnQgPj0gMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBvbmx5IGxvb3AgdGhyb3VnaCBhbGwgc2VsZWN0ZWQgb3B0aW9ucyBpZiB0aGUgY291bnQgd29uJ3QgYmUgc2hvd25cclxuICAgICAgICBpZiAoc2hvd0NvdW50ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgZm9yICh2YXIgc2VsZWN0ZWRJbmRleCA9IDA7IHNlbGVjdGVkSW5kZXggPCBzZWxlY3RlZENvdW50OyBzZWxlY3RlZEluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPCA1MCkge1xyXG4gICAgICAgICAgICAgIHZhciBvcHRpb24gPSBzZWxlY3RlZE9wdGlvbnNbc2VsZWN0ZWRJbmRleF0sXHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlT3B0aW9ucyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgICB0aGlzRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICBzdWJ0ZXh0OiBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXN1YnRleHQnKSxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKVxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBzZWxlY3RlZEluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGl0bGVGcmFnbWVudC5hcHBlbmRDaGlsZChtdWx0aXBsZVNlcGFyYXRvci5jbG9uZU5vZGUoZmFsc2UpKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChvcHRpb24udGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlT3B0aW9ucy50ZXh0ID0gb3B0aW9uLnRpdGxlO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpc0RhdGEuY29udGVudCAmJiB0aGF0Lm9wdGlvbnMuc2hvd0NvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlT3B0aW9ucy5jb250ZW50ID0gdGhpc0RhdGEuY29udGVudC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2hvd0ljb24pIHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGVPcHRpb25zLmljb24gPSB0aGlzRGF0YS5pY29uO1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZU9wdGlvbnMuaWNvbkJhc2UgPSB0aGlzLm9wdGlvbnMuaWNvbkJhc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNob3dTdWJ0ZXh0ICYmICF0aGF0Lm11bHRpcGxlICYmIHRoaXNEYXRhLnN1YnRleHQpIHRpdGxlT3B0aW9ucy5zdWJ0ZXh0ID0gJyAnICsgdGhpc0RhdGEuc3VidGV4dDtcclxuICAgICAgICAgICAgICAgIHRpdGxlT3B0aW9ucy50ZXh0ID0gb3B0aW9uLnRleHRDb250ZW50LnRyaW0oKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHRpdGxlRnJhZ21lbnQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVPcHRpb24udGV4dCh0aXRsZU9wdGlvbnMsIHRydWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGFkZCBlbGxpcHNpc1xyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkQ291bnQgPiA0OSkge1xyXG4gICAgICAgICAgICB0aXRsZUZyYWdtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuLi4nKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBvcHRpb25TZWxlY3RvciA9ICc6bm90KFtoaWRkZW5dKTpub3QoW2RhdGEtaGlkZGVuPVwidHJ1ZVwiXSk6bm90KFtkYXRhLWRpdmlkZXI9XCJ0cnVlXCJdKSc7XHJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhpZGVEaXNhYmxlZCkgb3B0aW9uU2VsZWN0b3IgKz0gJzpub3QoOmRpc2FibGVkKSc7XHJcblxyXG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIG11bHRpc2VsZWN0LCBhbmQgc2VsZWN0ZWRUZXh0Rm9ybWF0IGlzIGNvdW50LCB0aGVuIHNob3cgMSBvZiAyIHNlbGVjdGVkLCBldGMuXHJcbiAgICAgICAgICB2YXIgdG90YWxDb3VudCA9IHRoaXMuJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0ID4gb3B0aW9uJyArIG9wdGlvblNlbGVjdG9yICsgJywgb3B0Z3JvdXAnICsgb3B0aW9uU2VsZWN0b3IgKyAnIG9wdGlvbicgKyBvcHRpb25TZWxlY3RvcikubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIHRyOG5UZXh0ID0gKHR5cGVvZiB0aGlzLm9wdGlvbnMuY291bnRTZWxlY3RlZFRleHQgPT09ICdmdW5jdGlvbicpID8gdGhpcy5vcHRpb25zLmNvdW50U2VsZWN0ZWRUZXh0KHNlbGVjdGVkQ291bnQsIHRvdGFsQ291bnQpIDogdGhpcy5vcHRpb25zLmNvdW50U2VsZWN0ZWRUZXh0O1xyXG5cclxuICAgICAgICAgIHRpdGxlRnJhZ21lbnQgPSBnZW5lcmF0ZU9wdGlvbi50ZXh0KHtcclxuICAgICAgICAgICAgdGV4dDogdHI4blRleHQucmVwbGFjZSgnezB9Jywgc2VsZWN0ZWRDb3VudC50b1N0cmluZygpKS5yZXBsYWNlKCd7MX0nLCB0b3RhbENvdW50LnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgLy8gdXNlIC5hdHRyIHRvIGVuc3VyZSB1bmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgdGl0bGUgYXR0cmlidXRlIGlzIG5vdCBzZXRcclxuICAgICAgICB0aGlzLm9wdGlvbnMudGl0bGUgPSB0aGlzLiRlbGVtZW50LmF0dHIoJ3RpdGxlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHRoZSBzZWxlY3QgZG9lc24ndCBoYXZlIGEgdGl0bGUsIHRoZW4gdXNlIHRoZSBkZWZhdWx0LCBvciBpZiBub3RoaW5nIGlzIHNldCBhdCBhbGwsIHVzZSBub25lU2VsZWN0ZWRUZXh0XHJcbiAgICAgIGlmICghdGl0bGVGcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgIHRpdGxlRnJhZ21lbnQgPSBnZW5lcmF0ZU9wdGlvbi50ZXh0KHtcclxuICAgICAgICAgIHRleHQ6IHR5cGVvZiB0aGlzLm9wdGlvbnMudGl0bGUgIT09ICd1bmRlZmluZWQnID8gdGhpcy5vcHRpb25zLnRpdGxlIDogdGhpcy5vcHRpb25zLm5vbmVTZWxlY3RlZFRleHRcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc3RyaXAgYWxsIEhUTUwgdGFncyBhbmQgdHJpbSB0aGUgcmVzdWx0LCB0aGVuIHVuZXNjYXBlIGFueSBlc2NhcGVkIHRhZ3NcclxuICAgICAgYnV0dG9uLnRpdGxlID0gdGl0bGVGcmFnbWVudC50ZXh0Q29udGVudC5yZXBsYWNlKC88W14+XSo+Py9nLCAnJykudHJpbSgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSAmJiBoYXNDb250ZW50KSB7XHJcbiAgICAgICAgc2FuaXRpemVIdG1sKFt0aXRsZUZyYWdtZW50XSwgdGhhdC5vcHRpb25zLndoaXRlTGlzdCwgdGhhdC5vcHRpb25zLnNhbml0aXplRm4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBidXR0b25Jbm5lci5pbm5lckhUTUwgPSAnJztcclxuICAgICAgYnV0dG9uSW5uZXIuYXBwZW5kQ2hpbGQodGl0bGVGcmFnbWVudCk7XHJcblxyXG4gICAgICBpZiAodmVyc2lvbi5tYWpvciA8IDQgJiYgdGhpcy4kbmV3RWxlbWVudFswXS5jbGFzc0xpc3QuY29udGFpbnMoJ2JzMy1oYXMtYWRkb24nKSkge1xyXG4gICAgICAgIHZhciBmaWx0ZXJFeHBhbmQgPSBidXR0b24ucXVlcnlTZWxlY3RvcignLmZpbHRlci1leHBhbmQnKSxcclxuICAgICAgICAgICAgY2xvbmUgPSBidXR0b25Jbm5lci5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgIGNsb25lLmNsYXNzTmFtZSA9ICdmaWx0ZXItZXhwYW5kJztcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlckV4cGFuZCkge1xyXG4gICAgICAgICAgYnV0dG9uLnJlcGxhY2VDaGlsZChjbG9uZSwgZmlsdGVyRXhwYW5kKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigncmVuZGVyZWQnICsgRVZFTlRfS0VZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gW3N0eWxlXVxyXG4gICAgICogQHBhcmFtIFtzdGF0dXNdXHJcbiAgICAgKi9cclxuICAgIHNldFN0eWxlOiBmdW5jdGlvbiAobmV3U3R5bGUsIHN0YXR1cykge1xyXG4gICAgICB2YXIgYnV0dG9uID0gdGhpcy4kYnV0dG9uWzBdLFxyXG4gICAgICAgICAgbmV3RWxlbWVudCA9IHRoaXMuJG5ld0VsZW1lbnRbMF0sXHJcbiAgICAgICAgICBzdHlsZSA9IHRoaXMub3B0aW9ucy5zdHlsZS50cmltKCksXHJcbiAgICAgICAgICBidXR0b25DbGFzcztcclxuXHJcbiAgICAgIGlmICh0aGlzLiRlbGVtZW50LmF0dHIoJ2NsYXNzJykpIHtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmFkZENsYXNzKHRoaXMuJGVsZW1lbnQuYXR0cignY2xhc3MnKS5yZXBsYWNlKC9zZWxlY3RwaWNrZXJ8bW9iaWxlLWRldmljZXxicy1zZWxlY3QtaGlkZGVufHZhbGlkYXRlXFxbLipcXF0vZ2ksICcnKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh2ZXJzaW9uLm1ham9yIDwgNCkge1xyXG4gICAgICAgIG5ld0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYnMzJyk7XHJcblxyXG4gICAgICAgIGlmIChuZXdFbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnB1dC1ncm91cCcpICYmXHJcbiAgICAgICAgICAgIChuZXdFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgfHwgbmV3RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpICYmXHJcbiAgICAgICAgICAgIChuZXdFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgfHwgbmV3RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpLmNsYXNzTGlzdC5jb250YWlucygnaW5wdXQtZ3JvdXAtYWRkb24nKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdiczMtaGFzLWFkZG9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmV3U3R5bGUpIHtcclxuICAgICAgICBidXR0b25DbGFzcyA9IG5ld1N0eWxlLnRyaW0oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBidXR0b25DbGFzcyA9IHN0eWxlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3RhdHVzID09ICdhZGQnKSB7XHJcbiAgICAgICAgaWYgKGJ1dHRvbkNsYXNzKSBidXR0b24uY2xhc3NMaXN0LmFkZC5hcHBseShidXR0b24uY2xhc3NMaXN0LCBidXR0b25DbGFzcy5zcGxpdCgnICcpKTtcclxuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gJ3JlbW92ZScpIHtcclxuICAgICAgICBpZiAoYnV0dG9uQ2xhc3MpIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlLmFwcGx5KGJ1dHRvbi5jbGFzc0xpc3QsIGJ1dHRvbkNsYXNzLnNwbGl0KCcgJykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzdHlsZSkgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUuYXBwbHkoYnV0dG9uLmNsYXNzTGlzdCwgc3R5bGUuc3BsaXQoJyAnKSk7XHJcbiAgICAgICAgaWYgKGJ1dHRvbkNsYXNzKSBidXR0b24uY2xhc3NMaXN0LmFkZC5hcHBseShidXR0b24uY2xhc3NMaXN0LCBidXR0b25DbGFzcy5zcGxpdCgnICcpKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBsaUhlaWdodDogZnVuY3Rpb24gKHJlZnJlc2gpIHtcclxuICAgICAgaWYgKCFyZWZyZXNoICYmICh0aGlzLm9wdGlvbnMuc2l6ZSA9PT0gZmFsc2UgfHwgdGhpcy5zaXplSW5mbykpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5zaXplSW5mbykgdGhpcy5zaXplSW5mbyA9IHt9O1xyXG5cclxuICAgICAgdmFyIG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgIG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgIG1lbnVJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgICAgbWVudUlubmVySW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxyXG4gICAgICAgICAgZGl2aWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBkcm9wZG93bkhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXHJcbiAgICAgICAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpLFxyXG4gICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcclxuICAgICAgICAgIGhlYWRlciA9IHRoaXMub3B0aW9ucy5oZWFkZXIgJiYgdGhpcy4kbWVudS5maW5kKCcuJyArIGNsYXNzTmFtZXMuUE9QT1ZFUkhFQURFUikubGVuZ3RoID4gMCA/IHRoaXMuJG1lbnUuZmluZCgnLicgKyBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIpWzBdLmNsb25lTm9kZSh0cnVlKSA6IG51bGwsXHJcbiAgICAgICAgICBzZWFyY2ggPSB0aGlzLm9wdGlvbnMubGl2ZVNlYXJjaCA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIDogbnVsbCxcclxuICAgICAgICAgIGFjdGlvbnMgPSB0aGlzLm9wdGlvbnMuYWN0aW9uc0JveCAmJiB0aGlzLm11bHRpcGxlICYmIHRoaXMuJG1lbnUuZmluZCgnLmJzLWFjdGlvbnNib3gnKS5sZW5ndGggPiAwID8gdGhpcy4kbWVudS5maW5kKCcuYnMtYWN0aW9uc2JveCcpWzBdLmNsb25lTm9kZSh0cnVlKSA6IG51bGwsXHJcbiAgICAgICAgICBkb25lQnV0dG9uID0gdGhpcy5vcHRpb25zLmRvbmVCdXR0b24gJiYgdGhpcy5tdWx0aXBsZSAmJiB0aGlzLiRtZW51LmZpbmQoJy5icy1kb25lYnV0dG9uJykubGVuZ3RoID4gMCA/IHRoaXMuJG1lbnUuZmluZCgnLmJzLWRvbmVidXR0b24nKVswXS5jbG9uZU5vZGUodHJ1ZSkgOiBudWxsLFxyXG4gICAgICAgICAgZmlyc3RPcHRpb24gPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpWzBdO1xyXG5cclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RXaWR0aCA9IHRoaXMuJG5ld0VsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICB0ZXh0LmNsYXNzTmFtZSA9ICd0ZXh0JztcclxuICAgICAgYS5jbGFzc05hbWUgPSAnZHJvcGRvd24taXRlbSAnICsgKGZpcnN0T3B0aW9uID8gZmlyc3RPcHRpb24uY2xhc3NOYW1lIDogJycpO1xyXG4gICAgICBuZXdFbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuJG1lbnVbMF0ucGFyZW50Tm9kZS5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWVzLlNIT1c7XHJcbiAgICAgIG5ld0VsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLnNpemVJbmZvLnNlbGVjdFdpZHRoICsgJ3B4JztcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy53aWR0aCA9PT0gJ2F1dG8nKSBtZW51LnN0eWxlLm1pbldpZHRoID0gMDtcclxuICAgICAgbWVudS5jbGFzc05hbWUgPSBjbGFzc05hbWVzLk1FTlUgKyAnICcgKyBjbGFzc05hbWVzLlNIT1c7XHJcbiAgICAgIG1lbnVJbm5lci5jbGFzc05hbWUgPSAnaW5uZXIgJyArIGNsYXNzTmFtZXMuU0hPVztcclxuICAgICAgbWVudUlubmVySW5uZXIuY2xhc3NOYW1lID0gY2xhc3NOYW1lcy5NRU5VICsgJyBpbm5lciAnICsgKHZlcnNpb24ubWFqb3IgPT09ICc0JyA/IGNsYXNzTmFtZXMuU0hPVyA6ICcnKTtcclxuICAgICAgZGl2aWRlci5jbGFzc05hbWUgPSBjbGFzc05hbWVzLkRJVklERVI7XHJcbiAgICAgIGRyb3Bkb3duSGVhZGVyLmNsYXNzTmFtZSA9ICdkcm9wZG93bi1oZWFkZXInO1xyXG5cclxuICAgICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnXFx1MjAwYicpKTtcclxuICAgICAgYS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgbGkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgIGRyb3Bkb3duSGVhZGVyLmFwcGVuZENoaWxkKHRleHQuY2xvbmVOb2RlKHRydWUpKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdHBpY2tlci52aWV3LndpZGVzdE9wdGlvbikge1xyXG4gICAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0cGlja2VyLnZpZXcud2lkZXN0T3B0aW9uLmNsb25lTm9kZSh0cnVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgbWVudUlubmVySW5uZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XHJcbiAgICAgIG1lbnVJbm5lcklubmVyLmFwcGVuZENoaWxkKGRyb3Bkb3duSGVhZGVyKTtcclxuICAgICAgaWYgKGhlYWRlcikgbWVudS5hcHBlbmRDaGlsZChoZWFkZXIpO1xyXG4gICAgICBpZiAoc2VhcmNoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBzZWFyY2guY2xhc3NOYW1lID0gJ2JzLXNlYXJjaGJveCc7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gJ2Zvcm0tY29udHJvbCc7XHJcbiAgICAgICAgc2VhcmNoLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBtZW51LmFwcGVuZENoaWxkKHNlYXJjaCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGFjdGlvbnMpIG1lbnUuYXBwZW5kQ2hpbGQoYWN0aW9ucyk7XHJcbiAgICAgIG1lbnVJbm5lci5hcHBlbmRDaGlsZChtZW51SW5uZXJJbm5lcik7XHJcbiAgICAgIG1lbnUuYXBwZW5kQ2hpbGQobWVudUlubmVyKTtcclxuICAgICAgaWYgKGRvbmVCdXR0b24pIG1lbnUuYXBwZW5kQ2hpbGQoZG9uZUJ1dHRvbik7XHJcbiAgICAgIG5ld0VsZW1lbnQuYXBwZW5kQ2hpbGQobWVudSk7XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpO1xyXG5cclxuICAgICAgdmFyIGxpSGVpZ2h0ID0gbGkub2Zmc2V0SGVpZ2h0LFxyXG4gICAgICAgICAgZHJvcGRvd25IZWFkZXJIZWlnaHQgPSBkcm9wZG93bkhlYWRlciA/IGRyb3Bkb3duSGVhZGVyLm9mZnNldEhlaWdodCA6IDAsXHJcbiAgICAgICAgICBoZWFkZXJIZWlnaHQgPSBoZWFkZXIgPyBoZWFkZXIub2Zmc2V0SGVpZ2h0IDogMCxcclxuICAgICAgICAgIHNlYXJjaEhlaWdodCA9IHNlYXJjaCA/IHNlYXJjaC5vZmZzZXRIZWlnaHQgOiAwLFxyXG4gICAgICAgICAgYWN0aW9uc0hlaWdodCA9IGFjdGlvbnMgPyBhY3Rpb25zLm9mZnNldEhlaWdodCA6IDAsXHJcbiAgICAgICAgICBkb25lQnV0dG9uSGVpZ2h0ID0gZG9uZUJ1dHRvbiA/IGRvbmVCdXR0b24ub2Zmc2V0SGVpZ2h0IDogMCxcclxuICAgICAgICAgIGRpdmlkZXJIZWlnaHQgPSAkKGRpdmlkZXIpLm91dGVySGVpZ2h0KHRydWUpLFxyXG4gICAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGpRdWVyeSBpZiBnZXRDb21wdXRlZFN0eWxlIGlzIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgIG1lbnVTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUobWVudSkgOiBmYWxzZSxcclxuICAgICAgICAgIG1lbnVXaWR0aCA9IG1lbnUub2Zmc2V0V2lkdGgsXHJcbiAgICAgICAgICAkbWVudSA9IG1lbnVTdHlsZSA/IG51bGwgOiAkKG1lbnUpLFxyXG4gICAgICAgICAgbWVudVBhZGRpbmcgPSB7XHJcbiAgICAgICAgICAgIHZlcnQ6IHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUucGFkZGluZ1RvcCA6ICRtZW51LmNzcygncGFkZGluZ1RvcCcpKSArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUucGFkZGluZ0JvdHRvbSA6ICRtZW51LmNzcygncGFkZGluZ0JvdHRvbScpKSArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUuYm9yZGVyVG9wV2lkdGggOiAkbWVudS5jc3MoJ2JvcmRlclRvcFdpZHRoJykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA6ICRtZW51LmNzcygnYm9yZGVyQm90dG9tV2lkdGgnKSksXHJcbiAgICAgICAgICAgIGhvcml6OiB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLnBhZGRpbmdMZWZ0IDogJG1lbnUuY3NzKCdwYWRkaW5nTGVmdCcpKSArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUucGFkZGluZ1JpZ2h0IDogJG1lbnUuY3NzKCdwYWRkaW5nUmlnaHQnKSkgK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLmJvcmRlckxlZnRXaWR0aCA6ICRtZW51LmNzcygnYm9yZGVyTGVmdFdpZHRoJykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5ib3JkZXJSaWdodFdpZHRoIDogJG1lbnUuY3NzKCdib3JkZXJSaWdodFdpZHRoJykpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWVudUV4dHJhcyA9IHtcclxuICAgICAgICAgICAgdmVydDogbWVudVBhZGRpbmcudmVydCArXHJcbiAgICAgICAgICAgICAgICAgIHRvSW50ZWdlcihtZW51U3R5bGUgPyBtZW51U3R5bGUubWFyZ2luVG9wIDogJG1lbnUuY3NzKCdtYXJnaW5Ub3AnKSkgK1xyXG4gICAgICAgICAgICAgICAgICB0b0ludGVnZXIobWVudVN0eWxlID8gbWVudVN0eWxlLm1hcmdpbkJvdHRvbSA6ICRtZW51LmNzcygnbWFyZ2luQm90dG9tJykpICsgMixcclxuICAgICAgICAgICAgaG9yaXo6IG1lbnVQYWRkaW5nLmhvcml6ICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5tYXJnaW5MZWZ0IDogJG1lbnUuY3NzKCdtYXJnaW5MZWZ0JykpICtcclxuICAgICAgICAgICAgICAgICAgdG9JbnRlZ2VyKG1lbnVTdHlsZSA/IG1lbnVTdHlsZS5tYXJnaW5SaWdodCA6ICRtZW51LmNzcygnbWFyZ2luUmlnaHQnKSkgKyAyXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2Nyb2xsQmFyV2lkdGg7XHJcblxyXG4gICAgICBtZW51SW5uZXIuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcblxyXG4gICAgICBzY3JvbGxCYXJXaWR0aCA9IG1lbnUub2Zmc2V0V2lkdGggLSBtZW51V2lkdGg7XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG5ld0VsZW1lbnQpO1xyXG5cclxuICAgICAgdGhpcy5zaXplSW5mby5saUhlaWdodCA9IGxpSGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLmRyb3Bkb3duSGVhZGVySGVpZ2h0ID0gZHJvcGRvd25IZWFkZXJIZWlnaHQ7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uaGVhZGVySGVpZ2h0ID0gaGVhZGVySGVpZ2h0O1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlYXJjaEhlaWdodCA9IHNlYXJjaEhlaWdodDtcclxuICAgICAgdGhpcy5zaXplSW5mby5hY3Rpb25zSGVpZ2h0ID0gYWN0aW9uc0hlaWdodDtcclxuICAgICAgdGhpcy5zaXplSW5mby5kb25lQnV0dG9uSGVpZ2h0ID0gZG9uZUJ1dHRvbkhlaWdodDtcclxuICAgICAgdGhpcy5zaXplSW5mby5kaXZpZGVySGVpZ2h0ID0gZGl2aWRlckhlaWdodDtcclxuICAgICAgdGhpcy5zaXplSW5mby5tZW51UGFkZGluZyA9IG1lbnVQYWRkaW5nO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLm1lbnVFeHRyYXMgPSBtZW51RXh0cmFzO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLm1lbnVXaWR0aCA9IG1lbnVXaWR0aDtcclxuICAgICAgdGhpcy5zaXplSW5mby50b3RhbE1lbnVXaWR0aCA9IHRoaXMuc2l6ZUluZm8ubWVudVdpZHRoO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNjcm9sbEJhcldpZHRoID0gc2Nyb2xsQmFyV2lkdGg7XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2VsZWN0SGVpZ2h0ID0gdGhpcy4kbmV3RWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICB0aGlzLnNldFBvc2l0aW9uRGF0YSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRTZWxlY3RQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgcG9zID0gdGhhdC4kbmV3RWxlbWVudC5vZmZzZXQoKSxcclxuICAgICAgICAgICRjb250YWluZXIgPSAkKHRoYXQub3B0aW9ucy5jb250YWluZXIpLFxyXG4gICAgICAgICAgY29udGFpbmVyUG9zO1xyXG5cclxuICAgICAgaWYgKHRoYXQub3B0aW9ucy5jb250YWluZXIgJiYgJGNvbnRhaW5lci5sZW5ndGggJiYgISRjb250YWluZXIuaXMoJ2JvZHknKSkge1xyXG4gICAgICAgIGNvbnRhaW5lclBvcyA9ICRjb250YWluZXIub2Zmc2V0KCk7XHJcbiAgICAgICAgY29udGFpbmVyUG9zLnRvcCArPSBwYXJzZUludCgkY29udGFpbmVyLmNzcygnYm9yZGVyVG9wV2lkdGgnKSk7XHJcbiAgICAgICAgY29udGFpbmVyUG9zLmxlZnQgKz0gcGFyc2VJbnQoJGNvbnRhaW5lci5jc3MoJ2JvcmRlckxlZnRXaWR0aCcpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb250YWluZXJQb3MgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgd2luUGFkID0gdGhhdC5vcHRpb25zLndpbmRvd1BhZGRpbmc7XHJcblxyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFRvcCA9IHBvcy50b3AgLSBjb250YWluZXJQb3MudG9wIC0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRCb3QgPSAkd2luZG93LmhlaWdodCgpIC0gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRUb3AgLSB0aGlzLnNpemVJbmZvLnNlbGVjdEhlaWdodCAtIGNvbnRhaW5lclBvcy50b3AgLSB3aW5QYWRbMl07XHJcbiAgICAgIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0TGVmdCA9IHBvcy5sZWZ0IC0gY29udGFpbmVyUG9zLmxlZnQgLSAkd2luZG93LnNjcm9sbExlZnQoKTtcclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRSaWdodCA9ICR3aW5kb3cud2lkdGgoKSAtIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0TGVmdCAtIHRoaXMuc2l6ZUluZm8uc2VsZWN0V2lkdGggLSBjb250YWluZXJQb3MubGVmdCAtIHdpblBhZFsxXTtcclxuICAgICAgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRUb3AgLT0gd2luUGFkWzBdO1xyXG4gICAgICB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldExlZnQgLT0gd2luUGFkWzNdO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNZW51U2l6ZTogZnVuY3Rpb24gKGlzQXV0bykge1xyXG4gICAgICB0aGlzLmdldFNlbGVjdFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgc2VsZWN0V2lkdGggPSB0aGlzLnNpemVJbmZvLnNlbGVjdFdpZHRoLFxyXG4gICAgICAgICAgbGlIZWlnaHQgPSB0aGlzLnNpemVJbmZvLmxpSGVpZ2h0LFxyXG4gICAgICAgICAgaGVhZGVySGVpZ2h0ID0gdGhpcy5zaXplSW5mby5oZWFkZXJIZWlnaHQsXHJcbiAgICAgICAgICBzZWFyY2hIZWlnaHQgPSB0aGlzLnNpemVJbmZvLnNlYXJjaEhlaWdodCxcclxuICAgICAgICAgIGFjdGlvbnNIZWlnaHQgPSB0aGlzLnNpemVJbmZvLmFjdGlvbnNIZWlnaHQsXHJcbiAgICAgICAgICBkb25lQnV0dG9uSGVpZ2h0ID0gdGhpcy5zaXplSW5mby5kb25lQnV0dG9uSGVpZ2h0LFxyXG4gICAgICAgICAgZGl2SGVpZ2h0ID0gdGhpcy5zaXplSW5mby5kaXZpZGVySGVpZ2h0LFxyXG4gICAgICAgICAgbWVudVBhZGRpbmcgPSB0aGlzLnNpemVJbmZvLm1lbnVQYWRkaW5nLFxyXG4gICAgICAgICAgbWVudUlubmVySGVpZ2h0LFxyXG4gICAgICAgICAgbWVudUhlaWdodCxcclxuICAgICAgICAgIGRpdkxlbmd0aCA9IDAsXHJcbiAgICAgICAgICBtaW5IZWlnaHQsXHJcbiAgICAgICAgICBfbWluSGVpZ2h0LFxyXG4gICAgICAgICAgbWF4SGVpZ2h0LFxyXG4gICAgICAgICAgbWVudUlubmVyTWluSGVpZ2h0LFxyXG4gICAgICAgICAgZXN0aW1hdGU7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRyb3B1cEF1dG8pIHtcclxuICAgICAgICAvLyBHZXQgdGhlIGVzdGltYXRlZCBoZWlnaHQgb2YgdGhlIG1lbnUgd2l0aG91dCBzY3JvbGxiYXJzLlxyXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBzbWFsbGVyIG1lbnVzLCB3aGVyZSB0aGVyZSBtaWdodCBiZSBwbGVudHkgb2Ygcm9vbVxyXG4gICAgICAgIC8vIGJlbG93IHRoZSBidXR0b24gd2l0aG91dCBzZXR0aW5nIGRyb3B1cCwgYnV0IHdlIGNhbid0IGtub3dcclxuICAgICAgICAvLyB0aGUgZXhhY3QgaGVpZ2h0IG9mIHRoZSBtZW51IHVudGlsIGNyZWF0ZVZpZXcgaXMgY2FsbGVkIGxhdGVyXHJcbiAgICAgICAgZXN0aW1hdGUgPSBsaUhlaWdodCAqIHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZWxlbWVudHMubGVuZ3RoICsgbWVudVBhZGRpbmcudmVydDtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LnRvZ2dsZUNsYXNzKGNsYXNzTmFtZXMuRFJPUFVQLCB0aGlzLnNpemVJbmZvLnNlbGVjdE9mZnNldFRvcCAtIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0Qm90ID4gdGhpcy5zaXplSW5mby5tZW51RXh0cmFzLnZlcnQgJiYgZXN0aW1hdGUgKyB0aGlzLnNpemVJbmZvLm1lbnVFeHRyYXMudmVydCArIDUwID4gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRCb3QpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNpemUgPT09ICdhdXRvJykge1xyXG4gICAgICAgIF9taW5IZWlnaHQgPSB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzLmxlbmd0aCA+IDMgPyB0aGlzLnNpemVJbmZvLmxpSGVpZ2h0ICogMyArIHRoaXMuc2l6ZUluZm8ubWVudUV4dHJhcy52ZXJ0IC0gMiA6IDA7XHJcbiAgICAgICAgbWVudUhlaWdodCA9IHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0Qm90IC0gdGhpcy5zaXplSW5mby5tZW51RXh0cmFzLnZlcnQ7XHJcbiAgICAgICAgbWluSGVpZ2h0ID0gX21pbkhlaWdodCArIGhlYWRlckhlaWdodCArIHNlYXJjaEhlaWdodCArIGFjdGlvbnNIZWlnaHQgKyBkb25lQnV0dG9uSGVpZ2h0O1xyXG4gICAgICAgIG1lbnVJbm5lck1pbkhlaWdodCA9IE1hdGgubWF4KF9taW5IZWlnaHQgLSBtZW51UGFkZGluZy52ZXJ0LCAwKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJG5ld0VsZW1lbnQuaGFzQ2xhc3MoY2xhc3NOYW1lcy5EUk9QVVApKSB7XHJcbiAgICAgICAgICBtZW51SGVpZ2h0ID0gdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRUb3AgLSB0aGlzLnNpemVJbmZvLm1lbnVFeHRyYXMudmVydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1heEhlaWdodCA9IG1lbnVIZWlnaHQ7XHJcbiAgICAgICAgbWVudUlubmVySGVpZ2h0ID0gbWVudUhlaWdodCAtIGhlYWRlckhlaWdodCAtIHNlYXJjaEhlaWdodCAtIGFjdGlvbnNIZWlnaHQgLSBkb25lQnV0dG9uSGVpZ2h0IC0gbWVudVBhZGRpbmcudmVydDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2l6ZSAmJiB0aGlzLm9wdGlvbnMuc2l6ZSAhPSAnYXV0bycgJiYgdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGggPiB0aGlzLm9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpXS50eXBlID09PSAnZGl2aWRlcicpIGRpdkxlbmd0aCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWVudUhlaWdodCA9IGxpSGVpZ2h0ICogdGhpcy5vcHRpb25zLnNpemUgKyBkaXZMZW5ndGggKiBkaXZIZWlnaHQgKyBtZW51UGFkZGluZy52ZXJ0O1xyXG4gICAgICAgIG1lbnVJbm5lckhlaWdodCA9IG1lbnVIZWlnaHQgLSBtZW51UGFkZGluZy52ZXJ0O1xyXG4gICAgICAgIG1heEhlaWdodCA9IG1lbnVIZWlnaHQgKyBoZWFkZXJIZWlnaHQgKyBzZWFyY2hIZWlnaHQgKyBhY3Rpb25zSGVpZ2h0ICsgZG9uZUJ1dHRvbkhlaWdodDtcclxuICAgICAgICBtaW5IZWlnaHQgPSBtZW51SW5uZXJNaW5IZWlnaHQgPSAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcm9wZG93bkFsaWduUmlnaHQgPT09ICdhdXRvJykge1xyXG4gICAgICAgIHRoaXMuJG1lbnUudG9nZ2xlQ2xhc3MoY2xhc3NOYW1lcy5NRU5VUklHSFQsIHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0TGVmdCA+IHRoaXMuc2l6ZUluZm8uc2VsZWN0T2Zmc2V0UmlnaHQgJiYgdGhpcy5zaXplSW5mby5zZWxlY3RPZmZzZXRSaWdodCA8ICh0aGlzLnNpemVJbmZvLnRvdGFsTWVudVdpZHRoIC0gc2VsZWN0V2lkdGgpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kbWVudS5jc3Moe1xyXG4gICAgICAgICdtYXgtaGVpZ2h0JzogbWF4SGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcclxuICAgICAgICAnbWluLWhlaWdodCc6IG1pbkhlaWdodCArICdweCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRtZW51SW5uZXIuY3NzKHtcclxuICAgICAgICAnbWF4LWhlaWdodCc6IG1lbnVJbm5lckhlaWdodCArICdweCcsXHJcbiAgICAgICAgJ292ZXJmbG93LXknOiAnYXV0bycsXHJcbiAgICAgICAgJ21pbi1oZWlnaHQnOiBtZW51SW5uZXJNaW5IZWlnaHQgKyAncHgnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gZW5zdXJlIG1lbnVJbm5lckhlaWdodCBpcyBhbHdheXMgYSBwb3NpdGl2ZSBudW1iZXIgdG8gcHJldmVudCBpc3N1ZXMgY2FsY3VsYXRpbmcgY2h1bmtTaXplIGluIGNyZWF0ZVZpZXdcclxuICAgICAgdGhpcy5zaXplSW5mby5tZW51SW5uZXJIZWlnaHQgPSBNYXRoLm1heChtZW51SW5uZXJIZWlnaHQsIDEpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YS5sZW5ndGggJiYgdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW3RoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YS5sZW5ndGggLSAxXS5wb3NpdGlvbiA+IHRoaXMuc2l6ZUluZm8ubWVudUlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5zaXplSW5mby5oYXNTY3JvbGxCYXIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2l6ZUluZm8udG90YWxNZW51V2lkdGggPSB0aGlzLnNpemVJbmZvLm1lbnVXaWR0aCArIHRoaXMuc2l6ZUluZm8uc2Nyb2xsQmFyV2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuJG1lbnUuY3NzKCdtaW4td2lkdGgnLCB0aGlzLnNpemVJbmZvLnRvdGFsTWVudVdpZHRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuZHJvcGRvd24gJiYgdGhpcy5kcm9wZG93bi5fcG9wcGVyKSB0aGlzLmRyb3Bkb3duLl9wb3BwZXIudXBkYXRlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFNpemU6IGZ1bmN0aW9uIChyZWZyZXNoKSB7XHJcbiAgICAgIHRoaXMubGlIZWlnaHQocmVmcmVzaCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlcikgdGhpcy4kbWVudS5jc3MoJ3BhZGRpbmctdG9wJywgMCk7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2l6ZSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyk7XHJcblxyXG4gICAgICB0aGlzLnNldE1lbnVTaXplKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICB0aGlzLiRzZWFyY2hib3hcclxuICAgICAgICAgIC5vZmYoJ2lucHV0LnNldE1lbnVTaXplIHByb3BlcnR5Y2hhbmdlLnNldE1lbnVTaXplJylcclxuICAgICAgICAgIC5vbignaW5wdXQuc2V0TWVudVNpemUgcHJvcGVydHljaGFuZ2Uuc2V0TWVudVNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNldE1lbnVTaXplKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaXplID09PSAnYXV0bycpIHtcclxuICAgICAgICAkd2luZG93XHJcbiAgICAgICAgICAub2ZmKCdyZXNpemUnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnICsgJyBzY3JvbGwnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnKVxyXG4gICAgICAgICAgLm9uKCdyZXNpemUnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnICsgJyBzY3JvbGwnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LnNldE1lbnVTaXplKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2l6ZSAmJiB0aGlzLm9wdGlvbnMuc2l6ZSAhPSAnYXV0bycgJiYgdGhpcy5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGggPiB0aGlzLm9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgICR3aW5kb3cub2ZmKCdyZXNpemUnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnICsgJyBzY3JvbGwnICsgRVZFTlRfS0VZICsgJy4nICsgdGhpcy5zZWxlY3RJZCArICcuc2V0TWVudVNpemUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5jcmVhdGVWaWV3KGZhbHNlLCB0cnVlLCByZWZyZXNoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0V2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy53aWR0aCA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnUuY3NzKCdtaW4td2lkdGgnLCAnMCcpO1xyXG5cclxuICAgICAgICAgIHRoYXQuJGVsZW1lbnQub24oJ2xvYWRlZCcgKyBFVkVOVF9LRVksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhhdC5saUhlaWdodCgpO1xyXG4gICAgICAgICAgICB0aGF0LnNldE1lbnVTaXplKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgY29ycmVjdCB3aWR0aCBpZiBlbGVtZW50IGlzIGhpZGRlblxyXG4gICAgICAgICAgICB2YXIgJHNlbGVjdENsb25lID0gdGhhdC4kbmV3RWxlbWVudC5jbG9uZSgpLmFwcGVuZFRvKCdib2R5JyksXHJcbiAgICAgICAgICAgICAgICBidG5XaWR0aCA9ICRzZWxlY3RDbG9uZS5jc3MoJ3dpZHRoJywgJ2F1dG8nKS5jaGlsZHJlbignYnV0dG9uJykub3V0ZXJXaWR0aCgpO1xyXG5cclxuICAgICAgICAgICAgJHNlbGVjdENsb25lLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHdpZHRoIHRvIHdoYXRldmVyJ3MgbGFyZ2VyLCBidXR0b24gdGl0bGUgb3IgbG9uZ2VzdCBvcHRpb25cclxuICAgICAgICAgICAgdGhhdC5zaXplSW5mby5zZWxlY3RXaWR0aCA9IE1hdGgubWF4KHRoYXQuc2l6ZUluZm8udG90YWxNZW51V2lkdGgsIGJ0bldpZHRoKTtcclxuICAgICAgICAgICAgdGhhdC4kbmV3RWxlbWVudC5jc3MoJ3dpZHRoJywgdGhhdC5zaXplSW5mby5zZWxlY3RXaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLndpZHRoID09PSAnZml0Jykge1xyXG4gICAgICAgIC8vIFJlbW92ZSBpbmxpbmUgbWluLXdpZHRoIHNvIHdpZHRoIGNhbiBiZSBjaGFuZ2VkIGZyb20gJ2F1dG8nXHJcbiAgICAgICAgdGhpcy4kbWVudS5jc3MoJ21pbi13aWR0aCcsICcnKTtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmNzcygnd2lkdGgnLCAnJykuYWRkQ2xhc3MoJ2ZpdC13aWR0aCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy53aWR0aCkge1xyXG4gICAgICAgIC8vIFJlbW92ZSBpbmxpbmUgbWluLXdpZHRoIHNvIHdpZHRoIGNhbiBiZSBjaGFuZ2VkIGZyb20gJ2F1dG8nXHJcbiAgICAgICAgdGhpcy4kbWVudS5jc3MoJ21pbi13aWR0aCcsICcnKTtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmNzcygnd2lkdGgnLCB0aGlzLm9wdGlvbnMud2lkdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFJlbW92ZSBpbmxpbmUgbWluLXdpZHRoL3dpZHRoIHNvIHdpZHRoIGNhbiBiZSBjaGFuZ2VkXHJcbiAgICAgICAgdGhpcy4kbWVudS5jc3MoJ21pbi13aWR0aCcsICcnKTtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50LmNzcygnd2lkdGgnLCAnJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gUmVtb3ZlIGZpdC13aWR0aCBjbGFzcyBpZiB3aWR0aCBpcyBjaGFuZ2VkIHByb2dyYW1tYXRpY2FsbHlcclxuICAgICAgaWYgKHRoaXMuJG5ld0VsZW1lbnQuaGFzQ2xhc3MoJ2ZpdC13aWR0aCcpICYmIHRoaXMub3B0aW9ucy53aWR0aCAhPT0gJ2ZpdCcpIHtcclxuICAgICAgICB0aGlzLiRuZXdFbGVtZW50WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpdC13aWR0aCcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbGVjdFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJGJzQ29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cImJzLWNvbnRhaW5lclwiIC8+Jyk7XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAkY29udGFpbmVyID0gJCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSxcclxuICAgICAgICAgIHBvcyxcclxuICAgICAgICAgIGNvbnRhaW5lclBvcyxcclxuICAgICAgICAgIGFjdHVhbEhlaWdodCxcclxuICAgICAgICAgIGdldFBsYWNlbWVudCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyUG9zaXRpb24gPSB7fSxcclxuICAgICAgICAgICAgICAgIC8vIGZhbGwgYmFjayB0byBkcm9wZG93bidzIGRlZmF1bHQgZGlzcGxheSBzZXR0aW5nIGlmIGRpc3BsYXkgaXMgbm90IG1hbnVhbGx5IHNldFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSA9IHRoYXQub3B0aW9ucy5kaXNwbGF5IHx8IChcclxuICAgICAgICAgICAgICAgICAgLy8gQm9vdHN0cmFwIDMgZG9lc24ndCBoYXZlICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IuRGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLkRlZmF1bHQgPyAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLkRlZmF1bHQuZGlzcGxheVxyXG4gICAgICAgICAgICAgICAgICA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhhdC4kYnNDb250YWluZXIuYWRkQ2xhc3MoJGVsZW1lbnQuYXR0cignY2xhc3MnKS5yZXBsYWNlKC9mb3JtLWNvbnRyb2x8Zml0LXdpZHRoL2dpLCAnJykpLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZXMuRFJPUFVQLCAkZWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWVzLkRST1BVUCkpO1xyXG4gICAgICAgICAgICBwb3MgPSAkZWxlbWVudC5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJGNvbnRhaW5lci5pcygnYm9keScpKSB7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zID0gJGNvbnRhaW5lci5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICBjb250YWluZXJQb3MudG9wICs9IHBhcnNlSW50KCRjb250YWluZXIuY3NzKCdib3JkZXJUb3BXaWR0aCcpKSAtICRjb250YWluZXIuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zLmxlZnQgKz0gcGFyc2VJbnQoJGNvbnRhaW5lci5jc3MoJ2JvcmRlckxlZnRXaWR0aCcpKSAtICRjb250YWluZXIuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnRhaW5lclBvcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjdHVhbEhlaWdodCA9ICRlbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuRFJPUFVQKSA/IDAgOiAkZWxlbWVudFswXS5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAvLyBCb290c3RyYXAgNCsgdXNlcyBQb3BwZXIgZm9yIG1lbnUgcG9zaXRpb25pbmdcclxuICAgICAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPCA0IHx8IGRpc3BsYXkgPT09ICdzdGF0aWMnKSB7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zaXRpb24udG9wID0gcG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AgKyBhY3R1YWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9zaXRpb24ubGVmdCA9IHBvcy5sZWZ0IC0gY29udGFpbmVyUG9zLmxlZnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lclBvc2l0aW9uLndpZHRoID0gJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICAgICAgICB0aGF0LiRic0NvbnRhaW5lci5jc3MoY29udGFpbmVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoYXQuaXNEaXNhYmxlZCgpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRQbGFjZW1lbnQodGhhdC4kbmV3RWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoYXQuJGJzQ29udGFpbmVyXHJcbiAgICAgICAgICAuYXBwZW5kVG8odGhhdC5vcHRpb25zLmNvbnRhaW5lcilcclxuICAgICAgICAgIC50b2dnbGVDbGFzcyhjbGFzc05hbWVzLlNIT1csICF0aGF0LiRidXR0b24uaGFzQ2xhc3MoY2xhc3NOYW1lcy5TSE9XKSlcclxuICAgICAgICAgIC5hcHBlbmQodGhhdC4kbWVudSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCh3aW5kb3cpXHJcbiAgICAgICAgLm9mZigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnIHNjcm9sbCcgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkKVxyXG4gICAgICAgIC5vbigncmVzaXplJyArIEVWRU5UX0tFWSArICcuJyArIHRoaXMuc2VsZWN0SWQgKyAnIHNjcm9sbCcgKyBFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGF0LiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVyk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzQWN0aXZlKSBnZXRQbGFjZW1lbnQodGhhdC4kbmV3RWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdoaWRlJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoYXQuJG1lbnUuZGF0YSgnaGVpZ2h0JywgdGhhdC4kbWVudS5oZWlnaHQoKSk7XHJcbiAgICAgICAgdGhhdC4kYnNDb250YWluZXIuZGV0YWNoKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRPcHRpb25TdGF0dXM6IGZ1bmN0aW9uIChzZWxlY3RlZE9ubHkpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgdGhhdC5ub1Njcm9sbCA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzICYmIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcudmlzaWJsZUVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhhdC5zZWxlY3RwaWNrZXIudmlldy52aXNpYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBsaURhdGEgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbaSArIHRoYXQuc2VsZWN0cGlja2VyLnZpZXcucG9zaXRpb24wXSxcclxuICAgICAgICAgICAgICBvcHRpb24gPSBsaURhdGEub3B0aW9uO1xyXG5cclxuICAgICAgICAgIGlmIChvcHRpb24pIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkT25seSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgIHRoYXQuc2V0RGlzYWJsZWQoXHJcbiAgICAgICAgICAgICAgICBsaURhdGEuaW5kZXgsXHJcbiAgICAgICAgICAgICAgICBsaURhdGEuZGlzYWJsZWRcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKFxyXG4gICAgICAgICAgICAgIGxpRGF0YS5pbmRleCxcclxuICAgICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSB0aGUgaW5kZXggb2YgdGhlIG9wdGlvbiB0aGF0IGlzIGJlaW5nIGNoYW5nZWRcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2VsZWN0ZWQgLSB0cnVlIGlmIHRoZSBvcHRpb24gaXMgYmVpbmcgc2VsZWN0ZWQsIGZhbHNlIGlmIGJlaW5nIGRlc2VsZWN0ZWRcclxuICAgICAqL1xyXG4gICAgc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uIChpbmRleCwgc2VsZWN0ZWQpIHtcclxuICAgICAgdmFyIGxpID0gdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50c1tpbmRleF0sXHJcbiAgICAgICAgICBsaURhdGEgPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluLmRhdGFbaW5kZXhdLFxyXG4gICAgICAgICAgYWN0aXZlSW5kZXhJc1NldCA9IHRoaXMuYWN0aXZlSW5kZXggIT09IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHRoaXNJc0FjdGl2ZSA9IHRoaXMuYWN0aXZlSW5kZXggPT09IGluZGV4LFxyXG4gICAgICAgICAgcHJldkFjdGl2ZSxcclxuICAgICAgICAgIGEsXHJcbiAgICAgICAgICAvLyBpZiBjdXJyZW50IG9wdGlvbiBpcyBhbHJlYWR5IGFjdGl2ZVxyXG4gICAgICAgICAgLy8gT1JcclxuICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IG9wdGlvbiBpcyBiZWluZyBzZWxlY3RlZCwgaXQncyBOT1QgbXVsdGlwbGUsIGFuZFxyXG4gICAgICAgICAgLy8gYWN0aXZlSW5kZXggaXMgdW5kZWZpbmVkOlxyXG4gICAgICAgICAgLy8gIC0gd2hlbiB0aGUgbWVudSBpcyBmaXJzdCBiZWluZyBvcGVuZWQsIE9SXHJcbiAgICAgICAgICAvLyAgLSBhZnRlciBhIHNlYXJjaCBoYXMgYmVlbiBwZXJmb3JtZWQsIE9SXHJcbiAgICAgICAgICAvLyAgLSB3aGVuIHJldGFpbkFjdGl2ZSBpcyBmYWxzZSB3aGVuIHNlbGVjdGluZyBhIG5ldyBvcHRpb24gKGkuZS4gaW5kZXggb2YgdGhlIG5ld2x5IHNlbGVjdGVkIG9wdGlvbiBpcyBub3QgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgYWN0aXZlSW5kZXgpXHJcbiAgICAgICAgICBrZWVwQWN0aXZlID0gdGhpc0lzQWN0aXZlIHx8IChzZWxlY3RlZCAmJiAhdGhpcy5tdWx0aXBsZSAmJiAhYWN0aXZlSW5kZXhJc1NldCk7XHJcblxyXG4gICAgICBsaURhdGEuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuXHJcbiAgICAgIGEgPSBsaS5maXJzdENoaWxkO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxpLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xyXG5cclxuICAgICAgaWYgKGtlZXBBY3RpdmUpIHtcclxuICAgICAgICB0aGlzLmZvY3VzSXRlbShsaSwgbGlEYXRhKTtcclxuICAgICAgICB0aGlzLnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUgPSBsaTtcclxuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gaW5kZXg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5kZWZvY3VzSXRlbShsaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhKSB7XHJcbiAgICAgICAgYS5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsIHNlbGVjdGVkKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGEucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWtlZXBBY3RpdmUgJiYgIWFjdGl2ZUluZGV4SXNTZXQgJiYgc2VsZWN0ZWQgJiYgdGhpcy5wcmV2QWN0aXZlSW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByZXZBY3RpdmUgPSB0aGlzLnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW3RoaXMucHJldkFjdGl2ZUluZGV4XTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZvY3VzSXRlbShwcmV2QWN0aXZlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIHRoZSBpbmRleCBvZiB0aGUgb3B0aW9uIHRoYXQgaXMgYmVpbmcgZGlzYWJsZWRcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGlzYWJsZWQgLSB0cnVlIGlmIHRoZSBvcHRpb24gaXMgYmVpbmcgZGlzYWJsZWQsIGZhbHNlIGlmIGJlaW5nIGVuYWJsZWRcclxuICAgICAqL1xyXG4gICAgc2V0RGlzYWJsZWQ6IGZ1bmN0aW9uIChpbmRleCwgZGlzYWJsZWQpIHtcclxuICAgICAgdmFyIGxpID0gdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5lbGVtZW50c1tpbmRleF0sXHJcbiAgICAgICAgICBhO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RwaWNrZXIubWFpbi5kYXRhW2luZGV4XS5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG5cclxuICAgICAgYSA9IGxpLmZpcnN0Q2hpbGQ7XHJcblxyXG4gICAgICBsaS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZXMuRElTQUJMRUQsIGRpc2FibGVkKTtcclxuXHJcbiAgICAgIGlmIChhKSB7XHJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPT09ICc0JykgYS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZXMuRElTQUJMRUQsIGRpc2FibGVkKTtcclxuXHJcbiAgICAgICAgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKTtcclxuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpc0Rpc2FibGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50WzBdLmRpc2FibGVkO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0Rpc2FibGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQoKSkge1xyXG4gICAgICAgIHRoaXMuJG5ld0VsZW1lbnRbMF0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzLkRJU0FCTEVEKTtcclxuICAgICAgICB0aGlzLiRidXR0b24uYWRkQ2xhc3MoY2xhc3NOYW1lcy5ESVNBQkxFRCkuYXR0cigndGFiaW5kZXgnLCAtMSkuYXR0cignYXJpYS1kaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLiRidXR0b25bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZXMuRElTQUJMRUQpKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXdFbGVtZW50WzBdLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lcy5ESVNBQkxFRCk7XHJcbiAgICAgICAgICB0aGlzLiRidXR0b24ucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lcy5ESVNBQkxFRCkuYXR0cignYXJpYS1kaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRidXR0b24uYXR0cigndGFiaW5kZXgnKSA9PSAtMSAmJiAhdGhpcy4kZWxlbWVudC5kYXRhKCd0YWJpbmRleCcpKSB7XHJcbiAgICAgICAgICB0aGlzLiRidXR0b24ucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGF0LmlzRGlzYWJsZWQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRhYkluZGV4OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLiRlbGVtZW50LmRhdGEoJ3RhYmluZGV4JykgIT09IHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSAmJlxyXG4gICAgICAgICh0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgIT09IC05OCAmJiB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgIT09ICctOTgnKSkge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgndGFiaW5kZXgnLCB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykpO1xyXG4gICAgICAgIHRoaXMuJGJ1dHRvbi5hdHRyKCd0YWJpbmRleCcsIHRoaXMuJGVsZW1lbnQuZGF0YSgndGFiaW5kZXgnKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCAtOTgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja0xpc3RlbmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xyXG5cclxuICAgICAgJGRvY3VtZW50LmRhdGEoJ3NwYWNlU2VsZWN0JywgZmFsc2UpO1xyXG5cclxuICAgICAgdGhpcy4kYnV0dG9uLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKC8oMzIpLy50ZXN0KGUua2V5Q29kZS50b1N0cmluZygxMCkpICYmICRkb2N1bWVudC5kYXRhKCdzcGFjZVNlbGVjdCcpKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkZG9jdW1lbnQuZGF0YSgnc3BhY2VTZWxlY3QnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQub24oJ3Nob3cuYnMuZHJvcGRvd24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPiAzICYmICF0aGF0LmRyb3Bkb3duKSB7XHJcbiAgICAgICAgICB0aGF0LmRyb3Bkb3duID0gdGhhdC4kYnV0dG9uLmRhdGEoJ2JzLmRyb3Bkb3duJyk7XHJcbiAgICAgICAgICB0aGF0LmRyb3Bkb3duLl9tZW51ID0gdGhhdC4kbWVudVswXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kYnV0dG9uLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoYXQuJG5ld0VsZW1lbnQuaGFzQ2xhc3MoY2xhc3NOYW1lcy5TSE9XKSkge1xyXG4gICAgICAgICAgdGhhdC5zZXRTaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNldEZvY3VzICgpIHtcclxuICAgICAgICBpZiAodGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgIHRoYXQuJHNlYXJjaGJveC50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGF0LiRtZW51SW5uZXIudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrUG9wcGVyRXhpc3RzICgpIHtcclxuICAgICAgICBpZiAodGhhdC5kcm9wZG93biAmJiB0aGF0LmRyb3Bkb3duLl9wb3BwZXIgJiYgdGhhdC5kcm9wZG93bi5fcG9wcGVyLnN0YXRlLmlzQ3JlYXRlZCkge1xyXG4gICAgICAgICAgc2V0Rm9jdXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrUG9wcGVyRXhpc3RzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3Nob3duJyArIEVWRU5UX0tFWSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGF0LiRtZW51SW5uZXJbMF0uc2Nyb2xsVG9wICE9PSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgdGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCA9IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcuc2Nyb2xsVG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPiAzKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hlY2tQb3BwZXJFeGlzdHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRGb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBlbnN1cmUgcG9zaW5zZXQgYW5kIHNldHNpemUgYXJlIGNvcnJlY3QgYmVmb3JlIHNlbGVjdGluZyBhbiBvcHRpb24gdmlhIGEgY2xpY2tcclxuICAgICAgdGhpcy4kbWVudUlubmVyLm9uKCdtb3VzZWVudGVyJywgJ2xpIGEnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBob3ZlckxpID0gdGhpcy5wYXJlbnRFbGVtZW50LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjAgPSB0aGF0LmlzVmlydHVhbCgpID8gdGhhdC5zZWxlY3RwaWNrZXIudmlldy5wb3NpdGlvbjAgOiAwLFxyXG4gICAgICAgICAgICBpbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoaG92ZXJMaS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuLCBob3ZlckxpKSxcclxuICAgICAgICAgICAgaG92ZXJEYXRhID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhW2luZGV4ICsgcG9zaXRpb24wXTtcclxuXHJcbiAgICAgICAgdGhhdC5mb2N1c0l0ZW0oaG92ZXJMaSwgaG92ZXJEYXRhLCB0cnVlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRtZW51SW5uZXIub24oJ2NsaWNrJywgJ2xpIGEnLCBmdW5jdGlvbiAoZSwgcmV0YWluQWN0aXZlKSB7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoYXQuJGVsZW1lbnRbMF0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9uMCA9IHRoYXQuaXNWaXJ0dWFsKCkgPyB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCA6IDAsXHJcbiAgICAgICAgICAgIGNsaWNrZWREYXRhID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5kYXRhWyR0aGlzLnBhcmVudCgpLmluZGV4KCkgKyBwb3NpdGlvbjBdLFxyXG4gICAgICAgICAgICBjbGlja2VkSW5kZXggPSBjbGlja2VkRGF0YS5pbmRleCxcclxuICAgICAgICAgICAgcHJldlZhbHVlID0gZ2V0U2VsZWN0VmFsdWVzKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICBwcmV2SW5kZXggPSBlbGVtZW50LnNlbGVjdGVkSW5kZXgsXHJcbiAgICAgICAgICAgIHByZXZPcHRpb24gPSBlbGVtZW50Lm9wdGlvbnNbcHJldkluZGV4XSxcclxuICAgICAgICAgICAgdHJpZ2dlckNoYW5nZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIERvbid0IGNsb3NlIG9uIG11bHRpIGNob2ljZSBtZW51XHJcbiAgICAgICAgaWYgKHRoYXQubXVsdGlwbGUgJiYgdGhhdC5vcHRpb25zLm1heE9wdGlvbnMgIT09IDEpIHtcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8vIERvbid0IHJ1biBpZiB0aGUgc2VsZWN0IGlzIGRpc2FibGVkXHJcbiAgICAgICAgaWYgKCF0aGF0LmlzRGlzYWJsZWQoKSAmJiAhJHRoaXMucGFyZW50KCkuaGFzQ2xhc3MoY2xhc3NOYW1lcy5ESVNBQkxFRCkpIHtcclxuICAgICAgICAgIHZhciAkb3B0aW9ucyA9IHRoYXQuJGVsZW1lbnQuZmluZCgnb3B0aW9uJyksXHJcbiAgICAgICAgICAgICAgb3B0aW9uID0gY2xpY2tlZERhdGEub3B0aW9uLFxyXG4gICAgICAgICAgICAgICRvcHRpb24gPSAkKG9wdGlvbiksXHJcbiAgICAgICAgICAgICAgc3RhdGUgPSBvcHRpb24uc2VsZWN0ZWQsXHJcbiAgICAgICAgICAgICAgJG9wdGdyb3VwID0gJG9wdGlvbi5wYXJlbnQoJ29wdGdyb3VwJyksXHJcbiAgICAgICAgICAgICAgJG9wdGdyb3VwT3B0aW9ucyA9ICRvcHRncm91cC5maW5kKCdvcHRpb24nKSxcclxuICAgICAgICAgICAgICBtYXhPcHRpb25zID0gdGhhdC5vcHRpb25zLm1heE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgbWF4T3B0aW9uc0dycCA9ICRvcHRncm91cC5kYXRhKCdtYXhPcHRpb25zJykgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgICAgaWYgKGNsaWNrZWRJbmRleCA9PT0gdGhhdC5hY3RpdmVJbmRleCkgcmV0YWluQWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICBpZiAoIXJldGFpbkFjdGl2ZSkge1xyXG4gICAgICAgICAgICB0aGF0LnByZXZBY3RpdmVJbmRleCA9IHRoYXQuYWN0aXZlSW5kZXg7XHJcbiAgICAgICAgICAgIHRoYXQuYWN0aXZlSW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0Lm11bHRpcGxlKSB7IC8vIERlc2VsZWN0IGFsbCBvdGhlcnMgaWYgbm90IG11bHRpIHNlbGVjdCBib3hcclxuICAgICAgICAgICAgcHJldk9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKGNsaWNrZWRJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgeyAvLyBUb2dnbGUgdGhlIG9uZSB3ZSBoYXZlIGNob3NlbiBpZiB3ZSBhcmUgbXVsdGkgc2VsZWN0LlxyXG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSAhc3RhdGU7XHJcblxyXG4gICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKGNsaWNrZWRJbmRleCwgIXN0YXRlKTtcclxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignYmx1cicpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1heE9wdGlvbnMgIT09IGZhbHNlIHx8IG1heE9wdGlvbnNHcnAgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIG1heFJlYWNoZWQgPSBtYXhPcHRpb25zIDwgJG9wdGlvbnMuZmlsdGVyKCc6c2VsZWN0ZWQnKS5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgIG1heFJlYWNoZWRHcnAgPSBtYXhPcHRpb25zR3JwIDwgJG9wdGdyb3VwLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKChtYXhPcHRpb25zICYmIG1heFJlYWNoZWQpIHx8IChtYXhPcHRpb25zR3JwICYmIG1heFJlYWNoZWRHcnApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4T3B0aW9ucyAmJiBtYXhPcHRpb25zID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgJG9wdGlvbnMucHJvcCgnc2VsZWN0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKGksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChjbGlja2VkSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXhPcHRpb25zR3JwICYmIG1heE9wdGlvbnNHcnAgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAkb3B0Z3JvdXAuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykucHJvcCgnc2VsZWN0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJG9wdGdyb3VwT3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb24gPSAkb3B0Z3JvdXBPcHRpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0U2VsZWN0ZWQoJG9wdGlvbnMuaW5kZXgob3B0aW9uKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICB0aGF0LnNldFNlbGVjdGVkKGNsaWNrZWRJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbWF4T3B0aW9uc1RleHQgPSB0eXBlb2YgdGhhdC5vcHRpb25zLm1heE9wdGlvbnNUZXh0ID09PSAnc3RyaW5nJyA/IFt0aGF0Lm9wdGlvbnMubWF4T3B0aW9uc1RleHQsIHRoYXQub3B0aW9ucy5tYXhPcHRpb25zVGV4dF0gOiB0aGF0Lm9wdGlvbnMubWF4T3B0aW9uc1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXhPcHRpb25zQXJyID0gdHlwZW9mIG1heE9wdGlvbnNUZXh0ID09PSAnZnVuY3Rpb24nID8gbWF4T3B0aW9uc1RleHQobWF4T3B0aW9ucywgbWF4T3B0aW9uc0dycCkgOiBtYXhPcHRpb25zVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgIG1heFR4dCA9IG1heE9wdGlvbnNBcnJbMF0ucmVwbGFjZSgne259JywgbWF4T3B0aW9ucyksXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXhUeHRHcnAgPSBtYXhPcHRpb25zQXJyWzFdLnJlcGxhY2UoJ3tufScsIG1heE9wdGlvbnNHcnApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJG5vdGlmeSA9ICQoJzxkaXYgY2xhc3M9XCJub3RpZnlcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgLy8gSWYge3Zhcn0gaXMgc2V0IGluIGFycmF5LCByZXBsYWNlIGl0XHJcbiAgICAgICAgICAgICAgICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgICAgICAgICAgICAgICBpZiAobWF4T3B0aW9uc0FyclsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1heFR4dCA9IG1heFR4dC5yZXBsYWNlKCd7dmFyfScsIG1heE9wdGlvbnNBcnJbMl1bbWF4T3B0aW9ucyA+IDEgPyAwIDogMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heFR4dEdycCA9IG1heFR4dEdycC5yZXBsYWNlKCd7dmFyfScsIG1heE9wdGlvbnNBcnJbMl1bbWF4T3B0aW9uc0dycCA+IDEgPyAwIDogMV0pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAkb3B0aW9uLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC4kbWVudS5hcHBlbmQoJG5vdGlmeSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAobWF4T3B0aW9ucyAmJiBtYXhSZWFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG5vdGlmeS5hcHBlbmQoJCgnPGRpdj4nICsgbWF4VHh0ICsgJzwvZGl2PicpKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQ2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdtYXhSZWFjaGVkJyArIEVWRU5UX0tFWSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChtYXhPcHRpb25zR3JwICYmIG1heFJlYWNoZWRHcnApIHtcclxuICAgICAgICAgICAgICAgICAgICAkbm90aWZ5LmFwcGVuZCgkKCc8ZGl2PicgKyBtYXhUeHRHcnAgKyAnPC9kaXY+JykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJDaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ21heFJlYWNoZWRHcnAnICsgRVZFTlRfS0VZKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRTZWxlY3RlZChjbGlja2VkSW5kZXgsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgfSwgMTApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgJG5vdGlmeS5kZWxheSg3NTApLmZhZGVPdXQoMzAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0Lm11bHRpcGxlIHx8ICh0aGF0Lm11bHRpcGxlICYmIHRoYXQub3B0aW9ucy5tYXhPcHRpb25zID09PSAxKSkge1xyXG4gICAgICAgICAgICB0aGF0LiRidXR0b24udHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgICAgdGhhdC4kc2VhcmNoYm94LnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gVHJpZ2dlciBzZWxlY3QgJ2NoYW5nZSdcclxuICAgICAgICAgIGlmICh0cmlnZ2VyQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGF0Lm11bHRpcGxlIHx8IHByZXZJbmRleCAhPT0gZWxlbWVudC5zZWxlY3RlZEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgLy8gJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpIGlzIGN1cnJlbnQgb3B0aW9uIHN0YXRlIChzZWxlY3RlZC91bnNlbGVjdGVkKS4gcHJldlZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IHByaW9yIHRvIGJlaW5nIGNoYW5nZWQuXHJcbiAgICAgICAgICAgICAgY2hhbmdlZEFyZ3VtZW50cyA9IFtvcHRpb24uaW5kZXgsICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnKSwgcHJldlZhbHVlXTtcclxuICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAudHJpZ2dlck5hdGl2ZSgnY2hhbmdlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kbWVudS5vbignY2xpY2snLCAnbGkuJyArIGNsYXNzTmFtZXMuRElTQUJMRUQgKyAnIGEsIC4nICsgY2xhc3NOYW1lcy5QT1BPVkVSSEVBREVSICsgJywgLicgKyBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgKyAnIDpub3QoLmNsb3NlKScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUuY3VycmVudFRhcmdldCA9PSB0aGlzKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoICYmICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnY2xvc2UnKSkge1xyXG4gICAgICAgICAgICB0aGF0LiRzZWFyY2hib3gudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoYXQuJGJ1dHRvbi50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRtZW51SW5uZXIub24oJ2NsaWNrJywgJy5kaXZpZGVyLCAuZHJvcGRvd24taGVhZGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiAodGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgIHRoYXQuJHNlYXJjaGJveC50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGF0LiRidXR0b24udHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kbWVudS5vbignY2xpY2snLCAnLicgKyBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgKyAnIC5jbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGF0LiRidXR0b24udHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRzZWFyY2hib3gub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuJG1lbnUub24oJ2NsaWNrJywgJy5hY3Rpb25zLWJ0bicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgICB0aGF0LiRzZWFyY2hib3gudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhhdC4kYnV0dG9uLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2JzLXNlbGVjdC1hbGwnKSkge1xyXG4gICAgICAgICAgdGhhdC5zZWxlY3RBbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhhdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgLm9uKCdjaGFuZ2UnICsgRVZFTlRfS0VZLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LnJlbmRlcigpO1xyXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2VkJyArIEVWRU5UX0tFWSwgY2hhbmdlZEFyZ3VtZW50cyk7XHJcbiAgICAgICAgICBjaGFuZ2VkQXJndW1lbnRzID0gbnVsbDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignZm9jdXMnICsgRVZFTlRfS0VZLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoIXRoYXQub3B0aW9ucy5tb2JpbGUpIHRoYXQuJGJ1dHRvbi50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBsaXZlU2VhcmNoTGlzdGVuZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgbm9SZXN1bHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCEhdGhhdC4kc2VhcmNoYm94LnZhbCgpKSB7XHJcbiAgICAgICAgICB0aGF0LiRzZWFyY2hib3gudmFsKCcnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy4kc2VhcmNoYm94Lm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaSBmb2N1cy5icy5kcm9wZG93bi5kYXRhLWFwaSB0b3VjaGVuZC5icy5kcm9wZG93bi5kYXRhLWFwaScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLiRzZWFyY2hib3gub24oJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWFyY2hWYWx1ZSA9IHRoYXQuJHNlYXJjaGJveC52YWwoKTtcclxuXHJcbiAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLmRhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlKSB7XHJcbiAgICAgICAgICB2YXIgaSxcclxuICAgICAgICAgICAgICBzZWFyY2hNYXRjaCA9IFtdLFxyXG4gICAgICAgICAgICAgIHEgPSBzZWFyY2hWYWx1ZS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgIGNhY2hlID0ge30sXHJcbiAgICAgICAgICAgICAgY2FjaGVBcnIgPSBbXSxcclxuICAgICAgICAgICAgICBzZWFyY2hTdHlsZSA9IHRoYXQuX3NlYXJjaFN0eWxlKCksXHJcbiAgICAgICAgICAgICAgbm9ybWFsaXplU2VhcmNoID0gdGhhdC5vcHRpb25zLmxpdmVTZWFyY2hOb3JtYWxpemU7XHJcblxyXG4gICAgICAgICAgaWYgKG5vcm1hbGl6ZVNlYXJjaCkgcSA9IG5vcm1hbGl6ZVRvQmFzZShxKTtcclxuXHJcbiAgICAgICAgICB0aGF0Ll8kbGlzU2VsZWN0ZWQgPSB0aGF0LiRtZW51SW5uZXIuZmluZCgnLnNlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGxpID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5kYXRhW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWNoZVtpXSkge1xyXG4gICAgICAgICAgICAgIGNhY2hlW2ldID0gc3RyaW5nU2VhcmNoKGxpLCBxLCBzZWFyY2hTdHlsZSwgbm9ybWFsaXplU2VhcmNoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlW2ldICYmIGxpLmhlYWRlckluZGV4ICE9PSB1bmRlZmluZWQgJiYgY2FjaGVBcnIuaW5kZXhPZihsaS5oZWFkZXJJbmRleCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGxpLmhlYWRlckluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGVbbGkuaGVhZGVySW5kZXggLSAxXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYWNoZUFyci5wdXNoKGxpLmhlYWRlckluZGV4IC0gMSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjYWNoZVtsaS5oZWFkZXJJbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGNhY2hlQXJyLnB1c2gobGkuaGVhZGVySW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICBjYWNoZVtsaS5sYXN0SW5kZXggKyAxXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZVtpXSAmJiBsaS50eXBlICE9PSAnb3B0Z3JvdXAtbGFiZWwnKSBjYWNoZUFyci5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYWNoZUxlbiA9IGNhY2hlQXJyLmxlbmd0aDsgaSA8IGNhY2hlTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FjaGVBcnJbaV0sXHJcbiAgICAgICAgICAgICAgICBwcmV2SW5kZXggPSBjYWNoZUFycltpIC0gMV0sXHJcbiAgICAgICAgICAgICAgICBsaSA9IHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZGF0YVtpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBsaVByZXYgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmRhdGFbcHJldkluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsaS50eXBlICE9PSAnZGl2aWRlcicgfHwgKGxpLnR5cGUgPT09ICdkaXZpZGVyJyAmJiBsaVByZXYgJiYgbGlQcmV2LnR5cGUgIT09ICdkaXZpZGVyJyAmJiBjYWNoZUxlbiAtIDEgIT09IGkpKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLmRhdGEucHVzaChsaSk7XHJcbiAgICAgICAgICAgICAgc2VhcmNoTWF0Y2gucHVzaCh0aGF0LnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGF0LmFjdGl2ZUluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgdGhhdC5ub1Njcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICB0aGF0LiRtZW51SW5uZXIuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIuc2VhcmNoLmVsZW1lbnRzID0gc2VhcmNoTWF0Y2g7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVZpZXcodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgaWYgKCFzZWFyY2hNYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbm9SZXN1bHRzLmNsYXNzTmFtZSA9ICduby1yZXN1bHRzJztcclxuICAgICAgICAgICAgbm9SZXN1bHRzLmlubmVySFRNTCA9IHRoYXQub3B0aW9ucy5ub25lUmVzdWx0c1RleHQucmVwbGFjZSgnezB9JywgJ1wiJyArIGh0bWxFc2NhcGUoc2VhcmNoVmFsdWUpICsgJ1wiJyk7XHJcbiAgICAgICAgICAgIHRoYXQuJG1lbnVJbm5lclswXS5maXJzdENoaWxkLmFwcGVuZENoaWxkKG5vUmVzdWx0cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVZpZXcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9zZWFyY2hTdHlsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxpdmVTZWFyY2hTdHlsZSB8fCAnY29udGFpbnMnO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICB2YXIgZWxlbWVudCA9IHRoaXMuJGVsZW1lbnRbMF07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHZhciBwcmV2VmFsdWUgPSBnZXRTZWxlY3RWYWx1ZXMoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGNoYW5nZWRBcmd1bWVudHMgPSBbbnVsbCwgbnVsbCwgcHJldlZhbHVlXTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgICAgLnZhbCh2YWx1ZSlcclxuICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2VkJyArIEVWRU5UX0tFWSwgY2hhbmdlZEFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXdFbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZXMuU0hPVykpIHtcclxuICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uU3RhdHVzKHRydWUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxpU2VsZWN0ZWRJbmRleCA9IChlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSB8fCB7fSkubGlJbmRleDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbGlTZWxlY3RlZEluZGV4ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQodGhpcy5zZWxlY3RlZEluZGV4LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZChsaVNlbGVjdGVkSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgICBjaGFuZ2VkQXJndW1lbnRzID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQudmFsKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2hhbmdlQWxsOiBmdW5jdGlvbiAoc3RhdHVzKSB7XHJcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkgcmV0dXJuO1xyXG4gICAgICBpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ3VuZGVmaW5lZCcpIHN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICB2YXIgZWxlbWVudCA9IHRoaXMuJGVsZW1lbnRbMF0sXHJcbiAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkID0gMCxcclxuICAgICAgICAgIGN1cnJlbnRTZWxlY3RlZCA9IDAsXHJcbiAgICAgICAgICBwcmV2VmFsdWUgPSBnZXRTZWxlY3RWYWx1ZXMoZWxlbWVudCk7XHJcblxyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2JzLXNlbGVjdC1oaWRkZW4nKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnNlbGVjdHBpY2tlci5jdXJyZW50LmVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGxpRGF0YSA9IHRoaXMuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpXSxcclxuICAgICAgICAgICAgb3B0aW9uID0gbGlEYXRhLm9wdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbiAmJiAhbGlEYXRhLmRpc2FibGVkICYmIGxpRGF0YS50eXBlICE9PSAnZGl2aWRlcicpIHtcclxuICAgICAgICAgIGlmIChsaURhdGEuc2VsZWN0ZWQpIHByZXZpb3VzU2VsZWN0ZWQrKztcclxuICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHN0YXR1cztcclxuICAgICAgICAgIGlmIChzdGF0dXMpIGN1cnJlbnRTZWxlY3RlZCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdicy1zZWxlY3QtaGlkZGVuJyk7XHJcblxyXG4gICAgICBpZiAocHJldmlvdXNTZWxlY3RlZCA9PT0gY3VycmVudFNlbGVjdGVkKSByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLnNldE9wdGlvblN0YXR1cygpO1xyXG5cclxuICAgICAgY2hhbmdlZEFyZ3VtZW50cyA9IFtudWxsLCBudWxsLCBwcmV2VmFsdWVdO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgIC50cmlnZ2VyTmF0aXZlKCdjaGFuZ2UnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VsZWN0QWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUFsbCh0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgZGVzZWxlY3RBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlQWxsKGZhbHNlKTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XHJcblxyXG4gICAgICBpZiAoZSkgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuJGJ1dHRvbi50cmlnZ2VyKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgaXNUb2dnbGUgPSAkdGhpcy5oYXNDbGFzcygnZHJvcGRvd24tdG9nZ2xlJyksXHJcbiAgICAgICAgICAkcGFyZW50ID0gaXNUb2dnbGUgPyAkdGhpcy5jbG9zZXN0KCcuZHJvcGRvd24nKSA6ICR0aGlzLmNsb3Nlc3QoU2VsZWN0b3IuTUVOVSksXHJcbiAgICAgICAgICB0aGF0ID0gJHBhcmVudC5kYXRhKCd0aGlzJyksXHJcbiAgICAgICAgICAkaXRlbXMgPSB0aGF0LmZpbmRMaXMoKSxcclxuICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgaXNBY3RpdmUsXHJcbiAgICAgICAgICBsaUFjdGl2ZSxcclxuICAgICAgICAgIGFjdGl2ZUxpLFxyXG4gICAgICAgICAgb2Zmc2V0LFxyXG4gICAgICAgICAgdXBkYXRlU2Nyb2xsID0gZmFsc2UsXHJcbiAgICAgICAgICBkb3duT25UYWIgPSBlLndoaWNoID09PSBrZXlDb2Rlcy5UQUIgJiYgIWlzVG9nZ2xlICYmICF0aGF0Lm9wdGlvbnMuc2VsZWN0T25UYWIsXHJcbiAgICAgICAgICBpc0Fycm93S2V5ID0gUkVHRVhQX0FSUk9XLnRlc3QoZS53aGljaCkgfHwgZG93bk9uVGFiLFxyXG4gICAgICAgICAgc2Nyb2xsVG9wID0gdGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCxcclxuICAgICAgICAgIGlzVmlydHVhbCA9IHRoYXQuaXNWaXJ0dWFsKCksXHJcbiAgICAgICAgICBwb3NpdGlvbjAgPSBpc1ZpcnR1YWwgPT09IHRydWUgPyB0aGF0LnNlbGVjdHBpY2tlci52aWV3LnBvc2l0aW9uMCA6IDA7XHJcblxyXG4gICAgICBpc0FjdGl2ZSA9IHRoYXQuJG5ld0VsZW1lbnQuaGFzQ2xhc3MoY2xhc3NOYW1lcy5TSE9XKTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICAhaXNBY3RpdmUgJiZcclxuICAgICAgICAoXHJcbiAgICAgICAgICBpc0Fycm93S2V5IHx8XHJcbiAgICAgICAgICAoZS53aGljaCA+PSA0OCAmJiBlLndoaWNoIDw9IDU3KSB8fFxyXG4gICAgICAgICAgKGUud2hpY2ggPj0gOTYgJiYgZS53aGljaCA8PSAxMDUpIHx8XHJcbiAgICAgICAgICAoZS53aGljaCA+PSA2NSAmJiBlLndoaWNoIDw9IDkwKVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhhdC4kYnV0dG9uLnRyaWdnZXIoJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJyk7XHJcblxyXG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMubGl2ZVNlYXJjaCkge1xyXG4gICAgICAgICAgdGhhdC4kc2VhcmNoYm94LnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuRVNDQVBFICYmIGlzQWN0aXZlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoYXQuJGJ1dHRvbi50cmlnZ2VyKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScpLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc0Fycm93S2V5KSB7IC8vIGlmIHVwIG9yIGRvd25cclxuICAgICAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGlBY3RpdmUgPSB0aGF0LnNlbGVjdHBpY2tlci5tYWluLmVsZW1lbnRzW3RoYXQuYWN0aXZlSW5kZXhdO1xyXG4gICAgICAgIGluZGV4ID0gbGlBY3RpdmUgPyBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGxpQWN0aXZlLnBhcmVudEVsZW1lbnQuY2hpbGRyZW4sIGxpQWN0aXZlKSA6IC0xO1xyXG5cclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICB0aGF0LmRlZm9jdXNJdGVtKGxpQWN0aXZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLndoaWNoID09PSBrZXlDb2Rlcy5BUlJPV19VUCkgeyAvLyB1cFxyXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgaW5kZXgtLTtcclxuICAgICAgICAgIGlmIChpbmRleCArIHBvc2l0aW9uMCA8IDApIGluZGV4ICs9ICRpdGVtcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGF0LnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodFtpbmRleCArIHBvc2l0aW9uMF0pIHtcclxuICAgICAgICAgICAgaW5kZXggPSB0aGF0LnNlbGVjdHBpY2tlci52aWV3LmNhbkhpZ2hsaWdodC5zbGljZSgwLCBpbmRleCArIHBvc2l0aW9uMCkubGFzdEluZGV4T2YodHJ1ZSkgLSBwb3NpdGlvbjA7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIGluZGV4ID0gJGl0ZW1zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09PSBrZXlDb2Rlcy5BUlJPV19ET1dOIHx8IGRvd25PblRhYikgeyAvLyBkb3duXHJcbiAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgaWYgKGluZGV4ICsgcG9zaXRpb24wID49IHRoYXQuc2VsZWN0cGlja2VyLnZpZXcuY2FuSGlnaGxpZ2h0Lmxlbmd0aCkgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgIGlmICghdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHRbaW5kZXggKyBwb3NpdGlvbjBdKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gaW5kZXggKyAxICsgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHQuc2xpY2UoaW5kZXggKyBwb3NpdGlvbjAgKyAxKS5pbmRleE9mKHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgbGlBY3RpdmVJbmRleCA9IHBvc2l0aW9uMCArIGluZGV4O1xyXG5cclxuICAgICAgICBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuQVJST1dfVVApIHsgLy8gdXBcclxuICAgICAgICAgIC8vIHNjcm9sbCB0byBib3R0b20gYW5kIGhpZ2hsaWdodCBsYXN0IG9wdGlvblxyXG4gICAgICAgICAgaWYgKHBvc2l0aW9uMCA9PT0gMCAmJiBpbmRleCA9PT0gJGl0ZW1zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgdGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCA9IHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsaUFjdGl2ZUluZGV4ID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWN0aXZlTGkgPSB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGFbbGlBY3RpdmVJbmRleF07XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGFjdGl2ZUxpLnBvc2l0aW9uIC0gYWN0aXZlTGkuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgdXBkYXRlU2Nyb2xsID0gb2Zmc2V0IDwgc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0ga2V5Q29kZXMuQVJST1dfRE9XTiB8fCBkb3duT25UYWIpIHsgLy8gZG93blxyXG4gICAgICAgICAgLy8gc2Nyb2xsIHRvIHRvcCBhbmQgaGlnaGxpZ2h0IGZpcnN0IG9wdGlvblxyXG4gICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoYXQuJG1lbnVJbm5lclswXS5zY3JvbGxUb3AgPSAwO1xyXG5cclxuICAgICAgICAgICAgbGlBY3RpdmVJbmRleCA9IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhY3RpdmVMaSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtsaUFjdGl2ZUluZGV4XTtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gYWN0aXZlTGkucG9zaXRpb24gLSB0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVNjcm9sbCA9IG9mZnNldCA+IHNjcm9sbFRvcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpQWN0aXZlID0gdGhhdC5zZWxlY3RwaWNrZXIuY3VycmVudC5lbGVtZW50c1tsaUFjdGl2ZUluZGV4XTtcclxuXHJcbiAgICAgICAgdGhhdC5hY3RpdmVJbmRleCA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtsaUFjdGl2ZUluZGV4XS5pbmRleDtcclxuXHJcbiAgICAgICAgdGhhdC5mb2N1c0l0ZW0obGlBY3RpdmUpO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci52aWV3LmN1cnJlbnRBY3RpdmUgPSBsaUFjdGl2ZTtcclxuXHJcbiAgICAgICAgaWYgKHVwZGF0ZVNjcm9sbCkgdGhhdC4kbWVudUlubmVyWzBdLnNjcm9sbFRvcCA9IG9mZnNldDtcclxuXHJcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5saXZlU2VhcmNoKSB7XHJcbiAgICAgICAgICB0aGF0LiRzZWFyY2hib3gudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHRoaXMudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgKCEkdGhpcy5pcygnaW5wdXQnKSAmJiAhUkVHRVhQX1RBQl9PUl9FU0NBUEUudGVzdChlLndoaWNoKSkgfHxcclxuICAgICAgICAoZS53aGljaCA9PT0ga2V5Q29kZXMuU1BBQ0UgJiYgdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5rZXlIaXN0b3J5KVxyXG4gICAgICApIHtcclxuICAgICAgICB2YXIgc2VhcmNoTWF0Y2gsXHJcbiAgICAgICAgICAgIG1hdGNoZXMgPSBbXSxcclxuICAgICAgICAgICAga2V5SGlzdG9yeTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGF0LnNlbGVjdHBpY2tlci5rZXlkb3duLmtleUhpc3RvcnkgKz0ga2V5Q29kZU1hcFtlLndoaWNoXTtcclxuXHJcbiAgICAgICAgaWYgKHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ucmVzZXRLZXlIaXN0b3J5LmNhbmNlbCkgY2xlYXJUaW1lb3V0KHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ucmVzZXRLZXlIaXN0b3J5LmNhbmNlbCk7XHJcbiAgICAgICAgdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5yZXNldEtleUhpc3RvcnkuY2FuY2VsID0gdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5yZXNldEtleUhpc3Rvcnkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAga2V5SGlzdG9yeSA9IHRoYXQuc2VsZWN0cGlja2VyLmtleWRvd24ua2V5SGlzdG9yeTtcclxuXHJcbiAgICAgICAgLy8gaWYgYWxsIGxldHRlcnMgYXJlIHRoZSBzYW1lLCBzZXQga2V5SGlzdG9yeSB0byBqdXN0IHRoZSBmaXJzdCBjaGFyYWN0ZXIgd2hlbiBzZWFyY2hpbmdcclxuICAgICAgICBpZiAoL14oLilcXDErJC8udGVzdChrZXlIaXN0b3J5KSkge1xyXG4gICAgICAgICAga2V5SGlzdG9yeSA9IGtleUhpc3RvcnkuY2hhckF0KDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluZCBtYXRjaGVzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0LnNlbGVjdHBpY2tlci5jdXJyZW50LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBsaSA9IHRoYXQuc2VsZWN0cGlja2VyLmN1cnJlbnQuZGF0YVtpXSxcclxuICAgICAgICAgICAgICBoYXNNYXRjaDtcclxuXHJcbiAgICAgICAgICBoYXNNYXRjaCA9IHN0cmluZ1NlYXJjaChsaSwga2V5SGlzdG9yeSwgJ3N0YXJ0c1dpdGgnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICBpZiAoaGFzTWF0Y2ggJiYgdGhhdC5zZWxlY3RwaWNrZXIudmlldy5jYW5IaWdobGlnaHRbaV0pIHtcclxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGxpLmluZGV4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdmFyIG1hdGNoSW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgICRpdGVtcy5yZW1vdmVDbGFzcygnYWN0aXZlJykuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAvLyBlaXRoZXIgb25seSBvbmUga2V5IGhhcyBiZWVuIHByZXNzZWQgb3IgdGhleSBhcmUgYWxsIHRoZSBzYW1lIGtleVxyXG4gICAgICAgICAgaWYgKGtleUhpc3RvcnkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIG1hdGNoSW5kZXggPSBtYXRjaGVzLmluZGV4T2YodGhhdC5hY3RpdmVJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWF0Y2hJbmRleCA9PT0gLTEgfHwgbWF0Y2hJbmRleCA9PT0gbWF0Y2hlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgbWF0Y2hJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbWF0Y2hJbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2VhcmNoTWF0Y2ggPSBtYXRjaGVzW21hdGNoSW5kZXhdO1xyXG5cclxuICAgICAgICAgIGFjdGl2ZUxpID0gdGhhdC5zZWxlY3RwaWNrZXIubWFpbi5kYXRhW3NlYXJjaE1hdGNoXTtcclxuXHJcbiAgICAgICAgICBpZiAoc2Nyb2xsVG9wIC0gYWN0aXZlTGkucG9zaXRpb24gPiAwKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IGFjdGl2ZUxpLnBvc2l0aW9uIC0gYWN0aXZlTGkuaGVpZ2h0O1xyXG4gICAgICAgICAgICB1cGRhdGVTY3JvbGwgPSB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gYWN0aXZlTGkucG9zaXRpb24gLSB0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodDtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIG9wdGlvbiBpcyBhbHJlYWR5IHZpc2libGUgYXQgdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLCBqdXN0IGtlZXAgaXQgdGhlIHNhbWVcclxuICAgICAgICAgICAgdXBkYXRlU2Nyb2xsID0gYWN0aXZlTGkucG9zaXRpb24gPiBzY3JvbGxUb3AgKyB0aGF0LnNpemVJbmZvLm1lbnVJbm5lckhlaWdodDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsaUFjdGl2ZSA9IHRoYXQuc2VsZWN0cGlja2VyLm1haW4uZWxlbWVudHNbc2VhcmNoTWF0Y2hdO1xyXG5cclxuICAgICAgICAgIHRoYXQuYWN0aXZlSW5kZXggPSBtYXRjaGVzW21hdGNoSW5kZXhdO1xyXG5cclxuICAgICAgICAgIHRoYXQuZm9jdXNJdGVtKGxpQWN0aXZlKTtcclxuXHJcbiAgICAgICAgICBpZiAobGlBY3RpdmUpIGxpQWN0aXZlLmZpcnN0Q2hpbGQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICBpZiAodXBkYXRlU2Nyb2xsKSB0aGF0LiRtZW51SW5uZXJbMF0uc2Nyb2xsVG9wID0gb2Zmc2V0O1xyXG5cclxuICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTZWxlY3QgZm9jdXNlZCBvcHRpb24gaWYgXCJFbnRlclwiLCBcIlNwYWNlYmFyXCIgb3IgXCJUYWJcIiAod2hlbiBzZWxlY3RPblRhYiBpcyB0cnVlKSBhcmUgcHJlc3NlZCBpbnNpZGUgdGhlIG1lbnUuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBpc0FjdGl2ZSAmJlxyXG4gICAgICAgIChcclxuICAgICAgICAgIChlLndoaWNoID09PSBrZXlDb2Rlcy5TUEFDRSAmJiAhdGhhdC5zZWxlY3RwaWNrZXIua2V5ZG93bi5rZXlIaXN0b3J5KSB8fFxyXG4gICAgICAgICAgZS53aGljaCA9PT0ga2V5Q29kZXMuRU5URVIgfHxcclxuICAgICAgICAgIChlLndoaWNoID09PSBrZXlDb2Rlcy5UQUIgJiYgdGhhdC5vcHRpb25zLnNlbGVjdE9uVGFiKVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgaWYgKGUud2hpY2ggIT09IGtleUNvZGVzLlNQQUNFKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGlmICghdGhhdC5vcHRpb25zLmxpdmVTZWFyY2ggfHwgZS53aGljaCAhPT0ga2V5Q29kZXMuU1BBQ0UpIHtcclxuICAgICAgICAgIHRoYXQuJG1lbnVJbm5lci5maW5kKCcuYWN0aXZlIGEnKS50cmlnZ2VyKCdjbGljaycsIHRydWUpOyAvLyByZXRhaW4gYWN0aXZlIGNsYXNzXHJcbiAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdmb2N1cycpO1xyXG5cclxuICAgICAgICAgIGlmICghdGhhdC5vcHRpb25zLmxpdmVTZWFyY2gpIHtcclxuICAgICAgICAgICAgLy8gUHJldmVudCBzY3JlZW4gZnJvbSBzY3JvbGxpbmcgaWYgdGhlIHVzZXIgaGl0cyB0aGUgc3BhY2ViYXJcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAvLyBGaXhlcyBzcGFjZWJhciBzZWxlY3Rpb24gb2YgZHJvcGRvd24gaXRlbXMgaW4gRkYgJiBJRVxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5kYXRhKCdzcGFjZVNlbGVjdCcsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb2JpbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXS5jbGFzc0xpc3QuYWRkKCdtb2JpbGUtZGV2aWNlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gdXBkYXRlIG9wdGlvbnMgaWYgZGF0YSBhdHRyaWJ1dGVzIGhhdmUgYmVlbiBjaGFuZ2VkXHJcbiAgICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB0aGlzLiRlbGVtZW50LmRhdGEoKSk7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IGNvbmZpZztcclxuXHJcbiAgICAgIHRoaXMuY2hlY2tEaXNhYmxlZCgpO1xyXG4gICAgICB0aGlzLnNldFN0eWxlKCk7XHJcbiAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgIHRoaXMuY3JlYXRlTGkoKTtcclxuICAgICAgdGhpcy5zZXRXaWR0aCgpO1xyXG5cclxuICAgICAgdGhpcy5zZXRTaXplKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdyZWZyZXNoZWQnICsgRVZFTlRfS0VZKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLiRuZXdFbGVtZW50LmhpZGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLiRuZXdFbGVtZW50LnNob3coKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJG5ld0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy4kbmV3RWxlbWVudC5iZWZvcmUodGhpcy4kZWxlbWVudCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy4kYnNDb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLiRic0NvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRtZW51LnJlbW92ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgLm9mZihFVkVOVF9LRVkpXHJcbiAgICAgICAgLnJlbW92ZURhdGEoJ3NlbGVjdHBpY2tlcicpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdicy1zZWxlY3QtaGlkZGVuIHNlbGVjdHBpY2tlcicpO1xyXG5cclxuICAgICAgJCh3aW5kb3cpLm9mZihFVkVOVF9LRVkgKyAnLicgKyB0aGlzLnNlbGVjdElkKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBTRUxFQ1RQSUNLRVIgUExVR0lOIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICBmdW5jdGlvbiBQbHVnaW4gKG9wdGlvbikge1xyXG4gICAgLy8gZ2V0IHRoZSBhcmdzIG9mIHRoZSBvdXRlciBmdW5jdGlvbi4uXHJcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgIC8vIFRoZSBhcmd1bWVudHMgb2YgdGhlIGZ1bmN0aW9uIGFyZSBleHBsaWNpdGx5IHJlLWRlZmluZWQgZnJvbSB0aGUgYXJndW1lbnQgbGlzdCwgYmVjYXVzZSB0aGUgc2hpZnQgY2F1c2VzIHRoZW1cclxuICAgIC8vIHRvIGdldCBsb3N0L2NvcnJ1cHRlZCBpbiBhbmRyb2lkIDIuMyBhbmQgSUU5ICM3MTUgIzc3NVxyXG4gICAgdmFyIF9vcHRpb24gPSBvcHRpb247XHJcblxyXG4gICAgW10uc2hpZnQuYXBwbHkoYXJncyk7XHJcblxyXG4gICAgLy8gaWYgdGhlIHZlcnNpb24gd2FzIG5vdCBzZXQgc3VjY2Vzc2Z1bGx5XHJcbiAgICBpZiAoIXZlcnNpb24uc3VjY2Vzcykge1xyXG4gICAgICAvLyB0cnkgdG8gcmV0cmVpdmUgaXQgYWdhaW5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICB2ZXJzaW9uLmZ1bGwgPSAoJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3Rvci5WRVJTSU9OIHx8ICcnKS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJyk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIC8vIGZhbGwgYmFjayB0byB1c2UgQm9vdHN0cmFwVmVyc2lvbiBpZiBzZXRcclxuICAgICAgICBpZiAoU2VsZWN0cGlja2VyLkJvb3RzdHJhcFZlcnNpb24pIHtcclxuICAgICAgICAgIHZlcnNpb24uZnVsbCA9IFNlbGVjdHBpY2tlci5Cb290c3RyYXBWZXJzaW9uLnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmVyc2lvbi5mdWxsID0gW3ZlcnNpb24ubWFqb3IsICcwJywgJzAnXTtcclxuXHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICdUaGVyZSB3YXMgYW4gaXNzdWUgcmV0cmlldmluZyBCb290c3RyYXBcXCdzIHZlcnNpb24uICcgK1xyXG4gICAgICAgICAgICAnRW5zdXJlIEJvb3RzdHJhcCBpcyBiZWluZyBsb2FkZWQgYmVmb3JlIGJvb3RzdHJhcC1zZWxlY3QgYW5kIHRoZXJlIGlzIG5vIG5hbWVzcGFjZSBjb2xsaXNpb24uICcgK1xyXG4gICAgICAgICAgICAnSWYgbG9hZGluZyBCb290c3RyYXAgYXN5bmNocm9ub3VzbHksIHRoZSB2ZXJzaW9uIG1heSBuZWVkIHRvIGJlIG1hbnVhbGx5IHNwZWNpZmllZCB2aWEgJC5mbi5zZWxlY3RwaWNrZXIuQ29uc3RydWN0b3IuQm9vdHN0cmFwVmVyc2lvbi4nLFxyXG4gICAgICAgICAgICBlcnJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2ZXJzaW9uLm1ham9yID0gdmVyc2lvbi5mdWxsWzBdO1xyXG4gICAgICB2ZXJzaW9uLnN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2ZXJzaW9uLm1ham9yID09PSAnNCcpIHtcclxuICAgICAgLy8gc29tZSBkZWZhdWx0cyBuZWVkIHRvIGJlIGNoYW5nZWQgaWYgdXNpbmcgQm9vdHN0cmFwIDRcclxuICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoZXkgaGF2ZSBhbHJlYWR5IGJlZW4gbWFudWFsbHkgY2hhbmdlZCBiZWZvcmUgZm9yY2luZyB0aGVtIHRvIHVwZGF0ZVxyXG4gICAgICB2YXIgdG9VcGRhdGUgPSBbXTtcclxuXHJcbiAgICAgIGlmIChTZWxlY3RwaWNrZXIuREVGQVVMVFMuc3R5bGUgPT09IGNsYXNzTmFtZXMuQlVUVE9OQ0xBU1MpIHRvVXBkYXRlLnB1c2goeyBuYW1lOiAnc3R5bGUnLCBjbGFzc05hbWU6ICdCVVRUT05DTEFTUycgfSk7XHJcbiAgICAgIGlmIChTZWxlY3RwaWNrZXIuREVGQVVMVFMuaWNvbkJhc2UgPT09IGNsYXNzTmFtZXMuSUNPTkJBU0UpIHRvVXBkYXRlLnB1c2goeyBuYW1lOiAnaWNvbkJhc2UnLCBjbGFzc05hbWU6ICdJQ09OQkFTRScgfSk7XHJcbiAgICAgIGlmIChTZWxlY3RwaWNrZXIuREVGQVVMVFMudGlja0ljb24gPT09IGNsYXNzTmFtZXMuVElDS0lDT04pIHRvVXBkYXRlLnB1c2goeyBuYW1lOiAndGlja0ljb24nLCBjbGFzc05hbWU6ICdUSUNLSUNPTicgfSk7XHJcblxyXG4gICAgICBjbGFzc05hbWVzLkRJVklERVIgPSAnZHJvcGRvd24tZGl2aWRlcic7XHJcbiAgICAgIGNsYXNzTmFtZXMuU0hPVyA9ICdzaG93JztcclxuICAgICAgY2xhc3NOYW1lcy5CVVRUT05DTEFTUyA9ICdidG4tbGlnaHQnO1xyXG4gICAgICBjbGFzc05hbWVzLlBPUE9WRVJIRUFERVIgPSAncG9wb3Zlci1oZWFkZXInO1xyXG4gICAgICBjbGFzc05hbWVzLklDT05CQVNFID0gJyc7XHJcbiAgICAgIGNsYXNzTmFtZXMuVElDS0lDT04gPSAnYnMtb2stZGVmYXVsdCc7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvVXBkYXRlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRvVXBkYXRlW2ldO1xyXG4gICAgICAgIFNlbGVjdHBpY2tlci5ERUZBVUxUU1tvcHRpb24ubmFtZV0gPSBjbGFzc05hbWVzW29wdGlvbi5jbGFzc05hbWVdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHZhbHVlO1xyXG4gICAgdmFyIGNoYWluID0gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgaWYgKCR0aGlzLmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnc2VsZWN0cGlja2VyJyksXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0eXBlb2YgX29wdGlvbiA9PSAnb2JqZWN0JyAmJiBfb3B0aW9uO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIHZhciBkYXRhQXR0cmlidXRlcyA9ICR0aGlzLmRhdGEoKTtcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YUF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoZGF0YUF0dHIpICYmICQuaW5BcnJheShkYXRhQXR0ciwgRElTQUxMT1dFRF9BVFRSSUJVVEVTKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBTZWxlY3RwaWNrZXIuREVGQVVMVFMsICQuZm4uc2VsZWN0cGlja2VyLmRlZmF1bHRzIHx8IHt9LCBkYXRhQXR0cmlidXRlcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICBjb25maWcudGVtcGxhdGUgPSAkLmV4dGVuZCh7fSwgU2VsZWN0cGlja2VyLkRFRkFVTFRTLnRlbXBsYXRlLCAoJC5mbi5zZWxlY3RwaWNrZXIuZGVmYXVsdHMgPyAkLmZuLnNlbGVjdHBpY2tlci5kZWZhdWx0cy50ZW1wbGF0ZSA6IHt9KSwgZGF0YUF0dHJpYnV0ZXMudGVtcGxhdGUsIG9wdGlvbnMudGVtcGxhdGUpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YSgnc2VsZWN0cGlja2VyJywgKGRhdGEgPSBuZXcgU2VsZWN0cGlja2VyKHRoaXMsIGNvbmZpZykpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgIGRhdGEub3B0aW9uc1tpXSA9IG9wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgX29wdGlvbiA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKGRhdGFbX29wdGlvbl0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGFbX29wdGlvbl0uYXBwbHkoZGF0YSwgYXJncyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGEub3B0aW9uc1tfb3B0aW9uXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEFzc2lnbm1lbnRcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGNoYWluO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIG9sZCA9ICQuZm4uc2VsZWN0cGlja2VyO1xyXG4gICQuZm4uc2VsZWN0cGlja2VyID0gUGx1Z2luO1xyXG4gICQuZm4uc2VsZWN0cGlja2VyLkNvbnN0cnVjdG9yID0gU2VsZWN0cGlja2VyO1xyXG5cclxuICAvLyBTRUxFQ1RQSUNLRVIgTk8gQ09ORkxJQ1RcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAkLmZuLnNlbGVjdHBpY2tlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5zZWxlY3RwaWNrZXIgPSBvbGQ7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9mZigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScpXHJcbiAgICAub24oJ2tleWRvd24nICsgRVZFTlRfS0VZLCAnLmJvb3RzdHJhcC1zZWxlY3QgW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0sIC5ib290c3RyYXAtc2VsZWN0IFtyb2xlPVwibGlzdGJveFwiXSwgLmJvb3RzdHJhcC1zZWxlY3QgLmJzLXNlYXJjaGJveCBpbnB1dCcsIFNlbGVjdHBpY2tlci5wcm90b3R5cGUua2V5ZG93bilcclxuICAgIC5vbignZm9jdXNpbi5tb2RhbCcsICcuYm9vdHN0cmFwLXNlbGVjdCBbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSwgLmJvb3RzdHJhcC1zZWxlY3QgW3JvbGU9XCJsaXN0Ym94XCJdLCAuYm9vdHN0cmFwLXNlbGVjdCAuYnMtc2VhcmNoYm94IGlucHV0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0pO1xyXG5cclxuICAvLyBTRUxFQ1RQSUNLRVIgREFUQS1BUElcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cclxuICAkKHdpbmRvdykub24oJ2xvYWQnICsgRVZFTlRfS0VZICsgJy5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5zZWxlY3RwaWNrZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICRzZWxlY3RwaWNrZXIgPSAkKHRoaXMpO1xyXG4gICAgICBQbHVnaW4uY2FsbCgkc2VsZWN0cGlja2VyLCAkc2VsZWN0cGlja2VyLmRhdGEoKSk7XHJcbiAgICB9KVxyXG4gIH0pO1xyXG59KShqUXVlcnkpO1xyXG5cclxuXHJcbn0pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Ym9vdHN0cmFwLXNlbGVjdC5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9