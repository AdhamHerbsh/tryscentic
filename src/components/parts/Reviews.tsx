"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, StarHalf, User, Send, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

type ReviewsProps = {
  productId: string;
  initialRating: number;
  initialReviewCount: number;
};

export default function Reviews({
  productId,
  initialRating,
  initialReviewCount,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [avgRating, setAvgRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialReviewCount);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const supabase = createClient();

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  }, [supabase.auth]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);

      if (data && data.length > 0) {
        const total = data.reduce((acc, r) => acc + r.rating, 0);
        setAvgRating(total / data.length);
        setTotalReviews(data.length);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  }, [productId, supabase]);

  useEffect(() => {
    fetchReviews();
    checkAuth();
  }, [fetchReviews, checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to review");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const authorName = profile?.full_name || user.email?.split("@")[0] || "Anonymous";

      const newReview = {
        product_id: productId,
        user_id: user.id,
        rating: newRating,
        content: newComment,
        author_name: authorName,
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert(newReview)
        .select()
        .single();

      if (error) throw error;

      toast.success("Review submitted! Thank you.");

      // Optimistic Update
      const optimisticReview: Review = {
        id: data.id,
        author_name: authorName,
        rating: newRating,
        content: newComment,
        created_at: new Date().toISOString(),
      };

      setReviews([optimisticReview, ...reviews]);

      // Update stats
      const newTotal = totalReviews + 1;
      const newAvg = (avgRating * totalReviews + newRating) / newTotal;
      setTotalReviews(newTotal);
      setAvgRating(newAvg);

      // Reset form
      setNewComment("");
      setNewRating(0);
      setIsWriting(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const filledStars = Math.floor(avgRating);
  const hasHalfStar = avgRating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <section id="reviews" className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Customer Reviews
          </p>
          <div className="mt-2 flex items-center gap-3 text-white">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: filledStars }).map((_, index) => (
                <Star key={`star-${index}`} className="h-5 w-5 fill-current" />
              ))}
              {hasHalfStar && <StarHalf className="h-5 w-5 fill-current" />}
              {Array.from({ length: Math.max(0, emptyStars) }).map((_, index) => (
                <Star key={`empty-${index}`} className="h-5 w-5 text-white/30" />
              ))}
            </div>
            <span className="text-xl font-bold tracking-tight">
              {avgRating.toFixed(1)} <span className="text-sm font-normal text-white/40">/ 5</span>
            </span>
            <span className="text-sm font-medium text-white/60">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>

        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/10 active:scale-95"
          >
            <span>Write a Review</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="my-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Share Your Experience</h3>
                <button
                  onClick={() => setIsWriting(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>

              {!isLoggedIn ? (
                <div className="text-center py-4">
                  <p className="text-white/80 mb-4">Please log in to leave a review for this fragrance.</p>
                  <a href="/login" className="inline-block rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-white/90">
                    Log In
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="mb-3 text-sm font-medium text-white/60">How would you rate it?</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${star <= (hoverRating || newRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-white/60">
                      Your Review
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Was it long-lasting? How was the sillage? Describe the notes you sensed..."
                      className="w-full min-h-[120px] rounded-xl border border-white/10 bg-black/40 p-4 text-white placeholder:text-white/20 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Review</span>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-white/40 text-sm animate-pulse italic">Capturing fragrance impressions...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
            <User className="mx-auto h-12 w-12 text-white/10 mb-4" />
            <p className="text-white/50">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review, idx) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-white/5 bg-black/20 p-6 transition-all hover:border-white/10 hover:bg-black/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                    <User className="h-5 w-5 text-white/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                      {review.author_name}
                    </p>
                    <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star
                          key={`${review.id}-star-${index}`}
                          className="h-3 w-3 fill-current"
                        />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, index) => (
                        <Star
                          key={`${review.id}-empty-${index}`}
                          className="h-3 w-3 text-white/10"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-widest text-amber-400/60 font-medium">Verified Buyer</span>
                  <span className="text-[11px] text-white/30 font-medium tracking-tighter">
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/70 group-hover:text-white/90 transition-colors">
                {review.content}
              </p>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}

