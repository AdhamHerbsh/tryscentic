import Hero from "@/components/parts/Hero";
import SocialIcons from "@/components/parts/SocialIcons";


export default function page() {
  return (
    <>
      {/* <Gallery /> */}

      <Hero kind="about" />

      {/* Who We Are Section */}
      <section className="bg-brand-primary/40 py-16 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 text-white">
          <h2 className="text-3xl font-bold mb-4">Who We Are?!</h2>
          <p className="text-gray-200/90 max-w-3xl leading-relaxed">
            At TRYSCENTIC™, we believe that every scent tells a story.
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

      <section className="px-auto py-8">
        <div className="subtitle" data-swiper-parallax="-200">
          <SocialIcons />
        </div>
      </section>

    </>
  )
}
