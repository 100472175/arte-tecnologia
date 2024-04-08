let capture;
let capturewidth = 640 * 1.5;
let captureheight = 480 * 1.5;
let color = "violet";
var audio = new Audio("elo.mp3");

let emotions = ["happy"];

let faceapi;
let detections = [];

function setup() {
  createCanvas(capturewidth, captureheight);

  capture = createCapture(VIDEO);
  capture.position(0, 0);

  capture.hide();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
  };

  faceapi = ml5.faceApi(capture, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;
  faceapi.detect(gotFaces);
  // console.log(detections);
}

function draw() {
  background(0);

  capture.loadPixels();

  /*
  for (let y = 0; y < capture.height; y+=5){
    for (let x = 0; x < capture.width; x +=5){
      
      const pixelIndex = (x + y * capture.width) * 4
      const r = capture.pixels[pixelIndex + 0];
      const g = capture.pixels[pixelIndex + 1];
      const b = capture.pixels[pixelIndex + 2];
      const a = capture.pixels[pixelIndex + 3];
      
      const avg = (r + g + b) / 3;
      
      var diameter = map(avg, 0, 255, 1, 7);
      
      circle(x,y, diameter);
      
      
      
    }
  }
  
  */

  push();
  fill(color);
  if (detections.length > 0) {
    for (i = 0; i < detections.length; i++) {
      var points = detections[i].landmarks.positions;

      for (j = 0; j < points.length - 1; j++) {
        circle(points[j]._x, points[j]._y, 10);
      }

      beginShape();
      for (let j = 0; j < points.length; j++) {
        vertex(points[j]._x, points[j]._y);
      }
      endShape(CLOSE);

      var happyLevel = detections[i].expressions.happy;
      var sadLevel = detections[i].expressions.sad;

      push();

      for (k = 0; k < emotions.length; k++) {
        var thisemotion = emotions[k];

        var thisemotionlevel = detections[i].expressions[thisemotion];
        textSize(30);
        text(thisemotion + " value: " + thisemotionlevel, 50, 30 + 30 * k);

        rect(40, 30 + 30 * k, thisemotionlevel * 100, 10);
      }

      if (detections[i].expressions.happy > 0.1) {
        textSize(30);
        text("Estas feliz", 50, 100);
        color = "yellow";
        audio.play();
      } else {
        color = "violet";
        if (!audio.paused) {
          audio.pause();
        }
      }

      /*
          fill(220);
          circle(30,30,20 * neutralLevel);
          text("NEUTRAL VALUE: " + neutralLevel, 40,30);
          pop();
          */
    }
  }
  pop();
}
