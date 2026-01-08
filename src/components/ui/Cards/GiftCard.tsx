import Image from "next/image";

interface GiftCardProps {
  amount: number;
  currency: string;
  image: string;
  onPurchase?: (amount: number) => void;
}

export default function GiftCard({ amount, currency, image, onPurchase }: GiftCardProps) {
  return (
    <div className="w-full sm:w-72 bg-transparent rounded-xl flex flex-col items-center">
      {/* صورة البطاقة */}
      <div className="w-full h-48 relative overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={image}
          alt={`${currency} ${amount} Gift Card`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black/10 flex items-end p-4">
          <h3 className="text-2xl font-bold">
            {currency} {amount} Gift Card
          </h3>
        </div>
      </div>
      {/* زر الإرسال */}
      <button
        onClick={() => onPurchase?.(amount)}
        className="w-full mt-4 bg-secondary py-3 rounded-xl font-semibold hover:bg-amber-700 transition shadow-lg text-white"
      >
        Send as a Gift
      </button>
    </div>
  );
}
