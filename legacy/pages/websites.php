<?php
include('../includes/colors.php');
// CSS
$css = '
.site {
	margin-top: 70px;
	min-height: 270px;
}
.left {
	float: left;
	width: 344px;
	text-align: right;
	margin-right: 25px;
	letter-spacing: 1px;
}
.left a {
	font-size: 16px;
}
.left a:hover {
	color: '.$secondary.'
}
.left a b {
	font-size: 24px;
	font-weight: normal;
}
.left img {
	margin-top: 10px;
	border: 2px solid '.$secondary.';
}
.right {
	padding-top: 4px;
}
.more {
	margin-top:	10px;
	text-align: center;
}
.more a {
	color: '.$tertiary.'
}
';

// SLUGLINE
$slug = 'I enjoy building attractive, user-friendly websites that serve a purpose. Here are some of my projects:';

// HTML
ob_start();
?>
<div class="site">
	<div class="left">
		<a href="http://www.screentunes.com" target="_blank"><b>S</b>CREENTUNES.COM</a>
		<a href="http://www.screentunes.com" target="_blank"><img src="http://i55.tinypic.com/2rmmryc.png" /></a>
	</div>
	<div class="right">
		is a unique tool that uses movies and TV shows as a platform for discovering new music. On a more basic level it is a simple search engine that allows users to enter the name of a song and research what movies or shows that song has been in. You can also do the opposite, entering a movie and seeing its soundtrack. With a library of 325,000 movie-song listings, you are almost sure to find what you are looking for. If you've ever had a song stuck in your head from a movie, and wanted to know the name, you can find it. If you've just seen a movie and thought 'Wow, that had an awesome soundtrack', you can find your favorite songs from the movie. You can also make use of a lyrics search if you are unsure of the song's title. Additional features let you listen to the songs easily directly from the site, or purchase them from iTunes or Amazon.
		<div class="more">
			Read about it:
			<a href="http://news.cnet.com/8301-27076_3-10316379-248.html" target="_blank">cnet.com</a> &bull; 
			<a href="http://www.nytimes.com/external/gigaom/2009/08/21/21gigaom-where-did-i-hear-that-song-ask-screentunes-70758.html" target="_blank">nytimes.com</a> &bull; 
			<a href="http://www.mashable.com/2009/08/30/find-that-song-name/" target="_blank">mashable.com</a> &bull; 
			<a href="http://www.artistdirect.com/screentunes" target="_blank">artistdirect.com</a>
		</div>
	</div>
</div>

<div class="site">
	<div class="left">
		<a href="http://www.finale.fm" target="_blank"><b>F</b>INALE.FM</a>
		<a href="http://www.finale.fm" target="_blank"><img src="http://i54.tinypic.com/15nlny8.png" /></a>
	</div>
	<div class="right">
		gives music lovers another reason to buy music. For the same price they would pay for music from iTunes, Amazon, or 7Digital, they can download the songs and albums they love and give to the causes they support at the same time. 10% of every single purchase is donated to any of nearly a million nonprofits. With a catalog of over 17 million tracks and 1.6 million albums, there is little reason to choose another music store. 
		<div class="more">
			Launching soon.
		</div>
	</div>
</div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
	array(
		'css'		=> $css,
		'js'		=> '',
		'slug'	=> $slug,
		'html'	=> $html
	)
);