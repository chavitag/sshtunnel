webpackJsonp([13],{

/***/ "./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js":
/*!*************************************************************************!*\
  !*** ./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/**
 * @author: Dennis Hernández
 * @webSite: http://djhvscf.github.io/Blog
 * @version: v2.1.2
 */

(function ($) {

    'use strict';

    var sprintf = $.fn.bootstrapTable.utils.sprintf,
        objectKeys = $.fn.bootstrapTable.utils.objectKeys;

    var getOptionsFromSelectControl = function getOptionsFromSelectControl(selectControl) {
        return selectControl.get(selectControl.length - 1).options;
    };

    var hideUnusedSelectOptions = function hideUnusedSelectOptions(selectControl, uniqueValues) {
        var options = getOptionsFromSelectControl(selectControl);

        for (var i = 0; i < options.length; i++) {
            if (options[i].value !== "") {
                if (!uniqueValues.hasOwnProperty(options[i].value)) {
                    selectControl.find(sprintf("option[value='%s']", options[i].value)).hide();
                } else {
                    selectControl.find(sprintf("option[value='%s']", options[i].value)).show();
                }
            }
        }
    };

    var addOptionToSelectControl = function addOptionToSelectControl(selectControl, value, text) {
        value = $.trim(value);
        selectControl = $(selectControl.get(selectControl.length - 1));
        if (!existOptionInSelectControl(selectControl, value)) {
            selectControl.append($("<option></option>").attr("value", value).text($('<div />').html(text).text()));
        }
    };

    var sortSelectControl = function sortSelectControl(selectControl) {
        selectControl = $(selectControl.get(selectControl.length - 1));
        var $opts = selectControl.find('option:gt(0)');

        $opts.sort(function (a, b) {
            a = $(a).text().toLowerCase();
            b = $(b).text().toLowerCase();
            if ($.isNumeric(a) && $.isNumeric(b)) {
                // Convert numerical values from string to float.
                a = parseFloat(a);
                b = parseFloat(b);
            }
            return a > b ? 1 : a < b ? -1 : 0;
        });

        selectControl.find('option:gt(0)').remove();
        selectControl.append($opts);
    };

    var existOptionInSelectControl = function existOptionInSelectControl(selectControl, value) {
        var options = getOptionsFromSelectControl(selectControl);
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === value.toString()) {
                //The value is not valid to add
                return true;
            }
        }

        //If we get here, the value is valid to add
        return false;
    };

    var fixHeaderCSS = function fixHeaderCSS(that) {
        //that.$tableHeader.css('height', '77px');
    };

    var getCurrentHeader = function getCurrentHeader(that) {
        var header = that.$header;
        if (that.options.height) {
            header = that.$tableHeader;
        }

        return header;
    };

    var getCurrentSearchControls = function getCurrentSearchControls(that) {
        var searchControls = 'select, input';
        if (that.options.height) {
            searchControls = 'table select, table input';
        }

        return searchControls;
    };

    var getCursorPosition = function getCursorPosition(el) {
        if ($.fn.bootstrapTable.utils.isIEBrowser()) {
            if ($(el).is('input[type=text]')) {
                var pos = 0;
                if ('selectionStart' in el) {
                    pos = el.selectionStart;
                } else if ('selection' in document) {
                    el.focus();
                    var Sel = document.selection.createRange();
                    var SelLength = document.selection.createRange().text.length;
                    Sel.moveStart('character', -el.value.length);
                    pos = Sel.text.length - SelLength;
                }
                return pos;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    };

    var setCursorPosition = function setCursorPosition(el) {
        $(el).val(el.value);
    };

    var copyValues = function copyValues(that) {
        var header = getCurrentHeader(that),
            searchControls = getCurrentSearchControls(that);

        that.options.valuesFilterControl = [];

        header.find(searchControls).each(function () {
            that.options.valuesFilterControl.push({
                field: $(this).closest('[data-field]').data('field'),
                value: $(this).val(),
                position: getCursorPosition($(this).get(0))
            });
        });
    };

    var setValues = function setValues(that) {
        var field = null,
            result = [],
            header = getCurrentHeader(that),
            searchControls = getCurrentSearchControls(that);

        if (that.options.valuesFilterControl.length > 0) {
            header.find(searchControls).each(function (index, ele) {
                field = $(this).closest('[data-field]').data('field');
                result = $.grep(that.options.valuesFilterControl, function (valueObj) {
                    return valueObj.field === field;
                });

                if (result.length > 0) {
                    $(this).val(result[0].value);
                    setCursorPosition($(this).get(0), result[0].position);
                }
            });
        }
    };

    var collectBootstrapCookies = function cookiesRegex() {
        var cookies = [],
            foundCookies = document.cookie.match(/(?:bs.table.)(\w*)/g);

        if (foundCookies) {
            $.each(foundCookies, function (i, cookie) {
                if (/./.test(cookie)) {
                    cookie = cookie.split(".").pop();
                }

                if ($.inArray(cookie, cookies) === -1) {
                    cookies.push(cookie);
                }
            });
            return cookies;
        }
    };

    var initFilterSelectControls = function initFilterSelectControls(that) {
        var data = that.data,
            itemsPerPage = that.pageTo < that.options.data.length ? that.options.data.length : that.pageTo,
            isColumnSearchableViaSelect = function isColumnSearchableViaSelect(column) {
            return column.filterControl && column.filterControl.toLowerCase() === 'select' && column.searchable;
        },
            isFilterDataNotGiven = function isFilterDataNotGiven(column) {
            return column.filterData === undefined || column.filterData.toLowerCase() === 'column';
        },
            hasSelectControlElement = function hasSelectControlElement(selectControl) {
            return selectControl && selectControl.length > 0;
        };

        var z = that.options.pagination ? that.options.sidePagination === 'server' ? that.pageTo : that.options.totalRows : that.pageTo;

        $.each(that.header.fields, function (j, field) {
            var column = that.columns[that.fieldsColumnsIndex[field]],
                selectControl = $('.bootstrap-table-filter-control-' + escapeID(column.field));

            if (isColumnSearchableViaSelect(column) && hasSelectControlElement(selectControl)) {
                //column.filterValues=$("<textarea/>").html(column.filterValues).text();
                if (selectControl.get(selectControl.length - 1).options.length === 0) {
                    //Added the default option
                    addOptionToSelectControl(selectControl, '', '');
                }

                if (isFilterDataNotGiven(column)) {
                    var uniqueValues = {};
                    for (var i = 0; i < z; i++) {
                        //Added a new value
                        var fieldValue = data[i][field],
                            formattedValue = $.fn.bootstrapTable.utils.calculateObjectValue(that.header, that.header.formatters[j], [fieldValue, data[i], i], fieldValue);
                        uniqueValues[formattedValue] = fieldValue;
                    }

                    for (var key in uniqueValues) {
                        addOptionToSelectControl(selectControl, uniqueValues[key], key);
                    }

                    sortSelectControl(selectControl);

                    if (that.options.hideUnusedSelectOptions) {
                        hideUnusedSelectOptions(selectControl, uniqueValues);
                    }
                } else {
                    if (column.filterData !== undefined && column.filterData.toLowerCase() !== 'column') {
                        var filterDataMethod = getFilterDataMethod(filterDataMethods, column.filterData.substring(0, column.filterData.indexOf(':')));
                        var filterDataSource = column.filterData.substring(column.filterData.indexOf(':') + 1, column.filterData.length);
                        filterDataMethod(filterDataSource, selectControl);
                    }
                }
            }
        });
    };

    var escapeID = function escapeID(id) {
        return String(id).replace(/(:|\.|\[|\]|,)/g, "\\$1");
    };

    var createControls = function createControls(that, header) {
        var addedFilterControl = false,
            isVisible,
            html;

        var lastchild = header.find("tr:last-child");
        html = [];

        if (that.options.detailView) html.push('<td><div class="row"  style="margin: 0px"></div></td>');

        $.each(that.columns, function (i, column) {
            isVisible = 'hidden';

            if (!column.visible) return;

            if (!column.filterControl) {
                html.push('<td><div class="row" style="margin: 0px"></div></td>');
            } else {
                html.push('<td><div class="row" style="margin: 0px">');
                var nameControl = column.filterControl.toLowerCase();
                if (column.searchable && that.options.filterTemplate[nameControl]) {
                    addedFilterControl = true;
                    isVisible = 'visible';
                    html.push(that.options.filterTemplate[nameControl](that, column.field, isVisible, column.filterControlPlaceholder ? column.filterControlPlaceholder : "", "filter-control-" + i));
                }
                html.push('</td>');
            }

            /*$.each(header.children().children(), function (i, tr) {
                tr = $(tr);
                if (tr.data('field') === column.field) {
            var cell=tr.find('.fht-cell');
                    cell.append(html.join(''));
            //cell.addClass(".bst-search-row");
            //cell.hide();
                    return false;
                }
            });*/
            /*if (column.filterData !== undefined && column.filterData.toLowerCase() !== 'column') {
            	var filterDataType = getFilterDataMethod(filterDataMethods, column.filterData.substring(0, column.filterData.indexOf(':')));
            	var filterDataSource, selectControl;
            		if (filterDataType !== null) {
            		filterDataSource = column.filterData.substring(column.filterData.indexOf(':') + 1, column.filterData.length);
            		selectControl = $('.bootstrap-table-filter-control-' + escapeID(column.field));
            		//addOptionToSelectControl(selectControl, '', '');
            		filterDataType(filterDataSource, selectControl);
            	} else {
            		throw new SyntaxError('Error. You should use any of these allowed filter data methods: var, json, url.' + ' Use like this: var: {key: "value"}');
            	}
                         var variableValues, key;
                        switch (filterDataType) {
                            case 'url':
                                $.ajax({
                                    url: filterDataSource,
                                    dataType: 'json',
                                    success: function (data) {
                                        for (var key in data) {
                                            addOptionToSelectControl(selectControl, key, data[key]);
                                        }
                                        sortSelectControl(selectControl);
                                    }
                                });
                                break;
                            case 'var':
                                variableValues = window[filterDataSource];
                                for (key in variableValues) {
            alert("Adding key "+key+" "+JSON.stringify(variableValues));
                                    addOptionToSelectControl(selectControl, key, variableValues[key]);
                                }
                                sortSelectControl(selectControl);
                                break;
                            case 'json':
                                variableValues = JSON.parse(filterDataSource);
                                for (key in variableValues) {
                                    addOptionToSelectControl(selectControl, key, variableValues[key]);
                                }
                                sortSelectControl(selectControl);
                                break;
                        }
                    }*/
        });
        lastchild.after("<tr style='display:none' class='bst-search-row'>" + html.join('') + "</tr>");

        if (addedFilterControl) {
            header.off('keyup', 'input').on('keyup', 'input', function (event) {
                if (that.options.searchOnEnterKey && event.keyCode !== 13) {
                    return;
                }

                if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
                    return;
                }

                clearTimeout(event.currentTarget.timeoutId || 0);
                event.currentTarget.timeoutId = setTimeout(function () {
                    that.onColumnSearch(event);
                }, that.options.searchTimeOut);
            });

            header.off('change', 'select').on('change', 'select', function (event) {
                if (that.options.searchOnEnterKey && event.keyCode !== 13) {
                    return;
                }

                if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
                    return;
                }

                clearTimeout(event.currentTarget.timeoutId || 0);
                event.currentTarget.timeoutId = setTimeout(function () {
                    that.onColumnSearch(event);
                }, that.options.searchTimeOut);
            });

            header.off('mouseup', 'input').on('mouseup', 'input', function (event) {
                var $input = $(this),
                    oldValue = $input.val();

                if (oldValue === "") {
                    return;
                }

                setTimeout(function () {
                    var newValue = $input.val();

                    if (newValue === "") {
                        clearTimeout(event.currentTarget.timeoutId || 0);
                        event.currentTarget.timeoutId = setTimeout(function () {
                            that.onColumnSearch(event);
                        }, that.options.searchTimeOut);
                    }
                }, 1);
            });

            if (header.find('.parsed-control').length > 0) {
                $.each(that.columns, function (i, column) {
                    if (column.filterControl !== undefined && column.filterControl.toLowerCase() === 'datepicker') {
                        header.find('.date-filter-control.bootstrap-table-filter-control-' + column.field).datepicker(column.filterDatepickerOptions).on('changeDate', function (e) {
                            $(sprintf("#%s", e.currentTarget.id)).val(e.currentTarget.value);
                            //Fired the keyup event
                            $(e.currentTarget).keyup();
                        });
                    }
                    /*if (column.filterControl !== undefined && column.filterControl.toLowerCase() === 'select') {
                        header.find('.select-filter-control.bootstrap-table-filter-control-' + column.field).selectpicker();
                    }*/
                });
            }
        } else {
            header.find('.filterControl').hide();
        }
    };

    var getDirectionOfSelectOptions = function getDirectionOfSelectOptions(alignment) {
        alignment = alignment === undefined ? 'left' : alignment.toLowerCase();

        switch (alignment) {
            case 'left':
                return 'ltr';
            case 'right':
                return 'rtl';
            case 'auto':
                return 'auto';
            default:
                return 'ltr';
        }
    };

    var filterDataMethods = {
        'var': function _var(filterDataSource, selectControl) {
            var txt = $("<textarea/>").html(filterDataSource).text();
            var variableValues = JSON.parse(txt);
            for (var key in variableValues) {
                addOptionToSelectControl(selectControl, key, variableValues[key]);
            }
            sortSelectControl(selectControl);
        },
        'url': function url(filterDataSource, selectControl) {
            $.ajax({
                url: filterDataSource,
                dataType: 'json',
                success: function success(data) {
                    for (var key in data) {
                        addOptionToSelectControl(selectControl, key, data[key]);
                    }
                    sortSelectControl(selectControl);
                }
            });
        },
        'json': function json(filterDataSource, selectControl) {
            var variableValues = JSON.parse(filterDataSource);
            for (var key in variableValues) {
                addOptionToSelectControl(selectControl, key, variableValues[key]);
            }
            sortSelectControl(selectControl);
        }
    };

    var getFilterDataMethod = function getFilterDataMethod(objFilterDataMethod, searchTerm) {
        var keys = Object.keys(objFilterDataMethod);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === searchTerm) {
                return objFilterDataMethod[searchTerm];
            }
        }
        return null;
    };

    $.extend($.fn.bootstrapTable.defaults, {
        filterControl: false,
        onColumnSearch: function onColumnSearch(field, text) {
            return false;
        },
        filterShowClear: false,
        alignmentSelectControlOptions: undefined,
        filterTemplate: {
            input: function input(that, field, isVisible, placeholder) {
                var input = '<input type="text" class="form-control border-right-0 border bootstrap-table-filter-control-%s" visibility: %s" placeholder="%s">';
                return sprintf('<div class="input-group col-md-12">' + input + '<span class="input-group-append"><button class="btn btn-outline-secondary border-left-0 border" type="button"  style="padding-top: 2px; padding-bottom: 2px;"><i class="fa fa-trash"></i></button></span></div>', field, isVisible, placeholder);
            },
            select: function select(that, field, isVisible) {
                var select = '<select style="padding: 2px; height: auto;" class="form-control parsed-control select-filter-control border-right-0 border bootstrap-table-filter-control-%s" visibility: %s" dir="%s">';
                select = select + '</select>';
                return sprintf('<div class="input-group selectpicker col-md-12 multiple">' + select + '<span class="input-group-append"><button class="btn btn-outline-secondary border-left-0 border" type="button" style="padding-top:2px; padding-bottom: 2px"><i class="fa fa-trash"></i></button></span></div>', field, isVisible, getDirectionOfSelectOptions(that.options.alignmentSelectControlOptions));
            },
            datepicker: function datepicker(that, field, isVisible) {
                return sprintf('<input type="text" class="form-control parsed-control date-filter-control bootstrap-table-filter-control-%s" style="width: 100%; visibility: %s">', field, isVisible);
            }
        },
        disableControlWhenSearch: false,
        searchOnEnterKey: false,
        //internal variables
        valuesFilterControl: []
    });

    $.extend($.fn.bootstrapTable.columnDefaults, {
        filterControl: undefined,
        filterData: undefined,
        filterDatepickerOptions: undefined,
        filterStrictSearch: false,
        filterStartsWithSearch: false,
        filterControlPlaceholder: ""
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'column-search.bs.table': 'onColumnSearch'
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
        clear: 'fa-trash',
        open: 'fa-search-plus icon.clear'
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatClearFilters: function formatClearFilters() {
            return 'Clear Filters';
        },
        formatOpenFilters: function formatOpenFilters() {
            return 'Open Filters';
        }
    });

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    $.fn.bootstrapTable.methods.push('triggerSearch');

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _initToolbar = BootstrapTable.prototype.initToolbar,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initBody = BootstrapTable.prototype.initBody,
        _initSearch = BootstrapTable.prototype.initSearch;

    BootstrapTable.prototype.init = function () {
        //Make sure that the filterControl option is set
        if (this.options.filterControl) {
            var that = this;

            // Compatibility: IE < 9 and old browsers
            if (!Object.keys) {
                objectKeys();
            }

            //Make sure that the internal variables are set correctly
            this.options.valuesFilterControl = [];

            /*this.$el.on('reset-view.bs.table', function () {
                //Create controls on $tableHeader if the height is set
                if (!that.options.height) {
                    return;
                }
                //Avoid recreate the controls
                if (that.$tableHeader.find('select').length > 0 || that.$tableHeader.find('input').length > 0) {
                    return;
                }
            var searchrow=that.$header.find(".bst-search-row");
            if (searchrow.length) {
            that.$header.find(".bst-search-row td:last-child").html("Vaya Vaya...&lt;");
            return;
            }
                 //createControls(that, that.$tableHeader);
            }).on('post-body.bs.table', function () {
                if (that.options.height) {
                    fixHeaderCSS(that);
            })*/
            this.$el.on('post-header.bs.table', function () {
                setValues(that);
            }).on('column-switch.bs.table', function () {
                setValues(that);
            }).on('load-success.bs.table', function () {
                that.EnableControls(true);
            }).on('load-error.bs.table', function () {
                that.EnableControls(true);
            });
        }
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this;
        this.showToolbar = this.showToolbar || this.options.filterControl && this.options.filterShowClear;

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.filterControl && this.options.filterShowClear) {
            var $btnGroup = this.$toolbar.find('>.btn-group'),
                $btnClear = $btnGroup.find('.filter-show-clear'),
                $btnOpen = $btnGroup.find('.filter-show-open');

            if (!$btnClear.length) {
                $btnClear = $([sprintf('<button class="btn btn-%s filter-show-clear" ', this.options.buttonsClass), sprintf('type="button" title="%s">', this.options.formatClearFilters()), sprintf('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.clear), '</button>'].join('')).appendTo($btnGroup);

                $btnClear.off('click').on('click', $.proxy(this.clearFilterControl, this));
            }
            if (!$btnOpen.length) {
                $btnOpen = $([sprintf('<button class="btn btn-%s filter-show-open" ', this.options.buttonsClass), sprintf('type="button" title="%s">', this.options.formatOpenFilters()), sprintf('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.open), '</button>'].join('')).appendTo($btnGroup);

                $btnOpen.off('click').on('click', function () {
                    var $bst = that.$el.find(".bst-search-row");
                    if ($bst.length) $bst.toggle();
                });
            }
        }
    };

    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.filterControl) {
            return;
        }
        createControls(this, this.$header);
    };

    BootstrapTable.prototype.initBody = function () {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));
        if (this.options.data.length == 0) return;
        initFilterSelectControls(this);
    };

    BootstrapTable.prototype.initSearch = function () {
        _initSearch.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.sidePagination === 'server') {
            return;
        }

        var that = this;
        var fp = $.isEmptyObject(that.filterColumnsPartial) ? null : that.filterColumnsPartial;

        //Check partial column filter
        that.data = fp ? $.grep(that.data, function (item, i) {
            for (var key in fp) {
                var thisColumn = that.columns[that.fieldsColumnsIndex[key]];
                var fval = fp[key].toLowerCase();
                var value = item[key];

                // Fix #142: search use formated data
                if (thisColumn && thisColumn.searchFormatter) {
                    value = $.fn.bootstrapTable.utils.calculateObjectValue(that.header, that.header.formatters[$.inArray(key, that.header.fields)], [value, item, i], value);
                }

                if ($.inArray(key, that.header.fields) !== -1) {
                    if (typeof value === 'string' || typeof value === 'number') {
                        if (thisColumn.filterStrictSearch) {
                            if (value.toString().toLowerCase() === fval.toString().toLowerCase()) {
                                return true;
                            }
                        } else if (thisColumn.filterStartsWithSearch) {
                            if ((value + '').toLowerCase().indexOf(fval) === 0) {
                                return true;
                            }
                        } else {
                            if ((value + '').toLowerCase().indexOf(fval) !== -1) {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }) : that.data;
    };

    BootstrapTable.prototype.initColumnSearch = function (filterColumnsDefaults) {
        copyValues(this);

        if (filterColumnsDefaults) {
            this.filterColumnsPartial = filterColumnsDefaults;
            this.updatePagination();

            for (var filter in filterColumnsDefaults) {
                this.trigger('column-search', filter, filterColumnsDefaults[filter]);
            }
        }
    };

    BootstrapTable.prototype.onColumnSearch = function (event) {
        if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
            return;
        }

        copyValues(this);
        var text = $.trim($(event.currentTarget).val());
        var $field = $(event.currentTarget).closest('[data-field]').data('field');

        if ($.isEmptyObject(this.filterColumnsPartial)) {
            this.filterColumnsPartial = {};
        }
        if (text) {
            this.filterColumnsPartial[$field] = text;
        } else {
            delete this.filterColumnsPartial[$field];
        }

        // if the searchText is the same as the previously selected column value,
        // bootstrapTable will not try searching again (even though the selected column
        // may be different from the previous search).  As a work around
        // we're manually appending some text to bootrap's searchText field
        // to guarantee that it will perform a search again when we call this.onSearch(event)
        this.searchText += "randomText";

        this.options.pageNumber = 1;
        this.EnableControls(false);
        this.onSearch(event);
        this.trigger('column-search', $field, text);
    };

    BootstrapTable.prototype.clearFilterControl = function () {
        if (this.options.filterControl && this.options.filterShowClear) {
            var that = this,
                cookies = collectBootstrapCookies(),
                header = getCurrentHeader(that),
                table = header.closest('table'),
                controls = header.find(getCurrentSearchControls(that)),
                search = that.$toolbar.find('.search input'),
                timeoutId = 0;

            $.each(that.options.valuesFilterControl, function (i, item) {
                item.value = '';
            });

            setValues(that);

            // Clear each type of filter if it exists.
            // Requires the body to reload each time a type of filter is found because we never know
            // which ones are going to be present.
            if (controls.length > 0) {
                this.filterColumnsPartial = {};
                $(controls[0]).trigger(controls[0].tagName === 'INPUT' ? 'keyup' : 'change');
            } else {
                return;
            }

            if (search.length > 0) {
                that.resetSearch();
            }

            // use the default sort order if it exists. do nothing if it does not
            if (that.options.sortName !== table.data('sortName') || that.options.sortOrder !== table.data('sortOrder')) {
                var sorter = header.find(sprintf('[data-field="%s"]', $(controls[0]).closest('table').data('sortName')));
                if (sorter.length > 0) {
                    that.onSort(table.data('sortName'), table.data('sortName'));
                    $(sorter).find('.sortable').trigger('click');
                }
            }

            // clear cookies once the filters are clean
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                if (cookies && cookies.length > 0) {
                    $.each(cookies, function (i, item) {
                        if (that.deleteCookie !== undefined) {
                            that.deleteCookie(item);
                        }
                    });
                }
            }, that.options.searchTimeOut);
        }
    };

    BootstrapTable.prototype.triggerSearch = function () {
        var header = getCurrentHeader(this),
            searchControls = getCurrentSearchControls(this);

        header.find(searchControls).each(function () {
            var el = $(this);
            if (el.is('select')) {
                el.change();
            } else {
                el.keyup();
            }
        });
    };

    BootstrapTable.prototype.EnableControls = function (enable) {
        if (this.options.disableControlWhenSearch && this.options.sidePagination === 'server') {
            var header = getCurrentHeader(this),
                searchControls = getCurrentSearchControls(this);

            if (!enable) {
                header.find(searchControls).prop('disabled', 'disabled');
            } else {
                header.find(searchControls).removeProp('disabled');
            }
        }
    };
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

},["./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYm9vdHN0cmFwLXRhYmxlL2ZpbHRlci1yb3cvYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1yb3cuanMiXSwibmFtZXMiOlsiJCIsInNwcmludGYiLCJmbiIsImJvb3RzdHJhcFRhYmxlIiwidXRpbHMiLCJvYmplY3RLZXlzIiwiZ2V0T3B0aW9uc0Zyb21TZWxlY3RDb250cm9sIiwic2VsZWN0Q29udHJvbCIsImdldCIsImxlbmd0aCIsIm9wdGlvbnMiLCJoaWRlVW51c2VkU2VsZWN0T3B0aW9ucyIsInVuaXF1ZVZhbHVlcyIsImkiLCJ2YWx1ZSIsImhhc093blByb3BlcnR5IiwiZmluZCIsImhpZGUiLCJzaG93IiwiYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sIiwidGV4dCIsInRyaW0iLCJleGlzdE9wdGlvbkluU2VsZWN0Q29udHJvbCIsImFwcGVuZCIsImF0dHIiLCJodG1sIiwic29ydFNlbGVjdENvbnRyb2wiLCIkb3B0cyIsInNvcnQiLCJhIiwiYiIsInRvTG93ZXJDYXNlIiwiaXNOdW1lcmljIiwicGFyc2VGbG9hdCIsInJlbW92ZSIsInRvU3RyaW5nIiwiZml4SGVhZGVyQ1NTIiwidGhhdCIsImdldEN1cnJlbnRIZWFkZXIiLCJoZWFkZXIiLCIkaGVhZGVyIiwiaGVpZ2h0IiwiJHRhYmxlSGVhZGVyIiwiZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzIiwic2VhcmNoQ29udHJvbHMiLCJnZXRDdXJzb3JQb3NpdGlvbiIsImVsIiwiaXNJRUJyb3dzZXIiLCJpcyIsInBvcyIsInNlbGVjdGlvblN0YXJ0IiwiZG9jdW1lbnQiLCJmb2N1cyIsIlNlbCIsInNlbGVjdGlvbiIsImNyZWF0ZVJhbmdlIiwiU2VsTGVuZ3RoIiwibW92ZVN0YXJ0Iiwic2V0Q3Vyc29yUG9zaXRpb24iLCJ2YWwiLCJjb3B5VmFsdWVzIiwidmFsdWVzRmlsdGVyQ29udHJvbCIsImVhY2giLCJwdXNoIiwiZmllbGQiLCJjbG9zZXN0IiwiZGF0YSIsInBvc2l0aW9uIiwic2V0VmFsdWVzIiwicmVzdWx0IiwiaW5kZXgiLCJlbGUiLCJncmVwIiwidmFsdWVPYmoiLCJjb2xsZWN0Qm9vdHN0cmFwQ29va2llcyIsImNvb2tpZXNSZWdleCIsImNvb2tpZXMiLCJmb3VuZENvb2tpZXMiLCJjb29raWUiLCJtYXRjaCIsInRlc3QiLCJzcGxpdCIsInBvcCIsImluQXJyYXkiLCJpbml0RmlsdGVyU2VsZWN0Q29udHJvbHMiLCJpdGVtc1BlclBhZ2UiLCJwYWdlVG8iLCJpc0NvbHVtblNlYXJjaGFibGVWaWFTZWxlY3QiLCJjb2x1bW4iLCJmaWx0ZXJDb250cm9sIiwic2VhcmNoYWJsZSIsImlzRmlsdGVyRGF0YU5vdEdpdmVuIiwiZmlsdGVyRGF0YSIsInVuZGVmaW5lZCIsImhhc1NlbGVjdENvbnRyb2xFbGVtZW50IiwieiIsInBhZ2luYXRpb24iLCJzaWRlUGFnaW5hdGlvbiIsInRvdGFsUm93cyIsImZpZWxkcyIsImoiLCJjb2x1bW5zIiwiZmllbGRzQ29sdW1uc0luZGV4IiwiZXNjYXBlSUQiLCJmaWVsZFZhbHVlIiwiZm9ybWF0dGVkVmFsdWUiLCJjYWxjdWxhdGVPYmplY3RWYWx1ZSIsImZvcm1hdHRlcnMiLCJrZXkiLCJmaWx0ZXJEYXRhTWV0aG9kIiwiZ2V0RmlsdGVyRGF0YU1ldGhvZCIsImZpbHRlckRhdGFNZXRob2RzIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsImZpbHRlckRhdGFTb3VyY2UiLCJpZCIsIlN0cmluZyIsInJlcGxhY2UiLCJjcmVhdGVDb250cm9scyIsImFkZGVkRmlsdGVyQ29udHJvbCIsImlzVmlzaWJsZSIsImxhc3RjaGlsZCIsImRldGFpbFZpZXciLCJ2aXNpYmxlIiwibmFtZUNvbnRyb2wiLCJmaWx0ZXJUZW1wbGF0ZSIsImZpbHRlckNvbnRyb2xQbGFjZWhvbGRlciIsImFmdGVyIiwiam9pbiIsIm9mZiIsIm9uIiwiZXZlbnQiLCJzZWFyY2hPbkVudGVyS2V5Iiwia2V5Q29kZSIsImNsZWFyVGltZW91dCIsImN1cnJlbnRUYXJnZXQiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0Iiwib25Db2x1bW5TZWFyY2giLCJzZWFyY2hUaW1lT3V0IiwiJGlucHV0Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImRhdGVwaWNrZXIiLCJmaWx0ZXJEYXRlcGlja2VyT3B0aW9ucyIsImUiLCJrZXl1cCIsImdldERpcmVjdGlvbk9mU2VsZWN0T3B0aW9ucyIsImFsaWdubWVudCIsInR4dCIsInZhcmlhYmxlVmFsdWVzIiwiSlNPTiIsInBhcnNlIiwiYWpheCIsInVybCIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm9iakZpbHRlckRhdGFNZXRob2QiLCJzZWFyY2hUZXJtIiwia2V5cyIsIk9iamVjdCIsImV4dGVuZCIsImRlZmF1bHRzIiwiZmlsdGVyU2hvd0NsZWFyIiwiYWxpZ25tZW50U2VsZWN0Q29udHJvbE9wdGlvbnMiLCJpbnB1dCIsInBsYWNlaG9sZGVyIiwic2VsZWN0IiwiZGlzYWJsZUNvbnRyb2xXaGVuU2VhcmNoIiwiY29sdW1uRGVmYXVsdHMiLCJmaWx0ZXJTdHJpY3RTZWFyY2giLCJmaWx0ZXJTdGFydHNXaXRoU2VhcmNoIiwiQ29uc3RydWN0b3IiLCJFVkVOVFMiLCJpY29ucyIsImNsZWFyIiwib3BlbiIsImxvY2FsZXMiLCJmb3JtYXRDbGVhckZpbHRlcnMiLCJmb3JtYXRPcGVuRmlsdGVycyIsIm1ldGhvZHMiLCJCb290c3RyYXBUYWJsZSIsIl9pbml0IiwicHJvdG90eXBlIiwiaW5pdCIsIl9pbml0VG9vbGJhciIsImluaXRUb29sYmFyIiwiX2luaXRIZWFkZXIiLCJpbml0SGVhZGVyIiwiX2luaXRCb2R5IiwiaW5pdEJvZHkiLCJfaW5pdFNlYXJjaCIsImluaXRTZWFyY2giLCIkZWwiLCJFbmFibGVDb250cm9scyIsImFwcGx5IiwiQXJyYXkiLCJzbGljZSIsImFyZ3VtZW50cyIsInNob3dUb29sYmFyIiwiJGJ0bkdyb3VwIiwiJHRvb2xiYXIiLCIkYnRuQ2xlYXIiLCIkYnRuT3BlbiIsImJ1dHRvbnNDbGFzcyIsImljb25zUHJlZml4IiwiYXBwZW5kVG8iLCJwcm94eSIsImNsZWFyRmlsdGVyQ29udHJvbCIsIiRic3QiLCJ0b2dnbGUiLCJmcCIsImlzRW1wdHlPYmplY3QiLCJmaWx0ZXJDb2x1bW5zUGFydGlhbCIsIml0ZW0iLCJ0aGlzQ29sdW1uIiwiZnZhbCIsInNlYXJjaEZvcm1hdHRlciIsImluaXRDb2x1bW5TZWFyY2giLCJmaWx0ZXJDb2x1bW5zRGVmYXVsdHMiLCJ1cGRhdGVQYWdpbmF0aW9uIiwiZmlsdGVyIiwidHJpZ2dlciIsIiRmaWVsZCIsInNlYXJjaFRleHQiLCJwYWdlTnVtYmVyIiwib25TZWFyY2giLCJ0YWJsZSIsImNvbnRyb2xzIiwic2VhcmNoIiwidGFnTmFtZSIsInJlc2V0U2VhcmNoIiwic29ydE5hbWUiLCJzb3J0T3JkZXIiLCJzb3J0ZXIiLCJvblNvcnQiLCJkZWxldGVDb29raWUiLCJ0cmlnZ2VyU2VhcmNoIiwiY2hhbmdlIiwiZW5hYmxlIiwicHJvcCIsInJlbW92ZVByb3AiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBTUEsQ0FBQyxVQUFVQSxDQUFWLEVBQWE7O0FBRVY7O0FBRUEsUUFBSUMsVUFBVUQsRUFBRUUsRUFBRixDQUFLQyxjQUFMLENBQW9CQyxLQUFwQixDQUEwQkgsT0FBeEM7QUFBQSxRQUNJSSxhQUFhTCxFQUFFRSxFQUFGLENBQUtDLGNBQUwsQ0FBb0JDLEtBQXBCLENBQTBCQyxVQUQzQzs7QUFHQSxRQUFJQyw4QkFBOEIsU0FBOUJBLDJCQUE4QixDQUFVQyxhQUFWLEVBQXlCO0FBQ3ZELGVBQU9BLGNBQWNDLEdBQWQsQ0FBa0JELGNBQWNFLE1BQWQsR0FBdUIsQ0FBekMsRUFBNENDLE9BQW5EO0FBQ0gsS0FGRDs7QUFJQSxRQUFJQywwQkFBMEIsU0FBMUJBLHVCQUEwQixDQUFVSixhQUFWLEVBQXlCSyxZQUF6QixFQUF1QztBQUNqRSxZQUFJRixVQUFVSiw0QkFBNEJDLGFBQTVCLENBQWQ7O0FBRUEsYUFBSyxJQUFJTSxJQUFJLENBQWIsRUFB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WTtBQUNqRCxZQUFJdE0sU0FBU0QsaUJBQWlCLElBQWpCLENBQWI7QUFBQSxZQUNJTSxpQkFBaUJELHlCQUF5QixJQUF6QixDQURyQjs7QUFHQUosZUFBT3ZCLElBQVAsQ0FBWTRCLGNBQVosRUFBNEJrQixJQUE1QixDQUFpQyxZQUFZO0FBQ3pDLGdCQUFJaEIsS0FBSzlDLEVBQUUsSUFBRixDQUFUO0FBQ0EsZ0JBQUc4QyxHQUFHRSxFQUFILENBQU0sUUFBTixDQUFILEVBQW9CO0FBQ2hCRixtQkFBR2dNLE1BQUg7QUFDSCxhQUZELE1BRU87QUFDSGhNLG1CQUFHb0csS0FBSDtBQUNIO0FBQ0osU0FQRDtBQVFILEtBWkQ7O0FBY0FtQyxtQkFBZUUsU0FBZixDQUF5QlcsY0FBekIsR0FBMEMsVUFBUzZDLE1BQVQsRUFBaUI7QUFDdkQsWUFBSSxLQUFLck8sT0FBTCxDQUFhOEosd0JBQWQsSUFBNEMsS0FBSzlKLE9BQUwsQ0FBYXVGLGNBQWIsS0FBZ0MsUUFBL0UsRUFBMEY7QUFDdEYsZ0JBQUkxRCxTQUFTRCxpQkFBaUIsSUFBakIsQ0FBYjtBQUFBLGdCQUNBTSxpQkFBaUJELHlCQUF5QixJQUF6QixDQURqQjs7QUFHQSxnQkFBRyxDQUFDb00sTUFBSixFQUFZO0FBQ1J4TSx1QkFBT3ZCLElBQVAsQ0FBWTRCLGNBQVosRUFBNEJvTSxJQUE1QixDQUFpQyxVQUFqQyxFQUE2QyxVQUE3QztBQUNILGFBRkQsTUFFTztBQUNIek0sdUJBQU92QixJQUFQLENBQVk0QixjQUFaLEVBQTRCcU0sVUFBNUIsQ0FBdUMsVUFBdkM7QUFDSDtBQUNKO0FBQ0osS0FYRDtBQVlILENBOXdCRCxFQTh3QkdDLE1BOXdCSCxFIiwiZmlsZSI6ImpzL2Jvb3RzdHJhcC10YWJsZS1maWx0ZXItcm93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yOiBEZW5uaXMgSGVybsOhbmRlelxuICogQHdlYlNpdGU6IGh0dHA6Ly9kamh2c2NmLmdpdGh1Yi5pby9CbG9nXG4gKiBAdmVyc2lvbjogdjIuMS4yXG4gKi9cblxuKGZ1bmN0aW9uICgkKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgc3ByaW50ZiA9ICQuZm4uYm9vdHN0cmFwVGFibGUudXRpbHMuc3ByaW50ZixcbiAgICAgICAgb2JqZWN0S2V5cyA9ICQuZm4uYm9vdHN0cmFwVGFibGUudXRpbHMub2JqZWN0S2V5cztcblxuICAgIHZhciBnZXRPcHRpb25zRnJvbVNlbGVjdENvbnRyb2wgPSBmdW5jdGlvbiAoc2VsZWN0Q29udHJvbCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0Q29udHJvbC5nZXQoc2VsZWN0Q29udHJvbC5sZW5ndGggLSAxKS5vcHRpb25zO1xuICAgIH07XG5cbiAgICB2YXIgaGlkZVVudXNlZFNlbGVjdE9wdGlvbnMgPSBmdW5jdGlvbiAoc2VsZWN0Q29udHJvbCwgdW5pcXVlVmFsdWVzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gZ2V0T3B0aW9uc0Zyb21TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbaV0udmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXVuaXF1ZVZhbHVlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zW2ldLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RDb250cm9sLmZpbmQoc3ByaW50ZihcIm9wdGlvblt2YWx1ZT0nJXMnXVwiLCBvcHRpb25zW2ldLnZhbHVlKSkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdENvbnRyb2wuZmluZChzcHJpbnRmKFwib3B0aW9uW3ZhbHVlPSclcyddXCIsIG9wdGlvbnNbaV0udmFsdWUpKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2wgPSBmdW5jdGlvbiAoc2VsZWN0Q29udHJvbCwgdmFsdWUsIHRleHQpIHtcbiAgICAgICAgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xuICAgICAgICBzZWxlY3RDb250cm9sID0gJChzZWxlY3RDb250cm9sLmdldChzZWxlY3RDb250cm9sLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgaWYgKCFleGlzdE9wdGlvbkluU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIHNlbGVjdENvbnRyb2wuYXBwZW5kKCQoXCI8b3B0aW9uPjwvb3B0aW9uPlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpXG4gICAgICAgICAgICAgICAgLnRleHQoJCgnPGRpdiAvPicpLmh0bWwodGV4dCkudGV4dCgpKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNvcnRTZWxlY3RDb250cm9sID0gZnVuY3Rpb24gKHNlbGVjdENvbnRyb2wpIHtcbiAgICAgICAgICAgIHNlbGVjdENvbnRyb2wgPSAkKHNlbGVjdENvbnRyb2wuZ2V0KHNlbGVjdENvbnRyb2wubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgdmFyICRvcHRzID0gc2VsZWN0Q29udHJvbC5maW5kKCdvcHRpb246Z3QoMCknKTtcblxuICAgICAgICAgICAgJG9wdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIGEgPSAkKGEpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGIgPSAkKGIpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyhhKSAmJiAkLmlzTnVtZXJpYyhiKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IG51bWVyaWNhbCB2YWx1ZXMgZnJvbSBzdHJpbmcgdG8gZmxvYXQuXG4gICAgICAgICAgICAgICAgICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuICAgICAgICAgICAgICAgICAgICBiID0gcGFyc2VGbG9hdChiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGVjdENvbnRyb2wuZmluZCgnb3B0aW9uOmd0KDApJykucmVtb3ZlKCk7XG4gICAgICAgICAgICBzZWxlY3RDb250cm9sLmFwcGVuZCgkb3B0cyk7XG4gICAgfTtcblxuICAgIHZhciBleGlzdE9wdGlvbkluU2VsZWN0Q29udHJvbCA9IGZ1bmN0aW9uIChzZWxlY3RDb250cm9sLCB2YWx1ZSkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnNGcm9tU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9uc1tpXS52YWx1ZSA9PT0gdmFsdWUudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgIC8vVGhlIHZhbHVlIGlzIG5vdCB2YWxpZCB0byBhZGRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSWYgd2UgZ2V0IGhlcmUsIHRoZSB2YWx1ZSBpcyB2YWxpZCB0byBhZGRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgZml4SGVhZGVyQ1NTID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICAgICAgLy90aGF0LiR0YWJsZUhlYWRlci5jc3MoJ2hlaWdodCcsICc3N3B4Jyk7XG4gICAgfTtcblxuICAgIHZhciBnZXRDdXJyZW50SGVhZGVyID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoYXQuJGhlYWRlcjtcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIGhlYWRlciA9IHRoYXQuJHRhYmxlSGVhZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcjtcbiAgICB9O1xuXG4gICAgdmFyIGdldEN1cnJlbnRTZWFyY2hDb250cm9scyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgICAgIHZhciBzZWFyY2hDb250cm9scyA9ICdzZWxlY3QsIGlucHV0JztcbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHNlYXJjaENvbnRyb2xzID0gJ3RhYmxlIHNlbGVjdCwgdGFibGUgaW5wdXQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlYXJjaENvbnRyb2xzO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0Q3Vyc29yUG9zaXRpb24gPSBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoJC5mbi5ib290c3RyYXBUYWJsZS51dGlscy5pc0lFQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBpZiAoJChlbCkuaXMoJ2lucHV0W3R5cGU9dGV4dF0nKSkge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgICAgICAgICAgIGlmICgnc2VsZWN0aW9uU3RhcnQnIGluIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGVsLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJ3NlbGVjdGlvbicgaW4gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIFNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgU2VsTGVuZ3RoID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIFNlbC5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1lbC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBTZWwudGV4dC5sZW5ndGggLSBTZWxMZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0Q3Vyc29yUG9zaXRpb24gPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgJChlbCkudmFsKGVsLnZhbHVlKTtcbiAgICB9O1xuXG4gICAgdmFyIGNvcHlWYWx1ZXMgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgICAgICB2YXIgaGVhZGVyID0gZ2V0Q3VycmVudEhlYWRlcih0aGF0KSxcbiAgICAgICAgICAgIHNlYXJjaENvbnRyb2xzID0gZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzKHRoYXQpO1xuXG4gICAgICAgIHRoYXQub3B0aW9ucy52YWx1ZXNGaWx0ZXJDb250cm9sID0gW107XG5cbiAgICAgICAgaGVhZGVyLmZpbmQoc2VhcmNoQ29udHJvbHMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC5vcHRpb25zLnZhbHVlc0ZpbHRlckNvbnRyb2wucHVzaChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAkKHRoaXMpLmNsb3Nlc3QoJ1tkYXRhLWZpZWxkXScpLmRhdGEoJ2ZpZWxkJyksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAkKHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZ2V0Q3Vyc29yUG9zaXRpb24oJCh0aGlzKS5nZXQoMCkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2V0VmFsdWVzID0gZnVuY3Rpb24odGhhdCkge1xuICAgICAgICB2YXIgZmllbGQgPSBudWxsLFxuICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICBoZWFkZXIgPSBnZXRDdXJyZW50SGVhZGVyKHRoYXQpLFxuICAgICAgICAgICAgc2VhcmNoQ29udHJvbHMgPSBnZXRDdXJyZW50U2VhcmNoQ29udHJvbHModGhhdCk7XG5cbiAgICAgICAgaWYgKHRoYXQub3B0aW9ucy52YWx1ZXNGaWx0ZXJDb250cm9sLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhlYWRlci5maW5kKHNlYXJjaENvbnRyb2xzKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlKSB7XG4gICAgICAgICAgICAgICAgZmllbGQgPSAkKHRoaXMpLmNsb3Nlc3QoJ1tkYXRhLWZpZWxkXScpLmRhdGEoJ2ZpZWxkJyk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gJC5ncmVwKHRoYXQub3B0aW9ucy52YWx1ZXNGaWx0ZXJDb250cm9sLCBmdW5jdGlvbiAodmFsdWVPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlT2JqLmZpZWxkID09PSBmaWVsZDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbChyZXN1bHRbMF0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzZXRDdXJzb3JQb3NpdGlvbigkKHRoaXMpLmdldCgwKSwgcmVzdWx0WzBdLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY29sbGVjdEJvb3RzdHJhcENvb2tpZXMgPSBmdW5jdGlvbiBjb29raWVzUmVnZXgoKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gW10sXG4gICAgICAgICAgICBmb3VuZENvb2tpZXMgPSBkb2N1bWVudC5jb29raWUubWF0Y2goLyg/OmJzLnRhYmxlLikoXFx3KikvZyk7XG5cbiAgICAgICAgaWYgKGZvdW5kQ29va2llcykge1xuICAgICAgICAgICAgJC5lYWNoKGZvdW5kQ29va2llcywgZnVuY3Rpb24gKGksIGNvb2tpZSkge1xuICAgICAgICAgICAgICAgIGlmICgvLi8udGVzdChjb29raWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZSA9IGNvb2tpZS5zcGxpdChcIi5cIikucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShjb29raWUsIGNvb2tpZXMpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb29raWVzLnB1c2goY29va2llKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjb29raWVzO1xuICAgICAgICB9XG4gICAgfTtcblxuXHR2YXIgaW5pdEZpbHRlclNlbGVjdENvbnRyb2xzID0gZnVuY3Rpb24gKHRoYXQpIHtcblx0XHR2YXIgZGF0YSA9IHRoYXQuZGF0YSxcblx0XHRcdGl0ZW1zUGVyUGFnZSA9IHRoYXQucGFnZVRvIDwgdGhhdC5vcHRpb25zLmRhdGEubGVuZ3RoID8gdGhhdC5vcHRpb25zLmRhdGEubGVuZ3RoIDogdGhhdC5wYWdlVG8sXG5cblx0XHRcdGlzQ29sdW1uU2VhcmNoYWJsZVZpYVNlbGVjdCA9IGZ1bmN0aW9uIChjb2x1bW4pIHtcblx0XHRcdFx0cmV0dXJuIGNvbHVtbi5maWx0ZXJDb250cm9sICYmIGNvbHVtbi5maWx0ZXJDb250cm9sLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnICYmIGNvbHVtbi5zZWFyY2hhYmxlO1xuXHRcdFx0fSxcblxuXHRcdFx0aXNGaWx0ZXJEYXRhTm90R2l2ZW4gPSBmdW5jdGlvbiAoY29sdW1uKSB7XG5cdFx0XHRcdHJldHVybiBjb2x1bW4uZmlsdGVyRGF0YSA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbi5maWx0ZXJEYXRhLnRvTG93ZXJDYXNlKCkgPT09ICdjb2x1bW4nO1xuXHRcdFx0fSxcblxuXHRcdFx0aGFzU2VsZWN0Q29udHJvbEVsZW1lbnQgPSBmdW5jdGlvbiAoc2VsZWN0Q29udHJvbCkge1xuXHRcdFx0XHRyZXR1cm4gc2VsZWN0Q29udHJvbCAmJiBzZWxlY3RDb250cm9sLmxlbmd0aCA+IDA7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgeiA9IHRoYXQub3B0aW9ucy5wYWdpbmF0aW9uID9cblx0XHRcdFx0KHRoYXQub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicgPyB0aGF0LnBhZ2VUbyA6IHRoYXQub3B0aW9ucy50b3RhbFJvd3MpIDpcblx0XHRcdFx0dGhhdC5wYWdlVG87XG5cblx0XHRcdCQuZWFjaCh0aGF0LmhlYWRlci5maWVsZHMsIGZ1bmN0aW9uIChqLCBmaWVsZCkge1xuXHRcdFx0XHR2YXIgXHRjb2x1bW4gPSB0aGF0LmNvbHVtbnNbdGhhdC5maWVsZHNDb2x1bW5zSW5kZXhbZmllbGRdXSxcblx0XHRcdFx0XHRcdHNlbGVjdENvbnRyb2wgPSAkKCcuYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1jb250cm9sLScgKyBlc2NhcGVJRChjb2x1bW4uZmllbGQpKTtcblxuXHRcdFx0XHRpZiAoaXNDb2x1bW5TZWFyY2hhYmxlVmlhU2VsZWN0KGNvbHVtbikgJiYgaGFzU2VsZWN0Q29udHJvbEVsZW1lbnQoc2VsZWN0Q29udHJvbCkpIHtcblx0XHRcdFx0XHQgLy9jb2x1bW4uZmlsdGVyVmFsdWVzPSQoXCI8dGV4dGFyZWEvPlwiKS5odG1sKGNvbHVtbi5maWx0ZXJWYWx1ZXMpLnRleHQoKTtcblx0XHRcdFx0XHRpZiAoc2VsZWN0Q29udHJvbC5nZXQoc2VsZWN0Q29udHJvbC5sZW5ndGggLSAxKS5vcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0Ly9BZGRlZCB0aGUgZGVmYXVsdCBvcHRpb25cblx0XHRcdFx0XHRcdGFkZE9wdGlvblRvU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sLCAnJywgJycpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpc0ZpbHRlckRhdGFOb3RHaXZlbihjb2x1bW4pKSB7XG5cdFx0XHRcdFx0XHR2YXIgdW5pcXVlVmFsdWVzID0ge307XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHQvL0FkZGVkIGEgbmV3IHZhbHVlXG5cdFx0XHRcdFx0XHRcdHZhciBmaWVsZFZhbHVlID0gZGF0YVtpXVtmaWVsZF0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdHRlZFZhbHVlID0gJC5mbi5ib290c3RyYXBUYWJsZS51dGlscy5jYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGF0LmhlYWRlciwgdGhhdC5oZWFkZXIuZm9ybWF0dGVyc1tqXSwgW2ZpZWxkVmFsdWUsIGRhdGFbaV0sIGldLCBmaWVsZFZhbHVlKTtcblx0XHRcdFx0XHRcdFx0dW5pcXVlVmFsdWVzW2Zvcm1hdHRlZFZhbHVlXSA9IGZpZWxkVmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gdW5pcXVlVmFsdWVzKSB7XG5cdFx0XHRcdFx0XHRhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwgdW5pcXVlVmFsdWVzW2tleV0sIGtleSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c29ydFNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG5cblx0XHRcdFx0XHRpZiAodGhhdC5vcHRpb25zLmhpZGVVbnVzZWRTZWxlY3RPcHRpb25zKSB7XG5cdFx0XHRcdFx0XHRoaWRlVW51c2VkU2VsZWN0T3B0aW9ucyhzZWxlY3RDb250cm9sLCB1bmlxdWVWYWx1ZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoY29sdW1uLmZpbHRlckRhdGEgIT09IHVuZGVmaW5lZCAmJiBjb2x1bW4uZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpICE9PSAnY29sdW1uJykge1xuXHRcdFx0XHRcdFx0dmFyIGZpbHRlckRhdGFNZXRob2QgPSBnZXRGaWx0ZXJEYXRhTWV0aG9kKGZpbHRlckRhdGFNZXRob2RzLCBjb2x1bW4uZmlsdGVyRGF0YS5zdWJzdHJpbmcoMCwgY29sdW1uLmZpbHRlckRhdGEuaW5kZXhPZignOicpKSk7XG5cdFx0XHRcdFx0XHR2YXIgZmlsdGVyRGF0YVNvdXJjZSA9IGNvbHVtbi5maWx0ZXJEYXRhLnN1YnN0cmluZyhjb2x1bW4uZmlsdGVyRGF0YS5pbmRleE9mKCc6JykgKyAxLCBjb2x1bW4uZmlsdGVyRGF0YS5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0ZmlsdGVyRGF0YU1ldGhvZChmaWx0ZXJEYXRhU291cmNlLCBzZWxlY3RDb250cm9sKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuICAgIHZhciBlc2NhcGVJRCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgcmV0dXJuIFN0cmluZyhpZCkucmVwbGFjZSggLyg6fFxcLnxcXFt8XFxdfCwpL2csIFwiXFxcXCQxXCIgKTtcbiAgICB9O1xuXG5cdHZhciBjcmVhdGVDb250cm9scyA9IGZ1bmN0aW9uICh0aGF0LCBoZWFkZXIpIHtcblx0XHR2YXIgYWRkZWRGaWx0ZXJDb250cm9sID0gZmFsc2UsXG5cdFx0XHRcdGlzVmlzaWJsZSxcblx0XHRcdFx0aHRtbDtcblxuXHRcdHZhciBsYXN0Y2hpbGQ9aGVhZGVyLmZpbmQoXCJ0cjpsYXN0LWNoaWxkXCIpO1xuXHRcdGh0bWwgPSBbXTtcblxuXHRcdGlmICh0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldykgaHRtbC5wdXNoKCc8dGQ+PGRpdiBjbGFzcz1cInJvd1wiICBzdHlsZT1cIm1hcmdpbjogMHB4XCI+PC9kaXY+PC90ZD4nKTtcbiAgXG5cdFx0JC5lYWNoKHRoYXQuY29sdW1ucywgZnVuY3Rpb24gKGksIGNvbHVtbikge1xuXHRcdFx0aXNWaXNpYmxlID0gJ2hpZGRlbic7XG5cblx0XHRcdGlmICghY29sdW1uLnZpc2libGUpIHJldHVybjtcblxuXHRcdFx0aWYgKCFjb2x1bW4uZmlsdGVyQ29udHJvbCkge1xuXHRcdFx0XHRodG1sLnB1c2goJzx0ZD48ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJtYXJnaW46IDBweFwiPjwvZGl2PjwvdGQ+Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRodG1sLnB1c2goJzx0ZD48ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJtYXJnaW46IDBweFwiPicpO1xuXHRcdFx0XHR2YXIgbmFtZUNvbnRyb2wgPSBjb2x1bW4uZmlsdGVyQ29udHJvbC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRpZiAoY29sdW1uLnNlYXJjaGFibGUgJiYgdGhhdC5vcHRpb25zLmZpbHRlclRlbXBsYXRlW25hbWVDb250cm9sXSkge1xuXHRcdFx0XHRcdGFkZGVkRmlsdGVyQ29udHJvbCA9IHRydWU7XG5cdFx0XHRcdFx0aXNWaXNpYmxlID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGh0bWwucHVzaCh0aGF0Lm9wdGlvbnMuZmlsdGVyVGVtcGxhdGVbbmFtZUNvbnRyb2xdKHRoYXQsIGNvbHVtbi5maWVsZCwgaXNWaXNpYmxlLCBjb2x1bW4uZmlsdGVyQ29udHJvbFBsYWNlaG9sZGVyID8gY29sdW1uLmZpbHRlckNvbnRyb2xQbGFjZWhvbGRlciA6IFwiXCIsIFwiZmlsdGVyLWNvbnRyb2wtXCIgKyBpKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aHRtbC5wdXNoKCc8L3RkPicpO1xuXHRcdFx0fVxuXG4gICAgICAgICAgICAvKiQuZWFjaChoZWFkZXIuY2hpbGRyZW4oKS5jaGlsZHJlbigpLCBmdW5jdGlvbiAoaSwgdHIpIHtcbiAgICAgICAgICAgICAgICB0ciA9ICQodHIpO1xuICAgICAgICAgICAgICAgIGlmICh0ci5kYXRhKCdmaWVsZCcpID09PSBjb2x1bW4uZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGNlbGw9dHIuZmluZCgnLmZodC1jZWxsJyk7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuYXBwZW5kKGh0bWwuam9pbignJykpO1xuXHRcdFx0XHRcdFx0ICAvL2NlbGwuYWRkQ2xhc3MoXCIuYnN0LXNlYXJjaC1yb3dcIik7XG5cdFx0XHRcdFx0XHQgIC8vY2VsbC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTsqL1xuXHRcdFx0XHQvKmlmIChjb2x1bW4uZmlsdGVyRGF0YSAhPT0gdW5kZWZpbmVkICYmIGNvbHVtbi5maWx0ZXJEYXRhLnRvTG93ZXJDYXNlKCkgIT09ICdjb2x1bW4nKSB7XG5cdFx0XHRcdFx0dmFyIGZpbHRlckRhdGFUeXBlID0gZ2V0RmlsdGVyRGF0YU1ldGhvZChmaWx0ZXJEYXRhTWV0aG9kcywgY29sdW1uLmZpbHRlckRhdGEuc3Vic3RyaW5nKDAsIGNvbHVtbi5maWx0ZXJEYXRhLmluZGV4T2YoJzonKSkpO1xuXHRcdFx0XHRcdHZhciBmaWx0ZXJEYXRhU291cmNlLCBzZWxlY3RDb250cm9sO1xuXG5cdFx0XHRcdFx0aWYgKGZpbHRlckRhdGFUeXBlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJEYXRhU291cmNlID0gY29sdW1uLmZpbHRlckRhdGEuc3Vic3RyaW5nKGNvbHVtbi5maWx0ZXJEYXRhLmluZGV4T2YoJzonKSArIDEsIGNvbHVtbi5maWx0ZXJEYXRhLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRzZWxlY3RDb250cm9sID0gJCgnLmJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0nICsgZXNjYXBlSUQoY29sdW1uLmZpZWxkKSk7XG5cdFx0XHRcdFx0XHQvL2FkZE9wdGlvblRvU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sLCAnJywgJycpO1xuXHRcdFx0XHRcdFx0ZmlsdGVyRGF0YVR5cGUoZmlsdGVyRGF0YVNvdXJjZSwgc2VsZWN0Q29udHJvbCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBTeW50YXhFcnJvcignRXJyb3IuIFlvdSBzaG91bGQgdXNlIGFueSBvZiB0aGVzZSBhbGxvd2VkIGZpbHRlciBkYXRhIG1ldGhvZHM6IHZhciwganNvbiwgdXJsLicgKyAnIFVzZSBsaWtlIHRoaXM6IHZhcjoge2tleTogXCJ2YWx1ZVwifScpO1xuXHRcdFx0XHRcdH1cblxuICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZVZhbHVlcywga2V5O1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZmlsdGVyRGF0YVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBmaWx0ZXJEYXRhU291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZE9wdGlvblRvU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sLCBrZXksIGRhdGFba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydFNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndmFyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlVmFsdWVzID0gd2luZG93W2ZpbHRlckRhdGFTb3VyY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gdmFyaWFibGVWYWx1ZXMpIHtcbmFsZXJ0KFwiQWRkaW5nIGtleSBcIitrZXkrXCIgXCIrSlNPTi5zdHJpbmdpZnkodmFyaWFibGVWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCB2YXJpYWJsZVZhbHVlc1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVWYWx1ZXMgPSBKU09OLnBhcnNlKGZpbHRlckRhdGFTb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gdmFyaWFibGVWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCB2YXJpYWJsZVZhbHVlc1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSovXG4gICAgICAgIH0pO1xuXHRcdCAgbGFzdGNoaWxkLmFmdGVyKFwiPHRyIHN0eWxlPSdkaXNwbGF5Om5vbmUnIGNsYXNzPSdic3Qtc2VhcmNoLXJvdyc+XCIraHRtbC5qb2luKCcnKStcIjwvdHI+XCIpO1xuXG4gICAgICAgIGlmIChhZGRlZEZpbHRlckNvbnRyb2wpIHtcbiAgICAgICAgICAgIGhlYWRlci5vZmYoJ2tleXVwJywgJ2lucHV0Jykub24oJ2tleXVwJywgJ2lucHV0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zZWFyY2hPbkVudGVyS2V5ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGV2ZW50LmtleUNvZGUsIFszNywgMzgsIDM5LCA0MF0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChldmVudC5jdXJyZW50VGFyZ2V0LnRpbWVvdXRJZCB8fCAwKTtcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQ29sdW1uU2VhcmNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaGVhZGVyLm9mZignY2hhbmdlJywgJ3NlbGVjdCcpLm9uKCdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zZWFyY2hPbkVudGVyS2V5ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGV2ZW50LmtleUNvZGUsIFszNywgMzgsIDM5LCA0MF0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChldmVudC5jdXJyZW50VGFyZ2V0LnRpbWVvdXRJZCB8fCAwKTtcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQ29sdW1uU2VhcmNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaGVhZGVyLm9mZignbW91c2V1cCcsICdpbnB1dCcpLm9uKCdtb3VzZXVwJywgJ2lucHV0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgb2xkVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGV2ZW50LmN1cnJlbnRUYXJnZXQudGltZW91dElkIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQ29sdW1uU2VhcmNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoYXQub3B0aW9ucy5zZWFyY2hUaW1lT3V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChoZWFkZXIuZmluZCgnLnBhcnNlZC1jb250cm9sJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQuZWFjaCh0aGF0LmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5maWx0ZXJDb250cm9sICE9PSB1bmRlZmluZWQgJiYgY29sdW1uLmZpbHRlckNvbnRyb2wudG9Mb3dlckNhc2UoKSA9PT0gJ2RhdGVwaWNrZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIuZmluZCgnLmRhdGUtZmlsdGVyLWNvbnRyb2wuYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1jb250cm9sLScgKyBjb2x1bW4uZmllbGQpLmRhdGVwaWNrZXIoY29sdW1uLmZpbHRlckRhdGVwaWNrZXJPcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlRGF0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoc3ByaW50ZihcIiMlc1wiLCBlLmN1cnJlbnRUYXJnZXQuaWQpKS52YWwoZS5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9GaXJlZCB0aGUga2V5dXAgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmtleXVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyppZiAoY29sdW1uLmZpbHRlckNvbnRyb2wgIT09IHVuZGVmaW5lZCAmJiBjb2x1bW4uZmlsdGVyQ29udHJvbC50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmZpbmQoJy5zZWxlY3QtZmlsdGVyLWNvbnRyb2wuYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1jb250cm9sLScgKyBjb2x1bW4uZmllbGQpLnNlbGVjdHBpY2tlcigpO1xuXHRcdFx0XHRcdFx0XHR9Ki9cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlci5maW5kKCcuZmlsdGVyQ29udHJvbCcpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0RGlyZWN0aW9uT2ZTZWxlY3RPcHRpb25zID0gZnVuY3Rpb24gKGFsaWdubWVudCkge1xuICAgICAgICBhbGlnbm1lbnQgPSBhbGlnbm1lbnQgPT09IHVuZGVmaW5lZCA/ICdsZWZ0JyA6IGFsaWdubWVudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIHN3aXRjaCAoYWxpZ25tZW50KSB7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2x0cic7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdydGwnO1xuICAgICAgICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdhdXRvJztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdsdHInO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaWx0ZXJEYXRhTWV0aG9kcyA9XG4gICAgICAgIHtcbiAgICAgICAgICAgICd2YXInOiBmdW5jdGlvbiAoZmlsdGVyRGF0YVNvdXJjZSwgc2VsZWN0Q29udHJvbCkge1xuXHRcdFx0XHRcdHZhciB0eHQ9JChcIjx0ZXh0YXJlYS8+XCIpLmh0bWwoZmlsdGVyRGF0YVNvdXJjZSkudGV4dCgpO1xuXHRcdFx0XHRcdHZhciB2YXJpYWJsZVZhbHVlcz1KU09OLnBhcnNlKHR4dCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhcmlhYmxlVmFsdWVzKSB7IFxuICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCB2YXJpYWJsZVZhbHVlc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc29ydFNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3VybCc6IGZ1bmN0aW9uIChmaWx0ZXJEYXRhU291cmNlLCBzZWxlY3RDb250cm9sKSB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBmaWx0ZXJEYXRhU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCBkYXRhW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydFNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnanNvbic6ZnVuY3Rpb24gKGZpbHRlckRhdGFTb3VyY2UsIHNlbGVjdENvbnRyb2wpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGVWYWx1ZXMgPSBKU09OLnBhcnNlKGZpbHRlckRhdGFTb3VyY2UpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YXJpYWJsZVZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCB2YXJpYWJsZVZhbHVlc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc29ydFNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB2YXIgZ2V0RmlsdGVyRGF0YU1ldGhvZCA9IGZ1bmN0aW9uIChvYmpGaWx0ZXJEYXRhTWV0aG9kLCBzZWFyY2hUZXJtKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqRmlsdGVyRGF0YU1ldGhvZCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtleXNbaV0gPT09IHNlYXJjaFRlcm0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqRmlsdGVyRGF0YU1ldGhvZFtzZWFyY2hUZXJtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgJC5leHRlbmQoJC5mbi5ib290c3RyYXBUYWJsZS5kZWZhdWx0cywge1xuICAgICAgICBmaWx0ZXJDb250cm9sOiBmYWxzZSxcbiAgICAgICAgb25Db2x1bW5TZWFyY2g6IGZ1bmN0aW9uIChmaWVsZCwgdGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJTaG93Q2xlYXI6IGZhbHNlLFxuICAgICAgICBhbGlnbm1lbnRTZWxlY3RDb250cm9sT3B0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICBmaWx0ZXJUZW1wbGF0ZToge1xuICAgICAgICAgICAgaW5wdXQ6IGZ1bmN0aW9uICh0aGF0LCBmaWVsZCwgaXNWaXNpYmxlLCBwbGFjZWhvbGRlcikge1xuXHRcdFx0XHRcdHZhciBpbnB1dD0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgYm9yZGVyLXJpZ2h0LTAgYm9yZGVyIGJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0lc1wiIHZpc2liaWxpdHk6ICVzXCIgcGxhY2Vob2xkZXI9XCIlc1wiPic7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwcmludGYoJzxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBjb2wtbWQtMTJcIj4nK2lucHV0Kyc8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWFwcGVuZFwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJvcmRlci1sZWZ0LTAgYm9yZGVyXCIgdHlwZT1cImJ1dHRvblwiICBzdHlsZT1cInBhZGRpbmctdG9wOiAycHg7IHBhZGRpbmctYm90dG9tOiAycHg7XCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT48L2J1dHRvbj48L3NwYW4+PC9kaXY+JywgZmllbGQsIGlzVmlzaWJsZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGVjdDogZnVuY3Rpb24gKHRoYXQsIGZpZWxkLCBpc1Zpc2libGUpIHtcblx0XHRcdFx0XHQgdmFyIHNlbGVjdD0nPHNlbGVjdCBzdHlsZT1cInBhZGRpbmc6IDJweDsgaGVpZ2h0OiBhdXRvO1wiIGNsYXNzPVwiZm9ybS1jb250cm9sIHBhcnNlZC1jb250cm9sIHNlbGVjdC1maWx0ZXItY29udHJvbCBib3JkZXItcmlnaHQtMCBib3JkZXIgYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1jb250cm9sLSVzXCIgdmlzaWJpbGl0eTogJXNcIiBkaXI9XCIlc1wiPic7XG5cdFx0XHRcdFx0IHNlbGVjdD1zZWxlY3QrJzwvc2VsZWN0Pic7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwcmludGYoJzxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBzZWxlY3RwaWNrZXIgY29sLW1kLTEyIG11bHRpcGxlXCI+JytzZWxlY3QrJzxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYm9yZGVyLWxlZnQtMCBib3JkZXJcIiB0eXBlPVwiYnV0dG9uXCIgc3R5bGU9XCJwYWRkaW5nLXRvcDoycHg7IHBhZGRpbmctYm90dG9tOiAycHhcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPjwvYnV0dG9uPjwvc3Bhbj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZCwgaXNWaXNpYmxlLCBnZXREaXJlY3Rpb25PZlNlbGVjdE9wdGlvbnModGhhdC5vcHRpb25zLmFsaWdubWVudFNlbGVjdENvbnRyb2xPcHRpb25zKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0ZXBpY2tlcjogZnVuY3Rpb24gKHRoYXQsIGZpZWxkLCBpc1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3ByaW50ZignPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgcGFyc2VkLWNvbnRyb2wgZGF0ZS1maWx0ZXItY29udHJvbCBib290c3RyYXAtdGFibGUtZmlsdGVyLWNvbnRyb2wtJXNcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyB2aXNpYmlsaXR5OiAlc1wiPicsIGZpZWxkLCBpc1Zpc2libGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlQ29udHJvbFdoZW5TZWFyY2g6IGZhbHNlLFxuICAgICAgICBzZWFyY2hPbkVudGVyS2V5OiBmYWxzZSxcbiAgICAgICAgLy9pbnRlcm5hbCB2YXJpYWJsZXNcbiAgICAgICAgdmFsdWVzRmlsdGVyQ29udHJvbDogW11cbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuY29sdW1uRGVmYXVsdHMsIHtcbiAgICAgICAgZmlsdGVyQ29udHJvbDogdW5kZWZpbmVkLFxuICAgICAgICBmaWx0ZXJEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGZpbHRlckRhdGVwaWNrZXJPcHRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgIGZpbHRlclN0cmljdFNlYXJjaDogZmFsc2UsXG4gICAgICAgIGZpbHRlclN0YXJ0c1dpdGhTZWFyY2g6IGZhbHNlLFxuICAgICAgICBmaWx0ZXJDb250cm9sUGxhY2Vob2xkZXI6IFwiXCJcbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuQ29uc3RydWN0b3IuRVZFTlRTLCB7XG4gICAgICAgICdjb2x1bW4tc2VhcmNoLmJzLnRhYmxlJzogJ29uQ29sdW1uU2VhcmNoJ1xuICAgIH0pO1xuXG4gICAgJC5leHRlbmQoJC5mbi5ib290c3RyYXBUYWJsZS5kZWZhdWx0cy5pY29ucywge1xuICAgICAgICBjbGVhcjogJ2ZhLXRyYXNoJyxcblx0XHQgIG9wZW46ICdmYS1zZWFyY2gtcGx1cyBpY29uLmNsZWFyJ1xuICAgIH0pO1xuXG4gICAgJC5leHRlbmQoJC5mbi5ib290c3RyYXBUYWJsZS5sb2NhbGVzLCB7XG4gICAgICAgIGZvcm1hdENsZWFyRmlsdGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdDbGVhciBGaWx0ZXJzJztcbiAgICAgICAgfSxcblx0XHQgIGZvcm1hdE9wZW5GaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICdPcGVuIEZpbHRlcnMnO1xuXHRcdFx0fVxuICAgIH0pO1xuXG4gICAgJC5leHRlbmQoJC5mbi5ib290c3RyYXBUYWJsZS5kZWZhdWx0cywgJC5mbi5ib290c3RyYXBUYWJsZS5sb2NhbGVzKTtcblxuICAgICQuZm4uYm9vdHN0cmFwVGFibGUubWV0aG9kcy5wdXNoKCd0cmlnZ2VyU2VhcmNoJyk7XG5cbiAgICB2YXIgQm9vdHN0cmFwVGFibGUgPSAkLmZuLmJvb3RzdHJhcFRhYmxlLkNvbnN0cnVjdG9yLFxuICAgICAgICBfaW5pdCA9IEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0LFxuICAgICAgICBfaW5pdFRvb2xiYXIgPSBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFRvb2xiYXIsXG4gICAgICAgIF9pbml0SGVhZGVyID0gQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRIZWFkZXIsXG4gICAgICAgIF9pbml0Qm9keSA9IEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0Qm9keSxcbiAgICAgICAgX2luaXRTZWFyY2ggPSBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFNlYXJjaDtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkgeyBcbiAgICAgICAgLy9NYWtlIHN1cmUgdGhhdCB0aGUgZmlsdGVyQ29udHJvbCBvcHRpb24gaXMgc2V0XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyQ29udHJvbCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBDb21wYXRpYmlsaXR5OiBJRSA8IDkgYW5kIG9sZCBicm93c2Vyc1xuICAgICAgICAgICAgaWYgKCFPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgICAgIG9iamVjdEtleXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9NYWtlIHN1cmUgdGhhdCB0aGUgaW50ZXJuYWwgdmFyaWFibGVzIGFyZSBzZXQgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudmFsdWVzRmlsdGVyQ29udHJvbCA9IFtdO1xuXG4gICAgICAgICAgICAvKnRoaXMuJGVsLm9uKCdyZXNldC12aWV3LmJzLnRhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vQ3JlYXRlIGNvbnRyb2xzIG9uICR0YWJsZUhlYWRlciBpZiB0aGUgaGVpZ2h0IGlzIHNldFxuICAgICAgICAgICAgICAgIGlmICghdGhhdC5vcHRpb25zLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vQXZvaWQgcmVjcmVhdGUgdGhlIGNvbnRyb2xzXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuJHRhYmxlSGVhZGVyLmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDAgfHwgdGhhdC4kdGFibGVIZWFkZXIuZmluZCgnaW5wdXQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cblx0XHRcdFx0dmFyIHNlYXJjaHJvdz10aGF0LiRoZWFkZXIuZmluZChcIi5ic3Qtc2VhcmNoLXJvd1wiKTtcblx0XHRcdFx0aWYgKHNlYXJjaHJvdy5sZW5ndGgpIHtcblx0XHRcdFx0ICB0aGF0LiRoZWFkZXIuZmluZChcIi5ic3Qtc2VhcmNoLXJvdyB0ZDpsYXN0LWNoaWxkXCIpLmh0bWwoXCJWYXlhIFZheWEuLi4mbHQ7XCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG4gICAgICAgICAgICAgICAgLy9jcmVhdGVDb250cm9scyh0aGF0LCB0aGF0LiR0YWJsZUhlYWRlcik7XG4gICAgICAgICAgICB9KS5vbigncG9zdC1ib2R5LmJzLnRhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpeEhlYWRlckNTUyh0aGF0KTtcbiAgICAgICAgICAgIH0pKi9cblx0XHRcdFx0dGhpcy4kZWwub24oJ3Bvc3QtaGVhZGVyLmJzLnRhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldFZhbHVlcyh0aGF0KTtcbiAgICAgICAgICAgIH0pLm9uKCdjb2x1bW4tc3dpdGNoLmJzLnRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0VmFsdWVzKHRoYXQpO1xuICAgICAgICAgICAgfSkub24oJ2xvYWQtc3VjY2Vzcy5icy50YWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuRW5hYmxlQ29udHJvbHModHJ1ZSk7XG4gICAgICAgICAgICB9KS5vbignbG9hZC1lcnJvci5icy50YWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuRW5hYmxlQ29udHJvbHModHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBfaW5pdC5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0VG9vbGJhciA9IGZ1bmN0aW9uICgpIHsgXG5cdFx0ICB2YXIgdGhhdD10aGlzO1xuICAgICAgICB0aGlzLnNob3dUb29sYmFyID0gdGhpcy5zaG93VG9vbGJhciB8fCB0aGlzLm9wdGlvbnMuZmlsdGVyQ29udHJvbCAmJiB0aGlzLm9wdGlvbnMuZmlsdGVyU2hvd0NsZWFyO1xuXG4gICAgICAgIF9pbml0VG9vbGJhci5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJDb250cm9sICYmIHRoaXMub3B0aW9ucy5maWx0ZXJTaG93Q2xlYXIpIHtcbiAgICAgICAgICAgIHZhciAkYnRuR3JvdXAgPSB0aGlzLiR0b29sYmFyLmZpbmQoJz4uYnRuLWdyb3VwJyksXG4gICAgICAgICAgICAgICAgJGJ0bkNsZWFyID0gJGJ0bkdyb3VwLmZpbmQoJy5maWx0ZXItc2hvdy1jbGVhcicpLFxuXHRcdFx0XHRcdCAkYnRuT3BlbiA9ICRidG5Hcm91cC5maW5kKCcuZmlsdGVyLXNob3ctb3BlbicpO1xuXG4gICAgICAgICAgICBpZiAoISRidG5DbGVhci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkYnRuQ2xlYXIgPSAkKFtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tJXMgZmlsdGVyLXNob3ctY2xlYXJcIiAnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZigndHlwZT1cImJ1dHRvblwiIHRpdGxlPVwiJXNcIj4nLCB0aGlzLm9wdGlvbnMuZm9ybWF0Q2xlYXJGaWx0ZXJzKCkpLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPiAnLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy5jbGVhciksXG4gICAgICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKSkuYXBwZW5kVG8oJGJ0bkdyb3VwKTtcblxuICAgICAgICAgICAgICAgJGJ0bkNsZWFyLm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMuY2xlYXJGaWx0ZXJDb250cm9sLCB0aGlzKSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoISRidG5PcGVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRidG5PcGVuID0gJChbXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLSVzIGZpbHRlci1zaG93LW9wZW5cIiAnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZigndHlwZT1cImJ1dHRvblwiIHRpdGxlPVwiJXNcIj4nLCB0aGlzLm9wdGlvbnMuZm9ybWF0T3BlbkZpbHRlcnMoKSksXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+ICcsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLm9wZW4pLFxuICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJykpLmFwcGVuZFRvKCRidG5Hcm91cCk7XG5cblx0XHRcdFx0XHQkYnRuT3Blbi5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgJGJzdD10aGF0LiRlbC5maW5kKFwiLmJzdC1zZWFyY2gtcm93XCIpO1xuXHRcdFx0XHRcdFx0aWYgKCRic3QubGVuZ3RoKSAkYnN0LnRvZ2dsZSgpO1xuXHRcdFx0XHRcdH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0SGVhZGVyID0gZnVuY3Rpb24gKCkgeyBcbiAgICAgICAgX2luaXRIZWFkZXIuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmZpbHRlckNvbnRyb2wpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVDb250cm9scyh0aGlzLCB0aGlzLiRoZWFkZXIpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdEJvZHkgPSBmdW5jdGlvbiAoKSB7IFxuICAgICAgICBfaW5pdEJvZHkuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpO1xuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgIGluaXRGaWx0ZXJTZWxlY3RDb250cm9scyh0aGlzKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbiAoKSB7IFxuICAgICAgICBfaW5pdFNlYXJjaC5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIGZwID0gJC5pc0VtcHR5T2JqZWN0KHRoYXQuZmlsdGVyQ29sdW1uc1BhcnRpYWwpID8gbnVsbCA6IHRoYXQuZmlsdGVyQ29sdW1uc1BhcnRpYWw7XG5cbiAgICAgICAgLy9DaGVjayBwYXJ0aWFsIGNvbHVtbiBmaWx0ZXJcbiAgICAgICAgdGhhdC5kYXRhID0gZnAgPyAkLmdyZXAodGhhdC5kYXRhLCBmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoaXNDb2x1bW4gPSB0aGF0LmNvbHVtbnNbdGhhdC5maWVsZHNDb2x1bW5zSW5kZXhba2V5XV07XG4gICAgICAgICAgICAgICAgdmFyIGZ2YWwgPSBmcFtrZXldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlbVtrZXldO1xuXG4gICAgICAgICAgICAgICAgLy8gRml4ICMxNDI6IHNlYXJjaCB1c2UgZm9ybWF0ZWQgZGF0YVxuICAgICAgICAgICAgICAgIGlmICh0aGlzQ29sdW1uICYmIHRoaXNDb2x1bW4uc2VhcmNoRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJC5mbi5ib290c3RyYXBUYWJsZS51dGlscy5jYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGF0LmhlYWRlcixcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuZm9ybWF0dGVyc1skLmluQXJyYXkoa2V5LCB0aGF0LmhlYWRlci5maWVsZHMpXSxcbiAgICAgICAgICAgICAgICAgICAgW3ZhbHVlLCBpdGVtLCBpXSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCQuaW5BcnJheShrZXksIHRoYXQuaGVhZGVyLmZpZWxkcykgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQ29sdW1uLmZpbHRlclN0cmljdFNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PT0gZnZhbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzQ29sdW1uLmZpbHRlclN0YXJ0c1dpdGhTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZigodmFsdWUgKyAnJykudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZ2YWwpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmdmFsKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pIDogdGhhdC5kYXRhO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdENvbHVtblNlYXJjaCA9IGZ1bmN0aW9uKGZpbHRlckNvbHVtbnNEZWZhdWx0cykge1xuICAgICAgICBjb3B5VmFsdWVzKHRoaXMpO1xuXG4gICAgICAgIGlmIChmaWx0ZXJDb2x1bW5zRGVmYXVsdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwgPSBmaWx0ZXJDb2x1bW5zRGVmYXVsdHM7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZmlsdGVyIGluIGZpbHRlckNvbHVtbnNEZWZhdWx0cykge1xuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NvbHVtbi1zZWFyY2gnLCBmaWx0ZXIsIGZpbHRlckNvbHVtbnNEZWZhdWx0c1tmaWx0ZXJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUub25Db2x1bW5TZWFyY2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBbMzcsIDM4LCAzOSwgNDBdKSA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb3B5VmFsdWVzKHRoaXMpO1xuICAgICAgICB2YXIgdGV4dCA9ICQudHJpbSgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpKTtcbiAgICAgICAgdmFyICRmaWVsZCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZmllbGRdJykuZGF0YSgnZmllbGQnKTtcblxuICAgICAgICBpZiAoJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwpKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWxbJGZpZWxkXSA9IHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbFskZmllbGRdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIHNlYXJjaFRleHQgaXMgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgY29sdW1uIHZhbHVlLFxuICAgICAgICAvLyBib290c3RyYXBUYWJsZSB3aWxsIG5vdCB0cnkgc2VhcmNoaW5nIGFnYWluIChldmVuIHRob3VnaCB0aGUgc2VsZWN0ZWQgY29sdW1uXG4gICAgICAgIC8vIG1heSBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgcHJldmlvdXMgc2VhcmNoKS4gIEFzIGEgd29yayBhcm91bmRcbiAgICAgICAgLy8gd2UncmUgbWFudWFsbHkgYXBwZW5kaW5nIHNvbWUgdGV4dCB0byBib290cmFwJ3Mgc2VhcmNoVGV4dCBmaWVsZFxuICAgICAgICAvLyB0byBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIHBlcmZvcm0gYSBzZWFyY2ggYWdhaW4gd2hlbiB3ZSBjYWxsIHRoaXMub25TZWFyY2goZXZlbnQpXG4gICAgICAgIHRoaXMuc2VhcmNoVGV4dCArPSBcInJhbmRvbVRleHRcIjtcblxuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgIHRoaXMuRW5hYmxlQ29udHJvbHMoZmFsc2UpO1xuICAgICAgICB0aGlzLm9uU2VhcmNoKGV2ZW50KTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjb2x1bW4tc2VhcmNoJywgJGZpZWxkLCB0ZXh0KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNsZWFyRmlsdGVyQ29udHJvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJDb250cm9sICYmIHRoaXMub3B0aW9ucy5maWx0ZXJTaG93Q2xlYXIpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjb29raWVzID0gY29sbGVjdEJvb3RzdHJhcENvb2tpZXMoKSxcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBnZXRDdXJyZW50SGVhZGVyKHRoYXQpLFxuICAgICAgICAgICAgICAgIHRhYmxlID0gaGVhZGVyLmNsb3Nlc3QoJ3RhYmxlJyksXG4gICAgICAgICAgICAgICAgY29udHJvbHMgPSBoZWFkZXIuZmluZChnZXRDdXJyZW50U2VhcmNoQ29udHJvbHModGhhdCkpLFxuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHRoYXQuJHRvb2xiYXIuZmluZCgnLnNlYXJjaCBpbnB1dCcpLFxuICAgICAgICAgICAgICAgIHRpbWVvdXRJZCA9IDA7XG5cbiAgICAgICAgICAgICQuZWFjaCh0aGF0Lm9wdGlvbnMudmFsdWVzRmlsdGVyQ29udHJvbCwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2V0VmFsdWVzKHRoYXQpO1xuXG4gICAgICAgICAgICAvLyBDbGVhciBlYWNoIHR5cGUgb2YgZmlsdGVyIGlmIGl0IGV4aXN0cy5cbiAgICAgICAgICAgIC8vIFJlcXVpcmVzIHRoZSBib2R5IHRvIHJlbG9hZCBlYWNoIHRpbWUgYSB0eXBlIG9mIGZpbHRlciBpcyBmb3VuZCBiZWNhdXNlIHdlIG5ldmVyIGtub3dcbiAgICAgICAgICAgIC8vIHdoaWNoIG9uZXMgYXJlIGdvaW5nIHRvIGJlIHByZXNlbnQuXG4gICAgICAgICAgICBpZiAoY29udHJvbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWwgPSB7fTtcbiAgICAgICAgICAgICAgICAkKGNvbnRyb2xzWzBdKS50cmlnZ2VyKGNvbnRyb2xzWzBdLnRhZ05hbWUgPT09ICdJTlBVVCcgPyAna2V5dXAnIDogJ2NoYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoYXQucmVzZXRTZWFyY2goKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdXNlIHRoZSBkZWZhdWx0IHNvcnQgb3JkZXIgaWYgaXQgZXhpc3RzLiBkbyBub3RoaW5nIGlmIGl0IGRvZXMgbm90XG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNvcnROYW1lICE9PSB0YWJsZS5kYXRhKCdzb3J0TmFtZScpIHx8IHRoYXQub3B0aW9ucy5zb3J0T3JkZXIgIT09IHRhYmxlLmRhdGEoJ3NvcnRPcmRlcicpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRlciA9IGhlYWRlci5maW5kKHNwcmludGYoJ1tkYXRhLWZpZWxkPVwiJXNcIl0nLCAkKGNvbnRyb2xzWzBdKS5jbG9zZXN0KCd0YWJsZScpLmRhdGEoJ3NvcnROYW1lJykpKTtcbiAgICAgICAgICAgICAgICBpZiAoc29ydGVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vblNvcnQodGFibGUuZGF0YSgnc29ydE5hbWUnKSwgdGFibGUuZGF0YSgnc29ydE5hbWUnKSk7XG4gICAgICAgICAgICAgICAgICAgICQoc29ydGVyKS5maW5kKCcuc29ydGFibGUnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2xlYXIgY29va2llcyBvbmNlIHRoZSBmaWx0ZXJzIGFyZSBjbGVhblxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29va2llcyAmJiBjb29raWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGNvb2tpZXMsIGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5kZWxldGVDb29raWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGVsZXRlQ29va2llKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRyaWdnZXJTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSBnZXRDdXJyZW50SGVhZGVyKHRoaXMpLFxuICAgICAgICAgICAgc2VhcmNoQ29udHJvbHMgPSBnZXRDdXJyZW50U2VhcmNoQ29udHJvbHModGhpcyk7XG5cbiAgICAgICAgaGVhZGVyLmZpbmQoc2VhcmNoQ29udHJvbHMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmKGVsLmlzKCdzZWxlY3QnKSkge1xuICAgICAgICAgICAgICAgIGVsLmNoYW5nZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5rZXl1cCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLkVuYWJsZUNvbnRyb2xzID0gZnVuY3Rpb24oZW5hYmxlKSB7XG4gICAgICAgIGlmKCh0aGlzLm9wdGlvbnMuZGlzYWJsZUNvbnRyb2xXaGVuU2VhcmNoKSAmJiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykpIHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBnZXRDdXJyZW50SGVhZGVyKHRoaXMpLFxuICAgICAgICAgICAgc2VhcmNoQ29udHJvbHMgPSBnZXRDdXJyZW50U2VhcmNoQ29udHJvbHModGhpcyk7XG5cbiAgICAgICAgICAgIGlmKCFlbmFibGUpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXIuZmluZChzZWFyY2hDb250cm9scykucHJvcCgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyLmZpbmQoc2VhcmNoQ29udHJvbHMpLnJlbW92ZVByb3AoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2Fzc2V0cy9ib290c3RyYXAtdGFibGUvZmlsdGVyLXJvdy9ib290c3RyYXAtdGFibGUtZmlsdGVyLXJvdy5qcyJdLCJzb3VyY2VSb290IjoiIn0=