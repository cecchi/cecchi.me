/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';
console.log(PDFJS);

var TextLayerBuilder = function textLayerBuilder(textLayerDiv) {
  this.textLayerDiv = textLayerDiv;

  this.beginLayout = function textLayerBuilderBeginLayout() {
    this.textDivs = [];
    this.textLayerQueue = [];
  };

  this.endLayout = function textLayerBuilderEndLayout() {
    var self = this;
    var textDivs = this.textDivs;
    var textLayerDiv = this.textLayerDiv;
    var renderTimer = null;
    var renderingDone = false;
    var renderInterval = 0;
    var resumeInterval = 500; // in ms

    // Render the text layer, one div at a time
    function renderTextLayer() {
      if (textDivs.length === 0) {
        clearInterval(renderTimer);
        renderingDone = true;
        return;
      }
      var textDiv = textDivs.shift();
      if (textDiv.dataset.textLength > 0) {
        textLayerDiv.appendChild(textDiv);

        if (textDiv.dataset.textLength > 1) { // avoid div by zero
          // Adjust div width (via letterSpacing) to match canvas text
          // Due to the .offsetWidth calls, this is slow
          // This needs to come after appending to the DOM
          textDiv.style.letterSpacing =
            ((textDiv.dataset.canvasWidth - textDiv.offsetWidth) /
              (textDiv.dataset.textLength - 1)) + 'px';
        }
      } // textLength > 0
    }
    renderTimer = setInterval(renderTextLayer, renderInterval);

    // Stop rendering when user scrolls. Resume after XXX milliseconds
    // of no scroll events
    var scrollTimer = null;
    function textLayerOnScroll() {
      if (renderingDone) {
        window.removeEventListener('scroll', textLayerOnScroll, false);
        return;
      }

      // Immediately pause rendering
      clearInterval(renderTimer);

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function textLayerScrollTimer() {
        // Resume rendering
        renderTimer = setInterval(renderTextLayer, renderInterval);
      }, resumeInterval);
    }; // textLayerOnScroll

    window.addEventListener('scroll', textLayerOnScroll, false);
  }; // endLayout

  this.appendText = function textLayerBuilderAppendText(text,
                                                        fontName, fontSize) {
    var textDiv = document.createElement('div');

    // vScale and hScale already contain the scaling to pixel units
    var fontHeight = fontSize * text.geom.vScale;
    textDiv.dataset.canvasWidth = text.canvasWidth * text.geom.hScale;

    textDiv.style.fontSize = fontHeight + 'px';
    textDiv.style.fontFamily = fontName || 'sans-serif';
    textDiv.style.left = text.geom.x + 'px';
    textDiv.style.top = (text.geom.y - fontHeight) + 'px';
    textDiv.textContent = text.str;
    textDiv.dataset.textLength = text.length;
    this.textDivs.push(textDiv);
  };
};

PDFJS.getPdf('sample/_the_timing_of_cell_division__68.pdf', function getPdfHelloWorld(data) {
	console.log("callback");
  //
  // Instantiate PDFDoc with PDF data
  //
  var pdf = new PDFJS.PDFDoc(data);
  var page = pdf.getPage(1);
  var scale = 1.5;

  //
  // Prepare canvas using PDF page dimensions
  //
  var canvas = document.getElementById('the-canvas');
  var context = canvas.getContext('2d');
  canvas.height = page.height * scale;
  canvas.width = page.width * scale;
	
	console.log("build text layer...");
	
	var textLayerDiv = null;
	if (!PDFJS.disableTextLayer) {
		textLayerDiv = document.createElement('div');
		textLayerDiv.className = 'textLayer';
		document.getElementById('container').appendChild(textLayerDiv);
	}
	var textLayer = textLayerDiv ? new TextLayerBuilder(textLayerDiv) : null;

  //
  // Render PDF page into canvas context
  //
	console.log("start rendering");
	page.startRendering(context, function() {}, textLayer);
	//page.startRendering(context)
});

