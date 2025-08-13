"use client";
import React, { useRef, useState } from "react";
// ...existing code...

export default function UltimosProductos() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(false);
  // ...existing code...
  const handleEnded = () => {
    setFade(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setFade(false);
    }, 400);
  };
  // ...existing code...

  return (
    <section className="bg-black py-18">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        <h2
          className="text-2xl md:text-3xl font-medium text-center mb-8 text-white"
          style={{ fontFamily: "Montserrat", fontWeight: 400 }}
        >
          ¡Explora nuestros ultimos productos!
        </h2>
        <div className="w-full flex justify-center">
          <div className="bg-black rounded-[40px] shadow-2xl w-full max-w-[900px] min-h-[500px] flex items-center justify-center">
            <video
              ref={videoRef}
              src={"/videoplayback.mp4"}
              autoPlay
              loop
              muted
              playsInline
              className={`rounded-[40px] w-full h-[500px] object-cover transition-opacity duration-400 ${
                fade ? "opacity-0" : "opacity-100"
              }`}
              style={{ background: "#000" }}
              onEnded={handleEnded}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
