"use client";

export default function WalletSection() {
  return (
    <section className="mb-10 p-6 bg-[#20222D]">
      <h2 className="text-xl font-bold mb-2">My Wallet</h2>
      <div className=" flex items-center card-glass card-glass-border justify-between p-5 rounded-lg">
        <p className="text-3xl font-bold">$500.00</p>
        <button className="px-4 py-2 bg-secondary text-black font-bold rounded">
          Top-up
        </button>
      </div>
    </section>
  );
}
