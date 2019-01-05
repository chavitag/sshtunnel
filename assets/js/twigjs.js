var Twig=require("twig");
var twig=Twig.twig;

require("./utils.js")

var _twig_tmpl={};
var _twig_templates={};

function _fnc_null() {}

function renderTemplate(namet,jsondata,callback,param) {
	var mode=true;
	var error=null;

	//var rjson={"info":jsondata};
	var rjson=jsondata;
	if (callback==undefined) {
		mode=false;
		callback=_fnc_null;
	}
	if (_twig_templates[namet]==undefined) {
		throw "La plantilla "+namet+" no existe";
	}
	if (_twig_tmpl[namet]==undefined) {
		_twig_tmpl[namet]=twig({
			base: 'templates',
			autoescape: true,
			id: namet,
			href: _twig_templates[namet],
			async: mode,
			load: function(tmpl) { 
				if (tmpl==null) {
					throw "No se pudo cargar la plantilla "+namet;
					//error="No se pudo cargar la plantilla "+namet;
				}	else	{
					try {
						var err=JSON.parse(tmpl.tokens[0].value);
						tmpl=null;
						//error=err.msg;
						throw err.msg;
					} catch(e) {
						if (callback!=undefined) callback(tmpl.render(rjson),param);
					}
				}
			},
		});
	} 
	if (!mode) {
		/*if (error!=null) {
			//Twig.cache();
			_twig_tmpl[namet]=null;
			setTimeout(function() { document.location='/'; },1000);
			throw error;
		}*/

		var t=twig({ref:namet});
		if (t==null) {
			_twig_tmpl[namet]=null;
			setTimeout(function() { document.location='/'; },1000);
			throw "No se pudo cargar la plantilla "+namet;
		}
		else 			 return twig({ref: namet}).render(rjson);
	} else {
		if (error!=null) {
			//Twig.cache();
			_twig_tmpl[namet]=null;
			setTimeout(function() { document.location='/'; },1000);
			throw error;
		}
		callback(_twig_tmpl[namet].render(rjson),param);
	}
	return null;
} 

Twig.extendFunction('include', function(template,params) {
	_twig_templates[template]=template;
	var html=renderTemplate(template,params);
	return html.replace(/[\n\t]/g,"");
});


function openModalTemplate(id,title,bodytemplate,params) { 
	try {
			$("#_modal_"+id).remove();
			if (params==undefined) params={};
			if ((bodytemplate==undefined)||(bodytemplate==null)||(bodytemplate=="null")) bodytemplate="_modalbody_"+id;
			if (params["buttons"]==undefined) params["buttons"]=[];
			var body=renderTemplate(bodytemplate,params);
			var html=renderTemplate("modal",{"id":id,"title":title,"onclose":params.onclose,"modalsize":params.modalsize,"buttons":params.buttons});
			$("body").append(html);
			$(document).ready(function() {
				$("#_modalbody_"+id).html(body);
				$("#_modal_"+id).modal("show");
			});
	} catch(error) {
		messageAlert(error,ERROR);
	}
}

global.renderTemplate = renderTemplate;
global.openModalTemplate = openModalTemplate;
global._twig_templates= _twig_templates;
global.openModalTemplate= openModalTemplate;
