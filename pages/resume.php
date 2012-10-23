<?php
// CSS
$css = '
#headline {
	margin-bottom: 10px;
}
.title {
  font-size: 16px;
}
.title b {
  font-size: 24px;
  font-weight: normal;
}
.indent {
	margin: 0px 0px 30px 15px;
}
.indent .indent {
	margin-bottom: 0px;
	font-size: 13px;
}
.right {
	float: right;
}
.narrow .right {
	/*width: 600px;*/
}
ul {
	margin: 0px;
}
';

// External JS
$extjs = array();

// JS
$js = <<<JS

JS;

// HTML
ob_start();
?>
<div align="center" id="headline">Download a printer-friendly copy <a href="/files/resume.pdf">here</a>.</div>
<div class="title"><b>E</b>DUCATION</div>
<div class="indent">
	<div>
	  <div class="right">Sept. 2010 - Present</div>
		<div>Northeastern University, Boston, MA</div>
	  <div class="indent">
	  	Candidate for a B.S. in Computer Science<br />
	    Graduating in 2015 (Currently on Leave of Absense)
	  </div>
  </div>
</div>

<div class="title"><b>T</b>ECHNICAL <b>K</b>NOWLEDGE</div>
<div class="indent narrow">
  <div>
	  <div class="right">HTML5 &amp; CSS3/LESS, XML</div>
	  <div>Markup Languages:</div>
  </div>
  <div>
	  <div class="right">JavaScript, PHP, AJAX</div>
	  <div>Scripting Languages:</div>
  </div>
  <div>
    <div class="right">Node.JS, Phantom/CasperJS, Meteor</div>
    <div>JavaScript Dialects:</div>
  </div>
  <div>
    <div class="right">Java, Scheme (Lisp), ACL2s, C</div>
    <div>Programming Languages:</div>
  </div>
  <div>
	  <div class="right">MySQL, Redis</div>
	  <div>Query Languages &amp; Databases:</div>
  </div>
  <div>
    <div class="right">jQuery, AngularJS, Underscore, PopcornJS, EtherpadLite</div>
    <div>Libraries &amp; Tools</div>
  </div>
  <div>
	  <div class="right">Windows, Mac OSX, Linux, Android</div>
	  <div>Platforms:</div>
  </div>
</div>

<div class="title"><b>E</b>XPERIENCE</div>
<div class="indent">
  <div>
    <div class="right">Feb. 2012 - June 2012</div>
    <div>Nimblebot - Front End Developer</div>
    <ul class="indent">
      <li>Built a web app interface for a large-scale online interactive textbook platform, included all client-facing HTML and CSS as well as many of the JavaScript modules.</li>
      <li>Combined PopcornJS and Meteor to build a live, interactive, web show for Boston.com. Viewers interact with the live stream in numerous ways and that data is propagated to other viewers and the host instantly.</li>
      <li>Developed the JavaScript application structure around PopcornJS for ReactVid.com, a web platform for crowd-sourced fact-checking for political campaign ads.</li>
    </ul>
  </div>
  <div>
    <div class="right">Feb. 2011 - Current</div>
    <div>Adirondack Camp - Webmaster</div>
    <ul class="indent">
      <li>Led marketing efforts for the <a href="http://www.adirondackcamp.com" target="_blank">AdirondackCamp.com</a>, generating leads for new campers and staff, while managing the general upkeep of the site on a day-to-day basis.</li>
      <li>Collaborated with another developer team to aid in the creation of an entirely new website.</li>
    </ul>
  </div>
	<div>
		<div class="right">2009 - Present</div>
		<div>Contracted Web Development</div>
	  <ul class="indent">
	    <li>Created an online merchant application for <a href="http://www.cpay.com" target="_blank">CPay.com</a>, a credit card processor.</li>
	    <li>Updated <a href="http://www.wallmonkeys.com" target="_blank">Wallmonkeys.com</a>, a wall graphics company, adding nearly 10 million products to their catalog and extending their services to Google Base and Amazon, as well as developing an in-room preview feature for their graphics.</li>
	    <li>Revised <a href="http://www.yourcollage.co.uk" target="_blank">YourCollage.co.uk</a>, including creating a new uploading system for images and integrating the checkout process across a number of sister sites.</li>
	    <li>Added a job search feature to <a href="http://www.dentalassistant.net" target="_blank">DentalAssistant.net</a> pulling listings from <a href="http://www.indeed.com" target="_blank">Indeed.com.</a></li>
	    <li>Developed a database for <a href="http://www.foreclosurezine.com" target="_blank">ForeclosureZine.com</a> to manage their client leads.</li>
	    <li>Built a deal aggregator for <a href="http://www.freemania.net" target="_blank">FreeMania.net</a> that retrieves deals from various sources daily.</li>
	  </ul>
	</div>
	<div>
		<div class="right">2008 - Present</div>
		<div>Personal Web Projects</div>
	  <ul class="indent">
	    <li>Developed <a href="http://www.screentunes.com" target="_blank">ScreenTunes.com</a>, a web service that allows users to search movie soundtracks. It was featured on <a href="http://www1.salon.com/tech/giga_om/online_video/2009/08/21/where_did_i_hear_that_song_ask_screentunes/index.html" target="_blank">Salon.com</a>, <a href="http://news.cnet.com/8301-27076_3-10316379-248.html" target="_blank">CNet.com</a>, <a href="http://www.nytimes.com/external/gigaom/2009/08/21/21gigaom-where-did-i-hear-that-song-ask-screentunes-70758.html" target="_blank">NYTimes.com</a>, <a href="http://www.mashable.com/2009/08/30/find-that-song-name/" target="_blank">Mashable.com</a> and several others. A special widget was designed for use by <a href="http://www.artistdirect.com/screentunes" target="_blank">ARTISTdirect.com</a>, a leading music site.</li>
	    <li>Created <a href="http://www.finale.fm" target="_blank">Finale.fm</a>, a music downloading site where users can donate a portion of what they spend on music to charity.</li>
	    <li>Administered a gaming fan site with 30,000+ members; developed many features including a <a href="http://www.youtube.com/watch?v=He0D3tToNYI" target="_blank">popular graphing system</a> for game item prices with about 75,000 unique users and over 10 million recorded data points.</li>
      <li>Built a system for implementing chunked-transfer encoded responses through AJAX for long-lived requests</li>
      <li>Designed a JavaScript/HTML5 impementation of polygon triangulation and point-picking.</li>
	  </ul>
	</div>
</div>

<div class="title"><b>I</b>NTERESTS</div>
<div class="indent">
  <ul class="indent">
    <li>Soccer: Played for a regional club team and was the captain of high school's varsity team. Has continued to play  in a few men's leagues.</li>
    <li>Rock Climbing: Started climbing at age 11 and have continued climbing indoors and outdoors.</li>
    <li>Hiking: Hiked in the Adirondacks extensively as well as the White Mountains, and internationally when possible.</li>
  </ul>
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
    'extjs'   => $extjs,
    'html'    => $html,
    'arrows'	=> false
  )
);
?>