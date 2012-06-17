// Recursive replacement logic
(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);

// Hide the page until we're done replacing
$('body').hide();

// Map find and replace
var map = [{
		from		: 'will',
		to			: 'shall',
		percent	: .1,
		invert	: true,
		cs			: true
	},{
		from		: 'who',
		to			: 'whom',
		percent	:	0.01,
		invert	: true
	},{
		from		: 'their',
		to			: 'they\'re',
		percent	: .21,
		invert	: true,
		cs			: false
	},{
		from		: 'why',
		to			: 'wherefore',
		percent	: 0.051,
		invert	: true,
		cs			: false
	},{
		from		: 'its',
		to			: 'it\'s',
		percent	: .31,
		invert	: true,
		cs			: false
	},{
		from		: 'fucking',
		to			: 'frackin\'',
		percent	: .11,
		invert	: true,
		cs			: false
	},{
		from		: 'regardless',
		to			: 'irregardless',
		percent	: .61,
		invert	: false,
		cs			: false
	},{
		from		: 'ould have ',
		to			: 'ould of ',
		percent	: .11,
		invert	: true,
		cs			: false,
		pad			: false
	},{
		from		: 'personal',
		to			: 'personel',
		percent	: .51,
		invert	: true,
		cs			: false
	}
];

// Replace when ready
$(document).ready(function() {
	for(i in map) {
		var data = map[i];
		// Defaults
		var pad = data.pad == undefined ? '(?:^| )' : (data.pad ? '(?:^|$| )' : '');
		var padr = data.pad == undefined ? ' ' : (data.pad ? ' ' : '');
		data.cs = data.cs == undefined ? true : data.cs;
		data.invert = data.invert == undefined ? false : data.invert;
		data.percent = data.percent == undefined ? 1 : data.percent;
		if(data.invert) {
			data.f = new RegExp(pad+'('+data.from+'|'+data.to+')'+pad, 'g');
			data.r = function(t, m) {
				return pad+(m == data.from ? data.to : data.from)+pad;
			}
		} else {
			data.f = new RegExp(pad+data.from+pad, 'g');
			data.r = data.to;
		}
		// Replace
		$("*:not(script)").each(function() {
			if(Math.random() <= data.percent) {
				$(this).replaceText(data.f, data.r);
				if(!data.cs) {
					if(data.invert) {
						var from = data.from.substr(0,1).toUpperCase()+data.from.substr(1);
						var to = data.to.substr(0,1).toUpperCase()+data.to.substr(1);
						$(this).replaceText(new RegExp(pad+'('+from+'|'+to+')'+pad, 'g'), function(t, m) {
							return padr+(m == from ? to : from)+padr;
						});	
						var from = data.from.toUpperCase();
						var to = data.to.toUpperCase();
						$(this).replaceText(new RegExp(pad+'('+from+'|'+to+')'+pad, 'g'), function(t, m) {
							return padr+(m == from ? to : from)+padr;
						});
					} else {
						$(this).replaceText(new RegExp(pad+data.from.substr(0,1).toUpperCase()+data.from.substr(1)+pad, 'g'), padr+data.to.substr(0,1).toUpperCase()+data.to.substr(1)+padr);	
						$(this).replaceText(new RegExp(pad+data.from.toUpperCase()+pad, 'g'), padr+data.to.toUpperCase()+padr);	
					}
				}
			}
		});
	};
	// Show the page again
	$('body').show();
});