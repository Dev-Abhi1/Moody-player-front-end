import { useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const detectMood = useRef()
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };
    const handleVideoPlay = async() => {
            const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceExpressions();
          if (detections.length > 0) {
      let highestProb = 0;
      let detectedMood = "";
      for (const [expression, probability] of Object.entries(detections[0].expressions)) {
        if (probability > highestProb) {
          highestProb = probability;
          detectedMood = expression;
        }
      }
     
      const songData = await axios.get(`https://moody-player-back-end.onrender.com/songs?mood=${detectedMood}`)
     
      setSongs(songData.data.songs)
    } else {
      
      console.log("No face detected");
    }
       
    };
    loadModels().then(startVideo);
    videoRef.current &&
      detectMood.current.addEventListener("click", handleVideoPlay);
  }, []);
  return (
    <div className=" py-4 flex justify-center flex-col items-center gap-5">
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "180px", height: "180px",borderRadius:"100%",border:"1px solid gray", objectFit:"cover" }}
      />
      <button className="bg-gray-600 px-6 py-2 rounded-xl " ref={detectMood}>Detect Mood</button>

    </div>
  );
}
