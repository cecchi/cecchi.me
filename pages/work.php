<?php
// CSS
$css = '
.arrow {
	position: absolute;
}
#hide {
	overflow: hidden;
}
#inner {
  width: 10000px;
}
.site {
  float: left;
  width: 960px;
	min-height: 270px;
  margin-left: 50px;
	display: none;
}
.site:first-child {
  margin-left: 0px;
	display: block;
}
.left {
	float: left;
	width: 344px;
	text-align: right;
	margin-right: 15px;
	letter-spacing: 1px;
}
.left a {
	font-size: 16px;
	color: inherit;
}
.left a b {
	font-size: 24px;
	font-weight: normal;
}
.left img {
	margin-top: 10px;
	border: 2px solid #920104;
}
.right {
	padding-top: 4px;
	line-height: 140%;
}
.more {
	margin-top:	10px;
	text-align: center;
}
.title {
  font-size: 16px;
}
.title b {
  font-size: 24px;
  font-weight: normal;
}
.tabs {
  height: 38px;
}
.tabs a {
  float: left;
  background: #FFFFFF;
  border: 1px solid #920104;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  padding: 0px 7px 2px;
  color: #920104;
  text-shadow: none;
  font-size: 14px;
  line-height: 14px;
  margin: 10px 13px 0px 0px;
  cursor: pointer;
}
.tabs a:hover,
.tabs a.active {
  background: #F2B15C;
}
.overview {
  text-align: justify;
}
.center {
  text-align: center;
}
';

// External JS
$extjs = array(
  '/extend/jquery.scrollTo.min.js',
  '/extend/jquery.serialScroll.min.js'
);

// JS
$js = <<<JS
JS;

$force = <<<FORCE
  $('#left .arrow').addClass('dead');
  $('#right .arrow').removeClass('dead');
	$('.arrow').css({'top' : $('.site.active').height()/2-16});
	$('.site').show();
	
  $('.arrow:not(.dead)').live('click', function() {
		var dir = $(this).parent().attr('id') == 'left' ? -1 : 1;
		console.log("Trigger: "+(dir == -1 ? 'prev' : 'next'));
		$('#hide').trigger(dir == -1 ? 'prev' : 'next');
  });
  
  $('.tabs a:not(.active, [href])').unbind().live('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
    $(this).parent().siblings('.active').slideUp(speed).removeClass('active');
    $(this).parent().siblings('.'+$(this).html().toLowerCase()).addClass('active').slideDown(speed);
  });
	
  $('#content').serialScroll({
		target    : '#hide',
    items     : '.site',
		axis      : 'x',
		duration  : speed,
		cycle     : false,
		onBefore  : function(e, next) {
			next = $(next);
	    if(next.next().length) {
	      $('#right .arrow').removeClass('dead');
	    } else {
	      $('#right .arrow').addClass('dead');
	    }
	    if(next.prev().length) {
	      $('#left .arrow').removeClass('dead');
	    } else {
	      $('#left .arrow').addClass('dead');
	    }
			$('.site.active').removeClass('active');
			next.addClass('active');
			$('.arrow').animate({'top' : next.height()/2-16}, speed);
		}
  });
FORCE;

// HTML
ob_start();
?>
<div id="hide">
	<div id="inner">
  
		<div class="site active">
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
        <a href="http://www.adirondackcamp.com" target="_blank"><b>A</b>DIRONDACK<b>C</b>AMP.COM</a>
        <a href="http://www.adirondackcamp.com" target="_blank"><img src="http://i47.tinypic.com/nvywzd.png" /></a>
      </div>
      <div class="right">
        is &quot;one of the last grand old, traditional summer camps in USA. Founded over 100 years ago, we focus on personal growth fueled by fun, sports, arts, adventure, and camaraderie.&quot; I am currently the webmaster for this amazing camp that I attended as a child and worked at as a counselor for a couple years following that. As webmaster, I am responsible for everything from development to maintenance to SEO and anything in between.
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
    
	</div>
</div>
<?php
$html = ob_get_contents();
ob_end_clean();

// OUTPUT
header('Content-type: application/json');
echo json_encode(
  array(
    'css'     => $css,
    'js'     	=> $js,
		'force'		=> $force,
    'extjs'   => $extjs,
    'html'    => $html,
    'arrows'	=> true
  )
);
?>