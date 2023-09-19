import React, { useEffect, useRef } from "react";
import createHandLandMarker from "./handlandmarker";
import { DrawingUtils,HandLandmarker } from "@mediapipe/tasks-vision";

function App() {
  // useRef for direct accessing dom elements

  const canvasRef = useRef(null); // for canvas
  const contextRef = useRef(null); // to update canvas
  const inputVideoRef = useRef(null); // for video
  function calcDist(point1, point2) {
    const xDiff = point2.x - point1.x;
    const yDiff = point2.y - point1.y;.
    3.
    const zDiff = point2.z - point1.z;
  
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
  }

  

  useEffect(() => {
    // getting current value
    const canvas = canvasRef.current;
    const videoRef = inputVideoRef.current;
    if (canvas) {
      contextRef.current = canvas.getContext("2d"); // property of canvas which helps me to do draw on the canvas
    }
    if (contextRef.current && canvas && videoRef) {
      // model === tasks
      createHandLandMarker().then((handLandMarker) => {
        console.log(handLandMarker);
        const predict = () => {
          console.log("I am the best");
          canvas.style.width = videoRef.videoWith;
          canvas.style.height = videoRef.videoHeight;
          canvas.width = videoRef.videoWith;
          canvas.height = videoRef.videoHeight;

          let startTimeMs = performance.now();
          if (lastVideoTime !== videoRef.currentTime) {
            lastVideoTime = videoRef.currentTime;
            results = handLandMarker.detectForVideo(videoRef, startTimeMs);
            // console.log(results);
          }
          contextRef.current.save();
          contextRef.current.clearRect(0,0,canvas.width,canvas.height);
          if(results.landmarks){
            for(const landmarks of results.landmark){
             drawingUtils.drawLandmarks(landmarks,{
              color:"red",
              lineWidth:2,

             }

             );
             drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,{
                color:"green",
                lineWidth:2,

              }
             );
            }
          } 
          let arr=results.landmarks[0];
          if (arr) {
            const thumb = arr[4];
            const index = arr[8];
            const middle = arr[12];
            const ring = arr[16];
            const pinky = arr[20];

            const thumbToIndex = calcDist(thumb, index);
            const indexToMiddle = calcDist(index, middle);
            const middleToRing = calcDist(middle, ring);
            const ringToPinky = calcDist(ring, pinky);
            const thumbToMiddle=calcDist(thumb,middle);
            const thumbToRing=calcDist(thumb,ring);
            const thumbToPinky=calcDist(thumb,pinky);
            if(thumbToIndex>0.1 && middleToRing<0.1 && ringToPinky<0.1 && indexToMiddle>0.1){
              console.log('Gesture for alphabet L');
            }

            else if(indexToMiddle>0.1 && middleToRing>0.1  && thumbToPinky<0.1){
              console.log('Gesture for alphabet E');
            }

            else  if(thumbToIndex>0.1 && middleToRing<0.1 && ringToPinky>0.1 && indexToMiddle>0.1){
              console.log('Gesture for alphabet C');
            }
           
            else  if(thumbToIndex<0.05 && thumbToRing<0.05 && thumbToPinky<0.05 && thumbToMiddle<0.05){
              console.log('Gesture for alphabet O');
            }
          }
        

          window.requestAnimationFrame(predict);
        };
        const drawingUtils = new DrawingUtils(contextRef.current);
        let lastVideoTime = -1;
        let results = undefined;

        // it gives a stream which gives a 1MB chunck and give another chunk after the prvious one is processed
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          videoRef.srcObject = stream;
          videoRef.addEventListener("loadeddata", predict);
        });
      });
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <video
        id="webcam"
        style={{ position: "absolute" }}
        autoPlay
        playsInline
        ref={inputVideoRef}
      ></video>
      <canvas
        ref={canvasRef}
        id="output_canvas"
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
        }}
      ></canvas>
    </div>
  );
}

export default App;