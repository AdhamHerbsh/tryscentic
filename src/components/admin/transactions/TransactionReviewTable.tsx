"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, Eye, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { processTopUpRequest } from "@/data-access/admin/transactions";
import Link from "next/link";

interface Transaction {
    id: string;
    amount: number;
    description: string;
    created_at: string;
    proof_url: string | null;
    user: {
        full_name: string;
        email: string;
    } | null;
}

export default function TransactionReviewTable({ transactions }: { transactions: Transaction[] }) {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [rejectMode, setRejectMode] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleProcess = async (action: "approve" | "reject") => {
        if (!selectedTx) return;
        if (action === "reject" && !rejectReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setProcessing(true);
        try {
            await processTopUpRequest({
                transaction_id: selectedTx.id,
                action,
                admin_note: action === "reject" ? rejectReason : undefined,
            });

            toast.success(action === "approve" ? "Transaction Approved" : "Transaction Rejected");
            setSelectedTx(null);
            setRejectMode(false);
            setRejectReason("");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to process transaction");
        } finally {
            setProcessing(false);
        }
    };

    const openReview = (tx: Transaction) => {
        setSelectedTx(tx);
        setRejectMode(false);
        setRejectReason("");
    };

    return (
        <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Method / Desc</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-200">
                                    No pending top-up requests found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <p className="text-white font-bold">{tx.user?.full_name || "Unknown User"}</p>
                                        <p className="text-sm text-gray-200">{tx.user?.email}</p>
                                    </td>
                                    <td className="p-4 text-emerald-400 font-bold">
                                        LE {tx.amount.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-gray-200" />
                                            {tx.description}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-200">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => openReview(tx)}
                                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ml-auto"
                                        >
                                            <Eye size={16} /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                Review Top-up Request
                                <span className="text-sm px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    Pending
                                </span>
                            </h3>
                            <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Screenshot Column */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Payment Proof</h4>
                                    {selectedTx.proof_url ? (
                                        <div className="relative aspect-9/16 w-full lg:w-3/4 mx-auto bg-black rounded-lg border border-gray-800 overflow-hidden group">
                                            {/* Note: proof_url is a signed URL generated server-side */}
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                                Loading Image...
                                            </div>
                                            <img
                                                src={selectedTx.proof_url}
                                                alt="Payment Proof"
                                                className="w-full h-full object-contain relative z-10"
                                            />
                                            <Link
                                                href={selectedTx.proof_url}
                                                target="_blank"
                                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                                            >
                                                <ExternalLink size={20} />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg text-gray-200">
                                            <FileText size={48} className="mb-2 opacity-50" />
                                            <p>No proof uploaded</p>
                                        </div>
                                    )}
                                </div>

                                {/* Details Column */}
                                <div className="space-y-6">
                                    <div className="space-y-4 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                                        <div>
                                            <span className="block text-xs text-gray-200 uppercase mb-1">User</span>
                                            <p className="text-lg font-bold text-white">{selectedTx.user?.full_name}</p>
                                            <p className="text-sm text-gray-400">{selectedTx.user?.email}</p>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-200 uppercase mb-1">Requested Amount</span>
                                            <p className="text-3xl font-bold text-emerald-400">LE {selectedTx.amount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-200 uppercase mb-1">Note / Description</span>
                                            <p className="text-gray-300">{selectedTx.description}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {!rejectMode ? (
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => setRejectMode(true)}
                                                className="flex-1 py-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <X size={20} /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleProcess("approve")}
                                                disabled={processing}
                                                className="flex-1 py-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                                            >
                                                {processing ? "Processing..." : <><Check size={20} /> Approve </>}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-4">
                                            <label className="block text-white font-bold mb-2">Rejection Reason</label>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Please explain why this request is being rejected (e.g. Invalid screenshot, amount mismatch)..."
                                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none h-32"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setRejectMode(false)}
                                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleProcess("reject")}
                                                    disabled={processing || !rejectReason.trim()}
                                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg"
                                                >
                                                    {processing ? "Rejecting..." : "Confirm Rejection"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
