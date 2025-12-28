"use client";
import React, { useState, useEffect } from "react";
import animation from "./loader-animation.module.css";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 5 seconds
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <>
      <div className={`bg-accent w-full h-screen flex flex-col justify-center items-center transition-opacity duration-1000 ${isFadingOut ? "opacity-0 invisible" : "opacity-100"
        }`}>
        <div
          className={`${animation.loaderWrapper} ${isFadingOut ? animation.fadeOut : ""
            }`}
        >
          <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="metallic-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#D92525" />
                <stop offset="50%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#B01010" />
              </linearGradient>

              <linearGradient
                id="liquid-gradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#800000" />
                <stop offset="50%" stopColor="#E31E24" />
                <stop offset="90%" stopColor="#FF4D4D" />
              </linearGradient>

              <linearGradient
                id="shimmer-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>

              <radialGradient id="sphere-gradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF9999" />
                <stop offset="50%" stopColor="#D92525" />
                <stop offset="100%" stopColor="#600000" />
              </radialGradient>

              <clipPath id="bottle-shape-clip">
                <path d="M 150 330 L 150 130 L 165 130 L 220 160 Q 200 200 175 220 Q 160 240 190 270 Q 200 290 165 320 L 180 340 L 120 340 L 135 320 Q 100 290 110 270 Q 140 240 125 220 Q 100 200 80 160 L 135 130 L 150 130 Z" />
              </clipPath>
            </defs>

            {/* Liquid layers (clipped) */}
            <g clipPath="url(#bottle-shape-clip)">
              <rect
                className={animation.liquidBase}
                x="0"
                y="0"
                width="300"
                height="400"
              />
              <path
                className={animation.liquidSurface}
                d="M 0 240 Q 75 235 150 235 T 300 240 L 300 260 L 0 260 Z"
              />
              <rect
                className={animation.liquidShimmer}
                x="50"
                y="230"
                width="200"
                height="20"
              />
              <circle
                className={`${animation.bubble} ${animation.bubbleB1}`}
                r="2"
                cy="320"
                cx="140"
              />
              <circle
                className={`${animation.bubble} ${animation.bubbleB2}`}
                r="3"
                cy="320"
                cx="160"
              />
              <circle
                className={`${animation.bubble} ${animation.bubbleB3}`}
                r="1.5"
                cy="320"
                cx="150"
              />
              <circle
                className={`${animation.bubble} ${animation.bubbleB4}`}
                r="2.5"
                cy="320"
                cx="155"
              />
            </g>

            {/* Bottle outline */}
            <path
              className={animation.drawPath}
              d="M 135 130 L 80 160 Q 100 200 125 220 Q 140 240 110 270 Q 100 290 135 320 L 120 340 L 180 340 L 165 320 Q 200 290 190 270 Q 160 240 175 220 Q 200 200 220 160 L 165 130"
            />

            {/* Central rod */}
            <line
              className={animation.centralRod}
              x1="150"
              y1="325"
              x2="150"
              y2="130"
            />

            {/* Stopper */}
            <g className={animation.stopper}>
              <rect
                x="140"
                y="115"
                width="20"
                height="15"
                rx="2"
                fill="url(#metallic-gradient)"
              />
              <rect
                x="135"
                y="105"
                width="30"
                height="10"
                rx="3"
                fill="url(#metallic-gradient)"
              />
              <circle cx="150" cy="85" r="18" />
            </g>

            {/* Injection arm */}
            <line
              className={animation.injectionArm}
              x1="135"
              y1="120"
              x2="60"
              y2="50"
            />
            <circle className={animation.nozzleTip} cx="60" cy="50" r="4" />

            {/* Essence droplet */}
            {/* Note: offsetPath is set via style because React doesn't strongly type it in SVGProps yet */}
            <circle
              r="4"
              className={animation.essenceDroplet}
              style={
                {
                  offsetPath: 'path("M 60 50 L 145 130 L 150 350")',
                } as React.CSSProperties
              }
            />
          </svg>
        </div>
        <div>
          <p className={animation.loaderText}>TYRSCENTIC ©</p>
        </div>
      </div>
    </>
  );
}
