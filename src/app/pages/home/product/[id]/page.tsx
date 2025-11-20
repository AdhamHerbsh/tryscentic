import Image from "next/image";
import Header from "../../../../components/layout/Header";
import Footer from "../../../../components/layout/Footer";
import ProductInteractive from "./ProductInteractive";
import { notFound } from "next/navigation";

const products = [
  { 
    id: 1, 
    name: "Velvet Orchid", 
    brand: "Tom Ford", 
    sizes: { "50ml": 150, "100ml": 250 },
    description: "A luxurious fragrance", 
    gallery: {
      "50ml": [
        "/assets/images/p-4.png", // الصورة الرئيسية
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-5.png"
      ],
      "100ml": [
        "/assets/images/p-4.png",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-5.png"
      ]
    }
  },
  { 
    id: 2, 
    name: "Bleu de Chanel", 
    brand: "Chanel", 
    sizes: { "50ml": 125, "100ml": 200 },
    description: "Classic masculine fragrance", 
    gallery: {
      "50ml": [
        "/assets/images/p-2.png",
        "/assets/images/p-4.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-6.png"
      ],
      "100ml": [
        "/assets/images/p-2.png",
        "/assets/images/p-4.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-6.png"
      ]
    }
  },
  { 
    id: 3, 
    name: "Miss Dior", 
    brand: "Dior", 
    sizes: { "50ml": 110, "100ml": 180 },
    description: "Elegant floral scent", 
    gallery: {
      "50ml": [
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-2.png",
        "/assets/images/p-4.png",
        "/assets/images/p-7.png"
      ],
      "100ml": [
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-2.png",
        "/assets/images/p-4.png",
        "/assets/images/p-7.png"
      ]
    }
  },
  { 
    id: 4, 
    name: "Sauvage", 
    brand: "Dior", 
    sizes: { "50ml": 95, "100ml": 170 },
    description: "Fresh and spicy", 
    gallery: {
      "50ml": [
        "/assets/images/laura-chouette-4sKdeIMiFEI-unsplash.jpg",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-8.png"
      ],
      "100ml": [
        "/assets/images/laura-chouette-4sKdeIMiFEI-unsplash.jpg",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-1.png",
        "/assets/images/p-8.png"
      ]
    }
  },
  { 
    id: 5, 
    name: "Acqua di Giò", 
    brand: "Giorgio Armani", 
    sizes: { "50ml": 90, "100ml": 160 },
    description: "Citrus and aquatic notes", 
    gallery: {
      "50ml": [
        "/assets/images/laura-chouette-gbT2KAq1V5c-unsplash.jpg",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-4.png",
        "/assets/images/p-9.png"
      ],
      "100ml": [
        "/assets/images/laura-chouette-gbT2KAq1V5c-unsplash.jpg",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-4.png",
        "/assets/images/p-9.png"
      ]
    }
  },
  { 
    id: 6, 
    name: "Flora", 
    brand: "Gucci", 
    sizes: { "50ml": 130, "100ml": 210 },
    description: "Fruity floral scent", 
    gallery: {
      "50ml": [
        "/assets/images/p-1.png",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-4.png",
        "/assets/images/p-10.png"
      ],
      "100ml": [
        "/assets/images/p-1.png",
        "/assets/images/p-2.png",
        "/assets/images/p-3.png",
        "/assets/images/p-4.png",
        "/assets/images/p-10.png"
      ]
    }
  },
];

interface PageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  const product = products.find(p => p.id === productId);

  if (!product) notFound();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2b0004] text-white pt-32 px-6 md:px-12 flex flex-col md:flex-row gap-10 relative">
        
        {/* Breadcrumb */}
        <div className="absolute top-28 left-6 md:left-12 text-sm text-gray-300 z-10">
          Home / Fragrances / {product.name}
        </div>

        {/* صور المنتج */}
        <div className="flex flex-col gap-4 relative md:w-1/2 lg:w-[45%] xl:w-[40%]">
          <div className="w-full h-[500px] relative">
            <Image
              src={product.gallery["50ml"][0]}
              alt={product.name}
              fill
              className="rounded-none object-cover shadow-lg"
              quality={100}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-2">
            {product.gallery["50ml"].slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className="w-20 h-20 relative cursor-pointer border-2 border-transparent hover:border-white transition-all"
              >
                <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <h2 className="text-xl text-gray-300">{product.brand}</h2>
          <ProductInteractive product={product} />
        </div>
      </div>

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
          <p className="text-gray-300 text-sm mt-1">Absolutely divine! The scent is long-lasting and I get so many compliments.</p>
        </div>
        <div className="pb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">James T.</p>
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">A very sophisticated and elegant scent. Perfect for evening wear. The packaging is also beautiful.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

