"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Icon from "../../../components/layout/icon";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // حركة الفورم: يبدأ فوق الكونتاكت ويطلع تدريجيًا
  const formTranslateY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const formOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 1]);

  return (
    <>
      <Header />

      <div ref={containerRef} className="relative font-sans text-white min-h-screen">

        {/* HERO SECTION - أقل من نصف الشاشة */}
        <section className="h-[45vh] flex items-center justify-center text-center bg-[#1C0606] relative z-0">
          <div className="max-w-xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="opacity-70 text-lg">We’d love to hear from you</p>
          </div>
        </section>


        {/* Form Section - فوق الكونتاكت (Scroll Stack) */}
        <motion.section
          style={{ y: formTranslateY, opacity: formOpacity }}
          className="px-6 py-16 bg-[#2C0A0A] relative z-10 -mt-16"
        >
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">

            {/* FORM */}
            <div className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full p-3 rounded bg-[#3A1A1A] border border-[#F79A20]/40 outline-none" />
              <input type="email" placeholder="Email" className="w-full p-3 rounded bg-[#3A1A1A] border border-[#F79A20]/40 outline-none" />
              <textarea placeholder="Message" className="w-full p-3 rounded bg-[#3A1A1A] border border-[#F79A20]/40 h-32 outline-none" />
              <div className="flex space-x-6 pt-4">
                <button className="bg-[#F79A20] text-black px-6 py-3 rounded font-semibold hover:bg-amber-700 transition">
                  Send Message
                </button>
                <button className="bg-green-500 text-black px-6 py-3 rounded font-semibold hover:bg-green-600 transition">
                  Send Message WhatsApp
                </button>
              </div>
              <Icon />
            </div>

            {/* INFO إضافية */}
            <div className="space-y-30">
              <div>
                <h2 className="text-xl font-semibold">Contact</h2>
                <p>hi@green.com</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Location</h2>
                <p>Cairo, Egypt</p>
              </div>
            </div>

          </div>
        </motion.section>

        <Footer />
      </div>
    </>
  );
}
