"use client"
import GiftCard from "@/components/ui/Cards/GiftCard";
import HowItWorks from "@/app/(app)/parts/HowItWorks";

// تعريف بيانات بطاقات الهدايا
const giftCards = [
  {
    id: 1,
    amount: 200,
    currency: "EGP",
    image: "/assets/images/golden.png",
  },
  {
    id: 2,
    amount: 500,
    currency: "EGP",
    image: "/assets/images/silver.png",
  },
  {
    id: 3,
    amount: 1000,
    currency: "EGP",
    image: "/assets/images/dark-and-elegant.png",
  },
];

export default function GiftCardPage() {
  return (
    <>
      <div className="min-h-screen bg-[#2b0004] text-white pt-32 px-6 md:px-12 pb-20">
        {/* القسم العلوي */}
        <div className="max-w-4xl mx-auto mb-16">

          <h1 className="text-5xl font-extrabold mb-4">
            Gift the Scent of Luxury
          </h1>
          <p className="text-gray-300 text-lg">
            Choose from our exclusive collection of gift cards and share the joy
            of fine fragrances.
          </p>
        </div>
        {/* بطاقات الهدايا */}
        <div className="flex justify-center gap-6 flex-wrap mb-20">

          {giftCards.map((card) => (
            <GiftCard key={card.id} {...card} />
          ))}
        </div>

        {/* How it works */}
        <HowItWorks />
      </div>
    </>
  );
}
