let capture;
let capturewidth = 640 * 1.5;
let captureheight = 480 * 1.5;
let color = "blue";
var audio = new Audio("elo.mp3");
var audio_triste = new Audio("sad_elo.mp3");

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
  if (result.length > 0) {
    detections = [result[0]];
  } else {
    detections = [];
  }
  faceapi.detect(gotFaces);
}

function draw() {
  background(0);

  capture.loadPixels();

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

      push();

      for (k = 0; k < emotions.length; k++) {
        var thisemotion = emotions[k];

        var thisemotionlevel = detections[i].expressions[thisemotion];
        textSize(30);
        text(thisemotion + " value: " + thisemotionlevel, 50, 30 + 30 * k);

        rect(40, 30 + 30 * k, thisemotionlevel * 100, 10);
      }

      if (detections[i].expressions.happy > 0.3) {
        textSize(50);
        text("Estás feliz!!!", 50, 100);
        color = "yellow";
        audio.play();
        if (!audio_triste.paused) {
          audio_triste.pause();
        }
        document.getElementById("sad_cat").style.display = "none";
        document.getElementById("happy_cat").style.display = "block";
      } else {
        textSize(50);
        text("Estás triste...", 50, 100);
        color = "blue";
        if (!audio.paused) {
          audio.pause();
        }
        audio_triste.play();
        document.getElementById("happy_cat").style.display = "none";
        document.getElementById("sad_cat").style.display = "block";
      }
    }
  }
  pop();
}
