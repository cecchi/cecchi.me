<?php
// CSS
$css = '
#inner {
	overflow: hidden;
}
.project {
	float: left;
	display: none;
	width: 960px;
}
.project.active {
	display: block;
}
.title {
	font-size: 16px;
}
.title b {
	font-size: 24px;
	font-weight: normal;
}
.tabs {
	height: 38px;
}
.tabs a {
	float: left;
	background: #FFFFFF;
	border: 1px solid #920104;
	-webkit-border-radius: 2px;
	-moz-border-radius: 2px;
	border-radius: 2px;
	padding: 0px 7px 2px;
	color: #920104;
	text-shadow: none;
	font-size: 14px;
	line-height: 14px;
	margin: 10px 13px 0px 0px;
	cursor: pointer;
}
.tabs a:hover,
.tabs a.active {
	background: #F2B15C;
}
.purpose {
	text-align: justify;
}
.source, .demo {
	display: none;
}
';

// JS
$js = <<<JS
	$('#left .arrow').addClass('dead');
	$('#right .arrow').removeClass('dead');
	$('.arrow:not(.dead)').live('click', function() {
		var dir = $(this).parent().attr('id') == 'left' ? 1 : -1;
		var active = $('.project.active');
		var next = dir == -1 ? active.next() : active.prev();
		var left = -1*(active.offset().left+active.width());
		var right = $(window).width()-active.offset().left;
		
		console.log("DIR: "+dir);
		console.log("R: "+right);
		console.log("L: "+left);
		
		var speed = 'slow';
		active.animate({
			'left' : (dir == -1 ? left : right)
		}, speed, function() {
				console.log("Slide Out done: "+speed);
			active.slideUp(speed, function() {
				console.log("Slide Up done: "+speed);
				active.removeClass('active');
			});
			next.css('left', (dir == -1 ? right : left)).slideDown(speed, function() {
				console.log("Slide Down done: "+speed);
				$(this).animate({'left' : 0}, speed, function() {
					console.log("Slide In done: "+speed);
				}).addClass('active')
			});
		});
		
		if(!next.next().length) {
			$('#right .arrow').addClass('dead');
		} else {
			$('#right .arrow').removeClass('dead');
		}
		if(!next.prev().length) {
			$('#left .arrow').addClass('dead');
		} else {
			$('#left .arrow').removeClass('dead');
		}
	});
	
	$('.tabs a:not(.active)').live('click', function() {
		console.log("CLICK");
		$(this).addClass('active').siblings().removeClass('active');
		$(this).parent().siblings('.active').slideUp(speed).fadeOut(speed).removeClass('active');
		$(this).parent().siblings('.'+$(this).html().toLowerCase()).slideDown(speed).fadeIn(speed).addClass('active');
	});
JS;

// HTML
ob_start();
?>
<div id="inner">
  <div class="project active">
    <div class="title"><b>C</b>HUNKED-<b>T</b>RANSFER <b>E</b>NCODING WITH <b>AJAX</b></div>
    <div class="tabs">
      <a class="active">Purpose</a>
      <a>Source</a>
      <a>Demo</a>
    </div>
    <div class="purpose active">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae sapien et augue fringilla volutpat a sed nunc. Curabitur quam est, placerat ut dapibus eget, vulputate id ipsum. Aenean lacus arcu, faucibus et sagittis non, tincidunt vitae turpis. Pellentesque non mi odio, eu adipiscing metus. Morbi eu dolor ut metus placerat ullamcorper. Nunc dui metus, porttitor in dictum quis, tincidunt non tortor. Vestibulum in odio nulla. Sed id libero purus. Maecenas in ante ut nisi malesuada placerat quis nec dui. Ut a orci sed dui ultricies fermentum id eget dui.
  
  Curabitur vel urna euismod felis semper commodo. Nullam eros lectus, suscipit nec facilisis pharetra, consectetur sit amet lectus. Quisque sed purus lorem, sed lobortis massa. Vestibulum hendrerit ultrices quam ut ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id orci libero. Aliquam id nisl sapien. Morbi sed turpis nisl. Nam eget massa arcu, et volutpat ante.
    </div>
    <pre class="source">
      This is the source!
    </pre>
    <div class="demo">
    Demo<br />
    Goes<br />
		Here<br />
		!
    </div>
  </div>
  
  <div class="project">
    <div class="title"><b>T</b>EST <b>T</b>WO</div>
    <div class="tabs">
      <a class="active">Purpose</a>
      <a>Source</a>
      <a>Demo</a>
    </div>
    <div class="purpose active">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae sapien et augue fringilla volutpat a sed nunc. Curabitur quam est, placerat ut dapibus eget, vulputate id ipsum. Aenean lacus arcu, faucibus et sagittis non, tincidunt vitae turpis. Pellentesque non mi odio, eu adipiscing metus. Morbi eu dolor ut metus placerat ullamcorper. Nunc dui metus, porttitor in dictum quis, tincidunt non tortor. Vestibulum in odio nulla. Sed id libero purus. Maecenas in ante ut nisi malesuada placerat quis nec dui. Ut a orci sed dui ultricies fermentum id eget dui.
  
  Curabitur vel urna euismod felis semper commodo. Nullam eros lectus, suscipit nec facilisis pharetra, consectetur sit amet lectus. Quisque sed purus lorem, sed lobortis massa. Vestibulum hendrerit ultrices quam ut ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id orci libero. Aliquam id nisl sapien. Morbi sed turpis nisl. Nam eget massa arcu, et volutpat ante.
  
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae sapien et augue fringilla volutpat a sed nunc. Curabitur quam est, placerat ut dapibus eget, vulputate id ipsum. Aenean lacus arcu, faucibus et sagittis non, tincidunt vitae turpis. Pellentesque non mi odio, eu adipiscing metus. Morbi eu dolor ut metus placerat ullamcorper. Nunc dui metus, porttitor in dictum quis, tincidunt non tortor. Vestibulum in odio nulla. Sed id libero purus. Maecenas in ante ut nisi malesuada placerat quis nec dui. Ut a orci sed dui ultricies fermentum id eget dui.
  
  Curabitur vel urna euismod felis semper commodo. Nullam eros lectus, suscipit nec facilisis pharetra, consectetur sit amet lectus. Quisque sed purus lorem, sed lobortis massa. Vestibulum hendrerit ultrices quam ut ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id orci libero. Aliquam id nisl sapien. Morbi sed turpis nisl. Nam eget massa arcu, et volutpat ante.
    </div>
    <pre class="source">
      This is the source!
    </pre>
    <div class="demo">
    Demo<br />
    Goes<br />
		Here<br />
		!
    </div>
  </div>
  
  <div class="project">
    <div class="title"><b>T</b>EST <b>T</b>HREE</div>
    <div class="tabs">
      <a class="active">Purpose</a>
      <a>Source</a>
      <a>Demo</a>
    </div>
    <div class="purpose active">
    Small.
    </div>
    <pre class="source">
      This is the source!
    </pre>
    <div class="demo">
    Demo<br />
    Goes<br />
		Here<br />
		!
    </div>
  </div>
</div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
		'css'			=> $css,
		'js'			=> $js,
		'html'		=> $html,
		'arrows'	=> true
	)
);
?>