//  define global variables
var can = document.getElementById("canvas"),
    ctx = can.getContext("2d"),
    img = new Image(),
    uploadImg = document.getElementById("upload");
    pushPinCount = [],
    ratio = 1,
    newArr = [],
    newSize = 65,
    newWidth = 0,
    newHeight = 0,
    orient = 1; // 1 is landscape, 0 is portrait

ctx.drawImage(uploadImg, 120, 100);
ctx.font = "14px Arial";
ctx.fillText("Drop image here", 100, 190);
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
floydSteinDither(img);
 });
