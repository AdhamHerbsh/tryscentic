import Link from "next/link";
import BalanceHero from "@/components/account/wallet/BalanceHero";
import QuickActions from "@/components/account/wallet/QuickActions";
import TransactionHistory from "@/components/account/wallet/TransactionHistory";
import PaymentMethods from "@/components/account/wallet/PaymentMethods";

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2A1215] via-[#1a0b0d] to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Breadcrumbs */}
                <div className="space-y-4">
                    <nav className="flex items-center text-sm text-gray-400 font-[system-ui]">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/pages/user-dashboard" className="hover:text-white transition-colors">Account</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Wallet</span>
                    </nav>

                    <div>
                        <h1 className="text-4xl text-white font-bold tracking-wide uppercase mb-1">My Wallet</h1>
                        <p className="text-gray-400 font-[system-ui]">Manage your balance and payment methods securely.</p>
                    </div>
                </div>

                {/* Balance Hero */}
                <BalanceHero />

                {/* Quick Actions */}
                <QuickActions />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-full">
                        <TransactionHistory />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <PaymentMethods />
                    </div>
                </div>
            </div>
        </div>
    );
}
