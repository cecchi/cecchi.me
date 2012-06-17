<?php
// CSS
$css = '
.blurb {
	font-size: 18px;
}
';

// HTML
ob_start();
?>
<div class="blurb">
	Hey, it's me!
</div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
		'css'			=> $css,
		'js'			=> '',
		'html'		=> $html,
		'arrows'	=> false
	)
);
?>