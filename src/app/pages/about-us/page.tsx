import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import Gallery from "@/app/parts/Gallery";
import Hero from "@/app/parts/Hero";
import Icons from "@/app/parts/Icons";


import React from 'react'

export default function page() {
  return (
    <>
      <Header />

      {/* <Gallery /> */}

      <Hero kind="about" />

      <section>
        <div className="p-auto">
          <h2 className="text-2xl font-bold tracking-wider sm:text-3xl">Who We Are ?!</h2>
          <p className="lead">
            At [Your Brand Name], we believe that every scent tells a story. We are passionate about curating a unique collection of perfumes that reflect elegance, authenticity, and individuality. Our journey began with a simple vision — to bring the world’s most captivating fragrances closer to you, combining luxury, quality, and affordability.
            y with trusted international brands and authentic suppliers to ensure every bottle you receive is 100% original. Whether you’re drawn to classic notes, modern blends, or rare niche perfumes, our mission is to help you find a scent that truly represents you.
            Because for us, perfume is more than just a fragrance — it’s a memory, an emotion, and a reflection of your style.
          </p>
        </div>
      </section>

      <Icons />
      <Footer />

    </>
  )
}
