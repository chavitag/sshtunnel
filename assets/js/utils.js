(function( $ ){
$.fn.serializeJSON=function() {
    var json = {};
    jQuery.map($(this).serializeArray(), function(i, n){
        json[i['name']] = i['value'];
    });
    return json;
};
})( jQuery );

function callServer(controller,query,callback,params,type,context) {
	if ((query===null)||(query=="null")) query="isajax=true";
	else query+="&isajax=true";
	$.ajax({
		url: controller,
		context: context,
		data: query,
		dataType: type,
		method: "POST",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
	}).done(function (data,status,xhr) { 
		if (type=='html') { 
			try {
				var r=JSON.parse(data); 
				messageAlert("ERROR: "+data.msg,ERROR);
			} catch(e) {
				callback(data,params,context);
			}
		} else {
			if ((!data instanceof Object) || (data.ok!==undefined && data.ok!==true)) {
				if (data.code==2) document.location="/";
				messageAlert("ERROR: "+data.msg,ERROR);
			}
			else {
				if ((callback!==undefined) && (callback!="") && (callback!=null)) callback(data,params,context);
			}
		}
	}).fail(function (xhr,status,errorthrow) { 
			document.write(xhr.responseText);
			//messageAlert("ERROR: "+xhr.responseText,ERROR);
	});
}

function messageAlert(message,type,timeout) {
	$("#alerts").html("<div id='alertbody' class='alert "+type+" alert-dismissible fade show' role='alert'>"+message+
							"<button type='button' class='close' data-dismiss='alert' aria-label='Pechar'><span aria-hidden='true'>&times;</span></button>"+
							"</div>").show();
	if (timeout!==undefined) {
		setTimeout(function(){ $("#alertbody").alert("close"); }, timeout);
	}
}

//-------  Table
var _table_selections_={};
var _table_formatters_={};

function getIdSelections(id) {
	return $.map($("#"+id).bootstrapTable('getSelections'), function (row) {
		return row.id
	});
}

function reloadTable(data,id) {
	$("#"+id).bootstrapTable("load",data);
	$("#"+id).trigger("load-success.bs.table",data);
	$("#"+id).trigger("uncheck-all.bs.table");
}

function fixmargins(id,value,row,index,field) { 
	if ((_table_formatters_[id]!==undefined) && (_table_formatters_[id][field]!==undefined)) {
		return window[_table_formatters_[id][field]](value,row,index,field);
	}
	return '<span style="margin-left: 8px">'+value+'</span>';
}

//------  Select
//

var  __select__content={};

function reloadSelect(idselect,data) {
	var select=$("#"+idselect);
	var value=select.data("value");
	var text=select.data("text");

	select.empty();
	select.data("data",JSON.stringify(data));
	for(var d in data.rows) {
		var sel="";
		var dis="";
		if ((data.rows[d].selected != undefined) && (data.rows[d].selected=="true")) sel="selected";
		if ((data.rows[d].disabled != undefined) && (data.rows[d].disabled=="true")) dis="disabled";
		select.append('<option data-index="'+data.rows[d].id+'" value="'+data.rows[d][value]+'" '+sel+' '+dis+'>'+data.rows[d][text]+'</option>');
	}
	select.selectpicker("refresh");
	__select__content[idselect]=data;
}

//------------- ZIndex
//
	$.maxZIndex = $.fn.maxZIndex = function(opt) {
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
    var def = { inc: 10, group: "*" };
    $.extend(def, opt);    
    var zmax = 0;
    $(def.group).each(function() {
        var cur = parseInt($(this).css('z-index'));
        zmax = cur > zmax ? cur : zmax;
    });
    if (!this.jquery)
        return zmax;

    return this.each(function() {
        zmax += def.inc;
        $(this).css("z-index", zmax);
    });
	}

const INFO="alert-info";
const WARNING="alert-warning";
const ERROR="alert-danger";
const OK="alert-success";

global.getIdSelections=getIdSelections;
global.reloadTable=reloadTable;
global.fixmargins=fixmargins;
global._table_selections_=_table_selections_;
global._table_formatters_=_table_formatters_;
global.__select__content=__select__content;
global.messageAlert=messageAlert;
global.callServer=callServer;
global.reloadSelect=reloadSelect;
global.INFO=INFO;
global.WARNING=WARNING;
global.ERROR=ERROR;
global.OK=OK;

global.$ = global.jQuery = $;

