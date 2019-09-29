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
                  [11, 6, 2, 0,'B'], //black
                  [255, 249, 246, 1,'W'], // white
                  [190, 25, 22, 2,'R'], // red
                  [7, 4, 181, 3,'Bl'], //blue
                  [165, 122, 72, 4,'Go'], // gold
                  [243, 130, 70, 5,'Y'], //yellow
                  [151, 43, 178, 6,'P'], // purple
                  [90, 217, 56, 7,'G'], //green
                  [163, 81, 32, 8, 'Br'], //brown
                  [206, 147, 28, 9, 'O'], //orange
                  [176, 159, 156, 10, 'S'], //silver
                  [245, 143, 204, 11, 'P'], //pink

              ];
//Black, Blue, Brown, Gold, Green, Orange, Pink, Purple, Red, Silver, White & Yellow
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
