<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Cecchi MacNaughton</title>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
<script type="text/javascript">

(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);

var slide = {
	enabled : true
};
var speed = 1500;
var hist = window.history && window.history.pushState;
var query = [];
var jsrun = [];
function goto(page) {
	root = page == '/';
	query = page.substr(1).split('/');
	page = query[0];
	if(slide.enabled && !root) {
		slide.default = $('#wrap').css('padding-top');
		$('#wrap').animate({'padding-top' : '50px'}, speed);
		slide.enabled = false;
	} else if(root) {
		if(slide.default) {
			$('#wrap').animate({'padding-top' : slide.default}, speed);
		}
		$('#stage').slideUp(speed);
		$('.arrow').stop(true).fadeOut(speed);
		slide.enabled = true;
	}
	$('.link').removeClass('active').filter('[href="/'+page+'"]').addClass('active');
	$.getJSON('/pages/'+page+'.php', function(data) {
		$('#stage').slideUp(speed, function() {
			$('#css').remove();
			$('head').append($('<style type="text/css" id="css">'+data.css+'</style>'));
			$('#stage').html(data.html);
			$('.extjs').remove();
			var ii = 0;
			// Execute external and inline javascript, in order & synchronously
			(function js(i) {
				i = i == undefined ? ii : i;
				if(data.extjs && data.extjs.length > i) {
					$.getScript(data.extjs[i], function() {
						js(i+1);
					});
					return true;
				} else if(jsrun.indexOf(page) == -1 && data.js) {
					console.log("EVAL: "+page);
					eval(data.js);
					jsrun.push(page);
				}
				if(data.force != undefined) {
					console.log("FORCE: "+page); 
					eval(data.force);
				}
			})();
			$(this).slideDown(speed);
			if(data.arrows) {
				$('.arrow').stop(true).unbind().fadeIn(speed);
			}
		});
		if(!data.arrows) {
			$('.arrow').stop(true).unbind().fadeOut(speed);
		}
	});
}
$(window).load(function() {
	// Pagination
	$('.link').click(function() {
		var page = $(this).attr('href');
		if((page != location.pathname && '#'+page.substr(1) != window.location.hash)) {1
			hist ? window.history.pushState(page, '', page) : window.location.hash = '#'+page.substr(1);
			goto(page);
		}
		return false;
	});
	
	// Initial social media icon positons
	$('#social *').each(function() {
		$(this).data('init', parseInt($(this).css('left')));
	});
	// Social media hover effect
	$('#corner').hover(function() {
		$('#social *').stop(true).animate({'left' : 0});
	}, function() {
		$('#social *').stop(true).each(function() {
			$(this).animate({'left' : $(this).data('init')});
		});
	});
	
	window.onpopstate = function(state) {
		var page = window.location.hash.length > 0 ? '/'.window.location.hash.substr(1) : (window.location.pathname.length ? window.location.pathname : false);
		if(page) { goto(page); }
	};
});
</script>
<link rel="stylesheet" type="text/css" href="/css/css.css" id="stylesheet" />
</head>

<body>
<div id="wrap" align="center">
  <div id="corner">
    <div id="photo"></div>
    <div id="social">
      <div id="location">
        <div>ME@CECCHI.ME</div>
        <div>BOSTON, MA</div>
      </div>
      <a id="fb" title="Facebook" href="http://www.facebook.com/cecchimacnaughton" target="_blank"></a>
      <a id="el" title="Elance" href="https://www.elance.com/s/cecchi/" target="_blank"></a>
      <a id="msn" title="MSN" href="http://profile.live.com/cid-2a8be1d1a818720a" target="_blank"></a>
      <a id="li" title="LinkedIn" href="http://www.linkedin.com/profile/view?id=134952624" target="_blank"></a>
      <a id="da" title="DeviantArt" href="http://cecchimacnaughton.deviantart.com" target="_blank"></a>
    </div>
  </div>
  <div id="name"></div>
  <div id="nav">
    <a class="link" id="about" href="/about"></a><span>&bull;</span>
    <a class="link" id="work" href="/work"></a><span>&bull;</span>
    <a class="link" id="portfolio" href="/portfolio"></a><span>&bull;</span>
    <a class="link" id="resume" href="/resume"></a><span>&bull;</span>
    <a class="link" id="contact" href="/contact"></a>
  </div>
  <div id="content">
    <div id="left"><a class="arrow"></a></div>
  	<div id="right"><a class="arrow"></a></div>
    <div id="stage" align="left"></div>
  </div>
</div>
</body>
</html>