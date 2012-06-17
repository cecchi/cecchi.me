Turnip = (function(options) {
  // Default options
  var defaults = {
    'video' : {
      'url'       : null,
      'element'   : null,
      'autoplay'  : true
    },
    'slideshow' : {
      'path'    : null,
      'element' : null,
      'format'  : 'png'
    }
  }

  // Deep-copying/merging in JS is a no-no, but let's keep our options object
  // somewhat more organized for the client side instead of using _.defaults()
  // See: https://github.com/documentcloud/underscore/issues/162
  this.options = (function deepDefaults(o, d) {
    _.each(d, function(value, key) {
      if(Object.prototype.toString.call(value) == '[object Object]') {
        o[key] = deepDefaults(o[key], d[key]);
      } else if(typeof(o[key]) == 'undefined') {
        o[key] = d[key];
      }
    });
    return o;
  })(options, defaults);

  // Ensure there's a trailing forward slash on the path
  options.slideshow.path = options.slideshow.path.replace(new RegExp('/+$'), '') + '/';

  console.log(options);

  // Alias Sizzle selector library for jQuery portability
  function $() {
    return Sizzle.apply(window, arguments);
  }

  // Popcorn is used here as a document ready event listener
  Popcorn(function() {
    var video = Popcorn.smart(options.video.element, options.video.url);

    // Grab the slide list
    jx.load(options.slideshow.path, function(slides) {
      slides = JSON.parse(slides);

      // Setup slideshow cues
      _.each(slides, function(value, key) {
        console.log(options.cues[key] + ' >> ' + value);
        video.cue(options.cues[key], function() {
          $('#slideshow')[0].src = options.slideshow.path + value;
        });
      });      

      // Autoplay?
      if(options.video.autoplay) {
        video.play();
      }
    });
  });
});