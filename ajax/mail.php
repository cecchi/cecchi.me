<?php
// Last things first
function output($message, $success) {
	header('Content-type: application/json');
	die(json_encode(array(
		'success' => (bool) $success,
		'message' => $message
	)));
}

// Validation & Sanitization
function heal($str) {
	$injections = array(
		'/(\n+)/i',
		'/(\r+)/i',
		'/(\t+)/i',
		'/(%0A+)/i',
		'/(%0D+)/i',
		'/(%08+)/i',
		'/(%09+)/i'
	);
	$str = preg_replace($injections,'',$str);
	return $str;
}

$to = 'me@cecchi.me';
$name = heal($_POST['contact_name']);
$from = filter_var($_POST['contact_email'], FILTER_VALIDATE_EMAIL) ? $_POST['contact_email'] : output("Please enter a valid email addrses", false);
$subject = heal($_POST['contact_subject']);
$message = $_POST['contact_message'];

$headers  = 'From: "'.$name.'" <'.$from.'>'."\r\n";
$headers .= 'Reply-to: "'.$name.'" <'.$from.'>'."\r\n";
$headers .= 'Return-path: :'.$name.'" <'.$from.'>'."\r\n";

if(@mail($to, $subject, $message, $headers)) {
	output("Your message has been sent, I'll get back to you shortly.", true);
} else {
	output("There was an issue sending your message. Please email me at " + $to, false);
}