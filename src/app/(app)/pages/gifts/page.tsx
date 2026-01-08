"use client"
import { useState } from "react";
import GiftCard from "@/components/ui/Cards/GiftCard";
import HowItWorks from "@/components/parts/HowItWorks";
import { purchaseGiftCard } from "@/actions/gift-actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, CheckCircle2, Copy, Loader2, ArrowRight } from "lucide-react";

// تعريف بيانات بطاقات الهدايا
const giftCards = [
  {
    id: 1,
    amount: 200,
    currency: "LE",
    image: "/assets/images/golden.png",
  },
  {
    id: 2,
    amount: 500,
    currency: "LE",
    image: "/assets/images/silver.png",
  },
  {
    id: 3,
    amount: 1000,
    currency: "LE",
    image: "/assets/images/dark-and-elegant.png",
  },
];

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasedCode, setPurchasedCode] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");

  const handlePurchaseClick = (amount: number) => {
    setSelectedAmount(amount);
    setPurchasedCode(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedAmount) return;
    setIsPurchasing(true);
    try {
      const res = await purchaseGiftCard(selectedAmount, recipientEmail);
      if (res.success) {
        setPurchasedCode(res.code || null);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPurchasing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!");
  };

  return (
    <>
      <div className="min-h-screen bg-[#2b0004] text-white pt-32 px-6 md:px-12 pb-20 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto mb-16 relative z-10 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Gift the Scent of <span className="text-secondary">Luxury</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Choose from our exclusive collection of gift cards and share the joy
            of fine fragrances with someone special. Perfect for any occasion.
          </motion.p>
        </div>

        {/* بطاقات الهدايا */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 flex-wrap mb-24 relative z-10"
        >
          {giftCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <GiftCard {...card} onPurchase={handlePurchaseClick} />
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <HowItWorks />
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedAmount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              {!purchasedCode ? (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                        <Gift className="text-secondary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Gift</h2>
                    </div>
                    <button onClick={() => setSelectedAmount(null)} className="text-gray-500 hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 text-center">
                    <p className="text-xs text-secondary font-bold uppercase tracking-[0.2em] mb-2">Gift Card Value</p>
                    <p className="text-5xl font-bold text-white tracking-tighter">LE {selectedAmount}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Recipient Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="Who is this for?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-secondary transition-colors"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                      <p className="text-[10px] text-amber-500/60 leading-relaxed font-medium">
                        Buying this gift will deduct <span className="text-amber-500 font-bold">LE {selectedAmount}</span> from your wallet balance. You will receive a unique code to share.
                      </p>
                    </div>

                    <button
                      onClick={handleConfirmPurchase}
                      disabled={isPurchasing}
                      className="w-full py-5 bg-secondary text-white font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(240,160,32,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Processing...
                        </>
                      ) : (
                        <>
                          Confirm & Purchase <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <CheckCircle2 className="text-green-500" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Purchase Successful!</h2>
                  <p className="text-gray-400 text-sm mb-10">Your luxury gift is ready to be shared. Copy the code below:</p>

                  <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-8 mb-8 relative group">
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.3em] mb-3">Your Unique Code</p>
                    <p className="text-3xl font-mono font-bold text-white tracking-widest">{purchasedCode}</p>
                    <button
                      onClick={() => copyToClipboard(purchasedCode)}
                      className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAmount(null);
                      setPurchasedCode(null);
                    }}
                    className="w-full py-5 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
