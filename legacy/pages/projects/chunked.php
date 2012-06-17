<?php
include('../../includes/colors.php');
// CSS
$css = '
';

// SLUGLINE
$slug = 'Rawr';

// HTML
ob_start();
?>
Test
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