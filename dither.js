//  define global variables
var can = document.getElementById("canvas"),
    ctx = can.getContext("2d"),
    canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),
    img = new Image(),
    pushPinCount = [],
    ratio = 1,
    newArr = [],
    newSize = 45,
    newWidth = 45,
    newHeight = 45,
    orient = 1; // 1 is landscape, 0 is portrait

// select the colors that are available
var colors = [
                  [10, 7, 0,0], //black
                  [219, 193, 204,1], // white
                  [173, 47, 19,2], // red
                  [21, 101, 149,3], //blue
                  [165, 122, 72,4], // gold
                  [215, 156, 52,5], //yellow
                  [84, 34, 90, 6], // purple
                  [24, 117, 20, 7], //green
                  [106, 53, 7, 8], //brown
                  [206, 147, 28, 9], //orange
              ];


let button = document.querySelector('button');
button.addEventListener('click', printPDF)

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
  console.log(ratio);
  // set the newsize larger dimension to be as requested
  if (ratio < 1){
      orient = 0;
      newHeight = newSize;
      newWidth = Math.round(newSize * ratio);
  } else {
      orient = 1;
      newWidth = newSize;
      newHeight = Math.round(newSize / ratio);
  }
  console.log(newWidth);
  console.log(newHeight);

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
  let table = document.createElement('table');

  var rowNum = 0;
  var colNum = 0;
  var xCen, yCen;
  var radius = 3;
  canvas.setAttribute("width", newWidth*2*radius+5);
  canvas.setAttribute("height", newHeight*2*radius+5);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let row of newArr) {
      table.insertRow();
      rowNum = rowNum + 1;
      colNum = 0;
      for (let cell of row) {
          colNum = colNum + 1;
          let newCell = table.rows[table.rows.length - 1].insertCell();
          newCell.textContent = cell;
          var yCen = rowNum * 6;
          var xCen = colNum * 6;
          context.beginPath();
          context.arc(xCen, yCen, radius, 0, 2 * Math.PI, false);
          switch(cell){
              case 0:
              context.fillStyle = 'rgb(10, 7, 0)';
              break;
              case 1:
              context.fillStyle = 'rgb(219, 193, 204)';
              break;
              case 2:
              context.fillStyle = 'rgb(173, 47, 19)';
              break;
              case 3:
              context.fillStyle = 'rgb(21, 101, 149)';
              break;
              case 4:
              context.fillStyle = 'rgb(165, 122, 72)';
              break;
              case 5:
              context.fillStyle = 'rgb(215, 156, 52)';
              break;
              case 6:
              context.fillStyle = 'rgb(84, 34, 90)';
              break;
              case 7:
              context.fillStyle = 'rgb(24, 117, 20)';
              break;
              case 8:
              context.fillStyle = 'rgb(106, 53, 7)';
              break;
              case 9:
              context.fillStyle = 'rgb(206, 147, 28)';
              break;
              default:
              context.fillStyle = 'rgb(6, 147, 28)';
          }
          context.fill();
  }
 }


//append the compiled table to the DOM
document.body.appendChild(table);

  });
