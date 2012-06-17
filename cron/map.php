<?php
// Big images = big memory
ini_set('memory_limit', '64M');

// General cURL alternative to file_get_contents()
function return_file($filename, $format='json') {
	$curl=curl_init();
	curl_setopt($curl, CURLOPT_URL, $filename);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt($curl, CURLOPT_VERBOSE, 1);
	curl_setopt($curl, CURLOPT_HEADER, 0);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/'.$format));
	curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');
	$file=curl_exec($curl);
	curl_close($curl);
	return $file;
}

// Get the current position from the Latitude API
$url = 'http://www.google.com/latitude/apps/badge/api?user=-5296287798380899885&type=json';
$data = json_decode(return_file($url), true);
$coordinates = $data['features'][0]['geometry']['coordinates'];

// Get the two images we're going to sew together
$left = imagecreatefrompng('http://maps.googleapis.com/maps/api/staticmap?center='.$coordinates[1].','.($coordinates[0]-.0274).'&zoom=14&size=2000x2000&sensor=false&scale=2');
$right = imagecreatefrompng('http://maps.googleapis.com/maps/api/staticmap?center='.$coordinates[1].','.($coordinates[0]+.0274).'&zoom=14&size=2000x2000&sensor=false&scale=2');
$canvas = imagecreatetruecolor(2557, 1280);

// Copy and start clean up
imagecopy($canvas, $left, 0, 0, 0, 0, imagesx($left), imagesy($right));
imagecopy($canvas, $right, imagesx($left)-3, 0, 0, 0, imagesx($right), imagesy($right));
imagedestroy($left);
imagedestroy($right);

// Darken the image
$over = imagecreatetruecolor(2557, 1280);
imagefill($over, 0, 0, imagecolorallocatealpha($over, 0, 0, 0, 15));
imagecopy($canvas, $over, 0, 0, 0, 0, imagesx($over), imagesy($over));
imagedestroy($over);

// Output and finish clean up
imagepng($canvas, '../images/map.png');
imagedestroy($canvas);
?>