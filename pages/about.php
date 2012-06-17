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
	I'm a web developer and designer from Boston. That's all for now, I'll fill this up when I get a chance... check out the other pages!
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