//  define global variables
var can = document.getElementById("canvas"),
    ctx = can.getContext("2d"),
    img = new Image(),
    uploadImg = document.getElementById("upload");
    pushPinCount = [],
    ratio = 1,
    newArr = [],
    newSize = 98,
    newWidth = 0,
    newHeight = 0,
    paperSize = 'a2',
    a = [],
    b = [],
    orient = 1, // 1 is landscape, 0 is portrait
    imageLoader = document.getElementById('imageLoader');

imageLoader.addEventListener('change', handleImage, false);

ctx.drawImage(uploadImg, 120, 100);
ctx.font = "14px Arial";
ctx.fillText("Drop image here", 100, 190);
// select the colors that are available
var colors = [
                  [3, 14, 2, 0,'B', 'Black'], //black
                  [255, 249, 246, 1,'W', 'White'], // white
                  [210, 50, 40, 2,'R', 'Red'], // red
                  [12, 4, 200, 3,'Bl', 'Blue'], //blue
                  [165, 122, 72, 4,'Go', 'Gold'], // gold
                  [239, 229, 59, 5,'Y', 'Yellow'], //yellow
                  [168, 48, 201, 6,'P', 'Purple'], // purple
                  [80, 217, 44, 7,'G', 'Green'], //green
                  [163, 81, 32, 8, 'Br', 'Brown'], //brown
                  [226, 142, 59, 9, 'O', 'Orange'], //orange
                  [245, 143, 204, 10, 'P', 'Pink'], //pink
                  //[158, 152, 156, 10, 'S', 'Silver'], //silver
              ];
//Black, Blue, Brown, Gold, Green, Orange, Pink, Purple, Red, Silver, White & Yellow
// Image upload
function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}
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

 $('.btn-primary').on('click', function(){
    paperSize = $(this).find('input').attr('id');
    switch (paperSize){
        case 'a3':
        newSize = 65;
        break
        case 'a2':
        newSize = 98;
        break
        case 'a1':
        newSize = 135;
        break
    }
});

var signupForm = document.getElementById('signup-form');
   var signupSuccess = document.getElementById('signup-success');
   var signupError = document.getElementById('signup-error');
   var signupBtn = document.getElementById('signup-button');
   var onSignupComplete = function(error) {
     signupBtn.disabled = false;
     if (error) {
       signupError.innerHTML = 'Sorry. Could not signup.';
     } else {
       signupSuccess.innerHTML = 'Thanks for signing up!';
       // hide the form
       signupForm.style.display = 'none';
     }
   };
   function signup(formObj) {
       // Store emails to firebase
       var db = firebase.firestore();
       var emailRef = formObj.email.value;
       db.collection("email").add({
         string: emailRef ,
     }).then(function(emailRef) {
             console.log("Document written with ID: ", emailRef);
         })
         .catch(function(error) {
             console.error("Error adding document: ", error);
         });
       console.log(formObj.email.value);
       signupBtn.disabled = true;
       return false;
   }
