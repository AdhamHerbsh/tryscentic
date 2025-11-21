import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="hero-img absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/images/trung-do-bao.jpg')`,
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
            <Link
              href="/pages/shop"
              className="rounded-md bg-orange-400 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-orange-500 hover:shadow-lg"
            >
              Shop Now
            </Link>
            <button className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-white hover:text-gray-900">
              Explore Brands
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
