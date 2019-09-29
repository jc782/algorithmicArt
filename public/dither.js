//  define global variables
var can = document.getElementById("canvas"),
    ctx = can.getContext("2d"),
    img = new Image(),
    pushPinCount = [],
    ratio = 1,
    newArr = [],
    newSize = 65,
    newWidth = 0,
    newHeight = 0,
    orient = 1; // 1 is landscape, 0 is portrait

// select the colors that are available
var colors = [
                  [10, 7, 0, 0,'B'], //black
                  [219, 193, 204, 1,'W'], // white
                  [173, 47, 19, 2,'R'], // red
                  [21, 101, 149, 3,'B'], //blue
                  [165, 122, 72, 4,'Go'], // gold
                  [215, 156, 52, 5,'Y'], //yellow
                  [84, 34, 90, 6,'P'], // purple
                  [24, 117, 20, 7,'G'], //green
                  [106, 53, 7, 8, 'Br'], //brown
                  [206, 147, 28, 9, 'Bl'], //orange
              ];

// drag-n-drop
function preventAction(e) {
  e.stopPropagation();
  e.preventDefault();
}
function onDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  if (!file.type.match(/image.*/)) return;
  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(e) {
      img.src = e.target.result;
    }
  })(file);
  reader.readAsDataURL(file);
}
can.addEventListener('dragenter', preventAction, false);
can.addEventListener('dragleave', preventAction, false);
can.addEventListener('dragover', preventAction, false);
can.addEventListener('drop', onDrop, false);


// dither image when loaded
img.addEventListener("load", function () {

    //Reset certain things
  pushPinCount = [];
  newArr = [];

  // present image size
  var w = this.width, h = this.height;

  // resize the image
  ratio = w/h;
  // set the newsize larger dimension to be as requested to fit a3 paper
  if (ratio < 1){
      orient = 0;
      if (ratio < 0.69){
          newHeight = newSize;
          newWidth = Math.round(newHeight * ratio);
      } else {
          newWidth = Math.round(newSize/1.468);
          newHeight = Math.round(newWidth / ratio);
      }
  } else {
      orient = 1;
      if (ratio > 1.468){
          newWidth = newSize;
          newHeight = Math.round(newWidth / ratio);
      } else {
          newHeight = Math.round(newSize/1.468);
          newWidth = Math.round(newHeight * ratio);
      }
  }
  // correct canvas size
  can.setAttribute("width", newWidth);
  can.setAttribute("height", newHeight);

  // draw the image so we can extract the data
  ctx.drawImage(this, 0, 0, newWidth, newHeight);

  // extract the image data and pixel array
  var imageData = ctx.getImageData(0, 0, newWidth, newHeight),
      data = imageData.data,
      len = data.length,
      i = 0;

  // loop through all pixels and apply dither
  for( ; i < len; i+=4) {

    // get RGBA for the current pixel
    var oldColor = {
      r: data[i+0],
      g: data[i+1],
      b: data[i+2],
      a: data[i+3]
    };

    // convert RGBA to palette color
    var newColor = palette(oldColor);

    // apply the new color
    data[i+0] = newColor.r;
    data[i+1] = newColor.g;
    data[i+2] = newColor.b;
    data[i+3] = newColor.a;

    pushPinCount.push(newColor.c);

    // calculate color difference
    var qe = calculateQuantError(oldColor, newColor);

    try {
      data[i+0+4] += 7/16 * qe.r;
      data[i+1+4] += 7/16 * qe.g;
      data[i+2+4] += 7/16 * qe.b;
    } catch(e) {}
    try {
      data[i+0-4+w*4] += 3/16 * qe.r;
      data[i+1-4+w*4] += 3/16 * qe.g;
      data[i+2-4+w*4] += 3/16 * qe.b;
    } catch(e) {}
    try {
      data[i+0+w*4] += 5/16 * qe.r;
      data[i+1+w*4] += 5/16 * qe.g;
      data[i+2+w*4] += 5/16 * qe.b;
    } catch(e) {}
    try {
      data[i+0+4+w*4] += 1/16 * qe.r;
      data[i+1+4+w*4] += 1/16 * qe.g;
      data[i+2+4+w*4] += 1/16 * qe.b;
    } catch(e) {}
  }


  // put the data back
  ctx.putImageData(imageData, 0, 0);
  //create a Table Object

  while(pushPinCount.length) newArr.push(pushPinCount.splice(0,newWidth));

  var rowNum = 0;
  var colNum = 0;
  var xCen, yCen;
  var radius = window.innerWidth/(newWidth*5);
  can.setAttribute("width", newWidth*2*radius);
  can.setAttribute("height", newHeight*2*radius);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, can.width, can.height);
  for (let row of newArr) {
      rowNum = rowNum + 1;
      colNum = 0;
      for (let cell of row) {
          colNum = colNum + 1;
          var yCen = rowNum * 2* radius;
          var xCen = colNum * 2* radius;
          ctx.beginPath();
          ctx.arc(xCen, yCen, radius, 0, 2 * Math.PI, false);
          var fillStyle = [colors[cell][0], colors[cell][1], colors[cell][2]];
          ctx.fillStyle = 'rgb(' +colors[cell][0] +', '+ colors[cell][1] +', ' + colors[cell][2]+ ')';
          ctx.fill();
  }
 }
 });
