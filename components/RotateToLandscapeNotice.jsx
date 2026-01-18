"use client";
import React, { useEffect, useState } from "react";

const RotateToLandscapeNotice = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortraitNow = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortraitNow);
    };

    // Check on load
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black text-white text-center px-4">
      <div>
        <p className="text-xl font-semibold">Please rotate your device</p>
        <p className="text-yellow-400 mt-2 font-bold">Landscape mode required</p>
      </div>
    </div>
  );
};

export default RotateToLandscapeNotice;
