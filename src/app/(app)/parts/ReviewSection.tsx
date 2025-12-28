"use client";
import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import SimpleLoader from "@/components/shared/SimpleLoader";

interface Review {
    id: string;
    rating: number;
    content: string;
    created_at: string;
    author_name: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [canReview, setCanReview] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
        checkAuth();
    }, [productId]);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setCanReview(!!session);
    };

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("product_id", productId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAverage = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("You must be logged in to review");
                return;
            }

            // Get user name
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .single();

            const authorName = profile?.full_name || user.email?.split("@")[0] || "Anonymous";

            const { error } = await supabase.from("reviews").insert({
                product_id: productId,
                user_id: user.id,
                rating: newRating,
                content: newComment,
                author_name: authorName
            });

            if (error) throw error;

            toast.success("Review submitted!");
            setNewComment("");
            setNewRating(0);
            fetchReviews();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-10 border-t border-gray-200 mt-10">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Statistics */}
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl h-fit">
                    <div className="text-center">
                        <span className="text-5xl font-bold text-gray-900">{calculateAverage()}</span>
                        <span className="text-xl text-gray-500">/5</span>
                    </div>
                    <div className="flex justify-center gap-1 my-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`h-5 w-5 ${s <= parseFloat(calculateAverage() as string) ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500">Based on {reviews.length} reviews</p>
                </div>

                {/* Reviews List & Form */}
                <div className="md:col-span-2 space-y-8">
                    {/* Add Review Form */}
                    {canReview ? (
                        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-3">Write a Review</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-600">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-6 w-6 transition-colors ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tell us what you liked or didn't like..."
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px] text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-3 bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-sm">
                            Please <a href="/login" className="text-blue-600 underline">log in</a> to leave a review.
                        </div>
                    )}

                    {/* List */}
                    {loading ? <SimpleLoader /> : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User size={14} className="text-gray-500" />
                                            </div>
                                            <span className="font-semibold text-sm">{review.author_name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={`${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
