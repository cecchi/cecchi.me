<?php
// CSS
$css = '
.arrow {
	position: absolute;
}
#hide {
	overflow: hidden;
}
#inner {
  width: 10000px;
}
.project {
  float: left;
  width: 960px;
  margin-left: 50px;
	display: none;
}
.project:first-child {
  margin-left: 0px;
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
.center {
  text-align: center;
}

#canvas {
  background: #F8DBBD;
  border: 2px solid #920104;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  width: 500px;
  height: 400px;
  margin: 5px 0px;
  position: relative;
}
#count {
  width: 50px;
  text-align: right;
}
#tooltip {
  background: #FFCCCC;
  border: 1px solid #990000;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  position: absolute;
  font-size: 10px;
  display: none;
  z-index: 100;
  padding: 1px 3px;
  text-align: left;
  color: #990000;
  text-shadow: 1px 1px 0 #FFFFFF;
}
';

// External JS
$extjs = array(
  '/extend/jquery.scrollTo.min.js',
  '/extend/jquery.serialScroll.min.js',
  '/js/point-picking.js'
);

// JS
$js = <<<JS
JS;

$force = <<<FORCE
  $('#left .arrow').addClass('dead');
  $('#right .arrow').removeClass('dead');
	$('.arrow').css({'top' : $('.project.active').height()/2-16});
	$('.project').show();
	
  $('.arrow:not(.dead)').live('click', function() {
		var dir = $(this).parent().attr('id') == 'left' ? -1 : 1;
		console.log("Trigger: "+(dir == -1 ? 'prev' : 'next'));
		$('#hide').trigger(dir == -1 ? 'prev' : 'next');
  });
  
  $('.tabs a:not(.active, [href])').unbind().live('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
    $(this).parent().siblings('.active').slideUp(speed).removeClass('active');
    $(this).parent().siblings('.'+$(this).html().toLowerCase()).addClass('active').slideDown(speed);
  });
	
	$('#chunked-transfer #go').click(function() {
		$.getScript('js/chunked-transfer.js');
	});
	
  $('#content').serialScroll({
		target    : '#hide',
    items     : '.project',
		axis      : 'x',
		duration  : speed,
		cycle     : false,
		onBefore  : function(e, next) {
			next = $(next);
	    if(next.next().length) {
	      $('#right .arrow').removeClass('dead');
	    } else {
	      $('#right .arrow').addClass('dead');
	    }
	    if(next.prev().length) {
	      $('#left .arrow').removeClass('dead');
	    } else {
	      $('#left .arrow').addClass('dead');
	    }
			$('.project.active').removeClass('active');
			next.addClass('active');
			$('.arrow').animate({'top' : next.height()/2-16}, speed);
		}
  });
FORCE;

// HTML
ob_start();
?>
<div id="hide">
	<div id="inner">
	  <div class="project active">
	    <div class="title"><b>P</b>OLYGON <b>T</b>RIANGULATION AND <b>P</b>OINT <b>P</b>ICKING WITH <b>J</b>AVASCRIPT AND <b>HTML5</b></div>
	    <div class="tabs">
	      <a class="active">Purpose</a>
	      <a href="/js/point-picking.js.src" target="_blank">Source</a>
	      <a>Demo</a>
	    </div>
	    <div class="purpose active">
	    	This script tackles the seemingly trivial task of choosing random points within a simple polygon. As it turns out, the simplest way to achieve this requires a fairly complex algorithm. First the polygon must be decomposed into triangles, which can be completed with an iterative <a href="http://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf" target="_blank">&quot;ear-clipping&quot; algorithm</a>. Essentially the polygon is first analyzed to detect which vertices have convex (greater than 180&deg;) interior angles, and then by taking the cross product of the vectors between non-adjacent vertices it is possible to determine how to safely chop off one triangular section of the polygon, and that process is repeated until only one triangle is left. This will always result in a set of <code>(n-2)</code> triangles where <code>n</code> is the number of vertices. Each triangle is then weighted by relative area (found by <a href="http://softsurfer.com/Archive/algorithm_0101/algorithm_0101.htm#Modern Triangles" target="_blank">using cross products</a> again for efficiency) and randomized points are distributed accordingly to each via a <a href="http://adamswaab.wordpress.com/2009/12/11/random-point-in-a-triangle-barycentric-coordinates/" target="_blank">barycentric coordinate point-picking technique</a>. The demo provides a much clearer interactive walkthrough of the process in action.
	    </div>
	    <div class="demo center">
	      <div id="tooltip"></div>
	      <canvas id="canvas" align="center" width="500" height="400"></canvas>
	      <div id="controls" align="center">
	        <!--<input id="count" type="text" value="500" />-->
	        <input id="reset" type="button" value="Reset" />
	        <input id="populate" type="button" value="Populate" />
	      </div>
	      <div>
	        Click on the canvas to add vertices and draw a polygon, then click the first vertex to close it, or click populate. Drawing a convex shape will create more interesting results. Note: This demo uses HTML5, you will need a modern browser to view it.
	      </div>
	    </div>
	  </div>
	  
	  <div class="project">
	    <div class="title"><b>C</b>HUNKED-<b>T</b>RANSFER <b>E</b>NCODING WITH <b>AJAX</b></div>
	    <div class="tabs">
	      <a class="active">Purpose</a>
  			<a href="/js/chunked-transfer.js.src" target="_blank">Source</a>
	      <a>Demo</a>
	    </div>
	    <div class="purpose active">
	    	AJAX has quickly changed the way rich web apps are developed, and with HTTP 1.1 it is now possible to deliver content as it becomes ready. Unfortunately, <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.6.1">chunked-transfer encoding</a> was primarily designed to be implemented by browsers rendering the initial response from a web server, not an AJAX request. This small Javascript snippet allows you to make an AJAX request and apply a callback every time a new chunk is received. One practical application would be an intelligent web-based chat that could toggle between the more standard approach of frequent polling of the server to check for new messages (this is what Facebook and many others do), and a long-lived chunked-transfer connection depending on whether the chat participants are actively chatting. This would minimize requests and decrease latency while the users are active.
	    </div>
	    <div class="demo" id="chunked-transfer">
      	<div>In this demo, a server-side script will return the weather forcast for a random location every second, for five seconds. Only one connection is opened.</div>
        <input type="button" value="Start &raquo;" id="go" />
	    </div>
	  </div>
    
	  <div class="project">
	    <div class="title"><b>HTML5</b> <b>H</b>ISTORY <b>M</b>ANAGEMENT</div>
	    <div class="tabs">
	      <a class="active">Purpose</a>
  			<a href="/js/history.js.src" target="_blank">Source</a>
	      <a>Demo</a>
	    </div>
	    <div class="purpose active">
	    	One new feature in HTML5 is the ability to manipulate the user's browser history. It is now possible to save the state of the window, and update the URL displayed in the address bar without reloading a page. This means that clean-looking URLs can be maintained, and if the user wants to save a bookmark the page will be reloaded where they left off even if the content was loaded in via AJAX. In addition, the browser's forward and back navigation buttons will trigger an event that can be handled as is seen fit to restore the previous or next page state.
	    </div>
	    <div class="demo">
	    	This site itself is a demo. Navigate the site, and keep an eye on the address bar. You'll notice the site never refreshes, yet the URL is updated to reflect the new state. Try using the forward and back buttons. If you do not have a compatible browser the site will degrade to storing the state in the hash (#) at the end of the URL.
	    </div>
	  </div>
    
	  <div class="project">
	    <div class="title"><b>C</b>HROME <b>E</b>XTENSION FOR <b>E</b>NVIRONMENT <b>S</b>WITCHING</div>
	    <div class="tabs">
	      <a class="active">Purpose</a>
  			<a href="/dev/chrome/switchenv/source.js.src" target="_blank">Source</a>
	      <a>Demo</a>
	    </div>
	    <div class="purpose active">
	    	This extension for the Chrome web browser allows you (well, just me for right now, I may release it publicly later) to easily switch between production and local environments for web projects. When viewing the production version of a project the extension will recognize that and display an icon to allow switching to the local version, and vice versa.
	    </div>
	    <div class="demo">
      	<div>
        Because everyone's local environment is set up differently I have not yet released this extension publicly. The source is available online if you would like to modify it to fit your needs, otherwise I have made a video of the extenion in action. I recommend watching in at least 720p and in full-screen, otherwise it will be nearly impossible to see what is going on. (I just switch environments once or twice, it might be hard to see)
        </div>
        <iframe width="960" height="540" src="http://www.youtube.com/embed/OdNf9rL-uZA?rel=0&amp;hd=1" frameborder="0" allowfullscreen></iframe>
	    </div>
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
    'css'     => $css,
    'js'     	=> $js,
		'force'		=> $force,
    'extjs'   => $extjs,
    'html'    => $html,
    'arrows'	=> true
  )
);
?>