/**
 * HTML5 History API Implementation
 * (c) 2011, Cecchi MacNaughton
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 * Comments: This is a basic implementation of the HTML5 History API. Using the popstate event
 *           it is possible to change the active page's URL without reloading the page.
 **/
 
var slide = { enabled : true };
var speed = 1500;
var hist = window.history && window.history.pushState;

/* This method contains all the logic for changing pages. In my case I slide up the previous
 * content, load all the stuff I need via AJAX, and execute whatever JavaScript is needed
 * by that page. A typical response might look like this: http://cecchi.me/pages/contact.php
 */
function goto(page) {
  /* This doesn't have to do with the History API but it's nifty nonetheless. This bit
   * will load the contents of a template page in seamlessly and execute the necessary
   * JavaScript asynchronously just as a browser would if it were loading the page for
   * the first time. The other stuff is just plugging in the HTML/CSS and some special
   * effects.
   */
  $.getJSON('pages/'+page.substr(1)+'.php', function(data) {
    $('#stage').slideUp(speed, function() {
      $('#css').remove();
      $('head').append($('<style type="text/css" id="css">'+data.css+'</style>'));
      $('#stage').html(data.html);
      $('.extjs').remove();
      var ii = 0;
      (function js(i) {
        i = i == undefined ? ii : i;
        if(data.extjs && data.extjs.length > i) {
          $.getScript(data.extjs[i], function() {
            js(i+1);
          });
        } else if(data.js) {
          eval(data.js);
        }
      })();
      $(this).slideDown(speed);
      if(data.arrows) {
        $('.arrow').stop(true).fadeIn(speed);
      }
    });
    if(!data.arrows) {
      $('.arrow').stop(true).fadeOut(speed);
    }
  });
}
$(window).load(function() {
  // Pagination
  $('.link').click(function() {
    var page = $(this).attr('href');
    if((page != location.pathname && '#'+page.substr(1) != window.location.hash)) {
      // If the user's browser supports the History API, push the current state.
      // Otherwise, fall back to using the hash (#)
      hist ? window.history.pushState(page, '', page) : window.location.hash = '#'+page.substr(1);
      goto(page);
    }
    return false;
  });
  
  // Set the page to the correct state
  // This is triggered "every time the active history state changes" (i.e. page load or forward/back button)
  window.onpopstate = function(state) {
    var page = window.location.hash.length > 0 ? '/'.window.location.hash.substr(1) : (window.location.pathname.length ? window.location.pathname : false);
    if(page) { goto(page); }
  };
});