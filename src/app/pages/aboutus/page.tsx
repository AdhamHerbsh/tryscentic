import Image from "next/image";
import React from "react";
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Icon from "../../components/layout/Icon";

const AboutPage = () => {
  return (
    <>
      <Header />

      <div className="min-h-screen text-foreground font-sans bg-[var(--background-gradient)]">
        {/* Hero Section */}
        <section className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
          <Image
            src="/assets/images/beautinow-niche-perfume-0sHorINihAI-unsplash.jpg"
            alt="About Hero Image"
            fill
            className="hero-img object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          {/* Content Section (Logo + Text + Button) */}
          <section className="absolute inset-0 flex flex-col justify-end items-start px-12 pb-12 z-10">
            <div className="mb-6">
              {/* Logo */}
              <Image
                src="/assets/images/logo/logo-icon-1200x1200.png"
                alt="Logo"
                width={200}
                height={300}
              />
            </div>

            <div className="max-w-xl">
              <h1 className="text-5xl font-bold text-white tracking-wide">
                About US
              </h1>
              <p className="mt-3 text-lg text-gray-300">
                Authentic perfumes delivered to your door
              </p>

              <Link
                href="#contact"
                className="mt-6 inline-block border border-white text-white px-6 py-2 font-medium bg-white/10 hover:bg-white/20 transition"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </section>

        {/* Who We Are Section */}
        <section className="bg-brand-primary/40 py-16 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Who We Are?!</h2>
            <p className="text-gray-200/90 max-w-3xl leading-relaxed">
              At [Your Brand Name], we believe that every scent tells a story.
              We are passionate about curating a unique collection of perfumes
              that reflect elegance, authenticity, and individuality. Our
              journey began with a simple vision — to bring the world’s most
              captivating fragrances closer to you, combining luxury, quality,
              and affordability.
              <br />
              <br />
              We work closely with trusted international brands and authentic
              suppliers to ensure every bottle you receive is 100% original.
              Whether you’re drawn to classic notes, modern blends, or rare
              niche perfumes, our mission is to help you find a scent that truly
              represents you. Because for us, perfume is more than just a
              fragrance — it’s a memory, an emotion, and a reflection of your
              style.
            </p>
          </div>
        </section>

        {/* Icons Section */}
        <Icon />
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
