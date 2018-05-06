//NEEDED FOR SOCKET.IO
var socket;
//DO NOT DELETE/CHANGE

//The zoom level of the canvas
var scaleSize = 1;
//Size of the pixels or ratio i.e. 1:1, 2:1
var pixelSize = 1;
//Resolution of the image. MUST BE SQUARE.
var imageSize = 250;

//Array to hold the pixels
var pixels = [];

//variables to hold the count of pixels drawn and the image loaded
var pixelsDrawn = 0;
var img;

//USED TO LOAD IMAGE
function preload() {
  img = loadImage('Toucan.png');
}

function setup() {
  var WIDTH = 501;
  var HEIGHT = 501;
  var canvasDiv = createCanvas(WIDTH, HEIGHT);
  canvasDiv.parent('canvasDiv');
  strokeWeight(0.1);
  //noStroke();
  for (var x = 0; x < imageSize; x+= pixelSize)
  {
    for (var y = 0; y < imageSize; y+=pixelSize)
    {
      c = img.get(x, y);
      var pixel = { "x" : x , "y": y, "r": c[0], "g": c[1], "b": c[2], "painted": 1 }
      console.log(pixel);
      pixels.push(pixel);
    }
  }
  socket = io.connect('http://localhost:3000');
  //DO NOT DELETE/CHANGE
  //callback to newDrawing on mouse event
  socket.on('paint', paintPixel);
  //DO NOT DELETE
}


//THE FUNCTION THAT IS CALLED BACK FROM "socket.on()"
function paintPixel(data) {
  for (var i = 0; i < pixels.length; i++) {
    if(data.x == pixels[i].x && data.y == pixels[i].y)
    {
      pixels[i].painted = 1;
    }
  }
}

// function mousePressed()
// {
//   console.log('Sending: ' + mouseX + ',' + mouseY);
//
//   //THE DATA THAT IS BEING SENT TO THE SOCKET
//   var data =
//   {
//     x: mouseX,
//     y: mouseY
//   }
//
//   //THE FUNCTION FOR SENDING DATA TO THE SERVER "socket.emit()"
//   socket.emit('paint', data);
//
//   noStroke();
//   fill(255);
//   ellipse(mouseX, mouseY, 36, 36);
// }

function draw() {
  background(255);
  scale(scaleSize);
  drawPixels();
}


function keyPressed()
{
  if(keyCode == 187)
  {
    scaleSize+=1;
    //console.log(mouseX);
    //console.log(mouseY);
    //translate(mouseX, mouseY);
    //scale(scaleSize);
    console.log("scaling");
  }
  else if(keyCode == 189 && scaleSize > 1)
  {
    scaleSize-=1;
    scale(scaleSize);
  }

}

function drawPixels()
{
  for(var i = 0 ; i < pixels.length ; i++)
  {
    if (overRect(pixels[i].x *pixelSize*scaleSize*(width/imageSize), pixels[i].y*pixelSize * scaleSize * (height/imageSize), pixelSize*scaleSize * (height/imageSize), pixelSize*scaleSize*(height/imageSize)))
    {
      //console.log("changeFill");
      if(mouseIsPressed)
      {
        pixels[i].painted = 1;
        var paintedPixel = pixels[i];
        console.log(paintedPixel);
        socket.emit('paint', paintedPixel);
        console.log("Pixel " + pixels[i].x + ", " + pixels[i].y + " has been painted");
      }
    fill(255);
    }
    else if(pixels[i].painted == 1)
    {
      fill(pixels[i].r, pixels[i].g, pixels[i].b);
    }
    else
    {
      fill(255);
    }

    if(pixels[i].x *scaleSize <= width && pixels[i].y *scaleSize <= height){
      //console.log("draw square" + pixels[i]);
      rect(pixels[i].x*pixelSize *(width/imageSize), pixels[i].y*pixelSize * (height/imageSize), pixelSize*(width/imageSize), pixelSize* (height/imageSize));
      pixelsDrawn++;
    }
  }
  console.log("Pixels currently being drawn: " + pixelsDrawn);
  pixelsDrawn = 0;
}


function overRect(x, y, w, h) {
 if (((mouseX > x)) && ((mouseX < x + w)) &&
   ((mouseY > y)) && ((mouseY < y + h))) {
   return true;
 } else {
   return false;
 }
}
