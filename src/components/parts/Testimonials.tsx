"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface TestimonialReview {
    id: string;
    rating: number;
    title?: string;
    content: string;
    author_name: string;
}

interface TestimonialsProps {
    reviews: TestimonialReview[];
}

export default function Testimonials({ reviews = [] }: TestimonialsProps) {
    if (reviews.length === 0) return null; // Or show empty state

    return (
        <section className="py-20">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Let customers speak for us.
                    </h2>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} className="fill-secondary text-secondary" />
                            ))}
                        </div>
                        <p className="text-white/60 text-sm md:text-base font-medium">
                            from {reviews.length} reviews
                        </p>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="relative px-4 md:px-12 max-w-7xl mx-auto">
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        centeredSlides={false}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            el: '.testimonials-pagination',
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next-custom",
                            prevEl: ".swiper-button-prev-custom",
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="testimonials-swiper pb-12!"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id} className="h-full">
                                <div className="py-8 px-4 md:p-10 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 group">
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(review.rating || 5)].map((_, i) => (
                                            <Star key={i} size={16} className="fill-secondary text-secondary" />
                                        ))}
                                    </div>

                                    {/* Title - Review table might not have title, so use generic or derive */}
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">
                                        "{review.title || "Happy Customer"}"
                                    </h3>

                                    {/* Content */}
                                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 italic">
                                        {review.content}
                                    </p>

                                    {/* Author */}
                                    <div className="mt-auto">
                                        <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest">
                                            — {review.author_name || "Anonymous"}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <button className="swiper-button-prev-custom absolute left-[-10px] md:left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-secondary hover:text-white transition-all duration-300 hidden sm:flex">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="swiper-button-next-custom absolute right-[-10px] md:right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-secondary hover:text-white transition-all duration-300 hidden sm:flex">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
