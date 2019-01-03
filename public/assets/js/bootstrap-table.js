webpackJsonp([10],{

/***/ "./node_modules/bootstrap-table/dist/bootstrap-table.js":
/*!**************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/bootstrap-table.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.bootstrapTable = mod.exports;
  }
})(this, function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   * @author zhixin wen <wenzhixin2010@gmail.com>
   * version: 1.13.1
   * https://github.com/wenzhixin/bootstrap-table/
   */

  (function ($) {
    // TOOLS DEFINITION
    // ======================

    var bootstrapVersion = 3;
    try {
      var rawVersion = $.fn.dropdown.Constructor.VERSION;

      // Only try to parse VERSION if is is defined.
      // It is undefined in older versions of Bootstrap (tested with 3.1.1).
      if (rawVersion !== undefined) {
        bootstrapVersion = parseInt(rawVersion, 10);
      }
    } catch (e) {
      // ignore
    }

    var bootstrap = {
      3: {
        iconsPrefix: 'glyphicon',
        icons: {
          paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
          paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
          refresh: 'glyphicon-refresh icon-refresh',
          toggleOff: 'glyphicon-list-alt icon-list-alt',
          toggleOn: 'glyphicon-list-alt icon-list-alt',
          columns: 'glyphicon-th icon-th',
          detailOpen: 'glyphicon-plus icon-plus',
          detailClose: 'glyphicon-minus icon-minus',
          fullscreen: 'glyphicon-fullscreen'
        },
        classes: {
          buttons: 'default',
          pull: 'pull'
        },
        html: {
          toobarDropdow: ['<ul class="dropdown-menu" role="menu">', '</ul>'],
          toobarDropdowItem: '<li role="menuitem"><label>%s</label></li>',
          pageDropdown: ['<ul class="dropdown-menu" role="menu">', '</ul>'],
          pageDropdownItem: '<li role="menuitem" class="%s"><a href="#">%s</a></li>'
        }
      },
      4: {
        iconsPrefix: 'fa',
        icons: {
          paginationSwitchDown: 'fa-caret-square-down',
          paginationSwitchUp: 'fa-caret-square-up',
          refresh: 'fa-sync',
          toggleOff: 'fa-toggle-off',
          toggleOn: 'fa-toggle-on',
          columns: 'fa-th-list',
          detailOpen: 'fa-plus',
          detailClose: 'fa-minus',
          fullscreen: 'fa-arrows-alt'
        },
        classes: {
          buttons: 'secondary',
          pull: 'float'
        },
        html: {
          toobarDropdow: ['<div class="dropdown-menu dropdown-menu-right">', '</div>'],
          toobarDropdowItem: '<label class="dropdown-item">%s</label>',
          pageDropdown: ['<div class="dropdown-menu">', '</div>'],
          pageDropdownItem: '<a class="dropdown-item %s" href="#">%s</a>'
        }
      }
    }[bootstrapVersion];

    var Utils = {
      bootstrapVersion: bootstrapVersion,

      sprintf: function sprintf(_str) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var flag = true;
        var i = 0;

        var str = _str.replace(/%s/g, function () {
          var arg = args[i++];

          if (typeof arg === 'undefined') {
            flag = false;
            return '';
          }
          return arg;
        });
        return flag ? str : '';
      },
      getFieldTitle: function getFieldTitle(list, value) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (item.field === value) {
              return item.title;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return '';
      },
      setFieldIndex: function setFieldIndex(columns) {
        var totalCol = 0;
        var flag = [];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = columns[0][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var column = _step2.value;

            totalCol += column.colspan || 1;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        for (var i = 0; i < columns.length; i++) {
          flag[i] = [];
          for (var j = 0; j < totalCol; j++) {
            flag[i][j] = false;
          }
        }

        for (var _i = 0; _i < columns.length; _i++) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = columns[_i][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var r = _step3.value;

              var rowspan = r.rowspan || 1;
              var colspan = r.colspan || 1;
              var index = flag[_i].indexOf(false);

              if (colspan === 1) {
                r.fieldIndex = index;
                // when field is undefined, use index instead
                if (typeof r.field === 'undefined') {
                  r.field = index;
                }
              }

              for (var k = 0; k < rowspan; k++) {
                flag[_i + k][index] = true;
              }
              for (var _k = 0; _k < colspan; _k++) {
                flag[_i][index + _k] = true;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      },
      getScrollBarWidth: function getScrollBarWidth() {
        if (this.cachedWidth === null) {
          var $inner = $('<div/>').addClass('fixed-table-scroll-inner');
          var $outer = $('<div/>').addClass('fixed-table-scroll-outer');

          $outer.append($inner);
          $('body').append($outer);

          var w1 = $inner[0].offsetWidth;
          $outer.css('overflow', 'scroll');
          var w2 = $inner[0].offsetWidth;

          if (w1 === w2) {
            w2 = $outer[0].clientWidth;
          }

          $outer.remove();
          this.cachedWidth = w1 - w2;
        }
        return this.cachedWidth;
      },
      calculateObjectValue: function calculateObjectValue(self, name, args, defaultValue) {
        var func = name;

        if (typeof name === 'string') {
          // support obj.func1.func2
          var names = name.split('.');

          if (names.length > 1) {
            func = window;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = names[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var f = _step4.value;

                func = func[f];
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          } else {
            func = window[name];
          }
        }

        if (func !== null && (typeof func === 'undefined' ? 'undefined' : _typeof(func)) === 'object') {
          return func;
        }

        if (typeof func === 'function') {
          return func.apply(self, args || []);
        }

        if (!func && typeof name === 'string' && this.sprintf.apply(this, [name].concat(_toConsumableArray(args)))) {
          return this.sprintf.apply(this, [name].concat(_toConsumableArray(args)));
        }

        return defaultValue;
      },
      compareObjects: function compareObjects(objectA, objectB, compareLength) {
        var aKeys = Object.keys(objectA);
        var bKeys = Object.keys(objectB);

        if (compareLength && aKeys.length !== bKeys.length) {
          return false;
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = aKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            if (bKeys.includes(key) && objectA[key] !== objectB[key]) {
              return false;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return true;
      },
      escapeHTML: function escapeHTML(text) {
        if (typeof text === 'string') {
          return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/`/g, '&#x60;');
        }
        return text;
      },
      getRealDataAttr: function getRealDataAttr(dataAttr) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = Object.entries(dataAttr)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _ref = _step6.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var attr = _ref2[0];
            var value = _ref2[1];

            var auxAttr = attr.split(/(?=[A-Z])/).join('-').toLowerCase();
            if (auxAttr !== attr) {
              dataAttr[auxAttr] = value;
              delete dataAttr[attr];
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return dataAttr;
      },
      getItemField: function getItemField(item, field, escape) {
        var value = item;

        if (typeof field !== 'string' || item.hasOwnProperty(field)) {
          return escape ? this.escapeHTML(item[field]) : item[field];
        }

        var props = field.split('.');
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = props[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var p = _step7.value;

            value = value && value[p];
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        return escape ? this.escapeHTML(value) : value;
      },
      isIEBrowser: function isIEBrowser() {
        return navigator.userAgent.includes('MSIE ') || /Trident.*rv:11\./.test(navigator.userAgent);
      }
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var DEFAULTS = {
      classes: 'table table-hover',
      theadClasses: '',
      sortClass: undefined,
      locale: undefined,
      height: undefined,
      undefinedText: '-',
      sortName: undefined,
      sortOrder: 'asc',
      sortStable: false,
      rememberOrder: false,
      striped: false,
      columns: [[]],
      data: [],
      totalField: 'total',
      dataField: 'rows',
      method: 'get',
      url: undefined,
      ajax: undefined,
      cache: true,
      contentType: 'application/json',
      dataType: 'json',
      ajaxOptions: {},
      queryParams: function queryParams(params) {
        return params;
      },

      queryParamsType: 'limit', responseHandler: function responseHandler(res) {
        return res;
      },

      pagination: false,
      onlyInfoPagination: false,
      paginationLoop: true,
      sidePagination: 'client', // client or server
      totalRows: 0, // server side need to set
      pageNumber: 1,
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      paginationHAlign: 'right', // right, left
      paginationVAlign: 'bottom', // bottom, top, both
      paginationDetailHAlign: 'left', // right, left
      paginationPreText: '&lsaquo;',
      paginationNextText: '&rsaquo;',
      search: false,
      searchOnEnterKey: false,
      strictSearch: false,
      searchAlign: 'right',
      selectItemName: 'btSelectItem',
      showHeader: true,
      showFooter: false,
      showColumns: false,
      showPaginationSwitch: false,
      showRefresh: false,
      showToggle: false,
      showFullscreen: false,
      smartDisplay: true,
      escape: false,
      minimumCountColumns: 1,
      idField: undefined,
      uniqueId: undefined,
      cardView: false,
      detailView: false,
      detailFormatter: function detailFormatter(index, row) {
        return '';
      },
      detailFilter: function detailFilter(index, row) {
        return true;
      },

      trimOnSearch: true,
      clickToSelect: false,
      singleSelect: false,
      toolbar: undefined,
      toolbarAlign: 'left',
      buttonsToolbar: undefined,
      buttonsAlign: 'right',
      checkboxHeader: true,
      sortable: true,
      silentSort: true,
      maintainSelected: false,
      searchTimeOut: 500,
      searchText: '',
      iconSize: undefined,
      buttonsClass: bootstrap.classes.buttons,
      iconsPrefix: bootstrap.iconsPrefix, // glyphicon or fa(font-awesome)
      icons: bootstrap.icons,
      customSearch: $.noop,
      customSort: $.noop,
      ignoreClickToSelectOn: function ignoreClickToSelectOn(_ref3) {
        var tagName = _ref3.tagName;

        return ['A', 'BUTTON'].includes(tagName);
      },
      rowStyle: function rowStyle(row, index) {
        return {};
      },
      rowAttributes: function rowAttributes(row, index) {
        return {};
      },
      footerStyle: function footerStyle(row, index) {
        return {};
      },
      onAll: function onAll(name, args) {
        return false;
      },
      onClickCell: function onClickCell(field, value, row, $element) {
        return false;
      },
      onDblClickCell: function onDblClickCell(field, value, row, $element) {
        return false;
      },
      onClickRow: function onClickRow(item, $element) {
        return false;
      },
      onDblClickRow: function onDblClickRow(item, $element) {
        return false;
      },
      onSort: function onSort(name, order) {
        return false;
      },
      onCheck: function onCheck(row) {
        return false;
      },
      onUncheck: function onUncheck(row) {
        return false;
      },
      onCheckAll: function onCheckAll(rows) {
        return false;
      },
      onUncheckAll: function onUncheckAll(rows) {
        return false;
      },
      onCheckSome: function onCheckSome(rows) {
        return false;
      },
      onUncheckSome: function onUncheckSome(rows) {
        return false;
      },
      onLoadSuccess: function onLoadSuccess(data) {
        return false;
      },
      onLoadError: function onLoadError(status) {
        return false;
      },
      onColumnSwitch: function onColumnSwitch(field, checked) {
        return false;
      },
      onPageChange: function onPageChange(number, size) {
        return false;
      },
      onSearch: function onSearch(text) {
        return false;
      },
      onToggle: function onToggle(cardView) {
        return false;
      },
      onPreBody: function onPreBody(data) {
        return false;
      },
      onPostBody: function onPostBody() {
        return false;
      },
      onPostHeader: function onPostHeader() {
        return false;
      },
      onExpandRow: function onExpandRow(index, row, $detail) {
        return false;
      },
      onCollapseRow: function onCollapseRow(index, row) {
        return false;
      },
      onRefreshOptions: function onRefreshOptions(options) {
        return false;
      },
      onRefresh: function onRefresh(params) {
        return false;
      },
      onResetView: function onResetView() {
        return false;
      },
      onScrollBody: function onScrollBody() {
        return false;
      }
    };

    var LOCALES = {};
    LOCALES['en-US'] = LOCALES.en = {
      formatLoadingMessage: function formatLoadingMessage() {
        return 'Loading, please wait...';
      },
      formatRecordsPerPage: function formatRecordsPerPage(pageNumber) {
        return Utils.sprintf('%s rows per page', pageNumber);
      },
      formatShowingRows: function formatShowingRows(pageFrom, pageTo, totalRows) {
        return Utils.sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
      },
      formatDetailPagination: function formatDetailPagination(totalRows) {
        return Utils.sprintf('Showing %s rows', totalRows);
      },
      formatSearch: function formatSearch() {
        return 'Search';
      },
      formatNoMatches: function formatNoMatches() {
        return 'No matching records found';
      },
      formatPaginationSwitch: function formatPaginationSwitch() {
        return 'Hide/Show pagination';
      },
      formatRefresh: function formatRefresh() {
        return 'Refresh';
      },
      formatToggle: function formatToggle() {
        return 'Toggle';
      },
      formatFullscreen: function formatFullscreen() {
        return 'Fullscreen';
      },
      formatColumns: function formatColumns() {
        return 'Columns';
      },
      formatAllRows: function formatAllRows() {
        return 'All';
      }
    };

    $.extend(DEFAULTS, LOCALES['en-US']);

    var COLUMN_DEFAULTS = {
      radio: false,
      checkbox: false,
      checkboxEnabled: true,
      field: undefined,
      title: undefined,
      titleTooltip: undefined,
      'class': undefined,
      align: undefined, // left, right, center
      halign: undefined, // left, right, center
      falign: undefined, // left, right, center
      valign: undefined, // top, middle, bottom
      width: undefined,
      sortable: false,
      order: 'asc', // asc, desc
      visible: true,
      switchable: true,
      clickToSelect: true,
      formatter: undefined,
      footerFormatter: undefined,
      events: undefined,
      sorter: undefined,
      sortName: undefined,
      cellStyle: undefined,
      searchable: true,
      searchFormatter: true,
      cardVisible: true,
      escape: false,
      showSelectTitle: false
    };

    var EVENTS = {
      'all.bs.table': 'onAll',
      'click-cell.bs.table': 'onClickCell',
      'dbl-click-cell.bs.table': 'onDblClickCell',
      'click-row.bs.table': 'onClickRow',
      'dbl-click-row.bs.table': 'onDblClickRow',
      'sort.bs.table': 'onSort',
      'check.bs.table': 'onCheck',
      'uncheck.bs.table': 'onUncheck',
      'check-all.bs.table': 'onCheckAll',
      'uncheck-all.bs.table': 'onUncheckAll',
      'check-some.bs.table': 'onCheckSome',
      'uncheck-some.bs.table': 'onUncheckSome',
      'load-success.bs.table': 'onLoadSuccess',
      'load-error.bs.table': 'onLoadError',
      'column-switch.bs.table': 'onColumnSwitch',
      'page-change.bs.table': 'onPageChange',
      'search.bs.table': 'onSearch',
      'toggle.bs.table': 'onToggle',
      'pre-body.bs.table': 'onPreBody',
      'post-body.bs.table': 'onPostBody',
      'post-header.bs.table': 'onPostHeader',
      'expand-row.bs.table': 'onExpandRow',
      'collapse-row.bs.table': 'onCollapseRow',
      'refresh-options.bs.table': 'onRefreshOptions',
      'reset-view.bs.table': 'onResetView',
      'refresh.bs.table': 'onRefresh',
      'scroll-body.bs.table': 'onScrollBody'
    };

    var BootstrapTable = function () {
      function BootstrapTable(el, options) {
        _classCallCheck(this, BootstrapTable);

        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
      }

      _createClass(BootstrapTable, [{
        key: 'init',
        value: function init() {
          this.initLocale();
          this.initContainer();
          this.initTable();
          this.initHeader();
          this.initData();
          this.initHiddenRows();
          this.initFooter();
          this.initToolbar();
          this.initPagination();
          this.initBody();
          this.initSearchText();
          this.initServer();
        }
      }, {
        key: 'initLocale',
        value: function initLocale() {
          if (this.options.locale) {
            var locales = $.fn.bootstrapTable.locales;
            var parts = this.options.locale.split(/-|_/);
            parts[0].toLowerCase();
            if (parts[1]) {
              parts[1].toUpperCase();
            }
            if (locales[this.options.locale]) {
              // locale as requested
              $.extend(this.options, locales[this.options.locale]);
            } else if ($.fn.bootstrapTable.locales[parts.join('-')]) {
              // locale with sep set to - (in case original was specified with _)
              $.extend(this.options, locales[parts.join('-')]);
            } else if ($.fn.bootstrapTable.locales[parts[0]]) {
              // short locale language code (i.e. 'en')
              $.extend(this.options, locales[parts[0]]);
            }
          }
        }
      }, {
        key: 'initContainer',
        value: function initContainer() {
          var topPagination = ['top', 'both'].includes(this.options.paginationVAlign) ? '<div class="fixed-table-pagination clearfix"></div>' : '';
          var bottomPagination = ['bottom', 'both'].includes(this.options.paginationVAlign) ? '<div class="fixed-table-pagination"></div>' : '';

          this.$container = $('\n        <div class="bootstrap-table">\n        <div class="fixed-table-toolbar"></div>\n        ' + topPagination + '\n        <div class="fixed-table-container">\n        <div class="fixed-table-header"><table></table></div>\n        <div class="fixed-table-body">\n        <div class="fixed-table-loading">\n        ' + this.options.formatLoadingMessage() + '\n        </div>\n        </div>\n        <div class="fixed-table-footer"><table><tr></tr></table></div>\n        </div>\n        ' + bottomPagination + '\n        </div>\n      ');

          this.$container.insertAfter(this.$el);
          this.$tableContainer = this.$container.find('.fixed-table-container');
          this.$tableHeader = this.$container.find('.fixed-table-header');
          this.$tableBody = this.$container.find('.fixed-table-body');
          this.$tableLoading = this.$container.find('.fixed-table-loading');
          this.$tableFooter = this.$container.find('.fixed-table-footer');
          // checking if custom table-toolbar exists or not
          if (this.options.buttonsToolbar) {
            this.$toolbar = $('body').find(this.options.buttonsToolbar);
          } else {
            this.$toolbar = this.$container.find('.fixed-table-toolbar');
          }
          this.$pagination = this.$container.find('.fixed-table-pagination');

          this.$tableBody.append(this.$el);
          this.$container.after('<div class="clearfix"></div>');

          this.$el.addClass(this.options.classes);
          if (this.options.striped) {
            this.$el.addClass('table-striped');
          }
          if (this.options.classes.split(' ').includes('table-no-bordered')) {
            this.$tableContainer.addClass('table-no-bordered');
          }
        }
      }, {
        key: 'initTable',
        value: function initTable() {
          var _this = this;

          var columns = [];
          var data = [];

          this.$header = this.$el.find('>thead');
          if (!this.$header.length) {
            this.$header = $('<thead class="' + this.options.theadClasses + '"></thead>').appendTo(this.$el);
          }
          this.$header.find('tr').each(function (i, el) {
            var column = [];

            $(el).find('th').each(function (i, el) {
              // #2014: getFieldIndex and elsewhere assume this is string, causes issues if not
              if (typeof $(el).data('field') !== 'undefined') {
                $(el).data('field', '' + $(el).data('field'));
              }
              column.push($.extend({}, {
                title: $(el).html(),
                'class': $(el).attr('class'),
                titleTooltip: $(el).attr('title'),
                rowspan: $(el).attr('rowspan') ? +$(el).attr('rowspan') : undefined,
                colspan: $(el).attr('colspan') ? +$(el).attr('colspan') : undefined
              }, $(el).data()));
            });
            columns.push(column);
          });

          if (!Array.isArray(this.options.columns[0])) {
            this.options.columns = [this.options.columns];
          }

          this.options.columns = $.extend(true, [], columns, this.options.columns);
          this.columns = [];
          this.fieldsColumnsIndex = [];

          Utils.setFieldIndex(this.options.columns);

          this.options.columns.forEach(function (columns, i) {
            columns.forEach(function (_column, j) {
              var column = $.extend({}, BootstrapTable.COLUMN_DEFAULTS, _column);

              if (typeof column.fieldIndex !== 'undefined') {
                _this.columns[column.fieldIndex] = column;
                _this.fieldsColumnsIndex[column.field] = column.fieldIndex;
              }

              _this.options.columns[i][j] = column;
            });
          });

          // if options.data is setting, do not process tbody data
          if (this.options.data.length) {
            return;
          }

          var m = [];
          this.$el.find('>tbody>tr').each(function (y, el) {
            var row = {};

            // save tr's id, class and data-* attributes
            row._id = $(el).attr('id');
            row._class = $(el).attr('class');
            row._data = Utils.getRealDataAttr($(el).data());

            $(el).find('>td').each(function (_x, el) {
              var cspan = +$(el).attr('colspan') || 1;
              var rspan = +$(el).attr('rowspan') || 1;
              var x = _x;

              // skip already occupied cells in current row
              for (; m[y] && m[y][x]; x++) {}
              // ignore


              // mark matrix elements occupied by current cell with true
              for (var tx = x; tx < x + cspan; tx++) {
                for (var ty = y; ty < y + rspan; ty++) {
                  if (!m[ty]) {
                    // fill missing rows
                    m[ty] = [];
                  }
                  m[ty][tx] = true;
                }
              }

              var field = _this.columns[x].field;

              row[field] = $(el).html();
              // save td's id, class and data-* attributes
              row['_' + field + '_id'] = $(el).attr('id');
              row['_' + field + '_class'] = $(el).attr('class');
              row['_' + field + '_rowspan'] = $(el).attr('rowspan');
              row['_' + field + '_colspan'] = $(el).attr('colspan');
              row['_' + field + '_title'] = $(el).attr('title');
              row['_' + field + '_data'] = Utils.getRealDataAttr($(el).data());
            });
            data.push(row);
          });
          this.options.data = data;
          if (data.length) {
            this.fromHtml = true;
          }
        }
      }, {
        key: 'initHeader',
        value: function initHeader() {
          var _this2 = this;

          var visibleColumns = {};
          var html = [];

          this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            sortNames: [],
            cellStyles: [],
            searchables: []
          };

          this.options.columns.forEach(function (columns, i) {
            html.push('<tr>');

            if (i === 0 && !_this2.options.cardView && _this2.options.detailView) {
              html.push('<th class="detail" rowspan="' + _this2.options.columns.length + '">\n            <div class="fht-cell"></div>\n            </th>\n          ');
            }

            columns.forEach(function (column, j) {
              var text = '';

              var halign = ''; // header align style

              var align = ''; // body align style

              var style = '';
              var class_ = Utils.sprintf(' class="%s"', column['class']);
              var unitWidth = 'px';
              var width = column.width;

              if (column.width !== undefined && !_this2.options.cardView) {
                if (typeof column.width === 'string') {
                  if (column.width.includes('%')) {
                    unitWidth = '%';
                  }
                }
              }
              if (column.width && typeof column.width === 'string') {
                width = column.width.replace('%', '').replace('px', '');
              }

              halign = Utils.sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
              align = Utils.sprintf('text-align: %s; ', column.align);
              style = Utils.sprintf('vertical-align: %s; ', column.valign);
              style += Utils.sprintf('width: %s; ', (column.checkbox || column.radio) && !width ? !column.showSelectTitle ? '36px' : undefined : width ? width + unitWidth : undefined);

              if (typeof column.fieldIndex !== 'undefined') {
                _this2.header.fields[column.fieldIndex] = column.field;
                _this2.header.styles[column.fieldIndex] = align + style;
                _this2.header.classes[column.fieldIndex] = class_;
                _this2.header.formatters[column.fieldIndex] = column.formatter;
                _this2.header.events[column.fieldIndex] = column.events;
                _this2.header.sorters[column.fieldIndex] = column.sorter;
                _this2.header.sortNames[column.fieldIndex] = column.sortName;
                _this2.header.cellStyles[column.fieldIndex] = column.cellStyle;
                _this2.header.searchables[column.fieldIndex] = column.searchable;

                if (!column.visible) {
                  return;
                }

                if (_this2.options.cardView && !column.cardVisible) {
                  return;
                }

                visibleColumns[column.field] = column;
              }

              html.push('<th' + Utils.sprintf(' title="%s"', column.titleTooltip), column.checkbox || column.radio ? Utils.sprintf(' class="bs-checkbox %s"', column['class'] || '') : class_, Utils.sprintf(' style="%s"', halign + style), Utils.sprintf(' rowspan="%s"', column.rowspan), Utils.sprintf(' colspan="%s"', column.colspan), Utils.sprintf(' data-field="%s"', column.field),
              // If `column` is not the first element of `this.options.columns[0]`, then className 'data-not-first-th' should be added.
              j === 0 && i > 0 ? ' data-not-first-th' : '', '>');

              html.push(Utils.sprintf('<div class="th-inner %s">', _this2.options.sortable && column.sortable ? 'sortable both' : ''));

              text = _this2.options.escape ? Utils.escapeHTML(column.title) : column.title;

              var title = text;
              if (column.checkbox) {
                text = '';
                if (!_this2.options.singleSelect && _this2.options.checkboxHeader) {
                  text = '<input name="btSelectAll" type="checkbox" />';
                }
                _this2.header.stateField = column.field;
              }
              if (column.radio) {
                text = '';
                _this2.header.stateField = column.field;
                _this2.options.singleSelect = true;
              }
              if (!text && column.showSelectTitle) {
                text += title;
              }

              html.push(text);
              html.push('</div>');
              html.push('<div class="fht-cell"></div>');
              html.push('</div>');
              html.push('</th>');
            });
            html.push('</tr>');
          });

          this.$header.html(html.join(''));
          this.$header.find('th[data-field]').each(function (i, el) {
            $(el).data(visibleColumns[$(el).data('field')]);
          });
          this.$container.off('click', '.th-inner').on('click', '.th-inner', function (e) {
            var $this = $(e.currentTarget);

            if (_this2.options.detailView && !$this.parent().hasClass('bs-checkbox')) {
              if ($this.closest('.bootstrap-table')[0] !== _this2.$container[0]) {
                return false;
              }
            }

            if (_this2.options.sortable && $this.parent().data().sortable) {
              _this2.onSort(e);
            }
          });

          this.$header.children().children().off('keypress').on('keypress', function (e) {
            if (_this2.options.sortable && $(e.currentTarget).data().sortable) {
              var code = e.keyCode || e.which;
              if (code === 13) {
                // Enter keycode
                _this2.onSort(e);
              }
            }
          });

          $(window).off('resize.bootstrap-table');
          if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$tableHeader.hide();
            this.$tableLoading.css('top', 0);
          } else {
            this.$header.show();
            this.$tableHeader.show();
            this.$tableLoading.css('top', this.$header.outerHeight() + 1);
            // Assign the correct sortable arrow
            this.getCaret();
            $(window).on('resize.bootstrap-table', $.proxy(this.resetWidth, this));
          }

          this.$selectAll = this.$header.find('[name="btSelectAll"]');
          this.$selectAll.off('click').on('click', function (_ref4) {
            var currentTarget = _ref4.currentTarget;

            var checked = $(currentTarget).prop('checked');
            _this2[checked ? 'checkAll' : 'uncheckAll']();
            _this2.updateSelected();
          });
        }
      }, {
        key: 'initFooter',
        value: function initFooter() {
          if (!this.options.showFooter || this.options.cardView) {
            this.$tableFooter.hide();
          } else {
            this.$tableFooter.show();
          }
        }
      }, {
        key: 'initData',
        value: function initData(data, type) {
          if (type === 'append') {
            this.options.data = this.options.data.concat(data);
          } else if (type === 'prepend') {
            this.options.data = [].concat(data).concat(this.options.data);
          } else {
            this.options.data = data || this.options.data;
          }

          this.data = this.options.data;

          if (this.options.sidePagination === 'server') {
            return;
          }
          this.initSort();
        }
      }, {
        key: 'initSort',
        value: function initSort() {
          var _this3 = this;

          var name = this.options.sortName;
          var order = this.options.sortOrder === 'desc' ? -1 : 1;
          var index = this.header.fields.indexOf(this.options.sortName);
          var timeoutId = 0;

          if (this.options.customSort !== $.noop) {
            this.options.customSort.apply(this, [this.options.sortName, this.options.sortOrder]);
            return;
          }

          if (index !== -1) {
            if (this.options.sortStable) {
              this.data.forEach(function (row, i) {
                row._position = i;
              });
            }

            this.data.sort(function (a, b) {
              if (_this3.header.sortNames[index]) {
                name = _this3.header.sortNames[index];
              }
              var aa = Utils.getItemField(a, name, _this3.options.escape);
              var bb = Utils.getItemField(b, name, _this3.options.escape);
              var value = Utils.calculateObjectValue(_this3.header, _this3.header.sorters[index], [aa, bb, a, b]);

              if (value !== undefined) {
                if (_this3.options.sortStable && value === 0) {
                  return a._position - b._position;
                }
                return order * value;
              }

              // Fix #161: undefined or null string sort bug.
              if (aa === undefined || aa === null) {
                aa = '';
              }
              if (bb === undefined || bb === null) {
                bb = '';
              }

              if (_this3.options.sortStable && aa === bb) {
                aa = a._position;
                bb = b._position;
                return a._position - b._position;
              }

              // IF both values are numeric, do a numeric comparison
              if ($.isNumeric(aa) && $.isNumeric(bb)) {
                // Convert numerical values form string to float.
                aa = parseFloat(aa);
                bb = parseFloat(bb);
                if (aa < bb) {
                  return order * -1;
                }
                return order;
              }

              if (aa === bb) {
                return 0;
              }

              // If value is not a string, convert to string
              if (typeof aa !== 'string') {
                aa = aa.toString();
              }

              if (aa.localeCompare(bb) === -1) {
                return order * -1;
              }

              return order;
            });

            if (this.options.sortClass !== undefined) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(function () {
                _this3.$el.removeClass(_this3.options.sortClass);
                var index = _this3.$header.find(Utils.sprintf('[data-field="%s"]', _this3.options.sortName).index() + 1);
                _this3.$el.find(Utils.sprintf('tr td:nth-child(%s)', index)).addClass(_this3.options.sortClass);
              }, 250);
            }
          }
        }
      }, {
        key: 'onSort',
        value: function onSort(_ref5) {
          var type = _ref5.type,
              currentTarget = _ref5.currentTarget;

          var $this = type === 'keypress' ? $(currentTarget) : $(currentTarget).parent();
          var $this_ = this.$header.find('th').eq($this.index());

          this.$header.add(this.$header_).find('span.order').remove();

          if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
          } else {
            this.options.sortName = $this.data('field');
            if (this.options.rememberOrder) {
              this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
            } else {
              this.options.sortOrder = this.columns[this.fieldsColumnsIndex[$this.data('field')]].order;
            }
          }
          this.trigger('sort', this.options.sortName, this.options.sortOrder);

          $this.add($this_).data('order', this.options.sortOrder);

          // Assign the correct sortable arrow
          this.getCaret();

          if (this.options.sidePagination === 'server') {
            this.initServer(this.options.silentSort);
            return;
          }

          this.initSort();
          this.initBody();
        }
      }, {
        key: 'initToolbar',
        value: function initToolbar() {
          var _this4 = this;

          var html = [];
          var timeoutId = 0;
          var $keepOpen = void 0;
          var $search = void 0;
          var switchableCount = 0;

          if (this.$toolbar.find('.bs-bars').children().length) {
            $('body').append($(this.options.toolbar));
          }
          this.$toolbar.html('');

          if (typeof this.options.toolbar === 'string' || _typeof(this.options.toolbar) === 'object') {
            $(Utils.sprintf('<div class="bs-bars %s-%s"></div>', bootstrap.classes.pull, this.options.toolbarAlign)).appendTo(this.$toolbar).append($(this.options.toolbar));
          }

          // showColumns, showToggle, showRefresh
          html = [Utils.sprintf('<div class="columns columns-%s btn-group %s-%s">', this.options.buttonsAlign, bootstrap.classes.pull, this.options.buttonsAlign)];

          if (typeof this.options.icons === 'string') {
            this.options.icons = Utils.calculateObjectValue(null, this.options.icons);
          }

          if (this.options.showPaginationSwitch) {
            html.push(Utils.sprintf('<button class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + '" type="button" name="paginationSwitch" aria-label="pagination Switch" title="%s">', this.options.formatPaginationSwitch()), Utils.sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown), '</button>');
          }

          if (this.options.showFullscreen) {
            this.$toolbar.find('button[name="fullscreen"]').off('click').on('click', $.proxy(this.toggleFullscreen, this));
          }

          if (this.options.showRefresh) {
            html.push(Utils.sprintf('<button class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + '" type="button" name="refresh" aria-label="refresh" title="%s">', this.options.formatRefresh()), Utils.sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh), '</button>');
          }

          if (this.options.showToggle) {
            html.push(Utils.sprintf('<button class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + '" type="button" name="toggle" aria-label="toggle" title="%s">', this.options.formatToggle()), Utils.sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggleOff), '</button>');
          }

          if (this.options.showFullscreen) {
            html.push(Utils.sprintf('<button class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + '" type="button" name="fullscreen" aria-label="fullscreen" title="%s">', this.options.formatFullscreen()), Utils.sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.fullscreen), '</button>');
          }

          if (this.options.showColumns) {
            html.push(Utils.sprintf('<div class="keep-open btn-group" title="%s">', this.options.formatColumns()), '<button type="button" aria-label="columns" class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">', Utils.sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns), ' <span class="caret"></span>', '</button>', bootstrap.html.toobarDropdow[0]);

            this.columns.forEach(function (column, i) {
              if (column.radio || column.checkbox) {
                return;
              }

              if (_this4.options.cardView && !column.cardVisible) {
                return;
              }

              var checked = column.visible ? ' checked="checked"' : '';

              if (column.switchable) {
                html.push(Utils.sprintf(bootstrap.html.toobarDropdowItem, Utils.sprintf('<input type="checkbox" data-field="%s" value="%s"%s> %s', column.field, i, checked, column.title)));
                switchableCount++;
              }
            });
            html.push(bootstrap.html.toobarDropdow[1], '</div>');
          }

          html.push('</div>');

          // Fix #188: this.showToolbar is for extensions
          if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
          }

          if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]').off('click').on('click', $.proxy(this.togglePagination, this));
          }

          if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]').off('click').on('click', $.proxy(this.refresh, this));
          }

          if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]').off('click').on('click', function () {
              _this4.toggleView();
            });
          }

          if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
              $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (e) {
              e.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function (_ref6) {
              var currentTarget = _ref6.currentTarget;

              var $this = $(currentTarget);

              _this4.toggleColumn($this.val(), $this.prop('checked'), false);
              _this4.trigger('column-switch', $this.data('field'), $this.prop('checked'));
            });
          }

          if (this.options.search) {
            html = [];
            html.push(Utils.sprintf('<div class="%s-%s search">', bootstrap.classes.pull, this.options.searchAlign), Utils.sprintf('<input class="form-control' + Utils.sprintf(' input-%s', this.options.iconSize) + '" type="text" placeholder="%s">', this.options.formatSearch()), '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup drop blur').on('keyup drop blur', function (event) {
              if (_this4.options.searchOnEnterKey && event.keyCode !== 13) {
                return;
              }

              if ([37, 38, 39, 40].includes(event.keyCode)) {
                return;
              }

              clearTimeout(timeoutId); // doesn't matter if it's 0
              timeoutId = setTimeout(function () {
                _this4.onSearch(event);
              }, _this4.options.searchTimeOut);
            });

            if (Utils.isIEBrowser()) {
              $search.off('mouseup').on('mouseup', function (event) {
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                  _this4.onSearch(event);
                }, _this4.options.searchTimeOut);
              });
            }
          }
        }
      }, {
        key: 'onSearch',
        value: function onSearch(_ref7) {
          var currentTarget = _ref7.currentTarget,
              firedByInitSearchText = _ref7.firedByInitSearchText;

          var text = $.trim($(currentTarget).val());

          // trim search input
          if (this.options.trimOnSearch && $(currentTarget).val() !== text) {
            $(currentTarget).val(text);
          }

          if (text === this.searchText) {
            return;
          }
          this.searchText = text;
          this.options.searchText = text;

          if (!firedByInitSearchText) {
            this.options.pageNumber = 1;
          }
          this.initSearch();
          if (firedByInitSearchText) {
            if (this.options.sidePagination === 'client') {
              this.updatePagination();
            }
          } else {
            this.updatePagination();
          }
          this.trigger('search', text);
        }
      }, {
        key: 'initSearch',
        value: function initSearch() {
          var _this5 = this;

          if (this.options.sidePagination !== 'server') {
            if (this.options.customSearch !== $.noop) {
              Utils.calculateObjectValue(this.options, this.options.customSearch, [this.searchText]);
              return;
            }

            var s = this.searchText && (this.options.escape ? Utils.escapeHTML(this.searchText) : this.searchText).toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

            // Check filter
            this.data = f ? this.options.data.filter(function (item, i) {
              for (var key in f) {
                if (Array.isArray(f[key]) && !f[key].includes(item[key]) || !Array.isArray(f[key]) && item[key] !== f[key]) {
                  return false;
                }
              }
              return true;
            }) : this.options.data;

            this.data = s ? this.data.filter(function (item, i) {
              for (var j = 0; j < _this5.header.fields.length; j++) {
                if (!_this5.header.searchables[j]) {
                  continue;
                }

                var key = $.isNumeric(_this5.header.fields[j]) ? parseInt(_this5.header.fields[j], 10) : _this5.header.fields[j];
                var column = _this5.columns[_this5.fieldsColumnsIndex[key]];
                var value = void 0;

                if (typeof key === 'string') {
                  value = item;
                  var props = key.split('.');
                  for (var _i2 = 0; _i2 < props.length; _i2++) {
                    if (value[props[_i2]] !== null) {
                      value = value[props[_i2]];
                    }
                  }
                } else {
                  value = item[key];
                }

                // Fix #142: respect searchForamtter boolean
                if (column && column.searchFormatter) {
                  value = Utils.calculateObjectValue(column, _this5.header.formatters[j], [value, item, i], value);
                }

                if (typeof value === 'string' || typeof value === 'number') {
                  if (_this5.options.strictSearch) {
                    if (('' + value).toLowerCase() === s) {
                      return true;
                    }
                  } else {
                    if (('' + value).toLowerCase().includes(s)) {
                      return true;
                    }
                  }
                }
              }
              return false;
            }) : this.data;
          }
        }
      }, {
        key: 'initPagination',
        value: function initPagination() {
          var _this6 = this;

          if (!this.options.pagination) {
            this.$pagination.hide();
            return;
          }
          this.$pagination.show();

          var html = [];
          var $allSelected = false;
          var i = void 0;
          var from = void 0;
          var to = void 0;
          var $pageList = void 0;
          var $pre = void 0;
          var $next = void 0;
          var $number = void 0;
          var data = this.getData();
          var pageList = this.options.pageList;

          if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
          }

          this.totalPages = 0;
          if (this.options.totalRows) {
            if (this.options.pageSize === this.options.formatAllRows()) {
              this.options.pageSize = this.options.totalRows;
              $allSelected = true;
            } else if (this.options.pageSize === this.options.totalRows) {
              // Fix #667 Table with pagination,
              // multiple pages and a search this matches to one page throws exception
              var pageLst = typeof this.options.pageList === 'string' ? this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').toLowerCase().split(',') : this.options.pageList;
              if (pageLst.includes(this.options.formatAllRows().toLowerCase())) {
                $allSelected = true;
              }
            }

            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;

            this.options.totalPages = this.totalPages;
          }
          if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
          }

          this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
          this.pageTo = this.options.pageNumber * this.options.pageSize;
          if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
          }

          html.push(Utils.sprintf('<div class="%s-%s pagination-detail">', bootstrap.classes.pull, this.options.paginationDetailHAlign), '<span class="pagination-info">', this.options.onlyInfoPagination ? this.options.formatDetailPagination(this.options.totalRows) : this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows), '</span>');

          if (!this.options.onlyInfoPagination) {
            html.push('<span class="page-list">');

            var pageNumber = [Utils.sprintf('<span class="btn-group %s">', this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ? 'dropdown' : 'dropup'), '<button type="button" class="btn' + Utils.sprintf(' btn-%s', this.options.buttonsClass) + Utils.sprintf(' btn-%s', this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">', '<span class="page-size">', $allSelected ? this.options.formatAllRows() : this.options.pageSize, '</span>', ' <span class="caret"></span>', '</button>', bootstrap.html.pageDropdown[0]];

            if (typeof this.options.pageList === 'string') {
              var list = this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').split(',');

              pageList = [];
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = list[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var value = _step8.value;

                  pageList.push(value.toUpperCase() === this.options.formatAllRows().toUpperCase() || value.toUpperCase() === 'UNLIMITED' ? this.options.formatAllRows() : +value);
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
              }
            }

            pageList.forEach(function (page, i) {
              if (!_this6.options.smartDisplay || i === 0 || pageList[i - 1] < _this6.options.totalRows) {
                var active = void 0;
                if ($allSelected) {
                  active = page === _this6.options.formatAllRows() ? 'active' : '';
                } else {
                  active = page === _this6.options.pageSize ? 'active' : '';
                }
                pageNumber.push(Utils.sprintf(bootstrap.html.pageDropdownItem, active, page));
              }
            });
            pageNumber.push(bootstrap.html.pageDropdown[1] + '</span>');

            html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
            html.push('</span>');

            html.push('</div>', Utils.sprintf('<div class="%s-%s pagination">', bootstrap.classes.pull, this.options.paginationHAlign), '<ul class="pagination' + Utils.sprintf(' pagination-%s', this.options.iconSize) + '">', Utils.sprintf('<li class="page-item page-pre"><a class="page-link" href="#">%s</a></li>', this.options.paginationPreText));

            if (this.totalPages < 5) {
              from = 1;
              to = this.totalPages;
            } else {
              from = this.options.pageNumber - 2;
              to = from + 4;
              if (from < 1) {
                from = 1;
                to = 5;
              }
              if (to > this.totalPages) {
                to = this.totalPages;
                from = to - 4;
              }
            }

            if (this.totalPages >= 6) {
              if (this.options.pageNumber >= 3) {
                html.push(Utils.sprintf('<li class="page-item page-first%s">', this.options.pageNumber === 1 ? ' active' : ''), '<a class="page-link" href="#">', 1, '</a>', '</li>');

                from++;
              }

              if (this.options.pageNumber >= 4) {
                if (this.options.pageNumber === 4 || this.totalPages === 6 || this.totalPages === 7) {
                  from--;
                } else {
                  html.push('<li class="page-item page-first-separator disabled">', '<a class="page-link" href="#">...</a>', '</li>');
                }

                to--;
              }
            }

            if (this.totalPages >= 7) {
              if (this.options.pageNumber >= this.totalPages - 2) {
                from--;
              }
            }

            if (this.totalPages === 6) {
              if (this.options.pageNumber >= this.totalPages - 2) {
                to++;
              }
            } else if (this.totalPages >= 7) {
              if (this.totalPages === 7 || this.options.pageNumber >= this.totalPages - 3) {
                to++;
              }
            }

            for (i = from; i <= to; i++) {
              html.push(Utils.sprintf('<li class="page-item%s">', i === this.options.pageNumber ? ' active' : ''), '<a class="page-link" href="#">', i, '</a>', '</li>');
            }

            if (this.totalPages >= 8) {
              if (this.options.pageNumber <= this.totalPages - 4) {
                html.push('<li class="page-item page-last-separator disabled">', '<a class="page-link" href="#">...</a>', '</li>');
              }
            }

            if (this.totalPages >= 6) {
              if (this.options.pageNumber <= this.totalPages - 3) {
                html.push(Utils.sprintf('<li class="page-item page-last%s">', this.totalPages === this.options.pageNumber ? ' active' : ''), '<a class="page-link" href="#">', this.totalPages, '</a>', '</li>');
              }
            }

            html.push(Utils.sprintf('<li class="page-item page-next"><a class="page-link" href="#">%s</a></li>', this.options.paginationNextText), '</ul>', '</div>');
          }
          this.$pagination.html(html.join(''));

          if (!this.options.onlyInfoPagination) {
            $pageList = this.$pagination.find('.page-list a');
            $pre = this.$pagination.find('.page-pre');
            $next = this.$pagination.find('.page-next');
            $number = this.$pagination.find('.page-item').not('.page-next, .page-pre');

            if (this.options.smartDisplay) {
              if (this.totalPages <= 1) {
                this.$pagination.find('div.pagination').hide();
              }
              if (pageList.length < 2 || this.options.totalRows <= pageList[0]) {
                this.$pagination.find('span.page-list').hide();
              }

              // when data is empty, hide the pagination
              this.$pagination[this.getData().length ? 'show' : 'hide']();
            }

            if (!this.options.paginationLoop) {
              if (this.options.pageNumber === 1) {
                $pre.addClass('disabled');
              }
              if (this.options.pageNumber === this.totalPages) {
                $next.addClass('disabled');
              }
            }

            if ($allSelected) {
              this.options.pageSize = this.options.formatAllRows();
            }
            // removed the events for last and first, onPageNumber executeds the same logic
            $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
            $pre.off('click').on('click', $.proxy(this.onPagePre, this));
            $next.off('click').on('click', $.proxy(this.onPageNext, this));
            $number.off('click').on('click', $.proxy(this.onPageNumber, this));
          }
        }
      }, {
        key: 'updatePagination',
        value: function updatePagination(event) {
          // Fix #171: IE disabled button can be clicked bug.
          if (event && $(event.currentTarget).hasClass('disabled')) {
            return;
          }

          if (!this.options.maintainSelected) {
            this.resetRows();
          }

          this.initPagination();
          if (this.options.sidePagination === 'server') {
            this.initServer();
          } else {
            this.initBody();
          }

          this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
        }
      }, {
        key: 'onPageListChange',
        value: function onPageListChange(event) {
          event.preventDefault();
          var $this = $(event.currentTarget);

          $this.parent().addClass('active').siblings().removeClass('active');
          this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ? this.options.formatAllRows() : +$this.text();
          this.$toolbar.find('.page-size').text(this.options.pageSize);

          this.updatePagination(event);
          return false;
        }
      }, {
        key: 'onPagePre',
        value: function onPagePre(event) {
          event.preventDefault();
          if (this.options.pageNumber - 1 === 0) {
            this.options.pageNumber = this.options.totalPages;
          } else {
            this.options.pageNumber--;
          }
          this.updatePagination(event);
          return false;
        }
      }, {
        key: 'onPageNext',
        value: function onPageNext(event) {
          event.preventDefault();
          if (this.options.pageNumber + 1 > this.options.totalPages) {
            this.options.pageNumber = 1;
          } else {
            this.options.pageNumber++;
          }
          this.updatePagination(event);
          return false;
        }
      }, {
        key: 'onPageNumber',
        value: function onPageNumber(event) {
          event.preventDefault();
          if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
          }
          this.options.pageNumber = +$(event.currentTarget).text();
          this.updatePagination(event);
          return false;
        }
      }, {
        key: 'initRow',
        value: function initRow(item, i, data, parentDom) {
          var _this7 = this;

          var html = [];
          var style = {};
          var csses = [];
          var data_ = '';
          var attributes = {};
          var htmlAttributes = [];

          if (this.hiddenRows.includes(item)) {
            return;
          }

          style = Utils.calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

          if (style && style.css) {
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = Object.entries(style.css)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var _ref8 = _step9.value;

                var _ref9 = _slicedToArray(_ref8, 2);

                var key = _ref9[0];
                var value = _ref9[1];

                csses.push(key + ': ' + value);
              }
            } catch (err) {
              _didIteratorError9 = true;
              _iteratorError9 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                  _iterator9.return();
                }
              } finally {
                if (_didIteratorError9) {
                  throw _iteratorError9;
                }
              }
            }
          }

          attributes = Utils.calculateObjectValue(this.options, this.options.rowAttributes, [item, i], attributes);

          if (attributes) {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = Object.entries(attributes)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _ref10 = _step10.value;

                var _ref11 = _slicedToArray(_ref10, 2);

                var _key2 = _ref11[0];
                var _value2 = _ref11[1];

                htmlAttributes.push(_key2 + '="' + Utils.escapeHTML(_value2) + '"');
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          }

          if (item._data && !$.isEmptyObject(item._data)) {
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
              for (var _iterator11 = Object.entries(item._data)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _ref12 = _step11.value;

                var _ref13 = _slicedToArray(_ref12, 2);

                var k = _ref13[0];
                var v = _ref13[1];

                // ignore data-index
                if (k === 'index') {
                  return;
                }
                data_ += ' data-' + k + '="' + v + '"';
              }
            } catch (err) {
              _didIteratorError11 = true;
              _iteratorError11 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                  _iterator11.return();
                }
              } finally {
                if (_didIteratorError11) {
                  throw _iteratorError11;
                }
              }
            }
          }

          html.push('<tr', Utils.sprintf(' %s', htmlAttributes.length ? htmlAttributes.join(' ') : undefined), Utils.sprintf(' id="%s"', Array.isArray(item) ? undefined : item._id), Utils.sprintf(' class="%s"', style.classes || (Array.isArray(item) ? undefined : item._class)), ' data-index="' + i + '"', Utils.sprintf(' data-uniqueid="%s"', item[this.options.uniqueId]), Utils.sprintf('%s', data_), '>');

          if (this.options.cardView) {
            html.push('<td colspan="' + this.header.fields.length + '"><div class="card-views">');
          }

          if (!this.options.cardView && this.options.detailView) {
            html.push('<td>');

            if (Utils.calculateObjectValue(null, this.options.detailFilter, [i, item])) {
              html.push('\n            <a class="detail-icon" href="#">\n            <i class="' + this.options.iconsPrefix + ' ' + this.options.icons.detailOpen + '"></i>\n            </a>\n          ');
            }

            html.push('</td>');
          }

          this.header.fields.forEach(function (field, j) {
            var text = '';
            var value_ = Utils.getItemField(item, field, _this7.options.escape);
            var value = '';
            var type = '';
            var cellStyle = {};
            var id_ = '';
            var class_ = _this7.header.classes[j];
            var style_ = '';
            var data_ = '';
            var rowspan_ = '';
            var colspan_ = '';
            var title_ = '';
            var column = _this7.columns[j];

            if (_this7.fromHtml && typeof value_ === 'undefined') {
              if (!column.checkbox && !column.radio) {
                return;
              }
            }

            if (!column.visible) {
              return;
            }

            if (_this7.options.cardView && !column.cardVisible) {
              return;
            }

            if (column.escape) {
              value_ = Utils.escapeHTML(value_);
            }

            if (csses.concat([_this7.header.styles[j]]).length) {
              style_ = ' style="' + csses.concat([_this7.header.styles[j]]).join('; ') + '"';
            }
            // handle td's id and class
            if (item['_' + field + '_id']) {
              id_ = Utils.sprintf(' id="%s"', item['_' + field + '_id']);
            }
            if (item['_' + field + '_class']) {
              class_ = Utils.sprintf(' class="%s"', item['_' + field + '_class']);
            }
            if (item['_' + field + '_rowspan']) {
              rowspan_ = Utils.sprintf(' rowspan="%s"', item['_' + field + '_rowspan']);
            }
            if (item['_' + field + '_colspan']) {
              colspan_ = Utils.sprintf(' colspan="%s"', item['_' + field + '_colspan']);
            }
            if (item['_' + field + '_title']) {
              title_ = Utils.sprintf(' title="%s"', item['_' + field + '_title']);
            }
            cellStyle = Utils.calculateObjectValue(_this7.header, _this7.header.cellStyles[j], [value_, item, i, field], cellStyle);
            if (cellStyle.classes) {
              class_ = ' class="' + cellStyle.classes + '"';
            }
            if (cellStyle.css) {
              var csses_ = [];
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = Object.entries(cellStyle.css)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var _ref14 = _step12.value;

                  var _ref15 = _slicedToArray(_ref14, 2);

                  var _key3 = _ref15[0];
                  var _value3 = _ref15[1];

                  csses_.push(_key3 + ': ' + _value3);
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }

              style_ = ' style="' + csses_.concat(_this7.header.styles[j]).join('; ') + '"';
            }

            value = Utils.calculateObjectValue(column, _this7.header.formatters[j], [value_, item, i, field], value_);

            if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
              var _iteratorNormalCompletion13 = true;
              var _didIteratorError13 = false;
              var _iteratorError13 = undefined;

              try {
                for (var _iterator13 = Object.entries(item['_' + field + '_data'])[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                  var _ref16 = _step13.value;

                  var _ref17 = _slicedToArray(_ref16, 2);

                  var _k2 = _ref17[0];
                  var _v = _ref17[1];

                  // ignore data-index
                  if (_k2 === 'index') {
                    return;
                  }
                  data_ += ' data-' + _k2 + '="' + _v + '"';
                }
              } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion13 && _iterator13.return) {
                    _iterator13.return();
                  }
                } finally {
                  if (_didIteratorError13) {
                    throw _iteratorError13;
                  }
                }
              }
            }

            if (column.checkbox || column.radio) {
              type = column.checkbox ? 'checkbox' : type;
              type = column.radio ? 'radio' : type;

              var c = column['class'] || '';
              var isChecked = value === true || value_ || value && value.checked;
              var isDisabled = !column.checkboxEnabled || value && value.disabled;

              text = [_this7.options.cardView ? '<div class="card-view ' + c + '">' : '<td class="bs-checkbox ' + c + '">', '<input\n              data-index="' + i + '"\n              name="' + _this7.options.selectItemName + '"\n              type="' + type + '"\n              ' + Utils.sprintf('value="%s"', item[_this7.options.idField]) + '\n              ' + Utils.sprintf('checked="%s"', isChecked ? 'checked' : undefined) + '\n              ' + Utils.sprintf('disabled="%s"', isDisabled ? 'disabled' : undefined) + ' />', _this7.header.formatters[j] && typeof value === 'string' ? value : '', _this7.options.cardView ? '</div>' : '</td>'].join('');

              item[_this7.header.stateField] = value === true || !!value_ || value && value.checked;
            } else {
              value = typeof value === 'undefined' || value === null ? _this7.options.undefinedText : value;

              if (_this7.options.cardView) {
                var cardTitle = _this7.options.showHeader ? '<span class="title"' + style + '>' + Utils.getFieldTitle(_this7.columns, field) + '</span>' : '';

                text = '<div class="card-view">' + cardTitle + '<span class="value">' + value + '</span></div>';

                if (_this7.options.smartDisplay && value === '') {
                  text = '<div class="card-view"></div>';
                }
              } else {
                text = '<td' + id_ + class_ + style_ + data_ + rowspan_ + colspan_ + title_ + '>' + value + '</td>';
              }
            }

            html.push(text);
          });

          if (this.options.cardView) {
            html.push('</div></td>');
          }
          html.push('</tr>');

          return html.join('');
        }
      }, {
        key: 'initBody',
        value: function initBody(fixedScroll) {
          var _this8 = this;

          var data = this.getData();

          this.trigger('pre-body', data);

          this.$body = this.$el.find('>tbody');
          if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
          }

          // Fix #389 Bootstrap-table-flatJSON is not working
          if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
          }

          var trFragments = $(document.createDocumentFragment());
          var hasTr = false;

          for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var item = data[i];
            var tr = this.initRow(item, i, data, trFragments);
            hasTr = hasTr || !!tr;
            if (tr && typeof tr === 'string') {
              trFragments.append(tr);
            }
          }

          // show no records
          if (!hasTr) {
            this.$body.html('<tr class="no-records-found">' + Utils.sprintf('<td colspan="%s">%s</td>', this.$header.find('th').length, this.options.formatNoMatches()) + '</tr>');
          } else {
            this.$body.html(trFragments);
          }

          if (!fixedScroll) {
            this.scrollTo(0);
          }

          // click to select by column
          this.$body.find('> tr[data-index] > td').off('click dblclick').on('click dblclick', function (_ref18) {
            var currentTarget = _ref18.currentTarget,
                type = _ref18.type,
                target = _ref18.target;

            var $td = $(currentTarget);
            var $tr = $td.parent();
            var item = _this8.data[$tr.data('index')];
            var index = $td[0].cellIndex;
            var fields = _this8.getVisibleFields();
            var field = fields[_this8.options.detailView && !_this8.options.cardView ? index - 1 : index];
            var column = _this8.columns[_this8.fieldsColumnsIndex[field]];
            var value = Utils.getItemField(item, field, _this8.options.escape);

            if ($td.find('.detail-icon').length) {
              return;
            }

            _this8.trigger(type === 'click' ? 'click-cell' : 'dbl-click-cell', field, value, item, $td);
            _this8.trigger(type === 'click' ? 'click-row' : 'dbl-click-row', item, $tr, field);

            // if click to select - then trigger the checkbox/radio click
            if (type === 'click' && _this8.options.clickToSelect && column.clickToSelect && !_this8.options.ignoreClickToSelectOn(target)) {
              var $selectItem = $tr.find(Utils.sprintf('[name="%s"]', _this8.options.selectItemName));
              if ($selectItem.length) {
                $selectItem[0].click(); // #144: .trigger('click') bug
              }
            }
          });

          this.$body.find('> tr[data-index] > td > .detail-icon').off('click').on('click', function (e) {
            e.preventDefault();

            var $this = $(e.currentTarget); // Fix #980 Detail view, when searching, returns wrong row
            var $tr = $this.parent().parent();
            var index = $tr.data('index');
            var row = data[index];

            // remove and update
            if ($tr.next().is('tr.detail-view')) {
              $this.find('i').attr('class', Utils.sprintf('%s %s', _this8.options.iconsPrefix, _this8.options.icons.detailOpen));
              _this8.trigger('collapse-row', index, row, $tr.next());
              $tr.next().remove();
            } else {
              $this.find('i').attr('class', Utils.sprintf('%s %s', _this8.options.iconsPrefix, _this8.options.icons.detailClose));
              $tr.after(Utils.sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>', $tr.find('td').length));
              var $element = $tr.next().find('td');
              var content = Utils.calculateObjectValue(_this8.options, _this8.options.detailFormatter, [index, row, $element], '');
              if ($element.length === 1) {
                $element.append(content);
              }
              _this8.trigger('expand-row', index, row, $element);
            }
            _this8.resetView();
            return false;
          });

          this.$selectItem = this.$body.find(Utils.sprintf('[name="%s"]', this.options.selectItemName));
          this.$selectItem.off('click').on('click', function (e) {
            e.stopImmediatePropagation();

            var $this = $(e.currentTarget);
            _this8.check_($this.prop('checked'), $this.data('index'));
          });

          this.header.events.forEach(function (_events, i) {
            var events = _events;
            if (!events) {
              return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
              events = Utils.calculateObjectValue(null, events);
            }

            var field = _this8.header.fields[i];
            var fieldIndex = _this8.getVisibleFields().indexOf(field);

            if (fieldIndex === -1) {
              return;
            }

            if (_this8.options.detailView && !_this8.options.cardView) {
              fieldIndex += 1;
            }

            var _loop = function _loop(key, event) {
              _this8.$body.find('>tr:not(.no-records-found)').each(function (i, tr) {
                var $tr = $(tr);
                var $td = $tr.find(_this8.options.cardView ? '.card-view' : 'td').eq(fieldIndex);
                var index = key.indexOf(' ');
                var name = key.substring(0, index);
                var el = key.substring(index + 1);

                $td.find(el).off(name).on(name, function (e) {
                  var index = $tr.data('index');
                  var row = _this8.data[index];
                  var value = row[field];

                  event.apply(_this8, [e, value, row, index]);
                });
              });
            };

            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = Object.entries(events)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var _ref19 = _step14.value;

                var _ref20 = _slicedToArray(_ref19, 2);

                var key = _ref20[0];
                var event = _ref20[1];

                _loop(key, event);
              }
            } catch (err) {
              _didIteratorError14 = true;
              _iteratorError14 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion14 && _iterator14.return) {
                  _iterator14.return();
                }
              } finally {
                if (_didIteratorError14) {
                  throw _iteratorError14;
                }
              }
            }
          });

          this.updateSelected();
          this.resetView();

          this.trigger('post-body', data);
        }
      }, {
        key: 'initServer',
        value: function initServer(silent, query, url) {
          var _this9 = this;

          var data = {};
          var index = this.header.fields.indexOf(this.options.sortName);

          var params = {
            searchText: this.searchText,
            sortName: this.options.sortName,
            sortOrder: this.options.sortOrder
          };

          if (this.header.sortNames[index]) {
            params.sortName = this.header.sortNames[index];
          }

          if (this.options.pagination && this.options.sidePagination === 'server') {
            params.pageSize = this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize;
            params.pageNumber = this.options.pageNumber;
          }

          if (!(url || this.options.url) && !this.options.ajax) {
            return;
          }

          if (this.options.queryParamsType === 'limit') {
            params = {
              search: params.searchText,
              sort: params.sortName,
              order: params.sortOrder
            };

            if (this.options.pagination && this.options.sidePagination === 'server') {
              params.offset = this.options.pageSize === this.options.formatAllRows() ? 0 : this.options.pageSize * (this.options.pageNumber - 1);
              params.limit = this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize;
              if (params.limit === 0) {
                delete params.limit;
              }
            }
          }

          if (!$.isEmptyObject(this.filterColumnsPartial)) {
            params.filter = JSON.stringify(this.filterColumnsPartial, null);
          }

          data = Utils.calculateObjectValue(this.options, this.options.queryParams, [params], data);

          $.extend(data, query || {});

          // false to stop request
          if (data === false) {
            return;
          }

          if (!silent) {
            this.$tableLoading.show();
          }
          var request = $.extend({}, Utils.calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url: url || this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ? JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function success(_res) {
              var res = Utils.calculateObjectValue(_this9.options, _this9.options.responseHandler, [_res], _res);

              _this9.load(res);
              _this9.trigger('load-success', res);
              if (!silent) _this9.$tableLoading.hide();
            },
            error: function error(res) {
              var data = [];
              if (_this9.options.sidePagination === 'server') {
                data = {};
                data[_this9.options.totalField] = 0;
                data[_this9.options.dataField] = [];
              }
              _this9.load(data);
              _this9.trigger('load-error', res.status, res);
              if (!silent) _this9.$tableLoading.hide();
            }
          });

          if (this.options.ajax) {
            Utils.calculateObjectValue(this, this.options.ajax, [request], null);
          } else {
            if (this._xhr && this._xhr.readyState !== 4) {
              this._xhr.abort();
            }
            this._xhr = $.ajax(request);
          }
        }
      }, {
        key: 'initSearchText',
        value: function initSearchText() {
          if (this.options.search) {
            this.searchText = '';
            if (this.options.searchText !== '') {
              var $search = this.$toolbar.find('.search input');
              $search.val(this.options.searchText);
              this.onSearch({ currentTarget: $search, firedByInitSearchText: true });
            }
          }
        }
      }, {
        key: 'getCaret',
        value: function getCaret() {
          var _this10 = this;

          this.$header.find('th').each(function (i, th) {
            $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === _this10.options.sortName ? _this10.options.sortOrder : 'both');
          });
        }
      }, {
        key: 'updateSelected',
        value: function updateSelected() {
          var checkAll = this.$selectItem.filter(':enabled').length && this.$selectItem.filter(':enabled').length === this.$selectItem.filter(':enabled').filter(':checked').length;

          this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

          this.$selectItem.each(function (i, el) {
            $(el).closest('tr')[$(el).prop('checked') ? 'addClass' : 'removeClass']('selected');
          });
        }
      }, {
        key: 'updateRows',
        value: function updateRows() {
          var _this11 = this;

          this.$selectItem.each(function (i, el) {
            _this11.data[$(el).data('index')][_this11.header.stateField] = $(el).prop('checked');
          });
        }
      }, {
        key: 'resetRows',
        value: function resetRows() {
          var _iteratorNormalCompletion15 = true;
          var _didIteratorError15 = false;
          var _iteratorError15 = undefined;

          try {
            for (var _iterator15 = this.data[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
              var row = _step15.value;

              this.$selectAll.prop('checked', false);
              this.$selectItem.prop('checked', false);
              if (this.header.stateField) {
                row[this.header.stateField] = false;
              }
            }
          } catch (err) {
            _didIteratorError15 = true;
            _iteratorError15 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion15 && _iterator15.return) {
                _iterator15.return();
              }
            } finally {
              if (_didIteratorError15) {
                throw _iteratorError15;
              }
            }
          }

          this.initHiddenRows();
        }
      }, {
        key: 'trigger',
        value: function trigger(_name) {
          var _options;

          var name = _name + '.bs.table';

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key4 = 1; _key4 < _len2; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }

          (_options = this.options)[BootstrapTable.EVENTS[name]].apply(_options, args);
          this.$el.trigger($.Event(name), args);

          this.options.onAll(name, args);
          this.$el.trigger($.Event('all.bs.table'), [name, args]);
        }
      }, {
        key: 'resetHeader',
        value: function resetHeader() {
          // fix #61: the hidden table reset header bug.
          // fix bug: get $el.css('width') error sometime (height = 500)
          clearTimeout(this.timeoutId_);
          this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
        }
      }, {
        key: 'fitHeader',
        value: function fitHeader() {
          var _this12 = this;

          if (this.$el.is(':hidden')) {
            this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), 100);
            return;
          }
          var fixedBody = this.$tableBody.get(0);

          var scrollWidth = fixedBody.scrollWidth > fixedBody.clientWidth && fixedBody.scrollHeight > fixedBody.clientHeight + this.$header.outerHeight() ? Utils.getScrollBarWidth() : 0;

          this.$el.css('margin-top', -this.$header.outerHeight());

          var focused = $(':focus');
          if (focused.length > 0) {
            var $th = focused.parents('th');
            if ($th.length > 0) {
              var dataField = $th.attr('data-field');
              if (dataField !== undefined) {
                var $headerTh = this.$header.find('[data-field=\'' + dataField + '\']');
                if ($headerTh.length > 0) {
                  $headerTh.find(':input').addClass('focus-temp');
                }
              }
            }
          }

          this.$header_ = this.$header.clone(true, true);
          this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');
          this.$tableHeader.css({
            'margin-right': scrollWidth
          }).find('table').css('width', this.$el.outerWidth()).html('').attr('class', this.$el.attr('class')).append(this.$header_);

          var focusedTemp = $('.focus-temp:visible:eq(0)');
          if (focusedTemp.length > 0) {
            focusedTemp.focus();
            this.$header.find('.focus-temp').removeClass('focus-temp');
          }

          // fix bug: $.data() is not working as expected after $.append()
          this.$header.find('th[data-field]').each(function (i, el) {
            _this12.$header_.find(Utils.sprintf('th[data-field="%s"]', $(el).data('field'))).data($(el).data());
          });

          var visibleFields = this.getVisibleFields();
          var $ths = this.$header_.find('th');

          this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i, el) {
            var $this = $(el);
            var index = i;

            if (_this12.options.detailView && !_this12.options.cardView) {
              if (i === 0) {
                _this12.$header_.find('th.detail').find('.fht-cell').width($this.innerWidth());
              }
              index = i - 1;
            }

            if (index === -1) {
              return;
            }

            var $th = _this12.$header_.find(Utils.sprintf('th[data-field="%s"]', visibleFields[index]));
            if ($th.length > 1) {
              $th = $($ths[$this[0].cellIndex]);
            }

            var zoomWidth = $th.width() - $th.find('.fht-cell').width();
            $th.find('.fht-cell').width($this.innerWidth() - zoomWidth);
          });

          this.horizontalScroll();
          this.trigger('post-header');
        }
      }, {
        key: 'resetFooter',
        value: function resetFooter() {
          var data = this.getData();
          var html = [];

          if (!this.options.showFooter || this.options.cardView) {
            // do nothing
            return;
          }

          if (!this.options.cardView && this.options.detailView) {
            html.push('<td><div class="th-inner">&nbsp;</div><div class="fht-cell"></div></td>');
          }

          var _iteratorNormalCompletion16 = true;
          var _didIteratorError16 = false;
          var _iteratorError16 = undefined;

          try {
            for (var _iterator16 = this.columns[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              var column = _step16.value;

              var falign = '';

              var valign = '';
              var csses = [];
              var style = {};
              var class_ = Utils.sprintf(' class="%s"', column['class']);

              if (!column.visible) {
                return;
              }

              if (this.options.cardView && !column.cardVisible) {
                return;
              }

              falign = Utils.sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
              valign = Utils.sprintf('vertical-align: %s; ', column.valign);

              style = Utils.calculateObjectValue(null, this.options.footerStyle);

              if (style && style.css) {
                var _iteratorNormalCompletion17 = true;
                var _didIteratorError17 = false;
                var _iteratorError17 = undefined;

                try {
                  for (var _iterator17 = Object.keys(style.css)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var _ref21 = _step17.value;

                    var _ref22 = _slicedToArray(_ref21, 2);

                    var key = _ref22[0];
                    var value = _ref22[1];

                    csses.push(key + ': ' + value);
                  }
                } catch (err) {
                  _didIteratorError17 = true;
                  _iteratorError17 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion17 && _iterator17.return) {
                      _iterator17.return();
                    }
                  } finally {
                    if (_didIteratorError17) {
                      throw _iteratorError17;
                    }
                  }
                }
              }

              html.push('<td', class_, Utils.sprintf(' style="%s"', falign + valign + csses.concat().join('; ')), '>');
              html.push('<div class="th-inner">');

              html.push(Utils.calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');

              html.push('</div>');
              html.push('<div class="fht-cell"></div>');
              html.push('</div>');
              html.push('</td>');
            }
          } catch (err) {
            _didIteratorError16 = true;
            _iteratorError16 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion16 && _iterator16.return) {
                _iterator16.return();
              }
            } finally {
              if (_didIteratorError16) {
                throw _iteratorError16;
              }
            }
          }

          this.$tableFooter.find('tr').html(html.join(''));
          this.$tableFooter.show();
          clearTimeout(this.timeoutFooter_);
          this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), this.$el.is(':hidden') ? 100 : 0);
        }
      }, {
        key: 'fitFooter',
        value: function fitFooter() {
          clearTimeout(this.timeoutFooter_);
          if (this.$el.is(':hidden')) {
            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
            return;
          }

          var elWidth = this.$el.css('width');
          var scrollWidth = elWidth > this.$tableBody.width() ? Utils.getScrollBarWidth() : 0;

          this.$tableFooter.css({
            'margin-right': scrollWidth
          }).find('table').css('width', elWidth).attr('class', this.$el.attr('class'));

          var $footerTd = this.$tableFooter.find('td');

          this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i, el) {
            var $this = $(el);

            $footerTd.eq(i).find('.fht-cell').width($this.innerWidth());
          });

          this.horizontalScroll();
        }
      }, {
        key: 'horizontalScroll',
        value: function horizontalScroll() {
          var _this13 = this;

          // horizontal scroll event
          // TODO: it's probably better improving the layout than binding to scroll event

          this.trigger('scroll-body');
          this.$tableBody.off('scroll').on('scroll', function (_ref23) {
            var currentTarget = _ref23.currentTarget;

            if (_this13.options.showHeader && _this13.options.height) {
              _this13.$tableHeader.scrollLeft($(currentTarget).scrollLeft());
            }

            if (_this13.options.showFooter && !_this13.options.cardView) {
              _this13.$tableFooter.scrollLeft($(currentTarget).scrollLeft());
            }
          });
        }
      }, {
        key: 'toggleColumn',
        value: function toggleColumn(index, checked, needUpdate) {
          if (index === -1) {
            return;
          }
          this.columns[index].visible = checked;
          this.initHeader();
          this.initSearch();
          this.initPagination();
          this.initBody();

          if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
              $items.filter(Utils.sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
              $items.filter(':checked').prop('disabled', true);
            }
          }
        }
      }, {
        key: 'getVisibleFields',
        value: function getVisibleFields() {
          var visibleFields = [];

          var _iteratorNormalCompletion18 = true;
          var _didIteratorError18 = false;
          var _iteratorError18 = undefined;

          try {
            for (var _iterator18 = this.header.fields[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
              var field = _step18.value;

              var column = this.columns[this.fieldsColumnsIndex[field]];

              if (!column.visible) {
                continue;
              }
              visibleFields.push(field);
            }
          } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion18 && _iterator18.return) {
                _iterator18.return();
              }
            } finally {
              if (_didIteratorError18) {
                throw _iteratorError18;
              }
            }
          }

          return visibleFields;
        }
      }, {
        key: 'resetView',
        value: function resetView(params) {
          var padding = 0;

          if (params && params.height) {
            this.options.height = params.height;
          }

          this.$selectAll.prop('checked', this.$selectItem.length > 0 && this.$selectItem.length === this.$selectItem.filter(':checked').length);

          if (this.options.height) {
            var toolbarHeight = this.$toolbar.outerHeight(true);
            var paginationHeight = this.$pagination.outerHeight(true);
            var height = this.options.height - toolbarHeight - paginationHeight;

            this.$tableContainer.css('height', height + 'px');
          }

          if (this.options.cardView) {
            // remove the element css
            this.$el.css('margin-top', '0');
            this.$tableContainer.css('padding-bottom', '0');
            this.$tableFooter.hide();
            return;
          }

          if (this.options.showHeader && this.options.height) {
            this.$tableHeader.show();
            this.resetHeader();
            padding += this.$header.outerHeight();
          } else {
            this.$tableHeader.hide();
            this.trigger('post-header');
          }

          if (this.options.showFooter) {
            this.resetFooter();
            if (this.options.height) {
              padding += this.$tableFooter.outerHeight() + 1;
            }
          }

          // Assign the correct sortable arrow
          this.getCaret();
          this.$tableContainer.css('padding-bottom', padding + 'px');
          this.trigger('reset-view');
        }
      }, {
        key: 'getData',
        value: function getData(useCurrentPage) {
          var data = this.options.data;
          if (this.searchText || this.options.sortName || !$.isEmptyObject(this.filterColumns) || !$.isEmptyObject(this.filterColumnsPartial)) {
            data = this.data;
          }

          if (useCurrentPage) {
            return data.slice(this.pageFrom - 1, this.pageTo);
          }

          return data;
        }
      }, {
        key: 'load',
        value: function load(_data) {
          var fixedScroll = false;
          var data = _data;

          // #431: support pagination
          if (this.options.pagination && this.options.sidePagination === 'server') {
            this.options.totalRows = data[this.options.totalField];
          }

          fixedScroll = data.fixedScroll;
          data = Array.isArray(data) ? data : data[this.options.dataField];

          this.initData(data);
          this.initSearch();
          this.initPagination();
          this.initBody(fixedScroll);
        }
      }, {
        key: 'append',
        value: function append(data) {
          this.initData(data, 'append');
          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'prepend',
        value: function prepend(data) {
          this.initData(data, 'prepend');
          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'remove',
        value: function remove(params) {
          var len = this.options.data.length;
          var i = void 0;
          var row = void 0;

          if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
          }

          for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
              continue;
            }
            if (params.values.includes(row[params.field])) {
              this.options.data.splice(i, 1);
              if (this.options.sidePagination === 'server') {
                this.options.totalRows -= 1;
              }
            }
          }

          if (len === this.options.data.length) {
            return;
          }

          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'removeAll',
        value: function removeAll() {
          if (this.options.data.length > 0) {
            this.options.data.splice(0, this.options.data.length);
            this.initSearch();
            this.initPagination();
            this.initBody(true);
          }
        }
      }, {
        key: 'getRowByUniqueId',
        value: function getRowByUniqueId(_id) {
          var uniqueId = this.options.uniqueId;
          var len = this.options.data.length;
          var id = _id;
          var dataRow = null;
          var i = void 0;
          var row = void 0;
          var rowUniqueId = void 0;

          for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (row.hasOwnProperty(uniqueId)) {
              // uniqueId is a column
              rowUniqueId = row[uniqueId];
            } else if (row._data && row._data.hasOwnProperty(uniqueId)) {
              // uniqueId is a row data property
              rowUniqueId = row._data[uniqueId];
            } else {
              continue;
            }

            if (typeof rowUniqueId === 'string') {
              id = id.toString();
            } else if (typeof rowUniqueId === 'number') {
              if (Number(rowUniqueId) === rowUniqueId && rowUniqueId % 1 === 0) {
                id = parseInt(id);
              } else if (rowUniqueId === Number(rowUniqueId) && rowUniqueId !== 0) {
                id = parseFloat(id);
              }
            }

            if (rowUniqueId === id) {
              dataRow = row;
              break;
            }
          }

          return dataRow;
        }
      }, {
        key: 'removeByUniqueId',
        value: function removeByUniqueId(id) {
          var len = this.options.data.length;
          var row = this.getRowByUniqueId(id);

          if (row) {
            this.options.data.splice(this.options.data.indexOf(row), 1);
          }

          if (len === this.options.data.length) {
            return;
          }

          this.initSearch();
          this.initPagination();
          this.initBody(true);
        }
      }, {
        key: 'updateByUniqueId',
        value: function updateByUniqueId(params) {
          var allParams = Array.isArray(params) ? params : [params];

          var _iteratorNormalCompletion19 = true;
          var _didIteratorError19 = false;
          var _iteratorError19 = undefined;

          try {
            for (var _iterator19 = allParams[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
              var _params = _step19.value;

              if (!_params.hasOwnProperty('id') || !_params.hasOwnProperty('row')) {
                continue;
              }

              var rowId = this.options.data.indexOf(this.getRowByUniqueId(_params.id));

              if (rowId === -1) {
                continue;
              }
              $.extend(this.options.data[rowId], _params.row);
            }
          } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion19 && _iterator19.return) {
                _iterator19.return();
              }
            } finally {
              if (_didIteratorError19) {
                throw _iteratorError19;
              }
            }
          }

          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'refreshColumnTitle',
        value: function refreshColumnTitle(params) {
          if (!params.hasOwnProperty('field') || !params.hasOwnProperty('title')) {
            return;
          }

          this.columns[this.fieldsColumnsIndex[params.field]].title = this.options.escape ? Utils.escapeHTML(params.title) : params.title;

          if (this.columns[this.fieldsColumnsIndex[params.field]].visible) {
            var header = this.options.height !== undefined ? this.$tableHeader : this.$header;
            header.find('th[data-field]').each(function (i, el) {
              if ($(el).data('field') === params.field) {
                $($(el).find('.th-inner')[0]).text(params.title);
                return false;
              }
            });
          }
        }
      }, {
        key: 'insertRow',
        value: function insertRow(params) {
          if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
          }
          this.options.data.splice(params.index, 0, params.row);
          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'updateRow',
        value: function updateRow(params) {
          var allParams = Array.isArray(params) ? params : [params];

          var _iteratorNormalCompletion20 = true;
          var _didIteratorError20 = false;
          var _iteratorError20 = undefined;

          try {
            for (var _iterator20 = allParams[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
              var _params2 = _step20.value;

              if (!_params2.hasOwnProperty('index') || !_params2.hasOwnProperty('row')) {
                continue;
              }
              $.extend(this.options.data[_params2.index], _params2.row);
            }
          } catch (err) {
            _didIteratorError20 = true;
            _iteratorError20 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion20 && _iterator20.return) {
                _iterator20.return();
              }
            } finally {
              if (_didIteratorError20) {
                throw _iteratorError20;
              }
            }
          }

          this.initSearch();
          this.initPagination();
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'initHiddenRows',
        value: function initHiddenRows() {
          this.hiddenRows = [];
        }
      }, {
        key: 'showRow',
        value: function showRow(params) {
          this.toggleRow(params, true);
        }
      }, {
        key: 'hideRow',
        value: function hideRow(params) {
          this.toggleRow(params, false);
        }
      }, {
        key: 'toggleRow',
        value: function toggleRow(params, visible) {
          var row = void 0;

          if (params.hasOwnProperty('index')) {
            row = this.getData()[params.index];
          } else if (params.hasOwnProperty('uniqueId')) {
            row = this.getRowByUniqueId(params.uniqueId);
          }

          if (!row) {
            return;
          }

          var index = this.hiddenRows.indexOf(row);

          if (!visible && index === -1) {
            this.hiddenRows.push(row);
          } else if (visible && index > -1) {
            this.hiddenRows.splice(index, 1);
          }
          this.initBody(true);
        }
      }, {
        key: 'getHiddenRows',
        value: function getHiddenRows(show) {
          if (show) {
            this.initHiddenRows();
            this.initBody(true);
            return;
          }
          var data = this.getData();
          var rows = [];

          var _iteratorNormalCompletion21 = true;
          var _didIteratorError21 = false;
          var _iteratorError21 = undefined;

          try {
            for (var _iterator21 = data[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
              var row = _step21.value;

              if (this.hiddenRows.includes(row)) {
                rows.push(row);
              }
            }
          } catch (err) {
            _didIteratorError21 = true;
            _iteratorError21 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion21 && _iterator21.return) {
                _iterator21.return();
              }
            } finally {
              if (_didIteratorError21) {
                throw _iteratorError21;
              }
            }
          }

          this.hiddenRows = rows;
          return rows;
        }
      }, {
        key: 'mergeCells',
        value: function mergeCells(options) {
          var row = options.index;
          var col = this.getVisibleFields().indexOf(options.field);
          var rowspan = options.rowspan || 1;
          var colspan = options.colspan || 1;
          var i = void 0;
          var j = void 0;
          var $tr = this.$body.find('>tr');

          if (this.options.detailView && !this.options.cardView) {
            col += 1;
          }

          var $td = $tr.eq(row).find('>td').eq(col);

          if (row < 0 || col < 0 || row >= this.data.length) {
            return;
          }

          for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
              $tr.eq(i).find('>td').eq(j).hide();
            }
          }

          $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
        }
      }, {
        key: 'updateCell',
        value: function updateCell(params) {
          if (!params.hasOwnProperty('index') || !params.hasOwnProperty('field') || !params.hasOwnProperty('value')) {
            return;
          }
          this.data[params.index][params.field] = params.value;

          if (params.reinit === false) {
            return;
          }
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'updateCellById',
        value: function updateCellById(params) {
          var _this14 = this;

          if (!params.hasOwnProperty('id') || !params.hasOwnProperty('field') || !params.hasOwnProperty('value')) {
            return;
          }
          var allParams = Array.isArray(params) ? params : [params];

          allParams.forEach(function (_ref24) {
            var id = _ref24.id,
                field = _ref24.field,
                value = _ref24.value;

            var rowId = _this14.options.data.indexOf(_this14.getRowByUniqueId(id));

            if (rowId === -1) {
              return;
            }
            _this14.data[rowId][field] = value;
          });

          if (params.reinit === false) {
            return;
          }
          this.initSort();
          this.initBody(true);
        }
      }, {
        key: 'getOptions',
        value: function getOptions() {
          // Deep copy: remove data
          var options = $.extend({}, this.options);
          delete options.data;
          return $.extend(true, {}, options);
        }
      }, {
        key: 'getSelections',
        value: function getSelections() {
          var _this15 = this;

          // fix #2424: from html with checkbox
          return this.options.data.filter(function (row) {
            return row[_this15.header.stateField] === true;
          });
        }
      }, {
        key: 'getAllSelections',
        value: function getAllSelections() {
          var _this16 = this;

          return this.options.data.filter(function (row) {
            return row[_this16.header.stateField];
          });
        }
      }, {
        key: 'checkAll',
        value: function checkAll() {
          this.checkAll_(true);
        }
      }, {
        key: 'uncheckAll',
        value: function uncheckAll() {
          this.checkAll_(false);
        }
      }, {
        key: 'checkInvert',
        value: function checkInvert() {
          var $items = this.$selectItem.filter(':enabled');
          var checked = $items.filter(':checked');
          $items.each(function (i, el) {
            $(el).prop('checked', !$(el).prop('checked'));
          });
          this.updateRows();
          this.updateSelected();
          this.trigger('uncheck-some', checked);
          checked = this.getSelections();
          this.trigger('check-some', checked);
        }
      }, {
        key: 'checkAll_',
        value: function checkAll_(checked) {
          var rows = void 0;
          if (!checked) {
            rows = this.getSelections();
          }
          this.$selectAll.add(this.$selectAll_).prop('checked', checked);
          this.$selectItem.filter(':enabled').prop('checked', checked);
          this.updateRows();
          if (checked) {
            rows = this.getSelections();
          }
          this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
        }
      }, {
        key: 'check',
        value: function check(index) {
          this.check_(true, index);
        }
      }, {
        key: 'uncheck',
        value: function uncheck(index) {
          this.check_(false, index);
        }
      }, {
        key: 'check_',
        value: function check_(checked, index) {
          var $el = this.$selectItem.filter('[data-index="' + index + '"]');
          var row = this.data[index];

          if ($el.is(':radio') || this.options.singleSelect) {
            var _iteratorNormalCompletion22 = true;
            var _didIteratorError22 = false;
            var _iteratorError22 = undefined;

            try {
              for (var _iterator22 = this.options.data[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                var r = _step22.value;

                r[this.header.stateField] = false;
              }
            } catch (err) {
              _didIteratorError22 = true;
              _iteratorError22 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion22 && _iterator22.return) {
                  _iterator22.return();
                }
              } finally {
                if (_didIteratorError22) {
                  throw _iteratorError22;
                }
              }
            }

            this.$selectItem.filter(':checked').not($el).prop('checked', false);
          }

          row[this.header.stateField] = checked;
          $el.prop('checked', checked);
          this.updateSelected();
          this.trigger(checked ? 'check' : 'uncheck', this.data[index], $el);
        }
      }, {
        key: 'checkBy',
        value: function checkBy(obj) {
          this.checkBy_(true, obj);
        }
      }, {
        key: 'uncheckBy',
        value: function uncheckBy(obj) {
          this.checkBy_(false, obj);
        }
      }, {
        key: 'checkBy_',
        value: function checkBy_(checked, obj) {
          var _this17 = this;

          if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
            return;
          }

          var rows = [];
          this.options.data.forEach(function (row, i) {
            if (!row.hasOwnProperty(obj.field)) {
              return false;
            }
            if (obj.values.includes(row[obj.field])) {
              var $el = _this17.$selectItem.filter(':enabled').filter(Utils.sprintf('[data-index="%s"]', i)).prop('checked', checked);
              row[_this17.header.stateField] = checked;
              rows.push(row);
              _this17.trigger(checked ? 'check' : 'uncheck', row, $el);
            }
          });
          this.updateSelected();
          this.trigger(checked ? 'check-some' : 'uncheck-some', rows);
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this.$el.insertBefore(this.$container);
          $(this.options.toolbar).insertBefore(this.$el);
          this.$container.next().remove();
          this.$container.remove();
          this.$el.html(this.$el_.html()).css('margin-top', '0').attr('class', this.$el_.attr('class') || ''); // reset the class
        }
      }, {
        key: 'showLoading',
        value: function showLoading() {
          this.$tableLoading.show();
        }
      }, {
        key: 'hideLoading',
        value: function hideLoading() {
          this.$tableLoading.hide();
        }
      }, {
        key: 'togglePagination',
        value: function togglePagination() {
          this.options.pagination = !this.options.pagination;
          var button = this.$toolbar.find('button[name="paginationSwitch"] i');
          if (this.options.pagination) {
            button.attr('class', this.options.iconsPrefix + ' ' + this.options.icons.paginationSwitchDown);
          } else {
            button.attr('class', this.options.iconsPrefix + ' ' + this.options.icons.paginationSwitchUp);
          }
          this.updatePagination();
        }
      }, {
        key: 'toggleFullscreen',
        value: function toggleFullscreen() {
          this.$el.closest('.bootstrap-table').toggleClass('fullscreen');
        }
      }, {
        key: 'refresh',
        value: function refresh(params) {
          if (params && params.url) {
            this.options.url = params.url;
          }
          if (params && params.pageNumber) {
            this.options.pageNumber = params.pageNumber;
          }
          if (params && params.pageSize) {
            this.options.pageSize = params.pageSize;
          }
          this.initServer(params && params.silent, params && params.query, params && params.url);
          this.trigger('refresh', params);
        }
      }, {
        key: 'resetWidth',
        value: function resetWidth() {
          if (this.options.showHeader && this.options.height) {
            this.fitHeader();
          }
          if (this.options.showFooter && !this.options.cardView) {
            this.fitFooter();
          }
        }
      }, {
        key: 'showColumn',
        value: function showColumn(field) {
          this.toggleColumn(this.fieldsColumnsIndex[field], true, true);
        }
      }, {
        key: 'hideColumn',
        value: function hideColumn(field) {
          this.toggleColumn(this.fieldsColumnsIndex[field], false, true);
        }
      }, {
        key: 'getHiddenColumns',
        value: function getHiddenColumns() {
          return this.columns.filter(function (_ref25) {
            var visible = _ref25.visible;
            return !visible;
          });
        }
      }, {
        key: 'getVisibleColumns',
        value: function getVisibleColumns() {
          return this.columns.filter(function (_ref26) {
            var visible = _ref26.visible;
            return visible;
          });
        }
      }, {
        key: 'toggleAllColumns',
        value: function toggleAllColumns(visible) {
          var _iteratorNormalCompletion23 = true;
          var _didIteratorError23 = false;
          var _iteratorError23 = undefined;

          try {
            for (var _iterator23 = this.columns[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
              var column = _step23.value;

              column.visible = visible;
            }
          } catch (err) {
            _didIteratorError23 = true;
            _iteratorError23 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion23 && _iterator23.return) {
                _iterator23.return();
              }
            } finally {
              if (_didIteratorError23) {
                throw _iteratorError23;
              }
            }
          }

          this.initHeader();
          this.initSearch();
          this.initPagination();
          this.initBody();
          if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
              $items.filter(':checked').prop('disabled', true);
            }
          }
        }
      }, {
        key: 'showAllColumns',
        value: function showAllColumns() {
          this.toggleAllColumns(true);
        }
      }, {
        key: 'hideAllColumns',
        value: function hideAllColumns() {
          this.toggleAllColumns(false);
        }
      }, {
        key: 'filterBy',
        value: function filterBy(columns) {
          this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
          this.options.pageNumber = 1;
          this.initSearch();
          this.updatePagination();
        }
      }, {
        key: 'scrollTo',
        value: function scrollTo(_value) {
          if (typeof _value === 'undefined') {
            return this.$tableBody.scrollTop();
          }

          var value = 0;
          if (typeof _value === 'string' && _value === 'bottom') {
            value = this.$tableBody[0].scrollHeight;
          }
          this.$tableBody.scrollTop(value);
        }
      }, {
        key: 'getScrollPosition',
        value: function getScrollPosition() {
          return this.scrollTo();
        }
      }, {
        key: 'selectPage',
        value: function selectPage(page) {
          if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
          }
        }
      }, {
        key: 'prevPage',
        value: function prevPage() {
          if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
          }
        }
      }, {
        key: 'nextPage',
        value: function nextPage() {
          if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
          }
        }
      }, {
        key: 'toggleView',
        value: function toggleView() {
          this.options.cardView = !this.options.cardView;
          this.initHeader();
          // Fixed remove toolbar when click cardView button.
          // this.initToolbar();
          var $icon = this.$toolbar.find('button[name="toggle"] i');
          if (this.options.cardView) {
            $icon.removeClass(this.options.icons.toggleOff);
            $icon.addClass(this.options.icons.toggleOn);
          } else {
            $icon.removeClass(this.options.icons.toggleOn);
            $icon.addClass(this.options.icons.toggleOff);
          }
          this.initBody();
          this.trigger('toggle', this.options.cardView);
        }
      }, {
        key: 'refreshOptions',
        value: function refreshOptions(options) {
          // If the objects are equivalent then avoid the call of destroy / init methods
          if (Utils.compareObjects(this.options, options, true)) {
            return;
          }
          this.options = $.extend(this.options, options);
          this.trigger('refresh-options', this.options);
          this.destroy();
          this.init();
        }
      }, {
        key: 'resetSearch',
        value: function resetSearch(text) {
          var $search = this.$toolbar.find('.search input');
          $search.val(text || '');
          this.onSearch({ currentTarget: $search });
        }
      }, {
        key: 'expandRow_',
        value: function expandRow_(expand, index) {
          var $tr = this.$body.find(Utils.sprintf('> tr[data-index="%s"]', index));
          if ($tr.next().is('tr.detail-view') === !expand) {
            $tr.find('> td > .detail-icon').click();
          }
        }
      }, {
        key: 'expandRow',
        value: function expandRow(index) {
          this.expandRow_(true, index);
        }
      }, {
        key: 'collapseRow',
        value: function collapseRow(index) {
          this.expandRow_(false, index);
        }
      }, {
        key: 'expandAllRows',
        value: function expandAllRows(isSubTable) {
          var _this18 = this;

          if (isSubTable) {
            var $tr = this.$body.find(Utils.sprintf('> tr[data-index="%s"]', 0));
            var detailIcon = null;
            var executeInterval = false;
            var idInterval = -1;

            if (!$tr.next().is('tr.detail-view')) {
              $tr.find('> td > .detail-icon').click();
              executeInterval = true;
            } else if (!$tr.next().next().is('tr.detail-view')) {
              $tr.next().find('.detail-icon').click();
              executeInterval = true;
            }

            if (executeInterval) {
              try {
                idInterval = setInterval(function () {
                  detailIcon = _this18.$body.find('tr.detail-view').last().find('.detail-icon');
                  if (detailIcon.length > 0) {
                    detailIcon.click();
                  } else {
                    clearInterval(idInterval);
                  }
                }, 1);
              } catch (ex) {
                clearInterval(idInterval);
              }
            }
          } else {
            var trs = this.$body.children();
            for (var i = 0; i < trs.length; i++) {
              this.expandRow_(true, $(trs[i]).data('index'));
            }
          }
        }
      }, {
        key: 'collapseAllRows',
        value: function collapseAllRows(isSubTable) {
          if (isSubTable) {
            this.expandRow_(false, 0);
          } else {
            var trs = this.$body.children();
            for (var i = 0; i < trs.length; i++) {
              this.expandRow_(false, $(trs[i]).data('index'));
            }
          }
        }
      }, {
        key: 'updateFormatText',
        value: function updateFormatText(name, text) {
          if (this.options[Utils.sprintf('format%s', name)]) {
            if (typeof text === 'string') {
              this.options[Utils.sprintf('format%s', name)] = function () {
                return text;
              };
            } else if (typeof text === 'function') {
              this.options[Utils.sprintf('format%s', name)] = text;
            }
          }
          this.initToolbar();
          this.initPagination();
          this.initBody();
        }
      }]);

      return BootstrapTable;
    }();

    BootstrapTable.DEFAULTS = DEFAULTS;
    BootstrapTable.LOCALES = LOCALES;
    BootstrapTable.COLUMN_DEFAULTS = COLUMN_DEFAULTS;
    BootstrapTable.EVENTS = EVENTS;

    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = ['getOptions', 'getSelections', 'getAllSelections', 'getData', 'load', 'append', 'prepend', 'remove', 'removeAll', 'insertRow', 'updateRow', 'updateCell', 'updateByUniqueId', 'removeByUniqueId', 'getRowByUniqueId', 'showRow', 'hideRow', 'getHiddenRows', 'mergeCells', 'refreshColumnTitle', 'checkAll', 'uncheckAll', 'checkInvert', 'check', 'uncheck', 'checkBy', 'uncheckBy', 'refresh', 'resetView', 'resetWidth', 'destroy', 'showLoading', 'hideLoading', 'showColumn', 'hideColumn', 'getHiddenColumns', 'getVisibleColumns', 'showAllColumns', 'hideAllColumns', 'filterBy', 'scrollTo', 'getScrollPosition', 'selectPage', 'prevPage', 'nextPage', 'togglePagination', 'toggleView', 'refreshOptions', 'resetSearch', 'expandRow', 'collapseRow', 'expandAllRows', 'collapseAllRows', 'updateFormatText', 'updateCellById'];

    $.BootstrapTable = BootstrapTable;
    $.fn.bootstrapTable = function (option) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key5 = 1; _key5 < _len3; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      var value = void 0;

      this.each(function (i, el) {
        var data = $(el).data('bootstrap.table');
        var options = $.extend({}, BootstrapTable.DEFAULTS, $(el).data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);

        if (typeof option === 'string') {
          var _data2;

          if (!allowedMethods.includes(option)) {
            throw new Error('Unknown method: ' + option);
          }

          if (!data) {
            return;
          }

          value = (_data2 = data)[option].apply(_data2, args);

          if (option === 'destroy') {
            $(el).removeData('bootstrap.table');
          }
        }

        if (!data) {
          $(el).data('bootstrap.table', data = new $.BootstrapTable(el, options));
        }
      });

      return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;
    $.fn.bootstrapTable.utils = Utils;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
      $('[data-toggle="table"]').bootstrapTable();
    });
  })(jQuery);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

},["./node_modules/bootstrap-table/dist/bootstrap-table.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXRhYmxlL2Rpc3QvYm9vdHN0cmFwLXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OENBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCwrQkFBK0I7QUFDaEY7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLCtDQUErQyxnQkFBZ0I7QUFDL0Q7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixRQUFRO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLFFBQVE7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0Es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QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1GQUFtRixzRUFBc0U7QUFDeko7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEdBQThHO0FBQzlHO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRFQUE0RSxzRUFBc0U7QUFDbEo7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw0RkFBNEYsZUFBZTtBQUMzRztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUM7O0FBRWpDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyxFIiwiZmlsZSI6ImpzL2Jvb3RzdHJhcC10YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KCk7XG4gICAgZ2xvYmFsLmJvb3RzdHJhcFRhYmxlID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH1cblxuICB2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfTtcbiAgfSgpO1xuXG4gIHZhciBfc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgICAgdmFyIF9hcnIgPSBbXTtcbiAgICAgIHZhciBfbiA9IHRydWU7XG4gICAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICAgIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfZCA9IHRydWU7XG4gICAgICAgIF9lID0gZXJyO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9hcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7XG4gICAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KCk7XG5cbiAgZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJyMltpXSA9IGFycltpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFycjI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gICAgfVxuICB9XG5cbiAgdmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgfSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgfTtcblxuICAvKipcbiAgICogQGF1dGhvciB6aGl4aW4gd2VuIDx3ZW56aGl4aW4yMDEwQGdtYWlsLmNvbT5cbiAgICogdmVyc2lvbjogMS4xMy4xXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS93ZW56aGl4aW4vYm9vdHN0cmFwLXRhYmxlL1xuICAgKi9cblxuICAoZnVuY3Rpb24gKCQpIHtcbiAgICAvLyBUT09MUyBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFyIGJvb3RzdHJhcFZlcnNpb24gPSAzO1xuICAgIHRyeSB7XG4gICAgICB2YXIgcmF3VmVyc2lvbiA9ICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IuVkVSU0lPTjtcblxuICAgICAgLy8gT25seSB0cnkgdG8gcGFyc2UgVkVSU0lPTiBpZiBpcyBpcyBkZWZpbmVkLlxuICAgICAgLy8gSXQgaXMgdW5kZWZpbmVkIGluIG9sZGVyIHZlcnNpb25zIG9mIEJvb3RzdHJhcCAodGVzdGVkIHdpdGggMy4xLjEpLlxuICAgICAgaWYgKHJhd1ZlcnNpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBib290c3RyYXBWZXJzaW9uID0gcGFyc2VJbnQocmF3VmVyc2lvbiwgMTApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cblxuICAgIHZhciBib290c3RyYXAgPSB7XG4gICAgICAzOiB7XG4gICAgICAgIGljb25zUHJlZml4OiAnZ2x5cGhpY29uJyxcbiAgICAgICAgaWNvbnM6IHtcbiAgICAgICAgICBwYWdpbmF0aW9uU3dpdGNoRG93bjogJ2dseXBoaWNvbi1jb2xsYXBzZS1kb3duIGljb24tY2hldnJvbi1kb3duJyxcbiAgICAgICAgICBwYWdpbmF0aW9uU3dpdGNoVXA6ICdnbHlwaGljb24tY29sbGFwc2UtdXAgaWNvbi1jaGV2cm9uLXVwJyxcbiAgICAgICAgICByZWZyZXNoOiAnZ2x5cGhpY29uLXJlZnJlc2ggaWNvbi1yZWZyZXNoJyxcbiAgICAgICAgICB0b2dnbGVPZmY6ICdnbHlwaGljb24tbGlzdC1hbHQgaWNvbi1saXN0LWFsdCcsXG4gICAgICAgICAgdG9nZ2xlT246ICdnbHlwaGljb24tbGlzdC1hbHQgaWNvbi1saXN0LWFsdCcsXG4gICAgICAgICAgY29sdW1uczogJ2dseXBoaWNvbi10aCBpY29uLXRoJyxcbiAgICAgICAgICBkZXRhaWxPcGVuOiAnZ2x5cGhpY29uLXBsdXMgaWNvbi1wbHVzJyxcbiAgICAgICAgICBkZXRhaWxDbG9zZTogJ2dseXBoaWNvbi1taW51cyBpY29uLW1pbnVzJyxcbiAgICAgICAgICBmdWxsc2NyZWVuOiAnZ2x5cGhpY29uLWZ1bGxzY3JlZW4nXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICBidXR0b25zOiAnZGVmYXVsdCcsXG4gICAgICAgICAgcHVsbDogJ3B1bGwnXG4gICAgICAgIH0sXG4gICAgICAgIGh0bWw6IHtcbiAgICAgICAgICB0b29iYXJEcm9wZG93OiBbJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPicsICc8L3VsPiddLFxuICAgICAgICAgIHRvb2JhckRyb3Bkb3dJdGVtOiAnPGxpIHJvbGU9XCJtZW51aXRlbVwiPjxsYWJlbD4lczwvbGFiZWw+PC9saT4nLFxuICAgICAgICAgIHBhZ2VEcm9wZG93bjogWyc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj4nLCAnPC91bD4nXSxcbiAgICAgICAgICBwYWdlRHJvcGRvd25JdGVtOiAnPGxpIHJvbGU9XCJtZW51aXRlbVwiIGNsYXNzPVwiJXNcIj48YSBocmVmPVwiI1wiPiVzPC9hPjwvbGk+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgNDoge1xuICAgICAgICBpY29uc1ByZWZpeDogJ2ZhJyxcbiAgICAgICAgaWNvbnM6IHtcbiAgICAgICAgICBwYWdpbmF0aW9uU3dpdGNoRG93bjogJ2ZhLWNhcmV0LXNxdWFyZS1kb3duJyxcbiAgICAgICAgICBwYWdpbmF0aW9uU3dpdGNoVXA6ICdmYS1jYXJldC1zcXVhcmUtdXAnLFxuICAgICAgICAgIHJlZnJlc2g6ICdmYS1zeW5jJyxcbiAgICAgICAgICB0b2dnbGVPZmY6ICdmYS10b2dnbGUtb2ZmJyxcbiAgICAgICAgICB0b2dnbGVPbjogJ2ZhLXRvZ2dsZS1vbicsXG4gICAgICAgICAgY29sdW1uczogJ2ZhLXRoLWxpc3QnLFxuICAgICAgICAgIGRldGFpbE9wZW46ICdmYS1wbHVzJyxcbiAgICAgICAgICBkZXRhaWxDbG9zZTogJ2ZhLW1pbnVzJyxcbiAgICAgICAgICBmdWxsc2NyZWVuOiAnZmEtYXJyb3dzLWFsdCdcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgIGJ1dHRvbnM6ICdzZWNvbmRhcnknLFxuICAgICAgICAgIHB1bGw6ICdmbG9hdCdcbiAgICAgICAgfSxcbiAgICAgICAgaHRtbDoge1xuICAgICAgICAgIHRvb2JhckRyb3Bkb3c6IFsnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPicsICc8L2Rpdj4nXSxcbiAgICAgICAgICB0b29iYXJEcm9wZG93SXRlbTogJzxsYWJlbCBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIj4lczwvbGFiZWw+JyxcbiAgICAgICAgICBwYWdlRHJvcGRvd246IFsnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4nLCAnPC9kaXY+J10sXG4gICAgICAgICAgcGFnZURyb3Bkb3duSXRlbTogJzxhIGNsYXNzPVwiZHJvcGRvd24taXRlbSAlc1wiIGhyZWY9XCIjXCI+JXM8L2E+J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVtib290c3RyYXBWZXJzaW9uXTtcblxuICAgIHZhciBVdGlscyA9IHtcbiAgICAgIGJvb3RzdHJhcFZlcnNpb246IGJvb3RzdHJhcFZlcnNpb24sXG5cbiAgICAgIHNwcmludGY6IGZ1bmN0aW9uIHNwcmludGYoX3N0cikge1xuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmbGFnID0gdHJ1ZTtcbiAgICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAgIHZhciBzdHIgPSBfc3RyLnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJnID0gYXJnc1tpKytdO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmxhZyA/IHN0ciA6ICcnO1xuICAgICAgfSxcbiAgICAgIGdldEZpZWxkVGl0bGU6IGZ1bmN0aW9uIGdldEZpZWxkVGl0bGUobGlzdCwgdmFsdWUpIHtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gX3N0ZXAudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChpdGVtLmZpZWxkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS50aXRsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSxcbiAgICAgIHNldEZpZWxkSW5kZXg6IGZ1bmN0aW9uIHNldEZpZWxkSW5kZXgoY29sdW1ucykge1xuICAgICAgICB2YXIgdG90YWxDb2wgPSAwO1xuICAgICAgICB2YXIgZmxhZyA9IFtdO1xuXG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMiA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSBjb2x1bW5zWzBdW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gKF9zdGVwMiA9IF9pdGVyYXRvcjIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgY29sdW1uID0gX3N0ZXAyLnZhbHVlO1xuXG4gICAgICAgICAgICB0b3RhbENvbCArPSBjb2x1bW4uY29sc3BhbiB8fCAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IyID0gdHJ1ZTtcbiAgICAgICAgICBfaXRlcmF0b3JFcnJvcjIgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgJiYgX2l0ZXJhdG9yMi5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yMi5yZXR1cm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMikge1xuICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZmxhZ1tpXSA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG90YWxDb2w7IGorKykge1xuICAgICAgICAgICAgZmxhZ1tpXVtqXSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBjb2x1bW5zLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMyA9IHRydWU7XG4gICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMyA9IGZhbHNlO1xuICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMyA9IGNvbHVtbnNbX2ldW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAzOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24zID0gKF9zdGVwMyA9IF9pdGVyYXRvcjMubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjMgPSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciByID0gX3N0ZXAzLnZhbHVlO1xuXG4gICAgICAgICAgICAgIHZhciByb3dzcGFuID0gci5yb3dzcGFuIHx8IDE7XG4gICAgICAgICAgICAgIHZhciBjb2xzcGFuID0gci5jb2xzcGFuIHx8IDE7XG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IGZsYWdbX2ldLmluZGV4T2YoZmFsc2UpO1xuXG4gICAgICAgICAgICAgIGlmIChjb2xzcGFuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgci5maWVsZEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBmaWVsZCBpcyB1bmRlZmluZWQsIHVzZSBpbmRleCBpbnN0ZWFkXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByLmZpZWxkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgci5maWVsZCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcm93c3BhbjsgaysrKSB7XG4gICAgICAgICAgICAgICAgZmxhZ1tfaSArIGtdW2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IGNvbHNwYW47IF9rKyspIHtcbiAgICAgICAgICAgICAgICBmbGFnW19pXVtpbmRleCArIF9rXSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMyA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjMgPSBlcnI7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjMgJiYgX2l0ZXJhdG9yMy5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3IzLnJldHVybigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ2V0U2Nyb2xsQmFyV2lkdGg6IGZ1bmN0aW9uIGdldFNjcm9sbEJhcldpZHRoKCkge1xuICAgICAgICBpZiAodGhpcy5jYWNoZWRXaWR0aCA9PT0gbnVsbCkge1xuICAgICAgICAgIHZhciAkaW5uZXIgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZml4ZWQtdGFibGUtc2Nyb2xsLWlubmVyJyk7XG4gICAgICAgICAgdmFyICRvdXRlciA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdmaXhlZC10YWJsZS1zY3JvbGwtb3V0ZXInKTtcblxuICAgICAgICAgICRvdXRlci5hcHBlbmQoJGlubmVyKTtcbiAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKCRvdXRlcik7XG5cbiAgICAgICAgICB2YXIgdzEgPSAkaW5uZXJbMF0ub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgJG91dGVyLmNzcygnb3ZlcmZsb3cnLCAnc2Nyb2xsJyk7XG4gICAgICAgICAgdmFyIHcyID0gJGlubmVyWzBdLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgaWYgKHcxID09PSB3Mikge1xuICAgICAgICAgICAgdzIgPSAkb3V0ZXJbMF0uY2xpZW50V2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJG91dGVyLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuY2FjaGVkV2lkdGggPSB3MSAtIHcyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFdpZHRoO1xuICAgICAgfSxcbiAgICAgIGNhbGN1bGF0ZU9iamVjdFZhbHVlOiBmdW5jdGlvbiBjYWxjdWxhdGVPYmplY3RWYWx1ZShzZWxmLCBuYW1lLCBhcmdzLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBuYW1lO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBzdXBwb3J0IG9iai5mdW5jMS5mdW5jMlxuICAgICAgICAgIHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJy4nKTtcblxuICAgICAgICAgIGlmIChuYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmdW5jID0gd2luZG93O1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb240ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSBuYW1lc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwNDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNCA9IChfc3RlcDQgPSBfaXRlcmF0b3I0Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb240ID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBmID0gX3N0ZXA0LnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgZnVuYyA9IGZ1bmNbZl07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjQgPSB0cnVlO1xuICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjQgPSBlcnI7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjQgJiYgX2l0ZXJhdG9yNC5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjQucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjQpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVuYyA9IHdpbmRvd1tuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZnVuYyAhPT0gbnVsbCAmJiAodHlwZW9mIGZ1bmMgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGZ1bmMpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MgfHwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmdW5jICYmIHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiB0aGlzLnNwcmludGYuYXBwbHkodGhpcywgW25hbWVdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoYXJncykpKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNwcmludGYuYXBwbHkodGhpcywgW25hbWVdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoYXJncykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICB9LFxuICAgICAgY29tcGFyZU9iamVjdHM6IGZ1bmN0aW9uIGNvbXBhcmVPYmplY3RzKG9iamVjdEEsIG9iamVjdEIsIGNvbXBhcmVMZW5ndGgpIHtcbiAgICAgICAgdmFyIGFLZXlzID0gT2JqZWN0LmtleXMob2JqZWN0QSk7XG4gICAgICAgIHZhciBiS2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdEIpO1xuXG4gICAgICAgIGlmIChjb21wYXJlTGVuZ3RoICYmIGFLZXlzLmxlbmd0aCAhPT0gYktleXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb241ID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yNSA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3I1ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNSA9IGFLZXlzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA1OyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb241ID0gKF9zdGVwNSA9IF9pdGVyYXRvcjUubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjUgPSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gX3N0ZXA1LnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoYktleXMuaW5jbHVkZXMoa2V5KSAmJiBvYmplY3RBW2tleV0gIT09IG9iamVjdEJba2V5XSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjUgPSB0cnVlO1xuICAgICAgICAgIF9pdGVyYXRvckVycm9yNSA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNSAmJiBfaXRlcmF0b3I1LnJldHVybikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I1LnJldHVybigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3I1KSB7XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBlc2NhcGVIVE1MOiBmdW5jdGlvbiBlc2NhcGVIVE1MKHRleHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiMwMzk7JykucmVwbGFjZSgvYC9nLCAnJiN4NjA7Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9LFxuICAgICAgZ2V0UmVhbERhdGFBdHRyOiBmdW5jdGlvbiBnZXRSZWFsRGF0YUF0dHIoZGF0YUF0dHIpIHtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb242ID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yNiA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3I2ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNiA9IE9iamVjdC5lbnRyaWVzKGRhdGFBdHRyKVtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwNjsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNiA9IChfc3RlcDYgPSBfaXRlcmF0b3I2Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb242ID0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIF9yZWYgPSBfc3RlcDYudmFsdWU7XG5cbiAgICAgICAgICAgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpO1xuXG4gICAgICAgICAgICB2YXIgYXR0ciA9IF9yZWYyWzBdO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gX3JlZjJbMV07XG5cbiAgICAgICAgICAgIHZhciBhdXhBdHRyID0gYXR0ci5zcGxpdCgvKD89W0EtWl0pLykuam9pbignLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoYXV4QXR0ciAhPT0gYXR0cikge1xuICAgICAgICAgICAgICBkYXRhQXR0clthdXhBdHRyXSA9IHZhbHVlO1xuICAgICAgICAgICAgICBkZWxldGUgZGF0YUF0dHJbYXR0cl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjYgPSB0cnVlO1xuICAgICAgICAgIF9pdGVyYXRvckVycm9yNiA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNiAmJiBfaXRlcmF0b3I2LnJldHVybikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I2LnJldHVybigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3I2KSB7XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YUF0dHI7XG4gICAgICB9LFxuICAgICAgZ2V0SXRlbUZpZWxkOiBmdW5jdGlvbiBnZXRJdGVtRmllbGQoaXRlbSwgZmllbGQsIGVzY2FwZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGQgIT09ICdzdHJpbmcnIHx8IGl0ZW0uaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIGVzY2FwZSA/IHRoaXMuZXNjYXBlSFRNTChpdGVtW2ZpZWxkXSkgOiBpdGVtW2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9wcyA9IGZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNyA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjcgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yNyA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjcgPSBwcm9wc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwNzsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNyA9IChfc3RlcDcgPSBfaXRlcmF0b3I3Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb243ID0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHAgPSBfc3RlcDcudmFsdWU7XG5cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgJiYgdmFsdWVbcF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjcgPSB0cnVlO1xuICAgICAgICAgIF9pdGVyYXRvckVycm9yNyA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uNyAmJiBfaXRlcmF0b3I3LnJldHVybikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I3LnJldHVybigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3I3KSB7XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yNztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXNjYXBlID8gdGhpcy5lc2NhcGVIVE1MKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGlzSUVCcm93c2VyOiBmdW5jdGlvbiBpc0lFQnJvd3NlcigpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ01TSUUgJykgfHwgL1RyaWRlbnQuKnJ2OjExXFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBCT09UU1RSQVAgVEFCTEUgQ0xBU1MgREVGSU5JVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhciBERUZBVUxUUyA9IHtcbiAgICAgIGNsYXNzZXM6ICd0YWJsZSB0YWJsZS1ob3ZlcicsXG4gICAgICB0aGVhZENsYXNzZXM6ICcnLFxuICAgICAgc29ydENsYXNzOiB1bmRlZmluZWQsXG4gICAgICBsb2NhbGU6IHVuZGVmaW5lZCxcbiAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkVGV4dDogJy0nLFxuICAgICAgc29ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRPcmRlcjogJ2FzYycsXG4gICAgICBzb3J0U3RhYmxlOiBmYWxzZSxcbiAgICAgIHJlbWVtYmVyT3JkZXI6IGZhbHNlLFxuICAgICAgc3RyaXBlZDogZmFsc2UsXG4gICAgICBjb2x1bW5zOiBbW11dLFxuICAgICAgZGF0YTogW10sXG4gICAgICB0b3RhbEZpZWxkOiAndG90YWwnLFxuICAgICAgZGF0YUZpZWxkOiAncm93cycsXG4gICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgdXJsOiB1bmRlZmluZWQsXG4gICAgICBhamF4OiB1bmRlZmluZWQsXG4gICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgYWpheE9wdGlvbnM6IHt9LFxuICAgICAgcXVlcnlQYXJhbXM6IGZ1bmN0aW9uIHF1ZXJ5UGFyYW1zKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgfSxcblxuICAgICAgcXVlcnlQYXJhbXNUeXBlOiAnbGltaXQnLCByZXNwb25zZUhhbmRsZXI6IGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0sXG5cbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgb25seUluZm9QYWdpbmF0aW9uOiBmYWxzZSxcbiAgICAgIHBhZ2luYXRpb25Mb29wOiB0cnVlLFxuICAgICAgc2lkZVBhZ2luYXRpb246ICdjbGllbnQnLCAvLyBjbGllbnQgb3Igc2VydmVyXG4gICAgICB0b3RhbFJvd3M6IDAsIC8vIHNlcnZlciBzaWRlIG5lZWQgdG8gc2V0XG4gICAgICBwYWdlTnVtYmVyOiAxLFxuICAgICAgcGFnZVNpemU6IDEwLFxuICAgICAgcGFnZUxpc3Q6IFsxMCwgMjUsIDUwLCAxMDBdLFxuICAgICAgcGFnaW5hdGlvbkhBbGlnbjogJ3JpZ2h0JywgLy8gcmlnaHQsIGxlZnRcbiAgICAgIHBhZ2luYXRpb25WQWxpZ246ICdib3R0b20nLCAvLyBib3R0b20sIHRvcCwgYm90aFxuICAgICAgcGFnaW5hdGlvbkRldGFpbEhBbGlnbjogJ2xlZnQnLCAvLyByaWdodCwgbGVmdFxuICAgICAgcGFnaW5hdGlvblByZVRleHQ6ICcmbHNhcXVvOycsXG4gICAgICBwYWdpbmF0aW9uTmV4dFRleHQ6ICcmcnNhcXVvOycsXG4gICAgICBzZWFyY2g6IGZhbHNlLFxuICAgICAgc2VhcmNoT25FbnRlcktleTogZmFsc2UsXG4gICAgICBzdHJpY3RTZWFyY2g6IGZhbHNlLFxuICAgICAgc2VhcmNoQWxpZ246ICdyaWdodCcsXG4gICAgICBzZWxlY3RJdGVtTmFtZTogJ2J0U2VsZWN0SXRlbScsXG4gICAgICBzaG93SGVhZGVyOiB0cnVlLFxuICAgICAgc2hvd0Zvb3RlcjogZmFsc2UsXG4gICAgICBzaG93Q29sdW1uczogZmFsc2UsXG4gICAgICBzaG93UGFnaW5hdGlvblN3aXRjaDogZmFsc2UsXG4gICAgICBzaG93UmVmcmVzaDogZmFsc2UsXG4gICAgICBzaG93VG9nZ2xlOiBmYWxzZSxcbiAgICAgIHNob3dGdWxsc2NyZWVuOiBmYWxzZSxcbiAgICAgIHNtYXJ0RGlzcGxheTogdHJ1ZSxcbiAgICAgIGVzY2FwZTogZmFsc2UsXG4gICAgICBtaW5pbXVtQ291bnRDb2x1bW5zOiAxLFxuICAgICAgaWRGaWVsZDogdW5kZWZpbmVkLFxuICAgICAgdW5pcXVlSWQ6IHVuZGVmaW5lZCxcbiAgICAgIGNhcmRWaWV3OiBmYWxzZSxcbiAgICAgIGRldGFpbFZpZXc6IGZhbHNlLFxuICAgICAgZGV0YWlsRm9ybWF0dGVyOiBmdW5jdGlvbiBkZXRhaWxGb3JtYXR0ZXIoaW5kZXgsIHJvdykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9LFxuICAgICAgZGV0YWlsRmlsdGVyOiBmdW5jdGlvbiBkZXRhaWxGaWx0ZXIoaW5kZXgsIHJvdykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG5cbiAgICAgIHRyaW1PblNlYXJjaDogdHJ1ZSxcbiAgICAgIGNsaWNrVG9TZWxlY3Q6IGZhbHNlLFxuICAgICAgc2luZ2xlU2VsZWN0OiBmYWxzZSxcbiAgICAgIHRvb2xiYXI6IHVuZGVmaW5lZCxcbiAgICAgIHRvb2xiYXJBbGlnbjogJ2xlZnQnLFxuICAgICAgYnV0dG9uc1Rvb2xiYXI6IHVuZGVmaW5lZCxcbiAgICAgIGJ1dHRvbnNBbGlnbjogJ3JpZ2h0JyxcbiAgICAgIGNoZWNrYm94SGVhZGVyOiB0cnVlLFxuICAgICAgc29ydGFibGU6IHRydWUsXG4gICAgICBzaWxlbnRTb3J0OiB0cnVlLFxuICAgICAgbWFpbnRhaW5TZWxlY3RlZDogZmFsc2UsXG4gICAgICBzZWFyY2hUaW1lT3V0OiA1MDAsXG4gICAgICBzZWFyY2hUZXh0OiAnJyxcbiAgICAgIGljb25TaXplOiB1bmRlZmluZWQsXG4gICAgICBidXR0b25zQ2xhc3M6IGJvb3RzdHJhcC5jbGFzc2VzLmJ1dHRvbnMsXG4gICAgICBpY29uc1ByZWZpeDogYm9vdHN0cmFwLmljb25zUHJlZml4LCAvLyBnbHlwaGljb24gb3IgZmEoZm9udC1hd2Vzb21lKVxuICAgICAgaWNvbnM6IGJvb3RzdHJhcC5pY29ucyxcbiAgICAgIGN1c3RvbVNlYXJjaDogJC5ub29wLFxuICAgICAgY3VzdG9tU29ydDogJC5ub29wLFxuICAgICAgaWdub3JlQ2xpY2tUb1NlbGVjdE9uOiBmdW5jdGlvbiBpZ25vcmVDbGlja1RvU2VsZWN0T24oX3JlZjMpIHtcbiAgICAgICAgdmFyIHRhZ05hbWUgPSBfcmVmMy50YWdOYW1lO1xuXG4gICAgICAgIHJldHVybiBbJ0EnLCAnQlVUVE9OJ10uaW5jbHVkZXModGFnTmFtZSk7XG4gICAgICB9LFxuICAgICAgcm93U3R5bGU6IGZ1bmN0aW9uIHJvd1N0eWxlKHJvdywgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSxcbiAgICAgIHJvd0F0dHJpYnV0ZXM6IGZ1bmN0aW9uIHJvd0F0dHJpYnV0ZXMocm93LCBpbmRleCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9LFxuICAgICAgZm9vdGVyU3R5bGU6IGZ1bmN0aW9uIGZvb3RlclN0eWxlKHJvdywgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSxcbiAgICAgIG9uQWxsOiBmdW5jdGlvbiBvbkFsbChuYW1lLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrQ2VsbDogZnVuY3Rpb24gb25DbGlja0NlbGwoZmllbGQsIHZhbHVlLCByb3csICRlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkRibENsaWNrQ2VsbDogZnVuY3Rpb24gb25EYmxDbGlja0NlbGwoZmllbGQsIHZhbHVlLCByb3csICRlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrUm93OiBmdW5jdGlvbiBvbkNsaWNrUm93KGl0ZW0sICRlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkRibENsaWNrUm93OiBmdW5jdGlvbiBvbkRibENsaWNrUm93KGl0ZW0sICRlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblNvcnQ6IGZ1bmN0aW9uIG9uU29ydChuYW1lLCBvcmRlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25DaGVjazogZnVuY3Rpb24gb25DaGVjayhyb3cpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uVW5jaGVjazogZnVuY3Rpb24gb25VbmNoZWNrKHJvdykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25DaGVja0FsbDogZnVuY3Rpb24gb25DaGVja0FsbChyb3dzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblVuY2hlY2tBbGw6IGZ1bmN0aW9uIG9uVW5jaGVja0FsbChyb3dzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkNoZWNrU29tZTogZnVuY3Rpb24gb25DaGVja1NvbWUocm93cykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25VbmNoZWNrU29tZTogZnVuY3Rpb24gb25VbmNoZWNrU29tZShyb3dzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkxvYWRTdWNjZXNzOiBmdW5jdGlvbiBvbkxvYWRTdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uTG9hZEVycm9yOiBmdW5jdGlvbiBvbkxvYWRFcnJvcihzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uQ29sdW1uU3dpdGNoOiBmdW5jdGlvbiBvbkNvbHVtblN3aXRjaChmaWVsZCwgY2hlY2tlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25QYWdlQ2hhbmdlOiBmdW5jdGlvbiBvblBhZ2VDaGFuZ2UobnVtYmVyLCBzaXplKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblNlYXJjaDogZnVuY3Rpb24gb25TZWFyY2godGV4dCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25Ub2dnbGU6IGZ1bmN0aW9uIG9uVG9nZ2xlKGNhcmRWaWV3KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblByZUJvZHk6IGZ1bmN0aW9uIG9uUHJlQm9keShkYXRhKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblBvc3RCb2R5OiBmdW5jdGlvbiBvblBvc3RCb2R5KCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25Qb3N0SGVhZGVyOiBmdW5jdGlvbiBvblBvc3RIZWFkZXIoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvbkV4cGFuZFJvdzogZnVuY3Rpb24gb25FeHBhbmRSb3coaW5kZXgsIHJvdywgJGRldGFpbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25Db2xsYXBzZVJvdzogZnVuY3Rpb24gb25Db2xsYXBzZVJvdyhpbmRleCwgcm93KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBvblJlZnJlc2hPcHRpb25zOiBmdW5jdGlvbiBvblJlZnJlc2hPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG9uUmVmcmVzaDogZnVuY3Rpb24gb25SZWZyZXNoKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25SZXNldFZpZXc6IGZ1bmN0aW9uIG9uUmVzZXRWaWV3KCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25TY3JvbGxCb2R5OiBmdW5jdGlvbiBvblNjcm9sbEJvZHkoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIExPQ0FMRVMgPSB7fTtcbiAgICBMT0NBTEVTWydlbi1VUyddID0gTE9DQUxFUy5lbiA9IHtcbiAgICAgIGZvcm1hdExvYWRpbmdNZXNzYWdlOiBmdW5jdGlvbiBmb3JtYXRMb2FkaW5nTWVzc2FnZSgpIHtcbiAgICAgICAgcmV0dXJuICdMb2FkaW5nLCBwbGVhc2Ugd2FpdC4uLic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0UmVjb3Jkc1BlclBhZ2U6IGZ1bmN0aW9uIGZvcm1hdFJlY29yZHNQZXJQYWdlKHBhZ2VOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnNwcmludGYoJyVzIHJvd3MgcGVyIHBhZ2UnLCBwYWdlTnVtYmVyKTtcbiAgICAgIH0sXG4gICAgICBmb3JtYXRTaG93aW5nUm93czogZnVuY3Rpb24gZm9ybWF0U2hvd2luZ1Jvd3MocGFnZUZyb20sIHBhZ2VUbywgdG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5zcHJpbnRmKCdTaG93aW5nICVzIHRvICVzIG9mICVzIHJvd3MnLCBwYWdlRnJvbSwgcGFnZVRvLCB0b3RhbFJvd3MpO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdERldGFpbFBhZ2luYXRpb246IGZ1bmN0aW9uIGZvcm1hdERldGFpbFBhZ2luYXRpb24odG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5zcHJpbnRmKCdTaG93aW5nICVzIHJvd3MnLCB0b3RhbFJvd3MpO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdFNlYXJjaDogZnVuY3Rpb24gZm9ybWF0U2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gJ1NlYXJjaCc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0Tm9NYXRjaGVzOiBmdW5jdGlvbiBmb3JtYXROb01hdGNoZXMoKSB7XG4gICAgICAgIHJldHVybiAnTm8gbWF0Y2hpbmcgcmVjb3JkcyBmb3VuZCc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0UGFnaW5hdGlvblN3aXRjaDogZnVuY3Rpb24gZm9ybWF0UGFnaW5hdGlvblN3aXRjaCgpIHtcbiAgICAgICAgcmV0dXJuICdIaWRlL1Nob3cgcGFnaW5hdGlvbic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0UmVmcmVzaDogZnVuY3Rpb24gZm9ybWF0UmVmcmVzaCgpIHtcbiAgICAgICAgcmV0dXJuICdSZWZyZXNoJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRUb2dnbGU6IGZ1bmN0aW9uIGZvcm1hdFRvZ2dsZSgpIHtcbiAgICAgICAgcmV0dXJuICdUb2dnbGUnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdEZ1bGxzY3JlZW46IGZ1bmN0aW9uIGZvcm1hdEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIHJldHVybiAnRnVsbHNjcmVlbic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0Q29sdW1uczogZnVuY3Rpb24gZm9ybWF0Q29sdW1ucygpIHtcbiAgICAgICAgcmV0dXJuICdDb2x1bW5zJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRBbGxSb3dzOiBmdW5jdGlvbiBmb3JtYXRBbGxSb3dzKCkge1xuICAgICAgICByZXR1cm4gJ0FsbCc7XG4gICAgICB9XG4gICAgfTtcblxuICAgICQuZXh0ZW5kKERFRkFVTFRTLCBMT0NBTEVTWydlbi1VUyddKTtcblxuICAgIHZhciBDT0xVTU5fREVGQVVMVFMgPSB7XG4gICAgICByYWRpbzogZmFsc2UsXG4gICAgICBjaGVja2JveDogZmFsc2UsXG4gICAgICBjaGVja2JveEVuYWJsZWQ6IHRydWUsXG4gICAgICBmaWVsZDogdW5kZWZpbmVkLFxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgIHRpdGxlVG9vbHRpcDogdW5kZWZpbmVkLFxuICAgICAgJ2NsYXNzJzogdW5kZWZpbmVkLFxuICAgICAgYWxpZ246IHVuZGVmaW5lZCwgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxuICAgICAgaGFsaWduOiB1bmRlZmluZWQsIC8vIGxlZnQsIHJpZ2h0LCBjZW50ZXJcbiAgICAgIGZhbGlnbjogdW5kZWZpbmVkLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXG4gICAgICB2YWxpZ246IHVuZGVmaW5lZCwgLy8gdG9wLCBtaWRkbGUsIGJvdHRvbVxuICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgIG9yZGVyOiAnYXNjJywgLy8gYXNjLCBkZXNjXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgc3dpdGNoYWJsZTogdHJ1ZSxcbiAgICAgIGNsaWNrVG9TZWxlY3Q6IHRydWUsXG4gICAgICBmb3JtYXR0ZXI6IHVuZGVmaW5lZCxcbiAgICAgIGZvb3RlckZvcm1hdHRlcjogdW5kZWZpbmVkLFxuICAgICAgZXZlbnRzOiB1bmRlZmluZWQsXG4gICAgICBzb3J0ZXI6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICBjZWxsU3R5bGU6IHVuZGVmaW5lZCxcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBzZWFyY2hGb3JtYXR0ZXI6IHRydWUsXG4gICAgICBjYXJkVmlzaWJsZTogdHJ1ZSxcbiAgICAgIGVzY2FwZTogZmFsc2UsXG4gICAgICBzaG93U2VsZWN0VGl0bGU6IGZhbHNlXG4gICAgfTtcblxuICAgIHZhciBFVkVOVFMgPSB7XG4gICAgICAnYWxsLmJzLnRhYmxlJzogJ29uQWxsJyxcbiAgICAgICdjbGljay1jZWxsLmJzLnRhYmxlJzogJ29uQ2xpY2tDZWxsJyxcbiAgICAgICdkYmwtY2xpY2stY2VsbC5icy50YWJsZSc6ICdvbkRibENsaWNrQ2VsbCcsXG4gICAgICAnY2xpY2stcm93LmJzLnRhYmxlJzogJ29uQ2xpY2tSb3cnLFxuICAgICAgJ2RibC1jbGljay1yb3cuYnMudGFibGUnOiAnb25EYmxDbGlja1JvdycsXG4gICAgICAnc29ydC5icy50YWJsZSc6ICdvblNvcnQnLFxuICAgICAgJ2NoZWNrLmJzLnRhYmxlJzogJ29uQ2hlY2snLFxuICAgICAgJ3VuY2hlY2suYnMudGFibGUnOiAnb25VbmNoZWNrJyxcbiAgICAgICdjaGVjay1hbGwuYnMudGFibGUnOiAnb25DaGVja0FsbCcsXG4gICAgICAndW5jaGVjay1hbGwuYnMudGFibGUnOiAnb25VbmNoZWNrQWxsJyxcbiAgICAgICdjaGVjay1zb21lLmJzLnRhYmxlJzogJ29uQ2hlY2tTb21lJyxcbiAgICAgICd1bmNoZWNrLXNvbWUuYnMudGFibGUnOiAnb25VbmNoZWNrU29tZScsXG4gICAgICAnbG9hZC1zdWNjZXNzLmJzLnRhYmxlJzogJ29uTG9hZFN1Y2Nlc3MnLFxuICAgICAgJ2xvYWQtZXJyb3IuYnMudGFibGUnOiAnb25Mb2FkRXJyb3InLFxuICAgICAgJ2NvbHVtbi1zd2l0Y2guYnMudGFibGUnOiAnb25Db2x1bW5Td2l0Y2gnLFxuICAgICAgJ3BhZ2UtY2hhbmdlLmJzLnRhYmxlJzogJ29uUGFnZUNoYW5nZScsXG4gICAgICAnc2VhcmNoLmJzLnRhYmxlJzogJ29uU2VhcmNoJyxcbiAgICAgICd0b2dnbGUuYnMudGFibGUnOiAnb25Ub2dnbGUnLFxuICAgICAgJ3ByZS1ib2R5LmJzLnRhYmxlJzogJ29uUHJlQm9keScsXG4gICAgICAncG9zdC1ib2R5LmJzLnRhYmxlJzogJ29uUG9zdEJvZHknLFxuICAgICAgJ3Bvc3QtaGVhZGVyLmJzLnRhYmxlJzogJ29uUG9zdEhlYWRlcicsXG4gICAgICAnZXhwYW5kLXJvdy5icy50YWJsZSc6ICdvbkV4cGFuZFJvdycsXG4gICAgICAnY29sbGFwc2Utcm93LmJzLnRhYmxlJzogJ29uQ29sbGFwc2VSb3cnLFxuICAgICAgJ3JlZnJlc2gtb3B0aW9ucy5icy50YWJsZSc6ICdvblJlZnJlc2hPcHRpb25zJyxcbiAgICAgICdyZXNldC12aWV3LmJzLnRhYmxlJzogJ29uUmVzZXRWaWV3JyxcbiAgICAgICdyZWZyZXNoLmJzLnRhYmxlJzogJ29uUmVmcmVzaCcsXG4gICAgICAnc2Nyb2xsLWJvZHkuYnMudGFibGUnOiAnb25TY3JvbGxCb2R5J1xuICAgIH07XG5cbiAgICB2YXIgQm9vdHN0cmFwVGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmdW5jdGlvbiBCb290c3RyYXBUYWJsZShlbCwgb3B0aW9ucykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQm9vdHN0cmFwVGFibGUpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGVsXyA9IHRoaXMuJGVsLmNsb25lKCk7XG4gICAgICAgIHRoaXMudGltZW91dElkXyA9IDA7XG4gICAgICAgIHRoaXMudGltZW91dEZvb3Rlcl8gPSAwO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICBfY3JlYXRlQ2xhc3MoQm9vdHN0cmFwVGFibGUsIFt7XG4gICAgICAgIGtleTogJ2luaXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICB0aGlzLmluaXRMb2NhbGUoKTtcbiAgICAgICAgICB0aGlzLmluaXRDb250YWluZXIoKTtcbiAgICAgICAgICB0aGlzLmluaXRUYWJsZSgpO1xuICAgICAgICAgIHRoaXMuaW5pdEhlYWRlcigpO1xuICAgICAgICAgIHRoaXMuaW5pdERhdGEoKTtcbiAgICAgICAgICB0aGlzLmluaXRIaWRkZW5Sb3dzKCk7XG4gICAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XG4gICAgICAgICAgdGhpcy5pbml0VG9vbGJhcigpO1xuICAgICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoVGV4dCgpO1xuICAgICAgICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2luaXRMb2NhbGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdExvY2FsZSgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxvY2FsZSkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZXMgPSAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXM7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSB0aGlzLm9wdGlvbnMubG9jYWxlLnNwbGl0KC8tfF8vKTtcbiAgICAgICAgICAgIHBhcnRzWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFydHNbMV0pIHtcbiAgICAgICAgICAgICAgcGFydHNbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2NhbGVzW3RoaXMub3B0aW9ucy5sb2NhbGVdKSB7XG4gICAgICAgICAgICAgIC8vIGxvY2FsZSBhcyByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCBsb2NhbGVzW3RoaXMub3B0aW9ucy5sb2NhbGVdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJC5mbi5ib290c3RyYXBUYWJsZS5sb2NhbGVzW3BhcnRzLmpvaW4oJy0nKV0pIHtcbiAgICAgICAgICAgICAgLy8gbG9jYWxlIHdpdGggc2VwIHNldCB0byAtIChpbiBjYXNlIG9yaWdpbmFsIHdhcyBzcGVjaWZpZWQgd2l0aCBfKVxuICAgICAgICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnMsIGxvY2FsZXNbcGFydHMuam9pbignLScpXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlc1twYXJ0c1swXV0pIHtcbiAgICAgICAgICAgICAgLy8gc2hvcnQgbG9jYWxlIGxhbmd1YWdlIGNvZGUgKGkuZS4gJ2VuJylcbiAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCBsb2NhbGVzW3BhcnRzWzBdXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2luaXRDb250YWluZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdENvbnRhaW5lcigpIHtcbiAgICAgICAgICB2YXIgdG9wUGFnaW5hdGlvbiA9IFsndG9wJywgJ2JvdGgnXS5pbmNsdWRlcyh0aGlzLm9wdGlvbnMucGFnaW5hdGlvblZBbGlnbikgPyAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXBhZ2luYXRpb24gY2xlYXJmaXhcIj48L2Rpdj4nIDogJyc7XG4gICAgICAgICAgdmFyIGJvdHRvbVBhZ2luYXRpb24gPSBbJ2JvdHRvbScsICdib3RoJ10uaW5jbHVkZXModGhpcy5vcHRpb25zLnBhZ2luYXRpb25WQWxpZ24pID8gJzxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS1wYWdpbmF0aW9uXCI+PC9kaXY+JyA6ICcnO1xuXG4gICAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJCgnXFxuICAgICAgICA8ZGl2IGNsYXNzPVwiYm9vdHN0cmFwLXRhYmxlXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtdG9vbGJhclwiPjwvZGl2PlxcbiAgICAgICAgJyArIHRvcFBhZ2luYXRpb24gKyAnXFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtY29udGFpbmVyXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtaGVhZGVyXCI+PHRhYmxlPjwvdGFibGU+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtYm9keVwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWxvYWRpbmdcIj5cXG4gICAgICAgICcgKyB0aGlzLm9wdGlvbnMuZm9ybWF0TG9hZGluZ01lc3NhZ2UoKSArICdcXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtZm9vdGVyXCI+PHRhYmxlPjx0cj48L3RyPjwvdGFibGU+PC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgICcgKyBib3R0b21QYWdpbmF0aW9uICsgJ1xcbiAgICAgICAgPC9kaXY+XFxuICAgICAgJyk7XG5cbiAgICAgICAgICB0aGlzLiRjb250YWluZXIuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwpO1xuICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1jb250YWluZXInKTtcbiAgICAgICAgICB0aGlzLiR0YWJsZUhlYWRlciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtaGVhZGVyJyk7XG4gICAgICAgICAgdGhpcy4kdGFibGVCb2R5ID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1ib2R5Jyk7XG4gICAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1sb2FkaW5nJyk7XG4gICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWZvb3RlcicpO1xuICAgICAgICAgIC8vIGNoZWNraW5nIGlmIGN1c3RvbSB0YWJsZS10b29sYmFyIGV4aXN0cyBvciBub3RcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJ1dHRvbnNUb29sYmFyKSB7XG4gICAgICAgICAgICB0aGlzLiR0b29sYmFyID0gJCgnYm9keScpLmZpbmQodGhpcy5vcHRpb25zLmJ1dHRvbnNUb29sYmFyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtdG9vbGJhcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1wYWdpbmF0aW9uJyk7XG5cbiAgICAgICAgICB0aGlzLiR0YWJsZUJvZHkuYXBwZW5kKHRoaXMuJGVsKTtcbiAgICAgICAgICB0aGlzLiRjb250YWluZXIuYWZ0ZXIoJzxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3RhYmxlLXN0cmlwZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGFzc2VzLnNwbGl0KCcgJykuaW5jbHVkZXMoJ3RhYmxlLW5vLWJvcmRlcmVkJykpIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmFkZENsYXNzKCd0YWJsZS1uby1ib3JkZXJlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdpbml0VGFibGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFRhYmxlKCkge1xuICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgY29sdW1ucyA9IFtdO1xuICAgICAgICAgIHZhciBkYXRhID0gW107XG5cbiAgICAgICAgICB0aGlzLiRoZWFkZXIgPSB0aGlzLiRlbC5maW5kKCc+dGhlYWQnKTtcbiAgICAgICAgICBpZiAoIXRoaXMuJGhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlciA9ICQoJzx0aGVhZCBjbGFzcz1cIicgKyB0aGlzLm9wdGlvbnMudGhlYWRDbGFzc2VzICsgJ1wiPjwvdGhlYWQ+JykuYXBwZW5kVG8odGhpcy4kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndHInKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IFtdO1xuXG4gICAgICAgICAgICAkKGVsKS5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgIC8vICMyMDE0OiBnZXRGaWVsZEluZGV4IGFuZCBlbHNld2hlcmUgYXNzdW1lIHRoaXMgaXMgc3RyaW5nLCBjYXVzZXMgaXNzdWVzIGlmIG5vdFxuICAgICAgICAgICAgICBpZiAodHlwZW9mICQoZWwpLmRhdGEoJ2ZpZWxkJykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgJChlbCkuZGF0YSgnZmllbGQnLCAnJyArICQoZWwpLmRhdGEoJ2ZpZWxkJykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbHVtbi5wdXNoKCQuZXh0ZW5kKHt9LCB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICQoZWwpLmh0bWwoKSxcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAkKGVsKS5hdHRyKCdjbGFzcycpLFxuICAgICAgICAgICAgICAgIHRpdGxlVG9vbHRpcDogJChlbCkuYXR0cigndGl0bGUnKSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAkKGVsKS5hdHRyKCdyb3dzcGFuJykgPyArJChlbCkuYXR0cigncm93c3BhbicpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46ICQoZWwpLmF0dHIoJ2NvbHNwYW4nKSA/ICskKGVsKS5hdHRyKCdjb2xzcGFuJykgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfSwgJChlbCkuZGF0YSgpKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMub3B0aW9ucy5jb2x1bW5zWzBdKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbHVtbnMgPSBbdGhpcy5vcHRpb25zLmNvbHVtbnNdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID0gJC5leHRlbmQodHJ1ZSwgW10sIGNvbHVtbnMsIHRoaXMub3B0aW9ucy5jb2x1bW5zKTtcbiAgICAgICAgICB0aGlzLmNvbHVtbnMgPSBbXTtcbiAgICAgICAgICB0aGlzLmZpZWxkc0NvbHVtbnNJbmRleCA9IFtdO1xuXG4gICAgICAgICAgVXRpbHMuc2V0RmllbGRJbmRleCh0aGlzLm9wdGlvbnMuY29sdW1ucyk7XG5cbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb2x1bW5zLCBpKSB7XG4gICAgICAgICAgICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKF9jb2x1bW4sIGopIHtcbiAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9ICQuZXh0ZW5kKHt9LCBCb290c3RyYXBUYWJsZS5DT0xVTU5fREVGQVVMVFMsIF9jb2x1bW4pO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29sdW1uLmZpZWxkSW5kZXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY29sdW1uc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgX3RoaXMuZmllbGRzQ29sdW1uc0luZGV4W2NvbHVtbi5maWVsZF0gPSBjb2x1bW4uZmllbGRJbmRleDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuY29sdW1uc1tpXVtqXSA9IGNvbHVtbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaWYgb3B0aW9ucy5kYXRhIGlzIHNldHRpbmcsIGRvIG5vdCBwcm9jZXNzIHRib2R5IGRhdGFcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG0gPSBbXTtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCc+dGJvZHk+dHInKS5lYWNoKGZ1bmN0aW9uICh5LCBlbCkge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHt9O1xuXG4gICAgICAgICAgICAvLyBzYXZlIHRyJ3MgaWQsIGNsYXNzIGFuZCBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAgICAgcm93Ll9pZCA9ICQoZWwpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICByb3cuX2NsYXNzID0gJChlbCkuYXR0cignY2xhc3MnKTtcbiAgICAgICAgICAgIHJvdy5fZGF0YSA9IFV0aWxzLmdldFJlYWxEYXRhQXR0cigkKGVsKS5kYXRhKCkpO1xuXG4gICAgICAgICAgICAkKGVsKS5maW5kKCc+dGQnKS5lYWNoKGZ1bmN0aW9uIChfeCwgZWwpIHtcbiAgICAgICAgICAgICAgdmFyIGNzcGFuID0gKyQoZWwpLmF0dHIoJ2NvbHNwYW4nKSB8fCAxO1xuICAgICAgICAgICAgICB2YXIgcnNwYW4gPSArJChlbCkuYXR0cigncm93c3BhbicpIHx8IDE7XG4gICAgICAgICAgICAgIHZhciB4ID0gX3g7XG5cbiAgICAgICAgICAgICAgLy8gc2tpcCBhbHJlYWR5IG9jY3VwaWVkIGNlbGxzIGluIGN1cnJlbnQgcm93XG4gICAgICAgICAgICAgIGZvciAoOyBtW3ldICYmIG1beV1beF07IHgrKykge31cbiAgICAgICAgICAgICAgLy8gaWdub3JlXG5cblxuICAgICAgICAgICAgICAvLyBtYXJrIG1hdHJpeCBlbGVtZW50cyBvY2N1cGllZCBieSBjdXJyZW50IGNlbGwgd2l0aCB0cnVlXG4gICAgICAgICAgICAgIGZvciAodmFyIHR4ID0geDsgdHggPCB4ICsgY3NwYW47IHR4KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0eSA9IHk7IHR5IDwgeSArIHJzcGFuOyB0eSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIW1bdHldKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgbWlzc2luZyByb3dzXG4gICAgICAgICAgICAgICAgICAgIG1bdHldID0gW107XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBtW3R5XVt0eF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBmaWVsZCA9IF90aGlzLmNvbHVtbnNbeF0uZmllbGQ7XG5cbiAgICAgICAgICAgICAgcm93W2ZpZWxkXSA9ICQoZWwpLmh0bWwoKTtcbiAgICAgICAgICAgICAgLy8gc2F2ZSB0ZCdzIGlkLCBjbGFzcyBhbmQgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19pZCddID0gJChlbCkuYXR0cignaWQnKTtcbiAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19jbGFzcyddID0gJChlbCkuYXR0cignY2xhc3MnKTtcbiAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19yb3dzcGFuJ10gPSAkKGVsKS5hdHRyKCdyb3dzcGFuJyk7XG4gICAgICAgICAgICAgIHJvd1snXycgKyBmaWVsZCArICdfY29sc3BhbiddID0gJChlbCkuYXR0cignY29sc3BhbicpO1xuICAgICAgICAgICAgICByb3dbJ18nICsgZmllbGQgKyAnX3RpdGxlJ10gPSAkKGVsKS5hdHRyKCd0aXRsZScpO1xuICAgICAgICAgICAgICByb3dbJ18nICsgZmllbGQgKyAnX2RhdGEnXSA9IFV0aWxzLmdldFJlYWxEYXRhQXR0cigkKGVsKS5kYXRhKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmZyb21IdG1sID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdEhlYWRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0SGVhZGVyKCkge1xuICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgdmFyIHZpc2libGVDb2x1bW5zID0ge307XG4gICAgICAgICAgdmFyIGh0bWwgPSBbXTtcblxuICAgICAgICAgIHRoaXMuaGVhZGVyID0ge1xuICAgICAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgICAgIHN0eWxlczogW10sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIGZvcm1hdHRlcnM6IFtdLFxuICAgICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICAgIHNvcnRlcnM6IFtdLFxuICAgICAgICAgICAgc29ydE5hbWVzOiBbXSxcbiAgICAgICAgICAgIGNlbGxTdHlsZXM6IFtdLFxuICAgICAgICAgICAgc2VhcmNoYWJsZXM6IFtdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbHVtbnMsIGkpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRyPicpO1xuXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCAmJiAhX3RoaXMyLm9wdGlvbnMuY2FyZFZpZXcgJiYgX3RoaXMyLm9wdGlvbnMuZGV0YWlsVmlldykge1xuICAgICAgICAgICAgICBodG1sLnB1c2goJzx0aCBjbGFzcz1cImRldGFpbFwiIHJvd3NwYW49XCInICsgX3RoaXMyLm9wdGlvbnMuY29sdW1ucy5sZW5ndGggKyAnXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uLCBqKSB7XG4gICAgICAgICAgICAgIHZhciB0ZXh0ID0gJyc7XG5cbiAgICAgICAgICAgICAgdmFyIGhhbGlnbiA9ICcnOyAvLyBoZWFkZXIgYWxpZ24gc3R5bGVcblxuICAgICAgICAgICAgICB2YXIgYWxpZ24gPSAnJzsgLy8gYm9keSBhbGlnbiBzdHlsZVxuXG4gICAgICAgICAgICAgIHZhciBzdHlsZSA9ICcnO1xuICAgICAgICAgICAgICB2YXIgY2xhc3NfID0gVXRpbHMuc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGNvbHVtblsnY2xhc3MnXSk7XG4gICAgICAgICAgICAgIHZhciB1bml0V2lkdGggPSAncHgnO1xuICAgICAgICAgICAgICB2YXIgd2lkdGggPSBjb2x1bW4ud2lkdGg7XG5cbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi53aWR0aCAhPT0gdW5kZWZpbmVkICYmICFfdGhpczIub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29sdW1uLndpZHRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbi53aWR0aC5pbmNsdWRlcygnJScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRXaWR0aCA9ICclJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi53aWR0aCAmJiB0eXBlb2YgY29sdW1uLndpZHRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gY29sdW1uLndpZHRoLnJlcGxhY2UoJyUnLCAnJykucmVwbGFjZSgncHgnLCAnJyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBoYWxpZ24gPSBVdGlscy5zcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJywgY29sdW1uLmhhbGlnbiA/IGNvbHVtbi5oYWxpZ24gOiBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgICBhbGlnbiA9IFV0aWxzLnNwcmludGYoJ3RleHQtYWxpZ246ICVzOyAnLCBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgICBzdHlsZSA9IFV0aWxzLnNwcmludGYoJ3ZlcnRpY2FsLWFsaWduOiAlczsgJywgY29sdW1uLnZhbGlnbik7XG4gICAgICAgICAgICAgIHN0eWxlICs9IFV0aWxzLnNwcmludGYoJ3dpZHRoOiAlczsgJywgKGNvbHVtbi5jaGVja2JveCB8fCBjb2x1bW4ucmFkaW8pICYmICF3aWR0aCA/ICFjb2x1bW4uc2hvd1NlbGVjdFRpdGxlID8gJzM2cHgnIDogdW5kZWZpbmVkIDogd2lkdGggPyB3aWR0aCArIHVuaXRXaWR0aCA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2x1bW4uZmllbGRJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBfdGhpczIuaGVhZGVyLmZpZWxkc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uZmllbGQ7XG4gICAgICAgICAgICAgICAgX3RoaXMyLmhlYWRlci5zdHlsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gYWxpZ24gKyBzdHlsZTtcbiAgICAgICAgICAgICAgICBfdGhpczIuaGVhZGVyLmNsYXNzZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY2xhc3NfO1xuICAgICAgICAgICAgICAgIF90aGlzMi5oZWFkZXIuZm9ybWF0dGVyc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uZm9ybWF0dGVyO1xuICAgICAgICAgICAgICAgIF90aGlzMi5oZWFkZXIuZXZlbnRzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5ldmVudHM7XG4gICAgICAgICAgICAgICAgX3RoaXMyLmhlYWRlci5zb3J0ZXJzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5zb3J0ZXI7XG4gICAgICAgICAgICAgICAgX3RoaXMyLmhlYWRlci5zb3J0TmFtZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLnNvcnROYW1lO1xuICAgICAgICAgICAgICAgIF90aGlzMi5oZWFkZXIuY2VsbFN0eWxlc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uY2VsbFN0eWxlO1xuICAgICAgICAgICAgICAgIF90aGlzMi5oZWFkZXIuc2VhcmNoYWJsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLnNlYXJjaGFibGU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmNhcmRWaWV3ICYmICFjb2x1bW4uY2FyZFZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2aXNpYmxlQ29sdW1uc1tjb2x1bW4uZmllbGRdID0gY29sdW1uO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGgnICsgVXRpbHMuc3ByaW50ZignIHRpdGxlPVwiJXNcIicsIGNvbHVtbi50aXRsZVRvb2x0aXApLCBjb2x1bW4uY2hlY2tib3ggfHwgY29sdW1uLnJhZGlvID8gVXRpbHMuc3ByaW50ZignIGNsYXNzPVwiYnMtY2hlY2tib3ggJXNcIicsIGNvbHVtblsnY2xhc3MnXSB8fCAnJykgOiBjbGFzc18sIFV0aWxzLnNwcmludGYoJyBzdHlsZT1cIiVzXCInLCBoYWxpZ24gKyBzdHlsZSksIFV0aWxzLnNwcmludGYoJyByb3dzcGFuPVwiJXNcIicsIGNvbHVtbi5yb3dzcGFuKSwgVXRpbHMuc3ByaW50ZignIGNvbHNwYW49XCIlc1wiJywgY29sdW1uLmNvbHNwYW4pLCBVdGlscy5zcHJpbnRmKCcgZGF0YS1maWVsZD1cIiVzXCInLCBjb2x1bW4uZmllbGQpLFxuICAgICAgICAgICAgICAvLyBJZiBgY29sdW1uYCBpcyBub3QgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYHRoaXMub3B0aW9ucy5jb2x1bW5zWzBdYCwgdGhlbiBjbGFzc05hbWUgJ2RhdGEtbm90LWZpcnN0LXRoJyBzaG91bGQgYmUgYWRkZWQuXG4gICAgICAgICAgICAgIGogPT09IDAgJiYgaSA+IDAgPyAnIGRhdGEtbm90LWZpcnN0LXRoJyA6ICcnLCAnPicpO1xuXG4gICAgICAgICAgICAgIGh0bWwucHVzaChVdGlscy5zcHJpbnRmKCc8ZGl2IGNsYXNzPVwidGgtaW5uZXIgJXNcIj4nLCBfdGhpczIub3B0aW9ucy5zb3J0YWJsZSAmJiBjb2x1bW4uc29ydGFibGUgPyAnc29ydGFibGUgYm90aCcgOiAnJykpO1xuXG4gICAgICAgICAgICAgIHRleHQgPSBfdGhpczIub3B0aW9ucy5lc2NhcGUgPyBVdGlscy5lc2NhcGVIVE1MKGNvbHVtbi50aXRsZSkgOiBjb2x1bW4udGl0bGU7XG5cbiAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGV4dDtcbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi5jaGVja2JveCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzMi5vcHRpb25zLnNpbmdsZVNlbGVjdCAmJiBfdGhpczIub3B0aW9ucy5jaGVja2JveEhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgdGV4dCA9ICc8aW5wdXQgbmFtZT1cImJ0U2VsZWN0QWxsXCIgdHlwZT1cImNoZWNrYm94XCIgLz4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpczIuaGVhZGVyLnN0YXRlRmllbGQgPSBjb2x1bW4uZmllbGQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi5yYWRpbykge1xuICAgICAgICAgICAgICAgIHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICBfdGhpczIuaGVhZGVyLnN0YXRlRmllbGQgPSBjb2x1bW4uZmllbGQ7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm9wdGlvbnMuc2luZ2xlU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXRleHQgJiYgY29sdW1uLnNob3dTZWxlY3RUaXRsZSkge1xuICAgICAgICAgICAgICAgIHRleHQgKz0gdGl0bGU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBodG1sLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC90aD4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L3RyPicpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy4kaGVhZGVyLmh0bWwoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgICAgdGhpcy4kaGVhZGVyLmZpbmQoJ3RoW2RhdGEtZmllbGRdJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgICQoZWwpLmRhdGEodmlzaWJsZUNvbHVtbnNbJChlbCkuZGF0YSgnZmllbGQnKV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5vZmYoJ2NsaWNrJywgJy50aC1pbm5lcicpLm9uKCdjbGljaycsICcudGgtaW5uZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhJHRoaXMucGFyZW50KCkuaGFzQ2xhc3MoJ2JzLWNoZWNrYm94JykpIHtcbiAgICAgICAgICAgICAgaWYgKCR0aGlzLmNsb3Nlc3QoJy5ib290c3RyYXAtdGFibGUnKVswXSAhPT0gX3RoaXMyLiRjb250YWluZXJbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnNvcnRhYmxlICYmICR0aGlzLnBhcmVudCgpLmRhdGEoKS5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICBfdGhpczIub25Tb3J0KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy4kaGVhZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5vZmYoJ2tleXByZXNzJykub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5zb3J0YWJsZSAmJiAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgpLnNvcnRhYmxlKSB7XG4gICAgICAgICAgICAgIHZhciBjb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2g7XG4gICAgICAgICAgICAgIGlmIChjb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIC8vIEVudGVyIGtleWNvZGVcbiAgICAgICAgICAgICAgICBfdGhpczIub25Tb3J0KGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuYm9vdHN0cmFwLXRhYmxlJyk7XG4gICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0hlYWRlciB8fCB0aGlzLm9wdGlvbnMuY2FyZFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUhlYWRlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUxvYWRpbmcuY3NzKCd0b3AnLCAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsIHRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpICsgMSk7XG4gICAgICAgICAgICAvLyBBc3NpZ24gdGhlIGNvcnJlY3Qgc29ydGFibGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplLmJvb3RzdHJhcC10YWJsZScsICQucHJveHkodGhpcy5yZXNldFdpZHRoLCB0aGlzKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy4kc2VsZWN0QWxsID0gdGhpcy4kaGVhZGVyLmZpbmQoJ1tuYW1lPVwiYnRTZWxlY3RBbGxcIl0nKTtcbiAgICAgICAgICB0aGlzLiRzZWxlY3RBbGwub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChfcmVmNCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUYXJnZXQgPSBfcmVmNC5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgICAgICB2YXIgY2hlY2tlZCA9ICQoY3VycmVudFRhcmdldCkucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgX3RoaXMyW2NoZWNrZWQgPyAnY2hlY2tBbGwnIDogJ3VuY2hlY2tBbGwnXSgpO1xuICAgICAgICAgICAgX3RoaXMyLnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdEZvb3RlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0Rm9vdGVyKCkge1xuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dGb290ZXIgfHwgdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUZvb3Rlci5oaWRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlRm9vdGVyLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdERhdGEnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdERhdGEoZGF0YSwgdHlwZSkge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnYXBwZW5kJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YS5jb25jYXQoZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncHJlcGVuZCcpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gW10uY29uY2F0KGRhdGEpLmNvbmNhdCh0aGlzLm9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gZGF0YSB8fCB0aGlzLm9wdGlvbnMuZGF0YTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdpbml0U29ydCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0U29ydCgpIHtcbiAgICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5vcHRpb25zLnNvcnROYW1lO1xuICAgICAgICAgIHZhciBvcmRlciA9IHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPT09ICdkZXNjJyA/IC0xIDogMTtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmhlYWRlci5maWVsZHMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc29ydE5hbWUpO1xuICAgICAgICAgIHZhciB0aW1lb3V0SWQgPSAwO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0ICE9PSAkLm5vb3ApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0LmFwcGx5KHRoaXMsIFt0aGlzLm9wdGlvbnMuc29ydE5hbWUsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXJdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNvcnRTdGFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24gKHJvdywgaSkge1xuICAgICAgICAgICAgICAgIHJvdy5fcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kYXRhLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzMy5oZWFkZXIuc29ydE5hbWVzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBfdGhpczMuaGVhZGVyLnNvcnROYW1lc1tpbmRleF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIGFhID0gVXRpbHMuZ2V0SXRlbUZpZWxkKGEsIG5hbWUsIF90aGlzMy5vcHRpb25zLmVzY2FwZSk7XG4gICAgICAgICAgICAgIHZhciBiYiA9IFV0aWxzLmdldEl0ZW1GaWVsZChiLCBuYW1lLCBfdGhpczMub3B0aW9ucy5lc2NhcGUpO1xuICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBVdGlscy5jYWxjdWxhdGVPYmplY3RWYWx1ZShfdGhpczMuaGVhZGVyLCBfdGhpczMuaGVhZGVyLnNvcnRlcnNbaW5kZXhdLCBbYWEsIGJiLCBhLCBiXSk7XG5cbiAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMzLm9wdGlvbnMuc29ydFN0YWJsZSAmJiB2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuX3Bvc2l0aW9uIC0gYi5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIHZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gRml4ICMxNjE6IHVuZGVmaW5lZCBvciBudWxsIHN0cmluZyBzb3J0IGJ1Zy5cbiAgICAgICAgICAgICAgaWYgKGFhID09PSB1bmRlZmluZWQgfHwgYWEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhYSA9ICcnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChiYiA9PT0gdW5kZWZpbmVkIHx8IGJiID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYmIgPSAnJztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChfdGhpczMub3B0aW9ucy5zb3J0U3RhYmxlICYmIGFhID09PSBiYikge1xuICAgICAgICAgICAgICAgIGFhID0gYS5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgYmIgPSBiLl9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5fcG9zaXRpb24gLSBiLl9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIElGIGJvdGggdmFsdWVzIGFyZSBudW1lcmljLCBkbyBhIG51bWVyaWMgY29tcGFyaXNvblxuICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWMoYWEpICYmICQuaXNOdW1lcmljKGJiKSkge1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgbnVtZXJpY2FsIHZhbHVlcyBmb3JtIHN0cmluZyB0byBmbG9hdC5cbiAgICAgICAgICAgICAgICBhYSA9IHBhcnNlRmxvYXQoYWEpO1xuICAgICAgICAgICAgICAgIGJiID0gcGFyc2VGbG9hdChiYik7XG4gICAgICAgICAgICAgICAgaWYgKGFhIDwgYmIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXI7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoYWEgPT09IGJiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBub3QgYSBzdHJpbmcsIGNvbnZlcnQgdG8gc3RyaW5nXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgYWEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgYWEgPSBhYS50b1N0cmluZygpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGFhLmxvY2FsZUNvbXBhcmUoYmIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIC0xO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydENsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMy4kZWwucmVtb3ZlQ2xhc3MoX3RoaXMzLm9wdGlvbnMuc29ydENsYXNzKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfdGhpczMuJGhlYWRlci5maW5kKFV0aWxzLnNwcmludGYoJ1tkYXRhLWZpZWxkPVwiJXNcIl0nLCBfdGhpczMub3B0aW9ucy5zb3J0TmFtZSkuaW5kZXgoKSArIDEpO1xuICAgICAgICAgICAgICAgIF90aGlzMy4kZWwuZmluZChVdGlscy5zcHJpbnRmKCd0ciB0ZDpudGgtY2hpbGQoJXMpJywgaW5kZXgpKS5hZGRDbGFzcyhfdGhpczMub3B0aW9ucy5zb3J0Q2xhc3MpO1xuICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdvblNvcnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Tb3J0KF9yZWY1KSB7XG4gICAgICAgICAgdmFyIHR5cGUgPSBfcmVmNS50eXBlLFxuICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0ID0gX3JlZjUuY3VycmVudFRhcmdldDtcblxuICAgICAgICAgIHZhciAkdGhpcyA9IHR5cGUgPT09ICdrZXlwcmVzcycgPyAkKGN1cnJlbnRUYXJnZXQpIDogJChjdXJyZW50VGFyZ2V0KS5wYXJlbnQoKTtcbiAgICAgICAgICB2YXIgJHRoaXNfID0gdGhpcy4kaGVhZGVyLmZpbmQoJ3RoJykuZXEoJHRoaXMuaW5kZXgoKSk7XG5cbiAgICAgICAgICB0aGlzLiRoZWFkZXIuYWRkKHRoaXMuJGhlYWRlcl8pLmZpbmQoJ3NwYW4ub3JkZXInKS5yZW1vdmUoKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydE5hbWUgPT09ICR0aGlzLmRhdGEoJ2ZpZWxkJykpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPSB0aGlzLm9wdGlvbnMuc29ydE9yZGVyID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc29ydE5hbWUgPSAkdGhpcy5kYXRhKCdmaWVsZCcpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW1lbWJlck9yZGVyKSB7XG4gICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPSAkdGhpcy5kYXRhKCdvcmRlcicpID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnRPcmRlciA9IHRoaXMuY29sdW1uc1t0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFskdGhpcy5kYXRhKCdmaWVsZCcpXV0ub3JkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlcignc29ydCcsIHRoaXMub3B0aW9ucy5zb3J0TmFtZSwgdGhpcy5vcHRpb25zLnNvcnRPcmRlcik7XG5cbiAgICAgICAgICAkdGhpcy5hZGQoJHRoaXNfKS5kYXRhKCdvcmRlcicsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIpO1xuXG4gICAgICAgICAgLy8gQXNzaWduIHRoZSBjb3JyZWN0IHNvcnRhYmxlIGFycm93XG4gICAgICAgICAgdGhpcy5nZXRDYXJldCgpO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlcnZlcih0aGlzLm9wdGlvbnMuc2lsZW50U29ydCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdpbml0VG9vbGJhcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0VG9vbGJhcigpIHtcbiAgICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICAgIHZhciBodG1sID0gW107XG4gICAgICAgICAgdmFyIHRpbWVvdXRJZCA9IDA7XG4gICAgICAgICAgdmFyICRrZWVwT3BlbiA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgJHNlYXJjaCA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgc3dpdGNoYWJsZUNvdW50ID0gMDtcblxuICAgICAgICAgIGlmICh0aGlzLiR0b29sYmFyLmZpbmQoJy5icy1iYXJzJykuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoJCh0aGlzLm9wdGlvbnMudG9vbGJhcikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLiR0b29sYmFyLmh0bWwoJycpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMudG9vbGJhciA9PT0gJ3N0cmluZycgfHwgX3R5cGVvZih0aGlzLm9wdGlvbnMudG9vbGJhcikgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAkKFV0aWxzLnNwcmludGYoJzxkaXYgY2xhc3M9XCJicy1iYXJzICVzLSVzXCI+PC9kaXY+JywgYm9vdHN0cmFwLmNsYXNzZXMucHVsbCwgdGhpcy5vcHRpb25zLnRvb2xiYXJBbGlnbikpLmFwcGVuZFRvKHRoaXMuJHRvb2xiYXIpLmFwcGVuZCgkKHRoaXMub3B0aW9ucy50b29sYmFyKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2hvd0NvbHVtbnMsIHNob3dUb2dnbGUsIHNob3dSZWZyZXNoXG4gICAgICAgICAgaHRtbCA9IFtVdGlscy5zcHJpbnRmKCc8ZGl2IGNsYXNzPVwiY29sdW1ucyBjb2x1bW5zLSVzIGJ0bi1ncm91cCAlcy0lc1wiPicsIHRoaXMub3B0aW9ucy5idXR0b25zQWxpZ24sIGJvb3RzdHJhcC5jbGFzc2VzLnB1bGwsIHRoaXMub3B0aW9ucy5idXR0b25zQWxpZ24pXTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmljb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmljb25zID0gVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCwgdGhpcy5vcHRpb25zLmljb25zKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dQYWdpbmF0aW9uU3dpdGNoKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goVXRpbHMuc3ByaW50ZignPGJ1dHRvbiBjbGFzcz1cImJ0bicgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArICdcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIiBhcmlhLWxhYmVsPVwicGFnaW5hdGlvbiBTd2l0Y2hcIiB0aXRsZT1cIiVzXCI+JywgdGhpcy5vcHRpb25zLmZvcm1hdFBhZ2luYXRpb25Td2l0Y2goKSksIFV0aWxzLnNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMucGFnaW5hdGlvblN3aXRjaERvd24pLCAnPC9idXR0b24+Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cImZ1bGxzY3JlZW5cIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLnRvZ2dsZUZ1bGxzY3JlZW4sIHRoaXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dSZWZyZXNoKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goVXRpbHMuc3ByaW50ZignPGJ1dHRvbiBjbGFzcz1cImJ0bicgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArICdcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInJlZnJlc2hcIiBhcmlhLWxhYmVsPVwicmVmcmVzaFwiIHRpdGxlPVwiJXNcIj4nLCB0aGlzLm9wdGlvbnMuZm9ybWF0UmVmcmVzaCgpKSwgVXRpbHMuc3ByaW50ZignPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy5yZWZyZXNoKSwgJzwvYnV0dG9uPicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1RvZ2dsZSkge1xuICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4nICsgVXRpbHMuc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5idXR0b25zQ2xhc3MpICsgVXRpbHMuc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgKyAnXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJ0b2dnbGVcIiBhcmlhLWxhYmVsPVwidG9nZ2xlXCIgdGl0bGU9XCIlc1wiPicsIHRoaXMub3B0aW9ucy5mb3JtYXRUb2dnbGUoKSksIFV0aWxzLnNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMudG9nZ2xlT2ZmKSwgJzwvYnV0dG9uPicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGh0bWwucHVzaChVdGlscy5zcHJpbnRmKCc8YnV0dG9uIGNsYXNzPVwiYnRuJyArIFV0aWxzLnNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArIFV0aWxzLnNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICsgJ1wiIHR5cGU9XCJidXR0b25cIiBuYW1lPVwiZnVsbHNjcmVlblwiIGFyaWEtbGFiZWw9XCJmdWxsc2NyZWVuXCIgdGl0bGU9XCIlc1wiPicsIHRoaXMub3B0aW9ucy5mb3JtYXRGdWxsc2NyZWVuKCkpLCBVdGlscy5zcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPicsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLmZ1bGxzY3JlZW4pLCAnPC9idXR0b24+Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93Q29sdW1ucykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoJzxkaXYgY2xhc3M9XCJrZWVwLW9wZW4gYnRuLWdyb3VwXCIgdGl0bGU9XCIlc1wiPicsIHRoaXMub3B0aW9ucy5mb3JtYXRDb2x1bW5zKCkpLCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cImNvbHVtbnNcIiBjbGFzcz1cImJ0bicgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgKyBVdGlscy5zcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArICcgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPicsIFV0aWxzLnNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMuY29sdW1ucyksICcgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj4nLCAnPC9idXR0b24+JywgYm9vdHN0cmFwLmh0bWwudG9vYmFyRHJvcGRvd1swXSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb2x1bW4sIGkpIHtcbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi5yYWRpbyB8fCBjb2x1bW4uY2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoX3RoaXM0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgIWNvbHVtbi5jYXJkVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBjaGVja2VkID0gY29sdW1uLnZpc2libGUgPyAnIGNoZWNrZWQ9XCJjaGVja2VkXCInIDogJyc7XG5cbiAgICAgICAgICAgICAgaWYgKGNvbHVtbi5zd2l0Y2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoYm9vdHN0cmFwLmh0bWwudG9vYmFyRHJvcGRvd0l0ZW0sIFV0aWxzLnNwcmludGYoJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWZpZWxkPVwiJXNcIiB2YWx1ZT1cIiVzXCIlcz4gJXMnLCBjb2x1bW4uZmllbGQsIGksIGNoZWNrZWQsIGNvbHVtbi50aXRsZSkpKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2hhYmxlQ291bnQrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodG1sLnB1c2goYm9vdHN0cmFwLmh0bWwudG9vYmFyRHJvcGRvd1sxXSwgJzwvZGl2PicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG5cbiAgICAgICAgICAvLyBGaXggIzE4ODogdGhpcy5zaG93VG9vbGJhciBpcyBmb3IgZXh0ZW5zaW9uc1xuICAgICAgICAgIGlmICh0aGlzLnNob3dUb29sYmFyIHx8IGh0bWwubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5hcHBlbmQoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UGFnaW5hdGlvblN3aXRjaCkge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLnRvZ2dsZVBhZ2luYXRpb24sIHRoaXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dSZWZyZXNoKSB7XG4gICAgICAgICAgICB0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwicmVmcmVzaFwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMucmVmcmVzaCwgdGhpcykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1RvZ2dsZSkge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInRvZ2dsZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzNC50b2dnbGVWaWV3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICAka2VlcE9wZW4gPSB0aGlzLiR0b29sYmFyLmZpbmQoJy5rZWVwLW9wZW4nKTtcblxuICAgICAgICAgICAgaWYgKHN3aXRjaGFibGVDb3VudCA8PSB0aGlzLm9wdGlvbnMubWluaW11bUNvdW50Q29sdW1ucykge1xuICAgICAgICAgICAgICAka2VlcE9wZW4uZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAka2VlcE9wZW4uZmluZCgnbGknKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGtlZXBPcGVuLmZpbmQoJ2lucHV0Jykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChfcmVmNikge1xuICAgICAgICAgICAgICB2YXIgY3VycmVudFRhcmdldCA9IF9yZWY2LmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAgICAgICAgICAgdmFyICR0aGlzID0gJChjdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgICBfdGhpczQudG9nZ2xlQ29sdW1uKCR0aGlzLnZhbCgpLCAkdGhpcy5wcm9wKCdjaGVja2VkJyksIGZhbHNlKTtcbiAgICAgICAgICAgICAgX3RoaXM0LnRyaWdnZXIoJ2NvbHVtbi1zd2l0Y2gnLCAkdGhpcy5kYXRhKCdmaWVsZCcpLCAkdGhpcy5wcm9wKCdjaGVja2VkJykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWFyY2gpIHtcbiAgICAgICAgICAgIGh0bWwgPSBbXTtcbiAgICAgICAgICAgIGh0bWwucHVzaChVdGlscy5zcHJpbnRmKCc8ZGl2IGNsYXNzPVwiJXMtJXMgc2VhcmNoXCI+JywgYm9vdHN0cmFwLmNsYXNzZXMucHVsbCwgdGhpcy5vcHRpb25zLnNlYXJjaEFsaWduKSwgVXRpbHMuc3ByaW50ZignPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sJyArIFV0aWxzLnNwcmludGYoJyBpbnB1dC0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgKyAnXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIiVzXCI+JywgdGhpcy5vcHRpb25zLmZvcm1hdFNlYXJjaCgpKSwgJzwvZGl2PicpO1xuXG4gICAgICAgICAgICB0aGlzLiR0b29sYmFyLmFwcGVuZChodG1sLmpvaW4oJycpKTtcbiAgICAgICAgICAgICRzZWFyY2ggPSB0aGlzLiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKTtcbiAgICAgICAgICAgICRzZWFyY2gub2ZmKCdrZXl1cCBkcm9wIGJsdXInKS5vbigna2V5dXAgZHJvcCBibHVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgIGlmIChfdGhpczQub3B0aW9ucy5zZWFyY2hPbkVudGVyS2V5ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKFszNywgMzgsIDM5LCA0MF0uaW5jbHVkZXMoZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTsgLy8gZG9lc24ndCBtYXR0ZXIgaWYgaXQncyAwXG4gICAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzNC5vblNlYXJjaChldmVudCk7XG4gICAgICAgICAgICAgIH0sIF90aGlzNC5vcHRpb25zLnNlYXJjaFRpbWVPdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChVdGlscy5pc0lFQnJvd3NlcigpKSB7XG4gICAgICAgICAgICAgICRzZWFyY2gub2ZmKCdtb3VzZXVwJykub24oJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTsgLy8gZG9lc24ndCBtYXR0ZXIgaWYgaXQncyAwXG4gICAgICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczQub25TZWFyY2goZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0sIF90aGlzNC5vcHRpb25zLnNlYXJjaFRpbWVPdXQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnb25TZWFyY2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25TZWFyY2goX3JlZjcpIHtcbiAgICAgICAgICB2YXIgY3VycmVudFRhcmdldCA9IF9yZWY3LmN1cnJlbnRUYXJnZXQsXG4gICAgICAgICAgICAgIGZpcmVkQnlJbml0U2VhcmNoVGV4dCA9IF9yZWY3LmZpcmVkQnlJbml0U2VhcmNoVGV4dDtcblxuICAgICAgICAgIHZhciB0ZXh0ID0gJC50cmltKCQoY3VycmVudFRhcmdldCkudmFsKCkpO1xuXG4gICAgICAgICAgLy8gdHJpbSBzZWFyY2ggaW5wdXRcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRyaW1PblNlYXJjaCAmJiAkKGN1cnJlbnRUYXJnZXQpLnZhbCgpICE9PSB0ZXh0KSB7XG4gICAgICAgICAgICAkKGN1cnJlbnRUYXJnZXQpLnZhbCh0ZXh0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGV4dCA9PT0gdGhpcy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRleHQ7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNlYXJjaFRleHQgPSB0ZXh0O1xuXG4gICAgICAgICAgaWYgKCFmaXJlZEJ5SW5pdFNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgaWYgKGZpcmVkQnlJbml0U2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ2NsaWVudCcpIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3NlYXJjaCcsIHRleHQpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2luaXRTZWFyY2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFNlYXJjaCgpIHtcbiAgICAgICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gIT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVNlYXJjaCAhPT0gJC5ub29wKSB7XG4gICAgICAgICAgICAgIFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLmN1c3RvbVNlYXJjaCwgW3RoaXMuc2VhcmNoVGV4dF0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zZWFyY2hUZXh0ICYmICh0aGlzLm9wdGlvbnMuZXNjYXBlID8gVXRpbHMuZXNjYXBlSFRNTCh0aGlzLnNlYXJjaFRleHQpIDogdGhpcy5zZWFyY2hUZXh0KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIGYgPSAkLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zKSA/IG51bGwgOiB0aGlzLmZpbHRlckNvbHVtbnM7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZiA/IHRoaXMub3B0aW9ucy5kYXRhLmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZikge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZba2V5XSkgJiYgIWZba2V5XS5pbmNsdWRlcyhpdGVtW2tleV0pIHx8ICFBcnJheS5pc0FycmF5KGZba2V5XSkgJiYgaXRlbVtrZXldICE9PSBmW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KSA6IHRoaXMub3B0aW9ucy5kYXRhO1xuXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBzID8gdGhpcy5kYXRhLmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF90aGlzNS5oZWFkZXIuZmllbGRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpczUuaGVhZGVyLnNlYXJjaGFibGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gJC5pc051bWVyaWMoX3RoaXM1LmhlYWRlci5maWVsZHNbal0pID8gcGFyc2VJbnQoX3RoaXM1LmhlYWRlci5maWVsZHNbal0sIDEwKSA6IF90aGlzNS5oZWFkZXIuZmllbGRzW2pdO1xuICAgICAgICAgICAgICAgIHZhciBjb2x1bW4gPSBfdGhpczUuY29sdW1uc1tfdGhpczUuZmllbGRzQ29sdW1uc0luZGV4W2tleV1dO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb3BzID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBwcm9wcy5sZW5ndGg7IF9pMisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVtwcm9wc1tfaTJdXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbcHJvcHNbX2kyXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRml4ICMxNDI6IHJlc3BlY3Qgc2VhcmNoRm9yYW10dGVyIGJvb2xlYW5cbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uICYmIGNvbHVtbi5zZWFyY2hGb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUoY29sdW1uLCBfdGhpczUuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFt2YWx1ZSwgaXRlbSwgaV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuc3RyaWN0U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoJycgKyB2YWx1ZSkudG9Mb3dlckNhc2UoKSA9PT0gcykge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKCcnICsgdmFsdWUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocykpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KSA6IHRoaXMuZGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdFBhZ2luYXRpb24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFBhZ2luYXRpb24oKSB7XG4gICAgICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLmhpZGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5zaG93KCk7XG5cbiAgICAgICAgICB2YXIgaHRtbCA9IFtdO1xuICAgICAgICAgIHZhciAkYWxsU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgZnJvbSA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgdG8gPSB2b2lkIDA7XG4gICAgICAgICAgdmFyICRwYWdlTGlzdCA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgJHByZSA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgJG5leHQgPSB2b2lkIDA7XG4gICAgICAgICAgdmFyICRudW1iZXIgPSB2b2lkIDA7XG4gICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICB2YXIgcGFnZUxpc3QgPSB0aGlzLm9wdGlvbnMucGFnZUxpc3Q7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uICE9PSAnc2VydmVyJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRvdGFsUm93cyA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudG90YWxQYWdlcyA9IDA7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLnRvdGFsUm93cztcbiAgICAgICAgICAgICAgJGFsbFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMudG90YWxSb3dzKSB7XG4gICAgICAgICAgICAgIC8vIEZpeCAjNjY3IFRhYmxlIHdpdGggcGFnaW5hdGlvbixcbiAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgcGFnZXMgYW5kIGEgc2VhcmNoIHRoaXMgbWF0Y2hlcyB0byBvbmUgcGFnZSB0aHJvd3MgZXhjZXB0aW9uXG4gICAgICAgICAgICAgIHZhciBwYWdlTHN0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5wYWdlTGlzdCA9PT0gJ3N0cmluZycgPyB0aGlzLm9wdGlvbnMucGFnZUxpc3QucmVwbGFjZSgnWycsICcnKS5yZXBsYWNlKCddJywgJycpLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKSA6IHRoaXMub3B0aW9ucy5wYWdlTGlzdDtcbiAgICAgICAgICAgICAgaWYgKHBhZ2VMc3QuaW5jbHVkZXModGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgICRhbGxTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50b3RhbFBhZ2VzID0gfn4oKHRoaXMub3B0aW9ucy50b3RhbFJvd3MgLSAxKSAvIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSkgKyAxO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxQYWdlcyA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+IDAgJiYgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPiB0aGlzLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucGFnZUZyb20gPSAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSArIDE7XG4gICAgICAgICAgdGhpcy5wYWdlVG8gPSB0aGlzLm9wdGlvbnMucGFnZU51bWJlciAqIHRoaXMub3B0aW9ucy5wYWdlU2l6ZTtcbiAgICAgICAgICBpZiAodGhpcy5wYWdlVG8gPiB0aGlzLm9wdGlvbnMudG90YWxSb3dzKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VUbyA9IHRoaXMub3B0aW9ucy50b3RhbFJvd3M7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoJzxkaXYgY2xhc3M9XCIlcy0lcyBwYWdpbmF0aW9uLWRldGFpbFwiPicsIGJvb3RzdHJhcC5jbGFzc2VzLnB1bGwsIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uRGV0YWlsSEFsaWduKSwgJzxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbi1pbmZvXCI+JywgdGhpcy5vcHRpb25zLm9ubHlJbmZvUGFnaW5hdGlvbiA/IHRoaXMub3B0aW9ucy5mb3JtYXREZXRhaWxQYWdpbmF0aW9uKHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIDogdGhpcy5vcHRpb25zLmZvcm1hdFNob3dpbmdSb3dzKHRoaXMucGFnZUZyb20sIHRoaXMucGFnZVRvLCB0aGlzLm9wdGlvbnMudG90YWxSb3dzKSwgJzwvc3Bhbj4nKTtcblxuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLm9ubHlJbmZvUGFnaW5hdGlvbikge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8c3BhbiBjbGFzcz1cInBhZ2UtbGlzdFwiPicpO1xuXG4gICAgICAgICAgICB2YXIgcGFnZU51bWJlciA9IFtVdGlscy5zcHJpbnRmKCc8c3BhbiBjbGFzcz1cImJ0bi1ncm91cCAlc1wiPicsIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAndG9wJyB8fCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvblZBbGlnbiA9PT0gJ2JvdGgnID8gJ2Ryb3Bkb3duJyA6ICdkcm9wdXAnKSwgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuJyArIFV0aWxzLnNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArIFV0aWxzLnNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICsgJyBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+JywgJzxzcGFuIGNsYXNzPVwicGFnZS1zaXplXCI+JywgJGFsbFNlbGVjdGVkID8gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA6IHRoaXMub3B0aW9ucy5wYWdlU2l6ZSwgJzwvc3Bhbj4nLCAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+JywgJzwvYnV0dG9uPicsIGJvb3RzdHJhcC5odG1sLnBhZ2VEcm9wZG93blswXV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBhZ2VMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB2YXIgbGlzdCA9IHRoaXMub3B0aW9ucy5wYWdlTGlzdC5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJykucmVwbGFjZSgvIC9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICBwYWdlTGlzdCA9IFtdO1xuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjggPSB0cnVlO1xuICAgICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3I4ID0gZmFsc2U7XG4gICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjggPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I4ID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwODsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uOCA9IChfc3RlcDggPSBfaXRlcmF0b3I4Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb244ID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3N0ZXA4LnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICBwYWdlTGlzdC5wdXNoKHZhbHVlLnRvVXBwZXJDYXNlKCkgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkudG9VcHBlckNhc2UoKSB8fCB2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSAnVU5MSU1JVEVEJyA/IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgOiArdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3I4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjggPSBlcnI7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjggJiYgX2l0ZXJhdG9yOC5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yOC5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yOCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjg7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhZ2VMaXN0LmZvckVhY2goZnVuY3Rpb24gKHBhZ2UsIGkpIHtcbiAgICAgICAgICAgICAgaWYgKCFfdGhpczYub3B0aW9ucy5zbWFydERpc3BsYXkgfHwgaSA9PT0gMCB8fCBwYWdlTGlzdFtpIC0gMV0gPCBfdGhpczYub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmICgkYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHBhZ2UgPT09IF90aGlzNi5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA/ICdhY3RpdmUnIDogJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHBhZ2UgPT09IF90aGlzNi5vcHRpb25zLnBhZ2VTaXplID8gJ2FjdGl2ZScgOiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlci5wdXNoKFV0aWxzLnNwcmludGYoYm9vdHN0cmFwLmh0bWwucGFnZURyb3Bkb3duSXRlbSwgYWN0aXZlLCBwYWdlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcGFnZU51bWJlci5wdXNoKGJvb3RzdHJhcC5odG1sLnBhZ2VEcm9wZG93blsxXSArICc8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCh0aGlzLm9wdGlvbnMuZm9ybWF0UmVjb3Jkc1BlclBhZ2UocGFnZU51bWJlci5qb2luKCcnKSkpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+JywgVXRpbHMuc3ByaW50ZignPGRpdiBjbGFzcz1cIiVzLSVzIHBhZ2luYXRpb25cIj4nLCBib290c3RyYXAuY2xhc3Nlcy5wdWxsLCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvbkhBbGlnbiksICc8dWwgY2xhc3M9XCJwYWdpbmF0aW9uJyArIFV0aWxzLnNwcmludGYoJyBwYWdpbmF0aW9uLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArICdcIj4nLCBVdGlscy5zcHJpbnRmKCc8bGkgY2xhc3M9XCJwYWdlLWl0ZW0gcGFnZS1wcmVcIj48YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+JXM8L2E+PC9saT4nLCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvblByZVRleHQpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA8IDUpIHtcbiAgICAgICAgICAgICAgZnJvbSA9IDE7XG4gICAgICAgICAgICAgIHRvID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnJvbSA9IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyIC0gMjtcbiAgICAgICAgICAgICAgdG8gPSBmcm9tICsgNDtcbiAgICAgICAgICAgICAgaWYgKGZyb20gPCAxKSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IDE7XG4gICAgICAgICAgICAgICAgdG8gPSA1O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0byA+IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgIHRvID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICAgIGZyb20gPSB0byAtIDQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA2KSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSAzKSB7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLWZpcnN0JXNcIj4nLCB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9PT0gMSA/ICcgYWN0aXZlJyA6ICcnKSwgJzxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4nLCAxLCAnPC9hPicsICc8L2xpPicpO1xuXG4gICAgICAgICAgICAgICAgZnJvbSsrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID49IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT09IDQgfHwgdGhpcy50b3RhbFBhZ2VzID09PSA2IHx8IHRoaXMudG90YWxQYWdlcyA9PT0gNykge1xuICAgICAgICAgICAgICAgICAgZnJvbS0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBodG1sLnB1c2goJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLWZpcnN0LXNlcGFyYXRvciBkaXNhYmxlZFwiPicsICc8YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+Li4uPC9hPicsICc8L2xpPicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvLS07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA3KSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSB0aGlzLnRvdGFsUGFnZXMgLSAyKSB7XG4gICAgICAgICAgICAgICAgZnJvbS0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPT09IDYpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID49IHRoaXMudG90YWxQYWdlcyAtIDIpIHtcbiAgICAgICAgICAgICAgICB0bysrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA3KSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPT09IDcgfHwgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPj0gdGhpcy50b3RhbFBhZ2VzIC0gMykge1xuICAgICAgICAgICAgICAgIHRvKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gZnJvbTsgaSA8PSB0bzsgaSsrKSB7XG4gICAgICAgICAgICAgIGh0bWwucHVzaChVdGlscy5zcHJpbnRmKCc8bGkgY2xhc3M9XCJwYWdlLWl0ZW0lc1wiPicsIGkgPT09IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID8gJyBhY3RpdmUnIDogJycpLCAnPGEgY2xhc3M9XCJwYWdlLWxpbmtcIiBocmVmPVwiI1wiPicsIGksICc8L2E+JywgJzwvbGk+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPj0gOCkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPD0gdGhpcy50b3RhbFBhZ2VzIC0gNCkge1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGxpIGNsYXNzPVwicGFnZS1pdGVtIHBhZ2UtbGFzdC1zZXBhcmF0b3IgZGlzYWJsZWRcIj4nLCAnPGEgY2xhc3M9XCJwYWdlLWxpbmtcIiBocmVmPVwiI1wiPi4uLjwvYT4nLCAnPC9saT4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID49IDYpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyIDw9IHRoaXMudG90YWxQYWdlcyAtIDMpIHtcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goVXRpbHMuc3ByaW50ZignPGxpIGNsYXNzPVwicGFnZS1pdGVtIHBhZ2UtbGFzdCVzXCI+JywgdGhpcy50b3RhbFBhZ2VzID09PSB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA/ICcgYWN0aXZlJyA6ICcnKSwgJzxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4nLCB0aGlzLnRvdGFsUGFnZXMsICc8L2E+JywgJzwvbGk+Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLnNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLW5leHRcIj48YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+JXM8L2E+PC9saT4nLCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvbk5leHRUZXh0KSwgJzwvdWw+JywgJzwvZGl2PicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLmh0bWwoaHRtbC5qb2luKCcnKSk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5SW5mb1BhZ2luYXRpb24pIHtcbiAgICAgICAgICAgICRwYWdlTGlzdCA9IHRoaXMuJHBhZ2luYXRpb24uZmluZCgnLnBhZ2UtbGlzdCBhJyk7XG4gICAgICAgICAgICAkcHJlID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1wcmUnKTtcbiAgICAgICAgICAgICRuZXh0ID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1uZXh0Jyk7XG4gICAgICAgICAgICAkbnVtYmVyID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1pdGVtJykubm90KCcucGFnZS1uZXh0LCAucGFnZS1wcmUnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA8PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5maW5kKCdkaXYucGFnaW5hdGlvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocGFnZUxpc3QubGVuZ3RoIDwgMiB8fCB0aGlzLm9wdGlvbnMudG90YWxSb3dzIDw9IHBhZ2VMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5maW5kKCdzcGFuLnBhZ2UtbGlzdCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIHdoZW4gZGF0YSBpcyBlbXB0eSwgaGlkZSB0aGUgcGFnaW5hdGlvblxuICAgICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uW3RoaXMuZ2V0RGF0YSgpLmxlbmd0aCA/ICdzaG93JyA6ICdoaWRlJ10oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbkxvb3ApIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJHByZS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT09IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICRuZXh0LmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlbW92ZWQgdGhlIGV2ZW50cyBmb3IgbGFzdCBhbmQgZmlyc3QsIG9uUGFnZU51bWJlciBleGVjdXRlZHMgdGhlIHNhbWUgbG9naWNcbiAgICAgICAgICAgICRwYWdlTGlzdC5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLm9uUGFnZUxpc3RDaGFuZ2UsIHRoaXMpKTtcbiAgICAgICAgICAgICRwcmUub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy5vblBhZ2VQcmUsIHRoaXMpKTtcbiAgICAgICAgICAgICRuZXh0Lm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTmV4dCwgdGhpcykpO1xuICAgICAgICAgICAgJG51bWJlci5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLm9uUGFnZU51bWJlciwgdGhpcykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVQYWdpbmF0aW9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpIHtcbiAgICAgICAgICAvLyBGaXggIzE3MTogSUUgZGlzYWJsZWQgYnV0dG9uIGNhbiBiZSBjbGlja2VkIGJ1Zy5cbiAgICAgICAgICBpZiAoZXZlbnQgJiYgJChldmVudC5jdXJyZW50VGFyZ2V0KS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLm1haW50YWluU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRSb3dzKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudHJpZ2dlcigncGFnZS1jaGFuZ2UnLCB0aGlzLm9wdGlvbnMucGFnZU51bWJlciwgdGhpcy5vcHRpb25zLnBhZ2VTaXplKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdvblBhZ2VMaXN0Q2hhbmdlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uUGFnZUxpc3RDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAkdGhpcy5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gJHRoaXMudGV4dCgpLnRvVXBwZXJDYXNlKCkgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkudG9VcHBlckNhc2UoKSA/IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgOiArJHRoaXMudGV4dCgpO1xuICAgICAgICAgIHRoaXMuJHRvb2xiYXIuZmluZCgnLnBhZ2Utc2l6ZScpLnRleHQodGhpcy5vcHRpb25zLnBhZ2VTaXplKTtcblxuICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ29uUGFnZVByZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblBhZ2VQcmUoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciAtIDEgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gdGhpcy5vcHRpb25zLnRvdGFsUGFnZXM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyLS07XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ29uUGFnZU5leHQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25QYWdlTmV4dChldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyICsgMSA+IHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ29uUGFnZU51bWJlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblBhZ2VOdW1iZXIoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9PT0gKyQoZXZlbnQuY3VycmVudFRhcmdldCkudGV4dCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gKyQoZXZlbnQuY3VycmVudFRhcmdldCkudGV4dCgpO1xuICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2luaXRSb3cnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFJvdyhpdGVtLCBpLCBkYXRhLCBwYXJlbnREb20pIHtcbiAgICAgICAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgICAgICAgIHZhciBodG1sID0gW107XG4gICAgICAgICAgdmFyIHN0eWxlID0ge307XG4gICAgICAgICAgdmFyIGNzc2VzID0gW107XG4gICAgICAgICAgdmFyIGRhdGFfID0gJyc7XG4gICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgICB2YXIgaHRtbEF0dHJpYnV0ZXMgPSBbXTtcblxuICAgICAgICAgIGlmICh0aGlzLmhpZGRlblJvd3MuaW5jbHVkZXMoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHlsZSA9IFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLnJvd1N0eWxlLCBbaXRlbSwgaV0sIHN0eWxlKTtcblxuICAgICAgICAgIGlmIChzdHlsZSAmJiBzdHlsZS5jc3MpIHtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uOSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3I5ID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3I5ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I5ID0gT2JqZWN0LmVudHJpZXMoc3R5bGUuY3NzKVtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOTsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uOSA9IChfc3RlcDkgPSBfaXRlcmF0b3I5Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb245ID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBfcmVmOCA9IF9zdGVwOS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIHZhciBfcmVmOSA9IF9zbGljZWRUb0FycmF5KF9yZWY4LCAyKTtcblxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfcmVmOVswXTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBfcmVmOVsxXTtcblxuICAgICAgICAgICAgICAgIGNzc2VzLnB1c2goa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yOSA9IHRydWU7XG4gICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yOSA9IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uOSAmJiBfaXRlcmF0b3I5LnJldHVybikge1xuICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yOS5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yOSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGF0dHJpYnV0ZXMgPSBVdGlscy5jYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5yb3dBdHRyaWJ1dGVzLCBbaXRlbSwgaV0sIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTAgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMTAgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjEwID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMCA9IE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAxMDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTAgPSAoX3N0ZXAxMCA9IF9pdGVyYXRvcjEwLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xMCA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3JlZjEwID0gX3N0ZXAxMC52YWx1ZTtcblxuICAgICAgICAgICAgICAgIHZhciBfcmVmMTEgPSBfc2xpY2VkVG9BcnJheShfcmVmMTAsIDIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIF9rZXkyID0gX3JlZjExWzBdO1xuICAgICAgICAgICAgICAgIHZhciBfdmFsdWUyID0gX3JlZjExWzFdO1xuXG4gICAgICAgICAgICAgICAgaHRtbEF0dHJpYnV0ZXMucHVzaChfa2V5MiArICc9XCInICsgVXRpbHMuZXNjYXBlSFRNTChfdmFsdWUyKSArICdcIicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IxMCA9IHRydWU7XG4gICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yMTAgPSBlcnI7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjEwICYmIF9pdGVyYXRvcjEwLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTAucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjEwKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpdGVtLl9kYXRhICYmICEkLmlzRW1wdHlPYmplY3QoaXRlbS5fZGF0YSkpIHtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTEgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMTEgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjExID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMSA9IE9iamVjdC5lbnRyaWVzKGl0ZW0uX2RhdGEpW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAxMTsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTEgPSAoX3N0ZXAxMSA9IF9pdGVyYXRvcjExLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xMSA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3JlZjEyID0gX3N0ZXAxMS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIHZhciBfcmVmMTMgPSBfc2xpY2VkVG9BcnJheShfcmVmMTIsIDIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGsgPSBfcmVmMTNbMF07XG4gICAgICAgICAgICAgICAgdmFyIHYgPSBfcmVmMTNbMV07XG5cbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZGF0YS1pbmRleFxuICAgICAgICAgICAgICAgIGlmIChrID09PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRhdGFfICs9ICcgZGF0YS0nICsgayArICc9XCInICsgdiArICdcIic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjExID0gdHJ1ZTtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxMSA9IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTEgJiYgX2l0ZXJhdG9yMTEucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICBfaXRlcmF0b3IxMS5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMTEpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaHRtbC5wdXNoKCc8dHInLCBVdGlscy5zcHJpbnRmKCcgJXMnLCBodG1sQXR0cmlidXRlcy5sZW5ndGggPyBodG1sQXR0cmlidXRlcy5qb2luKCcgJykgOiB1bmRlZmluZWQpLCBVdGlscy5zcHJpbnRmKCcgaWQ9XCIlc1wiJywgQXJyYXkuaXNBcnJheShpdGVtKSA/IHVuZGVmaW5lZCA6IGl0ZW0uX2lkKSwgVXRpbHMuc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIHN0eWxlLmNsYXNzZXMgfHwgKEFycmF5LmlzQXJyYXkoaXRlbSkgPyB1bmRlZmluZWQgOiBpdGVtLl9jbGFzcykpLCAnIGRhdGEtaW5kZXg9XCInICsgaSArICdcIicsIFV0aWxzLnNwcmludGYoJyBkYXRhLXVuaXF1ZWlkPVwiJXNcIicsIGl0ZW1bdGhpcy5vcHRpb25zLnVuaXF1ZUlkXSksIFV0aWxzLnNwcmludGYoJyVzJywgZGF0YV8pLCAnPicpO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGQgY29sc3Bhbj1cIicgKyB0aGlzLmhlYWRlci5maWVsZHMubGVuZ3RoICsgJ1wiPjxkaXYgY2xhc3M9XCJjYXJkLXZpZXdzXCI+Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY2FyZFZpZXcgJiYgdGhpcy5vcHRpb25zLmRldGFpbFZpZXcpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkPicpO1xuXG4gICAgICAgICAgICBpZiAoVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCwgdGhpcy5vcHRpb25zLmRldGFpbEZpbHRlciwgW2ksIGl0ZW1dKSkge1xuICAgICAgICAgICAgICBodG1sLnB1c2goJ1xcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZGV0YWlsLWljb25cIiBocmVmPVwiI1wiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiJyArIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCArICcgJyArIHRoaXMub3B0aW9ucy5pY29ucy5kZXRhaWxPcGVuICsgJ1wiPjwvaT5cXG4gICAgICAgICAgICA8L2E+XFxuICAgICAgICAgICcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodG1sLnB1c2goJzwvdGQ+Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5oZWFkZXIuZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkLCBqKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9ICcnO1xuICAgICAgICAgICAgdmFyIHZhbHVlXyA9IFV0aWxzLmdldEl0ZW1GaWVsZChpdGVtLCBmaWVsZCwgX3RoaXM3Lm9wdGlvbnMuZXNjYXBlKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSAnJztcbiAgICAgICAgICAgIHZhciBjZWxsU3R5bGUgPSB7fTtcbiAgICAgICAgICAgIHZhciBpZF8gPSAnJztcbiAgICAgICAgICAgIHZhciBjbGFzc18gPSBfdGhpczcuaGVhZGVyLmNsYXNzZXNbal07XG4gICAgICAgICAgICB2YXIgc3R5bGVfID0gJyc7XG4gICAgICAgICAgICB2YXIgZGF0YV8gPSAnJztcbiAgICAgICAgICAgIHZhciByb3dzcGFuXyA9ICcnO1xuICAgICAgICAgICAgdmFyIGNvbHNwYW5fID0gJyc7XG4gICAgICAgICAgICB2YXIgdGl0bGVfID0gJyc7XG4gICAgICAgICAgICB2YXIgY29sdW1uID0gX3RoaXM3LmNvbHVtbnNbal07XG5cbiAgICAgICAgICAgIGlmIChfdGhpczcuZnJvbUh0bWwgJiYgdHlwZW9mIHZhbHVlXyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgaWYgKCFjb2x1bW4uY2hlY2tib3ggJiYgIWNvbHVtbi5yYWRpbykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF90aGlzNy5vcHRpb25zLmNhcmRWaWV3ICYmICFjb2x1bW4uY2FyZFZpc2libGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uLmVzY2FwZSkge1xuICAgICAgICAgICAgICB2YWx1ZV8gPSBVdGlscy5lc2NhcGVIVE1MKHZhbHVlXyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjc3Nlcy5jb25jYXQoW190aGlzNy5oZWFkZXIuc3R5bGVzW2pdXSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN0eWxlXyA9ICcgc3R5bGU9XCInICsgY3NzZXMuY29uY2F0KFtfdGhpczcuaGVhZGVyLnN0eWxlc1tqXV0pLmpvaW4oJzsgJykgKyAnXCInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaGFuZGxlIHRkJ3MgaWQgYW5kIGNsYXNzXG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfaWQnXSkge1xuICAgICAgICAgICAgICBpZF8gPSBVdGlscy5zcHJpbnRmKCcgaWQ9XCIlc1wiJywgaXRlbVsnXycgKyBmaWVsZCArICdfaWQnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfY2xhc3MnXSkge1xuICAgICAgICAgICAgICBjbGFzc18gPSBVdGlscy5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJywgaXRlbVsnXycgKyBmaWVsZCArICdfY2xhc3MnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfcm93c3BhbiddKSB7XG4gICAgICAgICAgICAgIHJvd3NwYW5fID0gVXRpbHMuc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJywgaXRlbVsnXycgKyBmaWVsZCArICdfcm93c3BhbiddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtWydfJyArIGZpZWxkICsgJ19jb2xzcGFuJ10pIHtcbiAgICAgICAgICAgICAgY29sc3Bhbl8gPSBVdGlscy5zcHJpbnRmKCcgY29sc3Bhbj1cIiVzXCInLCBpdGVtWydfJyArIGZpZWxkICsgJ19jb2xzcGFuJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW1bJ18nICsgZmllbGQgKyAnX3RpdGxlJ10pIHtcbiAgICAgICAgICAgICAgdGl0bGVfID0gVXRpbHMuc3ByaW50ZignIHRpdGxlPVwiJXNcIicsIGl0ZW1bJ18nICsgZmllbGQgKyAnX3RpdGxlJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2VsbFN0eWxlID0gVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUoX3RoaXM3LmhlYWRlciwgX3RoaXM3LmhlYWRlci5jZWxsU3R5bGVzW2pdLCBbdmFsdWVfLCBpdGVtLCBpLCBmaWVsZF0sIGNlbGxTdHlsZSk7XG4gICAgICAgICAgICBpZiAoY2VsbFN0eWxlLmNsYXNzZXMpIHtcbiAgICAgICAgICAgICAgY2xhc3NfID0gJyBjbGFzcz1cIicgKyBjZWxsU3R5bGUuY2xhc3NlcyArICdcIic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbFN0eWxlLmNzcykge1xuICAgICAgICAgICAgICB2YXIgY3NzZXNfID0gW107XG4gICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTIgPSB0cnVlO1xuICAgICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IxMiA9IGZhbHNlO1xuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IxMiA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjEyID0gT2JqZWN0LmVudHJpZXMoY2VsbFN0eWxlLmNzcylbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDEyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xMiA9IChfc3RlcDEyID0gX2l0ZXJhdG9yMTIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjEyID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgdmFyIF9yZWYxNCA9IF9zdGVwMTIudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgIHZhciBfcmVmMTUgPSBfc2xpY2VkVG9BcnJheShfcmVmMTQsIDIpO1xuXG4gICAgICAgICAgICAgICAgICB2YXIgX2tleTMgPSBfcmVmMTVbMF07XG4gICAgICAgICAgICAgICAgICB2YXIgX3ZhbHVlMyA9IF9yZWYxNVsxXTtcblxuICAgICAgICAgICAgICAgICAgY3NzZXNfLnB1c2goX2tleTMgKyAnOiAnICsgX3ZhbHVlMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjEyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjEyID0gZXJyO1xuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xMiAmJiBfaXRlcmF0b3IxMi5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTIucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjEyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMTI7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc3R5bGVfID0gJyBzdHlsZT1cIicgKyBjc3Nlc18uY29uY2F0KF90aGlzNy5oZWFkZXIuc3R5bGVzW2pdKS5qb2luKCc7ICcpICsgJ1wiJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWUgPSBVdGlscy5jYWxjdWxhdGVPYmplY3RWYWx1ZShjb2x1bW4sIF90aGlzNy5oZWFkZXIuZm9ybWF0dGVyc1tqXSwgW3ZhbHVlXywgaXRlbSwgaSwgZmllbGRdLCB2YWx1ZV8pO1xuXG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfZGF0YSddICYmICEkLmlzRW1wdHlPYmplY3QoaXRlbVsnXycgKyBmaWVsZCArICdfZGF0YSddKSkge1xuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjEzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMTMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMTMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMyA9IE9iamVjdC5lbnRyaWVzKGl0ZW1bJ18nICsgZmllbGQgKyAnX2RhdGEnXSlbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDEzOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xMyA9IChfc3RlcDEzID0gX2l0ZXJhdG9yMTMubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjEzID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgdmFyIF9yZWYxNiA9IF9zdGVwMTMudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgIHZhciBfcmVmMTcgPSBfc2xpY2VkVG9BcnJheShfcmVmMTYsIDIpO1xuXG4gICAgICAgICAgICAgICAgICB2YXIgX2syID0gX3JlZjE3WzBdO1xuICAgICAgICAgICAgICAgICAgdmFyIF92ID0gX3JlZjE3WzFdO1xuXG4gICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZGF0YS1pbmRleFxuICAgICAgICAgICAgICAgICAgaWYgKF9rMiA9PT0gJ2luZGV4Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkYXRhXyArPSAnIGRhdGEtJyArIF9rMiArICc9XCInICsgX3YgKyAnXCInO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IxMyA9IHRydWU7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxMyA9IGVycjtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTMgJiYgX2l0ZXJhdG9yMTMucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjEzLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IxMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjEzO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNoZWNrYm94IHx8IGNvbHVtbi5yYWRpbykge1xuICAgICAgICAgICAgICB0eXBlID0gY29sdW1uLmNoZWNrYm94ID8gJ2NoZWNrYm94JyA6IHR5cGU7XG4gICAgICAgICAgICAgIHR5cGUgPSBjb2x1bW4ucmFkaW8gPyAncmFkaW8nIDogdHlwZTtcblxuICAgICAgICAgICAgICB2YXIgYyA9IGNvbHVtblsnY2xhc3MnXSB8fCAnJztcbiAgICAgICAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IHZhbHVlID09PSB0cnVlIHx8IHZhbHVlXyB8fCB2YWx1ZSAmJiB2YWx1ZS5jaGVja2VkO1xuICAgICAgICAgICAgICB2YXIgaXNEaXNhYmxlZCA9ICFjb2x1bW4uY2hlY2tib3hFbmFibGVkIHx8IHZhbHVlICYmIHZhbHVlLmRpc2FibGVkO1xuXG4gICAgICAgICAgICAgIHRleHQgPSBbX3RoaXM3Lm9wdGlvbnMuY2FyZFZpZXcgPyAnPGRpdiBjbGFzcz1cImNhcmQtdmlldyAnICsgYyArICdcIj4nIDogJzx0ZCBjbGFzcz1cImJzLWNoZWNrYm94ICcgKyBjICsgJ1wiPicsICc8aW5wdXRcXG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9XCInICsgaSArICdcIlxcbiAgICAgICAgICAgICAgbmFtZT1cIicgKyBfdGhpczcub3B0aW9ucy5zZWxlY3RJdGVtTmFtZSArICdcIlxcbiAgICAgICAgICAgICAgdHlwZT1cIicgKyB0eXBlICsgJ1wiXFxuICAgICAgICAgICAgICAnICsgVXRpbHMuc3ByaW50ZigndmFsdWU9XCIlc1wiJywgaXRlbVtfdGhpczcub3B0aW9ucy5pZEZpZWxkXSkgKyAnXFxuICAgICAgICAgICAgICAnICsgVXRpbHMuc3ByaW50ZignY2hlY2tlZD1cIiVzXCInLCBpc0NoZWNrZWQgPyAnY2hlY2tlZCcgOiB1bmRlZmluZWQpICsgJ1xcbiAgICAgICAgICAgICAgJyArIFV0aWxzLnNwcmludGYoJ2Rpc2FibGVkPVwiJXNcIicsIGlzRGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogdW5kZWZpbmVkKSArICcgLz4nLCBfdGhpczcuaGVhZGVyLmZvcm1hdHRlcnNbal0gJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogJycsIF90aGlzNy5vcHRpb25zLmNhcmRWaWV3ID8gJzwvZGl2PicgOiAnPC90ZD4nXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgICBpdGVtW190aGlzNy5oZWFkZXIuc3RhdGVGaWVsZF0gPSB2YWx1ZSA9PT0gdHJ1ZSB8fCAhIXZhbHVlXyB8fCB2YWx1ZSAmJiB2YWx1ZS5jaGVja2VkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSBudWxsID8gX3RoaXM3Lm9wdGlvbnMudW5kZWZpbmVkVGV4dCA6IHZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChfdGhpczcub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgICAgIHZhciBjYXJkVGl0bGUgPSBfdGhpczcub3B0aW9ucy5zaG93SGVhZGVyID8gJzxzcGFuIGNsYXNzPVwidGl0bGVcIicgKyBzdHlsZSArICc+JyArIFV0aWxzLmdldEZpZWxkVGl0bGUoX3RoaXM3LmNvbHVtbnMsIGZpZWxkKSArICc8L3NwYW4+JyA6ICcnO1xuXG4gICAgICAgICAgICAgICAgdGV4dCA9ICc8ZGl2IGNsYXNzPVwiY2FyZC12aWV3XCI+JyArIGNhcmRUaXRsZSArICc8c3BhbiBjbGFzcz1cInZhbHVlXCI+JyArIHZhbHVlICsgJzwvc3Bhbj48L2Rpdj4nO1xuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzNy5vcHRpb25zLnNtYXJ0RGlzcGxheSAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgIHRleHQgPSAnPGRpdiBjbGFzcz1cImNhcmQtdmlld1wiPjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRleHQgPSAnPHRkJyArIGlkXyArIGNsYXNzXyArIHN0eWxlXyArIGRhdGFfICsgcm93c3Bhbl8gKyBjb2xzcGFuXyArIHRpdGxlXyArICc+JyArIHZhbHVlICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodG1sLnB1c2godGV4dCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzwvZGl2PjwvdGQ+Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGh0bWwucHVzaCgnPC90cj4nKTtcblxuICAgICAgICAgIHJldHVybiBodG1sLmpvaW4oJycpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2luaXRCb2R5JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaXRCb2R5KGZpeGVkU2Nyb2xsKSB7XG4gICAgICAgICAgdmFyIF90aGlzOCA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuXG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdwcmUtYm9keScsIGRhdGEpO1xuXG4gICAgICAgICAgdGhpcy4kYm9keSA9IHRoaXMuJGVsLmZpbmQoJz50Ym9keScpO1xuICAgICAgICAgIGlmICghdGhpcy4kYm9keS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkgPSAkKCc8dGJvZHk+PC90Ym9keT4nKS5hcHBlbmRUbyh0aGlzLiRlbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRml4ICMzODkgQm9vdHN0cmFwLXRhYmxlLWZsYXRKU09OIGlzIG5vdCB3b3JraW5nXG4gICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbiB8fCB0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VGcm9tID0gMTtcbiAgICAgICAgICAgIHRoaXMucGFnZVRvID0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHRyRnJhZ21lbnRzID0gJChkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO1xuICAgICAgICAgIHZhciBoYXNUciA9IGZhbHNlO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMucGFnZUZyb20gLSAxOyBpIDwgdGhpcy5wYWdlVG87IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAgICAgdmFyIHRyID0gdGhpcy5pbml0Um93KGl0ZW0sIGksIGRhdGEsIHRyRnJhZ21lbnRzKTtcbiAgICAgICAgICAgIGhhc1RyID0gaGFzVHIgfHwgISF0cjtcbiAgICAgICAgICAgIGlmICh0ciAmJiB0eXBlb2YgdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHRyRnJhZ21lbnRzLmFwcGVuZCh0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2hvdyBubyByZWNvcmRzXG4gICAgICAgICAgaWYgKCFoYXNUcikge1xuICAgICAgICAgICAgdGhpcy4kYm9keS5odG1sKCc8dHIgY2xhc3M9XCJuby1yZWNvcmRzLWZvdW5kXCI+JyArIFV0aWxzLnNwcmludGYoJzx0ZCBjb2xzcGFuPVwiJXNcIj4lczwvdGQ+JywgdGhpcy4kaGVhZGVyLmZpbmQoJ3RoJykubGVuZ3RoLCB0aGlzLm9wdGlvbnMuZm9ybWF0Tm9NYXRjaGVzKCkpICsgJzwvdHI+Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkuaHRtbCh0ckZyYWdtZW50cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFmaXhlZFNjcm9sbCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbygwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjbGljayB0byBzZWxlY3QgYnkgY29sdW1uXG4gICAgICAgICAgdGhpcy4kYm9keS5maW5kKCc+IHRyW2RhdGEtaW5kZXhdID4gdGQnKS5vZmYoJ2NsaWNrIGRibGNsaWNrJykub24oJ2NsaWNrIGRibGNsaWNrJywgZnVuY3Rpb24gKF9yZWYxOCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUYXJnZXQgPSBfcmVmMTguY3VycmVudFRhcmdldCxcbiAgICAgICAgICAgICAgICB0eXBlID0gX3JlZjE4LnR5cGUsXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gX3JlZjE4LnRhcmdldDtcblxuICAgICAgICAgICAgdmFyICR0ZCA9ICQoY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICB2YXIgJHRyID0gJHRkLnBhcmVudCgpO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBfdGhpczguZGF0YVskdHIuZGF0YSgnaW5kZXgnKV07XG4gICAgICAgICAgICB2YXIgaW5kZXggPSAkdGRbMF0uY2VsbEluZGV4O1xuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IF90aGlzOC5nZXRWaXNpYmxlRmllbGRzKCk7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBmaWVsZHNbX3RoaXM4Lm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhX3RoaXM4Lm9wdGlvbnMuY2FyZFZpZXcgPyBpbmRleCAtIDEgOiBpbmRleF07XG4gICAgICAgICAgICB2YXIgY29sdW1uID0gX3RoaXM4LmNvbHVtbnNbX3RoaXM4LmZpZWxkc0NvbHVtbnNJbmRleFtmaWVsZF1dO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gVXRpbHMuZ2V0SXRlbUZpZWxkKGl0ZW0sIGZpZWxkLCBfdGhpczgub3B0aW9ucy5lc2NhcGUpO1xuXG4gICAgICAgICAgICBpZiAoJHRkLmZpbmQoJy5kZXRhaWwtaWNvbicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzOC50cmlnZ2VyKHR5cGUgPT09ICdjbGljaycgPyAnY2xpY2stY2VsbCcgOiAnZGJsLWNsaWNrLWNlbGwnLCBmaWVsZCwgdmFsdWUsIGl0ZW0sICR0ZCk7XG4gICAgICAgICAgICBfdGhpczgudHJpZ2dlcih0eXBlID09PSAnY2xpY2snID8gJ2NsaWNrLXJvdycgOiAnZGJsLWNsaWNrLXJvdycsIGl0ZW0sICR0ciwgZmllbGQpO1xuXG4gICAgICAgICAgICAvLyBpZiBjbGljayB0byBzZWxlY3QgLSB0aGVuIHRyaWdnZXIgdGhlIGNoZWNrYm94L3JhZGlvIGNsaWNrXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NsaWNrJyAmJiBfdGhpczgub3B0aW9ucy5jbGlja1RvU2VsZWN0ICYmIGNvbHVtbi5jbGlja1RvU2VsZWN0ICYmICFfdGhpczgub3B0aW9ucy5pZ25vcmVDbGlja1RvU2VsZWN0T24odGFyZ2V0KSkge1xuICAgICAgICAgICAgICB2YXIgJHNlbGVjdEl0ZW0gPSAkdHIuZmluZChVdGlscy5zcHJpbnRmKCdbbmFtZT1cIiVzXCJdJywgX3RoaXM4Lm9wdGlvbnMuc2VsZWN0SXRlbU5hbWUpKTtcbiAgICAgICAgICAgICAgaWYgKCRzZWxlY3RJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRzZWxlY3RJdGVtWzBdLmNsaWNrKCk7IC8vICMxNDQ6IC50cmlnZ2VyKCdjbGljaycpIGJ1Z1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLiRib2R5LmZpbmQoJz4gdHJbZGF0YS1pbmRleF0gPiB0ZCA+IC5kZXRhaWwtaWNvbicpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7IC8vIEZpeCAjOTgwIERldGFpbCB2aWV3LCB3aGVuIHNlYXJjaGluZywgcmV0dXJucyB3cm9uZyByb3dcbiAgICAgICAgICAgIHZhciAkdHIgPSAkdGhpcy5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9ICR0ci5kYXRhKCdpbmRleCcpO1xuICAgICAgICAgICAgdmFyIHJvdyA9IGRhdGFbaW5kZXhdO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgYW5kIHVwZGF0ZVxuICAgICAgICAgICAgaWYgKCR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykpIHtcbiAgICAgICAgICAgICAgJHRoaXMuZmluZCgnaScpLmF0dHIoJ2NsYXNzJywgVXRpbHMuc3ByaW50ZignJXMgJXMnLCBfdGhpczgub3B0aW9ucy5pY29uc1ByZWZpeCwgX3RoaXM4Lm9wdGlvbnMuaWNvbnMuZGV0YWlsT3BlbikpO1xuICAgICAgICAgICAgICBfdGhpczgudHJpZ2dlcignY29sbGFwc2Utcm93JywgaW5kZXgsIHJvdywgJHRyLm5leHQoKSk7XG4gICAgICAgICAgICAgICR0ci5uZXh0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkdGhpcy5maW5kKCdpJykuYXR0cignY2xhc3MnLCBVdGlscy5zcHJpbnRmKCclcyAlcycsIF90aGlzOC5vcHRpb25zLmljb25zUHJlZml4LCBfdGhpczgub3B0aW9ucy5pY29ucy5kZXRhaWxDbG9zZSkpO1xuICAgICAgICAgICAgICAkdHIuYWZ0ZXIoVXRpbHMuc3ByaW50ZignPHRyIGNsYXNzPVwiZGV0YWlsLXZpZXdcIj48dGQgY29sc3Bhbj1cIiVzXCI+PC90ZD48L3RyPicsICR0ci5maW5kKCd0ZCcpLmxlbmd0aCkpO1xuICAgICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkdHIubmV4dCgpLmZpbmQoJ3RkJyk7XG4gICAgICAgICAgICAgIHZhciBjb250ZW50ID0gVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUoX3RoaXM4Lm9wdGlvbnMsIF90aGlzOC5vcHRpb25zLmRldGFpbEZvcm1hdHRlciwgW2luZGV4LCByb3csICRlbGVtZW50XSwgJycpO1xuICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF90aGlzOC50cmlnZ2VyKCdleHBhbmQtcm93JywgaW5kZXgsIHJvdywgJGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXM4LnJlc2V0VmlldygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbSA9IHRoaXMuJGJvZHkuZmluZChVdGlscy5zcHJpbnRmKCdbbmFtZT1cIiVzXCJdJywgdGhpcy5vcHRpb25zLnNlbGVjdEl0ZW1OYW1lKSk7XG4gICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIF90aGlzOC5jaGVja18oJHRoaXMucHJvcCgnY2hlY2tlZCcpLCAkdGhpcy5kYXRhKCdpbmRleCcpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuaGVhZGVyLmV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfZXZlbnRzLCBpKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRzID0gX2V2ZW50cztcbiAgICAgICAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGZpeCBidWcsIGlmIGV2ZW50cyBpcyBkZWZpbmVkIHdpdGggbmFtZXNwYWNlXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZXZlbnRzID0gVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCwgZXZlbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZpZWxkID0gX3RoaXM4LmhlYWRlci5maWVsZHNbaV07XG4gICAgICAgICAgICB2YXIgZmllbGRJbmRleCA9IF90aGlzOC5nZXRWaXNpYmxlRmllbGRzKCkuaW5kZXhPZihmaWVsZCk7XG5cbiAgICAgICAgICAgIGlmIChmaWVsZEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdGhpczgub3B0aW9ucy5kZXRhaWxWaWV3ICYmICFfdGhpczgub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgICBmaWVsZEluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGtleSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgX3RoaXM4LiRib2R5LmZpbmQoJz50cjpub3QoLm5vLXJlY29yZHMtZm91bmQpJykuZWFjaChmdW5jdGlvbiAoaSwgdHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRyID0gJCh0cik7XG4gICAgICAgICAgICAgICAgdmFyICR0ZCA9ICR0ci5maW5kKF90aGlzOC5vcHRpb25zLmNhcmRWaWV3ID8gJy5jYXJkLXZpZXcnIDogJ3RkJykuZXEoZmllbGRJbmRleCk7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0ga2V5LmluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGtleS5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IGtleS5zdWJzdHJpbmcoaW5kZXggKyAxKTtcblxuICAgICAgICAgICAgICAgICR0ZC5maW5kKGVsKS5vZmYobmFtZSkub24obmFtZSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICR0ci5kYXRhKCdpbmRleCcpO1xuICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IF90aGlzOC5kYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJvd1tmaWVsZF07XG5cbiAgICAgICAgICAgICAgICAgIGV2ZW50LmFwcGx5KF90aGlzOCwgW2UsIHZhbHVlLCByb3csIGluZGV4XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xNCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IxNCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMTQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE0ID0gT2JqZWN0LmVudHJpZXMoZXZlbnRzKVtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMTQ7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjE0ID0gKF9zdGVwMTQgPSBfaXRlcmF0b3IxNC5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTQgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9yZWYxOSA9IF9zdGVwMTQudmFsdWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3JlZjIwID0gX3NsaWNlZFRvQXJyYXkoX3JlZjE5LCAyKTtcblxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfcmVmMjBbMF07XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gX3JlZjIwWzFdO1xuXG4gICAgICAgICAgICAgICAgX2xvb3Aoa2V5LCBldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjE0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxNCA9IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTQgJiYgX2l0ZXJhdG9yMTQucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICBfaXRlcmF0b3IxNC5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMTQpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMTQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgICAgdGhpcy5yZXNldFZpZXcoKTtcblxuICAgICAgICAgIHRoaXMudHJpZ2dlcigncG9zdC1ib2R5JywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdFNlcnZlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0U2VydmVyKHNpbGVudCwgcXVlcnksIHVybCkge1xuICAgICAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmhlYWRlci5maWVsZHMuaW5kZXhPZih0aGlzLm9wdGlvbnMuc29ydE5hbWUpO1xuXG4gICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHRoaXMuc2VhcmNoVGV4dCxcbiAgICAgICAgICAgIHNvcnROYW1lOiB0aGlzLm9wdGlvbnMuc29ydE5hbWUsXG4gICAgICAgICAgICBzb3J0T3JkZXI6IHRoaXMub3B0aW9ucy5zb3J0T3JkZXJcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHRoaXMuaGVhZGVyLnNvcnROYW1lc1tpbmRleF0pIHtcbiAgICAgICAgICAgIHBhcmFtcy5zb3J0TmFtZSA9IHRoaXMuaGVhZGVyLnNvcnROYW1lc1tpbmRleF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uICYmIHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wYWdlU2l6ZSA9IHRoaXMub3B0aW9ucy5wYWdlU2l6ZSA9PT0gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA/IHRoaXMub3B0aW9ucy50b3RhbFJvd3MgOiB0aGlzLm9wdGlvbnMucGFnZVNpemU7XG4gICAgICAgICAgICBwYXJhbXMucGFnZU51bWJlciA9IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghKHVybCB8fCB0aGlzLm9wdGlvbnMudXJsKSAmJiAhdGhpcy5vcHRpb25zLmFqYXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnF1ZXJ5UGFyYW1zVHlwZSA9PT0gJ2xpbWl0Jykge1xuICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICBzZWFyY2g6IHBhcmFtcy5zZWFyY2hUZXh0LFxuICAgICAgICAgICAgICBzb3J0OiBwYXJhbXMuc29ydE5hbWUsXG4gICAgICAgICAgICAgIG9yZGVyOiBwYXJhbXMuc29ydE9yZGVyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luYXRpb24gJiYgdGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgICBwYXJhbXMub2Zmc2V0ID0gdGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpID8gMCA6IHRoaXMub3B0aW9ucy5wYWdlU2l6ZSAqICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciAtIDEpO1xuICAgICAgICAgICAgICBwYXJhbXMubGltaXQgPSB0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgPyB0aGlzLm9wdGlvbnMudG90YWxSb3dzIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplO1xuICAgICAgICAgICAgICBpZiAocGFyYW1zLmxpbWl0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHBhcmFtcy5saW1pdDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwpKSB7XG4gICAgICAgICAgICBwYXJhbXMuZmlsdGVyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCwgbnVsbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0YSA9IFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLnF1ZXJ5UGFyYW1zLCBbcGFyYW1zXSwgZGF0YSk7XG5cbiAgICAgICAgICAkLmV4dGVuZChkYXRhLCBxdWVyeSB8fCB7fSk7XG5cbiAgICAgICAgICAvLyBmYWxzZSB0byBzdG9wIHJlcXVlc3RcbiAgICAgICAgICBpZiAoZGF0YSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHJlcXVlc3QgPSAkLmV4dGVuZCh7fSwgVXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCwgdGhpcy5vcHRpb25zLmFqYXhPcHRpb25zKSwge1xuICAgICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLm1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdXJsIHx8IHRoaXMub3B0aW9ucy51cmwsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLm9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJyAmJiB0aGlzLm9wdGlvbnMubWV0aG9kID09PSAncG9zdCcgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IGRhdGEsXG4gICAgICAgICAgICBjYWNoZTogdGhpcy5vcHRpb25zLmNhY2hlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IHRoaXMub3B0aW9ucy5jb250ZW50VHlwZSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiB0aGlzLm9wdGlvbnMuZGF0YVR5cGUsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKF9yZXMpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKF90aGlzOS5vcHRpb25zLCBfdGhpczkub3B0aW9ucy5yZXNwb25zZUhhbmRsZXIsIFtfcmVzXSwgX3Jlcyk7XG5cbiAgICAgICAgICAgICAgX3RoaXM5LmxvYWQocmVzKTtcbiAgICAgICAgICAgICAgX3RoaXM5LnRyaWdnZXIoJ2xvYWQtc3VjY2VzcycsIHJlcyk7XG4gICAgICAgICAgICAgIGlmICghc2lsZW50KSBfdGhpczkuJHRhYmxlTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKHJlcykge1xuICAgICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICAgICAgICBpZiAoX3RoaXM5Lm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGRhdGFbX3RoaXM5Lm9wdGlvbnMudG90YWxGaWVsZF0gPSAwO1xuICAgICAgICAgICAgICAgIGRhdGFbX3RoaXM5Lm9wdGlvbnMuZGF0YUZpZWxkXSA9IFtdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF90aGlzOS5sb2FkKGRhdGEpO1xuICAgICAgICAgICAgICBfdGhpczkudHJpZ2dlcignbG9hZC1lcnJvcicsIHJlcy5zdGF0dXMsIHJlcyk7XG4gICAgICAgICAgICAgIGlmICghc2lsZW50KSBfdGhpczkuJHRhYmxlTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFqYXgpIHtcbiAgICAgICAgICAgIFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMsIHRoaXMub3B0aW9ucy5hamF4LCBbcmVxdWVzdF0sIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5feGhyICYmIHRoaXMuX3hoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5feGhyID0gJC5hamF4KHJlcXVlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdpbml0U2VhcmNoVGV4dCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0U2VhcmNoVGV4dCgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlYXJjaCkge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hUZXh0ID0gJyc7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlYXJjaFRleHQgIT09ICcnKSB7XG4gICAgICAgICAgICAgIHZhciAkc2VhcmNoID0gdGhpcy4kdG9vbGJhci5maW5kKCcuc2VhcmNoIGlucHV0Jyk7XG4gICAgICAgICAgICAgICRzZWFyY2gudmFsKHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5vblNlYXJjaCh7IGN1cnJlbnRUYXJnZXQ6ICRzZWFyY2gsIGZpcmVkQnlJbml0U2VhcmNoVGV4dDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0Q2FyZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2FyZXQoKSB7XG4gICAgICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICAgICAgdGhpcy4kaGVhZGVyLmZpbmQoJ3RoJykuZWFjaChmdW5jdGlvbiAoaSwgdGgpIHtcbiAgICAgICAgICAgICQodGgpLmZpbmQoJy5zb3J0YWJsZScpLnJlbW92ZUNsYXNzKCdkZXNjIGFzYycpLmFkZENsYXNzKCQodGgpLmRhdGEoJ2ZpZWxkJykgPT09IF90aGlzMTAub3B0aW9ucy5zb3J0TmFtZSA/IF90aGlzMTAub3B0aW9ucy5zb3J0T3JkZXIgOiAnYm90aCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3VwZGF0ZVNlbGVjdGVkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkKCkge1xuICAgICAgICAgIHZhciBjaGVja0FsbCA9IHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLmxlbmd0aCAmJiB0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKS5sZW5ndGggPT09IHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGg7XG5cbiAgICAgICAgICB0aGlzLiRzZWxlY3RBbGwuYWRkKHRoaXMuJHNlbGVjdEFsbF8pLnByb3AoJ2NoZWNrZWQnLCBjaGVja0FsbCk7XG5cbiAgICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAkKGVsKS5jbG9zZXN0KCd0cicpWyQoZWwpLnByb3AoJ2NoZWNrZWQnKSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVSb3dzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVJvd3MoKSB7XG4gICAgICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgX3RoaXMxMS5kYXRhWyQoZWwpLmRhdGEoJ2luZGV4JyldW190aGlzMTEuaGVhZGVyLnN0YXRlRmllbGRdID0gJChlbCkucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3Jlc2V0Um93cycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldFJvd3MoKSB7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xNSA9IHRydWU7XG4gICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMTUgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IxNSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNSA9IHRoaXMuZGF0YVtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMTU7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjE1ID0gKF9zdGVwMTUgPSBfaXRlcmF0b3IxNS5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTUgPSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciByb3cgPSBfc3RlcDE1LnZhbHVlO1xuXG4gICAgICAgICAgICAgIHRoaXMuJHNlbGVjdEFsbC5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlci5zdGF0ZUZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcm93W3RoaXMuaGVhZGVyLnN0YXRlRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMTUgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxNSA9IGVycjtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTUgJiYgX2l0ZXJhdG9yMTUucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTUucmV0dXJuKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjE1KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IxNTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuaW5pdEhpZGRlblJvd3MoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd0cmlnZ2VyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIoX25hbWUpIHtcbiAgICAgICAgICB2YXIgX29wdGlvbnM7XG5cbiAgICAgICAgICB2YXIgbmFtZSA9IF9uYW1lICsgJy5icy50YWJsZSc7XG5cbiAgICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW4yOyBfa2V5NCsrKSB7XG4gICAgICAgICAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIChfb3B0aW9ucyA9IHRoaXMub3B0aW9ucylbQm9vdHN0cmFwVGFibGUuRVZFTlRTW25hbWVdXS5hcHBseShfb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgdGhpcy4kZWwudHJpZ2dlcigkLkV2ZW50KG5hbWUpLCBhcmdzKTtcblxuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkFsbChuYW1lLCBhcmdzKTtcbiAgICAgICAgICB0aGlzLiRlbC50cmlnZ2VyKCQuRXZlbnQoJ2FsbC5icy50YWJsZScpLCBbbmFtZSwgYXJnc10pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3Jlc2V0SGVhZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0SGVhZGVyKCkge1xuICAgICAgICAgIC8vIGZpeCAjNjE6IHRoZSBoaWRkZW4gdGFibGUgcmVzZXQgaGVhZGVyIGJ1Zy5cbiAgICAgICAgICAvLyBmaXggYnVnOiBnZXQgJGVsLmNzcygnd2lkdGgnKSBlcnJvciBzb21ldGltZSAoaGVpZ2h0ID0gNTAwKVxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZF8pO1xuICAgICAgICAgIHRoaXMudGltZW91dElkXyA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmZpdEhlYWRlciwgdGhpcyksIHRoaXMuJGVsLmlzKCc6aGlkZGVuJykgPyAxMDAgOiAwKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdmaXRIZWFkZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZml0SGVhZGVyKCkge1xuICAgICAgICAgIHZhciBfdGhpczEyID0gdGhpcztcblxuICAgICAgICAgIGlmICh0aGlzLiRlbC5pcygnOmhpZGRlbicpKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZF8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5maXRIZWFkZXIsIHRoaXMpLCAxMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZml4ZWRCb2R5ID0gdGhpcy4kdGFibGVCb2R5LmdldCgwKTtcblxuICAgICAgICAgIHZhciBzY3JvbGxXaWR0aCA9IGZpeGVkQm9keS5zY3JvbGxXaWR0aCA+IGZpeGVkQm9keS5jbGllbnRXaWR0aCAmJiBmaXhlZEJvZHkuc2Nyb2xsSGVpZ2h0ID4gZml4ZWRCb2R5LmNsaWVudEhlaWdodCArIHRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpID8gVXRpbHMuZ2V0U2Nyb2xsQmFyV2lkdGgoKSA6IDA7XG5cbiAgICAgICAgICB0aGlzLiRlbC5jc3MoJ21hcmdpbi10b3AnLCAtdGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCkpO1xuXG4gICAgICAgICAgdmFyIGZvY3VzZWQgPSAkKCc6Zm9jdXMnKTtcbiAgICAgICAgICBpZiAoZm9jdXNlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgJHRoID0gZm9jdXNlZC5wYXJlbnRzKCd0aCcpO1xuICAgICAgICAgICAgaWYgKCR0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhRmllbGQgPSAkdGguYXR0cignZGF0YS1maWVsZCcpO1xuICAgICAgICAgICAgICBpZiAoZGF0YUZpZWxkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGhlYWRlclRoID0gdGhpcy4kaGVhZGVyLmZpbmQoJ1tkYXRhLWZpZWxkPVxcJycgKyBkYXRhRmllbGQgKyAnXFwnXScpO1xuICAgICAgICAgICAgICAgIGlmICgkaGVhZGVyVGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgJGhlYWRlclRoLmZpbmQoJzppbnB1dCcpLmFkZENsYXNzKCdmb2N1cy10ZW1wJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy4kaGVhZGVyXyA9IHRoaXMuJGhlYWRlci5jbG9uZSh0cnVlLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLiRzZWxlY3RBbGxfID0gdGhpcy4kaGVhZGVyXy5maW5kKCdbbmFtZT1cImJ0U2VsZWN0QWxsXCJdJyk7XG4gICAgICAgICAgdGhpcy4kdGFibGVIZWFkZXIuY3NzKHtcbiAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBzY3JvbGxXaWR0aFxuICAgICAgICAgIH0pLmZpbmQoJ3RhYmxlJykuY3NzKCd3aWR0aCcsIHRoaXMuJGVsLm91dGVyV2lkdGgoKSkuaHRtbCgnJykuYXR0cignY2xhc3MnLCB0aGlzLiRlbC5hdHRyKCdjbGFzcycpKS5hcHBlbmQodGhpcy4kaGVhZGVyXyk7XG5cbiAgICAgICAgICB2YXIgZm9jdXNlZFRlbXAgPSAkKCcuZm9jdXMtdGVtcDp2aXNpYmxlOmVxKDApJyk7XG4gICAgICAgICAgaWYgKGZvY3VzZWRUZW1wLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvY3VzZWRUZW1wLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgnLmZvY3VzLXRlbXAnKS5yZW1vdmVDbGFzcygnZm9jdXMtdGVtcCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZpeCBidWc6ICQuZGF0YSgpIGlzIG5vdCB3b3JraW5nIGFzIGV4cGVjdGVkIGFmdGVyICQuYXBwZW5kKClcbiAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgX3RoaXMxMi4kaGVhZGVyXy5maW5kKFV0aWxzLnNwcmludGYoJ3RoW2RhdGEtZmllbGQ9XCIlc1wiXScsICQoZWwpLmRhdGEoJ2ZpZWxkJykpKS5kYXRhKCQoZWwpLmRhdGEoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgdmlzaWJsZUZpZWxkcyA9IHRoaXMuZ2V0VmlzaWJsZUZpZWxkcygpO1xuICAgICAgICAgIHZhciAkdGhzID0gdGhpcy4kaGVhZGVyXy5maW5kKCd0aCcpO1xuXG4gICAgICAgICAgdGhpcy4kYm9keS5maW5kKCc+dHI6Zmlyc3QtY2hpbGQ6bm90KC5uby1yZWNvcmRzLWZvdW5kKSA+IConKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJChlbCk7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBpO1xuXG4gICAgICAgICAgICBpZiAoX3RoaXMxMi5vcHRpb25zLmRldGFpbFZpZXcgJiYgIV90aGlzMTIub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIF90aGlzMTIuJGhlYWRlcl8uZmluZCgndGguZGV0YWlsJykuZmluZCgnLmZodC1jZWxsJykud2lkdGgoJHRoaXMuaW5uZXJXaWR0aCgpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpbmRleCA9IGkgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyICR0aCA9IF90aGlzMTIuJGhlYWRlcl8uZmluZChVdGlscy5zcHJpbnRmKCd0aFtkYXRhLWZpZWxkPVwiJXNcIl0nLCB2aXNpYmxlRmllbGRzW2luZGV4XSkpO1xuICAgICAgICAgICAgaWYgKCR0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICR0aCA9ICQoJHRoc1skdGhpc1swXS5jZWxsSW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHpvb21XaWR0aCA9ICR0aC53aWR0aCgpIC0gJHRoLmZpbmQoJy5maHQtY2VsbCcpLndpZHRoKCk7XG4gICAgICAgICAgICAkdGguZmluZCgnLmZodC1jZWxsJykud2lkdGgoJHRoaXMuaW5uZXJXaWR0aCgpIC0gem9vbVdpZHRoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbCgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlcigncG9zdC1oZWFkZXInKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdyZXNldEZvb3RlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldEZvb3RlcigpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICAgIHZhciBodG1sID0gW107XG5cbiAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93Rm9vdGVyIHx8IHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmNhcmRWaWV3ICYmIHRoaXMub3B0aW9ucy5kZXRhaWxWaWV3KSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzx0ZD48ZGl2IGNsYXNzPVwidGgtaW5uZXJcIj4mbmJzcDs8L2Rpdj48ZGl2IGNsYXNzPVwiZmh0LWNlbGxcIj48L2Rpdj48L3RkPicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTYgPSB0cnVlO1xuICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjE2ID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMTYgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTYgPSB0aGlzLmNvbHVtbnNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDE2OyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xNiA9IChfc3RlcDE2ID0gX2l0ZXJhdG9yMTYubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjE2ID0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YXIgY29sdW1uID0gX3N0ZXAxNi52YWx1ZTtcblxuICAgICAgICAgICAgICB2YXIgZmFsaWduID0gJyc7XG5cbiAgICAgICAgICAgICAgdmFyIHZhbGlnbiA9ICcnO1xuICAgICAgICAgICAgICB2YXIgY3NzZXMgPSBbXTtcbiAgICAgICAgICAgICAgdmFyIHN0eWxlID0ge307XG4gICAgICAgICAgICAgIHZhciBjbGFzc18gPSBVdGlscy5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJywgY29sdW1uWydjbGFzcyddKTtcblxuICAgICAgICAgICAgICBpZiAoIWNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldyAmJiAhY29sdW1uLmNhcmRWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZmFsaWduID0gVXRpbHMuc3ByaW50ZigndGV4dC1hbGlnbjogJXM7ICcsIGNvbHVtbi5mYWxpZ24gPyBjb2x1bW4uZmFsaWduIDogY29sdW1uLmFsaWduKTtcbiAgICAgICAgICAgICAgdmFsaWduID0gVXRpbHMuc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLCBjb2x1bW4udmFsaWduKTtcblxuICAgICAgICAgICAgICBzdHlsZSA9IFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsIHRoaXMub3B0aW9ucy5mb290ZXJTdHlsZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHN0eWxlICYmIHN0eWxlLmNzcykge1xuICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjE3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMTcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTcgPSBPYmplY3Qua2V5cyhzdHlsZS5jc3MpW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAxNzsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTcgPSAoX3N0ZXAxNyA9IF9pdGVyYXRvcjE3Lm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xNyA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9yZWYyMSA9IF9zdGVwMTcudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIF9yZWYyMiA9IF9zbGljZWRUb0FycmF5KF9yZWYyMSwgMik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IF9yZWYyMlswXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3JlZjIyWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGNzc2VzLnB1c2goa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMTcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxNyA9IGVycjtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTcgJiYgX2l0ZXJhdG9yMTcucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTcucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjE3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IxNztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkJywgY2xhc3NfLCBVdGlscy5zcHJpbnRmKCcgc3R5bGU9XCIlc1wiJywgZmFsaWduICsgdmFsaWduICsgY3NzZXMuY29uY2F0KCkuam9pbignOyAnKSksICc+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cInRoLWlubmVyXCI+Jyk7XG5cbiAgICAgICAgICAgICAgaHRtbC5wdXNoKFV0aWxzLmNhbGN1bGF0ZU9iamVjdFZhbHVlKGNvbHVtbiwgY29sdW1uLmZvb3RlckZvcm1hdHRlciwgW2RhdGFdLCAnJm5ic3A7JykgfHwgJyZuYnNwOycpO1xuXG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC90ZD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMTYgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxNiA9IGVycjtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTYgJiYgX2l0ZXJhdG9yMTYucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTYucmV0dXJuKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjE2KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IxNjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuJHRhYmxlRm9vdGVyLmZpbmQoJ3RyJykuaHRtbChodG1sLmpvaW4oJycpKTtcbiAgICAgICAgICB0aGlzLiR0YWJsZUZvb3Rlci5zaG93KCk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEZvb3Rlcl8pO1xuICAgICAgICAgIHRoaXMudGltZW91dEZvb3Rlcl8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5maXRGb290ZXIsIHRoaXMpLCB0aGlzLiRlbC5pcygnOmhpZGRlbicpID8gMTAwIDogMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZml0Rm9vdGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZpdEZvb3RlcigpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0Rm9vdGVyXyk7XG4gICAgICAgICAgaWYgKHRoaXMuJGVsLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dEZvb3Rlcl8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5maXRGb290ZXIsIHRoaXMpLCAxMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBlbFdpZHRoID0gdGhpcy4kZWwuY3NzKCd3aWR0aCcpO1xuICAgICAgICAgIHZhciBzY3JvbGxXaWR0aCA9IGVsV2lkdGggPiB0aGlzLiR0YWJsZUJvZHkud2lkdGgoKSA/IFV0aWxzLmdldFNjcm9sbEJhcldpZHRoKCkgOiAwO1xuXG4gICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuY3NzKHtcbiAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBzY3JvbGxXaWR0aFxuICAgICAgICAgIH0pLmZpbmQoJ3RhYmxlJykuY3NzKCd3aWR0aCcsIGVsV2lkdGgpLmF0dHIoJ2NsYXNzJywgdGhpcy4kZWwuYXR0cignY2xhc3MnKSk7XG5cbiAgICAgICAgICB2YXIgJGZvb3RlclRkID0gdGhpcy4kdGFibGVGb290ZXIuZmluZCgndGQnKTtcblxuICAgICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPnRyOmZpcnN0LWNoaWxkOm5vdCgubm8tcmVjb3Jkcy1mb3VuZCkgPiAqJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQoZWwpO1xuXG4gICAgICAgICAgICAkZm9vdGVyVGQuZXEoaSkuZmluZCgnLmZodC1jZWxsJykud2lkdGgoJHRoaXMuaW5uZXJXaWR0aCgpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2hvcml6b250YWxTY3JvbGwnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaG9yaXpvbnRhbFNjcm9sbCgpIHtcbiAgICAgICAgICB2YXIgX3RoaXMxMyA9IHRoaXM7XG5cbiAgICAgICAgICAvLyBob3Jpem9udGFsIHNjcm9sbCBldmVudFxuICAgICAgICAgIC8vIFRPRE86IGl0J3MgcHJvYmFibHkgYmV0dGVyIGltcHJvdmluZyB0aGUgbGF5b3V0IHRoYW4gYmluZGluZyB0byBzY3JvbGwgZXZlbnRcblxuICAgICAgICAgIHRoaXMudHJpZ2dlcignc2Nyb2xsLWJvZHknKTtcbiAgICAgICAgICB0aGlzLiR0YWJsZUJvZHkub2ZmKCdzY3JvbGwnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKF9yZWYyMykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUYXJnZXQgPSBfcmVmMjMuY3VycmVudFRhcmdldDtcblxuICAgICAgICAgICAgaWYgKF90aGlzMTMub3B0aW9ucy5zaG93SGVhZGVyICYmIF90aGlzMTMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgX3RoaXMxMy4kdGFibGVIZWFkZXIuc2Nyb2xsTGVmdCgkKGN1cnJlbnRUYXJnZXQpLnNjcm9sbExlZnQoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdGhpczEzLm9wdGlvbnMuc2hvd0Zvb3RlciAmJiAhX3RoaXMxMy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAgIF90aGlzMTMuJHRhYmxlRm9vdGVyLnNjcm9sbExlZnQoJChjdXJyZW50VGFyZ2V0KS5zY3JvbGxMZWZ0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZUNvbHVtbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVDb2x1bW4oaW5kZXgsIGNoZWNrZWQsIG5lZWRVcGRhdGUpIHtcbiAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29sdW1uc1tpbmRleF0udmlzaWJsZSA9IGNoZWNrZWQ7XG4gICAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciAkaXRlbXMgPSB0aGlzLiR0b29sYmFyLmZpbmQoJy5rZWVwLW9wZW4gaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKG5lZWRVcGRhdGUpIHtcbiAgICAgICAgICAgICAgJGl0ZW1zLmZpbHRlcihVdGlscy5zcHJpbnRmKCdbdmFsdWU9XCIlc1wiXScsIGluZGV4KSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPD0gdGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMpIHtcbiAgICAgICAgICAgICAgJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRWaXNpYmxlRmllbGRzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFZpc2libGVGaWVsZHMoKSB7XG4gICAgICAgICAgdmFyIHZpc2libGVGaWVsZHMgPSBbXTtcblxuICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTggPSB0cnVlO1xuICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjE4ID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMTggPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTggPSB0aGlzLmhlYWRlci5maWVsZHNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDE4OyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xOCA9IChfc3RlcDE4ID0gX2l0ZXJhdG9yMTgubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjE4ID0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YXIgZmllbGQgPSBfc3RlcDE4LnZhbHVlO1xuXG4gICAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLmNvbHVtbnNbdGhpcy5maWVsZHNDb2x1bW5zSW5kZXhbZmllbGRdXTtcblxuICAgICAgICAgICAgICBpZiAoIWNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmlzaWJsZUZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMTggPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IxOCA9IGVycjtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTggJiYgX2l0ZXJhdG9yMTgucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTgucmV0dXJuKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjE4KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IxODtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB2aXNpYmxlRmllbGRzO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3Jlc2V0VmlldycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldFZpZXcocGFyYW1zKSB7XG4gICAgICAgICAgdmFyIHBhZGRpbmcgPSAwO1xuXG4gICAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLiRzZWxlY3RBbGwucHJvcCgnY2hlY2tlZCcsIHRoaXMuJHNlbGVjdEl0ZW0ubGVuZ3RoID4gMCAmJiB0aGlzLiRzZWxlY3RJdGVtLmxlbmd0aCA9PT0gdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgdG9vbGJhckhlaWdodCA9IHRoaXMuJHRvb2xiYXIub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgcGFnaW5hdGlvbkhlaWdodCA9IHRoaXMuJHBhZ2luYXRpb24ub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmhlaWdodCAtIHRvb2xiYXJIZWlnaHQgLSBwYWdpbmF0aW9uSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5jc3MoJ2hlaWdodCcsIGhlaWdodCArICdweCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FyZFZpZXcpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBjc3NcbiAgICAgICAgICAgIHRoaXMuJGVsLmNzcygnbWFyZ2luLXRvcCcsICcwJyk7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJywgJzAnKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlRm9vdGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIZWFkZXIgJiYgdGhpcy5vcHRpb25zLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVIZWFkZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5yZXNldEhlYWRlcigpO1xuICAgICAgICAgICAgcGFkZGluZyArPSB0aGlzLiRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVIZWFkZXIuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdwb3N0LWhlYWRlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Zvb3Rlcikge1xuICAgICAgICAgICAgdGhpcy5yZXNldEZvb3RlcigpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgcGFkZGluZyArPSB0aGlzLiR0YWJsZUZvb3Rlci5vdXRlckhlaWdodCgpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBc3NpZ24gdGhlIGNvcnJlY3Qgc29ydGFibGUgYXJyb3dcbiAgICAgICAgICB0aGlzLmdldENhcmV0KCk7XG4gICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsIHBhZGRpbmcgKyAncHgnKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc2V0LXZpZXcnKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXREYXRhJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldERhdGEodXNlQ3VycmVudFBhZ2UpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhO1xuICAgICAgICAgIGlmICh0aGlzLnNlYXJjaFRleHQgfHwgdGhpcy5vcHRpb25zLnNvcnROYW1lIHx8ICEkLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zKSB8fCAhJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwpKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1c2VDdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuc2xpY2UodGhpcy5wYWdlRnJvbSAtIDEsIHRoaXMucGFnZVRvKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdsb2FkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQoX2RhdGEpIHtcbiAgICAgICAgICB2YXIgZml4ZWRTY3JvbGwgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgZGF0YSA9IF9kYXRhO1xuXG4gICAgICAgICAgLy8gIzQzMTogc3VwcG9ydCBwYWdpbmF0aW9uXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uICYmIHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFJvd3MgPSBkYXRhW3RoaXMub3B0aW9ucy50b3RhbEZpZWxkXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXhlZFNjcm9sbCA9IGRhdGEuZml4ZWRTY3JvbGw7XG4gICAgICAgICAgZGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogZGF0YVt0aGlzLm9wdGlvbnMuZGF0YUZpZWxkXTtcblxuICAgICAgICAgIHRoaXMuaW5pdERhdGEoZGF0YSk7XG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkoZml4ZWRTY3JvbGwpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2FwcGVuZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBlbmQoZGF0YSkge1xuICAgICAgICAgIHRoaXMuaW5pdERhdGEoZGF0YSwgJ2FwcGVuZCcpO1xuICAgICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdwcmVwZW5kJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByZXBlbmQoZGF0YSkge1xuICAgICAgICAgIHRoaXMuaW5pdERhdGEoZGF0YSwgJ3ByZXBlbmQnKTtcbiAgICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVtb3ZlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgbGVuID0gdGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIHZhciBpID0gdm9pZCAwO1xuICAgICAgICAgIHZhciByb3cgPSB2b2lkIDA7XG5cbiAgICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnZmllbGQnKSB8fCAhcGFyYW1zLmhhc093blByb3BlcnR5KCd2YWx1ZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMuZGF0YVtpXTtcblxuICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkocGFyYW1zLmZpZWxkKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMudmFsdWVzLmluY2x1ZGVzKHJvd1twYXJhbXMuZmllbGRdKSkge1xuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRvdGFsUm93cyAtPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGxlbiA9PT0gdGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbW92ZUFsbCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSgwLCB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRSb3dCeVVuaXF1ZUlkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJvd0J5VW5pcXVlSWQoX2lkKSB7XG4gICAgICAgICAgdmFyIHVuaXF1ZUlkID0gdGhpcy5vcHRpb25zLnVuaXF1ZUlkO1xuICAgICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgdmFyIGlkID0gX2lkO1xuICAgICAgICAgIHZhciBkYXRhUm93ID0gbnVsbDtcbiAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgcm93ID0gdm9pZCAwO1xuICAgICAgICAgIHZhciByb3dVbmlxdWVJZCA9IHZvaWQgMDtcblxuICAgICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMuZGF0YVtpXTtcblxuICAgICAgICAgICAgaWYgKHJvdy5oYXNPd25Qcm9wZXJ0eSh1bmlxdWVJZCkpIHtcbiAgICAgICAgICAgICAgLy8gdW5pcXVlSWQgaXMgYSBjb2x1bW5cbiAgICAgICAgICAgICAgcm93VW5pcXVlSWQgPSByb3dbdW5pcXVlSWRdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuX2RhdGEgJiYgcm93Ll9kYXRhLmhhc093blByb3BlcnR5KHVuaXF1ZUlkKSkge1xuICAgICAgICAgICAgICAvLyB1bmlxdWVJZCBpcyBhIHJvdyBkYXRhIHByb3BlcnR5XG4gICAgICAgICAgICAgIHJvd1VuaXF1ZUlkID0gcm93Ll9kYXRhW3VuaXF1ZUlkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvd1VuaXF1ZUlkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBpZCA9IGlkLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByb3dVbmlxdWVJZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgaWYgKE51bWJlcihyb3dVbmlxdWVJZCkgPT09IHJvd1VuaXF1ZUlkICYmIHJvd1VuaXF1ZUlkICUgMSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlkID0gcGFyc2VJbnQoaWQpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvd1VuaXF1ZUlkID09PSBOdW1iZXIocm93VW5pcXVlSWQpICYmIHJvd1VuaXF1ZUlkICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWQgPSBwYXJzZUZsb2F0KGlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93VW5pcXVlSWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgIGRhdGFSb3cgPSByb3c7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhUm93O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbW92ZUJ5VW5pcXVlSWQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlQnlVbmlxdWVJZChpZCkge1xuICAgICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2V0Um93QnlVbmlxdWVJZChpZCk7XG5cbiAgICAgICAgICBpZiAocm93KSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YS5zcGxpY2UodGhpcy5vcHRpb25zLmRhdGEuaW5kZXhPZihyb3cpLCAxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobGVuID09PSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVCeVVuaXF1ZUlkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUJ5VW5pcXVlSWQocGFyYW1zKSB7XG4gICAgICAgICAgdmFyIGFsbFBhcmFtcyA9IEFycmF5LmlzQXJyYXkocGFyYW1zKSA/IHBhcmFtcyA6IFtwYXJhbXNdO1xuXG4gICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xOSA9IHRydWU7XG4gICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMTkgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IxOSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxOSA9IGFsbFBhcmFtc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMTk7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjE5ID0gKF9zdGVwMTkgPSBfaXRlcmF0b3IxOS5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMTkgPSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciBfcGFyYW1zID0gX3N0ZXAxOS52YWx1ZTtcblxuICAgICAgICAgICAgICBpZiAoIV9wYXJhbXMuaGFzT3duUHJvcGVydHkoJ2lkJykgfHwgIV9wYXJhbXMuaGFzT3duUHJvcGVydHkoJ3JvdycpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcm93SWQgPSB0aGlzLm9wdGlvbnMuZGF0YS5pbmRleE9mKHRoaXMuZ2V0Um93QnlVbmlxdWVJZChfcGFyYW1zLmlkKSk7XG5cbiAgICAgICAgICAgICAgaWYgKHJvd0lkID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICQuZXh0ZW5kKHRoaXMub3B0aW9ucy5kYXRhW3Jvd0lkXSwgX3BhcmFtcy5yb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IxOSA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjE5ID0gZXJyO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24xOSAmJiBfaXRlcmF0b3IxOS5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3IxOS5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMTkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjE5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlZnJlc2hDb2x1bW5UaXRsZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZWZyZXNoQ29sdW1uVGl0bGUocGFyYW1zKSB7XG4gICAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndGl0bGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY29sdW1uc1t0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFtwYXJhbXMuZmllbGRdXS50aXRsZSA9IHRoaXMub3B0aW9ucy5lc2NhcGUgPyBVdGlscy5lc2NhcGVIVE1MKHBhcmFtcy50aXRsZSkgOiBwYXJhbXMudGl0bGU7XG5cbiAgICAgICAgICBpZiAodGhpcy5jb2x1bW5zW3RoaXMuZmllbGRzQ29sdW1uc0luZGV4W3BhcmFtcy5maWVsZF1dLnZpc2libGUpIHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm9wdGlvbnMuaGVpZ2h0ICE9PSB1bmRlZmluZWQgPyB0aGlzLiR0YWJsZUhlYWRlciA6IHRoaXMuJGhlYWRlcjtcbiAgICAgICAgICAgIGhlYWRlci5maW5kKCd0aFtkYXRhLWZpZWxkXScpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgIGlmICgkKGVsKS5kYXRhKCdmaWVsZCcpID09PSBwYXJhbXMuZmllbGQpIHtcbiAgICAgICAgICAgICAgICAkKCQoZWwpLmZpbmQoJy50aC1pbm5lcicpWzBdKS50ZXh0KHBhcmFtcy50aXRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5zZXJ0Um93JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluc2VydFJvdyhwYXJhbXMpIHtcbiAgICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSB8fCAhcGFyYW1zLmhhc093blByb3BlcnR5KCdyb3cnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YS5zcGxpY2UocGFyYW1zLmluZGV4LCAwLCBwYXJhbXMucm93KTtcbiAgICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndXBkYXRlUm93JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVJvdyhwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgYWxsUGFyYW1zID0gQXJyYXkuaXNBcnJheShwYXJhbXMpID8gcGFyYW1zIDogW3BhcmFtc107XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIwID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IyMCA9IGZhbHNlO1xuICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjIwID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIwID0gYWxsUGFyYW1zW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyMDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMjAgPSAoX3N0ZXAyMCA9IF9pdGVyYXRvcjIwLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMCA9IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIF9wYXJhbXMyID0gX3N0ZXAyMC52YWx1ZTtcblxuICAgICAgICAgICAgICBpZiAoIV9wYXJhbXMyLmhhc093blByb3BlcnR5KCdpbmRleCcpIHx8ICFfcGFyYW1zMi5oYXNPd25Qcm9wZXJ0eSgncm93JykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnMuZGF0YVtfcGFyYW1zMi5pbmRleF0sIF9wYXJhbXMyLnJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjIwID0gdHJ1ZTtcbiAgICAgICAgICAgIF9pdGVyYXRvckVycm9yMjAgPSBlcnI7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIwICYmIF9pdGVyYXRvcjIwLnJldHVybikge1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIwLnJldHVybigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyMCkge1xuICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMjA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaW5pdEhpZGRlblJvd3MnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdEhpZGRlblJvd3MoKSB7XG4gICAgICAgICAgdGhpcy5oaWRkZW5Sb3dzID0gW107XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2hvd1JvdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93Um93KHBhcmFtcykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUm93KHBhcmFtcywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGlkZVJvdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoaWRlUm93KHBhcmFtcykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUm93KHBhcmFtcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZVJvdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVSb3cocGFyYW1zLCB2aXNpYmxlKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHZvaWQgMDtcblxuICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2luZGV4JykpIHtcbiAgICAgICAgICAgIHJvdyA9IHRoaXMuZ2V0RGF0YSgpW3BhcmFtcy5pbmRleF07XG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3VuaXF1ZUlkJykpIHtcbiAgICAgICAgICAgIHJvdyA9IHRoaXMuZ2V0Um93QnlVbmlxdWVJZChwYXJhbXMudW5pcXVlSWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghcm93KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5oaWRkZW5Sb3dzLmluZGV4T2Yocm93KTtcblxuICAgICAgICAgIGlmICghdmlzaWJsZSAmJiBpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZGVuUm93cy5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmICh2aXNpYmxlICYmIGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZGVuUm93cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldEhpZGRlblJvd3MnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGlkZGVuUm93cyhzaG93KSB7XG4gICAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEhpZGRlblJvd3MoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgdmFyIHJvd3MgPSBbXTtcblxuICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMjEgPSB0cnVlO1xuICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIxID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMjEgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjEgPSBkYXRhW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyMTsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMjEgPSAoX3N0ZXAyMSA9IF9pdGVyYXRvcjIxLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMSA9IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIHJvdyA9IF9zdGVwMjEudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuaGlkZGVuUm93cy5pbmNsdWRlcyhyb3cpKSB7XG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMjEgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IyMSA9IGVycjtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMjEgJiYgX2l0ZXJhdG9yMjEucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yMjEucmV0dXJuKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjIxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IyMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuaGlkZGVuUm93cyA9IHJvd3M7XG4gICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnbWVyZ2VDZWxscycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBtZXJnZUNlbGxzKG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgcm93ID0gb3B0aW9ucy5pbmRleDtcbiAgICAgICAgICB2YXIgY29sID0gdGhpcy5nZXRWaXNpYmxlRmllbGRzKCkuaW5kZXhPZihvcHRpb25zLmZpZWxkKTtcbiAgICAgICAgICB2YXIgcm93c3BhbiA9IG9wdGlvbnMucm93c3BhbiB8fCAxO1xuICAgICAgICAgIHZhciBjb2xzcGFuID0gb3B0aW9ucy5jb2xzcGFuIHx8IDE7XG4gICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgICAgdmFyIGogPSB2b2lkIDA7XG4gICAgICAgICAgdmFyICR0ciA9IHRoaXMuJGJvZHkuZmluZCgnPnRyJyk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRldGFpbFZpZXcgJiYgIXRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgY29sICs9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyICR0ZCA9ICR0ci5lcShyb3cpLmZpbmQoJz50ZCcpLmVxKGNvbCk7XG5cbiAgICAgICAgICBpZiAocm93IDwgMCB8fCBjb2wgPCAwIHx8IHJvdyA+PSB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChpID0gcm93OyBpIDwgcm93ICsgcm93c3BhbjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGogPSBjb2w7IGogPCBjb2wgKyBjb2xzcGFuOyBqKyspIHtcbiAgICAgICAgICAgICAgJHRyLmVxKGkpLmZpbmQoJz50ZCcpLmVxKGopLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdGQuYXR0cigncm93c3BhbicsIHJvd3NwYW4pLmF0dHIoJ2NvbHNwYW4nLCBjb2xzcGFuKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndXBkYXRlQ2VsbCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVDZWxsKHBhcmFtcykge1xuICAgICAgICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KCdpbmRleCcpIHx8ICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmRhdGFbcGFyYW1zLmluZGV4XVtwYXJhbXMuZmllbGRdID0gcGFyYW1zLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHBhcmFtcy5yZWluaXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3VwZGF0ZUNlbGxCeUlkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUNlbGxCeUlkKHBhcmFtcykge1xuICAgICAgICAgIHZhciBfdGhpczE0ID0gdGhpcztcblxuICAgICAgICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KCdpZCcpIHx8ICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgYWxsUGFyYW1zID0gQXJyYXkuaXNBcnJheShwYXJhbXMpID8gcGFyYW1zIDogW3BhcmFtc107XG5cbiAgICAgICAgICBhbGxQYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZjI0KSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBfcmVmMjQuaWQsXG4gICAgICAgICAgICAgICAgZmllbGQgPSBfcmVmMjQuZmllbGQsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBfcmVmMjQudmFsdWU7XG5cbiAgICAgICAgICAgIHZhciByb3dJZCA9IF90aGlzMTQub3B0aW9ucy5kYXRhLmluZGV4T2YoX3RoaXMxNC5nZXRSb3dCeVVuaXF1ZUlkKGlkKSk7XG5cbiAgICAgICAgICAgIGlmIChyb3dJZCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMxNC5kYXRhW3Jvd0lkXVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChwYXJhbXMucmVpbml0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRPcHRpb25zJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgICAgICAgLy8gRGVlcCBjb3B5OiByZW1vdmUgZGF0YVxuICAgICAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbnMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFNlbGVjdGlvbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2VsZWN0aW9ucygpIHtcbiAgICAgICAgICB2YXIgX3RoaXMxNSA9IHRoaXM7XG5cbiAgICAgICAgICAvLyBmaXggIzI0MjQ6IGZyb20gaHRtbCB3aXRoIGNoZWNrYm94XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kYXRhLmZpbHRlcihmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gcm93W190aGlzMTUuaGVhZGVyLnN0YXRlRmllbGRdID09PSB0cnVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldEFsbFNlbGVjdGlvbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWxsU2VsZWN0aW9ucygpIHtcbiAgICAgICAgICB2YXIgX3RoaXMxNiA9IHRoaXM7XG5cbiAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRhdGEuZmlsdGVyKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiByb3dbX3RoaXMxNi5oZWFkZXIuc3RhdGVGaWVsZF07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnY2hlY2tBbGwnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2hlY2tBbGwoKSB7XG4gICAgICAgICAgdGhpcy5jaGVja0FsbF8odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndW5jaGVja0FsbCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1bmNoZWNrQWxsKCkge1xuICAgICAgICAgIHRoaXMuY2hlY2tBbGxfKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjaGVja0ludmVydCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGVja0ludmVydCgpIHtcbiAgICAgICAgICB2YXIgJGl0ZW1zID0gdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJyk7XG4gICAgICAgICAgdmFyIGNoZWNrZWQgPSAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgJChlbCkucHJvcCgnY2hlY2tlZCcsICEkKGVsKS5wcm9wKCdjaGVja2VkJykpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3VuY2hlY2stc29tZScsIGNoZWNrZWQpO1xuICAgICAgICAgIGNoZWNrZWQgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoZWNrLXNvbWUnLCBjaGVja2VkKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjaGVja0FsbF8nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2hlY2tBbGxfKGNoZWNrZWQpIHtcbiAgICAgICAgICB2YXIgcm93cyA9IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICAgICAgICAgIHJvd3MgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy4kc2VsZWN0QWxsLmFkZCh0aGlzLiRzZWxlY3RBbGxfKS5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xuICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICByb3dzID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrLWFsbCcgOiAndW5jaGVjay1hbGwnLCByb3dzKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjaGVjaycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGVjayhpbmRleCkge1xuICAgICAgICAgIHRoaXMuY2hlY2tfKHRydWUsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1bmNoZWNrJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVuY2hlY2soaW5kZXgpIHtcbiAgICAgICAgICB0aGlzLmNoZWNrXyhmYWxzZSwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2NoZWNrXycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGVja18oY2hlY2tlZCwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgJGVsID0gdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJ1tkYXRhLWluZGV4PVwiJyArIGluZGV4ICsgJ1wiXScpO1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLmRhdGFbaW5kZXhdO1xuXG4gICAgICAgICAgaWYgKCRlbC5pcygnOnJhZGlvJykgfHwgdGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCkge1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMiA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IyMiA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMjIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIyID0gdGhpcy5vcHRpb25zLmRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDIyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMiA9IChfc3RlcDIyID0gX2l0ZXJhdG9yMjIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIyID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciByID0gX3N0ZXAyMi52YWx1ZTtcblxuICAgICAgICAgICAgICAgIHJbdGhpcy5oZWFkZXIuc3RhdGVGaWVsZF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMjIgPSB0cnVlO1xuICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjIyID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMiAmJiBfaXRlcmF0b3IyMi5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIyLnJldHVybigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyMikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IyMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzpjaGVja2VkJykubm90KCRlbCkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByb3dbdGhpcy5oZWFkZXIuc3RhdGVGaWVsZF0gPSBjaGVja2VkO1xuICAgICAgICAgICRlbC5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrJyA6ICd1bmNoZWNrJywgdGhpcy5kYXRhW2luZGV4XSwgJGVsKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjaGVja0J5JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrQnkob2JqKSB7XG4gICAgICAgICAgdGhpcy5jaGVja0J5Xyh0cnVlLCBvYmopO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3VuY2hlY2tCeScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1bmNoZWNrQnkob2JqKSB7XG4gICAgICAgICAgdGhpcy5jaGVja0J5XyhmYWxzZSwgb2JqKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjaGVja0J5XycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGVja0J5XyhjaGVja2VkLCBvYmopIHtcbiAgICAgICAgICB2YXIgX3RoaXMxNyA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eSgnZmllbGQnKSB8fCAhb2JqLmhhc093blByb3BlcnR5KCd2YWx1ZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuZm9yRWFjaChmdW5jdGlvbiAocm93LCBpKSB7XG4gICAgICAgICAgICBpZiAoIXJvdy5oYXNPd25Qcm9wZXJ0eShvYmouZmllbGQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvYmoudmFsdWVzLmluY2x1ZGVzKHJvd1tvYmouZmllbGRdKSkge1xuICAgICAgICAgICAgICB2YXIgJGVsID0gX3RoaXMxNy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykuZmlsdGVyKFV0aWxzLnNwcmludGYoJ1tkYXRhLWluZGV4PVwiJXNcIl0nLCBpKSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgICByb3dbX3RoaXMxNy5oZWFkZXIuc3RhdGVGaWVsZF0gPSBjaGVja2VkO1xuICAgICAgICAgICAgICByb3dzLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgX3RoaXMxNy50cmlnZ2VyKGNoZWNrZWQgPyAnY2hlY2snIDogJ3VuY2hlY2snLCByb3csICRlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrLXNvbWUnIDogJ3VuY2hlY2stc29tZScsIHJvd3MpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2Rlc3Ryb3knLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICB0aGlzLiRlbC5pbnNlcnRCZWZvcmUodGhpcy4kY29udGFpbmVyKTtcbiAgICAgICAgICAkKHRoaXMub3B0aW9ucy50b29sYmFyKS5pbnNlcnRCZWZvcmUodGhpcy4kZWwpO1xuICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5uZXh0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgdGhpcy4kY29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy4kZWxfLmh0bWwoKSkuY3NzKCdtYXJnaW4tdG9wJywgJzAnKS5hdHRyKCdjbGFzcycsIHRoaXMuJGVsXy5hdHRyKCdjbGFzcycpIHx8ICcnKTsgLy8gcmVzZXQgdGhlIGNsYXNzXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2hvd0xvYWRpbmcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvd0xvYWRpbmcoKSB7XG4gICAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdoaWRlTG9hZGluZycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgICAgICAgICB0aGlzLiR0YWJsZUxvYWRpbmcuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZVBhZ2luYXRpb24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlUGFnaW5hdGlvbigpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnaW5hdGlvbiA9ICF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbjtcbiAgICAgICAgICB2YXIgYnV0dG9uID0gdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIl0gaScpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgYnV0dG9uLmF0dHIoJ2NsYXNzJywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4ICsgJyAnICsgdGhpcy5vcHRpb25zLmljb25zLnBhZ2luYXRpb25Td2l0Y2hEb3duKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnV0dG9uLmF0dHIoJ2NsYXNzJywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4ICsgJyAnICsgdGhpcy5vcHRpb25zLmljb25zLnBhZ2luYXRpb25Td2l0Y2hVcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZUZ1bGxzY3JlZW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICB0aGlzLiRlbC5jbG9zZXN0KCcuYm9vdHN0cmFwLXRhYmxlJykudG9nZ2xlQ2xhc3MoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdyZWZyZXNoJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlZnJlc2gocGFyYW1zKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMudXJsKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudXJsID0gcGFyYW1zLnVybDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMucGFnZU51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSBwYXJhbXMucGFnZU51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMucGFnZVNpemUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSA9IHBhcmFtcy5wYWdlU2l6ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pbml0U2VydmVyKHBhcmFtcyAmJiBwYXJhbXMuc2lsZW50LCBwYXJhbXMgJiYgcGFyYW1zLnF1ZXJ5LCBwYXJhbXMgJiYgcGFyYW1zLnVybCk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZWZyZXNoJywgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdyZXNldFdpZHRoJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0V2lkdGgoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGVhZGVyICYmIHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuZml0SGVhZGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Zvb3RlciAmJiAhdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLmZpdEZvb3RlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzaG93Q29sdW1uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNob3dDb2x1bW4oZmllbGQpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZUNvbHVtbih0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFtmaWVsZF0sIHRydWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2hpZGVDb2x1bW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZUNvbHVtbihmaWVsZCkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlQ29sdW1uKHRoaXMuZmllbGRzQ29sdW1uc0luZGV4W2ZpZWxkXSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldEhpZGRlbkNvbHVtbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGlkZGVuQ29sdW1ucygpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5zLmZpbHRlcihmdW5jdGlvbiAoX3JlZjI1KSB7XG4gICAgICAgICAgICB2YXIgdmlzaWJsZSA9IF9yZWYyNS52aXNpYmxlO1xuICAgICAgICAgICAgcmV0dXJuICF2aXNpYmxlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFZpc2libGVDb2x1bW5zJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFZpc2libGVDb2x1bW5zKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMjYpIHtcbiAgICAgICAgICAgIHZhciB2aXNpYmxlID0gX3JlZjI2LnZpc2libGU7XG4gICAgICAgICAgICByZXR1cm4gdmlzaWJsZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd0b2dnbGVBbGxDb2x1bW5zJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZUFsbENvbHVtbnModmlzaWJsZSkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMjMgPSB0cnVlO1xuICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIzID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMjMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjMgPSB0aGlzLmNvbHVtbnNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDIzOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yMyA9IChfc3RlcDIzID0gX2l0ZXJhdG9yMjMubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIzID0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YXIgY29sdW1uID0gX3N0ZXAyMy52YWx1ZTtcblxuICAgICAgICAgICAgICBjb2x1bW4udmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjIzID0gdHJ1ZTtcbiAgICAgICAgICAgIF9pdGVyYXRvckVycm9yMjMgPSBlcnI7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIzICYmIF9pdGVyYXRvcjIzLnJldHVybikge1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIzLnJldHVybigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyMykge1xuICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMjM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciAkaXRlbXMgPSB0aGlzLiR0b29sYmFyLmZpbmQoJy5rZWVwLW9wZW4gaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKCRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoIDw9IHRoaXMub3B0aW9ucy5taW5pbXVtQ291bnRDb2x1bW5zKSB7XG4gICAgICAgICAgICAgICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2hvd0FsbENvbHVtbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvd0FsbENvbHVtbnMoKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVBbGxDb2x1bW5zKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2hpZGVBbGxDb2x1bW5zJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGVBbGxDb2x1bW5zKCkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlQWxsQ29sdW1ucyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZmlsdGVyQnknLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZmlsdGVyQnkoY29sdW1ucykge1xuICAgICAgICAgIHRoaXMuZmlsdGVyQ29sdW1ucyA9ICQuaXNFbXB0eU9iamVjdChjb2x1bW5zKSA/IHt9IDogY29sdW1ucztcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2Nyb2xsVG8nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2Nyb2xsVG8oX3ZhbHVlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBfdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kdGFibGVCb2R5LnNjcm9sbFRvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgICAgaWYgKHR5cGVvZiBfdmFsdWUgPT09ICdzdHJpbmcnICYmIF92YWx1ZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy4kdGFibGVCb2R5WzBdLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy4kdGFibGVCb2R5LnNjcm9sbFRvcCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0U2Nyb2xsUG9zaXRpb24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG8oKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzZWxlY3RQYWdlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdFBhZ2UocGFnZSkge1xuICAgICAgICAgIGlmIChwYWdlID4gMCAmJiBwYWdlIDw9IHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IHBhZ2U7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAncHJldlBhZ2UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcHJldlBhZ2UoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID4gMSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXItLTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICduZXh0UGFnZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0UGFnZSgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPCB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd0b2dnbGVWaWV3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZVZpZXcoKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNhcmRWaWV3ID0gIXRoaXMub3B0aW9ucy5jYXJkVmlldztcbiAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgICAvLyBGaXhlZCByZW1vdmUgdG9vbGJhciB3aGVuIGNsaWNrIGNhcmRWaWV3IGJ1dHRvbi5cbiAgICAgICAgICAvLyB0aGlzLmluaXRUb29sYmFyKCk7XG4gICAgICAgICAgdmFyICRpY29uID0gdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInRvZ2dsZVwiXSBpJyk7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmljb25zLnRvZ2dsZU9mZik7XG4gICAgICAgICAgICAkaWNvbi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuaWNvbnMudG9nZ2xlT24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuaWNvbnMudG9nZ2xlT24pO1xuICAgICAgICAgICAgJGljb24uYWRkQ2xhc3ModGhpcy5vcHRpb25zLmljb25zLnRvZ2dsZU9mZik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RvZ2dsZScsIHRoaXMub3B0aW9ucy5jYXJkVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVmcmVzaE9wdGlvbnMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVmcmVzaE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgIC8vIElmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50IHRoZW4gYXZvaWQgdGhlIGNhbGwgb2YgZGVzdHJveSAvIGluaXQgbWV0aG9kc1xuICAgICAgICAgIGlmIChVdGlscy5jb21wYXJlT2JqZWN0cyh0aGlzLm9wdGlvbnMsIG9wdGlvbnMsIHRydWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZWZyZXNoLW9wdGlvbnMnLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3Jlc2V0U2VhcmNoJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0U2VhcmNoKHRleHQpIHtcbiAgICAgICAgICB2YXIgJHNlYXJjaCA9IHRoaXMuJHRvb2xiYXIuZmluZCgnLnNlYXJjaCBpbnB1dCcpO1xuICAgICAgICAgICRzZWFyY2gudmFsKHRleHQgfHwgJycpO1xuICAgICAgICAgIHRoaXMub25TZWFyY2goeyBjdXJyZW50VGFyZ2V0OiAkc2VhcmNoIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2V4cGFuZFJvd18nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZXhwYW5kUm93XyhleHBhbmQsIGluZGV4KSB7XG4gICAgICAgICAgdmFyICR0ciA9IHRoaXMuJGJvZHkuZmluZChVdGlscy5zcHJpbnRmKCc+IHRyW2RhdGEtaW5kZXg9XCIlc1wiXScsIGluZGV4KSk7XG4gICAgICAgICAgaWYgKCR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykgPT09ICFleHBhbmQpIHtcbiAgICAgICAgICAgICR0ci5maW5kKCc+IHRkID4gLmRldGFpbC1pY29uJykuY2xpY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZXhwYW5kUm93JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGV4cGFuZFJvdyhpbmRleCkge1xuICAgICAgICAgIHRoaXMuZXhwYW5kUm93Xyh0cnVlLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29sbGFwc2VSb3cnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29sbGFwc2VSb3coaW5kZXgpIHtcbiAgICAgICAgICB0aGlzLmV4cGFuZFJvd18oZmFsc2UsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdleHBhbmRBbGxSb3dzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGV4cGFuZEFsbFJvd3MoaXNTdWJUYWJsZSkge1xuICAgICAgICAgIHZhciBfdGhpczE4ID0gdGhpcztcblxuICAgICAgICAgIGlmIChpc1N1YlRhYmxlKSB7XG4gICAgICAgICAgICB2YXIgJHRyID0gdGhpcy4kYm9keS5maW5kKFV0aWxzLnNwcmludGYoJz4gdHJbZGF0YS1pbmRleD1cIiVzXCJdJywgMCkpO1xuICAgICAgICAgICAgdmFyIGRldGFpbEljb24gPSBudWxsO1xuICAgICAgICAgICAgdmFyIGV4ZWN1dGVJbnRlcnZhbCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGlkSW50ZXJ2YWwgPSAtMTtcblxuICAgICAgICAgICAgaWYgKCEkdHIubmV4dCgpLmlzKCd0ci5kZXRhaWwtdmlldycpKSB7XG4gICAgICAgICAgICAgICR0ci5maW5kKCc+IHRkID4gLmRldGFpbC1pY29uJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgZXhlY3V0ZUludGVydmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoISR0ci5uZXh0KCkubmV4dCgpLmlzKCd0ci5kZXRhaWwtdmlldycpKSB7XG4gICAgICAgICAgICAgICR0ci5uZXh0KCkuZmluZCgnLmRldGFpbC1pY29uJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgZXhlY3V0ZUludGVydmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4ZWN1dGVJbnRlcnZhbCkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBkZXRhaWxJY29uID0gX3RoaXMxOC4kYm9keS5maW5kKCd0ci5kZXRhaWwtdmlldycpLmxhc3QoKS5maW5kKCcuZGV0YWlsLWljb24nKTtcbiAgICAgICAgICAgICAgICAgIGlmIChkZXRhaWxJY29uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsSWNvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZEludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGlkSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0cnMgPSB0aGlzLiRib2R5LmNoaWxkcmVuKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB0aGlzLmV4cGFuZFJvd18odHJ1ZSwgJCh0cnNbaV0pLmRhdGEoJ2luZGV4JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjb2xsYXBzZUFsbFJvd3MnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29sbGFwc2VBbGxSb3dzKGlzU3ViVGFibGUpIHtcbiAgICAgICAgICBpZiAoaXNTdWJUYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5leHBhbmRSb3dfKGZhbHNlLCAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRycyA9IHRoaXMuJGJvZHkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHRoaXMuZXhwYW5kUm93XyhmYWxzZSwgJCh0cnNbaV0pLmRhdGEoJ2luZGV4JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVGb3JtYXRUZXh0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUZvcm1hdFRleHQobmFtZSwgdGV4dCkge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNbVXRpbHMuc3ByaW50ZignZm9ybWF0JXMnLCBuYW1lKV0pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zW1V0aWxzLnNwcmludGYoJ2Zvcm1hdCVzJywgbmFtZSldID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbVXRpbHMuc3ByaW50ZignZm9ybWF0JXMnLCBuYW1lKV0gPSB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmluaXRUb29sYmFyKCk7XG4gICAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gQm9vdHN0cmFwVGFibGU7XG4gICAgfSgpO1xuXG4gICAgQm9vdHN0cmFwVGFibGUuREVGQVVMVFMgPSBERUZBVUxUUztcbiAgICBCb290c3RyYXBUYWJsZS5MT0NBTEVTID0gTE9DQUxFUztcbiAgICBCb290c3RyYXBUYWJsZS5DT0xVTU5fREVGQVVMVFMgPSBDT0xVTU5fREVGQVVMVFM7XG4gICAgQm9vdHN0cmFwVGFibGUuRVZFTlRTID0gRVZFTlRTO1xuXG4gICAgLy8gQk9PVFNUUkFQIFRBQkxFIFBMVUdJTiBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhciBhbGxvd2VkTWV0aG9kcyA9IFsnZ2V0T3B0aW9ucycsICdnZXRTZWxlY3Rpb25zJywgJ2dldEFsbFNlbGVjdGlvbnMnLCAnZ2V0RGF0YScsICdsb2FkJywgJ2FwcGVuZCcsICdwcmVwZW5kJywgJ3JlbW92ZScsICdyZW1vdmVBbGwnLCAnaW5zZXJ0Um93JywgJ3VwZGF0ZVJvdycsICd1cGRhdGVDZWxsJywgJ3VwZGF0ZUJ5VW5pcXVlSWQnLCAncmVtb3ZlQnlVbmlxdWVJZCcsICdnZXRSb3dCeVVuaXF1ZUlkJywgJ3Nob3dSb3cnLCAnaGlkZVJvdycsICdnZXRIaWRkZW5Sb3dzJywgJ21lcmdlQ2VsbHMnLCAncmVmcmVzaENvbHVtblRpdGxlJywgJ2NoZWNrQWxsJywgJ3VuY2hlY2tBbGwnLCAnY2hlY2tJbnZlcnQnLCAnY2hlY2snLCAndW5jaGVjaycsICdjaGVja0J5JywgJ3VuY2hlY2tCeScsICdyZWZyZXNoJywgJ3Jlc2V0VmlldycsICdyZXNldFdpZHRoJywgJ2Rlc3Ryb3knLCAnc2hvd0xvYWRpbmcnLCAnaGlkZUxvYWRpbmcnLCAnc2hvd0NvbHVtbicsICdoaWRlQ29sdW1uJywgJ2dldEhpZGRlbkNvbHVtbnMnLCAnZ2V0VmlzaWJsZUNvbHVtbnMnLCAnc2hvd0FsbENvbHVtbnMnLCAnaGlkZUFsbENvbHVtbnMnLCAnZmlsdGVyQnknLCAnc2Nyb2xsVG8nLCAnZ2V0U2Nyb2xsUG9zaXRpb24nLCAnc2VsZWN0UGFnZScsICdwcmV2UGFnZScsICduZXh0UGFnZScsICd0b2dnbGVQYWdpbmF0aW9uJywgJ3RvZ2dsZVZpZXcnLCAncmVmcmVzaE9wdGlvbnMnLCAncmVzZXRTZWFyY2gnLCAnZXhwYW5kUm93JywgJ2NvbGxhcHNlUm93JywgJ2V4cGFuZEFsbFJvd3MnLCAnY29sbGFwc2VBbGxSb3dzJywgJ3VwZGF0ZUZvcm1hdFRleHQnLCAndXBkYXRlQ2VsbEJ5SWQnXTtcblxuICAgICQuQm9vdHN0cmFwVGFibGUgPSBCb290c3RyYXBUYWJsZTtcbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXk1ID0gMTsgX2tleTUgPCBfbGVuMzsgX2tleTUrKykge1xuICAgICAgICBhcmdzW19rZXk1IC0gMV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWUgPSB2b2lkIDA7XG5cbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkKGVsKS5kYXRhKCdib290c3RyYXAudGFibGUnKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQm9vdHN0cmFwVGFibGUuREVGQVVMVFMsICQoZWwpLmRhdGEoKSwgKHR5cGVvZiBvcHRpb24gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG9wdGlvbikpID09PSAnb2JqZWN0JyAmJiBvcHRpb24pO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhciBfZGF0YTI7XG5cbiAgICAgICAgICBpZiAoIWFsbG93ZWRNZXRob2RzLmluY2x1ZGVzKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBtZXRob2Q6ICcgKyBvcHRpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbHVlID0gKF9kYXRhMiA9IGRhdGEpW29wdGlvbl0uYXBwbHkoX2RhdGEyLCBhcmdzKTtcblxuICAgICAgICAgIGlmIChvcHRpb24gPT09ICdkZXN0cm95Jykge1xuICAgICAgICAgICAgJChlbCkucmVtb3ZlRGF0YSgnYm9vdHN0cmFwLnRhYmxlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgJChlbCkuZGF0YSgnYm9vdHN0cmFwLnRhYmxlJywgZGF0YSA9IG5ldyAkLkJvb3RzdHJhcFRhYmxlKGVsLCBvcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5Db25zdHJ1Y3RvciA9IEJvb3RzdHJhcFRhYmxlO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMgPSBCb290c3RyYXBUYWJsZS5ERUZBVUxUUztcbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLmNvbHVtbkRlZmF1bHRzID0gQm9vdHN0cmFwVGFibGUuQ09MVU1OX0RFRkFVTFRTO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcyA9IEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5tZXRob2RzID0gYWxsb3dlZE1ldGhvZHM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS51dGlscyA9IFV0aWxzO1xuXG4gICAgLy8gQk9PVFNUUkFQIFRBQkxFIElOSVRcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0YWJsZVwiXScpLmJvb3RzdHJhcFRhYmxlKCk7XG4gICAgfSk7XG4gIH0pKGpRdWVyeSk7XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAtdGFibGUvZGlzdC9ib290c3RyYXAtdGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2Jvb3RzdHJhcC10YWJsZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDEwIl0sInNvdXJjZVJvb3QiOiIifQ==