<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Cecchi MacNaughton</title>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
<script type="text/javascript">
var min = 135;
var max = 290;
var diff = max-min;
function draw() {
	var last = $('.column:last');
	if(!last.size() || (last.offset().left+(last.width()*2)) < $(document).width()) {
		$('<div class="column"></div>').appendTo($('body')).animate({'height' : min+Math.floor(Math.random()*diff)});
		setTimeout('draw()', 3);
	}
}
$(document).ready(function() {
	draw(0);
});
</script>
<style type="text/css">
body{
	margin: 0px;
	padding: 0px;
}
.column {
	background: #7B1250;
	float: left;
	width: 3px;
	margin-right: 1px;
}
#name {
	z-index: 10;
	color: #FFFFFF;
	position: absolute;
	font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
	font-size: 100px;
	width: 100%;
	text-align: center;
}
</style>
</head>

<body>
<div id="name">CECCHI MACNAUGHTON</div>
</body>
</html>