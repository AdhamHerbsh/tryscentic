"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

interface BrandWithLogo {
    id: string;
    name: string;
    logoUrl: string | null;
}

export default function BrandsSwiper({ brandsWithLogos }: { brandsWithLogos: BrandWithLogo[] }) {
    return (
        <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            breakpoints={{
                640: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                },
                1024: {
                    slidesPerView: 5,
                },
            }}
            className="brands-swiper"
        >
            {brandsWithLogos.map((brand) => (
                <SwiperSlide key={brand.id} className="flex items-center justify-center py-2 px-4 rounded-3xl bg-white border border-secondary">
                    <Link
                        href={`/pages/shop?brand_id=${brand.id}`}
                        className="group flex flex-col items-center justify-center p-4 transition-transform hover:scale-105"
                    >
                        <div className="relative w-25 h-20 md:w-40 md:h-24">
                            <Image
                                src={brand.logoUrl!}
                                alt={brand.name}
                                fill
                                sizes="(max-width: 768px) 100px, 160px"
                                className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
