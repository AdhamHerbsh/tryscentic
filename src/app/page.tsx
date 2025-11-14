"use client";
import Link from "next/link";
// import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import FAQ from "./components/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <section id="hero">
        <div className="relative h-screen w-full overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="hero-img absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('assets/images/trung-do-bao.jpg')`,
            }}
          ></div>

          {/* Content Container */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            {/* Main Heading */}
            <h1
              className="mb-4 text-5xl font-bold text-white md:text-6xl lg:text-7xl"
              data-aos="fade-up"
            >
              Discover Your Signature
              <span> Scent</span>
            </h1>

            {/* Subheading */}
            <p
              className="mb-8 text-lg text-white md:text-xl lg:text-2xl"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              Authentic perfumes delivered to your door.
            </p>

            {/* Call-to-Action Buttons */}
            <div
              className="flex flex-col gap-4 sm:flex-row"
              data-aos="fade-up"
              data-aos-delay="1000"
            >
              <button className="rounded-md bg-orange-400 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-orange-500 hover:shadow-lg">
                Shop Now
              </button>
              <button className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-white hover:text-gray-900">
                Explore Brands
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-100 p-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div
            className="relative bg-cover bg-center text-center content-center"
            style={{
              backgroundImage: `url('assets/images/category-1.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-gray-400 opacity-30 z-10"></div>
            <span className="relative z-10 text-5xl">
              All Fragrance Samples
            </span>
          </div>
          <div
            className="relative bg-cover bg-center text-center content-center"
            style={{
              backgroundImage: `url('assets/images/category-2.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-gray-400 opacity-30 z-10"></div>
            <span className="relative z-10 text-5xl">Retail Bottoles</span>
          </div>
        </div>
      </section>
      <section className="p-auto">
        <div className="text-center">
          <h1 className="text-6xl">New Releases</h1>
        </div>
        <ProductCard />
      </section>
      <section className="p-auto">
        <FAQ />
      </section>
      <Footer />
    </>
  );
}
