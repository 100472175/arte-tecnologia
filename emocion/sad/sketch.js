let capture;
let capturewidth = 640;    
let captureheight = 480;

let emotions = ["happy", "sad"];

let faceapi;
let detections = [];

function setup() {
  createCanvas(capturewidth, captureheight);
  
  capture = createCapture(VIDEO);
  capture.position(0,0);
  
  capture.hide();
  
  const faceOptions = {withLandmarks: true, withExpressions: true, withDescriptors: false};
  
  faceapi = ml5.faceApi(capture, faceOptions, faceReady);
  
  }

function faceReady(){
  faceapi.detect(gotFaces);
}

function gotFaces(error, result){
  if (error){
    console.log(error);
    return
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
  fill('green');
      if(detections.length>0){
        for (i=0; i<detections.length; i ++){
          var points = detections[i].landmarks.positions;

          for (j=0; j<points.length; j ++){
           circle( points[j]._x,points[j]._y, 5);
            }
          
          var neutralLevel = detections[i].expressions.neutral;
          var happyLevel = detections[i].expressions.happy;
          var sadLevel = detections[i].expressions.sad;
          var angryLevel = detections[i].expressions.angry;
          var fearfulLevel = detections[i].expressions.fearful;
          var disgustedLevel = detections[i].expressions.disgusted;
          var surprisedLevel = detections[i].expressions.surprised;
          
          push();
          
          for (k = 0; k<emotions.length; k++) {
            
            var thisemotion = emotions[k];
            
            var thisemotionlevel= detections[i].expressions[thisemotion];
            
            text(thisemotion + " value: " + thisemotionlevel,40,30 + 30 * k );
               
            rect(40, 30 + 30 * k, thisemotionlevel * 100,10 );
            
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