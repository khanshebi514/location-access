"use client";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setError(null);
        },
        (error) => {
          setError(`Error: ${error.message}`);
          setLocation(null);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocation(null);
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setError(null);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const video = videoRef.current;

      // Set canvas size to match video
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // Draw video frame on canvas
      context.drawImage(
        video,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Get image data URL from canvas
      const dataURL = canvasRef.current.toDataURL("image/png");
      setImage(dataURL);
    }
  };

  console.log(location);

  return (
    <main className="h-screen">
      <div className="flex justify-center items-center h-full gap-5 flex-col">
        <button
          className="p-2 bg-black text-white hover:bg-slate-500 rounded-lg"
          onClick={handleGetLocation}
        >
          Location
        </button>
        {location && <p>{location}</p>}
        <button
          className="p-2 bg-black text-white hover:bg-slate-500 rounded-lg"
          onClick={handleStartCamera}
        >
          Open Camera
        </button>

        <button
          className="p-2 bg-black text-white hover:bg-slate-500 rounded-lg"
          onClick={handleCaptureImage}
        >
          captchure Image
        </button>

        <div className="border-2 border-red-50 w-[250px] h-[250px] flex justify-center items-center">
          {error && <div>{error}</div>}
          <video
            ref={videoRef}
            width="640"
            height="480"
            autoPlay
            style={{ display: videoRef.current ? "block" : "none" }}
          ></video>
        </div>

        <div className="border-2 border-red-50 w-[250px] h-[250px] flex justify-center items-center">
          {error && <div>{error}</div>}
          <video
            ref={videoRef}
            width="640"
            height="480"
            autoPlay
            style={{ display: "block" }}
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          {image && (
            <div>
              <h2>Captured Image</h2>
              <img src={image} alt="Captured" width="250" />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
