"use client";

import "@google/model-viewer";
import { useState } from "react";
import { GoScreenFull } from "react-icons/go";
import { IoClose } from "react-icons/io5";
type ARViewerProps = {
  modelUrl: string;
};
{/*ios-src="https://mi-bucket.s3.amazonaws.com/models/product.usdz"*/}
export default function ARViewer({ modelUrl }: ARViewerProps) {
  const [showLabel, setShowLabel] = useState(true);
  return (
    <model-viewer
      src={modelUrl}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      tone-mapping="neutral"
      touch-action="pan-y"
      poster="poster.webp"
      shadow-intensity="1"
      reveal="manual"
      ar-placement="floor"
    >
      <div className="progress-bar hide" slot="progress-bar">
        <div className="update-bar"></div>
      </div>
      {/* <button slot="ar-button" id="ar-button">
        View in your space
      </button> */}
      <button
        slot="ar-button"
        id="ar-button"
        className="inline-flex items-center justify-center bg-black text-white p-4 rounded-full shadow hover:bg-gray-900 transition-all border border-black cursor-pointer"
      >
        <GoScreenFull size={20} />
      </button>
    
    </model-viewer>
  );
}
