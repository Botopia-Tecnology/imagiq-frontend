"use client";
import React, { useState, useEffect } from "react";
import { GoScreenFull } from "react-icons/go";
import { IoClose } from "react-icons/io5";
type ARButtonProps = {
  glbUrl: string;
  usdzUrl: string;
  title?: string;
  link?: string;
};
export default function ARMobile({
  glbUrl,
  usdzUrl,
  title,
  link,
}: ARButtonProps) {
  const [showLabel, setShowLabel] = useState(true);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  console.log(isAndroid);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    console.log("UserAgent:", userAgent); // <- Debug
  }, []);
  // Links
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    glbUrl
  )}${title ? `&title=${encodeURIComponent(title)}` : ""}${
    link ? `&link=${encodeURIComponent(link)}` : ""
  }&mode=ar_only`;
  //(iOS)
  const quickLookUrl = usdzUrl;
  // URL final según plataforma
  const finalUrl = isAndroid ? sceneViewerUrl : isIOS ? quickLookUrl : "#";
  return (
    <div className="relative flex items-center">
      {showLabel && (
        <div
          className="flex items-center bg-white text-black border border-gray-300 rounded-md shadow px-4 py-2 mr-3"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          <span className="mr-2">Mira el objeto en tu espaciooo</span>
          <button
            onClick={() => setShowLabel(false)}
            className="text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            <IoClose size={18} />
          </button>
        </div>
      )}
      <a href={finalUrl} rel="ar" target="_blank">
        <button className="inline-flex items-center justify-center bg-black text-white p-4 rounded-full shadow hover:bg-gray-900 transition-all border border-black">
          <GoScreenFull size={20} />
        </button>
      </a>
    </div>
  );
}