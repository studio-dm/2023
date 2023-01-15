<?php

// Enter your e-mail address.
$to = 'example@example.com';

// Go to your-site.com/contact.php?test to send a testing email.
if ( isset($_GET['test']) ) {
	mail($to, 'Message from contact form', 'It\'s working!', 'From: ' . $to . "\r\n");
	die('Testing e-mail has been sent.');
}

// Validate e-mail.
function isValidEmail( $email = null ) {
	return preg_match( "/^
		[\d\w\/+!=#|$?%{^&}*`'~-]
		[\d\w\/\.+!=#|$?%{^&}*`'~-]*@
		[A-Z0-9]
		[A-Z0-9.-]{0,61}
		[A-Z0-9]\.
		[A-Z]{2,6}$/ix", $email
	);
}

// Validate input.
if ( !empty($_POST['name']) && isValidEmail($_POST['email']) && !empty($_POST['text'])) {
	
	// Set e-mail headers.
	$message = $_POST['text'];
	$headers = 'From: ' . $_POST['name'] . ' <' . $_POST['email'] . '>' . "\r\n" . 'Reply-To: ' . $_POST['email'];
	
	// Send e-mail.
	if ( mail($to, 'Message from contact form', $message, $headers) ) echo 'sent';
	
} else {

	echo 'invalid';

}
