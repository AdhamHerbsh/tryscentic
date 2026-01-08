import Link from "next/link";
import BalanceHero from "@/components/account/wallet/BalanceHero";
import QuickActions from "@/components/account/wallet/QuickActions";
import TransactionHistory from "@/components/account/wallet/TransactionHistory";
// import PaymentMethods from "@/components/account/wallet/PaymentMethods";
import { getUserTransactions, getUserBalance } from "@/data-access/user/wallet";

export default async function WalletPage() {
    const transactions = await getUserTransactions();
    const balance = await getUserBalance();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Breadcrumbs */}
                <div className="space-y-4">
                    <nav className="flex items-center text-sm text-gray-400 font-[system-ui]">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/pages/account" className="hover:text-white transition-colors">Account</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">Wallet</span>
                    </nav>

                    <div>
                        <h1 className="text-4xl text-white font-bold tracking-wide uppercase mb-1">My Wallet</h1>
                        <p className="text-gray-400">Manage your balance and payment methods securely.</p>
                    </div>
                </div>

                {/* Balance Hero */}
                <BalanceHero balance={balance} />

                {/* Quick Actions */}
                <QuickActions transactions={transactions} />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3 h-full">
                        <TransactionHistory transactions={transactions} />
                    </div>
                    {/* <div className="lg:col-span-1 h-full">
                        <PaymentMethods />
                    </div> */}
                </div>
            </div>
        </div>
    );
}
