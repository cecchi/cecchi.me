<?php
// Files to allow source viewing for. Second parameter specifies GeSHi mode.
$sources = array(
  array('js/point-picking.js', 'GESHI_NEVER'),
  array('js/chunked-transfer.js', 'GESHI_NEVER'),
  array('js/history.js', 'GESHI_NEVER'),
	array('dev/chrome/switchenv/source.js', 'GESHI_NEVER')
);
$map = array(
  'js'  => 'javascript'
);
function map($ext) {
  global $map;
  return isset($map[$ext]) ? $map[$ext] : $ext;
}
function access($path) {
	global $sources;
	foreach($sources as $file) {
		if($file[0] == $path) {
			return $file[1];
		}
	}
	return false;
}

$path = '../'.$_GET['path'];
if(file_exists($path) && $mode = access($_GET['path'])) {
  require_once('geshi.php');
  $info = pathinfo($path);
  $src = new GeSHi(file_get_contents($path), map($info['extension']));
  $src->set_tab_width(1);
	$src->enable_strict_mode($mode == 'GESHI_MAYBE' ? GESHI_MAYBE : ($mode == 'GESHI_NEVER' ? GESHI_NEVER : GESHI_ALWAYS));
	$src->enable_line_numbers(GESHI_FANCY_LINE_NUMBERS);
  echo $src->parse_code();
} else {
  header("HTTP/1.1 404 Not Found");
}
?>