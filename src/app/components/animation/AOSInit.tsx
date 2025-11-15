"use client"; // For Next.js 13+ App Router

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 100, // Offset from the original trigger point
      easing: "ease-in-out", // Easing function
    });
  }, []);

  return null;
}
