(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/bootstrap-table-filter-row"],{

/***/ "./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js":
/*!*************************************************************************!*\
  !*** ./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js ***!
  \*************************************************************************/
/*! no static exports found */
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
    } //If we get here, the value is valid to add


    return false;
  };

  var fixHeaderCSS = function fixHeaderCSS(that) {//that.$tableHeader.css('height', '77px');
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
              $(sprintf("#%s", e.currentTarget.id)).val(e.currentTarget.value); //Fired the keyup event

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
      var that = this; // Compatibility: IE < 9 and old browsers

      if (!Object.keys) {
        objectKeys();
      } //Make sure that the internal variables are set correctly


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
    var fp = $.isEmptyObject(that.filterColumnsPartial) ? null : that.filterColumnsPartial; //Check partial column filter

    that.data = fp ? $.grep(that.data, function (item, i) {
      for (var key in fp) {
        var thisColumn = that.columns[that.fieldsColumnsIndex[key]];
        var fval = fp[key].toLowerCase();
        var value = item[key]; // Fix #142: search use formated data

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
    } // if the searchText is the same as the previously selected column value,
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
      setValues(that); // Clear each type of filter if it exists.
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
      } // use the default sort order if it exists. do nothing if it does not


      if (that.options.sortName !== table.data('sortName') || that.options.sortOrder !== table.data('sortOrder')) {
        var sorter = header.find(sprintf('[data-field="%s"]', $(controls[0]).closest('table').data('sortName')));

        if (sorter.length > 0) {
          that.onSort(table.data('sortName'), table.data('sortName'));
          $(sorter).find('.sortable').trigger('click');
        }
      } // clear cookies once the filters are clean


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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

},[["./assets/bootstrap-table/filter-row/bootstrap-table-filter-row.js","runtime","vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYm9vdHN0cmFwLXRhYmxlL2ZpbHRlci1yb3cvYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1yb3cuanMiXSwibmFtZXMiOlsiJCIsInNwcmludGYiLCJmbiIsImJvb3RzdHJhcFRhYmxlIiwidXRpbHMiLCJvYmplY3RLZXlzIiwiZ2V0T3B0aW9uc0Zyb21TZWxlY3RDb250cm9sIiwic2VsZWN0Q29udHJvbCIsImdldCIsImxlbmd0aCIsIm9wdGlvbnMiLCJoaWRlVW51c2VkU2VsZWN0T3B0aW9ucyIsInVuaXF1ZVZhbHVlcyIsImkiLCJ2YWx1ZSIsImhhc093blByb3BlcnR5IiwiZmluZCIsImhpZGUiLCJzaG93IiwiYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sIiwidGV4dCIsInRyaW0iLCJleGlzdE9wdGlvbkluU2VsZWN0Q29udHJvbCIsImFwcGVuZCIsImF0dHIiLCJodG1sIiwic29ydFNlbGVjdENvbnRyb2wiLCIkb3B0cyIsInNvcnQiLCJhIiwiYiIsInRvTG93ZXJDYXNlIiwiaXNOdW1lcmljIiwicGFyc2VGbG9hdCIsInJlbW92ZSIsInRvU3RyaW5nIiwiZml4SGVhZGVyQ1NTIiwidGhhdCIsImdldEN1cnJlbnRIZWFkZXIiLCJoZWFkZXIiLCIkaGVhZGVyIiwiaGVpZ2h0IiwiJHRhYmxlSGVhZGVyIiwiZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzIiwic2VhcmNoQ29udHJvbHMiLCJnZXRDdXJzb3JQb3NpdGlvbiIsImVsIiwiaXNJRUJyb3dzZXIiLCJpcyIsInBvcyIsInNlbGVjdGlvblN0YXJ0IiwiZG9jdW1lbnQiLCJmb2N1cyIsIlNlbCIsInNlbGVjdGlvbiIsImNyZWF0ZVJhbmdlIiwiU2VsTGVuZ3RoIiwibW92ZVN0YXJ0Iiwic2V0Q3Vyc29yUG9zaXRpb24iLCJ2YWwiLCJjb3B5VmFsdWVzIiwidmFsdWVzRmlsdGVyQ29udHJvbCIsImVhY2giLCJwdXNoIiwiZmllbGQiLCJjbG9zZXN0IiwiZGF0YSIsInBvc2l0aW9uIiwic2V0VmFsdWVzIiwicmVzdWx0IiwiaW5kZXgiLCJlbGUiLCJncmVwIiwidmFsdWVPYmoiLCJjb2xsZWN0Qm9vdHN0cmFwQ29va2llcyIsImNvb2tpZXNSZWdleCIsImNvb2tpZXMiLCJmb3VuZENvb2tpZXMiLCJjb29raWUiLCJtYXRjaCIsInRlc3QiLCJzcGxpdCIsInBvcCIsImluQXJyYXkiLCJpbml0RmlsdGVyU2VsZWN0Q29udHJvbHMiLCJpdGVtc1BlclBhZ2UiLCJwYWdlVG8iLCJpc0NvbHVtblNlYXJjaGFibGVWaWFTZWxlY3QiLCJjb2x1bW4iLCJmaWx0ZXJDb250cm9sIiwic2VhcmNoYWJsZSIsImlzRmlsdGVyRGF0YU5vdEdpdmVuIiwiZmlsdGVyRGF0YSIsInVuZGVmaW5lZCIsImhhc1NlbGVjdENvbnRyb2xFbGVtZW50IiwieiIsInBhZ2luYXRpb24iLCJzaWRlUGFnaW5hdGlvbiIsInRvdGFsUm93cyIsImZpZWxkcyIsImoiLCJjb2x1bW5zIiwiZmllbGRzQ29sdW1uc0luZGV4IiwiZXNjYXBlSUQiLCJmaWVsZFZhbHVlIiwiZm9ybWF0dGVkVmFsdWUiLCJjYWxjdWxhdGVPYmplY3RWYWx1ZSIsImZvcm1hdHRlcnMiLCJrZXkiLCJmaWx0ZXJEYXRhTWV0aG9kIiwiZ2V0RmlsdGVyRGF0YU1ldGhvZCIsImZpbHRlckRhdGFNZXRob2RzIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsImZpbHRlckRhdGFTb3VyY2UiLCJpZCIsIlN0cmluZyIsInJlcGxhY2UiLCJjcmVhdGVDb250cm9scyIsImFkZGVkRmlsdGVyQ29udHJvbCIsImlzVmlzaWJsZSIsImxhc3RjaGlsZCIsImRldGFpbFZpZXciLCJ2aXNpYmxlIiwibmFtZUNvbnRyb2wiLCJmaWx0ZXJUZW1wbGF0ZSIsImZpbHRlckNvbnRyb2xQbGFjZWhvbGRlciIsImFmdGVyIiwiam9pbiIsIm9mZiIsIm9uIiwiZXZlbnQiLCJzZWFyY2hPbkVudGVyS2V5Iiwia2V5Q29kZSIsImNsZWFyVGltZW91dCIsImN1cnJlbnRUYXJnZXQiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0Iiwib25Db2x1bW5TZWFyY2giLCJzZWFyY2hUaW1lT3V0IiwiJGlucHV0Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImRhdGVwaWNrZXIiLCJmaWx0ZXJEYXRlcGlja2VyT3B0aW9ucyIsImUiLCJrZXl1cCIsImdldERpcmVjdGlvbk9mU2VsZWN0T3B0aW9ucyIsImFsaWdubWVudCIsInR4dCIsInZhcmlhYmxlVmFsdWVzIiwiSlNPTiIsInBhcnNlIiwiYWpheCIsInVybCIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm9iakZpbHRlckRhdGFNZXRob2QiLCJzZWFyY2hUZXJtIiwia2V5cyIsIk9iamVjdCIsImV4dGVuZCIsImRlZmF1bHRzIiwiZmlsdGVyU2hvd0NsZWFyIiwiYWxpZ25tZW50U2VsZWN0Q29udHJvbE9wdGlvbnMiLCJpbnB1dCIsInBsYWNlaG9sZGVyIiwic2VsZWN0IiwiZGlzYWJsZUNvbnRyb2xXaGVuU2VhcmNoIiwiY29sdW1uRGVmYXVsdHMiLCJmaWx0ZXJTdHJpY3RTZWFyY2giLCJmaWx0ZXJTdGFydHNXaXRoU2VhcmNoIiwiQ29uc3RydWN0b3IiLCJFVkVOVFMiLCJpY29ucyIsImNsZWFyIiwib3BlbiIsImxvY2FsZXMiLCJmb3JtYXRDbGVhckZpbHRlcnMiLCJmb3JtYXRPcGVuRmlsdGVycyIsIm1ldGhvZHMiLCJCb290c3RyYXBUYWJsZSIsIl9pbml0IiwicHJvdG90eXBlIiwiaW5pdCIsIl9pbml0VG9vbGJhciIsImluaXRUb29sYmFyIiwiX2luaXRIZWFkZXIiLCJpbml0SGVhZGVyIiwiX2luaXRCb2R5IiwiaW5pdEJvZHkiLCJfaW5pdFNlYXJjaCIsImluaXRTZWFyY2giLCIkZWwiLCJFbmFibGVDb250cm9scyIsImFwcGx5IiwiQXJyYXkiLCJzbGljZSIsImFyZ3VtZW50cyIsInNob3dUb29sYmFyIiwiJGJ0bkdyb3VwIiwiJHRvb2xiYXIiLCIkYnRuQ2xlYXIiLCIkYnRuT3BlbiIsImJ1dHRvbnNDbGFzcyIsImljb25zUHJlZml4IiwiYXBwZW5kVG8iLCJwcm94eSIsImNsZWFyRmlsdGVyQ29udHJvbCIsIiRic3QiLCJ0b2dnbGUiLCJmcCIsImlzRW1wdHlPYmplY3QiLCJmaWx0ZXJDb2x1bW5zUGFydGlhbCIsIml0ZW0iLCJ0aGlzQ29sdW1uIiwiZnZhbCIsInNlYXJjaEZvcm1hdHRlciIsImluaXRDb2x1bW5TZWFyY2giLCJmaWx0ZXJDb2x1bW5zRGVmYXVsdHMiLCJ1cGRhdGVQYWdpbmF0aW9uIiwiZmlsdGVyIiwidHJpZ2dlciIsIiRmaWVsZCIsInNlYXJjaFRleHQiLCJwYWdlTnVtYmVyIiwib25TZWFyY2giLCJ0YWJsZSIsImNvbnRyb2xzIiwic2VhcmNoIiwidGFnTmFtZSIsInJlc2V0U2VhcmNoIiwic29ydE5hbWUiLCJzb3J0T3JkZXIiLCJzb3J0ZXIiLCJvblNvcnQiLCJkZWxldGVDb29raWUiLCJ0cmlnZ2VyU2VhcmNoIiwiY2hhbmdlIiwiZW5hYmxlIiwicHJvcCIsInJlbW92ZVByb3AiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7OztBQU1BLENBQUMsVUFBVUEsQ0FBVixFQUFhO0FBRVY7O0FBRUEsTUFBSUMsT0FBTyxHQUFHRCxDQUFDLENBQUNFLEVBQUYsQ0FBS0MsY0FBTCxDQUFvQkMsS0FBcEIsQ0FBMEJILE9BQXhDO0FBQUEsTUFDSUksVUFBVSxHQUFHTCxDQUFDLENBQUNFLEVBQUYsQ0FBS0MsY0FBTCxDQUFvQkMsS0FBcEIsQ0FBMEJDLFVBRDNDOztBQUdBLE1BQUlDLDJCQUEyQixHQUFHLFNBQTlCQSwyQkFBOEIsQ0FBVUMsYUFBVixFQUF5QjtBQUN2RCxXQUFPQSxhQUFhLENBQUNDLEdBQWQsQ0FBa0JELGFBQWEsQ0FBQ0UsTUFBZCxHQUF1QixDQUF6QyxFQUE0Q0MsT0FBbkQ7QUFDSCxHQUZEOztBQUlBLE1BQUlDLHVCQUF1QixHQUFHLFNBQTFCQSx1QkFBMEIsQ0FBVUosYUFBVixFQUF5QkssWUFBekIsRUFBdUM7QUFDakUsUUFBSUYsT0FBTyxHQUFHSiwyQkFBMkIs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ImZpbGUiOiJqcy9ib290c3RyYXAtdGFibGUtZmlsdGVyLXJvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvcjogRGVubmlzIEhlcm7DoW5kZXpcbiAqIEB3ZWJTaXRlOiBodHRwOi8vZGpodnNjZi5naXRodWIuaW8vQmxvZ1xuICogQHZlcnNpb246IHYyLjEuMlxuICovXG5cbihmdW5jdGlvbiAoJCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHNwcmludGYgPSAkLmZuLmJvb3RzdHJhcFRhYmxlLnV0aWxzLnNwcmludGYsXG4gICAgICAgIG9iamVjdEtleXMgPSAkLmZuLmJvb3RzdHJhcFRhYmxlLnV0aWxzLm9iamVjdEtleXM7XG5cbiAgICB2YXIgZ2V0T3B0aW9uc0Zyb21TZWxlY3RDb250cm9sID0gZnVuY3Rpb24gKHNlbGVjdENvbnRyb2wpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdENvbnRyb2wuZ2V0KHNlbGVjdENvbnRyb2wubGVuZ3RoIC0gMSkub3B0aW9ucztcbiAgICB9O1xuXG4gICAgdmFyIGhpZGVVbnVzZWRTZWxlY3RPcHRpb25zID0gZnVuY3Rpb24gKHNlbGVjdENvbnRyb2wsIHVuaXF1ZVZhbHVlcykge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnNGcm9tU2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zW2ldLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1bmlxdWVWYWx1ZXMuaGFzT3duUHJvcGVydHkob3B0aW9uc1tpXS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q29udHJvbC5maW5kKHNwcmludGYoXCJvcHRpb25bdmFsdWU9JyVzJ11cIiwgb3B0aW9uc1tpXS52YWx1ZSkpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RDb250cm9sLmZpbmQoc3ByaW50ZihcIm9wdGlvblt2YWx1ZT0nJXMnXVwiLCBvcHRpb25zW2ldLnZhbHVlKSkuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sID0gZnVuY3Rpb24gKHNlbGVjdENvbnRyb2wsIHZhbHVlLCB0ZXh0KSB7XG4gICAgICAgIHZhbHVlID0gJC50cmltKHZhbHVlKTtcbiAgICAgICAgc2VsZWN0Q29udHJvbCA9ICQoc2VsZWN0Q29udHJvbC5nZXQoc2VsZWN0Q29udHJvbC5sZW5ndGggLSAxKSk7XG4gICAgICAgIGlmICghZXhpc3RPcHRpb25JblNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwgdmFsdWUpKSB7XG4gICAgICAgICAgICBzZWxlY3RDb250cm9sLmFwcGVuZCgkKFwiPG9wdGlvbj48L29wdGlvbj5cIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAgICAgICAgIC50ZXh0KCQoJzxkaXYgLz4nKS5odG1sKHRleHQpLnRleHQoKSkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzb3J0U2VsZWN0Q29udHJvbCA9IGZ1bmN0aW9uIChzZWxlY3RDb250cm9sKSB7XG4gICAgICAgICAgICBzZWxlY3RDb250cm9sID0gJChzZWxlY3RDb250cm9sLmdldChzZWxlY3RDb250cm9sLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgICAgIHZhciAkb3B0cyA9IHNlbGVjdENvbnRyb2wuZmluZCgnb3B0aW9uOmd0KDApJyk7XG5cbiAgICAgICAgICAgICRvcHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBhID0gJChhKS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBiID0gJChiKS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWMoYSkgJiYgJC5pc051bWVyaWMoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBudW1lcmljYWwgdmFsdWVzIGZyb20gc3RyaW5nIHRvIGZsb2F0LlxuICAgICAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChhKTtcbiAgICAgICAgICAgICAgICAgICAgYiA9IHBhcnNlRmxvYXQoYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZWxlY3RDb250cm9sLmZpbmQoJ29wdGlvbjpndCgwKScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2VsZWN0Q29udHJvbC5hcHBlbmQoJG9wdHMpO1xuICAgIH07XG5cbiAgICB2YXIgZXhpc3RPcHRpb25JblNlbGVjdENvbnRyb2wgPSBmdW5jdGlvbiAoc2VsZWN0Q29udHJvbCwgdmFsdWUpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBnZXRPcHRpb25zRnJvbVNlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbaV0udmFsdWUgPT09IHZhbHVlLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAvL1RoZSB2YWx1ZSBpcyBub3QgdmFsaWQgdG8gYWRkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0lmIHdlIGdldCBoZXJlLCB0aGUgdmFsdWUgaXMgdmFsaWQgdG8gYWRkXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIGZpeEhlYWRlckNTUyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgICAgIC8vdGhhdC4kdGFibGVIZWFkZXIuY3NzKCdoZWlnaHQnLCAnNzdweCcpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0Q3VycmVudEhlYWRlciA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGF0LiRoZWFkZXI7XG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWFkZXIgPSB0aGF0LiR0YWJsZUhlYWRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWFkZXI7XG4gICAgfTtcblxuICAgIHZhciBnZXRDdXJyZW50U2VhcmNoQ29udHJvbHMgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgICAgICB2YXIgc2VhcmNoQ29udHJvbHMgPSAnc2VsZWN0LCBpbnB1dCc7XG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICBzZWFyY2hDb250cm9scyA9ICd0YWJsZSBzZWxlY3QsIHRhYmxlIGlucHV0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWFyY2hDb250cm9scztcbiAgICB9O1xuXG4gICAgdmFyIGdldEN1cnNvclBvc2l0aW9uID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKCQuZm4uYm9vdHN0cmFwVGFibGUudXRpbHMuaXNJRUJyb3dzZXIoKSkge1xuICAgICAgICAgICAgaWYgKCQoZWwpLmlzKCdpbnB1dFt0eXBlPXRleHRdJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoJ3NlbGVjdGlvblN0YXJ0JyBpbiBlbCkge1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBlbC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCdzZWxlY3Rpb24nIGluIGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBTZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIFNlbExlbmd0aCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBTZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtZWwudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gU2VsLnRleHQubGVuZ3RoIC0gU2VsTGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNldEN1cnNvclBvc2l0aW9uID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICQoZWwpLnZhbChlbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHZhciBjb3B5VmFsdWVzID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IGdldEN1cnJlbnRIZWFkZXIodGhhdCksXG4gICAgICAgICAgICBzZWFyY2hDb250cm9scyA9IGdldEN1cnJlbnRTZWFyY2hDb250cm9scyh0aGF0KTtcblxuICAgICAgICB0aGF0Lm9wdGlvbnMudmFsdWVzRmlsdGVyQ29udHJvbCA9IFtdO1xuXG4gICAgICAgIGhlYWRlci5maW5kKHNlYXJjaENvbnRyb2xzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQub3B0aW9ucy52YWx1ZXNGaWx0ZXJDb250cm9sLnB1c2goXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJCh0aGlzKS5jbG9zZXN0KCdbZGF0YS1maWVsZF0nKS5kYXRhKCdmaWVsZCcpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJCh0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGdldEN1cnNvclBvc2l0aW9uKCQodGhpcykuZ2V0KDApKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNldFZhbHVlcyA9IGZ1bmN0aW9uKHRoYXQpIHtcbiAgICAgICAgdmFyIGZpZWxkID0gbnVsbCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgaGVhZGVyID0gZ2V0Q3VycmVudEhlYWRlcih0aGF0KSxcbiAgICAgICAgICAgIHNlYXJjaENvbnRyb2xzID0gZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzKHRoYXQpO1xuXG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMudmFsdWVzRmlsdGVyQ29udHJvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBoZWFkZXIuZmluZChzZWFyY2hDb250cm9scykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZSkge1xuICAgICAgICAgICAgICAgIGZpZWxkID0gJCh0aGlzKS5jbG9zZXN0KCdbZGF0YS1maWVsZF0nKS5kYXRhKCdmaWVsZCcpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICQuZ3JlcCh0aGF0Lm9wdGlvbnMudmFsdWVzRmlsdGVyQ29udHJvbCwgZnVuY3Rpb24gKHZhbHVlT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZU9iai5maWVsZCA9PT0gZmllbGQ7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS52YWwocmVzdWx0WzBdLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q3Vyc29yUG9zaXRpb24oJCh0aGlzKS5nZXQoMCksIHJlc3VsdFswXS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNvbGxlY3RCb290c3RyYXBDb29raWVzID0gZnVuY3Rpb24gY29va2llc1JlZ2V4KCkge1xuICAgICAgICB2YXIgY29va2llcyA9IFtdLFxuICAgICAgICAgICAgZm91bmRDb29raWVzID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC8oPzpicy50YWJsZS4pKFxcdyopL2cpO1xuXG4gICAgICAgIGlmIChmb3VuZENvb2tpZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChmb3VuZENvb2tpZXMsIGZ1bmN0aW9uIChpLCBjb29raWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoLy4vLnRlc3QoY29va2llKSkge1xuICAgICAgICAgICAgICAgICAgICBjb29raWUgPSBjb29raWUuc3BsaXQoXCIuXCIpLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoY29va2llLCBjb29raWVzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29va2llcy5wdXNoKGNvb2tpZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY29va2llcztcbiAgICAgICAgfVxuICAgIH07XG5cblx0dmFyIGluaXRGaWx0ZXJTZWxlY3RDb250cm9scyA9IGZ1bmN0aW9uICh0aGF0KSB7XG5cdFx0dmFyIGRhdGEgPSB0aGF0LmRhdGEsXG5cdFx0XHRpdGVtc1BlclBhZ2UgPSB0aGF0LnBhZ2VUbyA8IHRoYXQub3B0aW9ucy5kYXRhLmxlbmd0aCA/IHRoYXQub3B0aW9ucy5kYXRhLmxlbmd0aCA6IHRoYXQucGFnZVRvLFxuXG5cdFx0XHRpc0NvbHVtblNlYXJjaGFibGVWaWFTZWxlY3QgPSBmdW5jdGlvbiAoY29sdW1uKSB7XG5cdFx0XHRcdHJldHVybiBjb2x1bW4uZmlsdGVyQ29udHJvbCAmJiBjb2x1bW4uZmlsdGVyQ29udHJvbC50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JyAmJiBjb2x1bW4uc2VhcmNoYWJsZTtcblx0XHRcdH0sXG5cblx0XHRcdGlzRmlsdGVyRGF0YU5vdEdpdmVuID0gZnVuY3Rpb24gKGNvbHVtbikge1xuXHRcdFx0XHRyZXR1cm4gY29sdW1uLmZpbHRlckRhdGEgPT09IHVuZGVmaW5lZCB8fCBjb2x1bW4uZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpID09PSAnY29sdW1uJztcblx0XHRcdH0sXG5cblx0XHRcdGhhc1NlbGVjdENvbnRyb2xFbGVtZW50ID0gZnVuY3Rpb24gKHNlbGVjdENvbnRyb2wpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdENvbnRyb2wgJiYgc2VsZWN0Q29udHJvbC5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHogPSB0aGF0Lm9wdGlvbnMucGFnaW5hdGlvbiA/XG5cdFx0XHRcdCh0aGF0Lm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInID8gdGhhdC5wYWdlVG8gOiB0aGF0Lm9wdGlvbnMudG90YWxSb3dzKSA6XG5cdFx0XHRcdHRoYXQucGFnZVRvO1xuXG5cdFx0XHQkLmVhY2godGhhdC5oZWFkZXIuZmllbGRzLCBmdW5jdGlvbiAoaiwgZmllbGQpIHtcblx0XHRcdFx0dmFyIFx0Y29sdW1uID0gdGhhdC5jb2x1bW5zW3RoYXQuZmllbGRzQ29sdW1uc0luZGV4W2ZpZWxkXV0sXG5cdFx0XHRcdFx0XHRzZWxlY3RDb250cm9sID0gJCgnLmJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0nICsgZXNjYXBlSUQoY29sdW1uLmZpZWxkKSk7XG5cblx0XHRcdFx0aWYgKGlzQ29sdW1uU2VhcmNoYWJsZVZpYVNlbGVjdChjb2x1bW4pICYmIGhhc1NlbGVjdENvbnRyb2xFbGVtZW50KHNlbGVjdENvbnRyb2wpKSB7XG5cdFx0XHRcdFx0IC8vY29sdW1uLmZpbHRlclZhbHVlcz0kKFwiPHRleHRhcmVhLz5cIikuaHRtbChjb2x1bW4uZmlsdGVyVmFsdWVzKS50ZXh0KCk7XG5cdFx0XHRcdFx0aWYgKHNlbGVjdENvbnRyb2wuZ2V0KHNlbGVjdENvbnRyb2wubGVuZ3RoIC0gMSkub3B0aW9ucy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdC8vQWRkZWQgdGhlIGRlZmF1bHQgb3B0aW9uXG5cdFx0XHRcdFx0XHRhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwgJycsICcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaXNGaWx0ZXJEYXRhTm90R2l2ZW4oY29sdW1uKSkge1xuXHRcdFx0XHRcdFx0dmFyIHVuaXF1ZVZhbHVlcyA9IHt9O1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB6OyBpKyspIHtcblx0XHRcdFx0XHRcdFx0Ly9BZGRlZCBhIG5ldyB2YWx1ZVxuXHRcdFx0XHRcdFx0XHR2YXIgZmllbGRWYWx1ZSA9IGRhdGFbaV1bZmllbGRdLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXR0ZWRWYWx1ZSA9ICQuZm4uYm9vdHN0cmFwVGFibGUudXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhhdC5oZWFkZXIsIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFtmaWVsZFZhbHVlLCBkYXRhW2ldLCBpXSwgZmllbGRWYWx1ZSk7XG5cdFx0XHRcdFx0XHRcdHVuaXF1ZVZhbHVlc1tmb3JtYXR0ZWRWYWx1ZV0gPSBmaWVsZFZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIHVuaXF1ZVZhbHVlcykge1xuXHRcdFx0XHRcdFx0YWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIHVuaXF1ZVZhbHVlc1trZXldLCBrZXkpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuXG5cdFx0XHRcdFx0aWYgKHRoYXQub3B0aW9ucy5oaWRlVW51c2VkU2VsZWN0T3B0aW9ucykge1xuXHRcdFx0XHRcdFx0aGlkZVVudXNlZFNlbGVjdE9wdGlvbnMoc2VsZWN0Q29udHJvbCwgdW5pcXVlVmFsdWVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGNvbHVtbi5maWx0ZXJEYXRhICE9PSB1bmRlZmluZWQgJiYgY29sdW1uLmZpbHRlckRhdGEudG9Mb3dlckNhc2UoKSAhPT0gJ2NvbHVtbicpIHtcblx0XHRcdFx0XHRcdHZhciBmaWx0ZXJEYXRhTWV0aG9kID0gZ2V0RmlsdGVyRGF0YU1ldGhvZChmaWx0ZXJEYXRhTWV0aG9kcywgY29sdW1uLmZpbHRlckRhdGEuc3Vic3RyaW5nKDAsIGNvbHVtbi5maWx0ZXJEYXRhLmluZGV4T2YoJzonKSkpO1xuXHRcdFx0XHRcdFx0dmFyIGZpbHRlckRhdGFTb3VyY2UgPSBjb2x1bW4uZmlsdGVyRGF0YS5zdWJzdHJpbmcoY29sdW1uLmZpbHRlckRhdGEuaW5kZXhPZignOicpICsgMSwgY29sdW1uLmZpbHRlckRhdGEubGVuZ3RoKTtcblx0XHRcdFx0XHRcdGZpbHRlckRhdGFNZXRob2QoZmlsdGVyRGF0YVNvdXJjZSwgc2VsZWN0Q29udHJvbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cbiAgICB2YXIgZXNjYXBlSUQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgIHJldHVybiBTdHJpbmcoaWQpLnJlcGxhY2UoIC8oOnxcXC58XFxbfFxcXXwsKS9nLCBcIlxcXFwkMVwiICk7XG4gICAgfTtcblxuXHR2YXIgY3JlYXRlQ29udHJvbHMgPSBmdW5jdGlvbiAodGhhdCwgaGVhZGVyKSB7XG5cdFx0dmFyIGFkZGVkRmlsdGVyQ29udHJvbCA9IGZhbHNlLFxuXHRcdFx0XHRpc1Zpc2libGUsXG5cdFx0XHRcdGh0bWw7XG5cblx0XHR2YXIgbGFzdGNoaWxkPWhlYWRlci5maW5kKFwidHI6bGFzdC1jaGlsZFwiKTtcblx0XHRodG1sID0gW107XG5cblx0XHRpZiAodGhhdC5vcHRpb25zLmRldGFpbFZpZXcpIGh0bWwucHVzaCgnPHRkPjxkaXYgY2xhc3M9XCJyb3dcIiAgc3R5bGU9XCJtYXJnaW46IDBweFwiPjwvZGl2PjwvdGQ+Jyk7XG4gIFxuXHRcdCQuZWFjaCh0aGF0LmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW4pIHtcblx0XHRcdGlzVmlzaWJsZSA9ICdoaWRkZW4nO1xuXG5cdFx0XHRpZiAoIWNvbHVtbi52aXNpYmxlKSByZXR1cm47XG5cblx0XHRcdGlmICghY29sdW1uLmZpbHRlckNvbnRyb2wpIHtcblx0XHRcdFx0aHRtbC5wdXNoKCc8dGQ+PGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwibWFyZ2luOiAwcHhcIj48L2Rpdj48L3RkPicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aHRtbC5wdXNoKCc8dGQ+PGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwibWFyZ2luOiAwcHhcIj4nKTtcblx0XHRcdFx0dmFyIG5hbWVDb250cm9sID0gY29sdW1uLmZpbHRlckNvbnRyb2wudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0aWYgKGNvbHVtbi5zZWFyY2hhYmxlICYmIHRoYXQub3B0aW9ucy5maWx0ZXJUZW1wbGF0ZVtuYW1lQ29udHJvbF0pIHtcblx0XHRcdFx0XHRhZGRlZEZpbHRlckNvbnRyb2wgPSB0cnVlO1xuXHRcdFx0XHRcdGlzVmlzaWJsZSA9ICd2aXNpYmxlJztcblx0XHRcdFx0XHRodG1sLnB1c2godGhhdC5vcHRpb25zLmZpbHRlclRlbXBsYXRlW25hbWVDb250cm9sXSh0aGF0LCBjb2x1bW4uZmllbGQsIGlzVmlzaWJsZSwgY29sdW1uLmZpbHRlckNvbnRyb2xQbGFjZWhvbGRlciA/IGNvbHVtbi5maWx0ZXJDb250cm9sUGxhY2Vob2xkZXIgOiBcIlwiLCBcImZpbHRlci1jb250cm9sLVwiICsgaSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGh0bWwucHVzaCgnPC90ZD4nKTtcblx0XHRcdH1cblxuICAgICAgICAgICAgLyokLmVhY2goaGVhZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKSwgZnVuY3Rpb24gKGksIHRyKSB7XG4gICAgICAgICAgICAgICAgdHIgPSAkKHRyKTtcbiAgICAgICAgICAgICAgICBpZiAodHIuZGF0YSgnZmllbGQnKSA9PT0gY29sdW1uLmZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjZWxsPXRyLmZpbmQoJy5maHQtY2VsbCcpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmFwcGVuZChodG1sLmpvaW4oJycpKTtcblx0XHRcdFx0XHRcdCAgLy9jZWxsLmFkZENsYXNzKFwiLmJzdC1zZWFyY2gtcm93XCIpO1xuXHRcdFx0XHRcdFx0ICAvL2NlbGwuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7Ki9cblx0XHRcdFx0LyppZiAoY29sdW1uLmZpbHRlckRhdGEgIT09IHVuZGVmaW5lZCAmJiBjb2x1bW4uZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpICE9PSAnY29sdW1uJykge1xuXHRcdFx0XHRcdHZhciBmaWx0ZXJEYXRhVHlwZSA9IGdldEZpbHRlckRhdGFNZXRob2QoZmlsdGVyRGF0YU1ldGhvZHMsIGNvbHVtbi5maWx0ZXJEYXRhLnN1YnN0cmluZygwLCBjb2x1bW4uZmlsdGVyRGF0YS5pbmRleE9mKCc6JykpKTtcblx0XHRcdFx0XHR2YXIgZmlsdGVyRGF0YVNvdXJjZSwgc2VsZWN0Q29udHJvbDtcblxuXHRcdFx0XHRcdGlmIChmaWx0ZXJEYXRhVHlwZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyRGF0YVNvdXJjZSA9IGNvbHVtbi5maWx0ZXJEYXRhLnN1YnN0cmluZyhjb2x1bW4uZmlsdGVyRGF0YS5pbmRleE9mKCc6JykgKyAxLCBjb2x1bW4uZmlsdGVyRGF0YS5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0c2VsZWN0Q29udHJvbCA9ICQoJy5ib290c3RyYXAtdGFibGUtZmlsdGVyLWNvbnRyb2wtJyArIGVzY2FwZUlEKGNvbHVtbi5maWVsZCkpO1xuXHRcdFx0XHRcdFx0Ly9hZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwgJycsICcnKTtcblx0XHRcdFx0XHRcdGZpbHRlckRhdGFUeXBlKGZpbHRlckRhdGFTb3VyY2UsIHNlbGVjdENvbnRyb2wpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ0Vycm9yLiBZb3Ugc2hvdWxkIHVzZSBhbnkgb2YgdGhlc2UgYWxsb3dlZCBmaWx0ZXIgZGF0YSBtZXRob2RzOiB2YXIsIGpzb24sIHVybC4nICsgJyBVc2UgbGlrZSB0aGlzOiB2YXI6IHtrZXk6IFwidmFsdWVcIn0nKTtcblx0XHRcdFx0XHR9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGVWYWx1ZXMsIGtleTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGZpbHRlckRhdGFUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZmlsdGVyRGF0YVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdENvbnRyb2woc2VsZWN0Q29udHJvbCwga2V5LCBkYXRhW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Zhcic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZVZhbHVlcyA9IHdpbmRvd1tmaWx0ZXJEYXRhU291cmNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHZhcmlhYmxlVmFsdWVzKSB7XG5hbGVydChcIkFkZGluZyBrZXkgXCIra2V5K1wiIFwiK0pTT04uc3RyaW5naWZ5KHZhcmlhYmxlVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIGtleSwgdmFyaWFibGVWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0U2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlVmFsdWVzID0gSlNPTi5wYXJzZShmaWx0ZXJEYXRhU291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHZhcmlhYmxlVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIGtleSwgdmFyaWFibGVWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0U2VsZWN0Q29udHJvbChzZWxlY3RDb250cm9sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0qL1xuICAgICAgICB9KTtcblx0XHQgIGxhc3RjaGlsZC5hZnRlcihcIjx0ciBzdHlsZT0nZGlzcGxheTpub25lJyBjbGFzcz0nYnN0LXNlYXJjaC1yb3cnPlwiK2h0bWwuam9pbignJykrXCI8L3RyPlwiKTtcblxuICAgICAgICBpZiAoYWRkZWRGaWx0ZXJDb250cm9sKSB7XG4gICAgICAgICAgICBoZWFkZXIub2ZmKCdrZXl1cCcsICdpbnB1dCcpLm9uKCdrZXl1cCcsICdpbnB1dCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VhcmNoT25FbnRlcktleSAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBbMzcsIDM4LCAzOSwgNDBdKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZXZlbnQuY3VycmVudFRhcmdldC50aW1lb3V0SWQgfHwgMCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vbkNvbHVtblNlYXJjaChldmVudCk7XG4gICAgICAgICAgICAgICAgfSwgdGhhdC5vcHRpb25zLnNlYXJjaFRpbWVPdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhlYWRlci5vZmYoJ2NoYW5nZScsICdzZWxlY3QnKS5vbignY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VhcmNoT25FbnRlcktleSAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBbMzcsIDM4LCAzOSwgNDBdKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZXZlbnQuY3VycmVudFRhcmdldC50aW1lb3V0SWQgfHwgMCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vbkNvbHVtblNlYXJjaChldmVudCk7XG4gICAgICAgICAgICAgICAgfSwgdGhhdC5vcHRpb25zLnNlYXJjaFRpbWVPdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhlYWRlci5vZmYoJ21vdXNldXAnLCAnaW5wdXQnKS5vbignbW91c2V1cCcsICdpbnB1dCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIG9sZFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChldmVudC5jdXJyZW50VGFyZ2V0LnRpbWVvdXRJZCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQudGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5vbkNvbHVtblNlYXJjaChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaGVhZGVyLmZpbmQoJy5wYXJzZWQtY29udHJvbCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkLmVhY2godGhhdC5jb2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uZmlsdGVyQ29udHJvbCAhPT0gdW5kZWZpbmVkICYmIGNvbHVtbi5maWx0ZXJDb250cm9sLnRvTG93ZXJDYXNlKCkgPT09ICdkYXRlcGlja2VyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmZpbmQoJy5kYXRlLWZpbHRlci1jb250cm9sLmJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0nICsgY29sdW1uLmZpZWxkKS5kYXRlcGlja2VyKGNvbHVtbi5maWx0ZXJEYXRlcGlja2VyT3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZURhdGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHNwcmludGYoXCIjJXNcIiwgZS5jdXJyZW50VGFyZ2V0LmlkKSkudmFsKGUuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRmlyZWQgdGhlIGtleXVwIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5rZXl1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qaWYgKGNvbHVtbi5maWx0ZXJDb250cm9sICE9PSB1bmRlZmluZWQgJiYgY29sdW1uLmZpbHRlckNvbnRyb2wudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlci5maW5kKCcuc2VsZWN0LWZpbHRlci1jb250cm9sLmJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0nICsgY29sdW1uLmZpZWxkKS5zZWxlY3RwaWNrZXIoKTtcblx0XHRcdFx0XHRcdFx0fSovXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXIuZmluZCgnLmZpbHRlckNvbnRyb2wnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldERpcmVjdGlvbk9mU2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uIChhbGlnbm1lbnQpIHtcbiAgICAgICAgYWxpZ25tZW50ID0gYWxpZ25tZW50ID09PSB1bmRlZmluZWQgPyAnbGVmdCcgOiBhbGlnbm1lbnQudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBzd2l0Y2ggKGFsaWdubWVudCkge1xuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdsdHInO1xuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAncnRsJztcbiAgICAgICAgICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgICAgICAgICAgIHJldHVybiAnYXV0byc7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAnbHRyJztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZmlsdGVyRGF0YU1ldGhvZHMgPVxuICAgICAgICB7XG4gICAgICAgICAgICAndmFyJzogZnVuY3Rpb24gKGZpbHRlckRhdGFTb3VyY2UsIHNlbGVjdENvbnRyb2wpIHtcblx0XHRcdFx0XHR2YXIgdHh0PSQoXCI8dGV4dGFyZWEvPlwiKS5odG1sKGZpbHRlckRhdGFTb3VyY2UpLnRleHQoKTtcblx0XHRcdFx0XHR2YXIgdmFyaWFibGVWYWx1ZXM9SlNPTi5wYXJzZSh0eHQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YXJpYWJsZVZhbHVlcykgeyBcbiAgICAgICAgICAgICAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIGtleSwgdmFyaWFibGVWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd1cmwnOiBmdW5jdGlvbiAoZmlsdGVyRGF0YVNvdXJjZSwgc2VsZWN0Q29udHJvbCkge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZmlsdGVyRGF0YVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIGtleSwgZGF0YVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2pzb24nOmZ1bmN0aW9uIChmaWx0ZXJEYXRhU291cmNlLCBzZWxlY3RDb250cm9sKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlVmFsdWVzID0gSlNPTi5wYXJzZShmaWx0ZXJEYXRhU291cmNlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFyaWFibGVWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wsIGtleSwgdmFyaWFibGVWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNvcnRTZWxlY3RDb250cm9sKHNlbGVjdENvbnRyb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgdmFyIGdldEZpbHRlckRhdGFNZXRob2QgPSBmdW5jdGlvbiAob2JqRmlsdGVyRGF0YU1ldGhvZCwgc2VhcmNoVGVybSkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iakZpbHRlckRhdGFNZXRob2QpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChrZXlzW2ldID09PSBzZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iakZpbHRlckRhdGFNZXRob2Rbc2VhcmNoVGVybV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgICAgZmlsdGVyQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG9uQ29sdW1uU2VhcmNoOiBmdW5jdGlvbiAoZmllbGQsIHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyU2hvd0NsZWFyOiBmYWxzZSxcbiAgICAgICAgYWxpZ25tZW50U2VsZWN0Q29udHJvbE9wdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgZmlsdGVyVGVtcGxhdGU6IHtcbiAgICAgICAgICAgIGlucHV0OiBmdW5jdGlvbiAodGhhdCwgZmllbGQsIGlzVmlzaWJsZSwgcGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0XHR2YXIgaW5wdXQ9JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGJvcmRlci1yaWdodC0wIGJvcmRlciBib290c3RyYXAtdGFibGUtZmlsdGVyLWNvbnRyb2wtJXNcIiB2aXNpYmlsaXR5OiAlc1wiIHBsYWNlaG9sZGVyPVwiJXNcIj4nO1xuICAgICAgICAgICAgICAgIHJldHVybiBzcHJpbnRmKCc8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgY29sLW1kLTEyXCI+JytpbnB1dCsnPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hcHBlbmRcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBib3JkZXItbGVmdC0wIGJvcmRlclwiIHR5cGU9XCJidXR0b25cIiAgc3R5bGU9XCJwYWRkaW5nLXRvcDogMnB4OyBwYWRkaW5nLWJvdHRvbTogMnB4O1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+PC9idXR0b24+PC9zcGFuPjwvZGl2PicsIGZpZWxkLCBpc1Zpc2libGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3Q6IGZ1bmN0aW9uICh0aGF0LCBmaWVsZCwgaXNWaXNpYmxlKSB7XG5cdFx0XHRcdFx0IHZhciBzZWxlY3Q9JzxzZWxlY3Qgc3R5bGU9XCJwYWRkaW5nOiAycHg7IGhlaWdodDogYXV0bztcIiBjbGFzcz1cImZvcm0tY29udHJvbCBwYXJzZWQtY29udHJvbCBzZWxlY3QtZmlsdGVyLWNvbnRyb2wgYm9yZGVyLXJpZ2h0LTAgYm9yZGVyIGJvb3RzdHJhcC10YWJsZS1maWx0ZXItY29udHJvbC0lc1wiIHZpc2liaWxpdHk6ICVzXCIgZGlyPVwiJXNcIj4nO1xuXHRcdFx0XHRcdCBzZWxlY3Q9c2VsZWN0Kyc8L3NlbGVjdD4nO1xuICAgICAgICAgICAgICAgIHJldHVybiBzcHJpbnRmKCc8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgc2VsZWN0cGlja2VyIGNvbC1tZC0xMiBtdWx0aXBsZVwiPicrc2VsZWN0Kyc8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWFwcGVuZFwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJvcmRlci1sZWZ0LTAgYm9yZGVyXCIgdHlwZT1cImJ1dHRvblwiIHN0eWxlPVwicGFkZGluZy10b3A6MnB4OyBwYWRkaW5nLWJvdHRvbTogMnB4XCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT48L2J1dHRvbj48L3NwYW4+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQsIGlzVmlzaWJsZSwgZ2V0RGlyZWN0aW9uT2ZTZWxlY3RPcHRpb25zKHRoYXQub3B0aW9ucy5hbGlnbm1lbnRTZWxlY3RDb250cm9sT3B0aW9ucykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGVwaWNrZXI6IGZ1bmN0aW9uICh0aGF0LCBmaWVsZCwgaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwcmludGYoJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIHBhcnNlZC1jb250cm9sIGRhdGUtZmlsdGVyLWNvbnRyb2wgYm9vdHN0cmFwLXRhYmxlLWZpbHRlci1jb250cm9sLSVzXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgdmlzaWJpbGl0eTogJXNcIj4nLCBmaWVsZCwgaXNWaXNpYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZUNvbnRyb2xXaGVuU2VhcmNoOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoT25FbnRlcktleTogZmFsc2UsXG4gICAgICAgIC8vaW50ZXJuYWwgdmFyaWFibGVzXG4gICAgICAgIHZhbHVlc0ZpbHRlckNvbnRyb2w6IFtdXG4gICAgfSk7XG5cbiAgICAkLmV4dGVuZCgkLmZuLmJvb3RzdHJhcFRhYmxlLmNvbHVtbkRlZmF1bHRzLCB7XG4gICAgICAgIGZpbHRlckNvbnRyb2w6IHVuZGVmaW5lZCxcbiAgICAgICAgZmlsdGVyRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICBmaWx0ZXJEYXRlcGlja2VyT3B0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICBmaWx0ZXJTdHJpY3RTZWFyY2g6IGZhbHNlLFxuICAgICAgICBmaWx0ZXJTdGFydHNXaXRoU2VhcmNoOiBmYWxzZSxcbiAgICAgICAgZmlsdGVyQ29udHJvbFBsYWNlaG9sZGVyOiBcIlwiXG4gICAgfSk7XG5cbiAgICAkLmV4dGVuZCgkLmZuLmJvb3RzdHJhcFRhYmxlLkNvbnN0cnVjdG9yLkVWRU5UUywge1xuICAgICAgICAnY29sdW1uLXNlYXJjaC5icy50YWJsZSc6ICdvbkNvbHVtblNlYXJjaCdcbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMuaWNvbnMsIHtcbiAgICAgICAgY2xlYXI6ICdmYS10cmFzaCcsXG5cdFx0ICBvcGVuOiAnZmEtc2VhcmNoLXBsdXMgaWNvbi5jbGVhcidcbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcywge1xuICAgICAgICBmb3JtYXRDbGVhckZpbHRlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnQ2xlYXIgRmlsdGVycyc7XG4gICAgICAgIH0sXG5cdFx0ICBmb3JtYXRPcGVuRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAnT3BlbiBGaWx0ZXJzJztcblx0XHRcdH1cbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMsICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcyk7XG5cbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLm1ldGhvZHMucHVzaCgndHJpZ2dlclNlYXJjaCcpO1xuXG4gICAgdmFyIEJvb3RzdHJhcFRhYmxlID0gJC5mbi5ib290c3RyYXBUYWJsZS5Db25zdHJ1Y3RvcixcbiAgICAgICAgX2luaXQgPSBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdCxcbiAgICAgICAgX2luaXRUb29sYmFyID0gQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRUb29sYmFyLFxuICAgICAgICBfaW5pdEhlYWRlciA9IEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0SGVhZGVyLFxuICAgICAgICBfaW5pdEJvZHkgPSBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdEJvZHksXG4gICAgICAgIF9pbml0U2VhcmNoID0gQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRTZWFyY2g7XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHsgXG4gICAgICAgIC8vTWFrZSBzdXJlIHRoYXQgdGhlIGZpbHRlckNvbnRyb2wgb3B0aW9uIGlzIHNldFxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpbHRlckNvbnRyb2wpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgLy8gQ29tcGF0aWJpbGl0eTogSUUgPCA5IGFuZCBvbGQgYnJvd3NlcnNcbiAgICAgICAgICAgIGlmICghT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgICAgICBvYmplY3RLZXlzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vTWFrZSBzdXJlIHRoYXQgdGhlIGludGVybmFsIHZhcmlhYmxlcyBhcmUgc2V0IGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZhbHVlc0ZpbHRlckNvbnRyb2wgPSBbXTtcblxuICAgICAgICAgICAgLyp0aGlzLiRlbC5vbigncmVzZXQtdmlldy5icy50YWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvL0NyZWF0ZSBjb250cm9scyBvbiAkdGFibGVIZWFkZXIgaWYgdGhlIGhlaWdodCBpcyBzZXRcbiAgICAgICAgICAgICAgICBpZiAoIXRoYXQub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL0F2b2lkIHJlY3JlYXRlIHRoZSBjb250cm9sc1xuICAgICAgICAgICAgICAgIGlmICh0aGF0LiR0YWJsZUhlYWRlci5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwIHx8IHRoYXQuJHRhYmxlSGVhZGVyLmZpbmQoJ2lucHV0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG5cdFx0XHRcdHZhciBzZWFyY2hyb3c9dGhhdC4kaGVhZGVyLmZpbmQoXCIuYnN0LXNlYXJjaC1yb3dcIik7XG5cdFx0XHRcdGlmIChzZWFyY2hyb3cubGVuZ3RoKSB7XG5cdFx0XHRcdCAgdGhhdC4kaGVhZGVyLmZpbmQoXCIuYnN0LXNlYXJjaC1yb3cgdGQ6bGFzdC1jaGlsZFwiKS5odG1sKFwiVmF5YSBWYXlhLi4uJmx0O1wiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuICAgICAgICAgICAgICAgIC8vY3JlYXRlQ29udHJvbHModGhhdCwgdGhhdC4kdGFibGVIZWFkZXIpO1xuICAgICAgICAgICAgfSkub24oJ3Bvc3QtYm9keS5icy50YWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBmaXhIZWFkZXJDU1ModGhhdCk7XG4gICAgICAgICAgICB9KSovXG5cdFx0XHRcdHRoaXMuJGVsLm9uKCdwb3N0LWhlYWRlci5icy50YWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZXModGhhdCk7XG4gICAgICAgICAgICB9KS5vbignY29sdW1uLXN3aXRjaC5icy50YWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldFZhbHVlcyh0aGF0KTtcbiAgICAgICAgICAgIH0pLm9uKCdsb2FkLXN1Y2Nlc3MuYnMudGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGF0LkVuYWJsZUNvbnRyb2xzKHRydWUpO1xuICAgICAgICAgICAgfSkub24oJ2xvYWQtZXJyb3IuYnMudGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGF0LkVuYWJsZUNvbnRyb2xzKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgX2luaXQuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFRvb2xiYXIgPSBmdW5jdGlvbiAoKSB7IFxuXHRcdCAgdmFyIHRoYXQ9dGhpcztcbiAgICAgICAgdGhpcy5zaG93VG9vbGJhciA9IHRoaXMuc2hvd1Rvb2xiYXIgfHwgdGhpcy5vcHRpb25zLmZpbHRlckNvbnRyb2wgJiYgdGhpcy5vcHRpb25zLmZpbHRlclNob3dDbGVhcjtcblxuICAgICAgICBfaW5pdFRvb2xiYXIuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyQ29udHJvbCAmJiB0aGlzLm9wdGlvbnMuZmlsdGVyU2hvd0NsZWFyKSB7XG4gICAgICAgICAgICB2YXIgJGJ0bkdyb3VwID0gdGhpcy4kdG9vbGJhci5maW5kKCc+LmJ0bi1ncm91cCcpLFxuICAgICAgICAgICAgICAgICRidG5DbGVhciA9ICRidG5Hcm91cC5maW5kKCcuZmlsdGVyLXNob3ctY2xlYXInKSxcblx0XHRcdFx0XHQgJGJ0bk9wZW4gPSAkYnRuR3JvdXAuZmluZCgnLmZpbHRlci1zaG93LW9wZW4nKTtcblxuICAgICAgICAgICAgaWYgKCEkYnRuQ2xlYXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJGJ0bkNsZWFyID0gJChbXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLSVzIGZpbHRlci1zaG93LWNsZWFyXCIgJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcyksXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJ3R5cGU9XCJidXR0b25cIiB0aXRsZT1cIiVzXCI+JywgdGhpcy5vcHRpb25zLmZvcm1hdENsZWFyRmlsdGVycygpKSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4gJywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMuY2xlYXIpLFxuICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJykpLmFwcGVuZFRvKCRidG5Hcm91cCk7XG5cbiAgICAgICAgICAgICAgICRidG5DbGVhci5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLmNsZWFyRmlsdGVyQ29udHJvbCwgdGhpcykpO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCEkYnRuT3Blbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkYnRuT3BlbiA9ICQoW1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi0lcyBmaWx0ZXItc2hvdy1vcGVuXCIgJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcyksXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJ3R5cGU9XCJidXR0b25cIiB0aXRsZT1cIiVzXCI+JywgdGhpcy5vcHRpb25zLmZvcm1hdE9wZW5GaWx0ZXJzKCkpLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPiAnLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy5vcGVuKSxcbiAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpKS5hcHBlbmRUbygkYnRuR3JvdXApO1xuXG5cdFx0XHRcdFx0JGJ0bk9wZW4ub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyICRic3Q9dGhhdC4kZWwuZmluZChcIi5ic3Qtc2VhcmNoLXJvd1wiKTtcblx0XHRcdFx0XHRcdGlmICgkYnN0Lmxlbmd0aCkgJGJzdC50b2dnbGUoKTtcblx0XHRcdFx0XHR9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdEhlYWRlciA9IGZ1bmN0aW9uICgpIHsgXG4gICAgICAgIF9pbml0SGVhZGVyLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5maWx0ZXJDb250cm9sKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3JlYXRlQ29udHJvbHModGhpcywgdGhpcy4kaGVhZGVyKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRCb2R5ID0gZnVuY3Rpb24gKCkgeyBcbiAgICAgICAgX2luaXRCb2R5LmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpKTtcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgICAgICBpbml0RmlsdGVyU2VsZWN0Q29udHJvbHModGhpcyk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0U2VhcmNoID0gZnVuY3Rpb24gKCkgeyBcbiAgICAgICAgX2luaXRTZWFyY2guYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBmcCA9ICQuaXNFbXB0eU9iamVjdCh0aGF0LmZpbHRlckNvbHVtbnNQYXJ0aWFsKSA/IG51bGwgOiB0aGF0LmZpbHRlckNvbHVtbnNQYXJ0aWFsO1xuXG4gICAgICAgIC8vQ2hlY2sgcGFydGlhbCBjb2x1bW4gZmlsdGVyXG4gICAgICAgIHRoYXQuZGF0YSA9IGZwID8gJC5ncmVwKHRoYXQuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmcCkge1xuICAgICAgICAgICAgICAgIHZhciB0aGlzQ29sdW1uID0gdGhhdC5jb2x1bW5zW3RoYXQuZmllbGRzQ29sdW1uc0luZGV4W2tleV1dO1xuICAgICAgICAgICAgICAgIHZhciBmdmFsID0gZnBba2V5XS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1ba2V5XTtcblxuICAgICAgICAgICAgICAgIC8vIEZpeCAjMTQyOiBzZWFyY2ggdXNlIGZvcm1hdGVkIGRhdGFcbiAgICAgICAgICAgICAgICBpZiAodGhpc0NvbHVtbiAmJiB0aGlzQ29sdW1uLnNlYXJjaEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICQuZm4uYm9vdHN0cmFwVGFibGUudXRpbHMuY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhhdC5oZWFkZXIsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbJC5pbkFycmF5KGtleSwgdGhhdC5oZWFkZXIuZmllbGRzKV0sXG4gICAgICAgICAgICAgICAgICAgIFt2YWx1ZSwgaXRlbSwgaV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZigkLmluQXJyYXkoa2V5LCB0aGF0LmhlYWRlci5maWVsZHMpICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc0NvbHVtbi5maWx0ZXJTdHJpY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT09IGZ2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpc0NvbHVtbi5maWx0ZXJTdGFydHNXaXRoU2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmdmFsKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCh2YWx1ZSArICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZnZhbCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KSA6IHRoYXQuZGF0YTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRDb2x1bW5TZWFyY2ggPSBmdW5jdGlvbihmaWx0ZXJDb2x1bW5zRGVmYXVsdHMpIHtcbiAgICAgICAgY29weVZhbHVlcyh0aGlzKTtcblxuICAgICAgICBpZiAoZmlsdGVyQ29sdW1uc0RlZmF1bHRzKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsID0gZmlsdGVyQ29sdW1uc0RlZmF1bHRzO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGZpbHRlciBpbiBmaWx0ZXJDb2x1bW5zRGVmYXVsdHMpIHtcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdjb2x1bW4tc2VhcmNoJywgZmlsdGVyLCBmaWx0ZXJDb2x1bW5zRGVmYXVsdHNbZmlsdGVyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uQ29sdW1uU2VhcmNoID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICgkLmluQXJyYXkoZXZlbnQua2V5Q29kZSwgWzM3LCAzOCwgMzksIDQwXSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29weVZhbHVlcyh0aGlzKTtcbiAgICAgICAgdmFyIHRleHQgPSAkLnRyaW0oJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKSk7XG4gICAgICAgIHZhciAkZmllbGQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWZpZWxkXScpLmRhdGEoJ2ZpZWxkJyk7XG5cbiAgICAgICAgaWYgKCQuaXNFbXB0eU9iamVjdCh0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsKSkge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsWyRmaWVsZF0gPSB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZmlsdGVyQ29sdW1uc1BhcnRpYWxbJGZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBzZWFyY2hUZXh0IGlzIHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIGNvbHVtbiB2YWx1ZSxcbiAgICAgICAgLy8gYm9vdHN0cmFwVGFibGUgd2lsbCBub3QgdHJ5IHNlYXJjaGluZyBhZ2FpbiAoZXZlbiB0aG91Z2ggdGhlIHNlbGVjdGVkIGNvbHVtblxuICAgICAgICAvLyBtYXkgYmUgZGlmZmVyZW50IGZyb20gdGhlIHByZXZpb3VzIHNlYXJjaCkuICBBcyBhIHdvcmsgYXJvdW5kXG4gICAgICAgIC8vIHdlJ3JlIG1hbnVhbGx5IGFwcGVuZGluZyBzb21lIHRleHQgdG8gYm9vdHJhcCdzIHNlYXJjaFRleHQgZmllbGRcbiAgICAgICAgLy8gdG8gZ3VhcmFudGVlIHRoYXQgaXQgd2lsbCBwZXJmb3JtIGEgc2VhcmNoIGFnYWluIHdoZW4gd2UgY2FsbCB0aGlzLm9uU2VhcmNoKGV2ZW50KVxuICAgICAgICB0aGlzLnNlYXJjaFRleHQgKz0gXCJyYW5kb21UZXh0XCI7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSAxO1xuICAgICAgICB0aGlzLkVuYWJsZUNvbnRyb2xzKGZhbHNlKTtcbiAgICAgICAgdGhpcy5vblNlYXJjaChldmVudCk7XG4gICAgICAgIHRoaXMudHJpZ2dlcignY29sdW1uLXNlYXJjaCcsICRmaWVsZCwgdGV4dCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jbGVhckZpbHRlckNvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsdGVyQ29udHJvbCAmJiB0aGlzLm9wdGlvbnMuZmlsdGVyU2hvd0NsZWFyKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgY29va2llcyA9IGNvbGxlY3RCb290c3RyYXBDb29raWVzKCksXG4gICAgICAgICAgICAgICAgaGVhZGVyID0gZ2V0Q3VycmVudEhlYWRlcih0aGF0KSxcbiAgICAgICAgICAgICAgICB0YWJsZSA9IGhlYWRlci5jbG9zZXN0KCd0YWJsZScpLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xzID0gaGVhZGVyLmZpbmQoZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzKHRoYXQpKSxcbiAgICAgICAgICAgICAgICBzZWFyY2ggPSB0aGF0LiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0SWQgPSAwO1xuXG4gICAgICAgICAgICAkLmVhY2godGhhdC5vcHRpb25zLnZhbHVlc0ZpbHRlckNvbnRyb2wsIGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNldFZhbHVlcyh0aGF0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZWFjaCB0eXBlIG9mIGZpbHRlciBpZiBpdCBleGlzdHMuXG4gICAgICAgICAgICAvLyBSZXF1aXJlcyB0aGUgYm9keSB0byByZWxvYWQgZWFjaCB0aW1lIGEgdHlwZSBvZiBmaWx0ZXIgaXMgZm91bmQgYmVjYXVzZSB3ZSBuZXZlciBrbm93XG4gICAgICAgICAgICAvLyB3aGljaCBvbmVzIGFyZSBnb2luZyB0byBiZSBwcmVzZW50LlxuICAgICAgICAgICAgaWYgKGNvbnRyb2xzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsID0ge307XG4gICAgICAgICAgICAgICAgJChjb250cm9sc1swXSkudHJpZ2dlcihjb250cm9sc1swXS50YWdOYW1lID09PSAnSU5QVVQnID8gJ2tleXVwJyA6ICdjaGFuZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0U2VhcmNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVzZSB0aGUgZGVmYXVsdCBzb3J0IG9yZGVyIGlmIGl0IGV4aXN0cy4gZG8gbm90aGluZyBpZiBpdCBkb2VzIG5vdFxuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zb3J0TmFtZSAhPT0gdGFibGUuZGF0YSgnc29ydE5hbWUnKSB8fCB0aGF0Lm9wdGlvbnMuc29ydE9yZGVyICE9PSB0YWJsZS5kYXRhKCdzb3J0T3JkZXInKSkge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZXIgPSBoZWFkZXIuZmluZChzcHJpbnRmKCdbZGF0YS1maWVsZD1cIiVzXCJdJywgJChjb250cm9sc1swXSkuY2xvc2VzdCgndGFibGUnKS5kYXRhKCdzb3J0TmFtZScpKSk7XG4gICAgICAgICAgICAgICAgaWYgKHNvcnRlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub25Tb3J0KHRhYmxlLmRhdGEoJ3NvcnROYW1lJyksIHRhYmxlLmRhdGEoJ3NvcnROYW1lJykpO1xuICAgICAgICAgICAgICAgICAgICAkKHNvcnRlcikuZmluZCgnLnNvcnRhYmxlJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNsZWFyIGNvb2tpZXMgb25jZSB0aGUgZmlsdGVycyBhcmUgY2xlYW5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZXMgJiYgY29va2llcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChjb29raWVzLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuZGVsZXRlQ29va2llICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRlbGV0ZUNvb2tpZShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhhdC5vcHRpb25zLnNlYXJjaFRpbWVPdXQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS50cmlnZ2VyU2VhcmNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaGVhZGVyID0gZ2V0Q3VycmVudEhlYWRlcih0aGlzKSxcbiAgICAgICAgICAgIHNlYXJjaENvbnRyb2xzID0gZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzKHRoaXMpO1xuXG4gICAgICAgIGhlYWRlci5maW5kKHNlYXJjaENvbnRyb2xzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZihlbC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgICAgICAgICBlbC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwua2V5dXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5FbmFibGVDb250cm9scyA9IGZ1bmN0aW9uKGVuYWJsZSkge1xuICAgICAgICBpZigodGhpcy5vcHRpb25zLmRpc2FibGVDb250cm9sV2hlblNlYXJjaCkgJiYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpKSB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gZ2V0Q3VycmVudEhlYWRlcih0aGlzKSxcbiAgICAgICAgICAgIHNlYXJjaENvbnRyb2xzID0gZ2V0Q3VycmVudFNlYXJjaENvbnRyb2xzKHRoaXMpO1xuXG4gICAgICAgICAgICBpZighZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyLmZpbmQoc2VhcmNoQ29udHJvbHMpLnByb3AoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhlYWRlci5maW5kKHNlYXJjaENvbnRyb2xzKS5yZW1vdmVQcm9wKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iXSwic291cmNlUm9vdCI6IiJ9