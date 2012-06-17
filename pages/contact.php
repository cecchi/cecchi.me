<?php
// CSS
$css = '
#headline {
	margin-bottom: 10px;
}
.row:first-child {
	margin-top: 30px;
}
.row {
	margin-top: 10px;
}
.icon {
	float: left;
	width: 35px;
	height: 33px;
}
#row_name .icon {
	background: url(images/sprite.png) no-repeat -213px -86px;
}
#row_email .icon {
	background: url(images/sprite.png) no-repeat -253px -86px;
}
#row_subject .icon {
	background: url(images/sprite.png) no-repeat -291px -86px;
}
#row_message .icon {
	background: url(images/sprite.png) no-repeat -329px -86px;
}
label {
	float: left;
	width: 110px;
	padding: 6px;
	cursor: pointer;
}
textarea:focus,
input:focus{
	outline: none;
	border: 1px solid #980204;
	color: #980204;
}
input, textarea {
	background: #FFFFFF;
	border: 1px solid #980204;
	-webkit-border-radius: 2px;
	-moz-border-radius: 2px;
	border-radius: 2px;
	padding: 6px;
	color: #980204;
	font-size: inherit;
}
input {
	width: 230px;
}
textarea {
	position: relative;
	margin-top: 10px;
	width: 946px;
	height: 225px;
	font-family: inherit;
}
#submit {
	margin: 8px 0px 0px 0px;
	float: right;
	width: auto;
	padding: 6px 30px;
	cursor: pointer;
}
#submit.sending {
	border: 1px solid #980204;
	color: #980204;
}
#status {
	margin-top: 45px;
	color: #F2B15C;
	text-align: center;
}
';

// External JS
$extjs = array();

// JS
ob_start();
?>
$('#submit').click(function() {
	if(!$(this).hasClass('sending')) {
    $(this).addClass('sending').val('Sending');
    $.post('ajax/mail.php', {
      contact_name : $('#contact_name').val(),
      contact_email : $('#contact_email').val(),
      contact_subject : $('#contact_subject').val(),
      contact_message : $('#contact_message').val(),
    }, function(data) {
      $('#status').html(data.message);
      if(data.success) {
        $('#submit').fadeOut();
      } else {
        $('#submit').removeClass('sending').attr('value', 'Send \u00BB');
      }
    });
  }
});
<?php
$js = ob_get_contents();
ob_end_clean();

// HTML
ob_start();
?>
<div align="center" id="headline">You can use this page to send me an email; I will usually respond within 24 hours.</div>
<div class="row" id="row_name">
	<div class="icon"></div>
	<label for="contact_name">Your name:</label>
  <input type="text" name="contact_name" id="contact_name" />
</div>
<div class="row" id="row_email">
	<div class="icon"></div>
	<label for="contact_email">Your email:</label>
  <input type="text" name="contact_email" id="contact_email" />
</div>
<div class="row" id="row_subject">
	<div class="icon"></div>
	<label for="contact_subject">Subject:</label>
  <input type="text" name="contact_subject" id="contact_subject" />
</div>
<div class="row" id="row_message">
	<div class="icon"></div>
	<label for="contact_message">Message:</label>
  <textarea  name="contact_message" id="contact_message" />
</div>
<input id="submit" type="button" value="Send &raquo;" />
<div id="status"></div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
    'css'     => $css,
    'js'     	=> $js,
    'extjs'   => $extjs,
    'html'    => $html,
    'arrows'	=> false
	)
);
?>