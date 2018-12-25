webpackJsonp([10],{

/***/ "./node_modules/bootstrap-table/dist/bootstrap-table.js":
/*!**************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/bootstrap-table.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.12.2
 * https://github.com/wenzhixin/bootstrap-table/
 */

(function ($) {
    'use strict';

    // TOOLS DEFINITION
    // ======================

    var bootstrapVersion = 3;
    try {
        bootstrapVersion = parseInt($.fn.dropdown.Constructor.VERSION, 10);
    } catch (e) {}
    var bs = {
        3: {
            buttonsClass: 'default',
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
            pullClass: 'pull',
            toobarDropdowHtml: ['<ul class="dropdown-menu" role="menu">', '</ul>'],
            toobarDropdowItemHtml: '<li role="menuitem"><label>%s</label></li>',
            pageDropdownHtml: ['<ul class="dropdown-menu" role="menu">', '</ul>'],
            pageDropdownItemHtml: '<li role="menuitem" class="%s"><a href="#">%s</a></li>'
        },
        4: {
            buttonsClass: 'secondary',
            iconsPrefix: 'fa',
            icons: {
                paginationSwitchDown: 'fa-toggle-down',
                paginationSwitchUp: 'fa-toggle-up',
                refresh: 'fa-refresh',
                toggleOff: 'fa-toggle-off',
                toggleOn: 'fa-toggle-on',
                columns: 'fa-th-list',
                detailOpen: 'fa-plus',
                detailClose: 'fa-minus',
                fullscreen: 'fa-arrows-alt'
            },
            pullClass: 'float',
            toobarDropdowHtml: ['<div class="dropdown-menu dropdown-menu-right">', '</div>'],
            toobarDropdowItemHtml: '<label class="dropdown-item">%s</label>',
            pageDropdownHtml: ['<div class="dropdown-menu">', '</div>'],
            pageDropdownItemHtml: '<a class="dropdown-item %s" href="#">%s</a>'
        }
    }[bootstrapVersion];

    var cachedWidth = null;

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    // http://jsfiddle.net/wenyi/47nz7ez9/3/
    var setFieldIndex = function (columns) {
        var i, j, k,
            totalCol = 0,
            flag = [];

        for (i = 0; i < columns[0].length; i++) {
            totalCol += columns[0][i].colspan || 1;
        }

        for (i = 0; i < columns.length; i++) {
            flag[i] = [];
            for (j = 0; j < totalCol; j++) {
                flag[i][j] = false;
            }
        }

        for (i = 0; i < columns.length; i++) {
            for (j = 0; j < columns[i].length; j++) {
                var r = columns[i][j],
                    rowspan = r.rowspan || 1,
                    colspan = r.colspan || 1,
                    index = $.inArray(false, flag[i]);

                if (colspan === 1) {
                    r.fieldIndex = index;
                    // when field is undefined, use index instead
                    if (typeof r.field === 'undefined') {
                        r.field = index;
                    }
                }

                for (k = 0; k < rowspan; k++) {
                    flag[i + k][index] = true;
                }
                for (k = 0; k < colspan; k++) {
                    flag[i][index + k] = true;
                }
            }
        }
    };

    var getScrollBarWidth = function () {
        if (cachedWidth === null) {
            var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
                outer = $('<div/>').addClass('fixed-table-scroll-outer'),
                w1, w2;

            outer.append(inner);
            $('body').append(outer);

            w1 = inner[0].offsetWidth;
            outer.css('overflow', 'scroll');
            w2 = inner[0].offsetWidth;

            if (w1 === w2) {
                w2 = outer[0].clientWidth;
            }

            outer.remove();
            cachedWidth = w1 - w2;
        }
        return cachedWidth;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        var func = name;

        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                func = window;
                $.each(names, function (i, f) {
                    func = func[f];
                });
            } else {
                func = window[name];
            }
        }
        if (typeof func === 'object') {
            return func;
        }
        if (typeof func === 'function') {
            return func.apply(self, args || []);
        }
        if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
            return sprintf.apply(this, [name].concat(args));
        }
        return defaultValue;
    };

    var compareObjects = function (objectA, objectB, compareLength) {
        // Create arrays of property names
        var getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
            var arr = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    arr.push(k);
                }
            }
            return arr;
        };
        var objectAProperties = getOwnPropertyNames(objectA),
            objectBProperties = getOwnPropertyNames(objectB),
            propName = '';

        if (compareLength) {
            // If number of properties is different, objects are not equivalent
            if (objectAProperties.length !== objectBProperties.length) {
                return false;
            }
        }

        for (var i = 0; i < objectAProperties.length; i++) {
            propName = objectAProperties[i];

            // If the property is not in the object B properties, continue with the next property
            if ($.inArray(propName, objectBProperties) > -1) {
                // If values of same property are not equal, objects are not equivalent
                if (objectA[propName] !== objectB[propName]) {
                    return false;
                }
            }
        }

        // If we made it this far, objects are considered equivalent
        return true;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/`/g, '&#x60;');
        }
        return text;
    };

    var getRealDataAttr = function (dataAttr) {
        for (var attr in dataAttr) {
            var auxAttr = attr.split(/(?=[A-Z])/).join('-').toLowerCase();
            if (auxAttr !== attr) {
                dataAttr[auxAttr] = dataAttr[attr];
                delete dataAttr[attr];
            }
        }

        return dataAttr;
    };

    var getItemField = function (item, field, escape) {
        var value = item;

        if (typeof field !== 'string' || item.hasOwnProperty(field)) {
            return escape ? escapeHTML(item[field]) : item[field];
        }
        var props = field.split('.');
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                value = value && value[props[p]];
            }
        }
        return escape ? escapeHTML(value) : value;
    };

    var isIEBrowser = function () {
        return !!(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
    };

    var objectKeys = function () {
        // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        if (!Object.keys) {
            Object.keys = (function() {
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length;

                return function(obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
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
        queryParams: function (params) {
            return params;
        },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {
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
        paginationHAlign: 'right', //right, left
        paginationVAlign: 'bottom', //bottom, top, both
        paginationDetailHAlign: 'left', //right, left
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
        detailFormatter: function (index, row) {
            return '';
        },
        detailFilter: function (index, row) {
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
        buttonsClass: bs.buttonsClass,
        iconsPrefix: bs.iconsPrefix, // glyphicon or fa (font awesome)
        icons: bs.icons,

        customSearch: $.noop,

        customSort: $.noop,

        ignoreClickToSelectOn: function (element) {
            return $.inArray(element.tagName, ['A', 'BUTTON']);
        },

        rowStyle: function (row, index) {
            return {};
        },

        rowAttributes: function (row, index) {
            return {};
        },

        footerStyle: function (row, index) {
            return {};
        },

        onAll: function (name, args) {
            return false;
        },
        onClickCell: function (field, value, row, $element) {
            return false;
        },
        onDblClickCell: function (field, value, row, $element) {
            return false;
        },
        onClickRow: function (item, $element) {
            return false;
        },
        onDblClickRow: function (item, $element) {
            return false;
        },
        onSort: function (name, order) {
            return false;
        },
        onCheck: function (row) {
            return false;
        },
        onUncheck: function (row) {
            return false;
        },
        onCheckAll: function (rows) {
            return false;
        },
        onUncheckAll: function (rows) {
            return false;
        },
        onCheckSome: function (rows) {
            return false;
        },
        onUncheckSome: function (rows) {
            return false;
        },
        onLoadSuccess: function (data) {
            return false;
        },
        onLoadError: function (status) {
            return false;
        },
        onColumnSwitch: function (field, checked) {
            return false;
        },
        onPageChange: function (number, size) {
            return false;
        },
        onSearch: function (text) {
            return false;
        },
        onToggle: function (cardView) {
            return false;
        },
        onPreBody: function (data) {
            return false;
        },
        onPostBody: function () {
            return false;
        },
        onPostHeader: function () {
            return false;
        },
        onExpandRow: function (index, row, $detail) {
            return false;
        },
        onCollapseRow: function (index, row) {
            return false;
        },
        onRefreshOptions: function (options) {
            return false;
        },
        onRefresh: function (params) {
          return false;
        },
        onResetView: function () {
            return false;
        },
        onScrollBody: function () {
            return false;
        }
    };

    BootstrapTable.LOCALES = {};

    BootstrapTable.LOCALES['en-US'] = BootstrapTable.LOCALES.en = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s rows per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
            return sprintf('Showing %s rows', totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatFullscreen: function () {
            return 'Fullscreen';
        },
        formatColumns: function () {
            return 'Columns';
        },
        formatAllRows: function () {
            return 'All';
        }
    };

    $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['en-US']);

    BootstrapTable.COLUMN_DEFAULTS = {
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

    BootstrapTable.EVENTS = {
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

    BootstrapTable.prototype.init = function () {
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
    };

    BootstrapTable.prototype.initLocale = function () {
        if (this.options.locale) {
            var parts = this.options.locale.split(/-|_/);
            parts[0].toLowerCase();
            if (parts[1]) {
                parts[1].toUpperCase();
            }
            if ($.fn.bootstrapTable.locales[this.options.locale]) {
                // locale as requested
                $.extend(this.options, $.fn.bootstrapTable.locales[this.options.locale]);
            } else if ($.fn.bootstrapTable.locales[parts.join('-')]) {
                // locale with sep set to - (in case original was specified with _)
                $.extend(this.options, $.fn.bootstrapTable.locales[parts.join('-')]);
            } else if ($.fn.bootstrapTable.locales[parts[0]]) {
                // short locale language code (i.e. 'en')
                $.extend(this.options, $.fn.bootstrapTable.locales[parts[0]]);
            }
        }
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
            '<div class="fixed-table-toolbar"></div>',
            this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination" style="clear: both;"></div>' :
                '',
            '<div class="fixed-table-container">',
            '<div class="fixed-table-header"><table></table></div>',
            '<div class="fixed-table-body">',
            '<div class="fixed-table-loading">',
            this.options.formatLoadingMessage(),
            '</div>',
            '</div>',
            '<div class="fixed-table-footer"><table><tr></tr></table></div>',
            '</div>',
            this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination"></div>' :
                '',
            '</div>'
        ].join(''));

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
        if ($.inArray('table-no-bordered', this.options.classes.split(' ')) !== -1) {
            this.$tableContainer.addClass('table-no-bordered');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('>thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        this.$header.find('tr').each(function () {
            var column = [];

            $(this).find('th').each(function () {
                // Fix #2014 - getFieldIndex and elsewhere assume this is string, causes issues if not
                if (typeof $(this).data('field') !== 'undefined') {
                    $(this).data('field', $(this).data('field') + '');
                }
                column.push($.extend({}, {
                    title: $(this).html(),
                    'class': $(this).attr('class'),
                    titleTooltip: $(this).attr('title'),
                    rowspan: $(this).attr('rowspan') ? +$(this).attr('rowspan') : undefined,
                    colspan: $(this).attr('colspan') ? +$(this).attr('colspan') : undefined
                }, $(this).data()));
            });
            columns.push(column);
        });
        if (!$.isArray(this.options.columns[0])) {
            this.options.columns = [this.options.columns];
        }
        this.options.columns = $.extend(true, [], columns, this.options.columns);
        this.columns = [];
        this.fieldsColumnsIndex = [];

        setFieldIndex(this.options.columns);
        $.each(this.options.columns, function (i, columns) {
            $.each(columns, function (j, column) {
                column = $.extend({}, BootstrapTable.COLUMN_DEFAULTS, column);

                if (typeof column.fieldIndex !== 'undefined') {
                    that.columns[column.fieldIndex] = column;
                    that.fieldsColumnsIndex[column.field] = column.fieldIndex;
                }

                that.options.columns[i][j] = column;
            });
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        var m = [];
        this.$el.find('>tbody>tr').each(function (y) {
            var row = {};

            // save tr's id, class and data-* attributes
            row._id = $(this).attr('id');
            row._class = $(this).attr('class');
            row._data = getRealDataAttr($(this).data());

            $(this).find('>td').each(function (x) {
                var $this = $(this),
                    cspan = +$this.attr('colspan') || 1,
                    rspan = +$this.attr('rowspan') || 1,
                    tx,
                    ty;

                // skip already occupied cells in current row
                for (; m[y] && m[y][x]; x++);

                for (tx = x; tx < x + cspan; tx++) { //mark matrix elements occupied by current cell with true
                    for (ty = y; ty < y + rspan; ty++) {
                        if (!m[ty]) { //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }

                var field = that.columns[x].field;

                row[field] = $(this).html();
                // save td's id, class and data-* attributes
                row['_' + field + '_id'] = $(this).attr('id');
                row['_' + field + '_class'] = $(this).attr('class');
                row['_' + field + '_rowspan'] = $(this).attr('rowspan');
                row['_' + field + '_colspan'] = $(this).attr('colspan');
                row['_' + field + '_title'] = $(this).attr('title');
                row['_' + field + '_data'] = getRealDataAttr($(this).data());
            });
            data.push(row);
        });
        this.options.data = data;
        if (data.length) this.fromHtml = true;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = {},
            html = [];

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

        $.each(this.options.columns, function (i, columns) {
            html.push('<tr>');

            if (i === 0 && !that.options.cardView && that.options.detailView) {
                html.push(sprintf('<th class="detail" rowspan="%s"><div class="fht-cell"></div></th>',
                    that.options.columns.length));
            }

            $.each(columns, function (j, column) {
                var text = '',
                    halign = '', // header align style
                    align = '', // body align style
                    style = '',
                    class_ = sprintf(' class="%s"', column['class']),
                    order = that.options.sortOrder || column.order,
                    unitWidth = 'px',
                    width = column.width;

                if (column.width !== undefined && (!that.options.cardView)) {
                    if (typeof column.width === 'string') {
                        if (column.width.indexOf('%') !== -1) {
                            unitWidth = '%';
                        }
                    }
                }
                if (column.width && typeof column.width === 'string') {
                    width = column.width.replace('%', '').replace('px', '');
                }

                halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
                align = sprintf('text-align: %s; ', column.align);
                style = sprintf('vertical-align: %s; ', column.valign);
                style += sprintf('width: %s; ', (column.checkbox || column.radio) && !width ?
                    (!column.showSelectTitle ? '36px' : undefined) :
                    (width ? width + unitWidth : undefined));

                if (typeof column.fieldIndex !== 'undefined') {
                    that.header.fields[column.fieldIndex] = column.field;
                    that.header.styles[column.fieldIndex] = align + style;
                    that.header.classes[column.fieldIndex] = class_;
                    that.header.formatters[column.fieldIndex] = column.formatter;
                    that.header.events[column.fieldIndex] = column.events;
                    that.header.sorters[column.fieldIndex] = column.sorter;
                    that.header.sortNames[column.fieldIndex] = column.sortName;
                    that.header.cellStyles[column.fieldIndex] = column.cellStyle;
                    that.header.searchables[column.fieldIndex] = column.searchable;

                    if (!column.visible) {
                        return;
                    }

                    if (that.options.cardView && (!column.cardVisible)) {
                        return;
                    }

                    visibleColumns[column.field] = column;
                }

                html.push('<th' + sprintf(' title="%s"', column.titleTooltip),
                    column.checkbox || column.radio ?
                        sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                        class_,
                    sprintf(' style="%s"', halign + style),
                    sprintf(' rowspan="%s"', column.rowspan),
                    sprintf(' colspan="%s"', column.colspan),
                    sprintf(' data-field="%s"', column.field),
                    j === 0 && column.fieldIndex ? ' data-not-first-th' : '',
                    '>');

                html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                    'sortable both' : ''));

                text = that.options.escape ? escapeHTML(column.title) : column.title;

                var title = text;
                if (column.checkbox) {
                    text = '';
                    if (!that.options.singleSelect && that.options.checkboxHeader) {
                        text = '<input name="btSelectAll" type="checkbox" />';
                    }
                    that.header.stateField = column.field;
                }
                if (column.radio) {
                    text = '';
                    that.header.stateField = column.field;
                    that.options.singleSelect = true;
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
        this.$header.find('th[data-field]').each(function (i) {
            $(this).data(visibleColumns[$(this).data('field')]);
        });
        this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
            var $this = $(this);

            if (that.options.detailView && !$this.parent().hasClass('bs-checkbox')) {
                if ($this.closest('.bootstrap-table')[0] !== that.$container[0]) {
                    return false;
                }
            }

            if (that.options.sortable && $this.parent().data().sortable) {
                that.onSort(event);
            }
        });

        this.$header.children().children().off('keypress').on('keypress', function (event) {
            if (that.options.sortable && $(this).data().sortable) {
                var code = event.keyCode || event.which;
                if (code == 13) { //Enter keycode
                    that.onSort(event);
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
        this.$selectAll.off('click').on('click', function () {
                var checked = $(this).prop('checked');
                that[checked ? 'checkAll' : 'uncheckAll']();
                that.updateSelected();
            });
    };

    BootstrapTable.prototype.initFooter = function () {
        if (!this.options.showFooter || this.options.cardView) {
            this.$tableFooter.hide();
        } else {
            this.$tableFooter.show();
        }
    };

    /**
     * @param data
     * @param type: append / prepend
     */
    BootstrapTable.prototype.initData = function (data, type) {
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
    };

    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields),
            timeoutId = 0;

        if (this.options.customSort !== $.noop) {
            this.options.customSort.apply(this, [this.options.sortName, this.options.sortOrder]);
            return;
        }

        if (index !== -1) {
            if (this.options.sortStable) {
                $.each(this.data, function (i, row) {
                    row._position = i;
                });
            }

            this.data.sort(function (a, b) {
                if (that.header.sortNames[index]) {
                    name = that.header.sortNames[index];
                }
                var aa = getItemField(a, name, that.options.escape),
                    bb = getItemField(b, name, that.options.escape),
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb, a, b]);

                if (value !== undefined) {
                    if (that.options.sortStable && value === 0) {
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

                if (that.options.sortStable && aa === bb) {
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
                    that.$el.removeClass(that.options.sortClass);
                    var index = that.$header.find(sprintf('[data-field="%s"]',
                        that.options.sortName).index() + 1);
                    that.$el.find(sprintf('tr td:nth-child(%s)', index))
                        .addClass(that.options.sortClass);
                }, 250);
            }
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = event.type === "keypress" ? $(event.currentTarget) : $(event.currentTarget).parent(),
            $this_ = this.$header.find('th').eq($this.index());

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
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        if (this.$toolbar.find('.bs-bars').children().length) {
            $('body').append($(this.options.toolbar));
        }
        this.$toolbar.html('');

        if (typeof this.options.toolbar === 'string' || typeof this.options.toolbar === 'object') {
            $(sprintf('<div class="bs-bars %s-%s"></div>', bs.pullClass, this.options.toolbarAlign))
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group %s-%s">',
            this.options.buttonsAlign, bs.pullClass, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
            this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="paginationSwitch" aria-label="pagination Switch" title="%s">',
                    this.options.formatPaginationSwitch()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                '</button>');
        }

        if (this.options.showFullscreen) {
            this.$toolbar.find('button[name="fullscreen"]')
                .off('click').on('click', $.proxy(this.toggleFullscreen, this));
        }

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="refresh" aria-label="refresh" title="%s">',
                    this.options.formatRefresh()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="toggle" aria-label="toggle" title="%s">',
                    this.options.formatToggle()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggleOff),
                '</button>');
        }

        if (this.options.showFullscreen) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="fullscreen" aria-label="fullscreen" title="%s">',
                    this.options.formatFullscreen()),
                    sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.fullscreen),
                    '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                    this.options.formatColumns()),
                '<button type="button" aria-label="columns" class="btn' +
                sprintf(' btn-%s', this.options.buttonsClass) +
                sprintf(' btn-%s', this.options.iconSize) +
                ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                bs.toobarDropdowHtml[0]);

            $.each(this.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }

                if (that.options.cardView && !column.cardVisible) {
                    return;
                }

                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf(bs.toobarDropdowItemHtml,
                        sprintf('<input type="checkbox" data-field="%s" value="%s"%s> %s',
                        column.field, i, checked, column.title)));
                    switchableCount++;
                }
            });
            html.push(bs.toobarDropdowHtml[1], '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extensions
        if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]')
                .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.toggleView();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($(this).val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                sprintf('<div class="%s-%s search">', bs.pullClass, this.options.searchAlign),
                sprintf('<input class="form-control' +
                    sprintf(' input-%s', this.options.iconSize) +
                    '" type="text" placeholder="%s">',
                    this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup drop blur').on('keyup drop blur', function (event) {
                if (that.options.searchOnEnterKey && event.keyCode !== 13) {
                    return;
                }

                if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
                    return;
                }

                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });

            if (isIEBrowser()) {
                $search.off('mouseup').on('mouseup', function (event) {
                    clearTimeout(timeoutId); // doesn't matter if it's 0
                    timeoutId = setTimeout(function () {
                        that.onSearch(event);
                    }, that.options.searchTimeOut);
                });
            }
        }
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch && $(event.currentTarget).val() !== text) {
            $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;
        this.options.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        if (event.firedByInitSearchText) {
            if (this.options.sidePagination === 'client') {
                this.updatePagination();
            }
        } else {
            this.updatePagination();
        }
        this.trigger('search', text);
    };

    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            if (this.options.customSearch !== $.noop) {
                window[this.options.customSearch].apply(this, [this.searchText]);
                return;
            }

            var s = this.searchText && (this.options.escape ?
                escapeHTML(this.searchText) : this.searchText).toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

            // Check filter
            this.data = f ? $.grep(this.options.data, function (item, i) {
                for (var key in f) {
                    if ($.isArray(f[key]) && $.inArray(item[key], f[key]) === -1 ||
                            !$.isArray(f[key]) && item[key] !== f[key]) {
                        return false;
                    }
                }
                return true;
            }) : this.options.data;

            this.data = s ? $.grep(this.data, function (item, i) {
                for (var j = 0; j < that.header.fields.length; j++) {

                    if (!that.header.searchables[j]) {
                        continue;
                    }

                    var key = $.isNumeric(that.header.fields[j]) ? parseInt(that.header.fields[j], 10) : that.header.fields[j];
                    var column = that.columns[that.fieldsColumnsIndex[key]];
                    var value;

                    if (typeof key === 'string') {
                        value = item;
                        var props = key.split('.');
                        for (var prop_index = 0; prop_index < props.length; prop_index++) {
                            if (value[props[prop_index]] != null) {
                                value = value[props[prop_index]];
                            }
                        }

                        // Fix #142: respect searchForamtter boolean
                        if (column && column.searchFormatter) {
                            value = calculateObjectValue(column,
                                that.header.formatters[j], [value, item, i], value);
                        }
                    } else {
                        value = item[key];
                    }

                    if (typeof value === 'string' || typeof value === 'number') {
                        if (that.options.strictSearch) {
                            if ((value + '').toLowerCase() === s) {
                                return true;
                            }
                        } else {
                            if ((value + '').toLowerCase().indexOf(s) !== -1) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }) : this.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        if (!this.options.pagination) {
            this.$pagination.hide();
            return;
        } else {
            this.$pagination.show();
        }

        var that = this,
            html = [],
            $allSelected = false,
            i, from, to,
            $pageList,
            $pre,
            $next,
            $number,
            data = this.getData(),
            pageList = this.options.pageList;

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
                // multiple pages and a search that matches to one page throws exception
                var pageLst = typeof this.options.pageList === 'string' ?
                    this.options.pageList.replace('[', '').replace(']', '')
                        .replace(/ /g, '').toLowerCase().split(',') : this.options.pageList;
                if ($.inArray(this.options.formatAllRows().toLowerCase(), pageLst)  > -1) {
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

        html.push(
            sprintf('<div class="%s-%s pagination-detail">', bs.pullClass, this.options.paginationDetailHAlign),
            '<span class="pagination-info">',
            this.options.onlyInfoPagination ? this.options.formatDetailPagination(this.options.totalRows) :
            this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
            '</span>');

        if (!this.options.onlyInfoPagination) {
            html.push('<span class="page-list">');

            var pageNumber = [
                    sprintf('<span class="btn-group %s">',
                        this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                            'dropdown' : 'dropup'),
                    '<button type="button" class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    ' dropdown-toggle" data-toggle="dropdown">',
                    '<span class="page-size">',
                    $allSelected ? this.options.formatAllRows() : this.options.pageSize,
                    '</span>',
                    ' <span class="caret"></span>',
                    '</button>',
                    bs.pageDropdownHtml[0]
                ];

            if (typeof this.options.pageList === 'string') {
                var list = this.options.pageList.replace('[', '').replace(']', '')
                    .replace(/ /g, '').split(',');

                pageList = [];
                $.each(list, function (i, value) {
                    pageList.push((value.toUpperCase() === that.options.formatAllRows().toUpperCase() || value.toUpperCase() === "UNLIMITED") ?
                        that.options.formatAllRows() : +value);
                });
            }

            $.each(pageList, function (i, page) {
                if (!that.options.smartDisplay || i === 0 || pageList[i - 1] < that.options.totalRows) {
                    var active;
                    if ($allSelected) {
                        active = page === that.options.formatAllRows() ? 'active' : '';
                    } else {
                        active = page === that.options.pageSize ? 'active' : '';
                    }
                    pageNumber.push(sprintf(bs.pageDropdownItemHtml, active, page));
                }
            });
            pageNumber.push(bs.pageDropdownHtml[1] + '</span>');

            html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
            html.push('</span>');

            html.push('</div>',
                sprintf('<div class="%s-%s pagination">', bs.pullClass, this.options.paginationHAlign),
                '<ul class="pagination' + sprintf(' pagination-%s', this.options.iconSize) + '">',
                sprintf('<li class="page-item page-pre"><a class="page-link" href="#">%s</a></li>',
                this.options.paginationPreText));

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
                    html.push(
                        sprintf('<li class="page-item page-first%s">',
                        1 === this.options.pageNumber ? ' active' : ''),
                        '<a class="page-link" href="#">', 1, '</a>',
                        '</li>');

                    from++;
                }

                if (this.options.pageNumber >= 4) {
                    if (this.options.pageNumber == 4 || this.totalPages == 6 || this.totalPages == 7) {
                        from--;
                    } else {
                        html.push('<li class="page-item page-first-separator disabled">',
                            '<a class="page-link" href="#">...</a>',
                            '</li>');
                    }

                    to--;
                }
            }

            if (this.totalPages >= 7) {
                if (this.options.pageNumber >= (this.totalPages - 2)) {
                    from--;
                }
            }

            if (this.totalPages == 6) {
                if (this.options.pageNumber >= (this.totalPages - 2)) {
                    to++;
                }
            } else if (this.totalPages >= 7) {
                if (this.totalPages == 7 || this.options.pageNumber >= (this.totalPages - 3)) {
                    to++;
                }
            }

            for (i = from; i <= to; i++) {
                html.push(sprintf('<li class="page-item%s">',
                    i === this.options.pageNumber ? ' active' : ''),
                    '<a class="page-link" href="#">', i, '</a>',
                    '</li>');
            }

            if (this.totalPages >= 8) {
                if (this.options.pageNumber <= (this.totalPages - 4)) {
                    html.push('<li class="page-item page-last-separator disabled">',
                        '<a class="page-link" href="#">...</a>',
                        '</li>');
                }
            }

            if (this.totalPages >= 6) {
                if (this.options.pageNumber <= (this.totalPages - 3)) {
                    html.push(sprintf('<li class="page-item page-last%s">',
                        this.totalPages === this.options.pageNumber ? ' active' : ''),
                        '<a class="page-link" href="#">', this.totalPages, '</a>',
                        '</li>');
                }
            }

            html.push(
                sprintf('<li class="page-item page-next"><a class="page-link" href="#">%s</a></li>',
                this.options.paginationNextText),
                '</ul>',
                '</div>');
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
    };

    BootstrapTable.prototype.updatePagination = function (event) {
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
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        event.preventDefault();
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
            this.options.formatAllRows() : +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);

        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        event.preventDefault();
        if ((this.options.pageNumber - 1) === 0) {
            this.options.pageNumber = this.options.totalPages;
        } else {
            this.options.pageNumber--;
        }
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        event.preventDefault();
        if ((this.options.pageNumber + 1) > this.options.totalPages) {
            this.options.pageNumber = 1;
        } else {
            this.options.pageNumber++;
        }
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        event.preventDefault();
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.initRow = function(item, i, data, parentDom) {
        var that=this,
            key,
            html = [],
            style = {},
            csses = [],
            data_ = '',
            attributes = {},
            htmlAttributes = [];

        if ($.inArray(item, this.hiddenRows) > -1) {
            return;
        }

        style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

        if (style && style.css) {
            for (key in style.css) {
                csses.push(key + ': ' + style.css[key]);
            }
        }

        attributes = calculateObjectValue(this.options,
            this.options.rowAttributes, [item, i], attributes);

        if (attributes) {
            for (key in attributes) {
                htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
            }
        }

        if (item._data && !$.isEmptyObject(item._data)) {
            $.each(item._data, function(k, v) {
                // ignore data-index
                if (k === 'index') {
                    return;
                }
                data_ += sprintf(' data-%s="%s"', k, v);
            });
        }

        html.push('<tr',
            sprintf(' %s', htmlAttributes.join(' ')),
            sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
            sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
            sprintf(' data-index="%s"', i),
            sprintf(' data-uniqueid="%s"', item[this.options.uniqueId]),
            sprintf('%s', data_),
            '>'
        );

        if (this.options.cardView) {
            html.push(sprintf('<td colspan="%s"><div class="card-views">', this.header.fields.length));
        }

        if (!this.options.cardView && this.options.detailView) {
            html.push('<td>');

            if (calculateObjectValue(null, this.options.detailFilter, [i, item])) {
                html.push('<a class="detail-icon" href="#">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.detailOpen),
                '</a>');
            }

            html.push('</td>');
        }

        $.each(this.header.fields, function(j, field) {
            var text = '',
                value_ = getItemField(item, field, that.options.escape),
                value = '',
                type = '',
                cellStyle = {},
                id_ = '',
                class_ = that.header.classes[j],
                data_ = '',
                rowspan_ = '',
                colspan_ = '',
                title_ = '',
                column = that.columns[j];

            if (that.fromHtml && typeof value_ === 'undefined') {
                if((!column.checkbox) && (!column.radio)) {
                    return;
                }
            }

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            if (column.escape) {
                value_ = escapeHTML(value_);
            }

            style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

            // handle td's id and class
            if (item['_' + field + '_id']) {
                id_ = sprintf(' id="%s"', item['_' + field + '_id']);
            }
            if (item['_' + field + '_class']) {
                class_ = sprintf(' class="%s"', item['_' + field + '_class']);
            }
            if (item['_' + field + '_rowspan']) {
                rowspan_ = sprintf(' rowspan="%s"', item['_' + field + '_rowspan']);
            }
            if (item['_' + field + '_colspan']) {
                colspan_ = sprintf(' colspan="%s"', item['_' + field + '_colspan']);
            }
            if (item['_' + field + '_title']) {
                title_ = sprintf(' title="%s"', item['_' + field + '_title']);
            }
            cellStyle = calculateObjectValue(that.header,
                that.header.cellStyles[j], [value_, item, i, field], cellStyle);
            if (cellStyle.classes) {
                class_ = sprintf(' class="%s"', cellStyle.classes);
            }
            if (cellStyle.css) {
                var csses_ = [];
                for (var key in cellStyle.css) {
                    csses_.push(key + ': ' + cellStyle.css[key]);
                }
                style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
            }

            value = calculateObjectValue(column,
                that.header.formatters[j], [value_, item, i, field], value_);

            if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
                $.each(item['_' + field + '_data'], function(k, v) {
                    // ignore data-index
                    if (k === 'index') {
                        return;
                    }
                    data_ += sprintf(' data-%s="%s"', k, v);
                });
            }

            if (column.checkbox || column.radio) {
                type = column.checkbox ? 'checkbox' : type;
                type = column.radio ? 'radio' : type;

                text = [sprintf(that.options.cardView ?
                        '<div class="card-view %s">' : '<td class="bs-checkbox %s">', column['class'] || ''),
                    '<input' +
                    sprintf(' data-index="%s"', i) +
                    sprintf(' name="%s"', that.options.selectItemName) +
                    sprintf(' type="%s"', type) +
                    sprintf(' value="%s"', item[that.options.idField]) +
                    sprintf(' checked="%s"', value === true ||
                        (value_ || value && value.checked) ? 'checked' : undefined) +
                    sprintf(' disabled="%s"', !column.checkboxEnabled ||
                        (value && value.disabled) ? 'disabled' : undefined) +
                    ' />',
                    that.header.formatters[j] && typeof value === 'string' ? value : '',
                    that.options.cardView ? '</div>' : '</td>'
                ].join('');

                item[that.header.stateField] = value === true || (!!value_ || value && value.checked);
            } else {
                value = typeof value === 'undefined' || value === null ?
                    that.options.undefinedText : value;

                text = that.options.cardView ? ['<div class="card-view">',
                    that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                        getPropertyFromOther(that.columns, 'field', 'title', field)) : '',
                    sprintf('<span class="value">%s</span>', value),
                    '</div>'
                ].join('') : [sprintf('<td%s %s %s %s %s %s %s>',
                        id_, class_, style, data_, rowspan_, colspan_, title_),
                    value,
                    '</td>'
                ].join('');

                // Hide empty data on Card view when smartDisplay is set to true.
                if (that.options.cardView && that.options.smartDisplay && value === '') {
                    // Should set a placeholder for event binding correct fieldIndex
                    text = '<div class="card-view"></div>';
                }
            }

            html.push(text);
        });

        if (this.options.cardView) {
            html.push('</div></td>');
        }
        html.push('</tr>');

        return html.join(' ');
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('>tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        var trFragments = $(document.createDocumentFragment());
        var hasTr;

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var item = data[i];
            var tr = this.initRow(item, i, data, trFragments);
            hasTr = hasTr || !!tr;
            if (tr&&tr!==true) {
                trFragments.append(tr);
            }
        }

        // show no records
        if (!hasTr) {
            trFragments.append('<tr class="no-records-found">' +
                sprintf('<td colspan="%s">%s</td>',
                this.$header.find('th').length,
                this.options.formatNoMatches()) +
                '</tr>');
        }

        this.$body.html(trFragments);

        if (!fixedScroll) {
            this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr[data-index] > td').off('click dblclick').on('click dblclick', function (e) {
            var $td = $(this),
                $tr = $td.parent(),
                item = that.data[$tr.data('index')],
                index = $td[0].cellIndex,
                fields = that.getVisibleFields(),
                field = fields[that.options.detailView && !that.options.cardView ? index - 1 : index],
                column = that.columns[that.fieldsColumnsIndex[field]],
                value = getItemField(item, field, that.options.escape);

            if ($td.find('.detail-icon').length) {
                return;
            }

            that.trigger(e.type === 'click' ? 'click-cell' : 'dbl-click-cell', field, value, item, $td);
            that.trigger(e.type === 'click' ? 'click-row' : 'dbl-click-row', item, $tr, field);

            // if click to select - then trigger the checkbox/radio click
            if (e.type === 'click' && that.options.clickToSelect && column.clickToSelect && that.options.ignoreClickToSelectOn(e.target)) {
                var $selectItem = $tr.find(sprintf('[name="%s"]', that.options.selectItemName));
                if ($selectItem.length) {
                    $selectItem[0].click(); // #144: .trigger('click') bug
                }
            }
        });

        this.$body.find('> tr[data-index] > td > .detail-icon').off('click').on('click', function (e) {
            e.preventDefault();

            var $this = $(this),
                $tr = $this.parent().parent(),
                index = $tr.data('index'),
                row = data[index]; // Fix #980 Detail view, when searching, returns wrong row

            // remove and update
            if ($tr.next().is('tr.detail-view')) {
                $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailOpen));
                that.trigger('collapse-row', index, row, $tr.next());
                $tr.next().remove();
            } else {
                $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailClose));
                $tr.after(sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>', $tr.find('td').length));
                var $element = $tr.next().find('td');
                var content = calculateObjectValue(that.options, that.options.detailFormatter, [index, row, $element], '');
                if ($element.length === 1) {
                    $element.append(content);
                }
                that.trigger('expand-row', index, row, $element);
            }
            that.resetView();
            return false;
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            var $this = $(this),
                checked = $this.prop('checked'),
                row = that.data[$this.data('index')];

            if ($(this).is(':radio') || that.options.singleSelect) {
                $.each(that.options.data, function (i, row) {
                    row[that.header.stateField] = false;
                });
            }

            row[that.header.stateField] = checked;

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
            that.trigger(checked ? 'check' : 'uncheck', row, $this);
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }

            var field = that.header.fields[i],
                fieldIndex = $.inArray(field, that.getVisibleFields());

            if (fieldIndex === -1) {
                return;
            }

            if (that.options.detailView && !that.options.cardView) {
                fieldIndex += 1;
            }

            for (var key in events) {
                that.$body.find('>tr:not(.no-records-found)').each(function () {
                    var $tr = $(this),
                        $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(fieldIndex),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[field];

                        func.apply(this, [e, value, row, index]);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body', data);
    };

    BootstrapTable.prototype.initServer = function (silent, query, url) {
        var that = this,
            data = {},
            index = $.inArray(this.options.sortName, this.header.fields),
            params = {
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            },
            request;

        if (this.header.sortNames[index]) {
            params.sortName = this.header.sortNames[index];
        }

        if (this.options.pagination && this.options.sidePagination === 'server') {
            params.pageSize = this.options.pageSize === this.options.formatAllRows() ?
                this.options.totalRows : this.options.pageSize;
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
                params.offset = this.options.pageSize === this.options.formatAllRows() ?
                    0 : this.options.pageSize * (this.options.pageNumber - 1);
                params.limit = this.options.pageSize === this.options.formatAllRows() ?
                    this.options.totalRows : this.options.pageSize;
                if (params.limit === 0) {
                    delete params.limit;
                }
            }
        }

        if (!($.isEmptyObject(this.filterColumnsPartial))) {
            params.filter = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$tableLoading.show();
        }
        request = $.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url:  url || this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
                JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                that.load(res);
                that.trigger('load-success', res);
                if (!silent) that.$tableLoading.hide();
            },
            error: function (res) {
                var data = [];
                if (that.options.sidePagination === 'server') {
                    data = {};
                    data[that.options.totalField] = 0;
                    data[that.options.dataField] = [];
                }
                that.load(data);
                that.trigger('load-error', res.status, res);
                if (!silent) that.$tableLoading.hide();
            }
        });

        if (this.options.ajax) {
            calculateObjectValue(this, this.options.ajax, [request], null);
        } else {
            if (this._xhr && this._xhr.readyState !== 4) {
                this._xhr.abort();
            }
            this._xhr = $.ajax(request);
        }
    };

    BootstrapTable.prototype.initSearchText = function () {
        if (this.options.search) {
            this.searchText = '';
            if (this.options.searchText !== '') {
                var $search = this.$toolbar.find('.search input');
                $search.val(this.options.searchText);
                this.onSearch({currentTarget: $search, firedByInitSearchText: true});
            }
        }
    };

    BootstrapTable.prototype.getCaret = function () {
        var that = this;

        $.each(this.$header.find('th'), function (i, th) {
            $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === that.options.sortName ? that.options.sortOrder : 'both');
        });
    };

    BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length &&
            this.$selectItem.filter(':enabled').length ===
            this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

        this.$selectItem.each(function () {
            $(this).closest('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function () {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = $(this).prop('checked');
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            if (that.header.stateField) {
                row[that.header.stateField] = false;
            }
        });
        this.initHiddenRows();
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        // fix #61: the hidden table reset header bug.
        // fix bug: get $el.css('width') error sometime (height = 500)
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitHeader = function () {
        var that = this,
            fixedBody,
            scrollWidth,
            focused,
            focusedTemp;

        if (that.$el.is(':hidden')) {
            that.timeoutId_ = setTimeout($.proxy(that.fitHeader, that), 100);
            return;
        }
        fixedBody = this.$tableBody.get(0);

        scrollWidth = fixedBody.scrollWidth > fixedBody.clientWidth &&
        fixedBody.scrollHeight > fixedBody.clientHeight + this.$header.outerHeight() ?
            getScrollBarWidth() : 0;

        this.$el.css('margin-top', -this.$header.outerHeight());

        focused = $(':focus');
        if (focused.length > 0) {
            var $th = focused.parents('th');
            if ($th.length > 0) {
                var dataField = $th.attr('data-field');
                if (dataField !== undefined) {
                    var $headerTh = this.$header.find("[data-field='" + dataField + "']");
                    if ($headerTh.length > 0) {
                        $headerTh.find(":input").addClass("focus-temp");
                    }
                }
            }
        }

        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');
        this.$tableHeader.css({
            'margin-right': scrollWidth
        }).find('table').css('width', this.$el.outerWidth())
            .html('').attr('class', this.$el.attr('class'))
            .append(this.$header_);

        focusedTemp = $('.focus-temp:visible:eq(0)');
        if (focusedTemp.length > 0) {
            focusedTemp.focus();
            this.$header.find('.focus-temp').removeClass('focus-temp');
        }

        // fix bug: $.data() is not working as expected after $.append()
        this.$header.find('th[data-field]').each(function (i) {
            that.$header_.find(sprintf('th[data-field="%s"]', $(this).data('field'))).data($(this).data());
        });

        var visibleFields = this.getVisibleFields(),
            $ths = this.$header_.find('th');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                index = i;

            if (that.options.detailView && !that.options.cardView) {
                if (i === 0) {
                    that.$header_.find('th.detail').find('.fht-cell').width($this.innerWidth());
                }
                index = i - 1;
            }

            if (index === -1) {
                return;
            }

            var $th = that.$header_.find(sprintf('th[data-field="%s"]', visibleFields[index]));
            if ($th.length > 1) {
                $th = $($ths[$this[0].cellIndex]);
            }

            var zoomWidth = $th.width() - $th.find('.fht-cell').width();
            $th.find('.fht-cell').width($this.innerWidth() - zoomWidth);
        });

        this.horizontalScroll();
        this.trigger('post-header');
    };

    BootstrapTable.prototype.resetFooter = function () {
        var that = this,
            data = that.getData(),
            html = [];

        if (!this.options.showFooter || this.options.cardView) { //do nothing
            return;
        }

        if (!this.options.cardView && this.options.detailView) {
            html.push('<td><div class="th-inner">&nbsp;</div><div class="fht-cell"></div></td>');
        }

        $.each(this.columns, function (i, column) {
            var key,
                falign = '', // footer align style
                valign = '',
                csses = [],
                style = {},
                class_ = sprintf(' class="%s"', column['class']);

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
            valign = sprintf('vertical-align: %s; ', column.valign);

            style = calculateObjectValue(null, that.options.footerStyle);

            if (style && style.css) {
                for (key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            html.push('<td', class_, sprintf(' style="%s"', falign + valign + csses.concat().join('; ')), '>');
            html.push('<div class="th-inner">');

            html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');

            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</div>');
            html.push('</td>');
        });

        this.$tableFooter.find('tr').html(html.join(''));
        this.$tableFooter.show();
        clearTimeout(this.timeoutFooter_);
        this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this),
            this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitFooter = function () {
        var that = this,
            $footerTd,
            elWidth,
            scrollWidth;

        clearTimeout(this.timeoutFooter_);
        if (this.$el.is(':hidden')) {
            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
            return;
        }

        elWidth = this.$el.css('width');
        scrollWidth = elWidth > this.$tableBody.width() ? getScrollBarWidth() : 0;

        this.$tableFooter.css({
            'margin-right': scrollWidth
        }).find('table').css('width', elWidth)
            .attr('class', this.$el.attr('class'));

        $footerTd = this.$tableFooter.find('td');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this);

            $footerTd.eq(i).find('.fht-cell').width($this.innerWidth());
        });

        this.horizontalScroll();
    };

    BootstrapTable.prototype.horizontalScroll = function () {
        var that = this;
        // horizontal scroll event
        // TODO: it's probably better improving the layout than binding to scroll event

        that.trigger('scroll-body');
        this.$tableBody.off('scroll').on('scroll', function () {
            if (that.options.showHeader && that.options.height) {
              that.$tableHeader.scrollLeft($(this).scrollLeft());
            }

            if (that.options.showFooter && !that.options.cardView) {
                that.$tableFooter.scrollLeft($(this).scrollLeft());
            }
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
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
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.getVisibleFields = function () {
        var that = this,
            visibleFields = [];

        $.each(this.header.fields, function (j, field) {
            var column = that.columns[that.fieldsColumnsIndex[field]];

            if (!column.visible) {
                return;
            }
            visibleFields.push(field);
        });
        return visibleFields;
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var padding = 0;

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = this.$toolbar.outerHeight(true),
                paginationHeight = this.$pagination.outerHeight(true),
                height = this.options.height - toolbarHeight - paginationHeight;

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
    };

    BootstrapTable.prototype.getData = function (useCurrentPage) {
        var data = this.options.data;
        if (this.searchText || this.options.sortName || !$.isEmptyObject(this.filterColumns) || !$.isEmptyObject(this.filterColumnsPartial)) {
            data = this.data;
        }

        if (useCurrentPage) {
            return data.slice(this.pageFrom - 1, this.pageTo);
        }

        return data;
    };

    BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.pagination && this.options.sidePagination === 'server') {
            this.options.totalRows = data[this.options.totalField];
            fixedScroll = data.fixedScroll;
            data = data[this.options.dataField];
        } else if (!$.isArray(data)) { // support fixedScroll
            fixedScroll = data.fixedScroll;
            data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                continue;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
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
    };

    BootstrapTable.prototype.removeAll = function () {
        if (this.options.data.length > 0) {
            this.options.data.splice(0, this.options.data.length);
            this.initSearch();
            this.initPagination();
            this.initBody(true);
        }
    };

    BootstrapTable.prototype.getRowByUniqueId = function (id) {
        var uniqueId = this.options.uniqueId,
            len = this.options.data.length,
            dataRow = null,
            i, row, rowUniqueId;

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (row.hasOwnProperty(uniqueId)) { // uniqueId is a column
                rowUniqueId = row[uniqueId];
            } else if(row._data.hasOwnProperty(uniqueId)) { // uniqueId is a row data property
                rowUniqueId = row._data[uniqueId];
            } else {
                continue;
            }

            if (typeof rowUniqueId === 'string') {
                id = id.toString();
            } else if (typeof rowUniqueId === 'number') {
                if ((Number(rowUniqueId) === rowUniqueId) && (rowUniqueId % 1 === 0)) {
                    id = parseInt(id);
                } else if ((rowUniqueId === Number(rowUniqueId)) && (rowUniqueId !== 0)) {
                    id = parseFloat(id);
                }
            }

            if (rowUniqueId === id) {
                dataRow = row;
                break;
            }
        }

        return dataRow;
    };

    BootstrapTable.prototype.removeByUniqueId = function (id) {
        var len = this.options.data.length,
            row = this.getRowByUniqueId(id);

        if (row) {
            this.options.data.splice(this.options.data.indexOf(row), 1);
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateByUniqueId = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [ params ];

        $.each(allParams, function(i, params) {
            var rowId;

            if (!params.hasOwnProperty('id') || !params.hasOwnProperty('row')) {
                return;
            }

            rowId = $.inArray(that.getRowByUniqueId(params.id), that.options.data);

            if (rowId === -1) {
                return;
            }
            $.extend(that.options.data[rowId], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.refreshColumnTitle = function (params) {
        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('title')) {
            return;
        }

        this.columns[this.fieldsColumnsIndex[params.field]].title =
            this.options.escape ? escapeHTML(params.title) : params.title;

        if (this.columns[this.fieldsColumnsIndex[params.field]].visible) {
            var header = this.options.height !== undefined ? this.$tableHeader : this.$header;
            header.find('th[data-field]').each(function (i) {
                if ($(this).data('field') === params.field) {
                    $($(this).find(".th-inner")[0]).text(params.title);
                    return false;
                }
            });
        }
    };

    BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        this.options.data.splice(params.index, 0, params.row);
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [ params ];

        $.each(allParams, function(i, params) {
            if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
                return;
            }
            $.extend(that.options.data[params.index], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.initHiddenRows = function () {
        this.hiddenRows = [];
    };

    BootstrapTable.prototype.showRow = function (params) {
        this.toggleRow(params, true);
    };

    BootstrapTable.prototype.hideRow = function (params) {
        this.toggleRow(params, false);
    };

    BootstrapTable.prototype.toggleRow = function (params, visible) {
        var row, index;

        if (params.hasOwnProperty('index')) {
            row = this.getData()[params.index];
        } else if (params.hasOwnProperty('uniqueId')) {
            row = this.getRowByUniqueId(params.uniqueId);
        }

        if (!row) {
            return;
        }

        index = $.inArray(row, this.hiddenRows);

        if (!visible && index === -1) {
            this.hiddenRows.push(row);
        } else if (visible && index > -1) {
            this.hiddenRows.splice(index, 1);
        }
        this.initBody(true);
    };

    BootstrapTable.prototype.getHiddenRows = function (show) {
        var that = this,
            data = this.getData(),
            rows = [];

        $.each(data, function (i, row) {
            if ($.inArray(row, that.hiddenRows) > -1) {
                rows.push(row);
            }
        });
        this.hiddenRows = rows;
        return rows;
    };

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.getVisibleFields()),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('>tr'),
            $td;

        if (this.options.detailView && !this.options.cardView) {
            col += 1;
        }

        $td = $tr.eq(row).find('>td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('>td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
    };

    BootstrapTable.prototype.updateCell = function (params) {
        if (!params.hasOwnProperty('index') ||
            !params.hasOwnProperty('field') ||
            !params.hasOwnProperty('value')) {
            return;
        }
        this.data[params.index][params.field] = params.value;

        if (params.reinit === false) {
            return;
        }
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateCellById = function (params) {
        var that = this;
        if (!params.hasOwnProperty('id') ||
            !params.hasOwnProperty('field') ||
            !params.hasOwnProperty('value')) {
            return;
        }
        var allParams = $.isArray(params) ? params : [ params ];

        $.each(allParams, function(i, params) {
            var rowId;

            rowId = $.inArray(that.getRowByUniqueId(params.id), that.options.data);

            if (rowId === -1) {
                return;
            }
            that.data[rowId][params.field] = params.value;
        });

        if (params.reinit === false) {
            return;
        }
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.getOptions = function () {
        //Deep copy
        return $.extend(true, {}, this.options);
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
            // fix #2424: from html with checkbox
            return row[that.header.stateField] === true;
        });
    };

    BootstrapTable.prototype.getAllSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
    };

    BootstrapTable.prototype.checkInvert = function () {
        var that = this;
        var rows = that.$selectItem.filter(':enabled');
        var checked = rows.filter(':checked');
        rows.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
        that.updateRows();
        that.updateSelected();
        that.trigger('uncheck-some', checked);
        checked = that.getSelections();
        that.trigger('check-some', checked);
    };

    BootstrapTable.prototype.checkAll_ = function (checked) {
        var rows;
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
    };

    BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
    };

    BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
    };

    BootstrapTable.prototype.check_ = function (checked, index) {
        var $el = this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
        this.trigger(checked ? 'check' : 'uncheck', this.data[index], $el);
    };

    BootstrapTable.prototype.checkBy = function (obj) {
        this.checkBy_(true, obj);
    };

    BootstrapTable.prototype.uncheckBy = function (obj) {
        this.checkBy_(false, obj);
    };

    BootstrapTable.prototype.checkBy_ = function (checked, obj) {
        if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
            return;
        }

        var that = this,
            rows = [];
        $.each(this.options.data, function (index, row) {
            if (!row.hasOwnProperty(obj.field)) {
                return false;
            }
            if ($.inArray(row[obj.field], obj.values) !== -1) {
                var $el = that.$selectItem.filter(':enabled')
                    .filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
                row[that.header.stateField] = checked;
                rows.push(row);
                that.trigger(checked ? 'check' : 'uncheck', row, $el);
            }
        });
        this.updateSelected();
        this.trigger(checked ? 'check-some' : 'uncheck-some', rows);
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .css('margin-top', '0')
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$tableLoading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$tableLoading.hide();
    };

    BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        var button = this.$toolbar.find('button[name="paginationSwitch"] i');
        if (this.options.pagination) {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
    };

    BootstrapTable.prototype.toggleFullscreen = function () {
        this.$el.closest('.bootstrap-table').toggleClass('fullscreen');
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
        }
        if (params && params.pageNumber) {
            this.options.pageNumber = params.pageNumber;
        }
        if (params && params.pageSize) {
            this.options.pageSize = params.pageSize;
        }
        this.initServer(params && params.silent,
            params && params.query, params && params.url);
        this.trigger('refresh', params);
    };

    BootstrapTable.prototype.resetWidth = function () {
        if (this.options.showHeader && this.options.height) {
            this.fitHeader();
        }
        if (this.options.showFooter && !this.options.cardView) {
            this.fitFooter();
        }
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(this.fieldsColumnsIndex[field], true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(this.fieldsColumnsIndex[field], false, true);
    };

    BootstrapTable.prototype.getHiddenColumns = function () {
        return $.grep(this.columns, function (column) {
            return !column.visible;
        });
    };

    BootstrapTable.prototype.getVisibleColumns = function () {
        return $.grep(this.columns, function (column) {
            return column.visible;
        });
    };

    BootstrapTable.prototype.toggleAllColumns = function (visible) {
        var that = this;
        $.each(this.columns, function (i, column) {
            that.columns[i].visible = visible;
        });

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
    };

    BootstrapTable.prototype.showAllColumns = function () {
        this.toggleAllColumns(true);
    };

    BootstrapTable.prototype.hideAllColumns = function () {
        this.toggleAllColumns(false);
    };

    BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.scrollTo = function (value) {
        if (typeof value === 'string') {
            value = value === 'bottom' ? this.$tableBody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
            this.$tableBody.scrollTop(value);
        }
        if (typeof value === 'undefined') {
            return this.$tableBody.scrollTop();
        }
    };

    BootstrapTable.prototype.getScrollPosition = function () {
        return this.scrollTo();
    };

    BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        // Fixed remove toolbar when click cardView button.
        //that.initToolbar();
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
    };

    BootstrapTable.prototype.refreshOptions = function (options) {
        //If the objects are equivalent then avoid the call of destroy / init methods
        if (compareObjects(this.options, options, true)) {
            return;
        }
        this.options = $.extend(this.options, options);
        this.trigger('refresh-options', this.options);
        this.destroy();
        this.init();
    };

    BootstrapTable.prototype.resetSearch = function (text) {
        var $search = this.$toolbar.find('.search input');
        $search.val(text || '');
        this.onSearch({currentTarget: $search});
    };

    BootstrapTable.prototype.expandRow_ = function (expand, index) {
        var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', index));
        if ($tr.next().is('tr.detail-view') === (expand ? false : true)) {
            $tr.find('> td > .detail-icon').click();
        }
    };

    BootstrapTable.prototype.expandRow = function (index) {
        this.expandRow_(true, index);
    };

    BootstrapTable.prototype.collapseRow = function (index) {
        this.expandRow_(false, index);
    };

    BootstrapTable.prototype.expandAllRows = function (isSubTable) {
        if (isSubTable) {
            var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', 0)),
                that = this,
                detailIcon = null,
                executeInterval = false,
                idInterval = -1;

            if (!$tr.next().is('tr.detail-view')) {
                $tr.find('> td > .detail-icon').click();
                executeInterval = true;
            } else if (!$tr.next().next().is('tr.detail-view')) {
                $tr.next().find(".detail-icon").click();
                executeInterval = true;
            }

            if (executeInterval) {
                try {
                    idInterval = setInterval(function () {
                        detailIcon = that.$body.find("tr.detail-view").last().find(".detail-icon");
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
                this.expandRow_(true, $(trs[i]).data("index"));
            }
        }
    };

    BootstrapTable.prototype.collapseAllRows = function (isSubTable) {
        if (isSubTable) {
            this.expandRow_(false, 0);
        } else {
            var trs = this.$body.children();
            for (var i = 0; i < trs.length; i++) {
                this.expandRow_(false, $(trs[i]).data("index"));
            }
        }
    };

    BootstrapTable.prototype.updateFormatText = function (name, text) {
        if (this.options[sprintf('format%s', name)]) {
            if (typeof text === 'string') {
                this.options[sprintf('format%s', name)] = function () {
                    return text;
                };
            } else if (typeof text === 'function') {
                this.options[sprintf('format%s', name)] = text;
            }
        }
        this.initToolbar();
        this.initPagination();
        this.initBody();
    };

    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getAllSelections', 'getData',
        'load', 'append', 'prepend', 'remove', 'removeAll',
        'insertRow', 'updateRow', 'updateCell', 'updateByUniqueId', 'removeByUniqueId',
        'getRowByUniqueId', 'showRow', 'hideRow', 'getHiddenRows',
        'mergeCells', 'refreshColumnTitle',
        'checkAll', 'uncheckAll', 'checkInvert',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'resetWidth',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn', 'getHiddenColumns', 'getVisibleColumns',
        'showAllColumns', 'hideAllColumns',
        'filterBy',
        'scrollTo',
        'getScrollPosition',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView',
        'refreshOptions',
        'resetSearch',
        'expandRow', 'collapseRow', 'expandAllRows', 'collapseAllRows',
        'updateFormatText', 'updateCellById'
    ];

    $.fn.bootstrapTable = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;
    $.fn.bootstrapTable.utils = {
        bootstrapVersion: bootstrapVersion,
        sprintf: sprintf,
        compareObjects: compareObjects,
        calculateObjectValue: calculateObjectValue,
        getItemField: getItemField,
        objectKeys: objectKeys,
        isIEBrowser: isIEBrowser
    };

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

},["./node_modules/bootstrap-table/dist/bootstrap-table.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXRhYmxlL2Rpc3QvYm9vdHN0cmFwLXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsdUJBQXVCO0FBQzFDO0FBQ0E7O0FBRUEsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBLHVCQUF1QixjQUFjO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLGFBQWE7QUFDeEM7QUFDQTtBQUNBLDJCQUEyQixhQUFhO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsOEJBQThCO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFDcEMsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEMsc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGlCQUFpQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUNBQW1DLHFCQUFxQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixpQkFBaUI7O0FBRXZDLDRCQUE0QixnQkFBZ0IsUUFBUTtBQUNwRCxnQ0FBZ0MsZ0JBQWdCO0FBQ2hELHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQsZ0RBQWdEO0FBQ2hELG9EQUFvRDtBQUNwRCw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhOztBQUViO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsK0JBQStCLCtCQUErQjs7QUFFOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsMkJBQTJCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLFNBQVM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUZBQXFGOztBQUVyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQTBGO0FBQzFGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVDQUF1QyxpQkFBaUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQW9EO0FBQ25GO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnRUFBZ0U7QUFDaEU7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTZDO0FBQzdDLGlEQUFpRDs7QUFFakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvR0FBb0c7QUFDcEc7O0FBRUEsMEZBQTBGLGFBQWE7O0FBRXZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyw2QkFBNkI7QUFDdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsUUFBUTtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCLFFBQVE7QUFDakM7O0FBRUEsK0NBQStDO0FBQy9DO0FBQ0EsYUFBYSw4Q0FBOEM7QUFDM0Q7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLG1CQUFtQjtBQUN4Qyx5QkFBeUIsbUJBQW1CO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJmaWxlIjoianMvYm9vdHN0cmFwLXRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIHpoaXhpbiB3ZW4gPHdlbnpoaXhpbjIwMTBAZ21haWwuY29tPlxuICogdmVyc2lvbjogMS4xMi4yXG4gKiBodHRwczovL2dpdGh1Yi5jb20vd2VuemhpeGluL2Jvb3RzdHJhcC10YWJsZS9cbiAqL1xuXG4oZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBUT09MUyBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFyIGJvb3RzdHJhcFZlcnNpb24gPSAzO1xuICAgIHRyeSB7XG4gICAgICAgIGJvb3RzdHJhcFZlcnNpb24gPSBwYXJzZUludCgkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yLlZFUlNJT04sIDEwKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHZhciBicyA9IHtcbiAgICAgICAgMzoge1xuICAgICAgICAgICAgYnV0dG9uc0NsYXNzOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICBpY29uc1ByZWZpeDogJ2dseXBoaWNvbicsXG4gICAgICAgICAgICBpY29uczoge1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25Td2l0Y2hEb3duOiAnZ2x5cGhpY29uLWNvbGxhcHNlLWRvd24gaWNvbi1jaGV2cm9uLWRvd24nLFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25Td2l0Y2hVcDogJ2dseXBoaWNvbi1jb2xsYXBzZS11cCBpY29uLWNoZXZyb24tdXAnLFxuICAgICAgICAgICAgICAgIHJlZnJlc2g6ICdnbHlwaGljb24tcmVmcmVzaCBpY29uLXJlZnJlc2gnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9mZjogJ2dseXBoaWNvbi1saXN0LWFsdCBpY29uLWxpc3QtYWx0JyxcbiAgICAgICAgICAgICAgICB0b2dnbGVPbjogJ2dseXBoaWNvbi1saXN0LWFsdCBpY29uLWxpc3QtYWx0JyxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiAnZ2x5cGhpY29uLXRoIGljb24tdGgnLFxuICAgICAgICAgICAgICAgIGRldGFpbE9wZW46ICdnbHlwaGljb24tcGx1cyBpY29uLXBsdXMnLFxuICAgICAgICAgICAgICAgIGRldGFpbENsb3NlOiAnZ2x5cGhpY29uLW1pbnVzIGljb24tbWludXMnLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW46ICdnbHlwaGljb24tZnVsbHNjcmVlbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwdWxsQ2xhc3M6ICdwdWxsJyxcbiAgICAgICAgICAgIHRvb2JhckRyb3Bkb3dIdG1sOiBbJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPicsICc8L3VsPiddLFxuICAgICAgICAgICAgdG9vYmFyRHJvcGRvd0l0ZW1IdG1sOiAnPGxpIHJvbGU9XCJtZW51aXRlbVwiPjxsYWJlbD4lczwvbGFiZWw+PC9saT4nLFxuICAgICAgICAgICAgcGFnZURyb3Bkb3duSHRtbDogWyc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj4nLCAnPC91bD4nXSxcbiAgICAgICAgICAgIHBhZ2VEcm9wZG93bkl0ZW1IdG1sOiAnPGxpIHJvbGU9XCJtZW51aXRlbVwiIGNsYXNzPVwiJXNcIj48YSBocmVmPVwiI1wiPiVzPC9hPjwvbGk+J1xuICAgICAgICB9LFxuICAgICAgICA0OiB7XG4gICAgICAgICAgICBidXR0b25zQ2xhc3M6ICdzZWNvbmRhcnknLFxuICAgICAgICAgICAgaWNvbnNQcmVmaXg6ICdmYScsXG4gICAgICAgICAgICBpY29uczoge1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25Td2l0Y2hEb3duOiAnZmEtdG9nZ2xlLWRvd24nLFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25Td2l0Y2hVcDogJ2ZhLXRvZ2dsZS11cCcsXG4gICAgICAgICAgICAgICAgcmVmcmVzaDogJ2ZhLXJlZnJlc2gnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9mZjogJ2ZhLXRvZ2dsZS1vZmYnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9uOiAnZmEtdG9nZ2xlLW9uJyxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiAnZmEtdGgtbGlzdCcsXG4gICAgICAgICAgICAgICAgZGV0YWlsT3BlbjogJ2ZhLXBsdXMnLFxuICAgICAgICAgICAgICAgIGRldGFpbENsb3NlOiAnZmEtbWludXMnLFxuICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW46ICdmYS1hcnJvd3MtYWx0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1bGxDbGFzczogJ2Zsb2F0JyxcbiAgICAgICAgICAgIHRvb2JhckRyb3Bkb3dIdG1sOiBbJzxkaXYgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIj4nLCAnPC9kaXY+J10sXG4gICAgICAgICAgICB0b29iYXJEcm9wZG93SXRlbUh0bWw6ICc8bGFiZWwgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCI+JXM8L2xhYmVsPicsXG4gICAgICAgICAgICBwYWdlRHJvcGRvd25IdG1sOiBbJzxkaXYgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+JywgJzwvZGl2PiddLFxuICAgICAgICAgICAgcGFnZURyb3Bkb3duSXRlbUh0bWw6ICc8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW0gJXNcIiBocmVmPVwiI1wiPiVzPC9hPidcbiAgICAgICAgfVxuICAgIH1bYm9vdHN0cmFwVmVyc2lvbl07XG5cbiAgICB2YXIgY2FjaGVkV2lkdGggPSBudWxsO1xuXG4gICAgLy8gaXQgb25seSBkb2VzICclcycsIGFuZCByZXR1cm4gJycgd2hlbiBhcmd1bWVudHMgYXJlIHVuZGVmaW5lZFxuICAgIHZhciBzcHJpbnRmID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlLFxuICAgICAgICAgICAgaSA9IDE7XG5cbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2krK107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZsYWcgPyBzdHIgOiAnJztcbiAgICB9O1xuXG4gICAgdmFyIGdldFByb3BlcnR5RnJvbU90aGVyID0gZnVuY3Rpb24gKGxpc3QsIGZyb20sIHRvLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICAgICQuZWFjaChsaXN0LCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bZnJvbV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlbVt0b107XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBodHRwOi8vanNmaWRkbGUubmV0L3dlbnlpLzQ3bno3ZXo5LzMvXG4gICAgdmFyIHNldEZpZWxkSW5kZXggPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICB2YXIgaSwgaiwgayxcbiAgICAgICAgICAgIHRvdGFsQ29sID0gMCxcbiAgICAgICAgICAgIGZsYWcgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sdW1uc1swXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG90YWxDb2wgKz0gY29sdW1uc1swXVtpXS5jb2xzcGFuIHx8IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmxhZ1tpXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHRvdGFsQ29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmbGFnW2ldW2pdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvbHVtbnNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgciA9IGNvbHVtbnNbaV1bal0sXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW4gPSByLnJvd3NwYW4gfHwgMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbiA9IHIuY29sc3BhbiB8fCAxLFxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICQuaW5BcnJheShmYWxzZSwgZmxhZ1tpXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29sc3BhbiA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByLmZpZWxkSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBmaWVsZCBpcyB1bmRlZmluZWQsIHVzZSBpbmRleCBpbnN0ZWFkXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygci5maWVsZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIuZmllbGQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCByb3dzcGFuOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ1tpICsga11baW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGNvbHNwYW47IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBmbGFnW2ldW2luZGV4ICsga10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0U2Nyb2xsQmFyV2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChjYWNoZWRXaWR0aCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGlubmVyID0gJCgnPHAvPicpLmFkZENsYXNzKCdmaXhlZC10YWJsZS1zY3JvbGwtaW5uZXInKSxcbiAgICAgICAgICAgICAgICBvdXRlciA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdmaXhlZC10YWJsZS1zY3JvbGwtb3V0ZXInKSxcbiAgICAgICAgICAgICAgICB3MSwgdzI7XG5cbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChpbm5lcik7XG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKG91dGVyKTtcblxuICAgICAgICAgICAgdzEgPSBpbm5lclswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIG91dGVyLmNzcygnb3ZlcmZsb3cnLCAnc2Nyb2xsJyk7XG4gICAgICAgICAgICB3MiA9IGlubmVyWzBdLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICBpZiAodzEgPT09IHcyKSB7XG4gICAgICAgICAgICAgICAgdzIgPSBvdXRlclswXS5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0ZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICBjYWNoZWRXaWR0aCA9IHcxIC0gdzI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlZFdpZHRoO1xuICAgIH07XG5cbiAgICB2YXIgY2FsY3VsYXRlT2JqZWN0VmFsdWUgPSBmdW5jdGlvbiAoc2VsZiwgbmFtZSwgYXJncywgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHZhciBmdW5jID0gbmFtZTtcblxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0IG9iai5mdW5jMS5mdW5jMlxuICAgICAgICAgICAgdmFyIG5hbWVzID0gbmFtZS5zcGxpdCgnLicpO1xuXG4gICAgICAgICAgICBpZiAobmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSB3aW5kb3c7XG4gICAgICAgICAgICAgICAgJC5lYWNoKG5hbWVzLCBmdW5jdGlvbiAoaSwgZikge1xuICAgICAgICAgICAgICAgICAgICBmdW5jID0gZnVuY1tmXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IHdpbmRvd1tuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MgfHwgW10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZnVuYyAmJiB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgJiYgc3ByaW50Zi5hcHBseSh0aGlzLCBbbmFtZV0uY29uY2F0KGFyZ3MpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkodGhpcywgW25hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9O1xuXG4gICAgdmFyIGNvbXBhcmVPYmplY3RzID0gZnVuY3Rpb24gKG9iamVjdEEsIG9iamVjdEIsIGNvbXBhcmVMZW5ndGgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGFycmF5cyBvZiBwcm9wZXJ0eSBuYW1lc1xuICAgICAgICB2YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JqZWN0QVByb3BlcnRpZXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdEEpLFxuICAgICAgICAgICAgb2JqZWN0QlByb3BlcnRpZXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdEIpLFxuICAgICAgICAgICAgcHJvcE5hbWUgPSAnJztcblxuICAgICAgICBpZiAoY29tcGFyZUxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgbnVtYmVyIG9mIHByb3BlcnRpZXMgaXMgZGlmZmVyZW50LCBvYmplY3RzIGFyZSBub3QgZXF1aXZhbGVudFxuICAgICAgICAgICAgaWYgKG9iamVjdEFQcm9wZXJ0aWVzLmxlbmd0aCAhPT0gb2JqZWN0QlByb3BlcnRpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RBUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJvcE5hbWUgPSBvYmplY3RBUHJvcGVydGllc1tpXTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHByb3BlcnR5IGlzIG5vdCBpbiB0aGUgb2JqZWN0IEIgcHJvcGVydGllcywgY29udGludWUgd2l0aCB0aGUgbmV4dCBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShwcm9wTmFtZSwgb2JqZWN0QlByb3BlcnRpZXMpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB2YWx1ZXMgb2Ygc2FtZSBwcm9wZXJ0eSBhcmUgbm90IGVxdWFsLCBvYmplY3RzIGFyZSBub3QgZXF1aXZhbGVudFxuICAgICAgICAgICAgICAgIGlmIChvYmplY3RBW3Byb3BOYW1lXSAhPT0gb2JqZWN0Qltwcm9wTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIG1hZGUgaXQgdGhpcyBmYXIsIG9iamVjdHMgYXJlIGNvbnNpZGVyZWQgZXF1aXZhbGVudFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdmFyIGVzY2FwZUhUTUwgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICBpZiAodHlwZW9mIHRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dFxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjMDM5OycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL2AvZywgJyYjeDYwOycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICB2YXIgZ2V0UmVhbERhdGFBdHRyID0gZnVuY3Rpb24gKGRhdGFBdHRyKSB7XG4gICAgICAgIGZvciAodmFyIGF0dHIgaW4gZGF0YUF0dHIpIHtcbiAgICAgICAgICAgIHZhciBhdXhBdHRyID0gYXR0ci5zcGxpdCgvKD89W0EtWl0pLykuam9pbignLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoYXV4QXR0ciAhPT0gYXR0cikge1xuICAgICAgICAgICAgICAgIGRhdGFBdHRyW2F1eEF0dHJdID0gZGF0YUF0dHJbYXR0cl07XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFBdHRyW2F0dHJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFBdHRyO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0SXRlbUZpZWxkID0gZnVuY3Rpb24gKGl0ZW0sIGZpZWxkLCBlc2NhcGUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbTtcblxuICAgICAgICBpZiAodHlwZW9mIGZpZWxkICE9PSAnc3RyaW5nJyB8fCBpdGVtLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZSA/IGVzY2FwZUhUTUwoaXRlbVtmaWVsZF0pIDogaXRlbVtmaWVsZF07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb3BzID0gZmllbGQuc3BsaXQoJy4nKTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAmJiB2YWx1ZVtwcm9wc1twXV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVzY2FwZSA/IGVzY2FwZUhUTUwodmFsdWUpIDogdmFsdWU7XG4gICAgfTtcblxuICAgIHZhciBpc0lFQnJvd3NlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICEhKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgXCIpID4gMCB8fCAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQuKnJ2XFw6MTFcXC4vKSk7XG4gICAgfTtcblxuICAgIHZhciBvYmplY3RLZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9rZXlzXG4gICAgICAgIGlmICghT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIGhhc0RvbnRFbnVtQnVnID0gISh7IHRvU3RyaW5nOiBudWxsIH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpLFxuICAgICAgICAgICAgICAgICAgICBkb250RW51bXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZU9mJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgJiYgKHR5cGVvZiBvYmogIT09ICdmdW5jdGlvbicgfHwgb2JqID09PSBudWxsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmtleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXSwgcHJvcCwgaTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEJPT1RTVFJBUCBUQUJMRSBDTEFTUyBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFyIEJvb3RzdHJhcFRhYmxlID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGVsXyA9IHRoaXMuJGVsLmNsb25lKCk7XG4gICAgICAgIHRoaXMudGltZW91dElkXyA9IDA7XG4gICAgICAgIHRoaXMudGltZW91dEZvb3Rlcl8gPSAwO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5ERUZBVUxUUyA9IHtcbiAgICAgICAgY2xhc3NlczogJ3RhYmxlIHRhYmxlLWhvdmVyJyxcbiAgICAgICAgc29ydENsYXNzOiB1bmRlZmluZWQsXG4gICAgICAgIGxvY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkVGV4dDogJy0nLFxuICAgICAgICBzb3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBzb3J0T3JkZXI6ICdhc2MnLFxuICAgICAgICBzb3J0U3RhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVtZW1iZXJPcmRlcjogZmFsc2UsXG4gICAgICAgIHN0cmlwZWQ6IGZhbHNlLFxuICAgICAgICBjb2x1bW5zOiBbW11dLFxuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgdG90YWxGaWVsZDogJ3RvdGFsJyxcbiAgICAgICAgZGF0YUZpZWxkOiAncm93cycsXG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHVybDogdW5kZWZpbmVkLFxuICAgICAgICBhamF4OiB1bmRlZmluZWQsXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBhamF4T3B0aW9uczoge30sXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBxdWVyeVBhcmFtc1R5cGU6ICdsaW1pdCcsIC8vIHVuZGVmaW5lZFxuICAgICAgICByZXNwb25zZUhhbmRsZXI6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICBvbmx5SW5mb1BhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICBwYWdpbmF0aW9uTG9vcDogdHJ1ZSxcbiAgICAgICAgc2lkZVBhZ2luYXRpb246ICdjbGllbnQnLCAvLyBjbGllbnQgb3Igc2VydmVyXG4gICAgICAgIHRvdGFsUm93czogMCwgLy8gc2VydmVyIHNpZGUgbmVlZCB0byBzZXRcbiAgICAgICAgcGFnZU51bWJlcjogMSxcbiAgICAgICAgcGFnZVNpemU6IDEwLFxuICAgICAgICBwYWdlTGlzdDogWzEwLCAyNSwgNTAsIDEwMF0sXG4gICAgICAgIHBhZ2luYXRpb25IQWxpZ246ICdyaWdodCcsIC8vcmlnaHQsIGxlZnRcbiAgICAgICAgcGFnaW5hdGlvblZBbGlnbjogJ2JvdHRvbScsIC8vYm90dG9tLCB0b3AsIGJvdGhcbiAgICAgICAgcGFnaW5hdGlvbkRldGFpbEhBbGlnbjogJ2xlZnQnLCAvL3JpZ2h0LCBsZWZ0XG4gICAgICAgIHBhZ2luYXRpb25QcmVUZXh0OiAnJmxzYXF1bzsnLFxuICAgICAgICBwYWdpbmF0aW9uTmV4dFRleHQ6ICcmcnNhcXVvOycsXG4gICAgICAgIHNlYXJjaDogZmFsc2UsXG4gICAgICAgIHNlYXJjaE9uRW50ZXJLZXk6IGZhbHNlLFxuICAgICAgICBzdHJpY3RTZWFyY2g6IGZhbHNlLFxuICAgICAgICBzZWFyY2hBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc2VsZWN0SXRlbU5hbWU6ICdidFNlbGVjdEl0ZW0nLFxuICAgICAgICBzaG93SGVhZGVyOiB0cnVlLFxuICAgICAgICBzaG93Rm9vdGVyOiBmYWxzZSxcbiAgICAgICAgc2hvd0NvbHVtbnM6IGZhbHNlLFxuICAgICAgICBzaG93UGFnaW5hdGlvblN3aXRjaDogZmFsc2UsXG4gICAgICAgIHNob3dSZWZyZXNoOiBmYWxzZSxcbiAgICAgICAgc2hvd1RvZ2dsZTogZmFsc2UsXG4gICAgICAgIHNob3dGdWxsc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgc21hcnREaXNwbGF5OiB0cnVlLFxuICAgICAgICBlc2NhcGU6IGZhbHNlLFxuICAgICAgICBtaW5pbXVtQ291bnRDb2x1bW5zOiAxLFxuICAgICAgICBpZEZpZWxkOiB1bmRlZmluZWQsXG4gICAgICAgIHVuaXF1ZUlkOiB1bmRlZmluZWQsXG4gICAgICAgIGNhcmRWaWV3OiBmYWxzZSxcbiAgICAgICAgZGV0YWlsVmlldzogZmFsc2UsXG4gICAgICAgIGRldGFpbEZvcm1hdHRlcjogZnVuY3Rpb24gKGluZGV4LCByb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSxcbiAgICAgICAgZGV0YWlsRmlsdGVyOiBmdW5jdGlvbiAoaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW1PblNlYXJjaDogdHJ1ZSxcbiAgICAgICAgY2xpY2tUb1NlbGVjdDogZmFsc2UsXG4gICAgICAgIHNpbmdsZVNlbGVjdDogZmFsc2UsXG4gICAgICAgIHRvb2xiYXI6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9vbGJhckFsaWduOiAnbGVmdCcsXG4gICAgICAgIGJ1dHRvbnNUb29sYmFyOiB1bmRlZmluZWQsXG4gICAgICAgIGJ1dHRvbnNBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgY2hlY2tib3hIZWFkZXI6IHRydWUsXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgICBzaWxlbnRTb3J0OiB0cnVlLFxuICAgICAgICBtYWludGFpblNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoVGltZU91dDogNTAwLFxuICAgICAgICBzZWFyY2hUZXh0OiAnJyxcbiAgICAgICAgaWNvblNpemU6IHVuZGVmaW5lZCxcbiAgICAgICAgYnV0dG9uc0NsYXNzOiBicy5idXR0b25zQ2xhc3MsXG4gICAgICAgIGljb25zUHJlZml4OiBicy5pY29uc1ByZWZpeCwgLy8gZ2x5cGhpY29uIG9yIGZhIChmb250IGF3ZXNvbWUpXG4gICAgICAgIGljb25zOiBicy5pY29ucyxcblxuICAgICAgICBjdXN0b21TZWFyY2g6ICQubm9vcCxcblxuICAgICAgICBjdXN0b21Tb3J0OiAkLm5vb3AsXG5cbiAgICAgICAgaWdub3JlQ2xpY2tUb1NlbGVjdE9uOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheShlbGVtZW50LnRhZ05hbWUsIFsnQScsICdCVVRUT04nXSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcm93U3R5bGU6IGZ1bmN0aW9uIChyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgcm93QXR0cmlidXRlczogZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb290ZXJTdHlsZTogZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICBvbkFsbDogZnVuY3Rpb24gKG5hbWUsIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DbGlja0NlbGw6IGZ1bmN0aW9uIChmaWVsZCwgdmFsdWUsIHJvdywgJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25EYmxDbGlja0NlbGw6IGZ1bmN0aW9uIChmaWVsZCwgdmFsdWUsIHJvdywgJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DbGlja1JvdzogZnVuY3Rpb24gKGl0ZW0sICRlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRGJsQ2xpY2tSb3c6IGZ1bmN0aW9uIChpdGVtLCAkZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblNvcnQ6IGZ1bmN0aW9uIChuYW1lLCBvcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNoZWNrOiBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVW5jaGVjazogZnVuY3Rpb24gKHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNoZWNrQWxsOiBmdW5jdGlvbiAocm93cykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblVuY2hlY2tBbGw6IGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hlY2tTb21lOiBmdW5jdGlvbiAocm93cykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblVuY2hlY2tTb21lOiBmdW5jdGlvbiAocm93cykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWRTdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkxvYWRFcnJvcjogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbHVtblN3aXRjaDogZnVuY3Rpb24gKGZpZWxkLCBjaGVja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUGFnZUNoYW5nZTogZnVuY3Rpb24gKG51bWJlciwgc2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblNlYXJjaDogZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Ub2dnbGU6IGZ1bmN0aW9uIChjYXJkVmlldykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblByZUJvZHk6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUG9zdEJvZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0SGVhZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhwYW5kUm93OiBmdW5jdGlvbiAoaW5kZXgsIHJvdywgJGRldGFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbGxhcHNlUm93OiBmdW5jdGlvbiAoaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblJlZnJlc2hPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblJlZnJlc2g6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVzZXRWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2Nyb2xsQm9keTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVMgPSB7fTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVNbJ2VuLVVTJ10gPSBCb290c3RyYXBUYWJsZS5MT0NBTEVTLmVuID0ge1xuICAgICAgICBmb3JtYXRMb2FkaW5nTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdMb2FkaW5nLCBwbGVhc2Ugd2FpdC4uLic7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFJlY29yZHNQZXJQYWdlOiBmdW5jdGlvbiAocGFnZU51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGYoJyVzIHJvd3MgcGVyIHBhZ2UnLCBwYWdlTnVtYmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0U2hvd2luZ1Jvd3M6IGZ1bmN0aW9uIChwYWdlRnJvbSwgcGFnZVRvLCB0b3RhbFJvd3MpIHtcbiAgICAgICAgICAgIHJldHVybiBzcHJpbnRmKCdTaG93aW5nICVzIHRvICVzIG9mICVzIHJvd3MnLCBwYWdlRnJvbSwgcGFnZVRvLCB0b3RhbFJvd3MpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXREZXRhaWxQYWdpbmF0aW9uOiBmdW5jdGlvbiAodG90YWxSb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50ZignU2hvd2luZyAlcyByb3dzJywgdG90YWxSb3dzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0U2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1NlYXJjaCc7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdE5vTWF0Y2hlczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdObyBtYXRjaGluZyByZWNvcmRzIGZvdW5kJztcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0UGFnaW5hdGlvblN3aXRjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdIaWRlL1Nob3cgcGFnaW5hdGlvbic7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnUmVmcmVzaCc7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdUb2dnbGUnO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRGdWxsc2NyZWVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0Z1bGxzY3JlZW4nO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRDb2x1bW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0NvbHVtbnMnO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRBbGxSb3dzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0FsbCc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJC5leHRlbmQoQm9vdHN0cmFwVGFibGUuREVGQVVMVFMsIEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVNbJ2VuLVVTJ10pO1xuXG4gICAgQm9vdHN0cmFwVGFibGUuQ09MVU1OX0RFRkFVTFRTID0ge1xuICAgICAgICByYWRpbzogZmFsc2UsXG4gICAgICAgIGNoZWNrYm94OiBmYWxzZSxcbiAgICAgICAgY2hlY2tib3hFbmFibGVkOiB0cnVlLFxuICAgICAgICBmaWVsZDogdW5kZWZpbmVkLFxuICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICB0aXRsZVRvb2x0aXA6IHVuZGVmaW5lZCxcbiAgICAgICAgJ2NsYXNzJzogdW5kZWZpbmVkLFxuICAgICAgICBhbGlnbjogdW5kZWZpbmVkLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXG4gICAgICAgIGhhbGlnbjogdW5kZWZpbmVkLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXG4gICAgICAgIGZhbGlnbjogdW5kZWZpbmVkLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXG4gICAgICAgIHZhbGlnbjogdW5kZWZpbmVkLCAvLyB0b3AsIG1pZGRsZSwgYm90dG9tXG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgb3JkZXI6ICdhc2MnLCAvLyBhc2MsIGRlc2NcbiAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgc3dpdGNoYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpY2tUb1NlbGVjdDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiB1bmRlZmluZWQsXG4gICAgICAgIGZvb3RlckZvcm1hdHRlcjogdW5kZWZpbmVkLFxuICAgICAgICBldmVudHM6IHVuZGVmaW5lZCxcbiAgICAgICAgc29ydGVyOiB1bmRlZmluZWQsXG4gICAgICAgIHNvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGNlbGxTdHlsZTogdW5kZWZpbmVkLFxuICAgICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgICBzZWFyY2hGb3JtYXR0ZXI6IHRydWUsXG4gICAgICAgIGNhcmRWaXNpYmxlOiB0cnVlLFxuICAgICAgICBlc2NhcGU6IGZhbHNlLFxuICAgICAgICBzaG93U2VsZWN0VGl0bGU6IGZhbHNlXG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLkVWRU5UUyA9IHtcbiAgICAgICAgJ2FsbC5icy50YWJsZSc6ICdvbkFsbCcsXG4gICAgICAgICdjbGljay1jZWxsLmJzLnRhYmxlJzogJ29uQ2xpY2tDZWxsJyxcbiAgICAgICAgJ2RibC1jbGljay1jZWxsLmJzLnRhYmxlJzogJ29uRGJsQ2xpY2tDZWxsJyxcbiAgICAgICAgJ2NsaWNrLXJvdy5icy50YWJsZSc6ICdvbkNsaWNrUm93JyxcbiAgICAgICAgJ2RibC1jbGljay1yb3cuYnMudGFibGUnOiAnb25EYmxDbGlja1JvdycsXG4gICAgICAgICdzb3J0LmJzLnRhYmxlJzogJ29uU29ydCcsXG4gICAgICAgICdjaGVjay5icy50YWJsZSc6ICdvbkNoZWNrJyxcbiAgICAgICAgJ3VuY2hlY2suYnMudGFibGUnOiAnb25VbmNoZWNrJyxcbiAgICAgICAgJ2NoZWNrLWFsbC5icy50YWJsZSc6ICdvbkNoZWNrQWxsJyxcbiAgICAgICAgJ3VuY2hlY2stYWxsLmJzLnRhYmxlJzogJ29uVW5jaGVja0FsbCcsXG4gICAgICAgICdjaGVjay1zb21lLmJzLnRhYmxlJzogJ29uQ2hlY2tTb21lJyxcbiAgICAgICAgJ3VuY2hlY2stc29tZS5icy50YWJsZSc6ICdvblVuY2hlY2tTb21lJyxcbiAgICAgICAgJ2xvYWQtc3VjY2Vzcy5icy50YWJsZSc6ICdvbkxvYWRTdWNjZXNzJyxcbiAgICAgICAgJ2xvYWQtZXJyb3IuYnMudGFibGUnOiAnb25Mb2FkRXJyb3InLFxuICAgICAgICAnY29sdW1uLXN3aXRjaC5icy50YWJsZSc6ICdvbkNvbHVtblN3aXRjaCcsXG4gICAgICAgICdwYWdlLWNoYW5nZS5icy50YWJsZSc6ICdvblBhZ2VDaGFuZ2UnLFxuICAgICAgICAnc2VhcmNoLmJzLnRhYmxlJzogJ29uU2VhcmNoJyxcbiAgICAgICAgJ3RvZ2dsZS5icy50YWJsZSc6ICdvblRvZ2dsZScsXG4gICAgICAgICdwcmUtYm9keS5icy50YWJsZSc6ICdvblByZUJvZHknLFxuICAgICAgICAncG9zdC1ib2R5LmJzLnRhYmxlJzogJ29uUG9zdEJvZHknLFxuICAgICAgICAncG9zdC1oZWFkZXIuYnMudGFibGUnOiAnb25Qb3N0SGVhZGVyJyxcbiAgICAgICAgJ2V4cGFuZC1yb3cuYnMudGFibGUnOiAnb25FeHBhbmRSb3cnLFxuICAgICAgICAnY29sbGFwc2Utcm93LmJzLnRhYmxlJzogJ29uQ29sbGFwc2VSb3cnLFxuICAgICAgICAncmVmcmVzaC1vcHRpb25zLmJzLnRhYmxlJzogJ29uUmVmcmVzaE9wdGlvbnMnLFxuICAgICAgICAncmVzZXQtdmlldy5icy50YWJsZSc6ICdvblJlc2V0VmlldycsXG4gICAgICAgICdyZWZyZXNoLmJzLnRhYmxlJzogJ29uUmVmcmVzaCcsXG4gICAgICAgICdzY3JvbGwtYm9keS5icy50YWJsZSc6ICdvblNjcm9sbEJvZHknXG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRMb2NhbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Q29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuaW5pdFRhYmxlKCk7XG4gICAgICAgIHRoaXMuaW5pdEhlYWRlcigpO1xuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgICAgIHRoaXMuaW5pdEhpZGRlblJvd3MoKTtcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdFRvb2xiYXIoKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaFRleHQoKTtcbiAgICAgICAgdGhpcy5pbml0U2VydmVyKCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0TG9jYWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxvY2FsZSkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gdGhpcy5vcHRpb25zLmxvY2FsZS5zcGxpdCgvLXxfLyk7XG4gICAgICAgICAgICBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhcnRzWzFdKSB7XG4gICAgICAgICAgICAgICAgcGFydHNbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbdGhpcy5vcHRpb25zLmxvY2FsZV0pIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbGUgYXMgcmVxdWVzdGVkXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbdGhpcy5vcHRpb25zLmxvY2FsZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbcGFydHMuam9pbignLScpXSkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsZSB3aXRoIHNlcCBzZXQgdG8gLSAoaW4gY2FzZSBvcmlnaW5hbCB3YXMgc3BlY2lmaWVkIHdpdGggXylcbiAgICAgICAgICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnMsICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlc1twYXJ0cy5qb2luKCctJyldKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJC5mbi5ib290c3RyYXBUYWJsZS5sb2NhbGVzW3BhcnRzWzBdXSkge1xuICAgICAgICAgICAgICAgIC8vIHNob3J0IGxvY2FsZSBsYW5ndWFnZSBjb2RlIChpLmUuICdlbicpXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbcGFydHNbMF1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdENvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJChbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvb3RzdHJhcC10YWJsZVwiPicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXRvb2xiYXJcIj48L2Rpdj4nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25WQWxpZ24gPT09ICd0b3AnIHx8IHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAnYm90aCcgP1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtcGFnaW5hdGlvblwiIHN0eWxlPVwiY2xlYXI6IGJvdGg7XCI+PC9kaXY+JyA6XG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWNvbnRhaW5lclwiPicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWhlYWRlclwiPjx0YWJsZT48L3RhYmxlPjwvZGl2PicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWJvZHlcIj4nLFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS1sb2FkaW5nXCI+JyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRMb2FkaW5nTWVzc2FnZSgpLFxuICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtZm9vdGVyXCI+PHRhYmxlPjx0cj48L3RyPjwvdGFibGU+PC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25WQWxpZ24gPT09ICdib3R0b20nIHx8IHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAnYm90aCcgP1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtcGFnaW5hdGlvblwiPjwvZGl2PicgOlxuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXS5qb2luKCcnKSk7XG5cbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmluc2VydEFmdGVyKHRoaXMuJGVsKTtcbiAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWNvbnRhaW5lcicpO1xuICAgICAgICB0aGlzLiR0YWJsZUhlYWRlciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtaGVhZGVyJyk7XG4gICAgICAgIHRoaXMuJHRhYmxlQm9keSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtYm9keScpO1xuICAgICAgICB0aGlzLiR0YWJsZUxvYWRpbmcgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWxvYWRpbmcnKTtcbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWZvb3RlcicpO1xuICAgICAgICAvLyBjaGVja2luZyBpZiBjdXN0b20gdGFibGUtdG9vbGJhciBleGlzdHMgb3Igbm90XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnV0dG9uc1Rvb2xiYXIpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvb2xiYXIgPSAkKCdib2R5JykuZmluZCh0aGlzLm9wdGlvbnMuYnV0dG9uc1Rvb2xiYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtdG9vbGJhcicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHBhZ2luYXRpb24gPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLXBhZ2luYXRpb24nKTtcblxuICAgICAgICB0aGlzLiR0YWJsZUJvZHkuYXBwZW5kKHRoaXMuJGVsKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj48L2Rpdj4nKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcyk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3RhYmxlLXN0cmlwZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJC5pbkFycmF5KCd0YWJsZS1uby1ib3JkZXJlZCcsIHRoaXMub3B0aW9ucy5jbGFzc2VzLnNwbGl0KCcgJykpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuYWRkQ2xhc3MoJ3RhYmxlLW5vLWJvcmRlcmVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgY29sdW1ucyA9IFtdLFxuICAgICAgICAgICAgZGF0YSA9IFtdO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlciA9IHRoaXMuJGVsLmZpbmQoJz50aGVhZCcpO1xuICAgICAgICBpZiAoIXRoaXMuJGhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlciA9ICQoJzx0aGVhZD48L3RoZWFkPicpLmFwcGVuZFRvKHRoaXMuJGVsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndHInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBbXTtcblxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIEZpeCAjMjAxNCAtIGdldEZpZWxkSW5kZXggYW5kIGVsc2V3aGVyZSBhc3N1bWUgdGhpcyBpcyBzdHJpbmcsIGNhdXNlcyBpc3N1ZXMgaWYgbm90XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAkKHRoaXMpLmRhdGEoJ2ZpZWxkJykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnZmllbGQnLCAkKHRoaXMpLmRhdGEoJ2ZpZWxkJykgKyAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbHVtbi5wdXNoKCQuZXh0ZW5kKHt9LCB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkKHRoaXMpLmh0bWwoKSxcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJCh0aGlzKS5hdHRyKCdjbGFzcycpLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZVRvb2x0aXA6ICQodGhpcykuYXR0cigndGl0bGUnKSxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogJCh0aGlzKS5hdHRyKCdyb3dzcGFuJykgPyArJCh0aGlzKS5hdHRyKCdyb3dzcGFuJykgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46ICQodGhpcykuYXR0cignY29sc3BhbicpID8gKyQodGhpcykuYXR0cignY29sc3BhbicpIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfSwgJCh0aGlzKS5kYXRhKCkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoISQuaXNBcnJheSh0aGlzLm9wdGlvbnMuY29sdW1uc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID0gW3RoaXMub3B0aW9ucy5jb2x1bW5zXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMuY29sdW1ucyA9ICQuZXh0ZW5kKHRydWUsIFtdLCBjb2x1bW5zLCB0aGlzLm9wdGlvbnMuY29sdW1ucyk7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IFtdO1xuICAgICAgICB0aGlzLmZpZWxkc0NvbHVtbnNJbmRleCA9IFtdO1xuXG4gICAgICAgIHNldEZpZWxkSW5kZXgodGhpcy5vcHRpb25zLmNvbHVtbnMpO1xuICAgICAgICAkLmVhY2godGhpcy5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW5zKSB7XG4gICAgICAgICAgICAkLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGosIGNvbHVtbikge1xuICAgICAgICAgICAgICAgIGNvbHVtbiA9ICQuZXh0ZW5kKHt9LCBCb290c3RyYXBUYWJsZS5DT0xVTU5fREVGQVVMVFMsIGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbHVtbi5maWVsZEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmZpZWxkc0NvbHVtbnNJbmRleFtjb2x1bW4uZmllbGRdID0gY29sdW1uLmZpZWxkSW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLmNvbHVtbnNbaV1bal0gPSBjb2x1bW47XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaWYgb3B0aW9ucy5kYXRhIGlzIHNldHRpbmcsIGRvIG5vdCBwcm9jZXNzIHRib2R5IGRhdGFcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG0gPSBbXTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnPnRib2R5PnRyJykuZWFjaChmdW5jdGlvbiAoeSkge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHt9O1xuXG4gICAgICAgICAgICAvLyBzYXZlIHRyJ3MgaWQsIGNsYXNzIGFuZCBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAgICAgcm93Ll9pZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgIHJvdy5fY2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJyk7XG4gICAgICAgICAgICByb3cuX2RhdGEgPSBnZXRSZWFsRGF0YUF0dHIoJCh0aGlzKS5kYXRhKCkpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz50ZCcpLmVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBjc3BhbiA9ICskdGhpcy5hdHRyKCdjb2xzcGFuJykgfHwgMSxcbiAgICAgICAgICAgICAgICAgICAgcnNwYW4gPSArJHRoaXMuYXR0cigncm93c3BhbicpIHx8IDEsXG4gICAgICAgICAgICAgICAgICAgIHR4LFxuICAgICAgICAgICAgICAgICAgICB0eTtcblxuICAgICAgICAgICAgICAgIC8vIHNraXAgYWxyZWFkeSBvY2N1cGllZCBjZWxscyBpbiBjdXJyZW50IHJvd1xuICAgICAgICAgICAgICAgIGZvciAoOyBtW3ldICYmIG1beV1beF07IHgrKyk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHR4ID0geDsgdHggPCB4ICsgY3NwYW47IHR4KyspIHsgLy9tYXJrIG1hdHJpeCBlbGVtZW50cyBvY2N1cGllZCBieSBjdXJyZW50IGNlbGwgd2l0aCB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZvciAodHkgPSB5OyB0eSA8IHkgKyByc3BhbjsgdHkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtW3R5XSkgeyAvL2ZpbGwgbWlzc2luZyByb3dzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbVt0eV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1bdHldW3R4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSB0aGF0LmNvbHVtbnNbeF0uZmllbGQ7XG5cbiAgICAgICAgICAgICAgICByb3dbZmllbGRdID0gJCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0ZCdzIGlkLCBjbGFzcyBhbmQgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICByb3dbJ18nICsgZmllbGQgKyAnX2lkJ10gPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19jbGFzcyddID0gJCh0aGlzKS5hdHRyKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIHJvd1snXycgKyBmaWVsZCArICdfcm93c3BhbiddID0gJCh0aGlzKS5hdHRyKCdyb3dzcGFuJyk7XG4gICAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19jb2xzcGFuJ10gPSAkKHRoaXMpLmF0dHIoJ2NvbHNwYW4nKTtcbiAgICAgICAgICAgICAgICByb3dbJ18nICsgZmllbGQgKyAnX3RpdGxlJ10gPSAkKHRoaXMpLmF0dHIoJ3RpdGxlJyk7XG4gICAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19kYXRhJ10gPSBnZXRSZWFsRGF0YUF0dHIoJCh0aGlzKS5kYXRhKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLnB1c2gocm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoKSB0aGlzLmZyb21IdG1sID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHZpc2libGVDb2x1bW5zID0ge30sXG4gICAgICAgICAgICBodG1sID0gW107XG5cbiAgICAgICAgdGhpcy5oZWFkZXIgPSB7XG4gICAgICAgICAgICBmaWVsZHM6IFtdLFxuICAgICAgICAgICAgc3R5bGVzOiBbXSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgZm9ybWF0dGVyczogW10sXG4gICAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgICAgc29ydGVyczogW10sXG4gICAgICAgICAgICBzb3J0TmFtZXM6IFtdLFxuICAgICAgICAgICAgY2VsbFN0eWxlczogW10sXG4gICAgICAgICAgICBzZWFyY2hhYmxlczogW11cbiAgICAgICAgfTtcblxuICAgICAgICAkLmVhY2godGhpcy5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW5zKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzx0cj4nKTtcblxuICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgIXRoYXQub3B0aW9ucy5jYXJkVmlldyAmJiB0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldykge1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8dGggY2xhc3M9XCJkZXRhaWxcIiByb3dzcGFuPVwiJXNcIj48ZGl2IGNsYXNzPVwiZmh0LWNlbGxcIj48L2Rpdj48L3RoPicsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5jb2x1bW5zLmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGosIGNvbHVtbikge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gJycsXG4gICAgICAgICAgICAgICAgICAgIGhhbGlnbiA9ICcnLCAvLyBoZWFkZXIgYWxpZ24gc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24gPSAnJywgLy8gYm9keSBhbGlnbiBzdHlsZVxuICAgICAgICAgICAgICAgICAgICBzdHlsZSA9ICcnLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc18gPSBzcHJpbnRmKCcgY2xhc3M9XCIlc1wiJywgY29sdW1uWydjbGFzcyddKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXIgPSB0aGF0Lm9wdGlvbnMuc29ydE9yZGVyIHx8IGNvbHVtbi5vcmRlcixcbiAgICAgICAgICAgICAgICAgICAgdW5pdFdpZHRoID0gJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBjb2x1bW4ud2lkdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLndpZHRoICE9PSB1bmRlZmluZWQgJiYgKCF0aGF0Lm9wdGlvbnMuY2FyZFZpZXcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29sdW1uLndpZHRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbi53aWR0aC5pbmRleE9mKCclJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFdpZHRoID0gJyUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ud2lkdGggJiYgdHlwZW9mIGNvbHVtbi53aWR0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBjb2x1bW4ud2lkdGgucmVwbGFjZSgnJScsICcnKS5yZXBsYWNlKCdweCcsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBoYWxpZ24gPSBzcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJywgY29sdW1uLmhhbGlnbiA/IGNvbHVtbi5oYWxpZ24gOiBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgICAgIGFsaWduID0gc3ByaW50ZigndGV4dC1hbGlnbjogJXM7ICcsIGNvbHVtbi5hbGlnbik7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSBzcHJpbnRmKCd2ZXJ0aWNhbC1hbGlnbjogJXM7ICcsIGNvbHVtbi52YWxpZ24pO1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IHNwcmludGYoJ3dpZHRoOiAlczsgJywgKGNvbHVtbi5jaGVja2JveCB8fCBjb2x1bW4ucmFkaW8pICYmICF3aWR0aCA/XG4gICAgICAgICAgICAgICAgICAgICghY29sdW1uLnNob3dTZWxlY3RUaXRsZSA/ICczNnB4JyA6IHVuZGVmaW5lZCkgOlxuICAgICAgICAgICAgICAgICAgICAod2lkdGggPyB3aWR0aCArIHVuaXRXaWR0aCA6IHVuZGVmaW5lZCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2x1bW4uZmllbGRJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuZmllbGRzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuc3R5bGVzW2NvbHVtbi5maWVsZEluZGV4XSA9IGFsaWduICsgc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNsYXNzZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY2xhc3NfO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5mb3JtYXR0ZXJzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5mb3JtYXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmV2ZW50c1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5zb3J0ZXJzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5zb3J0ZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLnNvcnROYW1lc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uc29ydE5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNlbGxTdHlsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLmNlbGxTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuc2VhcmNoYWJsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLnNlYXJjaGFibGU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb2x1bW4udmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5jYXJkVmlldyAmJiAoIWNvbHVtbi5jYXJkVmlzaWJsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGVDb2x1bW5zW2NvbHVtbi5maWVsZF0gPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGgnICsgc3ByaW50ZignIHRpdGxlPVwiJXNcIicsIGNvbHVtbi50aXRsZVRvb2x0aXApLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY2hlY2tib3ggfHwgY29sdW1uLnJhZGlvID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBjbGFzcz1cImJzLWNoZWNrYm94ICVzXCInLCBjb2x1bW5bJ2NsYXNzJ10gfHwgJycpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzXyxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIHN0eWxlPVwiJXNcIicsIGhhbGlnbiArIHN0eWxlKSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJywgY29sdW1uLnJvd3NwYW4pLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgY29sc3Bhbj1cIiVzXCInLCBjb2x1bW4uY29sc3BhbiksXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBkYXRhLWZpZWxkPVwiJXNcIicsIGNvbHVtbi5maWVsZCksXG4gICAgICAgICAgICAgICAgICAgIGogPT09IDAgJiYgY29sdW1uLmZpZWxkSW5kZXggPyAnIGRhdGEtbm90LWZpcnN0LXRoJyA6ICcnLFxuICAgICAgICAgICAgICAgICAgICAnPicpO1xuXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxkaXYgY2xhc3M9XCJ0aC1pbm5lciAlc1wiPicsIHRoYXQub3B0aW9ucy5zb3J0YWJsZSAmJiBjb2x1bW4uc29ydGFibGUgP1xuICAgICAgICAgICAgICAgICAgICAnc29ydGFibGUgYm90aCcgOiAnJykpO1xuXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRoYXQub3B0aW9ucy5lc2NhcGUgPyBlc2NhcGVIVE1MKGNvbHVtbi50aXRsZSkgOiBjb2x1bW4udGl0bGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uY2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQub3B0aW9ucy5zaW5nbGVTZWxlY3QgJiYgdGhhdC5vcHRpb25zLmNoZWNrYm94SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJzxpbnB1dCBuYW1lPVwiYnRTZWxlY3RBbGxcIiB0eXBlPVwiY2hlY2tib3hcIiAvPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuc3RhdGVGaWVsZCA9IGNvbHVtbi5maWVsZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5yYWRpbykge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLnN0YXRlRmllbGQgPSBjb2x1bW4uZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5zaW5nbGVTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRleHQgJiYgY29sdW1uLnNob3dTZWxlY3RUaXRsZSkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHRpdGxlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGh0bWwucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goJzwvdGg+Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC90cj4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kaGVhZGVyLmh0bWwoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgIHRoaXMuJGhlYWRlci5maW5kKCd0aFtkYXRhLWZpZWxkXScpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICQodGhpcykuZGF0YSh2aXNpYmxlQ29sdW1uc1skKHRoaXMpLmRhdGEoJ2ZpZWxkJyldKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5vZmYoJ2NsaWNrJywgJy50aC1pbm5lcicpLm9uKCdjbGljaycsICcudGgtaW5uZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhJHRoaXMucGFyZW50KCkuaGFzQ2xhc3MoJ2JzLWNoZWNrYm94JykpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuY2xvc2VzdCgnLmJvb3RzdHJhcC10YWJsZScpWzBdICE9PSB0aGF0LiRjb250YWluZXJbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zb3J0YWJsZSAmJiAkdGhpcy5wYXJlbnQoKS5kYXRhKCkuc29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU29ydChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkub2ZmKCdrZXlwcmVzcycpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zb3J0YWJsZSAmJiAkKHRoaXMpLmRhdGEoKS5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gZXZlbnQua2V5Q29kZSB8fCBldmVudC53aGljaDtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PSAxMykgeyAvL0VudGVyIGtleWNvZGVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vblNvcnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJvb3RzdHJhcC10YWJsZScpO1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93SGVhZGVyIHx8IHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsIHRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpICsgMSk7XG4gICAgICAgICAgICAvLyBBc3NpZ24gdGhlIGNvcnJlY3Qgc29ydGFibGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplLmJvb3RzdHJhcC10YWJsZScsICQucHJveHkodGhpcy5yZXNldFdpZHRoLCB0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3RBbGwgPSB0aGlzLiRoZWFkZXIuZmluZCgnW25hbWU9XCJidFNlbGVjdEFsbFwiXScpO1xuICAgICAgICB0aGlzLiRzZWxlY3RBbGwub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9ICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgIHRoYXRbY2hlY2tlZCA/ICdjaGVja0FsbCcgOiAndW5jaGVja0FsbCddKCk7XG4gICAgICAgICAgICAgICAgdGhhdC51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0Rm9vdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93Rm9vdGVyIHx8IHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuc2hvdygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHR5cGU6IGFwcGVuZCAvIHByZXBlbmRcbiAgICAgKi9cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdERhdGEgPSBmdW5jdGlvbiAoZGF0YSwgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2FwcGVuZCcpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdGhpcy5vcHRpb25zLmRhdGEuY29uY2F0KGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdwcmVwZW5kJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEgPSBbXS5jb25jYXQoZGF0YSkuY29uY2F0KHRoaXMub3B0aW9ucy5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gZGF0YSB8fCB0aGlzLm9wdGlvbnMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFNvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLm9wdGlvbnMuc29ydE5hbWUsXG4gICAgICAgICAgICBvcmRlciA9IHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPT09ICdkZXNjJyA/IC0xIDogMSxcbiAgICAgICAgICAgIGluZGV4ID0gJC5pbkFycmF5KHRoaXMub3B0aW9ucy5zb3J0TmFtZSwgdGhpcy5oZWFkZXIuZmllbGRzKSxcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0ICE9PSAkLm5vb3ApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0LmFwcGx5KHRoaXMsIFt0aGlzLm9wdGlvbnMuc29ydE5hbWUsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXJdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydFN0YWJsZSkge1xuICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLmRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93Ll9wb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuaGVhZGVyLnNvcnROYW1lc1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHRoYXQuaGVhZGVyLnNvcnROYW1lc1tpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhYSA9IGdldEl0ZW1GaWVsZChhLCBuYW1lLCB0aGF0Lm9wdGlvbnMuZXNjYXBlKSxcbiAgICAgICAgICAgICAgICAgICAgYmIgPSBnZXRJdGVtRmllbGQoYiwgbmFtZSwgdGhhdC5vcHRpb25zLmVzY2FwZSksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhhdC5oZWFkZXIsIHRoYXQuaGVhZGVyLnNvcnRlcnNbaW5kZXhdLCBbYWEsIGJiLCBhLCBiXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNvcnRTdGFibGUgJiYgdmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLl9wb3NpdGlvbiAtIGIuX3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZpeCAjMTYxOiB1bmRlZmluZWQgb3IgbnVsbCBzdHJpbmcgc29ydCBidWcuXG4gICAgICAgICAgICAgICAgaWYgKGFhID09PSB1bmRlZmluZWQgfHwgYWEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYWEgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJiID09PSB1bmRlZmluZWQgfHwgYmIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYmIgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNvcnRTdGFibGUgJiYgYWEgPT09IGJiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFhID0gYS5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIGJiID0gYi5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLl9wb3NpdGlvbiAtIGIuX3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElGIGJvdGggdmFsdWVzIGFyZSBudW1lcmljLCBkbyBhIG51bWVyaWMgY29tcGFyaXNvblxuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyhhYSkgJiYgJC5pc051bWVyaWMoYmIpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgbnVtZXJpY2FsIHZhbHVlcyBmb3JtIHN0cmluZyB0byBmbG9hdC5cbiAgICAgICAgICAgICAgICAgICAgYWEgPSBwYXJzZUZsb2F0KGFhKTtcbiAgICAgICAgICAgICAgICAgICAgYmIgPSBwYXJzZUZsb2F0KGJiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFhIDwgYmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWEgPT09IGJiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIHZhbHVlIGlzIG5vdCBhIHN0cmluZywgY29udmVydCB0byBzdHJpbmdcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFhICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBhYSA9IGFhLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFhLmxvY2FsZUNvbXBhcmUoYmIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIgKiAtMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3J0Q2xhc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcyh0aGF0Lm9wdGlvbnMuc29ydENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhhdC4kaGVhZGVyLmZpbmQoc3ByaW50ZignW2RhdGEtZmllbGQ9XCIlc1wiXScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMuc29ydE5hbWUpLmluZGV4KCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kZWwuZmluZChzcHJpbnRmKCd0ciB0ZDpudGgtY2hpbGQoJXMpJywgaW5kZXgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKHRoYXQub3B0aW9ucy5zb3J0Q2xhc3MpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uU29ydCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgJHRoaXMgPSBldmVudC50eXBlID09PSBcImtleXByZXNzXCIgPyAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpIDogJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKSxcbiAgICAgICAgICAgICR0aGlzXyA9IHRoaXMuJGhlYWRlci5maW5kKCd0aCcpLmVxKCR0aGlzLmluZGV4KCkpO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlci5hZGQodGhpcy4kaGVhZGVyXykuZmluZCgnc3Bhbi5vcmRlcicpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydE5hbWUgPT09ICR0aGlzLmRhdGEoJ2ZpZWxkJykpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPSB0aGlzLm9wdGlvbnMuc29ydE9yZGVyID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnROYW1lID0gJHRoaXMuZGF0YSgnZmllbGQnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtZW1iZXJPcmRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPSAkdGhpcy5kYXRhKCdvcmRlcicpID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc29ydE9yZGVyID0gdGhpcy5jb2x1bW5zW3RoaXMuZmllbGRzQ29sdW1uc0luZGV4WyR0aGlzLmRhdGEoJ2ZpZWxkJyldXS5vcmRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3NvcnQnLCB0aGlzLm9wdGlvbnMuc29ydE5hbWUsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIpO1xuXG4gICAgICAgICR0aGlzLmFkZCgkdGhpc18pLmRhdGEoJ29yZGVyJywgdGhpcy5vcHRpb25zLnNvcnRPcmRlcik7XG5cbiAgICAgICAgLy8gQXNzaWduIHRoZSBjb3JyZWN0IHNvcnRhYmxlIGFycm93XG4gICAgICAgIHRoaXMuZ2V0Q2FyZXQoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgdGhpcy5pbml0U2VydmVyKHRoaXMub3B0aW9ucy5zaWxlbnRTb3J0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFRvb2xiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXSxcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IDAsXG4gICAgICAgICAgICAka2VlcE9wZW4sXG4gICAgICAgICAgICAkc2VhcmNoLFxuICAgICAgICAgICAgc3dpdGNoYWJsZUNvdW50ID0gMDtcblxuICAgICAgICBpZiAodGhpcy4kdG9vbGJhci5maW5kKCcuYnMtYmFycycpLmNoaWxkcmVuKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKCQodGhpcy5vcHRpb25zLnRvb2xiYXIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiR0b29sYmFyLmh0bWwoJycpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnRvb2xiYXIgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0aGlzLm9wdGlvbnMudG9vbGJhciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICQoc3ByaW50ZignPGRpdiBjbGFzcz1cImJzLWJhcnMgJXMtJXNcIj48L2Rpdj4nLCBicy5wdWxsQ2xhc3MsIHRoaXMub3B0aW9ucy50b29sYmFyQWxpZ24pKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLiR0b29sYmFyKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJCh0aGlzLm9wdGlvbnMudG9vbGJhcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvd0NvbHVtbnMsIHNob3dUb2dnbGUsIHNob3dSZWZyZXNoXG4gICAgICAgIGh0bWwgPSBbc3ByaW50ZignPGRpdiBjbGFzcz1cImNvbHVtbnMgY29sdW1ucy0lcyBidG4tZ3JvdXAgJXMtJXNcIj4nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmJ1dHRvbnNBbGlnbiwgYnMucHVsbENsYXNzLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0FsaWduKV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuaWNvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaWNvbnMgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLCB0aGlzLm9wdGlvbnMuaWNvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UGFnaW5hdGlvblN3aXRjaCkge1xuICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4nICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5idXR0b25zQ2xhc3MpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJwYWdpbmF0aW9uU3dpdGNoXCIgYXJpYS1sYWJlbD1cInBhZ2luYXRpb24gU3dpdGNoXCIgdGl0bGU9XCIlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRQYWdpbmF0aW9uU3dpdGNoKCkpLFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMucGFnaW5hdGlvblN3aXRjaERvd24pLFxuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuJHRvb2xiYXIuZmluZCgnYnV0dG9uW25hbWU9XCJmdWxsc2NyZWVuXCJdJylcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy50b2dnbGVGdWxsc2NyZWVuLCB0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dSZWZyZXNoKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goc3ByaW50ZignPGJ1dHRvbiBjbGFzcz1cImJ0bicgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArXG4gICAgICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInJlZnJlc2hcIiBhcmlhLWxhYmVsPVwicmVmcmVzaFwiIHRpdGxlPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0UmVmcmVzaCgpKSxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPicsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLnJlZnJlc2gpLFxuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1RvZ2dsZSkge1xuICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4nICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5idXR0b25zQ2xhc3MpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJ0b2dnbGVcIiBhcmlhLWxhYmVsPVwidG9nZ2xlXCIgdGl0bGU9XCIlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRUb2dnbGUoKSksXG4gICAgICAgICAgICAgICAgc3ByaW50ZignPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy50b2dnbGVPZmYpLFxuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8YnV0dG9uIGNsYXNzPVwiYnRuJyArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIHR5cGU9XCJidXR0b25cIiBuYW1lPVwiZnVsbHNjcmVlblwiIGFyaWEtbGFiZWw9XCJmdWxsc2NyZWVuXCIgdGl0bGU9XCIlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRGdWxsc2NyZWVuKCkpLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPicsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLmZ1bGxzY3JlZW4pLFxuICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goc3ByaW50ZignPGRpdiBjbGFzcz1cImtlZXAtb3BlbiBidG4tZ3JvdXBcIiB0aXRsZT1cIiVzXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvcm1hdENvbHVtbnMoKSksXG4gICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJjb2x1bW5zXCIgY2xhc3M9XCJidG4nICtcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgK1xuICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICtcbiAgICAgICAgICAgICAgICAnIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj4nLFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMuY29sdW1ucyksXG4gICAgICAgICAgICAgICAgJyA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPicsXG4gICAgICAgICAgICAgICAgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgYnMudG9vYmFyRHJvcGRvd0h0bWxbMF0pO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5jb2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5yYWRpbyB8fCBjb2x1bW4uY2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgIWNvbHVtbi5jYXJkVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBjb2x1bW4udmlzaWJsZSA/ICcgY2hlY2tlZD1cImNoZWNrZWRcIicgOiAnJztcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uc3dpdGNoYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goc3ByaW50Zihicy50b29iYXJEcm9wZG93SXRlbUh0bWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1maWVsZD1cIiVzXCIgdmFsdWU9XCIlc1wiJXM+ICVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5maWVsZCwgaSwgY2hlY2tlZCwgY29sdW1uLnRpdGxlKSkpO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hhYmxlQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGh0bWwucHVzaChicy50b29iYXJEcm9wZG93SHRtbFsxXSwgJzwvZGl2PicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcblxuICAgICAgICAvLyBGaXggIzE4ODogdGhpcy5zaG93VG9vbGJhciBpcyBmb3IgZXh0ZW5zaW9uc1xuICAgICAgICBpZiAodGhpcy5zaG93VG9vbGJhciB8fCBodG1sLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvb2xiYXIuYXBwZW5kKGh0bWwuam9pbignJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UGFnaW5hdGlvblN3aXRjaCkge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIl0nKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLnRvZ2dsZVBhZ2luYXRpb24sIHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1JlZnJlc2gpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvb2xiYXIuZmluZCgnYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy5yZWZyZXNoLCB0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dUb2dnbGUpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvb2xiYXIuZmluZCgnYnV0dG9uW25hbWU9XCJ0b2dnbGVcIl0nKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvbHVtbnMpIHtcbiAgICAgICAgICAgICRrZWVwT3BlbiA9IHRoaXMuJHRvb2xiYXIuZmluZCgnLmtlZXAtb3BlbicpO1xuXG4gICAgICAgICAgICBpZiAoc3dpdGNoYWJsZUNvdW50IDw9IHRoaXMub3B0aW9ucy5taW5pbXVtQ291bnRDb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgJGtlZXBPcGVuLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGtlZXBPcGVuLmZpbmQoJ2xpJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAka2VlcE9wZW4uZmluZCgnaW5wdXQnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZUNvbHVtbigkKHRoaXMpLnZhbCgpLCAkdGhpcy5wcm9wKCdjaGVja2VkJyksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2NvbHVtbi1zd2l0Y2gnLCAkKHRoaXMpLmRhdGEoJ2ZpZWxkJyksICR0aGlzLnByb3AoJ2NoZWNrZWQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VhcmNoKSB7XG4gICAgICAgICAgICBodG1sID0gW107XG4gICAgICAgICAgICBodG1sLnB1c2goXG4gICAgICAgICAgICAgICAgc3ByaW50ZignPGRpdiBjbGFzcz1cIiVzLSVzIHNlYXJjaFwiPicsIGJzLnB1bGxDbGFzcywgdGhpcy5vcHRpb25zLnNlYXJjaEFsaWduKSxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2wnICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGlucHV0LSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArXG4gICAgICAgICAgICAgICAgICAgICdcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0U2VhcmNoKCkpLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5hcHBlbmQoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgICAgICAkc2VhcmNoID0gdGhpcy4kdG9vbGJhci5maW5kKCcuc2VhcmNoIGlucHV0Jyk7XG4gICAgICAgICAgICAkc2VhcmNoLm9mZigna2V5dXAgZHJvcCBibHVyJykub24oJ2tleXVwIGRyb3AgYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VhcmNoT25FbnRlcktleSAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBbMzcsIDM4LCAzOSwgNDBdKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTsgLy8gZG9lc24ndCBtYXR0ZXIgaWYgaXQncyAwXG4gICAgICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub25TZWFyY2goZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0sIHRoYXQub3B0aW9ucy5zZWFyY2hUaW1lT3V0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaXNJRUJyb3dzZXIoKSkge1xuICAgICAgICAgICAgICAgICRzZWFyY2gub2ZmKCdtb3VzZXVwJykub24oJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7IC8vIGRvZXNuJ3QgbWF0dGVyIGlmIGl0J3MgMFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub25TZWFyY2goZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uU2VhcmNoID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciB0ZXh0ID0gJC50cmltKCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkpO1xuXG4gICAgICAgIC8vIHRyaW0gc2VhcmNoIGlucHV0XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudHJpbU9uU2VhcmNoICYmICQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkgIT09IHRleHQpIHtcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQgPT09IHRoaXMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0ID0gdGV4dDtcblxuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICBpZiAoZXZlbnQuZmlyZWRCeUluaXRTZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnY2xpZW50Jykge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzZWFyY2gnLCB0ZXh0KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uICE9PSAnc2VydmVyJykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21TZWFyY2ggIT09ICQubm9vcCkge1xuICAgICAgICAgICAgICAgIHdpbmRvd1t0aGlzLm9wdGlvbnMuY3VzdG9tU2VhcmNoXS5hcHBseSh0aGlzLCBbdGhpcy5zZWFyY2hUZXh0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuc2VhcmNoVGV4dCAmJiAodGhpcy5vcHRpb25zLmVzY2FwZSA/XG4gICAgICAgICAgICAgICAgZXNjYXBlSFRNTCh0aGlzLnNlYXJjaFRleHQpIDogdGhpcy5zZWFyY2hUZXh0KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIGYgPSAkLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zKSA/IG51bGwgOiB0aGlzLmZpbHRlckNvbHVtbnM7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZiA/ICQuZ3JlcCh0aGlzLm9wdGlvbnMuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KGZba2V5XSkgJiYgJC5pbkFycmF5KGl0ZW1ba2V5XSwgZltrZXldKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhJC5pc0FycmF5KGZba2V5XSkgJiYgaXRlbVtrZXldICE9PSBmW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pIDogdGhpcy5vcHRpb25zLmRhdGE7XG5cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHMgPyAkLmdyZXAodGhpcy5kYXRhLCBmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhhdC5oZWFkZXIuZmllbGRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmhlYWRlci5zZWFyY2hhYmxlc1tqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gJC5pc051bWVyaWModGhhdC5oZWFkZXIuZmllbGRzW2pdKSA/IHBhcnNlSW50KHRoYXQuaGVhZGVyLmZpZWxkc1tqXSwgMTApIDogdGhhdC5oZWFkZXIuZmllbGRzW2pdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sdW1uID0gdGhhdC5jb2x1bW5zW3RoYXQuZmllbGRzQ29sdW1uc0luZGV4W2tleV1dO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BfaW5kZXggPSAwOyBwcm9wX2luZGV4IDwgcHJvcHMubGVuZ3RoOyBwcm9wX2luZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVbcHJvcHNbcHJvcF9pbmRleF1dICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtwcm9wc1twcm9wX2luZGV4XV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggIzE0MjogcmVzcGVjdCBzZWFyY2hGb3JhbXR0ZXIgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbiAmJiBjb2x1bW4uc2VhcmNoRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZShjb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFt2YWx1ZSwgaXRlbSwgaV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zdHJpY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkgPT09IHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pIDogdGhpcy5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0UGFnaW5hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXSxcbiAgICAgICAgICAgICRhbGxTZWxlY3RlZCA9IGZhbHNlLFxuICAgICAgICAgICAgaSwgZnJvbSwgdG8sXG4gICAgICAgICAgICAkcGFnZUxpc3QsXG4gICAgICAgICAgICAkcHJlLFxuICAgICAgICAgICAgJG5leHQsXG4gICAgICAgICAgICAkbnVtYmVyLFxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpLFxuICAgICAgICAgICAgcGFnZUxpc3QgPSB0aGlzLm9wdGlvbnMucGFnZUxpc3Q7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiAhPT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFJvd3MgPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG90YWxQYWdlcyA9IDA7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudG90YWxSb3dzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLnRvdGFsUm93cztcbiAgICAgICAgICAgICAgICAkYWxsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgICAgICAvLyBGaXggIzY2NyBUYWJsZSB3aXRoIHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgcGFnZXMgYW5kIGEgc2VhcmNoIHRoYXQgbWF0Y2hlcyB0byBvbmUgcGFnZSB0aHJvd3MgZXhjZXB0aW9uXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VMc3QgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBhZ2VMaXN0ID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTGlzdC5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csICcnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJykgOiB0aGlzLm9wdGlvbnMucGFnZUxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpLnRvTG93ZXJDYXNlKCksIHBhZ2VMc3QpICA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICRhbGxTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPSB+figodGhpcy5vcHRpb25zLnRvdGFsUm93cyAtIDEpIC8gdGhpcy5vcHRpb25zLnBhZ2VTaXplKSArIDE7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPiAwICYmIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID4gdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFnZUZyb20gPSAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSArIDE7XG4gICAgICAgIHRoaXMucGFnZVRvID0gdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgKiB0aGlzLm9wdGlvbnMucGFnZVNpemU7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VUbyA+IHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZVRvID0gdGhpcy5vcHRpb25zLnRvdGFsUm93cztcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwucHVzaChcbiAgICAgICAgICAgIHNwcmludGYoJzxkaXYgY2xhc3M9XCIlcy0lcyBwYWdpbmF0aW9uLWRldGFpbFwiPicsIGJzLnB1bGxDbGFzcywgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25EZXRhaWxIQWxpZ24pLFxuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbi1pbmZvXCI+JyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbmx5SW5mb1BhZ2luYXRpb24gPyB0aGlzLm9wdGlvbnMuZm9ybWF0RGV0YWlsUGFnaW5hdGlvbih0aGlzLm9wdGlvbnMudG90YWxSb3dzKSA6XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0U2hvd2luZ1Jvd3ModGhpcy5wYWdlRnJvbSwgdGhpcy5wYWdlVG8sIHRoaXMub3B0aW9ucy50b3RhbFJvd3MpLFxuICAgICAgICAgICAgJzwvc3Bhbj4nKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5SW5mb1BhZ2luYXRpb24pIHtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHNwYW4gY2xhc3M9XCJwYWdlLWxpc3RcIj4nKTtcblxuICAgICAgICAgICAgdmFyIHBhZ2VOdW1iZXIgPSBbXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJzxzcGFuIGNsYXNzPVwiYnRuLWdyb3VwICVzXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAndG9wJyB8fCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvblZBbGlnbiA9PT0gJ2JvdGgnID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZHJvcGRvd24nIDogJ2Ryb3B1cCcpLFxuICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4nICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5idXR0b25zQ2xhc3MpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgK1xuICAgICAgICAgICAgICAgICAgICAnIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJwYWdlLXNpemVcIj4nLFxuICAgICAgICAgICAgICAgICAgICAkYWxsU2VsZWN0ZWQgPyB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplLFxuICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicsXG4gICAgICAgICAgICAgICAgICAgICcgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICAgICAgYnMucGFnZURyb3Bkb3duSHRtbFswXVxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBhZ2VMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5vcHRpb25zLnBhZ2VMaXN0LnJlcGxhY2UoJ1snLCAnJykucmVwbGFjZSgnXScsICcnKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvIC9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIHBhZ2VMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgJC5lYWNoKGxpc3QsIGZ1bmN0aW9uIChpLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlTGlzdC5wdXNoKCh2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSB0aGF0Lm9wdGlvbnMuZm9ybWF0QWxsUm93cygpLnRvVXBwZXJDYXNlKCkgfHwgdmFsdWUudG9VcHBlckNhc2UoKSA9PT0gXCJVTkxJTUlURURcIikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA6ICt2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZWFjaChwYWdlTGlzdCwgZnVuY3Rpb24gKGksIHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoYXQub3B0aW9ucy5zbWFydERpc3BsYXkgfHwgaSA9PT0gMCB8fCBwYWdlTGlzdFtpIC0gMV0gPCB0aGF0Lm9wdGlvbnMudG90YWxSb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IHBhZ2UgPT09IHRoYXQub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgPyAnYWN0aXZlJyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gcGFnZSA9PT0gdGhhdC5vcHRpb25zLnBhZ2VTaXplID8gJ2FjdGl2ZScgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyLnB1c2goc3ByaW50Zihicy5wYWdlRHJvcGRvd25JdGVtSHRtbCwgYWN0aXZlLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwYWdlTnVtYmVyLnB1c2goYnMucGFnZURyb3Bkb3duSHRtbFsxXSArICc8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCh0aGlzLm9wdGlvbnMuZm9ybWF0UmVjb3Jkc1BlclBhZ2UocGFnZU51bWJlci5qb2luKCcnKSkpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8ZGl2IGNsYXNzPVwiJXMtJXMgcGFnaW5hdGlvblwiPicsIGJzLnB1bGxDbGFzcywgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25IQWxpZ24pLFxuICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJwYWdpbmF0aW9uJyArIHNwcmludGYoJyBwYWdpbmF0aW9uLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArICdcIj4nLFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLXByZVwiPjxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4lczwvYT48L2xpPicsXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25QcmVUZXh0KSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPCA1KSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IDE7XG4gICAgICAgICAgICAgICAgdG8gPSB0aGlzLnRvdGFsUGFnZXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZyb20gPSB0aGlzLm9wdGlvbnMucGFnZU51bWJlciAtIDI7XG4gICAgICAgICAgICAgICAgdG8gPSBmcm9tICsgNDtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvID4gdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICAgICAgICBmcm9tID0gdG8gLSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID49IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignPGxpIGNsYXNzPVwicGFnZS1pdGVtIHBhZ2UtZmlyc3Qlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAxID09PSB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA/ICcgYWN0aXZlJyA6ICcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+JywgMSwgJzwvYT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnJvbSsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9PSA0IHx8IHRoaXMudG90YWxQYWdlcyA9PSA2IHx8IHRoaXMudG90YWxQYWdlcyA9PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tLS07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLWZpcnN0LXNlcGFyYXRvciBkaXNhYmxlZFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4uLi48L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9saT4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRvLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID49IDcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPj0gKHRoaXMudG90YWxQYWdlcyAtIDIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPT0gNikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSAodGhpcy50b3RhbFBhZ2VzIC0gMikpIHtcbiAgICAgICAgICAgICAgICAgICAgdG8rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA3KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA9PSA3IHx8IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID49ICh0aGlzLnRvdGFsUGFnZXMgLSAzKSkge1xuICAgICAgICAgICAgICAgICAgICB0bysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gZnJvbTsgaSA8PSB0bzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSVzXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgaSA9PT0gdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPyAnIGFjdGl2ZScgOiAnJyksXG4gICAgICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+JywgaSwgJzwvYT4nLFxuICAgICAgICAgICAgICAgICAgICAnPC9saT4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyIDw9ICh0aGlzLnRvdGFsUGFnZXMgLSA0KSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLWxhc3Qtc2VwYXJhdG9yIGRpc2FibGVkXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+Li4uPC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9saT4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPj0gNikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA8PSAodGhpcy50b3RhbFBhZ2VzIC0gMykpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLWxhc3Qlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPT09IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID8gJyBhY3RpdmUnIDogJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4nLCB0aGlzLnRvdGFsUGFnZXMsICc8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2xpPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbC5wdXNoKFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxsaSBjbGFzcz1cInBhZ2UtaXRlbSBwYWdlLW5leHRcIj48YSBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWY9XCIjXCI+JXM8L2E+PC9saT4nLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uTmV4dFRleHQpLFxuICAgICAgICAgICAgICAgICc8L3VsPicsXG4gICAgICAgICAgICAgICAgJzwvZGl2PicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHBhZ2luYXRpb24uaHRtbChodG1sLmpvaW4oJycpKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5vbmx5SW5mb1BhZ2luYXRpb24pIHtcbiAgICAgICAgICAgICRwYWdlTGlzdCA9IHRoaXMuJHBhZ2luYXRpb24uZmluZCgnLnBhZ2UtbGlzdCBhJyk7XG4gICAgICAgICAgICAkcHJlID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1wcmUnKTtcbiAgICAgICAgICAgICRuZXh0ID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1uZXh0Jyk7XG4gICAgICAgICAgICAkbnVtYmVyID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1pdGVtJykubm90KCcucGFnZS1uZXh0LCAucGFnZS1wcmUnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5maW5kKCdkaXYucGFnaW5hdGlvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VMaXN0Lmxlbmd0aCA8IDIgfHwgdGhpcy5vcHRpb25zLnRvdGFsUm93cyA8PSBwYWdlTGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLmZpbmQoJ3NwYW4ucGFnZS1saXN0JykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gZGF0YSBpcyBlbXB0eSwgaGlkZSB0aGUgcGFnaW5hdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuJHBhZ2luYXRpb25bdGhpcy5nZXREYXRhKCkubGVuZ3RoID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmF0aW9uTG9vcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcHJlLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT09IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAkbmV4dC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZVNpemUgPSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVtb3ZlZCB0aGUgZXZlbnRzIGZvciBsYXN0IGFuZCBmaXJzdCwgb25QYWdlTnVtYmVyIGV4ZWN1dGVkcyB0aGUgc2FtZSBsb2dpY1xuICAgICAgICAgICAgJHBhZ2VMaXN0Lm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTGlzdENoYW5nZSwgdGhpcykpO1xuICAgICAgICAgICAgJHByZS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLm9uUGFnZVByZSwgdGhpcykpO1xuICAgICAgICAgICAgJG5leHQub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy5vblBhZ2VOZXh0LCB0aGlzKSk7XG4gICAgICAgICAgICAkbnVtYmVyLm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTnVtYmVyLCB0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZVBhZ2luYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gRml4ICMxNzE6IElFIGRpc2FibGVkIGJ1dHRvbiBjYW4gYmUgY2xpY2tlZCBidWcuXG4gICAgICAgIGlmIChldmVudCAmJiAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5tYWludGFpblNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0Um93cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgdGhpcy5pbml0U2VydmVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3BhZ2UtY2hhbmdlJywgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIsIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5vblBhZ2VMaXN0Q2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgJHRoaXMucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZVNpemUgPSAkdGhpcy50ZXh0KCkudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKS50b1VwcGVyQ2FzZSgpID9cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgOiArJHRoaXMudGV4dCgpO1xuICAgICAgICB0aGlzLiR0b29sYmFyLmZpbmQoJy5wYWdlLXNpemUnKS50ZXh0KHRoaXMub3B0aW9ucy5wYWdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUub25QYWdlUHJlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICgodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAxKSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSB0aGlzLm9wdGlvbnMudG90YWxQYWdlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyLS07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUub25QYWdlTmV4dCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyICsgMSkgPiB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5vblBhZ2VOdW1iZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID09PSArJChldmVudC5jdXJyZW50VGFyZ2V0KS50ZXh0KCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9ICskKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRleHQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFJvdyA9IGZ1bmN0aW9uKGl0ZW0sIGksIGRhdGEsIHBhcmVudERvbSkge1xuICAgICAgICB2YXIgdGhhdD10aGlzLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgaHRtbCA9IFtdLFxuICAgICAgICAgICAgc3R5bGUgPSB7fSxcbiAgICAgICAgICAgIGNzc2VzID0gW10sXG4gICAgICAgICAgICBkYXRhXyA9ICcnLFxuICAgICAgICAgICAgYXR0cmlidXRlcyA9IHt9LFxuICAgICAgICAgICAgaHRtbEF0dHJpYnV0ZXMgPSBbXTtcblxuICAgICAgICBpZiAoJC5pbkFycmF5KGl0ZW0sIHRoaXMuaGlkZGVuUm93cykgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3R5bGUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5yb3dTdHlsZSwgW2l0ZW0sIGldLCBzdHlsZSk7XG5cbiAgICAgICAgaWYgKHN0eWxlICYmIHN0eWxlLmNzcykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICAgICAgY3NzZXMucHVzaChrZXkgKyAnOiAnICsgc3R5bGUuY3NzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXR0cmlidXRlcyA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5yb3dBdHRyaWJ1dGVzLCBbaXRlbSwgaV0sIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgaHRtbEF0dHJpYnV0ZXMucHVzaChzcHJpbnRmKCclcz1cIiVzXCInLCBrZXksIGVzY2FwZUhUTUwoYXR0cmlidXRlc1trZXldKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uX2RhdGEgJiYgISQuaXNFbXB0eU9iamVjdChpdGVtLl9kYXRhKSkge1xuICAgICAgICAgICAgJC5lYWNoKGl0ZW0uX2RhdGEsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZGF0YS1pbmRleFxuICAgICAgICAgICAgICAgIGlmIChrID09PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YV8gKz0gc3ByaW50ZignIGRhdGEtJXM9XCIlc1wiJywgaywgdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwucHVzaCgnPHRyJyxcbiAgICAgICAgICAgIHNwcmludGYoJyAlcycsIGh0bWxBdHRyaWJ1dGVzLmpvaW4oJyAnKSksXG4gICAgICAgICAgICBzcHJpbnRmKCcgaWQ9XCIlc1wiJywgJC5pc0FycmF5KGl0ZW0pID8gdW5kZWZpbmVkIDogaXRlbS5faWQpLFxuICAgICAgICAgICAgc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIHN0eWxlLmNsYXNzZXMgfHwgKCQuaXNBcnJheShpdGVtKSA/IHVuZGVmaW5lZCA6IGl0ZW0uX2NsYXNzKSksXG4gICAgICAgICAgICBzcHJpbnRmKCcgZGF0YS1pbmRleD1cIiVzXCInLCBpKSxcbiAgICAgICAgICAgIHNwcmludGYoJyBkYXRhLXVuaXF1ZWlkPVwiJXNcIicsIGl0ZW1bdGhpcy5vcHRpb25zLnVuaXF1ZUlkXSksXG4gICAgICAgICAgICBzcHJpbnRmKCclcycsIGRhdGFfKSxcbiAgICAgICAgICAgICc+J1xuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FyZFZpZXcpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8dGQgY29sc3Bhbj1cIiVzXCI+PGRpdiBjbGFzcz1cImNhcmQtdmlld3NcIj4nLCB0aGlzLmhlYWRlci5maWVsZHMubGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5jYXJkVmlldyAmJiB0aGlzLm9wdGlvbnMuZGV0YWlsVmlldykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGQ+Jyk7XG5cbiAgICAgICAgICAgIGlmIChjYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLCB0aGlzLm9wdGlvbnMuZGV0YWlsRmlsdGVyLCBbaSwgaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8YSBjbGFzcz1cImRldGFpbC1pY29uXCIgaHJlZj1cIiNcIj4nLFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMuZGV0YWlsT3BlbiksXG4gICAgICAgICAgICAgICAgJzwvYT4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L3RkPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaGVhZGVyLmZpZWxkcywgZnVuY3Rpb24oaiwgZmllbGQpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWVfID0gZ2V0SXRlbUZpZWxkKGl0ZW0sIGZpZWxkLCB0aGF0Lm9wdGlvbnMuZXNjYXBlKSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnLFxuICAgICAgICAgICAgICAgIHR5cGUgPSAnJyxcbiAgICAgICAgICAgICAgICBjZWxsU3R5bGUgPSB7fSxcbiAgICAgICAgICAgICAgICBpZF8gPSAnJyxcbiAgICAgICAgICAgICAgICBjbGFzc18gPSB0aGF0LmhlYWRlci5jbGFzc2VzW2pdLFxuICAgICAgICAgICAgICAgIGRhdGFfID0gJycsXG4gICAgICAgICAgICAgICAgcm93c3Bhbl8gPSAnJyxcbiAgICAgICAgICAgICAgICBjb2xzcGFuXyA9ICcnLFxuICAgICAgICAgICAgICAgIHRpdGxlXyA9ICcnLFxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IHRoYXQuY29sdW1uc1tqXTtcblxuICAgICAgICAgICAgaWYgKHRoYXQuZnJvbUh0bWwgJiYgdHlwZW9mIHZhbHVlXyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpZigoIWNvbHVtbi5jaGVja2JveCkgJiYgKCFjb2x1bW4ucmFkaW8pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgKCFjb2x1bW4uY2FyZFZpc2libGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uLmVzY2FwZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlXyA9IGVzY2FwZUhUTUwodmFsdWVfKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3R5bGUgPSBzcHJpbnRmKCdzdHlsZT1cIiVzXCInLCBjc3Nlcy5jb25jYXQodGhhdC5oZWFkZXIuc3R5bGVzW2pdKS5qb2luKCc7ICcpKTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIHRkJ3MgaWQgYW5kIGNsYXNzXG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfaWQnXSkge1xuICAgICAgICAgICAgICAgIGlkXyA9IHNwcmludGYoJyBpZD1cIiVzXCInLCBpdGVtWydfJyArIGZpZWxkICsgJ19pZCddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtWydfJyArIGZpZWxkICsgJ19jbGFzcyddKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NfID0gc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGl0ZW1bJ18nICsgZmllbGQgKyAnX2NsYXNzJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW1bJ18nICsgZmllbGQgKyAnX3Jvd3NwYW4nXSkge1xuICAgICAgICAgICAgICAgIHJvd3NwYW5fID0gc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJywgaXRlbVsnXycgKyBmaWVsZCArICdfcm93c3BhbiddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtWydfJyArIGZpZWxkICsgJ19jb2xzcGFuJ10pIHtcbiAgICAgICAgICAgICAgICBjb2xzcGFuXyA9IHNwcmludGYoJyBjb2xzcGFuPVwiJXNcIicsIGl0ZW1bJ18nICsgZmllbGQgKyAnX2NvbHNwYW4nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfdGl0bGUnXSkge1xuICAgICAgICAgICAgICAgIHRpdGxlXyA9IHNwcmludGYoJyB0aXRsZT1cIiVzXCInLCBpdGVtWydfJyArIGZpZWxkICsgJ190aXRsZSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNlbGxTdHlsZSA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoYXQuaGVhZGVyLFxuICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNlbGxTdHlsZXNbal0sIFt2YWx1ZV8sIGl0ZW0sIGksIGZpZWxkXSwgY2VsbFN0eWxlKTtcbiAgICAgICAgICAgIGlmIChjZWxsU3R5bGUuY2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIGNsYXNzXyA9IHNwcmludGYoJyBjbGFzcz1cIiVzXCInLCBjZWxsU3R5bGUuY2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbFN0eWxlLmNzcykge1xuICAgICAgICAgICAgICAgIHZhciBjc3Nlc18gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2VsbFN0eWxlLmNzcykge1xuICAgICAgICAgICAgICAgICAgICBjc3Nlc18ucHVzaChrZXkgKyAnOiAnICsgY2VsbFN0eWxlLmNzc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3R5bGUgPSBzcHJpbnRmKCdzdHlsZT1cIiVzXCInLCBjc3Nlc18uY29uY2F0KHRoYXQuaGVhZGVyLnN0eWxlc1tqXSkuam9pbignOyAnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUoY29sdW1uLFxuICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFt2YWx1ZV8sIGl0ZW0sIGksIGZpZWxkXSwgdmFsdWVfKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1bJ18nICsgZmllbGQgKyAnX2RhdGEnXSAmJiAhJC5pc0VtcHR5T2JqZWN0KGl0ZW1bJ18nICsgZmllbGQgKyAnX2RhdGEnXSkpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2goaXRlbVsnXycgKyBmaWVsZCArICdfZGF0YSddLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBkYXRhLWluZGV4XG4gICAgICAgICAgICAgICAgICAgIGlmIChrID09PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YV8gKz0gc3ByaW50ZignIGRhdGEtJXM9XCIlc1wiJywgaywgdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW4uY2hlY2tib3ggfHwgY29sdW1uLnJhZGlvKSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IGNvbHVtbi5jaGVja2JveCA/ICdjaGVja2JveCcgOiB0eXBlO1xuICAgICAgICAgICAgICAgIHR5cGUgPSBjb2x1bW4ucmFkaW8gPyAncmFkaW8nIDogdHlwZTtcblxuICAgICAgICAgICAgICAgIHRleHQgPSBbc3ByaW50Zih0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXJkLXZpZXcgJXNcIj4nIDogJzx0ZCBjbGFzcz1cImJzLWNoZWNrYm94ICVzXCI+JywgY29sdW1uWydjbGFzcyddIHx8ICcnKSxcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCcgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgZGF0YS1pbmRleD1cIiVzXCInLCBpKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBuYW1lPVwiJXNcIicsIHRoYXQub3B0aW9ucy5zZWxlY3RJdGVtTmFtZSkgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgdHlwZT1cIiVzXCInLCB0eXBlKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyB2YWx1ZT1cIiVzXCInLCBpdGVtW3RoYXQub3B0aW9ucy5pZEZpZWxkXSkgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgY2hlY2tlZD1cIiVzXCInLCB2YWx1ZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlXyB8fCB2YWx1ZSAmJiB2YWx1ZS5jaGVja2VkKSA/ICdjaGVja2VkJyA6IHVuZGVmaW5lZCkgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgZGlzYWJsZWQ9XCIlc1wiJywgIWNvbHVtbi5jaGVja2JveEVuYWJsZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICh2YWx1ZSAmJiB2YWx1ZS5kaXNhYmxlZCkgPyAnZGlzYWJsZWQnIDogdW5kZWZpbmVkKSArXG4gICAgICAgICAgICAgICAgICAgICcgLz4nLFxuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5mb3JtYXR0ZXJzW2pdICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgPyAnPC9kaXY+JyA6ICc8L3RkPidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgaXRlbVt0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9IHZhbHVlID09PSB0cnVlIHx8ICghIXZhbHVlXyB8fCB2YWx1ZSAmJiB2YWx1ZS5jaGVja2VkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSBudWxsID9cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLnVuZGVmaW5lZFRleHQgOiB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIHRleHQgPSB0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgPyBbJzxkaXYgY2xhc3M9XCJjYXJkLXZpZXdcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMuc2hvd0hlYWRlciA/IHNwcmludGYoJzxzcGFuIGNsYXNzPVwidGl0bGVcIiAlcz4lczwvc3Bhbj4nLCBzdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb3BlcnR5RnJvbU90aGVyKHRoYXQuY29sdW1ucywgJ2ZpZWxkJywgJ3RpdGxlJywgZmllbGQpKSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8c3BhbiBjbGFzcz1cInZhbHVlXCI+JXM8L3NwYW4+JywgdmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJykgOiBbc3ByaW50ZignPHRkJXMgJXMgJXMgJXMgJXMgJXMgJXM+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkXywgY2xhc3NfLCBzdHlsZSwgZGF0YV8sIHJvd3NwYW5fLCBjb2xzcGFuXywgdGl0bGVfKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICc8L3RkPidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBlbXB0eSBkYXRhIG9uIENhcmQgdmlldyB3aGVuIHNtYXJ0RGlzcGxheSBpcyBzZXQgdG8gdHJ1ZS5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmNhcmRWaWV3ICYmIHRoYXQub3B0aW9ucy5zbWFydERpc3BsYXkgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCBzZXQgYSBwbGFjZWhvbGRlciBmb3IgZXZlbnQgYmluZGluZyBjb3JyZWN0IGZpZWxkSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICc8ZGl2IGNsYXNzPVwiY2FyZC12aWV3XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCh0ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj48L3RkPicpO1xuICAgICAgICB9XG4gICAgICAgIGh0bWwucHVzaCgnPC90cj4nKTtcblxuICAgICAgICByZXR1cm4gaHRtbC5qb2luKCcgJyk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0Qm9keSA9IGZ1bmN0aW9uIChmaXhlZFNjcm9sbCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW10sXG4gICAgICAgICAgICBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdwcmUtYm9keScsIGRhdGEpO1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSB0aGlzLiRlbC5maW5kKCc+dGJvZHknKTtcbiAgICAgICAgaWYgKCF0aGlzLiRib2R5Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy4kYm9keSA9ICQoJzx0Ym9keT48L3Rib2R5PicpLmFwcGVuZFRvKHRoaXMuJGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRml4ICMzODkgQm9vdHN0cmFwLXRhYmxlLWZsYXRKU09OIGlzIG5vdCB3b3JraW5nXG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbiB8fCB0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VGcm9tID0gMTtcbiAgICAgICAgICAgIHRoaXMucGFnZVRvID0gZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHJGcmFnbWVudHMgPSAkKGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgICAgIHZhciBoYXNUcjtcblxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5wYWdlRnJvbSAtIDE7IGkgPCB0aGlzLnBhZ2VUbzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGFbaV07XG4gICAgICAgICAgICB2YXIgdHIgPSB0aGlzLmluaXRSb3coaXRlbSwgaSwgZGF0YSwgdHJGcmFnbWVudHMpO1xuICAgICAgICAgICAgaGFzVHIgPSBoYXNUciB8fCAhIXRyO1xuICAgICAgICAgICAgaWYgKHRyJiZ0ciE9PXRydWUpIHtcbiAgICAgICAgICAgICAgICB0ckZyYWdtZW50cy5hcHBlbmQodHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvdyBubyByZWNvcmRzXG4gICAgICAgIGlmICghaGFzVHIpIHtcbiAgICAgICAgICAgIHRyRnJhZ21lbnRzLmFwcGVuZCgnPHRyIGNsYXNzPVwibm8tcmVjb3Jkcy1mb3VuZFwiPicgK1xuICAgICAgICAgICAgICAgIHNwcmludGYoJzx0ZCBjb2xzcGFuPVwiJXNcIj4lczwvdGQ+JyxcbiAgICAgICAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndGgnKS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvcm1hdE5vTWF0Y2hlcygpKSArXG4gICAgICAgICAgICAgICAgJzwvdHI+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRib2R5Lmh0bWwodHJGcmFnbWVudHMpO1xuXG4gICAgICAgIGlmICghZml4ZWRTY3JvbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGljayB0byBzZWxlY3QgYnkgY29sdW1uXG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPiB0cltkYXRhLWluZGV4XSA+IHRkJykub2ZmKCdjbGljayBkYmxjbGljaycpLm9uKCdjbGljayBkYmxjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgJHRkID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkdHIgPSAkdGQucGFyZW50KCksXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoYXQuZGF0YVskdHIuZGF0YSgnaW5kZXgnKV0sXG4gICAgICAgICAgICAgICAgaW5kZXggPSAkdGRbMF0uY2VsbEluZGV4LFxuICAgICAgICAgICAgICAgIGZpZWxkcyA9IHRoYXQuZ2V0VmlzaWJsZUZpZWxkcygpLFxuICAgICAgICAgICAgICAgIGZpZWxkID0gZmllbGRzW3RoYXQub3B0aW9ucy5kZXRhaWxWaWV3ICYmICF0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgPyBpbmRleCAtIDEgOiBpbmRleF0sXG4gICAgICAgICAgICAgICAgY29sdW1uID0gdGhhdC5jb2x1bW5zW3RoYXQuZmllbGRzQ29sdW1uc0luZGV4W2ZpZWxkXV0sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRJdGVtRmllbGQoaXRlbSwgZmllbGQsIHRoYXQub3B0aW9ucy5lc2NhcGUpO1xuXG4gICAgICAgICAgICBpZiAoJHRkLmZpbmQoJy5kZXRhaWwtaWNvbicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC50cmlnZ2VyKGUudHlwZSA9PT0gJ2NsaWNrJyA/ICdjbGljay1jZWxsJyA6ICdkYmwtY2xpY2stY2VsbCcsIGZpZWxkLCB2YWx1ZSwgaXRlbSwgJHRkKTtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcihlLnR5cGUgPT09ICdjbGljaycgPyAnY2xpY2stcm93JyA6ICdkYmwtY2xpY2stcm93JywgaXRlbSwgJHRyLCBmaWVsZCk7XG5cbiAgICAgICAgICAgIC8vIGlmIGNsaWNrIHRvIHNlbGVjdCAtIHRoZW4gdHJpZ2dlciB0aGUgY2hlY2tib3gvcmFkaW8gY2xpY2tcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09ICdjbGljaycgJiYgdGhhdC5vcHRpb25zLmNsaWNrVG9TZWxlY3QgJiYgY29sdW1uLmNsaWNrVG9TZWxlY3QgJiYgdGhhdC5vcHRpb25zLmlnbm9yZUNsaWNrVG9TZWxlY3RPbihlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGVjdEl0ZW0gPSAkdHIuZmluZChzcHJpbnRmKCdbbmFtZT1cIiVzXCJdJywgdGhhdC5vcHRpb25zLnNlbGVjdEl0ZW1OYW1lKSk7XG4gICAgICAgICAgICAgICAgaWYgKCRzZWxlY3RJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0SXRlbVswXS5jbGljaygpOyAvLyAjMTQ0OiAudHJpZ2dlcignY2xpY2snKSBidWdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPiB0cltkYXRhLWluZGV4XSA+IHRkID4gLmRldGFpbC1pY29uJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRyID0gJHRoaXMucGFyZW50KCkucGFyZW50KCksXG4gICAgICAgICAgICAgICAgaW5kZXggPSAkdHIuZGF0YSgnaW5kZXgnKSxcbiAgICAgICAgICAgICAgICByb3cgPSBkYXRhW2luZGV4XTsgLy8gRml4ICM5ODAgRGV0YWlsIHZpZXcsIHdoZW4gc2VhcmNoaW5nLCByZXR1cm5zIHdyb25nIHJvd1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgYW5kIHVwZGF0ZVxuICAgICAgICAgICAgaWYgKCR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCdpJykuYXR0cignY2xhc3MnLCBzcHJpbnRmKCclcyAlcycsIHRoYXQub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhhdC5vcHRpb25zLmljb25zLmRldGFpbE9wZW4pKTtcbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2NvbGxhcHNlLXJvdycsIGluZGV4LCByb3csICR0ci5uZXh0KCkpO1xuICAgICAgICAgICAgICAgICR0ci5uZXh0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ2knKS5hdHRyKCdjbGFzcycsIHNwcmludGYoJyVzICVzJywgdGhhdC5vcHRpb25zLmljb25zUHJlZml4LCB0aGF0Lm9wdGlvbnMuaWNvbnMuZGV0YWlsQ2xvc2UpKTtcbiAgICAgICAgICAgICAgICAkdHIuYWZ0ZXIoc3ByaW50ZignPHRyIGNsYXNzPVwiZGV0YWlsLXZpZXdcIj48dGQgY29sc3Bhbj1cIiVzXCI+PC90ZD48L3RyPicsICR0ci5maW5kKCd0ZCcpLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICR0ci5uZXh0KCkuZmluZCgndGQnKTtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoYXQub3B0aW9ucywgdGhhdC5vcHRpb25zLmRldGFpbEZvcm1hdHRlciwgW2luZGV4LCByb3csICRlbGVtZW50XSwgJycpO1xuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2V4cGFuZC1yb3cnLCBpbmRleCwgcm93LCAkZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGF0LnJlc2V0VmlldygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRzZWxlY3RJdGVtID0gdGhpcy4kYm9keS5maW5kKHNwcmludGYoJ1tuYW1lPVwiJXNcIl0nLCB0aGlzLm9wdGlvbnMuc2VsZWN0SXRlbU5hbWUpKTtcbiAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBjaGVja2VkID0gJHRoaXMucHJvcCgnY2hlY2tlZCcpLFxuICAgICAgICAgICAgICAgIHJvdyA9IHRoYXQuZGF0YVskdGhpcy5kYXRhKCdpbmRleCcpXTtcblxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpyYWRpbycpIHx8IHRoYXQub3B0aW9ucy5zaW5nbGVTZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2godGhhdC5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93W3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJvd1t0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9IGNoZWNrZWQ7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2luZ2xlU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kc2VsZWN0SXRlbS5ub3QodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVskKHRoaXMpLmRhdGEoJ2luZGV4JyldW3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhhdC4kc2VsZWN0SXRlbS5maWx0ZXIoJzpjaGVja2VkJykubm90KHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoYXQudXBkYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrJyA6ICd1bmNoZWNrJywgcm93LCAkdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmhlYWRlci5ldmVudHMsIGZ1bmN0aW9uIChpLCBldmVudHMpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZml4IGJ1ZywgaWYgZXZlbnRzIGlzIGRlZmluZWQgd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGV2ZW50cyA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsIGV2ZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoYXQuaGVhZGVyLmZpZWxkc1tpXSxcbiAgICAgICAgICAgICAgICBmaWVsZEluZGV4ID0gJC5pbkFycmF5KGZpZWxkLCB0aGF0LmdldFZpc2libGVGaWVsZHMoKSk7XG5cbiAgICAgICAgICAgIGlmIChmaWVsZEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5kZXRhaWxWaWV3ICYmICF0aGF0Lm9wdGlvbnMuY2FyZFZpZXcpIHtcbiAgICAgICAgICAgICAgICBmaWVsZEluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRib2R5LmZpbmQoJz50cjpub3QoLm5vLXJlY29yZHMtZm91bmQpJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdHIgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHRkID0gJHRyLmZpbmQodGhhdC5vcHRpb25zLmNhcmRWaWV3ID8gJy5jYXJkLXZpZXcnIDogJ3RkJykuZXEoZmllbGRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGtleS5pbmRleE9mKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0ga2V5LnN1YnN0cmluZygwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICBlbCA9IGtleS5zdWJzdHJpbmcoaW5kZXggKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBldmVudHNba2V5XTtcblxuICAgICAgICAgICAgICAgICAgICAkdGQuZmluZChlbCkub2ZmKG5hbWUpLm9uKG5hbWUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkdHIuZGF0YSgnaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSB0aGF0LmRhdGFbaW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcm93W2ZpZWxkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBbZSwgdmFsdWUsIHJvdywgaW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgdGhpcy5yZXNldFZpZXcoKTtcblxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Bvc3QtYm9keScsIGRhdGEpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFNlcnZlciA9IGZ1bmN0aW9uIChzaWxlbnQsIHF1ZXJ5LCB1cmwpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgZGF0YSA9IHt9LFxuICAgICAgICAgICAgaW5kZXggPSAkLmluQXJyYXkodGhpcy5vcHRpb25zLnNvcnROYW1lLCB0aGlzLmhlYWRlci5maWVsZHMpLFxuICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIHNlYXJjaFRleHQ6IHRoaXMuc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBzb3J0TmFtZTogdGhpcy5vcHRpb25zLnNvcnROYW1lLFxuICAgICAgICAgICAgICAgIHNvcnRPcmRlcjogdGhpcy5vcHRpb25zLnNvcnRPcmRlclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVlc3Q7XG5cbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyLnNvcnROYW1lc1tpbmRleF0pIHtcbiAgICAgICAgICAgIHBhcmFtcy5zb3J0TmFtZSA9IHRoaXMuaGVhZGVyLnNvcnROYW1lc1tpbmRleF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luYXRpb24gJiYgdGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgcGFyYW1zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpID9cbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxSb3dzIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplO1xuICAgICAgICAgICAgcGFyYW1zLnBhZ2VOdW1iZXIgPSB0aGlzLm9wdGlvbnMucGFnZU51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHVybCB8fCB0aGlzLm9wdGlvbnMudXJsKSAmJiAhdGhpcy5vcHRpb25zLmFqYXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucXVlcnlQYXJhbXNUeXBlID09PSAnbGltaXQnKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBwYXJhbXMuc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBzb3J0OiBwYXJhbXMuc29ydE5hbWUsXG4gICAgICAgICAgICAgICAgb3JkZXI6IHBhcmFtcy5zb3J0T3JkZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbiAmJiB0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLm9mZnNldCA9IHRoaXMub3B0aW9ucy5wYWdlU2l6ZSA9PT0gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA/XG4gICAgICAgICAgICAgICAgICAgIDAgOiB0aGlzLm9wdGlvbnMucGFnZVNpemUgKiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAxKTtcbiAgICAgICAgICAgICAgICBwYXJhbXMubGltaXQgPSB0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxSb3dzIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplO1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMubGltaXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHBhcmFtcy5saW1pdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISgkLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCkpKSB7XG4gICAgICAgICAgICBwYXJhbXMuZmlsdGVyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMucXVlcnlQYXJhbXMsIFtwYXJhbXNdLCBkYXRhKTtcblxuICAgICAgICAkLmV4dGVuZChkYXRhLCBxdWVyeSB8fCB7fSk7XG5cbiAgICAgICAgLy8gZmFsc2UgdG8gc3RvcCByZXF1ZXN0XG4gICAgICAgIGlmIChkYXRhID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdCA9ICQuZXh0ZW5kKHt9LCBjYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLCB0aGlzLm9wdGlvbnMuYWpheE9wdGlvbnMpLCB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMubWV0aG9kLFxuICAgICAgICAgICAgdXJsOiAgdXJsIHx8IHRoaXMub3B0aW9ucy51cmwsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLm9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJyAmJiB0aGlzLm9wdGlvbnMubWV0aG9kID09PSAncG9zdCcgP1xuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpIDogZGF0YSxcbiAgICAgICAgICAgIGNhY2hlOiB0aGlzLm9wdGlvbnMuY2FjaGUsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogdGhpcy5vcHRpb25zLmNvbnRlbnRUeXBlLFxuICAgICAgICAgICAgZGF0YVR5cGU6IHRoaXMub3B0aW9ucy5kYXRhVHlwZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGF0Lm9wdGlvbnMsIHRoYXQub3B0aW9ucy5yZXNwb25zZUhhbmRsZXIsIFtyZXNdLCByZXMpO1xuXG4gICAgICAgICAgICAgICAgdGhhdC5sb2FkKHJlcyk7XG4gICAgICAgICAgICAgICAgdGhhdC50cmlnZ2VyKCdsb2FkLXN1Y2Nlc3MnLCByZXMpO1xuICAgICAgICAgICAgICAgIGlmICghc2lsZW50KSB0aGF0LiR0YWJsZUxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgIGRhdGFbdGhhdC5vcHRpb25zLnRvdGFsRmllbGRdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVt0aGF0Lm9wdGlvbnMuZGF0YUZpZWxkXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGF0LmxvYWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhhdC50cmlnZ2VyKCdsb2FkLWVycm9yJywgcmVzLnN0YXR1cywgcmVzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNpbGVudCkgdGhhdC4kdGFibGVMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hamF4KSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGlzLCB0aGlzLm9wdGlvbnMuYWpheCwgW3JlcXVlc3RdLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl94aHIgJiYgdGhpcy5feGhyLnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3hociA9ICQuYWpheChyZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFNlYXJjaFRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VhcmNoKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRleHQgPSAnJztcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VhcmNoVGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlYXJjaCA9IHRoaXMuJHRvb2xiYXIuZmluZCgnLnNlYXJjaCBpbnB1dCcpO1xuICAgICAgICAgICAgICAgICRzZWFyY2gudmFsKHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VhcmNoKHtjdXJyZW50VGFyZ2V0OiAkc2VhcmNoLCBmaXJlZEJ5SW5pdFNlYXJjaFRleHQ6IHRydWV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0Q2FyZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAkLmVhY2godGhpcy4kaGVhZGVyLmZpbmQoJ3RoJyksIGZ1bmN0aW9uIChpLCB0aCkge1xuICAgICAgICAgICAgJCh0aCkuZmluZCgnLnNvcnRhYmxlJykucmVtb3ZlQ2xhc3MoJ2Rlc2MgYXNjJykuYWRkQ2xhc3MoJCh0aCkuZGF0YSgnZmllbGQnKSA9PT0gdGhhdC5vcHRpb25zLnNvcnROYW1lID8gdGhhdC5vcHRpb25zLnNvcnRPcmRlciA6ICdib3RoJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudXBkYXRlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjaGVja0FsbCA9IHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLmxlbmd0aCAmJlxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykubGVuZ3RoID09PVxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDtcblxuICAgICAgICB0aGlzLiRzZWxlY3RBbGwuYWRkKHRoaXMuJHNlbGVjdEFsbF8pLnByb3AoJ2NoZWNrZWQnLCBjaGVja0FsbCk7XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgndHInKVskKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS51cGRhdGVSb3dzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuZGF0YVskKHRoaXMpLmRhdGEoJ2luZGV4JyldW3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gJCh0aGlzKS5wcm9wKCdjaGVja2VkJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUucmVzZXRSb3dzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuZGF0YSwgZnVuY3Rpb24gKGksIHJvdykge1xuICAgICAgICAgICAgdGhhdC4kc2VsZWN0QWxsLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGF0LiRzZWxlY3RJdGVtLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAodGhhdC5oZWFkZXIuc3RhdGVGaWVsZCkge1xuICAgICAgICAgICAgICAgIHJvd1t0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbml0SGlkZGVuUm93cygpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICBuYW1lICs9ICcuYnMudGFibGUnO1xuICAgICAgICB0aGlzLm9wdGlvbnNbQm9vdHN0cmFwVGFibGUuRVZFTlRTW25hbWVdXS5hcHBseSh0aGlzLm9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB0aGlzLiRlbC50cmlnZ2VyKCQuRXZlbnQobmFtZSksIGFyZ3MpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkFsbChuYW1lLCBhcmdzKTtcbiAgICAgICAgdGhpcy4kZWwudHJpZ2dlcigkLkV2ZW50KCdhbGwuYnMudGFibGUnKSwgW25hbWUsIGFyZ3NdKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlc2V0SGVhZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBmaXggIzYxOiB0aGUgaGlkZGVuIHRhYmxlIHJlc2V0IGhlYWRlciBidWcuXG4gICAgICAgIC8vIGZpeCBidWc6IGdldCAkZWwuY3NzKCd3aWR0aCcpIGVycm9yIHNvbWV0aW1lIChoZWlnaHQgPSA1MDApXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZF8pO1xuICAgICAgICB0aGlzLnRpbWVvdXRJZF8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5maXRIZWFkZXIsIHRoaXMpLCB0aGlzLiRlbC5pcygnOmhpZGRlbicpID8gMTAwIDogMCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5maXRIZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGZpeGVkQm9keSxcbiAgICAgICAgICAgIHNjcm9sbFdpZHRoLFxuICAgICAgICAgICAgZm9jdXNlZCxcbiAgICAgICAgICAgIGZvY3VzZWRUZW1wO1xuXG4gICAgICAgIGlmICh0aGF0LiRlbC5pcygnOmhpZGRlbicpKSB7XG4gICAgICAgICAgICB0aGF0LnRpbWVvdXRJZF8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhhdC5maXRIZWFkZXIsIHRoYXQpLCAxMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZpeGVkQm9keSA9IHRoaXMuJHRhYmxlQm9keS5nZXQoMCk7XG5cbiAgICAgICAgc2Nyb2xsV2lkdGggPSBmaXhlZEJvZHkuc2Nyb2xsV2lkdGggPiBmaXhlZEJvZHkuY2xpZW50V2lkdGggJiZcbiAgICAgICAgZml4ZWRCb2R5LnNjcm9sbEhlaWdodCA+IGZpeGVkQm9keS5jbGllbnRIZWlnaHQgKyB0aGlzLiRoZWFkZXIub3V0ZXJIZWlnaHQoKSA/XG4gICAgICAgICAgICBnZXRTY3JvbGxCYXJXaWR0aCgpIDogMDtcblxuICAgICAgICB0aGlzLiRlbC5jc3MoJ21hcmdpbi10b3AnLCAtdGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCkpO1xuXG4gICAgICAgIGZvY3VzZWQgPSAkKCc6Zm9jdXMnKTtcbiAgICAgICAgaWYgKGZvY3VzZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyICR0aCA9IGZvY3VzZWQucGFyZW50cygndGgnKTtcbiAgICAgICAgICAgIGlmICgkdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhRmllbGQgPSAkdGguYXR0cignZGF0YS1maWVsZCcpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhRmllbGQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGhlYWRlclRoID0gdGhpcy4kaGVhZGVyLmZpbmQoXCJbZGF0YS1maWVsZD0nXCIgKyBkYXRhRmllbGQgKyBcIiddXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGhlYWRlclRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRoZWFkZXJUaC5maW5kKFwiOmlucHV0XCIpLmFkZENsYXNzKFwiZm9jdXMtdGVtcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGhlYWRlcl8gPSB0aGlzLiRoZWFkZXIuY2xvbmUodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuJHNlbGVjdEFsbF8gPSB0aGlzLiRoZWFkZXJfLmZpbmQoJ1tuYW1lPVwiYnRTZWxlY3RBbGxcIl0nKTtcbiAgICAgICAgdGhpcy4kdGFibGVIZWFkZXIuY3NzKHtcbiAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBzY3JvbGxXaWR0aFxuICAgICAgICB9KS5maW5kKCd0YWJsZScpLmNzcygnd2lkdGgnLCB0aGlzLiRlbC5vdXRlcldpZHRoKCkpXG4gICAgICAgICAgICAuaHRtbCgnJykuYXR0cignY2xhc3MnLCB0aGlzLiRlbC5hdHRyKCdjbGFzcycpKVxuICAgICAgICAgICAgLmFwcGVuZCh0aGlzLiRoZWFkZXJfKTtcblxuICAgICAgICBmb2N1c2VkVGVtcCA9ICQoJy5mb2N1cy10ZW1wOnZpc2libGU6ZXEoMCknKTtcbiAgICAgICAgaWYgKGZvY3VzZWRUZW1wLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvY3VzZWRUZW1wLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgnLmZvY3VzLXRlbXAnKS5yZW1vdmVDbGFzcygnZm9jdXMtdGVtcCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZml4IGJ1ZzogJC5kYXRhKCkgaXMgbm90IHdvcmtpbmcgYXMgZXhwZWN0ZWQgYWZ0ZXIgJC5hcHBlbmQoKVxuICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICB0aGF0LiRoZWFkZXJfLmZpbmQoc3ByaW50ZigndGhbZGF0YS1maWVsZD1cIiVzXCJdJywgJCh0aGlzKS5kYXRhKCdmaWVsZCcpKSkuZGF0YSgkKHRoaXMpLmRhdGEoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB2aXNpYmxlRmllbGRzID0gdGhpcy5nZXRWaXNpYmxlRmllbGRzKCksXG4gICAgICAgICAgICAkdGhzID0gdGhpcy4kaGVhZGVyXy5maW5kKCd0aCcpO1xuXG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPnRyOmZpcnN0LWNoaWxkOm5vdCgubm8tcmVjb3Jkcy1mb3VuZCkgPiAqJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhdGhhdC5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kaGVhZGVyXy5maW5kKCd0aC5kZXRhaWwnKS5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgkdGhpcy5pbm5lcldpZHRoKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleCA9IGkgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgJHRoID0gdGhhdC4kaGVhZGVyXy5maW5kKHNwcmludGYoJ3RoW2RhdGEtZmllbGQ9XCIlc1wiXScsIHZpc2libGVGaWVsZHNbaW5kZXhdKSk7XG4gICAgICAgICAgICBpZiAoJHRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAkdGggPSAkKCR0aHNbJHRoaXNbMF0uY2VsbEluZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB6b29tV2lkdGggPSAkdGgud2lkdGgoKSAtICR0aC5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgpO1xuICAgICAgICAgICAgJHRoLmZpbmQoJy5maHQtY2VsbCcpLndpZHRoKCR0aGlzLmlubmVyV2lkdGgoKSAtIHpvb21XaWR0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbCgpO1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Bvc3QtaGVhZGVyJyk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZXNldEZvb3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgZGF0YSA9IHRoYXQuZ2V0RGF0YSgpLFxuICAgICAgICAgICAgaHRtbCA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dGb290ZXIgfHwgdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7IC8vZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY2FyZFZpZXcgJiYgdGhpcy5vcHRpb25zLmRldGFpbFZpZXcpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkPjxkaXYgY2xhc3M9XCJ0aC1pbm5lclwiPiZuYnNwOzwvZGl2PjxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PjwvdGQ+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkLmVhY2godGhpcy5jb2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sdW1uKSB7XG4gICAgICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgICAgIGZhbGlnbiA9ICcnLCAvLyBmb290ZXIgYWxpZ24gc3R5bGVcbiAgICAgICAgICAgICAgICB2YWxpZ24gPSAnJyxcbiAgICAgICAgICAgICAgICBjc3NlcyA9IFtdLFxuICAgICAgICAgICAgICAgIHN0eWxlID0ge30sXG4gICAgICAgICAgICAgICAgY2xhc3NfID0gc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGNvbHVtblsnY2xhc3MnXSk7XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgKCFjb2x1bW4uY2FyZFZpc2libGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmYWxpZ24gPSBzcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJywgY29sdW1uLmZhbGlnbiA/IGNvbHVtbi5mYWxpZ24gOiBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgdmFsaWduID0gc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLCBjb2x1bW4udmFsaWduKTtcblxuICAgICAgICAgICAgc3R5bGUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLCB0aGF0Lm9wdGlvbnMuZm9vdGVyU3R5bGUpO1xuXG4gICAgICAgICAgICBpZiAoc3R5bGUgJiYgc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzc2VzLnB1c2goa2V5ICsgJzogJyArIHN0eWxlLmNzc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkJywgY2xhc3NfLCBzcHJpbnRmKCcgc3R5bGU9XCIlc1wiJywgZmFsaWduICsgdmFsaWduICsgY3NzZXMuY29uY2F0KCkuam9pbignOyAnKSksICc+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJ0aC1pbm5lclwiPicpO1xuXG4gICAgICAgICAgICBodG1sLnB1c2goY2FsY3VsYXRlT2JqZWN0VmFsdWUoY29sdW1uLCBjb2x1bW4uZm9vdGVyRm9ybWF0dGVyLCBbZGF0YV0sICcmbmJzcDsnKSB8fCAnJm5ic3A7Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PicpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC90ZD4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuZmluZCgndHInKS5odG1sKGh0bWwuam9pbignJykpO1xuICAgICAgICB0aGlzLiR0YWJsZUZvb3Rlci5zaG93KCk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRGb290ZXJfKTtcbiAgICAgICAgdGhpcy50aW1lb3V0Rm9vdGVyXyA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmZpdEZvb3RlciwgdGhpcyksXG4gICAgICAgICAgICB0aGlzLiRlbC5pcygnOmhpZGRlbicpID8gMTAwIDogMCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5maXRGb290ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICRmb290ZXJUZCxcbiAgICAgICAgICAgIGVsV2lkdGgsXG4gICAgICAgICAgICBzY3JvbGxXaWR0aDtcblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0Rm9vdGVyXyk7XG4gICAgICAgIGlmICh0aGlzLiRlbC5pcygnOmhpZGRlbicpKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRGb290ZXJfID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuZml0Rm9vdGVyLCB0aGlzKSwgMTAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsV2lkdGggPSB0aGlzLiRlbC5jc3MoJ3dpZHRoJyk7XG4gICAgICAgIHNjcm9sbFdpZHRoID0gZWxXaWR0aCA+IHRoaXMuJHRhYmxlQm9keS53aWR0aCgpID8gZ2V0U2Nyb2xsQmFyV2lkdGgoKSA6IDA7XG5cbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuY3NzKHtcbiAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBzY3JvbGxXaWR0aFxuICAgICAgICB9KS5maW5kKCd0YWJsZScpLmNzcygnd2lkdGgnLCBlbFdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgdGhpcy4kZWwuYXR0cignY2xhc3MnKSk7XG5cbiAgICAgICAgJGZvb3RlclRkID0gdGhpcy4kdGFibGVGb290ZXIuZmluZCgndGQnKTtcblxuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJz50cjpmaXJzdC1jaGlsZDpub3QoLm5vLXJlY29yZHMtZm91bmQpID4gKicpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICRmb290ZXJUZC5lcShpKS5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgkdGhpcy5pbm5lcldpZHRoKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGwoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmhvcml6b250YWxTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgLy8gaG9yaXpvbnRhbCBzY3JvbGwgZXZlbnRcbiAgICAgICAgLy8gVE9ETzogaXQncyBwcm9iYWJseSBiZXR0ZXIgaW1wcm92aW5nIHRoZSBsYXlvdXQgdGhhbiBiaW5kaW5nIHRvIHNjcm9sbCBldmVudFxuXG4gICAgICAgIHRoYXQudHJpZ2dlcignc2Nyb2xsLWJvZHknKTtcbiAgICAgICAgdGhpcy4kdGFibGVCb2R5Lm9mZignc2Nyb2xsJykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2hvd0hlYWRlciAmJiB0aGF0Lm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHRoYXQuJHRhYmxlSGVhZGVyLnNjcm9sbExlZnQoJCh0aGlzKS5zY3JvbGxMZWZ0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNob3dGb290ZXIgJiYgIXRoYXQub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhYmxlRm9vdGVyLnNjcm9sbExlZnQoJCh0aGlzKS5zY3JvbGxMZWZ0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRvZ2dsZUNvbHVtbiA9IGZ1bmN0aW9uIChpbmRleCwgY2hlY2tlZCwgbmVlZFVwZGF0ZSkge1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2x1bW5zW2luZGV4XS52aXNpYmxlID0gY2hlY2tlZDtcbiAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gdGhpcy4kdG9vbGJhci5maW5kKCcua2VlcC1vcGVuIGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChuZWVkVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgJGl0ZW1zLmZpbHRlcihzcHJpbnRmKCdbdmFsdWU9XCIlc1wiXScsIGluZGV4KSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPD0gdGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldFZpc2libGVGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHZpc2libGVGaWVsZHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5oZWFkZXIuZmllbGRzLCBmdW5jdGlvbiAoaiwgZmllbGQpIHtcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGF0LmNvbHVtbnNbdGhhdC5maWVsZHNDb2x1bW5zSW5kZXhbZmllbGRdXTtcblxuICAgICAgICAgICAgaWYgKCFjb2x1bW4udmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpc2libGVGaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmlzaWJsZUZpZWxkcztcbiAgICB9O1xuXG4gICAgLy8gUFVCTElDIEZVTkNUSU9OIERFRklOSVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlc2V0VmlldyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSAwO1xuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3RBbGwucHJvcCgnY2hlY2tlZCcsIHRoaXMuJHNlbGVjdEl0ZW0ubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0SXRlbS5sZW5ndGggPT09IHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHZhciB0b29sYmFySGVpZ2h0ID0gdGhpcy4kdG9vbGJhci5vdXRlckhlaWdodCh0cnVlKSxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSGVpZ2h0ID0gdGhpcy4kcGFnaW5hdGlvbi5vdXRlckhlaWdodCh0cnVlKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB0aGlzLm9wdGlvbnMuaGVpZ2h0IC0gdG9vbGJhckhlaWdodCAtIHBhZ2luYXRpb25IZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmNzcygnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnQgY3NzXG4gICAgICAgICAgICB0aGlzLiRlbC5jc3MoJ21hcmdpbi10b3AnLCAnMCcpO1xuICAgICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsICcwJyk7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUZvb3Rlci5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIZWFkZXIgJiYgdGhpcy5vcHRpb25zLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVIZWFkZXIuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5yZXNldEhlYWRlcigpO1xuICAgICAgICAgICAgcGFkZGluZyArPSB0aGlzLiRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncG9zdC1oZWFkZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Zvb3Rlcikge1xuICAgICAgICAgICAgdGhpcy5yZXNldEZvb3RlcigpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nICs9IHRoaXMuJHRhYmxlRm9vdGVyLm91dGVySGVpZ2h0KCkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzaWduIHRoZSBjb3JyZWN0IHNvcnRhYmxlIGFycm93XG4gICAgICAgIHRoaXMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScsIHBhZGRpbmcgKyAncHgnKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZXNldC12aWV3Jyk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKHVzZUN1cnJlbnRQYWdlKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGE7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFRleHQgfHwgdGhpcy5vcHRpb25zLnNvcnROYW1lIHx8ICEkLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zKSB8fCAhJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwpKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5zbGljZSh0aGlzLnBhZ2VGcm9tIC0gMSwgdGhpcy5wYWdlVG8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIGZpeGVkU2Nyb2xsID0gZmFsc2U7XG5cbiAgICAgICAgLy8gIzQzMTogc3VwcG9ydCBwYWdpbmF0aW9uXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbiAmJiB0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxSb3dzID0gZGF0YVt0aGlzLm9wdGlvbnMudG90YWxGaWVsZF07XG4gICAgICAgICAgICBmaXhlZFNjcm9sbCA9IGRhdGEuZml4ZWRTY3JvbGw7XG4gICAgICAgICAgICBkYXRhID0gZGF0YVt0aGlzLm9wdGlvbnMuZGF0YUZpZWxkXTtcbiAgICAgICAgfSBlbHNlIGlmICghJC5pc0FycmF5KGRhdGEpKSB7IC8vIHN1cHBvcnQgZml4ZWRTY3JvbGxcbiAgICAgICAgICAgIGZpeGVkU2Nyb2xsID0gZGF0YS5maXhlZFNjcm9sbDtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXREYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KGZpeGVkU2Nyb2xsKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuaW5pdERhdGEoZGF0YSwgJ2FwcGVuZCcpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pbml0RGF0YShkYXRhLCAncHJlcGVuZCcpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICBpLCByb3c7XG5cbiAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWVzJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMuZGF0YVtpXTtcblxuICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkocGFyYW1zLmZpZWxkKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShyb3dbcGFyYW1zLmZpZWxkXSwgcGFyYW1zLnZhbHVlcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFJvd3MgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGVuID09PSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSgwLCB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRSb3dCeVVuaXF1ZUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciB1bmlxdWVJZCA9IHRoaXMub3B0aW9ucy51bmlxdWVJZCxcbiAgICAgICAgICAgIGxlbiA9IHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIGRhdGFSb3cgPSBudWxsLFxuICAgICAgICAgICAgaSwgcm93LCByb3dVbmlxdWVJZDtcblxuICAgICAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgcm93ID0gdGhpcy5vcHRpb25zLmRhdGFbaV07XG5cbiAgICAgICAgICAgIGlmIChyb3cuaGFzT3duUHJvcGVydHkodW5pcXVlSWQpKSB7IC8vIHVuaXF1ZUlkIGlzIGEgY29sdW1uXG4gICAgICAgICAgICAgICAgcm93VW5pcXVlSWQgPSByb3dbdW5pcXVlSWRdO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHJvdy5fZGF0YS5oYXNPd25Qcm9wZXJ0eSh1bmlxdWVJZCkpIHsgLy8gdW5pcXVlSWQgaXMgYSByb3cgZGF0YSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIHJvd1VuaXF1ZUlkID0gcm93Ll9kYXRhW3VuaXF1ZUlkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm93VW5pcXVlSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWQgPSBpZC50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygcm93VW5pcXVlSWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKChOdW1iZXIocm93VW5pcXVlSWQpID09PSByb3dVbmlxdWVJZCkgJiYgKHJvd1VuaXF1ZUlkICUgMSA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBwYXJzZUludChpZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgocm93VW5pcXVlSWQgPT09IE51bWJlcihyb3dVbmlxdWVJZCkpICYmIChyb3dVbmlxdWVJZCAhPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBwYXJzZUZsb2F0KGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dVbmlxdWVJZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICBkYXRhUm93ID0gcm93O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFSb3c7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZW1vdmVCeVVuaXF1ZUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICByb3cgPSB0aGlzLmdldFJvd0J5VW5pcXVlSWQoaWQpO1xuXG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSh0aGlzLm9wdGlvbnMuZGF0YS5pbmRleE9mKHJvdyksIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlbiA9PT0gdGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudXBkYXRlQnlVbmlxdWVJZCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsUGFyYW1zID0gJC5pc0FycmF5KHBhcmFtcykgPyBwYXJhbXMgOiBbIHBhcmFtcyBdO1xuXG4gICAgICAgICQuZWFjaChhbGxQYXJhbXMsIGZ1bmN0aW9uKGksIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIHJvd0lkO1xuXG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaWQnKSB8fCAhcGFyYW1zLmhhc093blByb3BlcnR5KCdyb3cnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcm93SWQgPSAkLmluQXJyYXkodGhhdC5nZXRSb3dCeVVuaXF1ZUlkKHBhcmFtcy5pZCksIHRoYXQub3B0aW9ucy5kYXRhKTtcblxuICAgICAgICAgICAgaWYgKHJvd0lkID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQuZXh0ZW5kKHRoYXQub3B0aW9ucy5kYXRhW3Jvd0lkXSwgcGFyYW1zLnJvdyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlZnJlc2hDb2x1bW5UaXRsZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndGl0bGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2x1bW5zW3RoaXMuZmllbGRzQ29sdW1uc0luZGV4W3BhcmFtcy5maWVsZF1dLnRpdGxlID1cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lc2NhcGUgPyBlc2NhcGVIVE1MKHBhcmFtcy50aXRsZSkgOiBwYXJhbXMudGl0bGU7XG5cbiAgICAgICAgaWYgKHRoaXMuY29sdW1uc1t0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFtwYXJhbXMuZmllbGRdXS52aXNpYmxlKSB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5vcHRpb25zLmhlaWdodCAhPT0gdW5kZWZpbmVkID8gdGhpcy4kdGFibGVIZWFkZXIgOiB0aGlzLiRoZWFkZXI7XG4gICAgICAgICAgICBoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnZmllbGQnKSA9PT0gcGFyYW1zLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJCh0aGlzKS5maW5kKFwiLnRoLWlubmVyXCIpWzBdKS50ZXh0KHBhcmFtcy50aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5zZXJ0Um93ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSB8fCAhcGFyYW1zLmhhc093blByb3BlcnR5KCdyb3cnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZShwYXJhbXMuaW5kZXgsIDAsIHBhcmFtcy5yb3cpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS51cGRhdGVSb3cgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIGFsbFBhcmFtcyA9ICQuaXNBcnJheShwYXJhbXMpID8gcGFyYW1zIDogWyBwYXJhbXMgXTtcblxuICAgICAgICAkLmVhY2goYWxsUGFyYW1zLCBmdW5jdGlvbihpLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KCdpbmRleCcpIHx8ICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3JvdycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJC5leHRlbmQodGhhdC5vcHRpb25zLmRhdGFbcGFyYW1zLmluZGV4XSwgcGFyYW1zLnJvdyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRIaWRkZW5Sb3dzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhpZGRlblJvd3MgPSBbXTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnNob3dSb3cgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlUm93KHBhcmFtcywgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5oaWRlUm93ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnRvZ2dsZVJvdyhwYXJhbXMsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRvZ2dsZVJvdyA9IGZ1bmN0aW9uIChwYXJhbXMsIHZpc2libGUpIHtcbiAgICAgICAgdmFyIHJvdywgaW5kZXg7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSkge1xuICAgICAgICAgICAgcm93ID0gdGhpcy5nZXREYXRhKClbcGFyYW1zLmluZGV4XTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3VuaXF1ZUlkJykpIHtcbiAgICAgICAgICAgIHJvdyA9IHRoaXMuZ2V0Um93QnlVbmlxdWVJZChwYXJhbXMudW5pcXVlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyb3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4ID0gJC5pbkFycmF5KHJvdywgdGhpcy5oaWRkZW5Sb3dzKTtcblxuICAgICAgICBpZiAoIXZpc2libGUgJiYgaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGRlblJvd3MucHVzaChyb3cpO1xuICAgICAgICB9IGVsc2UgaWYgKHZpc2libGUgJiYgaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5oaWRkZW5Sb3dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldEhpZGRlblJvd3MgPSBmdW5jdGlvbiAoc2hvdykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBkYXRhID0gdGhpcy5nZXREYXRhKCksXG4gICAgICAgICAgICByb3dzID0gW107XG5cbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkocm93LCB0aGF0LmhpZGRlblJvd3MpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByb3dzLnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGlkZGVuUm93cyA9IHJvd3M7XG4gICAgICAgIHJldHVybiByb3dzO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUubWVyZ2VDZWxscyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciByb3cgPSBvcHRpb25zLmluZGV4LFxuICAgICAgICAgICAgY29sID0gJC5pbkFycmF5KG9wdGlvbnMuZmllbGQsIHRoaXMuZ2V0VmlzaWJsZUZpZWxkcygpKSxcbiAgICAgICAgICAgIHJvd3NwYW4gPSBvcHRpb25zLnJvd3NwYW4gfHwgMSxcbiAgICAgICAgICAgIGNvbHNwYW4gPSBvcHRpb25zLmNvbHNwYW4gfHwgMSxcbiAgICAgICAgICAgIGksIGosXG4gICAgICAgICAgICAkdHIgPSB0aGlzLiRib2R5LmZpbmQoJz50cicpLFxuICAgICAgICAgICAgJHRkO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICBjb2wgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0ZCA9ICR0ci5lcShyb3cpLmZpbmQoJz50ZCcpLmVxKGNvbCk7XG5cbiAgICAgICAgaWYgKHJvdyA8IDAgfHwgY29sIDwgMCB8fCByb3cgPj0gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gcm93OyBpIDwgcm93ICsgcm93c3BhbjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGogPSBjb2w7IGogPCBjb2wgKyBjb2xzcGFuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAkdHIuZXEoaSkuZmluZCgnPnRkJykuZXEoaikuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHRkLmF0dHIoJ3Jvd3NwYW4nLCByb3dzcGFuKS5hdHRyKCdjb2xzcGFuJywgY29sc3Bhbikuc2hvdygpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudXBkYXRlQ2VsbCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2luZGV4JykgfHxcbiAgICAgICAgICAgICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHxcbiAgICAgICAgICAgICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFbcGFyYW1zLmluZGV4XVtwYXJhbXMuZmllbGRdID0gcGFyYW1zLnZhbHVlO1xuXG4gICAgICAgIGlmIChwYXJhbXMucmVpbml0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZUNlbGxCeUlkID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KCdpZCcpIHx8XG4gICAgICAgICAgICAhcGFyYW1zLmhhc093blByb3BlcnR5KCdmaWVsZCcpIHx8XG4gICAgICAgICAgICAhcGFyYW1zLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFsbFBhcmFtcyA9ICQuaXNBcnJheShwYXJhbXMpID8gcGFyYW1zIDogWyBwYXJhbXMgXTtcblxuICAgICAgICAkLmVhY2goYWxsUGFyYW1zLCBmdW5jdGlvbihpLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciByb3dJZDtcblxuICAgICAgICAgICAgcm93SWQgPSAkLmluQXJyYXkodGhhdC5nZXRSb3dCeVVuaXF1ZUlkKHBhcmFtcy5pZCksIHRoYXQub3B0aW9ucy5kYXRhKTtcblxuICAgICAgICAgICAgaWYgKHJvd0lkID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoYXQuZGF0YVtyb3dJZF1bcGFyYW1zLmZpZWxkXSA9IHBhcmFtcy52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5yZWluaXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9EZWVwIGNvcHlcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0U2VsZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAkLmdyZXAodGhpcy5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIC8vIGZpeCAjMjQyNDogZnJvbSBodG1sIHdpdGggY2hlY2tib3hcbiAgICAgICAgICAgIHJldHVybiByb3dbdGhhdC5oZWFkZXIuc3RhdGVGaWVsZF0gPT09IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0QWxsU2VsZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAkLmdyZXAodGhpcy5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiByb3dbdGhhdC5oZWFkZXIuc3RhdGVGaWVsZF07XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY2hlY2tBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tBbGxfKHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudW5jaGVja0FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja0FsbF8oZmFsc2UpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY2hlY2tJbnZlcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIHJvd3MgPSB0aGF0LiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKTtcbiAgICAgICAgdmFyIGNoZWNrZWQgPSByb3dzLmZpbHRlcignOmNoZWNrZWQnKTtcbiAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgISQodGhpcykucHJvcCgnY2hlY2tlZCcpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoYXQudXBkYXRlUm93cygpO1xuICAgICAgICB0aGF0LnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgIHRoYXQudHJpZ2dlcigndW5jaGVjay1zb21lJywgY2hlY2tlZCk7XG4gICAgICAgIGNoZWNrZWQgPSB0aGF0LmdldFNlbGVjdGlvbnMoKTtcbiAgICAgICAgdGhhdC50cmlnZ2VyKCdjaGVjay1zb21lJywgY2hlY2tlZCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jaGVja0FsbF8gPSBmdW5jdGlvbiAoY2hlY2tlZCkge1xuICAgICAgICB2YXIgcm93cztcbiAgICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgICAgICByb3dzID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kc2VsZWN0QWxsLmFkZCh0aGlzLiRzZWxlY3RBbGxfKS5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcbiAgICAgICAgdGhpcy51cGRhdGVSb3dzKCk7XG4gICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICByb3dzID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyKGNoZWNrZWQgPyAnY2hlY2stYWxsJyA6ICd1bmNoZWNrLWFsbCcsIHJvd3MpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5jaGVja18odHJ1ZSwgaW5kZXgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudW5jaGVjayA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLmNoZWNrXyhmYWxzZSwgaW5kZXgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY2hlY2tfID0gZnVuY3Rpb24gKGNoZWNrZWQsIGluZGV4KSB7XG4gICAgICAgIHZhciAkZWwgPSB0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcihzcHJpbnRmKCdbZGF0YS1pbmRleD1cIiVzXCJdJywgaW5kZXgpKS5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgIHRoaXMuZGF0YVtpbmRleF1bdGhpcy5oZWFkZXIuc3RhdGVGaWVsZF0gPSBjaGVja2VkO1xuICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrJyA6ICd1bmNoZWNrJywgdGhpcy5kYXRhW2luZGV4XSwgJGVsKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrQnkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHRoaXMuY2hlY2tCeV8odHJ1ZSwgb2JqKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVuY2hlY2tCeSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdGhpcy5jaGVja0J5XyhmYWxzZSwgb2JqKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrQnlfID0gZnVuY3Rpb24gKGNoZWNrZWQsIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eSgnZmllbGQnKSB8fCAhb2JqLmhhc093blByb3BlcnR5KCd2YWx1ZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcm93cyA9IFtdO1xuICAgICAgICAkLmVhY2godGhpcy5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChpbmRleCwgcm93KSB7XG4gICAgICAgICAgICBpZiAoIXJvdy5oYXNPd25Qcm9wZXJ0eShvYmouZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShyb3dbb2JqLmZpZWxkXSwgb2JqLnZhbHVlcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyICRlbCA9IHRoYXQuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3ByaW50ZignW2RhdGEtaW5kZXg9XCIlc1wiXScsIGluZGV4KSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIHJvd1t0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9IGNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgdGhhdC50cmlnZ2VyKGNoZWNrZWQgPyAnY2hlY2snIDogJ3VuY2hlY2snLCByb3csICRlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrLXNvbWUnIDogJ3VuY2hlY2stc29tZScsIHJvd3MpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kZWwuaW5zZXJ0QmVmb3JlKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICAgICQodGhpcy5vcHRpb25zLnRvb2xiYXIpLmluc2VydEJlZm9yZSh0aGlzLiRlbCk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5uZXh0KCkucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLiRlbF8uaHRtbCgpKVxuICAgICAgICAgICAgLmNzcygnbWFyZ2luLXRvcCcsICcwJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIHRoaXMuJGVsXy5hdHRyKCdjbGFzcycpIHx8ICcnKTsgLy8gcmVzZXQgdGhlIGNsYXNzXG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5zaG93TG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nLnNob3coKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmhpZGVMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiR0YWJsZUxvYWRpbmcuaGlkZSgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudG9nZ2xlUGFnaW5hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2luYXRpb24gPSAhdGhpcy5vcHRpb25zLnBhZ2luYXRpb247XG4gICAgICAgIHZhciBidXR0b24gPSB0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwicGFnaW5hdGlvblN3aXRjaFwiXSBpJyk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgYnV0dG9uLmF0dHIoXCJjbGFzc1wiLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXggKyBcIiBcIiArIHRoaXMub3B0aW9ucy5pY29ucy5wYWdpbmF0aW9uU3dpdGNoRG93bik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidXR0b24uYXR0cihcImNsYXNzXCIsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCArIFwiIFwiICsgdGhpcy5vcHRpb25zLmljb25zLnBhZ2luYXRpb25Td2l0Y2hVcCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS50b2dnbGVGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiRlbC5jbG9zZXN0KCcuYm9vdHN0cmFwLXRhYmxlJykudG9nZ2xlQ2xhc3MoJ2Z1bGxzY3JlZW4nKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLnVybCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnVybCA9IHBhcmFtcy51cmw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMucGFnZU51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSBwYXJhbXMucGFnZU51bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5wYWdlU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gcGFyYW1zLnBhZ2VTaXplO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdFNlcnZlcihwYXJhbXMgJiYgcGFyYW1zLnNpbGVudCxcbiAgICAgICAgICAgIHBhcmFtcyAmJiBwYXJhbXMucXVlcnksIHBhcmFtcyAmJiBwYXJhbXMudXJsKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZWZyZXNoJywgcGFyYW1zKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlc2V0V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0hlYWRlciAmJiB0aGlzLm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmZpdEhlYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0Zvb3RlciAmJiAhdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLmZpdEZvb3RlcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5zaG93Q29sdW1uID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29sdW1uKHRoaXMuZmllbGRzQ29sdW1uc0luZGV4W2ZpZWxkXSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5oaWRlQ29sdW1uID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29sdW1uKHRoaXMuZmllbGRzQ29sdW1uc0luZGV4W2ZpZWxkXSwgZmFsc2UsIHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0SGlkZGVuQ29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQuZ3JlcCh0aGlzLmNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiAhY29sdW1uLnZpc2libGU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0VmlzaWJsZUNvbHVtbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkLmdyZXAodGhpcy5jb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sdW1uLnZpc2libGU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudG9nZ2xlQWxsQ29sdW1ucyA9IGZ1bmN0aW9uICh2aXNpYmxlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgJC5lYWNoKHRoaXMuY29sdW1ucywgZnVuY3Rpb24gKGksIGNvbHVtbikge1xuICAgICAgICAgICAgdGhhdC5jb2x1bW5zW2ldLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gdGhpcy4kdG9vbGJhci5maW5kKCcua2VlcC1vcGVuIGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmICgkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA8PSB0aGlzLm9wdGlvbnMubWluaW11bUNvdW50Q29sdW1ucykge1xuICAgICAgICAgICAgICAgICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2hvd0FsbENvbHVtbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQWxsQ29sdW1ucyh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmhpZGVBbGxDb2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbENvbHVtbnMoZmFsc2UpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZmlsdGVyQnkgPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnMgPSAkLmlzRW1wdHlPYmplY3QoY29sdW1ucykgPyB7fSA6IGNvbHVtbnM7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gMTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2Nyb2xsVG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09ICdib3R0b20nID8gdGhpcy4kdGFibGVCb2R5WzBdLnNjcm9sbEhlaWdodCA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQm9keS5zY3JvbGxUb3AodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kdGFibGVCb2R5LnNjcm9sbFRvcCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRTY3JvbGxQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG8oKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnNlbGVjdFBhZ2UgPSBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICBpZiAocGFnZSA+IDAgJiYgcGFnZSA8PSB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSBwYWdlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnByZXZQYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPiAxKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlci0tO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm5leHRQYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPCB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS50b2dnbGVWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuY2FyZFZpZXcgPSAhdGhpcy5vcHRpb25zLmNhcmRWaWV3O1xuICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgLy8gRml4ZWQgcmVtb3ZlIHRvb2xiYXIgd2hlbiBjbGljayBjYXJkVmlldyBidXR0b24uXG4gICAgICAgIC8vdGhhdC5pbml0VG9vbGJhcigpO1xuICAgICAgICB2YXIgJGljb24gPSB0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwidG9nZ2xlXCJdIGknKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmljb25zLnRvZ2dsZU9mZik7XG4gICAgICAgICAgICAkaWNvbi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuaWNvbnMudG9nZ2xlT24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmljb25zLnRvZ2dsZU9uKTtcbiAgICAgICAgICAgICRpY29uLmFkZENsYXNzKHRoaXMub3B0aW9ucy5pY29ucy50b2dnbGVPZmYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCd0b2dnbGUnLCB0aGlzLm9wdGlvbnMuY2FyZFZpZXcpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUucmVmcmVzaE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAvL0lmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50IHRoZW4gYXZvaWQgdGhlIGNhbGwgb2YgZGVzdHJveSAvIGluaXQgbWV0aG9kc1xuICAgICAgICBpZiAoY29tcGFyZU9iamVjdHModGhpcy5vcHRpb25zLCBvcHRpb25zLCB0cnVlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVmcmVzaC1vcHRpb25zJywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUucmVzZXRTZWFyY2ggPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICB2YXIgJHNlYXJjaCA9IHRoaXMuJHRvb2xiYXIuZmluZCgnLnNlYXJjaCBpbnB1dCcpO1xuICAgICAgICAkc2VhcmNoLnZhbCh0ZXh0IHx8ICcnKTtcbiAgICAgICAgdGhpcy5vblNlYXJjaCh7Y3VycmVudFRhcmdldDogJHNlYXJjaH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZXhwYW5kUm93XyA9IGZ1bmN0aW9uIChleHBhbmQsIGluZGV4KSB7XG4gICAgICAgIHZhciAkdHIgPSB0aGlzLiRib2R5LmZpbmQoc3ByaW50ZignPiB0cltkYXRhLWluZGV4PVwiJXNcIl0nLCBpbmRleCkpO1xuICAgICAgICBpZiAoJHRyLm5leHQoKS5pcygndHIuZGV0YWlsLXZpZXcnKSA9PT0gKGV4cGFuZCA/IGZhbHNlIDogdHJ1ZSkpIHtcbiAgICAgICAgICAgICR0ci5maW5kKCc+IHRkID4gLmRldGFpbC1pY29uJykuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZXhwYW5kUm93ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHRoaXMuZXhwYW5kUm93Xyh0cnVlLCBpbmRleCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jb2xsYXBzZVJvdyA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLmV4cGFuZFJvd18oZmFsc2UsIGluZGV4KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmV4cGFuZEFsbFJvd3MgPSBmdW5jdGlvbiAoaXNTdWJUYWJsZSkge1xuICAgICAgICBpZiAoaXNTdWJUYWJsZSkge1xuICAgICAgICAgICAgdmFyICR0ciA9IHRoaXMuJGJvZHkuZmluZChzcHJpbnRmKCc+IHRyW2RhdGEtaW5kZXg9XCIlc1wiXScsIDApKSxcbiAgICAgICAgICAgICAgICB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBkZXRhaWxJY29uID0gbnVsbCxcbiAgICAgICAgICAgICAgICBleGVjdXRlSW50ZXJ2YWwgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBpZEludGVydmFsID0gLTE7XG5cbiAgICAgICAgICAgIGlmICghJHRyLm5leHQoKS5pcygndHIuZGV0YWlsLXZpZXcnKSkge1xuICAgICAgICAgICAgICAgICR0ci5maW5kKCc+IHRkID4gLmRldGFpbC1pY29uJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICBleGVjdXRlSW50ZXJ2YWwgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghJHRyLm5leHQoKS5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykpIHtcbiAgICAgICAgICAgICAgICAkdHIubmV4dCgpLmZpbmQoXCIuZGV0YWlsLWljb25cIikuY2xpY2soKTtcbiAgICAgICAgICAgICAgICBleGVjdXRlSW50ZXJ2YWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXhlY3V0ZUludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWRJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbEljb24gPSB0aGF0LiRib2R5LmZpbmQoXCJ0ci5kZXRhaWwtdmlld1wiKS5sYXN0KCkuZmluZChcIi5kZXRhaWwtaWNvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXRhaWxJY29uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxJY29uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaWRJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaWRJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRycyA9IHRoaXMuJGJvZHkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmRSb3dfKHRydWUsICQodHJzW2ldKS5kYXRhKFwiaW5kZXhcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jb2xsYXBzZUFsbFJvd3MgPSBmdW5jdGlvbiAoaXNTdWJUYWJsZSkge1xuICAgICAgICBpZiAoaXNTdWJUYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5leHBhbmRSb3dfKGZhbHNlLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0cnMgPSB0aGlzLiRib2R5LmNoaWxkcmVuKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kUm93XyhmYWxzZSwgJCh0cnNbaV0pLmRhdGEoXCJpbmRleFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZUZvcm1hdFRleHQgPSBmdW5jdGlvbiAobmFtZSwgdGV4dCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zW3NwcmludGYoJ2Zvcm1hdCVzJywgbmFtZSldKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zW3NwcmludGYoJ2Zvcm1hdCVzJywgbmFtZSldID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1tzcHJpbnRmKCdmb3JtYXQlcycsIG5hbWUpXSA9IHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0VG9vbGJhcigpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICB9O1xuXG4gICAgLy8gQk9PVFNUUkFQIFRBQkxFIFBMVUdJTiBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhciBhbGxvd2VkTWV0aG9kcyA9IFtcbiAgICAgICAgJ2dldE9wdGlvbnMnLFxuICAgICAgICAnZ2V0U2VsZWN0aW9ucycsICdnZXRBbGxTZWxlY3Rpb25zJywgJ2dldERhdGEnLFxuICAgICAgICAnbG9hZCcsICdhcHBlbmQnLCAncHJlcGVuZCcsICdyZW1vdmUnLCAncmVtb3ZlQWxsJyxcbiAgICAgICAgJ2luc2VydFJvdycsICd1cGRhdGVSb3cnLCAndXBkYXRlQ2VsbCcsICd1cGRhdGVCeVVuaXF1ZUlkJywgJ3JlbW92ZUJ5VW5pcXVlSWQnLFxuICAgICAgICAnZ2V0Um93QnlVbmlxdWVJZCcsICdzaG93Um93JywgJ2hpZGVSb3cnLCAnZ2V0SGlkZGVuUm93cycsXG4gICAgICAgICdtZXJnZUNlbGxzJywgJ3JlZnJlc2hDb2x1bW5UaXRsZScsXG4gICAgICAgICdjaGVja0FsbCcsICd1bmNoZWNrQWxsJywgJ2NoZWNrSW52ZXJ0JyxcbiAgICAgICAgJ2NoZWNrJywgJ3VuY2hlY2snLFxuICAgICAgICAnY2hlY2tCeScsICd1bmNoZWNrQnknLFxuICAgICAgICAncmVmcmVzaCcsXG4gICAgICAgICdyZXNldFZpZXcnLFxuICAgICAgICAncmVzZXRXaWR0aCcsXG4gICAgICAgICdkZXN0cm95JyxcbiAgICAgICAgJ3Nob3dMb2FkaW5nJywgJ2hpZGVMb2FkaW5nJyxcbiAgICAgICAgJ3Nob3dDb2x1bW4nLCAnaGlkZUNvbHVtbicsICdnZXRIaWRkZW5Db2x1bW5zJywgJ2dldFZpc2libGVDb2x1bW5zJyxcbiAgICAgICAgJ3Nob3dBbGxDb2x1bW5zJywgJ2hpZGVBbGxDb2x1bW5zJyxcbiAgICAgICAgJ2ZpbHRlckJ5JyxcbiAgICAgICAgJ3Njcm9sbFRvJyxcbiAgICAgICAgJ2dldFNjcm9sbFBvc2l0aW9uJyxcbiAgICAgICAgJ3NlbGVjdFBhZ2UnLCAncHJldlBhZ2UnLCAnbmV4dFBhZ2UnLFxuICAgICAgICAndG9nZ2xlUGFnaW5hdGlvbicsXG4gICAgICAgICd0b2dnbGVWaWV3JyxcbiAgICAgICAgJ3JlZnJlc2hPcHRpb25zJyxcbiAgICAgICAgJ3Jlc2V0U2VhcmNoJyxcbiAgICAgICAgJ2V4cGFuZFJvdycsICdjb2xsYXBzZVJvdycsICdleHBhbmRBbGxSb3dzJywgJ2NvbGxhcHNlQWxsUm93cycsXG4gICAgICAgICd1cGRhdGVGb3JtYXRUZXh0JywgJ3VwZGF0ZUNlbGxCeUlkJ1xuICAgIF07XG5cbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnYm9vdHN0cmFwLnRhYmxlJyksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBCb290c3RyYXBUYWJsZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9uID09PSAnb2JqZWN0JyAmJiBvcHRpb24pO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KG9wdGlvbiwgYWxsb3dlZE1ldGhvZHMpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1ldGhvZDogXCIgKyBvcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgYXJncyk7XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlRGF0YSgnYm9vdHN0cmFwLnRhYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5kYXRhKCdib290c3RyYXAudGFibGUnLCAoZGF0YSA9IG5ldyBCb290c3RyYXBUYWJsZSh0aGlzLCBvcHRpb25zKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5Db25zdHJ1Y3RvciA9IEJvb3RzdHJhcFRhYmxlO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMgPSBCb290c3RyYXBUYWJsZS5ERUZBVUxUUztcbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLmNvbHVtbkRlZmF1bHRzID0gQm9vdHN0cmFwVGFibGUuQ09MVU1OX0RFRkFVTFRTO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcyA9IEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5tZXRob2RzID0gYWxsb3dlZE1ldGhvZHM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS51dGlscyA9IHtcbiAgICAgICAgYm9vdHN0cmFwVmVyc2lvbjogYm9vdHN0cmFwVmVyc2lvbixcbiAgICAgICAgc3ByaW50Zjogc3ByaW50ZixcbiAgICAgICAgY29tcGFyZU9iamVjdHM6IGNvbXBhcmVPYmplY3RzLFxuICAgICAgICBjYWxjdWxhdGVPYmplY3RWYWx1ZTogY2FsY3VsYXRlT2JqZWN0VmFsdWUsXG4gICAgICAgIGdldEl0ZW1GaWVsZDogZ2V0SXRlbUZpZWxkLFxuICAgICAgICBvYmplY3RLZXlzOiBvYmplY3RLZXlzLFxuICAgICAgICBpc0lFQnJvd3NlcjogaXNJRUJyb3dzZXJcbiAgICB9O1xuXG4gICAgLy8gQk9PVFNUUkFQIFRBQkxFIElOSVRcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRhYmxlXCJdJykuYm9vdHN0cmFwVGFibGUoKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAtdGFibGUvZGlzdC9ib290c3RyYXAtdGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2Jvb3RzdHJhcC10YWJsZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDEwIl0sInNvdXJjZVJvb3QiOiIifQ==