"use client";

import React from "react";

interface WaveLineProps {
  className?: string;
}

const WaveLine: React.FC<WaveLineProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-[6px] overflow-hidden relative ${className}`}>
      <div className="absolute top-0 left-0 w-[200%] h-full flex animate-[wave_2s_linear_infinite]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q 10 0, 20 3 T 40 3 T 60 3 T 80 3 T 100 3 T 120 3 T 140 3 T 160 3 T 180 3 T 200 3"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="opacity-50"
          />
          <path
            d="M0 3 Q 10 0, 20 3 T 40 3 T 60 3 T 80 3 T 100 3 T 120 3 T 140 3 T 160 3 T 180 3 T 200 3"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="translate-x-[-200px]" // duplicate for smooth loop if needed, essentially just a long path
          />
        </svg>
      </div>
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default WaveLine;
