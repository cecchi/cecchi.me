<?php
include('../includes/colors.php');
// CSS
$css = '
.project {
	margin-top: 70px;
}
.title {
	font-size: 16px;
}
.title b {
	font-size: 24px;
	font-weight: normal;
}
.links {
	height: 38px;
}
.links a {
	float: left;
	background: #FFFFFF;
	border: 1px solid '.$secondary.';
	-webkit-border-radius: 2px;
	-moz-border-radius: 2px;
	border-radius: 2px;
	padding: 0px 7px 2px;
	color: '.$secondary.';
	font-size: 14px;
	line-height: 14px;
	margin: 10px 13px 0px 0px;
	cursor: pointer;
}
.links a:hover,
.links a.active {
	border: 1px solid '.$tertiary.';
	color: '.$tertiary.';
}
';

// SLUGLINE
$slug = 'Freelance work and curiousity have led me to develop a few miscellanious scripts and tools:';

// HTML
ob_start();
?>
<div class="site">
	<div class="project">
    <div class="title"><b>C</b>HUNKED-<b>T</b>RANSFER <b>E</b>NCODING WITH <b>AJAX</b></div>
    <div class="links">
      <a class="link_purpose active">Purpose</a>
      <a class="link_source">Source</a>
      <a class="link_demo">Demo</a>
    </div>
    <div class="purpose">
    AJAX has quickly changed the way rich web apps are developed, and with HTTP 1.1 it is now possible to deliver content as it becomes ready. Unfortunately, chunked-transfer encoding was designed to be implemented by browsers rendering the initial response from a web server, not an AJAX request. This small Javascript snippet allows you to make an AJAX request and apply a callback every time a new chunk is received. One practical application would be an intelligent web-based chat that could toggle between the more standard approach of frequent polling of the server to check for new messages (this is what Facebook and many others do), and a long-lived chunked-transfer connection depending on whether the chat participants are actively chatting. This would minimize requests and decrease latency while the users are active.
    </div>
  </div>
</div>

<div class="site">
	<div class="project">
    <div class="title"><b>I</b>MAGE <b>M</b>ERGING WITH <b>PHP</b></div>
    <div class="links">
      <a class="link_purpose active">Purpose</a>
      <a class="link_source">Source</a>
      <a class="link_demo">Demo</a>
    </div>
    <div class="purpose">
    PHP comes bundled with a fairly powerful image manipulation library, GD, but it lacks some basic useful functions and the syntax is not as sleek as it could be. The purpose of this class is to demonstrate an more object oriented approach to image manipulation, in this case merging 2 images. This class supports chaining to increase readability and limit code length. Functionality includes resizing, stretching, fiting, scaling, reformatting (png, jpg, or gif), and, of course, merging. This class is targeted at uses where you would need to combine 2 images, but can be used for resizing a single image as well.    </div>
  </div>
</div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
		'css'		=> $css,
		'js'		=> '',
		'slug'	=> $slug,
		'html'	=> $html
	)
);
?>