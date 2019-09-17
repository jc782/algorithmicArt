// Prints the PDF file when requested
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

         var db = firebase.firestore();
         var stri = String(newArr);
          db.collection("orders").add({
            string: stri ,
            })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
};

// returns palette color
function palette(color) {
  // euclidean distance calc on set colours
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
  // Return final value
  return { r: newR, g: newG, b: newB, a: 255, c: c };
}

// calculate the error
function calculateQuantError(o, n) {
  //var oc = parseInt((o.r + o.g + o.b) / 3),
//      nc = parseInt((n.r + n.g + n.b) / 3);
    var rError = parseInt(o.r - n.r);
    var gError = parseInt(o.g - n.g);
    var bError = parseInt(o.b - n.b);

  return { r: rError, g: gError, b: bError, a: 255 };
}


// count the number of each color required
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
