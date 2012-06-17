<?php
require('phpQuery.php');
	
// Is the supplied file a valid PDF?
define('PDF_MAGIC', "\x25\x50\x44\x46\x2D");
function is_pdf($filename) {
  return (file_get_contents($filename, false, null, 0, strlen(PDF_MAGIC)) === PDF_MAGIC) ? true : false;
}

// Define input and output locations
$input = '../input/';
$inputhandle = opendir($input);
if(!$input) {
	throw new Exception('Could not open input directory.');
	exit(1);
}
$count = 0;
$output = array();
while($count < 50 && $input && false !== ($pdf = readdir($inputhandle))) {
	$count++;
	$pathinfo = pathinfo($input.$pdf);
	if($pathinfo['extension'] !== 'pdf') {
		echo "Skipping<br /><br />";
		continue;
	}
	$dir 		= '../output/'.$pathinfo['filename'];
	$thumbs = $dir.'/thumbs';
	$html 	= $dir.'/html';
	$json 	= $dir.'/slideshow.json';
	chmod('../', 0777);
	(!file_exists($dir)) ? mkdir($dir, 0777) && chmod($dir, 0777) : '';
	if(!file_exists($dir)) {
		die("mkdir($dir)");
	}
	(!file_exists($html)) ? mkdir($html, 0777) && chmod($dir, 0777) : '';
	(!file_exists($html)) ? mkdir($html, 0777) && chmod($dir, 0777) : '';
	if(!(file_exists($input.$pdf) && is_pdf($input.$pdf))) {
		//throw new Exception('Invalid PDF: '.$input.$pdf);
	}
	
	// Convert PDF to HTML
	system('java -jar PDFToHTML.jar '.$input.$pdf.' '.$html);
	
	// Convert HTML to JSON
	$doc = phpQuery::newDocumentFileXHTML($html);
	$doc['div.page']->each(function($page, $i) {
		global $output;
		$output[] = array(
			'thumb'	=> '/ebooks/slideshow/'.$pathinfo['filename'].'/thumbs/'.$i.'.png',
			'title'	=> 'TODO: Add Titles',
			'url'		=> '/ebooks/slideshow/'.$pathinfo['filename'].'/html/'.$i.'.html'
		);
		$slide = fopen($html.'/'.$i.'.html');
		fwrite($slide, pq($page)->html());
		fclose($slide);
	});
	
	// Output
	header('Content-type: application/json');
	$save = fopen($json, 'w');
	fwrite($save, json_encode($output));
	fclose($save);
}
?>