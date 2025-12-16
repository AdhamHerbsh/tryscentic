"use client"

import Image from "next/image";
import Link from "next/link";

import Icons from "@/app/(app)/parts/Icons";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-creative';
import "@/assets/styles/swriper-demo.css";

// import required modules
import { Parallax } from 'swiper/modules';


export default function Gallery() {
    return (
        <>
            <Swiper
                parallax={true}
                mousewheel={true}
                speed={600}
                modules={[Parallax]}
                className="gallerySwiper"
            >
                <div
                    slot="container-start"
                    className="parallax-bg py-5"
                    style={{
                        'backgroundImage':
                            'url(/assets/images/leiada-krozjhen.jpg)',
                    }}
                    data-swiper-parallax="-25%"
                    data-aos="fade-up"
                ></div>
                <SwiperSlide >
                    <div className="title" data-swiper-parallax="-300">
                        <Image
                            src="/assets/images/logo/logo-icon-1200x1200.png"
                            alt="Logo"
                            width={200}
                            height={300}
                        />
                    </div>
                    <div className="subtitle" data-swiper-parallax="-200">
                        About US
                    </div>
                    <div className="text" data-swiper-parallax="-100">
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
                </SwiperSlide>
                <SwiperSlide>
                    <div className="title" data-swiper-parallax="-300">
                        Who We Are?!
                    </div>
                    <div className="text" data-swiper-parallax="-100">
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
                </SwiperSlide>
                <SwiperSlide>
                    <div className="title" data-swiper-parallax="-300">
                        Our Social Media Links <i className="lucide-"></i>
                    </div>
                    <div className="subtitle" data-swiper-parallax="-200">
                        <Icons />
                    </div>
                </SwiperSlide>
            </Swiper>        </>
    )
}
