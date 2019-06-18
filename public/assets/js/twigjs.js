(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/twigjs"],{

/***/ "./assets/js/twigjs.js":
/*!*****************************!*\
  !*** ./assets/js/twigjs.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, global) {var Twig = __webpack_require__(/*! twig */ "./node_modules/twig/twig.js");

var twig = Twig.twig;

__webpack_require__(/*! ./utils.js */ "./assets/js/utils.js");

var _twig_tmpl = {};
var _twig_templates = {};

function _fnc_null() {}

function renderTemplate(namet, jsondata, callback, param) {
  var mode = true;
  var error = null; //var rjson={"info":jsondata};

  var rjson = jsondata;

  if (callback == undefined) {
    mode = false; // callback=_fnc_null;
  }

  if (_twig_templates[namet] == undefined) {
    throw "La plantilla " + namet + " no existe";
  }

  var t = twig({
    ref: namet
  });
  if (t != null) _twig_tmpl[namet] = t;
  /*	if ((t!=null)&&(_twig_tmpl==undefined)) {
  		alert(namet+" Ya definida!!!!");
  		_twig_tmpl[namet]=t;
  	}
  */

  if (_twig_tmpl[namet] == undefined) {
    _twig_tmpl[namet] = twig({
      base: 'templates',
      autoescape: true,
      id: namet,
      href: _twig_templates[namet],
      async: mode,
      load: function load(tmpl) {
        if (tmpl == null) {
          throw "No se pudo cargar la plantilla " + namet; //error="No se pudo cargar la plantilla "+namet;
        } else {
          try {
            var err = JSON.parse(tmpl.tokens[0].value);
            tmpl = null; //error=err.msg;

            throw err.msg;
          } catch (e) {
            _twig_tmpl[namet] = tmpl;
            if (callback != undefined) callback(tmpl.render(rjson), param);
          }
        }
      }
    });
  }

  if (!mode) {
    /*if (error!=null) {
    	//Twig.cache();
    	_twig_tmpl[namet]=null;
    	setTimeout(function() { document.location='/'; },1000);
    	throw error;
    }*/
    var t = twig({
      ref: namet
    });

    if (t == null) {
      _twig_tmpl[namet] = null; //delete _twig_tmpl[namet];

      setTimeout(function () {
        document.location = '/';
      }, 1000);
      throw "No se pudo cargar la plantilla " + namet;
    } else return t.render(rjson, param);
  } else {
    if (error != null) {
      //Twig.cache();
      _twig_tmpl[namet] = null; //delete _twig_tmpl[namet];

      setTimeout(function () {
        document.location = '/';
      }, 1000);
      throw error;
    }

    if (callback != undefined) callback(_twig_tmpl[namet].render(rjson), param);
  }

  return null;
}

Twig.extendFunction('include', function (template, params) {
  _twig_templates[template] = template;
  var html = renderTemplate(template, params);
  return html.replace(/[\n\t]/g, "");
});

function openModalTemplate(id, title, bodytemplate, params) {
  try {
    $("#_modal_" + id).remove();
    if (params == undefined) params = {};
    if (bodytemplate == undefined || bodytemplate == null || bodytemplate == "null") bodytemplate = "_modalbody_" + id;
    if (params["buttons"] == undefined) params["buttons"] = [];
    var body = renderTemplate(bodytemplate, params);
    var html = renderTemplate("modal", {
      "id": id,
      "title": title,
      "onclose": params.onclose,
      "modalsize": params.modalsize,
      "buttons": params.buttons
    });
    $("body").append(html);
    $(document).ready(function () {
      $("#_modalbody_" + id).html(body);
      $("#_modal_" + id).modal("show");
    });
  } catch (error) {
    messageAlert(error, ERROR);
  }
}

global.renderTemplate = renderTemplate;
global.openModalTemplate = openModalTemplate;
global._twig_templates = _twig_templates;
global.openModalTemplate = openModalTemplate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./assets/js/utils.js":
/*!****************************!*\
  !*** ./assets/js/utils.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, $, global) {(function ($) {
  $.fn.serializeJSON = function () {
    var json = {};
    jQuery.map($(this).serializeArray(), function (i, n) {
      json[i['name']] = i['value'];
    });
    return json;
  };
})(jQuery);

function callServer(controller, query, callback, params, type, context) {
  if (query === null || query == "null") query = "isajax=true";else query += "&isajax=true";
  $.ajax({
    url: controller,
    context: context,
    data: query,
    dataType: type,
    method: "POST",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8"
  }).done(function (data, status, xhr) {
    if (type == 'html') {
      try {
        var r = JSON.parse(data);
        messageAlert("ERROR: " + data.msg, ERROR);
        if (data.code == -1) document.location = "/";
      } catch (e) {
        callback(data, params, context);
      }
    } else {
      if (!data instanceof Object || data.ok !== undefined && data.ok !== true) {
        messageAlert("ERROR: " + data.msg, ERROR);
        if (data.code == -1) document.location = "/";
      } else {
        if (callback !== undefined && callback != "" && callback != null) callback(data, params, context);
      }
    }
  }).fail(function (xhr, status, errorthrow) {
    document.write(xhr.responseText); //messageAlert("ERROR: "+xhr.responseText,ERROR);
  });
}

function messageAlert(message, type, timeout) {
  $("#alerts").html("<div id='alertbody' class='alert " + type + " alert-dismissible fade show' role='alert'>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Pechar'><span aria-hidden='true'>&times;</span></button>" + "</div>").show();

  if (timeout !== undefined) {
    setTimeout(function () {
      $("#alertbody").alert("close");
    }, timeout);
  }
} //-------  Table


var _table_selections_ = {};
var _table_formatters_ = {};

function getIdSelections(id) {
  return $.map($("#" + id).bootstrapTable('getSelections'), function (row) {
    return row.id;
  });
}

function reloadTable(data, id) {
  var table = $("#" + id);
  var pos = table.bootstrapTable("getScrollPosition");
  table.bootstrapTable("load", data);
  table.trigger("load-success.bs.table", data);
  table.trigger("uncheck-all.bs.table");
  var bodytable = table.parent();
  bodytable.scrollTop(pos);
}

function fixmargins(id, value, row, index, field) {
  if (_table_formatters_[id] !== undefined && _table_formatters_[id][field] !== undefined) {
    return window[_table_formatters_[id][field]](value, row, index, field);
  }

  return '<span style="margin-left: 8px">' + value + '</span>';
} //------  Select
//


var __select__content = {};

function reloadSelect(idselect, data) {
  var select = $("#" + idselect);
  var value = select.data("value");
  var text = select.data("text");
  var datastr = JSON.stringify(data);
  select.empty();
  select.data("data", datastr);
  select.attr("data-data", datastr);

  for (var d in data.rows) {
    var sel = "";
    var dis = "";
    if (data.rows[d].selected != undefined && data.rows[d].selected == "true") sel = "selected";
    if (data.rows[d].disabled != undefined && data.rows[d].disabled == "true") dis = "disabled";
    select.append('<option data-index="' + data.rows[d].id + '" value="' + data.rows[d][value] + '" ' + sel + ' ' + dis + '>' + data.rows[d][text] + '</option>');
  }

  select.selectpicker("refresh");
  __select__content[idselect] = data;
} //------------- ZIndex
//


$.maxZIndex = $.fn.maxZIndex = function (opt) {
  /// <summary>
  /// Returns the max zOrder in the document (no parameter)
  /// Sets max zOrder by passing a non-zero number
  /// which gets added to the highest zOrder.
  /// </summary>    
  /// <param name="opt" type="object">
  /// inc: increment value, 
  /// group: selector for zIndex elements to find max for
  /// </param>
  /// <returns type="jQuery" />
  var def = {
    inc: 10,
    group: "*"
  };
  $.extend(def, opt);
  var zmax = 0;
  $(def.group).each(function () {
    var cur = parseInt($(this).css('z-index'));
    zmax = cur > zmax ? cur : zmax;
  });
  if (!this.jquery) return zmax;
  return this.each(function () {
    zmax += def.inc;
    $(this).css("z-index", zmax);
  });
};

var INFO = "alert-info";
var WARNING = "alert-warning";
var ERROR = "alert-danger";
var OK = "alert-success";
global.getIdSelections = getIdSelections;
global.reloadTable = reloadTable;
global.fixmargins = fixmargins;
global._table_selections_ = _table_selections_;
global._table_formatters_ = _table_formatters_;
global.__select__content = __select__content;
global.messageAlert = messageAlert;
global.callServer = callServer;
global.reloadSelect = reloadSelect;
global.INFO = INFO;
global.WARNING = WARNING;
global.ERROR = ERROR;
global.OK = OK;
global.$ = global.jQuery = $;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/path-browserify/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/path-browserify/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/twig/twig.js":
/*!***********************************!*\
  !*** ./node_modules/twig/twig.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function sprintf() {
  //  discuss at: http://locutus.io/php/sprintf/
  // original by: Ash Searle (http://hexmen.com/blog/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Dj
  // improved by: Allidylls
  //    input by: Paulo Freitas
  //    input by: Brett Zamir (http://brett-zamir.me)
  // improved by: Rafał Kukawski (http://kukawski.pl)
  //   example 1: sprintf("%01.2f", 123.1)
  //   returns 1: '123.10'
  //   example 2: sprintf("[%10s]", 'monkey')
  //   returns 2: '[    monkey]'
  //   example 3: sprintf("[%'#10s]", 'monkey')
  //   returns 3: '[####monkey]'
  //   example 4: sprintf("%d", 123456789012345)
  //   returns 4: '123456789012345'
  //   example 5: sprintf('%-03s', 'E')
  //   returns 5: 'E00'
  //   example 6: sprintf('%+010d', 9)
  //   returns 6: '+000000009'
  //   example 7: sprintf('%+0\'@10d', 9)
  //   returns 7: '@@@@@@@@+9'
  //   example 8: sprintf('%.f', 3.14)
  //   returns 8: '3.140000'
  //   example 9: sprintf('%% %2$d', 1, 2)
  //   returns 9: '% 2'

  var regex = /%%|%(?:(\d+)\$)?((?:[-+#0 ]|'[\s\S])*)(\d+)?(?:\.(\d*))?([\s\S])/g;
  var args = arguments;
  var i = 0;
  var format = args[i++];

  var _pad = function _pad(str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = str.length >= len ? '' : new Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  var justify = function justify(value, prefix, leftJustify, minWidth, padChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      // when padding with zeros
      // on the left side
      // keep sign (+ or -) in front
      if (!leftJustify && padChar === '0') {
        value = [value.slice(0, prefix.length), _pad('', diff, '0', true), value.slice(prefix.length)].join('');
      } else {
        value = _pad(value, minWidth, padChar, leftJustify);
      }
    }
    return value;
  };

  var _formatBaseX = function _formatBaseX(value, base, leftJustify, minWidth, precision, padChar) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    value = _pad(number.toString(base), precision || 0, '0', false);
    return justify(value, '', leftJustify, minWidth, padChar);
  };

  // _formatString()
  var _formatString = function _formatString(value, leftJustify, minWidth, precision, customPadChar) {
    if (precision !== null && precision !== undefined) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, customPadChar);
  };

  // doFormat()
  var doFormat = function doFormat(substring, argIndex, modifiers, minWidth, precision, specifier) {
    var number, prefix, method, textTransform, value;

    if (substring === '%%') {
      return '%';
    }

    // parse modifiers
    var padChar = ' '; // pad with spaces by default
    var leftJustify = false;
    var positiveNumberPrefix = '';
    var j, l;

    for (j = 0, l = modifiers.length; j < l; j++) {
      switch (modifiers.charAt(j)) {
        case ' ':
        case '0':
          padChar = modifiers.charAt(j);
          break;
        case '+':
          positiveNumberPrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          if (j + 1 < l) {
            padChar = modifiers.charAt(j + 1);
            j++;
          }
          break;
      }
    }

    if (!minWidth) {
      minWidth = 0;
    } else {
      minWidth = +minWidth;
    }

    if (!isFinite(minWidth)) {
      throw new Error('Width must be finite');
    }

    if (!precision) {
      precision = specifier === 'd' ? 0 : 'fFeE'.indexOf(specifier) > -1 ? 6 : undefined;
    } else {
      precision = +precision;
    }

    if (argIndex && +argIndex === 0) {
      throw new Error('Argument number must be greater than zero');
    }

    if (argIndex && +argIndex >= args.length) {
      throw new Error('Too few arguments');
    }

    value = argIndex ? args[+argIndex] : args[i++];

    switch (specifier) {
      case '%':
        return '%';
      case 's':
        return _formatString(value + '', leftJustify, minWidth, precision, padChar);
      case 'c':
        return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, padChar);
      case 'b':
        return _formatBaseX(value, 2, leftJustify, minWidth, precision, padChar);
      case 'o':
        return _formatBaseX(value, 8, leftJustify, minWidth, precision, padChar);
      case 'x':
        return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar);
      case 'X':
        return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar).toUpperCase();
      case 'u':
        return _formatBaseX(value, 10, leftJustify, minWidth, precision, padChar);
      case 'i':
      case 'd':
        number = +value || 0;
        // Plain Math.round doesn't just truncate
        number = Math.round(number - number % 1);
        prefix = number < 0 ? '-' : positiveNumberPrefix;
        value = prefix + _pad(String(Math.abs(number)), precision, '0', false);

        if (leftJustify && padChar === '0') {
          // can't right-pad 0s on integers
          padChar = ' ';
        }
        return justify(value, prefix, leftJustify, minWidth, padChar);
      case 'e':
      case 'E':
      case 'f': // @todo: Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value;
        prefix = number < 0 ? '-' : positiveNumberPrefix;
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(specifier.toLowerCase())];
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(specifier) % 2];
        value = prefix + Math.abs(number)[method](precision);
        return justify(value, prefix, leftJustify, minWidth, padChar)[textTransform]();
      default:
        // unknown specifier, consume that char and return empty
        return '';
    }
  };

  try {
    return format.replace(regex, doFormat);
  } catch (err) {
    return false;
  }
};
//# sourceMappingURL=sprintf.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __webpack_require__(/*! path */ "./node_modules/node-libs-browser/node_modules/path-browserify/index.js");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Twig.js
 *
 * @copyright 2011-2016 John Roepke and the Twig.js Contributors
 * @license   Available under the BSD 2-Clause License
 * @link      https://github.com/twigjs/twig.js
 */

module.exports = __webpack_require__(3)();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// ## twig.factory.js
//
// This file handles creating the Twig library
module.exports = function factory() {
    var Twig = {
        VERSION: '1.13.3',
    };

    __webpack_require__(4)(Twig);
    __webpack_require__(5)(Twig);
    __webpack_require__(6)(Twig);
    __webpack_require__(8)(Twig);
    __webpack_require__(9)(Twig);
    __webpack_require__(10)(Twig);
    __webpack_require__(20)(Twig);
    __webpack_require__(21)(Twig);
    __webpack_require__(23)(Twig);
    __webpack_require__(24)(Twig);
    __webpack_require__(25)(Twig);
    __webpack_require__(26)(Twig);
    __webpack_require__(27)(Twig);
    __webpack_require__(28)(Twig);
    __webpack_require__(29)(Twig);

    Twig.exports.factory = factory;

    return Twig.exports;
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// ## twig.core.js
//
// This file handles template level tokenizing, compiling and parsing.
module.exports = function (Twig) {
    "use strict";

    Twig.trace = false;
    Twig.debug = false;

    // Default caching to true for the improved performance it offers
    Twig.cache = true;

    Twig.noop = function() {};

    Twig.placeholders = {
        parent: "{{|PARENT|}}"
    };

    Twig.hasIndexOf = Array.prototype.hasOwnProperty("indexOf");

    /**
     * Fallback for Array.indexOf for IE8 et al
     */
    Twig.indexOf = function (arr, searchElement /*, fromIndex */ ) {
        if (Twig.hasIndexOf) {
            return arr.indexOf(searchElement);
        }
        if (arr === void 0 || arr === null) {
            throw new TypeError();
        }
        var t = Object(arr);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            // console.log("indexOf not found1 ", JSON.stringify(searchElement), JSON.stringify(arr));
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        if (arr == searchElement) {
            return 0;
        }
        // console.log("indexOf not found2 ", JSON.stringify(searchElement), JSON.stringify(arr));

        return -1;
    }

    Twig.forEach = function (arr, callback, thisArg) {
        if (Array.prototype.forEach ) {
            return arr.forEach(callback, thisArg);
        }

        var T, k;

        if ( arr == null ) {
          throw new TypeError( " this is null or not defined" );
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(arr);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ( {}.toString.call(callback) != "[object Function]" ) {
          throw new TypeError( callback + " is not a function" );
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if ( thisArg ) {
          T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while( k < len ) {

          var kValue;

          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if ( k in O ) {

            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[ k ];

            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call( T, kValue, k, O );
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
    };

    Twig.merge = function(target, source, onlyChanged) {
        Twig.forEach(Object.keys(source), function (key) {
            if (onlyChanged && !(key in target)) {
                return;
            }

            target[key] = source[key]
        });

        return target;
    };

    /**
     * try/catch in a function causes the entire function body to remain unoptimized.
     * Use this instead so only ``Twig.attempt` will be left unoptimized.
     */
    Twig.attempt = function(fn, exceptionHandler) {
        try { return fn(); }
        catch(ex) { return exceptionHandler(ex); }
    }

    /**
     * Exception thrown by twig.js.
     */
    Twig.Error = function(message, file) {
       this.message = message;
       this.name = "TwigException";
       this.type = "TwigException";
       this.file = file;
    };

    /**
     * Get the string representation of a Twig error.
     */
    Twig.Error.prototype.toString = function() {
        var output = this.name + ": " + this.message;

        return output;
    };

    /**
     * Wrapper for logging to the console.
     */
    Twig.log = {
        trace: function() {if (Twig.trace && console) {console.log(Array.prototype.slice.call(arguments));}},
        debug: function() {if (Twig.debug && console) {console.log(Array.prototype.slice.call(arguments));}}
    };


    if (typeof console !== "undefined") {
        if (typeof console.error !== "undefined") {
            Twig.log.error = function() {
                console.error.apply(console, arguments);
            }
        } else if (typeof console.log !== "undefined") {
            Twig.log.error = function() {
                console.log.apply(console, arguments);
            }
        }
    } else {
        Twig.log.error = function(){};
    }

    /**
     * Wrapper for child context objects in Twig.
     *
     * @param {Object} context Values to initialize the context with.
     */
    Twig.ChildContext = function(context) {
        return Twig.lib.copy(context);
    };

    /**
     * Container for methods related to handling high level template tokens
     *      (for example: {{ expression }}, {% logic %}, {# comment #}, raw data)
     */
    Twig.token = {};

    /**
     * Token types.
     */
    Twig.token.type = {
        output:                 'output',
        logic:                  'logic',
        comment:                'comment',
        raw:                    'raw',
        output_whitespace_pre:  'output_whitespace_pre',
        output_whitespace_post: 'output_whitespace_post',
        output_whitespace_both: 'output_whitespace_both',
        logic_whitespace_pre:   'logic_whitespace_pre',
        logic_whitespace_post:  'logic_whitespace_post',
        logic_whitespace_both:  'logic_whitespace_both'
    };

    /**
     * Token syntax definitions.
     */
    Twig.token.definitions = [
        {
            type: Twig.token.type.raw,
            open: '{% raw %}',
            close: '{% endraw %}'
        },
        {
            type: Twig.token.type.raw,
            open: '{% verbatim %}',
            close: '{% endverbatim %}'
        },
        // *Whitespace type tokens*
        //
        // These typically take the form `{{- expression -}}` or `{{- expression }}` or `{{ expression -}}`.
        {
            type: Twig.token.type.output_whitespace_pre,
            open: '{{-',
            close: '}}'
        },
        {
            type: Twig.token.type.output_whitespace_post,
            open: '{{',
            close: '-}}'
        },
        {
            type: Twig.token.type.output_whitespace_both,
            open: '{{-',
            close: '-}}'
        },
        {
            type: Twig.token.type.logic_whitespace_pre,
            open: '{%-',
            close: '%}'
        },
        {
            type: Twig.token.type.logic_whitespace_post,
            open: '{%',
            close: '-%}'
        },
        {
            type: Twig.token.type.logic_whitespace_both,
            open: '{%-',
            close: '-%}'
        },
        // *Output type tokens*
        //
        // These typically take the form `{{ expression }}`.
        {
            type: Twig.token.type.output,
            open: '{{',
            close: '}}'
        },
        // *Logic type tokens*
        //
        // These typically take a form like `{% if expression %}` or `{% endif %}`
        {
            type: Twig.token.type.logic,
            open: '{%',
            close: '%}'
        },
        // *Comment type tokens*
        //
        // These take the form `{# anything #}`
        {
            type: Twig.token.type.comment,
            open: '{#',
            close: '#}'
        }
    ];


    /**
     * What characters start "strings" in token definitions. We need this to ignore token close
     * strings inside an expression.
     */
    Twig.token.strings = ['"', "'"];

    Twig.token.findStart = function (template) {
        var output = {
                position: null,
                def: null
            },
            close_position = null,
            len = Twig.token.definitions.length,
            i,
            token_template,
            first_key_position,
            close_key_position;

        for (i=0;i<len;i++) {
            token_template = Twig.token.definitions[i];
            first_key_position = template.indexOf(token_template.open);
            close_key_position = template.indexOf(token_template.close);

            Twig.log.trace("Twig.token.findStart: ", "Searching for ", token_template.open, " found at ", first_key_position);

            //Special handling for mismatched tokens
            if (first_key_position >= 0) {
                //This token matches the template
                if (token_template.open.length !== token_template.close.length) {
                    //This token has mismatched closing and opening tags
                    if (close_key_position < 0) {
                        //This token's closing tag does not match the template
                        continue;
                    }
                }
            }
            // Does this token occur before any other types?
            if (first_key_position >= 0 && (output.position === null || first_key_position < output.position)) {
                output.position = first_key_position;
                output.def = token_template;
                close_position = close_key_position;
            } else if (first_key_position >= 0 && output.position !== null && first_key_position === output.position) {
                /*This token exactly matches another token,
                greedily match to check if this token has a greater specificity*/
                if (token_template.open.length > output.def.open.length) {
                    //This token's opening tag is more specific than the previous match
                    output.position = first_key_position;
                    output.def = token_template;
                    close_position = close_key_position;
                } else if (token_template.open.length === output.def.open.length) {
                    if (token_template.close.length > output.def.close.length) {
                        //This token's opening tag is as specific as the previous match,
                        //but the closing tag has greater specificity
                        if (close_key_position >= 0 && close_key_position < close_position) {
                            //This token's closing tag exists in the template,
                            //and it occurs sooner than the previous match
                            output.position = first_key_position;
                            output.def = token_template;
                            close_position = close_key_position;
                        }
                    } else if (close_key_position >= 0 && close_key_position < close_position) {
                        //This token's closing tag is not more specific than the previous match,
                        //but it occurs sooner than the previous match
                        output.position = first_key_position;
                        output.def = token_template;
                        close_position = close_key_position;
                    }
                }
            }
        }

        // delete output['close_position'];

        return output;
    };

    Twig.token.findEnd = function (template, token_def, start) {
        var end = null,
            found = false,
            offset = 0,

            // String position variables
            str_pos = null,
            str_found = null,
            pos = null,
            end_offset = null,
            this_str_pos = null,
            end_str_pos = null,

            // For loop variables
            i,
            l;

        while (!found) {
            str_pos = null;
            str_found = null;
            pos = template.indexOf(token_def.close, offset);

            if (pos >= 0) {
                end = pos;
                found = true;
            } else {
                // throw an exception
                throw new Twig.Error("Unable to find closing bracket '" + token_def.close +
                                "'" + " opened near template position " + start);
            }

            // Ignore quotes within comments; just look for the next comment close sequence,
            // regardless of what comes before it. https://github.com/justjohn/twig.js/issues/95
            if (token_def.type === Twig.token.type.comment) {
              break;
            }
            // Ignore quotes within raw tag
            // Fixes #283
            if (token_def.type === Twig.token.type.raw) {
                break;
            }

            l = Twig.token.strings.length;
            for (i = 0; i < l; i += 1) {
                this_str_pos = template.indexOf(Twig.token.strings[i], offset);

                if (this_str_pos > 0 && this_str_pos < pos &&
                        (str_pos === null || this_str_pos < str_pos)) {
                    str_pos = this_str_pos;
                    str_found = Twig.token.strings[i];
                }
            }

            // We found a string before the end of the token, now find the string's end and set the search offset to it
            if (str_pos !== null) {
                end_offset = str_pos + 1;
                end = null;
                found = false;
                while (true) {
                    end_str_pos = template.indexOf(str_found, end_offset);
                    if (end_str_pos < 0) {
                        throw "Unclosed string in template";
                    }
                    // Ignore escaped quotes
                    if (template.substr(end_str_pos - 1, 1) !== "\\") {
                        offset = end_str_pos + 1;
                        break;
                    } else {
                        end_offset = end_str_pos + 1;
                    }
                }
            }
        }
        return end;
    };

    /**
     * Convert a template into high-level tokens.
     */
    Twig.tokenize = function (template) {
        var tokens = [],
            // An offset for reporting errors locations in the template.
            error_offset = 0,

            // The start and type of the first token found in the template.
            found_token = null,
            // The end position of the matched token.
            end = null;

        while (template.length > 0) {
            // Find the first occurance of any token type in the template
            found_token = Twig.token.findStart(template);

            Twig.log.trace("Twig.tokenize: ", "Found token: ", found_token);

            if (found_token.position !== null) {
                // Add a raw type token for anything before the start of the token
                if (found_token.position > 0) {
                    tokens.push({
                        type: Twig.token.type.raw,
                        value: template.substring(0, found_token.position)
                    });
                }
                template = template.substr(found_token.position + found_token.def.open.length);
                error_offset += found_token.position + found_token.def.open.length;

                // Find the end of the token
                end = Twig.token.findEnd(template, found_token.def, error_offset);

                Twig.log.trace("Twig.tokenize: ", "Token ends at ", end);

                tokens.push({
                    type:  found_token.def.type,
                    value: template.substring(0, end).trim()
                });

                if (template.substr( end + found_token.def.close.length, 1 ) === "\n") {
                    switch (found_token.def.type) {
                        case "logic_whitespace_pre":
                        case "logic_whitespace_post":
                        case "logic_whitespace_both":
                        case "logic":
                            // Newlines directly after logic tokens are ignored
                            end += 1;
                            break;
                    }
                }

                template = template.substr(end + found_token.def.close.length);

                // Increment the position in the template
                error_offset += end + found_token.def.close.length;

            } else {
                // No more tokens -> add the rest of the template as a raw-type token
                tokens.push({
                    type: Twig.token.type.raw,
                    value: template
                });
                template = '';
            }
        }

        return tokens;
    };

    Twig.compile = function (tokens) {
        var self = this;
        return Twig.attempt(function() {

            // Output and intermediate stacks
            var output = [],
                stack = [],
                // The tokens between open and close tags
                intermediate_output = [],

                token = null,
                logic_token = null,
                unclosed_token = null,
                // Temporary previous token.
                prev_token = null,
                // Temporary previous output.
                prev_output = null,
                // Temporary previous intermediate output.
                prev_intermediate_output = null,
                // The previous token's template
                prev_template = null,
                // Token lookahead
                next_token = null,
                // The output token
                tok_output = null,

                // Logic Token values
                type = null,
                open = null,
                next = null;

            var compile_output = function(token) {
                Twig.expression.compile.call(self, token);
                if (stack.length > 0) {
                    intermediate_output.push(token);
                } else {
                    output.push(token);
                }
            };

            var compile_logic = function(token) {
                // Compile the logic token
                logic_token = Twig.logic.compile.call(self, token);

                type = logic_token.type;
                open = Twig.logic.handler[type].open;
                next = Twig.logic.handler[type].next;

                Twig.log.trace("Twig.compile: ", "Compiled logic token to ", logic_token,
                                                 " next is: ", next, " open is : ", open);

                // Not a standalone token, check logic stack to see if this is expected
                if (open !== undefined && !open) {
                    prev_token = stack.pop();
                    prev_template = Twig.logic.handler[prev_token.type];

                    if (Twig.indexOf(prev_template.next, type) < 0) {
                        throw new Error(type + " not expected after a " + prev_token.type);
                    }

                    prev_token.output = prev_token.output || [];

                    prev_token.output = prev_token.output.concat(intermediate_output);
                    intermediate_output = [];

                    tok_output = {
                        type: Twig.token.type.logic,
                        token: prev_token
                    };
                    if (stack.length > 0) {
                        intermediate_output.push(tok_output);
                    } else {
                        output.push(tok_output);
                    }
                }

                // This token requires additional tokens to complete the logic structure.
                if (next !== undefined && next.length > 0) {
                    Twig.log.trace("Twig.compile: ", "Pushing ", logic_token, " to logic stack.");

                    if (stack.length > 0) {
                        // Put any currently held output into the output list of the logic operator
                        // currently at the head of the stack before we push a new one on.
                        prev_token = stack.pop();
                        prev_token.output = prev_token.output || [];
                        prev_token.output = prev_token.output.concat(intermediate_output);
                        stack.push(prev_token);
                        intermediate_output = [];
                    }

                    // Push the new logic token onto the logic stack
                    stack.push(logic_token);

                } else if (open !== undefined && open) {
                    tok_output = {
                        type: Twig.token.type.logic,
                        token: logic_token
                    };
                    // Standalone token (like {% set ... %}
                    if (stack.length > 0) {
                        intermediate_output.push(tok_output);
                    } else {
                        output.push(tok_output);
                    }
                }
            };

            while (tokens.length > 0) {
                token = tokens.shift();
                prev_output = output[output.length - 1];
                prev_intermediate_output = intermediate_output[intermediate_output.length - 1];
                next_token = tokens[0];
                Twig.log.trace("Compiling token ", token);
                switch (token.type) {
                    case Twig.token.type.raw:
                        if (stack.length > 0) {
                            intermediate_output.push(token);
                        } else {
                            output.push(token);
                        }
                        break;

                    case Twig.token.type.logic:
                        compile_logic.call(self, token);
                        break;

                    // Do nothing, comments should be ignored
                    case Twig.token.type.comment:
                        break;

                    case Twig.token.type.output:
                        compile_output.call(self, token);
                        break;

                    //Kill whitespace ahead and behind this token
                    case Twig.token.type.logic_whitespace_pre:
                    case Twig.token.type.logic_whitespace_post:
                    case Twig.token.type.logic_whitespace_both:
                    case Twig.token.type.output_whitespace_pre:
                    case Twig.token.type.output_whitespace_post:
                    case Twig.token.type.output_whitespace_both:
                        if (token.type !== Twig.token.type.output_whitespace_post && token.type !== Twig.token.type.logic_whitespace_post) {
                            if (prev_output) {
                                //If the previous output is raw, pop it off
                                if (prev_output.type === Twig.token.type.raw) {
                                    output.pop();

                                    //If the previous output is not just whitespace, trim it
                                    if (prev_output.value.match(/^\s*$/) === null) {
                                        prev_output.value = prev_output.value.trim();
                                        //Repush the previous output
                                        output.push(prev_output);
                                    }
                                }
                            }

                            if (prev_intermediate_output) {
                                //If the previous intermediate output is raw, pop it off
                                if (prev_intermediate_output.type === Twig.token.type.raw) {
                                    intermediate_output.pop();

                                    //If the previous output is not just whitespace, trim it
                                    if (prev_intermediate_output.value.match(/^\s*$/) === null) {
                                        prev_intermediate_output.value = prev_intermediate_output.value.trim();
                                        //Repush the previous intermediate output
                                        intermediate_output.push(prev_intermediate_output);
                                    }
                                }
                            }
                        }

                        //Compile this token
                        switch (token.type) {
                            case Twig.token.type.output_whitespace_pre:
                            case Twig.token.type.output_whitespace_post:
                            case Twig.token.type.output_whitespace_both:
                                compile_output.call(self, token);
                                break;
                            case Twig.token.type.logic_whitespace_pre:
                            case Twig.token.type.logic_whitespace_post:
                            case Twig.token.type.logic_whitespace_both:
                                compile_logic.call(self, token);
                                break;
                        }

                        if (token.type !== Twig.token.type.output_whitespace_pre && token.type !== Twig.token.type.logic_whitespace_pre) {
                            if (next_token) {
                                //If the next token is raw, shift it out
                                if (next_token.type === Twig.token.type.raw) {
                                    tokens.shift();

                                    //If the next token is not just whitespace, trim it
                                    if (next_token.value.match(/^\s*$/) === null) {
                                        next_token.value = next_token.value.trim();
                                        //Unshift the next token
                                        tokens.unshift(next_token);
                                    }
                                }
                            }
                        }

                        break;
                }

                Twig.log.trace("Twig.compile: ", " Output: ", output,
                                                 " Logic Stack: ", stack,
                                                 " Pending Output: ", intermediate_output );
            }

            // Verify that there are no logic tokens left in the stack.
            if (stack.length > 0) {
                unclosed_token = stack.pop();
                throw new Error("Unable to find an end tag for " + unclosed_token.type +
                                ", expecting one of " + unclosed_token.next);
            }
            return output;
        }, function(ex) {
            if (self.options.rethrow) {
                if (ex.type == 'TwigException' && !ex.file) {
                    ex.file = self.id;
                }

                throw ex
            }
            else {
                Twig.log.error("Error compiling twig template " + self.id + ": ");
                if (ex.stack) {
                    Twig.log.error(ex.stack);
                } else {
                    Twig.log.error(ex.toString());
                }
            }
        });
    };

    function handleException(that, ex) {
        if (that.options.rethrow) {
            if (typeof ex === 'string') {
                ex = new Twig.Error(ex)
            }

            if (ex.type == 'TwigException' && !ex.file) {
                ex.file = that.id;
            }

            throw ex;
        }
        else {
            Twig.log.error("Error parsing twig template " + that.id + ": ");
            if (ex.stack) {
                Twig.log.error(ex.stack);
            } else {
                Twig.log.error(ex.toString());
            }

            if (Twig.debug) {
                return ex.toString();
            }
        }
    }

    /**
     * Parse a compiled template.
     *
     * @param {Array} tokens The compiled tokens.
     * @param {Object} context The render context.
     *
     * @return {string} The parsed template.
     */
    Twig.parse = function (tokens, context, allow_async) {
        var that = this,
            output = [],

            // Store any error that might be thrown by the promise chain.
            err = null,

            // This will be set to is_async if template renders synchronously
            is_async = true,
            promise = null,

            // Track logic chains
            chain = true;

        /*
         * Extracted into it's own function such that the function
         * does not get recreated over and over again in the `forEach`
         * loop below. This method can be compiled and optimized
         * a single time instead of being recreated on each iteration.
         */
        function output_push(o) { output.push(o); }

        function parseTokenLogic(logic) {
            if (typeof logic.chain !== 'undefined') {
                chain = logic.chain;
            }
            if (typeof logic.context !== 'undefined') {
                context = logic.context;
            }
            if (typeof logic.output !== 'undefined') {
                output.push(logic.output);
            }
        }

        promise = Twig.async.forEach(tokens, function parseToken(token) {
            Twig.log.debug("Twig.parse: ", "Parsing token: ", token);

            switch (token.type) {
                case Twig.token.type.raw:
                    output.push(Twig.filters.raw(token.value));
                    break;

                case Twig.token.type.logic:
                    return Twig.logic.parseAsync.call(that, token.token /*logic_token*/, context, chain)
                        .then(parseTokenLogic);
                    break;

                case Twig.token.type.comment:
                    // Do nothing, comments should be ignored
                    break;

                //Fall through whitespace to output
                case Twig.token.type.output_whitespace_pre:
                case Twig.token.type.output_whitespace_post:
                case Twig.token.type.output_whitespace_both:
                case Twig.token.type.output:
                    Twig.log.debug("Twig.parse: ", "Output token: ", token.stack);
                    // Parse the given expression in the given context
                    return Twig.expression.parseAsync.call(that, token.stack, context)
                        .then(output_push);
            }
        })
        .then(function() {
            output = Twig.output.call(that, output);
            is_async = false;
            return output;
        })
        .catch(function(e) {
            if (allow_async)
                handleException(that, e);

            err = e;
        });

        // If `allow_async` we will always return a promise since we do not
        // know in advance if we are going to run asynchronously or not.
        if (allow_async)
            return promise;

        // Handle errors here if we fail synchronously.
        if (err !== null)
            return handleException(this, err);

        // If `allow_async` is not true we should not allow the user
        // to use asynchronous functions or filters.
        if (is_async)
            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

        return output;
    };

    /**
     * Tokenize and compile a string template.
     *
     * @param {string} data The template.
     *
     * @return {Array} The compiled tokens.
     */
    Twig.prepare = function(data) {
        var tokens, raw_tokens;

        // Tokenize
        Twig.log.debug("Twig.prepare: ", "Tokenizing ", data);
        raw_tokens = Twig.tokenize.call(this, data);

        // Compile
        Twig.log.debug("Twig.prepare: ", "Compiling ", raw_tokens);
        tokens = Twig.compile.call(this, raw_tokens);

        Twig.log.debug("Twig.prepare: ", "Compiled ", tokens);

        return tokens;
    };

    /**
     * Join the output token's stack and escape it if needed
     *
     * @param {Array} Output token's stack
     *
     * @return {string|String} Autoescaped output
     */
    Twig.output = function(output) {
        var autoescape = this.options.autoescape;

        if (!autoescape) {
            return output.join("");
        }

        var strategy = (typeof autoescape == 'string') ? autoescape : 'html';
        var i = 0,
            len = output.length,
            str = '';

        // [].map would be better but it's not supported by IE8-
        var escaped_output = new Array(len);
        for (i = 0; i < len; i++) {
            str = output[i];

            if (str && (str.twig_markup !== true && str.twig_markup !== strategy)
                && !(strategy === 'html' && str.twig_markup === 'html_attr')) {
                str = Twig.filters.escape(str, [ strategy ]);
            }

            escaped_output[i] = str;
        }

        if (escaped_output.length < 1)
            return '';

        return Twig.Markup(escaped_output.join(""), true);
    }

    // Namespace for template storage and retrieval
    Twig.Templates = {
        /**
         * Registered template loaders - use Twig.Templates.registerLoader to add supported loaders
         * @type {Object}
         */
        loaders: {},

        /**
         * Registered template parsers - use Twig.Templates.registerParser to add supported parsers
         * @type {Object}
         */
        parsers: {},

        /**
         * Cached / loaded templates
         * @type {Object}
         */
        registry: {}
    };

    /**
     * Is this id valid for a twig template?
     *
     * @param {string} id The ID to check.
     *
     * @throws {Twig.Error} If the ID is invalid or used.
     * @return {boolean} True if the ID is valid.
     */
    Twig.validateId = function(id) {
        if (id === "prototype") {
            throw new Twig.Error(id + " is not a valid twig identifier");
        } else if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
            throw new Twig.Error("There is already a template with the ID " + id);
        }
        return true;
    }

    /**
     * Register a template loader
     *
     * @example
     * Twig.extend(function(Twig) {
     *    Twig.Templates.registerLoader('custom_loader', function(location, params, callback, error_callback) {
     *        // ... load the template ...
     *        params.data = loadedTemplateData;
     *        // create and return the template
     *        var template = new Twig.Template(params);
     *        if (typeof callback === 'function') {
     *            callback(template);
     *        }
     *        return template;
     *    });
     * });
     *
     * @param {String} method_name The method this loader is intended for (ajax, fs)
     * @param {Function} func The function to execute when loading the template
     * @param {Object|undefined} scope Optional scope parameter to bind func to
     *
     * @throws Twig.Error
     *
     * @return {void}
     */
    Twig.Templates.registerLoader = function(method_name, func, scope) {
        if (typeof func !== 'function') {
            throw new Twig.Error('Unable to add loader for ' + method_name + ': Invalid function reference given.');
        }
        if (scope) {
            func = func.bind(scope);
        }
        this.loaders[method_name] = func;
    };

    /**
     * Remove a registered loader
     *
     * @param {String} method_name The method name for the loader you wish to remove
     *
     * @return {void}
     */
    Twig.Templates.unRegisterLoader = function(method_name) {
        if (this.isRegisteredLoader(method_name)) {
            delete this.loaders[method_name];
        }
    };

    /**
     * See if a loader is registered by its method name
     *
     * @param {String} method_name The name of the loader you are looking for
     *
     * @return {boolean}
     */
    Twig.Templates.isRegisteredLoader = function(method_name) {
        return this.loaders.hasOwnProperty(method_name);
    };

    /**
     * Register a template parser
     *
     * @example
     * Twig.extend(function(Twig) {
     *    Twig.Templates.registerParser('custom_parser', function(params) {
     *        // this template source can be accessed in params.data
     *        var template = params.data
     *
     *        // ... custom process that modifies the template
     *
     *        // return the parsed template
     *        return template;
     *    });
     * });
     *
     * @param {String} method_name The method this parser is intended for (twig, source)
     * @param {Function} func The function to execute when parsing the template
     * @param {Object|undefined} scope Optional scope parameter to bind func to
     *
     * @throws Twig.Error
     *
     * @return {void}
     */
    Twig.Templates.registerParser = function(method_name, func, scope) {
        if (typeof func !== 'function') {
            throw new Twig.Error('Unable to add parser for ' + method_name + ': Invalid function regerence given.');
        }

        if (scope) {
            func = func.bind(scope);
        }

        this.parsers[method_name] = func;
    };

    /**
     * Remove a registered parser
     *
     * @param {String} method_name The method name for the parser you wish to remove
     *
     * @return {void}
     */
    Twig.Templates.unRegisterParser = function(method_name) {
        if (this.isRegisteredParser(method_name)) {
            delete this.parsers[method_name];
        }
    };

    /**
     * See if a parser is registered by its method name
     *
     * @param {String} method_name The name of the parser you are looking for
     *
     * @return {boolean}
     */
    Twig.Templates.isRegisteredParser = function(method_name) {
        return this.parsers.hasOwnProperty(method_name);
    };

    /**
     * Save a template object to the store.
     *
     * @param {Twig.Template} template   The twig.js template to store.
     */
    Twig.Templates.save = function(template) {
        if (template.id === undefined) {
            throw new Twig.Error("Unable to save template with no id");
        }
        Twig.Templates.registry[template.id] = template;
    };

    /**
     * Load a previously saved template from the store.
     *
     * @param {string} id   The ID of the template to load.
     *
     * @return {Twig.Template} A twig.js template stored with the provided ID.
     */
    Twig.Templates.load = function(id) {
        if (!Twig.Templates.registry.hasOwnProperty(id)) {
            return null;
        }
        return Twig.Templates.registry[id];
    };

    /**
     * Load a template from a remote location using AJAX and saves in with the given ID.
     *
     * Available parameters:
     *
     *      async:       Should the HTTP request be performed asynchronously.
     *                      Defaults to true.
     *      method:      What method should be used to load the template
     *                      (fs or ajax)
     *      parser:      What method should be used to parse the template
     *                      (twig or source)
     *      precompiled: Has the template already been compiled.
     *
     * @param {string} location  The remote URL to load as a template.
     * @param {Object} params The template parameters.
     * @param {function} callback  A callback triggered when the template finishes loading.
     * @param {function} error_callback  A callback triggered if an error occurs loading the template.
     *
     *
     */
    Twig.Templates.loadRemote = function(location, params, callback, error_callback) {
        var loader,
            // Default to the URL so the template is cached.
            id = typeof params.id == 'undefined' ? location : params.id,
            cached = Twig.Templates.registry[id];

        // Check for existing template
        if (Twig.cache && typeof cached != 'undefined') {
            // A template is already saved with the given id.
            if (typeof callback === 'function') {
                callback(cached);
            }
            // TODO: if async, return deferred promise
            return cached;
        }

        //if the parser name hasn't been set, default it to twig
        params.parser = params.parser || 'twig';
        params.id = id;

        // Default to async
        if (typeof params.async === 'undefined') {
            params.async = true;
        }

        // Assume 'fs' if the loader is not defined
        loader = this.loaders[params.method] || this.loaders.fs;
        return loader.call(this, location, params, callback, error_callback);
    };

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    /**
     * Create a new twig.js template.
     *
     * Parameters: {
     *      data:   The template, either pre-compiled tokens or a string template
     *      id:     The name of this template
     *      blocks: Any pre-existing block from a child template
     * }
     *
     * @param {Object} params The template parameters.
     */
    Twig.Template = function ( params ) {
        var data = params.data,
            id = params.id,
            blocks = params.blocks,
            macros = params.macros || {},
            base = params.base,
            path = params.path,
            url = params.url,
            name = params.name,
            method = params.method,
            // parser options
            options = params.options;

        // # What is stored in a Twig.Template
        //
        // The Twig Template hold several chucks of data.
        //
        //     {
        //          id:     The token ID (if any)
        //          tokens: The list of tokens that makes up this template.
        //          blocks: The list of block this template contains.
        //          base:   The base template (if any)
        //            options:  {
        //                Compiler/parser options
        //
        //                strict_variables: true/false
        //                    Should missing variable/keys emit an error message. If false, they default to null.
        //            }
        //     }
        //

        this.id     = id;
        this.method = method;
        this.base   = base;
        this.path   = path;
        this.url    = url;
        this.name   = name;
        this.macros = macros;
        this.options = options;

        this.reset(blocks);

        if (is('String', data)) {
            this.tokens = Twig.prepare.call(this, data);
        } else {
            this.tokens = data;
        }

        if (id !== undefined) {
            Twig.Templates.save(this);
        }
    };

    Twig.Template.prototype.reset = function(blocks) {
        Twig.log.debug("Twig.Template.reset", "Reseting template " + this.id);
        this.blocks = {};
        this.importedBlocks = [];
        this.originalBlockTokens = {};
        this.child = {
            blocks: blocks || {}
        };
        this.extend = null;
        this.parseStack = [];
    };

    Twig.Template.prototype.render = function (context, params, allow_async) {
        var that = this;

        this.context = context || {};

        // Clear any previous state
        this.reset();
        if (params && params.blocks) {
            this.blocks = params.blocks;
        }
        if (params && params.macros) {
            this.macros = params.macros;
        }

        return Twig.async.potentiallyAsync(this, allow_async, function() {
            return Twig.parseAsync.call(this, this.tokens, this.context)
            .then(function(output) {
                var ext_template,
                    url;

                // Does this template extend another
                if (that.extend) {

                    // check if the template is provided inline
                    if ( that.options.allowInlineIncludes ) {
                        ext_template = Twig.Templates.load(that.extend);
                        if ( ext_template ) {
                            ext_template.options = that.options;
                        }
                    }

                    // check for the template file via include
                    if (!ext_template) {
                        url = Twig.path.parsePath(that, that.extend);

                        ext_template = Twig.Templates.loadRemote(url, {
                            method: that.getLoaderMethod(),
                            base: that.base,
                            async:  false,
                            id:     url,
                            options: that.options
                        });
                    }

                    that.parent = ext_template;

                    return that.parent.renderAsync(that.context, {
                        blocks: that.blocks,
                        isInclude: true
                    });
                }

                if (!params) {
                    return output.valueOf();
                } else if (params.output == 'blocks') {
                    return that.blocks;
                } else if (params.output == 'macros') {
                    return that.macros;
                } else if (params.isInclude === true) {
                    return output
                } else {
                    return output.valueOf();
                }
            });
        });
    };

    Twig.Template.prototype.importFile = function(file) {
        var url, sub_template;
        if (!this.url && this.options.allowInlineIncludes) {
            file = this.path ? Twig.path.parsePath(this, file) : file;
            sub_template = Twig.Templates.load(file);

            if (!sub_template) {
                sub_template = Twig.Templates.loadRemote(url, {
                    id: file,
                    method: this.getLoaderMethod(),
                    async: false,
                    path: file,
                    options: this.options
                });

                if (!sub_template) {
                    throw new Twig.Error("Unable to find the template " + file);
                }
            }

            sub_template.options = this.options;

            return sub_template;
        }

        url = Twig.path.parsePath(this, file);

        // Load blocks from an external file
        sub_template = Twig.Templates.loadRemote(url, {
            method: this.getLoaderMethod(),
            base: this.base,
            async: false,
            options: this.options,
            id: url
        });

        return sub_template;
    };

    Twig.Template.prototype.importBlocks = function(file, override) {
        var sub_template = this.importFile(file),
            context = this.context,
            that = this,
            key;

        override = override || false;

        sub_template.render(context);

        // Mixin blocks
        Twig.forEach(Object.keys(sub_template.blocks), function(key) {
            if (override || that.blocks[key] === undefined) {
                that.blocks[key] = sub_template.blocks[key];
                that.importedBlocks.push(key);
            }
        });
    };

    Twig.Template.prototype.importMacros = function(file) {
        var url = Twig.path.parsePath(this, file);

        // load remote template
        var remoteTemplate = Twig.Templates.loadRemote(url, {
            method: this.getLoaderMethod(),
            async: false,
            id: url
        });

        return remoteTemplate;
    };

    Twig.Template.prototype.getLoaderMethod = function() {
        if (this.path) {
            return 'fs';
        }
        if (this.url) {
            return 'ajax';
        }
        return this.method || 'fs';
    };

    Twig.Template.prototype.compile = function(options) {
        // compile the template into raw JS
        return Twig.compiler.compile(this, options);
    };

    /**
     * Create safe output
     *
     * @param {string} Content safe to output
     *
     * @return {String} Content wrapped into a String
     */

    Twig.Markup = function(content, strategy) {
        if (typeof content !== 'string' || content.length < 1)
            return content;

        var output = new String(content);
        output.twig_markup = (typeof strategy == 'undefined') ? true : strategy;

        return output;
    };

    return Twig;

};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// ## twig.compiler.js
//
// This file handles compiling templates into JS
module.exports = function (Twig) {
    /**
     * Namespace for compilation.
     */
    Twig.compiler = {
        module: {}
    };

    // Compile a Twig Template to output.
    Twig.compiler.compile = function(template, options) {
        // Get tokens
        var tokens = JSON.stringify(template.tokens)
            , id = template.id
            , output;

        if (options.module) {
            if (Twig.compiler.module[options.module] === undefined) {
                throw new Twig.Error("Unable to find module type " + options.module);
            }
            output = Twig.compiler.module[options.module](id, tokens, options.twig);
        } else {
            output = Twig.compiler.wrap(id, tokens);
        }
        return output;
    };

    Twig.compiler.module = {
        amd: function(id, tokens, pathToTwig) {
            return 'define(["' + pathToTwig + '"], function (Twig) {\n\tvar twig, templates;\ntwig = Twig.twig;\ntemplates = ' + Twig.compiler.wrap(id, tokens) + '\n\treturn templates;\n});';
        }
        , node: function(id, tokens) {
            return 'var twig = require("twig").twig;\n'
                + 'exports.template = ' + Twig.compiler.wrap(id, tokens)
        }
        , cjs2: function(id, tokens, pathToTwig) {
            return 'module.declare([{ twig: "' + pathToTwig + '" }], function (require, exports, module) {\n'
                        + '\tvar twig = require("twig").twig;\n'
                        + '\texports.template = ' + Twig.compiler.wrap(id, tokens)
                    + '\n});'
        }
    };

    Twig.compiler.wrap = function(id, tokens) {
        return 'twig({id:"'+id.replace('"', '\\"')+'", data:'+tokens+', precompiled: true});\n';
    };

    return Twig;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// ## twig.expression.js
//
// This file handles tokenizing, compiling and parsing expressions.
module.exports = function (Twig) {
    "use strict";

    function parseParams(thisArg, params, context) {
        if (params)
            return Twig.expression.parseAsync.call(thisArg, params, context);

        return Twig.Promise.resolve(false);
    }

    /**
     * Namespace for expression handling.
     */
    Twig.expression = { };

    __webpack_require__(7)(Twig);

    /**
     * Reserved word that can't be used as variable names.
     */
    Twig.expression.reservedWords = [
        "true", "false", "null", "TRUE", "FALSE", "NULL", "_context", "and", "b-and", "or", "b-or", "b-xor", "in", "not in", "if", "matches", "starts", "ends", "with"
    ];

    /**
     * The type of tokens used in expressions.
     */
    Twig.expression.type = {
        comma:      'Twig.expression.type.comma',
        operator: {
            unary:  'Twig.expression.type.operator.unary',
            binary: 'Twig.expression.type.operator.binary'
        },
        string:     'Twig.expression.type.string',
        bool:       'Twig.expression.type.bool',
        slice:      'Twig.expression.type.slice',
        array: {
            start:  'Twig.expression.type.array.start',
            end:    'Twig.expression.type.array.end'
        },
        object: {
            start:  'Twig.expression.type.object.start',
            end:    'Twig.expression.type.object.end'
        },
        parameter: {
            start:  'Twig.expression.type.parameter.start',
            end:    'Twig.expression.type.parameter.end'
        },
        subexpression: {
            start:  'Twig.expression.type.subexpression.start',
            end:    'Twig.expression.type.subexpression.end'
        },
        key: {
            period:   'Twig.expression.type.key.period',
            brackets: 'Twig.expression.type.key.brackets'
        },
        filter:     'Twig.expression.type.filter',
        _function:  'Twig.expression.type._function',
        variable:   'Twig.expression.type.variable',
        number:     'Twig.expression.type.number',
        _null:     'Twig.expression.type.null',
        context:    'Twig.expression.type.context',
        test:       'Twig.expression.type.test'
    };

    Twig.expression.set = {
        // What can follow an expression (in general)
        operations: [
            Twig.expression.type.filter,
            Twig.expression.type.operator.unary,
            Twig.expression.type.operator.binary,
            Twig.expression.type.array.end,
            Twig.expression.type.object.end,
            Twig.expression.type.parameter.end,
            Twig.expression.type.subexpression.end,
            Twig.expression.type.comma,
            Twig.expression.type.test
        ],
        expressions: [
            Twig.expression.type._function,
            Twig.expression.type.bool,
            Twig.expression.type.string,
            Twig.expression.type.variable,
            Twig.expression.type.number,
            Twig.expression.type._null,
            Twig.expression.type.context,
            Twig.expression.type.parameter.start,
            Twig.expression.type.array.start,
            Twig.expression.type.object.start,
            Twig.expression.type.subexpression.start,
            Twig.expression.type.operator.unary
        ]
    };

    // Most expressions allow a '.' or '[' after them, so we provide a convenience set
    Twig.expression.set.operations_extended = Twig.expression.set.operations.concat([
                    Twig.expression.type.key.period,
                    Twig.expression.type.key.brackets,
                    Twig.expression.type.slice]);

    // Some commonly used compile and parse functions.
    Twig.expression.fn = {
        compile: {
            push: function(token, stack, output) {
                output.push(token);
            },
            push_both: function(token, stack, output) {
                output.push(token);
                stack.push(token);
            }
        },
        parse: {
            push: function(token, stack, context) {
                stack.push(token);
            },
            push_value: function(token, stack, context) {
                stack.push(token.value);
            }
        }
    };

    // The regular expressions and compile/parse logic used to match tokens in expressions.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: One or more regular expressions that matche the format of the token.
    //
    //      next:  Valid tokens that can occur next in the expression.
    //
    // Functions:
    //
    //      compile: A function that compiles the raw regular expression match into a token.
    //
    //      parse:   A function that parses the compiled token into output.
    //
    Twig.expression.definitions = [
        {
            type: Twig.expression.type.test,
            regex: /^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*(\s?as)?)/,
            next: Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.filter   = token.match[2];
                token.modifier = token.match[1];
                delete token.match;
                delete token.value;
                output.push(token);
            },
            parse: function(token, stack, context) {
                var value = stack.pop();

                return parseParams(this, token.params, context)
                .then(function(params) {
                    var result = Twig.test(token.filter, value, params);

                    if (token.modifier == 'not') {
                        stack.push(!result);
                    } else {
                        stack.push(result);
                    }
                });
            }
        },
        {
            type: Twig.expression.type.comma,
            // Match a comma
            regex: /^,/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end, Twig.expression.type.object.end]),
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;

                delete token.match;
                delete token.value;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.object.start
                            || stack_token.type === Twig.expression.type.parameter.start
                            || stack_token.type === Twig.expression.type.array.start) {
                        stack.push(stack_token);
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            }
        },
        {
            /**
             * Match a number (integer or decimal)
             */
            type: Twig.expression.type.number,
            // match a number
            regex: /^\-?\d+(\.\d+)?/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = Number(token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            type: Twig.expression.type.operator.binary,
            // Match any of ??, ?:, +, *, /, -, %, ~, <, <=, >, >=, !=, ==, **, ?, :, and, b-and, or, b-or, b-xor, in, not in
            // and, or, in, not in, matches, starts with, ends with can be followed by a space or parenthesis
            regex: /(^\?\?|^\?\:|^(b\-and)|^(b\-or)|^(b\-xor)|^[\+\-~%\?]|^[\:](?!\d\])|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^(and)[\(|\s+]|^(or)[\(|\s+]|^(in)[\(|\s+]|^(not in)[\(|\s+]|^(matches)|^(starts with)|^(ends with)|^\.\.)/,
            next: Twig.expression.set.expressions,
            transform: function(match, tokens) {
                switch(match[0]) {
                    case 'and(':
                    case 'or(':
                    case 'in(':
                    case 'not in(':
                        //Strip off the ( if it exists
                        tokens[tokens.length - 1].value = match[2];
                        return match[0];
                        break;
                    default:
                        return '';
                }
            },
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                if (value === ":") {
                    // Check if this is a ternary or object key being set
                    if (stack[stack.length - 1] && stack[stack.length-1].value === "?") {
                        // Continue as normal for a ternary
                    } else {
                        // This is not a ternary so we push the token to the output where it can be handled
                        //   when the assocated object is closed.
                        var key_token = output.pop();

                        if (key_token.type === Twig.expression.type.string ||
                                key_token.type === Twig.expression.type.variable) {
                            token.key = key_token.value;
                        } else if (key_token.type === Twig.expression.type.number) {
                            // Convert integer keys into string keys
                            token.key = key_token.value.toString();
                        } else if (key_token.expression &&
                            (key_token.type === Twig.expression.type.parameter.end ||
                            key_token.type == Twig.expression.type.subexpression.end)) {
                            token.params = key_token.params;
                        } else {
                            throw new Twig.Error("Unexpected value before ':' of " + key_token.type + " = " + key_token.value);
                        }

                        output.push(token);
                        return;
                    }
                } else {
                    stack.push(operator);
                }
            },
            parse: function(token, stack, context) {
                if (token.key) {
                    // handle ternary ':' operator
                    stack.push(token);
                } else if (token.params) {
                    // handle "{(expression):value}"
                    return Twig.expression.parseAsync.call(this, token.params, context)
                    .then(function(key) {
                        token.key = key;
                        stack.push(token);

                        //If we're in a loop, we might need token.params later, especially in this form of "(expression):value"
                        if (!context.loop) {
                            delete(token.params);
                        }
                    });
                } else {
                    Twig.expression.operator.parse(token.value, stack);
                }
            }
        },
        {
            type: Twig.expression.type.operator.unary,
            // Match any of not
            regex: /(^not\s+)/,
            next: Twig.expression.set.expressions,
            compile: function(token, stack, output) {
                delete token.match;

                token.value = token.value.trim();
                var value = token.value,
                    operator = Twig.expression.operator.lookup(value, token);

                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

                while (stack.length > 0 &&
                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
                            (
                                (operator.associativity === Twig.expression.operator.leftToRight &&
                                 operator.precidence    >= stack[stack.length-1].precidence) ||

                                (operator.associativity === Twig.expression.operator.rightToLeft &&
                                 operator.precidence    >  stack[stack.length-1].precidence)
                            )
                       ) {
                     var temp = stack.pop();
                     output.push(temp);
                }

                stack.push(operator);
            },
            parse: function(token, stack, context) {
                Twig.expression.operator.parse(token.value, stack);
            }
        },
        {
            /**
             * Match a string. This is anything between a pair of single or double quotes.
             */
            type: Twig.expression.type.string,
            // See: http://blog.stevenlevithan.com/archives/match-quoted-string
            regex: /^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var value = token.value;
                delete token.match

                // Remove the quotes from the string
                if (value.substring(0, 1) === '"') {
                    value = value.replace('\\"', '"');
                } else {
                    value = value.replace("\\'", "'");
                }
                token.value = value.substring(1, value.length-1).replace( /\\n/g, "\n" ).replace( /\\r/g, "\r" );
                Twig.log.trace("Twig.expression.compile: ", "String value: ", token.value);
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match a subexpression set start.
             */
            type: Twig.expression.type.subexpression.start,
            regex: /^\(/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.subexpression.end]),
            compile: function(token, stack, output) {
                token.value = '(';
                output.push(token);
                stack.push(token);
            },
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match a subexpression set end.
             */
            type: Twig.expression.type.subexpression.end,
            regex: /^\)/,
            next: Twig.expression.set.operations_extended,
            validate: function(match, tokens) {
                // Iterate back through previous tokens to ensure we follow a subexpression start
                var i = tokens.length - 1,
                    found_subexpression_start = false,
                    next_subexpression_start_invalid = false,
                    unclosed_parameter_count = 0;

                while(!found_subexpression_start && i >= 0) {
                    var token = tokens[i];

                    found_subexpression_start = token.type === Twig.expression.type.subexpression.start;

                    // If we have previously found a subexpression end, then this subexpression start is the start of
                    // that subexpression, not the subexpression we are searching for
                    if (found_subexpression_start && next_subexpression_start_invalid) {
                        next_subexpression_start_invalid = false;
                        found_subexpression_start = false;
                    }

                    // Count parameter tokens to ensure we dont return truthy for a parameter opener
                    if (token.type === Twig.expression.type.parameter.start) {
                        unclosed_parameter_count++;
                    } else if (token.type === Twig.expression.type.parameter.end) {
                        unclosed_parameter_count--;
                    } else if (token.type === Twig.expression.type.subexpression.end) {
                        next_subexpression_start_invalid = true;
                    }

                    i--;
                }

                // If we found unclosed parameters, return false
                // If we didnt find subexpression start, return false
                // Otherwise return true

                return (found_subexpression_start && (unclosed_parameter_count === 0));
            },
            compile: function(token, stack, output) {
                // This is basically a copy of parameter end compilation
                var stack_token,
                    end_token = token;

                stack_token = stack.pop();
                while(stack.length > 0 && stack_token.type != Twig.expression.type.subexpression.start) {
                    output.push(stack_token);
                    stack_token = stack.pop();
                }

                // Move contents of parens into preceding filter
                var param_stack = [];
                while(token.type !== Twig.expression.type.subexpression.start) {
                    // Add token to arguments stack
                    param_stack.unshift(token);
                    token = output.pop();
                }

                param_stack.unshift(token);

                var is_expression = false;

                //If the token at the top of the *stack* is a function token, pop it onto the output queue.
                // Get the token preceding the parameters
                stack_token = stack[stack.length-1];

                if (stack_token === undefined ||
                    (stack_token.type !== Twig.expression.type._function &&
                    stack_token.type !== Twig.expression.type.filter &&
                    stack_token.type !== Twig.expression.type.test &&
                    stack_token.type !== Twig.expression.type.key.brackets)) {

                    end_token.expression = true;

                    // remove start and end token from stack
                    param_stack.pop();
                    param_stack.shift();

                    end_token.params = param_stack;

                    output.push(end_token);
                } else {
                    // This should never be hit
                    end_token.expression = false;
                    stack_token.params = param_stack;
                }
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                if (token.expression) {
                    return Twig.expression.parseAsync.call(this, token.params, context)
                    .then(function(value) {
                        stack.push(value);
                    });
                } else {
                    throw new Twig.Error("Unexpected subexpression end when token is not marked as an expression");
                }
            }
        },
        {
            /**
             * Match a parameter set start.
             */
            type: Twig.expression.type.parameter.start,
            regex: /^\(/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),
            validate: function(match, tokens) {
                var last_token = tokens[tokens.length - 1];
                // We can't use the regex to test if we follow a space because expression is trimmed
                return last_token && (Twig.indexOf(Twig.expression.reservedWords, last_token.value.trim()) < 0);
            },
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match a parameter set end.
             */
            type: Twig.expression.type.parameter.end,
            regex: /^\)/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var stack_token,
                    end_token = token;

                stack_token = stack.pop();
                while(stack.length > 0 && stack_token.type != Twig.expression.type.parameter.start) {
                    output.push(stack_token);
                    stack_token = stack.pop();
                }

                // Move contents of parens into preceding filter
                var param_stack = [];
                while(token.type !== Twig.expression.type.parameter.start) {
                    // Add token to arguments stack
                    param_stack.unshift(token);
                    token = output.pop();
                }
                param_stack.unshift(token);

                var is_expression = false;

                // Get the token preceding the parameters
                token = output[output.length-1];

                if (token === undefined ||
                    (token.type !== Twig.expression.type._function &&
                    token.type !== Twig.expression.type.filter &&
                    token.type !== Twig.expression.type.test &&
                    token.type !== Twig.expression.type.key.brackets)) {

                    end_token.expression = true;

                    // remove start and end token from stack
                    param_stack.pop();
                    param_stack.shift();

                    end_token.params = param_stack;

                    output.push(end_token);

                } else {
                    end_token.expression = false;
                    token.params = param_stack;
                }
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                if (token.expression) {
                    return Twig.expression.parseAsync.call(this, token.params, context)
                    .then(function(value) {
                        stack.push(value);
                    });
                } else {

                    while (stack.length > 0) {
                        value = stack.pop();
                        // Push values into the array until the start of the array
                        if (value && value.type && value.type == Twig.expression.type.parameter.start) {
                            array_ended = true;
                            break;
                        }
                        new_array.unshift(value);
                    }

                    if (!array_ended) {
                        throw new Twig.Error("Expected end of parameter set.");
                    }

                    stack.push(new_array);
                }
            }
        },
        {
            type: Twig.expression.type.slice,
            regex: /^\[(\d*\:\d*)\]/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var sliceRange = token.match[1].split(':');

                //sliceStart can be undefined when we pass parameters to the slice filter later
                var sliceStart = (sliceRange[0]) ? parseInt(sliceRange[0]) : undefined;
                var sliceEnd = (sliceRange[1]) ? parseInt(sliceRange[1]) : undefined;

                token.value = 'slice';
                token.params = [sliceStart, sliceEnd];

                //sliceEnd can't be undefined as the slice filter doesn't check for this, but it does check the length
                //of the params array, so just shorten it.
                if (!sliceEnd) {
                    token.params = [sliceStart];
                }

                output.push(token);
            },
            parse: function(token, stack, context) {
                var input = stack.pop(),
                    params = token.params;

                stack.push(Twig.filter.call(this, token.value, input, params));
            }
        },
        {
            /**
             * Match an array start.
             */
            type: Twig.expression.type.array.start,
            regex: /^\[/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },
        {
            /**
             * Match an array end.
             */
            type: Twig.expression.type.array.end,
            regex: /^\]/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length - 1,
                    stack_token;
                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token.type === Twig.expression.type.array.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(token, stack, context) {
                var new_array = [],
                    array_ended = false,
                    value = null;

                while (stack.length > 0) {
                    value = stack.pop();
                    // Push values into the array until the start of the array
                    if (value.type && value.type == Twig.expression.type.array.start) {
                        array_ended = true;
                        break;
                    }
                    new_array.unshift(value);
                }
                if (!array_ended) {
                    throw new Twig.Error("Expected end of array.");
                }

                stack.push(new_array);
            }
        },
        // Token that represents the start of a hash map '}'
        //
        // Hash maps take the form:
        //    { "key": 'value', "another_key": item }
        //
        // Keys must be quoted (either single or double) and values can be any expression.
        {
            type: Twig.expression.type.object.start,
            regex: /^\{/,
            next: Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),
            compile: Twig.expression.fn.compile.push_both,
            parse: Twig.expression.fn.parse.push
        },

        // Token that represents the end of a Hash Map '}'
        //
        // This is where the logic for building the internal
        // representation of a hash map is defined.
        {
            type: Twig.expression.type.object.end,
            regex: /^\}/,
            next: Twig.expression.set.operations_extended,
            compile: function(token, stack, output) {
                var i = stack.length-1,
                    stack_token;

                // pop tokens off the stack until the start of the object
                for(;i >= 0; i--) {
                    stack_token = stack.pop();
                    if (stack_token && stack_token.type === Twig.expression.type.object.start) {
                        break;
                    }
                    output.push(stack_token);
                }
                output.push(token);
            },
            parse: function(end_token, stack, context) {
                var new_object = {},
                    object_ended = false,
                    token = null,
                    token_key = null,
                    has_value = false,
                    value = null;

                while (stack.length > 0) {
                    token = stack.pop();
                    // Push values into the array until the start of the object
                    if (token && token.type && token.type === Twig.expression.type.object.start) {
                        object_ended = true;
                        break;
                    }
                    if (token && token.type && (token.type === Twig.expression.type.operator.binary || token.type === Twig.expression.type.operator.unary) && token.key) {
                        if (!has_value) {
                            throw new Twig.Error("Missing value for key '" + token.key + "' in object definition.");
                        }
                        new_object[token.key] = value;

                        // Preserve the order that elements are added to the map
                        // This is necessary since JavaScript objects don't
                        // guarantee the order of keys
                        if (new_object._keys === undefined) new_object._keys = [];
                        new_object._keys.unshift(token.key);

                        // reset value check
                        value = null;
                        has_value = false;

                    } else {
                        has_value = true;
                        value = token;
                    }
                }
                if (!object_ended) {
                    throw new Twig.Error("Unexpected end of object.");
                }

                stack.push(new_object);
            }
        },

        // Token representing a filter
        //
        // Filters can follow any expression and take the form:
        //    expression|filter(optional, args)
        //
        // Filter parsing is done in the Twig.filters namespace.
        {
            type: Twig.expression.type.filter,
            // match a | then a letter or _, then any number of letters, numbers, _ or -
            regex: /^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.value = token.match[1];
                output.push(token);
            },
            parse: function(token, stack, context) {
                var that = this,
                    input = stack.pop();

                return parseParams(this, token.params, context)
                .then(function(params) {
                    return Twig.filter.call(that, token.value, input, params);
                })
                .then(function(value) {
                    stack.push(value);
                });
            }
        },
        {
            type: Twig.expression.type._function,
            // match any letter or _, then any number of letters, numbers, _ or - followed by (
            regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
            next: Twig.expression.type.parameter.start,
            validate: function(match, tokens) {
                // Make sure this function is not a reserved word
                return match[1] && (Twig.indexOf(Twig.expression.reservedWords, match[1]) < 0);
            },
            transform: function(match, tokens) {
                return '(';
            },
            compile: function(token, stack, output) {
                var fn = token.match[1];
                token.fn = fn;
                // cleanup token
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context) {

                var that = this,
                    fn = token.fn,
                    value;

                return parseParams(this, token.params, context)
                .then(function(params) {
                    if (Twig.functions[fn]) {
                        // Get the function from the built-in functions
                        value = Twig.functions[fn].apply(that, params);

                    } else if (typeof context[fn] == 'function') {
                        // Get the function from the user/context defined functions
                        value = context[fn].apply(context, params);

                    } else {
                        throw new Twig.Error(fn + ' function does not exist and is not defined in the context');
                    }

                    return value;
                })
                .then(function(result) {
                    stack.push(result);
                });
            }
        },

        // Token representing a variable.
        //
        // Variables can contain letters, numbers, underscores and
        // dashes, but must start with a letter or underscore.
        //
        // Variables are retrieved from the render context and take
        // the value of 'undefined' if the given variable doesn't
        // exist in the context.
        {
            type: Twig.expression.type.variable,
            // match any letter or _, then any number of letters, numbers, _ or -
            regex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            validate: function(match, tokens) {
                return (Twig.indexOf(Twig.expression.reservedWords, match[0]) < 0);
            },
            parse: function(token, stack, context) {
                // Get the variable from the context
                return Twig.expression.resolveAsync.call(this, context[token.value], context)
                .then(function(value) {
                    stack.push(value);
                });
            }
        },
        {
            type: Twig.expression.type.key.period,
            regex: /^\.([a-zA-Z0-9_]+)/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                token.key = token.match[1];
                delete token.match;
                delete token.value;

                output.push(token);
            },
            parse: function(token, stack, context, next_token) {
                var that = this,
                    key = token.key,
                    object = stack.pop(),
                    value;

                return parseParams(this, token.params, context)
                .then(function(params) {
                    if (object === null || object === undefined) {
                        if (that.options.strict_variables) {
                            throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                        } else {
                            value = undefined;
                        }
                    } else {
                        var capitalize = function (value) {
                            return value.substr(0, 1).toUpperCase() + value.substr(1);
                        };

                        // Get the variable from the context
                        if (typeof object === 'object' && key in object) {
                            value = object[key];
                        } else if (object["get" + capitalize(key)] !== undefined) {
                            value = object["get" + capitalize(key)];
                        } else if (object["is" + capitalize(key)] !== undefined) {
                            value = object["is" + capitalize(key)];
                        } else {
                            value = undefined;
                        }
                    }

                    // When resolving an expression we need to pass next_token in case the expression is a function
                    return Twig.expression.resolveAsync.call(that, value, context, params, next_token, object);
                })
                .then(function(result) {
                    stack.push(result);
                });
            }
        },
        {
            type: Twig.expression.type.key.brackets,
            regex: /^\[([^\]\:]*)\]/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: function(token, stack, output) {
                var match = token.match[1];
                delete token.value;
                delete token.match;

                // The expression stack for the key
                token.stack = Twig.expression.compile({
                    value: match
                }).stack;

                output.push(token);
            },
            parse: function(token, stack, context, next_token) {
                // Evaluate key
                var that = this,
                    params = null,
                    object,
                    value;

                return parseParams(this, token.params, context)
                .then(function(parameters) {
                    params = parameters;
                    return Twig.expression.parseAsync.call(that, token.stack, context);
                })
                .then(function(key) {
                    object = stack.pop();

                    if (object === null || object === undefined) {
                        if (that.options.strict_variables) {
                            throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
                        } else {
                            return null;
                        }
                    }

                    // Get the variable from the context
                    if (typeof object === 'object' && key in object) {
                        value = object[key];
                    } else {
                        value = null;
                    }

                    // When resolving an expression we need to pass next_token in case the expression is a function
                    return Twig.expression.resolveAsync.call(that, value, object, params, next_token);
                })
                .then(function(result) {
                    stack.push(result);
                });
            }
        },
        {
            /**
             * Match a null value.
             */
            type: Twig.expression.type._null,
            // match a number
            regex: /^(null|NULL|none|NONE)/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                delete token.match;
                token.value = null;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        },
        {
            /**
             * Match the context
             */
            type: Twig.expression.type.context,
            regex: /^_context/,
            next: Twig.expression.set.operations_extended.concat([
                    Twig.expression.type.parameter.start]),
            compile: Twig.expression.fn.compile.push,
            parse: function(token, stack, context) {
                stack.push(context);
            }
        },
        {
            /**
             * Match a boolean
             */
            type: Twig.expression.type.bool,
            regex: /^(true|TRUE|false|FALSE)/,
            next: Twig.expression.set.operations,
            compile: function(token, stack, output) {
                token.value = (token.match[0].toLowerCase( ) === "true");
                delete token.match;
                output.push(token);
            },
            parse: Twig.expression.fn.parse.push_value
        }
    ];

    /**
     * Resolve a context value.
     *
     * If the value is a function, it is executed with a context parameter.
     *
     * @param {string} key The context object key.
     * @param {Object} context The render context.
     */
    Twig.expression.resolveAsync = function(value, context, params, next_token, object) {
        if (typeof value != 'function')
            return Twig.Promise.resolve(value);

        var promise = Twig.Promise.resolve(params);

        /*
        If value is a function, it will have been impossible during the compile stage to determine that a following
        set of parentheses were parameters for this function.

        Those parentheses will have therefore been marked as an expression, with their own parameters, which really
        belong to this function.

        Those parameters will also need parsing in case they are actually an expression to pass as parameters.
            */
        if (next_token && next_token.type === Twig.expression.type.parameter.end) {
            //When parsing these parameters, we need to get them all back, not just the last item on the stack.
            var tokens_are_parameters = true;

            promise = promise.then(function() {
                return next_token.params && Twig.expression.parseAsync.call(this, next_token.params, context, tokens_are_parameters);
            })
            .then(function(p) {
                //Clean up the parentheses tokens on the next loop
                next_token.cleanup = true;

                return p;
            });
        }

        return promise.then(function(params) {
            return value.apply(object || context, params || []);
        });
    };

    Twig.expression.resolve = function(value, context, params, next_token, object) {
        return Twig.async.potentiallyAsync(this, false, function() {
            return Twig.expression.resolveAsync.call(this, value, context, params, next_token, object);
        });
    }

    /**
     * Registry for logic handlers.
     */
    Twig.expression.handler = {};

    /**
     * Define a new expression type, available at Twig.logic.type.{type}
     *
     * @param {string} type The name of the new type.
     */
    Twig.expression.extendType = function (type) {
        Twig.expression.type[type] = "Twig.expression.type." + type;
    };

    /**
     * Extend the expression parsing functionality with a new definition.
     *
     * Token definitions follow this format:
     *  {
     *      type:     One of Twig.expression.type.[type], either pre-defined or added using
     *                    Twig.expression.extendType
     *
     *      next:     Array of types from Twig.expression.type that can follow this token,
     *
     *      regex:    A regex or array of regex's that should match the token.
     *
     *      compile: function(token, stack, output) called when this token is being compiled.
     *                   Should return an object with stack and output set.
     *
     *      parse:   function(token, stack, context) called when this token is being parsed.
     *                   Should return an object with stack and context set.
     *  }
     *
     * @param {Object} definition A token definition.
     */
    Twig.expression.extend = function (definition) {
        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        }
        Twig.expression.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.expression.definitions.length > 0) {
        Twig.expression.extend(Twig.expression.definitions.shift());
    }

    /**
     * Break an expression into tokens defined in Twig.expression.definitions.
     *
     * @param {string} expression The string to tokenize.
     *
     * @return {Array} An array of tokens.
     */
    Twig.expression.tokenize = function (expression) {
        var tokens = [],
            // Keep an offset of the location in the expression for error messages.
            exp_offset = 0,
            // The valid next tokens of the previous token
            next = null,
            // Match information
            type, regex, regex_i,
            // The possible next token for the match
            token_next,
            // Has a match been found from the definitions
            match_found, invalid_matches = [], match_function;

        match_function = function () {
            // Don't pass arguments to `Array.slice`, that is a performance killer
            var match_i = arguments.length - 2, match = new Array(match_i);
            while (match_i-- > 0) match[match_i] = arguments[match_i];

            Twig.log.trace("Twig.expression.tokenize",
                           "Matched a ", type, " regular expression of ", match);

            if (next && Twig.indexOf(next, type) < 0) {
                invalid_matches.push(
                    type + " cannot follow a " + tokens[tokens.length - 1].type +
                           " at template:" + exp_offset + " near '" + match[0].substring(0, 20) +
                           "...'"
                );

                // Not a match, don't change the expression
                return match[0];
            }

            var handler = Twig.expression.handler[type];

            // Validate the token if a validation function is provided
            if (handler.validate && !handler.validate(match, tokens)) {
                return match[0];
            }

            invalid_matches = [];

            tokens.push({
                type:  type,
                value: match[0],
                match: match
            });

            match_found = true;
            next = token_next;
            exp_offset += match[0].length;

            // Does the token need to return output back to the expression string
            // e.g. a function match of cycle( might return the '(' back to the expression
            // This allows look-ahead to differentiate between token types (e.g. functions and variable names)
            if (handler.transform) {
                return handler.transform(match, tokens);
            }
            return '';
        };

        Twig.log.debug("Twig.expression.tokenize", "Tokenizing expression ", expression);

        while (expression.length > 0) {
            expression = expression.trim();
            for (type in Twig.expression.handler) {
                token_next = Twig.expression.handler[type].next;
                regex = Twig.expression.handler[type].regex;
                Twig.log.trace("Checking type ", type, " on ", expression);

                match_found = false;

                if (Twig.lib.isArray(regex)) {
                    regex_i = regex.length;
                    while (regex_i-- > 0)
                        expression = expression.replace(regex[regex_i], match_function);
                } else {
                    expression = expression.replace(regex, match_function);
                }

                // An expression token has been matched. Break the for loop and start trying to
                //  match the next template (if expression isn't empty.)
                if (match_found) {
                    break;
                }
            }
            if (!match_found) {
                if (invalid_matches.length > 0) {
                    throw new Twig.Error(invalid_matches.join(" OR "));
                } else {
                    throw new Twig.Error("Unable to parse '" + expression + "' at template position" + exp_offset);
                }
            }
        }

        Twig.log.trace("Twig.expression.tokenize", "Tokenized to ", tokens);
        return tokens;
    };

    /**
     * Compile an expression token.
     *
     * @param {Object} raw_token The uncompiled token.
     *
     * @return {Object} The compiled token.
     */
    Twig.expression.compile = function (raw_token) {
        var expression = raw_token.value,
            // Tokenize expression
            tokens = Twig.expression.tokenize(expression),
            token = null,
            output = [],
            stack = [],
            token_template = null;

        Twig.log.trace("Twig.expression.compile: ", "Compiling ", expression);

        // Push tokens into RPN stack using the Shunting-yard algorithm
        // See http://en.wikipedia.org/wiki/Shunting_yard_algorithm

        while (tokens.length > 0) {
            token = tokens.shift();
            token_template = Twig.expression.handler[token.type];

            Twig.log.trace("Twig.expression.compile: ", "Compiling ", token);

            // Compile the template
            token_template.compile && token_template.compile(token, stack, output);

            Twig.log.trace("Twig.expression.compile: ", "Stack is", stack);
            Twig.log.trace("Twig.expression.compile: ", "Output is", output);
        }

        while(stack.length > 0) {
            output.push(stack.pop());
        }

        Twig.log.trace("Twig.expression.compile: ", "Final output is", output);

        raw_token.stack = output;
        delete raw_token.value;

        return raw_token;
    };


    /**
     * Parse an RPN expression stack within a context.
     *
     * @param {Array} tokens An array of compiled expression tokens.
     * @param {Object} context The render context to parse the tokens with.
     *
     * @return {Object} The result of parsing all the tokens. The result
     *                  can be anything, String, Array, Object, etc... based on
     *                  the given expression.
     */
    Twig.expression.parse = function (tokens, context, tokens_are_parameters, allow_async) {
        var that = this;

        // If the token isn't an array, make it one.
        if (!Twig.lib.isArray(tokens))
            tokens = [tokens];

        // The output stack
        var stack = [],
            loop_token_fixups = [],
            binaryOperator = Twig.expression.type.operator.binary;

        return Twig.async.potentiallyAsync(this, allow_async, function() {
            return Twig.async.forEach(tokens, function expressionToken(token, index) {
                var token_template = null,
                    next_token = null,
                    result;

                //If the token is marked for cleanup, we don't need to parse it
                if (token.cleanup) {
                    return;
                }

                //Determine the token that follows this one so that we can pass it to the parser
                if (tokens.length > index + 1) {
                    next_token = tokens[index + 1];
                }

                token_template = Twig.expression.handler[token.type];

                if (token_template.parse)
                    result = token_template.parse.call(that, token, stack, context, next_token);

                //Store any binary tokens for later if we are in a loop.
                if (token.type === binaryOperator && context.loop) {
                    loop_token_fixups.push(token);
                }

                return result;
            })
            .then(function loopTokenFixups() {
                //Check every fixup and remove "key" as long as they still have "params". This covers the use case where
                //a ":" operator is used in a loop with a "(expression):" statement. We need to be able to evaluate the expression
                var len = loop_token_fixups.length;
                var loop_token_fixup = null;

                while(len-- > 0) {
                    loop_token_fixup = loop_token_fixups[len];
                    if (loop_token_fixup.params && loop_token_fixup.key)
                        delete loop_token_fixup.key;
                }

                //If parse has been called with a set of tokens that are parameters, we need to return the whole stack,
                //wrapped in an Array.
                if (tokens_are_parameters) {
                    var params = stack.splice(0);

                    stack.push(params);
                }

                // Pop the final value off the stack
                return stack.pop();
            });
        });
    };

    return Twig;

};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// ## twig.expression.operator.js
//
// This file handles operator lookups and parsing.
module.exports = function (Twig) {
    "use strict";

    /**
     * Operator associativity constants.
     */
    Twig.expression.operator = {
        leftToRight: 'leftToRight',
        rightToLeft: 'rightToLeft'
    };

    var containment = function (a, b) {
        if (b === undefined || b === null) {
            return null;
        } else if (b.indexOf !== undefined) {
            // String
            return a === b || a !== '' && b.indexOf(a) > -1;
        } else {
            var el;
            for (el in b) {
                if (b.hasOwnProperty(el) && b[el] === a) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * Get the precidence and associativity of an operator. These follow the order that C/C++ use.
     * See http://en.wikipedia.org/wiki/Operators_in_C_and_C++ for the table of values.
     */
    Twig.expression.operator.lookup = function (operator, token) {
        switch (operator) {
            case "..":
                token.precidence = 20;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case ',':
                token.precidence = 18;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            // Ternary
            case '?:':
            case '?':
            case ':':
                token.precidence = 16;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            // Null-coalescing operator
            case '??':
                token.precidence = 15;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            case 'or':
                token.precidence = 14;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'and':
                token.precidence = 13;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'b-or':
                token.precidence = 12;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'b-xor':
                token.precidence = 11;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'b-and':
                token.precidence = 10;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '==':
            case '!=':
                token.precidence = 9;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '<':
            case '<=':
            case '>':
            case '>=':
            case 'not in':
            case 'in':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '~': // String concatination
            case '+':
            case '-':
                token.precidence = 6;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case '//':
            case '**':
            case '*':
            case '/':
            case '%':
                token.precidence = 5;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'not':
                token.precidence = 3;
                token.associativity = Twig.expression.operator.rightToLeft;
                break;

            case 'matches':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'starts with':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            case 'ends with':
                token.precidence = 8;
                token.associativity = Twig.expression.operator.leftToRight;
                break;

            default:
                throw new Twig.Error("Failed to lookup operator: " + operator + " is an unknown operator.");
        }
        token.operator = operator;
        return token;
    };

    /**
     * Handle operations on the RPN stack.
     *
     * Returns the updated stack.
     */
    Twig.expression.operator.parse = function (operator, stack) {
        Twig.log.trace("Twig.expression.operator.parse: ", "Handling ", operator);
        var a, b, c;

        if (operator === '?') {
            c = stack.pop();
        }

        b = stack.pop();
        if (operator !== 'not') {
            a = stack.pop();
        }

        if (operator !== 'in' && operator !== 'not in') {
            if (a && Array.isArray(a)) {
                a = a.length;
            }

            if (b && Array.isArray(b)) {
                b = b.length;
            }
        }

        if (operator === 'matches') {
            if (b && typeof b === 'string') {
                var reParts = b.match(/^\/(.*)\/([gims]?)$/);
                var reBody = reParts[1];
                var reFlags = reParts[2];
                b = new RegExp(reBody, reFlags);
            }
        }

        switch (operator) {
            case ':':
                // Ignore
                break;

            case '??':
                if (a === undefined) {
                    a = b;
                    b = c;
                    c = undefined;
                }

                if (a !== undefined && a !== null) {
                    stack.push(a);
                } else {
                    stack.push(b);
                }
                break;
            case '?:':
                if (Twig.lib.boolval(a)) {
                    stack.push(a);
                } else {
                    stack.push(b);
                }
                break;
            case '?':
                if (a === undefined) {
                    //An extended ternary.
                    a = b;
                    b = c;
                    c = undefined;
                }

                if (Twig.lib.boolval(a)) {
                    stack.push(b);
                } else {
                    stack.push(c);
                }
                break;

            case '+':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(a + b);
                break;

            case '-':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(a - b);
                break;

            case '*':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(a * b);
                break;

            case '/':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(a / b);
                break;

            case '//':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(Math.floor(a / b));
                break;

            case '%':
                b = parseFloat(b);
                a = parseFloat(a);
                stack.push(a % b);
                break;

            case '~':
                stack.push( (a != null ? a.toString() : "")
                          + (b != null ? b.toString() : "") );
                break;

            case 'not':
            case '!':
                stack.push(!Twig.lib.boolval(b));
                break;

            case '<':
                stack.push(a < b);
                break;

            case '<=':
                stack.push(a <= b);
                break;

            case '>':
                stack.push(a > b);
                break;

            case '>=':
                stack.push(a >= b);
                break;

            case '===':
                stack.push(a === b);
                break;

            case '==':
                stack.push(a == b);
                break;

            case '!==':
                stack.push(a !== b);
                break;

            case '!=':
                stack.push(a != b);
                break;

            case 'or':
                stack.push(Twig.lib.boolval(a) || Twig.lib.boolval(b));
                break;

            case 'b-or':
                stack.push(a | b);
                break;

            case 'b-xor':
                stack.push(a ^ b);
                break;

            case 'and':
                stack.push(Twig.lib.boolval(a) && Twig.lib.boolval(b));
                break;

            case 'b-and':
                stack.push(a & b);
                break;

            case '**':
                stack.push(Math.pow(a, b));
                break;

            case 'not in':
                stack.push( !containment(a, b) );
                break;

            case 'in':
                stack.push( containment(a, b) );
                break;

            case 'matches':
                stack.push( b.test(a) );
                break;

            case 'starts with':
                stack.push( a.indexOf(b) === 0 );
                break;

            case 'ends with':
                stack.push( a.indexOf(b, a.length - b.length) !== -1 );
                break;

            case '..':
                stack.push( Twig.functions.range(a, b) );
                break;

            default:
                debugger;
                throw new Twig.Error("Failed to parse operator: " + operator + " is an unknown operator.");
        }
    };

    return Twig;

};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// ## twig.filters.js
//
// This file handles parsing filters.
module.exports = function (Twig) {

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.filters = {
        // String Filters
        upper:  function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toUpperCase();
        },
        lower: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toLowerCase();
        },
        capitalize: function(value) {
            if ( typeof value !== "string" ) {
                 return value;
            }

            return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
        },
        title: function(value) {
            if ( typeof value !== "string" ) {
               return value;
            }

            return value.toLowerCase().replace( /(^|\s)([a-z])/g , function(m, p1, p2){
                return p1 + p2.toUpperCase();
            });
        },
        length: function(value) {
            if (Twig.lib.is("Array", value) || typeof value === "string") {
                return value.length;
            } else if (Twig.lib.is("Object", value)) {
                if (value._keys === undefined) {
                    return Object.keys(value).length;
                } else {
                    return value._keys.length;
                }
            } else {
                return 0;
            }
        },

        // Array/Object Filters
        reverse: function(value) {
            if (is("Array", value)) {
                return value.reverse();
            } else if (is("String", value)) {
                return value.split("").reverse().join("");
            } else if (is("Object", value)) {
                var keys = value._keys || Object.keys(value).reverse();
                value._keys = keys;
                return value;
            }
        },
        sort: function(value) {
            if (is("Array", value)) {
                return value.sort();
            } else if (is('Object', value)) {
                // Sorting objects isn't obvious since the order of
                // returned keys isn't guaranteed in JavaScript.
                // Because of this we use a "hidden" key called _keys to
                // store the keys in the order we want to return them.

                delete value._keys;
                var keys = Object.keys(value),
                    sorted_keys = keys.sort(function(a, b) {
                        var a1, a2;

                        // if a and b are comparable, we're fine :-)
                        if((value[a] > value[b]) == !(value[a] <= value[b])) {
                            return value[a] > value[b] ? 1 :
			           value[a] < value[b] ? -1 :
				   0;
                        }
                        // if a and b can be parsed as numbers, we can compare
                        // their numeric value
                        else if(!isNaN(a1 = parseFloat(value[a])) &&
                                !isNaN(b1 = parseFloat(value[b]))) {
                            return a1 > b1 ? 1 :
			           a1 < b1 ? -1 :
				   0;
                        }
                        // if one of the values is a string, we convert the
                        // other value to string as well
                        else if(typeof value[a] == 'string') {
                            return value[a] > value[b].toString() ? 1 :
                                   value[a] < value[b].toString() ? -1 :
				   0;
                        }
                        else if(typeof value[b] == 'string') {
                            return value[a].toString() > value[b] ? 1 :
                                   value[a].toString() < value[b] ? -1 :
				   0;
                        }
                        // everything failed - return 'null' as sign, that
                        // the values are not comparable
                        else {
                            return null;
                        }
                    });
                value._keys = sorted_keys;
                return value;
            }
        },
        keys: function(value) {
            if (value === undefined || value === null){
                return;
           }

            var keyset = value._keys || Object.keys(value),
                output = [];

            Twig.forEach(keyset, function(key) {
                if (key === "_keys") return; // Ignore the _keys property
                if (value.hasOwnProperty(key)) {
                    output.push(key);
                }
            });
            return output;
        },
        url_encode: function(value) {
            if (value === undefined || value === null){
                return;
            }

            if (Twig.lib.is('Object', value)) {
                var serialize = function (obj, prefix) {
                    var result = [];
                    var keyset = obj._keys || Object.keys(obj);

                    Twig.forEach(keyset, function (key) {
                        if (!Object.prototype.hasOwnProperty.call(obj, key)) return;

                        var resultKey = prefix ? prefix + '[' + key + ']' : key;
                        var resultValue = obj[key];

                        result.push(
                            (Twig.lib.is('Object', resultValue) || Twig.lib.isArray(resultValue)) ?
                            serialize(resultValue, resultKey) :
                            encodeURIComponent(resultKey) + '=' + encodeURIComponent(resultValue)
                        );
                    });

                    return result.join('&amp;');
                }

                return serialize(value);
            }

            var result = encodeURIComponent(value);
            result = result.replace("'", "%27");
            return result;
        },
        join: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            var join_str = "",
                output = [],
                keyset = null;

            if (params && params[0]) {
                join_str = params[0];
            }
            if (is("Array", value)) {
                output = value;
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    if (key === "_keys") return; // Ignore the _keys property
                    if (value.hasOwnProperty(key)) {
                        output.push(value[key]);
                    }
                });
            }
            return output.join(join_str);
        },
        "default": function(value, params) {
            if (params !== undefined && params.length > 1) {
                throw new Twig.Error("default filter expects one argument");
            }
            if (value === undefined || value === null || value === '' ) {
                if (params === undefined) {
                    return '';
                }

                return params[0];
            } else {
                return value;
            }
        },
        json_encode: function(value) {
            if(value === undefined || value === null) {
                return "null";
            }
            else if ((typeof value == 'object') && (is("Array", value))) {
                output = [];

                Twig.forEach(value, function(v) {
                    output.push(Twig.filters.json_encode(v));
                });

                return "[" + output.join(",") + "]";
            }
            else if ((typeof value == 'object') && (is("Date", value))) {
                return '"' + value.toISOString() + '"';
            }
            else if (typeof value == 'object') {
                var keyset = value._keys || Object.keys(value),
                output = [];

                Twig.forEach(keyset, function(key) {
                    output.push(JSON.stringify(key) + ":" + Twig.filters.json_encode(value[key]));
                });

                return "{" + output.join(",") + "}";
            }
            else {
                return JSON.stringify(value);
            }
        },
        merge: function(value, params) {
            var obj = [],
                arr_index = 0,
                keyset = [];

            // Check to see if all the objects being merged are arrays
            if (!is("Array", value)) {
                // Create obj as an Object
                obj = { };
            } else {
                Twig.forEach(params, function(param) {
                    if (!is("Array", param)) {
                        obj = { };
                    }
                });
            }
            if (!is("Array", obj)) {
                obj._keys = [];
            }

            if (is("Array", value)) {
                Twig.forEach(value, function(val) {
                    if (obj._keys) obj._keys.push(arr_index);
                    obj[arr_index] = val;
                    arr_index++;
                });
            } else {
                keyset = value._keys || Object.keys(value);
                Twig.forEach(keyset, function(key) {
                    obj[key] = value[key];
                    obj._keys.push(key);

                    // Handle edge case where a number index in an object is greater than
                    //   the array counter. In such a case, the array counter is increased
                    //   one past the index.
                    //
                    // Example {{ ["a", "b"]|merge({"4":"value"}, ["c", "d"])
                    // Without this, d would have an index of "4" and overwrite the value
                    //   of "value"
                    var int_key = parseInt(key, 10);
                    if (!isNaN(int_key) && int_key >= arr_index) {
                        arr_index = int_key + 1;
                    }
                });
            }

            // mixin the merge arrays
            Twig.forEach(params, function(param) {
                if (is("Array", param)) {
                    Twig.forEach(param, function(val) {
                        if (obj._keys) obj._keys.push(arr_index);
                        obj[arr_index] = val;
                        arr_index++;
                    });
                } else {
                    keyset = param._keys || Object.keys(param);
                    Twig.forEach(keyset, function(key) {
                        if (!obj[key]) obj._keys.push(key);
                        obj[key] = param[key];

                        var int_key = parseInt(key, 10);
                        if (!isNaN(int_key) && int_key >= arr_index) {
                            arr_index = int_key + 1;
                        }
                    });
                }
            });
            if (params.length === 0) {
                throw new Twig.Error("Filter merge expects at least one parameter");
            }

            return obj;
        },

        date: function(value, params) {
            var date = Twig.functions.date(value);
            var format = params && params.length ? params[0] : 'F j, Y H:i';
            return Twig.lib.date(format.replace(/\\\\/g, '\\'), date);
        },

        date_modify: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length !== 1) {
                throw new Twig.Error("date_modify filter expects 1 argument");
            }

            var modifyText = params[0], time;

            if (Twig.lib.is("Date", value)) {
                time = Twig.lib.strtotime(modifyText, value.getTime() / 1000);
            }
            if (Twig.lib.is("String", value)) {
                time = Twig.lib.strtotime(modifyText, Twig.lib.strtotime(value));
            }
            if (Twig.lib.is("Number", value)) {
                time = Twig.lib.strtotime(modifyText, value);
            }

            return new Date(time * 1000);
        },

        replace: function(value, params) {
            if (value === undefined||value === null){
                return;
            }

            var pairs = params[0],
                tag;
            for (tag in pairs) {
                if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
                    value = Twig.lib.replaceAll(value, tag, pairs[tag]);
                }
            }
            return value;
        },

        format: function(value, params) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.vsprintf(value, params);
        },

        striptags: function(value, allowed) {
            if (value === undefined || value === null){
                return;
            }

            return Twig.lib.strip_tags(value, allowed);
        },

        escape: function(value, params) {
            if (value === undefined|| value === null){
                return;
            }

            var strategy = "html";
            if(params && params.length && params[0] !== true)
                strategy = params[0];

            if(strategy == "html") {
                var raw_value = value.toString().replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#039;");
                return Twig.Markup(raw_value, 'html');
            } else if(strategy == "js") {
                var raw_value = value.toString();
                var result = "";

                for(var i = 0; i < raw_value.length; i++) {
                    if(raw_value[i].match(/^[a-zA-Z0-9,\._]$/))
                        result += raw_value[i];
                    else {
                        var char_code = raw_value.charCodeAt(i);

                        if(char_code < 0x80)
                            result += "\\x" + char_code.toString(16).toUpperCase();
                        else
                            result += Twig.lib.sprintf("\\u%04s", char_code.toString(16).toUpperCase());
                    }
                }

                return Twig.Markup(result, 'js');
            } else if(strategy == "css") {
                var raw_value = value.toString();
                var result = "";

                for(var i = 0; i < raw_value.length; i++) {
                    if(raw_value[i].match(/^[a-zA-Z0-9]$/))
                        result += raw_value[i];
                    else {
                        var char_code = raw_value.charCodeAt(i);
                        result += "\\" + char_code.toString(16).toUpperCase() + " ";
                    }
                }

                return Twig.Markup(result, 'css');
            } else if(strategy == "url") {
                var result = Twig.filters.url_encode(value);
                return Twig.Markup(result, 'url');
            } else if(strategy == "html_attr") {
                var raw_value = value.toString();
                var result = "";

                for(var i = 0; i < raw_value.length; i++) {
                    if(raw_value[i].match(/^[a-zA-Z0-9,\.\-_]$/))
                        result += raw_value[i];
                    else if(raw_value[i].match(/^[&<>"]$/))
                        result += raw_value[i].replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/"/g, "&quot;");
                    else {
                        var char_code = raw_value.charCodeAt(i);

                        // The following replaces characters undefined in HTML with
                        // the hex entity for the Unicode replacement character.
                        if(char_code <= 0x1f && char_code != 0x09 && char_code != 0x0a && char_code != 0x0d)
                            result += "&#xFFFD;";
                        else if(char_code < 0x80)
                            result += Twig.lib.sprintf("&#x%02s;", char_code.toString(16).toUpperCase());
                        else
                            result += Twig.lib.sprintf("&#x%04s;", char_code.toString(16).toUpperCase());
                    }
                }

                return Twig.Markup(result, 'html_attr');
            } else {
                throw new Twig.Error("escape strategy unsupported");
            }
        },

        /* Alias of escape */
        "e": function(value, params) {
            return Twig.filters.escape(value, params);
        },

        nl2br: function(value) {
            if (value === undefined || value === null){
                return;
            }
            var linebreak_tag = "BACKSLASH_n_replace",
                br = "<br />" + linebreak_tag;

            value = Twig.filters.escape(value)
                        .replace(/\r\n/g, br)
                        .replace(/\r/g, br)
                        .replace(/\n/g, br);

            value = Twig.lib.replaceAll(value, linebreak_tag, "\n");

            return Twig.Markup(value);
        },

        /**
         * Adapted from: http://phpjs.org/functions/number_format:481
         */
        number_format: function(value, params) {
            var number = value,
                decimals = (params && params[0]) ? params[0] : undefined,
                dec      = (params && params[1] !== undefined) ? params[1] : ".",
                sep      = (params && params[2] !== undefined) ? params[2] : ",";

            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        },

        trim: function(value, params) {
            if (value === undefined|| value === null){
                return;
            }

            var str = '' + value,
                whitespace;
            if ( params && params[0] ) {
                whitespace = '' + params[0];
            } else {
                whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
            }
            for (var i = 0; i < str.length; i++) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(i);
                    break;
                }
            }
            for (i = str.length - 1; i >= 0; i--) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }
            return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
        },

        truncate: function (value, params) {
            var length = 30,
                preserve = false,
                separator = '...';

            value =  value + '';
            if (params) {
                if (params[0]) {
                    length = params[0];
                }
                if (params[1]) {
                    preserve = params[1];
                }
                if (params[2]) {
                    separator = params[2];
                }
            }

            if (value.length > length) {

                if (preserve) {
                    length = value.indexOf(' ', length);
                    if (length === -1) {
                        return value;
                    }
                }

                value =  value.substr(0, length) + separator;
            }

            return value;
        },

        slice: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1) {
                throw new Twig.Error("slice filter expects at least 1 argument");
            }

            // default to start of string
            var start = params[0] || 0;
            // default to length of string
            var length = params.length > 1 ? params[1] : value.length;
            // handle negative start values
            var startIndex = start >= 0 ? start : Math.max( value.length + start, 0 );

            if (Twig.lib.is("Array", value)) {
                var output = [];
                for (var i = startIndex; i < startIndex + length && i < value.length; i++) {
                    output.push(value[i]);
                }
                return output;
            } else if (Twig.lib.is("String", value)) {
                return value.substr(startIndex, length);
            } else {
                throw new Twig.Error("slice filter expects value to be an array or string");
            }
        },

        abs: function(value) {
            if (value === undefined || value === null) {
                return;
            }

            return Math.abs(value);
        },

        first: function(value) {
            if (is("Array", value)) {
                return value[0];
            } else if (is("Object", value)) {
                if ('_keys' in value) {
                    return value[value._keys[0]];
                }
            } else if ( typeof value === "string" ) {
                return value.substr(0, 1);
            }

            return;
        },

        split: function(value, params) {
            if (value === undefined || value === null) {
                return;
            }
            if (params === undefined || params.length < 1 || params.length > 2) {
                throw new Twig.Error("split filter expects 1 or 2 argument");
            }
            if (Twig.lib.is("String", value)) {
                var delimiter = params[0],
                    limit = params[1],
                    split = value.split(delimiter);

                if (limit === undefined) {

                    return split;

                } else if (limit < 0) {

                    return value.split(delimiter, split.length + limit);

                } else {

                    var limitedSplit = [];

                    if (delimiter == '') {
                        // empty delimiter
                        // "aabbcc"|split('', 2)
                        //     -> ['aa', 'bb', 'cc']

                        while(split.length > 0) {
                            var temp = "";
                            for (var i=0; i<limit && split.length > 0; i++) {
                                temp += split.shift();
                            }
                            limitedSplit.push(temp);
                        }

                    } else {
                        // non-empty delimiter
                        // "one,two,three,four,five"|split(',', 3)
                        //     -> ['one', 'two', 'three,four,five']

                        for (var i=0; i<limit-1 && split.length > 0; i++) {
                            limitedSplit.push(split.shift());
                        }

                        if (split.length > 0) {
                            limitedSplit.push(split.join(delimiter));
                        }
                    }

                    return limitedSplit;
                }

            } else {
                throw new Twig.Error("split filter expects value to be a string");
            }
        },
        last: function(value) {
            if (Twig.lib.is('Object', value)) {
                var keys;

                if (value._keys === undefined) {
                    keys = Object.keys(value);
                } else {
                    keys = value._keys;
                }

                return value[keys[keys.length - 1]];
            }

            // string|array
            return value[value.length - 1];
        },
        raw: function(value) {
            return Twig.Markup(value);
        },
        batch: function(items, params) {
            var size = params.shift(),
                fill = params.shift(),
                result,
                last,
                missing;

            if (!Twig.lib.is("Array", items)) {
                throw new Twig.Error("batch filter expects items to be an array");
            }

            if (!Twig.lib.is("Number", size)) {
                throw new Twig.Error("batch filter expects size to be a number");
            }

            size = Math.ceil(size);

            result = Twig.lib.chunkArray(items, size);

            if (fill && items.length % size != 0) {
                last = result.pop();
                missing = size - last.length;

                while (missing--) {
                    last.push(fill);
                }

                result.push(last);
            }

            return result;
        },
        round: function(value, params) {
            params = params || [];

            var precision = params.length > 0 ? params[0] : 0,
                method = params.length > 1 ? params[1] : "common";

            value = parseFloat(value);

            if(precision && !Twig.lib.is("Number", precision)) {
                throw new Twig.Error("round filter expects precision to be a number");
            }

            if (method === "common") {
                return Twig.lib.round(value, precision);
            }

            if(!Twig.lib.is("Function", Math[method])) {
                throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'");
            }

            return Math[method](value * Math.pow(10, precision)) / Math.pow(10, precision);
        }
    };

    Twig.filter = function(filter, value, params) {
        if (!Twig.filters[filter]) {
            throw "Unable to find filter " + filter;
        }
        return Twig.filters[filter].call(this, value, params);
    };

    Twig.filter.extend = function(filter, definition) {
        Twig.filters[filter] = definition;
    };

    return Twig;

};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// ## twig.functions.js
//
// This file handles parsing filters.
module.exports = function (Twig) {
    /**
     * @constant
     * @type {string}
     */
    var TEMPLATE_NOT_FOUND_MESSAGE = 'Template "{name}" is not defined.';

    // Determine object type
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    Twig.functions = {
        //  attribute, block, constant, date, dump, parent, random,.

        // Range function from http://phpjs.org/functions/range:499
        // Used under an MIT License
        range: function (low, high, step) {
            // http://kevin.vanzonneveld.net
            // +   original by: Waldo Malqui Silva
            // *     example 1: range ( 0, 12 );
            // *     returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            // *     example 2: range( 0, 100, 10 );
            // *     returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            // *     example 3: range( 'a', 'i' );
            // *     returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
            // *     example 4: range( 'c', 'a' );
            // *     returns 4: ['c', 'b', 'a']
            var matrix = [];
            var inival, endval, plus;
            var walker = step || 1;
            var chars = false;

            if (!isNaN(low) && !isNaN(high)) {
                inival = parseInt(low, 10);
                endval = parseInt(high, 10);
            } else if (isNaN(low) && isNaN(high)) {
                chars = true;
                inival = low.charCodeAt(0);
                endval = high.charCodeAt(0);
            } else {
                inival = (isNaN(low) ? 0 : low);
                endval = (isNaN(high) ? 0 : high);
            }

            plus = ((inival > endval) ? false : true);
            if (plus) {
                while (inival <= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival += walker;
                }
            } else {
                while (inival >= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival -= walker;
                }
            }

            return matrix;
        },
        cycle: function(arr, i) {
            var pos = i % arr.length;
            return arr[pos];
        },
        dump: function() {
            // Don't pass arguments to `Array.slice`, that is a performance killer
            var args_i = arguments.length; args = new Array(args_i);
            while(args_i-- > 0) args[args_i] = arguments[args_i];

            var EOL = '\n',
                indentChar = '  ',
                indentTimes = 0,
                out = '',
                indent = function(times) {
                    var ind  = '';
                    while (times > 0) {
                        times--;
                        ind += indentChar;
                    }
                    return ind;
                },
                displayVar = function(variable) {
                    out += indent(indentTimes);
                    if (typeof(variable) === 'object') {
                        dumpVar(variable);
                    } else if (typeof(variable) === 'function') {
                        out += 'function()' + EOL;
                    } else if (typeof(variable) === 'string') {
                        out += 'string(' + variable.length + ') "' + variable + '"' + EOL;
                    } else if (typeof(variable) === 'number') {
                        out += 'number(' + variable + ')' + EOL;
                    } else if (typeof(variable) === 'boolean') {
                        out += 'bool(' + variable + ')' + EOL;
                    }
                },
                dumpVar = function(variable) {
                    var i;
                    if (variable === null) {
                        out += 'NULL' + EOL;
                    } else if (variable === undefined) {
                        out += 'undefined' + EOL;
                    } else if (typeof variable === 'object') {
                        out += indent(indentTimes) + typeof(variable);
                        indentTimes++;
                        out += '(' + (function(obj) {
                            var size = 0, key;
                            for (key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    size++;
                                }
                            }
                            return size;
                        })(variable) + ') {' + EOL;
                        for (i in variable) {
                            out += indent(indentTimes) + '[' + i + ']=> ' + EOL;
                            displayVar(variable[i]);
                        }
                        indentTimes--;
                        out += indent(indentTimes) + '}' + EOL;
                    } else {
                        displayVar(variable);
                    }
                };

            // handle no argument case by dumping the entire render context
            if (args.length == 0) args.push(this.context);

            Twig.forEach(args, function(variable) {
                dumpVar(variable);
            });

            return out;
        },
        date: function(date, time) {
            var dateObj;
            if (date === undefined || date === null || date === "") {
                dateObj = new Date();
            } else if (Twig.lib.is("Date", date)) {
                dateObj = date;
            } else if (Twig.lib.is("String", date)) {
                if (date.match(/^[0-9]+$/)) {
                    dateObj = new Date(date * 1000);
                }
                else {
                    dateObj = new Date(Twig.lib.strtotime(date) * 1000);
                }
            } else if (Twig.lib.is("Number", date)) {
                // timestamp
                dateObj = new Date(date * 1000);
            } else {
                throw new Twig.Error("Unable to parse date " + date);
            }
            return dateObj;
        },
        block: function(block) {
            if (this.originalBlockTokens[block]) {
                return Twig.logic.parse.call(this, this.originalBlockTokens[block], this.context).output;
            } else {
                return this.blocks[block];
            }
        },
        parent: function() {
            // Add a placeholder
            return Twig.placeholders.parent;
        },
        attribute: function(object, method, params) {
            if (Twig.lib.is('Object', object)) {
                if (object.hasOwnProperty(method)) {
                    if (typeof object[method] === "function") {
                        return object[method].apply(undefined, params);
                    }
                    else {
                        return object[method];
                    }
                }
            }
            // Array will return element 0-index
            return object[method] || undefined;
        },
        max: function(values) {
            if(Twig.lib.is("Object", values)) {
                delete values["_keys"];
                return Twig.lib.max(values);
            }

            return Twig.lib.max.apply(null, arguments);
        },
        min: function(values) {
            if(Twig.lib.is("Object", values)) {
                delete values["_keys"];
                return Twig.lib.min(values);
            }

            return Twig.lib.min.apply(null, arguments);
        },
        template_from_string: function(template) {
            if (template === undefined) {
                template = '';
            }
            return Twig.Templates.parsers.twig({
                options: this.options,
                data: template
            });
        },
        random: function(value) {
            var LIMIT_INT31 = 0x80000000;

            function getRandomNumber(n) {
                var random = Math.floor(Math.random() * LIMIT_INT31);
                var min = Math.min.call(null, 0, n),
                    max = Math.max.call(null, 0, n);
                return min + Math.floor((max - min + 1) * random / LIMIT_INT31);
            }

            if(Twig.lib.is("Number", value)) {
                return getRandomNumber(value);
            }

            if(Twig.lib.is("String", value)) {
                return value.charAt(getRandomNumber(value.length-1));
            }

            if(Twig.lib.is("Array", value)) {
                return value[getRandomNumber(value.length-1)];
            }

            if(Twig.lib.is("Object", value)) {
                var keys = Object.keys(value);
                return value[keys[getRandomNumber(keys.length-1)]];
            }

            return getRandomNumber(LIMIT_INT31-1);
        },

        /**
         * Returns the content of a template without rendering it
         * @param {string} name
         * @param {boolean} [ignore_missing=false]
         * @returns {string}
         */
        source: function(name, ignore_missing) {
            var templateSource;
            var templateFound = false;
            var isNodeEnvironment =   true && typeof module.exports !== 'undefined' && typeof window === 'undefined';
            var loader;
            var path = name;

            //if we are running in a node.js environment, set the loader to 'fs'.
            if (isNodeEnvironment) {
                loader = 'fs';
            } else {
                loader = 'ajax';
            }

            //build the params object
            var params = {
                id: name,
                path: path,
                method: loader,
                parser: 'source',
                async: false,
                fetchTemplateSource: true
            };

            //default ignore_missing to false
            if (typeof ignore_missing === 'undefined') {
                ignore_missing = false;
            }

            //try to load the remote template
            //
            //on exception, log it
            try {
                templateSource = Twig.Templates.loadRemote(name, params);

                //if the template is undefined or null, set the template to an empty string and do NOT flip the
                // boolean indicating we found the template
                //
                //else, all is good! flip the boolean indicating we found the template
                if (typeof templateSource === 'undefined' || templateSource === null) {
                    templateSource = '';
                } else {
                    templateFound = true;
                }
            } catch (e) {
                Twig.log.debug('Twig.functions.source: ', 'Problem loading template  ', e);
            }

            //if the template was NOT found AND we are not ignoring missing templates, return the same message
            // that is returned by the PHP implementation of the twig source() function
            //
            //else, return the template source
            if (!templateFound && !ignore_missing) {
                return TEMPLATE_NOT_FOUND_MESSAGE.replace('{name}', name);
            } else {
                return templateSource;
            }
        }
    };

    Twig._function = function(_function, value, params) {
        if (!Twig.functions[_function]) {
            throw "Unable to find function " + _function;
        }
        return Twig.functions[_function](value, params);
    };

    Twig._function.extend = function(_function, definition) {
        Twig.functions[_function] = definition;
    };

    return Twig;

};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// ## twig.lib.js
//
// This file contains 3rd party libraries used within twig.
//
// Copies of the licenses for the code included here can be found in the
// LICENSES.md file.
//

module.exports = function(Twig) {

    // Namespace for libraries
    Twig.lib = { };

    Twig.lib.sprintf = __webpack_require__(0);
    Twig.lib.vsprintf = __webpack_require__(11);
    Twig.lib.round = __webpack_require__(12);
    Twig.lib.max = __webpack_require__(13);
    Twig.lib.min = __webpack_require__(14);
    Twig.lib.strip_tags = __webpack_require__(15);
    Twig.lib.strtotime = __webpack_require__(17);
    Twig.lib.date = __webpack_require__(18);
    Twig.lib.boolval = __webpack_require__(19);

    var toString = Object.prototype.toString;

    Twig.lib.is = function(type, obj) {
        if (typeof obj === 'undefined' || obj === null)
            return false;

        if (type === 'Array' && Array.isArray)
            return Array.isArray(obj);

        return toString.call(obj).slice(8, -1) === type;
    };

    Twig.lib.isArray = Array.isArray || function(obj) {
        return toString.call(obj).slice(8, -1) === 'Array';
    }

    // shallow-copy an object
    Twig.lib.copy = function(src) {
        var target = {},
            key;
        for (key in src)
            target[key] = src[key];

        return target;
    };

    Twig.lib.extend = function (src, add) {
        var keys = Object.keys(add || {}),
            i;

        i = keys.length;

        while (i--) {
            src[keys[i]] = add[keys[i]];
        }

        return src;
    };

    Twig.lib.replaceAll = function(string, search, replace) {
        return string.split(search).join(replace);
    };

    // chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
    Twig.lib.chunkArray = function (arr, size) {
        var returnVal = [],
            x = 0,
            len = arr.length;

        if (size < 1 || !Twig.lib.is("Array", arr)) {
            return [];
        }

        while (x < len) {
            returnVal.push(arr.slice(x, x += size));
        }

        return returnVal;
    };

    return Twig;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function vsprintf(format, args) {
  //  discuss at: http://locutus.io/php/vsprintf/
  // original by: ejsanders
  //   example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1])
  //   returns 1: '1988-08-01'

  var sprintf = __webpack_require__(0);

  return sprintf.apply(this, [format].concat(args));
};
//# sourceMappingURL=vsprintf.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function round(value, precision, mode) {
  //  discuss at: http://locutus.io/php/round/
  // original by: Philip Peterson
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: T.Wild
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //    input by: Greenseed
  //    input by: meo
  //    input by: William
  //    input by: Josep Sanz (http://www.ws3.es/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Great work. Ideas for improvement:
  //      note 1: - code more compliant with developer guidelines
  //      note 1: - for implementing PHP constant arguments look at
  //      note 1: the pathinfo() function, it offers the greatest
  //      note 1: flexibility & compatibility possible
  //   example 1: round(1241757, -3)
  //   returns 1: 1242000
  //   example 2: round(3.6)
  //   returns 2: 4
  //   example 3: round(2.835, 2)
  //   returns 3: 2.84
  //   example 4: round(1.1749999999999, 2)
  //   returns 4: 1.17
  //   example 5: round(58551.799999999996, 2)
  //   returns 5: 58551.8

  var m, f, isHalf, sgn; // helper variables
  // making sure precision is integer
  precision |= 0;
  m = Math.pow(10, precision);
  value *= m;
  // sign of the number
  sgn = value > 0 | -(value < 0);
  isHalf = value % 1 === 0.5 * sgn;
  f = Math.floor(value);

  if (isHalf) {
    switch (mode) {
      case 'PHP_ROUND_HALF_DOWN':
        // rounds .5 toward zero
        value = f + (sgn < 0);
        break;
      case 'PHP_ROUND_HALF_EVEN':
        // rouds .5 towards the next even integer
        value = f + f % 2 * sgn;
        break;
      case 'PHP_ROUND_HALF_ODD':
        // rounds .5 towards the next odd integer
        value = f + !(f % 2);
        break;
      default:
        // rounds .5 away from zero
        value = f + (sgn > 0);
    }
  }

  return (isHalf ? value : Math.round(value)) / m;
};
//# sourceMappingURL=round.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function max() {
  //  discuss at: http://locutus.io/php/max/
  // original by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Jack
  //      note 1: Long code cause we're aiming for maximum PHP compatibility
  //   example 1: max(1, 3, 5, 6, 7)
  //   returns 1: 7
  //   example 2: max([2, 4, 5])
  //   returns 2: 5
  //   example 3: max(0, 'hello')
  //   returns 3: 0
  //   example 4: max('hello', 0)
  //   returns 4: 'hello'
  //   example 5: max(-1, 'hello')
  //   returns 5: 'hello'
  //   example 6: max([2, 4, 8], [2, 5, 7])
  //   returns 6: [2, 5, 7]

  var ar;
  var retVal;
  var i = 0;
  var n = 0;
  var argv = arguments;
  var argc = argv.length;
  var _obj2Array = function _obj2Array(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      return obj;
    } else {
      var ar = [];
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          ar.push(obj[i]);
        }
      }
      return ar;
    }
  };
  var _compare = function _compare(current, next) {
    var i = 0;
    var n = 0;
    var tmp = 0;
    var nl = 0;
    var cl = 0;

    if (current === next) {
      return 0;
    } else if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
      if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
        current = _obj2Array(current);
        next = _obj2Array(next);
        cl = current.length;
        nl = next.length;
        if (nl > cl) {
          return 1;
        } else if (nl < cl) {
          return -1;
        }
        for (i = 0, n = cl; i < n; ++i) {
          tmp = _compare(current[i], next[i]);
          if (tmp === 1) {
            return 1;
          } else if (tmp === -1) {
            return -1;
          }
        }
        return 0;
      }
      return -1;
    } else if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
      return 1;
    } else if (isNaN(next) && !isNaN(current)) {
      if (current === 0) {
        return 0;
      }
      return current < 0 ? 1 : -1;
    } else if (isNaN(current) && !isNaN(next)) {
      if (next === 0) {
        return 0;
      }
      return next > 0 ? 1 : -1;
    }

    if (next === current) {
      return 0;
    }

    return next > current ? 1 : -1;
  };

  if (argc === 0) {
    throw new Error('At least one value should be passed to max()');
  } else if (argc === 1) {
    if (_typeof(argv[0]) === 'object') {
      ar = _obj2Array(argv[0]);
    } else {
      throw new Error('Wrong parameter count for max()');
    }
    if (ar.length === 0) {
      throw new Error('Array must contain at least one element for max()');
    }
  } else {
    ar = argv;
  }

  retVal = ar[0];
  for (i = 1, n = ar.length; i < n; ++i) {
    if (_compare(retVal, ar[i]) === 1) {
      retVal = ar[i];
    }
  }

  return retVal;
};
//# sourceMappingURL=max.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function min() {
  //  discuss at: http://locutus.io/php/min/
  // original by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Jack
  //      note 1: Long code cause we're aiming for maximum PHP compatibility
  //   example 1: min(1, 3, 5, 6, 7)
  //   returns 1: 1
  //   example 2: min([2, 4, 5])
  //   returns 2: 2
  //   example 3: min(0, 'hello')
  //   returns 3: 0
  //   example 4: min('hello', 0)
  //   returns 4: 'hello'
  //   example 5: min(-1, 'hello')
  //   returns 5: -1
  //   example 6: min([2, 4, 8], [2, 5, 7])
  //   returns 6: [2, 4, 8]

  var ar;
  var retVal;
  var i = 0;
  var n = 0;
  var argv = arguments;
  var argc = argv.length;
  var _obj2Array = function _obj2Array(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      return obj;
    }
    var ar = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ar.push(obj[i]);
      }
    }
    return ar;
  };

  var _compare = function _compare(current, next) {
    var i = 0;
    var n = 0;
    var tmp = 0;
    var nl = 0;
    var cl = 0;

    if (current === next) {
      return 0;
    } else if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
      if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
        current = _obj2Array(current);
        next = _obj2Array(next);
        cl = current.length;
        nl = next.length;
        if (nl > cl) {
          return 1;
        } else if (nl < cl) {
          return -1;
        }
        for (i = 0, n = cl; i < n; ++i) {
          tmp = _compare(current[i], next[i]);
          if (tmp === 1) {
            return 1;
          } else if (tmp === -1) {
            return -1;
          }
        }
        return 0;
      }
      return -1;
    } else if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
      return 1;
    } else if (isNaN(next) && !isNaN(current)) {
      if (current === 0) {
        return 0;
      }
      return current < 0 ? 1 : -1;
    } else if (isNaN(current) && !isNaN(next)) {
      if (next === 0) {
        return 0;
      }
      return next > 0 ? 1 : -1;
    }

    if (next === current) {
      return 0;
    }

    return next > current ? 1 : -1;
  };

  if (argc === 0) {
    throw new Error('At least one value should be passed to min()');
  } else if (argc === 1) {
    if (_typeof(argv[0]) === 'object') {
      ar = _obj2Array(argv[0]);
    } else {
      throw new Error('Wrong parameter count for min()');
    }

    if (ar.length === 0) {
      throw new Error('Array must contain at least one element for min()');
    }
  } else {
    ar = argv;
  }

  retVal = ar[0];

  for (i = 1, n = ar.length; i < n; ++i) {
    if (_compare(retVal, ar[i]) === -1) {
      retVal = ar[i];
    }
  }

  return retVal;
};
//# sourceMappingURL=min.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function strip_tags(input, allowed) {
  // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/strip_tags/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Luke Godfrey
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Pul
  //    input by: Alex
  //    input by: Marc Palau
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Bobby Drake
  //    input by: Evertjan Garretsen
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Eric Nagel
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Tomasz Wesolowski
  // bugfixed by: Tymon Sturgeon (https://scryptonite.com)
  // bugfixed by: Tim de Koning (https://www.kingsquare.nl)
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
  //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
  //   returns 2: '<p>Kevin van Zonneveld</p>'
  //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
  //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
  //   example 4: strip_tags('1 < 5 5 > 1')
  //   returns 4: '1 < 5 5 > 1'
  //   example 5: strip_tags('1 <br/> 1')
  //   returns 5: '1  1'
  //   example 6: strip_tags('1 <br/> 1', '<br>')
  //   returns 6: '1 <br/> 1'
  //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
  //   returns 7: '1 <br/> 1'
  //   example 8: strip_tags('<i>hello</i> <<foo>script>world<</foo>/script>')
  //   returns 8: 'hello world'
  //   example 9: strip_tags(4)
  //   returns 9: '4'

  var _phpCastString = __webpack_require__(16);

  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  var after = _phpCastString(input);
  // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
  while (true) {
    var before = after;
    after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });

    // return once no more tags are removed
    if (before === after) {
      return after;
    }
  }
};
//# sourceMappingURL=strip_tags.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function _phpCastString(value) {
  // original by: Rafał Kukawski
  //   example 1: _phpCastString(true)
  //   returns 1: '1'
  //   example 2: _phpCastString(false)
  //   returns 2: ''
  //   example 3: _phpCastString('foo')
  //   returns 3: 'foo'
  //   example 4: _phpCastString(0/0)
  //   returns 4: 'NAN'
  //   example 5: _phpCastString(1/0)
  //   returns 5: 'INF'
  //   example 6: _phpCastString(-1/0)
  //   returns 6: '-INF'
  //   example 7: _phpCastString(null)
  //   returns 7: ''
  //   example 8: _phpCastString(undefined)
  //   returns 8: ''
  //   example 9: _phpCastString([])
  //   returns 9: 'Array'
  //   example 10: _phpCastString({})
  //   returns 10: 'Object'
  //   example 11: _phpCastString(0)
  //   returns 11: '0'
  //   example 12: _phpCastString(1)
  //   returns 12: '1'
  //   example 13: _phpCastString(3.14)
  //   returns 13: '3.14'

  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  switch (type) {
    case 'boolean':
      return value ? '1' : '';
    case 'string':
      return value;
    case 'number':
      if (isNaN(value)) {
        return 'NAN';
      }

      if (!isFinite(value)) {
        return (value < 0 ? '-' : '') + 'INF';
      }

      return value + '';
    case 'undefined':
      return '';
    case 'object':
      if (Array.isArray(value)) {
        return 'Array';
      }

      if (value !== null) {
        return 'Object';
      }

      return '';
    case 'function':
    // fall through
    default:
      throw new Error('Unsupported value type');
  }
};
//# sourceMappingURL=_phpCastString.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function strtotime(text, now) {
  //  discuss at: http://locutus.io/php/strtotime/
  // original by: Caio Ariede (http://caioariede.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Caio Ariede (http://caioariede.com)
  // improved by: A. Matías Quezada (http://amatiasq.com)
  // improved by: preuter
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Mirko Faber
  //    input by: David
  // bugfixed by: Wagner B. Soares
  // bugfixed by: Artur Tchernychev
  // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
  //      note 1: Examples all have a fixed timestamp to prevent
  //      note 1: tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200)
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200)
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT')
  //   returns 4: 1241425800
  //   example 5: strtotime('2009-05-04 08:30:00+00')
  //   returns 5: 1241425800
  //   example 6: strtotime('2009-05-04 08:30:00+02:00')
  //   returns 6: 1241418600
  //   example 7: strtotime('2009-05-04T08:30:00Z')
  //   returns 7: 1241425800

  var parsed;
  var match;
  var today;
  var year;
  var date;
  var days;
  var ranges;
  var len;
  var times;
  var regex;
  var i;
  var fail = false;

  if (!text) {
    return fail;
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/[\t\r\n]/g, '').toLowerCase();

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  var pattern = new RegExp(['^(\\d{1,4})', '([\\-\\.\\/:])', '(\\d{1,2})', '([\\-\\.\\/:])', '(\\d{1,4})', '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?', '(?:\\s([A-Z]+)?)?$'].join(''));
  match = text.match(pattern);

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case '-':
          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        case '.':
          // YYYY.M.D is not parsed by strtotime()
          return fail;
        case '/':
          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case '-':
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        case '.':
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        case '/':
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
      }
    } else {
      switch (match[2]) {
        case '-':
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || match[1] < 70 && match[1] > 38) {
            return fail;
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
          return new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        case '.':
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
          }

          // invalid format, cannot be parsed
          return fail;
        case '/':
          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || match[5] < 70 && match[5] > 38) {
            return fail;
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
          return new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        case ':':
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail;
          }

          today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0;
  }
  // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
  // not accept lower case characters, space, or shortened time zones.
  // Therefore, fix these problems and try again.
  // Examples:
  //   2015-04-15 20:33:59+02
  //   2015-04-15 20:33:59z
  //   2015-04-15t20:33:59+02:00
  pattern = new RegExp(['^([0-9]{4}-[0-9]{2}-[0-9]{2})', '[ t]', '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)', '([\\+-][0-9]{2}(:[0-9]{2})?|z)'].join(''));
  match = text.match(pattern);
  if (match) {
    // @todo: time zone information
    if (match[4] === 'z') {
      match[4] = 'Z';
    } else if (match[4].match(/^([+-][0-9]{2})$/)) {
      match[4] = match[4] + ':00';
    }

    if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
      return parsed / 1000 | 0;
    }
  }

  date = now ? new Date(now * 1000) : new Date();
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  };

  function lastNext(type, range, modifier) {
    var diff;
    var day = days[range];

    if (typeof day !== 'undefined') {
      diff = day - date.getDay();

      if (diff === 0) {
        diff = 7 * modifier;
      } else if (diff > 0 && type === 'last') {
        diff -= 7;
      } else if (diff < 0 && type === 'next') {
        diff += 7;
      }

      date.setDate(date.getDate() + diff);
    }
  }

  function process(val) {
    // @todo: Reconcile this with regex using \s, taking into account
    // browser issues with split and regexes
    var splt = val.split(' ');
    var type = splt[0];
    var range = splt[1].substring(0, 3);
    var typeIsNumber = /\d+/.test(type);
    var ago = splt[2] === 'ago';
    var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

    if (typeIsNumber) {
      num *= parseInt(type, 10);
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + num * 7);
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num);
    } else if (!typeIsNumber) {
      return false;
    }

    return true;
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' + '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' + '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

  match = text.match(new RegExp(regex, 'gi'));
  if (!match) {
    return fail;
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail;
    }
  }

  return date.getTime() / 1000;
};
//# sourceMappingURL=strtotime.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function date(format, timestamp) {
  //  discuss at: http://locutus.io/php/date/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // original by: gettimeofday
  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: MeEtc (http://yass.meetcweb.com)
  // improved by: Brad Touesnard
  // improved by: Tim Wiel
  // improved by: Bryan Elliott
  // improved by: David Randall
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Thomas Beaucourt (http://www.webapp.fr)
  // improved by: JT
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // improved by: Theriault (https://github.com/Theriault)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: omid (http://locutus.io/php/380:380#comment_137122)
  // bugfixed by: Chris (http://www.devotis.nl/)
  //      note 1: Uses global: locutus to store the default timezone
  //      note 1: Although the function potentially allows timezone info
  //      note 1: (see notes), it currently does not set
  //      note 1: per a timezone specified by date_default_timezone_set(). Implementers might use
  //      note 1: $locutus.currentTimezoneOffset and
  //      note 1: $locutus.currentTimezoneDST set by that function
  //      note 1: in order to adjust the dates in this function
  //      note 1: (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
  //   returns 1: '07:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400)
  //   returns 2: 'September 2, 2003, 12:26 am'
  //   example 3: date('Y W o', 1062462400)
  //   returns 3: '2003 36 2003'
  //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
  //   example 4: $x = $x + ''
  //   example 4: var $result = $x.length // 2009 01 09
  //   returns 4: 10
  //   example 5: date('W', 1104534000)
  //   returns 5: '52'
  //   example 6: date('B t', 1104534000)
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'
  //        test: skip-1 skip-2 skip-5

  var jsdate, f;
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi;
  var formatChrCb = function formatChrCb(t, s) {
    return f[t] ? f[t]() : s;
  };
  var _pad = function _pad(n, c) {
    n = String(n);
    while (n.length < c) {
      n = '0' + n;
    }
    return n;
  };
  f = {
    // Day
    d: function d() {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function D() {
      // Shorthand day name; Mon...Sun
      return f.l().slice(0, 3);
    },
    j: function j() {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function l() {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day';
    },
    N: function N() {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function S() {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      var i = j % 10;
      if (i <= 3 && parseInt(j % 100 / 10, 10) === 1) {
        i = 0;
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th';
    },
    w: function w() {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function z() {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j());
      var b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function W() {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
      var b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function F() {
      // Full month name; January...December
      return txtWords[6 + f.n()];
    },
    m: function m() {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function M() {
      // Shorthand month name; Jan...Dec
      return f.F().slice(0, 3);
    },
    n: function n() {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function t() {
      // Days in month; 28...31
      return new Date(f.Y(), f.n(), 0).getDate();
    },

    // Year
    L: function L() {
      // Is leap year?; 0 or 1
      var j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o: function o() {
      // ISO-8601 year
      var n = f.n();
      var W = f.W();
      var Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function Y() {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function y() {
      // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function a() {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A: function A() {
      // AM or PM
      return f.a().toUpperCase();
    },
    B: function B() {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2;
      // Hours
      var i = jsdate.getUTCMinutes() * 60;
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds();
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function g() {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function G() {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function h() {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function H() {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function i() {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function s() {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function u() {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function e() {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      var msg = 'Not supported (see source code of date() for timezone on how to add support)';
      throw new Error(msg);
    },
    I: function I() {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0);
      // Jan 1
      var c = Date.UTC(f.Y(), 0);
      // Jan 1 UTC
      var b = new Date(f.Y(), 6);
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6);
      return a - c !== b - d ? 1 : 0;
    },
    O: function O() {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset();
      var a = Math.abs(tzo);
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P: function P() {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return O.substr(0, 3) + ':' + O.substr(3, 2);
    },
    T: function T() {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC';
    },
    Z: function Z() {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function c() {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r: function r() {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U: function U() {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    }
  };

  var _date = function _date(format, timestamp) {
    jsdate = timestamp === undefined ? new Date() // Not provided
    : timestamp instanceof Date ? new Date(timestamp) // JS Date()
    : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    ;
    return format.replace(formatChr, formatChrCb);
  };

  return _date(format, timestamp);
};
//# sourceMappingURL=date.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function boolval(mixedVar) {
  // original by: Will Rowe
  //   example 1: boolval(true)
  //   returns 1: true
  //   example 2: boolval(false)
  //   returns 2: false
  //   example 3: boolval(0)
  //   returns 3: false
  //   example 4: boolval(0.0)
  //   returns 4: false
  //   example 5: boolval('')
  //   returns 5: false
  //   example 6: boolval('0')
  //   returns 6: false
  //   example 7: boolval([])
  //   returns 7: false
  //   example 8: boolval('')
  //   returns 8: false
  //   example 9: boolval(null)
  //   returns 9: false
  //   example 10: boolval(undefined)
  //   returns 10: false
  //   example 11: boolval('true')
  //   returns 11: true

  if (mixedVar === false) {
    return false;
  }

  if (mixedVar === 0 || mixedVar === 0.0) {
    return false;
  }

  if (mixedVar === '' || mixedVar === '0') {
    return false;
  }

  if (Array.isArray(mixedVar) && mixedVar.length === 0) {
    return false;
  }

  if (mixedVar === null || mixedVar === undefined) {
    return false;
  }

  return true;
};
//# sourceMappingURL=boolval.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerLoader('ajax', function(location, params, callback, error_callback) {
        var template,
            xmlhttp,
            precompiled = params.precompiled,
            parser = this.parsers[params.parser] || this.parser.twig;

        if (typeof XMLHttpRequest === "undefined") {
            throw new Twig.Error('Unsupported platform: Unable to do ajax requests ' +
                                 'because there is no "XMLHTTPRequest" implementation');
        }

        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            var data = null;

            if(xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200 || (window.cordova && xmlhttp.status == 0)) {
                    Twig.log.debug("Got template ", xmlhttp.responseText);

                    if (precompiled === true) {
                        data = JSON.parse(xmlhttp.responseText);
                    } else {
                        data = xmlhttp.responseText;
                    }

                    params.url = location;
                    params.data = data;

                    template = parser.call(this, params);

                    if (typeof callback === 'function') {
                        callback(template);
                    }
                } else {
                    if (typeof error_callback === 'function') {
                        error_callback(xmlhttp);
                    }
                }
            }
        };
        xmlhttp.open("GET", location, !!params.async);
        xmlhttp.send();

        if (params.async) {
            // TODO: return deferred promise
            return true;
        } else {
            return template;
        }
    });

};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function(Twig) {
    'use strict';

    var fs, path;

    try {
    	// require lib dependencies at runtime
    	fs = __webpack_require__(22);
    	path = __webpack_require__(1);
    } catch (e) {
    	// NOTE: this is in a try/catch to avoid errors cross platform
    }

    Twig.Templates.registerLoader('fs', function(location, params, callback, error_callback) {
        var template,
            data = null,
            precompiled = params.precompiled,
            parser = this.parsers[params.parser] || this.parser.twig;

        if (!fs || !path) {
            throw new Twig.Error('Unsupported platform: Unable to load from file ' +
                                 'because there is no "fs" or "path" implementation');
        }

        var loadTemplateFn = function(err, data) {
            if (err) {
                if (typeof error_callback === 'function') {
                    error_callback(err);
                }
                return;
            }

            if (precompiled === true) {
                data = JSON.parse(data);
            }

            params.data = data;
            params.path = params.path || location;

            // template is in data
            template = parser.call(this, params);

            if (typeof callback === 'function') {
                callback(template);
            }
        };
        params.path = params.path || location;

        if (params.async) {
            fs.stat(params.path, function (err, stats) {
                if (err || !stats.isFile()) {
                    if (typeof error_callback === 'function') {
                        error_callback(new Twig.Error('Unable to find template file ' + params.path));
                    }
                    return;
                }
                fs.readFile(params.path, 'utf8', loadTemplateFn);
            });
            // TODO: return deferred promise
            return true;
        } else {
            try {
                if (!fs.statSync(params.path).isFile()) {
                    throw new Twig.Error('Unable to find template file ' + params.path);
                }
            } catch (err) {
                throw new Twig.Error('Unable to find template file ' + params.path);
            }
            data = fs.readFileSync(params.path, 'utf8');
            loadTemplateFn(undefined, data);
            return template
        }
    });

};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = __webpack_require__(/*! fs */ 2);

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// ## twig.logic.js
//
// This file handles tokenizing, compiling and parsing logic tokens. {% ... %}
module.exports = function (Twig) {
    "use strict";

    /**
     * Namespace for logic handling.
     */
    Twig.logic = {};

    /**
     * Logic token types.
     */
    Twig.logic.type = {
        if_:       'Twig.logic.type.if',
        endif:     'Twig.logic.type.endif',
        for_:      'Twig.logic.type.for',
        endfor:    'Twig.logic.type.endfor',
        else_:     'Twig.logic.type.else',
        elseif:    'Twig.logic.type.elseif',
        set:       'Twig.logic.type.set',
        setcapture:'Twig.logic.type.setcapture',
        endset:    'Twig.logic.type.endset',
        filter:    'Twig.logic.type.filter',
        endfilter: 'Twig.logic.type.endfilter',
        shortblock: 'Twig.logic.type.shortblock',
        block:     'Twig.logic.type.block',
        endblock:  'Twig.logic.type.endblock',
        extends_:  'Twig.logic.type.extends',
        use:       'Twig.logic.type.use',
        include:   'Twig.logic.type.include',
        spaceless: 'Twig.logic.type.spaceless',
        endspaceless: 'Twig.logic.type.endspaceless',
        macro:     'Twig.logic.type.macro',
        endmacro:  'Twig.logic.type.endmacro',
        import_:   'Twig.logic.type.import',
        from:      'Twig.logic.type.from',
        embed:     'Twig.logic.type.embed',
        endembed:  'Twig.logic.type.endembed',
        'with':     'Twig.logic.type.with',
        endwith:  'Twig.logic.type.endwith'
    };


    // Regular expressions for handling logic tokens.
    //
    // Properties:
    //
    //      type:  The type of expression this matches
    //
    //      regex: A regular expression that matches the format of the token
    //
    //      next:  What logic tokens (if any) pop this token off the logic stack. If empty, the
    //             logic token is assumed to not require an end tag and isn't push onto the stack.
    //
    //      open:  Does this tag open a logic expression or is it standalone. For example,
    //             {% endif %} cannot exist without an opening {% if ... %} tag, so open = false.
    //
    //  Functions:
    //
    //      compile: A function that handles compiling the token into an output token ready for
    //               parsing with the parse function.
    //
    //      parse:   A function that parses the compiled token into output (HTML / whatever the
    //               template represents).
    Twig.logic.definitions = [
        {
            /**
             * If type logic tokens.
             *
             *  Format: {% if expression %}
             */
            type: Twig.logic.type.if_,
            regex: /^if\s?([\s\S]+)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: true,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var that = this;

                return Twig.expression.parseAsync.call(this, token.stack, context)
                .then(function(result) {
                    chain = true;

                    if (Twig.lib.boolval(result)) {
                        chain = false;

                        return Twig.parseAsync.call(that, token.output, context);
                    }

                    return '';
                })
                .then(function(output) {
                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },
        {
            /**
             * Else if type logic tokens.
             *
             *  Format: {% elseif expression %}
             */
            type: Twig.logic.type.elseif,
            regex: /^elseif\s?([^\s].*)$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.elseif,
                Twig.logic.type.endif
            ],
            open: false,
            compile: function (token) {
                var expression = token.match[1];
                // Compile the expression.
                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var that = this;

                return Twig.expression.parseAsync.call(this, token.stack, context)
                .then(function(result) {
                    if (chain && Twig.lib.boolval(result)) {
                        chain = false;

                        return Twig.parseAsync.call(that, token.output, context);
                    }

                    return '';
                })
                .then(function(output) {
                    return {
                        chain: chain,
                        output: output
                    }
                });
            }
        },
        {
            /**
             * Else type logic tokens.
             *
             *  Format: {% else %}
             */
            type: Twig.logic.type.else_,
            regex: /^else$/,
            next: [
                Twig.logic.type.endif,
                Twig.logic.type.endfor
            ],
            open: false,
            parse: function (token, context, chain) {
                var promise = Twig.Promise.resolve('');

                if (chain) {
                    promise = Twig.parseAsync.call(this, token.output, context);
                }

                return promise.then(function(output) {
                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },
        {
            /**
             * End if type logic tokens.
             *
             *  Format: {% endif %}
             */
            type: Twig.logic.type.endif,
            regex: /^endif$/,
            next: [ ],
            open: false
        },
        {
            /**
             * For type logic tokens.
             *
             *  Format: {% for expression %}
             */
            type: Twig.logic.type.for_,
            regex: /^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([\S\s]+?)(?:\s+if\s+([^\s].*))?$/,
            next: [
                Twig.logic.type.else_,
                Twig.logic.type.endfor
            ],
            open: true,
            compile: function (token) {
                var key_value = token.match[1],
                    expression = token.match[2],
                    conditional = token.match[3],
                    kv_split = null;

                token.key_var = null;
                token.value_var = null;

                if (key_value.indexOf(",") >= 0) {
                    kv_split = key_value.split(',');
                    if (kv_split.length === 2) {
                        token.key_var = kv_split[0].trim();
                        token.value_var = kv_split[1].trim();
                    } else {
                        throw new Twig.Error("Invalid expression in for loop: " + key_value);
                    }
                } else {
                    token.value_var = key_value.trim();
                }

                // Valid expressions for a for loop
                //   for item     in expression
                //   for key,item in expression

                // Compile the expression.
                token.expression = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;

                // Compile the conditional (if available)
                if (conditional) {
                    token.conditional = Twig.expression.compile.call(this, {
                        type:  Twig.expression.type.expression,
                        value: conditional
                    }).stack;
                }

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                // Parse expression
                var output = [],
                    len,
                    index = 0,
                    keyset,
                    that = this,
                    conditional = token.conditional,
                    buildLoop = function(index, len) {
                        var isConditional = conditional !== undefined;
                        return {
                            index: index+1,
                            index0: index,
                            revindex: isConditional?undefined:len-index,
                            revindex0: isConditional?undefined:len-index-1,
                            first: (index === 0),
                            last: isConditional?undefined:(index === len-1),
                            length: isConditional?undefined:len,
                            parent: context
                        };
                    },
                    // run once for each iteration of the loop
                    loop = function(key, value) {
                        var inner_context = Twig.ChildContext(context);

                        inner_context[token.value_var] = value;

                        if (token.key_var) {
                            inner_context[token.key_var] = key;
                        }

                        // Loop object
                        inner_context.loop = buildLoop(index, len);

                        var promise = conditional === undefined ?
                            Twig.Promise.resolve(true) :
                            Twig.expression.parseAsync.call(that, conditional, inner_context);

                        return promise.then(function(condition) {
                            if (!condition)
                                return;

                            return Twig.parseAsync.call(that, token.output, inner_context)
                            .then(function(o) {
                                output.push(o);
                                index += 1;
                            });
                        })
                        .then(function() {
                            // Delete loop-related variables from the context
                            delete inner_context['loop'];
                            delete inner_context[token.value_var];
                            delete inner_context[token.key_var];

                            // Merge in values that exist in context but have changed
                            // in inner_context.
                            Twig.merge(context, inner_context, true);
                        });
                    };


                return Twig.expression.parseAsync.call(this, token.expression, context)
                .then(function(result) {
                    if (Twig.lib.isArray(result)) {
                        len = result.length;
                        return Twig.async.forEach(result, function (value) {
                            var key = index;

                            return loop(key, value);
                        });
                    } else if (Twig.lib.is('Object', result)) {
                        if (result._keys !== undefined) {
                            keyset = result._keys;
                        } else {
                            keyset = Object.keys(result);
                        }
                        len = keyset.length;
                        return Twig.async.forEach(keyset, function(key) {
                            // Ignore the _keys property, it's internal to twig.js
                            if (key === "_keys") return;

                            return loop(key,  result[key]);
                        });
                    }
                })
                .then(function() {
                    // Only allow else statements if no output was generated
                    continue_chain = (output.length === 0);

                    return {
                        chain: continue_chain,
                        output: Twig.output.call(that, output)
                    };
                });
            }
        },
        {
            /**
             * End for type logic tokens.
             *
             *  Format: {% endfor %}
             */
            type: Twig.logic.type.endfor,
            regex: /^endfor$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Set type logic tokens.
             *
             *  Format: {% set key = expression %}
             */
            type: Twig.logic.type.set,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,
            next: [ ],
            open: true,
            compile: function (token) { //
                var key = token.match[1].trim(),
                    expression = token.match[2],
                    // Compile the expression.
                    expression_stack  = Twig.expression.compile.call(this, {
                        type:  Twig.expression.type.expression,
                        value: expression
                    }).stack;

                token.key = key;
                token.expression = expression_stack;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                var key = token.key;

                return Twig.expression.parseAsync.call(this, token.expression, context)
                .then(function(value) {
                    if (value === context) {
                        /*  If storing the context in a variable, it needs to be a clone of the current state of context.
                            Otherwise we have a context with infinite recursion.
                            Fixes #341
                        */
                        value = Twig.lib.copy(value);
                    }

                    context[key] = value;

                    return {
                        chain: continue_chain,
                        context: context
                    };
                });
            }
        },
        {
            /**
             * Set capture type logic tokens.
             *
             *  Format: {% set key %}
             */
            type: Twig.logic.type.setcapture,
            regex: /^set\s+([a-zA-Z0-9_,\s]+)$/,
            next: [
                Twig.logic.type.endset
            ],
            open: true,
            compile: function (token) {
                var key = token.match[1].trim();

                token.key = key;

                delete token.match;
                return token;
            },
            parse: function (token, context, continue_chain) {
                var that = this,
                    key = token.key;

                return Twig.parseAsync.call(this, token.output, context)
                .then(function(value) {
                    // set on both the global and local context
                    that.context[key] = value;
                    context[key] = value;

                    return {
                        chain: continue_chain,
                        context: context
                    };
                });
            }
        },
        {
            /**
             * End set type block logic tokens.
             *
             *  Format: {% endset %}
             */
            type: Twig.logic.type.endset,
            regex: /^endset$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Filter logic tokens.
             *
             *  Format: {% filter upper %} or {% filter lower|escape %}
             */
            type: Twig.logic.type.filter,
            regex: /^filter\s+(.+)$/,
            next: [
                Twig.logic.type.endfilter
            ],
            open: true,
            compile: function (token) {
                var expression = "|" + token.match[1].trim();
                // Compile the expression.
                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var that = this;

                return Twig.parseAsync.call(this, token.output, context)
                .then(function(unfiltered) {
                    var stack = [{
                        type: Twig.expression.type.string,
                        value: unfiltered
                    }].concat(token.stack);

                    return Twig.expression.parseAsync.call(that, stack, context);
                })
                .then(function(output) {
                    return {
                        chain: chain,
                        output: output
                    }
                });
            }
        },
        {
            /**
             * End filter logic tokens.
             *
             *  Format: {% endfilter %}
             */
            type: Twig.logic.type.endfilter,
            regex: /^endfilter$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% block title %}
             */
            type: Twig.logic.type.block,
            regex: /^block\s+([a-zA-Z0-9_]+)$/,
            next: [
                Twig.logic.type.endblock
            ],
            open: true,
            compile: function (token) {
                token.block = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var that = this,
                    block_output,
                    output,
                    promise = Twig.Promise.resolve(),
                    isImported = Twig.indexOf(this.importedBlocks, token.block) > -1,
                    hasParent = this.blocks[token.block] && Twig.indexOf(this.blocks[token.block], Twig.placeholders.parent) > -1;

                // detect if in a for loop
                Twig.forEach(this.parseStack, function (parent_token) {
                    if (parent_token.type == Twig.logic.type.for_) {
                        token.overwrite = true;
                    }
                });

                // Don't override previous blocks unless they're imported with "use"
                if (this.blocks[token.block] === undefined || isImported || hasParent || token.overwrite) {
                    if (token.expression) {
                        promise = Twig.expression.parseAsync.call(this, token.output, context)
                        .then(function(value) {
                            return Twig.expression.parseAsync.call(that, {
                                type: Twig.expression.type.string,
                                value: value
                            }, context);
                        });
                    } else {
                        promise = Twig.parseAsync.call(this, token.output, context)
                        .then(function(value) {
                            return Twig.expression.parseAsync.call(that, {
                                type: Twig.expression.type.string,
                                value: value
                            }, context);
                        });
                    }

                    promise = promise.then(function(block_output) {
                        if (isImported) {
                            // once the block is overridden, remove it from the list of imported blocks
                            that.importedBlocks.splice(that.importedBlocks.indexOf(token.block), 1);
                        }

                        if (hasParent) {
                            that.blocks[token.block] = Twig.Markup(that.blocks[token.block].replace(Twig.placeholders.parent, block_output));
                        } else {
                            that.blocks[token.block] = block_output;
                        }

                        that.originalBlockTokens[token.block] = {
                            type: token.type,
                            block: token.block,
                            output: token.output,
                            overwrite: true
                        };
                    });
                }

                return promise.then(function() {
                    // Check if a child block has been set from a template extending this one.
                    if (that.child.blocks[token.block]) {
                        output = that.child.blocks[token.block];
                    } else {
                        output = that.blocks[token.block];
                    }

                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },
        {
            /**
             * Block shorthand logic tokens.
             *
             *  Format: {% block title expression %}
             */
            type: Twig.logic.type.shortblock,
            regex: /^block\s+([a-zA-Z0-9_]+)\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                token.expression = token.match[2].trim();

                token.output = Twig.expression.compile({
                    type: Twig.expression.type.expression,
                    value: token.expression
                }).stack;

                token.block = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var args = new Array(arguments.length), args_i = arguments.length;
                while(args_i-- > 0) args[args_i] = arguments[args_i];
                return Twig.logic.handler[Twig.logic.type.block].parse.apply(this, args);
            }
        },
        {
            /**
             * End block logic tokens.
             *
             *  Format: {% endblock %}
             */
            type: Twig.logic.type.endblock,
            regex: /^endblock(?:\s+([a-zA-Z0-9_]+))?$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% extends "template.twig" %}
             */
            type: Twig.logic.type.extends_,
            regex: /^extends\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack   = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var template,
                    that = this,
                    innerContext = Twig.ChildContext(context);

                // Resolve filename
                return Twig.expression.parseAsync.call(this, token.stack, context)
                .then(function(file) {
                    // Set parent template
                    that.extend = file;

                    if (file instanceof Twig.Template) {
                        template = file;
                    } else {
                        // Import file
                        template = that.importFile(file);
                    }

                    // Render the template in case it puts anything in its context
                    return template.renderAsync(innerContext);
                })
                .then(function() {
                    // Extend the parent context with the extended context
                    Twig.lib.extend(context, innerContext);

                    return {
                        chain: chain,
                        output: ''
                    };
                });
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% use "template.twig" %}
             */
            type: Twig.logic.type.use,
            regex: /^use\s+(.+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim();
                delete token.match;

                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var that = this;

                // Resolve filename
                return Twig.expression.parseAsync.call(this, token.stack, context)
                .then(function(file) {
                    // Import blocks
                    that.importBlocks(file);

                    return {
                        chain: chain,
                        output: ''
                    };
                });
            }
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% includes "template.twig" [with {some: 'values'} only] %}
             */
            type: Twig.logic.type.include,
            regex: /^include\s+(.+?)(?:\s|$)(ignore missing(?:\s|$))?(?:with\s+([\S\s]+?))?(?:\s|$)(only)?$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    expression = match[1].trim(),
                    ignoreMissing = match[2] !== undefined,
                    withContext = match[3],
                    only = ((match[4] !== undefined) && match[4].length);

                delete token.match;

                token.only = only;
                token.ignoreMissing = ignoreMissing;

                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.call(this, {
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }).stack;
                }

                return token;
            },
            parse: function logicTypeInclude(token, context, chain) {
                // Resolve filename
                var innerContext = token.only ? {} : Twig.ChildContext(context),
                    ignoreMissing = token.ignoreMissing,
                    that = this,
                    promise = null,
                    result = { chain: chain, output: '' };

                if (typeof token.withStack !== 'undefined') {
                    promise = Twig.expression.parseAsync.call(this, token.withStack, context)
                    .then(function(withContext) {
                        Twig.lib.extend(innerContext, withContext);
                    });
                } else {
                    promise = Twig.Promise.resolve();
                }

                return promise
                .then(function() {
                    return Twig.expression.parseAsync.call(that, token.stack, context);
                })
                .then(function logicTypeIncludeImport(file) {
                    if (file instanceof Twig.Template) {
                        return file.renderAsync(innerContext, { isInclude: true });
                    }

                    try {
                        return that.importFile(file).renderAsync(innerContext, { isInclude: true });
                    } catch(err) {
                        if (ignoreMissing)
                            return '';

                        throw err;
                    }
                })
                .then(function slowLogicReturn(output) {
                    if (output !== '')
                        result.output = output;

                    return result;
                });
            }
        },
        {
            type: Twig.logic.type.spaceless,
            regex: /^spaceless$/,
            next: [
                Twig.logic.type.endspaceless
            ],
            open: true,

            // Parse the html and return it without any spaces between tags
            parse: function (token, context, chain) {
                // Parse the output without any filter
                return Twig.parseAsync.call(this, token.output, context)
                .then(function(unfiltered) {
                    var // A regular expression to find closing and opening tags with spaces between them
                        rBetweenTagSpaces = />\s+</g,
                        // Replace all space between closing and opening html tags
                        output = unfiltered.replace(rBetweenTagSpaces,'><').trim();
                        // Rewrap output as a Twig.Markup
                        output = Twig.Markup(output);
                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },

        // Add the {% endspaceless %} token
        {
            type: Twig.logic.type.endspaceless,
            regex: /^endspaceless$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Macro logic tokens.
             *
             * Format: {% macro input(name = default, value, type, size) %}
             *
             */
            type: Twig.logic.type.macro,
            regex: /^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:\s*=\s*([\s\S]+))?(?:,\s*)?)*)\s*\)$/,
            next: [
                Twig.logic.type.endmacro
            ],
            open: true,
            compile: function (token) {
                var macroName = token.match[1],
                    rawParameters = token.match[2].split(/\s*,\s*/),
                    parameters = rawParameters.map(function (rawParameter) {
                        return rawParameter.split(/\s*=\s*/)[0];
                    }),
                    parametersCount = parameters.length;

                // Duplicate check
               if (parametersCount > 1) {
                    var uniq = {};
                    for (var i = 0; i < parametersCount; i++) {
                        var parameter = parameters[i];
                        if (!uniq[parameter]) {
                            uniq[parameter] = 1;
                        } else {
                            throw new Twig.Error("Duplicate arguments for parameter: " + parameter);
                        }
                    }
                }

                token.macroName = macroName;
                token.parameters = parameters;
                token.defaults = rawParameters.reduce(function (defaults, rawParameter) {
                    var pair = rawParameter.split(/\s*=\s*/);
                    var key = pair[0];
                    var expression = pair[1];

                    if(expression) {
                        defaults[key] = Twig.expression.compile.call(this, {
                            type: Twig.expression.type.expression,
                            value: expression
                        }).stack;
                    } else {
                        defaults[key] = undefined;
                    }

                    return defaults;
                }, {});

                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                var template = this;
                this.macros[token.macroName] = function() {
                    // Pass global context and other macros
                    var macroContext = {
                        _self: template.macros
                    };
                    // Save arguments
                    var args = Array.prototype.slice.call(arguments);

                    return Twig.async.forEach(token.parameters, function (prop, i) {
                        // Add parameters from context to macroContext
                        if (typeof args[i] !== 'undefined') {
                            macroContext[prop] = args[i];
                            return true;
                        } else if (typeof token.defaults[prop] !== 'undefined') {
                            return Twig.expression.parseAsync.call(this, token.defaults[prop], context)
                                .then(function(value) {
                                    macroContext[prop] = value;
                                    return Twig.Promise.resolve();
                                });
                        } else {
                            macroContext[prop] = undefined;
                            return true;
                        }
                    }).then(function () {
                        // Render
                        return Twig.parseAsync.call(template, token.output, macroContext);
                    });
                };

                return {
                    chain: chain,
                    output: ''
                };

            }
        },
        {
            /**
             * End macro logic tokens.
             *
             * Format: {% endmacro %}
             */
             type: Twig.logic.type.endmacro,
             regex: /^endmacro$/,
             next: [ ],
             open: false
        },
        {
            /*
            * import logic tokens.
            *
            * Format: {% import "template.twig" as form %}
            */
            type: Twig.logic.type.import_,
            regex: /^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    contextName = token.match[2].trim();
                delete token.match;

                token.expression = expression;
                token.contextName = contextName;

                token.stack = Twig.expression.compile.call(this, {
                    type: Twig.expression.type.expression,
                    value: expression
                }).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var that = this,
                    output = { chain: chain, output: '' };

                if (token.expression === '_self') {
                    context[token.contextName] = this.macros;
                    return Twig.Promise.resolve(output);
                }

                return Twig.expression.parseAsync.call(this, token.stack, context)
                .then(function(file) {
                    return that.importFile(file || token.expression);
                })
                .then(function(template) {
                    context[token.contextName] = template.renderAsync({}, {output: 'macros'});

                    return output;
                });
            }
        },
        {
            /*
            * from logic tokens.
            *
            * Format: {% from "template.twig" import func as form %}
            */
            type: Twig.logic.type.from,
            regex: /^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,
            next: [ ],
            open: true,
            compile: function (token) {
                var expression = token.match[1].trim(),
                    macroExpressions = token.match[2].trim().split(/\s*,\s*/),
                    macroNames = {};

                for (var i=0; i<macroExpressions.length; i++) {
                    var res = macroExpressions[i];

                    // match function as variable
                    var macroMatch = res.match(/^([a-zA-Z0-9_]+)\s+as\s+([a-zA-Z0-9_]+)$/);
                    if (macroMatch) {
                        macroNames[macroMatch[1].trim()] = macroMatch[2].trim();
                    }
                    else if (res.match(/^([a-zA-Z0-9_]+)$/)) {
                        macroNames[res] = res;
                    }
                    else {
                        // ignore import
                    }

                }

                delete token.match;

                token.expression = expression;
                token.macroNames = macroNames;

                token.stack = Twig.expression.compile.call(this, {
                    type: Twig.expression.type.expression,
                    value: expression
                }).stack;

                return token;
            },
            parse: function (token, context, chain) {
                var that = this,
                    promise = Twig.Promise.resolve(this.macros);

                if (token.expression !== "_self") {
                    promise = Twig.expression.parseAsync.call(this, token.stack, context)
                    .then(function(file) {
                        return that.importFile(file || token.expression);
                    })
                    .then(function(template) {
                        return template.renderAsync({}, {output: 'macros'});
                    });
                }

                return promise
                .then(function(macros) {
                    for (var macroName in token.macroNames) {
                        if (macros.hasOwnProperty(macroName)) {
                            context[token.macroNames[macroName]] = macros[macroName];
                        }
                    }

                    return {
                        chain: chain,
                        output: ''
                    }
                });
            }
        },
        {
            /**
             * The embed tag combines the behaviour of include and extends.
             * It allows you to include another template's contents, just like include does.
             *
             *  Format: {% embed "template.twig" [with {some: 'values'} only] %}
             */
            type: Twig.logic.type.embed,
            regex: /^embed\s+(.+?)(?:\s+(ignore missing))?(?:\s+with\s+([\S\s]+?))?(?:\s+(only))?$/,
            next: [
                Twig.logic.type.endembed
            ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    expression = match[1].trim(),
                    ignoreMissing = match[2] !== undefined,
                    withContext = match[3],
                    only = ((match[4] !== undefined) && match[4].length);

                delete token.match;

                token.only = only;
                token.ignoreMissing = ignoreMissing;

                token.stack = Twig.expression.compile.call(this, {
                    type:  Twig.expression.type.expression,
                    value: expression
                }).stack;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.call(this, {
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }).stack;
                }

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var innerContext = {},
                    that = this,
                    i,
                    template,
                    promise = Twig.Promise.resolve();

                if (!token.only) {
                    for (i in context) {
                        if (context.hasOwnProperty(i))
                            innerContext[i] = context[i];
                    }
                }

                if (token.withStack !== undefined) {
                    promise = Twig.expression.parseAsync.call(this, token.withStack, context)
                    .then(function(withContext) {
                        for (i in withContext) {
                            if (withContext.hasOwnProperty(i))
                                innerContext[i] = withContext[i];
                        }
                    });
                }

                return promise.then(function() {
                    // Allow this function to be cleaned up early
                    promise = null;
                    return Twig.expression.parseAsync.call(that, token.stack, innerContext);
                })
                .then(function(file) {
                    if (file instanceof Twig.Template) {
                        template = file;
                    } else {
                        // Import file
                        try {
                            template = that.importFile(file);
                        } catch (err) {
                            if (token.ignoreMissing) {
                                return '';
                            }

                            // Errors preserve references to variables in scope,
                            // this removes `this` from the scope.
                            that = null;

                            throw err;
                        }
                    }

                    // store previous blocks
                    that._blocks = Twig.lib.copy(that.blocks);
                    // reset previous blocks
                    that.blocks = {};

                    // parse tokens. output will be not used
                    return Twig.parseAsync.call(that, token.output, innerContext)
                    .then(function() {
                        // render tempalte with blocks defined in embed block
                        return template.renderAsync(innerContext, {'blocks': that.blocks});
                    });
                })
                .then(function(output) {
                    // restore previous blocks
                    that.blocks = Twig.lib.copy(that._blocks);
                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },
        /* Add the {% endembed %} token
         *
         */
        {
            type: Twig.logic.type.endembed,
            regex: /^endembed$/,
            next: [ ],
            open: false
        },
        {
            /**
             * Block logic tokens.
             *
             *  Format: {% with {some: 'values'} [only] %}
             */
            type: Twig.logic.type['with'],
            regex: /^(?:with\s+([\S\s]+?))(?:\s|$)(only)?$/,
            next: [
                Twig.logic.type.endwith
            ],
            open: true,
            compile: function (token) {
                var match = token.match,
                    withContext = match[1],
                    only = ((match[2] !== undefined) && match[2].length);

                delete token.match;

                token.only = only;

                if (withContext !== undefined) {
                    token.withStack = Twig.expression.compile.call(this, {
                        type:  Twig.expression.type.expression,
                        value: withContext.trim()
                    }).stack;
                }

                return token;
            },
            parse: function (token, context, chain) {
                // Resolve filename
                var innerContext = {},
                    i,
                    that = this,
                    promise = Twig.Promise.resolve();

                if (!token.only) {
                    innerContext = Twig.ChildContext(context);
                }

                if (token.withStack !== undefined) {
                    promise = Twig.expression.parseAsync.call(this, token.withStack, context)
                    .then(function(withContext) {
                        for (i in withContext) {
                            if (withContext.hasOwnProperty(i))
                                innerContext[i] = withContext[i];
                        }
                    });
                }

                return promise
                .then(function() {
                    return Twig.parseAsync.call(that, token.output, innerContext);
                })
                .then(function(output) {
                    return {
                        chain: chain,
                        output: output
                    };
                });
            }
        },
        {
            type: Twig.logic.type.endwith,
            regex: /^endwith$/,
            next: [ ],
            open: false
        }

    ];


    /**
     * Registry for logic handlers.
     */
    Twig.logic.handler = {};

    /**
     * Define a new token type, available at Twig.logic.type.{type}
     */
    Twig.logic.extendType = function (type, value) {
        value = value || ("Twig.logic.type" + type);
        Twig.logic.type[type] = value;
    };

    /**
     * Extend the logic parsing functionality with a new token definition.
     *
     * // Define a new tag
     * Twig.logic.extend({
     *     type: Twig.logic.type.{type},
     *     // The pattern to match for this token
     *     regex: ...,
     *     // What token types can follow this token, leave blank if any.
     *     next: [ ... ]
     *     // Create and return compiled version of the token
     *     compile: function(token) { ... }
     *     // Parse the compiled token with the context provided by the render call
     *     //   and whether this token chain is complete.
     *     parse: function(token, context, chain) { ... }
     * });
     *
     * @param {Object} definition The new logic expression.
     */
    Twig.logic.extend = function (definition) {

        if (!definition.type) {
            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
        } else {
            Twig.logic.extendType(definition.type);
        }
        Twig.logic.handler[definition.type] = definition;
    };

    // Extend with built-in expressions
    while (Twig.logic.definitions.length > 0) {
        Twig.logic.extend(Twig.logic.definitions.shift());
    }

    /**
     * Compile a logic token into an object ready for parsing.
     *
     * @param {Object} raw_token An uncompiled logic token.
     *
     * @return {Object} A compiled logic token, ready for parsing.
     */
    Twig.logic.compile = function (raw_token) {
        var expression = raw_token.value.trim(),
            token = Twig.logic.tokenize.call(this, expression),
            token_template = Twig.logic.handler[token.type];

        // Check if the token needs compiling
        if (token_template.compile) {
            token = token_template.compile.call(this, token);
            Twig.log.trace("Twig.logic.compile: ", "Compiled logic token to ", token);
        }

        return token;
    };

    /**
     * Tokenize logic expressions. This function matches token expressions against regular
     * expressions provided in token definitions provided with Twig.logic.extend.
     *
     * @param {string} expression the logic token expression to tokenize
     *                (i.e. what's between {% and %})
     *
     * @return {Object} The matched token with type set to the token type and match to the regex match.
     */
    Twig.logic.tokenize = function (expression) {
        var token_template_type = null,
            token_type = null,
            token_regex = null,
            regex_array = null,
            regex_len = null,
            regex_i = null,
            regex = null,
            match = null;

        // Ignore whitespace around expressions.
        expression = expression.trim();

        for (token_template_type in Twig.logic.handler) {
            // Get the type and regex for this template type
            token_type = Twig.logic.handler[token_template_type].type;
            token_regex = Twig.logic.handler[token_template_type].regex;

            // Handle multiple regular expressions per type.
            regex_array = token_regex;
            if (!Twig.lib.isArray(token_regex))
                regex_array = [token_regex];

            regex_len = regex_array.length;
            // Check regular expressions in the order they were specified in the definition.
            for (regex_i = 0; regex_i < regex_len; regex_i++) {
                match = regex_array[regex_i].exec(expression);
                if (match !== null) {
                    Twig.log.trace("Twig.logic.tokenize: ", "Matched a ", token_type, " regular expression of ", match);
                    return {
                        type: token_type,
                        match: match
                    };
                }
            }
        }

        // No regex matches
        throw new Twig.Error("Unable to parse '" + expression.trim() + "'");
    };

    /**
     * Parse a logic token within a given context.
     *
     * What are logic chains?
     *      Logic chains represent a series of tokens that are connected,
     *          for example:
     *          {% if ... %} {% else %} {% endif %}
     *
     *      The chain parameter is used to signify if a chain is open of closed.
     *      open:
     *          More tokens in this chain should be parsed.
     *      closed:
     *          This token chain has completed parsing and any additional
     *          tokens (else, elseif, etc...) should be ignored.
     *
     * @param {Object} token The compiled token.
     * @param {Object} context The render context.
     * @param {boolean} chain Is this an open logic chain. If false, that means a
     *                        chain is closed and no further cases should be parsed.
     */
    Twig.logic.parse = function (token, context, chain, allow_async) {
        return Twig.async.potentiallyAsync(this, allow_async, function() {
            Twig.log.debug("Twig.logic.parse: ", "Parsing logic token ", token);

            var token_template = Twig.logic.handler[token.type],
                result,
                that = this;


            if (!token_template.parse)
                return '';

            that.parseStack.unshift(token);
            result = token_template.parse.call(that, token, context || {}, chain);

            if (Twig.isPromise(result)) {
                result = result.then(function (result) {
                    that.parseStack.shift();

                    return result;
                })
            } else {
                that.parseStack.shift();
            }

            return result;
        });
    };

    return Twig;

};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerParser('source', function(params) {
        return params.data || '';
    });
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function(Twig) {
    'use strict';

    Twig.Templates.registerParser('twig', function(params) {
        return new Twig.Template(params);
    });
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// ## twig.path.js
//
// This file handles path parsing
module.exports = function (Twig) {
    "use strict";

    /**
     * Namespace for path handling.
     */
    Twig.path = {};

    /**
     * Generate the canonical version of a url based on the given base path and file path and in
     * the previously registered namespaces.
     *
     * @param  {string} template The Twig Template
     * @param  {string} _file    The file path, may be relative and may contain namespaces.
     *
     * @return {string}          The canonical version of the path
     */
    Twig.path.parsePath = function (template, _file) {
        var k = null,
            namespaces = template.options.namespaces,
            file = _file || "",
            hasNamespaces = namespaces && typeof namespaces === "object";

        if (hasNamespaces) {
            for (k in namespaces) {
                if (file.indexOf(k) === -1) {
                    continue
                }

                // check if keyed namespace exists at path's start
                var colon = new RegExp("^" + k + "::");
                var atSign = new RegExp("^@" + k + "/");
                // add slash to the end of path
                var namespacePath = namespaces[k].replace(/([^\/])$/, "$1/");

                if (colon.test(file)) {
                    file = file.replace(colon, namespacePath);
                    return file;
                } else if (atSign.test(file)) {
                    file = file.replace(atSign, namespacePath);
                    return file;
                }
            }
        }

        return Twig.path.relativePath(template, file);
    };

    /**
     * Generate the relative canonical version of a url based on the given base path and file path.
     *
     * @param {Twig.Template} template The Twig.Template.
     * @param {string} _file The file path, relative to the base path.
     *
     * @return {string} The canonical version of the path.
     */
    Twig.path.relativePath = function (template, _file) {
        var base,
            base_path,
            sep_chr = "/",
            new_path = [],
            file = _file || "",
            val;

        if (template.url) {
            if (typeof template.base !== "undefined") {
                // add slash to the end of path
                base = template.base.replace(/([^\/])$/, "$1/");
            } else {
                base = template.url;
            }
        } else if (template.path) {
            // Get the system-specific path separator
            var path = __webpack_require__(1),
                sep = path.sep || sep_chr,
                relative = new RegExp("^\\.{1,2}" + sep.replace("\\", "\\\\"));
            file = file.replace(/\//g, sep);

            if (template.base !== undefined && file.match(relative) == null) {
                file = file.replace(template.base, "");
                base = template.base + sep;
            } else {
                base = path.normalize(template.path);
            }

            base = base.replace(sep + sep, sep);
            sep_chr = sep;
        } else if ((template.name || template.id) && template.method && template.method !== "fs" && template.method !== "ajax") {
            // Custom registered loader
            base = template.base || template.name || template.id;
        } else {
            throw new Twig.Error("Cannot extend an inline template.");
        }

        base_path = base.split(sep_chr);

        // Remove file from url
        base_path.pop();
        base_path = base_path.concat(file.split(sep_chr));

        while (base_path.length > 0) {
            val = base_path.shift();
            if (val === ".") {
                // Ignore
            } else if (val === ".." && new_path.length > 0 && new_path[new_path.length - 1] !== "..") {
                new_path.pop();
            } else {
                new_path.push(val);
            }
        }

        return new_path.join(sep_chr);
    };

    return Twig;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

// ## twig.tests.js
//
// This file handles expression tests. (is empty, is not defined, etc...)
module.exports = function (Twig) {
    "use strict";
    Twig.tests = {
        empty: function(value) {
            if (value === null || value === undefined) return true;
            // Handler numbers
            if (typeof value === "number") return false; // numbers are never "empty"
            // Handle strings and arrays
            if (value.length && value.length > 0) return false;
            // Handle objects
            for (var key in value) {
                if (value.hasOwnProperty(key)) return false;
            }
            return true;
        },
        odd: function(value) {
            return value % 2 === 1;
        },
        even: function(value) {
            return value % 2 === 0;
        },
        divisibleby: function(value, params) {
            return value % params[0] === 0;
        },
        defined: function(value) {
            return value !== undefined;
        },
        none: function(value) {
            return value === null;
        },
        'null': function(value) {
            return this.none(value); // Alias of none
        },
        'same as': function(value, params) {
            return value === params[0];
        },
        sameas: function(value, params) {
            console.warn('`sameas` is deprecated use `same as`');
            return Twig.tests['same as'](value, params);
        },
        iterable: function(value) {
            return value && (Twig.lib.is("Array", value) || Twig.lib.is("Object", value));
        }
        /*
        constant ?
         */
    };

    Twig.test = function(test, value, params) {
        if (!Twig.tests[test]) {
            throw "Test " + test + " is not defined.";
        }
        return Twig.tests[test](value, params);
    };

    Twig.test.extend = function(test, definition) {
        Twig.tests[test] = definition;
    };

    return Twig;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

// ## twig.async.js
//
// This file handles asynchronous tasks within twig.
module.exports = function (Twig) {
    "use strict";

    var STATE_UNKNOWN = 0;
    var STATE_RESOLVED = 1;
    var STATE_REJECTED = 2;

    Twig.parseAsync = function (tokens, context) {
        return Twig.parse.call(this, tokens, context, true);
    }

    Twig.expression.parseAsync = function (tokens, context, tokens_are_parameters) {
        return Twig.expression.parse.call(this, tokens, context, tokens_are_parameters, true);
    }

    Twig.logic.parseAsync = function (token, context, chain) {
        return Twig.logic.parse.call(this, token, context, chain, true);
    }

    Twig.Template.prototype.renderAsync = function (context, params) {
        return this.render(context, params, true);
    }

    Twig.async = {};

    /**
     * Checks for `thenable` objects
     */
    Twig.isPromise = function(obj) {
        return obj && obj.then && (typeof obj.then == 'function');
    }

    /**
     * Handling of code paths that might either return a promise
     * or a value depending on whether async code is used.
     *
     * @see https://github.com/twigjs/twig.js/blob/master/ASYNC.md#detecting-asynchronous-behaviour
     */
    function potentiallyAsyncSlow(that, allow_async, action) {
        var result = action.call(that),
            err = null,
            is_async = true;

        if (!Twig.isPromise(result))
            return result;

        result.then(function(res) {
            result = res;
            is_async = false;
        })
        .catch(function(e) {
            err = e;
        });

        if (err !== null)
            throw err;

        if (is_async)
            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

        return result;
    }

    Twig.async.potentiallyAsync = function potentiallyAsync(that, allow_async, action) {
        if (allow_async)
            return Twig.Promise.resolve(action.call(that));

        return potentiallyAsyncSlow(that, allow_async, action);
    }

    function run(fn, resolve, reject) {
        try { fn(resolve, reject); }
        catch(e) { reject(e); }
    }

    function pending(handlers, onResolved, onRejected) {
        var h = [ onResolved, onRejected, -2 ];

        // The promise has yet to be rejected or resolved.
        if (!handlers)
            handlers = h;
        // Only allocate an array when there are multiple handlers
        else if (handlers[2] == -2)
            handlers = [ handlers, h ];
        else
            handlers.push(h);

        return handlers;
    }

    /**
     * Really small thenable to represent promises that resolve immediately.
     *
     */
    Twig.Thenable = function(then, value, state) {
        this.then = then;
        this._value = state ? value : null;
        this._state = state || STATE_UNKNOWN;
    }

    Twig.Thenable.prototype.catch = function thenableCatch(onRejected) {
        // THe promise will not throw, it has already resolved.
        if (this._state == STATE_RESOLVED)
            return this;

        return this.then(null, onRejected);
    }

    /**
     * The `then` method attached to a Thenable when it has resolved.
     *
     */
    Twig.Thenable.resolvedThen = function resolvedThen(onResolved) {
        try { return Twig.Promise.resolve(onResolved(this._value)); }
        catch(e) { return Twig.Promise.reject(e); }
    }

    /**
     * The `then` method attached to a Thenable when it has rejected.
     *
     */
    Twig.Thenable.rejectedThen = function rejectedThen(onResolved, onRejected) {
        // Shortcut for rejected twig promises
        if (!onRejected || typeof onRejected != 'function')
            return this;

        var value = this._value;
        var result = Twig.attempt(function() {
            return onRejected(value);
        }, Twig.Promise.reject);

        return Twig.Promise.resolve(result);
    }

    /**
     * An alternate implementation of a Promise that does not fully follow
     * the spec, but instead works fully synchronous while still being
     * thenable.
     *
     * These promises can be mixed with regular promises at which point
     * the synchronous behaviour is lost.
     */
    Twig.Promise = function(executor) {
        var state = STATE_UNKNOWN;
        var value = null;

        var changeState = function(nextState, nextValue) {
            state = nextState;
            value = nextValue;
        }

        function onReady(v) {
            changeState(STATE_RESOLVED, v);
        }

        function onReject(e) {
            changeState(STATE_REJECTED, e);
        }

        run(executor, onReady, onReject);

        // If the promise settles right after running the executor we can
        // return a Promise with it's state already set.
        //
        // Twig.Promise.resolve and Twig.Promise.reject both use the more
        // efficient `Twig.Thenable` for this purpose.
        if (state === STATE_RESOLVED)
            return Twig.Promise.resolve(value);

        if (state === STATE_REJECTED)
            return Twig.Promise.reject(value);

        // If we managed to get here our promise is going to resolve asynchronous.
        changeState = Twig.FullPromise();

        return changeState.promise;
    }

    /**
     * Promise implementation that can handle being resolved at any later time.
     *
     */
    Twig.FullPromise = function() {
        var handlers = null;

        // The state has been changed to either resolve, or reject
        // which means we should call the handler.
        function resolved(onResolved) {
            onResolved(p._value);
        };
        function rejected(onResolved, onRejected) {
            onRejected(p._value);
        };

        var append = function unknown(onResolved, onRejected) {
            handlers = pending(handlers, onResolved, onRejected);
        };

        function changeState(newState, v) {
            if (p._state) return;

            p._value = v;
            p._state = newState;

            append = newState == STATE_RESOLVED ? resolved : rejected;

            if (!handlers) return;

            if (handlers[2] === -2) {
                append(handlers[0], handlers[1]);
                handlers = null;
            }

            Twig.forEach(handlers, function changeStateLoop(h) {
                append(h[0], h[1]);
            });
            handlers = null;
        }

        var p = new Twig.Thenable(function then(onResolved, onRejected) {
            var hasResolved = typeof onResolved == 'function';

            // Shortcut for resolved twig promises
            if (p._state == STATE_RESOLVED && !hasResolved) {
                return Twig.Promise.resolve(p._value);
            } else if (p._state === STATE_RESOLVED) {
                return Twig.attempt(function() {
                    return Twig.Promise.resolve(onResolved(p._value));
                }, Twig.Promise.reject);
            }

            var hasRejected = typeof onRejected == 'function';
            return Twig.Promise(function thenExecutor(resolve, reject) {
                append(
                    hasResolved ? function thenResolve(result) {
                        Twig.attempt(function thenAttemptResolve() {
                            resolve(onResolved(result));
                        }, reject);
                    } : resolve,
                    hasRejected ? function thenReject(err) {
                        Twig.attempt(function thenAttemptReject() {
                            resolve(onRejected(err));
                        }, reject);
                    } : reject
                );
            });
        });

        changeState.promise = p;

        return changeState;
    }

    Twig.Promise.defaultResolved = new Twig.Thenable(Twig.Thenable.resolvedThen, undefined, STATE_RESOLVED);
    Twig.Promise.emptyStringResolved = new Twig.Thenable(Twig.Thenable.resolvedThen, '', STATE_RESOLVED);

    Twig.Promise.resolve = function promiseResolve(value) {
        if (arguments.length < 1 || typeof value === 'undefined')
            return Twig.Promise.defaultResolved;

        if (Twig.isPromise(value))
            return value;

        // Twig often resolves with an empty string, we optimize for this
        // scenario by returning a fixed promise. This reduces the load on
        // garbage collection.
        if (value === '')
            return Twig.Promise.emptyStringResolved;

        return new Twig.Thenable(Twig.Thenable.resolvedThen, value, STATE_RESOLVED);
    };

    Twig.Promise.reject = function(e) {
        // `e` should never be a promise.
        return new Twig.Thenable(Twig.Thenable.rejectedThen, e, STATE_REJECTED);
    };

    Twig.Promise.all = function TwigPromiseAll(promises) {
        var results = new Array(promises.length);

        return Twig.async.forEach(promises, function promiseAllCb(p, index) {
            if (!Twig.isPromise(p)) {
                results[index] = p;
                return;
            }

            if (p._state == STATE_RESOLVED) {
                results[index] = p._value;
                return;
            }

            return p.then(function promiseAllThen(v) {
                results[index] = v;
            });
        })
        .then(function promiseAllResults() {
            return results;
        });
    };

    /**
    * Go over each item in a fashion compatible with Twig.forEach,
    * allow the function to return a promise or call the third argument
    * to signal it is finished.
    *
    * Each item in the array will be called sequentially.
    */
    Twig.async.forEach = function forEachAsync(arr, callback) {
        var len = arr.length;
        var index = 0;

        function next() {
            var resp = null;

            do {
                if (index == len)
                    return Twig.Promise.resolve();

                resp = callback(arr[index], index);
                index++;

            // While the result of the callback is not a promise or it is
            // a promise that has settled we can use a regular loop which
            // is much faster.
            } while(!resp || !Twig.isPromise(resp) || resp._state == STATE_RESOLVED);

            return resp.then(next);
        }

        return next();
    };

    return Twig;

};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// ## twig.exports.js
//
// This file provides extension points and other hooks into the twig functionality.

module.exports = function (Twig) {
    "use strict";
    Twig.exports = {
        VERSION: Twig.VERSION
    };

    /**
     * Create and compile a twig.js template.
     *
     * @param {Object} param Paramteres for creating a Twig template.
     *
     * @return {Twig.Template} A Twig template ready for rendering.
     */
    Twig.exports.twig = function twig(params) {
        'use strict';
        var id = params.id,
            options = {
                strict_variables: params.strict_variables || false,
                // TODO: turn autoscape on in the next major version
                autoescape: params.autoescape != null && params.autoescape || false,
                allowInlineIncludes: params.allowInlineIncludes || false,
                rethrow: params.rethrow || false,
                namespaces: params.namespaces
            };

        if (Twig.cache && id) {
            Twig.validateId(id);
        }

        if (params.debug !== undefined) {
            Twig.debug = params.debug;
        }
        if (params.trace !== undefined) {
            Twig.trace = params.trace;
        }

        if (params.data !== undefined) {
            return Twig.Templates.parsers.twig({
                data: params.data,
                path: params.hasOwnProperty('path') ? params.path : undefined,
                module: params.module,
                id:   id,
                options: options
            });

        } else if (params.ref !== undefined) {
            if (params.id !== undefined) {
                throw new Twig.Error("Both ref and id cannot be set on a twig.js template.");
            }
            return Twig.Templates.load(params.ref);

        } else if (params.method !== undefined) {
            if (!Twig.Templates.isRegisteredLoader(params.method)) {
                throw new Twig.Error('Loader for "' + params.method + '" is not defined.');
            }
            return Twig.Templates.loadRemote(params.name || params.href || params.path || id || undefined, {
                id: id,
                method: params.method,
                parser: params.parser || 'twig',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);

        } else if (params.href !== undefined) {
            return Twig.Templates.loadRemote(params.href, {
                id: id,
                method: 'ajax',
                parser: params.parser || 'twig',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);

        } else if (params.path !== undefined) {
            return Twig.Templates.loadRemote(params.path, {
                id: id,
                method: 'fs',
                parser: params.parser || 'twig',
                base: params.base,
                module: params.module,
                precompiled: params.precompiled,
                async: params.async,
                options: options

            }, params.load, params.error);
        }
    };

    // Extend Twig with a new filter.
    Twig.exports.extendFilter = function(filter, definition) {
        Twig.filter.extend(filter, definition);
    };

    // Extend Twig with a new function.
    Twig.exports.extendFunction = function(fn, definition) {
        Twig._function.extend(fn, definition);
    };

    // Extend Twig with a new test.
    Twig.exports.extendTest = function(test, definition) {
        Twig.test.extend(test, definition);
    };

    // Extend Twig with a new definition.
    Twig.exports.extendTag = function(definition) {
        Twig.logic.extend(definition);
    };

    // Provide an environment for extending Twig core.
    // Calls fn with the internal Twig object.
    Twig.exports.extend = function(fn) {
        fn(Twig);
    };


    /**
     * Provide an extension for use with express 2.
     *
     * @param {string} markup The template markup.
     * @param {array} options The express options.
     *
     * @return {string} The rendered template.
     */
    Twig.exports.compile = function(markup, options) {
        var id = options.filename,
            path = options.filename,
            template;

        // Try to load the template from the cache
        template = new Twig.Template({
            data: markup,
            path: path,
            id: id,
            options: options.settings['twig options']
        }); // Twig.Templates.load(id) ||

        return function(context) {
            return template.render(context);
        };
    };

    /**
     * Provide an extension for use with express 3.
     *
     * @param {string} path The location of the template file on disk.
     * @param {Object|Function} The options or callback.
     * @param {Function} fn callback.
     *
     * @throws Twig.Error
     */
    Twig.exports.renderFile = function(path, options, fn) {
        // handle callback in options
        if (typeof options === 'function') {
            fn = options;
            options = {};
        }

        options = options || {};

        var settings = options.settings || {};

        // mixin any options provided to the express app.
        var view_options = settings['twig options'];

        var params = {
            path: path,
            base: settings.views,
            load: function(template) {
                // render and return template as a simple string, see https://github.com/twigjs/twig.js/pull/348 for more information
                if (!view_options || !view_options.allow_async) {
                    fn(null, '' + template.render(options));
                    return;
                }

                template.renderAsync(options)
                    .then(function(out) { fn(null, out); }, fn);
            }
        };

        if (view_options) {
            for (var option in view_options) {
                if (view_options.hasOwnProperty(option)) {
                    params[option] = view_options[option];
                }
            }
        }

        Twig.exports.twig(params);
    };

    // Express 3 handler
    Twig.exports.__express = Twig.exports.renderFile;

    /**
     * Shoud Twig.js cache templates.
     * Disable during development to see changes to templates without
     * reloading, and disable in production to improve performance.
     *
     * @param {boolean} cache
     */
    Twig.exports.cache = function(cache) {
        Twig.cache = cache;
    };

    //We need to export the path module so we can effectively test it
    Twig.exports.path = Twig.path;

    //Export our filters.
    //Resolves #307
    Twig.exports.filters = Twig.filters;

    Twig.exports.Promise = Twig.Promise;

    return Twig;
};


/***/ })
/******/ ]);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ 2:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[["./assets/js/twigjs.js","runtime","vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdHdpZ2pzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9kZS1saWJzLWJyb3dzZXIvbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90d2lnL3R3aWcuanMiLCJ3ZWJwYWNrOi8vL2ZzIChpZ25vcmVkKSJdLCJuYW1lcyI6WyJUd2lnIiwicmVxdWlyZSIsInR3aWciLCJfdHdpZ190bXBsIiwiX3R3aWdfdGVtcGxhdGVzIiwiX2ZuY19udWxsIiwicmVuZGVyVGVtcGxhdGUiLCJuYW1ldCIsImpzb25kYXRhIiwiY2FsbGJhY2siLCJwYXJhbSIsIm1vZGUiLCJlcnJvciIsInJqc29uIiwidW5kZWZpbmVkIiwidCIsInJlZiIsImJhc2UiLCJhdXRvZXNjYXBlIiwiaWQiLCJocmVmIiwiYXN5bmMiLCJsb2FkIiwidG1wbCIsImVyciIsIkpTT04iLCJwYXJzZSIsInRva2VucyIsInZhbHVlIiwibXNnIiwiZSIsInJlbmRlciIsInNldFRpbWVvdXQiLCJkb2N1bWVudCIsImxvY2F0aW9uIiwiZXh0ZW5kRnVuY3Rpb24iLCJ0ZW1wbGF0ZSIsInBhcmFtcyIsImh0bWwiLCJyZXBsYWNlIiwib3Blbk1vZGFsVGVtcGxhdGUiLCJ0aXRsZSIsImJvZHl0ZW1wbGF0ZSIsIiQiLCJyZW1vdmUiLCJib2R5Iiwib25jbG9zZSIsIm1vZGFsc2l6ZSIsImJ1dHRvbnMiLCJhcHBlbmQiLCJyZWFkeSIsIm1vZGFsIiwibWVzc2FnZUFsZXJ0IiwiRVJST1IiLCJnbG9iYWwiLCJmbiIsInNlcmlhbGl6ZUpTT04iLCJqc29uIiwialF1ZXJ5IiwibWFwIiwic2VyaWFsaXplQXJyYXkiLCJpIiwibiIsImNhbGxTZXJ2ZXIiLCJjb250cm9sbGVyIiwicXVlcnkiLCJ0eXBlIiwiY29udGV4dCIsImFqYXgiLCJ1cmwiLCJkYXRhIiwiZGF0YVR5cGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsImRvbmUiLCJzdGF0dXMiLCJ4aHIiLCJyIiwiY29kZSIsIk9iamVjdCIsIm9rIiwiZmFpbCIsImVycm9ydGhyb3ciLCJ3cml0ZSIsInJlc3BvbnNlVGV4dCIsIm1lc3NhZ2UiLCJ0aW1lb3V0Iiwic2hvdyIsImFsZXJ0IiwiX3RhYmxlX3NlbGVjdGlvbnNfIiwiX3RhYmxlX2Zvcm1hdHRlcnNfIiwiZ2V0SWRTZWxlY3Rpb25zIiwiYm9vdHN0cmFwVGFibGUiLCJyb3ciLCJyZWxvYWRUYWJsZSIsInRhYmxlIiwicG9zIiwidHJpZ2dlciIsImJvZHl0YWJsZSIsInBhcmVudCIsInNjcm9sbFRvcCIsImZpeG1hcmdpbnMiLCJpbmRleCIsImZpZWxkIiwid2luZG93IiwiX19zZWxlY3RfX2NvbnRlbnQiLCJyZWxvYWRTZWxlY3QiLCJpZHNlbGVjdCIsInNlbGVjdCIsInRleHQiLCJkYXRhc3RyIiwic3RyaW5naWZ5IiwiZW1wdHkiLCJhdHRyIiwiZCIsInJvd3MiLCJzZWwiLCJkaXMiLCJzZWxlY3RlZCIsImRpc2FibGVkIiwic2VsZWN0cGlja2VyIiwibWF4WkluZGV4Iiwib3B0IiwiZGVmIiwiaW5jIiwiZ3JvdXAiLCJleHRlbmQiLCJ6bWF4IiwiZWFjaCIsImN1ciIsInBhcnNlSW50IiwiY3NzIiwianF1ZXJ5IiwiSU5GTyIsIldBUk5JTkciLCJPSyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscURBQUlBLElBQUksR0FBQ0MsbUJBQU8sQ0FBQyx5Q0FBRCxDQUFoQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUNGLElBQUksQ0FBQ0UsSUFBZDs7QUFFQUQsbUJBQU8sQ0FBQyx3Q0FBRCxDQUFQOztBQUVBLElBQUlFLFVBQVUsR0FBQyxFQUFmO0FBQ0EsSUFBSUMsZUFBZSxHQUFDLEVBQXBCOztBQUVBLFNBQVNDLFNBQVQsR0FBcUIsQ0FB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Q0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMvTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7Ozs7O0FDdkx0QztBQUNBLElBQUksSUFBeUQ7QUFDN0Q7QUFDQSxNQUFNLEVBS3FCO0FBQzNCLENBQUM7QUFDRCxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsZ0NBQWdDO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxrQkFBa0I7QUFDbEY7QUFDQSx5REFBeUQsY0FBYztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxpQ0FBaUM7QUFDbEYsd0hBQXdILG1CQUFtQixFQUFFO0FBQzdJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQywwQkFBMEIsRUFBRTtBQUMvRCx5Q0FBeUMsZUFBZTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELCtEQUErRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLG9GQUFNOztBQUUvQixPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCLGVBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFnQixNQUFNO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBLGdCQUFnQixXQUFXO0FBQzNCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RUFBRTtBQUM1QjtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLG9FQUFvRSxFQUFFO0FBQzVGOztBQUVBO0FBQ0E7OztBQUdBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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TztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQSxnQkFBZ0IsTUFBTTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQixlQUFlLE9BQU87QUFDdEI7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUE7O0FBRUE7OztBQUdBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNB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YUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLG1CQUFtQixRQUFRO0FBQzNCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxLQUFJO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELEtBQUs7QUFDakUsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7OztBQUdBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZ0JBQWdCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QztBQUN4Qzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7O0FBR0Esb0dBQW9HLG1CQUFtQixF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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9EQUFvRCxHQUFHOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSSw0QkFBNEIsSUFBSSw0QkFBNEIsSUFBSSxnQkFBZ0IsSUFBSSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQy9JOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsUUFBUSxFQUFFO0FBQ3ZJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLHNDQUFzQyxFQUFFO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLFNBQVM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxLQUFLO0FBQ0w7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxLQUFLO0FBQ0w7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLOztBQUVMOzs7QUFHQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsV0FBSTs7QUFFN0IsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixVQUFVLGtDQUFrQyxXQUFXO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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O0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLG9DQUFvQztBQUNwQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMs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QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxNQUFNO0FBQ3JCO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEVBQUU7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsZ0JBQWdCO0FBQy9CLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsZUFBZSxFQUFFO0FBQzFEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0EsQ0FBQyxFOzs7Ozs7Ozs7Ozs7QUNoaVFELGUiLCJmaWxlIjoianMvdHdpZ2pzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFR3aWc9cmVxdWlyZShcInR3aWdcIik7XG52YXIgdHdpZz1Ud2lnLnR3aWc7XG5cbnJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpXG5cbnZhciBfdHdpZ190bXBsPXt9O1xudmFyIF90d2lnX3RlbXBsYXRlcz17fTtcblxuZnVuY3Rpb24gX2ZuY19udWxsKCkge31cblxuZnVuY3Rpb24gcmVuZGVyVGVtcGxhdGUobmFtZXQsanNvbmRhdGEsY2FsbGJhY2sscGFyYW0pIHtcblx0dmFyIG1vZGU9dHJ1ZTtcblx0dmFyIGVycm9yPW51bGw7XG5cblx0Ly92YXIgcmpzb249e1wiaW5mb1wiOmpzb25kYXRhfTtcblx0dmFyIHJqc29uPWpzb25kYXRhO1xuXHRpZiAoY2FsbGJhY2s9PXVuZGVmaW5lZCkge1xuXHRcdG1vZGU9ZmFsc2U7XG5cdFx0Ly8gY2FsbGJhY2s9X2ZuY19udWxsO1xuXHR9XG5cdGlmIChfdHdpZ190ZW1wbGF0ZXNbbmFtZXRdPT11bmRlZmluZWQpIHtcblx0XHR0aHJvdyBcIkxhIHBsYW50aWxsYSBcIituYW1ldCtcIiBubyBleGlzdGVcIjtcblx0fVxuXG5cdHZhciB0PXR3aWcoe3JlZjpuYW1ldH0pO1xuXHRpZiAodCE9bnVsbCkgX3R3aWdfdG1wbFtuYW1ldF09dDtcbi8qXHRpZiAoKHQhPW51bGwpJiYoX3R3aWdfdG1wbD09dW5kZWZpbmVkKSkge1xuXHRcdGFsZXJ0KG5hbWV0K1wiIFlhIGRlZmluaWRhISEhIVwiKTtcblx0XHRfdHdpZ190bXBsW25hbWV0XT10O1xuXHR9XG4qL1xuXG5cdGlmIChfdHdpZ190bXBsW25hbWV0XT09dW5kZWZpbmVkKSB7XG5cdFx0X3R3aWdfdG1wbFtuYW1ldF09dHdpZyh7XG5cdFx0XHRiYXNlOiAndGVtcGxhdGVzJyxcblx0XHRcdGF1dG9lc2NhcGU6IHRydWUsXG5cdFx0XHRpZDogbmFtZXQsXG5cdFx0XHRocmVmOiBfdHdpZ190ZW1wbGF0ZXNbbmFtZXRdLFxuXHRcdFx0YXN5bmM6IG1vZGUsXG5cdFx0XHRsb2FkOiBmdW5jdGlvbih0bXBsKSB7IFxuXHRcdFx0XHRpZiAodG1wbD09bnVsbCkge1xuXHRcdFx0XHRcdHRocm93IFwiTm8gc2UgcHVkbyBjYXJnYXIgbGEgcGxhbnRpbGxhIFwiK25hbWV0O1xuXHRcdFx0XHRcdC8vZXJyb3I9XCJObyBzZSBwdWRvIGNhcmdhciBsYSBwbGFudGlsbGEgXCIrbmFtZXQ7XG5cdFx0XHRcdH1cdGVsc2VcdHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFyIGVycj1KU09OLnBhcnNlKHRtcGwudG9rZW5zWzBdLnZhbHVlKTtcblx0XHRcdFx0XHRcdHRtcGw9bnVsbDtcblx0XHRcdFx0XHRcdC8vZXJyb3I9ZXJyLm1zZztcblx0XHRcdFx0XHRcdHRocm93IGVyci5tc2c7XG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHRfdHdpZ190bXBsW25hbWV0XT10bXBsO1xuXHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrIT11bmRlZmluZWQpIGNhbGxiYWNrKHRtcGwucmVuZGVyKHJqc29uKSxwYXJhbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFtb2RlKSB7XG5cdFx0LyppZiAoZXJyb3IhPW51bGwpIHtcblx0XHRcdC8vVHdpZy5jYWNoZSgpO1xuXHRcdFx0X3R3aWdfdG1wbFtuYW1ldF09bnVsbDtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGRvY3VtZW50LmxvY2F0aW9uPScvJzsgfSwxMDAwKTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH0qL1xuXG5cdFx0dmFyIHQ9dHdpZyh7cmVmOm5hbWV0fSk7XG5cdFx0aWYgKHQ9PW51bGwpIHtcblx0XHRcdF90d2lnX3RtcGxbbmFtZXRdPW51bGw7XG5cdFx0XHRcdC8vZGVsZXRlIF90d2lnX3RtcGxbbmFtZXRdO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHsgZG9jdW1lbnQubG9jYXRpb249Jy8nOyB9LDEwMDApO1xuXHRcdFx0dGhyb3cgXCJObyBzZSBwdWRvIGNhcmdhciBsYSBwbGFudGlsbGEgXCIrbmFtZXQ7XG5cdFx0fVxuXHRcdGVsc2UgXHRyZXR1cm4gdC5yZW5kZXIocmpzb24scGFyYW0pO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChlcnJvciE9bnVsbCkge1xuXHRcdFx0Ly9Ud2lnLmNhY2hlKCk7XG5cdFx0XHRfdHdpZ190bXBsW25hbWV0XT1udWxsO1xuXHRcdFx0XHQvL2RlbGV0ZSBfdHdpZ190bXBsW25hbWV0XTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGRvY3VtZW50LmxvY2F0aW9uPScvJzsgfSwxMDAwKTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0XHRpZiAoY2FsbGJhY2shPXVuZGVmaW5lZCkgY2FsbGJhY2soX3R3aWdfdG1wbFtuYW1ldF0ucmVuZGVyKHJqc29uKSxwYXJhbSk7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59IFxuXG5Ud2lnLmV4dGVuZEZ1bmN0aW9uKCdpbmNsdWRlJywgZnVuY3Rpb24odGVtcGxhdGUscGFyYW1zKSB7XG5cdF90d2lnX3RlbXBsYXRlc1t0ZW1wbGF0ZV09dGVtcGxhdGU7XG5cdHZhciBodG1sPXJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLHBhcmFtcyk7XG5cdHJldHVybiBodG1sLnJlcGxhY2UoL1tcXG5cXHRdL2csXCJcIik7XG59KTtcblxuXG5mdW5jdGlvbiBvcGVuTW9kYWxUZW1wbGF0ZShpZCx0aXRsZSxib2R5dGVtcGxhdGUscGFyYW1zKSB7IFxuXHR0cnkge1xuXHRcdFx0JChcIiNfbW9kYWxfXCIraWQpLnJlbW92ZSgpO1xuXHRcdFx0aWYgKHBhcmFtcz09dW5kZWZpbmVkKSBwYXJhbXM9e307XG5cdFx0XHRpZiAoKGJvZHl0ZW1wbGF0ZT09dW5kZWZpbmVkKXx8KGJvZHl0ZW1wbGF0ZT09bnVsbCl8fChib2R5dGVtcGxhdGU9PVwibnVsbFwiKSkgYm9keXRlbXBsYXRlPVwiX21vZGFsYm9keV9cIitpZDtcblx0XHRcdGlmIChwYXJhbXNbXCJidXR0b25zXCJdPT11bmRlZmluZWQpIHBhcmFtc1tcImJ1dHRvbnNcIl09W107XG5cdFx0XHR2YXIgYm9keT1yZW5kZXJUZW1wbGF0ZShib2R5dGVtcGxhdGUscGFyYW1zKTtcblx0XHRcdHZhciBodG1sPXJlbmRlclRlbXBsYXRlKFwibW9kYWxcIix7XCJpZFwiOmlkLFwidGl0bGVcIjp0aXRsZSxcIm9uY2xvc2VcIjpwYXJhbXMub25jbG9zZSxcIm1vZGFsc2l6ZVwiOnBhcmFtcy5tb2RhbHNpemUsXCJidXR0b25zXCI6cGFyYW1zLmJ1dHRvbnN9KTtcblx0XHRcdCQoXCJib2R5XCIpLmFwcGVuZChodG1sKTtcblx0XHRcdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKFwiI19tb2RhbGJvZHlfXCIraWQpLmh0bWwoYm9keSk7XG5cdFx0XHRcdCQoXCIjX21vZGFsX1wiK2lkKS5tb2RhbChcInNob3dcIik7XG5cdFx0XHR9KTtcblx0fSBjYXRjaChlcnJvcikge1xuXHRcdG1lc3NhZ2VBbGVydChlcnJvcixFUlJPUik7XG5cdH1cbn1cblxuZ2xvYmFsLnJlbmRlclRlbXBsYXRlID0gcmVuZGVyVGVtcGxhdGU7XG5nbG9iYWwub3Blbk1vZGFsVGVtcGxhdGUgPSBvcGVuTW9kYWxUZW1wbGF0ZTtcbmdsb2JhbC5fdHdpZ190ZW1wbGF0ZXM9IF90d2lnX3RlbXBsYXRlcztcbmdsb2JhbC5vcGVuTW9kYWxUZW1wbGF0ZT0gb3Blbk1vZGFsVGVtcGxhdGU7XG4iLCIoZnVuY3Rpb24oICQgKXtcbiQuZm4uc2VyaWFsaXplSlNPTj1mdW5jdGlvbigpIHtcbiAgICB2YXIganNvbiA9IHt9O1xuICAgIGpRdWVyeS5tYXAoJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpLCBmdW5jdGlvbihpLCBuKXtcbiAgICAgICAganNvbltpWyduYW1lJ11dID0gaVsndmFsdWUnXTtcbiAgICB9KTtcbiAgICByZXR1cm4ganNvbjtcbn07XG59KSggalF1ZXJ5ICk7XG5cbmZ1bmN0aW9uIGNhbGxTZXJ2ZXIoY29udHJvbGxlcixxdWVyeSxjYWxsYmFjayxwYXJhbXMsdHlwZSxjb250ZXh0KSB7XG5cdGlmICgocXVlcnk9PT1udWxsKXx8KHF1ZXJ5PT1cIm51bGxcIikpIHF1ZXJ5PVwiaXNhamF4PXRydWVcIjtcblx0ZWxzZSBxdWVyeSs9XCImaXNhamF4PXRydWVcIjtcblxuXHQkLmFqYXgoe1xuXHRcdHVybDogY29udHJvbGxlcixcblx0XHRjb250ZXh0OiBjb250ZXh0LFxuXHRcdGRhdGE6IHF1ZXJ5LFxuXHRcdGRhdGFUeXBlOiB0eXBlLFxuXHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0Y29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLThcIixcblx0fSkuZG9uZShmdW5jdGlvbiAoZGF0YSxzdGF0dXMseGhyKSB7IFxuXHRcdGlmICh0eXBlPT0naHRtbCcpIHsgXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YXIgcj1KU09OLnBhcnNlKGRhdGEpOyBcblx0XHRcdFx0bWVzc2FnZUFsZXJ0KFwiRVJST1I6IFwiK2RhdGEubXNnLEVSUk9SKTtcblx0XHRcdFx0aWYgKGRhdGEuY29kZT09LTEpIGRvY3VtZW50LmxvY2F0aW9uPVwiL1wiO1xuXHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEscGFyYW1zLGNvbnRleHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoKCFkYXRhIGluc3RhbmNlb2YgT2JqZWN0KSB8fCAoZGF0YS5vayE9PXVuZGVmaW5lZCAmJiBkYXRhLm9rIT09dHJ1ZSkpIHtcblx0XHRcdFx0bWVzc2FnZUFsZXJ0KFwiRVJST1I6IFwiK2RhdGEubXNnLEVSUk9SKTtcblx0XHRcdFx0aWYgKGRhdGEuY29kZT09LTEpIGRvY3VtZW50LmxvY2F0aW9uPVwiL1wiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmICgoY2FsbGJhY2shPT11bmRlZmluZWQpICYmIChjYWxsYmFjayE9XCJcIikgJiYgKGNhbGxiYWNrIT1udWxsKSkgY2FsbGJhY2soZGF0YSxwYXJhbXMsY29udGV4dCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KS5mYWlsKGZ1bmN0aW9uICh4aHIsc3RhdHVzLGVycm9ydGhyb3cpIHsgXG5cdFx0XHRkb2N1bWVudC53cml0ZSh4aHIucmVzcG9uc2VUZXh0KTtcblx0XHRcdC8vbWVzc2FnZUFsZXJ0KFwiRVJST1I6IFwiK3hoci5yZXNwb25zZVRleHQsRVJST1IpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbWVzc2FnZUFsZXJ0KG1lc3NhZ2UsdHlwZSx0aW1lb3V0KSB7XG5cdCQoXCIjYWxlcnRzXCIpLmh0bWwoXCI8ZGl2IGlkPSdhbGVydGJvZHknIGNsYXNzPSdhbGVydCBcIit0eXBlK1wiIGFsZXJ0LWRpc21pc3NpYmxlIGZhZGUgc2hvdycgcm9sZT0nYWxlcnQnPlwiK21lc3NhZ2UrXG5cdFx0XHRcdFx0XHRcdFwiPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdhbGVydCcgYXJpYS1sYWJlbD0nUGVjaGFyJz48c3BhbiBhcmlhLWhpZGRlbj0ndHJ1ZSc+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cIitcblx0XHRcdFx0XHRcdFx0XCI8L2Rpdj5cIikuc2hvdygpO1xuXHRpZiAodGltZW91dCE9PXVuZGVmaW5lZCkge1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgJChcIiNhbGVydGJvZHlcIikuYWxlcnQoXCJjbG9zZVwiKTsgfSwgdGltZW91dCk7XG5cdH1cbn1cblxuLy8tLS0tLS0tICBUYWJsZVxudmFyIF90YWJsZV9zZWxlY3Rpb25zXz17fTtcbnZhciBfdGFibGVfZm9ybWF0dGVyc189e307XG5cbmZ1bmN0aW9uIGdldElkU2VsZWN0aW9ucyhpZCkge1xuXHRyZXR1cm4gJC5tYXAoJChcIiNcIitpZCkuYm9vdHN0cmFwVGFibGUoJ2dldFNlbGVjdGlvbnMnKSwgZnVuY3Rpb24gKHJvdykge1xuXHRcdHJldHVybiByb3cuaWRcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlbG9hZFRhYmxlKGRhdGEsaWQpIHtcblx0dmFyIHRhYmxlPSQoXCIjXCIraWQpO1xuXHR2YXIgcG9zPXRhYmxlLmJvb3RzdHJhcFRhYmxlKFwiZ2V0U2Nyb2xsUG9zaXRpb25cIik7XG5cdHRhYmxlLmJvb3RzdHJhcFRhYmxlKFwibG9hZFwiLGRhdGEpO1xuXHR0YWJsZS50cmlnZ2VyKFwibG9hZC1zdWNjZXNzLmJzLnRhYmxlXCIsZGF0YSk7XG5cdHRhYmxlLnRyaWdnZXIoXCJ1bmNoZWNrLWFsbC5icy50YWJsZVwiKTtcblx0dmFyIGJvZHl0YWJsZT10YWJsZS5wYXJlbnQoKTtcblx0Ym9keXRhYmxlLnNjcm9sbFRvcChwb3MpO1xufVxuXG5mdW5jdGlvbiBmaXhtYXJnaW5zKGlkLHZhbHVlLHJvdyxpbmRleCxmaWVsZCkgeyBcblx0aWYgKChfdGFibGVfZm9ybWF0dGVyc19baWRdIT09dW5kZWZpbmVkKSAmJiAoX3RhYmxlX2Zvcm1hdHRlcnNfW2lkXVtmaWVsZF0hPT11bmRlZmluZWQpKSB7XG5cdFx0cmV0dXJuIHdpbmRvd1tfdGFibGVfZm9ybWF0dGVyc19baWRdW2ZpZWxkXV0odmFsdWUscm93LGluZGV4LGZpZWxkKTtcblx0fVxuXHRyZXR1cm4gJzxzcGFuIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDhweFwiPicrdmFsdWUrJzwvc3Bhbj4nO1xufVxuXG4vLy0tLS0tLSAgU2VsZWN0XG4vL1xuXG52YXIgIF9fc2VsZWN0X19jb250ZW50PXt9O1xuXG5mdW5jdGlvbiByZWxvYWRTZWxlY3QoaWRzZWxlY3QsZGF0YSkge1xuXHR2YXIgc2VsZWN0PSQoXCIjXCIraWRzZWxlY3QpO1xuXHR2YXIgdmFsdWU9c2VsZWN0LmRhdGEoXCJ2YWx1ZVwiKTtcblx0dmFyIHRleHQ9c2VsZWN0LmRhdGEoXCJ0ZXh0XCIpO1xuXHR2YXIgZGF0YXN0cj1KU09OLnN0cmluZ2lmeShkYXRhKTtcblxuXHRzZWxlY3QuZW1wdHkoKTtcblx0c2VsZWN0LmRhdGEoXCJkYXRhXCIsZGF0YXN0cik7XG5cdHNlbGVjdC5hdHRyKFwiZGF0YS1kYXRhXCIsZGF0YXN0cik7XG5cdGZvcih2YXIgZCBpbiBkYXRhLnJvd3MpIHtcblx0XHR2YXIgc2VsPVwiXCI7XG5cdFx0dmFyIGRpcz1cIlwiO1xuXHRcdGlmICgoZGF0YS5yb3dzW2RdLnNlbGVjdGVkICE9IHVuZGVmaW5lZCkgJiYgKGRhdGEucm93c1tkXS5zZWxlY3RlZD09XCJ0cnVlXCIpKSBzZWw9XCJzZWxlY3RlZFwiO1xuXHRcdGlmICgoZGF0YS5yb3dzW2RdLmRpc2FibGVkICE9IHVuZGVmaW5lZCkgJiYgKGRhdGEucm93c1tkXS5kaXNhYmxlZD09XCJ0cnVlXCIpKSBkaXM9XCJkaXNhYmxlZFwiO1xuXHRcdHNlbGVjdC5hcHBlbmQoJzxvcHRpb24gZGF0YS1pbmRleD1cIicrZGF0YS5yb3dzW2RdLmlkKydcIiB2YWx1ZT1cIicrZGF0YS5yb3dzW2RdW3ZhbHVlXSsnXCIgJytzZWwrJyAnK2RpcysnPicrZGF0YS5yb3dzW2RdW3RleHRdKyc8L29wdGlvbj4nKTtcblx0fVxuXHRzZWxlY3Quc2VsZWN0cGlja2VyKFwicmVmcmVzaFwiKTtcblx0X19zZWxlY3RfX2NvbnRlbnRbaWRzZWxlY3RdPWRhdGE7XG59XG5cbi8vLS0tLS0tLS0tLS0tLSBaSW5kZXhcbi8vXG5cdCQubWF4WkluZGV4ID0gJC5mbi5tYXhaSW5kZXggPSBmdW5jdGlvbihvcHQpIHtcbiAgICAvLy8gPHN1bW1hcnk+XG4gICAgLy8vIFJldHVybnMgdGhlIG1heCB6T3JkZXIgaW4gdGhlIGRvY3VtZW50IChubyBwYXJhbWV0ZXIpXG4gICAgLy8vIFNldHMgbWF4IHpPcmRlciBieSBwYXNzaW5nIGEgbm9uLXplcm8gbnVtYmVyXG4gICAgLy8vIHdoaWNoIGdldHMgYWRkZWQgdG8gdGhlIGhpZ2hlc3Qgek9yZGVyLlxuICAgIC8vLyA8L3N1bW1hcnk+ICAgIFxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9wdFwiIHR5cGU9XCJvYmplY3RcIj5cbiAgICAvLy8gaW5jOiBpbmNyZW1lbnQgdmFsdWUsIFxuICAgIC8vLyBncm91cDogc2VsZWN0b3IgZm9yIHpJbmRleCBlbGVtZW50cyB0byBmaW5kIG1heCBmb3JcbiAgICAvLy8gPC9wYXJhbT5cbiAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeVwiIC8+XG4gICAgdmFyIGRlZiA9IHsgaW5jOiAxMCwgZ3JvdXA6IFwiKlwiIH07XG4gICAgJC5leHRlbmQoZGVmLCBvcHQpOyAgICBcbiAgICB2YXIgem1heCA9IDA7XG4gICAgJChkZWYuZ3JvdXApLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXIgPSBwYXJzZUludCgkKHRoaXMpLmNzcygnei1pbmRleCcpKTtcbiAgICAgICAgem1heCA9IGN1ciA+IHptYXggPyBjdXIgOiB6bWF4O1xuICAgIH0pO1xuICAgIGlmICghdGhpcy5qcXVlcnkpXG4gICAgICAgIHJldHVybiB6bWF4O1xuXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgem1heCArPSBkZWYuaW5jO1xuICAgICAgICAkKHRoaXMpLmNzcyhcInotaW5kZXhcIiwgem1heCk7XG4gICAgfSk7XG5cdH1cblxuY29uc3QgSU5GTz1cImFsZXJ0LWluZm9cIjtcbmNvbnN0IFdBUk5JTkc9XCJhbGVydC13YXJuaW5nXCI7XG5jb25zdCBFUlJPUj1cImFsZXJ0LWRhbmdlclwiO1xuY29uc3QgT0s9XCJhbGVydC1zdWNjZXNzXCI7XG5cbmdsb2JhbC5nZXRJZFNlbGVjdGlvbnM9Z2V0SWRTZWxlY3Rpb25zO1xuZ2xvYmFsLnJlbG9hZFRhYmxlPXJlbG9hZFRhYmxlO1xuZ2xvYmFsLmZpeG1hcmdpbnM9Zml4bWFyZ2lucztcbmdsb2JhbC5fdGFibGVfc2VsZWN0aW9uc189X3RhYmxlX3NlbGVjdGlvbnNfO1xuZ2xvYmFsLl90YWJsZV9mb3JtYXR0ZXJzXz1fdGFibGVfZm9ybWF0dGVyc187XG5nbG9iYWwuX19zZWxlY3RfX2NvbnRlbnQ9X19zZWxlY3RfX2NvbnRlbnQ7XG5nbG9iYWwubWVzc2FnZUFsZXJ0PW1lc3NhZ2VBbGVydDtcbmdsb2JhbC5jYWxsU2VydmVyPWNhbGxTZXJ2ZXI7XG5nbG9iYWwucmVsb2FkU2VsZWN0PXJlbG9hZFNlbGVjdDtcbmdsb2JhbC5JTkZPPUlORk87XG5nbG9iYWwuV0FSTklORz1XQVJOSU5HO1xuZ2xvYmFsLkVSUk9SPUVSUk9SO1xuZ2xvYmFsLk9LPU9LO1xuXG5nbG9iYWwuJCA9IGdsb2JhbC5qUXVlcnkgPSAkO1xuXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJUd2lnXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlR3aWdcIl0gPSBmYWN0b3J5KCk7XG59KShnbG9iYWwsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0aTogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsOiBmYWxzZSxcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4vKioqKioqLyBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4vKioqKioqLyBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuLyoqKioqKi8gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4vKioqKioqLyBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuLyoqKioqKi8gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4vKioqKioqLyBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4vKioqKioqLyBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbi8qKioqKiovIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuLyoqKioqKi8gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbi8qKioqKiovIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4vKioqKioqLyBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuLyoqKioqKi8gXHRcdHJldHVybiBucztcbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuLyoqKioqKi8gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuLyoqKioqKi8gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuLyoqKioqKi8gXHRcdHJldHVybiBnZXR0ZXI7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByaW50ZigpIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC9zcHJpbnRmL1xuICAvLyBvcmlnaW5hbCBieTogQXNoIFNlYXJsZSAoaHR0cDovL2hleG1lbi5jb20vYmxvZy8pXG4gIC8vIGltcHJvdmVkIGJ5OiBNaWNoYWVsIFdoaXRlIChodHRwOi8vZ2V0c3ByaW5rLmNvbSlcbiAgLy8gaW1wcm92ZWQgYnk6IEphY2tcbiAgLy8gaW1wcm92ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rdnouaW8pXG4gIC8vIGltcHJvdmVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAvLyBpbXByb3ZlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2t2ei5pbylcbiAgLy8gaW1wcm92ZWQgYnk6IERqXG4gIC8vIGltcHJvdmVkIGJ5OiBBbGxpZHlsbHNcbiAgLy8gICAgaW5wdXQgYnk6IFBhdWxvIEZyZWl0YXNcbiAgLy8gICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4gIC8vIGltcHJvdmVkIGJ5OiBSYWZhxYIgS3VrYXdza2kgKGh0dHA6Ly9rdWthd3NraS5wbClcbiAgLy8gICBleGFtcGxlIDE6IHNwcmludGYoXCIlMDEuMmZcIiwgMTIzLjEpXG4gIC8vICAgcmV0dXJucyAxOiAnMTIzLjEwJ1xuICAvLyAgIGV4YW1wbGUgMjogc3ByaW50ZihcIlslMTBzXVwiLCAnbW9ua2V5JylcbiAgLy8gICByZXR1cm5zIDI6ICdbICAgIG1vbmtleV0nXG4gIC8vICAgZXhhbXBsZSAzOiBzcHJpbnRmKFwiWyUnIzEwc11cIiwgJ21vbmtleScpXG4gIC8vICAgcmV0dXJucyAzOiAnWyMjIyNtb25rZXldJ1xuICAvLyAgIGV4YW1wbGUgNDogc3ByaW50ZihcIiVkXCIsIDEyMzQ1Njc4OTAxMjM0NSlcbiAgLy8gICByZXR1cm5zIDQ6ICcxMjM0NTY3ODkwMTIzNDUnXG4gIC8vICAgZXhhbXBsZSA1OiBzcHJpbnRmKCclLTAzcycsICdFJylcbiAgLy8gICByZXR1cm5zIDU6ICdFMDAnXG4gIC8vICAgZXhhbXBsZSA2OiBzcHJpbnRmKCclKzAxMGQnLCA5KVxuICAvLyAgIHJldHVybnMgNjogJyswMDAwMDAwMDknXG4gIC8vICAgZXhhbXBsZSA3OiBzcHJpbnRmKCclKzBcXCdAMTBkJywgOSlcbiAgLy8gICByZXR1cm5zIDc6ICdAQEBAQEBAQCs5J1xuICAvLyAgIGV4YW1wbGUgODogc3ByaW50ZignJS5mJywgMy4xNClcbiAgLy8gICByZXR1cm5zIDg6ICczLjE0MDAwMCdcbiAgLy8gICBleGFtcGxlIDk6IHNwcmludGYoJyUlICUyJGQnLCAxLCAyKVxuICAvLyAgIHJldHVybnMgOTogJyUgMidcblxuICB2YXIgcmVnZXggPSAvJSV8JSg/OihcXGQrKVxcJCk/KCg/OlstKyMwIF18J1tcXHNcXFNdKSopKFxcZCspPyg/OlxcLihcXGQqKSk/KFtcXHNcXFNdKS9nO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGkgPSAwO1xuICB2YXIgZm9ybWF0ID0gYXJnc1tpKytdO1xuXG4gIHZhciBfcGFkID0gZnVuY3Rpb24gX3BhZChzdHIsIGxlbiwgY2hyLCBsZWZ0SnVzdGlmeSkge1xuICAgIGlmICghY2hyKSB7XG4gICAgICBjaHIgPSAnICc7XG4gICAgfVxuICAgIHZhciBwYWRkaW5nID0gc3RyLmxlbmd0aCA+PSBsZW4gPyAnJyA6IG5ldyBBcnJheSgxICsgbGVuIC0gc3RyLmxlbmd0aCA+Pj4gMCkuam9pbihjaHIpO1xuICAgIHJldHVybiBsZWZ0SnVzdGlmeSA/IHN0ciArIHBhZGRpbmcgOiBwYWRkaW5nICsgc3RyO1xuICB9O1xuXG4gIHZhciBqdXN0aWZ5ID0gZnVuY3Rpb24ganVzdGlmeSh2YWx1ZSwgcHJlZml4LCBsZWZ0SnVzdGlmeSwgbWluV2lkdGgsIHBhZENoYXIpIHtcbiAgICB2YXIgZGlmZiA9IG1pbldpZHRoIC0gdmFsdWUubGVuZ3RoO1xuICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgLy8gd2hlbiBwYWRkaW5nIHdpdGggemVyb3NcbiAgICAgIC8vIG9uIHRoZSBsZWZ0IHNpZGVcbiAgICAgIC8vIGtlZXAgc2lnbiAoKyBvciAtKSBpbiBmcm9udFxuICAgICAgaWYgKCFsZWZ0SnVzdGlmeSAmJiBwYWRDaGFyID09PSAnMCcpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWUuc2xpY2UoMCwgcHJlZml4Lmxlbmd0aCksIF9wYWQoJycsIGRpZmYsICcwJywgdHJ1ZSksIHZhbHVlLnNsaWNlKHByZWZpeC5sZW5ndGgpXS5qb2luKCcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gX3BhZCh2YWx1ZSwgbWluV2lkdGgsIHBhZENoYXIsIGxlZnRKdXN0aWZ5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIHZhciBfZm9ybWF0QmFzZVggPSBmdW5jdGlvbiBfZm9ybWF0QmFzZVgodmFsdWUsIGJhc2UsIGxlZnRKdXN0aWZ5LCBtaW5XaWR0aCwgcHJlY2lzaW9uLCBwYWRDaGFyKSB7XG4gICAgLy8gTm90ZTogY2FzdHMgbmVnYXRpdmUgbnVtYmVycyB0byBwb3NpdGl2ZSBvbmVzXG4gICAgdmFyIG51bWJlciA9IHZhbHVlID4+PiAwO1xuICAgIHZhbHVlID0gX3BhZChudW1iZXIudG9TdHJpbmcoYmFzZSksIHByZWNpc2lvbiB8fCAwLCAnMCcsIGZhbHNlKTtcbiAgICByZXR1cm4ganVzdGlmeSh2YWx1ZSwgJycsIGxlZnRKdXN0aWZ5LCBtaW5XaWR0aCwgcGFkQ2hhcik7XG4gIH07XG5cbiAgLy8gX2Zvcm1hdFN0cmluZygpXG4gIHZhciBfZm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gX2Zvcm1hdFN0cmluZyh2YWx1ZSwgbGVmdEp1c3RpZnksIG1pbldpZHRoLCBwcmVjaXNpb24sIGN1c3RvbVBhZENoYXIpIHtcbiAgICBpZiAocHJlY2lzaW9uICE9PSBudWxsICYmIHByZWNpc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIHByZWNpc2lvbik7XG4gICAgfVxuICAgIHJldHVybiBqdXN0aWZ5KHZhbHVlLCAnJywgbGVmdEp1c3RpZnksIG1pbldpZHRoLCBjdXN0b21QYWRDaGFyKTtcbiAgfTtcblxuICAvLyBkb0Zvcm1hdCgpXG4gIHZhciBkb0Zvcm1hdCA9IGZ1bmN0aW9uIGRvRm9ybWF0KHN1YnN0cmluZywgYXJnSW5kZXgsIG1vZGlmaWVycywgbWluV2lkdGgsIHByZWNpc2lvbiwgc3BlY2lmaWVyKSB7XG4gICAgdmFyIG51bWJlciwgcHJlZml4LCBtZXRob2QsIHRleHRUcmFuc2Zvcm0sIHZhbHVlO1xuXG4gICAgaWYgKHN1YnN0cmluZyA9PT0gJyUlJykge1xuICAgICAgcmV0dXJuICclJztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBtb2RpZmllcnNcbiAgICB2YXIgcGFkQ2hhciA9ICcgJzsgLy8gcGFkIHdpdGggc3BhY2VzIGJ5IGRlZmF1bHRcbiAgICB2YXIgbGVmdEp1c3RpZnkgPSBmYWxzZTtcbiAgICB2YXIgcG9zaXRpdmVOdW1iZXJQcmVmaXggPSAnJztcbiAgICB2YXIgaiwgbDtcblxuICAgIGZvciAoaiA9IDAsIGwgPSBtb2RpZmllcnMubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICBzd2l0Y2ggKG1vZGlmaWVycy5jaGFyQXQoaikpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgIGNhc2UgJzAnOlxuICAgICAgICAgIHBhZENoYXIgPSBtb2RpZmllcnMuY2hhckF0KGopO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICBwb3NpdGl2ZU51bWJlclByZWZpeCA9ICcrJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgbGVmdEp1c3RpZnkgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgIGlmIChqICsgMSA8IGwpIHtcbiAgICAgICAgICAgIHBhZENoYXIgPSBtb2RpZmllcnMuY2hhckF0KGogKyAxKTtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFtaW5XaWR0aCkge1xuICAgICAgbWluV2lkdGggPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBtaW5XaWR0aCA9ICttaW5XaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoIWlzRmluaXRlKG1pbldpZHRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaWR0aCBtdXN0IGJlIGZpbml0ZScpO1xuICAgIH1cblxuICAgIGlmICghcHJlY2lzaW9uKSB7XG4gICAgICBwcmVjaXNpb24gPSBzcGVjaWZpZXIgPT09ICdkJyA/IDAgOiAnZkZlRScuaW5kZXhPZihzcGVjaWZpZXIpID4gLTEgPyA2IDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVjaXNpb24gPSArcHJlY2lzaW9uO1xuICAgIH1cblxuICAgIGlmIChhcmdJbmRleCAmJiArYXJnSW5kZXggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgbnVtYmVyIG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8nKTtcbiAgICB9XG5cbiAgICBpZiAoYXJnSW5kZXggJiYgK2FyZ0luZGV4ID49IGFyZ3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbyBmZXcgYXJndW1lbnRzJyk7XG4gICAgfVxuXG4gICAgdmFsdWUgPSBhcmdJbmRleCA/IGFyZ3NbK2FyZ0luZGV4XSA6IGFyZ3NbaSsrXTtcblxuICAgIHN3aXRjaCAoc3BlY2lmaWVyKSB7XG4gICAgICBjYXNlICclJzpcbiAgICAgICAgcmV0dXJuICclJztcbiAgICAgIGNhc2UgJ3MnOlxuICAgICAgICByZXR1cm4gX2Zvcm1hdFN0cmluZyh2YWx1ZSArICcnLCBsZWZ0SnVzdGlmeSwgbWluV2lkdGgsIHByZWNpc2lvbiwgcGFkQ2hhcik7XG4gICAgICBjYXNlICdjJzpcbiAgICAgICAgcmV0dXJuIF9mb3JtYXRTdHJpbmcoU3RyaW5nLmZyb21DaGFyQ29kZSgrdmFsdWUpLCBsZWZ0SnVzdGlmeSwgbWluV2lkdGgsIHByZWNpc2lvbiwgcGFkQ2hhcik7XG4gICAgICBjYXNlICdiJzpcbiAgICAgICAgcmV0dXJuIF9mb3JtYXRCYXNlWCh2YWx1ZSwgMiwgbGVmdEp1c3RpZnksIG1pbldpZHRoLCBwcmVjaXNpb24sIHBhZENoYXIpO1xuICAgICAgY2FzZSAnbyc6XG4gICAgICAgIHJldHVybiBfZm9ybWF0QmFzZVgodmFsdWUsIDgsIGxlZnRKdXN0aWZ5LCBtaW5XaWR0aCwgcHJlY2lzaW9uLCBwYWRDaGFyKTtcbiAgICAgIGNhc2UgJ3gnOlxuICAgICAgICByZXR1cm4gX2Zvcm1hdEJhc2VYKHZhbHVlLCAxNiwgbGVmdEp1c3RpZnksIG1pbldpZHRoLCBwcmVjaXNpb24sIHBhZENoYXIpO1xuICAgICAgY2FzZSAnWCc6XG4gICAgICAgIHJldHVybiBfZm9ybWF0QmFzZVgodmFsdWUsIDE2LCBsZWZ0SnVzdGlmeSwgbWluV2lkdGgsIHByZWNpc2lvbiwgcGFkQ2hhcikudG9VcHBlckNhc2UoKTtcbiAgICAgIGNhc2UgJ3UnOlxuICAgICAgICByZXR1cm4gX2Zvcm1hdEJhc2VYKHZhbHVlLCAxMCwgbGVmdEp1c3RpZnksIG1pbldpZHRoLCBwcmVjaXNpb24sIHBhZENoYXIpO1xuICAgICAgY2FzZSAnaSc6XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAgbnVtYmVyID0gK3ZhbHVlIHx8IDA7XG4gICAgICAgIC8vIFBsYWluIE1hdGgucm91bmQgZG9lc24ndCBqdXN0IHRydW5jYXRlXG4gICAgICAgIG51bWJlciA9IE1hdGgucm91bmQobnVtYmVyIC0gbnVtYmVyICUgMSk7XG4gICAgICAgIHByZWZpeCA9IG51bWJlciA8IDAgPyAnLScgOiBwb3NpdGl2ZU51bWJlclByZWZpeDtcbiAgICAgICAgdmFsdWUgPSBwcmVmaXggKyBfcGFkKFN0cmluZyhNYXRoLmFicyhudW1iZXIpKSwgcHJlY2lzaW9uLCAnMCcsIGZhbHNlKTtcblxuICAgICAgICBpZiAobGVmdEp1c3RpZnkgJiYgcGFkQ2hhciA9PT0gJzAnKSB7XG4gICAgICAgICAgLy8gY2FuJ3QgcmlnaHQtcGFkIDBzIG9uIGludGVnZXJzXG4gICAgICAgICAgcGFkQ2hhciA9ICcgJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ganVzdGlmeSh2YWx1ZSwgcHJlZml4LCBsZWZ0SnVzdGlmeSwgbWluV2lkdGgsIHBhZENoYXIpO1xuICAgICAgY2FzZSAnZSc6XG4gICAgICBjYXNlICdFJzpcbiAgICAgIGNhc2UgJ2YnOiAvLyBAdG9kbzogU2hvdWxkIGhhbmRsZSBsb2NhbGVzIChhcyBwZXIgc2V0bG9jYWxlKVxuICAgICAgY2FzZSAnRic6XG4gICAgICBjYXNlICdnJzpcbiAgICAgIGNhc2UgJ0cnOlxuICAgICAgICBudW1iZXIgPSArdmFsdWU7XG4gICAgICAgIHByZWZpeCA9IG51bWJlciA8IDAgPyAnLScgOiBwb3NpdGl2ZU51bWJlclByZWZpeDtcbiAgICAgICAgbWV0aG9kID0gWyd0b0V4cG9uZW50aWFsJywgJ3RvRml4ZWQnLCAndG9QcmVjaXNpb24nXVsnZWZnJy5pbmRleE9mKHNwZWNpZmllci50b0xvd2VyQ2FzZSgpKV07XG4gICAgICAgIHRleHRUcmFuc2Zvcm0gPSBbJ3RvU3RyaW5nJywgJ3RvVXBwZXJDYXNlJ11bJ2VFZkZnRycuaW5kZXhPZihzcGVjaWZpZXIpICUgMl07XG4gICAgICAgIHZhbHVlID0gcHJlZml4ICsgTWF0aC5hYnMobnVtYmVyKVttZXRob2RdKHByZWNpc2lvbik7XG4gICAgICAgIHJldHVybiBqdXN0aWZ5KHZhbHVlLCBwcmVmaXgsIGxlZnRKdXN0aWZ5LCBtaW5XaWR0aCwgcGFkQ2hhcilbdGV4dFRyYW5zZm9ybV0oKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHVua25vd24gc3BlY2lmaWVyLCBjb25zdW1lIHRoYXQgY2hhciBhbmQgcmV0dXJuIGVtcHR5XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UocmVnZXgsIGRvRm9ybWF0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3ByaW50Zi5qcy5tYXBcblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG4vKipcbiAqIFR3aWcuanNcbiAqXG4gKiBAY29weXJpZ2h0IDIwMTEtMjAxNiBKb2huIFJvZXBrZSBhbmQgdGhlIFR3aWcuanMgQ29udHJpYnV0b3JzXG4gKiBAbGljZW5zZSAgIEF2YWlsYWJsZSB1bmRlciB0aGUgQlNEIDItQ2xhdXNlIExpY2Vuc2VcbiAqIEBsaW5rICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3R3aWdqcy90d2lnLmpzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKCk7XG5cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8vICMjIHR3aWcuZmFjdG9yeS5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIGNyZWF0aW5nIHRoZSBUd2lnIGxpYnJhcnlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmFjdG9yeSgpIHtcbiAgICB2YXIgVHdpZyA9IHtcbiAgICAgICAgVkVSU0lPTjogJzEuMTMuMycsXG4gICAgfTtcblxuICAgIF9fd2VicGFja19yZXF1aXJlX18oNCkoVHdpZyk7XG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg1KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpKFR3aWcpO1xuICAgIF9fd2VicGFja19yZXF1aXJlX18oOCkoVHdpZyk7XG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg5KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDIwKShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDIxKShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDIzKShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI0KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI1KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI2KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI3KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI4KShUd2lnKTtcbiAgICBfX3dlYnBhY2tfcmVxdWlyZV9fKDI5KShUd2lnKTtcblxuICAgIFR3aWcuZXhwb3J0cy5mYWN0b3J5ID0gZmFjdG9yeTtcblxuICAgIHJldHVybiBUd2lnLmV4cG9ydHM7XG59XG5cblxuLyoqKi8gfSksXG4vKiA0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8vICMjIHR3aWcuY29yZS5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIHRlbXBsYXRlIGxldmVsIHRva2VuaXppbmcsIGNvbXBpbGluZyBhbmQgcGFyc2luZy5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIFR3aWcudHJhY2UgPSBmYWxzZTtcbiAgICBUd2lnLmRlYnVnID0gZmFsc2U7XG5cbiAgICAvLyBEZWZhdWx0IGNhY2hpbmcgdG8gdHJ1ZSBmb3IgdGhlIGltcHJvdmVkIHBlcmZvcm1hbmNlIGl0IG9mZmVyc1xuICAgIFR3aWcuY2FjaGUgPSB0cnVlO1xuXG4gICAgVHdpZy5ub29wID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIFR3aWcucGxhY2Vob2xkZXJzID0ge1xuICAgICAgICBwYXJlbnQ6IFwie3t8UEFSRU5UfH19XCJcbiAgICB9O1xuXG4gICAgVHdpZy5oYXNJbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiaW5kZXhPZlwiKTtcblxuICAgIC8qKlxuICAgICAqIEZhbGxiYWNrIGZvciBBcnJheS5pbmRleE9mIGZvciBJRTggZXQgYWxcbiAgICAgKi9cbiAgICBUd2lnLmluZGV4T2YgPSBmdW5jdGlvbiAoYXJyLCBzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgICAgIGlmIChUd2lnLmhhc0luZGV4T2YpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihzZWFyY2hFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyID09PSB2b2lkIDAgfHwgYXJyID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSBPYmplY3QoYXJyKTtcbiAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuICAgICAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG4gPSBOdW1iZXIoYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgIGlmIChuICE9PSBuKSB7IC8vIHNob3J0Y3V0IGZvciB2ZXJpZnlpbmcgaWYgaXQncyBOYU5cbiAgICAgICAgICAgICAgICBuID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiAhPT0gMCAmJiBuICE9PSBJbmZpbml0eSAmJiBuICE9PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBuID0gKG4gPiAwIHx8IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuID49IGxlbikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbmRleE9mIG5vdCBmb3VuZDEgXCIsIEpTT04uc3RyaW5naWZ5KHNlYXJjaEVsZW1lbnQpLCBKU09OLnN0cmluZ2lmeShhcnIpKTtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgayA9IG4gPj0gMCA/IG4gOiBNYXRoLm1heChsZW4gLSBNYXRoLmFicyhuKSwgMCk7XG4gICAgICAgIGZvciAoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChrIGluIHQgJiYgdFtrXSA9PT0gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhcnIgPT0gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbmRleE9mIG5vdCBmb3VuZDIgXCIsIEpTT04uc3RyaW5naWZ5KHNlYXJjaEVsZW1lbnQpLCBKU09OLnN0cmluZ2lmeShhcnIpKTtcblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgVHdpZy5mb3JFYWNoID0gZnVuY3Rpb24gKGFyciwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoICkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBULCBrO1xuXG4gICAgICAgIGlmICggYXJyID09IG51bGwgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggXCIgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkXCIgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxuICAgICAgICB2YXIgTyA9IE9iamVjdChhcnIpO1xuXG4gICAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgICAvLyAzLiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cbiAgICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwOyAvLyBIYWNrIHRvIGNvbnZlcnQgTy5sZW5ndGggdG8gYSBVSW50MzJcblxuICAgICAgICAvLyA0LiBJZiBJc0NhbGxhYmxlKGNhbGxiYWNrKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAvLyBTZWU6IGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuMTFcbiAgICAgICAgaWYgKCB7fS50b1N0cmluZy5jYWxsKGNhbGxiYWNrKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggY2FsbGJhY2sgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXG4gICAgICAgIGlmICggdGhpc0FyZyApIHtcbiAgICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYuIExldCBrIGJlIDBcbiAgICAgICAgayA9IDA7XG5cbiAgICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG4gICAgICAgIHdoaWxlKCBrIDwgbGVuICkge1xuXG4gICAgICAgICAgdmFyIGtWYWx1ZTtcblxuICAgICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgICAgICAvLyAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3JcbiAgICAgICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBIYXNQcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgIC8vICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcbiAgICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgICAgaWYgKCBrIGluIE8gKSB7XG5cbiAgICAgICAgICAgIC8vIGkuIExldCBrVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICAgIGtWYWx1ZSA9IE9bIGsgXTtcblxuICAgICAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgIC8vIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCggVCwga1ZhbHVlLCBrLCBPICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGQuIEluY3JlYXNlIGsgYnkgMS5cbiAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gOC4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICBUd2lnLm1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UsIG9ubHlDaGFuZ2VkKSB7XG4gICAgICAgIFR3aWcuZm9yRWFjaChPYmplY3Qua2V5cyhzb3VyY2UpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAob25seUNoYW5nZWQgJiYgIShrZXkgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiB0cnkvY2F0Y2ggaW4gYSBmdW5jdGlvbiBjYXVzZXMgdGhlIGVudGlyZSBmdW5jdGlvbiBib2R5IHRvIHJlbWFpbiB1bm9wdGltaXplZC5cbiAgICAgKiBVc2UgdGhpcyBpbnN0ZWFkIHNvIG9ubHkgYGBUd2lnLmF0dGVtcHRgIHdpbGwgYmUgbGVmdCB1bm9wdGltaXplZC5cbiAgICAgKi9cbiAgICBUd2lnLmF0dGVtcHQgPSBmdW5jdGlvbihmbiwgZXhjZXB0aW9uSGFuZGxlcikge1xuICAgICAgICB0cnkgeyByZXR1cm4gZm4oKTsgfVxuICAgICAgICBjYXRjaChleCkgeyByZXR1cm4gZXhjZXB0aW9uSGFuZGxlcihleCk7IH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGNlcHRpb24gdGhyb3duIGJ5IHR3aWcuanMuXG4gICAgICovXG4gICAgVHdpZy5FcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGZpbGUpIHtcbiAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgIHRoaXMubmFtZSA9IFwiVHdpZ0V4Y2VwdGlvblwiO1xuICAgICAgIHRoaXMudHlwZSA9IFwiVHdpZ0V4Y2VwdGlvblwiO1xuICAgICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgVHdpZyBlcnJvci5cbiAgICAgKi9cbiAgICBUd2lnLkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5uYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBwZXIgZm9yIGxvZ2dpbmcgdG8gdGhlIGNvbnNvbGUuXG4gICAgICovXG4gICAgVHdpZy5sb2cgPSB7XG4gICAgICAgIHRyYWNlOiBmdW5jdGlvbigpIHtpZiAoVHdpZy50cmFjZSAmJiBjb25zb2xlKSB7Y29uc29sZS5sb2coQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7fX0sXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtpZiAoVHdpZy5kZWJ1ZyAmJiBjb25zb2xlKSB7Y29uc29sZS5sb2coQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7fX1cbiAgICB9O1xuXG5cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLmVycm9yICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBUd2lnLmxvZy5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uc29sZS5sb2cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIFR3aWcubG9nLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIFR3aWcubG9nLmVycm9yID0gZnVuY3Rpb24oKXt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdyYXBwZXIgZm9yIGNoaWxkIGNvbnRleHQgb2JqZWN0cyBpbiBUd2lnLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgVmFsdWVzIHRvIGluaXRpYWxpemUgdGhlIGNvbnRleHQgd2l0aC5cbiAgICAgKi9cbiAgICBUd2lnLkNoaWxkQ29udGV4dCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIFR3aWcubGliLmNvcHkoY29udGV4dCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5lciBmb3IgbWV0aG9kcyByZWxhdGVkIHRvIGhhbmRsaW5nIGhpZ2ggbGV2ZWwgdGVtcGxhdGUgdG9rZW5zXG4gICAgICogICAgICAoZm9yIGV4YW1wbGU6IHt7IGV4cHJlc3Npb24gfX0sIHslIGxvZ2ljICV9LCB7IyBjb21tZW50ICN9LCByYXcgZGF0YSlcbiAgICAgKi9cbiAgICBUd2lnLnRva2VuID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbiB0eXBlcy5cbiAgICAgKi9cbiAgICBUd2lnLnRva2VuLnR5cGUgPSB7XG4gICAgICAgIG91dHB1dDogICAgICAgICAgICAgICAgICdvdXRwdXQnLFxuICAgICAgICBsb2dpYzogICAgICAgICAgICAgICAgICAnbG9naWMnLFxuICAgICAgICBjb21tZW50OiAgICAgICAgICAgICAgICAnY29tbWVudCcsXG4gICAgICAgIHJhdzogICAgICAgICAgICAgICAgICAgICdyYXcnLFxuICAgICAgICBvdXRwdXRfd2hpdGVzcGFjZV9wcmU6ICAnb3V0cHV0X3doaXRlc3BhY2VfcHJlJyxcbiAgICAgICAgb3V0cHV0X3doaXRlc3BhY2VfcG9zdDogJ291dHB1dF93aGl0ZXNwYWNlX3Bvc3QnLFxuICAgICAgICBvdXRwdXRfd2hpdGVzcGFjZV9ib3RoOiAnb3V0cHV0X3doaXRlc3BhY2VfYm90aCcsXG4gICAgICAgIGxvZ2ljX3doaXRlc3BhY2VfcHJlOiAgICdsb2dpY193aGl0ZXNwYWNlX3ByZScsXG4gICAgICAgIGxvZ2ljX3doaXRlc3BhY2VfcG9zdDogICdsb2dpY193aGl0ZXNwYWNlX3Bvc3QnLFxuICAgICAgICBsb2dpY193aGl0ZXNwYWNlX2JvdGg6ICAnbG9naWNfd2hpdGVzcGFjZV9ib3RoJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbiBzeW50YXggZGVmaW5pdGlvbnMuXG4gICAgICovXG4gICAgVHdpZy50b2tlbi5kZWZpbml0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLnJhdyxcbiAgICAgICAgICAgIG9wZW46ICd7JSByYXcgJX0nLFxuICAgICAgICAgICAgY2xvc2U6ICd7JSBlbmRyYXcgJX0nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcudG9rZW4udHlwZS5yYXcsXG4gICAgICAgICAgICBvcGVuOiAneyUgdmVyYmF0aW0gJX0nLFxuICAgICAgICAgICAgY2xvc2U6ICd7JSBlbmR2ZXJiYXRpbSAlfSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKldoaXRlc3BhY2UgdHlwZSB0b2tlbnMqXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZXNlIHR5cGljYWxseSB0YWtlIHRoZSBmb3JtIGB7ey0gZXhwcmVzc2lvbiAtfX1gIG9yIGB7ey0gZXhwcmVzc2lvbiB9fWAgb3IgYHt7IGV4cHJlc3Npb24gLX19YC5cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLm91dHB1dF93aGl0ZXNwYWNlX3ByZSxcbiAgICAgICAgICAgIG9wZW46ICd7ey0nLFxuICAgICAgICAgICAgY2xvc2U6ICd9fSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLm91dHB1dF93aGl0ZXNwYWNlX3Bvc3QsXG4gICAgICAgICAgICBvcGVuOiAne3snLFxuICAgICAgICAgICAgY2xvc2U6ICctfX0nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9ib3RoLFxuICAgICAgICAgICAgb3BlbjogJ3t7LScsXG4gICAgICAgICAgICBjbG9zZTogJy19fSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmxvZ2ljX3doaXRlc3BhY2VfcHJlLFxuICAgICAgICAgICAgb3BlbjogJ3slLScsXG4gICAgICAgICAgICBjbG9zZTogJyV9J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUubG9naWNfd2hpdGVzcGFjZV9wb3N0LFxuICAgICAgICAgICAgb3BlbjogJ3slJyxcbiAgICAgICAgICAgIGNsb3NlOiAnLSV9J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUubG9naWNfd2hpdGVzcGFjZV9ib3RoLFxuICAgICAgICAgICAgb3BlbjogJ3slLScsXG4gICAgICAgICAgICBjbG9zZTogJy0lfSdcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKk91dHB1dCB0eXBlIHRva2VucypcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlc2UgdHlwaWNhbGx5IHRha2UgdGhlIGZvcm0gYHt7IGV4cHJlc3Npb24gfX1gLlxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUub3V0cHV0LFxuICAgICAgICAgICAgb3BlbjogJ3t7JyxcbiAgICAgICAgICAgIGNsb3NlOiAnfX0nXG4gICAgICAgIH0sXG4gICAgICAgIC8vICpMb2dpYyB0eXBlIHRva2VucypcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlc2UgdHlwaWNhbGx5IHRha2UgYSBmb3JtIGxpa2UgYHslIGlmIGV4cHJlc3Npb24gJX1gIG9yIGB7JSBlbmRpZiAlfWBcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmxvZ2ljLFxuICAgICAgICAgICAgb3BlbjogJ3slJyxcbiAgICAgICAgICAgIGNsb3NlOiAnJX0nXG4gICAgICAgIH0sXG4gICAgICAgIC8vICpDb21tZW50IHR5cGUgdG9rZW5zKlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVzZSB0YWtlIHRoZSBmb3JtIGB7IyBhbnl0aGluZyAjfWBcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy50b2tlbi50eXBlLmNvbW1lbnQsXG4gICAgICAgICAgICBvcGVuOiAneyMnLFxuICAgICAgICAgICAgY2xvc2U6ICcjfSdcbiAgICAgICAgfVxuICAgIF07XG5cblxuICAgIC8qKlxuICAgICAqIFdoYXQgY2hhcmFjdGVycyBzdGFydCBcInN0cmluZ3NcIiBpbiB0b2tlbiBkZWZpbml0aW9ucy4gV2UgbmVlZCB0aGlzIHRvIGlnbm9yZSB0b2tlbiBjbG9zZVxuICAgICAqIHN0cmluZ3MgaW5zaWRlIGFuIGV4cHJlc3Npb24uXG4gICAgICovXG4gICAgVHdpZy50b2tlbi5zdHJpbmdzID0gWydcIicsIFwiJ1wiXTtcblxuICAgIFR3aWcudG9rZW4uZmluZFN0YXJ0ID0gZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG51bGwsXG4gICAgICAgICAgICAgICAgZGVmOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2VfcG9zaXRpb24gPSBudWxsLFxuICAgICAgICAgICAgbGVuID0gVHdpZy50b2tlbi5kZWZpbml0aW9ucy5sZW5ndGgsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgdG9rZW5fdGVtcGxhdGUsXG4gICAgICAgICAgICBmaXJzdF9rZXlfcG9zaXRpb24sXG4gICAgICAgICAgICBjbG9zZV9rZXlfcG9zaXRpb247XG5cbiAgICAgICAgZm9yIChpPTA7aTxsZW47aSsrKSB7XG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcudG9rZW4uZGVmaW5pdGlvbnNbaV07XG4gICAgICAgICAgICBmaXJzdF9rZXlfcG9zaXRpb24gPSB0ZW1wbGF0ZS5pbmRleE9mKHRva2VuX3RlbXBsYXRlLm9wZW4pO1xuICAgICAgICAgICAgY2xvc2Vfa2V5X3Bvc2l0aW9uID0gdGVtcGxhdGUuaW5kZXhPZih0b2tlbl90ZW1wbGF0ZS5jbG9zZSk7XG5cbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy50b2tlbi5maW5kU3RhcnQ6IFwiLCBcIlNlYXJjaGluZyBmb3IgXCIsIHRva2VuX3RlbXBsYXRlLm9wZW4sIFwiIGZvdW5kIGF0IFwiLCBmaXJzdF9rZXlfcG9zaXRpb24pO1xuXG4gICAgICAgICAgICAvL1NwZWNpYWwgaGFuZGxpbmcgZm9yIG1pc21hdGNoZWQgdG9rZW5zXG4gICAgICAgICAgICBpZiAoZmlyc3Rfa2V5X3Bvc2l0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4gbWF0Y2hlcyB0aGUgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5fdGVtcGxhdGUub3Blbi5sZW5ndGggIT09IHRva2VuX3RlbXBsYXRlLmNsb3NlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4gaGFzIG1pc21hdGNoZWQgY2xvc2luZyBhbmQgb3BlbmluZyB0YWdzXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9zZV9rZXlfcG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4ncyBjbG9zaW5nIHRhZyBkb2VzIG5vdCBtYXRjaCB0aGUgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRG9lcyB0aGlzIHRva2VuIG9jY3VyIGJlZm9yZSBhbnkgb3RoZXIgdHlwZXM/XG4gICAgICAgICAgICBpZiAoZmlyc3Rfa2V5X3Bvc2l0aW9uID49IDAgJiYgKG91dHB1dC5wb3NpdGlvbiA9PT0gbnVsbCB8fCBmaXJzdF9rZXlfcG9zaXRpb24gPCBvdXRwdXQucG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnBvc2l0aW9uID0gZmlyc3Rfa2V5X3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgIG91dHB1dC5kZWYgPSB0b2tlbl90ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBjbG9zZV9wb3NpdGlvbiA9IGNsb3NlX2tleV9wb3NpdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlyc3Rfa2V5X3Bvc2l0aW9uID49IDAgJiYgb3V0cHV0LnBvc2l0aW9uICE9PSBudWxsICYmIGZpcnN0X2tleV9wb3NpdGlvbiA9PT0gb3V0cHV0LnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgLypUaGlzIHRva2VuIGV4YWN0bHkgbWF0Y2hlcyBhbm90aGVyIHRva2VuLFxuICAgICAgICAgICAgICAgIGdyZWVkaWx5IG1hdGNoIHRvIGNoZWNrIGlmIHRoaXMgdG9rZW4gaGFzIGEgZ3JlYXRlciBzcGVjaWZpY2l0eSovXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3RlbXBsYXRlLm9wZW4ubGVuZ3RoID4gb3V0cHV0LmRlZi5vcGVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4ncyBvcGVuaW5nIHRhZyBpcyBtb3JlIHNwZWNpZmljIHRoYW4gdGhlIHByZXZpb3VzIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wb3NpdGlvbiA9IGZpcnN0X2tleV9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmRlZiA9IHRva2VuX3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBjbG9zZV9wb3NpdGlvbiA9IGNsb3NlX2tleV9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuX3RlbXBsYXRlLm9wZW4ubGVuZ3RoID09PSBvdXRwdXQuZGVmLm9wZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbl90ZW1wbGF0ZS5jbG9zZS5sZW5ndGggPiBvdXRwdXQuZGVmLmNsb3NlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGlzIHRva2VuJ3Mgb3BlbmluZyB0YWcgaXMgYXMgc3BlY2lmaWMgYXMgdGhlIHByZXZpb3VzIG1hdGNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9idXQgdGhlIGNsb3NpbmcgdGFnIGhhcyBncmVhdGVyIHNwZWNpZmljaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2Vfa2V5X3Bvc2l0aW9uID49IDAgJiYgY2xvc2Vfa2V5X3Bvc2l0aW9uIDwgY2xvc2VfcG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4ncyBjbG9zaW5nIHRhZyBleGlzdHMgaW4gdGhlIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYW5kIGl0IG9jY3VycyBzb29uZXIgdGhhbiB0aGUgcHJldmlvdXMgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucG9zaXRpb24gPSBmaXJzdF9rZXlfcG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmRlZiA9IHRva2VuX3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlX3Bvc2l0aW9uID0gY2xvc2Vfa2V5X3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNsb3NlX2tleV9wb3NpdGlvbiA+PSAwICYmIGNsb3NlX2tleV9wb3NpdGlvbiA8IGNsb3NlX3Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RoaXMgdG9rZW4ncyBjbG9zaW5nIHRhZyBpcyBub3QgbW9yZSBzcGVjaWZpYyB0aGFuIHRoZSBwcmV2aW91cyBtYXRjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYnV0IGl0IG9jY3VycyBzb29uZXIgdGhhbiB0aGUgcHJldmlvdXMgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wb3NpdGlvbiA9IGZpcnN0X2tleV9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZWYgPSB0b2tlbl90ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlX3Bvc2l0aW9uID0gY2xvc2Vfa2V5X3Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIG91dHB1dFsnY2xvc2VfcG9zaXRpb24nXTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG5cbiAgICBUd2lnLnRva2VuLmZpbmRFbmQgPSBmdW5jdGlvbiAodGVtcGxhdGUsIHRva2VuX2RlZiwgc3RhcnQpIHtcbiAgICAgICAgdmFyIGVuZCA9IG51bGwsXG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlLFxuICAgICAgICAgICAgb2Zmc2V0ID0gMCxcblxuICAgICAgICAgICAgLy8gU3RyaW5nIHBvc2l0aW9uIHZhcmlhYmxlc1xuICAgICAgICAgICAgc3RyX3BvcyA9IG51bGwsXG4gICAgICAgICAgICBzdHJfZm91bmQgPSBudWxsLFxuICAgICAgICAgICAgcG9zID0gbnVsbCxcbiAgICAgICAgICAgIGVuZF9vZmZzZXQgPSBudWxsLFxuICAgICAgICAgICAgdGhpc19zdHJfcG9zID0gbnVsbCxcbiAgICAgICAgICAgIGVuZF9zdHJfcG9zID0gbnVsbCxcblxuICAgICAgICAgICAgLy8gRm9yIGxvb3AgdmFyaWFibGVzXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbDtcblxuICAgICAgICB3aGlsZSAoIWZvdW5kKSB7XG4gICAgICAgICAgICBzdHJfcG9zID0gbnVsbDtcbiAgICAgICAgICAgIHN0cl9mb3VuZCA9IG51bGw7XG4gICAgICAgICAgICBwb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKHRva2VuX2RlZi5jbG9zZSwgb2Zmc2V0KTtcblxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgZW5kID0gcG9zO1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhyb3cgYW4gZXhjZXB0aW9uXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gZmluZCBjbG9zaW5nIGJyYWNrZXQgJ1wiICsgdG9rZW5fZGVmLmNsb3NlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCInXCIgKyBcIiBvcGVuZWQgbmVhciB0ZW1wbGF0ZSBwb3NpdGlvbiBcIiArIHN0YXJ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWdub3JlIHF1b3RlcyB3aXRoaW4gY29tbWVudHM7IGp1c3QgbG9vayBmb3IgdGhlIG5leHQgY29tbWVudCBjbG9zZSBzZXF1ZW5jZSxcbiAgICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCBjb21lcyBiZWZvcmUgaXQuIGh0dHBzOi8vZ2l0aHViLmNvbS9qdXN0am9obi90d2lnLmpzL2lzc3Vlcy85NVxuICAgICAgICAgICAgaWYgKHRva2VuX2RlZi50eXBlID09PSBUd2lnLnRva2VuLnR5cGUuY29tbWVudCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElnbm9yZSBxdW90ZXMgd2l0aGluIHJhdyB0YWdcbiAgICAgICAgICAgIC8vIEZpeGVzICMyODNcbiAgICAgICAgICAgIGlmICh0b2tlbl9kZWYudHlwZSA9PT0gVHdpZy50b2tlbi50eXBlLnJhdykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsID0gVHdpZy50b2tlbi5zdHJpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzX3N0cl9wb3MgPSB0ZW1wbGF0ZS5pbmRleE9mKFR3aWcudG9rZW4uc3RyaW5nc1tpXSwgb2Zmc2V0KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzX3N0cl9wb3MgPiAwICYmIHRoaXNfc3RyX3BvcyA8IHBvcyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKHN0cl9wb3MgPT09IG51bGwgfHwgdGhpc19zdHJfcG9zIDwgc3RyX3BvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyX3BvcyA9IHRoaXNfc3RyX3BvcztcbiAgICAgICAgICAgICAgICAgICAgc3RyX2ZvdW5kID0gVHdpZy50b2tlbi5zdHJpbmdzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBzdHJpbmcgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHRva2VuLCBub3cgZmluZCB0aGUgc3RyaW5nJ3MgZW5kIGFuZCBzZXQgdGhlIHNlYXJjaCBvZmZzZXQgdG8gaXRcbiAgICAgICAgICAgIGlmIChzdHJfcG9zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW5kX29mZnNldCA9IHN0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgIGVuZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbmRfc3RyX3BvcyA9IHRlbXBsYXRlLmluZGV4T2Yoc3RyX2ZvdW5kLCBlbmRfb2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZF9zdHJfcG9zIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmNsb3NlZCBzdHJpbmcgaW4gdGVtcGxhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZXNjYXBlZCBxdW90ZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlLnN1YnN0cihlbmRfc3RyX3BvcyAtIDEsIDEpICE9PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gZW5kX3N0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRfb2Zmc2V0ID0gZW5kX3N0cl9wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSB0ZW1wbGF0ZSBpbnRvIGhpZ2gtbGV2ZWwgdG9rZW5zLlxuICAgICAqL1xuICAgIFR3aWcudG9rZW5pemUgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgdmFyIHRva2VucyA9IFtdLFxuICAgICAgICAgICAgLy8gQW4gb2Zmc2V0IGZvciByZXBvcnRpbmcgZXJyb3JzIGxvY2F0aW9ucyBpbiB0aGUgdGVtcGxhdGUuXG4gICAgICAgICAgICBlcnJvcl9vZmZzZXQgPSAwLFxuXG4gICAgICAgICAgICAvLyBUaGUgc3RhcnQgYW5kIHR5cGUgb2YgdGhlIGZpcnN0IHRva2VuIGZvdW5kIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIGZvdW5kX3Rva2VuID0gbnVsbCxcbiAgICAgICAgICAgIC8vIFRoZSBlbmQgcG9zaXRpb24gb2YgdGhlIG1hdGNoZWQgdG9rZW4uXG4gICAgICAgICAgICBlbmQgPSBudWxsO1xuXG4gICAgICAgIHdoaWxlICh0ZW1wbGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBmaXJzdCBvY2N1cmFuY2Ugb2YgYW55IHRva2VuIHR5cGUgaW4gdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICBmb3VuZF90b2tlbiA9IFR3aWcudG9rZW4uZmluZFN0YXJ0KHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLnRva2VuaXplOiBcIiwgXCJGb3VuZCB0b2tlbjogXCIsIGZvdW5kX3Rva2VuKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kX3Rva2VuLnBvc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRkIGEgcmF3IHR5cGUgdG9rZW4gZm9yIGFueXRoaW5nIGJlZm9yZSB0aGUgc3RhcnQgb2YgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kX3Rva2VuLnBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUucmF3LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnN1YnN0cmluZygwLCBmb3VuZF90b2tlbi5wb3NpdGlvbilcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuc3Vic3RyKGZvdW5kX3Rva2VuLnBvc2l0aW9uICsgZm91bmRfdG9rZW4uZGVmLm9wZW4ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBlcnJvcl9vZmZzZXQgKz0gZm91bmRfdG9rZW4ucG9zaXRpb24gKyBmb3VuZF90b2tlbi5kZWYub3Blbi5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgZW5kID0gVHdpZy50b2tlbi5maW5kRW5kKHRlbXBsYXRlLCBmb3VuZF90b2tlbi5kZWYsIGVycm9yX29mZnNldCk7XG5cbiAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcudG9rZW5pemU6IFwiLCBcIlRva2VuIGVuZHMgYXQgXCIsIGVuZCk7XG5cbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICBmb3VuZF90b2tlbi5kZWYudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnN1YnN0cmluZygwLCBlbmQpLnRyaW0oKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlLnN1YnN0ciggZW5kICsgZm91bmRfdG9rZW4uZGVmLmNsb3NlLmxlbmd0aCwgMSApID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm91bmRfdG9rZW4uZGVmLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsb2dpY193aGl0ZXNwYWNlX3ByZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxvZ2ljX3doaXRlc3BhY2VfcG9zdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxvZ2ljX3doaXRlc3BhY2VfYm90aFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxvZ2ljXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV3bGluZXMgZGlyZWN0bHkgYWZ0ZXIgbG9naWMgdG9rZW5zIGFyZSBpZ25vcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnN1YnN0cihlbmQgKyBmb3VuZF90b2tlbi5kZWYuY2xvc2UubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCB0aGUgcG9zaXRpb24gaW4gdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgZXJyb3Jfb2Zmc2V0ICs9IGVuZCArIGZvdW5kX3Rva2VuLmRlZi5jbG9zZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gbW9yZSB0b2tlbnMgLT4gYWRkIHRoZSByZXN0IG9mIHRoZSB0ZW1wbGF0ZSBhcyBhIHJhdy10eXBlIHRva2VuXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUucmF3LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgVHdpZy5jb21waWxlID0gZnVuY3Rpb24gKHRva2Vucykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBUd2lnLmF0dGVtcHQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIC8vIE91dHB1dCBhbmQgaW50ZXJtZWRpYXRlIHN0YWNrc1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgICAgICAgICAgIHN0YWNrID0gW10sXG4gICAgICAgICAgICAgICAgLy8gVGhlIHRva2VucyBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlIHRhZ3NcbiAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0ID0gW10sXG5cbiAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgbG9naWNfdG9rZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgIHVuY2xvc2VkX3Rva2VuID0gbnVsbCxcbiAgICAgICAgICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlvdXMgdG9rZW4uXG4gICAgICAgICAgICAgICAgcHJldl90b2tlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpb3VzIG91dHB1dC5cbiAgICAgICAgICAgICAgICBwcmV2X291dHB1dCA9IG51bGwsXG4gICAgICAgICAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpb3VzIGludGVybWVkaWF0ZSBvdXRwdXQuXG4gICAgICAgICAgICAgICAgcHJldl9pbnRlcm1lZGlhdGVfb3V0cHV0ID0gbnVsbCxcbiAgICAgICAgICAgICAgICAvLyBUaGUgcHJldmlvdXMgdG9rZW4ncyB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIHByZXZfdGVtcGxhdGUgPSBudWxsLFxuICAgICAgICAgICAgICAgIC8vIFRva2VuIGxvb2thaGVhZFxuICAgICAgICAgICAgICAgIG5leHRfdG9rZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgIC8vIFRoZSBvdXRwdXQgdG9rZW5cbiAgICAgICAgICAgICAgICB0b2tfb3V0cHV0ID0gbnVsbCxcblxuICAgICAgICAgICAgICAgIC8vIExvZ2ljIFRva2VuIHZhbHVlc1xuICAgICAgICAgICAgICAgIHR5cGUgPSBudWxsLFxuICAgICAgICAgICAgICAgIG9wZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgIG5leHQgPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgY29tcGlsZV9vdXRwdXQgPSBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVybWVkaWF0ZV9vdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBjb21waWxlX2xvZ2ljID0gZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBDb21waWxlIHRoZSBsb2dpYyB0b2tlblxuICAgICAgICAgICAgICAgIGxvZ2ljX3Rva2VuID0gVHdpZy5sb2dpYy5jb21waWxlLmNhbGwoc2VsZiwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgdHlwZSA9IGxvZ2ljX3Rva2VuLnR5cGU7XG4gICAgICAgICAgICAgICAgb3BlbiA9IFR3aWcubG9naWMuaGFuZGxlclt0eXBlXS5vcGVuO1xuICAgICAgICAgICAgICAgIG5leHQgPSBUd2lnLmxvZ2ljLmhhbmRsZXJbdHlwZV0ubmV4dDtcblxuICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5jb21waWxlOiBcIiwgXCJDb21waWxlZCBsb2dpYyB0b2tlbiB0byBcIiwgbG9naWNfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgbmV4dCBpczogXCIsIG5leHQsIFwiIG9wZW4gaXMgOiBcIiwgb3Blbik7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3QgYSBzdGFuZGFsb25lIHRva2VuLCBjaGVjayBsb2dpYyBzdGFjayB0byBzZWUgaWYgdGhpcyBpcyBleHBlY3RlZFxuICAgICAgICAgICAgICAgIGlmIChvcGVuICE9PSB1bmRlZmluZWQgJiYgIW9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldl90b2tlbiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2X3RlbXBsYXRlID0gVHdpZy5sb2dpYy5oYW5kbGVyW3ByZXZfdG9rZW4udHlwZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFR3aWcuaW5kZXhPZihwcmV2X3RlbXBsYXRlLm5leHQsIHR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHR5cGUgKyBcIiBub3QgZXhwZWN0ZWQgYWZ0ZXIgYSBcIiArIHByZXZfdG9rZW4udHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuLm91dHB1dCA9IHByZXZfdG9rZW4ub3V0cHV0IHx8IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHByZXZfdG9rZW4ub3V0cHV0ID0gcHJldl90b2tlbi5vdXRwdXQuY29uY2F0KGludGVybWVkaWF0ZV9vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgdG9rX291dHB1dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcudG9rZW4udHlwZS5sb2dpYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBwcmV2X3Rva2VuXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0LnB1c2godG9rX291dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFRoaXMgdG9rZW4gcmVxdWlyZXMgYWRkaXRpb25hbCB0b2tlbnMgdG8gY29tcGxldGUgdGhlIGxvZ2ljIHN0cnVjdHVyZS5cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkICYmIG5leHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuY29tcGlsZTogXCIsIFwiUHVzaGluZyBcIiwgbG9naWNfdG9rZW4sIFwiIHRvIGxvZ2ljIHN0YWNrLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHV0IGFueSBjdXJyZW50bHkgaGVsZCBvdXRwdXQgaW50byB0aGUgb3V0cHV0IGxpc3Qgb2YgdGhlIGxvZ2ljIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50bHkgYXQgdGhlIGhlYWQgb2YgdGhlIHN0YWNrIGJlZm9yZSB3ZSBwdXNoIGEgbmV3IG9uZSBvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfdG9rZW4gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfdG9rZW4ub3V0cHV0ID0gcHJldl90b2tlbi5vdXRwdXQgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2X3Rva2VuLm91dHB1dCA9IHByZXZfdG9rZW4ub3V0cHV0LmNvbmNhdChpbnRlcm1lZGlhdGVfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gocHJldl90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBQdXNoIHRoZSBuZXcgbG9naWMgdG9rZW4gb250byB0aGUgbG9naWMgc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChsb2dpY190b2tlbik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZW4gIT09IHVuZGVmaW5lZCAmJiBvcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva19vdXRwdXQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLnRva2VuLnR5cGUubG9naWMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogbG9naWNfdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3RhbmRhbG9uZSB0b2tlbiAobGlrZSB7JSBzZXQgLi4uICV9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVfb3V0cHV0LnB1c2godG9rX291dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tfb3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcHJldl9vdXRwdXQgPSBvdXRwdXRbb3V0cHV0Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHByZXZfaW50ZXJtZWRpYXRlX291dHB1dCA9IGludGVybWVkaWF0ZV9vdXRwdXRbaW50ZXJtZWRpYXRlX291dHB1dC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBuZXh0X3Rva2VuID0gdG9rZW5zWzBdO1xuICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiQ29tcGlsaW5nIHRva2VuIFwiLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLnJhdzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUubG9naWM6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlX2xvZ2ljLmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90aGluZywgY29tbWVudHMgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUuY29tbWVudDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLm91dHB1dDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVfb3V0cHV0LmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9LaWxsIHdoaXRlc3BhY2UgYWhlYWQgYW5kIGJlaGluZCB0aGlzIHRva2VuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLmxvZ2ljX3doaXRlc3BhY2VfcHJlOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5sb2dpY193aGl0ZXNwYWNlX3Bvc3Q6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLmxvZ2ljX3doaXRlc3BhY2VfYm90aDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUub3V0cHV0X3doaXRlc3BhY2VfcHJlOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9wb3N0OlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9ib3RoOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9wb3N0ICYmIHRva2VuLnR5cGUgIT09IFR3aWcudG9rZW4udHlwZS5sb2dpY193aGl0ZXNwYWNlX3Bvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldl9vdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgcHJldmlvdXMgb3V0cHV0IGlzIHJhdywgcG9wIGl0IG9mZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldl9vdXRwdXQudHlwZSA9PT0gVHdpZy50b2tlbi50eXBlLnJhdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnBvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBwcmV2aW91cyBvdXRwdXQgaXMgbm90IGp1c3Qgd2hpdGVzcGFjZSwgdHJpbSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZfb3V0cHV0LnZhbHVlLm1hdGNoKC9eXFxzKiQvKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfb3V0cHV0LnZhbHVlID0gcHJldl9vdXRwdXQudmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVwdXNoIHRoZSBwcmV2aW91cyBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChwcmV2X291dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldl9pbnRlcm1lZGlhdGVfb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIHByZXZpb3VzIGludGVybWVkaWF0ZSBvdXRwdXQgaXMgcmF3LCBwb3AgaXQgb2ZmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2ludGVybWVkaWF0ZV9vdXRwdXQudHlwZSA9PT0gVHdpZy50b2tlbi50eXBlLnJhdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlX291dHB1dC5wb3AoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgcHJldmlvdXMgb3V0cHV0IGlzIG5vdCBqdXN0IHdoaXRlc3BhY2UsIHRyaW0gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2ludGVybWVkaWF0ZV9vdXRwdXQudmFsdWUubWF0Y2goL15cXHMqJC8pID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl9pbnRlcm1lZGlhdGVfb3V0cHV0LnZhbHVlID0gcHJldl9pbnRlcm1lZGlhdGVfb3V0cHV0LnZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1JlcHVzaCB0aGUgcHJldmlvdXMgaW50ZXJtZWRpYXRlIG91dHB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybWVkaWF0ZV9vdXRwdXQucHVzaChwcmV2X2ludGVybWVkaWF0ZV9vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0NvbXBpbGUgdGhpcyB0b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUub3V0cHV0X3doaXRlc3BhY2VfcHJlOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLm91dHB1dF93aGl0ZXNwYWNlX3Bvc3Q6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUub3V0cHV0X3doaXRlc3BhY2VfYm90aDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZV9vdXRwdXQuY2FsbChzZWxmLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLmxvZ2ljX3doaXRlc3BhY2VfcHJlOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLmxvZ2ljX3doaXRlc3BhY2VfcG9zdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5sb2dpY193aGl0ZXNwYWNlX2JvdGg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVfbG9naWMuY2FsbChzZWxmLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVHdpZy50b2tlbi50eXBlLm91dHB1dF93aGl0ZXNwYWNlX3ByZSAmJiB0b2tlbi50eXBlICE9PSBUd2lnLnRva2VuLnR5cGUubG9naWNfd2hpdGVzcGFjZV9wcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dF90b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBuZXh0IHRva2VuIGlzIHJhdywgc2hpZnQgaXQgb3V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0X3Rva2VuLnR5cGUgPT09IFR3aWcudG9rZW4udHlwZS5yYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBuZXh0IHRva2VuIGlzIG5vdCBqdXN0IHdoaXRlc3BhY2UsIHRyaW0gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0X3Rva2VuLnZhbHVlLm1hdGNoKC9eXFxzKiQvKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRfdG9rZW4udmFsdWUgPSBuZXh0X3Rva2VuLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Vuc2hpZnQgdGhlIG5leHQgdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbnMudW5zaGlmdChuZXh0X3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmNvbXBpbGU6IFwiLCBcIiBPdXRwdXQ6IFwiLCBvdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgTG9naWMgU3RhY2s6IFwiLCBzdGFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBQZW5kaW5nIE91dHB1dDogXCIsIGludGVybWVkaWF0ZV9vdXRwdXQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlcmUgYXJlIG5vIGxvZ2ljIHRva2VucyBsZWZ0IGluIHRoZSBzdGFjay5cbiAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdW5jbG9zZWRfdG9rZW4gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZmluZCBhbiBlbmQgdGFnIGZvciBcIiArIHVuY2xvc2VkX3Rva2VuLnR5cGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwgZXhwZWN0aW5nIG9uZSBvZiBcIiArIHVuY2xvc2VkX3Rva2VuLm5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMucmV0aHJvdykge1xuICAgICAgICAgICAgICAgIGlmIChleC50eXBlID09ICdUd2lnRXhjZXB0aW9uJyAmJiAhZXguZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBleC5maWxlID0gc2VsZi5pZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aHJvdyBleFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IoXCJFcnJvciBjb21waWxpbmcgdHdpZyB0ZW1wbGF0ZSBcIiArIHNlbGYuaWQgKyBcIjogXCIpO1xuICAgICAgICAgICAgICAgIGlmIChleC5zdGFjaykge1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmxvZy5lcnJvcihleC5zdGFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IoZXgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlRXhjZXB0aW9uKHRoYXQsIGV4KSB7XG4gICAgICAgIGlmICh0aGF0Lm9wdGlvbnMucmV0aHJvdykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBleCA9IG5ldyBUd2lnLkVycm9yKGV4KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXgudHlwZSA9PSAnVHdpZ0V4Y2VwdGlvbicgJiYgIWV4LmZpbGUpIHtcbiAgICAgICAgICAgICAgICBleC5maWxlID0gdGhhdC5pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUd2lnLmxvZy5lcnJvcihcIkVycm9yIHBhcnNpbmcgdHdpZyB0ZW1wbGF0ZSBcIiArIHRoYXQuaWQgKyBcIjogXCIpO1xuICAgICAgICAgICAgaWYgKGV4LnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgVHdpZy5sb2cuZXJyb3IoZXguc3RhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZy5lcnJvcihleC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFR3aWcuZGVidWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgY29tcGlsZWQgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIGNvbXBpbGVkIHRva2Vucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCBUaGUgcmVuZGVyIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBwYXJzZWQgdGVtcGxhdGUuXG4gICAgICovXG4gICAgVHdpZy5wYXJzZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGNvbnRleHQsIGFsbG93X2FzeW5jKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG91dHB1dCA9IFtdLFxuXG4gICAgICAgICAgICAvLyBTdG9yZSBhbnkgZXJyb3IgdGhhdCBtaWdodCBiZSB0aHJvd24gYnkgdGhlIHByb21pc2UgY2hhaW4uXG4gICAgICAgICAgICBlcnIgPSBudWxsLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHdpbGwgYmUgc2V0IHRvIGlzX2FzeW5jIGlmIHRlbXBsYXRlIHJlbmRlcnMgc3luY2hyb25vdXNseVxuICAgICAgICAgICAgaXNfYXN5bmMgPSB0cnVlLFxuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGwsXG5cbiAgICAgICAgICAgIC8vIFRyYWNrIGxvZ2ljIGNoYWluc1xuICAgICAgICAgICAgY2hhaW4gPSB0cnVlO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEV4dHJhY3RlZCBpbnRvIGl0J3Mgb3duIGZ1bmN0aW9uIHN1Y2ggdGhhdCB0aGUgZnVuY3Rpb25cbiAgICAgICAgICogZG9lcyBub3QgZ2V0IHJlY3JlYXRlZCBvdmVyIGFuZCBvdmVyIGFnYWluIGluIHRoZSBgZm9yRWFjaGBcbiAgICAgICAgICogbG9vcCBiZWxvdy4gVGhpcyBtZXRob2QgY2FuIGJlIGNvbXBpbGVkIGFuZCBvcHRpbWl6ZWRcbiAgICAgICAgICogYSBzaW5nbGUgdGltZSBpbnN0ZWFkIG9mIGJlaW5nIHJlY3JlYXRlZCBvbiBlYWNoIGl0ZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG91dHB1dF9wdXNoKG8pIHsgb3V0cHV0LnB1c2gobyk7IH1cblxuICAgICAgICBmdW5jdGlvbiBwYXJzZVRva2VuTG9naWMobG9naWMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbG9naWMuY2hhaW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY2hhaW4gPSBsb2dpYy5jaGFpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbG9naWMuY29udGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gbG9naWMuY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbG9naWMub3V0cHV0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGxvZ2ljLm91dHB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9taXNlID0gVHdpZy5hc3luYy5mb3JFYWNoKHRva2VucywgZnVuY3Rpb24gcGFyc2VUb2tlbih0b2tlbikge1xuICAgICAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLnBhcnNlOiBcIiwgXCJQYXJzaW5nIHRva2VuOiBcIiwgdG9rZW4pO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5yYXc6XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFR3aWcuZmlsdGVycy5yYXcodG9rZW4udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5sb2dpYzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcubG9naWMucGFyc2VBc3luYy5jYWxsKHRoYXQsIHRva2VuLnRva2VuIC8qbG9naWNfdG9rZW4qLywgY29udGV4dCwgY2hhaW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihwYXJzZVRva2VuTG9naWMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLmNvbW1lbnQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdGhpbmcsIGNvbW1lbnRzIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy9GYWxsIHRocm91Z2ggd2hpdGVzcGFjZSB0byBvdXRwdXRcbiAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9wcmU6XG4gICAgICAgICAgICAgICAgY2FzZSBUd2lnLnRva2VuLnR5cGUub3V0cHV0X3doaXRlc3BhY2VfcG9zdDpcbiAgICAgICAgICAgICAgICBjYXNlIFR3aWcudG9rZW4udHlwZS5vdXRwdXRfd2hpdGVzcGFjZV9ib3RoOlxuICAgICAgICAgICAgICAgIGNhc2UgVHdpZy50b2tlbi50eXBlLm91dHB1dDpcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLnBhcnNlOiBcIiwgXCJPdXRwdXQgdG9rZW46IFwiLCB0b2tlbi5zdGFjayk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBnaXZlbiBleHByZXNzaW9uIGluIHRoZSBnaXZlbiBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoYXQsIHRva2VuLnN0YWNrLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ob3V0cHV0X3B1c2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IFR3aWcub3V0cHV0LmNhbGwodGhhdCwgb3V0cHV0KTtcbiAgICAgICAgICAgIGlzX2FzeW5jID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGFsbG93X2FzeW5jKVxuICAgICAgICAgICAgICAgIGhhbmRsZUV4Y2VwdGlvbih0aGF0LCBlKTtcblxuICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgYGFsbG93X2FzeW5jYCB3ZSB3aWxsIGFsd2F5cyByZXR1cm4gYSBwcm9taXNlIHNpbmNlIHdlIGRvIG5vdFxuICAgICAgICAvLyBrbm93IGluIGFkdmFuY2UgaWYgd2UgYXJlIGdvaW5nIHRvIHJ1biBhc3luY2hyb25vdXNseSBvciBub3QuXG4gICAgICAgIGlmIChhbGxvd19hc3luYylcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuXG4gICAgICAgIC8vIEhhbmRsZSBlcnJvcnMgaGVyZSBpZiB3ZSBmYWlsIHN5bmNocm9ub3VzbHkuXG4gICAgICAgIGlmIChlcnIgIT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlRXhjZXB0aW9uKHRoaXMsIGVycik7XG5cbiAgICAgICAgLy8gSWYgYGFsbG93X2FzeW5jYCBpcyBub3QgdHJ1ZSB3ZSBzaG91bGQgbm90IGFsbG93IHRoZSB1c2VyXG4gICAgICAgIC8vIHRvIHVzZSBhc3luY2hyb25vdXMgZnVuY3Rpb25zIG9yIGZpbHRlcnMuXG4gICAgICAgIGlmIChpc19hc3luYylcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKCdZb3UgYXJlIHVzaW5nIFR3aWcuanMgaW4gc3luYyBtb2RlIGluIGNvbWJpbmF0aW9uIHdpdGggYXN5bmMgZXh0ZW5zaW9ucy4nKTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbml6ZSBhbmQgY29tcGlsZSBhIHN0cmluZyB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIFRoZSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgY29tcGlsZWQgdG9rZW5zLlxuICAgICAqL1xuICAgIFR3aWcucHJlcGFyZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIHRva2VucywgcmF3X3Rva2VucztcblxuICAgICAgICAvLyBUb2tlbml6ZVxuICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcucHJlcGFyZTogXCIsIFwiVG9rZW5pemluZyBcIiwgZGF0YSk7XG4gICAgICAgIHJhd190b2tlbnMgPSBUd2lnLnRva2VuaXplLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICAgICAgLy8gQ29tcGlsZVxuICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcucHJlcGFyZTogXCIsIFwiQ29tcGlsaW5nIFwiLCByYXdfdG9rZW5zKTtcbiAgICAgICAgdG9rZW5zID0gVHdpZy5jb21waWxlLmNhbGwodGhpcywgcmF3X3Rva2Vucyk7XG5cbiAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLnByZXBhcmU6IFwiLCBcIkNvbXBpbGVkIFwiLCB0b2tlbnMpO1xuXG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEpvaW4gdGhlIG91dHB1dCB0b2tlbidzIHN0YWNrIGFuZCBlc2NhcGUgaXQgaWYgbmVlZGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBPdXRwdXQgdG9rZW4ncyBzdGFja1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfFN0cmluZ30gQXV0b2VzY2FwZWQgb3V0cHV0XG4gICAgICovXG4gICAgVHdpZy5vdXRwdXQgPSBmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgdmFyIGF1dG9lc2NhcGUgPSB0aGlzLm9wdGlvbnMuYXV0b2VzY2FwZTtcblxuICAgICAgICBpZiAoIWF1dG9lc2NhcGUpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHJhdGVneSA9ICh0eXBlb2YgYXV0b2VzY2FwZSA9PSAnc3RyaW5nJykgPyBhdXRvZXNjYXBlIDogJ2h0bWwnO1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW4gPSBvdXRwdXQubGVuZ3RoLFxuICAgICAgICAgICAgc3RyID0gJyc7XG5cbiAgICAgICAgLy8gW10ubWFwIHdvdWxkIGJlIGJldHRlciBidXQgaXQncyBub3Qgc3VwcG9ydGVkIGJ5IElFOC1cbiAgICAgICAgdmFyIGVzY2FwZWRfb3V0cHV0ID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgc3RyID0gb3V0cHV0W2ldO1xuXG4gICAgICAgICAgICBpZiAoc3RyICYmIChzdHIudHdpZ19tYXJrdXAgIT09IHRydWUgJiYgc3RyLnR3aWdfbWFya3VwICE9PSBzdHJhdGVneSlcbiAgICAgICAgICAgICAgICAmJiAhKHN0cmF0ZWd5ID09PSAnaHRtbCcgJiYgc3RyLnR3aWdfbWFya3VwID09PSAnaHRtbF9hdHRyJykpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBUd2lnLmZpbHRlcnMuZXNjYXBlKHN0ciwgWyBzdHJhdGVneSBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXNjYXBlZF9vdXRwdXRbaV0gPSBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXNjYXBlZF9vdXRwdXQubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybiAnJztcblxuICAgICAgICByZXR1cm4gVHdpZy5NYXJrdXAoZXNjYXBlZF9vdXRwdXQuam9pbihcIlwiKSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gTmFtZXNwYWNlIGZvciB0ZW1wbGF0ZSBzdG9yYWdlIGFuZCByZXRyaWV2YWxcbiAgICBUd2lnLlRlbXBsYXRlcyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZ2lzdGVyZWQgdGVtcGxhdGUgbG9hZGVycyAtIHVzZSBUd2lnLlRlbXBsYXRlcy5yZWdpc3RlckxvYWRlciB0byBhZGQgc3VwcG9ydGVkIGxvYWRlcnNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGxvYWRlcnM6IHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWdpc3RlcmVkIHRlbXBsYXRlIHBhcnNlcnMgLSB1c2UgVHdpZy5UZW1wbGF0ZXMucmVnaXN0ZXJQYXJzZXIgdG8gYWRkIHN1cHBvcnRlZCBwYXJzZXJzXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZXJzOiB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FjaGVkIC8gbG9hZGVkIHRlbXBsYXRlc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgcmVnaXN0cnk6IHt9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIElzIHRoaXMgaWQgdmFsaWQgZm9yIGEgdHdpZyB0ZW1wbGF0ZT9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgdG8gY2hlY2suXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtUd2lnLkVycm9yfSBJZiB0aGUgSUQgaXMgaW52YWxpZCBvciB1c2VkLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIElEIGlzIHZhbGlkLlxuICAgICAqL1xuICAgIFR3aWcudmFsaWRhdGVJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGlmIChpZCA9PT0gXCJwcm90b3R5cGVcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoaWQgKyBcIiBpcyBub3QgYSB2YWxpZCB0d2lnIGlkZW50aWZpZXJcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoVHdpZy5jYWNoZSAmJiBUd2lnLlRlbXBsYXRlcy5yZWdpc3RyeS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVGhlcmUgaXMgYWxyZWFkeSBhIHRlbXBsYXRlIHdpdGggdGhlIElEIFwiICsgaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgdGVtcGxhdGUgbG9hZGVyXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFR3aWcuZXh0ZW5kKGZ1bmN0aW9uKFR3aWcpIHtcbiAgICAgKiAgICBUd2lnLlRlbXBsYXRlcy5yZWdpc3RlckxvYWRlcignY3VzdG9tX2xvYWRlcicsIGZ1bmN0aW9uKGxvY2F0aW9uLCBwYXJhbXMsIGNhbGxiYWNrLCBlcnJvcl9jYWxsYmFjaykge1xuICAgICAqICAgICAgICAvLyAuLi4gbG9hZCB0aGUgdGVtcGxhdGUgLi4uXG4gICAgICogICAgICAgIHBhcmFtcy5kYXRhID0gbG9hZGVkVGVtcGxhdGVEYXRhO1xuICAgICAqICAgICAgICAvLyBjcmVhdGUgYW5kIHJldHVybiB0aGUgdGVtcGxhdGVcbiAgICAgKiAgICAgICAgdmFyIHRlbXBsYXRlID0gbmV3IFR3aWcuVGVtcGxhdGUocGFyYW1zKTtcbiAgICAgKiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAqICAgICAgICAgICAgY2FsbGJhY2sodGVtcGxhdGUpO1xuICAgICAqICAgICAgICB9XG4gICAgICogICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgKiAgICB9KTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RfbmFtZSBUaGUgbWV0aG9kIHRoaXMgbG9hZGVyIGlzIGludGVuZGVkIGZvciAoYWpheCwgZnMpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGxvYWRpbmcgdGhlIHRlbXBsYXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R8dW5kZWZpbmVkfSBzY29wZSBPcHRpb25hbCBzY29wZSBwYXJhbWV0ZXIgdG8gYmluZCBmdW5jIHRvXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFR3aWcuRXJyb3JcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZXMucmVnaXN0ZXJMb2FkZXIgPSBmdW5jdGlvbihtZXRob2RfbmFtZSwgZnVuYywgc2NvcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcignVW5hYmxlIHRvIGFkZCBsb2FkZXIgZm9yICcgKyBtZXRob2RfbmFtZSArICc6IEludmFsaWQgZnVuY3Rpb24gcmVmZXJlbmNlIGdpdmVuLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZSkge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmMuYmluZChzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZXJzW21ldGhvZF9uYW1lXSA9IGZ1bmM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIHJlZ2lzdGVyZWQgbG9hZGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kX25hbWUgVGhlIG1ldGhvZCBuYW1lIGZvciB0aGUgbG9hZGVyIHlvdSB3aXNoIHRvIHJlbW92ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBUd2lnLlRlbXBsYXRlcy51blJlZ2lzdGVyTG9hZGVyID0gZnVuY3Rpb24obWV0aG9kX25hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZWdpc3RlcmVkTG9hZGVyKG1ldGhvZF9uYW1lKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMubG9hZGVyc1ttZXRob2RfbmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VlIGlmIGEgbG9hZGVyIGlzIHJlZ2lzdGVyZWQgYnkgaXRzIG1ldGhvZCBuYW1lXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kX25hbWUgVGhlIG5hbWUgb2YgdGhlIGxvYWRlciB5b3UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIFR3aWcuVGVtcGxhdGVzLmlzUmVnaXN0ZXJlZExvYWRlciA9IGZ1bmN0aW9uKG1ldGhvZF9uYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRlcnMuaGFzT3duUHJvcGVydHkobWV0aG9kX25hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhIHRlbXBsYXRlIHBhcnNlclxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBUd2lnLmV4dGVuZChmdW5jdGlvbihUd2lnKSB7XG4gICAgICogICAgVHdpZy5UZW1wbGF0ZXMucmVnaXN0ZXJQYXJzZXIoJ2N1c3RvbV9wYXJzZXInLCBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgKiAgICAgICAgLy8gdGhpcyB0ZW1wbGF0ZSBzb3VyY2UgY2FuIGJlIGFjY2Vzc2VkIGluIHBhcmFtcy5kYXRhXG4gICAgICogICAgICAgIHZhciB0ZW1wbGF0ZSA9IHBhcmFtcy5kYXRhXG4gICAgICpcbiAgICAgKiAgICAgICAgLy8gLi4uIGN1c3RvbSBwcm9jZXNzIHRoYXQgbW9kaWZpZXMgdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiAgICAgICAgLy8gcmV0dXJuIHRoZSBwYXJzZWQgdGVtcGxhdGVcbiAgICAgKiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAqICAgIH0pO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZF9uYW1lIFRoZSBtZXRob2QgdGhpcyBwYXJzZXIgaXMgaW50ZW5kZWQgZm9yICh0d2lnLCBzb3VyY2UpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHBhcnNpbmcgdGhlIHRlbXBsYXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R8dW5kZWZpbmVkfSBzY29wZSBPcHRpb25hbCBzY29wZSBwYXJhbWV0ZXIgdG8gYmluZCBmdW5jIHRvXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFR3aWcuRXJyb3JcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZXMucmVnaXN0ZXJQYXJzZXIgPSBmdW5jdGlvbihtZXRob2RfbmFtZSwgZnVuYywgc2NvcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcignVW5hYmxlIHRvIGFkZCBwYXJzZXIgZm9yICcgKyBtZXRob2RfbmFtZSArICc6IEludmFsaWQgZnVuY3Rpb24gcmVnZXJlbmNlIGdpdmVuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjb3BlKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuYy5iaW5kKHNjb3BlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFyc2Vyc1ttZXRob2RfbmFtZV0gPSBmdW5jO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSByZWdpc3RlcmVkIHBhcnNlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZF9uYW1lIFRoZSBtZXRob2QgbmFtZSBmb3IgdGhlIHBhcnNlciB5b3Ugd2lzaCB0byByZW1vdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZXMudW5SZWdpc3RlclBhcnNlciA9IGZ1bmN0aW9uKG1ldGhvZF9uYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVnaXN0ZXJlZFBhcnNlcihtZXRob2RfbmFtZSkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBhcnNlcnNbbWV0aG9kX25hbWVdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNlZSBpZiBhIHBhcnNlciBpcyByZWdpc3RlcmVkIGJ5IGl0cyBtZXRob2QgbmFtZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZF9uYW1lIFRoZSBuYW1lIG9mIHRoZSBwYXJzZXIgeW91IGFyZSBsb29raW5nIGZvclxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBUd2lnLlRlbXBsYXRlcy5pc1JlZ2lzdGVyZWRQYXJzZXIgPSBmdW5jdGlvbihtZXRob2RfbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXJzLmhhc093blByb3BlcnR5KG1ldGhvZF9uYW1lKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2F2ZSBhIHRlbXBsYXRlIG9iamVjdCB0byB0aGUgc3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1R3aWcuVGVtcGxhdGV9IHRlbXBsYXRlICAgVGhlIHR3aWcuanMgdGVtcGxhdGUgdG8gc3RvcmUuXG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZXMuc2F2ZSA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuYWJsZSB0byBzYXZlIHRlbXBsYXRlIHdpdGggbm8gaWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgVHdpZy5UZW1wbGF0ZXMucmVnaXN0cnlbdGVtcGxhdGUuaWRdID0gdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvYWQgYSBwcmV2aW91c2x5IHNhdmVkIHRlbXBsYXRlIGZyb20gdGhlIHN0b3JlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkICAgVGhlIElEIG9mIHRoZSB0ZW1wbGF0ZSB0byBsb2FkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7VHdpZy5UZW1wbGF0ZX0gQSB0d2lnLmpzIHRlbXBsYXRlIHN0b3JlZCB3aXRoIHRoZSBwcm92aWRlZCBJRC5cbiAgICAgKi9cbiAgICBUd2lnLlRlbXBsYXRlcy5sb2FkID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgaWYgKCFUd2lnLlRlbXBsYXRlcy5yZWdpc3RyeS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBUd2lnLlRlbXBsYXRlcy5yZWdpc3RyeVtpZF07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvYWQgYSB0ZW1wbGF0ZSBmcm9tIGEgcmVtb3RlIGxvY2F0aW9uIHVzaW5nIEFKQVggYW5kIHNhdmVzIGluIHdpdGggdGhlIGdpdmVuIElELlxuICAgICAqXG4gICAgICogQXZhaWxhYmxlIHBhcmFtZXRlcnM6XG4gICAgICpcbiAgICAgKiAgICAgIGFzeW5jOiAgICAgICBTaG91bGQgdGhlIEhUVFAgcmVxdWVzdCBiZSBwZXJmb3JtZWQgYXN5bmNocm9ub3VzbHkuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICAgKiAgICAgIG1ldGhvZDogICAgICBXaGF0IG1ldGhvZCBzaG91bGQgYmUgdXNlZCB0byBsb2FkIHRoZSB0ZW1wbGF0ZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIChmcyBvciBhamF4KVxuICAgICAqICAgICAgcGFyc2VyOiAgICAgIFdoYXQgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIHBhcnNlIHRoZSB0ZW1wbGF0ZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICh0d2lnIG9yIHNvdXJjZSlcbiAgICAgKiAgICAgIHByZWNvbXBpbGVkOiBIYXMgdGhlIHRlbXBsYXRlIGFscmVhZHkgYmVlbiBjb21waWxlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiAgVGhlIHJlbW90ZSBVUkwgdG8gbG9hZCBhcyBhIHRlbXBsYXRlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHRlbXBsYXRlIHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgIEEgY2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gdGhlIHRlbXBsYXRlIGZpbmlzaGVzIGxvYWRpbmcuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZXJyb3JfY2FsbGJhY2sgIEEgY2FsbGJhY2sgdHJpZ2dlcmVkIGlmIGFuIGVycm9yIG9jY3VycyBsb2FkaW5nIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqXG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZSA9IGZ1bmN0aW9uKGxvY2F0aW9uLCBwYXJhbXMsIGNhbGxiYWNrLCBlcnJvcl9jYWxsYmFjaykge1xuICAgICAgICB2YXIgbG9hZGVyLFxuICAgICAgICAgICAgLy8gRGVmYXVsdCB0byB0aGUgVVJMIHNvIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXG4gICAgICAgICAgICBpZCA9IHR5cGVvZiBwYXJhbXMuaWQgPT0gJ3VuZGVmaW5lZCcgPyBsb2NhdGlvbiA6IHBhcmFtcy5pZCxcbiAgICAgICAgICAgIGNhY2hlZCA9IFR3aWcuVGVtcGxhdGVzLnJlZ2lzdHJ5W2lkXTtcblxuICAgICAgICAvLyBDaGVjayBmb3IgZXhpc3RpbmcgdGVtcGxhdGVcbiAgICAgICAgaWYgKFR3aWcuY2FjaGUgJiYgdHlwZW9mIGNhY2hlZCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgLy8gQSB0ZW1wbGF0ZSBpcyBhbHJlYWR5IHNhdmVkIHdpdGggdGhlIGdpdmVuIGlkLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUT0RPOiBpZiBhc3luYywgcmV0dXJuIGRlZmVycmVkIHByb21pc2VcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBwYXJzZXIgbmFtZSBoYXNuJ3QgYmVlbiBzZXQsIGRlZmF1bHQgaXQgdG8gdHdpZ1xuICAgICAgICBwYXJhbXMucGFyc2VyID0gcGFyYW1zLnBhcnNlciB8fCAndHdpZyc7XG4gICAgICAgIHBhcmFtcy5pZCA9IGlkO1xuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gYXN5bmNcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuYXN5bmMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBwYXJhbXMuYXN5bmMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzdW1lICdmcycgaWYgdGhlIGxvYWRlciBpcyBub3QgZGVmaW5lZFxuICAgICAgICBsb2FkZXIgPSB0aGlzLmxvYWRlcnNbcGFyYW1zLm1ldGhvZF0gfHwgdGhpcy5sb2FkZXJzLmZzO1xuICAgICAgICByZXR1cm4gbG9hZGVyLmNhbGwodGhpcywgbG9jYXRpb24sIHBhcmFtcywgY2FsbGJhY2ssIGVycm9yX2NhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgLy8gRGV0ZXJtaW5lIG9iamVjdCB0eXBlXG4gICAgZnVuY3Rpb24gaXModHlwZSwgb2JqKSB7XG4gICAgICAgIHZhciBjbGFzID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikuc2xpY2UoOCwgLTEpO1xuICAgICAgICByZXR1cm4gb2JqICE9PSB1bmRlZmluZWQgJiYgb2JqICE9PSBudWxsICYmIGNsYXMgPT09IHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IHR3aWcuanMgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBQYXJhbWV0ZXJzOiB7XG4gICAgICogICAgICBkYXRhOiAgIFRoZSB0ZW1wbGF0ZSwgZWl0aGVyIHByZS1jb21waWxlZCB0b2tlbnMgb3IgYSBzdHJpbmcgdGVtcGxhdGVcbiAgICAgKiAgICAgIGlkOiAgICAgVGhlIG5hbWUgb2YgdGhpcyB0ZW1wbGF0ZVxuICAgICAqICAgICAgYmxvY2tzOiBBbnkgcHJlLWV4aXN0aW5nIGJsb2NrIGZyb20gYSBjaGlsZCB0ZW1wbGF0ZVxuICAgICAqIH1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHRlbXBsYXRlIHBhcmFtZXRlcnMuXG4gICAgICovXG4gICAgVHdpZy5UZW1wbGF0ZSA9IGZ1bmN0aW9uICggcGFyYW1zICkge1xuICAgICAgICB2YXIgZGF0YSA9IHBhcmFtcy5kYXRhLFxuICAgICAgICAgICAgaWQgPSBwYXJhbXMuaWQsXG4gICAgICAgICAgICBibG9ja3MgPSBwYXJhbXMuYmxvY2tzLFxuICAgICAgICAgICAgbWFjcm9zID0gcGFyYW1zLm1hY3JvcyB8fCB7fSxcbiAgICAgICAgICAgIGJhc2UgPSBwYXJhbXMuYmFzZSxcbiAgICAgICAgICAgIHBhdGggPSBwYXJhbXMucGF0aCxcbiAgICAgICAgICAgIHVybCA9IHBhcmFtcy51cmwsXG4gICAgICAgICAgICBuYW1lID0gcGFyYW1zLm5hbWUsXG4gICAgICAgICAgICBtZXRob2QgPSBwYXJhbXMubWV0aG9kLFxuICAgICAgICAgICAgLy8gcGFyc2VyIG9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSBwYXJhbXMub3B0aW9ucztcblxuICAgICAgICAvLyAjIFdoYXQgaXMgc3RvcmVkIGluIGEgVHdpZy5UZW1wbGF0ZVxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgVHdpZyBUZW1wbGF0ZSBob2xkIHNldmVyYWwgY2h1Y2tzIG9mIGRhdGEuXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgIGlkOiAgICAgVGhlIHRva2VuIElEIChpZiBhbnkpXG4gICAgICAgIC8vICAgICAgICAgIHRva2VuczogVGhlIGxpc3Qgb2YgdG9rZW5zIHRoYXQgbWFrZXMgdXAgdGhpcyB0ZW1wbGF0ZS5cbiAgICAgICAgLy8gICAgICAgICAgYmxvY2tzOiBUaGUgbGlzdCBvZiBibG9jayB0aGlzIHRlbXBsYXRlIGNvbnRhaW5zLlxuICAgICAgICAvLyAgICAgICAgICBiYXNlOiAgIFRoZSBiYXNlIHRlbXBsYXRlIChpZiBhbnkpXG4gICAgICAgIC8vICAgICAgICAgICAgb3B0aW9uczogIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgQ29tcGlsZXIvcGFyc2VyIG9wdGlvbnNcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgc3RyaWN0X3ZhcmlhYmxlczogdHJ1ZS9mYWxzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgU2hvdWxkIG1pc3NpbmcgdmFyaWFibGUva2V5cyBlbWl0IGFuIGVycm9yIG1lc3NhZ2UuIElmIGZhbHNlLCB0aGV5IGRlZmF1bHQgdG8gbnVsbC5cbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vXG5cbiAgICAgICAgdGhpcy5pZCAgICAgPSBpZDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMuYmFzZSAgID0gYmFzZTtcbiAgICAgICAgdGhpcy5wYXRoICAgPSBwYXRoO1xuICAgICAgICB0aGlzLnVybCAgICA9IHVybDtcbiAgICAgICAgdGhpcy5uYW1lICAgPSBuYW1lO1xuICAgICAgICB0aGlzLm1hY3JvcyA9IG1hY3JvcztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLnJlc2V0KGJsb2Nrcyk7XG5cbiAgICAgICAgaWYgKGlzKCdTdHJpbmcnLCBkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMgPSBUd2lnLnByZXBhcmUuY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBUd2lnLlRlbXBsYXRlcy5zYXZlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFR3aWcuVGVtcGxhdGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oYmxvY2tzKSB7XG4gICAgICAgIFR3aWcubG9nLmRlYnVnKFwiVHdpZy5UZW1wbGF0ZS5yZXNldFwiLCBcIlJlc2V0aW5nIHRlbXBsYXRlIFwiICsgdGhpcy5pZCk7XG4gICAgICAgIHRoaXMuYmxvY2tzID0ge307XG4gICAgICAgIHRoaXMuaW1wb3J0ZWRCbG9ja3MgPSBbXTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbEJsb2NrVG9rZW5zID0ge307XG4gICAgICAgIHRoaXMuY2hpbGQgPSB7XG4gICAgICAgICAgICBibG9ja3M6IGJsb2NrcyB8fCB7fVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmV4dGVuZCA9IG51bGw7XG4gICAgICAgIHRoaXMucGFyc2VTdGFjayA9IFtdO1xuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY29udGV4dCwgcGFyYW1zLCBhbGxvd19hc3luYykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB7fTtcblxuICAgICAgICAvLyBDbGVhciBhbnkgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5ibG9ja3MpIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzID0gcGFyYW1zLmJsb2NrcztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5tYWNyb3MpIHtcbiAgICAgICAgICAgIHRoaXMubWFjcm9zID0gcGFyYW1zLm1hY3JvcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBUd2lnLmFzeW5jLnBvdGVudGlhbGx5QXN5bmModGhpcywgYWxsb3dfYXN5bmMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFR3aWcucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRoaXMudG9rZW5zLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXh0X3RlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICB1cmw7XG5cbiAgICAgICAgICAgICAgICAvLyBEb2VzIHRoaXMgdGVtcGxhdGUgZXh0ZW5kIGFub3RoZXJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5leHRlbmQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgdGVtcGxhdGUgaXMgcHJvdmlkZWQgaW5saW5lXG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhhdC5vcHRpb25zLmFsbG93SW5saW5lSW5jbHVkZXMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRfdGVtcGxhdGUgPSBUd2lnLlRlbXBsYXRlcy5sb2FkKHRoYXQuZXh0ZW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZXh0X3RlbXBsYXRlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dF90ZW1wbGF0ZS5vcHRpb25zID0gdGhhdC5vcHRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHRoZSB0ZW1wbGF0ZSBmaWxlIHZpYSBpbmNsdWRlXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXh0X3RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBUd2lnLnBhdGgucGFyc2VQYXRoKHRoYXQsIHRoYXQuZXh0ZW5kKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0X3RlbXBsYXRlID0gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZSh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IHRoYXQuZ2V0TG9hZGVyTWV0aG9kKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZTogdGhhdC5iYXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogdGhhdC5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucGFyZW50ID0gZXh0X3RlbXBsYXRlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGF0LnBhcmVudC5yZW5kZXJBc3luYyh0aGF0LmNvbnRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrczogdGhhdC5ibG9ja3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0luY2x1ZGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMub3V0cHV0ID09ICdibG9ja3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGF0LmJsb2NrcztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5vdXRwdXQgPT0gJ21hY3JvcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQubWFjcm9zO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmlzSW5jbHVkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5pbXBvcnRGaWxlID0gZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICB2YXIgdXJsLCBzdWJfdGVtcGxhdGU7XG4gICAgICAgIGlmICghdGhpcy51cmwgJiYgdGhpcy5vcHRpb25zLmFsbG93SW5saW5lSW5jbHVkZXMpIHtcbiAgICAgICAgICAgIGZpbGUgPSB0aGlzLnBhdGggPyBUd2lnLnBhdGgucGFyc2VQYXRoKHRoaXMsIGZpbGUpIDogZmlsZTtcbiAgICAgICAgICAgIHN1Yl90ZW1wbGF0ZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWQoZmlsZSk7XG5cbiAgICAgICAgICAgIGlmICghc3ViX3RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgc3ViX3RlbXBsYXRlID0gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZSh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogdGhpcy5nZXRMb2FkZXJNZXRob2QoKSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghc3ViX3RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIGZpbmQgdGhlIHRlbXBsYXRlIFwiICsgZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdWJfdGVtcGxhdGUub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICAgICAgcmV0dXJuIHN1Yl90ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybCA9IFR3aWcucGF0aC5wYXJzZVBhdGgodGhpcywgZmlsZSk7XG5cbiAgICAgICAgLy8gTG9hZCBibG9ja3MgZnJvbSBhbiBleHRlcm5hbCBmaWxlXG4gICAgICAgIHN1Yl90ZW1wbGF0ZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUodXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMuZ2V0TG9hZGVyTWV0aG9kKCksXG4gICAgICAgICAgICBiYXNlOiB0aGlzLmJhc2UsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICBpZDogdXJsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdWJfdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIFR3aWcuVGVtcGxhdGUucHJvdG90eXBlLmltcG9ydEJsb2NrcyA9IGZ1bmN0aW9uKGZpbGUsIG92ZXJyaWRlKSB7XG4gICAgICAgIHZhciBzdWJfdGVtcGxhdGUgPSB0aGlzLmltcG9ydEZpbGUoZmlsZSksXG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcy5jb250ZXh0LFxuICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgb3ZlcnJpZGUgPSBvdmVycmlkZSB8fCBmYWxzZTtcblxuICAgICAgICBzdWJfdGVtcGxhdGUucmVuZGVyKGNvbnRleHQpO1xuXG4gICAgICAgIC8vIE1peGluIGJsb2Nrc1xuICAgICAgICBUd2lnLmZvckVhY2goT2JqZWN0LmtleXMoc3ViX3RlbXBsYXRlLmJsb2NrcyksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRlIHx8IHRoYXQuYmxvY2tzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoYXQuYmxvY2tzW2tleV0gPSBzdWJfdGVtcGxhdGUuYmxvY2tzW2tleV07XG4gICAgICAgICAgICAgICAgdGhhdC5pbXBvcnRlZEJsb2Nrcy5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBUd2lnLlRlbXBsYXRlLnByb3RvdHlwZS5pbXBvcnRNYWNyb3MgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHZhciB1cmwgPSBUd2lnLnBhdGgucGFyc2VQYXRoKHRoaXMsIGZpbGUpO1xuXG4gICAgICAgIC8vIGxvYWQgcmVtb3RlIHRlbXBsYXRlXG4gICAgICAgIHZhciByZW1vdGVUZW1wbGF0ZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUodXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMuZ2V0TG9hZGVyTWV0aG9kKCksXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBpZDogdXJsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZW1vdGVUZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgVHdpZy5UZW1wbGF0ZS5wcm90b3R5cGUuZ2V0TG9hZGVyTWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnZnMnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnVybCkge1xuICAgICAgICAgICAgcmV0dXJuICdhamF4JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2QgfHwgJ2ZzJztcbiAgICB9O1xuXG4gICAgVHdpZy5UZW1wbGF0ZS5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgLy8gY29tcGlsZSB0aGUgdGVtcGxhdGUgaW50byByYXcgSlNcbiAgICAgICAgcmV0dXJuIFR3aWcuY29tcGlsZXIuY29tcGlsZSh0aGlzLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNhZmUgb3V0cHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gQ29udGVudCBzYWZlIHRvIG91dHB1dFxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBDb250ZW50IHdyYXBwZWQgaW50byBhIFN0cmluZ1xuICAgICAqL1xuXG4gICAgVHdpZy5NYXJrdXAgPSBmdW5jdGlvbihjb250ZW50LCBzdHJhdGVneSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgIT09ICdzdHJpbmcnIHx8IGNvbnRlbnQubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuXG4gICAgICAgIHZhciBvdXRwdXQgPSBuZXcgU3RyaW5nKGNvbnRlbnQpO1xuICAgICAgICBvdXRwdXQudHdpZ19tYXJrdXAgPSAodHlwZW9mIHN0cmF0ZWd5ID09ICd1bmRlZmluZWQnKSA/IHRydWUgOiBzdHJhdGVneTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG5cbiAgICByZXR1cm4gVHdpZztcblxufTtcblxuXG4vKioqLyB9KSxcbi8qIDUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuLy8gIyMgdHdpZy5jb21waWxlci5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIGNvbXBpbGluZyB0ZW1wbGF0ZXMgaW50byBKU1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVHdpZykge1xuICAgIC8qKlxuICAgICAqIE5hbWVzcGFjZSBmb3IgY29tcGlsYXRpb24uXG4gICAgICovXG4gICAgVHdpZy5jb21waWxlciA9IHtcbiAgICAgICAgbW9kdWxlOiB7fVxuICAgIH07XG5cbiAgICAvLyBDb21waWxlIGEgVHdpZyBUZW1wbGF0ZSB0byBvdXRwdXQuXG4gICAgVHdpZy5jb21waWxlci5jb21waWxlID0gZnVuY3Rpb24odGVtcGxhdGUsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gR2V0IHRva2Vuc1xuICAgICAgICB2YXIgdG9rZW5zID0gSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUudG9rZW5zKVxuICAgICAgICAgICAgLCBpZCA9IHRlbXBsYXRlLmlkXG4gICAgICAgICAgICAsIG91dHB1dDtcblxuICAgICAgICBpZiAob3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgICAgICAgIGlmIChUd2lnLmNvbXBpbGVyLm1vZHVsZVtvcHRpb25zLm1vZHVsZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIGZpbmQgbW9kdWxlIHR5cGUgXCIgKyBvcHRpb25zLm1vZHVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXRwdXQgPSBUd2lnLmNvbXBpbGVyLm1vZHVsZVtvcHRpb25zLm1vZHVsZV0oaWQsIHRva2Vucywgb3B0aW9ucy50d2lnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dCA9IFR3aWcuY29tcGlsZXIud3JhcChpZCwgdG9rZW5zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG5cbiAgICBUd2lnLmNvbXBpbGVyLm1vZHVsZSA9IHtcbiAgICAgICAgYW1kOiBmdW5jdGlvbihpZCwgdG9rZW5zLCBwYXRoVG9Ud2lnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RlZmluZShbXCInICsgcGF0aFRvVHdpZyArICdcIl0sIGZ1bmN0aW9uIChUd2lnKSB7XFxuXFx0dmFyIHR3aWcsIHRlbXBsYXRlcztcXG50d2lnID0gVHdpZy50d2lnO1xcbnRlbXBsYXRlcyA9ICcgKyBUd2lnLmNvbXBpbGVyLndyYXAoaWQsIHRva2VucykgKyAnXFxuXFx0cmV0dXJuIHRlbXBsYXRlcztcXG59KTsnO1xuICAgICAgICB9XG4gICAgICAgICwgbm9kZTogZnVuY3Rpb24oaWQsIHRva2Vucykge1xuICAgICAgICAgICAgcmV0dXJuICd2YXIgdHdpZyA9IHJlcXVpcmUoXCJ0d2lnXCIpLnR3aWc7XFxuJ1xuICAgICAgICAgICAgICAgICsgJ2V4cG9ydHMudGVtcGxhdGUgPSAnICsgVHdpZy5jb21waWxlci53cmFwKGlkLCB0b2tlbnMpXG4gICAgICAgIH1cbiAgICAgICAgLCBjanMyOiBmdW5jdGlvbihpZCwgdG9rZW5zLCBwYXRoVG9Ud2lnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ21vZHVsZS5kZWNsYXJlKFt7IHR3aWc6IFwiJyArIHBhdGhUb1R3aWcgKyAnXCIgfV0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcXG4nXG4gICAgICAgICAgICAgICAgICAgICAgICArICdcXHR2YXIgdHdpZyA9IHJlcXVpcmUoXCJ0d2lnXCIpLnR3aWc7XFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFx0ZXhwb3J0cy50ZW1wbGF0ZSA9ICcgKyBUd2lnLmNvbXBpbGVyLndyYXAoaWQsIHRva2VucylcbiAgICAgICAgICAgICAgICAgICAgKyAnXFxufSk7J1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFR3aWcuY29tcGlsZXIud3JhcCA9IGZ1bmN0aW9uKGlkLCB0b2tlbnMpIHtcbiAgICAgICAgcmV0dXJuICd0d2lnKHtpZDpcIicraWQucmVwbGFjZSgnXCInLCAnXFxcXFwiJykrJ1wiLCBkYXRhOicrdG9rZW5zKycsIHByZWNvbXBpbGVkOiB0cnVlfSk7XFxuJztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG59O1xuXG5cbi8qKiovIH0pLFxuLyogNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG4vLyAjIyB0d2lnLmV4cHJlc3Npb24uanNcbi8vXG4vLyBUaGlzIGZpbGUgaGFuZGxlcyB0b2tlbml6aW5nLCBjb21waWxpbmcgYW5kIHBhcnNpbmcgZXhwcmVzc2lvbnMuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUd2lnKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBwYXJzZVBhcmFtcyh0aGlzQXJnLCBwYXJhbXMsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKHBhcmFtcylcbiAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXNBcmcsIHBhcmFtcywgY29udGV4dCk7XG5cbiAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOYW1lc3BhY2UgZm9yIGV4cHJlc3Npb24gaGFuZGxpbmcuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uID0geyB9O1xuXG4gICAgX193ZWJwYWNrX3JlcXVpcmVfXyg3KShUd2lnKTtcblxuICAgIC8qKlxuICAgICAqIFJlc2VydmVkIHdvcmQgdGhhdCBjYW4ndCBiZSB1c2VkIGFzIHZhcmlhYmxlIG5hbWVzLlxuICAgICAqL1xuICAgIFR3aWcuZXhwcmVzc2lvbi5yZXNlcnZlZFdvcmRzID0gW1xuICAgICAgICBcInRydWVcIiwgXCJmYWxzZVwiLCBcIm51bGxcIiwgXCJUUlVFXCIsIFwiRkFMU0VcIiwgXCJOVUxMXCIsIFwiX2NvbnRleHRcIiwgXCJhbmRcIiwgXCJiLWFuZFwiLCBcIm9yXCIsIFwiYi1vclwiLCBcImIteG9yXCIsIFwiaW5cIiwgXCJub3QgaW5cIiwgXCJpZlwiLCBcIm1hdGNoZXNcIiwgXCJzdGFydHNcIiwgXCJlbmRzXCIsIFwid2l0aFwiXG4gICAgXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIHRva2VucyB1c2VkIGluIGV4cHJlc3Npb25zLlxuICAgICAqL1xuICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlID0ge1xuICAgICAgICBjb21tYTogICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuY29tbWEnLFxuICAgICAgICBvcGVyYXRvcjoge1xuICAgICAgICAgICAgdW5hcnk6ICAnVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IudW5hcnknLFxuICAgICAgICAgICAgYmluYXJ5OiAnVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5J1xuICAgICAgICB9LFxuICAgICAgICBzdHJpbmc6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nJyxcbiAgICAgICAgYm9vbDogICAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmJvb2wnLFxuICAgICAgICBzbGljZTogICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuc2xpY2UnLFxuICAgICAgICBhcnJheToge1xuICAgICAgICAgICAgc3RhcnQ6ICAnVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuc3RhcnQnLFxuICAgICAgICAgICAgZW5kOiAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBvYmplY3Q6IHtcbiAgICAgICAgICAgIHN0YXJ0OiAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5zdGFydCcsXG4gICAgICAgICAgICBlbmQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3QuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBwYXJhbWV0ZXI6IHtcbiAgICAgICAgICAgIHN0YXJ0OiAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCcsXG4gICAgICAgICAgICBlbmQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBzdWJleHByZXNzaW9uOiB7XG4gICAgICAgICAgICBzdGFydDogICdUd2lnLmV4cHJlc3Npb24udHlwZS5zdWJleHByZXNzaW9uLnN0YXJ0JyxcbiAgICAgICAgICAgIGVuZDogICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLnN1YmV4cHJlc3Npb24uZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgIHBlcmlvZDogICAnVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LnBlcmlvZCcsXG4gICAgICAgICAgICBicmFja2V0czogJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmtleS5icmFja2V0cydcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyOiAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLmZpbHRlcicsXG4gICAgICAgIF9mdW5jdGlvbjogICdUd2lnLmV4cHJlc3Npb24udHlwZS5fZnVuY3Rpb24nLFxuICAgICAgICB2YXJpYWJsZTogICAnVHdpZy5leHByZXNzaW9uLnR5cGUudmFyaWFibGUnLFxuICAgICAgICBudW1iZXI6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUubnVtYmVyJyxcbiAgICAgICAgX251bGw6ICAgICAnVHdpZy5leHByZXNzaW9uLnR5cGUubnVsbCcsXG4gICAgICAgIGNvbnRleHQ6ICAgICdUd2lnLmV4cHJlc3Npb24udHlwZS5jb250ZXh0JyxcbiAgICAgICAgdGVzdDogICAgICAgJ1R3aWcuZXhwcmVzc2lvbi50eXBlLnRlc3QnXG4gICAgfTtcblxuICAgIFR3aWcuZXhwcmVzc2lvbi5zZXQgPSB7XG4gICAgICAgIC8vIFdoYXQgY2FuIGZvbGxvdyBhbiBleHByZXNzaW9uIChpbiBnZW5lcmFsKVxuICAgICAgICBvcGVyYXRpb25zOiBbXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5maWx0ZXIsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLmJpbmFyeSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LmVuZCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5lbmQsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kLFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUuc3ViZXhwcmVzc2lvbi5lbmQsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5jb21tYSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLnRlc3RcbiAgICAgICAgXSxcbiAgICAgICAgZXhwcmVzc2lvbnM6IFtcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLl9mdW5jdGlvbixcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLmJvb2wsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5zdHJpbmcsXG4gICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS52YXJpYWJsZSxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm51bWJlcixcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLl9udWxsLFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUuY29udGV4dCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LnN0YXJ0LFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LnN0YXJ0LFxuICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUuc3ViZXhwcmVzc2lvbi5zdGFydCxcbiAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLnVuYXJ5XG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgLy8gTW9zdCBleHByZXNzaW9ucyBhbGxvdyBhICcuJyBvciAnWycgYWZ0ZXIgdGhlbSwgc28gd2UgcHJvdmlkZSBhIGNvbnZlbmllbmNlIHNldFxuICAgIFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZCA9IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9ucy5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5rZXkucGVyaW9kLFxuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5rZXkuYnJhY2tldHMsXG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi50eXBlLnNsaWNlXSk7XG5cbiAgICAvLyBTb21lIGNvbW1vbmx5IHVzZWQgY29tcGlsZSBhbmQgcGFyc2UgZnVuY3Rpb25zLlxuICAgIFR3aWcuZXhwcmVzc2lvbi5mbiA9IHtcbiAgICAgICAgY29tcGlsZToge1xuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHVzaF9ib3RoOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcGFyc2U6IHtcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1c2hfdmFsdWU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGFuZCBjb21waWxlL3BhcnNlIGxvZ2ljIHVzZWQgdG8gbWF0Y2ggdG9rZW5zIGluIGV4cHJlc3Npb25zLlxuICAgIC8vXG4gICAgLy8gUHJvcGVydGllczpcbiAgICAvL1xuICAgIC8vICAgICAgdHlwZTogIFRoZSB0eXBlIG9mIGV4cHJlc3Npb24gdGhpcyBtYXRjaGVzXG4gICAgLy9cbiAgICAvLyAgICAgIHJlZ2V4OiBPbmUgb3IgbW9yZSByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgbWF0Y2hlIHRoZSBmb3JtYXQgb2YgdGhlIHRva2VuLlxuICAgIC8vXG4gICAgLy8gICAgICBuZXh0OiAgVmFsaWQgdG9rZW5zIHRoYXQgY2FuIG9jY3VyIG5leHQgaW4gdGhlIGV4cHJlc3Npb24uXG4gICAgLy9cbiAgICAvLyBGdW5jdGlvbnM6XG4gICAgLy9cbiAgICAvLyAgICAgIGNvbXBpbGU6IEEgZnVuY3Rpb24gdGhhdCBjb21waWxlcyB0aGUgcmF3IHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaCBpbnRvIGEgdG9rZW4uXG4gICAgLy9cbiAgICAvLyAgICAgIHBhcnNlOiAgIEEgZnVuY3Rpb24gdGhhdCBwYXJzZXMgdGhlIGNvbXBpbGVkIHRva2VuIGludG8gb3V0cHV0LlxuICAgIC8vXG4gICAgVHdpZy5leHByZXNzaW9uLmRlZmluaXRpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0LFxuICAgICAgICAgICAgcmVnZXg6IC9eaXNcXHMrKG5vdCk/XFxzKihbYS16QS1aX11bYS16QS1aMC05X10qKFxccz9hcyk/KS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4uZmlsdGVyICAgPSB0b2tlbi5tYXRjaFsyXTtcbiAgICAgICAgICAgICAgICB0b2tlbi5tb2RpZmllciA9IHRva2VuLm1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzdGFjay5wb3AoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVBhcmFtcyh0aGlzLCB0b2tlbi5wYXJhbXMsIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBUd2lnLnRlc3QodG9rZW4uZmlsdGVyLCB2YWx1ZSwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4ubW9kaWZpZXIgPT0gJ25vdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIXJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuY29tbWEsXG4gICAgICAgICAgICAvLyBNYXRjaCBhIGNvbW1hXG4gICAgICAgICAgICByZWdleDogL14sLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5lbmQsIFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5lbmRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBzdGFjay5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbjtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvLyBwb3AgdG9rZW5zIG9mZiB0aGUgc3RhY2sgdW50aWwgdGhlIHN0YXJ0IG9mIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgICBmb3IoO2kgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vYmplY3Quc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIG51bWJlciAoaW50ZWdlciBvciBkZWNpbWFsKVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5udW1iZXIsXG4gICAgICAgICAgICAvLyBtYXRjaCBhIG51bWJlclxuICAgICAgICAgICAgcmVnZXg6IC9eXFwtP1xcZCsoXFwuXFxkKyk/LyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9ucyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBOdW1iZXIodG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hfdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IuYmluYXJ5LFxuICAgICAgICAgICAgLy8gTWF0Y2ggYW55IG9mID8/LCA/OiwgKywgKiwgLywgLSwgJSwgfiwgPCwgPD0sID4sID49LCAhPSwgPT0sICoqLCA/LCA6LCBhbmQsIGItYW5kLCBvciwgYi1vciwgYi14b3IsIGluLCBub3QgaW5cbiAgICAgICAgICAgIC8vIGFuZCwgb3IsIGluLCBub3QgaW4sIG1hdGNoZXMsIHN0YXJ0cyB3aXRoLCBlbmRzIHdpdGggY2FuIGJlIGZvbGxvd2VkIGJ5IGEgc3BhY2Ugb3IgcGFyZW50aGVzaXNcbiAgICAgICAgICAgIHJlZ2V4OiAvKF5cXD9cXD98XlxcP1xcOnxeKGJcXC1hbmQpfF4oYlxcLW9yKXxeKGJcXC14b3IpfF5bXFwrXFwtfiVcXD9dfF5bXFw6XSg/IVxcZFxcXSl8XlshPV09PT98XlshPD5dPT98XlxcKlxcKj98XlxcL1xcLz98XihhbmQpW1xcKHxcXHMrXXxeKG9yKVtcXCh8XFxzK118XihpbilbXFwofFxccytdfF4obm90IGluKVtcXCh8XFxzK118XihtYXRjaGVzKXxeKHN0YXJ0cyB3aXRoKXxeKGVuZHMgd2l0aCl8XlxcLlxcLikvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5leHByZXNzaW9ucyxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24obWF0Y2gsIHRva2Vucykge1xuICAgICAgICAgICAgICAgIHN3aXRjaChtYXRjaFswXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhbmQoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb3IoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW4oJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm90IGluKCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1N0cmlwIG9mZiB0aGUgKCBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0udmFsdWUgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gdG9rZW4udmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRva2VuLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sb29rdXAodmFsdWUsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLmNvbXBpbGU6IFwiLCBcIk9wZXJhdG9yOiBcIiwgb3BlcmF0b3IsIFwiIGZyb20gXCIsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgIChzdGFja1tzdGFjay5sZW5ndGgtMV0udHlwZSA9PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSB8fCBzdGFja1tzdGFjay5sZW5ndGgtMV0udHlwZSA9PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci5iaW5hcnkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3BlcmF0b3IuYXNzb2NpYXRpdml0eSA9PT0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvci5wcmVjaWRlbmNlICAgID49IHN0YWNrW3N0YWNrLmxlbmd0aC0xXS5wcmVjaWRlbmNlKSB8fFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcGVyYXRvci5hc3NvY2lhdGl2aXR5ID09PSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IucmlnaHRUb0xlZnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLnByZWNpZGVuY2UgICAgPiAgc3RhY2tbc3RhY2subGVuZ3RoLTFdLnByZWNpZGVuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0ZW1wKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYSB0ZXJuYXJ5IG9yIG9iamVjdCBrZXkgYmVpbmcgc2V0XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFja1tzdGFjay5sZW5ndGggLSAxXSAmJiBzdGFja1tzdGFjay5sZW5ndGgtMV0udmFsdWUgPT09IFwiP1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSBhcyBub3JtYWwgZm9yIGEgdGVybmFyeVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBub3QgYSB0ZXJuYXJ5IHNvIHdlIHB1c2ggdGhlIHRva2VuIHRvIHRoZSBvdXRwdXQgd2hlcmUgaXQgY2FuIGJlIGhhbmRsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgd2hlbiB0aGUgYXNzb2NhdGVkIG9iamVjdCBpcyBjbG9zZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5X3Rva2VuID0gb3V0cHV0LnBvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5X3Rva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN0cmluZyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlfdG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUudmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5rZXkgPSBrZXlfdG9rZW4udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleV90b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IGludGVnZXIga2V5cyBpbnRvIHN0cmluZyBrZXlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4ua2V5ID0ga2V5X3Rva2VuLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleV90b2tlbi5leHByZXNzaW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleV90b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5X3Rva2VuLnR5cGUgPT0gVHdpZy5leHByZXNzaW9uLnR5cGUuc3ViZXhwcmVzc2lvbi5lbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4ucGFyYW1zID0ga2V5X3Rva2VuLnBhcmFtcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmV4cGVjdGVkIHZhbHVlIGJlZm9yZSAnOicgb2YgXCIgKyBrZXlfdG9rZW4udHlwZSArIFwiID0gXCIgKyBrZXlfdG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG9wZXJhdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIHRlcm5hcnkgJzonIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4ucGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBcInsoZXhwcmVzc2lvbik6dmFsdWV9XCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4ucGFyYW1zLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmtleSA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHdlJ3JlIGluIGEgbG9vcCwgd2UgbWlnaHQgbmVlZCB0b2tlbi5wYXJhbXMgbGF0ZXIsIGVzcGVjaWFsbHkgaW4gdGhpcyBmb3JtIG9mIFwiKGV4cHJlc3Npb24pOnZhbHVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29udGV4dC5sb29wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlKHRva2VuLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5wYXJzZSh0b2tlbi52YWx1ZSwgc3RhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUub3BlcmF0b3IudW5hcnksXG4gICAgICAgICAgICAvLyBNYXRjaCBhbnkgb2Ygbm90XG4gICAgICAgICAgICByZWdleDogLyhebm90XFxzKykvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5leHByZXNzaW9ucyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSB0b2tlbi52YWx1ZS50cmltKCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdG9rZW4udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxvb2t1cCh2YWx1ZSwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiT3BlcmF0b3I6IFwiLCBvcGVyYXRvciwgXCIgZnJvbSBcIiwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgKHN0YWNrW3N0YWNrLmxlbmd0aC0xXS50eXBlID09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLnVuYXJ5IHx8IHN0YWNrW3N0YWNrLmxlbmd0aC0xXS50eXBlID09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLmJpbmFyeSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcGVyYXRvci5hc3NvY2lhdGl2aXR5ID09PSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLnByZWNpZGVuY2UgICAgPj0gc3RhY2tbc3RhY2subGVuZ3RoLTFdLnByZWNpZGVuY2UpIHx8XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9wZXJhdG9yLmFzc29jaWF0aXZpdHkgPT09IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5yaWdodFRvTGVmdCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IucHJlY2lkZW5jZSAgICA+ICBzdGFja1tzdGFjay5sZW5ndGgtMV0ucHJlY2lkZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRlbXApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gob3BlcmF0b3IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IucGFyc2UodG9rZW4udmFsdWUsIHN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIHN0cmluZy4gVGhpcyBpcyBhbnl0aGluZyBiZXR3ZWVuIGEgcGFpciBvZiBzaW5nbGUgb3IgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgLy8gU2VlOiBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvbWF0Y2gtcXVvdGVkLXN0cmluZ1xuICAgICAgICAgICAgcmVnZXg6IC9eKFtcIiddKSg/Oig/PShcXFxcPykpXFwyW1xcc1xcU10pKj9cXDEvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zX2V4dGVuZGVkLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0b2tlbi52YWx1ZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2hcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcXVvdGVzIGZyb20gdGhlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdWJzdHJpbmcoMCwgMSkgPT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCdcXFxcXCInLCAnXCInKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCJcXFxcJ1wiLCBcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aC0xKS5yZXBsYWNlKCAvXFxcXG4vZywgXCJcXG5cIiApLnJlcGxhY2UoIC9cXFxcci9nLCBcIlxcclwiICk7XG4gICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiU3RyaW5nIHZhbHVlOiBcIiwgdG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hfdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIHN1YmV4cHJlc3Npb24gc2V0IHN0YXJ0LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5zdWJleHByZXNzaW9uLnN0YXJ0LFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwoLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5zdWJleHByZXNzaW9uLmVuZF0pLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9ICcoJztcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IFR3aWcuZXhwcmVzc2lvbi5mbi5wYXJzZS5wdXNoXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWF0Y2ggYSBzdWJleHByZXNzaW9uIHNldCBlbmQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN1YmV4cHJlc3Npb24uZW5kLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwpLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZCxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbihtYXRjaCwgdG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBiYWNrIHRocm91Z2ggcHJldmlvdXMgdG9rZW5zIHRvIGVuc3VyZSB3ZSBmb2xsb3cgYSBzdWJleHByZXNzaW9uIHN0YXJ0XG4gICAgICAgICAgICAgICAgdmFyIGkgPSB0b2tlbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgZm91bmRfc3ViZXhwcmVzc2lvbl9zdGFydCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBuZXh0X3N1YmV4cHJlc3Npb25fc3RhcnRfaW52YWxpZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB1bmNsb3NlZF9wYXJhbWV0ZXJfY291bnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoIWZvdW5kX3N1YmV4cHJlc3Npb25fc3RhcnQgJiYgaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3VuZF9zdWJleHByZXNzaW9uX3N0YXJ0ID0gdG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUuc3ViZXhwcmVzc2lvbi5zdGFydDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzbHkgZm91bmQgYSBzdWJleHByZXNzaW9uIGVuZCwgdGhlbiB0aGlzIHN1YmV4cHJlc3Npb24gc3RhcnQgaXMgdGhlIHN0YXJ0IG9mXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoYXQgc3ViZXhwcmVzc2lvbiwgbm90IHRoZSBzdWJleHByZXNzaW9uIHdlIGFyZSBzZWFyY2hpbmcgZm9yXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZF9zdWJleHByZXNzaW9uX3N0YXJ0ICYmIG5leHRfc3ViZXhwcmVzc2lvbl9zdGFydF9pbnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0X3N1YmV4cHJlc3Npb25fc3RhcnRfaW52YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRfc3ViZXhwcmVzc2lvbl9zdGFydCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ291bnQgcGFyYW1ldGVyIHRva2VucyB0byBlbnN1cmUgd2UgZG9udCByZXR1cm4gdHJ1dGh5IGZvciBhIHBhcmFtZXRlciBvcGVuZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5jbG9zZWRfcGFyYW1ldGVyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5jbG9zZWRfcGFyYW1ldGVyX2NvdW50LS07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUuc3ViZXhwcmVzc2lvbi5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRfc3ViZXhwcmVzc2lvbl9zdGFydF9pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBmb3VuZCB1bmNsb3NlZCBwYXJhbWV0ZXJzLCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBkaWRudCBmaW5kIHN1YmV4cHJlc3Npb24gc3RhcnQsIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSByZXR1cm4gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChmb3VuZF9zdWJleHByZXNzaW9uX3N0YXJ0ICYmICh1bmNsb3NlZF9wYXJhbWV0ZXJfY291bnQgPT09IDApKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYmFzaWNhbGx5IGEgY29weSBvZiBwYXJhbWV0ZXIgZW5kIGNvbXBpbGF0aW9uXG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4gPSB0b2tlbjtcblxuICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja190b2tlbi50eXBlICE9IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN1YmV4cHJlc3Npb24uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RhY2tfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbiA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE1vdmUgY29udGVudHMgb2YgcGFyZW5zIGludG8gcHJlY2VkaW5nIGZpbHRlclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbV9zdGFjayA9IFtdO1xuICAgICAgICAgICAgICAgIHdoaWxlKHRva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLnN1YmV4cHJlc3Npb24uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRva2VuIHRvIGFyZ3VtZW50cyBzdGFja1xuICAgICAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay51bnNoaWZ0KHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBvdXRwdXQucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFyYW1fc3RhY2sudW5zaGlmdCh0b2tlbik7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNfZXhwcmVzc2lvbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy9JZiB0aGUgdG9rZW4gYXQgdGhlIHRvcCBvZiB0aGUgKnN0YWNrKiBpcyBhIGZ1bmN0aW9uIHRva2VuLCBwb3AgaXQgb250byB0aGUgb3V0cHV0IHF1ZXVlLlxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgdG9rZW4gcHJlY2VkaW5nIHRoZSBwYXJhbWV0ZXJzXG4gICAgICAgICAgICAgICAgc3RhY2tfdG9rZW4gPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhY2tfdG9rZW4gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAoc3RhY2tfdG9rZW4udHlwZSAhPT0gVHdpZy5leHByZXNzaW9uLnR5cGUuX2Z1bmN0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmZpbHRlciAmJlxuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbi50eXBlICE9PSBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0ICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmtleS5icmFja2V0cykpIHtcblxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4uZXhwcmVzc2lvbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHN0YXJ0IGFuZCBlbmQgdG9rZW4gZnJvbSBzdGFja1xuICAgICAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1fc3RhY2suc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4ucGFyYW1zID0gcGFyYW1fc3RhY2s7XG5cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goZW5kX3Rva2VuKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBuZXZlciBiZSBoaXRcbiAgICAgICAgICAgICAgICAgICAgZW5kX3Rva2VuLmV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tfdG9rZW4ucGFyYW1zID0gcGFyYW1fc3RhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3X2FycmF5ID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGFycmF5X2VuZGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLnBhcmFtcywgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuZXhwZWN0ZWQgc3ViZXhwcmVzc2lvbiBlbmQgd2hlbiB0b2tlbiBpcyBub3QgbWFya2VkIGFzIGFuIGV4cHJlc3Npb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgcGFyYW1ldGVyIHNldCBzdGFydC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0LFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwoLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kXSksXG4gICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24obWF0Y2gsIHRva2Vucykge1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X3Rva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCB1c2UgdGhlIHJlZ2V4IHRvIHRlc3QgaWYgd2UgZm9sbG93IGEgc3BhY2UgYmVjYXVzZSBleHByZXNzaW9uIGlzIHRyaW1tZWRcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdF90b2tlbiAmJiAoVHdpZy5pbmRleE9mKFR3aWcuZXhwcmVzc2lvbi5yZXNlcnZlZFdvcmRzLCBsYXN0X3Rva2VuLnZhbHVlLnRyaW0oKSkgPCAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBUd2lnLmV4cHJlc3Npb24uZm4uY29tcGlsZS5wdXNoX2JvdGgsXG4gICAgICAgICAgICBwYXJzZTogVHdpZy5leHByZXNzaW9uLmZuLnBhcnNlLnB1c2hcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIHBhcmFtZXRlciBzZXQgZW5kLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFwpLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZCxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWNrX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4gPSB0b2tlbjtcblxuICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja190b2tlbi50eXBlICE9IFR3aWcuZXhwcmVzc2lvbi50eXBlLnBhcmFtZXRlci5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdGFja190b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBjb250ZW50cyBvZiBwYXJlbnMgaW50byBwcmVjZWRpbmcgZmlsdGVyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtX3N0YWNrID0gW107XG4gICAgICAgICAgICAgICAgd2hpbGUodG9rZW4udHlwZSAhPT0gVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0b2tlbiB0byBhcmd1bWVudHMgc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1fc3RhY2sudW5zaGlmdCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gb3V0cHV0LnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay51bnNoaWZ0KHRva2VuKTtcblxuICAgICAgICAgICAgICAgIHZhciBpc19leHByZXNzaW9uID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIHByZWNlZGluZyB0aGUgcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgIHRva2VuID0gb3V0cHV0W291dHB1dC5sZW5ndGgtMV07XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAodG9rZW4udHlwZSAhPT0gVHdpZy5leHByZXNzaW9uLnR5cGUuX2Z1bmN0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmZpbHRlciAmJlxuICAgICAgICAgICAgICAgICAgICB0b2tlbi50eXBlICE9PSBUd2lnLmV4cHJlc3Npb24udHlwZS50ZXN0ICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmtleS5icmFja2V0cykpIHtcblxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4uZXhwcmVzc2lvbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHN0YXJ0IGFuZCBlbmQgdG9rZW4gZnJvbSBzdGFja1xuICAgICAgICAgICAgICAgICAgICBwYXJhbV9zdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1fc3RhY2suc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBlbmRfdG9rZW4ucGFyYW1zID0gcGFyYW1fc3RhY2s7XG5cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goZW5kX3Rva2VuKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZF90b2tlbi5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnBhcmFtcyA9IHBhcmFtX3N0YWNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld19hcnJheSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBhcnJheV9lbmRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5wYXJhbXMsIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIGludG8gdGhlIGFycmF5IHVudGlsIHRoZSBzdGFydCBvZiB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50eXBlICYmIHZhbHVlLnR5cGUgPT0gVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlfZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2FycmF5LnVuc2hpZnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcnJheV9lbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJFeHBlY3RlZCBlbmQgb2YgcGFyYW1ldGVyIHNldC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5ld19hcnJheSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5zbGljZSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcWyhcXGQqXFw6XFxkKilcXF0vLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zX2V4dGVuZGVkLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2xpY2VSYW5nZSA9IHRva2VuLm1hdGNoWzFdLnNwbGl0KCc6Jyk7XG5cbiAgICAgICAgICAgICAgICAvL3NsaWNlU3RhcnQgY2FuIGJlIHVuZGVmaW5lZCB3aGVuIHdlIHBhc3MgcGFyYW1ldGVycyB0byB0aGUgc2xpY2UgZmlsdGVyIGxhdGVyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWNlU3RhcnQgPSAoc2xpY2VSYW5nZVswXSkgPyBwYXJzZUludChzbGljZVJhbmdlWzBdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgc2xpY2VFbmQgPSAoc2xpY2VSYW5nZVsxXSkgPyBwYXJzZUludChzbGljZVJhbmdlWzFdKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gJ3NsaWNlJztcbiAgICAgICAgICAgICAgICB0b2tlbi5wYXJhbXMgPSBbc2xpY2VTdGFydCwgc2xpY2VFbmRdO1xuXG4gICAgICAgICAgICAgICAgLy9zbGljZUVuZCBjYW4ndCBiZSB1bmRlZmluZWQgYXMgdGhlIHNsaWNlIGZpbHRlciBkb2Vzbid0IGNoZWNrIGZvciB0aGlzLCBidXQgaXQgZG9lcyBjaGVjayB0aGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgLy9vZiB0aGUgcGFyYW1zIGFycmF5LCBzbyBqdXN0IHNob3J0ZW4gaXQuXG4gICAgICAgICAgICAgICAgaWYgKCFzbGljZUVuZCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5wYXJhbXMgPSBbc2xpY2VTdGFydF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBzdGFjay5wb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdG9rZW4ucGFyYW1zO1xuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChUd2lnLmZpbHRlci5jYWxsKHRoaXMsIHRva2VuLnZhbHVlLCBpbnB1dCwgcGFyYW1zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWF0Y2ggYW4gYXJyYXkgc3RhcnQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LnN0YXJ0LFxuICAgICAgICAgICAgcmVnZXg6IC9eXFxbLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQuZXhwcmVzc2lvbnMuY29uY2F0KFtUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5lbmRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IFR3aWcuZXhwcmVzc2lvbi5mbi5jb21waWxlLnB1c2hfYm90aCxcbiAgICAgICAgICAgIHBhcnNlOiBUd2lnLmV4cHJlc3Npb24uZm4ucGFyc2UucHVzaFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGFuIGFycmF5IGVuZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuYXJyYXkuZW5kLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFxdLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZCxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBzdGFjay5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbjtcbiAgICAgICAgICAgICAgICAvLyBwb3AgdG9rZW5zIG9mZiB0aGUgc3RhY2sgdW50aWwgdGhlIHN0YXJ0IG9mIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgICBmb3IoO2kgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrX3Rva2VuID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFja190b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5hcnJheS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RhY2tfdG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdfYXJyYXkgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlfZW5kZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUHVzaCB2YWx1ZXMgaW50byB0aGUgYXJyYXkgdW50aWwgdGhlIHN0YXJ0IG9mIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUudHlwZSAmJiB2YWx1ZS50eXBlID09IFR3aWcuZXhwcmVzc2lvbi50eXBlLmFycmF5LnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheV9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdfYXJyYXkudW5zaGlmdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYXJyYXlfZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJFeHBlY3RlZCBlbmQgb2YgYXJyYXkuXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3X2FycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gVG9rZW4gdGhhdCByZXByZXNlbnRzIHRoZSBzdGFydCBvZiBhIGhhc2ggbWFwICd9J1xuICAgICAgICAvL1xuICAgICAgICAvLyBIYXNoIG1hcHMgdGFrZSB0aGUgZm9ybTpcbiAgICAgICAgLy8gICAgeyBcImtleVwiOiAndmFsdWUnLCBcImFub3RoZXJfa2V5XCI6IGl0ZW0gfVxuICAgICAgICAvL1xuICAgICAgICAvLyBLZXlzIG11c3QgYmUgcXVvdGVkIChlaXRoZXIgc2luZ2xlIG9yIGRvdWJsZSkgYW5kIHZhbHVlcyBjYW4gYmUgYW55IGV4cHJlc3Npb24uXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5zdGFydCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcey8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0LmV4cHJlc3Npb25zLmNvbmNhdChbVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LmVuZF0pLFxuICAgICAgICAgICAgY29tcGlsZTogVHdpZy5leHByZXNzaW9uLmZuLmNvbXBpbGUucHVzaF9ib3RoLFxuICAgICAgICAgICAgcGFyc2U6IFR3aWcuZXhwcmVzc2lvbi5mbi5wYXJzZS5wdXNoXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG9rZW4gdGhhdCByZXByZXNlbnRzIHRoZSBlbmQgb2YgYSBIYXNoIE1hcCAnfSdcbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhpcyBpcyB3aGVyZSB0aGUgbG9naWMgZm9yIGJ1aWxkaW5nIHRoZSBpbnRlcm5hbFxuICAgICAgICAvLyByZXByZXNlbnRhdGlvbiBvZiBhIGhhc2ggbWFwIGlzIGRlZmluZWQuXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5lbmQsXG4gICAgICAgICAgICByZWdleDogL15cXH0vLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnNldC5vcGVyYXRpb25zX2V4dGVuZGVkLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHN0YWNrLmxlbmd0aC0xLFxuICAgICAgICAgICAgICAgICAgICBzdGFja190b2tlbjtcblxuICAgICAgICAgICAgICAgIC8vIHBvcCB0b2tlbnMgb2ZmIHRoZSBzdGFjayB1bnRpbCB0aGUgc3RhcnQgb2YgdGhlIG9iamVjdFxuICAgICAgICAgICAgICAgIGZvcig7aSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tfdG9rZW4gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrX3Rva2VuICYmIHN0YWNrX3Rva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9iamVjdC5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RhY2tfdG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKGVuZF90b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3X29iamVjdCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBvYmplY3RfZW5kZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbl9rZXkgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBoYXNfdmFsdWUgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUHVzaCB2YWx1ZXMgaW50byB0aGUgYXJyYXkgdW50aWwgdGhlIHN0YXJ0IG9mIHRoZSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICYmIHRva2VuLnR5cGUgJiYgdG9rZW4udHlwZSA9PT0gVHdpZy5leHByZXNzaW9uLnR5cGUub2JqZWN0LnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuICYmIHRva2VuLnR5cGUgJiYgKHRva2VuLnR5cGUgPT09IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLmJpbmFyeSB8fCB0b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5vcGVyYXRvci51bmFyeSkgJiYgdG9rZW4ua2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc192YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiTWlzc2luZyB2YWx1ZSBmb3Iga2V5ICdcIiArIHRva2VuLmtleSArIFwiJyBpbiBvYmplY3QgZGVmaW5pdGlvbi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdfb2JqZWN0W3Rva2VuLmtleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJlc2VydmUgdGhlIG9yZGVyIHRoYXQgZWxlbWVudHMgYXJlIGFkZGVkIHRvIHRoZSBtYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNpbmNlIEphdmFTY3JpcHQgb2JqZWN0cyBkb24ndFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ3VhcmFudGVlIHRoZSBvcmRlciBvZiBrZXlzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3X29iamVjdC5fa2V5cyA9PT0gdW5kZWZpbmVkKSBuZXdfb2JqZWN0Ll9rZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdfb2JqZWN0Ll9rZXlzLnVuc2hpZnQodG9rZW4ua2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdmFsdWUgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc192YWx1ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNfdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9iamVjdF9lbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIlVuZXhwZWN0ZWQgZW5kIG9mIG9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdfb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUb2tlbiByZXByZXNlbnRpbmcgYSBmaWx0ZXJcbiAgICAgICAgLy9cbiAgICAgICAgLy8gRmlsdGVycyBjYW4gZm9sbG93IGFueSBleHByZXNzaW9uIGFuZCB0YWtlIHRoZSBmb3JtOlxuICAgICAgICAvLyAgICBleHByZXNzaW9ufGZpbHRlcihvcHRpb25hbCwgYXJncylcbiAgICAgICAgLy9cbiAgICAgICAgLy8gRmlsdGVyIHBhcnNpbmcgaXMgZG9uZSBpbiB0aGUgVHdpZy5maWx0ZXJzIG5hbWVzcGFjZS5cbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuZmlsdGVyLFxuICAgICAgICAgICAgLy8gbWF0Y2ggYSB8IHRoZW4gYSBsZXR0ZXIgb3IgXywgdGhlbiBhbnkgbnVtYmVyIG9mIGxldHRlcnMsIG51bWJlcnMsIF8gb3IgLVxuICAgICAgICAgICAgcmVnZXg6IC9eXFx8XFxzPyhbYS16QS1aX11bYS16QS1aMC05X1xcLV0qKS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0XSksXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gc3RhY2sucG9wKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbXModGhpcywgdG9rZW4ucGFyYW1zLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5maWx0ZXIuY2FsbCh0aGF0LCB0b2tlbi52YWx1ZSwgaW5wdXQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuX2Z1bmN0aW9uLFxuICAgICAgICAgICAgLy8gbWF0Y2ggYW55IGxldHRlciBvciBfLCB0aGVuIGFueSBudW1iZXIgb2YgbGV0dGVycywgbnVtYmVycywgXyBvciAtIGZvbGxvd2VkIGJ5IChcbiAgICAgICAgICAgIHJlZ2V4OiAvXihbYS16QS1aX11bYS16QS1aMC05X10qKVxccypcXCgvLFxuICAgICAgICAgICAgbmV4dDogVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0LFxuICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKG1hdGNoLCB0b2tlbnMpIHtcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyBmdW5jdGlvbiBpcyBub3QgYSByZXNlcnZlZCB3b3JkXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdICYmIChUd2lnLmluZGV4T2YoVHdpZy5leHByZXNzaW9uLnJlc2VydmVkV29yZHMsIG1hdGNoWzFdKSA8IDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24obWF0Y2gsIHRva2Vucykge1xuICAgICAgICAgICAgICAgIHJldHVybiAnKCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm4gPSB0b2tlbi5tYXRjaFsxXTtcbiAgICAgICAgICAgICAgICB0b2tlbi5mbiA9IGZuO1xuICAgICAgICAgICAgICAgIC8vIGNsZWFudXAgdG9rZW5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgZm4gPSB0b2tlbi5mbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbXModGhpcywgdG9rZW4ucGFyYW1zLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoVHdpZy5mdW5jdGlvbnNbZm5dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGZ1bmN0aW9uIGZyb20gdGhlIGJ1aWx0LWluIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBUd2lnLmZ1bmN0aW9uc1tmbl0uYXBwbHkodGhhdCwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0W2ZuXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGZ1bmN0aW9uIGZyb20gdGhlIHVzZXIvY29udGV4dCBkZWZpbmVkIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0W2ZuXS5hcHBseShjb250ZXh0LCBwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihmbiArICcgZnVuY3Rpb24gZG9lcyBub3QgZXhpc3QgYW5kIGlzIG5vdCBkZWZpbmVkIGluIHRoZSBjb250ZXh0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRva2VuIHJlcHJlc2VudGluZyBhIHZhcmlhYmxlLlxuICAgICAgICAvL1xuICAgICAgICAvLyBWYXJpYWJsZXMgY2FuIGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgdW5kZXJzY29yZXMgYW5kXG4gICAgICAgIC8vIGRhc2hlcywgYnV0IG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciBvciB1bmRlcnNjb3JlLlxuICAgICAgICAvL1xuICAgICAgICAvLyBWYXJpYWJsZXMgYXJlIHJldHJpZXZlZCBmcm9tIHRoZSByZW5kZXIgY29udGV4dCBhbmQgdGFrZVxuICAgICAgICAvLyB0aGUgdmFsdWUgb2YgJ3VuZGVmaW5lZCcgaWYgdGhlIGdpdmVuIHZhcmlhYmxlIGRvZXNuJ3RcbiAgICAgICAgLy8gZXhpc3QgaW4gdGhlIGNvbnRleHQuXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLnZhcmlhYmxlLFxuICAgICAgICAgICAgLy8gbWF0Y2ggYW55IGxldHRlciBvciBfLCB0aGVuIGFueSBudW1iZXIgb2YgbGV0dGVycywgbnVtYmVycywgXyBvciAtXG4gICAgICAgICAgICByZWdleDogL15bYS16QS1aX11bYS16QS1aMC05X10qLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZC5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IFR3aWcuZXhwcmVzc2lvbi5mbi5jb21waWxlLnB1c2gsXG4gICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24obWF0Y2gsIHRva2Vucykge1xuICAgICAgICAgICAgICAgIHJldHVybiAoVHdpZy5pbmRleE9mKFR3aWcuZXhwcmVzc2lvbi5yZXNlcnZlZFdvcmRzLCBtYXRjaFswXSkgPCAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSB2YXJpYWJsZSBmcm9tIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5yZXNvbHZlQXN5bmMuY2FsbCh0aGlzLCBjb250ZXh0W3Rva2VuLnZhbHVlXSwgY29udGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LnBlcmlvZCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXlxcLihbYS16QS1aMC05X10rKS8sXG4gICAgICAgICAgICBuZXh0OiBUd2lnLmV4cHJlc3Npb24uc2V0Lm9wZXJhdGlvbnNfZXh0ZW5kZWQuY29uY2F0KFtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5leHByZXNzaW9uLnR5cGUucGFyYW1ldGVyLnN0YXJ0XSksXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIG91dHB1dCkge1xuICAgICAgICAgICAgICAgIHRva2VuLmtleSA9IHRva2VuLm1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4udmFsdWU7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCwgbmV4dF90b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gdG9rZW4ua2V5LFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBzdGFjay5wb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbXModGhpcywgdG9rZW4ucGFyYW1zLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnN0cmljdF92YXJpYWJsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkNhbid0IGFjY2VzcyBhIGtleSBcIiArIGtleSArIFwiIG9uIGFuIG51bGwgb3IgdW5kZWZpbmVkIG9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcGl0YWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB2YWx1ZS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHZhcmlhYmxlIGZyb20gdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0W1wiZ2V0XCIgKyBjYXBpdGFsaXplKGtleSldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtcImdldFwiICsgY2FwaXRhbGl6ZShrZXkpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0W1wiaXNcIiArIGNhcGl0YWxpemUoa2V5KV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W1wiaXNcIiArIGNhcGl0YWxpemUoa2V5KV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiByZXNvbHZpbmcgYW4gZXhwcmVzc2lvbiB3ZSBuZWVkIHRvIHBhc3MgbmV4dF90b2tlbiBpbiBjYXNlIHRoZSBleHByZXNzaW9uIGlzIGEgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5yZXNvbHZlQXN5bmMuY2FsbCh0aGF0LCB2YWx1ZSwgY29udGV4dCwgcGFyYW1zLCBuZXh0X3Rva2VuLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUua2V5LmJyYWNrZXRzLFxuICAgICAgICAgICAgcmVnZXg6IC9eXFxbKFteXFxdXFw6XSopXFxdLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZC5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBleHByZXNzaW9uIHN0YWNrIGZvciB0aGUga2V5XG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtYXRjaFxuICAgICAgICAgICAgICAgIH0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbih0b2tlbiwgc3RhY2ssIGNvbnRleHQsIG5leHRfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBFdmFsdWF0ZSBrZXlcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbXModGhpcywgdG9rZW4ucGFyYW1zLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1ldGVycztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhhdCwgdG9rZW4uc3RhY2ssIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IHN0YWNrLnBvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3QgPT09IG51bGwgfHwgb2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc3RyaWN0X3ZhcmlhYmxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiQ2FuJ3QgYWNjZXNzIGEga2V5IFwiICsga2V5ICsgXCIgb24gYW4gbnVsbCBvciB1bmRlZmluZWQgb2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHZhcmlhYmxlIGZyb20gdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHJlc29sdmluZyBhbiBleHByZXNzaW9uIHdlIG5lZWQgdG8gcGFzcyBuZXh0X3Rva2VuIGluIGNhc2UgdGhlIGV4cHJlc3Npb24gaXMgYSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnJlc29sdmVBc3luYy5jYWxsKHRoYXQsIHZhbHVlLCBvYmplY3QsIHBhcmFtcywgbmV4dF90b2tlbik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hdGNoIGEgbnVsbCB2YWx1ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuX251bGwsXG4gICAgICAgICAgICAvLyBtYXRjaCBhIG51bWJlclxuICAgICAgICAgICAgcmVnZXg6IC9eKG51bGx8TlVMTHxub25lfE5PTkUpLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9ucyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IFR3aWcuZXhwcmVzc2lvbi5mbi5wYXJzZS5wdXNoX3ZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWF0Y2ggdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuY29udGV4dCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXl9jb250ZXh0LyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9uc19leHRlbmRlZC5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuc3RhcnRdKSxcbiAgICAgICAgICAgIGNvbXBpbGU6IFR3aWcuZXhwcmVzc2lvbi5mbi5jb21waWxlLnB1c2gsXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24odG9rZW4sIHN0YWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChjb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYXRjaCBhIGJvb2xlYW5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuYm9vbCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXih0cnVlfFRSVUV8ZmFsc2V8RkFMU0UpLyxcbiAgICAgICAgICAgIG5leHQ6IFR3aWcuZXhwcmVzc2lvbi5zZXQub3BlcmF0aW9ucyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSAodG9rZW4ubWF0Y2hbMF0udG9Mb3dlckNhc2UoICkgPT09IFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBUd2lnLmV4cHJlc3Npb24uZm4ucGFyc2UucHVzaF92YWx1ZVxuICAgICAgICB9XG4gICAgXTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgYSBjb250ZXh0IHZhbHVlLlxuICAgICAqXG4gICAgICogSWYgdGhlIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGl0IGlzIGV4ZWN1dGVkIHdpdGggYSBjb250ZXh0IHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGNvbnRleHQgb2JqZWN0IGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCBUaGUgcmVuZGVyIGNvbnRleHQuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLnJlc29sdmVBc3luYyA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBwYXJhbXMsIG5leHRfdG9rZW4sIG9iamVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9ICdmdW5jdGlvbicpXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5Qcm9taXNlLnJlc29sdmUodmFsdWUpO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gVHdpZy5Qcm9taXNlLnJlc29sdmUocGFyYW1zKTtcblxuICAgICAgICAvKlxuICAgICAgICBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGhhdmUgYmVlbiBpbXBvc3NpYmxlIGR1cmluZyB0aGUgY29tcGlsZSBzdGFnZSB0byBkZXRlcm1pbmUgdGhhdCBhIGZvbGxvd2luZ1xuICAgICAgICBzZXQgb2YgcGFyZW50aGVzZXMgd2VyZSBwYXJhbWV0ZXJzIGZvciB0aGlzIGZ1bmN0aW9uLlxuXG4gICAgICAgIFRob3NlIHBhcmVudGhlc2VzIHdpbGwgaGF2ZSB0aGVyZWZvcmUgYmVlbiBtYXJrZWQgYXMgYW4gZXhwcmVzc2lvbiwgd2l0aCB0aGVpciBvd24gcGFyYW1ldGVycywgd2hpY2ggcmVhbGx5XG4gICAgICAgIGJlbG9uZyB0byB0aGlzIGZ1bmN0aW9uLlxuXG4gICAgICAgIFRob3NlIHBhcmFtZXRlcnMgd2lsbCBhbHNvIG5lZWQgcGFyc2luZyBpbiBjYXNlIHRoZXkgYXJlIGFjdHVhbGx5IGFuIGV4cHJlc3Npb24gdG8gcGFzcyBhcyBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgaWYgKG5leHRfdG9rZW4gJiYgbmV4dF90b2tlbi50eXBlID09PSBUd2lnLmV4cHJlc3Npb24udHlwZS5wYXJhbWV0ZXIuZW5kKSB7XG4gICAgICAgICAgICAvL1doZW4gcGFyc2luZyB0aGVzZSBwYXJhbWV0ZXJzLCB3ZSBuZWVkIHRvIGdldCB0aGVtIGFsbCBiYWNrLCBub3QganVzdCB0aGUgbGFzdCBpdGVtIG9uIHRoZSBzdGFjay5cbiAgICAgICAgICAgIHZhciB0b2tlbnNfYXJlX3BhcmFtZXRlcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0X3Rva2VuLnBhcmFtcyAmJiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIG5leHRfdG9rZW4ucGFyYW1zLCBjb250ZXh0LCB0b2tlbnNfYXJlX3BhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICAvL0NsZWFuIHVwIHRoZSBwYXJlbnRoZXNlcyB0b2tlbnMgb24gdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgICAgIG5leHRfdG9rZW4uY2xlYW51cCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hcHBseShvYmplY3QgfHwgY29udGV4dCwgcGFyYW1zIHx8IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFR3aWcuZXhwcmVzc2lvbi5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHBhcmFtcywgbmV4dF90b2tlbiwgb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBUd2lnLmFzeW5jLnBvdGVudGlhbGx5QXN5bmModGhpcywgZmFsc2UsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5yZXNvbHZlQXN5bmMuY2FsbCh0aGlzLCB2YWx1ZSwgY29udGV4dCwgcGFyYW1zLCBuZXh0X3Rva2VuLCBvYmplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RyeSBmb3IgbG9naWMgaGFuZGxlcnMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLmhhbmRsZXIgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBhIG5ldyBleHByZXNzaW9uIHR5cGUsIGF2YWlsYWJsZSBhdCBUd2lnLmxvZ2ljLnR5cGUue3R5cGV9XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgbmV3IHR5cGUuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLmV4dGVuZFR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBUd2lnLmV4cHJlc3Npb24udHlwZVt0eXBlXSA9IFwiVHdpZy5leHByZXNzaW9uLnR5cGUuXCIgKyB0eXBlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeHRlbmQgdGhlIGV4cHJlc3Npb24gcGFyc2luZyBmdW5jdGlvbmFsaXR5IHdpdGggYSBuZXcgZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIFRva2VuIGRlZmluaXRpb25zIGZvbGxvdyB0aGlzIGZvcm1hdDpcbiAgICAgKiAge1xuICAgICAqICAgICAgdHlwZTogICAgIE9uZSBvZiBUd2lnLmV4cHJlc3Npb24udHlwZS5bdHlwZV0sIGVpdGhlciBwcmUtZGVmaW5lZCBvciBhZGRlZCB1c2luZ1xuICAgICAqICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kVHlwZVxuICAgICAqXG4gICAgICogICAgICBuZXh0OiAgICAgQXJyYXkgb2YgdHlwZXMgZnJvbSBUd2lnLmV4cHJlc3Npb24udHlwZSB0aGF0IGNhbiBmb2xsb3cgdGhpcyB0b2tlbixcbiAgICAgKlxuICAgICAqICAgICAgcmVnZXg6ICAgIEEgcmVnZXggb3IgYXJyYXkgb2YgcmVnZXgncyB0aGF0IHNob3VsZCBtYXRjaCB0aGUgdG9rZW4uXG4gICAgICpcbiAgICAgKiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgb3V0cHV0KSBjYWxsZWQgd2hlbiB0aGlzIHRva2VuIGlzIGJlaW5nIGNvbXBpbGVkLlxuICAgICAqICAgICAgICAgICAgICAgICAgIFNob3VsZCByZXR1cm4gYW4gb2JqZWN0IHdpdGggc3RhY2sgYW5kIG91dHB1dCBzZXQuXG4gICAgICpcbiAgICAgKiAgICAgIHBhcnNlOiAgIGZ1bmN0aW9uKHRva2VuLCBzdGFjaywgY29udGV4dCkgY2FsbGVkIHdoZW4gdGhpcyB0b2tlbiBpcyBiZWluZyBwYXJzZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgU2hvdWxkIHJldHVybiBhbiBvYmplY3Qgd2l0aCBzdGFjayBhbmQgY29udGV4dCBzZXQuXG4gICAgICogIH1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIEEgdG9rZW4gZGVmaW5pdGlvbi5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAgICAgaWYgKCFkZWZpbml0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiVW5hYmxlIHRvIGV4dGVuZCBsb2dpYyBkZWZpbml0aW9uLiBObyB0eXBlIHByb3ZpZGVkIGZvciBcIiArIGRlZmluaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW2RlZmluaXRpb24udHlwZV0gPSBkZWZpbml0aW9uO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgd2l0aCBidWlsdC1pbiBleHByZXNzaW9uc1xuICAgIHdoaWxlIChUd2lnLmV4cHJlc3Npb24uZGVmaW5pdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBUd2lnLmV4cHJlc3Npb24uZXh0ZW5kKFR3aWcuZXhwcmVzc2lvbi5kZWZpbml0aW9ucy5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmVhayBhbiBleHByZXNzaW9uIGludG8gdG9rZW5zIGRlZmluZWQgaW4gVHdpZy5leHByZXNzaW9uLmRlZmluaXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV4cHJlc3Npb24gVGhlIHN0cmluZyB0byB0b2tlbml6ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiB0b2tlbnMuXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLnRva2VuaXplID0gZnVuY3Rpb24gKGV4cHJlc3Npb24pIHtcbiAgICAgICAgdmFyIHRva2VucyA9IFtdLFxuICAgICAgICAgICAgLy8gS2VlcCBhbiBvZmZzZXQgb2YgdGhlIGxvY2F0aW9uIGluIHRoZSBleHByZXNzaW9uIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgICAgICAgICAgIGV4cF9vZmZzZXQgPSAwLFxuICAgICAgICAgICAgLy8gVGhlIHZhbGlkIG5leHQgdG9rZW5zIG9mIHRoZSBwcmV2aW91cyB0b2tlblxuICAgICAgICAgICAgbmV4dCA9IG51bGwsXG4gICAgICAgICAgICAvLyBNYXRjaCBpbmZvcm1hdGlvblxuICAgICAgICAgICAgdHlwZSwgcmVnZXgsIHJlZ2V4X2ksXG4gICAgICAgICAgICAvLyBUaGUgcG9zc2libGUgbmV4dCB0b2tlbiBmb3IgdGhlIG1hdGNoXG4gICAgICAgICAgICB0b2tlbl9uZXh0LFxuICAgICAgICAgICAgLy8gSGFzIGEgbWF0Y2ggYmVlbiBmb3VuZCBmcm9tIHRoZSBkZWZpbml0aW9uc1xuICAgICAgICAgICAgbWF0Y2hfZm91bmQsIGludmFsaWRfbWF0Y2hlcyA9IFtdLCBtYXRjaF9mdW5jdGlvbjtcblxuICAgICAgICBtYXRjaF9mdW5jdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIERvbid0IHBhc3MgYXJndW1lbnRzIHRvIGBBcnJheS5zbGljZWAsIHRoYXQgaXMgYSBwZXJmb3JtYW5jZSBraWxsZXJcbiAgICAgICAgICAgIHZhciBtYXRjaF9pID0gYXJndW1lbnRzLmxlbmd0aCAtIDIsIG1hdGNoID0gbmV3IEFycmF5KG1hdGNoX2kpO1xuICAgICAgICAgICAgd2hpbGUgKG1hdGNoX2ktLSA+IDApIG1hdGNoW21hdGNoX2ldID0gYXJndW1lbnRzW21hdGNoX2ldO1xuXG4gICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi50b2tlbml6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJNYXRjaGVkIGEgXCIsIHR5cGUsIFwiIHJlZ3VsYXIgZXhwcmVzc2lvbiBvZiBcIiwgbWF0Y2gpO1xuXG4gICAgICAgICAgICBpZiAobmV4dCAmJiBUd2lnLmluZGV4T2YobmV4dCwgdHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZF9tYXRjaGVzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgKyBcIiBjYW5ub3QgZm9sbG93IGEgXCIgKyB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLnR5cGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgYXQgdGVtcGxhdGU6XCIgKyBleHBfb2Zmc2V0ICsgXCIgbmVhciAnXCIgKyBtYXRjaFswXS5zdWJzdHJpbmcoMCwgMjApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLi4uJ1wiXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vdCBhIG1hdGNoLCBkb24ndCBjaGFuZ2UgdGhlIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gVHdpZy5leHByZXNzaW9uLmhhbmRsZXJbdHlwZV07XG5cbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIHRoZSB0b2tlbiBpZiBhIHZhbGlkYXRpb24gZnVuY3Rpb24gaXMgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLnZhbGlkYXRlICYmICFoYW5kbGVyLnZhbGlkYXRlKG1hdGNoLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnZhbGlkX21hdGNoZXMgPSBbXTtcblxuICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICB0eXBlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBtYXRjaFswXSxcbiAgICAgICAgICAgICAgICBtYXRjaDogbWF0Y2hcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtYXRjaF9mb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBuZXh0ID0gdG9rZW5fbmV4dDtcbiAgICAgICAgICAgIGV4cF9vZmZzZXQgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBEb2VzIHRoZSB0b2tlbiBuZWVkIHRvIHJldHVybiBvdXRwdXQgYmFjayB0byB0aGUgZXhwcmVzc2lvbiBzdHJpbmdcbiAgICAgICAgICAgIC8vIGUuZy4gYSBmdW5jdGlvbiBtYXRjaCBvZiBjeWNsZSggbWlnaHQgcmV0dXJuIHRoZSAnKCcgYmFjayB0byB0aGUgZXhwcmVzc2lvblxuICAgICAgICAgICAgLy8gVGhpcyBhbGxvd3MgbG9vay1haGVhZCB0byBkaWZmZXJlbnRpYXRlIGJldHdlZW4gdG9rZW4gdHlwZXMgKGUuZy4gZnVuY3Rpb25zIGFuZCB2YXJpYWJsZSBuYW1lcylcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLnRyYW5zZm9ybShtYXRjaCwgdG9rZW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfTtcblxuICAgICAgICBUd2lnLmxvZy5kZWJ1ZyhcIlR3aWcuZXhwcmVzc2lvbi50b2tlbml6ZVwiLCBcIlRva2VuaXppbmcgZXhwcmVzc2lvbiBcIiwgZXhwcmVzc2lvbik7XG5cbiAgICAgICAgd2hpbGUgKGV4cHJlc3Npb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgICAgICAgICAgZm9yICh0eXBlIGluIFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdG9rZW5fbmV4dCA9IFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3R5cGVdLm5leHQ7XG4gICAgICAgICAgICAgICAgcmVnZXggPSBUd2lnLmV4cHJlc3Npb24uaGFuZGxlclt0eXBlXS5yZWdleDtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIkNoZWNraW5nIHR5cGUgXCIsIHR5cGUsIFwiIG9uIFwiLCBleHByZXNzaW9uKTtcblxuICAgICAgICAgICAgICAgIG1hdGNoX2ZvdW5kID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoVHdpZy5saWIuaXNBcnJheShyZWdleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhfaSA9IHJlZ2V4Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHJlZ2V4X2ktLSA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKHJlZ2V4W3JlZ2V4X2ldLCBtYXRjaF9mdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZShyZWdleCwgbWF0Y2hfZnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFuIGV4cHJlc3Npb24gdG9rZW4gaGFzIGJlZW4gbWF0Y2hlZC4gQnJlYWsgdGhlIGZvciBsb29wIGFuZCBzdGFydCB0cnlpbmcgdG9cbiAgICAgICAgICAgICAgICAvLyAgbWF0Y2ggdGhlIG5leHQgdGVtcGxhdGUgKGlmIGV4cHJlc3Npb24gaXNuJ3QgZW1wdHkuKVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaF9mb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW1hdGNoX2ZvdW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludmFsaWRfbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKGludmFsaWRfbWF0Y2hlcy5qb2luKFwiIE9SIFwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgJ1wiICsgZXhwcmVzc2lvbiArIFwiJyBhdCB0ZW1wbGF0ZSBwb3NpdGlvblwiICsgZXhwX29mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24udG9rZW5pemVcIiwgXCJUb2tlbml6ZWQgdG8gXCIsIHRva2Vucyk7XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbXBpbGUgYW4gZXhwcmVzc2lvbiB0b2tlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByYXdfdG9rZW4gVGhlIHVuY29tcGlsZWQgdG9rZW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb21waWxlZCB0b2tlbi5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24uY29tcGlsZSA9IGZ1bmN0aW9uIChyYXdfdG9rZW4pIHtcbiAgICAgICAgdmFyIGV4cHJlc3Npb24gPSByYXdfdG9rZW4udmFsdWUsXG4gICAgICAgICAgICAvLyBUb2tlbml6ZSBleHByZXNzaW9uXG4gICAgICAgICAgICB0b2tlbnMgPSBUd2lnLmV4cHJlc3Npb24udG9rZW5pemUoZXhwcmVzc2lvbiksXG4gICAgICAgICAgICB0b2tlbiA9IG51bGwsXG4gICAgICAgICAgICBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgIHN0YWNrID0gW10sXG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IG51bGw7XG5cbiAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiQ29tcGlsaW5nIFwiLCBleHByZXNzaW9uKTtcblxuICAgICAgICAvLyBQdXNoIHRva2VucyBpbnRvIFJQTiBzdGFjayB1c2luZyB0aGUgU2h1bnRpbmcteWFyZCBhbGdvcml0aG1cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2h1bnRpbmdfeWFyZF9hbGdvcml0aG1cblxuICAgICAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG4gICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3Rva2VuLnR5cGVdO1xuXG4gICAgICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi5jb21waWxlOiBcIiwgXCJDb21waWxpbmcgXCIsIHRva2VuKTtcblxuICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGVcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlLmNvbXBpbGUgJiYgdG9rZW5fdGVtcGxhdGUuY29tcGlsZSh0b2tlbiwgc3RhY2ssIG91dHB1dCk7XG5cbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLmNvbXBpbGU6IFwiLCBcIlN0YWNrIGlzXCIsIHN0YWNrKTtcbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5leHByZXNzaW9uLmNvbXBpbGU6IFwiLCBcIk91dHB1dCBpc1wiLCBvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RhY2sucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmV4cHJlc3Npb24uY29tcGlsZTogXCIsIFwiRmluYWwgb3V0cHV0IGlzXCIsIG91dHB1dCk7XG5cbiAgICAgICAgcmF3X3Rva2VuLnN0YWNrID0gb3V0cHV0O1xuICAgICAgICBkZWxldGUgcmF3X3Rva2VuLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiByYXdfdG9rZW47XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYW4gUlBOIGV4cHJlc3Npb24gc3RhY2sgd2l0aGluIGEgY29udGV4dC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRva2VucyBBbiBhcnJheSBvZiBjb21waWxlZCBleHByZXNzaW9uIHRva2Vucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCBUaGUgcmVuZGVyIGNvbnRleHQgdG8gcGFyc2UgdGhlIHRva2VucyB3aXRoLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0IG9mIHBhcnNpbmcgYWxsIHRoZSB0b2tlbnMuIFRoZSByZXN1bHRcbiAgICAgKiAgICAgICAgICAgICAgICAgIGNhbiBiZSBhbnl0aGluZywgU3RyaW5nLCBBcnJheSwgT2JqZWN0LCBldGMuLi4gYmFzZWQgb25cbiAgICAgKiAgICAgICAgICAgICAgICAgIHRoZSBnaXZlbiBleHByZXNzaW9uLlxuICAgICAqL1xuICAgIFR3aWcuZXhwcmVzc2lvbi5wYXJzZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGNvbnRleHQsIHRva2Vuc19hcmVfcGFyYW1ldGVycywgYWxsb3dfYXN5bmMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIElmIHRoZSB0b2tlbiBpc24ndCBhbiBhcnJheSwgbWFrZSBpdCBvbmUuXG4gICAgICAgIGlmICghVHdpZy5saWIuaXNBcnJheSh0b2tlbnMpKVxuICAgICAgICAgICAgdG9rZW5zID0gW3Rva2Vuc107XG5cbiAgICAgICAgLy8gVGhlIG91dHB1dCBzdGFja1xuICAgICAgICB2YXIgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgIGxvb3BfdG9rZW5fZml4dXBzID0gW10sXG4gICAgICAgICAgICBiaW5hcnlPcGVyYXRvciA9IFR3aWcuZXhwcmVzc2lvbi50eXBlLm9wZXJhdG9yLmJpbmFyeTtcblxuICAgICAgICByZXR1cm4gVHdpZy5hc3luYy5wb3RlbnRpYWxseUFzeW5jKHRoaXMsIGFsbG93X2FzeW5jLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBUd2lnLmFzeW5jLmZvckVhY2godG9rZW5zLCBmdW5jdGlvbiBleHByZXNzaW9uVG9rZW4odG9rZW4sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuX3RlbXBsYXRlID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbmV4dF90b2tlbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgICAgICAgICAgIC8vSWYgdGhlIHRva2VuIGlzIG1hcmtlZCBmb3IgY2xlYW51cCwgd2UgZG9uJ3QgbmVlZCB0byBwYXJzZSBpdFxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5jbGVhbnVwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0RldGVybWluZSB0aGUgdG9rZW4gdGhhdCBmb2xsb3dzIHRoaXMgb25lIHNvIHRoYXQgd2UgY2FuIHBhc3MgaXQgdG8gdGhlIHBhcnNlclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID4gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRfdG9rZW4gPSB0b2tlbnNbaW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcuZXhwcmVzc2lvbi5oYW5kbGVyW3Rva2VuLnR5cGVdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3RlbXBsYXRlLnBhcnNlKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0b2tlbl90ZW1wbGF0ZS5wYXJzZS5jYWxsKHRoYXQsIHRva2VuLCBzdGFjaywgY29udGV4dCwgbmV4dF90b2tlbik7XG5cbiAgICAgICAgICAgICAgICAvL1N0b3JlIGFueSBiaW5hcnkgdG9rZW5zIGZvciBsYXRlciBpZiB3ZSBhcmUgaW4gYSBsb29wLlxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSBiaW5hcnlPcGVyYXRvciAmJiBjb250ZXh0Lmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9vcF90b2tlbl9maXh1cHMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiBsb29wVG9rZW5GaXh1cHMoKSB7XG4gICAgICAgICAgICAgICAgLy9DaGVjayBldmVyeSBmaXh1cCBhbmQgcmVtb3ZlIFwia2V5XCIgYXMgbG9uZyBhcyB0aGV5IHN0aWxsIGhhdmUgXCJwYXJhbXNcIi4gVGhpcyBjb3ZlcnMgdGhlIHVzZSBjYXNlIHdoZXJlXG4gICAgICAgICAgICAgICAgLy9hIFwiOlwiIG9wZXJhdG9yIGlzIHVzZWQgaW4gYSBsb29wIHdpdGggYSBcIihleHByZXNzaW9uKTpcIiBzdGF0ZW1lbnQuIFdlIG5lZWQgdG8gYmUgYWJsZSB0byBldmFsdWF0ZSB0aGUgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSBsb29wX3Rva2VuX2ZpeHVwcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGxvb3BfdG9rZW5fZml4dXAgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUobGVuLS0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvb3BfdG9rZW5fZml4dXAgPSBsb29wX3Rva2VuX2ZpeHVwc1tsZW5dO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9vcF90b2tlbl9maXh1cC5wYXJhbXMgJiYgbG9vcF90b2tlbl9maXh1cC5rZXkpXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbG9vcF90b2tlbl9maXh1cC5rZXk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9JZiBwYXJzZSBoYXMgYmVlbiBjYWxsZWQgd2l0aCBhIHNldCBvZiB0b2tlbnMgdGhhdCBhcmUgcGFyYW1ldGVycywgd2UgbmVlZCB0byByZXR1cm4gdGhlIHdob2xlIHN0YWNrLFxuICAgICAgICAgICAgICAgIC8vd3JhcHBlZCBpbiBhbiBBcnJheS5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zX2FyZV9wYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBzdGFjay5zcGxpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFBvcCB0aGUgZmluYWwgdmFsdWUgb2ZmIHRoZSBzdGFja1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn07XG5cblxuLyoqKi8gfSksXG4vKiA3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8vICMjIHR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIG9wZXJhdG9yIGxvb2t1cHMgYW5kIHBhcnNpbmcuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUd2lnKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBPcGVyYXRvciBhc3NvY2lhdGl2aXR5IGNvbnN0YW50cy5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IgPSB7XG4gICAgICAgIGxlZnRUb1JpZ2h0OiAnbGVmdFRvUmlnaHQnLFxuICAgICAgICByaWdodFRvTGVmdDogJ3JpZ2h0VG9MZWZ0J1xuICAgIH07XG5cbiAgICB2YXIgY29udGFpbm1lbnQgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoYiA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGIuaW5kZXhPZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBTdHJpbmdcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiIHx8IGEgIT09ICcnICYmIGIuaW5kZXhPZihhKSA+IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgZm9yIChlbCBpbiBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkoZWwpICYmIGJbZWxdID09PSBhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHByZWNpZGVuY2UgYW5kIGFzc29jaWF0aXZpdHkgb2YgYW4gb3BlcmF0b3IuIFRoZXNlIGZvbGxvdyB0aGUgb3JkZXIgdGhhdCBDL0MrKyB1c2UuXG4gICAgICogU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvT3BlcmF0b3JzX2luX0NfYW5kX0MrKyBmb3IgdGhlIHRhYmxlIG9mIHZhbHVlcy5cbiAgICAgKi9cbiAgICBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubG9va3VwID0gZnVuY3Rpb24gKG9wZXJhdG9yLCB0b2tlbikge1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICBjYXNlIFwiLi5cIjpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMjA7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDE4O1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIFRlcm5hcnlcbiAgICAgICAgICAgIGNhc2UgJz86JzpcbiAgICAgICAgICAgIGNhc2UgJz8nOlxuICAgICAgICAgICAgY2FzZSAnOic6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDE2O1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IucmlnaHRUb0xlZnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIE51bGwtY29hbGVzY2luZyBvcGVyYXRvclxuICAgICAgICAgICAgY2FzZSAnPz8nOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSAxNTtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdvcic6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDE0O1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2FuZCc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDEzO1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2Itb3InOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSAxMjtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdiLXhvcic6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDExO1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2ItYW5kJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMTA7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSA5O1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICBjYXNlICdub3QgaW4nOlxuICAgICAgICAgICAgY2FzZSAnaW4nOlxuICAgICAgICAgICAgICAgIHRva2VuLnByZWNpZGVuY2UgPSA4O1xuICAgICAgICAgICAgICAgIHRva2VuLmFzc29jaWF0aXZpdHkgPSBUd2lnLmV4cHJlc3Npb24ub3BlcmF0b3IubGVmdFRvUmlnaHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ34nOiAvLyBTdHJpbmcgY29uY2F0aW5hdGlvblxuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gNjtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcvLyc6XG4gICAgICAgICAgICBjYXNlICcqKic6XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDU7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbm90JzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gMztcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdtYXRjaGVzJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gODtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdzdGFydHMgd2l0aCc6XG4gICAgICAgICAgICAgICAgdG9rZW4ucHJlY2lkZW5jZSA9IDg7XG4gICAgICAgICAgICAgICAgdG9rZW4uYXNzb2NpYXRpdml0eSA9IFR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5sZWZ0VG9SaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZW5kcyB3aXRoJzpcbiAgICAgICAgICAgICAgICB0b2tlbi5wcmVjaWRlbmNlID0gODtcbiAgICAgICAgICAgICAgICB0b2tlbi5hc3NvY2lhdGl2aXR5ID0gVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLmxlZnRUb1JpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiRmFpbGVkIHRvIGxvb2t1cCBvcGVyYXRvcjogXCIgKyBvcGVyYXRvciArIFwiIGlzIGFuIHVua25vd24gb3BlcmF0b3IuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRva2VuLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIG9wZXJhdGlvbnMgb24gdGhlIFJQTiBzdGFjay5cbiAgICAgKlxuICAgICAqIFJldHVybnMgdGhlIHVwZGF0ZWQgc3RhY2suXG4gICAgICovXG4gICAgVHdpZy5leHByZXNzaW9uLm9wZXJhdG9yLnBhcnNlID0gZnVuY3Rpb24gKG9wZXJhdG9yLCBzdGFjaykge1xuICAgICAgICBUd2lnLmxvZy50cmFjZShcIlR3aWcuZXhwcmVzc2lvbi5vcGVyYXRvci5wYXJzZTogXCIsIFwiSGFuZGxpbmcgXCIsIG9wZXJhdG9yKTtcbiAgICAgICAgdmFyIGEsIGIsIGM7XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnPycpIHtcbiAgICAgICAgICAgIGMgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG9wZXJhdG9yICE9PSAnbm90Jykge1xuICAgICAgICAgICAgYSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yICE9PSAnaW4nICYmIG9wZXJhdG9yICE9PSAnbm90IGluJykge1xuICAgICAgICAgICAgaWYgKGEgJiYgQXJyYXkuaXNBcnJheShhKSkge1xuICAgICAgICAgICAgICAgIGEgPSBhLmxlbmd0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGIgJiYgQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIGIgPSBiLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJ21hdGNoZXMnKSB7XG4gICAgICAgICAgICBpZiAoYiAmJiB0eXBlb2YgYiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVQYXJ0cyA9IGIubWF0Y2goL15cXC8oLiopXFwvKFtnaW1zXT8pJC8pO1xuICAgICAgICAgICAgICAgIHZhciByZUJvZHkgPSByZVBhcnRzWzFdO1xuICAgICAgICAgICAgICAgIHZhciByZUZsYWdzID0gcmVQYXJ0c1syXTtcbiAgICAgICAgICAgICAgICBiID0gbmV3IFJlZ0V4cChyZUJvZHksIHJlRmxhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSAnOic6XG4gICAgICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJz8/JzpcbiAgICAgICAgICAgICAgICBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSBiO1xuICAgICAgICAgICAgICAgICAgICBiID0gYztcbiAgICAgICAgICAgICAgICAgICAgYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYSAhPT0gdW5kZWZpbmVkICYmIGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz86JzpcbiAgICAgICAgICAgICAgICBpZiAoVHdpZy5saWIuYm9vbHZhbChhKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgICAgICAgICAgaWYgKGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvL0FuIGV4dGVuZGVkIHRlcm5hcnkuXG4gICAgICAgICAgICAgICAgICAgIGEgPSBiO1xuICAgICAgICAgICAgICAgICAgICBiID0gYztcbiAgICAgICAgICAgICAgICAgICAgYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoVHdpZy5saWIuYm9vbHZhbChhKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VGbG9hdChiKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChhKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgKyBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgYiA9IHBhcnNlRmxvYXQoYik7XG4gICAgICAgICAgICAgICAgYSA9IHBhcnNlRmxvYXQoYSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIC0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KGIpO1xuICAgICAgICAgICAgICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSAqIGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VGbG9hdChiKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChhKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgLyBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnLy8nOlxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUZsb2F0KGIpO1xuICAgICAgICAgICAgICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goTWF0aC5mbG9vcihhIC8gYikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgICBiID0gcGFyc2VGbG9hdChiKTtcbiAgICAgICAgICAgICAgICBhID0gcGFyc2VGbG9hdChhKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgJSBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnfic6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCggKGEgIT0gbnVsbCA/IGEudG9TdHJpbmcoKSA6IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgKGIgIT0gbnVsbCA/IGIudG9TdHJpbmcoKSA6IFwiXCIpICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ25vdCc6XG4gICAgICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFUd2lnLmxpYi5ib29sdmFsKGIpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIDwgYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzw9JzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPD0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSA+IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhID49IGIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICc9PT0nOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSA9PT0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgPT0gYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJyE9PSc6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhICE9PSBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYSAhPSBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnb3InOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goVHdpZy5saWIuYm9vbHZhbChhKSB8fCBUd2lnLmxpYi5ib29sdmFsKGIpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYi1vcic6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhIHwgYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2IteG9yJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgXiBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYW5kJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKFR3aWcubGliLmJvb2x2YWwoYSkgJiYgVHdpZy5saWIuYm9vbHZhbChiKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2ItYW5kJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGEgJiBiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnKionOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goTWF0aC5wb3coYSwgYikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdub3QgaW4nOlxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goICFjb250YWlubWVudChhLCBiKSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdpbic6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCggY29udGFpbm1lbnQoYSwgYikgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbWF0Y2hlcyc6XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCggYi50ZXN0KGEpICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3N0YXJ0cyB3aXRoJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCBhLmluZGV4T2YoYikgPT09IDAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZW5kcyB3aXRoJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCBhLmluZGV4T2YoYiwgYS5sZW5ndGggLSBiLmxlbmd0aCkgIT09IC0xICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCBUd2lnLmZ1bmN0aW9ucy5yYW5nZShhLCBiKSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIG9wZXJhdG9yOiBcIiArIG9wZXJhdG9yICsgXCIgaXMgYW4gdW5rbm93biBvcGVyYXRvci5cIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn07XG5cblxuLyoqKi8gfSksXG4vKiA4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8vICMjIHR3aWcuZmlsdGVycy5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIHBhcnNpbmcgZmlsdGVycy5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFR3aWcpIHtcblxuICAgIC8vIERldGVybWluZSBvYmplY3QgdHlwZVxuICAgIGZ1bmN0aW9uIGlzKHR5cGUsIG9iaikge1xuICAgICAgICB2YXIgY2xhcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKTtcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmIG9iaiAhPT0gbnVsbCAmJiBjbGFzID09PSB0eXBlO1xuICAgIH1cblxuICAgIFR3aWcuZmlsdGVycyA9IHtcbiAgICAgICAgLy8gU3RyaW5nIEZpbHRlcnNcbiAgICAgICAgdXBwZXI6ICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBsb3dlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHZhbHVlLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDEpO1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCAvKF58XFxzKShbYS16XSkvZyAsIGZ1bmN0aW9uKG0sIHAxLCBwMil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHAxICsgcDIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJBcnJheVwiLCB2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHdpZy5saWIuaXMoXCJPYmplY3RcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLl9rZXlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLl9rZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEFycmF5L09iamVjdCBGaWx0ZXJzXG4gICAgICAgIHJldmVyc2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzKFwiT2JqZWN0XCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gdmFsdWUuX2tleXMgfHwgT2JqZWN0LmtleXModmFsdWUpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB2YWx1ZS5fa2V5cyA9IGtleXM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzb3J0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzKFwiQXJyYXlcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnNvcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXMoJ09iamVjdCcsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIFNvcnRpbmcgb2JqZWN0cyBpc24ndCBvYnZpb3VzIHNpbmNlIHRoZSBvcmRlciBvZlxuICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGtleXMgaXNuJ3QgZ3VhcmFudGVlZCBpbiBKYXZhU2NyaXB0LlxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2Ugb2YgdGhpcyB3ZSB1c2UgYSBcImhpZGRlblwiIGtleSBjYWxsZWQgX2tleXMgdG9cbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB0aGUga2V5cyBpbiB0aGUgb3JkZXIgd2Ugd2FudCB0byByZXR1cm4gdGhlbS5cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZS5fa2V5cztcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkX2tleXMgPSBrZXlzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGExLCBhMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSBhbmQgYiBhcmUgY29tcGFyYWJsZSwgd2UncmUgZmluZSA6LSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCh2YWx1ZVthXSA+IHZhbHVlW2JdKSA9PSAhKHZhbHVlW2FdIDw9IHZhbHVlW2JdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVthXSA+IHZhbHVlW2JdID8gMSA6XG5cdFx0XHQgICAgICAgICAgIHZhbHVlW2FdIDwgdmFsdWVbYl0gPyAtMSA6XG5cdFx0XHRcdCAgIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGFuZCBiIGNhbiBiZSBwYXJzZWQgYXMgbnVtYmVycywgd2UgY2FuIGNvbXBhcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZWlyIG51bWVyaWMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIWlzTmFOKGExID0gcGFyc2VGbG9hdCh2YWx1ZVthXSkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpc05hTihiMSA9IHBhcnNlRmxvYXQodmFsdWVbYl0pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhMSA+IGIxID8gMSA6XG5cdFx0XHQgICAgICAgICAgIGExIDwgYjEgPyAtMSA6XG5cdFx0XHRcdCAgIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHZhbHVlcyBpcyBhIHN0cmluZywgd2UgY29udmVydCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyIHZhbHVlIHRvIHN0cmluZyBhcyB3ZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHR5cGVvZiB2YWx1ZVthXSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVthXSA+IHZhbHVlW2JdLnRvU3RyaW5nKCkgPyAxIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVbYV0gPCB2YWx1ZVtiXS50b1N0cmluZygpID8gLTEgOlxuXHRcdFx0XHQgICAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgdmFsdWVbYl0gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbYV0udG9TdHJpbmcoKSA+IHZhbHVlW2JdID8gMSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2FdLnRvU3RyaW5nKCkgPCB2YWx1ZVtiXSA/IC0xIDpcblx0XHRcdFx0ICAgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV2ZXJ5dGhpbmcgZmFpbGVkIC0gcmV0dXJuICdudWxsJyBhcyBzaWduLCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgdmFsdWVzIGFyZSBub3QgY29tcGFyYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhbHVlLl9rZXlzID0gc29ydGVkX2tleXM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBrZXlzOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIga2V5c2V0ID0gdmFsdWUuX2tleXMgfHwgT2JqZWN0LmtleXModmFsdWUpLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9IFtdO1xuXG4gICAgICAgICAgICBUd2lnLmZvckVhY2goa2V5c2V0LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9rZXlzXCIpIHJldHVybjsgLy8gSWdub3JlIHRoZSBfa2V5cyBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuICAgICAgICB1cmxfZW5jb2RlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKCdPYmplY3QnLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWFsaXplID0gZnVuY3Rpb24gKG9iaiwgcHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXNldCA9IG9iai5fa2V5cyB8fCBPYmplY3Qua2V5cyhvYmopO1xuXG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0S2V5ID0gcHJlZml4ID8gcHJlZml4ICsgJ1snICsga2V5ICsgJ10nIDoga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdFZhbHVlID0gb2JqW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChUd2lnLmxpYi5pcygnT2JqZWN0JywgcmVzdWx0VmFsdWUpIHx8IFR3aWcubGliLmlzQXJyYXkocmVzdWx0VmFsdWUpKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplKHJlc3VsdFZhbHVlLCByZXN1bHRLZXkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQocmVzdWx0S2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChyZXN1bHRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignJmFtcDsnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShcIidcIiwgXCIlMjdcIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBqb2luOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgam9pbl9zdHIgPSBcIlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9IFtdLFxuICAgICAgICAgICAgICAgIGtleXNldCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgam9pbl9zdHIgPSBwYXJhbXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5c2V0ID0gdmFsdWUuX2tleXMgfHwgT2JqZWN0LmtleXModmFsdWUpO1xuICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9rZXlzXCIpIHJldHVybjsgLy8gSWdub3JlIHRoZSBfa2V5cyBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2godmFsdWVba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQuam9pbihqb2luX3N0cik7XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVmYXVsdFwiOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQgJiYgcGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcImRlZmF1bHQgZmlsdGVyIGV4cGVjdHMgb25lIGFyZ3VtZW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09ICcnICkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBqc29uX2VuY29kZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSAmJiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgICAgICBUd2lnLmZvckVhY2godmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goVHdpZy5maWx0ZXJzLmpzb25fZW5jb2RlKHYpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBcIltcIiArIG91dHB1dC5qb2luKFwiLFwiKSArIFwiXVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JykgJiYgKGlzKFwiRGF0ZVwiLCB2YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcIicgKyB2YWx1ZS50b0lTT1N0cmluZygpICsgJ1wiJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzZXQgPSB2YWx1ZS5fa2V5cyB8fCBPYmplY3Qua2V5cyh2YWx1ZSksXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICAgICAgICAgICAgICBUd2lnLmZvckVhY2goa2V5c2V0LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goSlNPTi5zdHJpbmdpZnkoa2V5KSArIFwiOlwiICsgVHdpZy5maWx0ZXJzLmpzb25fZW5jb2RlKHZhbHVlW2tleV0pKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBcIntcIiArIG91dHB1dC5qb2luKFwiLFwiKSArIFwifVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBbXSxcbiAgICAgICAgICAgICAgICBhcnJfaW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIGtleXNldCA9IFtdO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgYWxsIHRoZSBvYmplY3RzIGJlaW5nIG1lcmdlZCBhcmUgYXJyYXlzXG4gICAgICAgICAgICBpZiAoIWlzKFwiQXJyYXlcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIG9iaiBhcyBhbiBPYmplY3RcbiAgICAgICAgICAgICAgICBvYmogPSB7IH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXMoXCJBcnJheVwiLCBwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHsgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpcyhcIkFycmF5XCIsIG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmouX2tleXMgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzKFwiQXJyYXlcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5fa2V5cykgb2JqLl9rZXlzLnB1c2goYXJyX2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgb2JqW2Fycl9pbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGFycl9pbmRleCsrO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXlzZXQgPSB2YWx1ZS5fa2V5cyB8fCBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKGtleXNldCwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9rZXlzLnB1c2goa2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZWRnZSBjYXNlIHdoZXJlIGEgbnVtYmVyIGluZGV4IGluIGFuIG9iamVjdCBpcyBncmVhdGVyIHRoYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gICB0aGUgYXJyYXkgY291bnRlci4gSW4gc3VjaCBhIGNhc2UsIHRoZSBhcnJheSBjb3VudGVyIGlzIGluY3JlYXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyAgIG9uZSBwYXN0IHRoZSBpbmRleC5cbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gRXhhbXBsZSB7eyBbXCJhXCIsIFwiYlwiXXxtZXJnZSh7XCI0XCI6XCJ2YWx1ZVwifSwgW1wiY1wiLCBcImRcIl0pXG4gICAgICAgICAgICAgICAgICAgIC8vIFdpdGhvdXQgdGhpcywgZCB3b3VsZCBoYXZlIGFuIGluZGV4IG9mIFwiNFwiIGFuZCBvdmVyd3JpdGUgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgb2YgXCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnRfa2V5ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oaW50X2tleSkgJiYgaW50X2tleSA+PSBhcnJfaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycl9pbmRleCA9IGludF9rZXkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1peGluIHRoZSBtZXJnZSBhcnJheXNcbiAgICAgICAgICAgIFR3aWcuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzKFwiQXJyYXlcIiwgcGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIFR3aWcuZm9yRWFjaChwYXJhbSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLl9rZXlzKSBvYmouX2tleXMucHVzaChhcnJfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2Fycl9pbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJfaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga2V5c2V0ID0gcGFyYW0uX2tleXMgfHwgT2JqZWN0LmtleXMocGFyYW0pO1xuICAgICAgICAgICAgICAgICAgICBUd2lnLmZvckVhY2goa2V5c2V0LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb2JqW2tleV0pIG9iai5fa2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHBhcmFtW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRfa2V5ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGludF9rZXkpICYmIGludF9rZXkgPj0gYXJyX2luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyX2luZGV4ID0gaW50X2tleSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkZpbHRlciBtZXJnZSBleHBlY3RzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBUd2lnLmZ1bmN0aW9ucy5kYXRlKHZhbHVlKTtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBwYXJhbXMgJiYgcGFyYW1zLmxlbmd0aCA/IHBhcmFtc1swXSA6ICdGIGosIFkgSDppJztcbiAgICAgICAgICAgIHJldHVybiBUd2lnLmxpYi5kYXRlKGZvcm1hdC5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpLCBkYXRlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXRlX21vZGlmeTogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiZGF0ZV9tb2RpZnkgZmlsdGVyIGV4cGVjdHMgMSBhcmd1bWVudFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1vZGlmeVRleHQgPSBwYXJhbXNbMF0sIHRpbWU7XG5cbiAgICAgICAgICAgIGlmIChUd2lnLmxpYi5pcyhcIkRhdGVcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGltZSA9IFR3aWcubGliLnN0cnRvdGltZShtb2RpZnlUZXh0LCB2YWx1ZS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChUd2lnLmxpYi5pcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aW1lID0gVHdpZy5saWIuc3RydG90aW1lKG1vZGlmeVRleHQsIFR3aWcubGliLnN0cnRvdGltZSh2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKFwiTnVtYmVyXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRpbWUgPSBUd2lnLmxpYi5zdHJ0b3RpbWUobW9kaWZ5VGV4dCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGltZSAqIDEwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkfHx2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFpcnMgPSBwYXJhbXNbMF0sXG4gICAgICAgICAgICAgICAgdGFnO1xuICAgICAgICAgICAgZm9yICh0YWcgaW4gcGFpcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFpcnMuaGFzT3duUHJvcGVydHkodGFnKSAmJiB0YWcgIT09IFwiX2tleXNcIikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFR3aWcubGliLnJlcGxhY2VBbGwodmFsdWUsIHRhZywgcGFpcnNbdGFnXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFR3aWcubGliLnZzcHJpbnRmKHZhbHVlLCBwYXJhbXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmlwdGFnczogZnVuY3Rpb24odmFsdWUsIGFsbG93ZWQpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBUd2lnLmxpYi5zdHJpcF90YWdzKHZhbHVlLCBhbGxvd2VkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBlc2NhcGU6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0cmF0ZWd5ID0gXCJodG1sXCI7XG4gICAgICAgICAgICBpZihwYXJhbXMgJiYgcGFyYW1zLmxlbmd0aCAmJiBwYXJhbXNbMF0gIT09IHRydWUpXG4gICAgICAgICAgICAgICAgc3RyYXRlZ3kgPSBwYXJhbXNbMF07XG5cbiAgICAgICAgICAgIGlmKHN0cmF0ZWd5ID09IFwiaHRtbFwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJhd192YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuTWFya3VwKHJhd192YWx1ZSwgJ2h0bWwnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihzdHJhdGVneSA9PSBcImpzXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmF3X3ZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCByYXdfdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocmF3X3ZhbHVlW2ldLm1hdGNoKC9eW2EtekEtWjAtOSxcXC5fXSQvKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSByYXdfdmFsdWVbaV07XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXJfY29kZSA9IHJhd192YWx1ZS5jaGFyQ29kZUF0KGkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaGFyX2NvZGUgPCAweDgwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIlxcXFx4XCIgKyBjaGFyX2NvZGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFR3aWcubGliLnNwcmludGYoXCJcXFxcdSUwNHNcIiwgY2hhcl9jb2RlLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLk1hcmt1cChyZXN1bHQsICdqcycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHN0cmF0ZWd5ID09IFwiY3NzXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmF3X3ZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCByYXdfdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocmF3X3ZhbHVlW2ldLm1hdGNoKC9eW2EtekEtWjAtOV0kLykpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gcmF3X3ZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFyX2NvZGUgPSByYXdfdmFsdWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIlxcXFxcIiArIGNoYXJfY29kZS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSArIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuTWFya3VwKHJlc3VsdCwgJ2NzcycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHN0cmF0ZWd5ID09IFwidXJsXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gVHdpZy5maWx0ZXJzLnVybF9lbmNvZGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLk1hcmt1cChyZXN1bHQsICd1cmwnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihzdHJhdGVneSA9PSBcImh0bWxfYXR0clwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJhd192YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgcmF3X3ZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJhd192YWx1ZVtpXS5tYXRjaCgvXlthLXpBLVowLTksXFwuXFwtX10kLykpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gcmF3X3ZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKHJhd192YWx1ZVtpXS5tYXRjaCgvXlsmPD5cIl0kLykpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gcmF3X3ZhbHVlW2ldLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhcl9jb2RlID0gcmF3X3ZhbHVlLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgcmVwbGFjZXMgY2hhcmFjdGVycyB1bmRlZmluZWQgaW4gSFRNTCB3aXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgaGV4IGVudGl0eSBmb3IgdGhlIFVuaWNvZGUgcmVwbGFjZW1lbnQgY2hhcmFjdGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2hhcl9jb2RlIDw9IDB4MWYgJiYgY2hhcl9jb2RlICE9IDB4MDkgJiYgY2hhcl9jb2RlICE9IDB4MGEgJiYgY2hhcl9jb2RlICE9IDB4MGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiJiN4RkZGRDtcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoY2hhcl9jb2RlIDwgMHg4MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gVHdpZy5saWIuc3ByaW50ZihcIiYjeCUwMnM7XCIsIGNoYXJfY29kZS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFR3aWcubGliLnNwcmludGYoXCImI3glMDRzO1wiLCBjaGFyX2NvZGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuTWFya3VwKHJlc3VsdCwgJ2h0bWxfYXR0cicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcImVzY2FwZSBzdHJhdGVneSB1bnN1cHBvcnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKiBBbGlhcyBvZiBlc2NhcGUgKi9cbiAgICAgICAgXCJlXCI6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBUd2lnLmZpbHRlcnMuZXNjYXBlKHZhbHVlLCBwYXJhbXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5sMmJyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaW5lYnJlYWtfdGFnID0gXCJCQUNLU0xBU0hfbl9yZXBsYWNlXCIsXG4gICAgICAgICAgICAgICAgYnIgPSBcIjxiciAvPlwiICsgbGluZWJyZWFrX3RhZztcblxuICAgICAgICAgICAgdmFsdWUgPSBUd2lnLmZpbHRlcnMuZXNjYXBlKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcclxcbi9nLCBicilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgYnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIGJyKTtcblxuICAgICAgICAgICAgdmFsdWUgPSBUd2lnLmxpYi5yZXBsYWNlQWxsKHZhbHVlLCBsaW5lYnJlYWtfdGFnLCBcIlxcblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIFR3aWcuTWFya3VwKHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRhcHRlZCBmcm9tOiBodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9udW1iZXJfZm9ybWF0OjQ4MVxuICAgICAgICAgKi9cbiAgICAgICAgbnVtYmVyX2Zvcm1hdDogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIG51bWJlciA9IHZhbHVlLFxuICAgICAgICAgICAgICAgIGRlY2ltYWxzID0gKHBhcmFtcyAmJiBwYXJhbXNbMF0pID8gcGFyYW1zWzBdIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlYyAgICAgID0gKHBhcmFtcyAmJiBwYXJhbXNbMV0gIT09IHVuZGVmaW5lZCkgPyBwYXJhbXNbMV0gOiBcIi5cIixcbiAgICAgICAgICAgICAgICBzZXAgICAgICA9IChwYXJhbXMgJiYgcGFyYW1zWzJdICE9PSB1bmRlZmluZWQpID8gcGFyYW1zWzJdIDogXCIsXCI7XG5cbiAgICAgICAgICAgIG51bWJlciA9IChudW1iZXIgKyAnJykucmVwbGFjZSgvW14wLTkrXFwtRWUuXS9nLCAnJyk7XG4gICAgICAgICAgICB2YXIgbiA9ICFpc0Zpbml0ZSgrbnVtYmVyKSA/IDAgOiArbnVtYmVyLFxuICAgICAgICAgICAgICAgIHByZWMgPSAhaXNGaW5pdGUoK2RlY2ltYWxzKSA/IDAgOiBNYXRoLmFicyhkZWNpbWFscyksXG4gICAgICAgICAgICAgICAgcyA9ICcnLFxuICAgICAgICAgICAgICAgIHRvRml4ZWRGaXggPSBmdW5jdGlvbiAobiwgcHJlYykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgayA9IE1hdGgucG93KDEwLCBwcmVjKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnICsgTWF0aC5yb3VuZChuICogaykgLyBrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG4gICAgICAgICAgICBzID0gKHByZWMgPyB0b0ZpeGVkRml4KG4sIHByZWMpIDogJycgKyBNYXRoLnJvdW5kKG4pKS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYgKHNbMF0ubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIHNbMF0gPSBzWzBdLnJlcGxhY2UoL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoc1sxXSB8fCAnJykubGVuZ3RoIDwgcHJlYykge1xuICAgICAgICAgICAgICAgIHNbMV0gPSBzWzFdIHx8ICcnO1xuICAgICAgICAgICAgICAgIHNbMV0gKz0gbmV3IEFycmF5KHByZWMgLSBzWzFdLmxlbmd0aCArIDEpLmpvaW4oJzAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzLmpvaW4oZGVjKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmltOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZHx8IHZhbHVlID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHIgPSAnJyArIHZhbHVlLFxuICAgICAgICAgICAgICAgIHdoaXRlc3BhY2U7XG4gICAgICAgICAgICBpZiAoIHBhcmFtcyAmJiBwYXJhbXNbMF0gKSB7XG4gICAgICAgICAgICAgICAgd2hpdGVzcGFjZSA9ICcnICsgcGFyYW1zWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGl0ZXNwYWNlID0gJyBcXG5cXHJcXHRcXGZcXHgwYlxceGEwXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMGFcXHUyMDBiXFx1MjAyOFxcdTIwMjlcXHUzMDAwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdoaXRlc3BhY2UuaW5kZXhPZihzdHIuY2hhckF0KGkpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyhpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gc3RyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdoaXRlc3BhY2UuaW5kZXhPZihzdHIuY2hhckF0KGkpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aGl0ZXNwYWNlLmluZGV4T2Yoc3RyLmNoYXJBdCgwKSkgPT09IC0xID8gc3RyIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJ1bmNhdGU6IGZ1bmN0aW9uICh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gMzAsXG4gICAgICAgICAgICAgICAgcHJlc2VydmUgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSAnLi4uJztcblxuICAgICAgICAgICAgdmFsdWUgPSAgdmFsdWUgKyAnJztcbiAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZSA9IHBhcmFtc1sxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1syXSkge1xuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBwYXJhbXNbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gbGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUuaW5kZXhPZignICcsIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICB2YWx1ZS5zdWJzdHIoMCwgbGVuZ3RoKSArIHNlcGFyYXRvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNsaWNlOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwic2xpY2UgZmlsdGVyIGV4cGVjdHMgYXQgbGVhc3QgMSBhcmd1bWVudFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBzdGFydCBvZiBzdHJpbmdcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHBhcmFtc1swXSB8fCAwO1xuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBsZW5ndGggb2Ygc3RyaW5nXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gcGFyYW1zLmxlbmd0aCA+IDEgPyBwYXJhbXNbMV0gOiB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgc3RhcnQgdmFsdWVzXG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHN0YXJ0ID49IDAgPyBzdGFydCA6IE1hdGgubWF4KCB2YWx1ZS5sZW5ndGggKyBzdGFydCwgMCApO1xuXG4gICAgICAgICAgICBpZiAoVHdpZy5saWIuaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7IGkgPCBzdGFydEluZGV4ICsgbGVuZ3RoICYmIGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKFwiU3RyaW5nXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoc3RhcnRJbmRleCwgbGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJzbGljZSBmaWx0ZXIgZXhwZWN0cyB2YWx1ZSB0byBiZSBhbiBhcnJheSBvciBzdHJpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWJzOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXMoXCJBcnJheVwiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzKFwiT2JqZWN0XCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICgnX2tleXMnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVt2YWx1ZS5fa2V5c1swXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoMCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSxcblxuICAgICAgICBzcGxpdDogZnVuY3Rpb24odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmxlbmd0aCA8IDEgfHwgcGFyYW1zLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcInNwbGl0IGZpbHRlciBleHBlY3RzIDEgb3IgMiBhcmd1bWVudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChUd2lnLmxpYi5pcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsaW1pdGVyID0gcGFyYW1zWzBdLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdCA9IHBhcmFtc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSB2YWx1ZS5zcGxpdChkZWxpbWl0ZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3BsaXQ7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxpbWl0IDwgMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zcGxpdChkZWxpbWl0ZXIsIHNwbGl0Lmxlbmd0aCArIGxpbWl0KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpbWl0ZWRTcGxpdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWxpbWl0ZXIgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVtcHR5IGRlbGltaXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJhYWJiY2NcInxzcGxpdCgnJywgMilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAtPiBbJ2FhJywgJ2JiJywgJ2NjJ11cblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUoc3BsaXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGltaXQgJiYgc3BsaXQubGVuZ3RoID4gMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAgKz0gc3BsaXQuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRlZFNwbGl0LnB1c2godGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vbi1lbXB0eSBkZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwib25lLHR3byx0aHJlZSxmb3VyLGZpdmVcInxzcGxpdCgnLCcsIDMpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLT4gWydvbmUnLCAndHdvJywgJ3RocmVlLGZvdXIsZml2ZSddXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaW1pdC0xICYmIHNwbGl0Lmxlbmd0aCA+IDA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0ZWRTcGxpdC5wdXNoKHNwbGl0LnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0ZWRTcGxpdC5wdXNoKHNwbGl0LmpvaW4oZGVsaW1pdGVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGltaXRlZFNwbGl0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcInNwbGl0IGZpbHRlciBleHBlY3RzIHZhbHVlIHRvIGJlIGEgc3RyaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsYXN0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKCdPYmplY3QnLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cztcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5fa2V5cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cyA9IHZhbHVlLl9rZXlzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVtrZXlzW2tleXMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdHJpbmd8YXJyYXlcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXTtcbiAgICAgICAgfSxcbiAgICAgICAgcmF3OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFR3aWcuTWFya3VwKHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgYmF0Y2g6IGZ1bmN0aW9uKGl0ZW1zLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0gcGFyYW1zLnNoaWZ0KCksXG4gICAgICAgICAgICAgICAgZmlsbCA9IHBhcmFtcy5zaGlmdCgpLFxuICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICBsYXN0LFxuICAgICAgICAgICAgICAgIG1pc3Npbmc7XG5cbiAgICAgICAgICAgIGlmICghVHdpZy5saWIuaXMoXCJBcnJheVwiLCBpdGVtcykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcImJhdGNoIGZpbHRlciBleHBlY3RzIGl0ZW1zIHRvIGJlIGFuIGFycmF5XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIVR3aWcubGliLmlzKFwiTnVtYmVyXCIsIHNpemUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJiYXRjaCBmaWx0ZXIgZXhwZWN0cyBzaXplIHRvIGJlIGEgbnVtYmVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaXplID0gTWF0aC5jZWlsKHNpemUpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBUd2lnLmxpYi5jaHVua0FycmF5KGl0ZW1zLCBzaXplKTtcblxuICAgICAgICAgICAgaWYgKGZpbGwgJiYgaXRlbXMubGVuZ3RoICUgc2l6ZSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgbGFzdCA9IHJlc3VsdC5wb3AoKTtcbiAgICAgICAgICAgICAgICBtaXNzaW5nID0gc2l6ZSAtIGxhc3QubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKG1pc3NpbmctLSkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0LnB1c2goZmlsbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGFzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHJvdW5kOiBmdW5jdGlvbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgW107XG5cbiAgICAgICAgICAgIHZhciBwcmVjaXNpb24gPSBwYXJhbXMubGVuZ3RoID4gMCA/IHBhcmFtc1swXSA6IDAsXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gcGFyYW1zLmxlbmd0aCA+IDEgPyBwYXJhbXNbMV0gOiBcImNvbW1vblwiO1xuXG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuXG4gICAgICAgICAgICBpZihwcmVjaXNpb24gJiYgIVR3aWcubGliLmlzKFwiTnVtYmVyXCIsIHByZWNpc2lvbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcInJvdW5kIGZpbHRlciBleHBlY3RzIHByZWNpc2lvbiB0byBiZSBhIG51bWJlclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJjb21tb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmxpYi5yb3VuZCh2YWx1ZSwgcHJlY2lzaW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIVR3aWcubGliLmlzKFwiRnVuY3Rpb25cIiwgTWF0aFttZXRob2RdKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwicm91bmQgZmlsdGVyIGV4cGVjdHMgbWV0aG9kIHRvIGJlICdmbG9vcicsICdjZWlsJywgb3IgJ2NvbW1vbidcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoW21ldGhvZF0odmFsdWUgKiBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKSkgLyBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBUd2lnLmZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlciwgdmFsdWUsIHBhcmFtcykge1xuICAgICAgICBpZiAoIVR3aWcuZmlsdGVyc1tmaWx0ZXJdKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIGZpbHRlciBcIiArIGZpbHRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVHdpZy5maWx0ZXJzW2ZpbHRlcl0uY2FsbCh0aGlzLCB2YWx1ZSwgcGFyYW1zKTtcbiAgICB9O1xuXG4gICAgVHdpZy5maWx0ZXIuZXh0ZW5kID0gZnVuY3Rpb24oZmlsdGVyLCBkZWZpbml0aW9uKSB7XG4gICAgICAgIFR3aWcuZmlsdGVyc1tmaWx0ZXJdID0gZGVmaW5pdGlvbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn07XG5cblxuLyoqKi8gfSksXG4vKiA5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8vICMjIHR3aWcuZnVuY3Rpb25zLmpzXG4vL1xuLy8gVGhpcyBmaWxlIGhhbmRsZXMgcGFyc2luZyBmaWx0ZXJzLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVHdpZykge1xuICAgIC8qKlxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdmFyIFRFTVBMQVRFX05PVF9GT1VORF9NRVNTQUdFID0gJ1RlbXBsYXRlIFwie25hbWV9XCIgaXMgbm90IGRlZmluZWQuJztcblxuICAgIC8vIERldGVybWluZSBvYmplY3QgdHlwZVxuICAgIGZ1bmN0aW9uIGlzKHR5cGUsIG9iaikge1xuICAgICAgICB2YXIgY2xhcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKTtcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmIG9iaiAhPT0gbnVsbCAmJiBjbGFzID09PSB0eXBlO1xuICAgIH1cblxuICAgIFR3aWcuZnVuY3Rpb25zID0ge1xuICAgICAgICAvLyAgYXR0cmlidXRlLCBibG9jaywgY29uc3RhbnQsIGRhdGUsIGR1bXAsIHBhcmVudCwgcmFuZG9tLC5cblxuICAgICAgICAvLyBSYW5nZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL3JhbmdlOjQ5OVxuICAgICAgICAvLyBVc2VkIHVuZGVyIGFuIE1JVCBMaWNlbnNlXG4gICAgICAgIHJhbmdlOiBmdW5jdGlvbiAobG93LCBoaWdoLCBzdGVwKSB7XG4gICAgICAgICAgICAvLyBodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldFxuICAgICAgICAgICAgLy8gKyAgIG9yaWdpbmFsIGJ5OiBXYWxkbyBNYWxxdWkgU2lsdmFcbiAgICAgICAgICAgIC8vICogICAgIGV4YW1wbGUgMTogcmFuZ2UgKCAwLCAxMiApO1xuICAgICAgICAgICAgLy8gKiAgICAgcmV0dXJucyAxOiBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl1cbiAgICAgICAgICAgIC8vICogICAgIGV4YW1wbGUgMjogcmFuZ2UoIDAsIDEwMCwgMTAgKTtcbiAgICAgICAgICAgIC8vICogICAgIHJldHVybnMgMjogWzAsIDEwLCAyMCwgMzAsIDQwLCA1MCwgNjAsIDcwLCA4MCwgOTAsIDEwMF1cbiAgICAgICAgICAgIC8vICogICAgIGV4YW1wbGUgMzogcmFuZ2UoICdhJywgJ2knICk7XG4gICAgICAgICAgICAvLyAqICAgICByZXR1cm5zIDM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knXVxuICAgICAgICAgICAgLy8gKiAgICAgZXhhbXBsZSA0OiByYW5nZSggJ2MnLCAnYScgKTtcbiAgICAgICAgICAgIC8vICogICAgIHJldHVybnMgNDogWydjJywgJ2InLCAnYSddXG4gICAgICAgICAgICB2YXIgbWF0cml4ID0gW107XG4gICAgICAgICAgICB2YXIgaW5pdmFsLCBlbmR2YWwsIHBsdXM7XG4gICAgICAgICAgICB2YXIgd2Fsa2VyID0gc3RlcCB8fCAxO1xuICAgICAgICAgICAgdmFyIGNoYXJzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICghaXNOYU4obG93KSAmJiAhaXNOYU4oaGlnaCkpIHtcbiAgICAgICAgICAgICAgICBpbml2YWwgPSBwYXJzZUludChsb3csIDEwKTtcbiAgICAgICAgICAgICAgICBlbmR2YWwgPSBwYXJzZUludChoaWdoLCAxMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGxvdykgJiYgaXNOYU4oaGlnaCkpIHtcbiAgICAgICAgICAgICAgICBjaGFycyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5pdmFsID0gbG93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgICAgZW5kdmFsID0gaGlnaC5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbml2YWwgPSAoaXNOYU4obG93KSA/IDAgOiBsb3cpO1xuICAgICAgICAgICAgICAgIGVuZHZhbCA9IChpc05hTihoaWdoKSA/IDAgOiBoaWdoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGx1cyA9ICgoaW5pdmFsID4gZW5kdmFsKSA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICBpZiAocGx1cykge1xuICAgICAgICAgICAgICAgIHdoaWxlIChpbml2YWwgPD0gZW5kdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5wdXNoKCgoY2hhcnMpID8gU3RyaW5nLmZyb21DaGFyQ29kZShpbml2YWwpIDogaW5pdmFsKSk7XG4gICAgICAgICAgICAgICAgICAgIGluaXZhbCArPSB3YWxrZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5pdmFsID49IGVuZHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRyaXgucHVzaCgoKGNoYXJzKSA/IFN0cmluZy5mcm9tQ2hhckNvZGUoaW5pdmFsKSA6IGluaXZhbCkpO1xuICAgICAgICAgICAgICAgICAgICBpbml2YWwgLT0gd2Fsa2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1hdHJpeDtcbiAgICAgICAgfSxcbiAgICAgICAgY3ljbGU6IGZ1bmN0aW9uKGFyciwgaSkge1xuICAgICAgICAgICAgdmFyIHBvcyA9IGkgJSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGFycltwb3NdO1xuICAgICAgICB9LFxuICAgICAgICBkdW1wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIERvbid0IHBhc3MgYXJndW1lbnRzIHRvIGBBcnJheS5zbGljZWAsIHRoYXQgaXMgYSBwZXJmb3JtYW5jZSBraWxsZXJcbiAgICAgICAgICAgIHZhciBhcmdzX2kgPSBhcmd1bWVudHMubGVuZ3RoOyBhcmdzID0gbmV3IEFycmF5KGFyZ3NfaSk7XG4gICAgICAgICAgICB3aGlsZShhcmdzX2ktLSA+IDApIGFyZ3NbYXJnc19pXSA9IGFyZ3VtZW50c1thcmdzX2ldO1xuXG4gICAgICAgICAgICB2YXIgRU9MID0gJ1xcbicsXG4gICAgICAgICAgICAgICAgaW5kZW50Q2hhciA9ICcgICcsXG4gICAgICAgICAgICAgICAgaW5kZW50VGltZXMgPSAwLFxuICAgICAgICAgICAgICAgIG91dCA9ICcnLFxuICAgICAgICAgICAgICAgIGluZGVudCA9IGZ1bmN0aW9uKHRpbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmQgID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aW1lcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmQgKz0gaW5kZW50Q2hhcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGlzcGxheVZhciA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBpbmRlbnQoaW5kZW50VGltZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXBWYXIodmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZih2YXJpYWJsZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnZnVuY3Rpb24oKScgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnc3RyaW5nKCcgKyB2YXJpYWJsZS5sZW5ndGggKyAnKSBcIicgKyB2YXJpYWJsZSArICdcIicgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHZhcmlhYmxlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnbnVtYmVyKCcgKyB2YXJpYWJsZSArICcpJyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YodmFyaWFibGUpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnYm9vbCgnICsgdmFyaWFibGUgKyAnKScgKyBFT0w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGR1bXBWYXIgPSBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJ05VTEwnICsgRU9MO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhcmlhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAndW5kZWZpbmVkJyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFyaWFibGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gaW5kZW50KGluZGVudFRpbWVzKSArIHR5cGVvZih2YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnRUaW1lcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcoJyArIChmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IDAsIGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSh2YXJpYWJsZSkgKyAnKSB7JyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiB2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBpbmRlbnQoaW5kZW50VGltZXMpICsgJ1snICsgaSArICddPT4gJyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VmFyKHZhcmlhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudFRpbWVzLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gaW5kZW50KGluZGVudFRpbWVzKSArICd9JyArIEVPTDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlWYXIodmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIG5vIGFyZ3VtZW50IGNhc2UgYnkgZHVtcGluZyB0aGUgZW50aXJlIHJlbmRlciBjb250ZXh0XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT0gMCkgYXJncy5wdXNoKHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgICAgIFR3aWcuZm9yRWFjaChhcmdzLCBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIGR1bXBWYXIodmFyaWFibGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGU6IGZ1bmN0aW9uKGRhdGUsIHRpbWUpIHtcbiAgICAgICAgICAgIHZhciBkYXRlT2JqO1xuICAgICAgICAgICAgaWYgKGRhdGUgPT09IHVuZGVmaW5lZCB8fCBkYXRlID09PSBudWxsIHx8IGRhdGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkYXRlT2JqID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHdpZy5saWIuaXMoXCJEYXRlXCIsIGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgZGF0ZU9iaiA9IGRhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKFwiU3RyaW5nXCIsIGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGUubWF0Y2goL15bMC05XSskLykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iaiA9IG5ldyBEYXRlKGRhdGUgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmogPSBuZXcgRGF0ZShUd2lnLmxpYi5zdHJ0b3RpbWUoZGF0ZSkgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKFwiTnVtYmVyXCIsIGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgZGF0ZU9iaiA9IG5ldyBEYXRlKGRhdGUgKiAxMDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgZGF0ZSBcIiArIGRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGVPYmo7XG4gICAgICAgIH0sXG4gICAgICAgIGJsb2NrOiBmdW5jdGlvbihibG9jaykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxCbG9ja1Rva2Vuc1tibG9ja10pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5sb2dpYy5wYXJzZS5jYWxsKHRoaXMsIHRoaXMub3JpZ2luYWxCbG9ja1Rva2Vuc1tibG9ja10sIHRoaXMuY29udGV4dCkub3V0cHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3NbYmxvY2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gQWRkIGEgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIHJldHVybiBUd2lnLnBsYWNlaG9sZGVycy5wYXJlbnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJpYnV0ZTogZnVuY3Rpb24ob2JqZWN0LCBtZXRob2QsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzKCdPYmplY3QnLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShtZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFttZXRob2RdLmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RbbWV0aG9kXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFycmF5IHdpbGwgcmV0dXJuIGVsZW1lbnQgMC1pbmRleFxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFttZXRob2RdIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWF4OiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmKFR3aWcubGliLmlzKFwiT2JqZWN0XCIsIHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVzW1wiX2tleXNcIl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcubGliLm1heCh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5saWIubWF4LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG4gICAgICAgIG1pbjogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICBpZihUd2lnLmxpYi5pcyhcIk9iamVjdFwiLCB2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlc1tcIl9rZXlzXCJdO1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmxpYi5taW4odmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFR3aWcubGliLm1pbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZV9mcm9tX3N0cmluZzogZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBUd2lnLlRlbXBsYXRlcy5wYXJzZXJzLnR3aWcoe1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZW1wbGF0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJhbmRvbTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBMSU1JVF9JTlQzMSA9IDB4ODAwMDAwMDA7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJhbmRvbU51bWJlcihuKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIExJTUlUX0lOVDMxKTtcbiAgICAgICAgICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uY2FsbChudWxsLCAwLCBuKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXguY2FsbChudWxsLCAwLCBuKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcigobWF4IC0gbWluICsgMSkgKiByYW5kb20gLyBMSU1JVF9JTlQzMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKFR3aWcubGliLmlzKFwiTnVtYmVyXCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21OdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihUd2lnLmxpYi5pcyhcIlN0cmluZ1wiLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KGdldFJhbmRvbU51bWJlcih2YWx1ZS5sZW5ndGgtMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihUd2lnLmxpYi5pcyhcIkFycmF5XCIsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVtnZXRSYW5kb21OdW1iZXIodmFsdWUubGVuZ3RoLTEpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoVHdpZy5saWIuaXMoXCJPYmplY3RcIiwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlW2tleXNbZ2V0UmFuZG9tTnVtYmVyKGtleXMubGVuZ3RoLTEpXV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21OdW1iZXIoTElNSVRfSU5UMzEtMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgYSB0ZW1wbGF0ZSB3aXRob3V0IHJlbmRlcmluZyBpdFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpZ25vcmVfbWlzc2luZz1mYWxzZV1cbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHNvdXJjZTogZnVuY3Rpb24obmFtZSwgaWdub3JlX21pc3NpbmcpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVNvdXJjZTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgaXNOb2RlRW52aXJvbm1lbnQgPSAgdHJ1ZSAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnO1xuICAgICAgICAgICAgdmFyIGxvYWRlcjtcbiAgICAgICAgICAgIHZhciBwYXRoID0gbmFtZTtcblxuICAgICAgICAgICAgLy9pZiB3ZSBhcmUgcnVubmluZyBpbiBhIG5vZGUuanMgZW52aXJvbm1lbnQsIHNldCB0aGUgbG9hZGVyIHRvICdmcycuXG4gICAgICAgICAgICBpZiAoaXNOb2RlRW52aXJvbm1lbnQpIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIgPSAnZnMnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIgPSAnYWpheCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYnVpbGQgdGhlIHBhcmFtcyBvYmplY3RcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IGxvYWRlcixcbiAgICAgICAgICAgICAgICBwYXJzZXI6ICdzb3VyY2UnLFxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmZXRjaFRlbXBsYXRlU291cmNlOiB0cnVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RlZmF1bHQgaWdub3JlX21pc3NpbmcgdG8gZmFsc2VcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWdub3JlX21pc3NpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWdub3JlX21pc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90cnkgdG8gbG9hZCB0aGUgcmVtb3RlIHRlbXBsYXRlXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy9vbiBleGNlcHRpb24sIGxvZyBpdFxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZSA9IFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUobmFtZSwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIC8vaWYgdGhlIHRlbXBsYXRlIGlzIHVuZGVmaW5lZCBvciBudWxsLCBzZXQgdGhlIHRlbXBsYXRlIHRvIGFuIGVtcHR5IHN0cmluZyBhbmQgZG8gTk9UIGZsaXAgdGhlXG4gICAgICAgICAgICAgICAgLy8gYm9vbGVhbiBpbmRpY2F0aW5nIHdlIGZvdW5kIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy9lbHNlLCBhbGwgaXMgZ29vZCEgZmxpcCB0aGUgYm9vbGVhbiBpbmRpY2F0aW5nIHdlIGZvdW5kIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVTb3VyY2UgPT09ICd1bmRlZmluZWQnIHx8IHRlbXBsYXRlU291cmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlU291cmNlID0gJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIFR3aWcubG9nLmRlYnVnKCdUd2lnLmZ1bmN0aW9ucy5zb3VyY2U6ICcsICdQcm9ibGVtIGxvYWRpbmcgdGVtcGxhdGUgICcsIGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2lmIHRoZSB0ZW1wbGF0ZSB3YXMgTk9UIGZvdW5kIEFORCB3ZSBhcmUgbm90IGlnbm9yaW5nIG1pc3NpbmcgdGVtcGxhdGVzLCByZXR1cm4gdGhlIHNhbWUgbWVzc2FnZVxuICAgICAgICAgICAgLy8gdGhhdCBpcyByZXR1cm5lZCBieSB0aGUgUEhQIGltcGxlbWVudGF0aW9uIG9mIHRoZSB0d2lnIHNvdXJjZSgpIGZ1bmN0aW9uXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy9lbHNlLCByZXR1cm4gdGhlIHRlbXBsYXRlIHNvdXJjZVxuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZUZvdW5kICYmICFpZ25vcmVfbWlzc2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBURU1QTEFURV9OT1RfRk9VTkRfTUVTU0FHRS5yZXBsYWNlKCd7bmFtZX0nLCBuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlU291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFR3aWcuX2Z1bmN0aW9uID0gZnVuY3Rpb24oX2Z1bmN0aW9uLCB2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghVHdpZy5mdW5jdGlvbnNbX2Z1bmN0aW9uXSkge1xuICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBmdW5jdGlvbiBcIiArIF9mdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVHdpZy5mdW5jdGlvbnNbX2Z1bmN0aW9uXSh2YWx1ZSwgcGFyYW1zKTtcbiAgICB9O1xuXG4gICAgVHdpZy5fZnVuY3Rpb24uZXh0ZW5kID0gZnVuY3Rpb24oX2Z1bmN0aW9uLCBkZWZpbml0aW9uKSB7XG4gICAgICAgIFR3aWcuZnVuY3Rpb25zW19mdW5jdGlvbl0gPSBkZWZpbml0aW9uO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHdpZztcblxufTtcblxuXG4vKioqLyB9KSxcbi8qIDEwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8vICMjIHR3aWcubGliLmpzXG4vL1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIDNyZCBwYXJ0eSBsaWJyYXJpZXMgdXNlZCB3aXRoaW4gdHdpZy5cbi8vXG4vLyBDb3BpZXMgb2YgdGhlIGxpY2Vuc2VzIGZvciB0aGUgY29kZSBpbmNsdWRlZCBoZXJlIGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0VTLm1kIGZpbGUuXG4vL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFR3aWcpIHtcblxuICAgIC8vIE5hbWVzcGFjZSBmb3IgbGlicmFyaWVzXG4gICAgVHdpZy5saWIgPSB7IH07XG5cbiAgICBUd2lnLmxpYi5zcHJpbnRmID0gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbiAgICBUd2lnLmxpYi52c3ByaW50ZiA9IF9fd2VicGFja19yZXF1aXJlX18oMTEpO1xuICAgIFR3aWcubGliLnJvdW5kID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMik7XG4gICAgVHdpZy5saWIubWF4ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG4gICAgVHdpZy5saWIubWluID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNCk7XG4gICAgVHdpZy5saWIuc3RyaXBfdGFncyA9IF9fd2VicGFja19yZXF1aXJlX18oMTUpO1xuICAgIFR3aWcubGliLnN0cnRvdGltZSA9IF9fd2VicGFja19yZXF1aXJlX18oMTcpO1xuICAgIFR3aWcubGliLmRhdGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4KTtcbiAgICBUd2lnLmxpYi5ib29sdmFsID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOSk7XG5cbiAgICB2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4gICAgVHdpZy5saWIuaXMgPSBmdW5jdGlvbih0eXBlLCBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnIHx8IG9iaiA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ0FycmF5JyAmJiBBcnJheS5pc0FycmF5KVxuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcblxuICAgICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKSA9PT0gdHlwZTtcbiAgICB9O1xuXG4gICAgVHdpZy5saWIuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikuc2xpY2UoOCwgLTEpID09PSAnQXJyYXknO1xuICAgIH1cblxuICAgIC8vIHNoYWxsb3ctY29weSBhbiBvYmplY3RcbiAgICBUd2lnLmxpYi5jb3B5ID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB7fSxcbiAgICAgICAgICAgIGtleTtcbiAgICAgICAgZm9yIChrZXkgaW4gc3JjKVxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICBUd2lnLmxpYi5leHRlbmQgPSBmdW5jdGlvbiAoc3JjLCBhZGQpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQgfHwge30pLFxuICAgICAgICAgICAgaTtcblxuICAgICAgICBpID0ga2V5cy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgc3JjW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNyYztcbiAgICB9O1xuXG4gICAgVHdpZy5saWIucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKHN0cmluZywgc2VhcmNoLCByZXBsYWNlKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcuc3BsaXQoc2VhcmNoKS5qb2luKHJlcGxhY2UpO1xuICAgIH07XG5cbiAgICAvLyBjaHVuayBhbiBhcnJheSAoYXJyKSBpbnRvIGFycmF5cyBvZiAoc2l6ZSkgaXRlbXMsIHJldHVybnMgYW4gYXJyYXkgb2YgYXJyYXlzLCBvciBhbiBlbXB0eSBhcnJheSBvbiBpbnZhbGlkIGlucHV0XG4gICAgVHdpZy5saWIuY2h1bmtBcnJheSA9IGZ1bmN0aW9uIChhcnIsIHNpemUpIHtcbiAgICAgICAgdmFyIHJldHVyblZhbCA9IFtdLFxuICAgICAgICAgICAgeCA9IDAsXG4gICAgICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gICAgICAgIGlmIChzaXplIDwgMSB8fCAhVHdpZy5saWIuaXMoXCJBcnJheVwiLCBhcnIpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoeCA8IGxlbikge1xuICAgICAgICAgICAgcmV0dXJuVmFsLnB1c2goYXJyLnNsaWNlKHgsIHggKz0gc2l6ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG59O1xuXG5cbi8qKiovIH0pLFxuLyogMTEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB2c3ByaW50Zihmb3JtYXQsIGFyZ3MpIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC92c3ByaW50Zi9cbiAgLy8gb3JpZ2luYWwgYnk6IGVqc2FuZGVyc1xuICAvLyAgIGV4YW1wbGUgMTogdnNwcmludGYoJyUwNGQtJTAyZC0lMDJkJywgWzE5ODgsIDgsIDFdKVxuICAvLyAgIHJldHVybnMgMTogJzE5ODgtMDgtMDEnXG5cbiAgdmFyIHNwcmludGYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG4gIHJldHVybiBzcHJpbnRmLmFwcGx5KHRoaXMsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dnNwcmludGYuanMubWFwXG5cbi8qKiovIH0pLFxuLyogMTIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByb3VuZCh2YWx1ZSwgcHJlY2lzaW9uLCBtb2RlKSB7XG4gIC8vICBkaXNjdXNzIGF0OiBodHRwOi8vbG9jdXR1cy5pby9waHAvcm91bmQvXG4gIC8vIG9yaWdpbmFsIGJ5OiBQaGlsaXAgUGV0ZXJzb25cbiAgLy8gIHJldmlzZWQgYnk6IE9ubm8gTWFyc21hbiAoaHR0cHM6Ly90d2l0dGVyLmNvbS9vbm5vbWFyc21hbilcbiAgLy8gIHJldmlzZWQgYnk6IFQuV2lsZFxuICAvLyAgcmV2aXNlZCBieTogUmFmYcWCIEt1a2F3c2tpIChodHRwOi8vYmxvZy5rdWthd3NraS5wbClcbiAgLy8gICAgaW5wdXQgYnk6IEdyZWVuc2VlZFxuICAvLyAgICBpbnB1dCBieTogbWVvXG4gIC8vICAgIGlucHV0IGJ5OiBXaWxsaWFtXG4gIC8vICAgIGlucHV0IGJ5OiBKb3NlcCBTYW56IChodHRwOi8vd3d3LndzMy5lcy8pXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAvLyAgICAgIG5vdGUgMTogR3JlYXQgd29yay4gSWRlYXMgZm9yIGltcHJvdmVtZW50OlxuICAvLyAgICAgIG5vdGUgMTogLSBjb2RlIG1vcmUgY29tcGxpYW50IHdpdGggZGV2ZWxvcGVyIGd1aWRlbGluZXNcbiAgLy8gICAgICBub3RlIDE6IC0gZm9yIGltcGxlbWVudGluZyBQSFAgY29uc3RhbnQgYXJndW1lbnRzIGxvb2sgYXRcbiAgLy8gICAgICBub3RlIDE6IHRoZSBwYXRoaW5mbygpIGZ1bmN0aW9uLCBpdCBvZmZlcnMgdGhlIGdyZWF0ZXN0XG4gIC8vICAgICAgbm90ZSAxOiBmbGV4aWJpbGl0eSAmIGNvbXBhdGliaWxpdHkgcG9zc2libGVcbiAgLy8gICBleGFtcGxlIDE6IHJvdW5kKDEyNDE3NTcsIC0zKVxuICAvLyAgIHJldHVybnMgMTogMTI0MjAwMFxuICAvLyAgIGV4YW1wbGUgMjogcm91bmQoMy42KVxuICAvLyAgIHJldHVybnMgMjogNFxuICAvLyAgIGV4YW1wbGUgMzogcm91bmQoMi44MzUsIDIpXG4gIC8vICAgcmV0dXJucyAzOiAyLjg0XG4gIC8vICAgZXhhbXBsZSA0OiByb3VuZCgxLjE3NDk5OTk5OTk5OTksIDIpXG4gIC8vICAgcmV0dXJucyA0OiAxLjE3XG4gIC8vICAgZXhhbXBsZSA1OiByb3VuZCg1ODU1MS43OTk5OTk5OTk5OTYsIDIpXG4gIC8vICAgcmV0dXJucyA1OiA1ODU1MS44XG5cbiAgdmFyIG0sIGYsIGlzSGFsZiwgc2duOyAvLyBoZWxwZXIgdmFyaWFibGVzXG4gIC8vIG1ha2luZyBzdXJlIHByZWNpc2lvbiBpcyBpbnRlZ2VyXG4gIHByZWNpc2lvbiB8PSAwO1xuICBtID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gIHZhbHVlICo9IG07XG4gIC8vIHNpZ24gb2YgdGhlIG51bWJlclxuICBzZ24gPSB2YWx1ZSA+IDAgfCAtKHZhbHVlIDwgMCk7XG4gIGlzSGFsZiA9IHZhbHVlICUgMSA9PT0gMC41ICogc2duO1xuICBmID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cbiAgaWYgKGlzSGFsZikge1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSAnUEhQX1JPVU5EX0hBTEZfRE9XTic6XG4gICAgICAgIC8vIHJvdW5kcyAuNSB0b3dhcmQgemVyb1xuICAgICAgICB2YWx1ZSA9IGYgKyAoc2duIDwgMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnUEhQX1JPVU5EX0hBTEZfRVZFTic6XG4gICAgICAgIC8vIHJvdWRzIC41IHRvd2FyZHMgdGhlIG5leHQgZXZlbiBpbnRlZ2VyXG4gICAgICAgIHZhbHVlID0gZiArIGYgJSAyICogc2duO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1BIUF9ST1VORF9IQUxGX09ERCc6XG4gICAgICAgIC8vIHJvdW5kcyAuNSB0b3dhcmRzIHRoZSBuZXh0IG9kZCBpbnRlZ2VyXG4gICAgICAgIHZhbHVlID0gZiArICEoZiAlIDIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHJvdW5kcyAuNSBhd2F5IGZyb20gemVyb1xuICAgICAgICB2YWx1ZSA9IGYgKyAoc2duID4gMCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChpc0hhbGYgPyB2YWx1ZSA6IE1hdGgucm91bmQodmFsdWUpKSAvIG07XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91bmQuanMubWFwXG5cbi8qKiovIH0pLFxuLyogMTMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1heCgpIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC9tYXgvXG4gIC8vIG9yaWdpbmFsIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gIC8vICByZXZpc2VkIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gIC8vIGltcHJvdmVkIGJ5OiBKYWNrXG4gIC8vICAgICAgbm90ZSAxOiBMb25nIGNvZGUgY2F1c2Ugd2UncmUgYWltaW5nIGZvciBtYXhpbXVtIFBIUCBjb21wYXRpYmlsaXR5XG4gIC8vICAgZXhhbXBsZSAxOiBtYXgoMSwgMywgNSwgNiwgNylcbiAgLy8gICByZXR1cm5zIDE6IDdcbiAgLy8gICBleGFtcGxlIDI6IG1heChbMiwgNCwgNV0pXG4gIC8vICAgcmV0dXJucyAyOiA1XG4gIC8vICAgZXhhbXBsZSAzOiBtYXgoMCwgJ2hlbGxvJylcbiAgLy8gICByZXR1cm5zIDM6IDBcbiAgLy8gICBleGFtcGxlIDQ6IG1heCgnaGVsbG8nLCAwKVxuICAvLyAgIHJldHVybnMgNDogJ2hlbGxvJ1xuICAvLyAgIGV4YW1wbGUgNTogbWF4KC0xLCAnaGVsbG8nKVxuICAvLyAgIHJldHVybnMgNTogJ2hlbGxvJ1xuICAvLyAgIGV4YW1wbGUgNjogbWF4KFsyLCA0LCA4XSwgWzIsIDUsIDddKVxuICAvLyAgIHJldHVybnMgNjogWzIsIDUsIDddXG5cbiAgdmFyIGFyO1xuICB2YXIgcmV0VmFsO1xuICB2YXIgaSA9IDA7XG4gIHZhciBuID0gMDtcbiAgdmFyIGFyZ3YgPSBhcmd1bWVudHM7XG4gIHZhciBhcmdjID0gYXJndi5sZW5ndGg7XG4gIHZhciBfb2JqMkFycmF5ID0gZnVuY3Rpb24gX29iajJBcnJheShvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhciA9IFtdO1xuICAgICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIGFyLnB1c2gob2JqW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFyO1xuICAgIH1cbiAgfTtcbiAgdmFyIF9jb21wYXJlID0gZnVuY3Rpb24gX2NvbXBhcmUoY3VycmVudCwgbmV4dCkge1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbiA9IDA7XG4gICAgdmFyIHRtcCA9IDA7XG4gICAgdmFyIG5sID0gMDtcbiAgICB2YXIgY2wgPSAwO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IG5leHQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBjdXJyZW50ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihjdXJyZW50KSkgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoKHR5cGVvZiBuZXh0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihuZXh0KSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGN1cnJlbnQgPSBfb2JqMkFycmF5KGN1cnJlbnQpO1xuICAgICAgICBuZXh0ID0gX29iajJBcnJheShuZXh0KTtcbiAgICAgICAgY2wgPSBjdXJyZW50Lmxlbmd0aDtcbiAgICAgICAgbmwgPSBuZXh0Lmxlbmd0aDtcbiAgICAgICAgaWYgKG5sID4gY2wpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChubCA8IGNsKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDAsIG4gPSBjbDsgaSA8IG47ICsraSkge1xuICAgICAgICAgIHRtcCA9IF9jb21wYXJlKGN1cnJlbnRbaV0sIG5leHRbaV0pO1xuICAgICAgICAgIGlmICh0bXAgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAodG1wID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2UgaWYgKCh0eXBlb2YgbmV4dCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobmV4dCkpID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChpc05hTihuZXh0KSAmJiAhaXNOYU4oY3VycmVudCkpIHtcbiAgICAgIGlmIChjdXJyZW50ID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQgPCAwID8gMSA6IC0xO1xuICAgIH0gZWxzZSBpZiAoaXNOYU4oY3VycmVudCkgJiYgIWlzTmFOKG5leHQpKSB7XG4gICAgICBpZiAobmV4dCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXh0ID4gMCA/IDEgOiAtMTtcbiAgICB9XG5cbiAgICBpZiAobmV4dCA9PT0gY3VycmVudCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQgPiBjdXJyZW50ID8gMSA6IC0xO1xuICB9O1xuXG4gIGlmIChhcmdjID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgdmFsdWUgc2hvdWxkIGJlIHBhc3NlZCB0byBtYXgoKScpO1xuICB9IGVsc2UgaWYgKGFyZ2MgPT09IDEpIHtcbiAgICBpZiAoX3R5cGVvZihhcmd2WzBdKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFyID0gX29iajJBcnJheShhcmd2WzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXcm9uZyBwYXJhbWV0ZXIgY291bnQgZm9yIG1heCgpJyk7XG4gICAgfVxuICAgIGlmIChhci5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJyYXkgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBlbGVtZW50IGZvciBtYXgoKScpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhciA9IGFyZ3Y7XG4gIH1cblxuICByZXRWYWwgPSBhclswXTtcbiAgZm9yIChpID0gMSwgbiA9IGFyLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmIChfY29tcGFyZShyZXRWYWwsIGFyW2ldKSA9PT0gMSkge1xuICAgICAgcmV0VmFsID0gYXJbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldFZhbDtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXguanMubWFwXG5cbi8qKiovIH0pLFxuLyogMTQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1pbigpIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC9taW4vXG4gIC8vIG9yaWdpbmFsIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gIC8vICByZXZpc2VkIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gIC8vIGltcHJvdmVkIGJ5OiBKYWNrXG4gIC8vICAgICAgbm90ZSAxOiBMb25nIGNvZGUgY2F1c2Ugd2UncmUgYWltaW5nIGZvciBtYXhpbXVtIFBIUCBjb21wYXRpYmlsaXR5XG4gIC8vICAgZXhhbXBsZSAxOiBtaW4oMSwgMywgNSwgNiwgNylcbiAgLy8gICByZXR1cm5zIDE6IDFcbiAgLy8gICBleGFtcGxlIDI6IG1pbihbMiwgNCwgNV0pXG4gIC8vICAgcmV0dXJucyAyOiAyXG4gIC8vICAgZXhhbXBsZSAzOiBtaW4oMCwgJ2hlbGxvJylcbiAgLy8gICByZXR1cm5zIDM6IDBcbiAgLy8gICBleGFtcGxlIDQ6IG1pbignaGVsbG8nLCAwKVxuICAvLyAgIHJldHVybnMgNDogJ2hlbGxvJ1xuICAvLyAgIGV4YW1wbGUgNTogbWluKC0xLCAnaGVsbG8nKVxuICAvLyAgIHJldHVybnMgNTogLTFcbiAgLy8gICBleGFtcGxlIDY6IG1pbihbMiwgNCwgOF0sIFsyLCA1LCA3XSlcbiAgLy8gICByZXR1cm5zIDY6IFsyLCA0LCA4XVxuXG4gIHZhciBhcjtcbiAgdmFyIHJldFZhbDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbiA9IDA7XG4gIHZhciBhcmd2ID0gYXJndW1lbnRzO1xuICB2YXIgYXJnYyA9IGFyZ3YubGVuZ3RoO1xuICB2YXIgX29iajJBcnJheSA9IGZ1bmN0aW9uIF9vYmoyQXJyYXkob2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICB2YXIgYXIgPSBbXTtcbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICBhci5wdXNoKG9ialtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbiAgfTtcblxuICB2YXIgX2NvbXBhcmUgPSBmdW5jdGlvbiBfY29tcGFyZShjdXJyZW50LCBuZXh0KSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBuID0gMDtcbiAgICB2YXIgdG1wID0gMDtcbiAgICB2YXIgbmwgPSAwO1xuICAgIHZhciBjbCA9IDA7XG5cbiAgICBpZiAoY3VycmVudCA9PT0gbmV4dCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmICgodHlwZW9mIGN1cnJlbnQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGN1cnJlbnQpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICgodHlwZW9mIG5leHQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG5leHQpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY3VycmVudCA9IF9vYmoyQXJyYXkoY3VycmVudCk7XG4gICAgICAgIG5leHQgPSBfb2JqMkFycmF5KG5leHQpO1xuICAgICAgICBjbCA9IGN1cnJlbnQubGVuZ3RoO1xuICAgICAgICBubCA9IG5leHQubGVuZ3RoO1xuICAgICAgICBpZiAobmwgPiBjbCkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKG5sIDwgY2wpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMCwgbiA9IGNsOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgdG1wID0gX2NvbXBhcmUoY3VycmVudFtpXSwgbmV4dFtpXSk7XG4gICAgICAgICAgaWYgKHRtcCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgfSBlbHNlIGlmICh0bXAgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBuZXh0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihuZXh0KSkgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGlzTmFOKG5leHQpICYmICFpc05hTihjdXJyZW50KSkge1xuICAgICAgaWYgKGN1cnJlbnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudCA8IDAgPyAxIDogLTE7XG4gICAgfSBlbHNlIGlmIChpc05hTihjdXJyZW50KSAmJiAhaXNOYU4obmV4dCkpIHtcbiAgICAgIGlmIChuZXh0ID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5leHQgPiAwID8gMSA6IC0xO1xuICAgIH1cblxuICAgIGlmIChuZXh0ID09PSBjdXJyZW50KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dCA+IGN1cnJlbnQgPyAxIDogLTE7XG4gIH07XG5cbiAgaWYgKGFyZ2MgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSB2YWx1ZSBzaG91bGQgYmUgcGFzc2VkIHRvIG1pbigpJyk7XG4gIH0gZWxzZSBpZiAoYXJnYyA9PT0gMSkge1xuICAgIGlmIChfdHlwZW9mKGFyZ3ZbMF0pID09PSAnb2JqZWN0Jykge1xuICAgICAgYXIgPSBfb2JqMkFycmF5KGFyZ3ZbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dyb25nIHBhcmFtZXRlciBjb3VudCBmb3IgbWluKCknKTtcbiAgICB9XG5cbiAgICBpZiAoYXIubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FycmF5IG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgZWxlbWVudCBmb3IgbWluKCknKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXIgPSBhcmd2O1xuICB9XG5cbiAgcmV0VmFsID0gYXJbMF07XG5cbiAgZm9yIChpID0gMSwgbiA9IGFyLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmIChfY29tcGFyZShyZXRWYWwsIGFyW2ldKSA9PT0gLTEpIHtcbiAgICAgIHJldFZhbCA9IGFyW2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRWYWw7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWluLmpzLm1hcFxuXG4vKioqLyB9KSxcbi8qIDE1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyaXBfdGFncyhpbnB1dCwgYWxsb3dlZCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuICAvLyAgZGlzY3VzcyBhdDogaHR0cDovL2xvY3V0dXMuaW8vcGhwL3N0cmlwX3RhZ3MvXG4gIC8vIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAvLyBpbXByb3ZlZCBieTogTHVrZSBHb2RmcmV5XG4gIC8vIGltcHJvdmVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAvLyAgICBpbnB1dCBieTogUHVsXG4gIC8vICAgIGlucHV0IGJ5OiBBbGV4XG4gIC8vICAgIGlucHV0IGJ5OiBNYXJjIFBhbGF1XG4gIC8vICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAvLyAgICBpbnB1dCBieTogQm9iYnkgRHJha2VcbiAgLy8gICAgaW5wdXQgYnk6IEV2ZXJ0amFuIEdhcnJldHNlblxuICAvLyBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2t2ei5pbylcbiAgLy8gYnVnZml4ZWQgYnk6IE9ubm8gTWFyc21hbiAoaHR0cHM6Ly90d2l0dGVyLmNvbS9vbm5vbWFyc21hbilcbiAgLy8gYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rdnouaW8pXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAvLyBidWdmaXhlZCBieTogRXJpYyBOYWdlbFxuICAvLyBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2t2ei5pbylcbiAgLy8gYnVnZml4ZWQgYnk6IFRvbWFzeiBXZXNvbG93c2tpXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBUeW1vbiBTdHVyZ2VvbiAoaHR0cHM6Ly9zY3J5cHRvbml0ZS5jb20pXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBUaW0gZGUgS29uaW5nIChodHRwczovL3d3dy5raW5nc3F1YXJlLm5sKVxuICAvLyAgcmV2aXNlZCBieTogUmFmYcWCIEt1a2F3c2tpIChodHRwOi8vYmxvZy5rdWthd3NraS5wbClcbiAgLy8gICBleGFtcGxlIDE6IHN0cmlwX3RhZ3MoJzxwPktldmluPC9wPiA8YnIgLz48Yj52YW48L2I+IDxpPlpvbm5ldmVsZDwvaT4nLCAnPGk+PGI+JylcbiAgLy8gICByZXR1cm5zIDE6ICdLZXZpbiA8Yj52YW48L2I+IDxpPlpvbm5ldmVsZDwvaT4nXG4gIC8vICAgZXhhbXBsZSAyOiBzdHJpcF90YWdzKCc8cD5LZXZpbiA8aW1nIHNyYz1cInNvbWVpbWFnZS5wbmdcIiBvbm1vdXNlb3Zlcj1cInNvbWVGdW5jdGlvbigpXCI+dmFuIDxpPlpvbm5ldmVsZDwvaT48L3A+JywgJzxwPicpXG4gIC8vICAgcmV0dXJucyAyOiAnPHA+S2V2aW4gdmFuIFpvbm5ldmVsZDwvcD4nXG4gIC8vICAgZXhhbXBsZSAzOiBzdHJpcF90YWdzKFwiPGEgaHJlZj0naHR0cDovL2t2ei5pbyc+S2V2aW4gdmFuIFpvbm5ldmVsZDwvYT5cIiwgXCI8YT5cIilcbiAgLy8gICByZXR1cm5zIDM6IFwiPGEgaHJlZj0naHR0cDovL2t2ei5pbyc+S2V2aW4gdmFuIFpvbm5ldmVsZDwvYT5cIlxuICAvLyAgIGV4YW1wbGUgNDogc3RyaXBfdGFncygnMSA8IDUgNSA+IDEnKVxuICAvLyAgIHJldHVybnMgNDogJzEgPCA1IDUgPiAxJ1xuICAvLyAgIGV4YW1wbGUgNTogc3RyaXBfdGFncygnMSA8YnIvPiAxJylcbiAgLy8gICByZXR1cm5zIDU6ICcxICAxJ1xuICAvLyAgIGV4YW1wbGUgNjogc3RyaXBfdGFncygnMSA8YnIvPiAxJywgJzxicj4nKVxuICAvLyAgIHJldHVybnMgNjogJzEgPGJyLz4gMSdcbiAgLy8gICBleGFtcGxlIDc6IHN0cmlwX3RhZ3MoJzEgPGJyLz4gMScsICc8YnI+PGJyLz4nKVxuICAvLyAgIHJldHVybnMgNzogJzEgPGJyLz4gMSdcbiAgLy8gICBleGFtcGxlIDg6IHN0cmlwX3RhZ3MoJzxpPmhlbGxvPC9pPiA8PGZvbz5zY3JpcHQ+d29ybGQ8PC9mb28+L3NjcmlwdD4nKVxuICAvLyAgIHJldHVybnMgODogJ2hlbGxvIHdvcmxkJ1xuICAvLyAgIGV4YW1wbGUgOTogc3RyaXBfdGFncyg0KVxuICAvLyAgIHJldHVybnMgOTogJzQnXG5cbiAgdmFyIF9waHBDYXN0U3RyaW5nID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNik7XG5cbiAgLy8gbWFraW5nIHN1cmUgdGhlIGFsbG93ZWQgYXJnIGlzIGEgc3RyaW5nIGNvbnRhaW5pbmcgb25seSB0YWdzIGluIGxvd2VyY2FzZSAoPGE+PGI+PGM+KVxuICBhbGxvd2VkID0gKCgoYWxsb3dlZCB8fCAnJykgKyAnJykudG9Mb3dlckNhc2UoKS5tYXRjaCgvPFthLXpdW2EtejAtOV0qPi9nKSB8fCBbXSkuam9pbignJyk7XG5cbiAgdmFyIHRhZ3MgPSAvPFxcLz8oW2Etel1bYS16MC05XSopXFxiW14+XSo+L2dpO1xuICB2YXIgY29tbWVudHNBbmRQaHBUYWdzID0gLzwhLS1bXFxzXFxTXSo/LS0+fDxcXD8oPzpwaHApP1tcXHNcXFNdKj9cXD8+L2dpO1xuXG4gIHZhciBhZnRlciA9IF9waHBDYXN0U3RyaW5nKGlucHV0KTtcbiAgLy8gcmVjdXJzaXZlbHkgcmVtb3ZlIHRhZ3MgdG8gZW5zdXJlIHRoYXQgdGhlIHJldHVybmVkIHN0cmluZyBkb2Vzbid0IGNvbnRhaW4gZm9yYmlkZGVuIHRhZ3MgYWZ0ZXIgcHJldmlvdXMgcGFzc2VzIChlLmcuICc8PGJhaXQvPnN3aXRjaC8+JylcbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgYmVmb3JlID0gYWZ0ZXI7XG4gICAgYWZ0ZXIgPSBiZWZvcmUucmVwbGFjZShjb21tZW50c0FuZFBocFRhZ3MsICcnKS5yZXBsYWNlKHRhZ3MsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgIHJldHVybiBhbGxvd2VkLmluZGV4T2YoJzwnICsgJDEudG9Mb3dlckNhc2UoKSArICc+JykgPiAtMSA/ICQwIDogJyc7XG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gb25jZSBubyBtb3JlIHRhZ3MgYXJlIHJlbW92ZWRcbiAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgcmV0dXJuIGFmdGVyO1xuICAgIH1cbiAgfVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cmlwX3RhZ3MuanMubWFwXG5cbi8qKiovIH0pLFxuLyogMTYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9waHBDYXN0U3RyaW5nKHZhbHVlKSB7XG4gIC8vIG9yaWdpbmFsIGJ5OiBSYWZhxYIgS3VrYXdza2lcbiAgLy8gICBleGFtcGxlIDE6IF9waHBDYXN0U3RyaW5nKHRydWUpXG4gIC8vICAgcmV0dXJucyAxOiAnMSdcbiAgLy8gICBleGFtcGxlIDI6IF9waHBDYXN0U3RyaW5nKGZhbHNlKVxuICAvLyAgIHJldHVybnMgMjogJydcbiAgLy8gICBleGFtcGxlIDM6IF9waHBDYXN0U3RyaW5nKCdmb28nKVxuICAvLyAgIHJldHVybnMgMzogJ2ZvbydcbiAgLy8gICBleGFtcGxlIDQ6IF9waHBDYXN0U3RyaW5nKDAvMClcbiAgLy8gICByZXR1cm5zIDQ6ICdOQU4nXG4gIC8vICAgZXhhbXBsZSA1OiBfcGhwQ2FzdFN0cmluZygxLzApXG4gIC8vICAgcmV0dXJucyA1OiAnSU5GJ1xuICAvLyAgIGV4YW1wbGUgNjogX3BocENhc3RTdHJpbmcoLTEvMClcbiAgLy8gICByZXR1cm5zIDY6ICctSU5GJ1xuICAvLyAgIGV4YW1wbGUgNzogX3BocENhc3RTdHJpbmcobnVsbClcbiAgLy8gICByZXR1cm5zIDc6ICcnXG4gIC8vICAgZXhhbXBsZSA4OiBfcGhwQ2FzdFN0cmluZyh1bmRlZmluZWQpXG4gIC8vICAgcmV0dXJucyA4OiAnJ1xuICAvLyAgIGV4YW1wbGUgOTogX3BocENhc3RTdHJpbmcoW10pXG4gIC8vICAgcmV0dXJucyA5OiAnQXJyYXknXG4gIC8vICAgZXhhbXBsZSAxMDogX3BocENhc3RTdHJpbmcoe30pXG4gIC8vICAgcmV0dXJucyAxMDogJ09iamVjdCdcbiAgLy8gICBleGFtcGxlIDExOiBfcGhwQ2FzdFN0cmluZygwKVxuICAvLyAgIHJldHVybnMgMTE6ICcwJ1xuICAvLyAgIGV4YW1wbGUgMTI6IF9waHBDYXN0U3RyaW5nKDEpXG4gIC8vICAgcmV0dXJucyAxMjogJzEnXG4gIC8vICAgZXhhbXBsZSAxMzogX3BocENhc3RTdHJpbmcoMy4xNClcbiAgLy8gICByZXR1cm5zIDEzOiAnMy4xNCdcblxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodmFsdWUpO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHZhbHVlID8gJzEnIDogJyc7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gJ05BTic7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAodmFsdWUgPCAwID8gJy0nIDogJycpICsgJ0lORic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZSArICcnO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gJ0FycmF5JztcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAvLyBmYWxsIHRocm91Z2hcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2YWx1ZSB0eXBlJyk7XG4gIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1fcGhwQ2FzdFN0cmluZy5qcy5tYXBcblxuLyoqKi8gfSksXG4vKiAxNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cnRvdGltZSh0ZXh0LCBub3cpIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC9zdHJ0b3RpbWUvXG4gIC8vIG9yaWdpbmFsIGJ5OiBDYWlvIEFyaWVkZSAoaHR0cDovL2NhaW9hcmllZGUuY29tKVxuICAvLyBpbXByb3ZlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2t2ei5pbylcbiAgLy8gaW1wcm92ZWQgYnk6IENhaW8gQXJpZWRlIChodHRwOi8vY2Fpb2FyaWVkZS5jb20pXG4gIC8vIGltcHJvdmVkIGJ5OiBBLiBNYXTDrWFzIFF1ZXphZGEgKGh0dHA6Ly9hbWF0aWFzcS5jb20pXG4gIC8vIGltcHJvdmVkIGJ5OiBwcmV1dGVyXG4gIC8vIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAvLyBpbXByb3ZlZCBieTogTWlya28gRmFiZXJcbiAgLy8gICAgaW5wdXQgYnk6IERhdmlkXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBXYWduZXIgQi4gU29hcmVzXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBBcnR1ciBUY2hlcm55Y2hldlxuICAvLyBidWdmaXhlZCBieTogU3RlcGhhbiBCw7ZzY2gtUGxlcGVsaXRzIChodHRwOi8vZ2l0aHViLmNvbS9wbGVwZSlcbiAgLy8gICAgICBub3RlIDE6IEV4YW1wbGVzIGFsbCBoYXZlIGEgZml4ZWQgdGltZXN0YW1wIHRvIHByZXZlbnRcbiAgLy8gICAgICBub3RlIDE6IHRlc3RzIHRvIGZhaWwgYmVjYXVzZSBvZiB2YXJpYWJsZSB0aW1lKHpvbmVzKVxuICAvLyAgIGV4YW1wbGUgMTogc3RydG90aW1lKCcrMSBkYXknLCAxMTI5NjMzMjAwKVxuICAvLyAgIHJldHVybnMgMTogMTEyOTcxOTYwMFxuICAvLyAgIGV4YW1wbGUgMjogc3RydG90aW1lKCcrMSB3ZWVrIDIgZGF5cyA0IGhvdXJzIDIgc2Vjb25kcycsIDExMjk2MzMyMDApXG4gIC8vICAgcmV0dXJucyAyOiAxMTMwNDI1MjAyXG4gIC8vICAgZXhhbXBsZSAzOiBzdHJ0b3RpbWUoJ2xhc3QgbW9udGgnLCAxMTI5NjMzMjAwKVxuICAvLyAgIHJldHVybnMgMzogMTEyNzA0MTIwMFxuICAvLyAgIGV4YW1wbGUgNDogc3RydG90aW1lKCcyMDA5LTA1LTA0IDA4OjMwOjAwIEdNVCcpXG4gIC8vICAgcmV0dXJucyA0OiAxMjQxNDI1ODAwXG4gIC8vICAgZXhhbXBsZSA1OiBzdHJ0b3RpbWUoJzIwMDktMDUtMDQgMDg6MzA6MDArMDAnKVxuICAvLyAgIHJldHVybnMgNTogMTI0MTQyNTgwMFxuICAvLyAgIGV4YW1wbGUgNjogc3RydG90aW1lKCcyMDA5LTA1LTA0IDA4OjMwOjAwKzAyOjAwJylcbiAgLy8gICByZXR1cm5zIDY6IDEyNDE0MTg2MDBcbiAgLy8gICBleGFtcGxlIDc6IHN0cnRvdGltZSgnMjAwOS0wNS0wNFQwODozMDowMFonKVxuICAvLyAgIHJldHVybnMgNzogMTI0MTQyNTgwMFxuXG4gIHZhciBwYXJzZWQ7XG4gIHZhciBtYXRjaDtcbiAgdmFyIHRvZGF5O1xuICB2YXIgeWVhcjtcbiAgdmFyIGRhdGU7XG4gIHZhciBkYXlzO1xuICB2YXIgcmFuZ2VzO1xuICB2YXIgbGVuO1xuICB2YXIgdGltZXM7XG4gIHZhciByZWdleDtcbiAgdmFyIGk7XG4gIHZhciBmYWlsID0gZmFsc2U7XG5cbiAgaWYgKCF0ZXh0KSB7XG4gICAgcmV0dXJuIGZhaWw7XG4gIH1cblxuICAvLyBVbmVjZXNzYXJ5IHNwYWNlc1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykucmVwbGFjZSgvXFxzezIsfS9nLCAnICcpLnJlcGxhY2UoL1tcXHRcXHJcXG5dL2csICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIGluIGNvbnRyYXN0IHRvIHBocCwganMgRGF0ZS5wYXJzZSBmdW5jdGlvbiBpbnRlcnByZXRzOlxuICAvLyBkYXRlcyBnaXZlbiBhcyB5eXl5LW1tLWRkIGFzIGluIHRpbWV6b25lOiBVVEMsXG4gIC8vIGRhdGVzIHdpdGggXCIuXCIgb3IgXCItXCIgYXMgTURZIGluc3RlYWQgb2YgRE1ZXG4gIC8vIGRhdGVzIHdpdGggdHdvLWRpZ2l0IHllYXJzIGRpZmZlcmVudGx5XG4gIC8vIGV0Yy4uLmV0Yy4uLlxuICAvLyAuLi50aGVyZWZvcmUgd2UgbWFudWFsbHkgcGFyc2UgbG90cyBvZiBjb21tb24gZGF0ZSBmb3JtYXRzXG4gIHZhciBwYXR0ZXJuID0gbmV3IFJlZ0V4cChbJ14oXFxcXGR7MSw0fSknLCAnKFtcXFxcLVxcXFwuXFxcXC86XSknLCAnKFxcXFxkezEsMn0pJywgJyhbXFxcXC1cXFxcLlxcXFwvOl0pJywgJyhcXFxcZHsxLDR9KScsICcoPzpcXFxccyhcXFxcZHsxLDJ9KTooXFxcXGR7Mn0pPzo/KFxcXFxkezJ9KT8pPycsICcoPzpcXFxccyhbQS1aXSspPyk/JCddLmpvaW4oJycpKTtcbiAgbWF0Y2ggPSB0ZXh0Lm1hdGNoKHBhdHRlcm4pO1xuXG4gIGlmIChtYXRjaCAmJiBtYXRjaFsyXSA9PT0gbWF0Y2hbNF0pIHtcbiAgICBpZiAobWF0Y2hbMV0gPiAxOTAxKSB7XG4gICAgICBzd2l0Y2ggKG1hdGNoWzJdKSB7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgIC8vIFlZWVktTS1EXG4gICAgICAgICAgaWYgKG1hdGNoWzNdID4gMTIgfHwgbWF0Y2hbNV0gPiAzMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1hdGNoWzFdLCBwYXJzZUludChtYXRjaFszXSwgMTApIC0gMSwgbWF0Y2hbNV0sIG1hdGNoWzZdIHx8IDAsIG1hdGNoWzddIHx8IDAsIG1hdGNoWzhdIHx8IDAsIG1hdGNoWzldIHx8IDApIC8gMTAwMDtcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgLy8gWVlZWS5NLkQgaXMgbm90IHBhcnNlZCBieSBzdHJ0b3RpbWUoKVxuICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAvLyBZWVlZL00vRFxuICAgICAgICAgIGlmIChtYXRjaFszXSA+IDEyIHx8IG1hdGNoWzVdID4gMzEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShtYXRjaFsxXSwgcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIG1hdGNoWzVdLCBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtYXRjaFs1XSA+IDE5MDEpIHtcbiAgICAgIHN3aXRjaCAobWF0Y2hbMl0pIHtcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgLy8gRC1NLVlZWVlcbiAgICAgICAgICBpZiAobWF0Y2hbM10gPiAxMiB8fCBtYXRjaFsxXSA+IDMxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFpbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbmV3IERhdGUobWF0Y2hbNV0sIHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCBtYXRjaFsxXSwgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAvLyBELk0uWVlZWVxuICAgICAgICAgIGlmIChtYXRjaFszXSA+IDEyIHx8IG1hdGNoWzFdID4gMzEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShtYXRjaFs1XSwgcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIG1hdGNoWzFdLCBtYXRjaFs2XSB8fCAwLCBtYXRjaFs3XSB8fCAwLCBtYXRjaFs4XSB8fCAwLCBtYXRjaFs5XSB8fCAwKSAvIDEwMDA7XG4gICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgIC8vIE0vRC9ZWVlZXG4gICAgICAgICAgaWYgKG1hdGNoWzFdID4gMTIgfHwgbWF0Y2hbM10gPiAzMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1hdGNoWzVdLCBwYXJzZUludChtYXRjaFsxXSwgMTApIC0gMSwgbWF0Y2hbM10sIG1hdGNoWzZdIHx8IDAsIG1hdGNoWzddIHx8IDAsIG1hdGNoWzhdIHx8IDAsIG1hdGNoWzldIHx8IDApIC8gMTAwMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChtYXRjaFsyXSkge1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAvLyBZWS1NLURcbiAgICAgICAgICBpZiAobWF0Y2hbM10gPiAxMiB8fCBtYXRjaFs1XSA+IDMxIHx8IG1hdGNoWzFdIDwgNzAgJiYgbWF0Y2hbMV0gPiAzOCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeWVhciA9IG1hdGNoWzFdID49IDAgJiYgbWF0Y2hbMV0gPD0gMzggPyArbWF0Y2hbMV0gKyAyMDAwIDogbWF0Y2hbMV07XG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCBtYXRjaFs1XSwgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAvLyBELk0uWVkgb3IgSC5NTS5TU1xuICAgICAgICAgIGlmIChtYXRjaFs1XSA+PSA3MCkge1xuICAgICAgICAgICAgLy8gRC5NLllZXG4gICAgICAgICAgICBpZiAobWF0Y2hbM10gPiAxMiB8fCBtYXRjaFsxXSA+IDMxKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUobWF0Y2hbNV0sIHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxLCBtYXRjaFsxXSwgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF0Y2hbNV0gPCA2MCAmJiAhbWF0Y2hbNl0pIHtcbiAgICAgICAgICAgIC8vIEguTU0uU1NcbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSA+IDIzIHx8IG1hdGNoWzNdID4gNTkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXRlKCksIG1hdGNoWzFdIHx8IDAsIG1hdGNoWzNdIHx8IDAsIG1hdGNoWzVdIHx8IDAsIG1hdGNoWzldIHx8IDApIC8gMTAwMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpbnZhbGlkIGZvcm1hdCwgY2Fubm90IGJlIHBhcnNlZFxuICAgICAgICAgIHJldHVybiBmYWlsO1xuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICAvLyBNL0QvWVlcbiAgICAgICAgICBpZiAobWF0Y2hbMV0gPiAxMiB8fCBtYXRjaFszXSA+IDMxIHx8IG1hdGNoWzVdIDwgNzAgJiYgbWF0Y2hbNV0gPiAzOCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeWVhciA9IG1hdGNoWzVdID49IDAgJiYgbWF0Y2hbNV0gPD0gMzggPyArbWF0Y2hbNV0gKyAyMDAwIDogbWF0Y2hbNV07XG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIHBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxLCBtYXRjaFszXSwgbWF0Y2hbNl0gfHwgMCwgbWF0Y2hbN10gfHwgMCwgbWF0Y2hbOF0gfHwgMCwgbWF0Y2hbOV0gfHwgMCkgLyAxMDAwO1xuICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgICAvLyBISDpNTTpTU1xuICAgICAgICAgIGlmIChtYXRjaFsxXSA+IDIzIHx8IG1hdGNoWzNdID4gNTkgfHwgbWF0Y2hbNV0gPiA1OSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhaWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXRlKCksIG1hdGNoWzFdIHx8IDAsIG1hdGNoWzNdIHx8IDAsIG1hdGNoWzVdIHx8IDApIC8gMTAwMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBvdGhlciBmb3JtYXRzIGFuZCBcIm5vd1wiIHNob3VsZCBiZSBwYXJzZWQgYnkgRGF0ZS5wYXJzZSgpXG4gIGlmICh0ZXh0ID09PSAnbm93Jykge1xuICAgIHJldHVybiBub3cgPT09IG51bGwgfHwgaXNOYU4obm93KSA/IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCB8IDAgOiBub3cgfCAwO1xuICB9XG4gIGlmICghaXNOYU4ocGFyc2VkID0gRGF0ZS5wYXJzZSh0ZXh0KSkpIHtcbiAgICByZXR1cm4gcGFyc2VkIC8gMTAwMCB8IDA7XG4gIH1cbiAgLy8gQnJvd3NlcnMgIT09IENocm9tZSBoYXZlIHByb2JsZW1zIHBhcnNpbmcgSVNPIDg2MDEgZGF0ZSBzdHJpbmdzLCBhcyB0aGV5IGRvXG4gIC8vIG5vdCBhY2NlcHQgbG93ZXIgY2FzZSBjaGFyYWN0ZXJzLCBzcGFjZSwgb3Igc2hvcnRlbmVkIHRpbWUgem9uZXMuXG4gIC8vIFRoZXJlZm9yZSwgZml4IHRoZXNlIHByb2JsZW1zIGFuZCB0cnkgYWdhaW4uXG4gIC8vIEV4YW1wbGVzOlxuICAvLyAgIDIwMTUtMDQtMTUgMjA6MzM6NTkrMDJcbiAgLy8gICAyMDE1LTA0LTE1IDIwOjMzOjU5elxuICAvLyAgIDIwMTUtMDQtMTV0MjA6MzM6NTkrMDI6MDBcbiAgcGF0dGVybiA9IG5ldyBSZWdFeHAoWydeKFswLTldezR9LVswLTldezJ9LVswLTldezJ9KScsICdbIHRdJywgJyhbMC05XXsyfTpbMC05XXsyfTpbMC05XXsyfShcXFxcLlswLTldKyk/KScsICcoW1xcXFwrLV1bMC05XXsyfSg6WzAtOV17Mn0pP3x6KSddLmpvaW4oJycpKTtcbiAgbWF0Y2ggPSB0ZXh0Lm1hdGNoKHBhdHRlcm4pO1xuICBpZiAobWF0Y2gpIHtcbiAgICAvLyBAdG9kbzogdGltZSB6b25lIGluZm9ybWF0aW9uXG4gICAgaWYgKG1hdGNoWzRdID09PSAneicpIHtcbiAgICAgIG1hdGNoWzRdID0gJ1onO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbNF0ubWF0Y2goL14oWystXVswLTldezJ9KSQvKSkge1xuICAgICAgbWF0Y2hbNF0gPSBtYXRjaFs0XSArICc6MDAnO1xuICAgIH1cblxuICAgIGlmICghaXNOYU4ocGFyc2VkID0gRGF0ZS5wYXJzZShtYXRjaFsxXSArICdUJyArIG1hdGNoWzJdICsgbWF0Y2hbNF0pKSkge1xuICAgICAgcmV0dXJuIHBhcnNlZCAvIDEwMDAgfCAwO1xuICAgIH1cbiAgfVxuXG4gIGRhdGUgPSBub3cgPyBuZXcgRGF0ZShub3cgKiAxMDAwKSA6IG5ldyBEYXRlKCk7XG4gIGRheXMgPSB7XG4gICAgJ3N1bic6IDAsXG4gICAgJ21vbic6IDEsXG4gICAgJ3R1ZSc6IDIsXG4gICAgJ3dlZCc6IDMsXG4gICAgJ3RodSc6IDQsXG4gICAgJ2ZyaSc6IDUsXG4gICAgJ3NhdCc6IDZcbiAgfTtcbiAgcmFuZ2VzID0ge1xuICAgICd5ZWEnOiAnRnVsbFllYXInLFxuICAgICdtb24nOiAnTW9udGgnLFxuICAgICdkYXknOiAnRGF0ZScsXG4gICAgJ2hvdSc6ICdIb3VycycsXG4gICAgJ21pbic6ICdNaW51dGVzJyxcbiAgICAnc2VjJzogJ1NlY29uZHMnXG4gIH07XG5cbiAgZnVuY3Rpb24gbGFzdE5leHQodHlwZSwgcmFuZ2UsIG1vZGlmaWVyKSB7XG4gICAgdmFyIGRpZmY7XG4gICAgdmFyIGRheSA9IGRheXNbcmFuZ2VdO1xuXG4gICAgaWYgKHR5cGVvZiBkYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBkaWZmID0gZGF5IC0gZGF0ZS5nZXREYXkoKTtcblxuICAgICAgaWYgKGRpZmYgPT09IDApIHtcbiAgICAgICAgZGlmZiA9IDcgKiBtb2RpZmllcjtcbiAgICAgIH0gZWxzZSBpZiAoZGlmZiA+IDAgJiYgdHlwZSA9PT0gJ2xhc3QnKSB7XG4gICAgICAgIGRpZmYgLT0gNztcbiAgICAgIH0gZWxzZSBpZiAoZGlmZiA8IDAgJiYgdHlwZSA9PT0gJ25leHQnKSB7XG4gICAgICAgIGRpZmYgKz0gNztcbiAgICAgIH1cblxuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgZGlmZik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJvY2Vzcyh2YWwpIHtcbiAgICAvLyBAdG9kbzogUmVjb25jaWxlIHRoaXMgd2l0aCByZWdleCB1c2luZyBcXHMsIHRha2luZyBpbnRvIGFjY291bnRcbiAgICAvLyBicm93c2VyIGlzc3VlcyB3aXRoIHNwbGl0IGFuZCByZWdleGVzXG4gICAgdmFyIHNwbHQgPSB2YWwuc3BsaXQoJyAnKTtcbiAgICB2YXIgdHlwZSA9IHNwbHRbMF07XG4gICAgdmFyIHJhbmdlID0gc3BsdFsxXS5zdWJzdHJpbmcoMCwgMyk7XG4gICAgdmFyIHR5cGVJc051bWJlciA9IC9cXGQrLy50ZXN0KHR5cGUpO1xuICAgIHZhciBhZ28gPSBzcGx0WzJdID09PSAnYWdvJztcbiAgICB2YXIgbnVtID0gKHR5cGUgPT09ICdsYXN0JyA/IC0xIDogMSkgKiAoYWdvID8gLTEgOiAxKTtcblxuICAgIGlmICh0eXBlSXNOdW1iZXIpIHtcbiAgICAgIG51bSAqPSBwYXJzZUludCh0eXBlLCAxMCk7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlcy5oYXNPd25Qcm9wZXJ0eShyYW5nZSkgJiYgIXNwbHRbMV0ubWF0Y2goL15tb24oZGF5fFxcLik/JC9pKSkge1xuICAgICAgcmV0dXJuIGRhdGVbJ3NldCcgKyByYW5nZXNbcmFuZ2VdXShkYXRlWydnZXQnICsgcmFuZ2VzW3JhbmdlXV0oKSArIG51bSk7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlID09PSAnd2VlJykge1xuICAgICAgcmV0dXJuIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIG51bSAqIDcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAnbmV4dCcgfHwgdHlwZSA9PT0gJ2xhc3QnKSB7XG4gICAgICBsYXN0TmV4dCh0eXBlLCByYW5nZSwgbnVtKTtcbiAgICB9IGVsc2UgaWYgKCF0eXBlSXNOdW1iZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRpbWVzID0gJyh5ZWFycz98bW9udGhzP3x3ZWVrcz98ZGF5cz98aG91cnM/fG1pbnV0ZXM/fG1pbnxzZWNvbmRzP3xzZWMnICsgJ3xzdW5kYXl8c3VuXFxcXC4/fG1vbmRheXxtb25cXFxcLj98dHVlc2RheXx0dWVcXFxcLj98d2VkbmVzZGF5fHdlZFxcXFwuPycgKyAnfHRodXJzZGF5fHRodVxcXFwuP3xmcmlkYXl8ZnJpXFxcXC4/fHNhdHVyZGF5fHNhdFxcXFwuPyknO1xuICByZWdleCA9ICcoWystXT9cXFxcZCtcXFxccycgKyB0aW1lcyArICd8JyArICcobGFzdHxuZXh0KVxcXFxzJyArIHRpbWVzICsgJykoXFxcXHNhZ28pPyc7XG5cbiAgbWF0Y2ggPSB0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAocmVnZXgsICdnaScpKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybiBmYWlsO1xuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gbWF0Y2gubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXByb2Nlc3MobWF0Y2hbaV0pKSB7XG4gICAgICByZXR1cm4gZmFpbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0ZS5nZXRUaW1lKCkgLyAxMDAwO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cnRvdGltZS5qcy5tYXBcblxuLyoqKi8gfSksXG4vKiAxOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRhdGUoZm9ybWF0LCB0aW1lc3RhbXApIHtcbiAgLy8gIGRpc2N1c3MgYXQ6IGh0dHA6Ly9sb2N1dHVzLmlvL3BocC9kYXRlL1xuICAvLyBvcmlnaW5hbCBieTogQ2FybG9zIFIuIEwuIFJvZHJpZ3VlcyAoaHR0cDovL3d3dy5qc2Zyb21oZWxsLmNvbSlcbiAgLy8gb3JpZ2luYWwgYnk6IGdldHRpbWVvZmRheVxuICAvLyAgICBwYXJ0cyBieTogUGV0ZXItUGF1bCBLb2NoIChodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2JlYXQuaHRtbClcbiAgLy8gaW1wcm92ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rdnouaW8pXG4gIC8vIGltcHJvdmVkIGJ5OiBNZUV0YyAoaHR0cDovL3lhc3MubWVldGN3ZWIuY29tKVxuICAvLyBpbXByb3ZlZCBieTogQnJhZCBUb3Vlc25hcmRcbiAgLy8gaW1wcm92ZWQgYnk6IFRpbSBXaWVsXG4gIC8vIGltcHJvdmVkIGJ5OiBCcnlhbiBFbGxpb3R0XG4gIC8vIGltcHJvdmVkIGJ5OiBEYXZpZCBSYW5kYWxsXG4gIC8vIGltcHJvdmVkIGJ5OiBUaGVyaWF1bHQgKGh0dHBzOi8vZ2l0aHViLmNvbS9UaGVyaWF1bHQpXG4gIC8vIGltcHJvdmVkIGJ5OiBUaGVyaWF1bHQgKGh0dHBzOi8vZ2l0aHViLmNvbS9UaGVyaWF1bHQpXG4gIC8vIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAvLyBpbXByb3ZlZCBieTogVGhlcmlhdWx0IChodHRwczovL2dpdGh1Yi5jb20vVGhlcmlhdWx0KVxuICAvLyBpbXByb3ZlZCBieTogVGhvbWFzIEJlYXVjb3VydCAoaHR0cDovL3d3dy53ZWJhcHAuZnIpXG4gIC8vIGltcHJvdmVkIGJ5OiBKVFxuICAvLyBpbXByb3ZlZCBieTogVGhlcmlhdWx0IChodHRwczovL2dpdGh1Yi5jb20vVGhlcmlhdWx0KVxuICAvLyBpbXByb3ZlZCBieTogUmFmYcWCIEt1a2F3c2tpIChodHRwOi8vYmxvZy5rdWthd3NraS5wbClcbiAgLy8gaW1wcm92ZWQgYnk6IFRoZXJpYXVsdCAoaHR0cHM6Ly9naXRodWIuY29tL1RoZXJpYXVsdClcbiAgLy8gICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4gIC8vICAgIGlucHV0IGJ5OiBtYWpha1xuICAvLyAgICBpbnB1dCBieTogQWxleFxuICAvLyAgICBpbnB1dCBieTogTWFydGluXG4gIC8vICAgIGlucHV0IGJ5OiBBbGV4IFdpbHNvblxuICAvLyAgICBpbnB1dCBieTogSGFyYXZpa2tcbiAgLy8gYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rdnouaW8pXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBtYWpha1xuICAvLyBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2t2ei5pbylcbiAgLy8gYnVnZml4ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXG4gIC8vIGJ1Z2ZpeGVkIGJ5OiBvbWlkIChodHRwOi8vbG9jdXR1cy5pby9waHAvMzgwOjM4MCNjb21tZW50XzEzNzEyMilcbiAgLy8gYnVnZml4ZWQgYnk6IENocmlzIChodHRwOi8vd3d3LmRldm90aXMubmwvKVxuICAvLyAgICAgIG5vdGUgMTogVXNlcyBnbG9iYWw6IGxvY3V0dXMgdG8gc3RvcmUgdGhlIGRlZmF1bHQgdGltZXpvbmVcbiAgLy8gICAgICBub3RlIDE6IEFsdGhvdWdoIHRoZSBmdW5jdGlvbiBwb3RlbnRpYWxseSBhbGxvd3MgdGltZXpvbmUgaW5mb1xuICAvLyAgICAgIG5vdGUgMTogKHNlZSBub3RlcyksIGl0IGN1cnJlbnRseSBkb2VzIG5vdCBzZXRcbiAgLy8gICAgICBub3RlIDE6IHBlciBhIHRpbWV6b25lIHNwZWNpZmllZCBieSBkYXRlX2RlZmF1bHRfdGltZXpvbmVfc2V0KCkuIEltcGxlbWVudGVycyBtaWdodCB1c2VcbiAgLy8gICAgICBub3RlIDE6ICRsb2N1dHVzLmN1cnJlbnRUaW1lem9uZU9mZnNldCBhbmRcbiAgLy8gICAgICBub3RlIDE6ICRsb2N1dHVzLmN1cnJlbnRUaW1lem9uZURTVCBzZXQgYnkgdGhhdCBmdW5jdGlvblxuICAvLyAgICAgIG5vdGUgMTogaW4gb3JkZXIgdG8gYWRqdXN0IHRoZSBkYXRlcyBpbiB0aGlzIGZ1bmN0aW9uXG4gIC8vICAgICAgbm90ZSAxOiAob3Igb3VyIG90aGVyIGRhdGUgZnVuY3Rpb25zISkgYWNjb3JkaW5nbHlcbiAgLy8gICBleGFtcGxlIDE6IGRhdGUoJ0g6bTpzIFxcXFxtIFxcXFxpXFxcXHMgXFxcXG1cXFxcb1xcXFxuXFxcXHRcXFxcaCcsIDEwNjI0MDI0MDApXG4gIC8vICAgcmV0dXJucyAxOiAnMDc6MDk6NDAgbSBpcyBtb250aCdcbiAgLy8gICBleGFtcGxlIDI6IGRhdGUoJ0YgaiwgWSwgZzppIGEnLCAxMDYyNDYyNDAwKVxuICAvLyAgIHJldHVybnMgMjogJ1NlcHRlbWJlciAyLCAyMDAzLCAxMjoyNiBhbSdcbiAgLy8gICBleGFtcGxlIDM6IGRhdGUoJ1kgVyBvJywgMTA2MjQ2MjQwMClcbiAgLy8gICByZXR1cm5zIDM6ICcyMDAzIDM2IDIwMDMnXG4gIC8vICAgZXhhbXBsZSA0OiB2YXIgJHggPSBkYXRlKCdZIG0gZCcsIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxuICAvLyAgIGV4YW1wbGUgNDogJHggPSAkeCArICcnXG4gIC8vICAgZXhhbXBsZSA0OiB2YXIgJHJlc3VsdCA9ICR4Lmxlbmd0aCAvLyAyMDA5IDAxIDA5XG4gIC8vICAgcmV0dXJucyA0OiAxMFxuICAvLyAgIGV4YW1wbGUgNTogZGF0ZSgnVycsIDExMDQ1MzQwMDApXG4gIC8vICAgcmV0dXJucyA1OiAnNTInXG4gIC8vICAgZXhhbXBsZSA2OiBkYXRlKCdCIHQnLCAxMTA0NTM0MDAwKVxuICAvLyAgIHJldHVybnMgNjogJzk5OSAzMSdcbiAgLy8gICBleGFtcGxlIDc6IGRhdGUoJ1cgVScsIDEyOTM3NTAwMDAuODIpOyAvLyAyMDEwLTEyLTMxXG4gIC8vICAgcmV0dXJucyA3OiAnNTIgMTI5Mzc1MDAwMCdcbiAgLy8gICBleGFtcGxlIDg6IGRhdGUoJ1cnLCAxMjkzODM2NDAwKTsgLy8gMjAxMS0wMS0wMVxuICAvLyAgIHJldHVybnMgODogJzUyJ1xuICAvLyAgIGV4YW1wbGUgOTogZGF0ZSgnVyBZLW0tZCcsIDEyOTM5NzQwNTQpOyAvLyAyMDExLTAxLTAyXG4gIC8vICAgcmV0dXJucyA5OiAnNTIgMjAxMS0wMS0wMidcbiAgLy8gICAgICAgIHRlc3Q6IHNraXAtMSBza2lwLTIgc2tpcC01XG5cbiAgdmFyIGpzZGF0ZSwgZjtcbiAgLy8gS2VlcCB0aGlzIGhlcmUgKHdvcmtzLCBidXQgZm9yIGNvZGUgY29tbWVudGVkLW91dCBiZWxvdyBmb3IgZmlsZSBzaXplIHJlYXNvbnMpXG4gIC8vIHZhciB0YWw9IFtdO1xuICB2YXIgdHh0V29yZHMgPSBbJ1N1bicsICdNb24nLCAnVHVlcycsICdXZWRuZXMnLCAnVGh1cnMnLCAnRnJpJywgJ1NhdHVyJywgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgLy8gdHJhaWxpbmcgYmFja3NsYXNoIC0+IChkcm9wcGVkKVxuICAvLyBhIGJhY2tzbGFzaCBmb2xsb3dlZCBieSBhbnkgY2hhcmFjdGVyIChpbmNsdWRpbmcgYmFja3NsYXNoKSAtPiB0aGUgY2hhcmFjdGVyXG4gIC8vIGVtcHR5IHN0cmluZyAtPiBlbXB0eSBzdHJpbmdcbiAgdmFyIGZvcm1hdENociA9IC9cXFxcPyguPykvZ2k7XG4gIHZhciBmb3JtYXRDaHJDYiA9IGZ1bmN0aW9uIGZvcm1hdENockNiKHQsIHMpIHtcbiAgICByZXR1cm4gZlt0XSA/IGZbdF0oKSA6IHM7XG4gIH07XG4gIHZhciBfcGFkID0gZnVuY3Rpb24gX3BhZChuLCBjKSB7XG4gICAgbiA9IFN0cmluZyhuKTtcbiAgICB3aGlsZSAobi5sZW5ndGggPCBjKSB7XG4gICAgICBuID0gJzAnICsgbjtcbiAgICB9XG4gICAgcmV0dXJuIG47XG4gIH07XG4gIGYgPSB7XG4gICAgLy8gRGF5XG4gICAgZDogZnVuY3Rpb24gZCgpIHtcbiAgICAgIC8vIERheSBvZiBtb250aCB3L2xlYWRpbmcgMDsgMDEuLjMxXG4gICAgICByZXR1cm4gX3BhZChmLmooKSwgMik7XG4gICAgfSxcbiAgICBEOiBmdW5jdGlvbiBEKCkge1xuICAgICAgLy8gU2hvcnRoYW5kIGRheSBuYW1lOyBNb24uLi5TdW5cbiAgICAgIHJldHVybiBmLmwoKS5zbGljZSgwLCAzKTtcbiAgICB9LFxuICAgIGo6IGZ1bmN0aW9uIGooKSB7XG4gICAgICAvLyBEYXkgb2YgbW9udGg7IDEuLjMxXG4gICAgICByZXR1cm4ganNkYXRlLmdldERhdGUoKTtcbiAgICB9LFxuICAgIGw6IGZ1bmN0aW9uIGwoKSB7XG4gICAgICAvLyBGdWxsIGRheSBuYW1lOyBNb25kYXkuLi5TdW5kYXlcbiAgICAgIHJldHVybiB0eHRXb3Jkc1tmLncoKV0gKyAnZGF5JztcbiAgICB9LFxuICAgIE46IGZ1bmN0aW9uIE4oKSB7XG4gICAgICAvLyBJU08tODYwMSBkYXkgb2Ygd2VlazsgMVtNb25dLi43W1N1bl1cbiAgICAgIHJldHVybiBmLncoKSB8fCA3O1xuICAgIH0sXG4gICAgUzogZnVuY3Rpb24gUygpIHtcbiAgICAgIC8vIE9yZGluYWwgc3VmZml4IGZvciBkYXkgb2YgbW9udGg7IHN0LCBuZCwgcmQsIHRoXG4gICAgICB2YXIgaiA9IGYuaigpO1xuICAgICAgdmFyIGkgPSBqICUgMTA7XG4gICAgICBpZiAoaSA8PSAzICYmIHBhcnNlSW50KGogJSAxMDAgLyAxMCwgMTApID09PSAxKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFsnc3QnLCAnbmQnLCAncmQnXVtpIC0gMV0gfHwgJ3RoJztcbiAgICB9LFxuICAgIHc6IGZ1bmN0aW9uIHcoKSB7XG4gICAgICAvLyBEYXkgb2Ygd2VlazsgMFtTdW5dLi42W1NhdF1cbiAgICAgIHJldHVybiBqc2RhdGUuZ2V0RGF5KCk7XG4gICAgfSxcbiAgICB6OiBmdW5jdGlvbiB6KCkge1xuICAgICAgLy8gRGF5IG9mIHllYXI7IDAuLjM2NVxuICAgICAgdmFyIGEgPSBuZXcgRGF0ZShmLlkoKSwgZi5uKCkgLSAxLCBmLmooKSk7XG4gICAgICB2YXIgYiA9IG5ldyBEYXRlKGYuWSgpLCAwLCAxKTtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKChhIC0gYikgLyA4NjRlNSk7XG4gICAgfSxcblxuICAgIC8vIFdlZWtcbiAgICBXOiBmdW5jdGlvbiBXKCkge1xuICAgICAgLy8gSVNPLTg2MDEgd2VlayBudW1iZXJcbiAgICAgIHZhciBhID0gbmV3IERhdGUoZi5ZKCksIGYubigpIC0gMSwgZi5qKCkgLSBmLk4oKSArIDMpO1xuICAgICAgdmFyIGIgPSBuZXcgRGF0ZShhLmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgICAgcmV0dXJuIF9wYWQoMSArIE1hdGgucm91bmQoKGEgLSBiKSAvIDg2NGU1IC8gNyksIDIpO1xuICAgIH0sXG5cbiAgICAvLyBNb250aFxuICAgIEY6IGZ1bmN0aW9uIEYoKSB7XG4gICAgICAvLyBGdWxsIG1vbnRoIG5hbWU7IEphbnVhcnkuLi5EZWNlbWJlclxuICAgICAgcmV0dXJuIHR4dFdvcmRzWzYgKyBmLm4oKV07XG4gICAgfSxcbiAgICBtOiBmdW5jdGlvbiBtKCkge1xuICAgICAgLy8gTW9udGggdy9sZWFkaW5nIDA7IDAxLi4uMTJcbiAgICAgIHJldHVybiBfcGFkKGYubigpLCAyKTtcbiAgICB9LFxuICAgIE06IGZ1bmN0aW9uIE0oKSB7XG4gICAgICAvLyBTaG9ydGhhbmQgbW9udGggbmFtZTsgSmFuLi4uRGVjXG4gICAgICByZXR1cm4gZi5GKCkuc2xpY2UoMCwgMyk7XG4gICAgfSxcbiAgICBuOiBmdW5jdGlvbiBuKCkge1xuICAgICAgLy8gTW9udGg7IDEuLi4xMlxuICAgICAgcmV0dXJuIGpzZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICB9LFxuICAgIHQ6IGZ1bmN0aW9uIHQoKSB7XG4gICAgICAvLyBEYXlzIGluIG1vbnRoOyAyOC4uLjMxXG4gICAgICByZXR1cm4gbmV3IERhdGUoZi5ZKCksIGYubigpLCAwKS5nZXREYXRlKCk7XG4gICAgfSxcblxuICAgIC8vIFllYXJcbiAgICBMOiBmdW5jdGlvbiBMKCkge1xuICAgICAgLy8gSXMgbGVhcCB5ZWFyPzsgMCBvciAxXG4gICAgICB2YXIgaiA9IGYuWSgpO1xuICAgICAgcmV0dXJuIGogJSA0ID09PSAwICYgaiAlIDEwMCAhPT0gMCB8IGogJSA0MDAgPT09IDA7XG4gICAgfSxcbiAgICBvOiBmdW5jdGlvbiBvKCkge1xuICAgICAgLy8gSVNPLTg2MDEgeWVhclxuICAgICAgdmFyIG4gPSBmLm4oKTtcbiAgICAgIHZhciBXID0gZi5XKCk7XG4gICAgICB2YXIgWSA9IGYuWSgpO1xuICAgICAgcmV0dXJuIFkgKyAobiA9PT0gMTIgJiYgVyA8IDkgPyAxIDogbiA9PT0gMSAmJiBXID4gOSA/IC0xIDogMCk7XG4gICAgfSxcbiAgICBZOiBmdW5jdGlvbiBZKCkge1xuICAgICAgLy8gRnVsbCB5ZWFyOyBlLmcuIDE5ODAuLi4yMDEwXG4gICAgICByZXR1cm4ganNkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgfSxcbiAgICB5OiBmdW5jdGlvbiB5KCkge1xuICAgICAgLy8gTGFzdCB0d28gZGlnaXRzIG9mIHllYXI7IDAwLi4uOTlcbiAgICAgIHJldHVybiBmLlkoKS50b1N0cmluZygpLnNsaWNlKC0yKTtcbiAgICB9LFxuXG4gICAgLy8gVGltZVxuICAgIGE6IGZ1bmN0aW9uIGEoKSB7XG4gICAgICAvLyBhbSBvciBwbVxuICAgICAgcmV0dXJuIGpzZGF0ZS5nZXRIb3VycygpID4gMTEgPyAncG0nIDogJ2FtJztcbiAgICB9LFxuICAgIEE6IGZ1bmN0aW9uIEEoKSB7XG4gICAgICAvLyBBTSBvciBQTVxuICAgICAgcmV0dXJuIGYuYSgpLnRvVXBwZXJDYXNlKCk7XG4gICAgfSxcbiAgICBCOiBmdW5jdGlvbiBCKCkge1xuICAgICAgLy8gU3dhdGNoIEludGVybmV0IHRpbWU7IDAwMC4uOTk5XG4gICAgICB2YXIgSCA9IGpzZGF0ZS5nZXRVVENIb3VycygpICogMzZlMjtcbiAgICAgIC8vIEhvdXJzXG4gICAgICB2YXIgaSA9IGpzZGF0ZS5nZXRVVENNaW51dGVzKCkgKiA2MDtcbiAgICAgIC8vIE1pbnV0ZXNcbiAgICAgIC8vIFNlY29uZHNcbiAgICAgIHZhciBzID0ganNkYXRlLmdldFVUQ1NlY29uZHMoKTtcbiAgICAgIHJldHVybiBfcGFkKE1hdGguZmxvb3IoKEggKyBpICsgcyArIDM2ZTIpIC8gODYuNCkgJSAxZTMsIDMpO1xuICAgIH0sXG4gICAgZzogZnVuY3Rpb24gZygpIHtcbiAgICAgIC8vIDEyLUhvdXJzOyAxLi4xMlxuICAgICAgcmV0dXJuIGYuRygpICUgMTIgfHwgMTI7XG4gICAgfSxcbiAgICBHOiBmdW5jdGlvbiBHKCkge1xuICAgICAgLy8gMjQtSG91cnM7IDAuLjIzXG4gICAgICByZXR1cm4ganNkYXRlLmdldEhvdXJzKCk7XG4gICAgfSxcbiAgICBoOiBmdW5jdGlvbiBoKCkge1xuICAgICAgLy8gMTItSG91cnMgdy9sZWFkaW5nIDA7IDAxLi4xMlxuICAgICAgcmV0dXJuIF9wYWQoZi5nKCksIDIpO1xuICAgIH0sXG4gICAgSDogZnVuY3Rpb24gSCgpIHtcbiAgICAgIC8vIDI0LUhvdXJzIHcvbGVhZGluZyAwOyAwMC4uMjNcbiAgICAgIHJldHVybiBfcGFkKGYuRygpLCAyKTtcbiAgICB9LFxuICAgIGk6IGZ1bmN0aW9uIGkoKSB7XG4gICAgICAvLyBNaW51dGVzIHcvbGVhZGluZyAwOyAwMC4uNTlcbiAgICAgIHJldHVybiBfcGFkKGpzZGF0ZS5nZXRNaW51dGVzKCksIDIpO1xuICAgIH0sXG4gICAgczogZnVuY3Rpb24gcygpIHtcbiAgICAgIC8vIFNlY29uZHMgdy9sZWFkaW5nIDA7IDAwLi41OVxuICAgICAgcmV0dXJuIF9wYWQoanNkYXRlLmdldFNlY29uZHMoKSwgMik7XG4gICAgfSxcbiAgICB1OiBmdW5jdGlvbiB1KCkge1xuICAgICAgLy8gTWljcm9zZWNvbmRzOyAwMDAwMDAtOTk5MDAwXG4gICAgICByZXR1cm4gX3BhZChqc2RhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKiAxMDAwLCA2KTtcbiAgICB9LFxuXG4gICAgLy8gVGltZXpvbmVcbiAgICBlOiBmdW5jdGlvbiBlKCkge1xuICAgICAgLy8gVGltZXpvbmUgaWRlbnRpZmllcjsgZS5nLiBBdGxhbnRpYy9Bem9yZXMsIC4uLlxuICAgICAgLy8gVGhlIGZvbGxvd2luZyB3b3JrcywgYnV0IHJlcXVpcmVzIGluY2x1c2lvbiBvZiB0aGUgdmVyeSBsYXJnZVxuICAgICAgLy8gdGltZXpvbmVfYWJicmV2aWF0aW9uc19saXN0KCkgZnVuY3Rpb24uXG4gICAgICAvKiAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuZGF0ZV9kZWZhdWx0X3RpbWV6b25lX2dldCgpO1xuICAgICAgICovXG4gICAgICB2YXIgbXNnID0gJ05vdCBzdXBwb3J0ZWQgKHNlZSBzb3VyY2UgY29kZSBvZiBkYXRlKCkgZm9yIHRpbWV6b25lIG9uIGhvdyB0byBhZGQgc3VwcG9ydCknO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfSxcbiAgICBJOiBmdW5jdGlvbiBJKCkge1xuICAgICAgLy8gRFNUIG9ic2VydmVkPzsgMCBvciAxXG4gICAgICAvLyBDb21wYXJlcyBKYW4gMSBtaW51cyBKYW4gMSBVVEMgdG8gSnVsIDEgbWludXMgSnVsIDEgVVRDLlxuICAgICAgLy8gSWYgdGhleSBhcmUgbm90IGVxdWFsLCB0aGVuIERTVCBpcyBvYnNlcnZlZC5cbiAgICAgIHZhciBhID0gbmV3IERhdGUoZi5ZKCksIDApO1xuICAgICAgLy8gSmFuIDFcbiAgICAgIHZhciBjID0gRGF0ZS5VVEMoZi5ZKCksIDApO1xuICAgICAgLy8gSmFuIDEgVVRDXG4gICAgICB2YXIgYiA9IG5ldyBEYXRlKGYuWSgpLCA2KTtcbiAgICAgIC8vIEp1bCAxXG4gICAgICAvLyBKdWwgMSBVVENcbiAgICAgIHZhciBkID0gRGF0ZS5VVEMoZi5ZKCksIDYpO1xuICAgICAgcmV0dXJuIGEgLSBjICE9PSBiIC0gZCA/IDEgOiAwO1xuICAgIH0sXG4gICAgTzogZnVuY3Rpb24gTygpIHtcbiAgICAgIC8vIERpZmZlcmVuY2UgdG8gR01UIGluIGhvdXIgZm9ybWF0OyBlLmcuICswMjAwXG4gICAgICB2YXIgdHpvID0ganNkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICB2YXIgYSA9IE1hdGguYWJzKHR6byk7XG4gICAgICByZXR1cm4gKHR6byA+IDAgPyAnLScgOiAnKycpICsgX3BhZChNYXRoLmZsb29yKGEgLyA2MCkgKiAxMDAgKyBhICUgNjAsIDQpO1xuICAgIH0sXG4gICAgUDogZnVuY3Rpb24gUCgpIHtcbiAgICAgIC8vIERpZmZlcmVuY2UgdG8gR01UIHcvY29sb247IGUuZy4gKzAyOjAwXG4gICAgICB2YXIgTyA9IGYuTygpO1xuICAgICAgcmV0dXJuIE8uc3Vic3RyKDAsIDMpICsgJzonICsgTy5zdWJzdHIoMywgMik7XG4gICAgfSxcbiAgICBUOiBmdW5jdGlvbiBUKCkge1xuICAgICAgLy8gVGhlIGZvbGxvd2luZyB3b3JrcywgYnV0IHJlcXVpcmVzIGluY2x1c2lvbiBvZiB0aGUgdmVyeVxuICAgICAgLy8gbGFyZ2UgdGltZXpvbmVfYWJicmV2aWF0aW9uc19saXN0KCkgZnVuY3Rpb24uXG4gICAgICAvKiAgICAgICAgICAgICAgdmFyIGFiYnIsIGksIG9zLCBfZGVmYXVsdDtcbiAgICAgIGlmICghdGFsLmxlbmd0aCkge1xuICAgICAgICB0YWwgPSB0aGF0LnRpbWV6b25lX2FiYnJldmlhdGlvbnNfbGlzdCgpO1xuICAgICAgfVxuICAgICAgaWYgKCRsb2N1dHVzICYmICRsb2N1dHVzLmRlZmF1bHRfdGltZXpvbmUpIHtcbiAgICAgICAgX2RlZmF1bHQgPSAkbG9jdXR1cy5kZWZhdWx0X3RpbWV6b25lO1xuICAgICAgICBmb3IgKGFiYnIgaW4gdGFsKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhbFthYmJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRhbFthYmJyXVtpXS50aW1lem9uZV9pZCA9PT0gX2RlZmF1bHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFiYnIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoYWJiciBpbiB0YWwpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhbFthYmJyXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG9zID0gLWpzZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjA7XG4gICAgICAgICAgaWYgKHRhbFthYmJyXVtpXS5vZmZzZXQgPT09IG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gYWJici50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKi9cbiAgICAgIHJldHVybiAnVVRDJztcbiAgICB9LFxuICAgIFo6IGZ1bmN0aW9uIFooKSB7XG4gICAgICAvLyBUaW1lem9uZSBvZmZzZXQgaW4gc2Vjb25kcyAoLTQzMjAwLi4uNTA0MDApXG4gICAgICByZXR1cm4gLWpzZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjA7XG4gICAgfSxcblxuICAgIC8vIEZ1bGwgRGF0ZS9UaW1lXG4gICAgYzogZnVuY3Rpb24gYygpIHtcbiAgICAgIC8vIElTTy04NjAxIGRhdGUuXG4gICAgICByZXR1cm4gJ1ktbS1kXFxcXFRIOmk6c1AnLnJlcGxhY2UoZm9ybWF0Q2hyLCBmb3JtYXRDaHJDYik7XG4gICAgfSxcbiAgICByOiBmdW5jdGlvbiByKCkge1xuICAgICAgLy8gUkZDIDI4MjJcbiAgICAgIHJldHVybiAnRCwgZCBNIFkgSDppOnMgTycucmVwbGFjZShmb3JtYXRDaHIsIGZvcm1hdENockNiKTtcbiAgICB9LFxuICAgIFU6IGZ1bmN0aW9uIFUoKSB7XG4gICAgICAvLyBTZWNvbmRzIHNpbmNlIFVOSVggZXBvY2hcbiAgICAgIHJldHVybiBqc2RhdGUgLyAxMDAwIHwgMDtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9kYXRlID0gZnVuY3Rpb24gX2RhdGUoZm9ybWF0LCB0aW1lc3RhbXApIHtcbiAgICBqc2RhdGUgPSB0aW1lc3RhbXAgPT09IHVuZGVmaW5lZCA/IG5ldyBEYXRlKCkgLy8gTm90IHByb3ZpZGVkXG4gICAgOiB0aW1lc3RhbXAgaW5zdGFuY2VvZiBEYXRlID8gbmV3IERhdGUodGltZXN0YW1wKSAvLyBKUyBEYXRlKClcbiAgICA6IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApIC8vIFVOSVggdGltZXN0YW1wIChhdXRvLWNvbnZlcnQgdG8gaW50KVxuICAgIDtcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoZm9ybWF0Q2hyLCBmb3JtYXRDaHJDYik7XG4gIH07XG5cbiAgcmV0dXJuIF9kYXRlKGZvcm1hdCwgdGltZXN0YW1wKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRlLmpzLm1hcFxuXG4vKioqLyB9KSxcbi8qIDE5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYm9vbHZhbChtaXhlZFZhcikge1xuICAvLyBvcmlnaW5hbCBieTogV2lsbCBSb3dlXG4gIC8vICAgZXhhbXBsZSAxOiBib29sdmFsKHRydWUpXG4gIC8vICAgcmV0dXJucyAxOiB0cnVlXG4gIC8vICAgZXhhbXBsZSAyOiBib29sdmFsKGZhbHNlKVxuICAvLyAgIHJldHVybnMgMjogZmFsc2VcbiAgLy8gICBleGFtcGxlIDM6IGJvb2x2YWwoMClcbiAgLy8gICByZXR1cm5zIDM6IGZhbHNlXG4gIC8vICAgZXhhbXBsZSA0OiBib29sdmFsKDAuMClcbiAgLy8gICByZXR1cm5zIDQ6IGZhbHNlXG4gIC8vICAgZXhhbXBsZSA1OiBib29sdmFsKCcnKVxuICAvLyAgIHJldHVybnMgNTogZmFsc2VcbiAgLy8gICBleGFtcGxlIDY6IGJvb2x2YWwoJzAnKVxuICAvLyAgIHJldHVybnMgNjogZmFsc2VcbiAgLy8gICBleGFtcGxlIDc6IGJvb2x2YWwoW10pXG4gIC8vICAgcmV0dXJucyA3OiBmYWxzZVxuICAvLyAgIGV4YW1wbGUgODogYm9vbHZhbCgnJylcbiAgLy8gICByZXR1cm5zIDg6IGZhbHNlXG4gIC8vICAgZXhhbXBsZSA5OiBib29sdmFsKG51bGwpXG4gIC8vICAgcmV0dXJucyA5OiBmYWxzZVxuICAvLyAgIGV4YW1wbGUgMTA6IGJvb2x2YWwodW5kZWZpbmVkKVxuICAvLyAgIHJldHVybnMgMTA6IGZhbHNlXG4gIC8vICAgZXhhbXBsZSAxMTogYm9vbHZhbCgndHJ1ZScpXG4gIC8vICAgcmV0dXJucyAxMTogdHJ1ZVxuXG4gIGlmIChtaXhlZFZhciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobWl4ZWRWYXIgPT09IDAgfHwgbWl4ZWRWYXIgPT09IDAuMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChtaXhlZFZhciA9PT0gJycgfHwgbWl4ZWRWYXIgPT09ICcwJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG1peGVkVmFyKSAmJiBtaXhlZFZhci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobWl4ZWRWYXIgPT09IG51bGwgfHwgbWl4ZWRWYXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJvb2x2YWwuanMubWFwXG5cbi8qKiovIH0pLFxuLyogMjAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUd2lnKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgVHdpZy5UZW1wbGF0ZXMucmVnaXN0ZXJMb2FkZXIoJ2FqYXgnLCBmdW5jdGlvbihsb2NhdGlvbiwgcGFyYW1zLCBjYWxsYmFjaywgZXJyb3JfY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlLFxuICAgICAgICAgICAgeG1saHR0cCxcbiAgICAgICAgICAgIHByZWNvbXBpbGVkID0gcGFyYW1zLnByZWNvbXBpbGVkLFxuICAgICAgICAgICAgcGFyc2VyID0gdGhpcy5wYXJzZXJzW3BhcmFtcy5wYXJzZXJdIHx8IHRoaXMucGFyc2VyLnR3aWc7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoJ1Vuc3VwcG9ydGVkIHBsYXRmb3JtOiBVbmFibGUgdG8gZG8gYWpheCByZXF1ZXN0cyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiZWNhdXNlIHRoZXJlIGlzIG5vIFwiWE1MSFRUUFJlcXVlc3RcIiBpbXBsZW1lbnRhdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAoeG1saHR0cC5zdGF0dXMgPT09IDIwMCB8fCAod2luZG93LmNvcmRvdmEgJiYgeG1saHR0cC5zdGF0dXMgPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJHb3QgdGVtcGxhdGUgXCIsIHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlY29tcGlsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy51cmwgPSBsb2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmRhdGEgPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gcGFyc2VyLmNhbGwodGhpcywgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yX2NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl9jYWxsYmFjayh4bWxodHRwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIGxvY2F0aW9uLCAhIXBhcmFtcy5hc3luYyk7XG4gICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuXG4gICAgICAgIGlmIChwYXJhbXMuYXN5bmMpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IHJldHVybiBkZWZlcnJlZCBwcm9taXNlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59O1xuXG5cbi8qKiovIH0pLFxuLyogMjEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUd2lnKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGZzLCBwYXRoO1xuXG4gICAgdHJ5IHtcbiAgICBcdC8vIHJlcXVpcmUgbGliIGRlcGVuZGVuY2llcyBhdCBydW50aW1lXG4gICAgXHRmcyA9IF9fd2VicGFja19yZXF1aXJlX18oMjIpO1xuICAgIFx0cGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIFx0Ly8gTk9URTogdGhpcyBpcyBpbiBhIHRyeS9jYXRjaCB0byBhdm9pZCBlcnJvcnMgY3Jvc3MgcGxhdGZvcm1cbiAgICB9XG5cbiAgICBUd2lnLlRlbXBsYXRlcy5yZWdpc3RlckxvYWRlcignZnMnLCBmdW5jdGlvbihsb2NhdGlvbiwgcGFyYW1zLCBjYWxsYmFjaywgZXJyb3JfY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlLFxuICAgICAgICAgICAgZGF0YSA9IG51bGwsXG4gICAgICAgICAgICBwcmVjb21waWxlZCA9IHBhcmFtcy5wcmVjb21waWxlZCxcbiAgICAgICAgICAgIHBhcnNlciA9IHRoaXMucGFyc2Vyc1twYXJhbXMucGFyc2VyXSB8fCB0aGlzLnBhcnNlci50d2lnO1xuXG4gICAgICAgIGlmICghZnMgfHwgIXBhdGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKCdVbnN1cHBvcnRlZCBwbGF0Zm9ybTogVW5hYmxlIHRvIGxvYWQgZnJvbSBmaWxlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JlY2F1c2UgdGhlcmUgaXMgbm8gXCJmc1wiIG9yIFwicGF0aFwiIGltcGxlbWVudGF0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9hZFRlbXBsYXRlRm4gPSBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yX2NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yX2NhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByZWNvbXBpbGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHBhcmFtcy5wYXRoID0gcGFyYW1zLnBhdGggfHwgbG9jYXRpb247XG5cbiAgICAgICAgICAgIC8vIHRlbXBsYXRlIGlzIGluIGRhdGFcbiAgICAgICAgICAgIHRlbXBsYXRlID0gcGFyc2VyLmNhbGwodGhpcywgcGFyYW1zKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcGFyYW1zLnBhdGggPSBwYXJhbXMucGF0aCB8fCBsb2NhdGlvbjtcblxuICAgICAgICBpZiAocGFyYW1zLmFzeW5jKSB7XG4gICAgICAgICAgICBmcy5zdGF0KHBhcmFtcy5wYXRoLCBmdW5jdGlvbiAoZXJyLCBzdGF0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIXN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3JfY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yX2NhbGxiYWNrKG5ldyBUd2lnLkVycm9yKCdVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmaWxlICcgKyBwYXJhbXMucGF0aCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnMucmVhZEZpbGUocGFyYW1zLnBhdGgsICd1dGY4JywgbG9hZFRlbXBsYXRlRm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBUT0RPOiByZXR1cm4gZGVmZXJyZWQgcHJvbWlzZVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghZnMuc3RhdFN5bmMocGFyYW1zLnBhdGgpLmlzRmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKCdVbmFibGUgdG8gZmluZCB0ZW1wbGF0ZSBmaWxlICcgKyBwYXJhbXMucGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHRlbXBsYXRlIGZpbGUgJyArIHBhcmFtcy5wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMocGFyYW1zLnBhdGgsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2FkVGVtcGxhdGVGbih1bmRlZmluZWQsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcblxuXG4vKioqLyB9KSxcbi8qIDIyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG4vKioqLyB9KSxcbi8qIDIzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbi8vICMjIHR3aWcubG9naWMuanNcbi8vXG4vLyBUaGlzIGZpbGUgaGFuZGxlcyB0b2tlbml6aW5nLCBjb21waWxpbmcgYW5kIHBhcnNpbmcgbG9naWMgdG9rZW5zLiB7JSAuLi4gJX1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIE5hbWVzcGFjZSBmb3IgbG9naWMgaGFuZGxpbmcuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTG9naWMgdG9rZW4gdHlwZXMuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYy50eXBlID0ge1xuICAgICAgICBpZl86ICAgICAgICdUd2lnLmxvZ2ljLnR5cGUuaWYnLFxuICAgICAgICBlbmRpZjogICAgICdUd2lnLmxvZ2ljLnR5cGUuZW5kaWYnLFxuICAgICAgICBmb3JfOiAgICAgICdUd2lnLmxvZ2ljLnR5cGUuZm9yJyxcbiAgICAgICAgZW5kZm9yOiAgICAnVHdpZy5sb2dpYy50eXBlLmVuZGZvcicsXG4gICAgICAgIGVsc2VfOiAgICAgJ1R3aWcubG9naWMudHlwZS5lbHNlJyxcbiAgICAgICAgZWxzZWlmOiAgICAnVHdpZy5sb2dpYy50eXBlLmVsc2VpZicsXG4gICAgICAgIHNldDogICAgICAgJ1R3aWcubG9naWMudHlwZS5zZXQnLFxuICAgICAgICBzZXRjYXB0dXJlOidUd2lnLmxvZ2ljLnR5cGUuc2V0Y2FwdHVyZScsXG4gICAgICAgIGVuZHNldDogICAgJ1R3aWcubG9naWMudHlwZS5lbmRzZXQnLFxuICAgICAgICBmaWx0ZXI6ICAgICdUd2lnLmxvZ2ljLnR5cGUuZmlsdGVyJyxcbiAgICAgICAgZW5kZmlsdGVyOiAnVHdpZy5sb2dpYy50eXBlLmVuZGZpbHRlcicsXG4gICAgICAgIHNob3J0YmxvY2s6ICdUd2lnLmxvZ2ljLnR5cGUuc2hvcnRibG9jaycsXG4gICAgICAgIGJsb2NrOiAgICAgJ1R3aWcubG9naWMudHlwZS5ibG9jaycsXG4gICAgICAgIGVuZGJsb2NrOiAgJ1R3aWcubG9naWMudHlwZS5lbmRibG9jaycsXG4gICAgICAgIGV4dGVuZHNfOiAgJ1R3aWcubG9naWMudHlwZS5leHRlbmRzJyxcbiAgICAgICAgdXNlOiAgICAgICAnVHdpZy5sb2dpYy50eXBlLnVzZScsXG4gICAgICAgIGluY2x1ZGU6ICAgJ1R3aWcubG9naWMudHlwZS5pbmNsdWRlJyxcbiAgICAgICAgc3BhY2VsZXNzOiAnVHdpZy5sb2dpYy50eXBlLnNwYWNlbGVzcycsXG4gICAgICAgIGVuZHNwYWNlbGVzczogJ1R3aWcubG9naWMudHlwZS5lbmRzcGFjZWxlc3MnLFxuICAgICAgICBtYWNybzogICAgICdUd2lnLmxvZ2ljLnR5cGUubWFjcm8nLFxuICAgICAgICBlbmRtYWNybzogICdUd2lnLmxvZ2ljLnR5cGUuZW5kbWFjcm8nLFxuICAgICAgICBpbXBvcnRfOiAgICdUd2lnLmxvZ2ljLnR5cGUuaW1wb3J0JyxcbiAgICAgICAgZnJvbTogICAgICAnVHdpZy5sb2dpYy50eXBlLmZyb20nLFxuICAgICAgICBlbWJlZDogICAgICdUd2lnLmxvZ2ljLnR5cGUuZW1iZWQnLFxuICAgICAgICBlbmRlbWJlZDogICdUd2lnLmxvZ2ljLnR5cGUuZW5kZW1iZWQnLFxuICAgICAgICAnd2l0aCc6ICAgICAnVHdpZy5sb2dpYy50eXBlLndpdGgnLFxuICAgICAgICBlbmR3aXRoOiAgJ1R3aWcubG9naWMudHlwZS5lbmR3aXRoJ1xuICAgIH07XG5cblxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGhhbmRsaW5nIGxvZ2ljIHRva2Vucy5cbiAgICAvL1xuICAgIC8vIFByb3BlcnRpZXM6XG4gICAgLy9cbiAgICAvLyAgICAgIHR5cGU6ICBUaGUgdHlwZSBvZiBleHByZXNzaW9uIHRoaXMgbWF0Y2hlc1xuICAgIC8vXG4gICAgLy8gICAgICByZWdleDogQSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIHRoZSBmb3JtYXQgb2YgdGhlIHRva2VuXG4gICAgLy9cbiAgICAvLyAgICAgIG5leHQ6ICBXaGF0IGxvZ2ljIHRva2VucyAoaWYgYW55KSBwb3AgdGhpcyB0b2tlbiBvZmYgdGhlIGxvZ2ljIHN0YWNrLiBJZiBlbXB0eSwgdGhlXG4gICAgLy8gICAgICAgICAgICAgbG9naWMgdG9rZW4gaXMgYXNzdW1lZCB0byBub3QgcmVxdWlyZSBhbiBlbmQgdGFnIGFuZCBpc24ndCBwdXNoIG9udG8gdGhlIHN0YWNrLlxuICAgIC8vXG4gICAgLy8gICAgICBvcGVuOiAgRG9lcyB0aGlzIHRhZyBvcGVuIGEgbG9naWMgZXhwcmVzc2lvbiBvciBpcyBpdCBzdGFuZGFsb25lLiBGb3IgZXhhbXBsZSxcbiAgICAvLyAgICAgICAgICAgICB7JSBlbmRpZiAlfSBjYW5ub3QgZXhpc3Qgd2l0aG91dCBhbiBvcGVuaW5nIHslIGlmIC4uLiAlfSB0YWcsIHNvIG9wZW4gPSBmYWxzZS5cbiAgICAvL1xuICAgIC8vICBGdW5jdGlvbnM6XG4gICAgLy9cbiAgICAvLyAgICAgIGNvbXBpbGU6IEEgZnVuY3Rpb24gdGhhdCBoYW5kbGVzIGNvbXBpbGluZyB0aGUgdG9rZW4gaW50byBhbiBvdXRwdXQgdG9rZW4gcmVhZHkgZm9yXG4gICAgLy8gICAgICAgICAgICAgICBwYXJzaW5nIHdpdGggdGhlIHBhcnNlIGZ1bmN0aW9uLlxuICAgIC8vXG4gICAgLy8gICAgICBwYXJzZTogICBBIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIHRoZSBjb21waWxlZCB0b2tlbiBpbnRvIG91dHB1dCAoSFRNTCAvIHdoYXRldmVyIHRoZVxuICAgIC8vICAgICAgICAgICAgICAgdGVtcGxhdGUgcmVwcmVzZW50cykuXG4gICAgVHdpZy5sb2dpYy5kZWZpbml0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB0eXBlIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBpZiBleHByZXNzaW9uICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5pZl8sXG4gICAgICAgICAgICByZWdleDogL15pZlxccz8oW1xcc1xcU10rKSQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbHNlXyxcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZWxzZWlmLFxuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRpZlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIC8vIENvbXBpbGUgdGhlIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLnN0YWNrLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFpbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFR3aWcubGliLmJvb2x2YWwocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW4gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcucGFyc2VBc3luYy5jYWxsKHRoYXQsIHRva2VuLm91dHB1dCwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRWxzZSBpZiB0eXBlIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBlbHNlaWYgZXhwcmVzc2lvbiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZWxzZWlmLFxuICAgICAgICAgICAgcmVnZXg6IC9eZWxzZWlmXFxzPyhbXlxcc10uKikkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZWxzZV8sXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVsc2VpZixcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kaWZcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9KS5zdGFjaztcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4uc3RhY2ssIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFpbiAmJiBUd2lnLmxpYi5ib29sdmFsKHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLnBhcnNlQXN5bmMuY2FsbCh0aGF0LCB0b2tlbi5vdXRwdXQsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ob3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRWxzZSB0eXBlIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBlbHNlICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbHNlXyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVsc2UkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kaWYsXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGZvclxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IFR3aWcuUHJvbWlzZS5yZXNvbHZlKCcnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjaGFpbikge1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gVHdpZy5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4ub3V0cHV0LCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgaWYgdHlwZSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZW5kaWYgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZGlmLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kaWYkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRm9yIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGZvciBleHByZXNzaW9uICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5mb3JfLFxuICAgICAgICAgICAgcmVnZXg6IC9eZm9yXFxzKyhbYS16QS1aMC05XyxcXHNdKylcXHMraW5cXHMrKFtcXFNcXHNdKz8pKD86XFxzK2lmXFxzKyhbXlxcc10uKikpPyQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbHNlXyxcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kZm9yXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBrZXlfdmFsdWUgPSB0b2tlbi5tYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25hbCA9IHRva2VuLm1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICBrdl9zcGxpdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5rZXlfdmFyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZV92YXIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGtleV92YWx1ZS5pbmRleE9mKFwiLFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGt2X3NwbGl0ID0ga2V5X3ZhbHVlLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrdl9zcGxpdC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmtleV92YXIgPSBrdl9zcGxpdFswXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZV92YXIgPSBrdl9zcGxpdFsxXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcihcIkludmFsaWQgZXhwcmVzc2lvbiBpbiBmb3IgbG9vcDogXCIgKyBrZXlfdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4udmFsdWVfdmFyID0ga2V5X3ZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBWYWxpZCBleHByZXNzaW9ucyBmb3IgYSBmb3IgbG9vcFxuICAgICAgICAgICAgICAgIC8vICAgZm9yIGl0ZW0gICAgIGluIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAvLyAgIGZvciBrZXksaXRlbSBpbiBleHByZXNzaW9uXG5cbiAgICAgICAgICAgICAgICAvLyBDb21waWxlIHRoZSBleHByZXNzaW9uLlxuICAgICAgICAgICAgICAgIHRva2VuLmV4cHJlc3Npb24gPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICAvLyBDb21waWxlIHRoZSBjb25kaXRpb25hbCAoaWYgYXZhaWxhYmxlKVxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5jb25kaXRpb25hbCA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29uZGl0aW9uYWxcbiAgICAgICAgICAgICAgICAgICAgfSkuc3RhY2s7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjb250aW51ZV9jaGFpbikge1xuICAgICAgICAgICAgICAgIC8vIFBhcnNlIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGxlbixcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgICAgICAgICAgICBrZXlzZXQsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25hbCA9IHRva2VuLmNvbmRpdGlvbmFsLFxuICAgICAgICAgICAgICAgICAgICBidWlsZExvb3AgPSBmdW5jdGlvbihpbmRleCwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCsxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4MDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2aW5kZXg6IGlzQ29uZGl0aW9uYWw/dW5kZWZpbmVkOmxlbi1pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZpbmRleDA6IGlzQ29uZGl0aW9uYWw/dW5kZWZpbmVkOmxlbi1pbmRleC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiAoaW5kZXggPT09IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IGlzQ29uZGl0aW9uYWw/dW5kZWZpbmVkOihpbmRleCA9PT0gbGVuLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aDogaXNDb25kaXRpb25hbD91bmRlZmluZWQ6bGVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogY29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gcnVuIG9uY2UgZm9yIGVhY2ggaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgICAgICAgIGxvb3AgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5uZXJfY29udGV4dCA9IFR3aWcuQ2hpbGRDb250ZXh0KGNvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lcl9jb250ZXh0W3Rva2VuLnZhbHVlX3Zhcl0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLmtleV92YXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lcl9jb250ZXh0W3Rva2VuLmtleV92YXJdID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb29wIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJfY29udGV4dC5sb29wID0gYnVpbGRMb29wKGluZGV4LCBsZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGNvbmRpdGlvbmFsID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcuUHJvbWlzZS5yZXNvbHZlKHRydWUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoYXQsIGNvbmRpdGlvbmFsLCBpbm5lcl9jb250ZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbihjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmRpdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcucGFyc2VBc3luYy5jYWxsKHRoYXQsIHRva2VuLm91dHB1dCwgaW5uZXJfY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBsb29wLXJlbGF0ZWQgdmFyaWFibGVzIGZyb20gdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaW5uZXJfY29udGV4dFsnbG9vcCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpbm5lcl9jb250ZXh0W3Rva2VuLnZhbHVlX3Zhcl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGlubmVyX2NvbnRleHRbdG9rZW4ua2V5X3Zhcl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXJnZSBpbiB2YWx1ZXMgdGhhdCBleGlzdCBpbiBjb250ZXh0IGJ1dCBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBpbm5lcl9jb250ZXh0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcubWVyZ2UoY29udGV4dCwgaW5uZXJfY29udGV4dCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4uZXhwcmVzc2lvbiwgY29udGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFR3aWcubGliLmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmFzeW5jLmZvckVhY2gocmVzdWx0LCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9vcChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR3aWcubGliLmlzKCdPYmplY3QnLCByZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Ll9rZXlzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlzZXQgPSByZXN1bHQuX2tleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXNldCA9IE9iamVjdC5rZXlzKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW4gPSBrZXlzZXQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuYXN5bmMuZm9yRWFjaChrZXlzZXQsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSB0aGUgX2tleXMgcHJvcGVydHksIGl0J3MgaW50ZXJuYWwgdG8gdHdpZy5qc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiX2tleXNcIikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb3Aoa2V5LCAgcmVzdWx0W2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGFsbG93IGVsc2Ugc3RhdGVtZW50cyBpZiBubyBvdXRwdXQgd2FzIGdlbmVyYXRlZFxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZV9jaGFpbiA9IChvdXRwdXQubGVuZ3RoID09PSAwKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNvbnRpbnVlX2NoYWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBUd2lnLm91dHB1dC5jYWxsKHRoYXQsIG91dHB1dClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgZm9yIHR5cGUgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVuZGZvciAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW5kZm9yLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kZm9yJC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNldCB0eXBlIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBzZXQga2V5ID0gZXhwcmVzc2lvbiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuc2V0LFxuICAgICAgICAgICAgcmVnZXg6IC9ec2V0XFxzKyhbYS16QS1aMC05XyxcXHNdKylcXHMqPVxccyooW1xcc1xcU10rKSQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikgeyAvL1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSB0b2tlbi5tYXRjaFsxXS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSB0b2tlbi5tYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29tcGlsZSB0aGUgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbl9zdGFjayAgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgfSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5rZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgdG9rZW4uZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25fc3RhY2s7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNvbnRpbnVlX2NoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IHRva2VuLmtleTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLmV4cHJlc3Npb24sIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiAgSWYgc3RvcmluZyB0aGUgY29udGV4dCBpbiBhIHZhcmlhYmxlLCBpdCBuZWVkcyB0byBiZSBhIGNsb25lIG9mIHRoZSBjdXJyZW50IHN0YXRlIG9mIGNvbnRleHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3RoZXJ3aXNlIHdlIGhhdmUgYSBjb250ZXh0IHdpdGggaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpeGVzICMzNDFcbiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFR3aWcubGliLmNvcHkodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFtrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjb250aW51ZV9jaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgY2FwdHVyZSB0eXBlIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBzZXQga2V5ICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5zZXRjYXB0dXJlLFxuICAgICAgICAgICAgcmVnZXg6IC9ec2V0XFxzKyhbYS16QS1aMC05XyxcXHNdKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kc2V0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSB0b2tlbi5tYXRjaFsxXS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5rZXkgPSBrZXk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNvbnRpbnVlX2NoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBrZXkgPSB0b2tlbi5rZXk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4ub3V0cHV0LCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCBvbiBib3RoIHRoZSBnbG9iYWwgYW5kIGxvY2FsIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jb250ZXh0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFtrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjb250aW51ZV9jaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgc2V0IHR5cGUgYmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVuZHNldCAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW5kc2V0LFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kc2V0JC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbHRlciBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZmlsdGVyIHVwcGVyICV9IG9yIHslIGZpbHRlciBsb3dlcnxlc2NhcGUgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmZpbHRlcixcbiAgICAgICAgICAgIHJlZ2V4OiAvXmZpbHRlclxccysoLispJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGZpbHRlclxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IFwifFwiICsgdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIC8vIENvbXBpbGUgdGhlIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgdG9rZW4uc3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5vdXRwdXQsIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odW5maWx0ZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhY2sgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVuZmlsdGVyZWRcbiAgICAgICAgICAgICAgICAgICAgfV0uY29uY2F0KHRva2VuLnN0YWNrKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGF0LCBzdGFjaywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgZmlsdGVyIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBlbmRmaWx0ZXIgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmVuZGZpbHRlcixcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVuZGZpbHRlciQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCbG9jayBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgYmxvY2sgdGl0bGUgJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmJsb2NrLFxuICAgICAgICAgICAgcmVnZXg6IC9eYmxvY2tcXHMrKFthLXpBLVowLTlfXSspJC8sXG4gICAgICAgICAgICBuZXh0OiBbXG4gICAgICAgICAgICAgICAgVHdpZy5sb2dpYy50eXBlLmVuZGJsb2NrXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHRva2VuLmJsb2NrID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrX291dHB1dCxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gVHdpZy5Qcm9taXNlLnJlc29sdmUoKSxcbiAgICAgICAgICAgICAgICAgICAgaXNJbXBvcnRlZCA9IFR3aWcuaW5kZXhPZih0aGlzLmltcG9ydGVkQmxvY2tzLCB0b2tlbi5ibG9jaykgPiAtMSxcbiAgICAgICAgICAgICAgICAgICAgaGFzUGFyZW50ID0gdGhpcy5ibG9ja3NbdG9rZW4uYmxvY2tdICYmIFR3aWcuaW5kZXhPZih0aGlzLmJsb2Nrc1t0b2tlbi5ibG9ja10sIFR3aWcucGxhY2Vob2xkZXJzLnBhcmVudCkgPiAtMTtcblxuICAgICAgICAgICAgICAgIC8vIGRldGVjdCBpZiBpbiBhIGZvciBsb29wXG4gICAgICAgICAgICAgICAgVHdpZy5mb3JFYWNoKHRoaXMucGFyc2VTdGFjaywgZnVuY3Rpb24gKHBhcmVudF90b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50X3Rva2VuLnR5cGUgPT0gVHdpZy5sb2dpYy50eXBlLmZvcl8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLm92ZXJ3cml0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIERvbid0IG92ZXJyaWRlIHByZXZpb3VzIGJsb2NrcyB1bmxlc3MgdGhleSdyZSBpbXBvcnRlZCB3aXRoIFwidXNlXCJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ibG9ja3NbdG9rZW4uYmxvY2tdID09PSB1bmRlZmluZWQgfHwgaXNJbXBvcnRlZCB8fCBoYXNQYXJlbnQgfHwgdG9rZW4ub3ZlcndyaXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5vdXRwdXQsIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoYXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IFR3aWcucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLm91dHB1dCwgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhhdCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBUd2lnLmV4cHJlc3Npb24udHlwZS5zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKGJsb2NrX291dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW1wb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmNlIHRoZSBibG9jayBpcyBvdmVycmlkZGVuLCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdCBvZiBpbXBvcnRlZCBibG9ja3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmltcG9ydGVkQmxvY2tzLnNwbGljZSh0aGF0LmltcG9ydGVkQmxvY2tzLmluZGV4T2YodG9rZW4uYmxvY2spLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1BhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuYmxvY2tzW3Rva2VuLmJsb2NrXSA9IFR3aWcuTWFya3VwKHRoYXQuYmxvY2tzW3Rva2VuLmJsb2NrXS5yZXBsYWNlKFR3aWcucGxhY2Vob2xkZXJzLnBhcmVudCwgYmxvY2tfb3V0cHV0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuYmxvY2tzW3Rva2VuLmJsb2NrXSA9IGJsb2NrX291dHB1dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5vcmlnaW5hbEJsb2NrVG9rZW5zW3Rva2VuLmJsb2NrXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0b2tlbi50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiB0b2tlbi5ibG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IHRva2VuLm91dHB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyd3JpdGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGEgY2hpbGQgYmxvY2sgaGFzIGJlZW4gc2V0IGZyb20gYSB0ZW1wbGF0ZSBleHRlbmRpbmcgdGhpcyBvbmUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmNoaWxkLmJsb2Nrc1t0b2tlbi5ibG9ja10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoYXQuY2hpbGQuYmxvY2tzW3Rva2VuLmJsb2NrXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoYXQuYmxvY2tzW3Rva2VuLmJsb2NrXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEJsb2NrIHNob3J0aGFuZCBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgYmxvY2sgdGl0bGUgZXhwcmVzc2lvbiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuc2hvcnRibG9jayxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmJsb2NrXFxzKyhbYS16QS1aMC05X10rKVxccysoLispJC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4uZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzJdLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIHRva2VuLm91dHB1dCA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRva2VuLmV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9KS5zdGFjaztcblxuICAgICAgICAgICAgICAgIHRva2VuLmJsb2NrID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKSwgYXJnc19pID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB3aGlsZShhcmdzX2ktLSA+IDApIGFyZ3NbYXJnc19pXSA9IGFyZ3VtZW50c1thcmdzX2ldO1xuICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmxvZ2ljLmhhbmRsZXJbVHdpZy5sb2dpYy50eXBlLmJsb2NrXS5wYXJzZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgYmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIGVuZGJsb2NrICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbmRibG9jayxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVuZGJsb2NrKD86XFxzKyhbYS16QS1aMC05X10rKSk/JC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEJsb2NrIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSBleHRlbmRzIFwidGVtcGxhdGUudHdpZ1wiICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5leHRlbmRzXyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmV4dGVuZHNcXHMrKC4rKSQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gdG9rZW4ubWF0Y2hbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5tYXRjaDtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN0YWNrICAgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBpbm5lckNvbnRleHQgPSBUd2lnLkNoaWxkQ29udGV4dChjb250ZXh0KTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZmlsZW5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5zdGFjaywgY29udGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBwYXJlbnQgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5leHRlbmQgPSBmaWxlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVHdpZy5UZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBmaWxlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW1wb3J0IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGhhdC5pbXBvcnRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyIHRoZSB0ZW1wbGF0ZSBpbiBjYXNlIGl0IHB1dHMgYW55dGhpbmcgaW4gaXRzIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlbmRlckFzeW5jKGlubmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRXh0ZW5kIHRoZSBwYXJlbnQgY29udGV4dCB3aXRoIHRoZSBleHRlbmRlZCBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIFR3aWcubGliLmV4dGVuZChjb250ZXh0LCBpbm5lckNvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6ICcnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmxvY2sgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqICBGb3JtYXQ6IHslIHVzZSBcInRlbXBsYXRlLnR3aWdcIiAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUudXNlLFxuICAgICAgICAgICAgcmVnZXg6IC9edXNlXFxzKyguKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9KS5zdGFjaztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHRva2VuLCBjb250ZXh0LCBjaGFpbikge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgZmlsZW5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5zdGFjaywgY29udGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBibG9ja3NcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pbXBvcnRCbG9ja3MoZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogJydcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCbG9jayBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgaW5jbHVkZXMgXCJ0ZW1wbGF0ZS50d2lnXCIgW3dpdGgge3NvbWU6ICd2YWx1ZXMnfSBvbmx5XSAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuaW5jbHVkZSxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmluY2x1ZGVcXHMrKC4rPykoPzpcXHN8JCkoaWdub3JlIG1pc3NpbmcoPzpcXHN8JCkpPyg/OndpdGhcXHMrKFtcXFNcXHNdKz8pKT8oPzpcXHN8JCkob25seSk/JC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdG9rZW4ubWF0Y2gsXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBtYXRjaFsxXS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZU1pc3NpbmcgPSBtYXRjaFsyXSAhPT0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ29udGV4dCA9IG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICBvbmx5ID0gKChtYXRjaFs0XSAhPT0gdW5kZWZpbmVkKSAmJiBtYXRjaFs0XS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4ub25seSA9IG9ubHk7XG4gICAgICAgICAgICAgICAgdG9rZW4uaWdub3JlTWlzc2luZyA9IGlnbm9yZU1pc3Npbmc7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICB9KS5zdGFjaztcblxuICAgICAgICAgICAgICAgIGlmICh3aXRoQ29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLndpdGhTdGFjayA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogIFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogd2l0aENvbnRleHQudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIH0pLnN0YWNrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24gbG9naWNUeXBlSW5jbHVkZSh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQ29udGV4dCA9IHRva2VuLm9ubHkgPyB7fSA6IFR3aWcuQ2hpbGRDb250ZXh0KGNvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICBpZ25vcmVNaXNzaW5nID0gdG9rZW4uaWdub3JlTWlzc2luZyxcbiAgICAgICAgICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7IGNoYWluOiBjaGFpbiwgb3V0cHV0OiAnJyB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbi53aXRoU3RhY2sgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLndpdGhTdGFjaywgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24od2l0aENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcubGliLmV4dGVuZChpbm5lckNvbnRleHQsIHdpdGhDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IFR3aWcuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuZXhwcmVzc2lvbi5wYXJzZUFzeW5jLmNhbGwodGhhdCwgdG9rZW4uc3RhY2ssIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gbG9naWNUeXBlSW5jbHVkZUltcG9ydChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVHdpZy5UZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbGUucmVuZGVyQXN5bmMoaW5uZXJDb250ZXh0LCB7IGlzSW5jbHVkZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdC5pbXBvcnRGaWxlKGZpbGUpLnJlbmRlckFzeW5jKGlubmVyQ29udGV4dCwgeyBpc0luY2x1ZGU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWdub3JlTWlzc2luZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gc2xvd0xvZ2ljUmV0dXJuKG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0ICE9PSAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5vdXRwdXQgPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLnNwYWNlbGVzcyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXnNwYWNlbGVzcyQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRzcGFjZWxlc3NcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuXG4gICAgICAgICAgICAvLyBQYXJzZSB0aGUgaHRtbCBhbmQgcmV0dXJuIGl0IHdpdGhvdXQgYW55IHNwYWNlcyBiZXR3ZWVuIHRhZ3NcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgLy8gUGFyc2UgdGhlIG91dHB1dCB3aXRob3V0IGFueSBmaWx0ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5wYXJzZUFzeW5jLmNhbGwodGhpcywgdG9rZW4ub3V0cHV0LCBjb250ZXh0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHVuZmlsdGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIC8vIEEgcmVndWxhciBleHByZXNzaW9uIHRvIGZpbmQgY2xvc2luZyBhbmQgb3BlbmluZyB0YWdzIHdpdGggc3BhY2VzIGJldHdlZW4gdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgckJldHdlZW5UYWdTcGFjZXMgPSAvPlxccys8L2csXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIGFsbCBzcGFjZSBiZXR3ZWVuIGNsb3NpbmcgYW5kIG9wZW5pbmcgaHRtbCB0YWdzXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSB1bmZpbHRlcmVkLnJlcGxhY2UockJldHdlZW5UYWdTcGFjZXMsJz48JykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV3cmFwIG91dHB1dCBhcyBhIFR3aWcuTWFya3VwXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBUd2lnLk1hcmt1cChvdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW46IGNoYWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBZGQgdGhlIHslIGVuZHNwYWNlbGVzcyAlfSB0b2tlblxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW5kc3BhY2VsZXNzLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kc3BhY2VsZXNzJC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1hY3JvIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBGb3JtYXQ6IHslIG1hY3JvIGlucHV0KG5hbWUgPSBkZWZhdWx0LCB2YWx1ZSwgdHlwZSwgc2l6ZSkgJX1cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5tYWNybyxcbiAgICAgICAgICAgIHJlZ2V4OiAvXm1hY3JvXFxzKyhbYS16QS1aMC05X10rKVxccypcXChcXHMqKCg/OlthLXpBLVowLTlfXSsoPzpcXHMqPVxccyooW1xcc1xcU10rKSk/KD86LFxccyopPykqKVxccypcXCkkLyxcbiAgICAgICAgICAgIG5leHQ6IFtcbiAgICAgICAgICAgICAgICBUd2lnLmxvZ2ljLnR5cGUuZW5kbWFjcm9cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hY3JvTmFtZSA9IHRva2VuLm1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICByYXdQYXJhbWV0ZXJzID0gdG9rZW4ubWF0Y2hbMl0uc3BsaXQoL1xccyosXFxzKi8pLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzID0gcmF3UGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHJhd1BhcmFtZXRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJhd1BhcmFtZXRlci5zcGxpdCgvXFxzKj1cXHMqLylbMF07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQ291bnQgPSBwYXJhbWV0ZXJzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBjaGVja1xuICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnNDb3VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlciA9IHBhcmFtZXRlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuaXFbcGFyYW1ldGVyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXFbcGFyYW1ldGVyXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiRHVwbGljYXRlIGFyZ3VtZW50cyBmb3IgcGFyYW1ldGVyOiBcIiArIHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5tYWNyb05hbWUgPSBtYWNyb05hbWU7XG4gICAgICAgICAgICAgICAgdG9rZW4ucGFyYW1ldGVycyA9IHBhcmFtZXRlcnM7XG4gICAgICAgICAgICAgICAgdG9rZW4uZGVmYXVsdHMgPSByYXdQYXJhbWV0ZXJzLnJlZHVjZShmdW5jdGlvbiAoZGVmYXVsdHMsIHJhd1BhcmFtZXRlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHJhd1BhcmFtZXRlci5zcGxpdCgvXFxzKj1cXHMqLyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBwYWlyWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHBhaXJbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHNba2V5XSA9IFR3aWcuZXhwcmVzc2lvbi5jb21waWxlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnN0YWNrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHNba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLm1hY3Jvc1t0b2tlbi5tYWNyb05hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgZ2xvYmFsIGNvbnRleHQgYW5kIG90aGVyIG1hY3Jvc1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWFjcm9Db250ZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGY6IHRlbXBsYXRlLm1hY3Jvc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGFyZ3VtZW50c1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuYXN5bmMuZm9yRWFjaCh0b2tlbi5wYXJhbWV0ZXJzLCBmdW5jdGlvbiAocHJvcCwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHBhcmFtZXRlcnMgZnJvbSBjb250ZXh0IHRvIG1hY3JvQ29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvQ29udGV4dFtwcm9wXSA9IGFyZ3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0b2tlbi5kZWZhdWx0c1twcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5kZWZhdWx0c1twcm9wXSwgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvQ29udGV4dFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWNyb0NvbnRleHRbcHJvcF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVuZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5wYXJzZUFzeW5jLmNhbGwodGVtcGxhdGUsIHRva2VuLm91dHB1dCwgbWFjcm9Db250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiAnJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbmQgbWFjcm8gbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEZvcm1hdDogeyUgZW5kbWFjcm8gJX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbmRtYWNybyxcbiAgICAgICAgICAgICByZWdleDogL15lbmRtYWNybyQvLFxuICAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgKiBpbXBvcnQgbG9naWMgdG9rZW5zLlxuICAgICAgICAgICAgKlxuICAgICAgICAgICAgKiBGb3JtYXQ6IHslIGltcG9ydCBcInRlbXBsYXRlLnR3aWdcIiBhcyBmb3JtICV9XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmltcG9ydF8sXG4gICAgICAgICAgICByZWdleDogL15pbXBvcnRcXHMrKC4rKVxccythc1xccysoW2EtekEtWjAtOV9dKykkLyxcbiAgICAgICAgICAgIG5leHQ6IFsgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHRva2VuLm1hdGNoWzFdLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dE5hbWUgPSB0b2tlbi5tYXRjaFsyXS50cmltKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgdG9rZW4uY29udGV4dE5hbWUgPSBjb250ZXh0TmFtZTtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN0YWNrID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuY2FsbCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHsgY2hhaW46IGNoYWluLCBvdXRwdXQ6ICcnIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZXhwcmVzc2lvbiA9PT0gJ19zZWxmJykge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0W3Rva2VuLmNvbnRleHROYW1lXSA9IHRoaXMubWFjcm9zO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5Qcm9taXNlLnJlc29sdmUob3V0cHV0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi5zdGFjaywgY29udGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGF0LmltcG9ydEZpbGUoZmlsZSB8fCB0b2tlbi5leHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbdG9rZW4uY29udGV4dE5hbWVdID0gdGVtcGxhdGUucmVuZGVyQXN5bmMoe30sIHtvdXRwdXQ6ICdtYWNyb3MnfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogZnJvbSBsb2dpYyB0b2tlbnMuXG4gICAgICAgICAgICAqXG4gICAgICAgICAgICAqIEZvcm1hdDogeyUgZnJvbSBcInRlbXBsYXRlLnR3aWdcIiBpbXBvcnQgZnVuYyBhcyBmb3JtICV9XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgdHlwZTogVHdpZy5sb2dpYy50eXBlLmZyb20sXG4gICAgICAgICAgICByZWdleDogL15mcm9tXFxzKyguKylcXHMraW1wb3J0XFxzKyhbYS16QS1aMC05XywgXSspJC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSB0b2tlbi5tYXRjaFsxXS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIG1hY3JvRXhwcmVzc2lvbnMgPSB0b2tlbi5tYXRjaFsyXS50cmltKCkuc3BsaXQoL1xccyosXFxzKi8pLFxuICAgICAgICAgICAgICAgICAgICBtYWNyb05hbWVzID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bWFjcm9FeHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzID0gbWFjcm9FeHByZXNzaW9uc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCBmdW5jdGlvbiBhcyB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICB2YXIgbWFjcm9NYXRjaCA9IHJlcy5tYXRjaCgvXihbYS16QS1aMC05X10rKVxccythc1xccysoW2EtekEtWjAtOV9dKykkLyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWNyb01hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWNyb05hbWVzW21hY3JvTWF0Y2hbMV0udHJpbSgpXSA9IG1hY3JvTWF0Y2hbMl0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcy5tYXRjaCgvXihbYS16QS1aMC05X10rKSQvKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFjcm9OYW1lc1tyZXNdID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIGltcG9ydFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICB0b2tlbi5tYWNyb05hbWVzID0gbWFjcm9OYW1lcztcblxuICAgICAgICAgICAgICAgIHRva2VuLnN0YWNrID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuY2FsbCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFR3aWcuZXhwcmVzc2lvbi50eXBlLmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSkuc3RhY2s7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBUd2lnLlByb21pc2UucmVzb2x2ZSh0aGlzLm1hY3Jvcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZXhwcmVzc2lvbiAhPT0gXCJfc2VsZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLnN0YWNrLCBjb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdC5pbXBvcnRGaWxlKGZpbGUgfHwgdG9rZW4uZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVuZGVyQXN5bmMoe30sIHtvdXRwdXQ6ICdtYWNyb3MnfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obWFjcm9zKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG1hY3JvTmFtZSBpbiB0b2tlbi5tYWNyb05hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFjcm9zLmhhc093blByb3BlcnR5KG1hY3JvTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0W3Rva2VuLm1hY3JvTmFtZXNbbWFjcm9OYW1lXV0gPSBtYWNyb3NbbWFjcm9OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZW1iZWQgdGFnIGNvbWJpbmVzIHRoZSBiZWhhdmlvdXIgb2YgaW5jbHVkZSBhbmQgZXh0ZW5kcy5cbiAgICAgICAgICAgICAqIEl0IGFsbG93cyB5b3UgdG8gaW5jbHVkZSBhbm90aGVyIHRlbXBsYXRlJ3MgY29udGVudHMsIGp1c3QgbGlrZSBpbmNsdWRlIGRvZXMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogIEZvcm1hdDogeyUgZW1iZWQgXCJ0ZW1wbGF0ZS50d2lnXCIgW3dpdGgge3NvbWU6ICd2YWx1ZXMnfSBvbmx5XSAlfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0eXBlOiBUd2lnLmxvZ2ljLnR5cGUuZW1iZWQsXG4gICAgICAgICAgICByZWdleDogL15lbWJlZFxccysoLis/KSg/OlxccysoaWdub3JlIG1pc3NpbmcpKT8oPzpcXHMrd2l0aFxccysoW1xcU1xcc10rPykpPyg/Olxccysob25seSkpPyQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmRlbWJlZFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0b2tlbi5tYXRjaCxcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IG1hdGNoWzFdLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgaWdub3JlTWlzc2luZyA9IG1hdGNoWzJdICE9PSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgIG9ubHkgPSAoKG1hdGNoWzRdICE9PSB1bmRlZmluZWQpICYmIG1hdGNoWzRdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4ubWF0Y2g7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5vbmx5ID0gb25seTtcbiAgICAgICAgICAgICAgICB0b2tlbi5pZ25vcmVNaXNzaW5nID0gaWdub3JlTWlzc2luZztcblxuICAgICAgICAgICAgICAgIHRva2VuLnN0YWNrID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuY2FsbCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIH0pLnN0YWNrO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdpdGhDb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4ud2l0aFN0YWNrID0gVHdpZy5leHByZXNzaW9uLmNvbXBpbGUuY2FsbCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAgVHdpZy5leHByZXNzaW9uLnR5cGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB3aXRoQ29udGV4dC50cmltKClcbiAgICAgICAgICAgICAgICAgICAgfSkuc3RhY2s7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodG9rZW4sIGNvbnRleHQsIGNoYWluKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBmaWxlbmFtZVxuICAgICAgICAgICAgICAgIHZhciBpbm5lckNvbnRleHQgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gVHdpZy5Qcm9taXNlLnJlc29sdmUoKTtcblxuICAgICAgICAgICAgICAgIGlmICghdG9rZW4ub25seSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgaW4gY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuaGFzT3duUHJvcGVydHkoaSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJDb250ZXh0W2ldID0gY29udGV4dFtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi53aXRoU3RhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gVHdpZy5leHByZXNzaW9uLnBhcnNlQXN5bmMuY2FsbCh0aGlzLCB0b2tlbi53aXRoU3RhY2ssIGNvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHdpdGhDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgaW4gd2l0aENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2l0aENvbnRleHQuaGFzT3duUHJvcGVydHkoaSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyQ29udGV4dFtpXSA9IHdpdGhDb250ZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBbGxvdyB0aGlzIGZ1bmN0aW9uIHRvIGJlIGNsZWFuZWQgdXAgZWFybHlcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoYXQsIHRva2VuLnN0YWNrLCBpbm5lckNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFR3aWcuVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEltcG9ydCBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGhhdC5pbXBvcnRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLmlnbm9yZU1pc3NpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9ycyBwcmVzZXJ2ZSByZWZlcmVuY2VzIHRvIHZhcmlhYmxlcyBpbiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHJlbW92ZXMgYHRoaXNgIGZyb20gdGhlIHNjb3BlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgcHJldmlvdXMgYmxvY2tzXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2Jsb2NrcyA9IFR3aWcubGliLmNvcHkodGhhdC5ibG9ja3MpO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXNldCBwcmV2aW91cyBibG9ja3NcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ibG9ja3MgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSB0b2tlbnMuIG91dHB1dCB3aWxsIGJlIG5vdCB1c2VkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLnBhcnNlQXN5bmMuY2FsbCh0aGF0LCB0b2tlbi5vdXRwdXQsIGlubmVyQ29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW5kZXIgdGVtcGFsdGUgd2l0aCBibG9ja3MgZGVmaW5lZCBpbiBlbWJlZCBibG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlbmRlckFzeW5jKGlubmVyQ29udGV4dCwgeydibG9ja3MnOiB0aGF0LmJsb2Nrc30pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN0b3JlIHByZXZpb3VzIGJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmJsb2NrcyA9IFR3aWcubGliLmNvcHkodGhhdC5fYmxvY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qIEFkZCB0aGUgeyUgZW5kZW1iZWQgJX0gdG9rZW5cbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbmRlbWJlZCxcbiAgICAgICAgICAgIHJlZ2V4OiAvXmVuZGVtYmVkJC8sXG4gICAgICAgICAgICBuZXh0OiBbIF0sXG4gICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEJsb2NrIGxvZ2ljIHRva2Vucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiAgRm9ybWF0OiB7JSB3aXRoIHtzb21lOiAndmFsdWVzJ30gW29ubHldICV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZVsnd2l0aCddLFxuICAgICAgICAgICAgcmVnZXg6IC9eKD86d2l0aFxccysoW1xcU1xcc10rPykpKD86XFxzfCQpKG9ubHkpPyQvLFxuICAgICAgICAgICAgbmV4dDogW1xuICAgICAgICAgICAgICAgIFR3aWcubG9naWMudHlwZS5lbmR3aXRoXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRva2VuLm1hdGNoLFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ29udGV4dCA9IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICBvbmx5ID0gKChtYXRjaFsyXSAhPT0gdW5kZWZpbmVkKSAmJiBtYXRjaFsyXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLm1hdGNoO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4ub25seSA9IG9ubHk7XG5cbiAgICAgICAgICAgICAgICBpZiAod2l0aENvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi53aXRoU3RhY2sgPSBUd2lnLmV4cHJlc3Npb24uY29tcGlsZS5jYWxsKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICBUd2lnLmV4cHJlc3Npb24udHlwZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHdpdGhDb250ZXh0LnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICB9KS5zdGFjaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQ29udGV4dCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IFR3aWcuUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuLm9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJDb250ZXh0ID0gVHdpZy5DaGlsZENvbnRleHQoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLndpdGhTdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYy5jYWxsKHRoaXMsIHRva2VuLndpdGhTdGFjaywgY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24od2l0aENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiB3aXRoQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXRoQ29udGV4dC5oYXNPd25Qcm9wZXJ0eShpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJDb250ZXh0W2ldID0gd2l0aENvbnRleHRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUd2lnLnBhcnNlQXN5bmMuY2FsbCh0aGF0LCB0b2tlbi5vdXRwdXQsIGlubmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWluOiBjaGFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS5lbmR3aXRoLFxuICAgICAgICAgICAgcmVnZXg6IC9eZW5kd2l0aCQvLFxuICAgICAgICAgICAgbmV4dDogWyBdLFxuICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgfVxuXG4gICAgXTtcblxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0cnkgZm9yIGxvZ2ljIGhhbmRsZXJzLlxuICAgICAqL1xuICAgIFR3aWcubG9naWMuaGFuZGxlciA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIGEgbmV3IHRva2VuIHR5cGUsIGF2YWlsYWJsZSBhdCBUd2lnLmxvZ2ljLnR5cGUue3R5cGV9XG4gICAgICovXG4gICAgVHdpZy5sb2dpYy5leHRlbmRUeXBlID0gZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUgfHwgKFwiVHdpZy5sb2dpYy50eXBlXCIgKyB0eXBlKTtcbiAgICAgICAgVHdpZy5sb2dpYy50eXBlW3R5cGVdID0gdmFsdWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4dGVuZCB0aGUgbG9naWMgcGFyc2luZyBmdW5jdGlvbmFsaXR5IHdpdGggYSBuZXcgdG9rZW4gZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIC8vIERlZmluZSBhIG5ldyB0YWdcbiAgICAgKiBUd2lnLmxvZ2ljLmV4dGVuZCh7XG4gICAgICogICAgIHR5cGU6IFR3aWcubG9naWMudHlwZS57dHlwZX0sXG4gICAgICogICAgIC8vIFRoZSBwYXR0ZXJuIHRvIG1hdGNoIGZvciB0aGlzIHRva2VuXG4gICAgICogICAgIHJlZ2V4OiAuLi4sXG4gICAgICogICAgIC8vIFdoYXQgdG9rZW4gdHlwZXMgY2FuIGZvbGxvdyB0aGlzIHRva2VuLCBsZWF2ZSBibGFuayBpZiBhbnkuXG4gICAgICogICAgIG5leHQ6IFsgLi4uIF1cbiAgICAgKiAgICAgLy8gQ3JlYXRlIGFuZCByZXR1cm4gY29tcGlsZWQgdmVyc2lvbiBvZiB0aGUgdG9rZW5cbiAgICAgKiAgICAgY29tcGlsZTogZnVuY3Rpb24odG9rZW4pIHsgLi4uIH1cbiAgICAgKiAgICAgLy8gUGFyc2UgdGhlIGNvbXBpbGVkIHRva2VuIHdpdGggdGhlIGNvbnRleHQgcHJvdmlkZWQgYnkgdGhlIHJlbmRlciBjYWxsXG4gICAgICogICAgIC8vICAgYW5kIHdoZXRoZXIgdGhpcyB0b2tlbiBjaGFpbiBpcyBjb21wbGV0ZS5cbiAgICAgKiAgICAgcGFyc2U6IGZ1bmN0aW9uKHRva2VuLCBjb250ZXh0LCBjaGFpbikgeyAuLi4gfVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gVGhlIG5ldyBsb2dpYyBleHByZXNzaW9uLlxuICAgICAqL1xuICAgIFR3aWcubG9naWMuZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcblxuICAgICAgICBpZiAoIWRlZmluaXRpb24udHlwZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gZXh0ZW5kIGxvZ2ljIGRlZmluaXRpb24uIE5vIHR5cGUgcHJvdmlkZWQgZm9yIFwiICsgZGVmaW5pdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUd2lnLmxvZ2ljLmV4dGVuZFR5cGUoZGVmaW5pdGlvbi50eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBUd2lnLmxvZ2ljLmhhbmRsZXJbZGVmaW5pdGlvbi50eXBlXSA9IGRlZmluaXRpb247XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCB3aXRoIGJ1aWx0LWluIGV4cHJlc3Npb25zXG4gICAgd2hpbGUgKFR3aWcubG9naWMuZGVmaW5pdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBUd2lnLmxvZ2ljLmV4dGVuZChUd2lnLmxvZ2ljLmRlZmluaXRpb25zLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBpbGUgYSBsb2dpYyB0b2tlbiBpbnRvIGFuIG9iamVjdCByZWFkeSBmb3IgcGFyc2luZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByYXdfdG9rZW4gQW4gdW5jb21waWxlZCBsb2dpYyB0b2tlbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBjb21waWxlZCBsb2dpYyB0b2tlbiwgcmVhZHkgZm9yIHBhcnNpbmcuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYy5jb21waWxlID0gZnVuY3Rpb24gKHJhd190b2tlbikge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHJhd190b2tlbi52YWx1ZS50cmltKCksXG4gICAgICAgICAgICB0b2tlbiA9IFR3aWcubG9naWMudG9rZW5pemUuY2FsbCh0aGlzLCBleHByZXNzaW9uKSxcbiAgICAgICAgICAgIHRva2VuX3RlbXBsYXRlID0gVHdpZy5sb2dpYy5oYW5kbGVyW3Rva2VuLnR5cGVdO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSB0b2tlbiBuZWVkcyBjb21waWxpbmdcbiAgICAgICAgaWYgKHRva2VuX3RlbXBsYXRlLmNvbXBpbGUpIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5fdGVtcGxhdGUuY29tcGlsZS5jYWxsKHRoaXMsIHRva2VuKTtcbiAgICAgICAgICAgIFR3aWcubG9nLnRyYWNlKFwiVHdpZy5sb2dpYy5jb21waWxlOiBcIiwgXCJDb21waWxlZCBsb2dpYyB0b2tlbiB0byBcIiwgdG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUb2tlbml6ZSBsb2dpYyBleHByZXNzaW9ucy4gVGhpcyBmdW5jdGlvbiBtYXRjaGVzIHRva2VuIGV4cHJlc3Npb25zIGFnYWluc3QgcmVndWxhclxuICAgICAqIGV4cHJlc3Npb25zIHByb3ZpZGVkIGluIHRva2VuIGRlZmluaXRpb25zIHByb3ZpZGVkIHdpdGggVHdpZy5sb2dpYy5leHRlbmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwcmVzc2lvbiB0aGUgbG9naWMgdG9rZW4gZXhwcmVzc2lvbiB0byB0b2tlbml6ZVxuICAgICAqICAgICAgICAgICAgICAgIChpLmUuIHdoYXQncyBiZXR3ZWVuIHslIGFuZCAlfSlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG1hdGNoZWQgdG9rZW4gd2l0aCB0eXBlIHNldCB0byB0aGUgdG9rZW4gdHlwZSBhbmQgbWF0Y2ggdG8gdGhlIHJlZ2V4IG1hdGNoLlxuICAgICAqL1xuICAgIFR3aWcubG9naWMudG9rZW5pemUgPSBmdW5jdGlvbiAoZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgdG9rZW5fdGVtcGxhdGVfdHlwZSA9IG51bGwsXG4gICAgICAgICAgICB0b2tlbl90eXBlID0gbnVsbCxcbiAgICAgICAgICAgIHRva2VuX3JlZ2V4ID0gbnVsbCxcbiAgICAgICAgICAgIHJlZ2V4X2FycmF5ID0gbnVsbCxcbiAgICAgICAgICAgIHJlZ2V4X2xlbiA9IG51bGwsXG4gICAgICAgICAgICByZWdleF9pID0gbnVsbCxcbiAgICAgICAgICAgIHJlZ2V4ID0gbnVsbCxcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbDtcblxuICAgICAgICAvLyBJZ25vcmUgd2hpdGVzcGFjZSBhcm91bmQgZXhwcmVzc2lvbnMuXG4gICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcblxuICAgICAgICBmb3IgKHRva2VuX3RlbXBsYXRlX3R5cGUgaW4gVHdpZy5sb2dpYy5oYW5kbGVyKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHR5cGUgYW5kIHJlZ2V4IGZvciB0aGlzIHRlbXBsYXRlIHR5cGVcbiAgICAgICAgICAgIHRva2VuX3R5cGUgPSBUd2lnLmxvZ2ljLmhhbmRsZXJbdG9rZW5fdGVtcGxhdGVfdHlwZV0udHlwZTtcbiAgICAgICAgICAgIHRva2VuX3JlZ2V4ID0gVHdpZy5sb2dpYy5oYW5kbGVyW3Rva2VuX3RlbXBsYXRlX3R5cGVdLnJlZ2V4O1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgbXVsdGlwbGUgcmVndWxhciBleHByZXNzaW9ucyBwZXIgdHlwZS5cbiAgICAgICAgICAgIHJlZ2V4X2FycmF5ID0gdG9rZW5fcmVnZXg7XG4gICAgICAgICAgICBpZiAoIVR3aWcubGliLmlzQXJyYXkodG9rZW5fcmVnZXgpKVxuICAgICAgICAgICAgICAgIHJlZ2V4X2FycmF5ID0gW3Rva2VuX3JlZ2V4XTtcblxuICAgICAgICAgICAgcmVnZXhfbGVuID0gcmVnZXhfYXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgLy8gQ2hlY2sgcmVndWxhciBleHByZXNzaW9ucyBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIHNwZWNpZmllZCBpbiB0aGUgZGVmaW5pdGlvbi5cbiAgICAgICAgICAgIGZvciAocmVnZXhfaSA9IDA7IHJlZ2V4X2kgPCByZWdleF9sZW47IHJlZ2V4X2krKykge1xuICAgICAgICAgICAgICAgIG1hdGNoID0gcmVnZXhfYXJyYXlbcmVnZXhfaV0uZXhlYyhleHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgVHdpZy5sb2cudHJhY2UoXCJUd2lnLmxvZ2ljLnRva2VuaXplOiBcIiwgXCJNYXRjaGVkIGEgXCIsIHRva2VuX3R5cGUsIFwiIHJlZ3VsYXIgZXhwcmVzc2lvbiBvZiBcIiwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdG9rZW5fdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoOiBtYXRjaFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHJlZ2V4IG1hdGNoZXNcbiAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgJ1wiICsgZXhwcmVzc2lvbi50cmltKCkgKyBcIidcIik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgbG9naWMgdG9rZW4gd2l0aGluIGEgZ2l2ZW4gY29udGV4dC5cbiAgICAgKlxuICAgICAqIFdoYXQgYXJlIGxvZ2ljIGNoYWlucz9cbiAgICAgKiAgICAgIExvZ2ljIGNoYWlucyByZXByZXNlbnQgYSBzZXJpZXMgb2YgdG9rZW5zIHRoYXQgYXJlIGNvbm5lY3RlZCxcbiAgICAgKiAgICAgICAgICBmb3IgZXhhbXBsZTpcbiAgICAgKiAgICAgICAgICB7JSBpZiAuLi4gJX0geyUgZWxzZSAlfSB7JSBlbmRpZiAlfVxuICAgICAqXG4gICAgICogICAgICBUaGUgY2hhaW4gcGFyYW1ldGVyIGlzIHVzZWQgdG8gc2lnbmlmeSBpZiBhIGNoYWluIGlzIG9wZW4gb2YgY2xvc2VkLlxuICAgICAqICAgICAgb3BlbjpcbiAgICAgKiAgICAgICAgICBNb3JlIHRva2VucyBpbiB0aGlzIGNoYWluIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgICogICAgICBjbG9zZWQ6XG4gICAgICogICAgICAgICAgVGhpcyB0b2tlbiBjaGFpbiBoYXMgY29tcGxldGVkIHBhcnNpbmcgYW5kIGFueSBhZGRpdGlvbmFsXG4gICAgICogICAgICAgICAgdG9rZW5zIChlbHNlLCBlbHNlaWYsIGV0Yy4uLikgc2hvdWxkIGJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gVGhlIGNvbXBpbGVkIHRva2VuLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IFRoZSByZW5kZXIgY29udGV4dC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoYWluIElzIHRoaXMgYW4gb3BlbiBsb2dpYyBjaGFpbi4gSWYgZmFsc2UsIHRoYXQgbWVhbnMgYVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW4gaXMgY2xvc2VkIGFuZCBubyBmdXJ0aGVyIGNhc2VzIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgICovXG4gICAgVHdpZy5sb2dpYy5wYXJzZSA9IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4sIGFsbG93X2FzeW5jKSB7XG4gICAgICAgIHJldHVybiBUd2lnLmFzeW5jLnBvdGVudGlhbGx5QXN5bmModGhpcywgYWxsb3dfYXN5bmMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdpZy5sb2cuZGVidWcoXCJUd2lnLmxvZ2ljLnBhcnNlOiBcIiwgXCJQYXJzaW5nIGxvZ2ljIHRva2VuIFwiLCB0b2tlbik7XG5cbiAgICAgICAgICAgIHZhciB0b2tlbl90ZW1wbGF0ZSA9IFR3aWcubG9naWMuaGFuZGxlclt0b2tlbi50eXBlXSxcbiAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgdGhhdCA9IHRoaXM7XG5cblxuICAgICAgICAgICAgaWYgKCF0b2tlbl90ZW1wbGF0ZS5wYXJzZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG5cbiAgICAgICAgICAgIHRoYXQucGFyc2VTdGFjay51bnNoaWZ0KHRva2VuKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRva2VuX3RlbXBsYXRlLnBhcnNlLmNhbGwodGhhdCwgdG9rZW4sIGNvbnRleHQgfHwge30sIGNoYWluKTtcblxuICAgICAgICAgICAgaWYgKFR3aWcuaXNQcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQucGFyc2VTdGFjay5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC5wYXJzZVN0YWNrLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHdpZztcblxufTtcblxuXG4vKioqLyB9KSxcbi8qIDI0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVHdpZykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIFR3aWcuVGVtcGxhdGVzLnJlZ2lzdGVyUGFyc2VyKCdzb3VyY2UnLCBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5kYXRhIHx8ICcnO1xuICAgIH0pO1xufTtcblxuXG4vKioqLyB9KSxcbi8qIDI1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVHdpZykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIFR3aWcuVGVtcGxhdGVzLnJlZ2lzdGVyUGFyc2VyKCd0d2lnJywgZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHdpZy5UZW1wbGF0ZShwYXJhbXMpO1xuICAgIH0pO1xufTtcblxuXG4vKioqLyB9KSxcbi8qIDI2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8vICMjIHR3aWcucGF0aC5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIHBhdGggcGFyc2luZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVHdpZykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogTmFtZXNwYWNlIGZvciBwYXRoIGhhbmRsaW5nLlxuICAgICAqL1xuICAgIFR3aWcucGF0aCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIGNhbm9uaWNhbCB2ZXJzaW9uIG9mIGEgdXJsIGJhc2VkIG9uIHRoZSBnaXZlbiBiYXNlIHBhdGggYW5kIGZpbGUgcGF0aCBhbmQgaW5cbiAgICAgKiB0aGUgcHJldmlvdXNseSByZWdpc3RlcmVkIG5hbWVzcGFjZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRlbXBsYXRlIFRoZSBUd2lnIFRlbXBsYXRlXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBfZmlsZSAgICBUaGUgZmlsZSBwYXRoLCBtYXkgYmUgcmVsYXRpdmUgYW5kIG1heSBjb250YWluIG5hbWVzcGFjZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgIFRoZSBjYW5vbmljYWwgdmVyc2lvbiBvZiB0aGUgcGF0aFxuICAgICAqL1xuICAgIFR3aWcucGF0aC5wYXJzZVBhdGggPSBmdW5jdGlvbiAodGVtcGxhdGUsIF9maWxlKSB7XG4gICAgICAgIHZhciBrID0gbnVsbCxcbiAgICAgICAgICAgIG5hbWVzcGFjZXMgPSB0ZW1wbGF0ZS5vcHRpb25zLm5hbWVzcGFjZXMsXG4gICAgICAgICAgICBmaWxlID0gX2ZpbGUgfHwgXCJcIixcbiAgICAgICAgICAgIGhhc05hbWVzcGFjZXMgPSBuYW1lc3BhY2VzICYmIHR5cGVvZiBuYW1lc3BhY2VzID09PSBcIm9iamVjdFwiO1xuXG4gICAgICAgIGlmIChoYXNOYW1lc3BhY2VzKSB7XG4gICAgICAgICAgICBmb3IgKGsgaW4gbmFtZXNwYWNlcykge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYga2V5ZWQgbmFtZXNwYWNlIGV4aXN0cyBhdCBwYXRoJ3Mgc3RhcnRcbiAgICAgICAgICAgICAgICB2YXIgY29sb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgayArIFwiOjpcIik7XG4gICAgICAgICAgICAgICAgdmFyIGF0U2lnbiA9IG5ldyBSZWdFeHAoXCJeQFwiICsgayArIFwiL1wiKTtcbiAgICAgICAgICAgICAgICAvLyBhZGQgc2xhc2ggdG8gdGhlIGVuZCBvZiBwYXRoXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZVBhdGggPSBuYW1lc3BhY2VzW2tdLnJlcGxhY2UoLyhbXlxcL10pJC8sIFwiJDEvXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbG9uLnRlc3QoZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IGZpbGUucmVwbGFjZShjb2xvbiwgbmFtZXNwYWNlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXRTaWduLnRlc3QoZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IGZpbGUucmVwbGFjZShhdFNpZ24sIG5hbWVzcGFjZVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVHdpZy5wYXRoLnJlbGF0aXZlUGF0aCh0ZW1wbGF0ZSwgZmlsZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSByZWxhdGl2ZSBjYW5vbmljYWwgdmVyc2lvbiBvZiBhIHVybCBiYXNlZCBvbiB0aGUgZ2l2ZW4gYmFzZSBwYXRoIGFuZCBmaWxlIHBhdGguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1R3aWcuVGVtcGxhdGV9IHRlbXBsYXRlIFRoZSBUd2lnLlRlbXBsYXRlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBfZmlsZSBUaGUgZmlsZSBwYXRoLCByZWxhdGl2ZSB0byB0aGUgYmFzZSBwYXRoLlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgY2Fub25pY2FsIHZlcnNpb24gb2YgdGhlIHBhdGguXG4gICAgICovXG4gICAgVHdpZy5wYXRoLnJlbGF0aXZlUGF0aCA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgX2ZpbGUpIHtcbiAgICAgICAgdmFyIGJhc2UsXG4gICAgICAgICAgICBiYXNlX3BhdGgsXG4gICAgICAgICAgICBzZXBfY2hyID0gXCIvXCIsXG4gICAgICAgICAgICBuZXdfcGF0aCA9IFtdLFxuICAgICAgICAgICAgZmlsZSA9IF9maWxlIHx8IFwiXCIsXG4gICAgICAgICAgICB2YWw7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlLnVybCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5iYXNlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHNsYXNoIHRvIHRoZSBlbmQgb2YgcGF0aFxuICAgICAgICAgICAgICAgIGJhc2UgPSB0ZW1wbGF0ZS5iYXNlLnJlcGxhY2UoLyhbXlxcL10pJC8sIFwiJDEvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXNlID0gdGVtcGxhdGUudXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLnBhdGgpIHtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgc3lzdGVtLXNwZWNpZmljIHBhdGggc2VwYXJhdG9yXG4gICAgICAgICAgICB2YXIgcGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMSksXG4gICAgICAgICAgICAgICAgc2VwID0gcGF0aC5zZXAgfHwgc2VwX2NocixcbiAgICAgICAgICAgICAgICByZWxhdGl2ZSA9IG5ldyBSZWdFeHAoXCJeXFxcXC57MSwyfVwiICsgc2VwLnJlcGxhY2UoXCJcXFxcXCIsIFwiXFxcXFxcXFxcIikpO1xuICAgICAgICAgICAgZmlsZSA9IGZpbGUucmVwbGFjZSgvXFwvL2csIHNlcCk7XG5cbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZS5iYXNlICE9PSB1bmRlZmluZWQgJiYgZmlsZS5tYXRjaChyZWxhdGl2ZSkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlLnJlcGxhY2UodGVtcGxhdGUuYmFzZSwgXCJcIik7XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRlbXBsYXRlLmJhc2UgKyBzZXA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJhc2UgPSBwYXRoLm5vcm1hbGl6ZSh0ZW1wbGF0ZS5wYXRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmFzZSA9IGJhc2UucmVwbGFjZShzZXAgKyBzZXAsIHNlcCk7XG4gICAgICAgICAgICBzZXBfY2hyID0gc2VwO1xuICAgICAgICB9IGVsc2UgaWYgKCh0ZW1wbGF0ZS5uYW1lIHx8IHRlbXBsYXRlLmlkKSAmJiB0ZW1wbGF0ZS5tZXRob2QgJiYgdGVtcGxhdGUubWV0aG9kICE9PSBcImZzXCIgJiYgdGVtcGxhdGUubWV0aG9kICE9PSBcImFqYXhcIikge1xuICAgICAgICAgICAgLy8gQ3VzdG9tIHJlZ2lzdGVyZWQgbG9hZGVyXG4gICAgICAgICAgICBiYXNlID0gdGVtcGxhdGUuYmFzZSB8fCB0ZW1wbGF0ZS5uYW1lIHx8IHRlbXBsYXRlLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR3aWcuRXJyb3IoXCJDYW5ub3QgZXh0ZW5kIGFuIGlubGluZSB0ZW1wbGF0ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBiYXNlX3BhdGggPSBiYXNlLnNwbGl0KHNlcF9jaHIpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBmaWxlIGZyb20gdXJsXG4gICAgICAgIGJhc2VfcGF0aC5wb3AoKTtcbiAgICAgICAgYmFzZV9wYXRoID0gYmFzZV9wYXRoLmNvbmNhdChmaWxlLnNwbGl0KHNlcF9jaHIpKTtcblxuICAgICAgICB3aGlsZSAoYmFzZV9wYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhbCA9IGJhc2VfcGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gXCIuXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmVcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsID09PSBcIi4uXCIgJiYgbmV3X3BhdGgubGVuZ3RoID4gMCAmJiBuZXdfcGF0aFtuZXdfcGF0aC5sZW5ndGggLSAxXSAhPT0gXCIuLlwiKSB7XG4gICAgICAgICAgICAgICAgbmV3X3BhdGgucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19wYXRoLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdfcGF0aC5qb2luKHNlcF9jaHIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHdpZztcbn07XG5cblxuLyoqKi8gfSksXG4vKiAyNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG4vLyAjIyB0d2lnLnRlc3RzLmpzXG4vL1xuLy8gVGhpcyBmaWxlIGhhbmRsZXMgZXhwcmVzc2lvbiB0ZXN0cy4gKGlzIGVtcHR5LCBpcyBub3QgZGVmaW5lZCwgZXRjLi4uKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVHdpZykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIFR3aWcudGVzdHMgPSB7XG4gICAgICAgIGVtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgLy8gSGFuZGxlciBudW1iZXJzXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gZmFsc2U7IC8vIG51bWJlcnMgYXJlIG5ldmVyIFwiZW1wdHlcIlxuICAgICAgICAgICAgLy8gSGFuZGxlIHN0cmluZ3MgYW5kIGFycmF5c1xuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAmJiB2YWx1ZS5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAvLyBIYW5kbGUgb2JqZWN0c1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBvZGQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJSAyID09PSAxO1xuICAgICAgICB9LFxuICAgICAgICBldmVuOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICUgMiA9PT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZGl2aXNpYmxlYnk6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAlIHBhcmFtc1swXSA9PT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmaW5lZDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICBub25lOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgICAgICB9LFxuICAgICAgICAnbnVsbCc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub25lKHZhbHVlKTsgLy8gQWxpYXMgb2Ygbm9uZVxuICAgICAgICB9LFxuICAgICAgICAnc2FtZSBhcyc6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gcGFyYW1zWzBdO1xuICAgICAgICB9LFxuICAgICAgICBzYW1lYXM6IGZ1bmN0aW9uKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignYHNhbWVhc2AgaXMgZGVwcmVjYXRlZCB1c2UgYHNhbWUgYXNgJyk7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy50ZXN0c1snc2FtZSBhcyddKHZhbHVlLCBwYXJhbXMpO1xuICAgICAgICB9LFxuICAgICAgICBpdGVyYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAmJiAoVHdpZy5saWIuaXMoXCJBcnJheVwiLCB2YWx1ZSkgfHwgVHdpZy5saWIuaXMoXCJPYmplY3RcIiwgdmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBjb25zdGFudCA/XG4gICAgICAgICAqL1xuICAgIH07XG5cbiAgICBUd2lnLnRlc3QgPSBmdW5jdGlvbih0ZXN0LCB2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghVHdpZy50ZXN0c1t0ZXN0XSkge1xuICAgICAgICAgICAgdGhyb3cgXCJUZXN0IFwiICsgdGVzdCArIFwiIGlzIG5vdCBkZWZpbmVkLlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBUd2lnLnRlc3RzW3Rlc3RdKHZhbHVlLCBwYXJhbXMpO1xuICAgIH07XG5cbiAgICBUd2lnLnRlc3QuZXh0ZW5kID0gZnVuY3Rpb24odGVzdCwgZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLnRlc3RzW3Rlc3RdID0gZGVmaW5pdGlvbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG59O1xuXG5cbi8qKiovIH0pLFxuLyogMjggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuLy8gIyMgdHdpZy5hc3luYy5qc1xuLy9cbi8vIFRoaXMgZmlsZSBoYW5kbGVzIGFzeW5jaHJvbm91cyB0YXNrcyB3aXRoaW4gdHdpZy5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFR3aWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTVEFURV9VTktOT1dOID0gMDtcbiAgICB2YXIgU1RBVEVfUkVTT0xWRUQgPSAxO1xuICAgIHZhciBTVEFURV9SRUpFQ1RFRCA9IDI7XG5cbiAgICBUd2lnLnBhcnNlQXN5bmMgPSBmdW5jdGlvbiAodG9rZW5zLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBUd2lnLnBhcnNlLmNhbGwodGhpcywgdG9rZW5zLCBjb250ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBUd2lnLmV4cHJlc3Npb24ucGFyc2VBc3luYyA9IGZ1bmN0aW9uICh0b2tlbnMsIGNvbnRleHQsIHRva2Vuc19hcmVfcGFyYW1ldGVycykge1xuICAgICAgICByZXR1cm4gVHdpZy5leHByZXNzaW9uLnBhcnNlLmNhbGwodGhpcywgdG9rZW5zLCBjb250ZXh0LCB0b2tlbnNfYXJlX3BhcmFtZXRlcnMsIHRydWUpO1xuICAgIH1cblxuICAgIFR3aWcubG9naWMucGFyc2VBc3luYyA9IGZ1bmN0aW9uICh0b2tlbiwgY29udGV4dCwgY2hhaW4pIHtcbiAgICAgICAgcmV0dXJuIFR3aWcubG9naWMucGFyc2UuY2FsbCh0aGlzLCB0b2tlbiwgY29udGV4dCwgY2hhaW4sIHRydWUpO1xuICAgIH1cblxuICAgIFR3aWcuVGVtcGxhdGUucHJvdG90eXBlLnJlbmRlckFzeW5jID0gZnVuY3Rpb24gKGNvbnRleHQsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoY29udGV4dCwgcGFyYW1zLCB0cnVlKTtcbiAgICB9XG5cbiAgICBUd2lnLmFzeW5jID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgZm9yIGB0aGVuYWJsZWAgb2JqZWN0c1xuICAgICAqL1xuICAgIFR3aWcuaXNQcm9taXNlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgb2JqLnRoZW4gJiYgKHR5cGVvZiBvYmoudGhlbiA9PSAnZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGluZyBvZiBjb2RlIHBhdGhzIHRoYXQgbWlnaHQgZWl0aGVyIHJldHVybiBhIHByb21pc2VcbiAgICAgKiBvciBhIHZhbHVlIGRlcGVuZGluZyBvbiB3aGV0aGVyIGFzeW5jIGNvZGUgaXMgdXNlZC5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3aWdqcy90d2lnLmpzL2Jsb2IvbWFzdGVyL0FTWU5DLm1kI2RldGVjdGluZy1hc3luY2hyb25vdXMtYmVoYXZpb3VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gcG90ZW50aWFsbHlBc3luY1Nsb3codGhhdCwgYWxsb3dfYXN5bmMsIGFjdGlvbikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gYWN0aW9uLmNhbGwodGhhdCksXG4gICAgICAgICAgICBlcnIgPSBudWxsLFxuICAgICAgICAgICAgaXNfYXN5bmMgPSB0cnVlO1xuXG4gICAgICAgIGlmICghVHdpZy5pc1Byb21pc2UocmVzdWx0KSlcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXM7XG4gICAgICAgICAgICBpc19hc3luYyA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGVyciAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IGVycjtcblxuICAgICAgICBpZiAoaXNfYXN5bmMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHdpZy5FcnJvcignWW91IGFyZSB1c2luZyBUd2lnLmpzIGluIHN5bmMgbW9kZSBpbiBjb21iaW5hdGlvbiB3aXRoIGFzeW5jIGV4dGVuc2lvbnMuJyk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBUd2lnLmFzeW5jLnBvdGVudGlhbGx5QXN5bmMgPSBmdW5jdGlvbiBwb3RlbnRpYWxseUFzeW5jKHRoYXQsIGFsbG93X2FzeW5jLCBhY3Rpb24pIHtcbiAgICAgICAgaWYgKGFsbG93X2FzeW5jKVxuICAgICAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKGFjdGlvbi5jYWxsKHRoYXQpKTtcblxuICAgICAgICByZXR1cm4gcG90ZW50aWFsbHlBc3luY1Nsb3codGhhdCwgYWxsb3dfYXN5bmMsIGFjdGlvbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKGZuLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdHJ5IHsgZm4ocmVzb2x2ZSwgcmVqZWN0KTsgfVxuICAgICAgICBjYXRjaChlKSB7IHJlamVjdChlKTsgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlbmRpbmcoaGFuZGxlcnMsIG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgdmFyIGggPSBbIG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQsIC0yIF07XG5cbiAgICAgICAgLy8gVGhlIHByb21pc2UgaGFzIHlldCB0byBiZSByZWplY3RlZCBvciByZXNvbHZlZC5cbiAgICAgICAgaWYgKCFoYW5kbGVycylcbiAgICAgICAgICAgIGhhbmRsZXJzID0gaDtcbiAgICAgICAgLy8gT25seSBhbGxvY2F0ZSBhbiBhcnJheSB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBoYW5kbGVyc1xuICAgICAgICBlbHNlIGlmIChoYW5kbGVyc1syXSA9PSAtMilcbiAgICAgICAgICAgIGhhbmRsZXJzID0gWyBoYW5kbGVycywgaCBdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBoYW5kbGVycy5wdXNoKGgpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsbHkgc21hbGwgdGhlbmFibGUgdG8gcmVwcmVzZW50IHByb21pc2VzIHRoYXQgcmVzb2x2ZSBpbW1lZGlhdGVseS5cbiAgICAgKlxuICAgICAqL1xuICAgIFR3aWcuVGhlbmFibGUgPSBmdW5jdGlvbih0aGVuLCB2YWx1ZSwgc3RhdGUpIHtcbiAgICAgICAgdGhpcy50aGVuID0gdGhlbjtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBzdGF0ZSA/IHZhbHVlIDogbnVsbDtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZSB8fCBTVEFURV9VTktOT1dOO1xuICAgIH1cblxuICAgIFR3aWcuVGhlbmFibGUucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24gdGhlbmFibGVDYXRjaChvblJlamVjdGVkKSB7XG4gICAgICAgIC8vIFRIZSBwcm9taXNlIHdpbGwgbm90IHRocm93LCBpdCBoYXMgYWxyZWFkeSByZXNvbHZlZC5cbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IFNUQVRFX1JFU09MVkVEKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRoZW5gIG1ldGhvZCBhdHRhY2hlZCB0byBhIFRoZW5hYmxlIHdoZW4gaXQgaGFzIHJlc29sdmVkLlxuICAgICAqXG4gICAgICovXG4gICAgVHdpZy5UaGVuYWJsZS5yZXNvbHZlZFRoZW4gPSBmdW5jdGlvbiByZXNvbHZlZFRoZW4ob25SZXNvbHZlZCkge1xuICAgICAgICB0cnkgeyByZXR1cm4gVHdpZy5Qcm9taXNlLnJlc29sdmUob25SZXNvbHZlZCh0aGlzLl92YWx1ZSkpOyB9XG4gICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZWplY3QoZSk7IH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRoZW5gIG1ldGhvZCBhdHRhY2hlZCB0byBhIFRoZW5hYmxlIHdoZW4gaXQgaGFzIHJlamVjdGVkLlxuICAgICAqXG4gICAgICovXG4gICAgVHdpZy5UaGVuYWJsZS5yZWplY3RlZFRoZW4gPSBmdW5jdGlvbiByZWplY3RlZFRoZW4ob25SZXNvbHZlZCwgb25SZWplY3RlZCkge1xuICAgICAgICAvLyBTaG9ydGN1dCBmb3IgcmVqZWN0ZWQgdHdpZyBwcm9taXNlc1xuICAgICAgICBpZiAoIW9uUmVqZWN0ZWQgfHwgdHlwZW9mIG9uUmVqZWN0ZWQgIT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gVHdpZy5hdHRlbXB0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9uUmVqZWN0ZWQodmFsdWUpO1xuICAgICAgICB9LCBUd2lnLlByb21pc2UucmVqZWN0KTtcblxuICAgICAgICByZXR1cm4gVHdpZy5Qcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhbHRlcm5hdGUgaW1wbGVtZW50YXRpb24gb2YgYSBQcm9taXNlIHRoYXQgZG9lcyBub3QgZnVsbHkgZm9sbG93XG4gICAgICogdGhlIHNwZWMsIGJ1dCBpbnN0ZWFkIHdvcmtzIGZ1bGx5IHN5bmNocm9ub3VzIHdoaWxlIHN0aWxsIGJlaW5nXG4gICAgICogdGhlbmFibGUuXG4gICAgICpcbiAgICAgKiBUaGVzZSBwcm9taXNlcyBjYW4gYmUgbWl4ZWQgd2l0aCByZWd1bGFyIHByb21pc2VzIGF0IHdoaWNoIHBvaW50XG4gICAgICogdGhlIHN5bmNocm9ub3VzIGJlaGF2aW91ciBpcyBsb3N0LlxuICAgICAqL1xuICAgIFR3aWcuUHJvbWlzZSA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IFNUQVRFX1VOS05PV047XG4gICAgICAgIHZhciB2YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgdmFyIGNoYW5nZVN0YXRlID0gZnVuY3Rpb24obmV4dFN0YXRlLCBuZXh0VmFsdWUpIHtcbiAgICAgICAgICAgIHN0YXRlID0gbmV4dFN0YXRlO1xuICAgICAgICAgICAgdmFsdWUgPSBuZXh0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvblJlYWR5KHYpIHtcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKFNUQVRFX1JFU09MVkVELCB2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0KGUpIHtcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKFNUQVRFX1JFSkVDVEVELCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bihleGVjdXRvciwgb25SZWFkeSwgb25SZWplY3QpO1xuXG4gICAgICAgIC8vIElmIHRoZSBwcm9taXNlIHNldHRsZXMgcmlnaHQgYWZ0ZXIgcnVubmluZyB0aGUgZXhlY3V0b3Igd2UgY2FuXG4gICAgICAgIC8vIHJldHVybiBhIFByb21pc2Ugd2l0aCBpdCdzIHN0YXRlIGFscmVhZHkgc2V0LlxuICAgICAgICAvL1xuICAgICAgICAvLyBUd2lnLlByb21pc2UucmVzb2x2ZSBhbmQgVHdpZy5Qcm9taXNlLnJlamVjdCBib3RoIHVzZSB0aGUgbW9yZVxuICAgICAgICAvLyBlZmZpY2llbnQgYFR3aWcuVGhlbmFibGVgIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gU1RBVEVfUkVTT0xWRUQpXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5Qcm9taXNlLnJlc29sdmUodmFsdWUpO1xuXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gU1RBVEVfUkVKRUNURUQpXG4gICAgICAgICAgICByZXR1cm4gVHdpZy5Qcm9taXNlLnJlamVjdCh2YWx1ZSk7XG5cbiAgICAgICAgLy8gSWYgd2UgbWFuYWdlZCB0byBnZXQgaGVyZSBvdXIgcHJvbWlzZSBpcyBnb2luZyB0byByZXNvbHZlIGFzeW5jaHJvbm91cy5cbiAgICAgICAgY2hhbmdlU3RhdGUgPSBUd2lnLkZ1bGxQcm9taXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIGNoYW5nZVN0YXRlLnByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSBpbXBsZW1lbnRhdGlvbiB0aGF0IGNhbiBoYW5kbGUgYmVpbmcgcmVzb2x2ZWQgYXQgYW55IGxhdGVyIHRpbWUuXG4gICAgICpcbiAgICAgKi9cbiAgICBUd2lnLkZ1bGxQcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoYW5kbGVycyA9IG51bGw7XG5cbiAgICAgICAgLy8gVGhlIHN0YXRlIGhhcyBiZWVuIGNoYW5nZWQgdG8gZWl0aGVyIHJlc29sdmUsIG9yIHJlamVjdFxuICAgICAgICAvLyB3aGljaCBtZWFucyB3ZSBzaG91bGQgY2FsbCB0aGUgaGFuZGxlci5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZWQob25SZXNvbHZlZCkge1xuICAgICAgICAgICAgb25SZXNvbHZlZChwLl92YWx1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIG9uUmVqZWN0ZWQocC5fdmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhcHBlbmQgPSBmdW5jdGlvbiB1bmtub3duKG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzID0gcGVuZGluZyhoYW5kbGVycywgb25SZXNvbHZlZCwgb25SZWplY3RlZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlU3RhdGUobmV3U3RhdGUsIHYpIHtcbiAgICAgICAgICAgIGlmIChwLl9zdGF0ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBwLl92YWx1ZSA9IHY7XG4gICAgICAgICAgICBwLl9zdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgICAgICBhcHBlbmQgPSBuZXdTdGF0ZSA9PSBTVEFURV9SRVNPTFZFRCA/IHJlc29sdmVkIDogcmVqZWN0ZWQ7XG5cbiAgICAgICAgICAgIGlmICghaGFuZGxlcnMpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKGhhbmRsZXJzWzJdID09PSAtMikge1xuICAgICAgICAgICAgICAgIGFwcGVuZChoYW5kbGVyc1swXSwgaGFuZGxlcnNbMV0pO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVHdpZy5mb3JFYWNoKGhhbmRsZXJzLCBmdW5jdGlvbiBjaGFuZ2VTdGF0ZUxvb3AoaCkge1xuICAgICAgICAgICAgICAgIGFwcGVuZChoWzBdLCBoWzFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaGFuZGxlcnMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHAgPSBuZXcgVHdpZy5UaGVuYWJsZShmdW5jdGlvbiB0aGVuKG9uUmVzb2x2ZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHZhciBoYXNSZXNvbHZlZCA9IHR5cGVvZiBvblJlc29sdmVkID09ICdmdW5jdGlvbic7XG5cbiAgICAgICAgICAgIC8vIFNob3J0Y3V0IGZvciByZXNvbHZlZCB0d2lnIHByb21pc2VzXG4gICAgICAgICAgICBpZiAocC5fc3RhdGUgPT0gU1RBVEVfUkVTT0xWRUQgJiYgIWhhc1Jlc29sdmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKHAuX3ZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocC5fc3RhdGUgPT09IFNUQVRFX1JFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuYXR0ZW1wdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKG9uUmVzb2x2ZWQocC5fdmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9LCBUd2lnLlByb21pc2UucmVqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGhhc1JlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJztcbiAgICAgICAgICAgIHJldHVybiBUd2lnLlByb21pc2UoZnVuY3Rpb24gdGhlbkV4ZWN1dG9yKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIGFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgaGFzUmVzb2x2ZWQgPyBmdW5jdGlvbiB0aGVuUmVzb2x2ZShyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcuYXR0ZW1wdChmdW5jdGlvbiB0aGVuQXR0ZW1wdFJlc29sdmUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvblJlc29sdmVkKHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSA6IHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICAgIGhhc1JlamVjdGVkID8gZnVuY3Rpb24gdGhlblJlamVjdChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFR3aWcuYXR0ZW1wdChmdW5jdGlvbiB0aGVuQXR0ZW1wdFJlamVjdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9uUmVqZWN0ZWQoZXJyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IDogcmVqZWN0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjaGFuZ2VTdGF0ZS5wcm9taXNlID0gcDtcblxuICAgICAgICByZXR1cm4gY2hhbmdlU3RhdGU7XG4gICAgfVxuXG4gICAgVHdpZy5Qcm9taXNlLmRlZmF1bHRSZXNvbHZlZCA9IG5ldyBUd2lnLlRoZW5hYmxlKFR3aWcuVGhlbmFibGUucmVzb2x2ZWRUaGVuLCB1bmRlZmluZWQsIFNUQVRFX1JFU09MVkVEKTtcbiAgICBUd2lnLlByb21pc2UuZW1wdHlTdHJpbmdSZXNvbHZlZCA9IG5ldyBUd2lnLlRoZW5hYmxlKFR3aWcuVGhlbmFibGUucmVzb2x2ZWRUaGVuLCAnJywgU1RBVEVfUkVTT0xWRUQpO1xuXG4gICAgVHdpZy5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHJldHVybiBUd2lnLlByb21pc2UuZGVmYXVsdFJlc29sdmVkO1xuXG4gICAgICAgIGlmIChUd2lnLmlzUHJvbWlzZSh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgLy8gVHdpZyBvZnRlbiByZXNvbHZlcyB3aXRoIGFuIGVtcHR5IHN0cmluZywgd2Ugb3B0aW1pemUgZm9yIHRoaXNcbiAgICAgICAgLy8gc2NlbmFyaW8gYnkgcmV0dXJuaW5nIGEgZml4ZWQgcHJvbWlzZS4gVGhpcyByZWR1Y2VzIHRoZSBsb2FkIG9uXG4gICAgICAgIC8vIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAgICAgICAgaWYgKHZhbHVlID09PSAnJylcbiAgICAgICAgICAgIHJldHVybiBUd2lnLlByb21pc2UuZW1wdHlTdHJpbmdSZXNvbHZlZDtcblxuICAgICAgICByZXR1cm4gbmV3IFR3aWcuVGhlbmFibGUoVHdpZy5UaGVuYWJsZS5yZXNvbHZlZFRoZW4sIHZhbHVlLCBTVEFURV9SRVNPTFZFRCk7XG4gICAgfTtcblxuICAgIFR3aWcuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIGBlYCBzaG91bGQgbmV2ZXIgYmUgYSBwcm9taXNlLlxuICAgICAgICByZXR1cm4gbmV3IFR3aWcuVGhlbmFibGUoVHdpZy5UaGVuYWJsZS5yZWplY3RlZFRoZW4sIGUsIFNUQVRFX1JFSkVDVEVEKTtcbiAgICB9O1xuXG4gICAgVHdpZy5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uIFR3aWdQcm9taXNlQWxsKHByb21pc2VzKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KHByb21pc2VzLmxlbmd0aCk7XG5cbiAgICAgICAgcmV0dXJuIFR3aWcuYXN5bmMuZm9yRWFjaChwcm9taXNlcywgZnVuY3Rpb24gcHJvbWlzZUFsbENiKHAsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIVR3aWcuaXNQcm9taXNlKHApKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSBwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHAuX3N0YXRlID09IFNUQVRFX1JFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSBwLl92YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24gcHJvbWlzZUFsbFRoZW4odikge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiBwcm9taXNlQWxsUmVzdWx0cygpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBHbyBvdmVyIGVhY2ggaXRlbSBpbiBhIGZhc2hpb24gY29tcGF0aWJsZSB3aXRoIFR3aWcuZm9yRWFjaCxcbiAgICAqIGFsbG93IHRoZSBmdW5jdGlvbiB0byByZXR1cm4gYSBwcm9taXNlIG9yIGNhbGwgdGhlIHRoaXJkIGFyZ3VtZW50XG4gICAgKiB0byBzaWduYWwgaXQgaXMgZmluaXNoZWQuXG4gICAgKlxuICAgICogRWFjaCBpdGVtIGluIHRoZSBhcnJheSB3aWxsIGJlIGNhbGxlZCBzZXF1ZW50aWFsbHkuXG4gICAgKi9cbiAgICBUd2lnLmFzeW5jLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoQXN5bmMoYXJyLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgdmFyIHJlc3AgPSBudWxsO1xuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IGxlbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFR3aWcuUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgICAgICByZXNwID0gY2FsbGJhY2soYXJyW2luZGV4XSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG5cbiAgICAgICAgICAgIC8vIFdoaWxlIHRoZSByZXN1bHQgb2YgdGhlIGNhbGxiYWNrIGlzIG5vdCBhIHByb21pc2Ugb3IgaXQgaXNcbiAgICAgICAgICAgIC8vIGEgcHJvbWlzZSB0aGF0IGhhcyBzZXR0bGVkIHdlIGNhbiB1c2UgYSByZWd1bGFyIGxvb3Agd2hpY2hcbiAgICAgICAgICAgIC8vIGlzIG11Y2ggZmFzdGVyLlxuICAgICAgICAgICAgfSB3aGlsZSghcmVzcCB8fCAhVHdpZy5pc1Byb21pc2UocmVzcCkgfHwgcmVzcC5fc3RhdGUgPT0gU1RBVEVfUkVTT0xWRUQpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzcC50aGVuKG5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR3aWc7XG5cbn07XG5cblxuLyoqKi8gfSksXG4vKiAyOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG4vLyAjIyB0d2lnLmV4cG9ydHMuanNcbi8vXG4vLyBUaGlzIGZpbGUgcHJvdmlkZXMgZXh0ZW5zaW9uIHBvaW50cyBhbmQgb3RoZXIgaG9va3MgaW50byB0aGUgdHdpZyBmdW5jdGlvbmFsaXR5LlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUd2lnKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgVHdpZy5leHBvcnRzID0ge1xuICAgICAgICBWRVJTSU9OOiBUd2lnLlZFUlNJT05cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBjb21waWxlIGEgdHdpZy5qcyB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBQYXJhbXRlcmVzIGZvciBjcmVhdGluZyBhIFR3aWcgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtUd2lnLlRlbXBsYXRlfSBBIFR3aWcgdGVtcGxhdGUgcmVhZHkgZm9yIHJlbmRlcmluZy5cbiAgICAgKi9cbiAgICBUd2lnLmV4cG9ydHMudHdpZyA9IGZ1bmN0aW9uIHR3aWcocGFyYW1zKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdmFyIGlkID0gcGFyYW1zLmlkLFxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzdHJpY3RfdmFyaWFibGVzOiBwYXJhbXMuc3RyaWN0X3ZhcmlhYmxlcyB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB0dXJuIGF1dG9zY2FwZSBvbiBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgYXV0b2VzY2FwZTogcGFyYW1zLmF1dG9lc2NhcGUgIT0gbnVsbCAmJiBwYXJhbXMuYXV0b2VzY2FwZSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxvd0lubGluZUluY2x1ZGVzOiBwYXJhbXMuYWxsb3dJbmxpbmVJbmNsdWRlcyB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICByZXRocm93OiBwYXJhbXMucmV0aHJvdyB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VzOiBwYXJhbXMubmFtZXNwYWNlc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoVHdpZy5jYWNoZSAmJiBpZCkge1xuICAgICAgICAgICAgVHdpZy52YWxpZGF0ZUlkKGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVidWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVHdpZy5kZWJ1ZyA9IHBhcmFtcy5kZWJ1ZztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLnRyYWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFR3aWcudHJhY2UgPSBwYXJhbXMudHJhY2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFR3aWcuVGVtcGxhdGVzLnBhcnNlcnMudHdpZyh7XG4gICAgICAgICAgICAgICAgZGF0YTogcGFyYW1zLmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogcGFyYW1zLmhhc093blByb3BlcnR5KCdwYXRoJykgPyBwYXJhbXMucGF0aCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHBhcmFtcy5tb2R1bGUsXG4gICAgICAgICAgICAgICAgaWQ6ICAgaWQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMucmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKFwiQm90aCByZWYgYW5kIGlkIGNhbm5vdCBiZSBzZXQgb24gYSB0d2lnLmpzIHRlbXBsYXRlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBUd2lnLlRlbXBsYXRlcy5sb2FkKHBhcmFtcy5yZWYpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLm1ldGhvZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoIVR3aWcuVGVtcGxhdGVzLmlzUmVnaXN0ZXJlZExvYWRlcihwYXJhbXMubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUd2lnLkVycm9yKCdMb2FkZXIgZm9yIFwiJyArIHBhcmFtcy5tZXRob2QgKyAnXCIgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZShwYXJhbXMubmFtZSB8fCBwYXJhbXMuaHJlZiB8fCBwYXJhbXMucGF0aCB8fCBpZCB8fCB1bmRlZmluZWQsIHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBwYXJhbXMubWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhcnNlcjogcGFyYW1zLnBhcnNlciB8fCAndHdpZycsXG4gICAgICAgICAgICAgICAgYmFzZTogcGFyYW1zLmJhc2UsXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBwYXJhbXMubW9kdWxlLFxuICAgICAgICAgICAgICAgIHByZWNvbXBpbGVkOiBwYXJhbXMucHJlY29tcGlsZWQsXG4gICAgICAgICAgICAgICAgYXN5bmM6IHBhcmFtcy5hc3luYyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG5cbiAgICAgICAgICAgIH0sIHBhcmFtcy5sb2FkLCBwYXJhbXMuZXJyb3IpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmhyZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFR3aWcuVGVtcGxhdGVzLmxvYWRSZW1vdGUocGFyYW1zLmhyZWYsIHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnYWpheCcsXG4gICAgICAgICAgICAgICAgcGFyc2VyOiBwYXJhbXMucGFyc2VyIHx8ICd0d2lnJyxcbiAgICAgICAgICAgICAgICBiYXNlOiBwYXJhbXMuYmFzZSxcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHBhcmFtcy5tb2R1bGUsXG4gICAgICAgICAgICAgICAgcHJlY29tcGlsZWQ6IHBhcmFtcy5wcmVjb21waWxlZCxcbiAgICAgICAgICAgICAgICBhc3luYzogcGFyYW1zLmFzeW5jLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcblxuICAgICAgICAgICAgfSwgcGFyYW1zLmxvYWQsIHBhcmFtcy5lcnJvcik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMucGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gVHdpZy5UZW1wbGF0ZXMubG9hZFJlbW90ZShwYXJhbXMucGF0aCwge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdmcycsXG4gICAgICAgICAgICAgICAgcGFyc2VyOiBwYXJhbXMucGFyc2VyIHx8ICd0d2lnJyxcbiAgICAgICAgICAgICAgICBiYXNlOiBwYXJhbXMuYmFzZSxcbiAgICAgICAgICAgICAgICBtb2R1bGU6IHBhcmFtcy5tb2R1bGUsXG4gICAgICAgICAgICAgICAgcHJlY29tcGlsZWQ6IHBhcmFtcy5wcmVjb21waWxlZCxcbiAgICAgICAgICAgICAgICBhc3luYzogcGFyYW1zLmFzeW5jLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcblxuICAgICAgICAgICAgfSwgcGFyYW1zLmxvYWQsIHBhcmFtcy5lcnJvcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRXh0ZW5kIFR3aWcgd2l0aCBhIG5ldyBmaWx0ZXIuXG4gICAgVHdpZy5leHBvcnRzLmV4dGVuZEZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlciwgZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLmZpbHRlci5leHRlbmQoZmlsdGVyLCBkZWZpbml0aW9uKTtcbiAgICB9O1xuXG4gICAgLy8gRXh0ZW5kIFR3aWcgd2l0aCBhIG5ldyBmdW5jdGlvbi5cbiAgICBUd2lnLmV4cG9ydHMuZXh0ZW5kRnVuY3Rpb24gPSBmdW5jdGlvbihmbiwgZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLl9mdW5jdGlvbi5leHRlbmQoZm4sIGRlZmluaXRpb24pO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgVHdpZyB3aXRoIGEgbmV3IHRlc3QuXG4gICAgVHdpZy5leHBvcnRzLmV4dGVuZFRlc3QgPSBmdW5jdGlvbih0ZXN0LCBkZWZpbml0aW9uKSB7XG4gICAgICAgIFR3aWcudGVzdC5leHRlbmQodGVzdCwgZGVmaW5pdGlvbik7XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCBUd2lnIHdpdGggYSBuZXcgZGVmaW5pdGlvbi5cbiAgICBUd2lnLmV4cG9ydHMuZXh0ZW5kVGFnID0gZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuICAgICAgICBUd2lnLmxvZ2ljLmV4dGVuZChkZWZpbml0aW9uKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSBhbiBlbnZpcm9ubWVudCBmb3IgZXh0ZW5kaW5nIFR3aWcgY29yZS5cbiAgICAvLyBDYWxscyBmbiB3aXRoIHRoZSBpbnRlcm5hbCBUd2lnIG9iamVjdC5cbiAgICBUd2lnLmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oVHdpZyk7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZSBhbiBleHRlbnNpb24gZm9yIHVzZSB3aXRoIGV4cHJlc3MgMi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgVGhlIHRlbXBsYXRlIG1hcmt1cC5cbiAgICAgKiBAcGFyYW0ge2FycmF5fSBvcHRpb25zIFRoZSBleHByZXNzIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSByZW5kZXJlZCB0ZW1wbGF0ZS5cbiAgICAgKi9cbiAgICBUd2lnLmV4cG9ydHMuY29tcGlsZSA9IGZ1bmN0aW9uKG1hcmt1cCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaWQgPSBvcHRpb25zLmZpbGVuYW1lLFxuICAgICAgICAgICAgcGF0aCA9IG9wdGlvbnMuZmlsZW5hbWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBUcnkgdG8gbG9hZCB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgY2FjaGVcbiAgICAgICAgdGVtcGxhdGUgPSBuZXcgVHdpZy5UZW1wbGF0ZSh7XG4gICAgICAgICAgICBkYXRhOiBtYXJrdXAsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucy5zZXR0aW5nc1sndHdpZyBvcHRpb25zJ11cbiAgICAgICAgfSk7IC8vIFR3aWcuVGVtcGxhdGVzLmxvYWQoaWQpIHx8XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZW5kZXIoY29udGV4dCk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGUgYW4gZXh0ZW5zaW9uIGZvciB1c2Ugd2l0aCBleHByZXNzIDMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgbG9jYXRpb24gb2YgdGhlIHRlbXBsYXRlIGZpbGUgb24gZGlzay5cbiAgICAgKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gVGhlIG9wdGlvbnMgb3IgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFR3aWcuRXJyb3JcbiAgICAgKi9cbiAgICBUd2lnLmV4cG9ydHMucmVuZGVyRmlsZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGZuKSB7XG4gICAgICAgIC8vIGhhbmRsZSBjYWxsYmFjayBpbiBvcHRpb25zXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZm4gPSBvcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdmFyIHNldHRpbmdzID0gb3B0aW9ucy5zZXR0aW5ncyB8fCB7fTtcblxuICAgICAgICAvLyBtaXhpbiBhbnkgb3B0aW9ucyBwcm92aWRlZCB0byB0aGUgZXhwcmVzcyBhcHAuXG4gICAgICAgIHZhciB2aWV3X29wdGlvbnMgPSBzZXR0aW5nc1sndHdpZyBvcHRpb25zJ107XG5cbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBiYXNlOiBzZXR0aW5ncy52aWV3cyxcbiAgICAgICAgICAgIGxvYWQ6IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyIGFuZCByZXR1cm4gdGVtcGxhdGUgYXMgYSBzaW1wbGUgc3RyaW5nLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3aWdqcy90d2lnLmpzL3B1bGwvMzQ4IGZvciBtb3JlIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKCF2aWV3X29wdGlvbnMgfHwgIXZpZXdfb3B0aW9ucy5hbGxvd19hc3luYykge1xuICAgICAgICAgICAgICAgICAgICBmbihudWxsLCAnJyArIHRlbXBsYXRlLnJlbmRlcihvcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5yZW5kZXJBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihvdXQpIHsgZm4obnVsbCwgb3V0KTsgfSwgZm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2aWV3X29wdGlvbnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiB2aWV3X29wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodmlld19vcHRpb25zLmhhc093blByb3BlcnR5KG9wdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zW29wdGlvbl0gPSB2aWV3X29wdGlvbnNbb3B0aW9uXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBUd2lnLmV4cG9ydHMudHdpZyhwYXJhbXMpO1xuICAgIH07XG5cbiAgICAvLyBFeHByZXNzIDMgaGFuZGxlclxuICAgIFR3aWcuZXhwb3J0cy5fX2V4cHJlc3MgPSBUd2lnLmV4cG9ydHMucmVuZGVyRmlsZTtcblxuICAgIC8qKlxuICAgICAqIFNob3VkIFR3aWcuanMgY2FjaGUgdGVtcGxhdGVzLlxuICAgICAqIERpc2FibGUgZHVyaW5nIGRldmVsb3BtZW50IHRvIHNlZSBjaGFuZ2VzIHRvIHRlbXBsYXRlcyB3aXRob3V0XG4gICAgICogcmVsb2FkaW5nLCBhbmQgZGlzYWJsZSBpbiBwcm9kdWN0aW9uIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNhY2hlXG4gICAgICovXG4gICAgVHdpZy5leHBvcnRzLmNhY2hlID0gZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgVHdpZy5jYWNoZSA9IGNhY2hlO1xuICAgIH07XG5cbiAgICAvL1dlIG5lZWQgdG8gZXhwb3J0IHRoZSBwYXRoIG1vZHVsZSBzbyB3ZSBjYW4gZWZmZWN0aXZlbHkgdGVzdCBpdFxuICAgIFR3aWcuZXhwb3J0cy5wYXRoID0gVHdpZy5wYXRoO1xuXG4gICAgLy9FeHBvcnQgb3VyIGZpbHRlcnMuXG4gICAgLy9SZXNvbHZlcyAjMzA3XG4gICAgVHdpZy5leHBvcnRzLmZpbHRlcnMgPSBUd2lnLmZpbHRlcnM7XG5cbiAgICBUd2lnLmV4cG9ydHMuUHJvbWlzZSA9IFR3aWcuUHJvbWlzZTtcblxuICAgIHJldHVybiBUd2lnO1xufTtcblxuXG4vKioqLyB9KVxuLyoqKioqKi8gXSk7XG59KTsiLCIvKiAoaWdub3JlZCkgKi8iXSwic291cmNlUm9vdCI6IiJ9