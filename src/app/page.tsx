"use client";
import Link from "next/link";
// import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import FAQ from "./components/FAQ";

export default function Home() {
  return (
    <>
      <Header />

      <Hero />

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
