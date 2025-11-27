"use client";

import React from "react";
import Image from "next/image";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

export default function UserDashboardPage() {
  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      {/* Page Content */}
      <div className="min-h-screen bg-gradient-to-b from-[#2b0505] to-[#0d0303] text-white flex flex-col lg:flex-row pt-20">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-[#1a1a1a]/40 backdrop-blur-md p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/placeholder-profile.png"
                alt="Profile"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold">John Doe</h3>
              <p className="text-xs text-gray-300">john.doe@gmail.com</p>
            </div>
          </div>

          {/* Sidebar Links */}
          <nav className="space-y-3 flex-1">
            <button className="w-full text-left px-3 py-2 rounded-md bg-[#f0a020] text-black font-semibold">
              Personal Info
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
              Order History
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
              Wallet
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
              Promo Codes
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
              Favorites
            </button>
          </nav>

          <button className="mt-6 bg-[#f0a020] text-black font-semibold py-2 rounded-md">
            Edit Profile
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-bold mb-4">My Account</h1>

          {/* Wallet */}
          <section className="bg-white/10 border border-white/10 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold mb-2">My Wallet</h2>
            <div className="flex items-center justify-between bg-[#111]/60 p-5 rounded-lg">
              <p className="text-3xl font-bold">$500.00</p>
              <button className="px-4 py-2 bg-[#f0a020] text-black font-semibold rounded">
                Top-up
              </button>
            </div>
          </section>

          {/* Order History */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>

            <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="p-3">#12345</td>
                    <td className="p-3">12/12/2023</td>
                    <td className="p-3">
                      <span className="text-green-400">Delivered</span>
                    </td>
                    <td className="p-3">$180.00</td>
                    <td className="p-3 text-[#f0a020] cursor-pointer">
                      View Order
                    </td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-3">#12346</td>
                    <td className="p-3">11/11/2023</td>
                    <td className="p-3">
                      <span className="text-green-400">Delivered</span>
                    </td>
                    <td className="p-3">$250.00</td>
                    <td className="p-3 text-[#f0a020] cursor-pointer">
                      View Order
                    </td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-3">#12347</td>
                    <td className="p-3">10/10/2023</td>
                    <td className="p-3">
                      <span className="text-yellow-400">Processing</span>
                    </td>
                    <td className="p-3">$100.00</td>
                    <td className="p-3 text-[#f0a020] cursor-pointer">
                      View Order
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Promo Codes */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Promo Codes</h2>

            <div className="space-y-4">
              <div className="border border-white/10 bg-white/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">SUMMER20</h3>
                  <p className="text-gray-300 text-sm">
                    20% off all summer fragrances. Expires: 30/08/2024
                  </p>
                </div>
                <button className="text-[#f0a020] font-semibold">
                  COPY CODE
                </button>
              </div>

              <div className="border border-white/10 bg-white/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">FREESHIP</h3>
                  <p className="text-gray-300 text-sm">
                    Free shipping on orders over $100. Expires: 31/12/2024
                  </p>
                </div>
                <button className="text-[#f0a020] font-semibold">
                  COPY CODE
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
