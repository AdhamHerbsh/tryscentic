import { Star, StarHalf } from "lucide-react";
import type { ProductReview } from "../data/productDetails";

type ReviewsProps = {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
};

export default function Reviews({
  rating,
  reviewCount,
  reviews,
}: ReviewsProps) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Customer Reviews
            </p>
            <div className="mt-2 flex items-center gap-3 text-white">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: filledStars }).map((_, index) => (
                  <Star
                    key={`star-${index}`}
                    className="h-5 w-5 fill-current"
                  />
                ))}
                {hasHalfStar && <StarHalf className="h-5 w-5 fill-current" />}
                {Array.from({ length: emptyStars }).map((_, index) => (
                  <Star
                    key={`empty-${index}`}
                    className="h-5 w-5 text-white/30"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {rating.toFixed(1)} / 5
              </span>
              <span className="text-sm text-white/60">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
          <button className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10">
            Write a Review
          </button>
        </div>
        <div className="mt-6 space-y-6">
          {reviews.map((review) => (
            <article
              key={review.author}
              className="rounded-2xl border border-white/10 bg-black/40 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{review.author}</p>
                  <div className="mt-1 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star
                        key={`${review.author}-star-${index}`}
                        className="h-4 w-4 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-white/50">Verified Buyer</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {review.content}
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr />
      <p className="text-8xl">OR</p>
      <hr />

      {/* قسم مراجعات العملاء */}
      <div className="bg-[#2b0004] text-white px-6 md:px-12 py-10">
        <div className="border-t border-gray-600 my-8"></div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <button className="border border-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-500 transition-colors text-sm">
            Write a Review
          </button>
        </div>
        <div className="flex items-center gap-2 text-yellow-400 mb-4">
          <span>⭐⭐⭐⭐⭐</span>
          <span className="text-gray-300 text-sm">Based on 12 reviews</span>
        </div>
        <div className="border-b border-gray-600 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Olivia R.</p>
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Absolutely divine! The scent is long-lasting and I get so many
            compliments.
          </p>
        </div>
        <div className="pb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">James T.</p>
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            A very sophisticated and elegant scent. Perfect for evening wear.
            The packaging is also beautiful.
          </p>
        </div>
      </div>
    </>
  );
}
