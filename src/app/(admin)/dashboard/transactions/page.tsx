import { getPendingTransactions } from "@/data-access/admin/transactions";
import TransactionReviewTable from "@/components/admin/transactions/TransactionReviewTable";

export const metadata = {
    title: "Transaction Review | Admin Dashboard",
    description: "Review pending wallet top-up requests",
};

export default async function TransactionsPage() {
    const transactions = await getPendingTransactions();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-wide">Transaction Review</h1>
                <p className="text-gray-400">Review and verify manual wallet top-up requests.</p>
            </div>

            <TransactionReviewTable transactions={transactions} />
        </div>
    );
}
