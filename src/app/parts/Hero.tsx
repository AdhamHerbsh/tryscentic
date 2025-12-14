import Image from "next/image";
import Link from "next/link";

export function IndexHero({ bgimage }: { bgimage: string }) {
  return (
    <section id="hero" className="!pt-0">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="hero-img absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgimage})`,
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
    </section >
  );
}

export function AboutHero({ bgimage }: { bgimage: string }) {
  return (
    <>
      {/* Hero Section */}
      < section className="relative w-full h-[800px] flex items-center justify-center overflow-hidden" >
        <Image
          src={bgimage}
          alt="About Hero Image"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        {/* Content Section (Logo + Text + Button) */}
        <section className="absolute inset-0 flex flex-col justify-center items-start p-10">
          <div className="mb-6">
            {/* Logo */}
            <Image
              src="/assets/images/logo/logo-icon-1200x1200.png"
              alt="TRYSCENTIC™"
              width={300}
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
      </section ></>
  );
}

function Hero({ kind }: { kind: string }) {
  return (
    <>

      {

        kind === "index" ?
          <IndexHero bgimage="/assets/images/hero.jpg" />
          :
          <AboutHero bgimage="/assets/images/leiada-krozjhen.jpg" />
      }
    </>
  );
}

export default Hero;