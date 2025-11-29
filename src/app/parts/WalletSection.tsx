"use client";

export default function WalletSection() {
  return (
      <section
  className="mb-10 rounded-xl p-6"
  style={{ backgroundColor: 'rgba(255, 255, 223, 0.53)' }}
>  
      <h2 className="text-xl font-semibold mb-2">My Wallet</h2>
      <div className= " flex items-center bg-[#20222D] justify-between p-5 rounded-lg">
        <p className="text-3xl font-bold">$500.00</p>
        <button className="px-4 py-2 bg-[#f0a020] text-black font-semibold rounded">
          Top-up
        </button>
      </div>
    </section>
  );
}
