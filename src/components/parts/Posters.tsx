export default function Posters() {
  return (
    <section className="py-6">
      <div className="min-h-100 p-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="relative overflow-hidden group text-center content-center hover:cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-125"
            style={{
              backgroundImage: `url('/assets/images/posters/all-fragrance-samples.jpg')`,
            }}></div>
          <div className="absolute inset-0 bg-gray-800 opacity-30 z-10"></div>
          <span className="relative z-10 text-5xl">All Fragrance Samples</span>
        </div>
        <div className="relative overflow-hidden group text-center content-center hover:cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-125"
            style={{
              backgroundImage: `url('/assets/images/posters/retail-bottles.jpg')`,
            }}></div>
          <div className="absolute inset-0 bg-gray-800 opacity-30 z-10"></div>
          <span className="relative z-10 text-5xl">Retail Bottles</span>
        </div>
      </div>
    </section>
  );
}
