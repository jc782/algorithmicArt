/////////////////////////////////////////////////
// Floyd-Steinberg dithering
// @carlcalderon
/////////////////////////////////////////////////

// store stuff
var can = document.getElementById("canvas"),
    ctx = can.getContext("2d"),
    img = new Image(),
    pushPinCount = [];
    newArr = [];
    newSize = [];
    newWidth = [];
    newHeight = [];


let button = document.querySelector('button');
button.addEventListener('click', printPDF)

function printPDF(){
    const pdf = new jsPDF('l', 'mm', 'a3');
    var ypos = (297/2)-6*(newHeight/2);
    console.log(newSize);
    pdf.setFontSize(6);
    for (let row of newArr) {
        var xpos = (420/2)-6*(newWidth/2);
        for (let cell of row) {
            var text = cell.toString();
            switch(text){
                case "0":
                //pdf.setTextColor(10, 7, 0);
                pdf.text(xpos,ypos,'Bl');
                break;
                case "1":
                //pdf.setTextColor(219, 193, 204);
                pdf.text(xpos,ypos,'W');
                break;
                case "2":
                //pdf.setTextColor(173, 47, 19);
                pdf.text(xpos,ypos,'R');
                break;
                case "3":
                //pdf.setTextColor(21, 101, 149);
                pdf.text(xpos,ypos,'B');
                break;
                case "4":
                //pdf.setTextColor(165, 122, 72);
                pdf.text(xpos,ypos,'Go');
                break;
                case "5":
                //pdf.setTextColor(215, 156, 52);
                pdf.text(xpos,ypos,'Y');
                break;
                case "6":
                //pdf.setTextColor(84, 34, 90);
                pdf.text(xpos,ypos,'P');
                break;
                case "7":
                //pdf.setTextColor(24, 117, 20);
                pdf.text(xpos,ypos,'G');
                break;
                case "8":
                //pdf.setTextColor(106, 53, 7);
                pdf.text(xpos,ypos,'Br');
                break;
                case "9":
                //pdf.setTextColor(206, 147, 28);
                pdf.text(xpos,ypos,'O');
                break;
                default:
                pdf.setTextColor(0, 0, 0);
            }
            xpos = xpos + 6;
            };
            ypos = ypos + 6;
        };
          pdf.save()
};


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

// returns palette color
function palette(color) {
  // euclidean distance calc on set colours
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
  var i;
  var c;
  var error = 1000000000;
  var loop = colors.length;
  for (i=0; i<loop; i++){
      ssqError = Math.pow((color.r-colors[i][0]),2) +
                 Math.pow((color.g-colors[i][1]),2) +
                 Math.pow((color.b-colors[i][2]),2);
      if (ssqError < error){
          error = ssqError;
          newR = parseInt(colors[i][0]);
          newG = parseInt(colors[i][1]);
          newB = parseInt(colors[i][2]);
          c = parseInt(colors[i][3]);
      };

  };


  // floor to nearest in set
  /*
  factor = 1;
  var newR = parseInt(Math.round(factor * color.r/255) * (255/factor));
  var newG = parseInt(Math.round(factor * color.g/255) * (255/factor));
  var newB = parseInt(Math.round(factor * color.b/255) * (255/factor));
*/

  // Return final value
  return { r: newR, g: newG, b: newB, a: 255, c: c };
}

// get difference
function calculateQuantError(o, n) {
  //var oc = parseInt((o.r + o.g + o.b) / 3),
//      nc = parseInt((n.r + n.g + n.b) / 3);
    var rError = parseInt(o.r - n.r);
    var gError = parseInt(o.g - n.g);
    var bError = parseInt(o.b - n.b);

  return { r: rError, g: gError, b: bError, a: 255 };
}
function countArray(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    console.log(a);
    console.log(b);
    return [a, b];
}

// dither image when loaded
img.addEventListener("load", function () {

    //Reset certain things
  pushPinCount = [];
  newArr = [];

  // shorthands
  var w = this.width, h = this.height;

  // resize the image
  newSize = 37;
  ratio = w/h;
  newHeight = newSize;
  newWidth = newSize * ratio;


  // correct canvas size
  can.setAttribute("width", newWidth);
  can.setAttribute("height", newHeight);

  // draw the image so we can extract the data
 // ctx.drawImage(this, 0, 0, w, h, 0, 0, newWidth, newHeight);
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

    // apply differences to surrounding pixels.
    // the try..catch statements just ignores
    // edge cases. it's a codepen, not a lib :)
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
// let tempArr = pushPinCount;
//  let result = countArray(tempArr);

  while(pushPinCount.length) newArr.push(pushPinCount.splice(0,newWidth));
  let table = document.createElement('table');

  for (let row of newArr) {
      table.insertRow();
      for (let cell of row) {
          let newCell = table.rows[table.rows.length - 1].insertCell();
          newCell.textContent = cell;
  }
 }


//append the compiled table to the DOM
document.body.appendChild(table);

  });
