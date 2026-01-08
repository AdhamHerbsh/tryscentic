"use client";
import { X, FileText, Download } from "lucide-react";

interface StatementModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: any[];
}

export default function StatementModal({ isOpen, onClose, transactions }: StatementModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-serif">Account Statement</h2>
                            <p className="text-sm text-gray-400">View your complete transaction history</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar p-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-xs uppercase text-gray-400 font-bold bg-white/5 sticky top-0">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-right rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-300">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-white font-medium">
                                            {tx.description}
                                        </td>
                                        <td className="p-4 text-gray-400 capitalize">
                                            {tx.type}
                                        </td>
                                        <td className={`p-4 text-right font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.amount > 0 ? '+' : ''}LE {Math.abs(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border capitalize font-medium ${tx.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                tx.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-white/10">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
