<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Cecchi MacNaughton</title>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	var e = ['e', 'c', 'i', 'h', '.', 'm', '@'];
	$('#email').html(e[5]+e[0]+e[6]+e[1]+e[0]+e[1]+e[1]+e[3]+e[2]+e[4]+e[5]+e[0]);
});
$(window).load(function() {
	// Pagination
	$('#navigation a, .virtual').live('click', function() {
		var page = $(this).attr('href');
		if(page != window.location.hash || init) {
			init = false;
			$(this).siblings().removeClass('active').filter('#slider').animate({
				height: $(this).height()+parseInt($(this).css('padding-top'))+parseInt($(this).css('padding-bottom')),
				top:		$(this).offset().top
			});
			$(this).addClass('active');
			$.get('pages/'+page.substr(1)+'.php', function(data) {
				$('#slugline').fadeOut(function() {
					$('#slugline').html(data.slug);
					$(this).fadeIn();
				});
				$('#content').fadeOut(function() {
					$('#css').html(data.css);
					$('#content').html(data.html);
					$(this).fadeIn(function() {
						eval(data.js);
					});
				});
			});
		}
	});
	// Initial social media icon positons
	$('.social').each(function() {
		$(this).data('init', $(this).css('left'));
	});
	// Social media hover effect
	$('#name').parent().hover(function() {
		console.log('over');
		$('.social').stop(true).animate({'left' : '0px'});
	}, function() {
		console.log('out');
		$('.social').stop(true).each(function() {
			$(this).animate({'left' : $(this).data('init')});
		});
	});
	// Load initial frame via a "virtual link"
	var init = true;
	var hash = window.location.hash.length > 0 ? window.location.hash : $('#navigation a').eq(0).attr('href');
	if($('#navigation a[href='+hash+']').click().length == 0) {
		$('<a href="'+hash+'" class="virtual"></a>').click();
	}
});
</script>
<link rel="stylesheet" type="text/css" href="css/main.css" />
<style type="text/css" id="css"></style>
</head>

<body>
  <div id="stage">
  	<div id="navigation">
    	<a href="#me">ME</a>
    	<a href="#websites">WEBSITES</a>
    	<a href="#projects">PROJECTS</a>
    	<a href="#work">WORK</a>
    	<a href="#contact">CONTACT</a>
      <div id="slider"></div>
    </div>
  	<div id="header">
    	<div>
        <a id="name">Cecchi MacNaughton</a>
        <a class="social" id="fb" title="Facebook" href="http://www.facebook.com/cecchimacnaughton" target="_blank"></a>
        <a class="social" id="el" title="Elance" href="https://www.elance.com/s/cecchi/" target="_blank"></a>
        <a class="social" id="msn" title="MSN" href="http://profile.live.com/cid-2a8be1d1a818720a" target="_blank"></a>
        <a class="social" id="li" title="LinkedIn" href="http://www.linkedin.com/profile/view?id=134952624" target="_blank"></a>
        <a class="social" id="da" title="DeviantArt" href="http://piiom.deviantart.com" target="_blank"></a>
      </div>
      <div><a id="info">web developer &bull; boston, ma &bull; <span id="email"></span></a></div>
    </div>
    <div id="slugline"></div>
    <div id="content"></div>
    <div id="footer"></div>
  </div>
</body>
</html>