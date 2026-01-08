import Link from "next/link";

interface Transaction {
    id: string;
    created_at: string;
    description: string;
    amount: number;
    type: string;
    status: string;
    proof_url?: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-green-400 bg-green-400/10 border-green-400/20";
            case "pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "rejected": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-gray-400 bg-gray-400/10";
        }
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">TRANSACTION HISTORY</h2>
                {transactions.length > 5 && (
                    <Link href="#" className="text-amber-500 hover:text-amber-400 text-sm font-medium font-[system-ui]">View All</Link>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm font-[system-ui]">
                            <th className="py-4 pl-2 font-medium">Date</th>
                            <th className="py-4 font-medium">Description</th>
                            <th className="py-4 font-medium text-right">Amount</th>
                            <th className="py-4 pr-2 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="font-[system-ui]">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.slice(0, 10).map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 pl-2 text-gray-400 text-sm">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{tx.description}</span>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors capitalize">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className={`py-4 text-right font-medium ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-green-400' : 'text-white'}`}>
                                        {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}LE {Math.abs(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="py-4 pr-2 text-right">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border capitalize ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
