<?php
include('../includes/colors.php');
// CSS
$css = '
.site {
	margin-top: 70px;
	min-height: 270px;
}
.left {
	float: left;
	width: 344px;
	text-align: right;
	margin-right: 25px;
}
.left a {
	font-size: 16px;
}
.left a:hover {
	color: '.$secondary.'
}
.left a b {
	font-size: 24px;
	font-weight: normal;
}
.left img {
	margin-top: 10px;
	border: 2px solid '.$secondary.';
}
.right {
	padding-top: 4px;
}
.more {
	margin-top:	10px;
	text-align: center;
}
.more a {
	color: '.$tertiary.'
}
';

// SLUGLINE
$slug = 'Welcome to my personal website. I\'m a sophomore working on a degree in Computer Science at Northeastern.';

// HTML
ob_start();
?>
<br />
<br />
This is just an old design for this website; I don't maintain this version.
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
		'css'		=> $css,
		'slug'	=> $slug,
		'html'	=> $html
	)
);
?>