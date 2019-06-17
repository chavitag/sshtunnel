(window.webpackJsonp=window.webpackJsonp||[]).push([["js/bootstrap-table-resizable"],{MBJD:function(t,o,e){(function(e){var i,n,s;
/**
  * bootstrap-table - An extended Bootstrap table with radio, checkbox, sort, pagination, and other added features. (supports twitter bootstrap v2 and v3).
  *
  * @version v1.14.2
  * @homepage https://bootstrap-table.com
  * @author wenzhixin <wenzhixin2010@gmail.com> (http://wenzhixin.net.cn/)
  * @license MIT
  */n=[],void 0===(s="function"==typeof(i=function(){"use strict";!function(t){var o=function(t){!t.options.resizable||t.options.cardView||i(t)||t.$el.resizableColumns()},e=function(t){i(t)&&t.$el.data("resizableColumns").destroy()},i=function(t){return void 0!==t.$el.data("resizableColumns")};t.extend(t.fn.bootstrapTable.defaults,{resizable:!1});var n=t.fn.bootstrapTable.Constructor,s=n.prototype.initBody,p=n.prototype.toggleView,a=n.prototype.resetView;n.prototype.initBody=function(){var t=this;s.apply(this,Array.prototype.slice.apply(arguments)),t.$el.off("column-switch.bs.table, page-change.bs.table").on("column-switch.bs.table, page-change.bs.table",function(){!function(t){e(t),o(t)}(t)})},n.prototype.toggleView=function(){p.apply(this,Array.prototype.slice.apply(arguments)),this.options.resizable&&this.options.cardView&&e(this)},n.prototype.resetView=function(){var t=this;a.apply(this,Array.prototype.slice.apply(arguments)),this.options.resizable&&setTimeout(function(){o(t)},100)}}(e)})?i.apply(o,n):i)||(t.exports=s)}).call(this,e("EVdn"))}},[["MBJD","runtime","vendor"]]]);