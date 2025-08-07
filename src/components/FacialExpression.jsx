import { useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();
  const detectMood = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // From public/models/
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded successfully");
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    };

    const handleVideoPlay = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections.length > 0) {
          let highestProb = 0;
          let detectedMood = "";

          for (const [expression, probability] of Object.entries(
            detections[0].expressions
          )) {
            if (probability > highestProb) {
              highestProb = probability;
              detectedMood = expression;
            }
          }

          detectedMood = detectedMood || "neutral"; // fallback if undefined
          console.log("Detected mood:", detectedMood);

          const response = await axios.get(
            `https://moody-player-back-end.onrender.com/songs?mood=${detectedMood}`
          );

          if (Array.isArray(response.data?.songs)) {
            setSongs(response.data.songs);
          } else {
            console.error("Invalid response format:", response.data);
            setSongs([]);
          }
        } else {
          console.log("No face detected");
        }
      } catch (err) {
        console.error("Error during detection or fetch:", err);
      }
    };

    // Load models and start video
    loadModels().then(startVideo);

    // Add button click event for detecting mood
    if (videoRef.current && detectMood.current) {
      detectMood.current.addEventListener("click", handleVideoPlay);
    }

    // Cleanup on unmount
    return () => {
      if (detectMood.current) {
        detectMood.current.removeEventListener("click", handleVideoPlay);
      }
    };
  }, [setSongs]);

  return (
    <div className="py-4 flex justify-center flex-col items-center gap-5">
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "100%",
          border: "1px solid gray",
          objectFit: "cover",
        }}
      />
      <button
        className="bg-gray-600 text-white px-6 py-2 rounded-xl"
        ref={detectMood}
      >
        Detect Mood
      </button>
    </div>
  );
}
