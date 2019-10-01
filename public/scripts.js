// Prints the PDF file when requested
function printPDF(){
    if (orient){
        var aspRat = 'l';
        var ySize = 297,
            xSize = 420;
    } else {
        var aspRat = 'p';
        var ySize = 420,
            xSize = 297;
        };
    const pdf = new jsPDF(aspRat, 'mm', 'a3'); //create an a3 size piece of paper
    var ypos = (ySize/2)-6*(newHeight/2);
    pdf.setFontSize(6);
    for (let row of newArr) {
        var xpos = (xSize/2)-6*(newWidth/2);
        for (let cell of row) {
            var text = cell;
            pdf.text(xpos,ypos,String(colors[text][4]));
            xpos = xpos + 6;
            };
            ypos = ypos + 6;
        };
          // create the tutorial page
          pdf.addPage('a4', 'portrait');
          pdf.setFontSize(12);
          var tutorialText = [];

          tutorialText.push('Thank-you for supporting the dot-art project.');
          tutorialText.push('This page has some custom details for your dot-art project.');
          tutorialText.push('For a general tutorial please see the online tutorial page.');
          tutorialText.push('You will need the following number of stickers.');

          var total =0;
          for (var i=0; i<a.length; i++){
            tutorialText.push(colors[a[i]][5] +': ' + b[i]);
            total = total +b[i];
          };
          tutorialText.push('--------------');
          tutorialText.push('Total: ' + total);
          tutorialText.push(' ');
          tutorialText.push('We appreciate your support. PLease share your final dot-art with us...');

          pdf.text(15, 20, tutorialText);
          pdf.save('Dot-Art.pdf');

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
  var i,
      c,
      error = 1000000000,
      loop = colors.length;

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
    return [a, b];
}
