"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import WalletSection from "@/app/(app)/parts/WalletSection";
import OrderHistorySection from "@/app/(app)/parts/OrderHistorySection";
import PromoCodesSection from "@/app/(app)/parts/PromoCodesSection";

export default function UserDashboardPage() {
  return (
    <>
      {/* محتوى الصفحة */}
      <div className="flex flex-col lg:flex-row pt-20">
        <Sidebar
          type="user"
          user={{
            name: "John Doe",
            email: "john.doe@gmail.com",
            image: "/placeholder-profile.png",
          }}
        />

        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-bold mb-4">My Account</h1>

          <WalletSection />
          <OrderHistorySection />
          <PromoCodesSection />
        </main>
      </div>
    </>
  );
}
