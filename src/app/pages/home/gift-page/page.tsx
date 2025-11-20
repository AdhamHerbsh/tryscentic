import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import GiftCard from "./gift-card";
// import Accordion from "../../components/Accordion";

// تعريف بيانات بطاقات الهدايا
const giftCards = [
  { 
    id: 1, 
    amount: 200, 
    currency: "EGP", 
    image: "/assets/images/gift-gold.jpg" 
  },
  { 
    id: 2, 
    amount: 500, 
    currency: "EGP", 
    image: "/assets/images/gift-silver.jpg" 
  },
  { 
    id: 3, 
    amount: 1000, 
    currency: "EGP", 
    image: "/assets/images/gift-dark.jpg" 
  },
];

// بيانات الأسئلة المتكررة وقسم الاسترداد
const faqData = [
  {
    title: "How to Redeem",
    content: "To redeem your gift card, simply enter the unique code at checkout. The gift card amount will be automatically deducted from your total purchase. Enjoy your new signature scent!",
    initialOpen: true, // لجعله مفتوحًا افتراضيًا مثل الصورة
  },
  {
    title: "Frequently Asked Questions",
    content: "Q: Do gift cards expire? \n A: Our gift cards are valid for 12 months from the date of purchase. \n\n Q: Can I use multiple gift cards? \n A: Yes, you can combine up to three gift cards per order. \n\n Q: Can I return a gift card? \n A: Gift cards are non-refundable.",
    initialOpen: false,
  },
];

export default function GiftCardPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2b0004] text-white pt-32 px-6 md:px-12 pb-20">
        
        {/* القسم العلوي */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold mb-4">Gift the Scent of Luxury</h1>
          <p className="text-gray-300 text-lg">
            Choose from our exclusive collection of gift cards and share the joy of fine fragrances.
          </p>
        </div>

        {/* بطاقات الهدايا */}
        <div className="flex justify-center gap-6 flex-wrap mb-20">
          {giftCards.map(card => (
            <GiftCard key={card.id} {...card} />
          ))}
        </div>

        {/* قسم الأسئلة والاسترداد */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="border-t border-gray-600 mb-4"></div>

          {faqData.map((item, index) => (
            <Accordion 
              key={index} 
              title={item.title} 
              content={item.content}
              initialOpen={item.initialOpen}
            />
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}