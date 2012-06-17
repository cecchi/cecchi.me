<?php
include('../includes/colors.php');
header('Content-type: text/css');
?>
body {
	margin: 0px;
	padding: 0px;
	background: <?=$primary?>;
	color: <?=$secondary?>;
	font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
	letter-spacing: 1px;
	line-height: 150%;
	font-size: 15px;
  overflow-y: scroll;
}
a {
	text-decoration: none;
	color: inherit;
}
#stage {
	width: 1000px;
	text-align: left;
	position: relative;
	left: 50%;
	margin-left: -500px;
}
#navigation {
	position: absolute;
	top: 0px;
	right: 0px;
	text-align: right;
	border-right: 2px solid <?=$secondary?>;
	padding: 60px 8px 0px 0px;
}
#navigation a {
	display: block;
	font-size: 18px;
	padding: 6px 0px 3px;
}
#navigation a.active,
#navigation a:hover {
	color: <?=$tertiary?>;
}
#slider {
	background: <?=$tertiary?>;
	position: absolute;
	top:	0px;
	right: -2px;
	width: 2px;
	height: 0px;
}
#header {
	padding-top: 30px;
}
#header div:first-child {
	cursor: default;
  width: 545px;
}
#name {
	background: url(../images/sprite.png) no-repeat 315px 1px;
	font-size: 30px;
	letter-spacing: normal;
  padding-right: 45px;
  position: relative;
  z-index: 10;
}
.social {
	width: 32px;
  height: 32px;
  display: inline-block;
  position: relative;
  top: 3px;
  cursor: pointer;
  z-index: 0;
}
.social#fb {
	background: url(../images/sprite.png) no-repeat -37px -2px;
  left: -42px;
}
.social#el {
	background: url(../images/sprite.png) no-repeat -37px -42px;
  left: -80px;
}
.social#msn {
	background: url(../images/sprite.png) no-repeat -37px -82px;
  left: -118px;
}
.social#li {
	background: url(../images/sprite.png) no-repeat -37px -122px;
  left: -156px;
}
.social#da {
	background: url(../images/sprite.png) no-repeat -37px -162px;
  left: -194px;
}
#info {
	padding-left: 2px;
  line-height: 30px;
}
#slugline {
  letter-spacing: normal;
	margin-top: 84px;
}
#content {
  letter-spacing: normal;
  line-height: 140%;
}
#footer {
	height: 25px;
}