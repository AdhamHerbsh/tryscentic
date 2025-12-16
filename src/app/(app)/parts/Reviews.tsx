import { Star, StarHalf } from "lucide-react";
import type { ProductReview } from "@/types/product";

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
    </>
  );
}
