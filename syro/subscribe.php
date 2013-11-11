<?php
function error($message) {
    header('Content-Type: application/json;');
    die(json_encode(array(
        'error' => $message
    )));
}

$email = 'cecchi.macnaughton@gmail.com';

try {
    require_once('libraries/Mailchimp.php');
    $mc       = new Mailchimp();
    $response = $mc->lists->subscribe('16e15ccab5', array('email' => $email), null, 'html', false);

    header('Content-Type: application/json;');
    die(json_encode(array(
        'error'     => false,
        'response'  => $response
    )));
} catch(Exception $e) {
    error($e->getMessage());
}