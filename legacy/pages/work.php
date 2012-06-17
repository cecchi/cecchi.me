<?php
include('../includes/colors.php');
// CSS
$css = '
#slugline a {
	color: '.$tertiary.';
}
';

// SLUGLINE
$slug = 'I\'m currently the webmaster for <a href="http://www.adirondackcamp.com">Adirondack Camp</a> and pick up some freelance work when I have the time.';

// HTML
ob_start();
?>

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